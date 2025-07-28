import {
  getAllSubscriptions,
  getSubscriptionById as getSubById,
  createSubscriptionPlan,
  updateSubscriptionPlan,
  deleteSubscriptionPlan,
  assignSubscription,
  getUserSubscriptionByUserId,
  getSubscriptionUsageReport,
  setLimitsForSubscription
} from '../models/subscriptionModel.js';

// List all subscription plans (admin)
export async function listSubscriptions(req, res, next) {
  try {
    const plans = await getAllSubscriptions();
    res.json(plans);
  } catch (err) { next(err); }
}

// Create a new subscription plan (admin)
export async function createSubscription(req, res, next) {
  try {
    const id = await createSubscriptionPlan(req.body);
    res.status(201).json({ id });
  } catch (err) { next(err); }
}

// Update a subscription plan (admin)
export async function updateSubscription(req, res, next) {
  try {
    await updateSubscriptionPlan(req.params.id, req.body);
    res.json({ status: 'ok' });
  } catch (err) { next(err); }
}

// Delete a subscription plan (admin)
export async function deleteSubscription(req, res, next) {
  try {
    await deleteSubscriptionPlan(req.params.id);
    res.json({ status: 'ok' });
  } catch (err) { next(err); }
}

// Get a subscription plan by ID (admin/user)
export async function getSubscriptionById(req, res, next) {
  try {
    const plan = await getSubById(req.params.id);
    if (!plan) return res.status(404).json({ error: 'Not found' });
    res.json(plan);
  } catch (err) { next(err); }
}

// Assign a subscription to a user (admin/examiner)
export async function assignSubscriptionToUser(req, res, next) {
  try {
    const { user_id, subscription_id, start_date, end_date } = req.body;
    if (!user_id || !subscription_id) {
      return res.status(400).json({ error: 'user_id and subscription_id required' });
    }
    await assignSubscription(user_id, subscription_id, start_date, end_date);
    res.json({ status: 'assigned' });
  } catch (err) { next(err); }
}

// Get a user’s current subscription (admin/user)
export async function getUserSubscription(req, res, next) {
  try {
    const userId = req.params.userId;
    const sub = await getUserSubscriptionByUserId(userId);
    if (!sub) return res.status(404).json({ error: 'Not found' });
    res.json(sub);
  } catch (err) { next(err); }
}

// Generate usage report (admin)
export async function usageReport(req, res, next) {
  try {
    const data = await getSubscriptionUsageReport();
    res.json(data);
  } catch (err) { next(err); }
}

// Set subscription limits (admin)
export async function setSubscriptionLimits(req, res, next) {
  try {
    await setLimitsForSubscription(req.params.id, req.body);
    res.json({ status: 'ok' });
  } catch (err) { next(err); }
}
