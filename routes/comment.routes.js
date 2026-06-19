import express from 'express';
import {
  createComment,
  getPostComments,
  updateComment,
  deleteComment,
  addReply,
} from '../controllers/comment.controller.js';
import verifyToken from '../middleware/verifyToken.js';
import checkBlocked from '../middleware/checkBlocked.js';

const router = express.Router();

router.post('/', verifyToken, checkBlocked, createComment);
router.get('/:postId', verifyToken, getPostComments);
router.put('/:id', verifyToken, checkBlocked, updateComment);
router.delete('/:id', verifyToken, deleteComment);
router.post('/reply/:id', verifyToken, checkBlocked, addReply);

export default router;