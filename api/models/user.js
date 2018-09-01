const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true, unique: true, minlength: 6, maxlength: 16, match: /^[a-z0-9]+$/ },
  password: { type: String, required: true },
  biography: { type: String, max: 200 },
  display: String 
});

module.exports = mongoose.model("User", UserSchema);