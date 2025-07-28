import { pool } from '../config/db.js';

// Candidate-wise performance (for this examiner)
export async function getCandidatePerformance(examiner_id) {
  const [rows] = await pool.query(`
    SELECT u.id AS candidate_id, u.email,
      COUNT(er.id) AS attempts,
      AVG(er.score) AS avg_score,
      SUM(er.passed) AS total_passed
    FROM users u
    LEFT JOIN exam_results er ON u.id = er.candidate_id
    WHERE u.role='candidate' AND u.created_by=?
    GROUP BY u.id
  `, [examiner_id]);
  return rows;
}

// Exam-wise performance (for this examiner)
export async function getExamPerformance(examiner_id) {
  const [rows] = await pool.query(`
    SELECT e.id AS exam_id, e.title,
      COUNT(er.id) AS attempts,
      AVG(er.score) AS avg_score,
      SUM(er.passed) AS total_passed
    FROM exam_assignments ea
    JOIN exams e ON ea.exam_id = e.id
    LEFT JOIN exam_results er ON ea.candidate_id = er.candidate_id AND ea.exam_id = er.exam_id
    WHERE ea.examiner_id = ?
    GROUP BY e.id
  `, [examiner_id]);
  return rows;
}
