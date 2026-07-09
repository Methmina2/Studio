const mongoose = require('mongoose');

const rentalApplicationSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, sparse: true },
    fullName: { type: String, required: true },
    nicPassport: { type: String, required: true },
    email: { type: String, required: true },
    contactNumber: { type: String, required: true },
    items: [
      {
        id: { type: String }, // ✅ removed 'required: true'
        name: { type: String, required: true },
        category: { type: String },
        pricePerDay: { type: Number },
      },
    ],
    collectionDate: { type: Date, required: true },
    collectionTime: { type: String, required: true },
    returnDate: { type: Date, required: true },
    returnTime: { type: String, required: true },
    conditionAck: { type: Boolean, default: false },
    liabilityAck: { type: Boolean, default: false },
    droneAck: { type: Boolean, default: false },
    regulatoryAck: { type: Boolean, default: false },
    noModificationAck: { type: Boolean, default: false },
    declarationAck: { type: Boolean, default: false },
    nicImage: { type: String },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'canceled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RentalApplication', rentalApplicationSchema);