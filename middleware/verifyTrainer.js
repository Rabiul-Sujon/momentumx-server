import verifyToken from './verifyToken.js';

const verifyTrainer = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.role === 'trainer' || req.user?.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden! Trainer access only' });
    }
  });
};

export default verifyTrainer;