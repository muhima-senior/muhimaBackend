const mongoose = require('mongoose');


const gigSchema = new mongoose.Schema({
    freelancerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Freelancer', required: true },
    title: { type: String, required: true },
    description: String,
    category : {type: String, required: true},
    price: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    discount: { type: Number, default: 0},
    pictureData: { type: Buffer, required: true },
    rating: { type: Number, default: 0 },
    ratingCount: {type: Number, default: 0}
  });
  
  module.exports = mongoose.model('Gig', gigSchema);
  