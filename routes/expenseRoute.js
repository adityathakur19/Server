const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const protect = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Basic CRUD routes
router.get('/expenses', expenseController.getExpenses);
router.post('/expenses', expenseController.createExpense);
router.patch('/expenses/:expenseId', expenseController.updateExpense);

// Additional analytics routes
router.get('/stats', expenseController.getExpenseStats);
router.get('/monthly-report', expenseController.getMonthlyReport);

module.exports = router;
