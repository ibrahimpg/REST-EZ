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
      if (user.length >= 1) {
        return res.json({ message: "User already exists." });
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
          .catch(err => res.json({ message: "Error", error: err }));
      }
    })
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
          const token = jwt.sign({username: user[0].username, id: user[0].id}, "secretKey", {expiresIn: "1h"}); //change pw to env var
          return res.json({ message: "Login successful.", token });
        } else {
          return res.json({ message: "Login failed." });
        }
      }
    })
    .catch(err => res.json({ message: "Error", error: err }));
});

// Edit User
router.patch("/edit", authorization, (req, res) => {
  //one way to do it
  //const id = req.params.productId;
  //Product.update({ _id: id }, { $set: { biography: req.body.newBiography, display: req.body.newPrice } });
  //});
  //the above works when you send both bio and display in the patch. but what if you want one?
  //const id = req.params.productId;
  //const updateOps = {};
  //for (const ops of req.body) { updateOps[ops.propName] = ops.value; } 
  //Product.update({ _id: id }, { $set: { updateOps } })
  // .exec() //this allows you to create a promie (then and catch)
  // .then(res => {blahblah})
  // .catch(err => messae: err blah blah)
  //});
  //this way of doing it means the req body you send has to be an array  of objects
  // ie: [ { "propName" : "biography", "value" : "newValue" } ]
  User
    .findByIdAndUpdate({ _id: req.tokenData.id })
    .then(() => res.json({ message: "User updated." }))
    .catch((err) => res.json({ message: "Error", error: err }));
});

// Delete User
router.delete("/delete", authorization, (req, res) => {
  User
    .findOneAndDelete({ _id: req.tokenData.id }) //do we need .save() before then and catch here? and for edit above.. and what about exec to make this a proper promise and thus make the .catch actually work (if i underststand correctly)
    .then(() => res.json({ message: "User deleted." }))
    .catch(err => res.json({ message: "Error", error: err }));
});

module.exports = router;