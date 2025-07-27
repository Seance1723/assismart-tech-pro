import useAuth from '../../auth/useAuth';

export default function ExaminerDashboard() {
  const { user } = useAuth();
  return (
    <div className="container py-4">
      <h2>Examiner Dashboard</h2>
      <div>
        <strong>Candidate quota:</strong> {user.max_candidates || 'N/A'}<br />
        <strong>Exam quota:</strong> {user.max_exams || 'N/A'}<br />
        <strong>Storage quota:</strong> {user.max_storage_mb || 'N/A'} MB
      </div>
      {/* ...rest of dashboard */}
    </div>
  );
}
