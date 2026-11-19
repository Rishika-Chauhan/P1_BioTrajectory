import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Stethoscope,
  QrCode,
  Users,
  Calendar,
  Video,
  FileText,
  Pill,
  BookOpen,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Clock,
  Settings,
  FolderHeart
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { formatDoctorTitle } from '../../services/doctorService';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSwitcher from '../common/LanguageSwitcher';
import BrandLogo from '../common/BrandLogo';

export default function DoctorDashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentDoctor,
    logoutDoctor,
    isVerifiedDoctor,
    isPendingDoctor,
    isSuspendedDoctor
  } = useDoctorAuth();
  const { t, isHindi } = useLanguage();

  // Primary clinical workspace navigation items for desktop sidebar
  const doctorNavItems = [
    { label: t('doctor.overview', {}, 'Overview'), path: '/doctor/dashboard', icon: Stethoscope },
    { label: t('doctor.myPatients', {}, 'My Patients'), path: '/doctor/patients', icon: Users },
    { label: t('doctor.appointments', {}, 'Appointments'), path: '/doctor/appointments', icon: Calendar },
    { label: t('doctor.videoConsultation', {}, 'Video Consultation'), path: '/doctor/video-consultation', icon: Video },
    { label: t('doctor.writeReports', {}, 'Write Reports'), path: '/doctor/reports', icon: FileText },
    { label: t('doctor.medicalRecords', {}, 'Medical Records'), path: '/doctor/medical-records', icon: FolderHeart },
    { label: t('doctor.prescriptions', {}, 'Prescriptions'), path: '/doctor/prescriptions', icon: Pill }
  ];

  // Utility and Account items placed on the top bar (and accessible in mobile drawer)
  const topBarNavItems = [
    { label: t('doctor.scanQr', {}, 'Scan Patient QR'), path: '/doctor/scan-qr', icon: QrCode },
    { label: t('doctor.exploreDiseases', {}, 'Explore Diseases'), path: '/doctor/explore', icon: BookOpen },
    { label: t('doctor.myProfile', {}, 'My Profile'), path: '/doctor/profile', icon: User },
    { label: t('doctor.settings', {}, 'Settings'), path: '/doctor/settings', icon: Settings }
  ];

  const allMobileNavItems = [...doctorNavItems, ...topBarNavItems];

  const handleLogout = () => {
    logoutDoctor();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/doctor/dashboard') {
      return location.pathname === '/doctor/dashboard';
    }
    if (path === '/doctor/medical-records') {
      return (
        location.pathname.startsWith('/doctor/medical-records') ||
        location.pathname.startsWith('/doctor/records') ||
        location.pathname.startsWith('/medical-records')
      );
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen w-full bg-[#F6F0E4] dark:bg-[#1F150E] text-slate-900 dark:text-slate-100 overflow-hidden font-sans">

      {/* 1. DOCTOR SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#251A11] transition-all duration-300 z-30 shrink-0 ${collapsed ? 'w-20' : 'w-72'
          }`}
      >
        {/* Doctor Header */}
        <div className="flex items-center justify-between h-20 px-5 border-b border-slate-200 dark:border-slate-800">
          {!collapsed ? (
            <BrandLogo
              to="/doctor/dashboard"
              icon={Stethoscope}
              subtitle="Doctor Portal"
              size="md"
            />
          ) : (
            <div className="w-full flex justify-center">
              <BrandLogo
                to="/doctor/dashboard"
                icon={Stethoscope}
                size="sm"
                showText={false}
              />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
          {doctorNavItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[16px] font-semibold transition-all ${active
                    ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Doctor Identity & Switcher Bottom */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
          {!collapsed ? (
            <Link
              to="/doctor/profile"
              className={`block p-3.5 rounded-2xl border space-y-2 transition-all cursor-pointer group ${
                isActive('/doctor/profile')
                  ? 'bg-cyan-500/15 border-cyan-500/50 shadow-xs ring-1 ring-cyan-500/30'
                  : 'bg-slate-50 dark:bg-[#1F150E] border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 hover:bg-slate-100/80 dark:hover:bg-[#2B1E15]'
              }`}
              title={isHindi ? 'मेरी प्रोफाइल देखें' : 'View Doctor Profile'}
            >
              <div className="flex items-center gap-3">
                <img
                  src={currentDoctor?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80'}
                  alt={currentDoctor?.name || 'Doctor'}
                  className="w-10 h-10 rounded-xl object-cover border border-cyan-500/30 group-hover:border-cyan-400 group-hover:scale-105 transition-all"
                />
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {formatDoctorTitle(currentDoctor?.name || 'Dr. Sarah Mitchell')}
                    </p>
                    <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {currentDoctor?.specialization?.split('&')[0] || currentDoctor?.specialty || 'Cardiology'}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="pt-1 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Status:</span>
                {isVerifiedDoctor && (
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified MD
                  </span>
                )}
                {isPendingDoctor && (
                  <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Pending Review
                  </span>
                )}
                {isSuspendedDoctor && (
                  <span className="font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Suspended
                  </span>
                )}
              </div>
            </Link>
          ) : (
            <Link
              to="/doctor/profile"
              className="flex justify-center p-2 rounded-xl text-cyan-400 hover:opacity-80 transition-opacity cursor-pointer group"
              title={isHindi ? 'मेरी प्रोफाइल देखें' : 'View Doctor Profile'}
            >
              <img
                src={currentDoctor?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80'}
                alt={currentDoctor?.name || 'Doctor'}
                className="w-10 h-10 rounded-xl object-cover border border-cyan-500/30 group-hover:border-cyan-400 group-hover:scale-105 transition-all"
              />
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-[15px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>{t('doctor.signOut', {}, 'Sign Out')}</span>}
          </button>
        </div>
      </aside>

      {/* 2. DOCTOR MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">

        {/* Doctor Header */}
        <header className="h-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/85 dark:bg-[#251A11]/90 backdrop-blur-xl flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              title="Toggle Menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="text-[17px] sm:text-[18px] font-bold text-slate-900 dark:text-white">
                {t('doctor.clinicalWorkspace', {}, 'Clinical Workspace')}
              </span>

              {isVerifiedDoctor && (
                <span className="hidden sm:inline-flex text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'सत्यापित चिकित्सक' : 'Licensed Practitioner'}</span>
                </span>
              )}
              {isPendingDoctor && (
                <span className="hidden sm:inline-flex text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'प्रमाणपत्र समीक्षाधीन' : 'Credentials Under Verification'}</span>
                </span>
              )}
              {isSuspendedDoctor && (
                <span className="hidden sm:inline-flex text-xs font-semibold bg-red-500/15 text-red-700 dark:text-red-300 px-3 py-1 rounded-full border border-red-500/30 items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'खाता निलंबित' : 'Account Suspended'}</span>
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons in Top Bar: Scan QR, Explore Diseases, Profile, Settings */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* 1. SCAN PATIENT QR BUTTON */}
            <Link
              to="/doctor/scan-qr"
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-xs cursor-pointer active:scale-95 whitespace-nowrap ${
                isActive('/doctor/scan-qr')
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/25'
                  : 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-700 dark:text-cyan-300'
              }`}
              title={isHindi ? 'मरीज क्यूआर स्कैन करें' : 'Scan Patient QR Code'}
            >
              <QrCode className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">{isHindi ? 'मरीज क्यूआर स्कैन' : 'Scan Patient QR'}</span>
            </Link>

            {/* 2. MEDICAL RECORDS BUTTON */}
            <Link
              to="/doctor/medical-records"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 whitespace-nowrap ${
                isActive('/doctor/medical-records')
                  ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 shadow-xs'
                  : 'bg-slate-100/90 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              title={isHindi ? 'मेडिकल रिकॉर्ड्स' : 'Patient Medical Records'}
            >
              <FolderHeart className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="hidden sm:inline">{isHindi ? 'मेडिकल रिकॉर्ड्स' : 'Medical Records'}</span>
            </Link>

            {/* 3. EXPLORE DISEASES BUTTON */}
            <Link
              to="/doctor/explore"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 whitespace-nowrap ${
                isActive('/doctor/explore')
                  ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 shadow-xs'
                  : 'bg-slate-100/90 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
              title={isHindi ? 'रोग अन्वेषण' : 'Explore Diseases Database'}
            >
              <BookOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span className="hidden md:inline">{isHindi ? 'रोग अन्वेषण' : 'Explore Diseases'}</span>
            </Link>

            {/* Language & Theme Controls */}
            <LanguageSwitcher compact />
            <ThemeToggle />

            {/* 4. SETTINGS BUTTON */}
            <Link
              to="/doctor/settings"
              className={`p-2.5 rounded-xl transition-all cursor-pointer active:scale-95 ${
                isActive('/doctor/settings')
                  ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isHindi ? 'डॉक्टर सेटिंग्स' : 'Doctor Settings'}
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* DOCTOR AVATAR & IDENTITY PILL (Interactive Link to Doctor Profile) */}
            <Link
              to="/doctor/profile"
              className={`flex items-center gap-3 pl-3 py-1 pr-2 rounded-2xl border-l border-slate-200 dark:border-slate-800 hover:bg-cyan-500/10 transition-all cursor-pointer group active:scale-95 ${
                isActive('/doctor/profile')
                  ? 'ring-2 ring-cyan-500/50 bg-cyan-500/15 shadow-sm'
                  : 'hover:border-cyan-500/40'
              }`}
              title={isHindi ? 'मेरी डॉक्टर प्रोफाइल खोलें' : 'Open Doctor Profile (Dr. Sarah Mitchell)'}
            >
              <div className="relative">
                <img
                  src={currentDoctor?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80'}
                  alt={currentDoctor?.name || 'Doctor'}
                  className="w-10 h-10 rounded-2xl object-cover border-2 border-cyan-400/50 group-hover:border-cyan-400 group-hover:scale-105 transition-all shadow-xs"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center shadow-xs">
                  <User className="w-2.5 h-2.5" />
                </div>
              </div>
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-bold text-slate-800 dark:text-slate-200 block leading-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {formatDoctorTitle(currentDoctor?.name || 'Dr. Sarah Mitchell')}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                    {isHindi ? 'प्रोफाइल' : 'Profile'}
                  </span>
                </div>
                <span className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">
                  {currentDoctor?.registrationNumber || 'MD-89241-US'}
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Global Warning Banner if Doctor is PENDING */}
        {isPendingDoctor && (
          <div className="px-6 py-3 bg-amber-500/15 border-b border-amber-500/30 flex items-center gap-3 text-[15px] text-amber-800 dark:text-amber-200 shrink-0">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <span>
              <strong>Verification in Progress:</strong> Your medical registration number is currently being verified by the medical board. Telemedicine, report finalization, and e-prescriptions will unlock upon verification.
            </span>
          </div>
        )}

        {/* Global Warning Banner if Doctor is SUSPENDED */}
        {isSuspendedDoctor && (
          <div className="px-6 py-3 bg-red-500/20 border-b border-red-500/40 flex items-center gap-3 text-[15px] text-red-800 dark:text-red-200 shrink-0">
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
            <span>
              <strong>Clinical Access Suspended:</strong> This medical account has been temporarily suspended by platform governance. Contact clinical oversight.
            </span>
          </div>
        )}

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#251A11] p-5 space-y-2 z-30 shrink-0">
            {allMobileNavItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[16px] font-semibold ${active ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold' : 'text-slate-600 dark:text-slate-400'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[16px] font-semibold text-red-600 dark:text-red-400 cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 bg-[#F6F0E4] dark:bg-[#1F150E]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
