import { pool } from '../config/db.js';

export async function setExaminerAssignments({ examiner_id, exams, groups, subgroups, admin_id }) {
  await pool.query('DELETE FROM examiner_exam_assignments WHERE examiner_id = ?', [examiner_id]);
  for (const exam_id of exams) {
    await pool.query(
      'INSERT INTO examiner_exam_assignments (examiner_id, exam_id, assigned_by) VALUES (?, ?, ?)',
      [examiner_id, exam_id, admin_id]
    );
  }
  for (const group_id of groups) {
    await pool.query(
      'INSERT INTO examiner_exam_assignments (examiner_id, question_group_id, assigned_by) VALUES (?, ?, ?)',
      [examiner_id, group_id, admin_id]
    );
  }
  for (const sub_id of subgroups) {
    await pool.query(
      'INSERT INTO examiner_exam_assignments (examiner_id, question_subgroup_id, assigned_by) VALUES (?, ?, ?)',
      [examiner_id, sub_id, admin_id]
    );
  }
}

export async function getAssignedExamsForExaminer(examiner_id) {
  const [rows] = await pool.query(
    `SELECT e.* FROM examiner_exam_assignments a
     JOIN exams e ON a.exam_id = e.id
     WHERE a.examiner_id = ? AND a.exam_id IS NOT NULL`,
    [examiner_id]
  );
  return rows;
}

export async function getAssignedGroupsForExaminer(examiner_id) {
  const [rows] = await pool.query(
    `SELECT g.* FROM examiner_exam_assignments a
     JOIN question_groups g ON a.question_group_id = g.id
     WHERE a.examiner_id = ? AND a.question_group_id IS NOT NULL`,
    [examiner_id]
  );
  return rows;
}

export async function getAssignedSubGroupsForExaminer(examiner_id) {
  const [rows] = await pool.query(
    `SELECT sg.* FROM examiner_exam_assignments a
     JOIN question_subgroups sg ON a.question_subgroup_id = sg.id
     WHERE a.examiner_id = ? AND a.question_subgroup_id IS NOT NULL`,
    [examiner_id]
  );
  return rows;
}
