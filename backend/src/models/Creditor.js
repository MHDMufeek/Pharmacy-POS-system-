const mongoose = require('mongoose');

const PaymentHistorySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  amount: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['Paid','Pending','Overdue'], default: 'Pending' },
  reference: { type: String }
}, { _id: false });

const CreditorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contact: { type: String },
    email: { type: String },
    phone: { type: String },
    amount: { type: Number, default: 0 },
    dueDate: { type: Date },
    status: { type: String, enum: ['Active','Overdue','Paid'], default: 'Active' },
    accountNumber: { type: String },
    creditLimit: { type: Number, default: 0 },
    terms: { type: String },
    notes: { type: String },
    history: { type: [PaymentHistorySchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Creditor', CreditorSchema);
