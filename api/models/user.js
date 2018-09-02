const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true, unique: true, minlength: 6, maxlength: 16, match: /^[a-z0-9]+$/ },
  password: { type: String, required: true },
  biography: { type: String, required: true, maxlength: 200 },
  display: { type: String, required: true } 
});

module.exports = mongoose.model("User", UserSchema);