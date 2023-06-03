const express = require('express')
const { backupDatabase, restoreDatabase } = require('../../database.js');

const router = express.Router()

router.get("/", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }
    return res.render("admin/database", {
        session: req.session
    });

});

router.post("/backup", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }
    try {
        await backupDatabase();
        return res.status(200).send("Backup completed successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}
);

router.post("/restore", async (req, res) => {
    if (!req.session.loggedIn || req.session.user.type !== "admin") { return res.redirect('/'); }
    try {
        await restoreDatabase();
        return res.status(200).send("Restore completed successfully");
    } catch (error) {
        console.error(error);
        return res.status(500).send(error);
    }
}
);

module.exports = router;