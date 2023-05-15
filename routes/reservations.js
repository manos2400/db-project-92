const express = require('express')
const pool = require('../database.js');

const router = express.Router()

router.get("/", async (req, res) => {
    if (!req.session.loggedIn) { return res.redirect('/'); }
    if (req.session.user.type !== 'manager') { 
        return res.status(403).redirect('/dashboard'); 
    }
    // Retrieve session information
    const connection = await pool.getConnection();

    let reservations;
    try {
        reservations = await connection.query(`
            SELECT books.title, r.date, r.date_due
            FROM books
            INNER JOIN reservations r ON books.id = r.book_id
            WHERE r.school_id = ?;
            `, [req.session.school.id]);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Database error occurred');
    } finally {
        connection.release();
    }

    // Render the dashboard view and pass session information as locals
    return res.render('reservations', {
        session: req.session,
        reservations
    });
})

module.exports = router;