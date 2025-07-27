import express from 'express';
import {
  getPlans,
  addPlan,
  editPlan,
  removePlan
} from '../controllers/subscriptionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All endpoints require authentication (can add admin check)
router.get('/', authenticateToken, getPlans);
router.post('/', authenticateToken, addPlan);
router.put('/:id', authenticateToken, editPlan);
router.delete('/:id', authenticateToken, removePlan);

export default router;
