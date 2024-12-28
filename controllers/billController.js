
// billController.js
const Bill = require('../models/billModel');

const billController = {
  createBill: async (req, res) => {
    try {
      const { orderId, tableNumber, items } = req.body;
      
      const processedItems = items.map(item => ({
        itemName: item.itemName,
        quantity: item.quantity,
        sellPrice: item.sellPrice,
        totalPrice: item.quantity * item.sellPrice
      }));

      const totalAmount = processedItems.reduce((sum, item) => sum + item.totalPrice, 0);

      const bill = new Bill({
        orderId,
        tableNumber,
        items: processedItems,
        totalAmount
      });

      await bill.save();
      res.status(201).json(bill);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  getBill: async (req, res) => {
    try {
      const bill = await Bill.findOne({ orderId: req.params.orderId });
      if (!bill) return res.status(404).json({ message: 'Bill not found' });
      
      res.json(bill);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = billController;