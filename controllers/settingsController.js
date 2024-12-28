// settingsController.js
const Settings = require('../models/settingsModel');

const settingsController = {
  // Get settings
  async getSettings(req, res) {
    try {
      let settings = await Settings.findOne({ user: req.user._id });
      
      if (!settings) {
        settings = {
          restaurantName: '',
          phoneNumber: '',
          gstin: '',
          businessEmail: '',
          note: 'Thank you Visit Again'
        };
      }
      
      res.json(settings);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Update or create settings
  async updateSettings(req, res) {
    try {
      const { restaurantName, phoneNumber, gstin, businessEmail, note } = req.body;

      // Validate required fields
      if (!restaurantName || !phoneNumber) {
        return res.status(400).json({ 
          message: 'Restaurant name and phone number are required' 
        });
      }

      // Validate phone number format
      if (!/^\d{10}$/.test(phoneNumber)) {
        return res.status(400).json({ 
          message: 'Invalid phone number format' 
        });
      }

      // Validate GSTIN if provided
      if (gstin && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/.test(gstin)) {
        return res.status(400).json({ 
          message: 'Invalid GSTIN format' 
        });
      }

      // Validate email if provided
      if (businessEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail)) {
        return res.status(400).json({ 
          message: 'Invalid email format' 
        });
      }

      const settings = await Settings.findOneAndUpdate(
        { user: req.user._id },
        {
          user: req.user._id,
          restaurantName,
          phoneNumber,
          gstin: gstin || '',
          businessEmail: businessEmail || '',
          note: note || 'Thank you Visit Again',
          updatedAt: Date.now()
        },
        { 
          new: true, 
          upsert: true, 
          runValidators: true 
        }
      );

      res.json(settings);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

module.exports = settingsController;