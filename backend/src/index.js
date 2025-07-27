import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.js';
import subscriptionRoutes from './routes/subscription.js';
import examinerRoutes from './routes/examiners.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors());
app.use(express.json());

// API endpoints
app.use('/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/examiners', examinerRoutes);

// Health check / welcome
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Assismart Tech Pro API' });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
