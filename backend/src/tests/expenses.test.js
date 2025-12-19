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

test('create and fetch expense', async () => {
  const User = require('../models/User');
  const hashed = await bcrypt.hash('pass', 8);
  const user = await User.create({ name: 'I', email: 'i@test', password: hashed });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

  const res = await request(app)
    .post('/api/expenses')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Electricity Bill', category: 'Utilities', amount: 1200, date: '2025-01-15', description: 'Monthly' })
    .expect(201);

  expect(res.body.name).toBe('Electricity Bill');

  const list = await request(app).get('/api/expenses').set('Authorization', `Bearer ${token}`).expect(200);
  expect(list.body.meta.total).toBe(1);
});

test('update and delete expense', async () => {
  const User = require('../models/User');
  const hashed = await bcrypt.hash('pass', 8);
  const user = await User.create({ name: 'I', email: 'i@test', password: hashed });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

  const res = await request(app)
    .post('/api/expenses')
    .set('Authorization', `Bearer ${token}`)
    .send({ name: 'Stationery', category: 'Supplies', amount: 500, date: '2025-02-01' })
    .expect(201);

  const id = res.body._id;

  const upd = await request(app)
    .put(`/api/expenses/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({ amount: 600 })
    .expect(200);

  expect(upd.body.amount).toBe(600);

  await request(app).delete(`/api/expenses/${id}`).set('Authorization', `Bearer ${token}`).expect(200);

  const list = await request(app).get('/api/expenses').set('Authorization', `Bearer ${token}`).expect(200);
  expect(list.body.meta.total).toBe(0);
});
