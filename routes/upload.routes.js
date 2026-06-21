import express from 'express';
import multer from 'multer';
import { uploadImage } from '../controllers/upload.controller.js';
// import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', upload.single('image'), uploadImage);

export default router;