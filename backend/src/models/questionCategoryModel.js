import { pool } from '../config/db.js';

export async function getAllCategories() {
  const [rows] = await pool.query('SELECT * FROM question_categories ORDER BY parent_id, name');
  return rows;
}

export async function addCategory({ name, parent_id }) {
  const [result] = await pool.query(
    'INSERT INTO question_categories (name, parent_id) VALUES (?, ?)', [name, parent_id || null]
  );
  return result.insertId;
}

export async function updateCategory(id, { name, parent_id }) {
  await pool.query('UPDATE question_categories SET name=?, parent_id=? WHERE id=?', [name, parent_id || null, id]);
}

export async function deleteCategory(id) {
  await pool.query('DELETE FROM question_categories WHERE id=?', [id]);
}
