import { pool } from '../config/db.js';

export async function findUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT id, password_hash FROM users WHERE email = ?',
    [email]
  );
  return rows[0];
}

export async function createUser(email, passwordHash) {
  const [result] = await pool.query(
    'INSERT INTO users (email, password_hash) VALUES (?, ?)',
    [email, passwordHash]
  );
  return result.insertId;
}
