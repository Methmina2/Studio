// rental.Controller.js
const Rental = require('../models/Rental');
const RentalApplication = require('../models/RentalApplication');
const { sendRentalConfirmation } = require('../utils/email');
const crypto = require('crypto');

const generateOrderId = () => {
  const prefix = "HM";
  const date = new Date();
  const yearMonth = `${date.getFullYear().toString().slice(-2)}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase().slice(0, 4);
  return `${prefix}-${yearMonth}-${randomStr}`;
};

exports.applyForRental = async (req, res) => {
  try {
    const data = { ...req.body };

    // Generate unique orderId
    let isUnique = false;
    let newOrderId = "";
    while (!isUnique) {
      newOrderId = generateOrderId();
      const existing = await RentalApplication.findOne({ orderId: newOrderId });
      if (!existing) isUnique = true;
    }
    data.orderId = newOrderId;

    // Remove nicImage if it's an empty object (frontend sends File as object)
    if (data.nicImage && typeof data.nicImage === 'object' && Object.keys(data.nicImage).length === 0) {
      delete data.nicImage;
    }

    const application = new RentalApplication(data);
    await application.save();
    console.log(`✅ Rental Saved: ${newOrderId}`);

    try {
      await sendRentalConfirmation(application);
    } catch (emailErr) {
      console.error("⚠️ Email failed but data was saved:", emailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      orderId: newOrderId
    });

  } catch (error) {
    console.error('❌ Rental Application Error:', error);
    res.status(500).json({
      success: false,
      message: 'Submission failed: ' + error.message
    });
  }
};

// ----- FIX: Add `id` field to response -----
exports.getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().sort({ category: 1, name: 1 });
    // Add an `id` field (same as _id) so the frontend can use item.id
    const rentalsWithId = rentals.map(rental => ({
      ...rental.toObject(),
      id: rental._id.toString(),
    }));
    res.json({ success: true, data: rentalsWithId });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Other admin methods unchanged...
exports.createRental = async (req, res) => {
  try {
    const { name, category, pricePerDay, description, specs, available } = req.body;
    let image = req.file ? `/uploads/${req.file.filename}` : '';
    
    let parsedSpecs = [];
    if (specs) {
      try { parsedSpecs = JSON.parse(specs); } 
      catch (e) { parsedSpecs = specs.split(',').map(s => s.trim()); }
    }

    const rental = new Rental({
      name, category, image,
      pricePerDay: Number(pricePerDay),
      description: description || '',
      specs: parsedSpecs,
      available: available === 'true' || available === true,
    });

    await rental.save();
    res.status(201).json({ success: true, data: rental });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, data: rental });
  } catch (error) { res.status(500).json({ success: false }); }
};

exports.updateRental = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    const rental = await Rental.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, data: rental });
  } catch (error) { res.status(500).json({ success: false }); }
};

exports.deleteRental = async (req, res) => {
  try {
    await Rental.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Deleted' });
  } catch (error) { res.status(500).json({ success: false }); }
};