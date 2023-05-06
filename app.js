const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
app.set('view engine', 'ejs');
// Use sessions for tracking login state

app.use(session({
    secret: process.env.SESSION_SECRET,
    signed: true,
    resave: true,
    saveUninitialized: false
}));

// Parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', express.static('public'));
// Serve login page
app.get('/', (req, res) => {
    if (req.session.loggedIn) { return res.redirect('/dashboard'); }
    return res.render('login');
});

// Process login form
app.use('/login', require('./routes/login.js'));

// Serve dashboard page
app.use('/dashboard', require('./routes/dashboard.js'));

// Display the books page
app.use('/books', require('./routes/books.js'));

// Display the profile page
app.use('/profile', require('./routes/profile.js'));
  
// Process logout form
app.post('/logout', (req, res) => {
    req.session.destroy();
    return res.redirect('/');
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
