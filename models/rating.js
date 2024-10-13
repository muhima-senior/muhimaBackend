const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
    rating: { type: Number, min: 1, max: 5 },
    comments: String,
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Rating', RatingSchema);
