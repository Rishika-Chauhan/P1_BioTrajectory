import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DoctorAuthProvider } from './context/DoctorAuthContext';

// Common Layouts & Route Guards
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import UserDashboardLayout from './components/layout/UserDashboardLayout';
import AdminDashboardLayout from './components/layout/AdminDashboardLayout';
import DoctorDashboardLayout from './components/layout/DoctorDashboardLayout';

// Public Pages
import HomePage from './pages/Home/HomePage';
import ExplorePage from './pages/Explore/ExplorePage';
import DiseaseDetailPage from './pages/Explore/DiseaseDetailPage';
import AboutPage from './pages/About/AboutPage';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import AccountSetupPage from './pages/Auth/AccountSetupPage';

// User Dashboard Pages
import OverviewPage from './pages/UserDashboard/OverviewPage';
import DailyReportsPage from './pages/UserDashboard/DailyReportsPage';
import HealthAnalyticsPage from './pages/UserDashboard/HealthAnalyticsPage';
import MedicalHistoryPage from './pages/UserDashboard/MedicalHistoryPage';
import AiAssistantPage from './pages/UserDashboard/AiAssistantPage';
import QrProfilePage from './pages/UserDashboard/QrProfilePage';
import DoctorConsultationPage from './pages/UserDashboard/DoctorConsultationPage';
import SettingsPage from './pages/UserDashboard/SettingsPage';

// Admin Dashboard Pages
import AdminOverviewPage from './pages/AdminDashboard/AdminOverviewPage';
import AdminUsersPage from './pages/AdminDashboard/AdminUsersPage';
import AdminRolesPage from './pages/AdminDashboard/AdminRolesPage';
import AdminDiseasesPage from './pages/AdminDashboard/AdminDiseasesPage';
import AdminContentPage from './pages/AdminDashboard/AdminContentPage';
import AdminReportsPage from './pages/AdminDashboard/AdminReportsPage';
import AdminPopulationAnalyticsPage from './pages/AdminDashboard/AdminPopulationAnalyticsPage';
import AdminFeedbackPage from './pages/AdminDashboard/AdminFeedbackPage';
import AdminSettingsPage from './pages/AdminDashboard/AdminSettingsPage';

// Doctor Portal Pages
import DoctorRegisterPage from './pages/DoctorPortal/DoctorRegisterPage';
import DoctorPendingPage from './pages/DoctorPortal/DoctorPendingPage';
import DoctorSuspendedPage from './pages/DoctorPortal/DoctorSuspendedPage';
import DoctorOverviewPage from './pages/DoctorPortal/DoctorOverviewPage';
import DoctorScanQrPage from './pages/DoctorPortal/DoctorScanQrPage';
import DoctorPatientsPage from './pages/DoctorPortal/DoctorPatientsPage';
import DoctorPatientDetailPage from './pages/DoctorPortal/DoctorPatientDetailPage';
import DoctorAppointmentsPage from './pages/DoctorPortal/DoctorAppointmentsPage';
import DoctorVideoConsultationPage from './pages/DoctorPortal/DoctorVideoConsultationPage';
import DoctorReportsPage from './pages/DoctorPortal/DoctorReportsPage';
import DoctorNewReportPage from './pages/DoctorPortal/DoctorNewReportPage';
import DoctorPrescriptionsPage from './pages/DoctorPortal/DoctorPrescriptionsPage';
import DoctorNewPrescriptionPage from './pages/DoctorPortal/DoctorNewPrescriptionPage';
import DoctorExplorePage from './pages/DoctorPortal/DoctorExplorePage';
import DoctorProfilePage from './pages/DoctorPortal/DoctorProfilePage';

// Public Layout Wrapper with standard Navbar and Footer
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-1 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DoctorAuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes — strictly standard navigation */}
              <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
              <Route path="/explore" element={<PublicLayout><ExplorePage /></PublicLayout>} />
              <Route path="/explore/:id" element={<PublicLayout><DiseaseDetailPage /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />

              {/* ONE Unified Common Login Page for ALL Roles (User, Doctor, Admin) */}
              <Route path="/login" element={<PublicLayout><LoginPage /></PublicLayout>} />
              
              {/* Public Registration (Creates USER accounts only) */}
              <Route path="/register" element={<PublicLayout><RegisterPage /></PublicLayout>} />
              <Route path="/forgot-password" element={<PublicLayout><ForgotPasswordPage /></PublicLayout>} />
              
              {/* Unassigned / Unknown Role Setup Page */}
              <Route path="/account-setup" element={<PublicLayout><AccountSetupPage /></PublicLayout>} />

              {/* Redirect old separate doctor login to unified common /login */}
              <Route path="/doctor/login" element={<Navigate to="/login" replace />} />
              <Route path="/doctor/forgot-password" element={<Navigate to="/forgot-password" replace />} />

              {/* Doctor Status & Special Workflow Pages */}
              <Route path="/doctor/pending" element={<PublicLayout><DoctorPendingPage /></PublicLayout>} />
              <Route path="/doctor/suspended" element={<PublicLayout><DoctorSuspendedPage /></PublicLayout>} />
              <Route path="/doctor/register" element={<PublicLayout><DoctorRegisterPage /></PublicLayout>} />
              <Route path="/doctor/apply" element={<PublicLayout><DoctorRegisterPage /></PublicLayout>} />

              {/* User / Patient Dashboard — Protected for USER role */}
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
                <Route path="qr" element={<QrProfilePage />} />
                <Route path="consultation" element={<DoctorConsultationPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Doctor Portal — Protected for DOCTOR role */}
              <Route
                path="/doctor"
                element={
                  <ProtectedRoute allowedRoles={['DOCTOR']}>
                    <DoctorDashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/doctor/dashboard" replace />} />
                <Route path="dashboard" element={<DoctorOverviewPage />} />
                <Route path="scan-qr" element={<DoctorScanQrPage />} />
                <Route path="patients" element={<DoctorPatientsPage />} />
                <Route path="patients/:id" element={<DoctorPatientDetailPage />} />
                <Route path="appointments" element={<DoctorAppointmentsPage />} />
                <Route path="video-consultation" element={<DoctorVideoConsultationPage />} />
                <Route path="reports" element={<DoctorReportsPage />} />
                <Route path="reports/new" element={<DoctorNewReportPage />} />
                <Route path="prescriptions" element={<DoctorPrescriptionsPage />} />
                <Route path="prescriptions/new" element={<DoctorNewPrescriptionPage />} />
                <Route path="explore" element={<DoctorExplorePage />} />
                <Route path="explore/:id" element={<DoctorExplorePage />} />
                <Route path="profile" element={<DoctorProfilePage />} />
              </Route>

              {/* Admin Dashboard — Protected for ADMIN role */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminOverviewPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="roles" element={<AdminRolesPage />} />
                <Route path="diseases" element={<AdminDiseasesPage />} />
                <Route path="content" element={<AdminContentPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
                <Route path="analytics" element={<AdminPopulationAnalyticsPage />} />
                <Route path="feedback" element={<AdminFeedbackPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* Catch-all Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </DoctorAuthProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
