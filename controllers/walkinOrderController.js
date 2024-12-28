// walkinOrderController.js
const WalkinOrder = require('../models/walkinOrderModel');

const walkinOrderController = {
  // Get all walk-in orders
  async getWalkinOrders(req, res) {
    try {
      const orders = await WalkinOrder.find({ user: req.user._id })
        .sort({ createdAt: -1 });
      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get single walk-in order
  async getWalkinOrder(req, res) {
    try {
      const order = await WalkinOrder.findOne({
        _id: req.params.id,
        user: req.user._id
      });
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(order);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
 async createWalkinOrder(req, res) {
  try {
    const { 
      orderId, 
      selectedTable, 
      items, 
      totalAmount, 
      orderStatus,
      subTotal,
      sgst,
      cgst 
    } = req.body;

    // Validate required fields
    if (!orderId || !selectedTable || !items || totalAmount === undefined || 
        subTotal === undefined || sgst === undefined || cgst === undefined) {
      return res.status(400).json({
        message: 'Order ID, table, items, total amount, subtotal, SGST, and CGST are required'
      });
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: 'Items must be a non-empty array'
      });
    }

    // Validate item structure
    const validItems = items.every(item => 
      item.itemName && 
      typeof item.quantity === 'number' && 
      typeof item.price === 'number' && 
      typeof item.totalPrice === 'number'
    );

    if (!validItems) {
      return res.status(400).json({
        message: 'Each item must have itemName, quantity, price, and totalPrice'
      });
    }

    // Create new order
    const order = new WalkinOrder({
      user: req.user._id,
      orderId,
      selectedTable,
      items,
      subTotal,
      sgst,
      cgst,
      totalAmount,
      orderStatus: orderStatus || 'pending'
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
},
  // Update walk-in order
  async updateWalkinOrder(req, res) {
    try {
      const { orderStatus } = req.body;

      const order = await WalkinOrder.findOneAndUpdate(
        {
          _id: req.params.id,
          user: req.user._id
        },
        {
          orderStatus,
          updatedAt: Date.now()
        },
        {
          new: true,
          runValidators: true
        }
      );

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json(order);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Delete walk-in order
  async deleteWalkinOrder(req, res) {
    try {
      const order = await WalkinOrder.findOneAndDelete({
        _id: req.params.id,
        user: req.user._id
      });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.json({ message: 'Order deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = walkinOrderController;