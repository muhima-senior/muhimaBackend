const express = require('express');
const ratingController = require('../controllers/ratingController');
const router = express.Router();

router.post('/addRating', ratingController.createRating);
router.get('/', ratingController.getAllRatings)
router.get('/freelancer/:userId', ratingController.getRatingsByFreelancer)

module.exports = router;
