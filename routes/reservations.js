const express = require('express')
const { pool } = require('../database.js');
const moment = require('moment-timezone');

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
        if (req.query.name) {
            reservations = await connection.query(`SELECT * FROM reservations_view WHERE school_id = ? AND real_name LIKE ?;`, [req.session.school.id, `%${req.query.name}%`]);
        } else {
            reservations = await connection.query(`SELECT * FROM reservations_view WHERE school_id = ?;`, [req.session.school.id]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Database error occurred');
    } finally {
        await connection.release();
    }
    reservations.forEach(reservation => {
        reservation.date_due = moment(reservation.date_due).tz('Europe/Athens').format('DD-MM-YYYY');
        reservation.date = moment(reservation.date).tz('Europe/Athens').format('DD-MM-YYYY');
    });
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
        await connection.query(`
            DELETE FROM reservations WHERE school_id = ? AND book_id = ? AND user_id = ?;
            `, [req.session.school.id, book_id, user_id]);
        await connection.query(`
            INSERT INTO loans (school_id, book_id, user_id, date_out, date_due)
            VALUES (?, ?, ?, CURRENT_DATE(), DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY));`, [req.session.school.id, book_id, user_id]);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Database error occurred');
    } finally {
        await connection.release();
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
        await connection.query(`
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
manageRouter.post("/cancel/:book_id", async (req, res) => {
    if (!req.session.loggedIn) { return res.redirect('/'); }
    // Retrieve session information
    const connection = await pool.getConnection();
    const { book_id } = req.params;
    try {
        await connection.query(`
            DELETE FROM reservations WHERE school_id = ? AND book_id = ? AND user_id = ?;
            `, [req.session.school.id, book_id, req.session.user.id]);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Database error occurred');
    } finally {
        connection.release();
    }

    // Render the dashboard view and pass session information as locals
    return res.status(200).redirect('/dashboard');
});
module.exports = router;