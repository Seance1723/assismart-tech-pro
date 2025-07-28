import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getExamResult } from '../controllers/candidateResultController.js';

const router = express.Router();
router.get('/:exam_id/:attempt', authenticateToken, getExamResult);

export default router;
