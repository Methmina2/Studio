const Booking = require('../models/Booking');
const {
  sendBookingConfirmation,
  sendBookingConfirmed,
  sendBookingCanceled,
} = require('../utils/email');

exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    // Send pending confirmation
    await sendBookingConfirmation(booking);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error('❌ POST /bookings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('❌ GET /bookings error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'canceled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const existing = await Booking.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Update the status
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    // Send emails based on status change
    if (status === 'confirmed' && existing.status !== 'confirmed') {
      await sendBookingConfirmed(booking);
    } else if (status === 'canceled' && existing.status !== 'canceled') {
      await sendBookingCanceled(booking);
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    console.error('❌ PUT /bookings/:id/status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};