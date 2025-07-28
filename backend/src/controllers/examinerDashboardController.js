import { pool } from '../config/db.js';

export async function examinerDashboardSummary(req, res, next) {
  try {
    const userId = req.user.id;

    // 1. Subscription status
    const [[subscription]] = await pool.query(`
      SELECT us.*, s.name AS plan_name, s.price, s.duration_months
      FROM user_subscriptions us
      JOIN subscriptions s ON us.subscription_id = s.id
      WHERE us.user_id = ? AND us.active = 1
      ORDER BY us.id DESC LIMIT 1
    `, [userId]);

    // 2. Candidate summary
    const [[candidateCount]] = await pool.query(
      "SELECT COUNT(*) AS total_candidates FROM users WHERE role='candidate' AND created_by=?",
      [userId]
    );

    // 3. Exam statistics
    // Exams assigned to examiner by admin
    const [assignedExams] = await pool.query(
      `SELECT e.id, e.title
       FROM examiner_exam_assignments a
       JOIN exams e ON a.exam_id = e.id
       WHERE a.examiner_id = ? AND a.exam_id IS NOT NULL`,
      [userId]
    );

    // How many times examiner assigned each exam to their candidates
    const [assignments] = await pool.query(
      `SELECT ea.exam_id, COUNT(ea.candidate_id) AS assigned_count
       FROM exam_assignments ea
       WHERE ea.examiner_id = ?
       GROUP BY ea.exam_id`,
      [userId]
    );
    // Map assigned_count into assignedExams
    const examStats = assignedExams.map(e => ({
      ...e,
      assigned_count: assignments.find(a => a.exam_id === e.id)?.assigned_count || 0
    }));

    res.json({
      subscription: subscription || null,
      total_candidates: candidateCount.total_candidates,
      exams: examStats
    });
  } catch (err) {
    next(err);
  }
}
