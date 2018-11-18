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
  const randomString = 'whatever';
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
exports.register = (req, res) => {
  User.find({ hash: req.params.hash }).exec()
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
