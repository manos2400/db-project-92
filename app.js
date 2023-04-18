const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mariadb = require('mariadb');

const app = express();
app.set('view engine', 'ejs');
// Use sessions for tracking login state
app.use(session({
    secret: '7}zH_kWJ(LeQD&~?ciT`oi}Nz_Wkog',
    resave: true,
    saveUninitialized: false
}));

// Parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Serve login page
app.get('/', (req, res) => {
    res.render('login');
});

// Process login form
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send('Invalid credentials');
    }

    // Connect to MariaDB
    const connection = await mariadb.createConnection({
        host: '192.168.0.89',
        user: 'webapp',
        password: 'dbproject2023',
        database: 'libraries'
    });

    try {
        // Check credentials
        const rows = await connection.query(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password]);
        if (rows.length === 1) {
            // Successful login
            req.session.loggedIn = true;
            req.session.username = username;
            req.session.real_name = rows[0].real_name;
            req.session.permission_level = rows[0].permission_level;
            req.session.school_id = rows[0].school_id;
            res.redirect('/dashboard');
        } else {
            // Invalid credentials
            res.send('Invalid credentials');
        }
    } catch (error) {
        console.error(error);
        res.send('Error occurred during login');
    } finally {
        connection.end();
    }
});

// Serve dashboard page
app.get('/dashboard', (req, res) => {
    if (req.session.loggedIn) {
        // Retrieve session information
        const username = req.session.username;
        const realName = req.session.real_name;
        const permissionLevel = req.session.permission_level;
        const schoolId = req.session.school_id;

        // Render the dashboard view and pass session information as locals
        res.render('dashboard', {
        username,
        realName,
        permissionLevel,
        schoolId
        });
    } else {
        res.redirect('/');
    }
  });

// Display the books page
app.get('/books', async (req, res) => {
    if (req.session.loggedIn) {
        try {
        // Retrieve school_id from session information
        const  schoolID = req.session.school_id;
    
        // Fetch books from school_books table based on school_id

        const connection = await mariadb.createConnection({
            host: '192.168.0.89',
            user: 'webapp',
            password: 'dbproject2023',
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
  });
  

// Process logout form
app.post('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
