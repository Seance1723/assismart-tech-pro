import express from 'express';
import { assignExam, candidateExams, assignedQuestions } from '../controllers/examAssignmentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/assign', authenticateToken, assignExam); // admin assigns exam
router.get('/candidate/:candidate_id', authenticateToken, candidateExams); // all assigned exams for candidate
router.get('/:exam_candidate_id/questions', authenticateToken, assignedQuestions); // questions for a candidate’s exam

export default router;
