
// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, verifyOTP, resetPassword } = require('../controllers/userController');
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

module.exports = router;