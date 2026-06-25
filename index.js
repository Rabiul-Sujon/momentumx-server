import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/connectDB.js';
import { auth } from './config/betterAuth.js';
import { toNodeHandler } from 'better-auth/node';

// Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import classRoutes from './routes/class.routes.js';
import bookingRoutes from './routes/booking.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import trainerRoutes from './routes/trainer.routes.js';
import forumRoutes from './routes/forum.routes.js';
import commentRoutes from './routes/comment.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import uploadRoutes from './routes/upload.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// app.use(cors({
//   origin: [
//     'http://localhost:3000',
//     'https://momentumx-client.vercel.app',
//     'https://momentumx.vercel.app',
//     process.env.CLIENT_URL,
//   ],
//   credentials: true,
// }));

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://momentumx-client.vercel.app',
    process.env.CLIENT_URL,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'Set-Cookie'],
}));
// app.options('*', cors({
//   origin: [
//     'http://localhost:3000',
//     'https://momentumx-client.vercel.app',
//     process.env.CLIENT_URL,
//   ],
//   credentials: true,
// }));
app.use(express.json());
app.use(cookieParser());

// Connect Database
connectDB();

// Better Auth handler
app.all('/api/auth/{*path}', toNodeHandler(auth));

// Routes
// app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/upload', uploadRoutes);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'MomentumX Server is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
