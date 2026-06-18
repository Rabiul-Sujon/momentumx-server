const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');
const checkBlocked = require('../middleware/checkBlocked.middleware');

// 👑 ADMIN: Get all users to manage
router.get('/', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// 👑 ADMIN: Manage User Status (Block/Unblock)
router.patch('/:id/status', verifyToken, authorizeRoles('admin'), async (req, res) => {
  const { status } = req.body; // 'active' or 'blocked'
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    res.status(200).json({ message: `User status updated to ${status}`, updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user status', error: error.message });
  }
});

// 👑 ADMIN: Promote User to Admin
router.patch('/:id/make-admin', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      { new: true }
    ).select('-password');
    res.status(200).json({ message: 'User promoted to Admin successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to promote user', error: error.message });
  }
});

// 👑 ADMIN: Demote Trainer back to User
router.patch('/:id/demote', verifyToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'user' },
      { new: true }
    ).select('-password');
    res.status(200).json({ message: 'Trainer demoted to User successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Failed to demote trainer', error: error.message });
  }
});

module.exports = router;