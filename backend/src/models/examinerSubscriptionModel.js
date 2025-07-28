import { pool } from '../config/db.js';

export async function getExaminerSubscription(userId) {
  const [rows] = await pool.query(`
    SELECT us.*, s.name AS plan_name, s.price, s.duration_months
    FROM user_subscriptions us
    JOIN subscriptions s ON us.subscription_id = s.id
    WHERE us.user_id = ? AND us.active = 1
    ORDER BY us.id DESC LIMIT 1
  `, [userId]);
  return rows[0];
}

export async function getBillingHistory(userId) {
  const [rows] = await pool.query(`
    SELECT * FROM payments
    WHERE user_id = ?
    ORDER BY paid_at DESC
  `, [userId]);
  return rows;
}

export async function getInvoices(userId) {
  const [rows] = await pool.query(`
    SELECT * FROM invoices
    WHERE user_id = ?
    ORDER BY issued_at DESC
  `, [userId]);
  return rows;
}

// For upgrades/downgrades: you can implement an "addSubscription" function if you want
