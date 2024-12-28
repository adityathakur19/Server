// Update heldBillsRoute.js to add new route
const express = require('express');
const router = express.Router();
const heldBillsController = require('../controllers/heldBillsController');
const protect = require('../middleware/auth');

// Apply authentication middleware
router.use(protect);

// Existing routes...
router.get('/held-bills', heldBillsController.getAllHeldBills);
router.get('/held-bills/:tableId', heldBillsController.getHeldBill);
router.post('/held-bills/:tableId', heldBillsController.createHeldBill);
router.delete('/held-bills/:tableId', heldBillsController.deleteHeldBill);
router.delete('/held-bills', heldBillsController.deleteAllHeldBills);

// New route for fetching by order ID
router.get('/held-bills/order/:orderId', heldBillsController.getHeldBillByOrderId);

module.exports = router;