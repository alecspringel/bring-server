const express = require("express");
const router = express.Router();
const { authUser } = require("../middleware/authUser")
const Response = require("../mongo/models/responses");

// @route POST api/responses/create
// @desc Create a new preset response message
// @access Private
router.post("/create", authUser, (req, res) => {
  const newResponse = {
    message: req.body.message
  };
  Response.create(newResponse);
  res.status(200).send(newResponse);
});

// @route POST api/responses/delete"
// @desc Delete response already stored in database
// ex. of posted data: {"id": "5f925ffa5c"}
// @access Private
router.post("/delete", authUser, (req, res) => {
  Donation.findByIdAndDelete(req.body.id).then((docs) => {
    console.log("Deleted:", req.body.id);
  });
  res.status(200).send();
});

// @route GET api/responses/all
// @desc Get all responses
// @access Private
router.get("/all", authUser, (req, res) => {
  Response.find().then((docs) => {
    res.status(200).send(docs);
  });
});

module.exports = router;
