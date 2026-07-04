const mongoose = require('mongoose');

const crewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    trim: true,
    default: 'Team Member',
  },
  bio: {
    type: String,
    required: true,
    trim: true,
  },
  specialties: {
    type: [String],
    default: [],
  },
  image: {
    type: String,
    trim: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Crew', crewSchema);
