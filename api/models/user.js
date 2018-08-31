const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true, minlength: 6, maxlength: 16 },
  password: { type: String, required: true, min: 6, max: 16 },
  biography: { type: String, max: 200 },
  display: String 
});

module.exports = mongoose.model("user", userSchema);