import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'

// Layout Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import AIChatDrawer from './components/AIChatDrawer'

// Public Pages
import HomePage from './pages/HomePage'
import JobsPage from './pages/JobsPage'
import JobDetailsPage from './pages/JobDetailsPage'
import CompaniesPage from './pages/CompaniesPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Job Seeker Pages
import SeekerDashboard from './pages/seeker/SeekerDashboard'
import SeekerProfile from './pages/seeker/SeekerProfile'
import ApplicationsPage from './pages/seeker/ApplicationsPage'
import SavedJobsPage from './pages/seeker/SavedJobsPage'
import InterviewsPage from './pages/seeker/InterviewsPage'
import JobAlertsPage from './pages/seeker/JobAlertsPage'

// AI Career Suite Tools
import ResumeAnalyzer from './pages/seeker/ai/ResumeAnalyzer'
import CoverLetterGenerator from './pages/seeker/ai/CoverLetterGenerator'
import InterviewPrep from './pages/seeker/ai/InterviewPrep'
import SkillGapAnalyzer from './pages/seeker/ai/SkillGapAnalyzer'

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard'
import RecruiterJobsPage from './pages/recruiter/RecruiterJobsPage'
import ApplicantsPage from './pages/recruiter/ApplicantsPage'
import RecruiterInterviewsPage from './pages/recruiter/RecruiterInterviewsPage'
import CompanySettingsPage from './pages/recruiter/CompanySettingsPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminJobsPage from './pages/admin/AdminJobsPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#0f172a',
                color: '#fff',
                fontSize: '13px',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff'
                }
              },
              error: {
                iconTheme: {
                  primary: '#f43f5e',
                  secondary: '#fff'
                }
              }
            }}
          />

          <Navbar />

          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/jobs/:id" element={<JobDetailsPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Job Seeker Protected Routes */}
              <Route
                path="/seeker/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                    <SeekerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/profile"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                    <SeekerProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/applications"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                    <ApplicationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/saved-jobs"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                    <SavedJobsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/interviews"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                    <InterviewsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/alerts"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                    <JobAlertsPage />
                  </ProtectedRoute>
                }
              />

              {/* AI Career Suite Tools */}
              <Route
                path="/seeker/ai/resume-analyzer"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                    <ResumeAnalyzer />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/ai/cover-letter"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                    <CoverLetterGenerator />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/ai/interview-prep"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                    <InterviewPrep />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seeker/ai/skill-gap"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_JOB_SEEKER']}>
                    <SkillGapAnalyzer />
                  </ProtectedRoute>
                }
              />

              {/* Recruiter Protected Routes */}
              <Route
                path="/recruiter/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/jobs"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
                    <RecruiterJobsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/applicants"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
                    <ApplicantsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/interviews"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
                    <RecruiterInterviewsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recruiter/company"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_RECRUITER']}>
                    <CompanySettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Admin Protected Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminUsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/jobs"
                element={
                  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                    <AdminJobsPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />

          {/* Floating AI Career Assistant */}
          <AIChatDrawer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
