import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

export async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email=?', [email]);
  return rows[0];
}

export async function createUser(email, password, role) {
  const hash = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', [email, hash, role]);
}
