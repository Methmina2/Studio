const Rental = require('../models/Rental');

exports.getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().sort({ category: 1, name: 1 });
    res.json({ success: true, data: rentals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getRental = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id);
    if (!rental) return res.status(404).json({ success: false, message: 'Rental not found' });
    res.json({ success: true, data: rental });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createRental = async (req, res) => {
  try {
    const { name, category, pricePerDay, description, specs, available } = req.body;
    let image = '';

    // If a file was uploaded, store its path
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }

    // Parse specs if sent as JSON string
    let parsedSpecs = [];
    if (specs) {
      try {
        parsedSpecs = JSON.parse(specs);
      } catch (e) {
        parsedSpecs = specs.split(',').map(s => s.trim());
      }
    }

    const rental = new Rental({
      name,
      category,
      image,
      pricePerDay: Number(pricePerDay),
      description: description || '',
      specs: parsedSpecs,
      available: available === 'true' || available === true,
    });

    await rental.save();
    res.status(201).json({ success: true, data: rental });
  } catch (error) {
    console.error('❌ POST /rentals error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateRental = async (req, res) => {
  try {
    const { name, category, pricePerDay, description, specs, available } = req.body;
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (category !== undefined) updateData.category = category;
    if (pricePerDay !== undefined) updateData.pricePerDay = Number(pricePerDay);
    if (description !== undefined) updateData.description = description;
    if (available !== undefined) updateData.available = available === 'true' || available === true;

    if (specs) {
      try {
        updateData.specs = JSON.parse(specs);
      } catch (e) {
        updateData.specs = specs.split(',').map(s => s.trim());
      }
    }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const rental = await Rental.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!rental) return res.status(404).json({ success: false, message: 'Rental not found' });
    res.json({ success: true, data: rental });
  } catch (error) {
    console.error('❌ PUT /rentals error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteRental = async (req, res) => {
  try {
    const rental = await Rental.findByIdAndDelete(req.params.id);
    if (!rental) return res.status(404).json({ success: false, message: 'Rental not found' });
    res.json({ success: true, message: 'Rental deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};