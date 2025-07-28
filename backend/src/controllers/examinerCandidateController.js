import bcrypt from 'bcrypt';
import {
  getCandidatesByExaminer,
  addCandidate,
  updateCandidate,
  deleteCandidate,
} from '../models/examinerCandidateModel.js';

export async function listCandidates(req, res, next) {
  try {
    const candidates = await getCandidatesByExaminer(req.user.id);
    res.json(candidates);
  } catch (err) {
    next(err);
  }
}

export async function createCandidate(req, res, next) {
  try {
    const { email, password, status = 'approved' } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });
    const password_hash = await bcrypt.hash(password, 10);
    const candidateId = await addCandidate({ email, password_hash, status, examinerId: req.user.id });
    res.json({ id: candidateId, email, status });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      next(err);
    }
  }
}

export async function editCandidate(req, res, next) {
  try {
    const { id } = req.params;
    const { email, status } = req.body;
    await updateCandidate(id, { email, status }, req.user.id);
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
}

export async function removeCandidate(req, res, next) {
  try {
    const { id } = req.params;
    await deleteCandidate(id, req.user.id);
    res.json({ status: 'deleted' });
  } catch (err) {
    next(err);
  }
}
