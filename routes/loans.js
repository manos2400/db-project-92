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

    let loans, oldLoans;
    try {
        loans = await connection.query(`
            SELECT *
            FROM loans_view
            WHERE school_id = ? AND date_in IS NULL;
        `, [req.session.school.id]);
        oldLoans = await connection.query(`
            SELECT *
            FROM loans_view
            WHERE school_id = ? AND date_in IS NOT NULL;
        `, [req.session.school.id]);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Database error occurred');
    } finally {
        connection.release();
    }

    // Render the dashboard view and pass session information as locals
    return res.render('loans', {
        session: req.session,
        loans,
        oldLoans
    });
})
router.use('/manage', manageRouter);
manageRouter.post("/return/:book_id/:user_id", async (req, res) => {
    if (!req.session.loggedIn) { return res.redirect('/'); }
    if (req.session.user.type !== 'manager') { 
        return res.status(403).redirect('/dashboard'); 
    }
    // Retrieve session information
    const connection = await pool.getConnection();
    const { book_id, user_id } = req.params;
    try {
        const loans = await connection.query(`
            UPDATE loans
            SET date_in = NOW()
            WHERE school_id = ? AND book_id = ? AND user_id = ?;`, [req.session.school.id, book_id, user_id]);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Database error occurred');
    } finally {
        connection.release();
    }

    // Render the dashboard view and pass session information as locals
    return res.status(200).redirect('/loans');
});
module.exports = router;