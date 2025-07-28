import React, { useEffect, useState } from 'react';
import axios from 'axios';
import useAuth from '../../auth/useAuth';

export default function CertificateViewer() {
  const { token } = useAuth();
  const [certs, setCerts] = useState([]);
  useEffect(() => {
    async function fetch() {
      const res = await axios.get('/api/certificates/my', { headers: { Authorization: `Bearer ${token}` } });
      setCerts(res.data);
    }
    fetch();
  }, [token]);

  return (
    <div className="container py-4">
      <h2>Your Certificates</h2>
      <div className="row">
        {certs.map(cert => (
          <div className="col-md-6 mb-4" key={cert.cert_uid}>
            <div className="card">
              <div className="card-body">
                <div><b>Exam:</b> {cert.exam_id}</div>
                <div><b>Issued:</b> {cert.issue_date}</div>
                <div><b>Certificate ID:</b> {cert.cert_uid}</div>
                {cert.qr_url && <img src={cert.qr_url} alt="QR" style={{ width: 100 }} />}
                <div>
                  <a href={`/api/certificates/verify/${cert.cert_uid}`} target="_blank" rel="noopener noreferrer" className="btn btn-link">View / Verify</a>
                  {cert.pdf_url && <a href={cert.pdf_url} className="btn btn-link" download>Download PDF</a>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
