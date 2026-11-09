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
  ExternalLink,
  ShieldAlert,
  Clock
} from 'lucide-react';
import { useDoctorAuth, DOCTOR_ROLES } from '../../context/DoctorAuthContext';
import ThemeToggle from '../common/ThemeToggle';

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
    isSuspendedDoctor,
    setVerificationStatus
  } = useDoctorAuth();

  const doctorNavItems = [
    { label: 'Overview', path: '/doctor/dashboard', icon: Stethoscope },
    { label: 'Scan Patient QR', path: '/doctor/scan-qr', icon: QrCode },
    { label: 'My Patients', path: '/doctor/patients', icon: Users },
    { label: 'Appointments', path: '/doctor/appointments', icon: Calendar },
    { label: 'Video Consultation', path: '/doctor/video-consultation', icon: Video },
    { label: 'Write Reports', path: '/doctor/reports', icon: FileText },
    { label: 'Prescriptions', path: '/doctor/prescriptions', icon: Pill },
    { label: 'Explore Diseases', path: '/doctor/explore', icon: BookOpen },
    { label: 'My Profile', path: '/doctor/profile', icon: User }
  ];

  const handleLogout = () => {
    logoutDoctor();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/doctor/dashboard') {
      return location.pathname === '/doctor/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen w-full bg-[#F5F8FC] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      
      {/* 1. DOCTOR SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090E18] transition-all duration-300 z-30 shrink-0 ${
          collapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Doctor Header */}
        <div className="flex items-center justify-between h-20 px-5 border-b border-slate-200 dark:border-slate-800">
          {!collapsed && (
            <Link to="/doctor/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1.5px] shadow-sm">
                <div className="w-full h-full bg-[#070B14] rounded-[14px] flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="font-extrabold text-[17px] tracking-tight text-slate-900 dark:text-white block">
                  BioTrajectory
                </span>
                <span className="text-xs text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                  Doctor Portal
                </span>
              </div>
            </Link>
          )}

          {collapsed && (
            <div className="w-full flex justify-center">
              <Stethoscope className="w-7 h-7 text-cyan-400" />
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
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[16px] font-semibold transition-all ${
                  active
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
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={currentDoctor?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80'}
                  alt={currentDoctor?.name || 'Doctor'}
                  className="w-10 h-10 rounded-xl object-cover border border-cyan-500/30"
                />
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {currentDoctor?.name || 'Dr. Aris Thorne'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {currentDoctor?.specialization?.split('&')[0] || 'Cardiology'}
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
            </div>
          ) : (
            <div className="flex justify-center p-2 text-cyan-400" title="Doctor Account">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
            </div>
          )}

          {/* Quick links to Patient Portal & Home */}
          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-[15px] font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {!collapsed && <span>Patient Dashboard</span>}
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-[15px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. DOCTOR MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* Doctor Header */}
        <header className="h-20 px-6 sm:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#090E18]/80 backdrop-blur-xl flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-3">
              <span className="text-[17px] font-bold text-slate-900 dark:text-white">
                Clinical Workspace
              </span>
              
              {isVerifiedDoctor && (
                <span className="text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Licensed Practitioner</span>
                </span>
              )}
              {isPendingDoctor && (
                <span className="text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Credentials Under Verification</span>
                </span>
              )}
              {isSuspendedDoctor && (
                <span className="text-xs font-semibold bg-red-500/15 text-red-700 dark:text-red-300 px-3 py-1 rounded-full border border-red-500/30 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Account Suspended</span>
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Verification Sandbox Switcher for Developer Testing */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
              <span className="text-slate-500">Test Role:</span>
              <button
                onClick={() => setVerificationStatus(DOCTOR_ROLES.VERIFIED)}
                className={`px-2 py-0.5 rounded cursor-pointer ${isVerifiedDoctor ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                Verified
              </button>
              <button
                onClick={() => setVerificationStatus(DOCTOR_ROLES.PENDING)}
                className={`px-2 py-0.5 rounded cursor-pointer ${isPendingDoctor ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'}`}
              >
                Pending
              </button>
            </div>

            <ThemeToggle />

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <img
                src={currentDoctor?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80'}
                alt={currentDoctor?.name}
                className="w-10 h-10 rounded-2xl object-cover border-2 border-cyan-400/40"
              />
              <div className="hidden sm:block">
                <span className="text-[16px] font-bold text-slate-800 dark:text-slate-200 block leading-tight">
                  {currentDoctor?.name || 'Dr. Aris Thorne'}
                </span>
                <span className="text-xs text-cyan-600 dark:text-cyan-400 font-mono">
                  {currentDoctor?.registrationNumber || 'MED-REG-2016'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Global Warning Banner if Doctor is PENDING */}
        {isPendingDoctor && (
          <div className="px-6 py-3 bg-amber-500/15 border-b border-amber-500/30 flex items-center justify-between text-[15px] text-amber-800 dark:text-amber-200 shrink-0">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
              <span>
                <strong>Verification in Progress:</strong> Your medical registration number is currently being verified by the medical board. Telemedicine, report finalization, and e-prescriptions will unlock upon verification.
              </span>
            </div>
            <button
              onClick={() => setVerificationStatus(DOCTOR_ROLES.VERIFIED)}
              className="text-xs font-bold px-3 py-1 bg-amber-500 text-slate-950 rounded-lg hover:bg-amber-400 transition-colors ml-4 shrink-0 cursor-pointer"
            >
              Verify Now (Test Mode)
            </button>
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
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090E18] p-5 space-y-2 z-30 shrink-0">
            {doctorNavItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[16px] font-semibold ${
                    active ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold' : 'text-slate-600 dark:text-slate-400'
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
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[16px] font-semibold text-red-600 dark:text-red-400"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Outlet */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 bg-[#F5F8FC] dark:bg-[#070B14]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
