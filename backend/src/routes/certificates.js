import express from 'express';
import {
  listTemplates, createTemplate, editTemplate, removeTemplate,
  getCertificate, candidateCertificates
} from '../controllers/certificateController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/templates', authenticateToken, listTemplates);
router.post('/templates', authenticateToken, createTemplate);
router.put('/templates/:id', authenticateToken, editTemplate);
router.delete('/templates/:id', authenticateToken, removeTemplate);

router.get('/verify/:cert_uid', getCertificate);

router.get('/my', authenticateToken, candidateCertificates);

export default router;
