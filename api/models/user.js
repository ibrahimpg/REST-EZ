const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true, unique: true, minlength: 6, maxlength: 16, match: /^[a-z0-9]+$/ }, //check if unique true now offers actual validation and thus allows shorter registration route logic
  password: { type: String, required: true, min: 6, max: 16 },
  biography: { type: String, max: 200 },
  display: String 
});

module.exports = mongoose.model("User", UserSchema);