import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  className: {
    type: String,
    required: true,
  },
  trainerName: {
    type: String,
    required: true,
  },
  schedule: {
    days: [String],
    time: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  transactionId: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);