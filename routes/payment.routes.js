import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getAllTransactions,
  getAdminStats,
} from '../controllers/payment.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

router.post('/create-payment-intent', verifyToken, createPaymentIntent);
router.post('/confirm', verifyToken, confirmPayment);
router.get('/transactions', verifyAdmin, getAllTransactions);
router.get('/admin-stats', verifyAdmin, getAdminStats);

export default router;