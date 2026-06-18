import Comment from '../models/Comment.js';

// Create comment (Private)
export const createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    const comment = await Comment.create({
      postId,
      userEmail: req.user.email,
      userName: req.user.name,
      userImage: req.user.image || '',
      text,
      replies: [],
    });

    res.status(201).json({ message: 'Comment added successfully', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get comments for a post (Private)
export const getPostComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update comment (Private - own comment only)
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userEmail !== req.user.email) {
      return res.status(403).json({ message: 'Forbidden! Not your comment' });
    }

    comment.text = text;
    await comment.save();

    res.status(200).json({ message: 'Comment updated successfully', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete comment (Private - own comment only)
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.userEmail !== req.user.email) {
      return res.status(403).json({ message: 'Forbidden! Not your comment' });
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add reply to comment (Private)
export const addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.replies.push({
      userEmail: req.user.email,
      userName: req.user.name,
      userImage: req.user.image || '',
      text,
    });

    await comment.save();

    res.status(201).json({ message: 'Reply added successfully', comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};