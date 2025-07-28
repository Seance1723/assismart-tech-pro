import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import {
  currentSubscription,
  billingHistory,
  invoiceList
} from '../controllers/examinerSubscriptionController.js';

const router = express.Router();

router.get('/current', authenticateToken, currentSubscription);
router.get('/history', authenticateToken, billingHistory);
router.get('/invoices', authenticateToken, invoiceList);
// router.post('/upgrade', ...)  // (future: upgrade/downgrade logic)

export default router;
