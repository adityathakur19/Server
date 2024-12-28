const mongoose = require('mongoose');
const { Schema } = mongoose;

// Expense item schema
const expenseItemSchema = new Schema({
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  modeOfPayment: { type: String, default: 'None' },
  status: { type: String, enum: ['Paid', 'Unpaid'], default: 'Unpaid' },
});

// Daily expense schema
const dailyExpenseSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  expenses: [expenseItemSchema],
  totalDailyExpense: {
    type: Number,
    default: 0,
  },
});

// Pre-save middleware to calculate the total daily expense
dailyExpenseSchema.pre('save', function (next) {
  this.totalDailyExpense = this.expenses.reduce((sum, expense) => sum + expense.totalPrice, 0);
  next();
});

const DailyExpense = mongoose.model('DailyExpense', dailyExpenseSchema);

module.exports = DailyExpense;
