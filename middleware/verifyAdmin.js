import verifyToken from './verifyToken.js';

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user?.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Forbidden! Admin access only' });
    }
  });
};

export default verifyAdmin;