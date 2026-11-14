import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DoctorAuthProvider } from './context/DoctorAuthContext';

import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';

import UserDashboardLayout from './components/layout/UserDashboardLayout';
import DoctorDashboardLayout from './components/layout/DoctorDashboardLayout';
import AdminDashboardLayout from './components/layout/AdminDashboardLayout';

import HomePage from './pages/Home/HomePage';
import ExplorePage from './pages/Explore/ExplorePage';
import DiseaseDetailPage from './pages/Explore/DiseaseDetailPage';
import AboutPage from './pages/About/AboutPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import AccountSetupPage from './pages/Auth/AccountSetupPage';

import OverviewPage from './pages/UserDashboard/OverviewPage';
import DailyReportsPage from './pages/UserDashboard/DailyReportsPage';
import HealthAnalyticsPage from './pages/UserDashboard/HealthAnalyticsPage';
import MedicalHistoryPage from './pages/UserDashboard/MedicalHistoryPage';
import AiAssistantPage from './pages/UserDashboard/AiAssistantPage';
import DoctorConsultationPage from './pages/UserDashboard/DoctorConsultationPage';
import QrProfilePage from './pages/UserDashboard/QrProfilePage';
import SettingsPage from './pages/UserDashboard/SettingsPage';
import ConnectedDevicesPage from './pages/UserDashboard/ConnectedDevicesPage';

import DoctorLoginPage from './pages/DoctorPortal/DoctorLoginPage';
import DoctorRegisterPage from './pages/DoctorPortal/DoctorRegisterPage';
import DoctorForgotPasswordPage from './pages/DoctorPortal/DoctorForgotPasswordPage';
import DoctorPendingPage from './pages/DoctorPortal/DoctorPendingPage';
import DoctorSuspendedPage from './pages/DoctorPortal/DoctorSuspendedPage';
import DoctorOverviewPage from './pages/DoctorPortal/DoctorOverviewPage';
import DoctorPatientsPage from './pages/DoctorPortal/DoctorPatientsPage';
import DoctorPatientDetailPage from './pages/DoctorPortal/DoctorPatientDetailPage';
import DoctorAppointmentsPage from './pages/DoctorPortal/DoctorAppointmentsPage';
import DoctorVideoConsultationPage from './pages/DoctorPortal/DoctorVideoConsultationPage';
import DoctorReportsPage from './pages/DoctorPortal/DoctorReportsPage';
import DoctorNewReportPage from './pages/DoctorPortal/DoctorNewReportPage';
import DoctorMedicalRecordsPage from './pages/DoctorPortal/DoctorMedicalRecordsPage';
import DoctorSettingsPage from './pages/DoctorPortal/DoctorSettingsPage';
import DoctorPrescriptionsPage from './pages/DoctorPortal/DoctorPrescriptionsPage';
import DoctorNewPrescriptionPage from './pages/DoctorPortal/DoctorNewPrescriptionPage';
import DoctorExplorePage from './pages/DoctorPortal/DoctorExplorePage';
import DoctorProfilePage from './pages/DoctorPortal/DoctorProfilePage';
import DoctorScanQrPage from './pages/DoctorPortal/DoctorScanQrPage';

import AdminOverviewPage from './pages/AdminDashboard/AdminOverviewPage';
import AdminUsersPage from './pages/AdminDashboard/AdminUsersPage';
import AdminRolesPage from './pages/AdminDashboard/AdminRolesPage';
import AdminPatientManagementPage from './pages/AdminDashboard/AdminPatientManagementPage';
import AdminDoctorVerificationPage from './pages/AdminDashboard/AdminDoctorVerificationPage';
import AdminDiseasesPage from './pages/AdminDashboard/AdminDiseasesPage';
import AdminContentPage from './pages/AdminDashboard/AdminContentPage';
import AdminReportsPage from './pages/AdminDashboard/AdminReportsPage';
import AdminPopulationAnalyticsPage from './pages/AdminDashboard/AdminPopulationAnalyticsPage';
import AdminFeedbackPage from './pages/AdminDashboard/AdminFeedbackPage';
import AdminSettingsPage from './pages/AdminDashboard/AdminSettingsPage';

import './App.css';

function AppRoutes() {
  return (
    <>
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
    </>
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
