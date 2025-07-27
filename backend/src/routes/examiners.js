import express from 'express'
import {
  listExaminers,
  createExaminer,
  editExaminer,
  removeExaminer,
  getActivityLog,
  approveExaminer,
  suspendExaminer
} from '../controllers/examinerController.js'
import { authenticateToken } from '../middleware/auth.js'

const router = express.Router()

router.get('/', authenticateToken, listExaminers)
router.post('/', authenticateToken, createExaminer)
router.put('/:id', authenticateToken, editExaminer)
router.delete('/:id', authenticateToken, removeExaminer)
router.get('/:id/activity', authenticateToken, getActivityLog)
router.post('/:id/approve', authenticateToken, approveExaminer)
router.post('/:id/suspend', authenticateToken, suspendExaminer)

export default router
