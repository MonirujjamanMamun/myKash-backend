const express = require('express');
const { register, login, logout } = require('../controllers/authController');

const router = express.Router();

// User Registration
router.post('/register', register);

// User Login
router.post('/login', login);

// User Logout Route
router.post('/logout', logout);
module.exports = router;
