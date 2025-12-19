const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', ExpenseSchema);
