import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  authorEmail: {
    type: String,
    required: true,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorImage: {
    type: String,
    default: '',
  },
  authorRole: {
    type: String,
    enum: ['trainer', 'admin'],
    required: true,
  },
  likes: {
    type: [String],
    default: [],
  },
  dislikes: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

export default mongoose.model('ForumPost', forumPostSchema);