const express = require('express');
const router = express.Router();
const tableController = require('../controllers/tableController');
const protect = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(protect);

// Table management routes
router.get('/tables', tableController.getTables);
router.post('/tables', tableController.createTable);
router.post('/tables/bulk', tableController.createBulkTables);
router.patch('/tables/:tableId/status', tableController.updateTableStatus);
router.delete('/tables/:tableId', tableController.deleteTable);

module.exports = router;