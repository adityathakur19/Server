const mongoose = require('mongoose');
const { Schema } = mongoose;

const savedOrderSchema = new Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  orderId: { 
    type: String, 
    required: true 
  },
  selectedTable: { 
    type: String, 
    required: true 
  },
  items: [{
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  cgst: {
    type: Number,
    required: true
  },
  sgst: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  orderStatus: {
    type: String,
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

const SavedOrder = mongoose.model('SavedOrder', savedOrderSchema);

module.exports = SavedOrder;