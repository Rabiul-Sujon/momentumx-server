import express from 'express';
import {
  createPost,
  getAllPosts,
  getLatestPosts,
  getSinglePost,
  votePost,
  getTrainerPosts,
  deletePost,
  getAllPostsAdmin,
} from '../controllers/forum.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import verifyAdmin from '../middleware/verifyAdmin.js';
import verifyTrainer from '../middleware/verifyTrainer.js';

const router = express.Router();

router.get('/', getAllPosts);
router.get('/latest', getLatestPosts);
router.get('/my-posts', verifyTrainer, getTrainerPosts);
router.get('/admin', verifyAdmin, getAllPostsAdmin);
router.get('/:id', verifyToken, getSinglePost);
router.post('/', verifyTrainer, createPost);
router.put('/vote/:id', verifyToken, votePost);
router.delete('/:id', verifyTrainer, deletePost);

export default router;