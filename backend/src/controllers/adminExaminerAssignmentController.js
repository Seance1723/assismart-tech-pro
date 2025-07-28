import { setExaminerAssignments } from '../models/examinerAssignmentModel.js';

export async function assignExamsToExaminer(req, res, next) {
  try {
    const { examiner_id, exams = [], groups = [], subgroups = [] } = req.body;
    if (!examiner_id) return res.status(400).json({ error: 'Missing examiner_id' });
    await setExaminerAssignments({
      examiner_id,
      exams,
      groups,
      subgroups,
      admin_id: req.user.id
    });
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
}
