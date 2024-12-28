// heldBillsController.js
const HeldBill = require('../models/heldBillsModel');

const heldBillsController = {
  // Get all held bills for the user
  async getAllHeldBills(req, res) {
    try {
      const heldBills = await HeldBill.find({ user: req.user._id });
      res.json(heldBills);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get a specific held bill by table ID
  async getHeldBill(req, res) {
    try {
      const heldBill = await HeldBill.findOne({
        user: req.user._id,
        tableId: req.params.tableId
      });

      if (!heldBill) {
        return res.status(404).json({ message: 'No held bill found for this table' });
      }

      res.json(heldBill);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create or update a held bill
 

  // Delete a held bill
  async deleteHeldBill(req, res) {
    try {
      const result = await HeldBill.findOneAndDelete({
        user: req.user._id,
        tableId: req.params.tableId
      });

      if (!result) {
        return res.status(404).json({ message: 'No held bill found for this table' });
      }

      res.json({ message: 'Held bill deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Delete all held bills for a user
  async deleteAllHeldBills(req, res) {
    try {
      await HeldBill.deleteMany({ user: req.user._id });
      res.json({ message: 'All held bills deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  async createHeldBill(req, res) {
    try {
      const { items, tableNumber } = req.body;
      const tableId = req.params.tableId;
  
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Items array is required' });
      }
  
      if (!tableNumber) {
        return res.status(400).json({ message: 'Table number is required' });
      }
  
      // Store items with their original individual prices
      const processedItems = items.map(item => ({
        itemId: item.itemId,
        itemName: item.itemName,
        quantity: item.quantity,
        totalPrice: item.totalPrice  // Keep original price per item
      }));
  
      let heldBill = await HeldBill.findOne({
        user: req.user._id,
        tableId: tableId
      });
  
      if (heldBill) {
        heldBill.items = processedItems;
        heldBill.tableNumber = tableNumber;
        heldBill.updatedAt = Date.now();
        await heldBill.save();
      } else {
        const orderId = await HeldBill.generateOrderId();
        heldBill = await HeldBill.create({
          orderId,
          user: req.user._id,
          tableId: tableId,
          tableNumber: tableNumber,
          items: processedItems
        });
      }
  
      res.json(heldBill);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Get held bill by order ID
  async getHeldBillByOrderId(req, res) {
    try {
      const heldBill = await HeldBill.findOne({
        orderId: req.params.orderId,
        user: req.user._id
      });

      if (!heldBill) {
        return res.status(404).json({ message: 'No held bill found with this order ID' });
      }

      res.json(heldBill);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = heldBillsController;
