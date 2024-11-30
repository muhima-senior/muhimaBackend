const express = require('express');
const router = express.Router();
const homeownerController = require('../controllers/homeownerController');
const multer = require('multer');

// Set up multer for file storage (in-memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a new homeowner (with picture upload)
router.post('/', upload.single('pictureData'), homeownerController.createHomeowner);

// Get a homeowner by ID
router.get('/:id', homeownerController.getHomeownerById);

// Get a homeowner by user ID
router.get('/user/:userId', homeownerController.getHomeownerByUserId);

// Update a homeowner by ID (with optional picture upload)
router.patch('/update', upload.single('pictureData'), homeownerController.updateHomeowner);

// Delete a homeowner by ID
router.delete('/:id', homeownerController.deleteHomeowner);

// Get all homeowners
router.get('/', homeownerController.getAllHomeowners);

module.exports = router;
