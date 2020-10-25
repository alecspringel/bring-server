const express = require("express");
const router = express.Router();
const Donation = require("../mongo/models/Donation");
const { authUser } = require("../middleware/authUser")
const { validateNewDonation } = require("../validation/donations");
const sendSMS = require("../services/twilioSMS");
const sendSlackNotification = require("../services/slackNotifications");
// Image upload
const upload = require("../services/imageUpload");
const MAX_IMAGES = 5;
const imageUpload = upload.array("image", MAX_IMAGES);

// @route POST api/donations/create
// @desc Create a donation with contact info
// @access Public
router.post("/create", (req, res) => {
  //Validation is handled in services/imageUpload.js within multer
  imageUpload(req, res, (err) => {
    if (err) {
      return res.status(400).send(req.body.errors);
    } else {
      // req.files contains all image info in array [images]
      console.log(req.files);
      var imageUrls = req.files.map((file) => file.transforms[0].location);
      const newDonation = {
        first: req.body.first,
        last: req.body.last,
        itemName: req.body.itemName,
        description: req.body.description,
        email: req.body.email,
        phone: req.body.phone,
        preferPhone: req.body.preferPhone,
        preferEmail: req.body.preferEmail,
        imageUrls,
      };
      Donation.create(newDonation);
      sendSlackNotification(`One new donation question has been received about a ${req.body.itemName}`);
      res.status(200).send(newDonation);
    }
  });
});

// @route POST api/donations/respond"
// @desc Used when staff members respond to posted donations
// @access Private
router.post("/respond", authUser, (req, res) => {
  const { donationId, responseMessage, responseType } = req.body;

  console.log(donationId)
  Donation.findOneAndUpdate(
    { _id: donationId },
    {
      responseStatus: true,
      responseType,
      responseMessage,
    },
    (err, donation) => {
      if(!donation) {
        //This should never occur. This would mean the donation no longer exists
        return res.status(500).send("Donation does not exist");
      }
      var greeting = `Hello ${donation.first} ${donation.last}, this is BRING Recyling responding to your question about donating ${donation.itemName}. `;
      // IMPLEMENT EMAIL MESSAGES
      if (donation.preferEmail) {
        console.log("Not implemented yet");
      } else if (donation.preferPhone) {
        sendSMS(donation.phone, greeting.concat(responseMessage));
      }
      res.status(200).send("Message sent");
    }
  );
});

// @route POST api/donations/modify"
// @desc Modify donation already stored in database
// ex. of posted data: {
//                      "id": "5f925ffa5c",
//                      "modified": { "responseMessage": "Awesome new resp msg", "responseStatus": true}
//                      }
// @access Private
router.post("/modify", authUser, (req, res) => {
  Donation.updateOne({ _id: req.body.id }, req.body.modified).then((docs) => {
    console.log("Modified:", req.body.id, "with", req.body.modified);
  });
  res.status(200).send();
});

// @route POST api/donations/delete"
// @desc Delete donation already stored in database
// ex. of posted data: {"id": "5f925ffa5c"}
// @access Private
router.post("/delete", authUser, (req, res) => {
  Donation.findByIdAndDelete(req.body.id).then((docs) => {
    console.log("Deleted:", req.body.id);
  });
  res.status(200).send();
});

// @route GET api/donations/all
// @desc Get all donations
// @access Private
router.get("/all", authUser, (req, res) => {
  Donation.find().then((docs) => {
    res.status(200).send(docs);
  });
});

// @route GET api/donations/unresolved
// @desc Get all donations that haven't been responded to by a staff member
// @access Private
router.get("/unresolved", authUser, (req, res) => {
  Donation.find({ responseStatus: false }).then((docs) => {
    res.status(200).send(docs);
  });
});

// @route GET api/donations/resolved
// @desc Get all donations that have been responded to by a staff member
// @access Private
router.get("/resolved", authUser, (req, res) => {
  Donation.find({ responseStatus: true }).then((docs) => {
    res.status(200).send(docs);
  });
});

module.exports = router;
