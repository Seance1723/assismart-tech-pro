import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  candidateReport, examReport,
  downloadCandidateCSV, downloadCandidatePDF
} from '../controllers/examinerReportsController.js';

const router = express.Router();
router.get('/candidates', authenticateToken, candidateReport);
router.get('/exams', authenticateToken, examReport);
router.get('/candidates/csv', authenticateToken, downloadCandidateCSV);
router.get('/candidates/pdf', authenticateToken, downloadCandidatePDF);
export default router;
