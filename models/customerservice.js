const mongoose = require('mongoose');

const CustomerServiceSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    messageHistory: String,
    faqResponses: String,
    commonIssues: String,
}, { timestamps: true });

module.exports = mongoose.model('CustomerService', CustomerServiceSchema);
