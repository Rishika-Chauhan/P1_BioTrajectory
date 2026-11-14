import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DoctorAuthProvider } from './context/DoctorAuthContext';

import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

import UserDashboardLayout from './components/layout/UserDashboardLayout';
import DoctorDashboardLayout from './components/layout/DoctorDashboardLayout';
import AdminDashboardLayout from './components/layout/AdminDashboardLayout';

// Eager load primary landing page for zero-delay first contentful paint
import HomePage from './pages/Home/HomePage';

// Lazy load secondary route bundles to minimize initial JavaScript payload
const ExplorePage = lazy(() => import('./pages/Explore/ExplorePage'));
const DiseaseDetailPage = lazy(() => import('./pages/Explore/DiseaseDetailPage'));
const AboutPage = lazy(() => import('./pages/About/AboutPage'));
const LoginPage = lazy(() => import('./pages/Auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/Auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/Auth/ForgotPasswordPage'));
const AccountSetupPage = lazy(() => import('./pages/Auth/AccountSetupPage'));

// User Dashboard
const OverviewPage = lazy(() => import('./pages/UserDashboard/OverviewPage'));
const DailyReportsPage = lazy(() => import('./pages/UserDashboard/DailyReportsPage'));
const HealthAnalyticsPage = lazy(() => import('./pages/UserDashboard/HealthAnalyticsPage'));
const MedicalHistoryPage = lazy(() => import('./pages/UserDashboard/MedicalHistoryPage'));
const AiAssistantPage = lazy(() => import('./pages/UserDashboard/AiAssistantPage'));
const DoctorConsultationPage = lazy(() => import('./pages/UserDashboard/DoctorConsultationPage'));
const QrProfilePage = lazy(() => import('./pages/UserDashboard/QrProfilePage'));
const SettingsPage = lazy(() => import('./pages/UserDashboard/SettingsPage'));
const ConnectedDevicesPage = lazy(() => import('./pages/UserDashboard/ConnectedDevicesPage'));

// Doctor Portal
const DoctorLoginPage = lazy(() => import('./pages/DoctorPortal/DoctorLoginPage'));
const DoctorRegisterPage = lazy(() => import('./pages/DoctorPortal/DoctorRegisterPage'));
const DoctorForgotPasswordPage = lazy(() => import('./pages/DoctorPortal/DoctorForgotPasswordPage'));
const DoctorPendingPage = lazy(() => import('./pages/DoctorPortal/DoctorPendingPage'));
const DoctorSuspendedPage = lazy(() => import('./pages/DoctorPortal/DoctorSuspendedPage'));
const DoctorOverviewPage = lazy(() => import('./pages/DoctorPortal/DoctorOverviewPage'));
const DoctorPatientsPage = lazy(() => import('./pages/DoctorPortal/DoctorPatientsPage'));
const DoctorPatientDetailPage = lazy(() => import('./pages/DoctorPortal/DoctorPatientDetailPage'));
const DoctorAppointmentsPage = lazy(() => import('./pages/DoctorPortal/DoctorAppointmentsPage'));
const DoctorVideoConsultationPage = lazy(() => import('./pages/DoctorPortal/DoctorVideoConsultationPage'));
const DoctorReportsPage = lazy(() => import('./pages/DoctorPortal/DoctorReportsPage'));
const DoctorNewReportPage = lazy(() => import('./pages/DoctorPortal/DoctorNewReportPage'));
const DoctorMedicalRecordsPage = lazy(() => import('./pages/DoctorPortal/DoctorMedicalRecordsPage'));
const DoctorSettingsPage = lazy(() => import('./pages/DoctorPortal/DoctorSettingsPage'));
const DoctorPrescriptionsPage = lazy(() => import('./pages/DoctorPortal/DoctorPrescriptionsPage'));
const DoctorNewPrescriptionPage = lazy(() => import('./pages/DoctorPortal/DoctorNewPrescriptionPage'));
const DoctorExplorePage = lazy(() => import('./pages/DoctorPortal/DoctorExplorePage'));
const DoctorProfilePage = lazy(() => import('./pages/DoctorPortal/DoctorProfilePage'));
const DoctorScanQrPage = lazy(() => import('./pages/DoctorPortal/DoctorScanQrPage'));

// Admin Portal
const AdminOverviewPage = lazy(() => import('./pages/AdminDashboard/AdminOverviewPage'));
const AdminUsersPage = lazy(() => import('./pages/AdminDashboard/AdminUsersPage'));
const AdminRolesPage = lazy(() => import('./pages/AdminDashboard/AdminRolesPage'));
const AdminPatientManagementPage = lazy(() => import('./pages/AdminDashboard/AdminPatientManagementPage'));
const AdminDoctorVerificationPage = lazy(() => import('./pages/AdminDashboard/AdminDoctorVerificationPage'));
const AdminDiseasesPage = lazy(() => import('./pages/AdminDashboard/AdminDiseasesPage'));
const AdminContentPage = lazy(() => import('./pages/AdminDashboard/AdminContentPage'));
const AdminReportsPage = lazy(() => import('./pages/AdminDashboard/AdminReportsPage'));
const AdminPopulationAnalyticsPage = lazy(() => import('./pages/AdminDashboard/AdminPopulationAnalyticsPage'));
const AdminFeedbackPage = lazy(() => import('./pages/AdminDashboard/AdminFeedbackPage'));
const AdminSettingsPage = lazy(() => import('./pages/AdminDashboard/AdminSettingsPage'));

import './App.css';

const PageFallbackLoader = () => (
  <div className="min-h-[55vh] flex flex-col items-center justify-center space-y-3">
    <div className="w-9 h-9 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
    <span className="text-[12px] font-semibold text-slate-400 tracking-wider">Loading...</span>
  </div>
);

function AppRoutes() {
  return (
    <Suspense fallback={<PageFallbackLoader />}>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <HomePage />
            </>
          }
        />
        <Route
          path="/home"
          element={
            <>
              <Navbar />
              <HomePage />
            </>
          }
        />
        <Route
          path="/explore"
          element={
            <>
              <Navbar />
              <ExplorePage />
            </>
          }
        />
        <Route
          path="/explore/:id"
          element={
            <>
              <Navbar />
              <DiseaseDetailPage />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <AboutPage />
            </>
          }
        />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/account-setup" element={<AccountSetupPage />} />

        <Route path="/doctor/login" element={<DoctorLoginPage />} />
        <Route path="/doctor/register" element={<DoctorRegisterPage />} />
        <Route path="/doctor/forgot-password" element={<DoctorForgotPasswordPage />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <UserDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="reports" element={<DailyReportsPage />} />
          <Route path="analytics" element={<HealthAnalyticsPage />} />
          <Route path="history" element={<MedicalHistoryPage />} />
          <Route path="assistant" element={<AiAssistantPage />} />
          <Route path="consultation" element={<DoctorConsultationPage />} />
          <Route path="qr" element={<QrProfilePage />} />
          <Route path="devices" element={<ConnectedDevicesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route
          path="/doctor/pending"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR_PENDING']}>
              <DoctorPendingPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/suspended"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR_SUSPENDED']}>
              <DoctorSuspendedPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR', 'DOCTOR_PENDING', 'DOCTOR_SUSPENDED']}>
              <DoctorDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DoctorOverviewPage />} />
          <Route path="scan-qr" element={<DoctorScanQrPage />} />
          <Route path="patients" element={<DoctorPatientsPage />} />
          <Route path="patients/:id" element={<DoctorPatientDetailPage />} />
          <Route path="appointments" element={<DoctorAppointmentsPage />} />
          <Route path="video-consultation" element={<DoctorVideoConsultationPage />} />
          <Route path="reports" element={<DoctorReportsPage />} />
          <Route path="reports/new" element={<DoctorNewReportPage />} />
          <Route path="medical-records" element={<DoctorMedicalRecordsPage />} />
          <Route path="records" element={<DoctorMedicalRecordsPage />} />
          <Route path="prescriptions" element={<DoctorPrescriptionsPage />} />
          <Route path="prescriptions/new" element={<DoctorNewPrescriptionPage />} />
          <Route path="explore" element={<DoctorExplorePage />} />
          <Route path="profile" element={<DoctorProfilePage />} />
          <Route path="settings" element={<DoctorSettingsPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminOverviewPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="roles" element={<AdminRolesPage />} />
          <Route path="patients" element={<AdminPatientManagementPage />} />
          <Route path="patient-management" element={<AdminPatientManagementPage />} />
          <Route path="verification" element={<AdminDoctorVerificationPage />} />
          <Route path="doctor-verification" element={<AdminDoctorVerificationPage />} />
          <Route path="diseases" element={<AdminDiseasesPage />} />
          <Route path="content" element={<AdminContentPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="analytics" element={<AdminPopulationAnalyticsPage />} />
          <Route path="feedback" element={<AdminFeedbackPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <DoctorAuthProvider>
            <AppRoutes />
          </DoctorAuthProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
