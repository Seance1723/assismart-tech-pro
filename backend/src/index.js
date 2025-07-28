import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/auth.js';
import subscriptionRoutes from './routes/subscription.js';
import examinerRoutes from './routes/examiners.js';
import { errorHandler } from './middleware/errorHandler.js';
import candidateRoutes from './routes/candidates.js';
import examRoutes from './routes/exams.js';
import questionCategoryRoutes from './routes/questionCategories.js';
import questionRoutes from './routes/questions.js';
import examAssignmentRoutes from './routes/examAssignments.js';

const app = express();
app.use(cors());
app.use(express.json());

// API endpoints
app.use('/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/examiners', examinerRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/question-categories', questionCategoryRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/exam-assignments', examAssignmentRoutes);


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
