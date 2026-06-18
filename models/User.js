import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['user', 'trainer', 'admin'],
    default: 'user',
  },
  status: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
  password: {
    type: String,
    default: '',
  },
}, { timestamps: true });

export default mongoose.model('User', userSchema);