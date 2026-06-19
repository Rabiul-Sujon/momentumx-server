import express from 'express';
import {
  applyAsTrainer,
  getApplicationStatus,
  getAllApplications,
  approveApplication,
  rejectApplication,
  getAllTrainers,
  demoteTrainer,
  getTrainerStats,
} from '../controllers/trainer.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import verifyAdmin from '../middleware/verifyAdmin.js';
import verifyTrainer from '../middleware/verifyTrainer.js';
import checkBlocked from '../middleware/checkBlocked.js';

const router = express.Router();

router.post('/apply', verifyToken, checkBlocked, applyAsTrainer);
router.get('/application-status', verifyToken, getApplicationStatus);
router.get('/stats', verifyTrainer, getTrainerStats);
router.get('/all', verifyAdmin, getAllTrainers);
router.get('/applications', verifyAdmin, getAllApplications);
router.put('/approve/:id', verifyAdmin, approveApplication);
router.put('/reject/:id', verifyAdmin, rejectApplication);
router.put('/demote/:id', verifyAdmin, demoteTrainer);

export default router;