const express = require('express')
const pool = require('../database.js');

const router = express.Router()
const manageRouter = express.Router()
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
            SELECT books.title, r.date, r.date_due, r.user_id, r.book_id
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
router.use('/manage', manageRouter);
manageRouter.post("/accept/:book_id/:user_id", async (req, res) => {
    if (!req.session.loggedIn) { return res.redirect('/'); }
    if (req.session.user.type !== 'manager') { 
        return res.status(403).redirect('/dashboard'); 
    }
    // Retrieve session information
    const connection = await pool.getConnection();
    const { book_id, user_id } = req.params;
    try {
        const reservations = await connection.query(`
            DELETE FROM reservations WHERE school_id = ? AND book_id = ? AND user_id = ?;
            `, [req.session.school.id, book_id, user_id]);
        const loans = await connection.query(`
            INSERT INTO loans (school_id, book_id, user_id, date_out, date_due)
            VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY));`, [req.session.school.id, book_id, user_id]);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Database error occurred');
    } finally {
        connection.release();
    }

    // Render the dashboard view and pass session information as locals
    return res.status(200).redirect('/reservations');
});
manageRouter.post("/deny/:book_id/:user_id", async (req, res) => {
    if (!req.session.loggedIn) { return res.redirect('/'); }
    if (req.session.user.type !== 'manager') { 
        return res.status(403).redirect('/dashboard'); 
    }
    // Retrieve session information
    const connection = await pool.getConnection();
    const { book_id, user_id } = req.params;
    try {
        const reservations = await connection.query(`
            DELETE FROM reservations WHERE school_id = ? AND book_id = ? AND user_id = ?;
            `, [req.session.school.id, book_id, user_id]);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Database error occurred');
    } finally {
        connection.release();
    }

    // Render the dashboard view and pass session information as locals
    return res.status(200).redirect('/reservations');
});
module.exports = router;