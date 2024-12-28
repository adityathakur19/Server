const Bill = require('../models/billhistoryModel');

const billhistoryController = {
  // Existing methods remain unchanged
  async createBillhistory(req, res) {
    try {
      const billhistoryData = {
        ...req.body,
        user: req.user._id
      };

      const billhistory = new Bill(billhistoryData);
      await billhistory.save();

      res.status(201).json(billhistory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async getBillshistory(req, res) {
    try {
      const { startDate, endDate, paymentStatus, paymentMethod } = req.query;
      let query = { user: req.user._id };

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }

      if (paymentStatus) {
        query.paymentStatus = paymentStatus;
      }

      if (paymentMethod) {
        query.paymentMethod = paymentMethod;
      }

      const billshistory = await Bill.find(query)
        .sort({ date: -1 })
        .limit(100);

      res.json(billshistory);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  async updateBillhistoryStatus(req, res) {
    try {
      const { paymentStatus, paymentMethod } = req.body;
      const billhistory = await Bill.findOneAndUpdate(
        { _id: req.params.billId, user: req.user._id },
        { paymentStatus, paymentMethod },
        { new: true }
      );

      if (!billhistory) {
        return res.status(404).json({ message: 'Bill not found' });
      }

      res.json(billhistory);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Updated stats method to match expense controller
  async getBillhistoryStats(req, res) {
    try {
      const stats = await Bill.aggregate([
        { $match: { user: req.user._id } },
        {
          $group: {
            _id: null,
            totalExpenses: { $sum: '$totalAmount' },
            avgExpense: { $avg: '$totalAmount' },
            maxExpense: { $max: '$totalAmount' },
            minExpense: { $min: '$totalAmount' },
            count: { $sum: 1 },
            paidBills: {
              $sum: {
                $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, 1, 0]
              }
            }
          }
        }
      ]);

      res.json(stats[0] || {
        totalExpenses: 0,
        avgExpense: 0,
        maxExpense: 0,
        minExpense: 0,
        count: 0,
        paidBills: 0
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // New monthly report method similar to expense controller
  async getMonthlyReport(req, res) {
    try {
      const monthlyStats = await Bill.aggregate([
        { $match: { user: req.user._id } },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' }
            },
            totalAmount: { $sum: '$totalAmount' },
            billCount: { $sum: 1 },
            paidBills: {
              $sum: {
                $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, 1, 0]
              }
            }
          }
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } }
      ]);

      res.json(monthlyStats);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
};

module.exports = billhistoryController;