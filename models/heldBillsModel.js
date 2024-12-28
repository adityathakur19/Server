// heldBillsModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const heldBillItemSchema = new Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

const heldBillSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tableId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    required: true,
    unique: true
  },
  tableNumber: {  // Add this field
    type: Number,
    required: true
  },
  items: [heldBillItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Function to generate order ID
heldBillSchema.statics.generateOrderId = async function() {
  const date = new Date();
  const dateStr = date.getFullYear().toString().slice(-2) +
                 (date.getMonth() + 1).toString().padStart(2, '0') +
                 date.getDate().toString().padStart(2, '0');
  
  // Generate random 4 digit number
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  
  const orderId = `ORDW${dateStr}-${randomNum}`;
  
  // Check if order ID already exists
  const existingOrder = await this.findOne({ orderId });
  if (existingOrder) {
    // If exists, try generating again
    return this.generateOrderId();
  }
  
  return orderId;
};

const HeldBill = mongoose.model('HeldBill', heldBillSchema);

module.exports = HeldBill;