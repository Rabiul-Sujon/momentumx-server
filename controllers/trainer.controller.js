import TrainerApplication from '../models/TrainerApplication.js';
import User from '../models/User.js';
import Class from '../models/Class.js';
import Booking from '../models/Booking.js';

// Apply as trainer (User)
export const applyAsTrainer = async (req, res) => {
  try {
    const { experience, specialty } = req.body;

    // Check if already applied
    const existingApplication = await TrainerApplication.findOne({
      userEmail: req.user.email,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied as a trainer' });
    }

    const application = await TrainerApplication.create({
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      experience,
      specialty,
      status: 'pending',
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's trainer application status
export const getApplicationStatus = async (req, res) => {
  try {
    const application = await TrainerApplication.findOne({
      userEmail: req.user.email,
    });

    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all pending applications (Admin)
export const getAllApplications = async (req, res) => {
  try {
    const applications = await TrainerApplication.find({ status: 'pending' })
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Approve trainer application (Admin)
export const approveApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const application = await TrainerApplication.findByIdAndUpdate(
      id,
      { status: 'approved', feedback },
      { new: true }
    );

    // Update user role to trainer
    await User.findOneAndUpdate(
      { email: application.userEmail },
      { role: 'trainer' }
    );

    res.status(200).json({ message: 'Trainer application approved', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject trainer application (Admin)
export const rejectApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { feedback } = req.body;

    const application = await TrainerApplication.findByIdAndUpdate(
      id,
      { status: 'rejected', feedback },
      { new: true }
    );

    res.status(200).json({ message: 'Trainer application rejected', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all trainers (Admin)
export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer' }).select('-password');
    res.status(200).json(trainers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Demote trainer to user (Admin)
export const demoteTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      { role: 'user' },
      { new: true }
    ).select('-password');

    res.status(200).json({ message: 'Trainer demoted to user', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get trainer dashboard stats
export const getTrainerStats = async (req, res) => {
  try {
    const totalClasses = await Class.countDocuments({
      trainerEmail: req.user.email,
    });

    const trainerClasses = await Class.find({
      trainerEmail: req.user.email,
    }).select('_id');

    const classIds = trainerClasses.map((c) => c._id);

    const totalStudents = await Booking.countDocuments({
      classId: { $in: classIds },
    });

    res.status(200).json({ totalClasses, totalStudents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};