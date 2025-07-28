import { pool } from '../config/db.js';

export async function candidateDashboard(req, res, next) {
  try {
    const userId = req.user.id;
    // 1. Assigned exams (with schedule)
    const [exams] = await pool.query(`
      SELECT e.id, e.title, e.category_id, e.start_time, e.end_time, ea.status
      FROM exam_assignments ea
      JOIN exams e ON ea.exam_id = e.id
      WHERE ea.candidate_id = ?
    `, [userId]);

    // 2. Past exam history/results
    const [history] = await pool.query(`
      SELECT er.exam_id, e.title, er.score, er.passed, er.attempt, er.submitted_at
      FROM exam_results er
      JOIN exams e ON er.exam_id = e.id
      WHERE er.candidate_id = ?
      ORDER BY er.submitted_at DESC
      LIMIT 20
    `, [userId]);

    res.json({ exams, history });
  } catch (err) { next(err); }
}
