const express = require('express')
const { pool } = require('../../database.js');


const router = express.Router()

router.get("/category/authors", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }
    try {
        const connection = await pool.getConnection();
        const authors = await connection.query(`
        SELECT DISTINCT authors.name AS name
        FROM books
        INNER JOIN book_authors ON books.id = book_authors.book_id
        INNER JOIN authors ON book_authors.author_id = authors.id
        INNER JOIN book_categories bc on books.id = bc.book_id
        INNER JOIN categories c on bc.category_id = c.id
        WHERE c.name = ?;
        `, [`${req.query.category}`]);
        await connection.release();

        return res.send(authors);
    } catch (error) {
        console.error(error);
        return res.status(503).send("Database is currently unavailable.");
    }   
});

router.get("/category/teacher-loans", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }
    try {
        const connection = await pool.getConnection();
        // Find teachers that have loaned books from a specific category the last year
        const teachers = await connection.query(`
        SELECT u.real_name AS teacher_name
        FROM loans l
        INNER JOIN users u ON l.user_id = u.id
        INNER JOIN books b ON l.book_id = b.id
        INNER JOIN book_categories bc ON b.id = bc.book_id
        INNER JOIN categories c ON bc.category_id = c.id
        WHERE u.type = 'teacher' AND c.name = ? AND l.date_out > DATE_SUB(NOW(), INTERVAL 1 YEAR)
        GROUP BY u.id;
        `, [`${req.query.category}`]);
        await connection.release();

        return res.send(teachers);
    } catch (error) {
        console.error(error);
        return res.status(503).send("Database is currently unavailable.");
    }   
});

router.get("/young-teachers-top", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }
    try {
        const connection = await pool.getConnection();
        const teachers = await connection.query(`
        SELECT u.real_name AS name, CAST(COUNT(*) AS CHAR) AS books_count, CAST(TIMESTAMPDIFF(YEAR, u.date_of_birth, CURDATE()) AS CHAR) AS age
        FROM loans l
        INNER JOIN users u ON l.user_id = u.id
        WHERE u.type = 'teacher' AND TIMESTAMPDIFF(YEAR, u.date_of_birth, CURDATE()) < 40
        GROUP BY u.id
        ORDER BY books_count DESC
        LIMIT 10;
        `);
        await connection.release();
        // Convert BigInt to string
        return res.send(teachers);
    } catch (error) {
        console.error(error);
        return res.status(503).send("Database is currently unavailable.");
    }    
});

router.get("/authors/no-loans", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }
    try {
        const connection = await pool.getConnection();
        const authors = await connection.query(`
        SELECT a.name AS name
        FROM authors a
        LEFT JOIN book_authors ba ON a.id = ba.author_id
        LEFT JOIN books b ON ba.book_id = b.id
        LEFT JOIN loans l ON b.id = l.book_id
        WHERE l.user_id IS NULL
        GROUP BY a.id;
        `);
        await connection.release();

        return res.send(authors);
    } catch (error) {
        console.error(error);
        return res.status(503).send("Database is currently unavailable.");
    }     
});

router.get("/category/top-pairs", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }
    try {
        const connection = await pool.getConnection();
        const pairs = await connection.query(`
        SELECT c1.name AS category1, c2.name AS category2, CAST(COUNT(*) AS CHAR) AS loan_count
        FROM books b
        JOIN book_categories bc1 ON b.id = bc1.book_id
        JOIN book_categories bc2 ON bc1.book_id = bc2.book_id AND bc1.category_id < bc2.category_id
        JOIN categories c1 ON bc1.category_id = c1.id
        JOIN categories c2 ON bc2.category_id = c2.id
        JOIN loans l ON b.id = l.book_id
        GROUP BY c1.name, c2.name
        ORDER BY loan_count DESC
        LIMIT 3;        
        `);
        await connection.release();

        return res.send(pairs);
    } catch (error) {
        console.error(error);
        return res.status(503).send("Database is currently unavailable.");
    }    
});

router.get("/authors/five-books-less", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }
    try {
        const connection = await pool.getConnection();
        const authors = await connection.query(`
        SELECT a.id, a.name
        FROM authors a
        JOIN (
            SELECT ba.author_id, COUNT(ba.book_id) AS num_books
            FROM book_authors ba
            GROUP BY ba.author_id
            HAVING num_books < (
                SELECT COUNT(ba2.book_id)
                FROM book_authors ba2
                GROUP BY ba2.author_id
                ORDER BY COUNT(ba2.book_id) DESC
                LIMIT 1
            ) - 5
        ) subq ON a.id = subq.author_id;        
        `);
        await connection.release();

        return res.send(authors);
    } catch (error) {
        console.error(error);
        return res.status(503).send("Database is currently unavailable.");
    }  
});

router.get("/managers/equal-loans", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }
    try {
        const connection = await pool.getConnection();
        const managers = await connection.query(`
        SELECT s1.manager_name AS manager1, s2.manager_name AS manager2, CAST(s1.total_loans AS CHAR) AS total_loans
        FROM school_loan_view s1
        JOIN school_loan_view s2
        WHERE s1.total_loans = s2.total_loans AND s1.school_name != s2.school_name AND s1.total_loans > 20
        `);
        await connection.release();

        return res.send(managers);
    } catch (error) {
        console.error(error);
        return res.status(503).send("Database is currently unavailable.");
    } 
});

module.exports = router;