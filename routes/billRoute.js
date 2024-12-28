const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const protect = require('../middleware/auth');

router.use(protect);

router.post('/bills', billController.createBill);
router.get('/bills/:orderId', billController.getBill);


module.exports = router;
