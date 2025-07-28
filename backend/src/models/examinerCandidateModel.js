import { pool } from '../config/db.js';

export async function getCandidatesByExaminer(examinerId) {
  const [rows] = await pool.query(
    "SELECT id, email, status, created_at FROM users WHERE role='candidate' AND created_by=?",
    [examinerId]
  );
  return rows;
}

export async function addCandidate({ email, password_hash, status, examinerId }) {
  const [result] = await pool.query(
    "INSERT INTO users (email, password_hash, role, status, created_by) VALUES (?, ?, 'candidate', ?, ?)",
    [email, password_hash, status, examinerId]
  );
  return result.insertId;
}

export async function updateCandidate(id, { email, status }, examinerId) {
  await pool.query(
    "UPDATE users SET email=?, status=? WHERE id=? AND created_by=? AND role='candidate'",
    [email, status, id, examinerId]
  );
}

export async function deleteCandidate(id, examinerId) {
  await pool.query(
    "DELETE FROM users WHERE id=? AND created_by=? AND role='candidate'",
    [id, examinerId]
  );
}
