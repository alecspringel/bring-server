const express = require("express");
const app = express();
const bodyParser = require("body-parser");
// Endpoints
const donations = require("./api/donations");
// MongoDB Drivers/URI
const mongoose = require("mongoose");
const db = require("./config/keys.js").mongoURI;
const PORT = 3000;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Endpoints
app.use("/api/donations", donations);

app.listen(PORT, () => {
  console.log(`Bring server running at http://localhost:${PORT}`);
});
