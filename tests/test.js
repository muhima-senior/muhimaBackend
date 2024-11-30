const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const express = require('express');
const multer = require('multer');
const AppointmentController = require('../controllers/appointmentController');
const ChatController = require('../controllers/chatController');
const FreelancerController = require('../controllers/freelancerController');
const GigController = require('../controllers/gigController');
const HomeownerController = require('../controllers/homeownerController');
const Appointment = require('../models/appointment');
const Chat = require('../models/chat');
const Freelancer = require('../models/freelancer');
const Gig = require('../models/gig');
const Homeowner = require('../models/homeowner');
const User = require('../models/user');

let mongoServer;
const app = express();
app.use(express.json());

// Mock multer middleware
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Setup routes
app.post('/api/appointments', AppointmentController.createAppointment);
app.post('/api/freelancers', upload.single('picture'), FreelancerController.createFreelancer);
app.post('/api/gigs', upload.single('picture'), GigController.createGig);
app.post('/api/homeowners', upload.single('picture'), HomeownerController.createHomeowner);
app.post('/api/chats', ChatController.startChat);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await mongoose.connection.dropDatabase();
});

describe('AppointmentController', () => {
  let testGig, testFreelancer, testUser;

  beforeEach(async () => {
    testUser = await User.create({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123'
    });

    testFreelancer = await Freelancer.create({
      userId: testUser._id,
      profileDescription: 'Test freelancer',
      availableSlots: []
    });

    testGig = await Gig.create({
      freelancerId: testFreelancer._id,
      title: 'Test Gig',
      price: 100
    });
  });

  test('createAppointment should create new appointment', async () => {
    const appointmentData = {
      gigId: testGig._id,
      userId: testUser._id,
      appointmentDates: [{ date: new Date(), time: '10:00' }],
      quantity: 1,
      total: 100,
      address: 'Test Address',
      paymentMethod: 'cash'
    };

    const response = await request(app)
      .post('/api/appointments')
      .send(appointmentData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.gigId).toBe(testGig._id.toString());
  });
});

describe('ChatController', () => {
  let testFreelancer, testHomeowner;

  beforeEach(async () => {
    testFreelancer = await Freelancer.create({
      userId: new mongoose.Types.ObjectId(),
      profileDescription: 'Test freelancer'
    });

    testHomeowner = await Homeowner.create({
      userId: new mongoose.Types.ObjectId(),
      mobileNumber: '1234567890'
    });
  });

  test('startChat should create new chat', async () => {
    const chatData = {
      freelancerId: testFreelancer.userId,
      homeownerId: testHomeowner.userId
    };

    const response = await request(app)
      .post('/api/chats')
      .send(chatData);

    expect(response.status).toBe(201);
    expect(response.body.chat).toHaveProperty('_id');
  });
});

describe('FreelancerController', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123'
    });
  });

  test('createFreelancer should create new freelancer profile', async () => {
    const freelancerData = {
      userId: testUser._id,
      profileDescription: 'Test description',
      certifications: JSON.stringify(['Cert1', 'Cert2']),
      location: JSON.stringify({ type: 'Point', coordinates: [0, 0] }),
      availableSlots: JSON.stringify({
        monday: ['09:00', '10:00'],
        tuesday: ['09:00', '10:00'],
        wednesday: ['09:00', '10:00'],
        thursday: ['09:00', '10:00'],
        friday: ['09:00', '10:00'],
        saturday: ['09:00', '10:00'],
        sunday: ['09:00', '10:00']
      }),
      mobileNumber: '1234567890'
    };

    const response = await request(app)
      .post('/api/freelancers')
      .field('userId', freelancerData.userId)
      .field('profileDescription', freelancerData.profileDescription)
      .field('certifications', freelancerData.certifications)
      .field('location', freelancerData.location)
      .field('availableSlots', freelancerData.availableSlots)
      .field('mobileNumber', freelancerData.mobileNumber)
      .attach('picture', Buffer.from('fake-image'), 'test.jpg');

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Freelancer profile created successfully');
  });
});

describe('GigController', () => {
  let testFreelancer;

  beforeEach(async () => {
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123'
    });

    testFreelancer = await Freelancer.create({
      userId: testUser._id,
      profileDescription: 'Test freelancer'
    });
  });

  test('createGig should create new gig', async () => {
    const gigData = {
      userId: testFreelancer.userId,
      title: 'Test Gig',
      description: 'Test description',
      price: 100,
      category: 'Test Category'
    };

    const response = await request(app)
      .post('/api/gigs')
      .field('userId', gigData.userId)
      .field('title', gigData.title)
      .field('description', gigData.description)
      .field('price', gigData.price)
      .field('category', gigData.category)
      .attach('picture', Buffer.from('fake-image'), 'test.jpg');

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe(gigData.title);
  });
});

describe('HomeownerController', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      username: 'testuser',
      email: 'test@test.com',
      password: 'password123'
    });
  });

  test('createHomeowner should create new homeowner profile', async () => {
    const homeownerData = {
      userId: testUser._id,
      mobileNumber: '1234567890',
      address: 'Test Address'
    };

    const response = await request(app)
      .post('/api/homeowners')
      .field('userId', homeownerData.userId)
      .field('mobileNumber', homeownerData.mobileNumber)
      .field('address', homeownerData.address)
      .attach('picture', Buffer.from('fake-image'), 'test.jpg');

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Homeowner profile created successfully');
  });
});