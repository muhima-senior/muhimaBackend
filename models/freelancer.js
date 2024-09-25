
const mongoose = require('mongoose');

const freelancerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  profileDescription: String,
  skills: [String],
  certifications: [String],
  expertise: [String],
  location: String,
  availableSlots: [Date],
  rating: { type: Number, default: 0 },
  transactionHistory: { type: [String], default: [] }
});

module.exports = mongoose.model('Freelancer', freelancerSchema);
