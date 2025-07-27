import { pool } from '../config/db.js';

export async function findUserByEmail(email) {
  const [rows] = await pool.query(
    'SELECT id, password_hash, role FROM users WHERE email = ?',
    [email]
  );
  console.log('findUserByEmail:', rows); // Add this line
  return rows[0];
}

export async function createUser(email, passwordHash, role = 'examiner') {
  const [result] = await pool.query(
    'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
    [email, passwordHash, role]
  );
  return result.insertId;
}