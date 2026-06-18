const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking.model');
const Class = require('../models/Class.model');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');
const checkBlocked = require('../middleware/checkBlocked.middleware');

// 🔒 PRIVATE (User): Confirm Booking after successful Stripe Payment
router.post('/', verifyToken, authorizeRoles('user'), checkBlocked, async (req, res) => {
  const { classId, trainerName, amount, transactionId } = req.body;
  try {
    // Prevent duplicate bookings on the same class
    const existingBooking = await Booking.findOne({ userId: req.user.id, classId });
    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this class' });
    }

    const newBooking = new Booking({
      userId: req.user.id,
      classId,
      trainerName,
      amount,
      transactionId,
      date: new Date()
    });

    const savedBooking = await newBooking.save();

    // Requirements Checklist: Increment bookingCount for sorting logic
    await Class.findByIdAndUpdate(classId, { $inc: { bookingCount: 1 } });

    res.status(201).json({ message: 'Booking confirmed smoothly!', savedBooking });
  } catch (error) {
    res.status(500).json({ message: 'Booking registration failed', error: error.message });
  }
});

// 🔒 PRIVATE: Get logged-in user's booked classes table
router.get('/my-bookings', verifyToken, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate('classId');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load bookings', error: error.message });
  }
});

module.exports = router;