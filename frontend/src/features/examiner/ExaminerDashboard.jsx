import useAuth from '../../auth/useAuth';
import { Link } from "react-router-dom";

export default function ExaminerDashboard() {
  const { user } = useAuth();
  return (
    <div className="container py-4">
      <h2>Examiner Dashboard</h2>
      <Link className="btn btn-primary" to="/examiner/subscription">View/Upgrade Subscription</Link>
      <div>
        <strong>Candidate quota:</strong> {user.max_candidates || 'N/A'}<br />
        <strong>Exam quota:</strong> {user.max_exams || 'N/A'}<br />
        <strong>Storage quota:</strong> {user.max_storage_mb || 'N/A'} MB
      </div>
      {/* ...rest of dashboard */}
    </div>
  );
}
