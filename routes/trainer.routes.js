const express = require('express');
const router = express.Router();
const TrainerApplication = require('../models/TrainerApplication.model');
const User = require('../models/User.model');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');
const checkBlocked = require('../middleware/checkBlocked.middleware');

// 🔒 PRIVATE (User): Apply to become a Trainer
router.post('/apply', verifyToken, authorizeRoles('user'), checkBlocked, async (req, res) => {
  try {
    // Prevent duplicate active/pending applications
    const existingApp = await TrainerApplication.findOne({ userId: req.user.id });
    if (existingApp && existingApp.status === 'pending') {
      return res.status(400).json({ message: 'You already have a pending application under review.' });
    }

    const newApplication = new TrainerApplication({
      userId: req.user.id,
      experience: req.body.experience,
      specialty: req.body.specialty,
      status: 'pending',
      feedback: ''
    });

    await newApplication.save();
    res.status(201).json({ message: 'Trainer application submitted successfully!', newApplication });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit application', error: error.message });
  }
});

// 👑 ADMIN: Get all applications for review (populates applicant user details)
router.get('/applications', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const applications = await TrainerApplication.find().populate('userId', 'name email image');
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trainer applications', error: error.message });
  }
});

// 👑 ADMIN: Review Application (Approve/Reject with feedback)
router.patch('/applications/:id/status', verifyToken, authorizeRoles('admin'), async (req, res) => {
  const { status, feedback } = req.body; // status: 'approved' or 'rejected'
  try {
    const app = await TrainerApplication.findById(req.params.id);
    if (!app) {
      return res.status(404).json({ message: 'Trainer application not found.' });
    }

    app.status = status;
    app.feedback = feedback || '';
    await app.save();

    // Assignment Rule: If approved, upgrade the user's global role to 'trainer'
    if (status === 'approved') {
      await User.findByIdAndUpdate(app.userId, { role: 'trainer' });
    }

    res.status(200).json({ message: `Application has been ${status}`, app });
  } catch (error) {
    res.status(500).json({ message: 'Failed to process application status update', error: error.message });
  }
});

module.exports = router;