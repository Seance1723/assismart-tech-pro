import { pool } from '../config/db.js';

export async function assignExamToCandidate({ exam_id, candidate_id, question_ids }) {
  // 1. Create exam_candidates entry
  const [result] = await pool.query(
    'INSERT INTO exam_candidates (exam_id, candidate_id) VALUES (?, ?)', [exam_id, candidate_id]
  );
  const exam_candidate_id = result.insertId;

  // 2. Insert questions
  if (question_ids?.length) {
    const values = question_ids.map((qid, idx) => [exam_candidate_id, qid, idx]);
    await pool.query(
      'INSERT INTO exam_candidate_questions (exam_candidate_id, question_id, sort_order) VALUES ?',
      [values]
    );
  }
  return exam_candidate_id;
}

export async function getAssignedExamsForCandidate(candidate_id) {
  const [rows] = await pool.query(
    `SELECT ec.*, e.name as exam_name FROM exam_candidates ec
     JOIN exams e ON e.id = ec.exam_id WHERE ec.candidate_id=?`, [candidate_id]
  );
  return rows;
}

export async function getAssignedQuestionsForExamCandidate(exam_candidate_id) {
  const [rows] = await pool.query(
    `SELECT q.* FROM exam_candidate_questions ecq
     JOIN questions q ON q.id = ecq.question_id
     WHERE ecq.exam_candidate_id = ?
     ORDER BY ecq.sort_order ASC`, [exam_candidate_id]
  );
  return rows;
}
