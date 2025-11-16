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

test('create and fetch item', async () => {
  const User = require('../models/User');
  const hashed = await bcrypt.hash('pass', 8);
  const user = await User.create({ name: 'I', email: 'i@test', password: hashed });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

  const res = await request(app)
    .post('/api/items')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Test Item', price: 2.5, cost: 1.0, stock: 50 })
    .expect(201);

  expect(res.body.name).toBe('Test Item');

  const list = await request(app).get('/api/items').set('Authorization', `Bearer ${token}`).expect(200);
  expect(list.body.meta.total).toBe(1);
});
