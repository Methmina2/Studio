const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  image: { type: String, trim: true },
  pricePerDay: { type: Number, required: true },
  description: { type: String, trim: true },
  specs: { type: [String], default: [] },
  available: { type: Boolean, default: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Rental', rentalSchema);