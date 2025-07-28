import { pool } from '../config/db.js';

// ---- Subscription Plan CRUD ----

export async function getAllSubscriptions() {
  const [rows] = await pool.query('SELECT * FROM subscriptions ORDER BY id DESC');
  return rows;
}

export async function getSubscriptionById(id) {
  const [rows] = await pool.query('SELECT * FROM subscriptions WHERE id = ?', [id]);
  return rows[0];
}

export async function createSubscriptionPlan({ name, price, duration_days, max_examiners, max_candidates, max_exams, storage_mb, features }) {
  const [result] = await pool.query(
    `INSERT INTO subscriptions
      (name, price, duration_days, max_examiners, max_candidates, max_exams, storage_mb, features)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, price, duration_days, max_examiners, max_candidates, max_exams, storage_mb, JSON.stringify(features || [])]
  );
  return result.insertId;
}

export async function updateSubscriptionPlan(id, { name, price, duration_days, max_examiners, max_candidates, max_exams, storage_mb, features }) {
  await pool.query(
    `UPDATE subscriptions SET name=?, price=?, duration_days=?, max_examiners=?, max_candidates=?, max_exams=?, storage_mb=?, features=?
     WHERE id=?`,
    [name, price, duration_days, max_examiners, max_candidates, max_exams, storage_mb, JSON.stringify(features || []), id]
  );
}

export async function deleteSubscriptionPlan(id) {
  await pool.query('DELETE FROM subscriptions WHERE id=?', [id]);
}

// ---- Assign subscriptions to users (Examiner/Candidate) ----

export async function assignSubscription(user_id, subscription_id, start_date, end_date) {
  // Remove existing active subscription if any
  await pool.query(
    'UPDATE user_subscriptions SET active=0 WHERE user_id=? AND active=1',
    [user_id]
  );
  await pool.query(
    `INSERT INTO user_subscriptions (user_id, subscription_id, start_date, end_date, active)
     VALUES (?, ?, ?, ?, 1)`,
    [user_id, subscription_id, start_date || new Date(), end_date || null]
  );
}

export async function getUserSubscriptionByUserId(user_id) {
  const [rows] = await pool.query(
    `SELECT us.*, s.* FROM user_subscriptions us
      JOIN subscriptions s ON us.subscription_id = s.id
      WHERE us.user_id = ? AND us.active=1 ORDER BY us.start_date DESC LIMIT 1`,
    [user_id]
  );
  return rows[0];
}

// ---- Usage & Analytics ----

export async function getSubscriptionUsageReport() {
  // Example: # of users per subscription
  const [subs] = await pool.query(
    `SELECT s.id, s.name, COUNT(us.id) as user_count
     FROM subscriptions s
     LEFT JOIN user_subscriptions us ON us.subscription_id = s.id AND us.active=1
     GROUP BY s.id ORDER BY s.id`
  );
  return subs;
}

// ---- Set limits for a subscription plan ----

export async function setLimitsForSubscription(id, { max_examiners, max_candidates, max_exams, storage_mb }) {
  await pool.query(
    `UPDATE subscriptions SET max_examiners=?, max_candidates=?, max_exams=?, storage_mb=? WHERE id=?`,
    [max_examiners, max_candidates, max_exams, storage_mb, id]
  );
}
