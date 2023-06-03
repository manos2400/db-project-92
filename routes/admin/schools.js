const express = require('express')
const { pool } = require('../../database.js');


const router = express.Router()

router.get("/", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }
    try {
        const connection = await pool.getConnection();
        const schools = await connection.query("SELECT name, id FROM schools;");   
        await connection.release();

        return res.render("admin/schools", {
             session: req.session, 
             schools 
            });
    } catch (error) {
        console.error(error);
        return res.status(503).send("Database is currently unavailable.");
    }   
});
router.get("/:id", async (req, res) => {
  if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }

  const connection = await pool.getConnection();
  const schools = await connection.query(`
    SELECT s.*, u.real_name AS manager_name
    FROM schools s
    JOIN school_users su ON s.id = su.school_id
    JOIN users u ON u.id = su.user_id
    WHERE u.type = 'manager'; 
  `, [req.params.id]);   
  await connection.release();

  return res.send(schools[0]);
});
router.post("/edit/:id", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }
    try {
        const connection = await pool.getConnection();
        const { name, address, city, phone_number, email, principal_name } = req.body;

        await connection.query(`
            UPDATE schools 
            SET name = ?, address = ?, city = ?, phone_number = ?, email = ?, principal_name = ?
            WHERE id = ?;
        `,[name, address, city, phone_number, email, principal_name, req.params.id]);
        await connection.release();

        return res.status(200).send("School updated successfully.");
    } catch (error) {
        console.error(error);
        return res.status(503).send("Database is currently unavailable.");
    }
});
router.post("/create/", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }
    try {
        const connection = await pool.getConnection();
        const { name, address, city, phone_number, email, principal_name } = req.body;

        await connection.query(`
            INSERT INTO schools (name, address, city, phone_number, email, principal_name) 
            VALUES (?, ?, ?, ?, ?, ?);
            `,[name, address, city, phone_number, email, principal_name]);
        await connection.release();

        return res.status(200).send("School created successfully.");
    } catch (error) {
        console.error(error);
        return res.status(503).send("Database is currently unavailable.");
    }
});

module.exports = router;