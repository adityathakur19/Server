const mongoose = require('mongoose');
const { Schema } = mongoose;

const tableSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tableNumber: { type: Number, required: true },
  status: { type: String, enum: ['Available', 'Occupied'], default: 'Available' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update the updatedAt timestamp
tableSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Table = mongoose.model('Table', tableSchema);

module.exports = Table;