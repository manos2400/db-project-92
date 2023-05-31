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
    user = user[0];
    user.date_of_birth = user.date_of_birth.toISOString().split("T")[0];
    return res.send(user);
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
  if (!req.session.loggedIn) {
    return res.redirect("/");
  }
  if (req.session.user.type !== "manager") {
    return res.status(403).send("You are not allowed to delete users.");
  }
  try {
    const connection = await pool.getConnection();
    await connection.query(`
        DELETE FROM users WHERE id = ?;
    `, [req.params.id]);
    return res.status(200).redirect("/users");
  } catch (error) {
    console.error(error);
    return res.status(503).send("Database is currently unavailable.");
  }
});
router.post("/deactivate/:id", async (req, res) => {
  // Deactivation just moves the user to the pending_users table like they are a new user
  if (!req.session.loggedIn) {
    return res.redirect("/");
  }
  if (req.session.user.type !== "manager") {
    return res.status(403).send("You are not allowed to deactivate users.");
  }
  try {
    const connection = await pool.getConnection();
    // Get the user info from the users table
    const user = await connection.query(`
        SELECT users.*, school_users.school_id AS school_id 
        FROM users
        INNER JOIN school_users ON users.id = school_users.user_id 
        WHERE users.id = ?;
    `, [req.params.id]);
    // Insert the user info into the pending_users table
    await connection.query(`
        INSERT INTO pending_users (username, password, real_name, date_of_birth, email, address, phone_number, type, school_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `, [user[0].username, user[0].password, user[0].real_name, user[0].date_of_birth, user[0].email, user[0].address, user[0].phone_number, user[0].type, user[0].school_id]);
    // Delete the user from the users table
    await connection.query(`
        DELETE FROM users WHERE id = ?;
    `, [req.params.id]);
    return res.status(200).redirect("/users");
  } catch (error) {
    console.error(error);
    return res.status(503).send("Database is currently unavailable.");
  }});
router.post("/pending/accept/:id", async (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("/");
  }
  if (req.session.user.type !== "manager") {
    return res.status(403).send("You are not allowed to accept user applications.");
  }
  try {
    const connection = await pool.getConnection();
    const user = await connection.query(`
        SELECT * FROM pending_users WHERE id = ?;
    `, [req.params.id]);
    if(!user) {
        return res.status(404).send("User application not found.");
    }
    const newUser = await connection.query(`
        INSERT INTO users (username, password, real_name, date_of_birth, email, address, phone_number, type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `, [user[0].username, user[0].password, user[0].real_name, user[0].date_of_birth, user[0].email, user[0].address, user[0].phone_number, user[0].type]);
    await connection.query(`
        INSERT INTO school_users (school_id, user_id)
        VALUES (?, ?);
    `, [user[0].school_id, newUser.insertId]);
    await connection.query(`
        DELETE FROM pending_users WHERE id = ?;
    `, [req.params.id]);
    return res.status(202).redirect("/users");
  } catch (error) {
    console.error(error);
    return res.status(503).send("Database is currently unavailable.");
  }
});
router.post("/pending/deny/:id", async (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("/");
  }
  if (req.session.user.type !== "manager") {
    return res.status(403).send("You are not allowed to deny user applications.");
  }
  try {
    const connection = await pool.getConnection();
    await connection.query(`
        DELETE FROM pending_users WHERE id = ?;
    `, [req.params.id]);
    return res.status(200).redirect("/users");
  } catch (error) {
    console.error(error);
    return res.status(503).send("Database is currently unavailable.");
  }});
module.exports = router;
