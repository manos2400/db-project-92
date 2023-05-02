const express=require('express')
const mariadb = require('mariadb');

const router=express.Router()

router.get("/", async (req,res)=>{
    if (req.session.loggedIn) {
        // Retrieve session information
        const username = req.session.username;
        const realName = req.session.real_name;
        const permissionLevel = req.session.permission_level;
        const userID = req.session.userID;

        const connection = await mariadb.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: 'libraries'
        });

        try {
            // Get school_id from school_users table
            const rows = await connection.query(`SELECT * FROM school_users WHERE user_id = ?`, [userID]);
            req.session.school_id = rows[0].school_id;
        } catch (error) {
            console.error(error);
            res.send('Error occurred during login');
        } finally {
            connection.end();
        }
        
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
})

module.exports = router;