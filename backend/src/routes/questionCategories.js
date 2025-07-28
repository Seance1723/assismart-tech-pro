import express from 'express';
import {
  listCategories,
  createCategory,
  editCategory,
  removeCategory
} from '../controllers/questionCategoryController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, listCategories);
router.post('/', authenticateToken, createCategory);
router.put('/:id', authenticateToken, editCategory);
router.delete('/:id', authenticateToken, removeCategory);

export default router;
