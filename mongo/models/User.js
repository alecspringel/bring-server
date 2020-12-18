const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  first: {
    type: String,
    require: true,
  },
  last: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    require: true,
  },
  invitedBy: {
    type: String,
    require: true,
  },
  invitedDate: {
    type: Date,
    default: Date.now,
    require: true,
  },
});

module.exports = User = mongoose.model("users", UserSchema);
