const mongoose = require('mongoose');

const ReturnItemSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true },
  reason: { type: String },
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
  supplierName: { type: String }
});

const CustomerReturnSchema = new mongoose.Schema(
  {
    saleRef: { type: String },
    items: { type: [ReturnItemSchema], required: true },
    totalRefund: { type: Number, required: true, default: 0 },
    customer: { type: String },
    status: { type: String, enum: ['Pending', 'Processing', 'Completed', 'Rejected', 'Returned'], default: 'Pending' },
    refundMethod: { type: String },
    notes: { type: String },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('CustomerReturn', CustomerReturnSchema);
