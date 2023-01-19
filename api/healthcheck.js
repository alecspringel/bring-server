const express = require("express");
const router = express.Router();

// @route POST api/healthcheck
// @desc Sends 200 status
// @access Public
router.get("/", async (req, res) => {
    res.sendStatus(200);
});

module.exports = router;
