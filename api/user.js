const express = require("express");
const router = express.Router();
const {
  validateLoginInput,
  validateInvite,
  validateFinish,
} = require("../validation/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { generatePassword } = require("../helpers/password");
const { JWT_AUTH_KEY } = require("../config/keys");
const User = require("../mongo/models/User");
const { authUser } = require("../middleware/authUser");
const { authAdmin } = require("../middleware/authAdmin");
const { sendEmail } = require("../services/nodeMailer");

// @route GET api/user/all
// @desc Get all users (employees)
// @access Admin
router.get("/all", authUser, authAdmin, async (req, res) => {
  var response = [];
  User.find().then((users) => {
    users.forEach((user) => {
      response.push({
        first: user.first,
        last: user.last,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    });
    res.status(200).send(response);
  });
});

// @route POST api/user/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", async (req, res) => {
  var { email, password } = req.body;
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  email = email.toLowerCase();
  var found = null;
  await User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ email: "Could not find an account with that email" });
      }
      found = user;
      return bcrypt.compare(password, user.password);
    })
    .then((isMatch) => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: found._id,
          first: found.first,
          last: found.last,
          email: found.email,
          isAdmin: found.isAdmin,
        };
        // Sign token
        const token =
          "Bearer " +
          jwt.sign(payload, JWT_AUTH_KEY, {
            expiresIn: 259200, // 3 days in seconds
          });
        return res.status(200).json({ token });
      } else {
        return res.status(400).json({ password: "Incorrect password" });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({
        password: "There was an issue while signing in. Please try again",
      });
    });
});

// @route POST api/user/invite
// @desc Allows another admin to invite another user to sign up
// @access Private, Admin
router.post("/invite", authUser, authAdmin, async (req, res) => {
  var { email, isAdmin } = req.body;
  // Form validation
  const { errors, isValid } = validateInvite(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  email = email.toLowerCase();
  var user = await User.findOne({ email: email });
  if (user) {
    return res
      .status(400)
      .json({ email: "User with that email has already been invited" });
  }

  var password = generatePassword();
  var message =
    "You can now login to the BRING Recycling donation app.\n\n" +
    "Log in to finish setting up your account:\nEmail: " +
    email +
    "\nTemporary Password: " +
    password;

  //Hash password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      User.create({
        first: null,
        last: null,
        email,
        password: hash,
        isAdmin: isAdmin,
        invitedBy: req.user.email,
      });
      sendEmail("BRING Recycling Account", message, null, email);
      return res.sendStatus(200);
    });
  });
});

// @route POST api/user/finish
// @desc Invited users can finish account setup (using name and password)
// @access Private
router.post("/finish", authUser, async (req, res) => {
  var { first, last, password, confirm } = req.body;
  // Form validation
  const { errors, isValid } = validateFinish({
    first,
    last,
    password,
    confirm,
  });
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  var user = await User.findOne({ email: req.user.email });
  // If the user is authenticated by JWT, but is not found,
  // they were likely removed by an admin before their token expired
  if (!user) {
    return res.sendStatus(401);
  }
  // Users cannot access the endpoint after using it once
  if (user.first) {
    return res.sendStatus(401);
  }

  //Hash password
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) throw err;
      //Capitalize first letters
      user.first = first.substring(0, 1).toUpperCase() + first.substring(1);
      user.last = last.substring(0, 1).toUpperCase() + last.substring(1);
      user.password = hash;
      user.save();
      return res.sendStatus(200);
    });
  });
});

// @route POST api/user/remove
// @desc Allows admins to revoke user accounts (delete's account)
// @access Private, Admin
router.post("/remove", authUser, authAdmin, async (req, res) => {
  var { email } = req.body;

  var user = await User.deleteOne({ email: email })
    .then((result) => {
      if (result.deletedCount === 1) {
        return res.sendStatus(200);
      } else {
        return res.sendStatus(400);
      }
    })
    .catch((err) => res.sendStatus(500));
});

module.exports = router;
