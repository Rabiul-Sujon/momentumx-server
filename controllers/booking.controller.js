import Booking from '../models/Booking.js';
import Class from '../models/Class.js';

// Create booking (after payment)
export const createBooking = async (req, res) => {
  try {
    const { classId, className, trainerName, schedule, amount, transactionId } = req.body;

    // Check if already booked
    const existingBooking = await Booking.findOne({
      userEmail: req.user.email,
      classId,
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this class' });
    }

    const booking = await Booking.create({
      userEmail: req.user.email,
      userName: req.user.name,
      classId,
      className,
      trainerName,
      schedule,
      amount,
      transactionId,
    });

    // Increment booking count
    await Class.findByIdAndUpdate(classId, { $inc: { bookingCount: 1 } });

    res.status(201).json({ message: 'Class booked successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if user already booked a class
export const checkBooking = async (req, res) => {
  try {
    const { classId } = req.params;

    const booking = await Booking.findOne({
      userEmail: req.user.email,
      classId,
    });

    res.status(200).json({ booked: !!booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.user.email })
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get students booked for a specific class (Trainer)
export const getClassStudents = async (req, res) => {
  try {
    const { classId } = req.params;

    const bookings = await Booking.find({ classId })
      .select('userName userEmail createdAt');

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (Admin)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get total booked classes count (User dashboard)
export const getUserBookingCount = async (req, res) => {
  try {
    const count = await Booking.countDocuments({ userEmail: req.user.email });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};