import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getSummary, getAnalytics } from '../controllers/adminDashboardController.js';

const router = express.Router();

router.get('/summary', authenticateToken, getSummary);
router.get('/analytics', authenticateToken, getAnalytics);

export default router;
