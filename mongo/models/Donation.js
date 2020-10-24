const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const DonationSchema = new Schema({
  first: {
    type: String,
    default: null,
    require: true,
  },
  last: {
    type: String,
    default: null,
    require: true,
  },
  email: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  responseStatus: {
    type: Boolean,
    default: null,
  },
  responseMessage: {
    type: String,
    default: null,
  },
  imageUrls: {
    type: [String],
    required: true,
  },
});

module.exports = Donation = mongoose.model("donations", DonationSchema);
