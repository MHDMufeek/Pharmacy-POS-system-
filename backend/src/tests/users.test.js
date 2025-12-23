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

test('user can change own password with current password', async () => {
  const User = require('../models/User');
  const hashed = await bcrypt.hash('oldpass', 8);
  const user = await User.create({ name: 'User A', email: 'a@test', password: hashed });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

  // attempt change
  const res = await request(app)
    .post(`/api/users/${user._id}/password`)
    .set('Authorization', `Bearer ${token}`)
    .send({ currentPassword: 'oldpass', newPassword: 'newpass1' })
    .expect(200);

  // backend should return a fresh token and user when self-changing
  expect(res.body.token).toBeTruthy();
  expect(res.body.user && res.body.user.id).toBeTruthy();

  // token must be valid and return the current user
  const me = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${res.body.token}`).expect(200);
  expect(me.body.user.id).toBe(String(user._id));

  const fresh = await User.findById(user._id);
  const ok = await bcrypt.compare('newpass1', fresh.password);
  expect(ok).toBe(true);
});

test('user cannot change own password with wrong current password', async () => {
  const User = require('../models/User');
  const hashed = await bcrypt.hash('oldpass', 8);
  const user = await User.create({ name: 'User B', email: 'b@test', password: hashed });
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

  await request(app)
    .post(`/api/users/${user._id}/password`)
    .set('Authorization', `Bearer ${token}`)
    .send({ currentPassword: 'wrong', newPassword: 'newpass' })
    .expect(401);
});

test('admin can change another user password without current password', async () => {
  const User = require('../models/User');
  const hashed = await bcrypt.hash('oldpass', 8);
  const user = await User.create({ name: 'User C', email: 'c@test', password: hashed });

  const adminHashed = await bcrypt.hash('adminpass', 8);
  const admin = await User.create({ name: 'Admin', email: 'admin@test', password: adminHashed, role: 'admin' });
  const adminToken = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET);

  await request(app)
    .post(`/api/users/${user._id}/password`)
    .set('Authorization', `Bearer ${adminToken}`)
    .send({ newPassword: 'changed-by-admin' })
    .expect(200);

  const fresh = await User.findById(user._id);
  const ok = await bcrypt.compare('changed-by-admin', fresh.password);
  expect(ok).toBe(true);
});
