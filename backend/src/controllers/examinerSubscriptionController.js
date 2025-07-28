import {
  getExaminerSubscription,
  getBillingHistory,
  getInvoices
} from '../models/examinerSubscriptionModel.js';

// View current subscription
export async function currentSubscription(req, res, next) {
  try {
    const subscription = await getExaminerSubscription(req.user.id);
    res.json(subscription || {});
  } catch (err) {
    next(err);
  }
}

// Billing history
export async function billingHistory(req, res, next) {
  try {
    const history = await getBillingHistory(req.user.id);
    res.json(history);
  } catch (err) {
    next(err);
  }
}

// Invoice downloads (returns metadata, not PDF itself)
export async function invoiceList(req, res, next) {
  try {
    const invoices = await getInvoices(req.user.id);
    res.json(invoices);
  } catch (err) {
    next(err);
  }
}
