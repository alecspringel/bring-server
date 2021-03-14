const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ResponseSchema = new Schema({
  category: {
    enum: ["Accept", "Maybe", "Decline"],
    type: String,
  },
  title: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
});

module.exports = Response = mongoose.model("responses", ResponseSchema);
