// billModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const billItemSchema = new Schema({
  itemName: String,
  quantity: Number,
  sellPrice: Number,
  totalPrice: Number
});

const billSchema = new Schema({
  orderId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  tableNumber: {
    type: Number,
    required: true
  },
  items: [billItemSchema],
  totalAmount: {
    type: Number,
    required: true
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;
