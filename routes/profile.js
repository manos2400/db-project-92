const express = require('express')
const pool = require('../database.js');
const router = express.Router()

router.get("/", async (req, res) => {
    try {
        if (!req.session.loggedIn) {
            return res.redirect('/');
        }

        const connection = await pool.getConnection();
        const [[school]] = await connection.query(`SELECT * FROM schools WHERE id = ?;`, [req.session.school.id]);
        if (!school) {
            throw new Error('School not found');
        }

        const [[user]] = await connection.query(`SELECT * FROM users WHERE id = ?;`, [req.session.user.id]);
        if (!user) {
            throw new Error('User not found');
        }

        await connection.release();

        return res.render('profile', {
            session: req.session,
            user,
            school
        });
    } catch (error) {
        console.error(error);
        return res.status(503).send('Database is currently unavailable.');
    }
});

module.exports = router;