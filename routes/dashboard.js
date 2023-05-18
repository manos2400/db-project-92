const express = require('express')
const pool = require('../database.js');

const router = express.Router()

router.get("/", async (req, res) => {
    if (!req.session.loggedIn) { return res.redirect('/'); }
    // Retrieve session information
    const connection = await pool.getConnection();

    let loans, reservations;
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
            const rows = await connection.query('CALL GetUserStats(?, @reservationCount, @loanCount, @activeLoanCount)', [req.session.user.id]);
            const result = await connection.query('SELECT @reservationCount AS reservationCount, @loanCount AS loanCount, @activeLoanCount AS activeLoanCount');
            var { reservationCount, loanCount, activeLoanCount } = result[0];
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
        reservationCount,
        loanCount,
        activeLoanCount
    });
})

module.exports = router;