
// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createPayment, getPayments } = require('../controllers/paymentController');
const protect = require('../middleware/auth');

router.use(protect);

router.post('/payments', createPayment);
router.get('/payments', getPayments);

module.exports = router;