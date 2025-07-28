import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  assignedExams,
  assignedGroups,
  assignedSubGroups,
} from '../controllers/examinerAssignmentController.js';

const router = express.Router();

router.get('/exams', authenticateToken, assignedExams);
router.get('/groups', authenticateToken, assignedGroups);
router.get('/subgroups', authenticateToken, assignedSubGroups);

export default router;
