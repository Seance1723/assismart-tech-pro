import { pool } from '../config/db.js';

// Quick summary for dashboard cards
export async function getSummary(req, res, next) {
  try {
    const [[{ active_users }]] = await pool.query("SELECT COUNT(*) AS active_users FROM users WHERE status='approved'");
    const [[{ active_exams }]] = await pool.query("SELECT COUNT(*) AS active_exams FROM exams WHERE active=1");
    const [[{ total_subscriptions }]] = await pool.query("SELECT COUNT(*) AS total_subscriptions FROM user_subscriptions WHERE active=1");
    const [recent_activities] = await pool.query("SELECT * FROM activities ORDER BY created_at DESC LIMIT 10"); // You can customize this

    res.json({
      active_users,
      active_exams,
      total_subscriptions,
      recent_activities
    });
  } catch (err) {
    next(err);
  }
}

// Data for visualizations (user registration, subscription analytics, exam performance)
export async function getAnalytics(req, res, next) {
  try {
    // Example: Users registered per month (last 6 months)
    const [userRegistrations] = await pool.query(`
      SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, COUNT(*) AS count
      FROM users
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
      GROUP BY month
      ORDER BY month
    `);

    // Example: Subscriptions per plan
    const [subscriptionsByPlan] = await pool.query(`
      SELECT s.name, COUNT(us.id) AS count
      FROM subscriptions s
      LEFT JOIN user_subscriptions us ON s.id = us.subscription_id
      GROUP BY s.id
    `);

    // Example: Exam pass rates
    const [examPerformance] = await pool.query(`
      SELECT e.title, COUNT(r.id) AS attempts,
        SUM(r.passed=1) AS passed,
        ROUND(100 * SUM(r.passed=1) / COUNT(r.id), 2) AS pass_rate
      FROM exams e
      LEFT JOIN exam_results r ON r.exam_id = e.id
      GROUP BY e.id
    `);

    res.json({
      userRegistrations,
      subscriptionsByPlan,
      examPerformance
    });
  } catch (err) {
    next(err);
  }
}
