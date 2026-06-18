import stripe from '../config/stripe.js';
import Booking from '../models/Booking.js';
import Transaction from '../models/Transaction.js';
import Class from '../models/Class.js';

// Create payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, classId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: {
        classId,
        userEmail: req.user.email,
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Confirm payment and save booking
export const confirmPayment = async (req, res) => {
  try {
    const {
      classId,
      className,
      trainerName,
      schedule,
      amount,
      transactionId,
    } = req.body;

    // Check if already booked
    const existingBooking = await Booking.findOne({
      userEmail: req.user.email,
      classId,
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this class' });
    }

    // Save booking
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

    // Save transaction
    await Transaction.create({
      userEmail: req.user.email,
      userName: req.user.name,
      classId,
      className,
      amount,
      transactionId,
      status: 'success',
    });

    // Increment booking count
    await Class.findByIdAndUpdate(classId, {
      $inc: { bookingCount: 1 },
    });

    res.status(201).json({
      message: 'Payment confirmed and class booked successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all transactions (Admin)
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .sort({ createdAt: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get admin dashboard stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await (await import('../models/User.js')).default.countDocuments();
    const totalClasses = await Class.countDocuments();
    const totalBookings = await Booking.countDocuments();

    res.status(200).json({
      totalUsers,
      totalClasses,
      totalBookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};