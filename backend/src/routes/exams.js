import express from 'express';
import {
  listExams, createExam, editExam, removeExam,
  assignExamCandidates, getExamProgressAPI, exportExamResultsAPI
} from '../controllers/examController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, listExams);
router.post('/', authenticateToken, createExam);
router.put('/:id', authenticateToken, editExam);
router.delete('/:id', authenticateToken, removeExam);

router.post('/assign', authenticateToken, assignExamCandidates);
router.get('/:id/progress', authenticateToken, getExamProgressAPI);
router.get('/:id/export', authenticateToken, exportExamResultsAPI);

export default router;
