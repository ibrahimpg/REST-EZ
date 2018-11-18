/* eslint-disable no-underscore-dangle */
// Modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
// const nodemailer = require('nodemailer');

// Models
const User = require('../models/user');

// Register User
exports.register = (req, res) => {
  User.find({ email: req.body.email }).exec()
    .then((user) => {
      if (user.length >= 1 || req.body.password.length < 6) {
        return res.status(400).json({ message: 'Registration failed.' });
      }
      return cloudinary.v2.uploader.upload('./temp/placeholder.jpg',
        { public_id: req.body.email, tags: [req.body.email] })
        .then(result => new User({
          _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 10),
          bio: 'Bio...',
          display: result.secure_url,
        }).save())
        .then(() => res.status(201).json('User created.'));
    })
    .catch(() => res.status(500).json({ message: 'Reg failed.' }));
};

// Verify User
exports.verify = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (bcrypt.compareSync(req.params.hash, user.hash) === true) {
        return User.findByIdAndUpdate(req.tokenData.id, { verified: true }, { runValidators: true })
          .then(() => res.json('Verification successful.'))
          .catch(() => res.status(500));
      }
      return res.json('Verification failed.');
    })
    .catch(() => res.status(500).json({ message: 'Reg failed.' }));
};

// Login User
exports.login = (req, res) => {
  User.findOne({ email: req.body.email }).exec()
    .then((user) => {
      if (bcrypt.compareSync(req.body.password, user.password) === true) {
        const token = jwt.sign({ name: user.name, id: user._id }, process.env.JWT_KEY, { expiresIn: '12h' });
        return res.json({
          message: 'Login successful.', token, name: user.name, id: user._id,
        });
      }
      return res.status(400).json({ message: 'Login failed.' });
    })
    .catch(() => res.status(500).json({ message: 'Login failed.' }));
};

// Update User
exports.update = (req, res) => {
  if (req.file == null) {
    return User
      .findByIdAndUpdate(req.tokenData.id, { bio: req.body.bio }, { runValidators: true })
      .then(() => res.json('User updated.'))
      .catch(() => res.status(500));
  }
  return cloudinary.v2.uploader.upload(req.file.path, {
    public_id: req.tokenData.id, invalidate: true, format: 'jpg', tags: [req.tokenData.id],
  })
    .then(result => User.findByIdAndUpdate(req.tokenData.id,
      { bio: req.body.bio || ' ', display: result.secure_url }, { runValidators: true }))
    .then(() => res.json('User updated.'))
    .catch(() => res.status(500));
};

// Delete User
exports.delete = (req, res) => {
  User.findByIdAndDelete(req.tokenData.id)
    .then(() => res.json('User deleted.'))
    .catch(() => res.status(500));
};
