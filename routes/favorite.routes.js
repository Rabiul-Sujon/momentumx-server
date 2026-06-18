const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite.model');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');

// 🔒 PRIVATE (User): Add a class to favorites (with duplicate check guardrail)
router.post('/', verifyToken, authorizeRoles('user'), async (req, res) => {
  const { classId } = req.body;
  try {
    const existingFav = await Favorite.findOne({ userId: req.user.id, classId });
    if (existingFav) {
      return res.status(400).json({ message: 'This class is already in your favorites!' });
    }

    const newFavorite = new Favorite({ userId: req.user.id, classId });
    await newFavorite.save();

    res.status(201).json({ message: 'Added to favorites successfully!', newFavorite });
  } catch (error) {
    res.status(500).json({ message: 'Failed to favorite class', error: error.message });
  }
});

// 🔒 PRIVATE (User): Get current user's complete favorites list
router.get('/my-favorites', verifyToken, authorizeRoles('user'), async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.user.id }).populate('classId');
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve favorites', error: error.message });
  }
});

// 🔒 PRIVATE (User): Remove class from favorites
router.delete('/:id', verifyToken, authorizeRoles('user'), async (req, res) => {
  try {
    await Favorite.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.status(200).json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete favorite', error: error.message });
  }
});

module.exports = router;