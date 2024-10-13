const express = require('express');
const router = express.Router();
const gigController = require('../controllers/gigController'); // Assuming the controller file is named gigController.js
const multer = require('multer');

// Set up multer for file storage (in-memory, or you can configure for disk storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Create a new gig (with pictureData upload)
router.post('/', upload.single('pictureData'), gigController.createGig);

// Get a gig by ID
router.get('/:id', gigController.getGigById);

// Update a gig by ID
router.put('/:id', gigController.updateGig);

// Delete a gig by ID
router.delete('/:id', gigController.deleteGig);

// Get all gigs
router.get('/', gigController.getAllGigs);

// Get gigs by freelancerId
router.get('/freelancer/:userId', gigController.getGigsByFreelancer);

// Get gigs by skill
router.get('/skill/:skill', gigController.getGigsBySkill);

// Get gigs by price range (minPrice and maxPrice)
router.get('/price/:minPrice/:maxPrice', gigController.getGigsByPrice);

// Get gigs by deadline (startDate and endDate)
router.get('/deadline/:startDate/:endDate', gigController.getGigsByDeadline);

module.exports = router;
