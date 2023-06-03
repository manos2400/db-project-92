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

    let loans, oldLoans, delayedLoans;
    try {
        if(req.query.name) {
            loans = await connection.query(`
            SELECT *
            FROM loans_view
            WHERE school_id = ? AND date_in IS NULL AND real_name LIKE ? AND date_due > CURRENT_DATE();
        `, [req.session.school.id, `%${req.query.name}%`]);
        oldLoans = await connection.query(`
            SELECT *
            FROM loans_view
            WHERE school_id = ? AND date_in IS NOT NULL AND real_name LIKE ?;
        `, [req.session.school.id, `%${req.query.name}%`]);
        delayedLoans = await connection.query(`
            SELECT *
            FROM loans_view
            WHERE school_id = ? AND date_in IS NULL AND date_due < CURRENT_DATE() AND real_name LIKE ?;
        `, [req.session.school.id, `%${req.query.name}%`]);
        } else {
            loans = await connection.query(`
            SELECT *
            FROM loans_view
            WHERE school_id = ? AND date_in IS NULL AND date_due > CURRENT_DATE();
        `, [req.session.school.id]);
        oldLoans = await connection.query(`
            SELECT *
            FROM loans_view
            WHERE school_id = ? AND date_in IS NOT NULL;
        `, [req.session.school.id]);
        delayedLoans = await connection.query(`
            SELECT *
            FROM loans_view
            WHERE school_id = ? AND date_in IS NULL AND date_due < CURRENT_DATE();
        `, [req.session.school.id]);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send('Database error occurred');
    } finally {
        await connection.release();
    }

    // Render the dashboard view and pass session information as locals
    return res.render('loans', {
        session: req.session,
        loans,
        oldLoans,
        delayedLoans
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
        await connection.query(`
            UPDATE loans
            SET date_in = CURRENT_DATE()
            WHERE school_id = ? AND book_id = ? AND user_id = ?;`, [req.session.school.id, book_id, user_id]);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Database error occurred');
    } finally {
        connection.release();
    }
    return res.status(200).redirect('/loans');
});
manageRouter.post("/add/:book_id/:user_id", async (req, res) => {
    if (!req.session.loggedIn) { return res.redirect('/'); }
    if (req.session.user.type !== 'manager') { 
        return res.status(403).redirect('/dashboard'); 
    }
    // Retrieve session information
    const connection = await pool.getConnection();
    const { book_id, user_id } = req.params;
    try {
        const loan = await connection.query(`SELECT * FROM loans WHERE school_id = ? AND book_id = ? AND user_id = ? AND date_in IS NULL;`, [req.session.school.id, book_id, user_id]);
        if (loan.length > 0) {
            return res.status(403).send('The user has already borrowed this book.');
        }
        // Check if the user has already reserved the book
        const reservation = await connection.query(`SELECT * FROM reservations WHERE school_id = ? AND book_id = ? AND user_id = ?;`, [req.session.school.id, book_id, user_id]);
        if (reservation.length > 0) {
            return res.status(403).send('The user has an active reservation for this book, you may accept it.');
        }
        // Check if the user has delayed books
        const loans = await connection.query(`SELECT * FROM loans WHERE school_id = ? AND book_id = ? AND user_id = ? AND date_due < CURRENT_DATE();`, [req.session.school.id, book_id, user_id]);
        if (loans.length > 0) {
            return res.status(403).send('The user have not returned a book in time.');
        }

        await connection.query(`
            INSERT INTO loans (school_id, book_id, user_id, date_out, date_due)
            VALUES (?, ?, ?, CURRENT_DATE(), DATE_ADD(CURRENT_DATE(), INTERVAL 14 DAY));`, [req.session.school.id, book_id, user_id]);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Database error occurred');
    } finally {
        await connection.release();
    }
    return res.status(200).send('Loan added successfully');
});
manageRouter.get("/create", async (req, res) => {
    if (!req.session.loggedIn) { return res.redirect('/'); }
    if (req.session.user.type !== 'manager') { 
        return res.status(403).redirect('/dashboard'); 
    }
    // Retrieve session information
    const connection = await pool.getConnection();
    let books, users;
    try {
        books = await connection.query(`SELECT title, id FROM school_books_view WHERE school_id = ? AND available > 0;`, [req.session.school.id]);
        users = await connection.query(`
        SELECT u.real_name AS name, u.id AS id
        FROM school_users su
        INNER JOIN users u ON su.user_id = u.id
        WHERE su.school_id = ?;
        `, [req.session.school.id]);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Database error occurred');
    } finally {
        await connection.release();
    }
    return res.render('newLoan', {
        session: req.session,
        books,
        users
    });
});
module.exports = router;