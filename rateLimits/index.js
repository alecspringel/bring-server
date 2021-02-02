const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20,
  message: {
    error:
      "Maximum sign in attempts reach for this time period. Please try again later.",
  },
});

const donationLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 1 hour
  max: 10,
  message: {
    error:
      "You've reached the maximum donations allowed in this time period. Please try again later.",
  },
});

module.exports = { donationLimiter, loginLimiter };
