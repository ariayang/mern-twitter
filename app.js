//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");

require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
const router = express.Router();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

// Use login token to authenticate and create private route
const passport = require("passport");
app.use(passport.initialize());
require('./config/passport')(passport);

mongoose
  .connect(process.env.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch((err) => console.log(err));

  const users = require("./routes/api/users");
  const tweets = require("./routes/api/tweets");
  const movies = require("./routes/api/movies");

  app.use("/api/users", users);
  app.use("/api/tweets", tweets);
  app.use("/api/movies", movies);

  app.get("/", (req, res) => {
    res.send("Hello from home");
  });

  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server is running on port ${port}`));