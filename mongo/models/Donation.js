const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Use shortid to create easy reference to donation for lookup
const shortid = require('shortid');

// Create Schema
const DonationSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
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
  itemName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  preferPhone: {
    type: Boolean,
    required: true,
  },
  preferEmail: {
    type: Boolean,
    required: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  responseStatus: {
    type: Boolean,
    default: false,
  },
  responseType: {
    type: String,
    enum: ["YES", "MAYBE", "NO", null],
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
  staffResponder: {
    id: { default: null, type: String },
    name: {
      default: null,
      type: String,
    },
  },
  respondedDate: {
    default: null,
    type: Date,
  },
});

module.exports = Donation = mongoose.model("donations", DonationSchema);
