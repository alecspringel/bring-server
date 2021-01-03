const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20,
  message: "Max login api calls exceeded for this time period",
});

const donationLimiter = rateLimit({
  windowMs: 240 * 60 * 1000, // 4 hours
  max: 15,
  message: "Max donation api calls exceeded for this time period",
});

module.exports = { donationLimiter, loginLimiter };
