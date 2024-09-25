const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    amount: Number,
    paymentDate: Date,
    paymentMethod: { type: String, enum: ['CreditCard', 'PayPal'], default: 'CreditCard' },
    status: { type: String, enum: ['Completed', 'Failed'], default: 'Completed' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
