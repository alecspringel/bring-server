const express = require("express");
const router = express.Router();
const validateLoginInput = require("../validation/login");
const jwt = require("jsonwebtoken");

/* 
  DO NOT DO THIS IN PRODUCTION.

  Typically, users will be stored in MongoDB with their usernames and hashed passwords.
  Even if having distinct users is unnecessary, it is safer to have individual accounts,
  rather than one master account in case credentials are compromised.

  For the sake of demonstration, a single "master" username and password will be used.
*/
const { JWT_AUTH_KEY } = require("../config/keys");
const User = require("../mongo/models/User");

// @route POST api/user/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
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
        ret.token =
          "Bearer " +
          jwt.sign(payload, JWT_AUTH_KEY, {
            expiresIn: 259200, // 3 days in seconds
          });
        return ret;
      } else {
        return res.status(400).json({ password: "Incorrect password" });
      }
    })
    .catch(() => {
      return res.status(500).json({
        password: "There was an issue while signing in. Please try again",
      });
    });
});

module.exports = router;
