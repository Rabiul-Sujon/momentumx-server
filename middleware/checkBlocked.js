import User from '../models/User.js';

const checkBlocked = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.user?.email });
    if (user?.status === 'blocked') {
      return res.status(403).json({ message: 'Action restricted by Admin' });
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export default checkBlocked;