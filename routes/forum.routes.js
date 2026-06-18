const express = require('express');
const router = express.Router();
const ForumPost = require('../models/ForumPost.model');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');
const checkBlocked = require('../middleware/checkBlocked.middleware');

// 🌐 PUBLIC: Get all forum posts with pagination (Latest first)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const totalPosts = await ForumPost.countDocuments();
    const posts = await ForumPost.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      posts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching forum posts', error: error.message });
  }
});

// 🌐 PUBLIC: Get single post details
router.get('/:id', async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving post', error: error.message });
  }
});

// 🔒 PRIVATE (Admin/Trainer): Create a Forum Post
router.post('/', verifyToken, authorizeRoles('admin', 'trainer'), checkBlocked, async (req, res) => {
  try {
    const newPost = new ForumPost({
      title: req.body.title,
      image: req.body.image, // URL from our upload route
      description: req.body.description,
      authorEmail: req.user.email,
      role: req.user.role, // Badge rendering source
      likes: [],
      dislikes: []
    });

    await newPost.save();
    res.status(201).json({ message: 'Forum post published!', newPost });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
});

// 🔒 PRIVATE (All logged-in users): Like / Dislike Toggle (Enforces strict 1-vote rule)
router.patch('/:id/vote', verifyToken, checkBlocked, async (req, res) => {
  const { voteType } = req.body; // 'like' or 'dislike'
  const userEmail = req.user.email;

  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (voteType === 'like') {
      // Clean up dislike if it exists
      post.dislikes = post.dislikes.filter(email => email !== userEmail);
      // Toggle like array
      if (post.likes.includes(userEmail)) {
        post.likes = post.likes.filter(email => email !== userEmail);
      } else {
        post.likes.push(userEmail);
      }
    } else if (voteType === 'dislike') {
      // Clean up like if it exists
      post.likes = post.likes.filter(email => email !== userEmail);
      // Toggle dislike array
      if (post.dislikes.includes(userEmail)) {
        post.dislikes = post.dislikes.filter(email => email !== userEmail);
      } else {
        post.dislikes.push(userEmail);
      }
    }

    await post.save();
    res.status(200).json({ message: 'Vote processed successfully', post });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process vote', error: error.message });
  }
});

// 👑 ADMIN / OWNER: Delete Forum Post
router.delete('/:id', verifyToken, authorizeRoles('admin', 'trainer'), checkBlocked, async (req, res) => {
  try {
    const post = await ForumPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    // Trainers can only delete their own posts; admins can delete anything
    if (req.user.role === 'trainer' && post.authorEmail !== req.user.email) {
      return res.status(403).json({ message: 'Unauthorized execution' });
    }

    await ForumPost.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove post', error: error.message });
  }
});

module.exports = router;