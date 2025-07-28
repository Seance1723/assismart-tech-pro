import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AssignedExamsView() {
  const [exams, setExams] = useState([]);
  const token = localStorage.getItem('token');
  useEffect(() => {
    axios.get('/api/examiner/assignments/exams', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setExams(res.data));
  }, [token]);
  return (
    <div>
      <h2>My Assigned Exams</h2>
      <ul>
        {exams.map(e => <li key={e.id}>{e.title}</li>)}
      </ul>
    </div>
  );
}
