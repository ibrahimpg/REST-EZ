const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const user = require("../../models/user");

const authorization = require("../../authorization");

router.delete("/", authorization, (req, res) => {
  user
    .findOneAndDelete({ _id: req.authData.id })
    .then(() => res.json({ message: "Success" }))
    .catch(err => res.json({ message: "Error", error: err }));
});

module.exports = router;