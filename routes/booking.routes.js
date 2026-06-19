import express from 'express';
import {
  createBooking,
  checkBooking,
  getUserBookings,
  getClassStudents,
  getAllBookings,
  getUserBookingCount,
} from '../controllers/booking.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import verifyAdmin from '../middleware/verifyAdmin.js';
import verifyTrainer from '../middleware/verifyTrainer.js';
import checkBlocked from '../middleware/checkBlocked.js';

const router = express.Router();

router.post('/', verifyToken, checkBlocked, createBooking);
router.get('/check/:classId', verifyToken, checkBooking);
router.get('/my-bookings', verifyToken, getUserBookings);
router.get('/count', verifyToken, getUserBookingCount);
router.get('/students/:classId', verifyTrainer, getClassStudents);
router.get('/all', verifyAdmin, getAllBookings);

export default router;