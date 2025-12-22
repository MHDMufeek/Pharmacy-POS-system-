const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });

const CustomerReturn = require('../src/models/CustomerReturn');
const Item = require('../src/models/Item');
const config = require('../src/config');

async function initDB() {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Check if items exist
    const itemCount = await Item.countDocuments();
    if (itemCount === 0) {
      console.log('⚠ No items in database. Please seed items first.');
    } else {
      console.log(`✓ Found ${itemCount} items`);
    }

    // Create sample customer returns
    const existingReturns = await CustomerReturn.countDocuments();
    if (existingReturns === 0) {
      // Get some items to reference
      const items = await Item.find().limit(3).lean();
      
      if (items.length > 0) {
        const sampleReturns = [
          {
            customer: 'John Smith',
            items: [
              {
                item: items[0]._id,
                name: items[0].name,
                qty: 2,
                price: items[0].price || 10,
                reason: 'Expired'
              }
            ],
            totalRefund: (items[0].price || 10) * 2,
            status: 'Completed',
            refundMethod: 'cash',
            notes: 'Sample return'
          },
          {
            customer: 'Maria Garcia',
            items: [
              {
                item: items[1]._id,
                name: items[1].name,
                qty: 1,
                price: items[1].price || 15,
                reason: 'Damaged'
              }
            ],
            totalRefund: items[1].price || 15,
            status: 'Pending',
            refundMethod: 'cash',
            notes: 'Damaged packaging'
          }
        ];

        if (items.length > 2) {
          sampleReturns.push({
            customer: 'Robert Johnson',
            items: [
              {
                item: items[2]._id,
                name: items[2].name,
                qty: 3,
                price: items[2].price || 8,
                reason: 'Wrong Medicine'
              }
            ],
            totalRefund: (items[2].price || 8) * 3,
            status: 'Processing',
            refundMethod: 'credit',
            notes: 'Wrong item sent'
          });
        }

        await CustomerReturn.insertMany(sampleReturns);
        console.log(`✓ Inserted ${sampleReturns.length} sample returns`);
      } else {
        console.log('⚠ Need at least one item to create sample returns');
      }
    } else {
      console.log(`✓ Found ${existingReturns} existing returns`);
    }

    console.log('✓ Database initialization complete');
    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

initDB();
