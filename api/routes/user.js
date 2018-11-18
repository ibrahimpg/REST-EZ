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

// Login User
router.post('/login', UserControllers.login);

// Update User
router.patch('/update', authorization, upload.single('display'), UserControllers.update);

// Delete User
router.delete('/delete', authorization, UserControllers.delete);

module.exports = router;
