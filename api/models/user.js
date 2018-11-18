const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  created: { type: Date, default: Date.now },
  name: {
    type: String, required: true, unique: true, minlength: 1, maxlength: 20, match: /^[a-z0-9-_]+$/,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
  bio: { type: String, maxlength: 500 },
  display: { type: String },
});

module.exports = mongoose.model('User', UserSchema);
