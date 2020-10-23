const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const ResponseSchema = new Schema({
  message: {
    type: String,
    require: true,
  },
});

module.exports = Response = mongoose.model("responses", ResponseSchema);
