const express = require('express')
const { pool } = require('../database.js');
const moment = require('moment-timezone');

const router = express.Router()

router.get("/", async (req, res) => {
    // Connect to MariaDB
    const connection = await pool.getConnection();

    try {
        // Check credentials
        const rows = await connection.query(`
            SELECT name, id FROM schools;
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
    const { username, password, real_name, date_of_birth, email, address, phone, type, school_id } = req.body;
    date_of_birth = moment(date_of_birth).format();
    try {
        const p_users = await connection.query(`
            SELECT username FROM pending_users WHERE username = ?;
        `, [username]);
        const users = await connection.query(`
            SELECT username FROM users WHERE username = ?;
        `, [username]);
        if (users.length > 0 || p_users.length > 0) {
            return res.status(400).send('Username already exists');
        }
        await connection.query(`INSERT INTO pending_users (username, password, real_name, date_of_birth, email, address, phone_number, type, school_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `, [username, password, real_name, date_of_birth, email, address, phone, type, school_id]);
        return res.status(200).send('Sign up application has been sent. Please wait for manager to approve your application. Thank you for your patience!');

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    } finally {
        connection.release();
    }
})

module.exports = router;