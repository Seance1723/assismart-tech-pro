import { pool } from '../config/db.js';

export async function getExamResult(req, res, next) {
  try {
    const { exam_id, attempt } = req.params;
    const userId = req.user.id;

    // Get result record (find by exam, candidate, attempt)
    const [[result]] = await pool.query(
      `SELECT er.*, e.title
       FROM exam_results er
       JOIN exams e ON er.exam_id = e.id
       WHERE er.candidate_id = ? AND er.exam_id = ? AND er.attempt = ?`,
      [userId, exam_id, attempt]
    );
    if (!result) return res.status(404).json({ error: 'Result not found' });

    // Get all exam questions
    const [questions] = await pool.query(
      `SELECT id, question_text, options, correct_option, analysis
       FROM questions WHERE exam_id = ?`, [exam_id]
    );

    // Attach answer details
    const answers = JSON.parse(result.answers_json || '{}');
    const qDetails = questions.map(q => ({
      id: q.id,
      question_text: q.question_text,
      options: JSON.parse(q.options),
      correct_option: q.correct_option,
      your_answer: answers[q.id],
      analysis: q.analysis || '',
      is_correct: answers[q.id] === q.correct_option
    }));

    // Certificate info (if any)
    let certificate = null;
    if (result.passed) {
      const [[cert]] = await pool.query(
        `SELECT * FROM certificates WHERE candidate_id = ? AND exam_id = ?`, [userId, exam_id]
      );
      if (cert) {
        certificate = {
          cert_uid: cert.cert_uid,
          url: `/api/certificates/download/${cert.cert_uid}`
        };
      }
    }

    res.json({
      exam_title: result.title,
      score: result.score,
      passed: !!result.passed,
      attempt: result.attempt,
      submitted_at: result.submitted_at,
      questions: qDetails,
      certificate
    });
  } catch (err) { next(err); }
}
