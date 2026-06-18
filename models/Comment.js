import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ForumPost',
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    default: '',
  },
  text: {
    type: String,
    required: true,
  },
  replies: [replySchema],
}, { timestamps: true });

export default mongoose.model('Comment', commentSchema);