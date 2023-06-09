const express = require('express')
const { pool } = require('../database.js');

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        if (!req.session.loggedIn) {
            return res.redirect('/');
        }

        const connection = await pool.getConnection();
        const school = await connection.query(`
            SELECT s.*, u.real_name AS manager_name
            FROM schools s
            JOIN school_users su ON s.id = su.school_id
            JOIN users u ON u.id = su.user_id
            WHERE u.type = 'manager' AND s.id = ?; 
        `, [req.session.school.id]);
        if (!school[0]) {
            throw new Error('School not found');
        }

        const user = await connection.query(`SELECT * FROM users WHERE id = ?;`, [req.session.user.id]);
        if (!user[0]) {
            throw new Error('User not found');
        }
        await connection.release();

        return res.render('profile', {
            session: req.session,
            user: user[0],
            school: school[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(503).send('Database is currently unavailable.');
    }
});

module.exports = router;