// settingsRoute.js
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const protect = require('../middleware/auth');

// Apply authentication middleware
router.use(protect);

// Settings routes
router.get('/settings', settingsController.getSettings);
router.post('/settings', settingsController.updateSettings);

module.exports = router;