const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ResetPasswordSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = ResetPassword = mongoose.model(
  "resetpassword",
  ResetPasswordSchema
);
