const express = require("express");
const pool = require("../database.js");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      return res.redirect("/");
    }
    const connection = await pool.getConnection();
    const books = await connection.query(
      `SELECT id, picture FROM school_books_view WHERE school_id = ?;`,
      [req.session.school.id]
    );
    if (!books) {
      throw new Error("No books found");
    }
    await connection.release();

    return res.render("books", {
      session: req.session,
      books,
    });
  } catch (error) {
    console.error(error);
    return res.status(503).send("Database is currently unavailable.");
  }
});
router.get("/:id", async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      return res.redirect("/");
    }
    const connection = await pool.getConnection();
    const book = await connection.query(
      `SELECT * FROM school_books_view WHERE id = ? AND school_id = ?;`,
      [req.params.id, req.session.school.id]
    );
    if (!book) {
      return res.status(404).send("Book not found");
    }
    await connection.release();

    return res.send(book[0]);
  } catch (error) {
    console.error(error);
    return res.status(503).send("Database is currently unavailable.");
  }
});
router.post("/reserve/:book_id", async (req, res) => {
    if (!req.session.loggedIn) { return res.redirect('/'); }
    // Retrieve session information
    const connection = await pool.getConnection();
    const { book_id } = req.params;
    try {
        // Check if the user has already loaned the book
        const loan = await connection.query(`SELECT * FROM loans WHERE school_id = ? AND book_id = ? AND user_id = ? AND date_in IS NULL;`, [req.session.school.id, book_id, req.session.user.id]);
        if (loan.length > 0) {
            return res.status(403).send('You have already loaned this book.');
        }
        // Check if the user has already reserved the book
        const reservation = await connection.query(`SELECT * FROM reservations WHERE school_id = ? AND book_id = ? AND user_id = ?;`, [req.session.school.id, book_id, req.session.user.id]);
        if (reservation.length > 0) {
            return res.status(403).send('You have already reserved this book.');
        }
        // Check if the user has reached the maximum number of reservations
        const reservations = await connection.query(`SELECT * FROM reservations WHERE school_id = ? AND user_id = ? AND WEEK(date) = WEEK(NOW());`, [req.session.school.id, req.session.user.id]);
        switch (req.session.user.type) {
            case 'student':
                if (reservations.length >= 2) {
                    return res.status(403).send('You have reached the maximum number of reservations for this week');
                }
                break;
            case 'teacher':
                if (reservations.length >= 1) {
                    return res.status(403).send('You have reached the maximum number of reservations for this week');
                }
                break;            
        }
        await connection.query(`INSERT INTO reservations (school_id, book_id, user_id, date, date_due) VALUES (?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 7 DAY));`, [req.session.school.id, book_id, req.session.user.id]);
    } catch (error) {
        console.error(error);
        return res.status(500).send('Database error occurred');
    } finally {
        await connection.release();
    }
    return res.status(200).send('Book reserved');
});
module.exports = router;
