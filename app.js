const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();

// Create the server
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

// Use sessions for tracking login state
app.use(session({
    secret: process.env.SESSION_SECRET,
    signed: true,
    resave: true,
    saveUninitialized: false
}));

// Parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/static', express.static('public/book_covers'));
app.use('/', express.static('public'));
// Serve login page
app.get('/', (req, res) => {
    if (req.session.loggedIn) { return res.redirect('/dashboard'); }
    return res.render('login',{
        invalid: false
    });
});

// Process login form
app.use('/login', require('./routes/login.js'));

// Process change password page
app.use('/password', require('./routes/password.js'));

// Serve dashboard page
app.use('/dashboard', require('./routes/dashboard.js'));

// Serve reservations page
app.use('/reservations', require('./routes/reservations.js'));

// Serve loans page
app.use('/loans', require('./routes/loans.js'));

// Display the books page
app.use('/books', require('./routes/books.js'));

// Display the profile page
app.use('/profile', require('./routes/profile.js'));

// Process logout form
app.post('/logout', (req, res) => {
    req.session.destroy();
    return res.redirect('/');
});

// Display the 404 page
app.use((req, res) => { 
    return res.status(404).render('404.ejs', {
        session: req.session
    })
 })

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server started on http://localhost:3000');
});
