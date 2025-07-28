import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { examinerDashboardSummary } from '../controllers/examinerDashboardController.js';

const router = express.Router();
router.get('/summary', authenticateToken, examinerDashboardSummary);
export default router;
