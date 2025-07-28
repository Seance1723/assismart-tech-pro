import {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory
} from '../models/questionCategoryModel.js';

export async function listCategories(req, res, next) {
  try {
    res.json(await getAllCategories());
  } catch (err) { next(err); }
}
export async function createCategory(req, res, next) {
  try {
    const id = await addCategory(req.body);
    res.status(201).json({ id });
  } catch (err) { next(err); }
}
export async function editCategory(req, res, next) {
  try {
    await updateCategory(req.params.id, req.body);
    res.json({ status: 'ok' });
  } catch (err) { next(err); }
}
export async function removeCategory(req, res, next) {
  try {
    await deleteCategory(req.params.id);
    res.json({ status: 'ok' });
  } catch (err) { next(err); }
}
