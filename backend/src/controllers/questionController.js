import fs from 'fs';
import csv from 'csv-parser';
import {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  bulkAddQuestions,
  getQuestionAnalytics
} from '../models/questionModel.js';

// List
export async function listQuestions(req, res, next) {
  try {
    res.json(await getQuestions(req.query));
  } catch (err) { next(err); }
}

// Add
export async function createQuestion(req, res, next) {
  try {
    const id = await addQuestion(req.body);
    res.status(201).json({ id });
  } catch (err) { next(err); }
}

// Edit
export async function editQuestion(req, res, next) {
  try {
    await updateQuestion(req.params.id, req.body);
    res.json({ status: 'ok' });
  } catch (err) { next(err); }
}

// Delete
export async function removeQuestion(req, res, next) {
  try {
    await deleteQuestion(req.params.id);
    res.json({ status: 'ok' });
  } catch (err) { next(err); }
}

// Bulk upload (CSV)
export async function bulkUploadQuestions(req, res, next) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    const questions = [];
    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (row) => questions.push(row))
      .on('end', async () => {
        await bulkAddQuestions(questions);
        fs.unlinkSync(file.path);
        res.json({ status: 'ok', count: questions.length });
      });
  } catch (err) { next(err); }
}

// Analytics
export async function questionsAnalytics(req, res, next) {
  try {
    res.json(await getQuestionAnalytics());
  } catch (err) { next(err); }
}
