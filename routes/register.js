const express = require('express')
const pool = require('../database.js');

const router = express.Router()

router.get("/", async (req, res) => {
    // Connect to MariaDB
    const connection = await pool.getConnection();

    try {
        // Check credentials
        const rows = await connection.query(`
            SELECT name FROM schools;
        `);

        return res.render('register', {
            schools: rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    } finally {
        connection.release();
    }
})

router.post("/", async (req, res) => {
    // Connect to MariaDB
    const connection = await pool.getConnection();

    try {
        // Check credentials
        const rows = await connection.query(`
            SELECT name FROM schools;
        `);

        return res.render('register', {
            schools: rows
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    } finally {
        connection.release();
    }
})

module.exports = router;