const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Route to create a new appointment
router.post('/create', appointmentController.createAppointment);

// Route to confirm an appointment
router.post('/confirm', appointmentController.confirmAppointment);

// Route to get an appointment by ID
router.get('/:id', appointmentController.getAppointmentById);

// Route to update an appointment
router.put('/:id', appointmentController.updateAppointment);

// Route to delete an appointment
router.delete('/:id', appointmentController.deleteAppointment);

// Route to get all appointments
router.get('/', appointmentController.getAllAppointments);

// Route to get appointments by freelancer ID
router.get('/freelancer/:freelancerId', appointmentController.getAppointmentsByFreelancer);

// Route to get appointments by user ID
router.get('/user/:userId', appointmentController.getAppointmentsByUser);

module.exports = router;
