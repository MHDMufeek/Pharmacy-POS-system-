const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env') });
const config = require('../src/config');

async function run() {
  try {
    await mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to', config.MONGO_URI);

    const conn = mongoose.connection;
    const collections = Object.keys(conn.collections);
    console.log('Collections found:', collections);

    const modelsToCheck = ['items', 'customerreturns', 'users', 'sales', 'suppliers'];
    for (const name of modelsToCheck) {
      try {
        const coll = conn.collection(name);
        const count = await coll.countDocuments();
        console.log(`- ${name}: ${count} documents`);
        if (count > 0) {
          const sample = await coll.find().limit(3).toArray();
          console.log('  sample:', sample.map(d => ({ _id: d._id, ...Object.fromEntries(Object.entries(d).filter(([k]) => k !== '_id' && k !== 'binary')) }))); 
        }
      } catch (err) {
        console.log(`- ${name}: (error reading collection)`, err.message);
      }
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('DB check failed:', err.message);
    process.exit(1);
  }
}

run();
