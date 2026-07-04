const Crew = require('../models/Crew');

exports.getCrew = async (req, res) => {
  try {
    const crew = await Crew.find().sort({ featured: -1, order: 1, createdAt: 1 });
    res.json({ success: true, data: crew });
  } catch (error) {
    console.error('GET /crew error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createCrew = async (req, res) => {
  try {
    const crewData = { ...req.body };
    if (req.file) {
      crewData.image = `/uploads/${req.file.filename}`;
    }

    if (typeof crewData.specialties === 'string') {
      try {
        crewData.specialties = JSON.parse(crewData.specialties);
      } catch {
        crewData.specialties = crewData.specialties.split(',').map((item) => item.trim()).filter(Boolean);
      }
    }

    if (typeof crewData.featured === 'string') {
      crewData.featured = crewData.featured === 'true';
    }

    if (typeof crewData.order === 'string') {
      crewData.order = Number(crewData.order || 0);
    }

    const crew = new Crew(crewData);
    await crew.save();
    res.status(201).json({ success: true, data: crew });
  } catch (error) {
    console.error('POST /crew error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

exports.updateCrew = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    if (typeof updateData.specialties === 'string') {
      try {
        updateData.specialties = JSON.parse(updateData.specialties);
      } catch {
        updateData.specialties = updateData.specialties.split(',').map((item) => item.trim()).filter(Boolean);
      }
    }

    if (typeof updateData.featured === 'string') {
      updateData.featured = updateData.featured === 'true';
    }

    if (typeof updateData.order === 'string') {
      updateData.order = Number(updateData.order || 0);
    }

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === undefined || updateData[key] === '') {
        delete updateData[key];
      }
    });

    const crew = await Crew.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!crew) {
      return res.status(404).json({ success: false, message: 'Crew member not found' });
    }

    res.json({ success: true, data: crew });
  } catch (error) {
    console.error('PUT /crew/:id error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

exports.deleteCrew = async (req, res) => {
  try {
    const crew = await Crew.findByIdAndDelete(req.params.id);
    if (!crew) {
      return res.status(404).json({ success: false, message: 'Crew member not found' });
    }

    res.json({ success: true, message: 'Crew member deleted' });
  } catch (error) {
    console.error('DELETE /crew/:id error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};
