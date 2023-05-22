const express = require('express')
const pool = require('../database.js');

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        if (!req.session.loggedIn) {
            return res.redirect('/');
        }
        const connection = await pool.getConnection();
        const books = await connection.query(`SELECT id, picture FROM school_books_view WHERE school_id = ?;`, [req.session.school.id]);
        if (!books) {
            throw new Error('No books found');
        }
        await connection.release();

        return res.render('books', {
            session: req.session,
            books
        });
    } catch (error) {
        console.error(error);
        return res.status(503).send('Database is currently unavailable.');
    }
})
router.get("/:id", async (req, res) => {
    try {
        if (!req.session.loggedIn) {
            return res.redirect('/');
        }
        const connection = await pool.getConnection();
        const book = await connection.query(`SELECT * FROM school_books_view WHERE id = ? AND school_id = ?;`, [req.params.id, req.session.school.id]);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        await connection.release();

        return res.send(book[0]);
    } catch (error) {
        console.error(error);
        return res.status(503).send('Database is currently unavailable.');
    }
});
module.exports = router;