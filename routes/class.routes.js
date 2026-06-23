import express from 'express';
import {
  createClass,
  getAllClasses,
  getFeaturedClasses,
  getSingleClass,
  getTrainerClasses,
  updateClass,
  deleteClass,
  getAllClassesAdmin,
  updateClassStatus,
} from '../controllers/class.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import verifyAdmin from '../middleware/verifyAdmin.js';
import verifyTrainer from '../middleware/verifyTrainer.js';

const router = express.Router();

router.get('/', getAllClasses);
router.get('/featured', getFeaturedClasses);
router.get('/trainer', verifyTrainer, getTrainerClasses);
router.get('/admin', verifyAdmin, getAllClassesAdmin);
router.get('/:id', getSingleClass);
router.post('/', verifyTrainer, createClass);
router.put('/status/:id', verifyAdmin, updateClassStatus);
router.put('/:id', verifyAdmin, updateClassStatus);
router.delete('/:id', verifyToken, deleteClass);


export default router;