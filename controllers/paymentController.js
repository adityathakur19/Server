
// controllers/paymentController.js
const Payment = require('../models/paymentModel');

const createPayment = async (req, res) => {
  try {
    const { orderId, tableNumber, items, total, paymentMethod, paymentStatus } = req.body;
    
    const payment = new Payment({
      orderId,
      tableNumber,
      items,
      total,
      paymentMethod,
      paymentStatus,
      paymentDate: new Date()
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPayment,
  getPayments
};

