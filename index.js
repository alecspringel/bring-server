require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cors = require("cors");
var morgan = require('morgan')
// Endpoints
const user = require("./api/user");
const donations = require("./api/donations");
const responses = require("./api/responses");
const healthcheck = require("./api/healthcheck");
const { loginLimiter, donationLimiter } = require("./rateLimits");
// MongoDB Drivers/URI
const mongoose = require("mongoose");


// Config
const PORT = 5000;
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

app.use(cors());
app.use(morgan('combined'))
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use("/api/donations/create", donationLimiter);
app.use("/api/user/login", loginLimiter);
// Endpoints
app.use("/api/user", user);
app.use("/api/donations", donations);
app.use("/api/responses", responses);
app.use("/api/healthcheck", healthcheck);

app.listen(PORT, () => {
  console.log(`Bring server running at http://localhost:${PORT}`);
});
