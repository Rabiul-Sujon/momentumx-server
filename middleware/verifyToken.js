// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

// const verifyToken = (req, res, next) => {
//   const token = req.cookies?.token;

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized! No token provided' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (error) {
//     return res.status(401).json({ message: 'Unauthorized! Invalid token' });
//   }
// };

// export default verifyToken;



// ..................................
import { auth } from '../config/betterAuth.js';
import User from '../models/User.js';

const verifyToken = async (req, res, next) => {
  try {
    // Get session from Better Auth
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized! Please login.' });
    }

    // Get user from your database
    let user = await User.findOne({ email: session.user.email });

    // If user doesn't exist in DB yet, create them
    if (!user) {
      user = await User.create({
        name: session.user.name,
        email: session.user.email,
        image: session.user.image || '',
        role: session.user.role || 'user',
        status: session.user.status || 'active',
      });
    }

    // Attach user to request
    req.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      image: user.image,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized! Invalid session.' });
  }
};

export default verifyToken;