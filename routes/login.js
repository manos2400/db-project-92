const express = require('express')
const pool = require('../database.js');

const router = express.Router()

router.post("/", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(401).send('Invalid credentials');
    }

    // Connect to MariaDB
    const connection = await pool.getConnection();

    try {
        // Check credentials
        const rows = await connection.query(`
            SELECT  su.school_id AS school_id, u.id AS user_id, u.type AS user_type
            FROM users u
            INNER JOIN school_users su ON u.id = su.user_id
            INNER JOIN schools s ON su.school_id = s.id
            WHERE u.username = ? AND u.password = ?
        `, [username, password]);
        if (rows.length === 1) {
            // Successful login
            // Cache important user information in session
            req.session.loggedIn = true;
            req.session.user = {
                type: rows[0].user_type,
                id: rows[0].user_id
            }
            req.session.school = {
                id: rows[0].school_id
            };
            return res.status(202).send("Success");
        } else {
            // Invalid credentials
            return res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    } finally {
        connection.release();
    }
})

module.exports = router;