const express = require('express')
const { pool } = require('../database.js');
const moment = require('moment-timezone');

const router = express.Router()

router.get("/average", async (req, res) => {
    if (!req.session.loggedIn) {
      return res.redirect("/");
    }
    try {
        const connection = await pool.getConnection();
        let review;
        if(req.query.user) {
            review = await connection.query(`
            SELECT ROUND(AVG(reviews.rating), 1) AS average_rating
            FROM users
            JOIN reviews ON users.id = reviews.user_id
            WHERE users.id = ?
            `, [req.query.user]);

        } else if(req.query.category){
            review = await connection.query(`
            SELECT ROUND(AVG(r.rating), 1) AS average_rating
            FROM books b
            JOIN book_categories bc ON b.id = bc.book_id
            JOIN categories c on bc.category_id = c.id
            JOIN reviews r ON b.id = r.book_id
            WHERE c.name = ?
            `, [req.query.category]);
        }
        await connection.release();
        return res.status(200).send(review[0]);
    } catch (error) {
      console.error(error);
      return res.status(503).send("Database is currently unavailable.");
    }
  });

router.get("/:id", async (req, res) => {
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
        reviews.forEach(review => {
          review.date = moment(review.date).tz('Europe/Athens').format('YYYY-MM-DD');;
        })
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