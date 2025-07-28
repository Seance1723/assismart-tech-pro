import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// Route imports
import authRoutes from './routes/auth.js';
import adminDashboardRoutes from './routes/adminDashboard.js';
import candidateRoutes from './routes/candidates.js';
import examinerRoutes from './routes/examiners.js';
import examRoutes from './routes/exams.js';
import examAssignmentRoutes from './routes/examAssignments.js';
import questionCategoryRoutes from './routes/questionCategories.js';
import questionRoutes from './routes/questions.js';
import certificateRoutes from './routes/certificates.js';
import subscriptionRoutes from './routes/subscriptions.js';
import examinerSubscriptionRoutes from './routes/examinerSubscriptions.js';
import examinerCandidateRoutes from './routes/examinerCandidates.js';
import adminExaminerAssignmentsRoutes from './routes/adminExaminerAssignments.js';
import examinerAssignmentsRoutes from './routes/examinerAssignments.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/admin-dashboard', adminDashboardRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/examiners', examinerRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/exam-assignments', examAssignmentRoutes);
app.use('/api/question-categories', questionCategoryRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/examiner-subscription', examinerSubscriptionRoutes);
app.use('/api/examiner-candidates', examinerCandidateRoutes);
app.use('/api/admin/examiner-assignments', adminExaminerAssignmentsRoutes);
app.use('/api/examiner/assignments', examinerAssignmentsRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({ error: err.message || 'Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Assismart-Tech-Pro backend running at http://localhost:${PORT}`);
});
