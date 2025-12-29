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

test('create and fetch invoice', async () => {
  const User = require('../models/User');
  const hashed = await bcrypt.hash('pass', 8);
  const user = await User.create({ name: 'I', email: 'i@test', password: hashed });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

  const payload = {
    supplierId: 'SUP-001',
    supplierName: 'Test Supplier',
    date: '2025-01-01',
    dueDate: '2025-01-15',
    items: [{ description: 'Item 1', quantity: 2, unitPrice: 5, total: 10 }],
    subtotal: 10,
    discount: 0,
    totalAmount: 10,
    status: 'pending'
  };

  const res = await request(app)
    .post('/api/invoices')
    .set('Authorization', `Bearer ${token}`)
    .send(payload)
    .expect(201);

  expect(res.body.supplierId).toBe(payload.supplierId);

  const list = await request(app).get('/api/invoices').set('Authorization', `Bearer ${token}`).expect(200);
  expect(list.body.meta.total).toBe(1);
});

test('update and delete invoice', async () => {
  const User = require('../models/User');
  const hashed = await bcrypt.hash('pass', 8);
  const user = await User.create({ name: 'I', email: 'i@test', password: hashed });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

  const payload = {
    supplierId: 'SUP-001',
    supplierName: 'Test Supplier',
    date: '2025-01-01',
    items: [{ description: 'Item 1', quantity: 2, unitPrice: 5, total: 10 }],
    subtotal: 10,
    totalAmount: 10,
    status: 'pending'
  };

  const res = await request(app).post('/api/invoices').set('Authorization', `Bearer ${token}`).send(payload).expect(201);
  const id = res.body._id;

  const upd = await request(app).put(`/api/invoices/${id}`).set('Authorization', `Bearer ${token}`).send({ status: 'paid' }).expect(200);
  expect(upd.body.status).toBe('paid');

  await request(app).delete(`/api/invoices/${id}`).set('Authorization', `Bearer ${token}`).expect(200);

  const list = await request(app).get('/api/invoices').set('Authorization', `Bearer ${token}`).expect(200);
  expect(list.body.meta.total).toBe(0);
});

test('record payment and mark invoice paid', async () => {
  const User = require('../models/User');
  const hashed = await bcrypt.hash('pass', 8);
  const user = await User.create({ name: 'P', email: 'p@test', password: hashed });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

  const payload = {
    supplierId: 'SUP-002',
    supplierName: 'Pay Supplier',
    date: '2025-02-01',
    items: [{ description: 'Item A', quantity: 1, unitPrice: 20, total: 20 }],
    subtotal: 20,
    totalAmount: 20,
    status: 'pending'
  };

  const res = await request(app).post('/api/invoices').set('Authorization', `Bearer ${token}`).send(payload).expect(201);
  const id = res.body._id;

  const payRes = await request(app).post(`/api/invoices/${id}/pay`).set('Authorization', `Bearer ${token}`).send({ amount: 20, method: 'cash', reference: 'TXN123' }).expect(200);
  expect(payRes.body.message).toBe('Payment recorded');
  expect(payRes.body.data.status).toBe('paid');
  expect(Array.isArray(payRes.body.data.payments)).toBe(true);
  expect(payRes.body.data.payments.length).toBe(1);
  expect(payRes.body.data.payments[0].amount).toBe(20);
});

test('partial payment does not mark paid unless total reached', async () => {
  const User = require('../models/User');
  const hashed = await bcrypt.hash('pass', 8);
  const user = await User.create({ name: 'Q', email: 'q@test', password: hashed });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

  const payload = {
    supplierId: 'SUP-003',
    supplierName: 'Partial Supplier',
    date: '2025-03-01',
    items: [{ description: 'Item B', quantity: 1, unitPrice: 50, total: 50 }],
    subtotal: 50,
    totalAmount: 50,
    status: 'pending'
  };

  const res = await request(app).post('/api/invoices').set('Authorization', `Bearer ${token}`).send(payload).expect(201);
  const id = res.body._id;

  const payRes = await request(app).post(`/api/invoices/${id}/pay`).set('Authorization', `Bearer ${token}`).send({ amount: 20, method: 'card' }).expect(200);
  expect(payRes.body.message).toBe('Payment recorded');
  expect(payRes.body.data.status).toBe('pending');
  expect(payRes.body.data.payments.length).toBe(1);
  expect(payRes.body.data.payments[0].amount).toBe(20);
});