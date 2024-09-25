const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userType: { type: String, enum: ['Freelancer', 'Homeowner', 'CustomerService'], required: true },
  createdDate: { type: Date, default: Date.now },
  lastLoginDate: { type: Date },
  resetPasswordCode: { type: String },
  resetPasswordExpiry: { type: Date }
});

module.exports = mongoose.model('User', userSchema);
