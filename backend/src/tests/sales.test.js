const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let mongod;
let app;

beforeAll(async () => {
  process.env.JWT_SECRET = 'testsecret';
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri, { dbName: 'test' });
  app = require('../app')();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const collections = Object.keys(mongoose.connection.collections);
  for (const c of collections) {
    await mongoose.connection.collections[c].deleteMany({});
  }
});

test('create sale decrements stock and returns 201', async () => {
  const User = require('../models/User');
  const Item = require('../models/Item');

  const hashed = await bcrypt.hash('pass', 8);
  const user = await User.create({ name: 'T', email: 't@test', password: hashed });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

  const item = await Item.create({ name: 'Drug A', price: 5, cost: 2, stock: 10 });

  const res = await request(app)
    .post('/api/sales')
    .set('Authorization', `Bearer ${token}`)
    .send({ items: [{ itemId: item._id.toString(), qty: 3 }] })
    .expect(201);

  expect(res.body.total).toBe(15);
  const fresh = await Item.findById(item._id).lean();
  expect(fresh.stock).toBe(7);
});

test('create sale fails with insufficient stock and does not change other stocks', async () => {
  const User = require('../models/User');
  const Item = require('../models/Item');

  const hashed = await bcrypt.hash('pass', 8);
  const user = await User.create({ name: 'T', email: 't2@test', password: hashed });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

  const itemA = await Item.create({ name: 'A', price: 5, cost: 2, stock: 2 });
  const itemB = await Item.create({ name: 'B', price: 3, cost: 1, stock: 5 });

  const res = await request(app)
    .post('/api/sales')
    .set('Authorization', `Bearer ${token}`)
    .send({ items: [{ itemId: itemA._id.toString(), qty: 3 }, { itemId: itemB._id.toString(), qty: 1 }] })
    .expect(400);

  const freshA = await Item.findById(itemA._id).lean();
  const freshB = await Item.findById(itemB._id).lean();
  expect(freshA.stock).toBe(2);
  expect(freshB.stock).toBe(5);
});
