// settingsModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const settingsSchema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  restaurantName: { 
    type: String, 
    required: true 
  },
  phoneNumber: { 
    type: String, 
    required: true,
    match: /^\d{10}$/ 
  },
  gstin: { 
    type: String,
    match: /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/,
    default: '' 
  },
  businessEmail: { 
    type: String,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    default: '' 
  },
  note: { 
    type: String, 
    default: 'Thank you Visit Again' 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;