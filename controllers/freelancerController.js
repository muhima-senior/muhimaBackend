const Freelancer = require('../models/freelancer');

exports.createFreelancer = async (req, res) => {
    try {
      const { userId, profileDescription, certifications, location, availableSlots, mobileNumber } = req.body;
      const pictureData = req.file ? req.file.buffer : null;

      if (!pictureData) {
        return res.status(400).json({ error: 'Picture is required' });
      }

      const newFreelancer = new Freelancer({
        userId,
        profileDescription,
        certifications: JSON.parse(certifications),
        location: JSON.parse(location),
        availableSlots: JSON.parse(availableSlots).map(slot => new Date(slot)),
        mobileNumber,
        pictureData
      });

      await newFreelancer.save();

      res.status(201).json({ message: 'Freelancer profile created successfully' });
    } catch (error) {
      console.error('Error creating freelancer profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


exports.getFreelancerById = async (req, res) => {
    try {
        const freelancer = await Freelancer.findById(req.params.id);
        if (!freelancer) {
            return res.status(404).json({ error: 'Freelancer not found' });
        }
        res.status(200).json(freelancer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateFreelancer = async (req, res) => {
    try {
        const { userId, profileDescription, skills, certifications, location, availableSlots, rating, transactionHistory } = req.body;
        const freelancer = await Freelancer.findByIdAndUpdate(req.params.id, { userId, profileDescription, skills, certifications, location, availableSlots, rating, transactionHistory }, { new: true });
        if (!freelancer) {
            return res.status(404).json({ error: 'Freelancer not found' });
        }

        res.status(200).json(freelancer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteFreelancer = async (req, res) => {
    try {
        const freelancer = await Freelancer.findByIdAndDelete(req.params.id);
        if (!freelancer) {
            return res.status(404).json({ error: 'Freelancer not found' });
        }

        res.status(200).json({ message: 'Freelancer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllFreelancers = async (req, res) => {
    try {
        const freelancers = await Freelancer.find();
        res.status(200).json(freelancers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFreelancersByLocation = async (req, res) => {
    try {
        const { latitude, longitude, distance } = req.query;
        const freelancers = await Freelancer.find({
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseFloat(distance) * 1000 // Convert km to meters
                }
            }
        }); 
        res.status(200).json(freelancers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFreelancersBySkill = async (req, res) => {
    try {
        const { skill } = req.params;
        const freelancers = await Freelancer.find({ skills: { $in: [skill] } });
        res.status(200).json(freelancers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getFreelancersByRating = async (req, res) => {
    try {
        const { rating } = req.params;
        const freelancers = await Freelancer.find({ rating: { $gte: parseInt(rating) } });
        res.status(200).json(freelancers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

