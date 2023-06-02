const express = require('express')
const pool = require('../../database.js');

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
  SELECT schools.*, users.real_name AS manager_name
  FROM schools 
  INNER JOIN users ON schools.library_manager_id = users.id 
  WHERE schools.id = ?;
  `, [req.params.id]);   
  await connection.release();

  return res.render("admin/schools", { session: req.session, schools });
});

module.exports = router;