const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment.model');
const { verifyToken } = require('../middleware/auth.middleware');
const checkBlocked = require('../middleware/checkBlocked.middleware');

// 🌐 PUBLIC: Get comments for a post
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: 1 });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load comments', error: error.message });
  }
});

// 🔒 PRIVATE: Add a comment
router.post('/', verifyToken, checkBlocked, async (req, res) => {
  try {
    const newComment = new Comment({
      postId: req.body.postId,
      userEmail: req.user.email,
      text: req.body.text,
      replies: []
    });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Comment failed', error: error.message });
  }
});

// 🔒 PRIVATE: Edit own comment
router.patch('/:id', verifyToken, checkBlocked, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment missing' });
    if (comment.userEmail !== req.user.email) return res.status(403).json({ message: 'Forbidden' });

    comment.text = req.body.text;
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Update failed', error: error.message });
  }
});

// 🔒 PRIVATE: Delete own comment
router.delete('/:id', verifyToken, checkBlocked, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment missing' });
    if (comment.userEmail !== req.user.email) return res.status(403).json({ message: 'Forbidden' });

    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Deletion failed', error: error.message });
  }
});

module.exports = router;