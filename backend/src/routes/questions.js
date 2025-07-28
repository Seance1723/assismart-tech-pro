import express from 'express';
import multer from 'multer';
import {
  listQuestions,
  createQuestion,
  editQuestion,
  removeQuestion,
  bulkUploadQuestions,
  questionsAnalytics
} from '../controllers/questionController.js';
import { authenticateToken } from '../middleware/auth.js';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.get('/', authenticateToken, listQuestions);
router.post('/', authenticateToken, createQuestion);
router.put('/:id', authenticateToken, editQuestion);
router.delete('/:id', authenticateToken, removeQuestion);

// Bulk upload via CSV
router.post('/bulk-upload', authenticateToken, upload.single('file'), bulkUploadQuestions);

router.get('/analytics', authenticateToken, questionsAnalytics);

export default router;
