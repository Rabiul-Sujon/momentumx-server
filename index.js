import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import connectDB from './db/connectDB.js';
import { auth } from './config/betterAuth.js';
import { toNodeHandler } from 'better-auth/node';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Connect Database
connectDB();

// Better Auth handler
app.all('/api/auth/{*path}', toNodeHandler(auth));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'MomentumX Server is running!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
