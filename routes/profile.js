const express = require('express')
const pool = require('../database.js');

const router = express.Router()

router.get("/", async (req, res) => {
    if (!req.session.loggedIn) { return res.redirect('/'); }
    // Retrieve session information
    const connection = await pool.getConnection();
    let school, user;
    try {
        const rows = await connection.query(`SELECT * FROM schools WHERE id = ?;`, [req.session.school.id]);
        if (rows.length !== 0) {
            school = rows[0];
        } else {
            throw new Error('School not found');
        }

        const users = await connection.query(`SELECT * FROM users WHERE id = ?;`, [req.session.user.id]);
        if (rows.length !== 0) {
            user = users[0];
        } else {
            throw new Error('School not found');
        }

    } catch (error) {
        console.error(error);
        return res.status(500).send('Database error occurred');
    } finally {
        connection.release();
    }

    // Render the profile view and pass session information as locals
    return res.render('profile', {
        session: req.session,
        user,
        school
    });
})

module.exports = router;