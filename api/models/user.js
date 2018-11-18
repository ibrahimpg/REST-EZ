const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  /*
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 6,
    maxlength: 16,
    match: /^[a-z0-9-_]+$/,
  }, */
  name: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 20,
    // match: /^[a-z ,.'-]+$/i,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  password: { type: String, required: true },
  bio: { type: String, maxlength: 500 },
  display: { type: String, required: true },
  hash: { type: String },
  verified: false,
});

module.exports = mongoose.model('User', UserSchema);
