import Favorite from '../models/Favorite.js';

// Add to favorites
export const addFavorite = async (req, res) => {
  try {
    const { classId, className, trainerName, category, price, image } = req.body;

    // Check if already in favorites
    const existingFavorite = await Favorite.findOne({
      userEmail: req.user.email,
      classId,
    });

    if (existingFavorite) {
      return res.status(400).json({ message: 'Class already in favorites' });
    }

    const favorite = await Favorite.create({
      userEmail: req.user.email,
      classId,
      className,
      trainerName,
      category,
      price,
      image,
    });

    res.status(201).json({ message: 'Added to favorites successfully', favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check if class is in favorites
export const checkFavorite = async (req, res) => {
  try {
    const { classId } = req.params;

    const favorite = await Favorite.findOne({
      userEmail: req.user.email,
      classId,
    });

    res.status(200).json({ favorited: !!favorite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user's favorites
export const getUserFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userEmail: req.user.email })
      .sort({ createdAt: -1 });

    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from favorites
export const removeFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    await Favorite.findByIdAndDelete(id);

    res.status(200).json({ message: 'Removed from favorites successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get total favorites count (User dashboard)
export const getUserFavoritesCount = async (req, res) => {
  try {
    const count = await Favorite.countDocuments({ userEmail: req.user.email });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};