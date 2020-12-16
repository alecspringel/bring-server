const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cors = require('cors');
// Endpoints
const user = require("./api/user");
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


// Rate Limits
const rateLimit = require("express-rate-limit");
donationLimiter = rateLimit({
  windowMs: 240 * 60 * 1000, // 4 hours
  max: 15,
  message: "Max donation api calls exceeded for this time period",
});

loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 10,
  message: "Max login api calls exceeded for this time period",
});

//app.use("/api/donations/create", donationLimiter);
//app.use("/api/user", loginLimiter);
// Endpoints
app.use("/api/user", user);
app.use("/api/donations", donations);
app.use("/api/responses", responses);



app.listen(PORT, () => {
  console.log(`Bring server running at http://localhost:${PORT}`);
});
