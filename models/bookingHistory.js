const mongoose = require('mongoose');

const BookingHistorySchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    status: {type: String},    
}, { timestamps: true });

module.exports = mongoose.model('BookingHistory', BookingHistorySchema);
