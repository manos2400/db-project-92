const express = require('express')
const { pool } = require('../database.js');


const router = express.Router()

router.put("/", async (req, res) => {
    const { newpass, confirmpass } = req.body;

    if (!newpass || !confirmpass || newpass !== confirmpass) {
        return res.status(400).send('Passwords don\'t match');
    }

    // Connect to MariaDB
    const connection = await pool.getConnection();

    try {
        // Check credentials
        const rows = await connection.query(`UPDATE users SET password= ? WHERE id = ?`, [newpass, req.session.user.id]);
        if(rows.affectedRows !== 1) { 
            throw new Error('Password could not be changed');
        }
        return res.send("Changed password successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    } finally {
        await connection.release();
    }
})

module.exports = router;