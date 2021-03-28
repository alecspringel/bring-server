const express = require("express");
const router = express.Router();
const { authUser } = require("../middleware/authUser");
const Donation = require("../mongo/models/Donation");
const Response = require("../mongo/models/Responses");

// @route POST api/responses
// @desc Create a new preset response message
// @access Private
router.post("/", authUser, (req, res) => {
  const newResponse = {
    category: req.body.category,
    title: req.body.title,
    message: req.body.message,
  };
  Response.create(newResponse);
  res.status(200).send(newResponse);
});

// @route DELETE api/responses"
// @desc Delete response already stored in database
// ex. of posted data: {"_id": "5f925ffa5c"}
// @access Private
router.delete("/", authUser, (req, res) => {
  Response.findByIdAndDelete(req.body._id).then((doc) => {
    if (doc) {
      return res.status(200).send();
    } else {
      return res.status(404);
    }
  });
});

// @route GET api/responses/all
// @desc Get all responses
// @access Private
router.get("/", authUser, (req, res) => {
  Response.find().then((docs) => {
    res.status(200).send(docs);
  });
});

module.exports = router;
