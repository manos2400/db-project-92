const express = require('express')
const pool = require('../database.js');

const router = express.Router()

router.get("/", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }
    try {
        const connection = await pool.getConnection();
        const categories = await connection.query(`SELECT * FROM categories;`);
        res.render("admin/dashboard", { 
            session: req.session,
            categories
        });

    } catch (error) {
        console.error(error);
        return res.status(503).send("Database is currently unavailable.");
    }

})

router.use("/users", require("./admin/users.js"));

router.use("/schools", require("./admin/schools.js"));

router.use("/loans", require("./admin/loans.js"));

router.use("/query", require("./admin/queries.js"));

module.exports = router;