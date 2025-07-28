import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { getExamForCandidate, saveExamProgress, submitExam } from '../controllers/candidateExamController.js';

const router = express.Router();
router.get('/:exam_id', authenticateToken, getExamForCandidate);
router.post('/:exam_id/progress', authenticateToken, saveExamProgress);
router.post('/:exam_id/submit', authenticateToken, submitExam);
export default router;
