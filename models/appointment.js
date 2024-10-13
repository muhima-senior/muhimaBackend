
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  homeownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Homeowner', required: true },
  gigId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  jobType: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Rescheduled', 'Confirmed'], required: true }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
