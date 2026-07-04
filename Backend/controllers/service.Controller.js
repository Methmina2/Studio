const Service = require('../models/Service');

// Define the desired order of service types
const SERVICE_ORDER = ['events', 'weddings', 'rentals', 'studio'];

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find();
    // Sort by the custom order defined above
    services.sort((a, b) => SERVICE_ORDER.indexOf(a.type) - SERVICE_ORDER.indexOf(b.type));
    res.json({ success: true, data: services });
  } catch (error) {
    console.error('GET /services error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getServiceByType = async (req, res) => {
  try {
    const service = await Service.findOne({ type: req.params.type });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    console.error('GET /services/type error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createService = async (req, res) => {
  try {
    const service = new Service(req.body);
    await service.save();
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    console.error('❌ POST /services error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Service type already exists' });
    }
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { type } = req.params;
    const updateData = { ...req.body };

    if (req.file) {
      const imageUrl = `/uploads/${req.file.filename}`;
      updateData.imageUrls = [imageUrl];
    }

    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined || updateData[key] === '') delete updateData[key];
    });

    const service = await Service.findOneAndUpdate(
      { type },
      updateData,
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, data: service });
  } catch (error) {
    console.error('❌ PUT /services error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ type: req.params.type });
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    console.error('❌ DELETE /services error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};