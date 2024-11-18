const mongoose = require('mongoose');

const freelancerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileDescription: String,
  certifications: [String],
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' }, // GeoJSON type
    coordinates: {
      type: [Number], // Array of numbers [longitude, latitude]
      required: true
    }
  },
  availableSlots: {
    monday: { type: [String], default: [] },
    tuesday: { type: [String], default: [] },
    wednesday: { type: [String], default: [] },
    thursday: { type: [String], default: [] },
    friday: { type: [String], default: [] },
    saturday: { type: [String], default: [] },
    sunday: { type: [String], default: [] }
  },
  rating: { type: Number, default: 0 },
  transactionHistory: { type: [String], default: [] },
  mobileNumber: { type: String, required: true },
  pictureData: { type: Buffer, required: true },
});

// Create a 2dsphere index on the location field for geospatial queries
freelancerSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Freelancer', freelancerSchema);
