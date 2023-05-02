const express=require('express')
const mariadb = require('mariadb');

const router=express.Router()

router.post("/", async (req,res)=>{
    const { username, password } = req.body;

    if (!username || !password) {
        return res.send('Invalid credentials');
    }

    // Connect to MariaDB
    const connection = await mariadb.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: 'libraries'
    });

    try {
        // Check credentials
        const rows = await connection.query(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, password]);
        if (rows.length === 1) {
            // Successful login
            // Cache important user information in session
            req.session.loggedIn = true;
            req.session.username = username;
            req.session.real_name = rows[0].real_name;
            req.session.permission_level = rows[0].permission_level;
            req.session.userID = rows[0].id;
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
})

module.exports=router;