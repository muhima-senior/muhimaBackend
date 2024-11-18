const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment', required: true },
    amount: {type: Number, required:true},
    paymentDate: Date,
    paymentMethod: { type: String, enum: ['CreditCard', 'COD'], default: 'COD' },
    status: { type: String, enum: ['Completed', 'Failed', 'Pending'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
