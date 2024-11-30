const Homeowner = require('../models/homeowner');

exports.createHomeowner = async (req, res) => {
  try {
    const { userId, mobileNumber, address } = req.body;
    const pictureData = req.file ? req.file.buffer : null;

    if (!pictureData) {
      return res.status(400).json({ error: 'Picture is required' });
    }

    const newHomeowner = new Homeowner({
      userId,
      mobileNumber,
      pictureData,
      address
    });

    await newHomeowner.save();

    res.status(201).json({ message: 'Homeowner profile created successfully' });
  } catch (error) {
    console.error('Error creating homeowner profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getHomeownerById = async (req, res) => {
  try {
    const homeowner = await Homeowner.findById(req.params.id);
    if (!homeowner) {
      return res.status(404).json({ error: 'Homeowner not found' });
    }

    const homeownerWithBase64Picture = {
      ...homeowner._doc,
      pictureData: homeowner.pictureData.toString('base64'),
    };

    res.status(200).json(homeownerWithBase64Picture);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getHomeownerByUserId = async (req, res) => {
  try {
    const homeowner = await Homeowner.findOne({ userId: req.params.userId });
    if (!homeowner) {
      return res.status(404).json({ error: 'Homeowner not found' });
    }

    const homeownerWithBase64Picture = {
      ...homeowner._doc,
      pictureData: homeowner.pictureData.toString('base64'),
    };
    
    res.status(200).json(homeownerWithBase64Picture);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateHomeowner = async (req, res) => {
  try {
    const { userId, mobileNumber, address } = req.body;
    const pictureData = req.file ? req.file.buffer : undefined;

    const updateData = {};

    if (userId) updateData.userId = userId;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (pictureData) updateData.pictureData = pictureData;
    if(address) updateData.address = address
    // Check if updateData is empty (nothing to update)
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields provided to update' });
    }

    const homeowner = await Homeowner.findOneAndUpdate(
      { userId: userId },  
      { $set: updateData },       
      { new: true }               
    );

    if (!homeowner) {
      return res.status(404).json({ error: 'Homeowner not found' });
    }

    res.status(200).json(homeowner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteHomeowner = async (req, res) => {
  try {
    const homeowner = await Homeowner.findByIdAndDelete(req.params.id);
    if (!homeowner) {
      return res.status(404).json({ error: 'Homeowner not found' });
    }

    res.status(200).json({ message: 'Homeowner deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllHomeowners = async (req, res) => {
  try {
    const homeowners = await Homeowner.find();

    const homeownersWithBase64Pictures = homeowners.map((homeowner) => ({
      ...homeowner._doc,
      pictureData: homeowner.pictureData.toString('base64'),
    }));

    res.status(200).json(homeownersWithBase64Pictures);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
