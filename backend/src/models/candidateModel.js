import { pool } from '../config/db.js';

// List all candidates
export async function getAllCandidates() {
  const [rows] = await pool.query("SELECT * FROM candidates");
  return rows;
}

// Get candidate by ID
export async function getCandidate(id) {
  const [rows] = await pool.query("SELECT * FROM candidates WHERE id=?", [id]);
  return rows[0];
}

// Add candidate
export async function addCandidate(data) {
  const {
    email, name, phone, dob, gender, address, examiner_id, status,
    highest_qualification, skills, profile_pic, guardian_name, notes
  } = data;
  const [result] = await pool.query(
    `INSERT INTO candidates
      (email, name, phone, dob, gender, address, examiner_id, status,
      highest_qualification, skills, profile_pic, guardian_name, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      email, name, phone, dob, gender, address, examiner_id, status || 'active',
      highest_qualification, skills, profile_pic, guardian_name, notes
    ]
  );
  return result.insertId;
}

// Update candidate
export async function updateCandidate(id, data) {
  const {
    email, name, phone, dob, gender, address, examiner_id, status,
    highest_qualification, skills, profile_pic, guardian_name, notes
  } = data;
  await pool.query(
    `UPDATE candidates SET
      email=?, name=?, phone=?, dob=?, gender=?, address=?, examiner_id=?, status=?,
      highest_qualification=?, skills=?, profile_pic=?, guardian_name=?, notes=?, updated_at=NOW()
      WHERE id=?`,
    [
      email, name, phone, dob, gender, address, examiner_id, status,
      highest_qualification, skills, profile_pic, guardian_name, notes, id
    ]
  );
}

// Delete candidate
export async function deleteCandidate(id) {
  await pool.query("DELETE FROM candidates WHERE id=?", [id]);
}

// Bulk insert (expects array of candidate objects)
export async function bulkAddCandidates(candidates) {
  const values = candidates.map(c => [
    c.email, c.name, c.phone, c.dob, c.gender, c.address, c.examiner_id, c.status || 'active',
    c.highest_qualification, c.skills, c.profile_pic, c.guardian_name, c.notes
  ]);
  await pool.query(
    `INSERT INTO candidates
      (email, name, phone, dob, gender, address, examiner_id, status,
      highest_qualification, skills, profile_pic, guardian_name, notes)
      VALUES ?`, [values]
  );
}

// Get progress for candidate
export async function getCandidateProgress(id) {
  const [rows] = await pool.query(
    "SELECT * FROM candidate_progress WHERE candidate_id=? ORDER BY taken_at DESC", [id]
  );
  return rows;
}

// Analytics summary
export async function getCandidatesAnalytics() {
  const [byStatus] = await pool.query('SELECT status, COUNT(*) as count FROM candidates GROUP BY status');
  const [byGender] = await pool.query('SELECT gender, COUNT(*) as count FROM candidates GROUP BY gender');
  const [byQualification] = await pool.query('SELECT highest_qualification, COUNT(*) as count FROM candidates GROUP BY highest_qualification');
  return { byStatus, byGender, byQualification };
}
