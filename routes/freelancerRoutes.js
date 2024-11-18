const express = require('express');
const router = express.Router();
const freelancerController = require('../controllers/freelancerController'); // Assuming the controller file is named freelancerController.js
const multer = require('multer');

// Set up multer for file storage (in-memory, or you can configure for disk storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a new freelancer (with pictureData upload)
router.post('/', upload.single('pictureData'), freelancerController.createFreelancer);

// Get a freelancer by ID
router.get('/:id', freelancerController.getFreelancerById);

// Update a freelancer by ID
router.put('/:id', freelancerController.updateFreelancer);

// Delete a freelancer by ID
router.delete('/:id', freelancerController.deleteFreelancer);

// Get all freelancers
router.get('/', freelancerController.getAllFreelancers);

// Get freelancers by location (latitude, longitude, and distance)
router.get('/location/nearby', freelancerController.getFreelancersByLocation);

// Get freelancers by skill
router.get('/skill/:skill', freelancerController.getFreelancersBySkill);

// Get freelancers by rating
router.get('/rating/:rating', freelancerController.getFreelancersByRating);

module.exports = router;
