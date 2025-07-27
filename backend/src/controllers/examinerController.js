import bcrypt from 'bcrypt';
import {
  getAllExaminers,
  addExaminer,
  updateExaminer,
  deleteExaminer,
  getExaminerLog,
  approveExaminer as approveExaminerModel,
  suspendExaminer as suspendExaminerModel
} from '../models/examinerModel.js';

// List all examiners
export async function listExaminers(req, res, next) {
  try {
    const rows = await getAllExaminers();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// Add examiner
export async function createExaminer(req, res, next) {
  try {
    const { email, password, max_candidates, max_exams, max_storage_mb, permissions } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const id = await addExaminer({
      email, passwordHash, max_candidates, max_exams, max_storage_mb, permissions
    });
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
}

// Edit examiner
export async function editExaminer(req, res, next) {
  try {
    await updateExaminer(req.params.id, req.body);
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
}

// Delete examiner
export async function removeExaminer(req, res, next) {
  try {
    await deleteExaminer(req.params.id);
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
}

// Get activity log
export async function getActivityLog(req, res, next) {
  try {
    const rows = await getExaminerLog(req.params.id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// Approve examiner
export async function approveExaminer(req, res, next) {
  try {
    await approveExaminerModel(req.params.id);
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
}

// Suspend examiner
export async function suspendExaminer(req, res, next) {
  try {
    await suspendExaminerModel(req.params.id);
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
}
