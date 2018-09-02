// Modules
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Model
const User = require("../models/user");

// Middleware
const authorization = require("../middleware/authorization");
// maybe middleware for binary image saving?

// Register User
router.post("/register", (req, res) => {
  User
    .find({ username: req.body.username })
    .exec()
    .then(user => {
      if (user.length >= 1 || req.body.password.length < 6) {
        return res.json({ message: "Registration failed." });
      } else {
        const newUser = new User({
          _id: new mongoose.Types.ObjectId(),
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 10),
          biography: "Bio...",
          display: "Display..."
        });
        newUser
          .save()
          .then(() => res.json({ message: "User created." }))
          .catch((err) => res.json({ message: err }));
      }
    })
    .catch((err) => res.json({ message: err }));
});

// Login User
router.post("/login", (req, res) => {
  User
    .find({ username: req.body.username }) //change to findOne and remove [0] from subsequent? test it out
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.json({ message: "Login failed." });
      } else {
        if (bcrypt.compareSync(req.body.password, user[0].password) == true) {
          const token = jwt.sign({username: user[0].username, id: user[0].id}, "secretKey", {expiresIn: "1h"});
          return res.json({ message: "Login successful.", token });
        } else {
          return res.json({ message: "Login failed." });
        }
      }
    })
    .catch(() => res.json({ message: "Error" }));
});

// Update User
router.patch("/update", authorization, (req, res) => {
  User
    .findByIdAndUpdate(req.tokenData.id, { biography: req.body.biography, display: req.body.display },
    {runValidators : true})
    .then(() => res.json({ message: "User updated." }))
    .catch((err) => res.json({ message: "Error", error: err }));
});

// Delete User
router.delete("/delete", authorization, (req, res) => {
  User
    .findByIdAndDelete(req.tokenData.id)
    .then(() => res.json({ message: "User deleted." }))
    .catch((err) => res.json({ message: "Error", error: err }));
});

module.exports = router;