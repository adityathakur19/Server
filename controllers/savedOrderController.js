const SavedOrder = require('../models/savedOrderModel');

const savedOrderController = {
  // Save an order
  async saveOrder(req, res) {
    try {
      const { 
        orderId, 
        selectedTable, 
        items, 
        subtotal,
        cgst,
        sgst,
        totalAmount, 
        orderStatus 
      } = req.body;

      // Validate required fields
      if (!orderId || !selectedTable || !items || !subtotal || !cgst || !sgst || !totalAmount || !orderStatus) {
        return res.status(400).json({ 
          message: 'Missing required fields',
          required: 'orderId, selectedTable, items, subtotal, cgst, sgst, totalAmount, orderStatus'
        });
      }

      const savedOrder = new SavedOrder({
        user: req.user._id,
        orderId,
        selectedTable,
        items,
        subtotal,
        cgst,
        sgst,
        totalAmount,
        orderStatus
      });

      await savedOrder.save();
      res.status(201).json(savedOrder);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Get all saved orders for a user
  async getSavedOrders(req, res) {
    try {
      const savedOrders = await SavedOrder.find({ user: req.user._id })
        .sort({ savedAt: -1 });
      res.json(savedOrders);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get a single saved order by ID
  async getSavedOrderById(req, res) {
    try {
      const savedOrder = await SavedOrder.findOne({
        _id: req.params.id,
        user: req.user._id
      });

      if (!savedOrder) {
        return res.status(404).json({ message: 'Saved order not found' });
      }

      res.json(savedOrder);
    } catch (err) {
      // Handle invalid ObjectId format
      if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid order ID format' });
      }
      res.status(500).json({ message: err.message });
    }
  },

  // Delete a saved order
  async deleteSavedOrder(req, res) {
    try {
      const savedOrder = await SavedOrder.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      });

      if (!savedOrder) {
        return res.status(404).json({ message: 'Saved order not found' });
      }

      res.json({ message: 'Saved order deleted' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = savedOrderController;