const express = require("express");
const router = express.Router();
const Donation = require("../mongo/models/Donation");
const { authUser } = require("../middleware/authUser");
const { validateNewDonation } = require("../validation/donations");
const sendSMS = require("../services/twilioSMS");
const {
  sendEmail,
  sendStaffEmailNotification,
} = require("../services/nodeMailer");
// const sendSlackNotification = require("../services/slackNotifications");
// Image upload
const upload = require("../services/imageUpload");
const MAX_IMAGES = 5;
const imageUpload = upload.array("image", MAX_IMAGES);
//URL of admin page
const clientURL = process.env.CLIENT_URL;

// @route POST api/donations/create
// @desc Create a donation with contact info
// @access Public
router.post("/create", (req, res) => {
  //Validation is handled in services/imageUpload.js within multer
  // console.log(req)
  // const { isValid, errors } = validateNewDonation(req.body);
  // if (!isValid) {
  //   req.body.errors = errors;
  //   return res.status(400).send(req.body.errors);
  // }
  var start = new Date();
  console.log("Starting imageupload", start);
  imageUpload(req, res, (err) => {
    var t1 = new Date();
    console.log("Finished imageupload", t1 - start);
    if (err) {
      return res.status(400).send(req.body.errors);
    } else {
      if (req.body.description === "") {
        req.body.description = "No description";
      }
      // req.files contains all image info in array [images]
      console.log(req.files);
      var imageUrls = req.files.map((file) => file.location);
      const newDonation = {
        first: req.body.first.charAt(0).toUpperCase() + req.body.first.slice(1),
        last: req.body.last.charAt(0).toUpperCase() + req.body.last.slice(1),
        itemName: req.body.itemName,
        description: req.body.description,
        email: req.body.email,
        phone: req.body.phone,
        preferPhone: req.body.preferPhone,
        preferEmail: req.body.preferEmail,
        imageUrls,
      };
      Donation.create(newDonation);
      var t2 = new Date();
      console.log("Finished donation creation", t2 - start);
      Donation.countDocuments({ responseStatus: false }).then((pending) => {
        var t3 = new Date();
        console.log("Finished counting donations", t3 - start);
        console.log(
          "New donation question created",
          pending,
          "pending donation questions"
        );
        var message = "";
        if (pending == 1) {
          message = `1 new donation question about ${
            req.body.itemName
          } was posted. Respond to it at ${clientURL + "/admin"}.`;
        } else if (pending > 1) {
          message = `1 new donation question about ${
            req.body.itemName
          } was posted. There are currently ${pending} questions waiting for review. Respond to all of them at ${
            process.env.CLIENT_URL + "/admin"
          }`;
        }
        sendStaffEmailNotification(
          pending,
          req.body.itemName,
          process.env.CLIENT_URL + "/admin",
          message
        );
        var t4 = new Date();
        console.log("Sent email", t4 - start);
        // sendSlackNotification(message);
      });
      res.status(200).send(newDonation);
    }
  });
  var t5 = new Date();
  console.log("Finished everything", t5 - start);
});

// @route POST api/donations/respond"
// @desc Used when staff members respond to posted donations
// @access Private
router.post("/respond", authUser, (req, res) => {
  sendEmail("emailSubject", "greeting", null, "alecspringel@gmail.com");
  const { donationId, responseMessage, responseType } = req.body;
  const staffResponder = {
    id: req.user._id,
    name: req.user.first + " " + req.user.last,
  };
  Donation.findOneAndUpdate(
    { _id: donationId },
    {
      responseStatus: true,
      responseType,
      responseMessage,
      staffResponder,
      respondedDate: new Date(),
    },
    (err, donation) => {
      if (!donation) {
        //This should never occur. This would mean the donation no longer exists
        return res.status(500).send("Donation does not exist");
      }
      var greeting =
        `Hello ${donation.first} ${donation.last},\n\n` +
        `This is an automated email response from BRING Recycling regarding your donation: ${donation.itemName}.\n\n`;
      greeting = greeting.concat(responseMessage);
      greeting = greeting.concat(
        `\n\nYour confirmation number is: ${donationId}`
      );
      greeting = greeting.concat(
        "\n\nThank you for your inquiry!\n BRING Team"
      );
      if (donation.preferEmail) {
        console.log(greeting);
        const emailSubject = "BRING Recycling Donation";
        sendEmail(emailSubject, greeting, null, donation.email);
      }
      if (donation.preferPhone) {
        sendSMS(donation.phone, greeting);
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

// @route POST api/donations/bulkDelete"
// @desc Delete list of donations already stored in database
// ex. of posted json data: {"ids": ["5f925ffa5c", "5f925ffa5d"]}
// @access Private
router.post("/bulkDelete", authUser, (req, res) => {
  let ids = req.body.ids;
  console.log(typeof req.body.ids);
  ids.forEach((id) => {
    Donation.findByIdAndDelete(id).then((docs) => {
      console.log("Deleted:", id);
    });
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
  // Make sure the createdDate is valid (sortable by MongoDB (1, -1))
  if (req.query.createdDate) {
    req.query.createdDate = parseInt(req.query.createdDate);
    if (Math.abs(req.query.createdDate) !== 1) {
      return res
        .status(400)
        .send("Cannot sort date by ", req.query.createdDate);
    }
  }

  Donation.find({ responseStatus: false })
    .sort({ createdDate: req.query.createdDate })
    .then((docs) => {
      res.status(200).send(docs);
    });
});

// @route GET api/donations/resolved
// @desc Get all donations that have been responded to by a staff member
// @access Private
router.get("/resolved", authUser, async (req, res) => {
  console.log(req.query);
  var query = { responseStatus: true };
  if (req.query.search) {
    query[req.query.searchField || "_id"] = {
      $regex: req.query.search,
      $options: "i",
    };
  }
  const count = await Donation.count(query);
  Donation.find(query)
    .sort({ createdDate: -1 })
    .skip(parseInt(req.query.skip))
    .limit(parseInt(req.query.limit))
    .then((docs) => {
      res.status(200).send({ data: docs, count });
    });
});

module.exports = router;
