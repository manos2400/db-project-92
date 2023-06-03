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
    const row = await connection.query(`
    SELECT ROUND(AVG(rating), 1) AS rating
    FROM reviews
    WHERE book_id = ?;
    `, [req.params.id]);
    await connection.release();
    book[0].rating = row[0].rating;
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
            return res.status(403).send('You have already borrowed this book.');
        }
        // Check if the user has already reserved the book
        const reservation = await connection.query(`SELECT * FROM reservations WHERE school_id = ? AND book_id = ? AND user_id = ?;`, [req.session.school.id, book_id, req.session.user.id]);
        if (reservation.length > 0) {
            return res.status(403).send('You have already reserved this book.');
        }
        // Check if the user has delayed books
        const loans = await connection.query(`SELECT * FROM loans WHERE school_id = ? AND book_id = ? AND user_id = ? AND date_due < CURRENT_DATE();`, [req.session.school.id, book_id, req.session.user.id]);
        if (loans.length > 0) {
            return res.status(403).send('You have not returned a book in time.');
        }
        // Check if the user has reached the maximum number of reservations
        const reservations = await connection.query(`SELECT * FROM reservations WHERE school_id = ? AND user_id = ? AND WEEK(date) = WEEK(CURRENT_DATE());`, [req.session.school.id, req.session.user.id]);
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
        await connection.query(`INSERT INTO reservations (school_id, book_id, user_id, date, date_due) VALUES (?, ?, ?, CURRENT_DATE(), DATE_ADD(CURRENT_DATE(), INTERVAL 7 DAY));`, [req.session.school.id, book_id, req.session.user.id]);
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
  if (quantity < 0) {
    return res.status(400).send("Quantity cannot be negative.");
  }
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
    picture = title.split(" ").join('_') + '.' + fileExtension;
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
router.post("/edit/:id", async (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("/");
  }
  if (req.session.user.type !== "manager") {
    return res.status(403).send("You are not allowed to add books.");
  }
  const { id, title, publisher, isbn, pages, description, language, keywords, authors, categories, quantity } = req.body;
  let { picture } = req.body;
  const connection = await pool.getConnection();
  if (quantity < 0) {
    return res.status(400).send("Quantity cannot be negative.");
  }
  try {
    // Check if the quantity doesnt match with currently lent books
    const rows = await connection.query(`SELECT * FROM school_books WHERE school_id = ? AND book_id = ? AND quantity - available > ?`, [req.session.school.id, id, quantity]);
    if (rows.length > 0) {
      return res.status(400).send("Quantity cannot be less than the number of currently lent books.");
    }
    // Check if the quantity is zero and delete the book from this school
    if (quantity == 0) {
      await connection.query(`DELETE FROM school_books WHERE school_id = ? AND book_id = ?;`, [req.session.school.id, id]);
      return res.status(200).send("Book removed from this library.");
    }
    if(!picture.startsWith("http://localhost:3000/static/images/")) {
    const fileExtension = picture.split('.').pop();
    const oldFilePath = __dirname + '/../public/book_covers/images/' + picture;
    const newFilePath = __dirname + '/../public/book_covers/images/' + title.split(" ").join('_') + '.' + fileExtension;
    fs.rename(oldFilePath, newFilePath, (err) => {
      if (err) console.error('Error renaming file:', err);
    });
    picture = title.split(" ").join('_') + '.' + fileExtension;
    
    // Add the book to the database if it doesn't exist 
    await connection.query(
      `UPDATE books 
       SET title = ?, publisher= ?, isbn= ?, pages= ?, description= ?, picture= ?, language= ?, keywords= ? 
      WHERE id = ?;`,
      [
        title,
        publisher,
        isbn,
        pages,
        description,
        `http://localhost:3000/static/images/${picture}`,
        language,
        keywords,
        id
      ]
    );
    } else {
      await connection.query(
        `UPDATE books 
         SET title = ?, publisher= ?, isbn= ?, pages= ?, description= ?, language= ?, keywords= ? 
        WHERE id = ?;`,
        [
          title,
          publisher,
          isbn,
          pages,
          description,
          language,
          keywords,
          id
        ]
      );
    }
    await connection.query(`UPDATE school_books SET available = available - quantity + ?, quantity = ? WHERE school_id = ? AND book_id = ?`, [quantity, quantity ,req.session.school.id, id]);
    // Remove all authors from the book
    await connection.query(`DELETE FROM book_authors WHERE book_id = ?;`, [id]);
    // Add the authors to the database
    const authorsArray = authors.split(",");
    for (let i = 0; i < authorsArray.length; i++) {
      const author = authorsArray[i];
      // Insert the author if it doesn't exist
      await connection.query(`INSERT IGNORE INTO authors (name) VALUES (?);`, [author]);
      // Get the author id either way
      const result = await connection.query(`SELECT * FROM authors WHERE name = ?;`, [author]);
      // Insert the book-author relation
      await connection.query(`INSERT INTO book_authors (book_id, author_id) VALUES (?, ?);`, [id, result[0].id]);
    }
    // Remove all categories from the book
    await connection.query(`DELETE FROM book_categories WHERE book_id = ?;`, [id]);
    // Add the categories to the database
    const categoriesArray = categories.split(",");
    for (let i = 0; i < categoriesArray.length; i++) {
      const category = categoriesArray[i];
      // Insert the category if it doesn't exist
      await connection.query(`INSERT IGNORE INTO categories (name) VALUES (?);`, [category]);
      // Get the category id either way
      const result = await connection.query(`SELECT * FROM categories WHERE name = ?;`, [category]);
      // Insert the book-category relation
      await connection.query(`INSERT INTO book_categories (book_id, category_id) VALUES (?, ?);`, [id, result[0].id]);
    }
    return res.status(200).send("The book has been edited successfully.");
  } catch (error) {
    console.error(error);
    return res.status(503).send("Database is currently unavailable.");
  }

});
router.post("/review/:id", async (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("/");
  }
  const { id } = req.params;
  const { rating, review } = req.body;
  const connection = await pool.getConnection();
  try {
    // Check if the user has already reviewed this book
    const rows = await connection.query(`SELECT * FROM reviews WHERE user_id = ? AND book_id = ?;`, [req.session.user.id, id]);
    if (rows.length > 0) {
      await connection.query(`UPDATE reviews SET date= CURRENT_DATE() ,rating = ? , review = ? WHERE user_id = ? AND book_id = ?;`, [rating, review, req.session.user.id, id]);
      return res.status(200).send("Review updated.");
    }
    await connection.query(`INSERT INTO reviews (user_id, book_id, date ,rating, review) VALUES (?, ?, CURRENT_DATE(), ?, ?);`, [req.session.user.id, id, rating, review]);
    return res.status(200).send("Review added.");
  } catch (error) {
    console.error(error);
    return res.status(503).send("Database is currently unavailable.");
  }
});
router.get("/reviews/:id", async (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("/");
  }
  const { id } = req.params;
  const connection = await pool.getConnection();
  try {
      const book = await connection.query(`SELECT title FROM books WHERE id = ?;`, [id]);
      const reviews = await connection.query(`
          SELECT reviews.*, users.real_name AS user_name
          FROM reviews 
          INNER JOIN users ON reviews.user_id = users.id
          WHERE reviews.book_id = ?
          ORDER BY reviews.date DESC;
      `, [id]);
      return res.status(200).render("reviews", {
        session: req.session,
        title: book[0].title,
        reviews
      });
  } catch (error) {
    console.error(error);
    return res.status(503).send("Database is currently unavailable.");
  }
});
module.exports = router;
