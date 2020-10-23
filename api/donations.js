const express = require("express");
const router = express.Router();
const Donation = require("../mongo/models/Donation");

// @route POST api/donations/create
// @desc Create a donation with contact info
// @access Public
router.post("/create", (req, res) => {
  var formData = req.body;
  const newDonation = {
    first: req.body.first,
    last: req.body.last,
    email: req.body.email,
    description: req.body.description,
    imageUrl: [],
  };
  Donation.create(newDonation);
  res.send(200, newDonation);
});

module.exports = router;
