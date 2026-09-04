import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-semibold text-slate-600">Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    // Redirect to their respective dashboard if they try to access the other role's page
    if (user?.role === 'farmer') {
      return <Navigate to="/farmer/dashboard" replace />;
    } else if (user?.role === 'worker') {
      return <Navigate to="/worker/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
