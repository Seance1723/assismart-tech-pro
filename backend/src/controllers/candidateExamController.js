import { pool } from '../config/db.js';

// Fetch exam for candidate (questions, current state/progress if any)
export async function getExamForCandidate(req, res, next) {
  try {
    const { exam_id } = req.params;
    const userId = req.user.id;

    // Confirm candidate is assigned this exam and exam is active
    const [[assignment]] = await pool.query(
      `SELECT * FROM exam_assignments WHERE exam_id=? AND candidate_id=?`,
      [exam_id, userId]
    );
    if (!assignment) return res.status(403).json({ error: 'Exam not assigned' });

    // Get exam details
    const [[exam]] = await pool.query(`SELECT * FROM exams WHERE id=?`, [exam_id]);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    // Get questions (order randomized if required)
    const [questions] = await pool.query(
      `SELECT id, question_text, options, marks FROM questions WHERE exam_id=? ORDER BY id`,
      [exam_id]
    );
    // Optionally randomize if exam.randomize_questions
    // const shuffled = shuffle(questions); // Implement shuffle if needed

    // Get existing progress if any
    const [[progress]] = await pool.query(
      `SELECT answers_json, started_at, remaining_seconds FROM exam_progress WHERE exam_id=? AND candidate_id=?`,
      [exam_id, userId]
    );
    res.json({
      exam,
      questions,
      progress: progress ? {
        answers: JSON.parse(progress.answers_json),
        started_at: progress.started_at,
        remaining_seconds: progress.remaining_seconds
      } : null
    });
  } catch (err) { next(err); }
}

export async function saveExamProgress(req, res, next) {
  try {
    const { exam_id } = req.params;
    const userId = req.user.id;
    const { answers, remaining_seconds } = req.body;
    // Upsert progress
    await pool.query(`
      INSERT INTO exam_progress (exam_id, candidate_id, answers_json, remaining_seconds, started_at)
      VALUES (?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE answers_json=?, remaining_seconds=?
    `, [exam_id, userId, JSON.stringify(answers), remaining_seconds, JSON.stringify(answers), remaining_seconds]);
    res.json({ status: 'saved' });
  } catch (err) { next(err); }
}

export async function submitExam(req, res, next) {
  try {
    const { exam_id } = req.params;
    const userId = req.user.id;
    const { answers } = req.body;

    // Get questions and calculate score
    const [questions] = await pool.query(
      `SELECT id, correct_option, marks FROM questions WHERE exam_id=?`, [exam_id]
    );
    let score = 0;
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] && answers[q.id] === q.correct_option) {
        score += q.marks;
        correctCount++;
      }
    });
    // Save results
    await pool.query(
      `INSERT INTO exam_results (candidate_id, exam_id, score, passed, submitted_at, attempt, answers_json)
       VALUES (?, ?, ?, ?, NOW(), 1, ?)`,
      [userId, exam_id, score, score >= 0.6 * questions.length ? 1 : 0, JSON.stringify(answers)]
    );
    // Delete progress (optional)
    await pool.query(`DELETE FROM exam_progress WHERE exam_id=? AND candidate_id=?`, [exam_id, userId]);
    res.json({ score, total: questions.length, correctCount, passed: score >= 0.6 * questions.length });
  } catch (err) { next(err); }
}
