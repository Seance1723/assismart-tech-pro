import { pool } from '../config/db.js';

export async function getTemplates() {
  const [rows] = await pool.query('SELECT * FROM certificate_templates ORDER BY id DESC');
  return rows;
}
export async function addTemplate({ name, html_template, branding_logo, signature_img, created_by }) {
  const [result] = await pool.query(
    'INSERT INTO certificate_templates (name, html_template, branding_logo, signature_img, created_by) VALUES (?, ?, ?, ?, ?)',
    [name, html_template, branding_logo, signature_img, created_by]
  );
  return result.insertId;
}
export async function updateTemplate(id, data) {
  await pool.query(
    'UPDATE certificate_templates SET name=?, html_template=?, branding_logo=?, signature_img=? WHERE id=?',
    [data.name, data.html_template, data.branding_logo, data.signature_img, id]
  );
}
export async function deleteTemplate(id) {
  await pool.query('DELETE FROM certificate_templates WHERE id=?', [id]);
}
export async function issueCertificate({ candidate_id, exam_id, certificate_template_id, cert_uid, data_json, pdf_url, qr_url }) {
  const [result] = await pool.query(
    'INSERT INTO certificates (candidate_id, exam_id, certificate_template_id, cert_uid, data_json, pdf_url, qr_url) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [candidate_id, exam_id, certificate_template_id, cert_uid, JSON.stringify(data_json), pdf_url, qr_url]
  );
  return result.insertId;
}
export async function getCertificateByUid(cert_uid) {
  const [rows] = await pool.query('SELECT * FROM certificates WHERE cert_uid=?', [cert_uid]);
  return rows[0];
}
export async function getCertificatesForCandidate(candidate_id) {
  const [rows] = await pool.query('SELECT * FROM certificates WHERE candidate_id=? ORDER BY issue_date DESC', [candidate_id]);
  return rows;
}
