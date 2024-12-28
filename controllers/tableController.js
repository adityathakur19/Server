const Table = require('../models/tableModel');

const tableController = {
  // Get all tables
  async getTables(req, res) {
    try {
      const tables = await Table.find({ user: req.user._id })
        .sort({ tableNumber: 1 });
      res.json(tables);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create a single table
  async createTable(req, res) {
    try {
      const { tableNumber} = req.body;

      // Check if table number already exists for this user
      const existingTable = await Table.findOne({ 
        user: req.user._id, 
        tableNumber 
      });

      if (existingTable) {
        return res.status(400).json({ 
          message: 'Table number already exists' 
        });
      }

      const table = new Table({
        user: req.user._id,
        tableNumber,
        status: 'Available'
      });

      const savedTable = await table.save();
      res.status(201).json(savedTable);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Create multiple tables
async createBulkTables(req, res) {
    try {
      const { baseNumber, quantity } = req.body;
      
      // Validate input
      if (!baseNumber || !quantity ) {
        return res.status(400).json({ 
          message: 'All fields are required' 
        });
      }

      // Convert to numbers and validate
      const startNumber = parseInt(baseNumber);
      const tableCount = parseInt(quantity);

      if (tableCount <= 0 || tableCount > 50) {
        return res.status(400).json({ 
          message: 'Quantity must be between 1 and 50' 
        });
      }

      // Check for existing table numbers
      const lastTableNumber = startNumber + tableCount - 1;
      const existingTables = await Table.find({
        user: req.user._id,
        tableNumber: { 
          $gte: startNumber, 
          $lte: lastTableNumber 
        }
      });

      if (existingTables.length > 0) {
        return res.status(400).json({
          message: 'Some table numbers in this range already exist',
          conflictingNumbers: existingTables.map(t => t.tableNumber)
        });
      }

      // Create array of table objects
      const tablesToCreate = Array.from({ length: tableCount }, (_, index) => ({
        user: req.user._id,
        tableNumber: startNumber + index,
        status: 'Available'
      }));

      const savedTables = await Table.insertMany(tablesToCreate);
      res.status(201).json(savedTables);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Update table status
  async updateTableStatus(req, res) {
    try {
      const { status } = req.body;
      
      if (!['Available', 'Occupied'].includes(status)) {
        return res.status(400).json({ 
          message: 'Invalid status' 
        });
      }

      const table = await Table.findOneAndUpdate(
        { _id: req.params.tableId, user: req.user._id },
        { status },
        { new: true }
      );

      if (!table) {
        return res.status(404).json({ message: 'Table not found' });
      }

      res.json(table);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Delete table
  async deleteTable(req, res) {
    try {
      const table = await Table.findOneAndDelete({
        _id: req.params.tableId,
        user: req.user._id
      });

      if (!table) {
        return res.status(404).json({ message: 'Table not found' });
      }

      res.json({ message: 'Table deleted' });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

module.exports = tableController;