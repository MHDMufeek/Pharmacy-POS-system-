const mongoose = require('mongoose');

const SupplierSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    contactName: { type: String },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    notes: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Supplier', SupplierSchema);
