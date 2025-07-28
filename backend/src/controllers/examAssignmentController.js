import {
  assignExamToCandidate,
  getAssignedExamsForCandidate,
  getAssignedQuestionsForExamCandidate
} from '../models/examAssignmentModel.js';

// Admin assigns exam + specific questions
export async function assignExam(req, res, next) {
  try {
    const { exam_id, candidate_id, question_ids } = req.body;
    if (!exam_id || !candidate_id || !Array.isArray(question_ids) || !question_ids.length)
      return res.status(400).json({ error: 'Missing required fields.' });

    const exam_candidate_id = await assignExamToCandidate({ exam_id, candidate_id, question_ids });
    res.status(201).json({ exam_candidate_id });
  } catch (err) { next(err); }
}

// View all assigned exams for candidate
export async function candidateExams(req, res, next) {
  try {
    const { candidate_id } = req.params;
    res.json(await getAssignedExamsForCandidate(candidate_id));
  } catch (err) { next(err); }
}

// View all assigned questions for an exam assignment
export async function assignedQuestions(req, res, next) {
  try {
    const { exam_candidate_id } = req.params;
    res.json(await getAssignedQuestionsForExamCandidate(exam_candidate_id));
  } catch (err) { next(err); }
}
