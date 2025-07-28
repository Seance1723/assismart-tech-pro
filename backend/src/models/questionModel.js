import { pool } from '../config/db.js';

export async function getQuestions(filter = {}) {
  const { category_id, difficulty, tag } = filter;
  let sql = 'SELECT * FROM questions WHERE 1=1';
  let params = [];
  if (category_id) { sql += ' AND category_id=?'; params.push(category_id); }
  if (difficulty) { sql += ' AND difficulty=?'; params.push(difficulty); }
  if (tag) { sql += " AND FIND_IN_SET(?, tags)"; params.push(tag); }
  sql += ' ORDER BY id DESC';
  const [rows] = await pool.query(sql, params);
  return rows;
}

export async function addQuestion(data) {
  const { category_id, question_text, difficulty, tags } = data;
  const [result] = await pool.query(
    'INSERT INTO questions (category_id, question_text, difficulty, tags) VALUES (?, ?, ?, ?)',
    [category_id, question_text, difficulty, tags]
  );
  return result.insertId;
}

export async function updateQuestion(id, data) {
  const { category_id, question_text, difficulty, tags } = data;
  await pool.query(
    'UPDATE questions SET category_id=?, question_text=?, difficulty=?, tags=? WHERE id=?',
    [category_id, question_text, difficulty, tags, id]
  );
}

export async function deleteQuestion(id) {
  await pool.query('DELETE FROM questions WHERE id=?', [id]);
}

// Bulk insert (from CSV/Excel)
export async function bulkAddQuestions(questions) {
  const values = questions.map(q => [
    q.category_id, q.question_text, q.difficulty || 'medium', q.tags || ''
  ]);
  await pool.query(
    'INSERT INTO questions (category_id, question_text, difficulty, tags) VALUES ?',
    [values]
  );
}

// Analytics: Most frequently missed, avg time taken, etc.
export async function getQuestionAnalytics() {
  // Most missed = low correctness rate, Avg time = avg(time_taken_sec)
  const [missed] = await pool.query(`
    SELECT q.id, q.question_text, COUNT(a.id) as attempts, 
      SUM(CASE WHEN a.is_correct=0 THEN 1 ELSE 0 END) as missed,
      IFNULL(AVG(a.time_taken_sec),0) as avg_time_sec
    FROM questions q
    LEFT JOIN question_attempts a ON a.question_id = q.id
    GROUP BY q.id
    ORDER BY missed DESC, attempts DESC
    LIMIT 10
  `);
  return missed;
}
