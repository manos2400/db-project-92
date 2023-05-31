const express = require('express')
const pool = require('../database.js');

const router = express.Router()

router.get("/", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }

    return res.status(501).send('Error 501: Login was successful but the requested functionality has not been implemented yet.');

})

module.exports = router;