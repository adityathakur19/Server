const express = require('express');
const router = express.Router();
const billhistoryController = require('../controllers/billhistoryController');
const protect = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Bill routes
router.post('/billshistory', billhistoryController.createBillhistory);
router.get('/billshistory', billhistoryController.getBillshistory);
router.patch('/billshistory/:billId', billhistoryController.updateBillhistoryStatus);
router.get('/billshistory/stats', billhistoryController.getBillhistoryStats);
router.get('/billshistory/monthly-report', billhistoryController.getMonthlyReport);

module.exports = router;
