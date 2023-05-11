const express = require('express')
const pool = require('../database.js');

const router = express.Router()

router.post("/", async (req, res) => {
    const { newpass, confirmpass } = req.body;

    if (!newpass || !confirmpass || newpass !== confirmpass) {
        return res.send('Passwords don\'t match');
    }

    // Connect to MariaDB
    const connection = await pool.getConnection();

    try {
        // Check credentials
        const rows = await connection.query(`UPDATE users SET password= ? WHERE id = ?`, [newpass, req.session.user.id]);
        if(rows.affectedRows !== 1) { 
            return res.send("Failed to change password");
        }
        return res.send("Changed password successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    } finally {
        connection.release();
    }
})

module.exports = router;