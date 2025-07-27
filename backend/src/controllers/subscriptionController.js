import {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan
} from '../models/subscriptionModel.js';

// Get all plans
export async function getPlans(req, res, next) {
  try {
    const plans = await getAllPlans();
    res.json(plans);
  } catch (err) {
    next(err);
  }
}

// Create new plan
export async function addPlan(req, res, next) {
  try {
    const planId = await createPlan(req.body);
    res.status(201).json({ id: planId });
  } catch (err) {
    next(err);
  }
}

// Update a plan
export async function editPlan(req, res, next) {
  try {
    await updatePlan(req.params.id, req.body);
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
}

// Delete a plan
export async function removePlan(req, res, next) {
  try {
    await deletePlan(req.params.id);
    res.json({ status: 'ok' });
  } catch (err) {
    next(err);
  }
}
