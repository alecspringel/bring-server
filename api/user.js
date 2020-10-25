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
const { ADMIN_USERNAME, ADMIN_PASSWORD, JWT_AUTH_KEY } = require("../config/keys");


// @route POST api/user/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  const { username , password }= req.body;
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  if(username !== ADMIN_USERNAME) {
    return res.status(400).json({ username: "That User Name does not exist" });
  }
  if (password !== ADMIN_PASSWORD) {
    return res.status(400).json({ password: "Password is incorrect" });
  }

  const payload = {
    auth: true
  }

  // Typically, some user info would go within the token
  jwt.sign(
    payload,
    JWT_AUTH_KEY,
    {
      expiresIn: 86400, // 1 day in seconds
    },
    (err, token) => {
      res.status(200).json({
        token: "Bearer " + token,
      });
    }
  );
});

module.exports = router;
