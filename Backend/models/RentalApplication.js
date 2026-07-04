const mongoose = require('mongoose');

const rentalApplicationSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    nicPassport: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    items: [
      {
        id: { type: Number, required: true },
        name: { type: String, required: true },
        category: { type: String },
        pricePerDay: { type: Number },
      },
    ],
    collectionDate: { type: Date, required: true },
    collectionTime: { type: String, required: true, trim: true },
    returnDate: { type: Date, required: true },
    returnTime: { type: String, required: true, trim: true },
    conditionAck: { type: Boolean, default: false },
    liabilityAck: { type: Boolean, default: false },
    droneAck: { type: Boolean, default: false },
    regulatoryAck: { type: Boolean, default: false },
    noModificationAck: { type: Boolean, default: false },
    declarationAck: { type: Boolean, default: false },
    nicImage: { type: String }, // only NIC image remains
    // signatureImage removed
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'canceled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

rentalApplicationSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('RentalApplication', rentalApplicationSchema);