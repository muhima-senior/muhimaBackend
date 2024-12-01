// routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create a new payment
router.post('/', paymentController.createPayment);

// Get all payments
router.get('/', paymentController.getAllPayments);

// Get a payment by ID
router.get('/:id', paymentController.getPaymentById);

// Update a payment by ID
router.put('/:id', paymentController.updatePayment);

// Update a payment by ID
router.patch('/pay/:id', paymentController.payPayment);


// Delete a payment by ID
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
