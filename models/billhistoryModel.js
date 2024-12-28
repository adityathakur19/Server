const mongoose = require('mongoose');
const { Schema } = mongoose;

const billItemSchema = new Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
});

const billhistorySchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: String, required: true },
  tableNumber: { type: String, required: true },
  items: [billItemSchema],
  totalAmount: { type: Number, required: true },
  customerName: { type: String, default: 'Guest' },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Cancelled'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI'],
    default: 'Cash'
  },
  date: { type: Date, default: Date.now },
  orderDate: { type: Date, required: true }
}, {
  timestamps: true
});

const BillHistory = mongoose.model('BillHistory', billhistorySchema);

module.exports = BillHistory;