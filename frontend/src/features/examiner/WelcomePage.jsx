import React from 'react';
import useAuth from '../../auth/useAuth';

export default function WelcomePage() {
  const { user } = useAuth();

  if (user.status === 'pending') {
    return (
      <div className="container py-5 text-center">
        <h2>Welcome, {user.email}!</h2>
        <p>Your account is pending admin approval. You will be notified once approved.</p>
      </div>
    );
  }

  if (user.status === 'suspended') {
    return (
      <div className="container py-5 text-center">
        <h2>Account Suspended</h2>
        <p>Your examiner account has been suspended. Please contact support.</p>
      </div>
    );
  }

  // If approved, redirect to dashboard (handled in AppRoutes)
  return null;
}
