const express = require('express');
const router = express.Router();
const Class = require('../models/Class.model');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');
const checkBlocked = require('../middleware/checkBlocked.middleware');

// 🌐 PUBLIC: Get all APPROVED classes (with Search, Filter, and Pagination)
router.get('/', async (req, res) => {
  try {
    const { search = '', category = '', page = 1, limit = 6 } = req.query;
    
    // Build query object
    const query = { status: 'approved' };
    
    // Requirements checklist: Search by name via $regex
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    // Requirements checklist: Filter by category via $in
    if (category) {
      const categoryArray = category.split(',');
      query.category = { $in: categoryArray };
    }

    // Requirements checklist: Server-side pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalClasses = await Class.countDocuments(query);
    
    const classes = await Class.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ bookingCount: -1 }); // Default home page sort requirement

    res.status(200).json({
      classes,
      totalPages: Math.ceil(totalClasses / limit),
      currentPage: parseInt(page),
      totalClasses
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving classes', error: error.message });
  }
});

// 🌐 PUBLIC: Class Details Page By ID
router.get('/:id', async (req, res) => {
  try {
    const gymClass = await Class.findById(req.params.id);
    if (!gymClass) return res.status(404).json({ message: 'Class not found' });
    res.status(200).json(gymClass);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving class details', error: error.message });
  }
});

// 🏋️ TRAINER: Add Class (Default status is 'pending')
router.post('/', verifyToken, authorizeRoles('trainer'), checkBlocked, async (req, res) => {
  try {
    const newClass = new Class({
      ...req.body,
      trainerEmail: req.user.email,
      status: 'pending',
      bookingCount: 0
    });
    const savedClass = await newClass.save();
    res.status(201).json({ message: 'Class submitted for approval', savedClass });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create class', error: error.message });
  }
});

// 👑 ADMIN: Manage Classes (Approve/Reject/Delete)
router.patch('/:id/status', verifyToken, authorizeRoles('admin'), async (req, res) => {
  const { status } = req.body; // 'approved' or 'rejected'
  try {
    const updatedClass = await Class.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ message: `Class status updated to ${status}`, updatedClass });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status', error: error.message });
  }
});

router.delete('/:id', verifyToken, authorizeRoles('admin', 'trainer'), checkBlocked, async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Class deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete class', error: error.message });
  }
});

module.exports = router;