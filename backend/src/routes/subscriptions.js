import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  listSubscriptions,
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscriptionById,
  assignSubscriptionToUser,
  getUserSubscription,
  usageReport,
  setSubscriptionLimits
} from '../controllers/subscriptionController.js';

const router = express.Router();

// List all subscription plans (admin)
router.get('/', authenticateToken, listSubscriptions);

// Create a new subscription plan (admin)
router.post('/', authenticateToken, createSubscription);

// Update a subscription plan (admin)
router.put('/:id', authenticateToken, updateSubscription);

// Delete a subscription plan (admin)
router.delete('/:id', authenticateToken, deleteSubscription);

// Get a subscription plan by ID (admin/user)
router.get('/:id', authenticateToken, getSubscriptionById);

// Assign a subscription to a user (admin/examiner)
router.post('/assign', authenticateToken, assignSubscriptionToUser);

// Get a user’s current subscription (admin/user)
router.get('/user/:userId', authenticateToken, getUserSubscription);

// Generate usage report (admin)
router.get('/report/usage', authenticateToken, usageReport);

// Set subscription limits (admin)
router.post('/limits/:id', authenticateToken, setSubscriptionLimits);

export default router;
