const express = require("express");
const pool = require("../database.js");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      return res.redirect("/");
    }
    if (req.session.user.type !== "manager") {
      return res.status(403).redirect("/dashboard");
    }
    const connection = await pool.getConnection();
    let users;
    if(req.query.name) {
        users = await connection.query(`
        SELECT u.real_name AS name, u.id AS id, u.type AS type
        FROM school_users su
        INNER JOIN users u ON su.user_id = u.id
        WHERE su.school_id = ? AND u.real_name LIKE ?;`,
        [req.session.school.id, `%${req.query.name}%`]
      );
    } else {
        users = await connection.query(`
        SELECT u.real_name AS name, u.id AS id, u.type AS type
        FROM school_users su
        INNER JOIN users u ON su.user_id = u.id
        WHERE su.school_id = ?;`,
        [req.session.school.id]
      );
    }
    const pendingUsers = await connection.query(`
        SELECT real_name AS name, id, type
        FROM pending_users 
        WHERE school_id = ?;`,
        [req.session.school.id]
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
router.get("/:id", async (req, res) => {
  try {
    if (!req.session.loggedIn) {
      return res.redirect("/");
    }
    let user;
    const connection = await pool.getConnection();
    if(req.query.status === 'pending') {
        user = await connection.query(
            `SELECT * FROM pending_users WHERE id = ?;`,
        [req.params.id]);
    } else {
        user = await connection.query(
            `SELECT * FROM users WHERE id = ?;`,
        [req.params.id]);
    }

    await connection.release();
    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.send(user[0]);
  } catch (error) {
    console.error(error);
    return res.status(503).send("Database is currently unavailable.");
  }
});
router.post("/create", async (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("/");
  }
  if (req.session.user.type !== "manager") {
    return res.status(403).send("You are not allowed to add users.");
  }
  try {
    const connection = await pool.getConnection();
  } catch (error) {
    console.error(error);
    return res.status(503).send("Database is currently unavailable.");
  }

});
router.post("/edit/:id", async (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("/");
  }
  if (req.session.user.type !== "manager") {
    return res.status(403).send("You are not allowed to edit users.");
  }
  try {
    const connection = await pool.getConnection();

  } catch (error) {
    console.error(error);
    return res.status(503).send("Database is currently unavailable.");
  }

});
router.post("/delete/:id", async (req, res) => {
    return res.status(501).send("Not implemented yet.");
});
router.post("/deactivate/:id", async (req, res) => {
    return res.status(501).send("Not implemented yet.");
});
router.post("/activate/:id", async (req, res) => {
    return res.status(501).send("Not implemented yet.");
});
router.post("/pending/accept/:id", async (req, res) => {
    return res.status(501).send("Not implemented yet.");
});
router.post("/pending/deny/:id", async (req, res) => {
    return res.status(501).send("Not implemented yet.");
});
module.exports = router;
