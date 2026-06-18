import mongoose from 'mongoose';

const classSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  schedule: {
    days: [String],
    time: String,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  trainerEmail: {
    type: String,
    required: true,
  },
  trainerName: {
    type: String,
    required: true,
  },
  bookingCount: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.model('Class', classSchema);