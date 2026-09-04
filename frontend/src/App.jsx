import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Farmer pages
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import PostJobPage from './pages/farmer/PostJobPage';
import FarmerJobsPage from './pages/farmer/FarmerJobsPage';
import JobApplicationsPage from './pages/farmer/JobApplicationsPage';
import FarmerProfilePage from './pages/farmer/FarmerProfilePage';

// Worker pages
import WorkerDashboard from './pages/worker/WorkerDashboard';
import FindJobsPage from './pages/worker/FindJobsPage';
import WorkerApplicationsPage from './pages/worker/WorkerApplicationsPage';
import WorkerProfilePage from './pages/worker/WorkerProfilePage';

// Shared pages
import NotificationsPage from './pages/NotificationsPage';
import MessagesPage from './pages/MessagesPage';

function App() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50/50">
      <div>
        <Navbar />
        <main>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/find-jobs" element={<FindJobsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Farmer Protected Routes */}
            <Route
              path="/farmer/dashboard"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/post-job"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <PostJobPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/my-jobs"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <FarmerJobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/jobs/:jobId/applications"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <JobApplicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/profile"
              element={
                <ProtectedRoute allowedRole="farmer">
                  <FarmerProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Worker Protected Routes */}
            <Route
              path="/worker/dashboard"
              element={
                <ProtectedRoute allowedRole="worker">
                  <WorkerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/worker/find-jobs"
              element={
                <ProtectedRoute allowedRole="worker">
                  <FindJobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/worker/my-applications"
              element={
                <ProtectedRoute allowedRole="worker">
                  <WorkerApplicationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/worker/profile"
              element={
                <ProtectedRoute allowedRole="worker">
                  <WorkerProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Shared Authenticated Routes */}
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;
