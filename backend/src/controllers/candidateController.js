import fs from 'fs';
import csv from 'csv-parser';
import {
  getAllCandidates,
  getCandidate,
  addCandidate,
  updateCandidate,
  deleteCandidate,
  bulkAddCandidates,
  getCandidateProgress,
  getCandidatesAnalytics
} from '../models/candidateModel.js';

// List all candidates
export async function listCandidates(req, res, next) {
  try {
    const data = await getAllCandidates();
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// Get one candidate
export async function getOneCandidate(req, res, next) {
  try {
    const data = await getCandidate(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// Add candidate
export async function createCandidate(req, res, next) {
  try {
    const id = await addCandidate(req.body);
    res.status(201).json({ id });
  } catch (err) {
    next(err);
  }
}

// Edit candidate
export async function editCandidate(req, res, next) {
  try {
    await updateCandidate(req.params.id, req.body);
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
}

// Delete candidate
export async function removeCandidate(req, res, next) {
  try {
    await deleteCandidate(req.params.id);
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
}

// Bulk import from JSON/CSV (API, not file)
export async function bulkImportCandidates(req, res, next) {
  try {
    await bulkAddCandidates(req.body.candidates);
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
}

// Bulk import via file upload (CSV)
export async function bulkUploadCandidates(req, res, next) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const candidates = [];
    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (row) => candidates.push(row))
      .on('end', async () => {
        try {
          await bulkAddCandidates(candidates);
          fs.unlinkSync(file.path); // Cleanup uploaded file
          res.json({ status: 'ok', count: candidates.length });
        } catch (err) {
          fs.unlinkSync(file.path);
          next(err);
        }
      })
      .on('error', (err) => {
        fs.unlinkSync(file.path);
        next(err);
      });
  } catch (err) {
    next(err);
  }
}

// Get candidate progress (analytics per candidate)
export async function getCandidateProgressAPI(req, res, next) {
  try {
    const rows = await getCandidateProgress(req.params.id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// Advanced analytics summary for dashboard charts
export async function getCandidatesAnalyticsAPI(req, res, next) {
  try {
    const analytics = await getCandidatesAnalytics();
    res.json(analytics);
  } catch (err) {
    next(err);
  }
}
