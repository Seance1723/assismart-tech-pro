import {
  getAssignedExamsForExaminer,
  getAssignedGroupsForExaminer,
  getAssignedSubGroupsForExaminer,
} from '../models/examinerAssignmentModel.js';

export async function assignedExams(req, res, next) {
  try {
    const exams = await getAssignedExamsForExaminer(req.user.id);
    res.json(exams);
  } catch (err) { next(err); }
}

export async function assignedGroups(req, res, next) {
  try {
    const groups = await getAssignedGroupsForExaminer(req.user.id);
    res.json(groups);
  } catch (err) { next(err); }
}

export async function assignedSubGroups(req, res, next) {
  try {
    const subgroups = await getAssignedSubGroupsForExaminer(req.user.id);
    res.json(subgroups);
  } catch (err) { next(err); }
}
