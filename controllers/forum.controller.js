import ForumPost from '../models/ForumPost.js';
import Comment from '../models/Comment.js';

// Create forum post (Trainer/Admin)
export const createPost = async (req, res) => {
  try {
    const { title, image, description } = req.body;

    const post = await ForumPost.create({
      title,
      image,
      description,
      authorEmail: req.user.email,
      authorName: req.user.name,
      authorImage: req.user.image || '',
      authorRole: req.user.role,
    });

    res.status(201).json({ message: 'Post created successfully', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts (Public) with pagination
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 9 } = req.query;

    const total = await ForumPost.countDocuments();
    const posts = await ForumPost.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.status(200).json({
      posts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get latest posts for home page
export const getLatestPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find()
      .sort({ createdAt: -1 })
      .limit(4);

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single post (Private)
export const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await ForumPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like/Dislike post (Private)
export const votePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const userEmail = req.user.email;

    const post = await ForumPost.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (type === 'like') {
      if (post.likes.includes(userEmail)) {
        post.likes = post.likes.filter((e) => e !== userEmail);
      } else {
        post.likes.push(userEmail);
        post.dislikes = post.dislikes.filter((e) => e !== userEmail);
      }
    } else if (type === 'dislike') {
      if (post.dislikes.includes(userEmail)) {
        post.dislikes = post.dislikes.filter((e) => e !== userEmail);
      } else {
        post.dislikes.push(userEmail);
        post.likes = post.likes.filter((e) => e !== userEmail);
      }
    }

    await post.save();
    res.status(200).json({ message: 'Vote recorded', post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trainer's own posts
export const getTrainerPosts = async (req, res) => {
  try {
    const posts = await ForumPost.find({ authorEmail: req.user.email })
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete post (Trainer/Admin)
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await ForumPost.findByIdAndDelete(id);
    await Comment.deleteMany({ postId: id });
    res.status(200).json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts for admin
export const getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};