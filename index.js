const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cors = require('cors');
// Endpoints
const donations = require("./api/donations");
const responses = require("./api/responses");
// MongoDB Drivers/URI
const mongoose = require("mongoose");
const db = require("./config/keys.js").mongoURI;
const PORT = 5000;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

app.use(cors());
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Endpoints
app.use("/api/donations", donations);
app.use("/api/responses", responses);

app.listen(PORT, () => {
  console.log(`Bring server running at http://localhost:${PORT}`);
});
