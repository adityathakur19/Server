const DailyExpense = require('../models/expenseModel');

const expenseController = {
  // Get all expenses with filters
  async getExpenses(req, res) {
    try {
      const { startDate, endDate, minAmount, maxAmount } = req.query;
      let query = { user: req.user._id };

      if (startDate && endDate) {
        query.date = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      if (minAmount || maxAmount) {
        query.totalDailyExpense = {};
        if (minAmount) query.totalDailyExpense.$gte = parseFloat(minAmount);
        if (maxAmount) query.totalDailyExpense.$lte = parseFloat(maxAmount);
      }

      const expenses = await DailyExpense.find(query)
        .sort({ date: -1 })
        .limit(100);

      const flattenedExpenses = expenses.flatMap((dailyExpense) =>
        dailyExpense.expenses.map((expense) => ({
          ...expense.toObject(),
          _id: expense._id,
          date: dailyExpense.date,
        }))
      );

      res.json(flattenedExpenses);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Create a new expense
  async createExpense(req, res) {
    try {
      const { item, quantity, price, totalPrice, modeOfPayment } = req.body;

      // Validate required fields
      if (!item || !quantity || !price || !totalPrice) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      let dailyExpense = await DailyExpense.findOne({
        user: req.user._id,
        date: {
          $gte: today,
          $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      });

      if (!dailyExpense) {
        dailyExpense = new DailyExpense({
          user: req.user._id,
          date: today,
          expenses: [],
        });
      }

      const newExpenseItem = {
        item,
        quantity,
        price,
        totalPrice,
        modeOfPayment: modeOfPayment || 'None',
        status: modeOfPayment === 'None' ? 'Unpaid' : 'Paid',
      };

      dailyExpense.expenses.push(newExpenseItem);
      dailyExpense.totalDailyExpense += newExpenseItem.totalPrice; // Manually update totalDailyExpense
      await dailyExpense.save();

      const addedExpense = dailyExpense.expenses[dailyExpense.expenses.length - 1];

      res.status(201).json({
        ...addedExpense.toObject(),
        date: dailyExpense.date,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Update an expense
  async updateExpense(req, res) {
    try {
      const dailyExpense = await DailyExpense.findOne({
        user: req.user._id,
        'expenses._id': req.params.expenseId,
      });

      if (!dailyExpense) {
        return res.status(404).json({ message: 'Expense not found' });
      }

      const expenseItem = dailyExpense.expenses.id(req.params.expenseId);

      Object.keys(req.body).forEach((key) => {
        if (key !== '_id' && key !== 'date') {
          expenseItem[key] = req.body[key];
        }
      });

      if (req.body.modeOfPayment) {
        expenseItem.status = req.body.modeOfPayment === 'None' ? 'Unpaid' : 'Paid';
      }

      await dailyExpense.save();

      res.json({
        ...expenseItem.toObject(),
        date: dailyExpense.date,
      });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  // Get statistics for all expenses
  async getExpenseStats(req, res) {
    try {
      const stats = await DailyExpense.aggregate([
        { $match: { user: req.user._id } },
        { $unwind: '$expenses' },
        {
          $group: {
            _id: null,
            totalExpenses: { $sum: '$expenses.totalPrice' },
            avgExpense: { $avg: '$expenses.totalPrice' },
            maxExpense: { $max: '$expenses.totalPrice' },
            minExpense: { $min: '$expenses.totalPrice' },
            count: { $sum: 1 },
          },
        },
      ]);

      res.json(stats[0] || {
        totalExpenses: 0,
        avgExpense: 0,
        maxExpense: 0,
        minExpense: 0,
        count: 0,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Get a monthly report of expenses
  async getMonthlyReport(req, res) {
    try {
      const monthlyStats = await DailyExpense.aggregate([
        { $match: { user: req.user._id } },
        { $unwind: '$expenses' },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
            },
            totalAmount: { $sum: '$expenses.totalPrice' },
            expenseCount: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
      ]);

      res.json(monthlyStats);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = expenseController;
