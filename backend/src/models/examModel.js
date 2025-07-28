import { pool } from '../config/db.js';

// Get all exams
export async function getAllExams() {
  const [rows] = await pool.query("SELECT * FROM exams ORDER BY start_datetime DESC");
  return rows;
}

// Add exam
export async function addExam(data) {
  const {
    name, description, duration_minutes, pass_mark, max_attempts,
    randomize_questions, subscription_tier, start_datetime, end_datetime, created_by
  } = data;
  const [result] = await pool.query(
    `INSERT INTO exams
      (name, description, duration_minutes, pass_mark, max_attempts, randomize_questions,
       subscription_tier, start_datetime, end_datetime, created_by)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, description, duration_minutes, pass_mark, max_attempts, !!randomize_questions,
     subscription_tier, start_datetime, end_datetime, created_by]
  );
  return result.insertId;
}

// Update exam
export async function updateExam(id, data) {
  const {
    name, description, duration_minutes, pass_mark, max_attempts,
    randomize_questions, subscription_tier, start_datetime, end_datetime
  } = data;
  await pool.query(
    `UPDATE exams SET
      name=?, description=?, duration_minutes=?, pass_mark=?, max_attempts=?, randomize_questions=?,
      subscription_tier=?, start_datetime=?, end_datetime=?
     WHERE id=?`,
    [name, description, duration_minutes, pass_mark, max_attempts, !!randomize_questions,
     subscription_tier, start_datetime, end_datetime, id]
  );
}

// Delete exam
export async function deleteExam(id) {
  await pool.query("DELETE FROM exams WHERE id=?", [id]);
}

// Assign candidate(s) to exam
export async function assignCandidates(exam_id, candidate_ids) {
  const values = candidate_ids.map(cid => [exam_id, cid]);
  await pool.query(
    "INSERT INTO exam_candidates (exam_id, candidate_id) VALUES ?", [values]
  );
}

// Get real-time progress for an exam
export async function getExamProgress(exam_id) {
  const [rows] = await pool.query(
    `SELECT ec.*, c.name, c.email
     FROM exam_candidates ec
     JOIN candidates c ON c.id = ec.candidate_id
     WHERE ec.exam_id = ?`, [exam_id]
  );
  return rows;
}

// Export results (for now, returns all exam_candidates; use for PDF/Excel)
export async function getExamResults(exam_id) {
  const [rows] = await pool.query(
    `SELECT ec.*, c.name, c.email
     FROM exam_candidates ec
     JOIN candidates c ON c.id = ec.candidate_id
     WHERE ec.exam_id = ? AND ec.status='completed'`, [exam_id]
  );
  return rows;
}
