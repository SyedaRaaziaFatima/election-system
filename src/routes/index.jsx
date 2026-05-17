import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { Register } from '../pages/Register'
import { ForgotPassword } from '../pages/ForgotPassword'
import { Elections } from '../pages/Elections'
import { ElectionDetails } from '../pages/ElectionDetails'
import { Dashboard } from '../pages/Dashboard'
import { About } from '../pages/About'
import { Contact } from '../pages/Contact'
import { ProtectedRoute } from './ProtectedRoute'
import { AdminApprovals } from '../pages/admin/AdminApprovals'
import { AdminUsers } from '../pages/admin/AdminUsers'
import { AdminAuditLogs } from '../pages/admin/AdminAuditLogs'
import { AdminAnalytics } from '../pages/admin/AdminAnalytics'
import { CreateElection } from '../pages/creator/CreateElection'
import { EditElection } from '../pages/creator/EditElection'
import { VoterDashboard } from '../pages/voter/VoterDashboard'
import { VotingPage } from '../pages/voter/VotingPage'
import { ResultsPage } from '../pages/voter/ResultsPage'

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/elections" element={<Elections />} />
        <Route path="/election/:id" element={<ElectionDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/approvals"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminApprovals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminAuditLogs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/create"
          element={
            <ProtectedRoute requiredRole="creator">
              <CreateElection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/election/:id/edit"
          element={
            <ProtectedRoute requiredRole="creator">
              <EditElection />
            </ProtectedRoute>
          }
        />
        <Route
          path="/voter/joined"
          element={
            <ProtectedRoute requiredRole="voter">
              <VoterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vote/:id"
          element={
            <ProtectedRoute requiredRole="voter">
              <VotingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results/:id"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}
