import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function PublicCertificateVerify() {
  const { cert_uid } = useParams();
  const [cert, setCert] = useState(null);
  const [notFound, setNotFound] = useState(false);
  useEffect(() => {
    axios.get(`/api/certificates/verify/${cert_uid}`).then(res => setCert(res.data)).catch(() => setNotFound(true));
  }, [cert_uid]);
  if (notFound) return <div className="container py-4">Certificate Not Found</div>;
  if (!cert) return <div className="container py-4">Loading...</div>;
  return (
    <div className="container py-4">
      <h2>Certificate Verification</h2>
      <div>
        <div><b>Candidate ID:</b> {cert.candidate_id}</div>
        <div><b>Exam ID:</b> {cert.exam_id}</div>
        <div><b>Issue Date:</b> {cert.issue_date}</div>
        <div><b>Certificate ID:</b> {cert.cert_uid}</div>
        <div><b>Status:</b> {cert.status}</div>
        {cert.qr_url && <img src={cert.qr_url} alt="QR" style={{ width: 100 }} />}
        {/* Render parsed HTML template with data_json */}
      </div>
    </div>
  );
}
