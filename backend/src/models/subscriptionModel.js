import { pool } from '../config/db.js';

// Get all plans
export async function getAllPlans() {
  const [rows] = await pool.query('SELECT * FROM subscription_plans');
  return rows;
}

// Create plan
export async function createPlan(plan) {
  const { name, price, max_examiners, max_candidates, max_exams, max_storage_mb, features } = plan;
  const [result] = await pool.query(
    'INSERT INTO subscription_plans (name, price, max_examiners, max_candidates, max_exams, max_storage_mb, features) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, price, max_examiners, max_candidates, max_exams, max_storage_mb, features]
  );
  return result.insertId;
}

// Update plan
export async function updatePlan(id, plan) {
  const { name, price, max_examiners, max_candidates, max_exams, max_storage_mb, features } = plan;
  await pool.query(
    'UPDATE subscription_plans SET name=?, price=?, max_examiners=?, max_candidates=?, max_exams=?, max_storage_mb=?, features=? WHERE id=?',
    [name, price, max_examiners, max_candidates, max_exams, max_storage_mb, features, id]
  );
}

// Delete plan
export async function deletePlan(id) {
  await pool.query('DELETE FROM subscription_plans WHERE id=?', [id]);
}
