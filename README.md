# Assismart Tech Pro

## Features

### User & Role Management
- Multiple user roles: Admin, Examiner, Candidate (flexible structure for future roles)
- Role-based access and menu controls
- Secure login and registration with hashed passwords
- Admin can create, approve, suspend, or delete Examiners and Candidates

### Subscription Management (Admin)
- Manage subscription plans with feature-based access controls
- Configure subscription limits: number of examiners, candidates, exams, and storage
- View and export subscription usage reports

### Examiner Management (Admin)
- Add, edit, delete examiners
- Approve, suspend, and view status of examiner accounts
- Assign permissions, quota (max candidates, exams, storage)
- Examiner activity log with history (created exams, payments, etc.)

### Candidate Management (Admin)
- Add, edit, delete candidates (individually and in bulk)
- Advanced candidate profile: qualification, skills, profile pic, guardian info, notes, etc.
- Bulk import candidates via CSV or JSON, or with file upload
- Export candidates to CSV
- View detailed candidate progress and analytics
- Candidate quick view modal

### Analytics & Dashboard
- Visual charts (pie/bar) for candidate breakdown by status, gender, and qualification
- Real-time examiner and candidate status monitoring

### Exam Management (Admin)
- Define exam structure: duration, pass mark, max attempts, randomization of questions
- Set exam limits and restrictions per subscription tier
- Schedule exams with start/end dates and reminders
- Assign candidates to exams
- Monitor real-time exam progress: candidate logins, attempts, and completion status
- Export exam results and analytics reports (CSV/JSON, PDF/Excel ready)

### Security
- JWT-based authentication and protected routes
- Role-based frontend and backend authorization

### Extensible & Scalable Structure
- Modern folder structure for easy addition of new features and user types
- All modules are API-driven and ready for frontend/backend scaling

---

*Project is modular and ready for advanced integrations (question banks, reminders, notifications, and more).*
