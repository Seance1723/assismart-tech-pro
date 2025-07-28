import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ExamResultView() {
  const { exam_id, attempt } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchResult() {
      setError('');
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`/api/candidate-results/${exam_id}/${attempt}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setResult(res.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load result.");
      }
    }
    fetchResult();
  }, [exam_id, attempt]);

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!result) return <div>Loading...</div>;

  return (
    <div className="container py-4">
      <h2>{result.exam_title} - Attempt {result.attempt}</h2>
      <div className="mb-3">
        <strong>Score:</strong> {result.score} <br />
        <strong>Status:</strong> {result.passed ? <span className="text-success">Passed</span> : <span className="text-danger">Failed</span>} <br />
        <strong>Submitted:</strong> {new Date(result.submitted_at).toLocaleString()}
      </div>
      {result.certificate && (
        <div className="mb-3">
          <a href={result.certificate.url} className="btn btn-success" target="_blank" rel="noopener noreferrer">
            Download Certificate
          </a>
        </div>
      )}
      <h4>Question-wise Analysis</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Question</th>
            <th>Your Answer</th>
            <th>Correct?</th>
            <th>Analysis</th>
          </tr>
        </thead>
        <tbody>
          {result.questions.map(q => (
            <tr key={q.id}>
              <td>{q.question_text}</td>
              <td>
                {q.your_answer !== undefined
                  ? q.options[q.your_answer]
                  : <em>Not answered</em>}
              </td>
              <td>
                {q.your_answer === undefined
                  ? "-"
                  : q.is_correct
                    ? <span className="text-success">&#10004;</span>
                    : <span className="text-danger">&#10008;</span>}
              </td>
              <td>{q.analysis}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
