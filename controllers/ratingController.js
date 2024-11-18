const Appointment = require('../models/appointment'); // Import Appointment model
const Gig = require('../models/gig'); // Import Gig model
const Rating = require('../models/rating'); // Import Rating model

exports.createRating = async (req, res) => {
    try {
        const { appointmentId, rating, comments } = req.body;

        // Validate appointmentId and fetch associated gigId
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).send({ error: 'Appointment not found' });
        }

        const gigId = appointment.gigId;
        if (!gigId) {
            return res.status(400).send({ error: 'Associated gig not found' });
        }

        // Create a new rating
        const newRating = new Rating({
            appointmentId,
            rating,
            comments,
        });
        await newRating.save();

        // Update gig's average rating and rating count
        const gig = await Gig.findById(gigId);
        if (!gig) {
            return res.status(404).send({ error: 'Gig not found' });
        }

        const { rating: currentAvgRating, ratingCount } = gig;
        const totalRatings = currentAvgRating * ratingCount + rating;
        const newRatingCount = ratingCount + 1;
        const newAvgRating = totalRatings / newRatingCount;

        gig.rating = newAvgRating;
        gig.ratingCount = newRatingCount;
        await gig.save();

        // Respond with the created rating
        res.status(201).send(newRating);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};



// Read all ratings
exports.getAllRatings = async (req, res) => {
    try {
        const ratings = await Rating.find();
        res.status(200).send(ratings);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a rating by ID
exports.updateRating = async (req, res) => {
    try {
        const rating = await Rating.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!rating) {
            return res.status(404).send();
        }
        res.send(rating);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a rating by ID
exports.deleteRating = async (req, res) => {
    try {
        const rating = await Rating.findByIdAndDelete(req.params.id);
        if (!rating) {
            return res.status(404).send();
        }
        res.status(200).send(rating);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a rating by ID
exports.getRatingById = async (req, res) => {
    try {
        const rating = await Rating.findById(req.params.id);
        if (!rating) {
            return res.status(404).send();
        }
        res.status(200).send(rating);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getRatingsByGigId = async (req, res) => {
    try {
        const ratings = await Rating.find({ gigId: id });

        
        if (!ratings) {
            return res.status(404).send();
        }
        res.status(200).send(ratings);
    } catch (error) {
        res.status(500).send(error);
    }
};

// ... existing code ...
