const express = require('express')
const mariadb = require('mariadb');

const router=express.Router()

router.get("/", async (req,res)=>{
    if (req.session.loggedIn) {
        try {
        // Retrieve school_id from session information
        const  schoolID = req.session.school_id;
    
        // Fetch books from school_books table based on school_id

        const connection = await mariadb.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: 'libraries'
        });

        try {
            // Check credentials
            const rows = await connection.query(`SELECT * FROM school_books WHERE school_id = ?`, [schoolID]);
            req.session.books = []
            for(var i = 0; i < rows.length; i++){
                const books = await connection.query(`SELECT * FROM books WHERE id = ?`, [rows[i].book_id]);
                req.session.books.push(books[0]);
            }
        } catch (error) {
            console.error(error);
            res.send('Error occurred during login');
        } finally {
            connection.end();
        }
    
        // Render the books view and pass the fetched books as locals
        res.render('books', { books: req.session.books });
        } catch (error) {
        console.error(error);
        // Render an error view or send an error response
        res.status(500).send('Internal Server Error');
        }
    } else {
        res.redirect('/');
    }
})

module.exports=router;