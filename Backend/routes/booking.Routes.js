const express = require('express');
const auth = require('../middleware/auth');
const {
  createBooking,
  getBookings,
  updateBookingStatus,
} = require('../controllers/booking.Controller');
const router = express.Router();

router.post('/', createBooking);
router.get('/', auth, getBookings);
router.put('/:id/status', auth, updateBookingStatus);

module.exports = router;