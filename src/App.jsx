import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

import ClientsPage from "./pages/superadmin/ClientsPage.jsx";
import CandidatesPage from "./pages/superadmin/CandidatesPage.jsx";

import DashboardPage from "./pages/client/DashboardPage.jsx";
import CandidateDetailPage from "./pages/client/CandidateDetailPage.jsx";

import AttendancePage from "./pages/candidate/AttendancePage.jsx";

import CandidateAttendancePage from "./pages/superadmin/CandidateAttendancePage.jsx";

import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Superadmin */}
      <Route
        path="/superadmin/clients"
        element={
          <ProtectedRoute role="superadmin">
            <ClientsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin/candidates"
        element={
          <ProtectedRoute role="superadmin">
            <CandidatesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/superadmin/candidates/:candidateId/attendance"
        element={
          <ProtectedRoute role="superadmin">
            <CandidateAttendancePage />
          </ProtectedRoute>
        }
      />

      {/* Client */}
      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute role="client">
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/candidates/:candidateId"
        element={
          <ProtectedRoute role="client">
            <CandidateDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Candidate */}
      <Route
        path="/candidate/attendance"
        element={
          <ProtectedRoute role="candidate">
            <AttendancePage />
          </ProtectedRoute>
        }
      />

      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
