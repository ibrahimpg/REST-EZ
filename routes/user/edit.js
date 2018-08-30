const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const user = require("../../models/user");

const authorization = require("../../authorization");

router.patch("/", authorization, (req, res) => {
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
  user
    .findByIdAndUpdate({ _id: req.authData.id })
    .then(() => res.json({ message: "Success" }))
    .catch((err) => res.json({ message: "Error", error: err }));
});

module.exports = router;