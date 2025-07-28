import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { assignExamsToExaminer } from '../controllers/adminExaminerAssignmentController.js';

const router = express.Router();

router.post('/', authenticateToken, assignExamsToExaminer);

export default router;
