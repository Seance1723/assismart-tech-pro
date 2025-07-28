import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { candidateDashboard } from '../controllers/candidateDashboardController.js';

const router = express.Router();
router.get('/summary', authenticateToken, candidateDashboard);
export default router;
