const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const config = require('../src/config');
const Invoice = require('../src/models/Invoice');
const Item = require('../src/models/Item');

async function seedInvoices() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to MongoDB');

    const count = await Invoice.countDocuments();
    if (count > 0) {
      console.log('Invoices already exist; skipping seed');
      process.exit(0);
    }

    const items = await Item.find().limit(3).lean();
    const sampleInvoice = {
      supplierId: 'SUP-SEED',
      supplierName: 'Seed Supplier Co.',
      date: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'pending',
      items: items.length ? items.map(it => ({ description: it.name, quantity: 2, unitPrice: it.price || 1, total: (it.price || 1) * 2 })) : [{ description: 'Sample Item', quantity: 1, unitPrice: 10, total: 10 }],
      subtotal: items.length ? items.reduce((s, it) => s + ((it.price || 1) * 2), 0) : 10,
      tax: 0,
      discount: 0,
      totalAmount: items.length ? items.reduce((s, it) => s + ((it.price || 1) * 2), 0) : 10,
      notes: 'Seed invoice'
    };

    await Invoice.create(sampleInvoice);
    console.log('Inserted sample invoice');
    process.exit(0);
  } catch (err) {
    console.error('Seeding invoices failed', err);
    process.exit(1);
  }
}

seedInvoices();