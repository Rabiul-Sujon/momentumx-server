import express from 'express';
import {
  getAllUsers,
  updateUserStatus,
  makeAdmin,
  getUserProfile,
  updateUserProfile,
} from '../controllers/user.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import verifyAdmin from '../middleware/verifyAdmin.js';

const router = express.Router();

router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUserProfile);
router.get('/all', verifyAdmin, getAllUsers);
router.put('/status/:id', verifyAdmin, updateUserStatus);
router.put('/make-admin/:id', verifyAdmin, makeAdmin);

export default router;