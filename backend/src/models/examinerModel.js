import { pool } from '../config/db.js';

// Get all examiners (returns only relevant info)
export async function getAllExaminers() {
  const [rows] = await pool.query(
    "SELECT id, email, status, max_candidates, max_exams, max_storage_mb, permissions FROM users WHERE role='examiner'"
  );
  return rows;
}

// Add examiner (status is pending by default)
export async function addExaminer(data) {
  const { email, passwordHash, max_candidates, max_exams, max_storage_mb, permissions } = data;
  const [result] = await pool.query(
    "INSERT INTO users (email, password_hash, role, status, max_candidates, max_exams, max_storage_mb, permissions) VALUES (?, ?, 'examiner', 'pending', ?, ?, ?, ?)",
    [email, passwordHash, max_candidates, max_exams, max_storage_mb, permissions]
  );
  return result.insertId;
}

// Update examiner details (not status)
export async function updateExaminer(id, data) {
  const { email, max_candidates, max_exams, max_storage_mb, permissions } = data;
  await pool.query(
    "UPDATE users SET email=?, max_candidates=?, max_exams=?, max_storage_mb=?, permissions=? WHERE id=?",
    [email, max_candidates, max_exams, max_storage_mb, permissions, id]
  );
}

// Delete examiner
export async function deleteExaminer(id) {
  await pool.query("DELETE FROM users WHERE id=?", [id]);
}

// Approve examiner
export async function approveExaminer(id) {
  await pool.query("UPDATE users SET status='approved' WHERE id=?", [id]);
}

// Suspend examiner
export async function suspendExaminer(id) {
  await pool.query("UPDATE users SET status='suspended' WHERE id=?", [id]);
}

// Examiner activity log - get
export async function getExaminerLog(examiner_id) {
  const [rows] = await pool.query(
    "SELECT * FROM examiner_activity_log WHERE examiner_id=? ORDER BY created_at DESC",
    [examiner_id]
  );
  return rows;
}

// Examiner activity log - add
export async function addExaminerLog(examiner_id, activity, details) {
  await pool.query(
    "INSERT INTO examiner_activity_log (examiner_id, activity, details) VALUES (?, ?, ?)",
    [examiner_id, activity, details]
  );
}
