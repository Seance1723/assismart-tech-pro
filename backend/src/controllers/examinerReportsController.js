import { getCandidatePerformance, getExamPerformance } from '../models/examinerReportsModel.js';
import { parse } from 'json2csv'; // For Excel/CSV export
import PDFDocument from 'pdfkit'; // For PDF export

export async function candidateReport(req, res, next) {
  try {
    const data = await getCandidatePerformance(req.user.id);
    res.json(data);
  } catch (err) { next(err); }
}

export async function examReport(req, res, next) {
  try {
    const data = await getExamPerformance(req.user.id);
    res.json(data);
  } catch (err) { next(err); }
}

// Download as Excel/CSV
export async function downloadCandidateCSV(req, res, next) {
  try {
    const data = await getCandidatePerformance(req.user.id);
    const csv = parse(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('candidate_report.csv');
    res.send(csv);
  } catch (err) { next(err); }
}

// Download as PDF
export async function downloadCandidatePDF(req, res, next) {
  try {
    const data = await getCandidatePerformance(req.user.id);
    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="candidate_report.pdf"');
    doc.pipe(res);
    doc.fontSize(18).text('Candidate Performance Report', { align: 'center' });
    doc.moveDown();
    data.forEach(c => {
      doc.fontSize(12).text(`Email: ${c.email} | Attempts: ${c.attempts} | Avg Score: ${c.avg_score || 0} | Passed: ${c.total_passed}`);
    });
    doc.end();
  } catch (err) { next(err); }
}
