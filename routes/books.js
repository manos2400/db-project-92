const express = require('express')
const pool = require('../database.js');

const router = express.Router()

router.get("/", async (req, res) => {
    return res.status(501).send('Not implemented');
})
router.get("/:id", async (req, res) => {
    try {
        if (!req.session.loggedIn) {
            return res.redirect('/');
        }

        const connection = await pool.getConnection();
        const book = await connection.query(`SELECT * FROM books WHERE id = ?;`, [req.params.id]);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        await connection.release();

        return res.render('profile', {
            session: req.session,
            book: book[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(503).send('Database is currently unavailable.');
    }
});
module.exports = router;