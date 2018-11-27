/* eslint-disable no-underscore-dangle */
// Modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
const nodemailer = require('nodemailer');

// Models
const User = require('../models/user');

// Register User
exports.register = (req, res) => {
  const randomString = Math.random().toString(36).substring(2, 15)
  + Math.random().toString(36).substring(2, 15);
  User.find({ email: req.body.email }).exec()
    .then((user) => {
      if (user.length >= 1 || req.body.password.length < 6) {
        return res.status(400).json({ message: 'Registration failed.' });
      }
      return cloudinary.v2.uploader.upload('./temp/placeholder.jpg')
        .then(result => new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          name: req.body.name,
          password: bcrypt.hashSync(req.body.password, 10),
          bio: 'Bio...',
          display: result.secure_url,
          verified: false,
          hash: randomString,
        }).save())
        .then(() => {
          const transporter = nodemailer.createTransport({
            service: 'Outlook365',
            auth: { user: 'ibrahimpg@outlook.com', pass: process.env.EMAIL_PW },
          });
          transporter.sendMail({
            from: '"Ibrahim P.G." <ibrahimpg@outlook.com>',
            to: req.body.email,
            subject: 'Automatic reply from Ibrahim P.G.',
            text: `
        ${req.body.name},
        Please click on the link below in order to verify your email.
        ---    
        ${process.env.SERVER_URL}/user/verify/${randomString}
        `,
          });
        })
        .then(() => res.status(201).json('User created.'));
    })
    .catch(() => res.status(500));
};

// Verify User
exports.verify = (req, res) => {
  User.findOne({ hash: req.params.hash }).exec()
    .then((user) => {
      if (user.length === 0) {
        return res.status(400).json({ message: 'Verification failed.' });
      }
      return User.findByIdAndUpdate(user._id,
        { verified: true }, { runValidators: true })
        .then(() => res.json('Verification success.'));
    })
    .catch(() => res.status(500));
};

// Forgot Password
exports.forgot = (req, res) => {
  const randomString = Math.random().toString(36).substring(2, 15)
  + Math.random().toString(36).substring(2, 15);
  User.findOne({ email: req.body.email }).exec()
    .then((user) => {
      if (user.length === 0 || user.verified === false) {
        return res.status(400).json('Email does not exist on record or is not yet verified.');
      }
      return User.findByIdAndUpdate(user._id,
        { hash: randomString }, { runValidators: true })
        .then(() => {
          const transporter = nodemailer.createTransport({
            service: 'Outlook365',
            auth: { user: 'ibrahimpg@outlook.com', pass: process.env.EMAIL_PW },
          });
          transporter.sendMail({
            from: '"Ibrahim P.G." <ibrahimpg@outlook.com>',
            to: req.body.email,
            subject: 'Automatic reply from Ibrahim P.G.',
            text: `
        ${user.name},
        Please click on the link below in order to reset your password.
        ---    
        ${process.env.SERVER_URL}/user/reset/${randomString}
        `,
          });
        })
        .then(() => res.status(201).json('Instructions on password reset sent to email.'));
    })
    .catch(() => res.status(500));
};

// Reset Password
exports.reset = (req, res) => {
  const randomString = Math.random().toString(36).substring(2, 15)
  + Math.random().toString(36).substring(2, 15);
  User.findOne({ hash: req.params.hash }).exec()
    .then((user) => {
      if (user.length === 0) {
        return res.status(400).json({ message: 'Reset failed.' });
      }
      return User.findByIdAndUpdate(user._id,
        { password: bcrypt.hashSync(randomString, 10) }, { runValidators: true })
        .then(() => {
          const transporter = nodemailer.createTransport({
            service: 'Outlook365',
            auth: { user: 'ibrahimpg@outlook.com', pass: process.env.EMAIL_PW },
          });
          transporter.sendMail({
            from: '"Ibrahim P.G." <ibrahimpg@outlook.com>',
            to: req.body.email,
            subject: 'Automatic reply from Ibrahim P.G.',
            text: `
        ${user.name},
        Use this password to log in to your account and then immediately change your password please.
        ---    
        ${randomString}
        `,
          });
        })
        .then(() => res.status(201).json('Temporary password sent by email.'));
    })
    .catch(() => res.status(500));
};

// Change Password
exports.changepass = (req, res) => {
  // Work in progress
};

// Login User
exports.login = (req, res) => {
  User.findOne({ email: req.body.email }).exec()
    .then((user) => {
      if (bcrypt.compareSync(req.body.password, user.password) === true) {
        const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY, { expiresIn: '12h' });
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
    public_id: req.tokenData.username, invalidate: true, format: 'jpg', tags: [req.tokenData.username],
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
