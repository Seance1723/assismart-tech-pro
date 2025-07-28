import {
  getAllExams, addExam, updateExam, deleteExam, assignCandidates,
  getExamProgress, getExamResults
} from '../models/examModel.js';

// List all exams
export async function listExams(req, res, next) {
  try {
    const exams = await getAllExams();
    res.json(exams);
  } catch (err) { next(err); }
}

// Add exam
export async function createExam(req, res, next) {
  try {
    const created_by = req.user.id;
    const id = await addExam({ ...req.body, created_by });
    res.status(201).json({ id });
  } catch (err) { next(err); }
}

// Edit exam
export async function editExam(req, res, next) {
  try {
    await updateExam(req.params.id, req.body);
    res.json({ status: 'ok' });
  } catch (err) { next(err); }
}

// Delete
export async function removeExam(req, res, next) {
  try {
    await deleteExam(req.params.id);
    res.json({ status: 'ok' });
  } catch (err) { next(err); }
}

// Assign candidates
export async function assignExamCandidates(req, res, next) {
  try {
    const { exam_id, candidate_ids } = req.body;
    await assignCandidates(exam_id, candidate_ids);
    res.json({ status: 'ok' });
  } catch (err) { next(err); }
}

// Real-time progress
export async function getExamProgressAPI(req, res, next) {
  try {
    const data = await getExamProgress(req.params.id);
    res.json(data);
  } catch (err) { next(err); }
}

// Export exam results (Excel/PDF)
export async function exportExamResultsAPI(req, res, next) {
  try {
    const rows = await getExamResults(req.params.id);
    // For now, send JSON. (For Excel/PDF, integrate exceljs or pdfkit.)
    res.json(rows);
  } catch (err) { next(err); }
}
