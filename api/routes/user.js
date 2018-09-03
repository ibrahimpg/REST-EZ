// Modules
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");

// Middleware
const authorization = require("../middleware/authorization");
const upload = require("../middleware/multer");

// Model
const User = require("../models/user");

// View Users
router.get("/view", (req, res) => {
  User.find()
    .then(users => res.json({message: users}))
});

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
          display: { data: null, contentType: null }
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
    .find({ username: req.body.username }) //change to findOne and remove [0] from subsequent?
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.json({ message: "Login failed." });
      } else {
        if (bcrypt.compareSync(req.body.password, user[0].password) == true) {
          const token = jwt.sign({username: user[0].username, id: user[0].id}, process.env.JWT_KEY, {expiresIn: "1h"});
          return res.json({ message: "Login successful.", token });
        } else {
          return res.json({ message: "Login failed." });
        }
      }
    })
    .catch(() => res.json({ message: "Error" }));
});

// Update User
router.patch("/update", authorization, upload.single("display"), (req, res) => {
  User
    .findByIdAndUpdate(req.tokenData.id, {
      biography: req.body.biography,
      display: { data: fs.readFileSync(req.file.path), contentType: req.file.mimetype }
    }, {runValidators : true})
    .then(() => res.json({ message: "User updated." }))
    .catch((err) => res.json({ message: "Error", error: err }));
    fs.unlink("./temp/" + req.file.originalname);
});

// Delete User
router.delete("/delete", authorization, (req, res) => {
  User
    .findByIdAndDelete(req.tokenData.id)
    .then(() => res.json({ message: "User deleted." }))
    .catch((err) => res.json({ message: "Error", error: err }));
});

module.exports = router;