// walkinOrderRoute.js
const express = require('express');
const router = express.Router();
const walkinOrderController = require('../controllers/walkinOrderController');
const protect = require('../middleware/auth');

// Apply authentication middleware
router.use(protect);

// Walk-in order routes
router.get('/walkin-orders', walkinOrderController.getWalkinOrders);
router.get('/walkin-orders/:id', walkinOrderController.getWalkinOrder);
router.post('/walkin-orders', walkinOrderController.createWalkinOrder);
router.patch('/walkin-orders/:id', walkinOrderController.updateWalkinOrder);
router.delete('/walkin-orders/:id', walkinOrderController.deleteWalkinOrder);

module.exports = router;