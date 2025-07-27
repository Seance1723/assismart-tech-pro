import express from 'express';
import multer from 'multer';
import {
  listCandidates, getOneCandidate, createCandidate, editCandidate, removeCandidate,
  bulkImportCandidates, getCandidateProgressAPI, bulkUploadCandidates, getCandidatesAnalyticsAPI
} from '../controllers/candidateController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', authenticateToken, listCandidates);
router.get('/:id', authenticateToken, getOneCandidate);
router.post('/', authenticateToken, createCandidate);
router.put('/:id', authenticateToken, editCandidate);
router.delete('/:id', authenticateToken, removeCandidate);

// Bulk operations
router.post('/bulk', authenticateToken, bulkImportCandidates);
router.post('/bulk-upload', authenticateToken, upload.single('file'), bulkUploadCandidates);

// Progress and analytics
router.get('/:id/progress', authenticateToken, getCandidateProgressAPI);
router.get('/analytics', authenticateToken, getCandidatesAnalyticsAPI);

export default router;
