const mongoose = require('mongoose');

const homeownerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mobileNumber: { type: String, required: true },
  pictureData: { type: Buffer, required: true },
  address: { type: String }
});

module.exports = mongoose.model('Homeowner', homeownerSchema);
