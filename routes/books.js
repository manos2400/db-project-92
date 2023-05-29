const express = require("express");
const pool = require("../database.js");
const multer = require("multer");
const router = express.Router();
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/book_covers/images/'); // Specify the directory where the uploaded files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`); // Use the original filename
  }
});

const upload = multer({ storage });

router.get("/", async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      return res.redirect("/");
    }
    const connection = await pool.getConnection();
    let books;
    if(req.query.title) {
      books = await connection.query(
        `SELECT id, picture FROM school_books_view WHERE school_id = ? AND title LIKE ?;`,
        [req.session.school.id, `%${req.query.title}%`]
      );
    } else if(req.query.author) {
      books = await connection.query(
        `SELECT id, picture FROM school_books_view WHERE school_id = ? AND authors LIKE ?;`,
        [req.session.school.id, `%${req.query.author}%`]
      );
    } else if(req.query.category) {
      books = await connection.query(
        `SELECT id, picture FROM school_books_view WHERE school_id = ? AND categories LIKE ?;`,
        [req.session.school.id, `%${req.query.category}%`]
      );
    } else {
      books = await connection.query(
        `SELECT id, picture FROM school_books_view WHERE school_id = ?;`,
        [req.session.school.id]
      );
    }


    if (!books) {
      throw new Error("No books found");
    }
    const categories = await connection.query(`SELECT name FROM categories;`);
    await connection.release();

    return res.render("books", {
      session: req.session,
      books,
      categories
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
        // Check if the user has delayed books
        const loans = await connection.query(`SELECT * FROM loans WHERE school_id = ? AND book_id = ? AND user_id = ? AND date_due < NOW();`, [req.session.school.id, book_id, req.session.user.id]);
        if (loans.length > 0) {
            return res.status(403).send('You have not returned a book in time.');
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
router.post("/add", async (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("/");
  }
  if (req.session.user.type !== "manager") {
    return res.status(403).send("You are not allowed to add books.");
  }
  const { title, publisher, isbn, pages, description, language, keywords, authors, categories, quantity } = req.body;
  let { picture } = req.body;
  const connection = await pool.getConnection();
  try {
    // Check if the book already exists in another school
    const book = await connection.query(
      `SELECT * FROM books WHERE title = ?;`,
      [title]
    );
    if (book.length > 0) {
    await connection.query(`INSERT INTO school_books (school_id, book_id, quantity, available) VALUES (?, ?, ?, ?);`, [req.session.school.id, book[0].id, quantity, quantity]); // Assuming all new copies are available
    return res.status(200).send("Book added");
    }
    const fileExtension = picture.split('.').pop();
    const oldFilePath = __dirname + '/../public/book_covers/images/' + picture;
    const newFilePath = __dirname + '/../public/book_covers/images/' + title + '.' + fileExtension;
    fs.rename(oldFilePath, newFilePath, (err) => {
      if (err) {
        console.error('Error renaming file:', err);
      } else {
        console.log('File renamed successfully.');
      }
    });
    picture = title + '.' + fileExtension;
    // Add the book to the database if it doesn't exist 
    const row = await connection.query(
      `INSERT INTO books (title, publisher, isbn, pages, description, picture, language, keywords) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        title,
        publisher,
        isbn,
        pages,
        description,
        `http://localhost:3000/static/images/${picture}`,
        language,
        keywords
      ]
    );
    console.log(row);
    await connection.query(`INSERT INTO school_books (school_id, book_id, quantity, available) VALUES (?, ?, ?, ?);`, [req.session.school.id, row.insertId, quantity, quantity]); // Assuming all new copies are available
    // Add the authors to the database
    const authorsArray = authors.split(",");
    for (let i = 0; i < authorsArray.length; i++) {
      const author = authorsArray[i];
      // Insert the author if it doesn't exist
      await connection.query(`INSERT IGNORE INTO authors (name) VALUES (?);`, [author]);
      // Get the author id either way
      const result = await connection.query(`SELECT * FROM authors WHERE name = ?;`, [author]);
      // Insert the book-author relation
      await connection.query(`INSERT INTO book_authors (book_id, author_id) VALUES (?, ?);`, [row.insertId, result[0].id]);
    }
    // Add the categories to the database
    const categoriesArray = categories.split(",");
    for (let i = 0; i < categoriesArray.length; i++) {
      const category = categoriesArray[i];
      // Insert the category if it doesn't exist
      await connection.query(`INSERT IGNORE INTO categories (name) VALUES (?);`, [category]);
      // Get the category id either way
      const result = await connection.query(`SELECT * FROM categories WHERE name = ?;`, [category]);
      // Insert the book-category relation
      await connection.query(`INSERT INTO book_categories (book_id, category_id) VALUES (?, ?);`, [row.insertId, result[0].id]);
    }
    return res.status(200).send("Book added");
  } catch (error) {
    console.error(error);
    return res.status(503).send("Database is currently unavailable.");
  }

});
router.post("/add/picture", upload.single('file'), async (req, res) => {
  if (!req.session.loggedIn) {
    return res.status(403).send("You are not logged in.");
  }
  if (req.session.user.type !== "manager") {
    return res.status(403).send("You are not allowed to do this.");
  }
  return res.status(200).send("File uploaded.");
});
module.exports = router;
