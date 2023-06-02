const express = require('express')
const pool = require('../database.js');

const router = express.Router()

router.get("/", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }

    res.render("admin/dashboard", { session: req.session });

})

router.get("/users", async (req, res) => {
    try {
      if (!req.session.loggedIn) {
        return res.redirect("/");
      }
      if (req.session.user.type !== "admin") {
        return res.status(403).redirect("/dashboard");
      }
      const connection = await pool.getConnection();
      let users, admins;
      if(req.query.name) {
          users = await connection.query(`
          SELECT u.real_name AS name, u.id AS id, u.type AS type
          FROM school_users su
          INNER JOIN users u ON su.user_id = u.id
          WHERE u.type = 'manager' AND AND u.real_name LIKE ?;`,
          [`%${req.query.name}%`]
        );
        admins = await connection.query(`
          SELECT real_name AS name, id , type
          FROM users
          WHERE type = 'admin' AND real_name LIKE ?;`, [`%${req.query.name}%`]);
      } else {
          users = await connection.query(`
          SELECT u.real_name AS name, u.id AS id, u.type AS type
          FROM school_users su
          INNER JOIN users u ON su.user_id = u.id
          WHERE u.type = 'manager';`
        );
        admins = await connection.query(`
            SELECT real_name AS name, id , type
            FROM users
            WHERE type = 'admin';`);
      }
      users = users.concat(admins);
      const pendingUsers = await connection.query(`
          SELECT real_name AS name, id, type
          FROM pending_users 
          WHERE type = 'manager'`
          );
  
      await connection.release();
      return res.render("users", {
        session: req.session,
        users,
        pendingUsers,
      });
    } catch (error) {
      console.error(error);
      return res.status(503).send("Database is currently unavailable.");
    }
  });

module.exports = router;