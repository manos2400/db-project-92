const express = require('express')
const pool = require('../database.js');

const router = express.Router()

router.get("/", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }

    res.render("admin/dashboard", { session: req.session });

})

router.use("/users", require("./admin/users.js"));

router.use("/schools", require("./admin/schools.js"));

router.use("/loans", require("./admin/loans.js"));

module.exports = router;