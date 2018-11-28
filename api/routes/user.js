// Modules
const express = require('express');
const multer = require('multer');

const router = express.Router();
const upload = multer({ dest: './temp/' });

// Middleware
const authorization = require('../middleware/authorization');

// Controllers
const UserControllers = require('../controllers/user');

// Register User
router.post('/register', UserControllers.register);

// Verify User
router.get('/verify/:hash', UserControllers.verify);

// Forgot Password
router.post('/forgot', UserControllers.forgot);

// Reset Password
router.post('/reset/:hash', UserControllers.reset);

// Change Password
router.post('/changepass', UserControllers.changepass);

// Login User
router.post('/login', UserControllers.login);

// Delete User
router.delete('/delete', authorization, UserControllers.delete);

module.exports = router;
