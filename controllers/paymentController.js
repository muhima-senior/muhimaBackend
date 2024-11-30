// controllers/paymentController.js
const Payment = require('../models/payment');

// Create a new payment
exports.createPayment = async (req, res) => {
    try {
        // Extract and validate fields from the request body
        const { appointmentId, amount, paymentDate, paymentMethod, status } = req.body;

        // Create a new Payment document
        const payment = new Payment({
            appointmentId,
            amount,
            paymentDate: paymentDate ? new Date(paymentDate) : new Date(), // default to current date if not provided
            paymentMethod: paymentMethod || 'COD',  // default to 'COD' if not provided
            status: status || 'Pending' // default to 'Pending' if not provided
        });

        const savedPayment = await payment.save();

        // Return the saved payment document as JSON
        res.status(201).json(savedPayment);
    } catch (error) {
        // Handle validation or server errors and return the error message
        res.status(400).json({ error: error.message });
    }
};


// Get all payments
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find().populate('appointmentId');
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single payment by ID
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('appointmentId');
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a payment by ID
exports.updatePayment = async (req, res) => {
    try {
        const updatedPayment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json(updatedPayment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a payment by ID
exports.deletePayment = async (req, res) => {
    try {
        const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
        if (!deletedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }
        res.status(200).json({ message: 'Payment deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
