const mongoose = require('mongoose');

const appointmentSlotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  }
});

const appointmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gigId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gig',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Freelancer',
    required: true
  },
  appointmentDates: [appointmentSlotSchema],  // Array of appointment slots
  status: {
    type: String,
    default: 'Pending'
  },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;
