const express = require('express')
const pool = require('../database.js');

const router = express.Router()

router.get("/", async (req, res) => {
    if (!req.session.loggedIn) { return res.redirect('/'); }
    // Retrieve session information
    if(req.session.user.type === 'admin') {
        return res.redirect('/admin');
    }
    const connection = await pool.getConnection();

    try {
        var loans = await connection.query(`SELECT * FROM loans_view WHERE user_id = ?;`, [req.session.user.id]);
        var reservations = await connection.query(`SELECT * FROM reservations_view WHERE user_id = ?;`, [req.session.user.id]);
        await connection.query('CALL GetUserStats(?, @reservationCount, @loanCount, @activeLoanCount, @reviewCount)', [req.session.user.id]);
        const result = await connection.query('SELECT @reservationCount AS reservationCount, @loanCount AS loanCount, @activeLoanCount AS activeLoanCount, @reviewCount AS reviewCount;');
        var { reservationCount, loanCount, activeLoanCount, reviewCount } = result[0];
    } catch (error) {
        console.error(error);
        return res.send('Database error occurred');
    } finally {
        await connection.release();
    }

    // Render the dashboard view and pass session information as locals
    return res.render('dashboard', {
        session: req.session,
        loans,
        reservations,
        reservationCount,
        loanCount,
        activeLoanCount,
        reviewCount
    });
})

module.exports = router;