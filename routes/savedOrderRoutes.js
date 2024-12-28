// routes/savedOrderRoutes.js
const express = require('express');
const router = express.Router();
const savedOrderController = require('../controllers/savedOrderController');
const protect = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Routes
router.post('/saved-orders', savedOrderController.saveOrder);
router.get('/saved-orders', savedOrderController.getSavedOrders);
router.get('/saved-orders/:id', savedOrderController.getSavedOrderById);
router.delete('/saved-orders/:id', savedOrderController.deleteSavedOrder);

module.exports = router;