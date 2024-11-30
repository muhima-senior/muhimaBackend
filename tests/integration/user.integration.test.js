const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');  

describe('User Routes Integration Tests', () => {
  beforeAll(async () => {
    // Connect to in-memory MongoDB if necessary
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('GET /api/users should return all users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  test('POST /api/users/signup should create a new user', async () => {
    const newUser = {
      username: 'testuser3',
      email: 'test3@example.com',
      password: 'password123',
      userType: 'Homeowner'
    };

    const response = await request(app)
      .post('/api/users/signup')
      .send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('userId');
  });
});
