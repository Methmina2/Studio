const express = require('express');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getRentals,
  getRental,
  createRental,
  updateRental,
  deleteRental,
  applyForRental
} = require('../controllers/rental.Controller');

const router = express.Router();

// Public routes
router.get('/', getRentals);
router.post('/apply', applyForRental);

// Admin routes
router.get('/:id', auth, getRental);
router.post('/', auth, upload, createRental);
router.put('/:id', auth, upload, updateRental);
router.delete('/:id', auth, deleteRental);

module.exports = router;