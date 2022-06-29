//jshint esversion:6
 require("dotenv").config();
// Express
const express = require("express");
const app = express();
app.use(express.static("public"));

// Body Parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// EJS
const ejs = require("ejs");
app.set("view engine", "ejs");
// Mongoose Encryption
const encrypt = require("mongoose-encryption");
// Database Mongoose
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("user", userSchema);

// System FLow
app.get("/", (req, res) => {
  res.render("home");
});

// Login Route
app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render("secrets");
          }
        }
      }
    });
  });
// Register Route
app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password,
    });
    newUser.save((err) => {
      if (!err) {
        res.render("secrets");
      } else {
        console.log(err);
      }
    });
  });
// Server Port
app.listen(3000, () => {
  console.log("Server started on Port 3000");
});
