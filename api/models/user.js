const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  name: {
    type: String,
    required: true,
    maxlength: 20,
    match: /^[a-zA-Z\s]*$/,
  },
  password: { type: String, required: true },
  bio: { type: String, maxlength: 500 },
  display: { type: String },
  verified: { type: Boolean },
  hash: { type: String },
});

module.exports = mongoose.model('User', UserSchema);
