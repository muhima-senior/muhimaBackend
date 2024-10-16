const Gig = require('../models/gig'); // Import only once
const Rating = require('../models/rating'); 
const Freelancer = require('../models/freelancer')
const mongoose = require('mongoose');


// Create a new gig
exports.createGig = async (req, res) => {
    try {
        const { userId, title, description, price, category } = req.body;
        const pictureData = req.file ? req.file.buffer : null;

        // Find the freelancer
        const freelancer = await Freelancer.findOne({ userId });
        if (!freelancer) {
            return res.status(404).json({ error: 'Freelancer not found' });
        }

        // Check if picture is provided
        if (!pictureData) {
            return res.status(400).json({ error: 'Picture is required' });
        }

        const newGig = new Gig({
            freelancerId: freelancer._id,
            title,
            description,
            price,
            category,
            pictureData
        });

        await newGig.save();
        res.status(201).json(newGig);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGigById = async (req, res) => {
    try {
        const { id } = req.params;

        const gig = await Gig.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id) // Match the specific gig ID
                }
            },
            {
                $lookup: {
                    from: 'freelancers',
                    localField: 'freelancerId',
                    foreignField: '_id',
                    as: 'freelancer'
                }
            },
            {
                $unwind: {
                    path: '$freelancer',
                    preserveNullAndEmptyArrays: true // Keep documents even if freelancer is not found
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'freelancer.userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true // Keep documents even if user is not found
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    pictureData: 1,
                    price: 1,
                    category: 1,
                    discount: 1,
                    freelancer: {
                        _id: 1,
                        userId: 1,
                        pictureData: 1,
                    },
                    'user.username': 1
                }
            }
        ]);

        // Check if gig was found
        if (!gig.length) {
            return res.status(404).json({ error: 'Gig not found' });
        }

        res.status(200).json(gig[0]); // Return the first gig since only one is expected
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateGig = async (req, res) => {
    try {
        const { title, description, skillsRequired, price, deadline } = req.body;
        const gig = await Gig.findByIdAndUpdate(req.params.id, { title, description, skillsRequired, price, deadline }, { new: true });
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }
        res.status(200).json(gig);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteGig = async (req, res) => {
    try {
        const gig = await Gig.findByIdAndDelete(req.params.id);
        if (!gig) {
            return res.status(404).json({ message: 'Gig not found' });
        }
        res.status(200).json({ message: 'Gig deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllGigs = async (req, res) => {
    try {
        const gigs = await Gig.aggregate([
            {
                $lookup: {
                    from: 'freelancers',
                    localField: 'freelancerId',
                    foreignField: '_id',
                    as: 'freelancer'
                }
            },
            {
                $unwind: {
                    path: '$freelancer',
                    preserveNullAndEmptyArrays: true // Keep documents even if freelancer is not found
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'freelancer.userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true // Keep documents even if user is not found
                }
            },
            {
                $project: {
                    title: 1,
                    description: 1,
                    pictureData: 1,
                    price: 1,
                    category: 1,
                    discount: 1,
                    freelancer: {
                        _id: 1,
                        userId: 1,
                        pictureData: 1,
                    },
                    'user.username': 1
                }
            }
        ]);

        res.status(200).json(gigs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};






exports.getGigsByFreelancer = async (req, res) => {
    try {
        const userId = req.params.userId;
        const freelancer = await Freelancer.findOne({userId});
        const gigs = await Gig.find({ freelancerId: freelancer._id });
        console.log(gigs)

        const gigsWithRatings = await Promise.all(gigs.map(async (gig) => {
            const ratings = await Rating.find({ gigId: gig._id });
            
            let averageRating = 0;
            if (ratings.length > 0) {
                const totalRating = ratings.reduce((sum, rating) => sum + rating.value, 0);
                averageRating = totalRating / ratings.length;
            }
            
            return {
                ...gig.toObject(),
                averageRating: parseFloat(averageRating.toFixed(1))
            };
        }));
        
        res.status(200).json(gigsWithRatings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGigsBySkill = async (req, res) => {
    try {
        const gigs = await Gig.find({ skillsRequired: { $in: [req.params.skill] } });
        res.status(200).json(gigs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGigsByPrice = async (req, res) => {
    try {
        const gigs = await Gig.find({ price: { $gte: req.params.minPrice, $lte: req.params.maxPrice } });
        res.status(200).json(gigs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getGigsByDeadline = async (req, res) => {
    try {
        const gigs = await Gig.find({ deadline: { $gte: req.params.startDate, $lte: req.params.endDate } });
        res.status(200).json(gigs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
