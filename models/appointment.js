
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  homeownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Homeowner', required: true },
  freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer', required: true },
  jobType: { type: String, required: true },
  scheduledDate: { type: Date, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Rescheduled'], required: true }
});

module.exports = mongoose.model('Appointment', appointmentSchema);
