const express = require("express");
const router = express.Router();
const Donation = require("../mongo/models/Donation");
const { validateNewDonation } = require("../validation/donations");
// Image upload
const upload = require("../services/imageUpload");
const singleUpload = upload.single("image");

// @route POST api/donations/create
// @desc Create a donation with contact info
// @access Public
router.post("/create", (req, res) => {
  const { isValid, errors } = validateNewDonation(req.body);
  if (!isValid) {
    return res.status(400).send(errors);
  }

  singleUpload(req, res, (err) => {
    if (err) {
      return res.status(422).send({
        errors: [{ title: "Image Upload Error", detail: err.message }],
      });
    }
    console.log(req.file.location);
  });

  const newDonation = {
    first: req.body.first,
    last: req.body.last,
    email: req.body.email,
    description: req.body.description,
    imageUrl: [],
  };
  Donation.create(newDonation);
  res.status(200).send(newDonation);
});

// @route POST api/donations/modify"
// @desc Modify donation already stored in database
// ex. of posted data: {
//                      "id": "5f925ffa5c",
//                      "modified": { "responseMessage": "Awesome new resp msg", "responseStatus": true}
//                      }
// @access Private
router.post("/modify", (req, res) => {
  Donation.updateOne({ _id: req.body.id }, req.body.modified).then((docs) => {
    console.log("Modified:", req.body.id, "with", req.body.modified);
  });
  res.status(200).send();
});

// @route POST api/donations/delete"
// @desc Delete donation already stored in database
// ex. of posted data: {"id": "5f925ffa5c"}
// @access Private
router.post("/delete", (req, res) => {
  Donation.findByIdAndDelete(req.body.id).then((docs) => {
    console.log("Deleted:", req.body.id);
  });
  res.status(200).send();
});

// @route GET api/donations/all
// @desc Get all donations
// @access Private
router.get("/all", (req, res) => {
  Donation.find().then((docs) => {
    res.status(200).send(docs);
  });
});

// @route GET api/donations/unresolved
// @desc Get all donations that haven't been responded to by a staff member
// @access Private
router.get("/unresolved", (req, res) => {
  Donation.find({ responseStatus: null }).then((docs) => {
    res.status(200).send(docs);
  });
});

// @route GET api/donations/resolved
// @desc Get all donations that have been responded to by a staff member
// @access Private
router.get("/resolved", (req, res) => {
  Donation.find({ responseStatus: { $in: [false, true] } }).then((docs) => {
    res.status(200).send(docs);
  });
});

module.exports = router;
