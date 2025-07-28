import { nanoid } from 'nanoid';
import QRCode from 'qrcode';
import {
  getTemplates, addTemplate, updateTemplate, deleteTemplate,
  issueCertificate, getCertificateByUid, getCertificatesForCandidate
} from '../models/certificateModel.js';

const APP_URL = process.env.APP_URL || 'http://localhost:3000';

export async function listTemplates(req, res, next) {
  try { res.json(await getTemplates()); }
  catch (err) { next(err); }
}
export async function createTemplate(req, res, next) {
  try {
    const id = await addTemplate({ ...req.body, created_by: req.user.id });
    res.status(201).json({ id });
  } catch (err) { next(err); }
}
export async function editTemplate(req, res, next) {
  try {
    await updateTemplate(req.params.id, req.body);
    res.json({ status: 'ok' });
  } catch (err) { next(err); }
}
export async function removeTemplate(req, res, next) {
  try {
    await deleteTemplate(req.params.id);
    res.json({ status: 'ok' });
  } catch (err) { next(err); }
}

export async function autoIssueCertificate({ candidate_id, exam_id, template, data_json }, res, next) {
  try {
    const cert_uid = nanoid(16);
    const certUrl = `${APP_URL}/certificate/verify/${cert_uid}`;
    const qr_url = await QRCode.toDataURL(certUrl);
    const pdf_url = ''; // Placeholder for PDF logic

    const id = await issueCertificate({
      candidate_id, exam_id,
      certificate_template_id: template.id,
      cert_uid, data_json, pdf_url, qr_url
    });
    return { id, cert_uid, qr_url, pdf_url };
  } catch (err) { next(err); }
}

export async function getCertificate(req, res, next) {
  try {
    const { cert_uid } = req.params;
    const cert = await getCertificateByUid(cert_uid);
    if (!cert) return res.status(404).json({ error: 'Not found' });
    res.json(cert);
  } catch (err) { next(err); }
}
export async function candidateCertificates(req, res, next) {
  try {
    res.json(await getCertificatesForCandidate(req.user.id));
  } catch (err) { next(err); }
}
