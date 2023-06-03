const express = require('express')
const { pool } = require('../../database.js');


const router = express.Router()
router.get("/", async (req, res) => {
    if (!req.session.loggedIn) { return res.redirect('/'); }
    if (req.session.user.type !== 'admin') { 
        return res.status(403).redirect('/dashboard'); 
    }
    // Retrieve session information
    const connection = await pool.getConnection();
    try {
        let query = ''
        if(req.query.year) {
            query = `WHERE YEAR(date_out) = ${req.query.year}`
        } 
        if(req.query.month) {
            query += ` AND MONTH(date_out) = ${req.query.month}`
        }
        const loans = await connection.query(`
        SELECT *
        FROM loans_view
        ${query};
        `);
        await connection.release();

        // Render the dashboard view and pass session information as locals
        return res.render('admin/loans', {
            session: req.session,
            loans
        });
    } catch (error) {
        console.error(error);
        return res.status(500).send('Database error occurred');
    } finally {
        await connection.release();
    }
})
module.exports = router;