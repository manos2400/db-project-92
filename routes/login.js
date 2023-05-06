const express = require('express')
const pool = require('../database.js');

const router = express.Router()

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send('Invalid credentials');
    }

    // Connect to MariaDB
    const connection = await pool.getConnection();

    try {
        // Check credentials
        const rows = await connection.query(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password]);
        if (rows.length === 1) {
            // Successful login
            // Cache important user information in session
            req.session.loggedIn = true;
            req.session.user = {
                type: rows[0].type,
                id: rows[0].id
            }
            // Get school information
            const schools = await connection.query(`SELECT * FROM school_users WHERE user_id = ?;`, [req.session.user.id]);
            req.session.school = {
                id: schools[0].school_id
            };
            return res.redirect('/dashboard');
        } else {
            // Invalid credentials
            return res.send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        return res.send('Error occurred during login');
    } finally {
        connection.release();
    }
})

module.exports = router;