import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  listCandidates,
  createCandidate,
  editCandidate,
  removeCandidate
} from '../controllers/examinerCandidateController.js';

const router = express.Router();

router.get('/', authenticateToken, listCandidates);
router.post('/', authenticateToken, createCandidate);
router.put('/:id', authenticateToken, editCandidate);
router.delete('/:id', authenticateToken, removeCandidate);

export default router;
