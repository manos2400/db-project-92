const express = require('express')
const pool = require('../database.js');

const router = express.Router()

router.get("/", async (req, res) => {
    if (!req.session.loggedIn) { return res.redirect('/'); }
    // Retrieve session information
    const connection = await pool.getConnection();

    let loans, reservations;
    let activeLoansCount = 0;
    try {
        loans = await connection.query(`
            SELECT books.title, loans.date_out, loans.date_due, loans.date_in
            FROM books
            INNER JOIN loans ON books.id = loans.book_id
            WHERE loans.user_id = ?;
            `, [req.session.user.id]);
        reservations = await connection.query(`
            SELECT books.title, r.date, r.date_due
            FROM books
            INNER JOIN reservations r ON books.id = r.book_id
            WHERE r.user_id = ?;
            `, [req.session.user.id]);
        const rows = await connection.query(`
            SELECT * FROM loans WHERE user_id = ? AND date_in IS NULL;`, [req.session.user.id]);
        activeLoansCount = rows.length;
    } catch (error) {
        console.error(error);
        return res.send('Database error occurred');
    } finally {
        connection.release();
    }

    // Render the dashboard view and pass session information as locals
    return res.render('dashboard', {
        session: req.session,
        loans,
        reservations,
        activeLoansCount
    });
})

module.exports = router;