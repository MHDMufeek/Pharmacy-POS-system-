const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../models/User');
const Item = require('../models/Item');
const Sale = require('../models/Sale');
const Creditor = require('../models/Creditor');

async function seed() {
  try {
    await mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to Mongo for seeding');

    // Clear selected collections
    await Promise.all([
      User.deleteMany({}),
      Item.deleteMany({}),
      Sale.deleteMany({}),
      Creditor.deleteMany({})
    ]);

    // Admin user
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const admin = new User({ name: 'Administrator', email: 'admin@local', password: adminPassword, role: 'admin' });
    await admin.save();
    console.log('Created admin: admin@local / Admin123!');

    // Sample items
    const items = [
      { name: 'Paracetamol 500mg', sku: 'MED-001', category: 'Pain Relief', price: 5.99, cost: 2.50, stock: 150 },
      { name: 'Amoxicillin 250mg', sku: 'MED-002', category: 'Antibiotics', price: 12.5, cost: 4.8, stock: 75 },
      { name: 'Vitamin C 1000mg', sku: 'MED-003', category: 'Supplements', price: 8.75, cost: 1.2, stock: 20 }
    ];
    const createdItems = await Item.insertMany(items);
    console.log(`Created ${createdItems.length} items`);

    // Sample sales
    const sale1 = new Sale({ items: [{ item: createdItems[0]._id, qty: 2, price: createdItems[0].price }], total: 2 * createdItems[0].price, createdBy: admin._id });
    await sale1.save();

    // Sample creditors
    const creditorsData = [
      { name: 'MedSupply Co.', contact: 'John Smith', email: 'john@medsupply.com', phone: '+15551234567', amount: 2500, dueDate: new Date(), status: 'Active', accountNumber: 'ACC-001', creditLimit: 10000, terms: 'Net 30', notes: 'Primary supplier' },
      { name: 'Pharma Distributors', contact: 'Sarah Johnson', email: 'sarah@pharmadist.com', phone: '+15559876543', amount: 4200, dueDate: new Date(), status: 'Overdue', accountNumber: 'ACC-002', creditLimit: 15000 }
    ];
    const createdCreditors = await Creditor.insertMany(creditorsData);
    console.log(`Created ${createdCreditors.length} creditors`);

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed', err);
    process.exit(1);
  }
}

seed();
