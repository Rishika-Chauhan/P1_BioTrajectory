import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  FileSpreadsheet,
  LineChart,
  FolderHeart,
  Bot,
  Video,
  QrCode,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Bell,
  Compass,
  Bluetooth,
  Droplet,
  Users,
  AlertTriangle,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { healthReadingService } from '../../services/healthReadingService';
import { getPatientAvatar, subscribeToAvatarChanges } from '../../services/patientAvatarService';
import { familyHealthService } from '../../services/familyHealthService';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSwitcher from '../common/LanguageSwitcher';
import BrandLogo from '../common/BrandLogo';

export default function UserDashboardLayout() {
  const { currentUser, healthProfile, logout } = useAuth();
  const { t, isHindi } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const [patientAvatar, setPatientAvatar] = useState(() => getPatientAvatar());
  const [pendingFamilyApprovals, setPendingFamilyApprovals] = useState(0);
  const [activeFamilyMember, setActiveFamilyMember] = useState(null);

  useEffect(() => {
    const unsub = subscribeToAvatarChanges((newAvatar) => {
      setPatientAvatar(newAvatar);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const updateFamilyState = () => {
      const members = familyHealthService.getMembers();
      const pending = members.filter((m) => m.status === 'pending').length;
      setPendingFamilyApprovals(pending);

      const activeId = familyHealthService.getActiveProfileId();
      if (activeId) {
        const found = members.find((m) => m.id === activeId);
        setActiveFamilyMember(found || null);
      } else {
        setActiveFamilyMember(null);
      }
    };

    updateFamilyState();
    const unsub = familyHealthService.subscribe(updateFamilyState);
    return unsub;
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadAlerts = async () => {
      try {
        const uid = currentUser?.uid || 'demo-user-123';
        const readings = await healthReadingService.list(uid, 50);
        if (isMounted) {
          const thresholdAlerts = healthReadingService.computeThresholdAlerts(readings, isHindi);
          setNotificationsList(thresholdAlerts);
        }
      } catch (e) {
        console.error('Failed to load notification alerts:', e);
      }
    };
    loadAlerts();
    return () => { isMounted = false; };
  }, [currentUser, isHindi]);

  const profileFullName =
    healthProfile?.name ||
    (currentUser?.displayName && currentUser.displayName.toLowerCase() !== 'patient' ? currentUser.displayName : null) ||
    (currentUser?.name && currentUser.name.toLowerCase() !== 'patient' ? currentUser.name : null) ||
    'User';
  const profileInitial = profileFullName.trim()[0] || 'U';

  // Navigation labels with multilingual support
  const navItems = [
    { label: t('dashboard.home', {}, 'Home'), path: '/dashboard', icon: LayoutDashboard },
    { label: t('dashboard.myHealth', {}, 'My Health Analytics'), path: '/dashboard/analytics', icon: LineChart },
    { label: t('dashboard.myRecords', {}, 'My Records'), path: '/dashboard/records', icon: FolderHeart },
    {
      label: isHindi ? 'परिवार स्वास्थ्य' : 'Family Health',
      path: '/dashboard/family',
      icon: Users,
      badge: pendingFamilyApprovals > 0 ? pendingFamilyApprovals : null
    },
    { label: t('dashboard.urineAnalysis', {}, 'Urine Analysis'), path: '/dashboard/urine', icon: Droplet },
    { label: t('dashboard.aiAssistant', {}, 'AI Assistant'), path: '/dashboard/assistant', icon: Bot },
    { label: t('dashboard.reports', {}, 'Daily Reports'), path: '/dashboard/reports', icon: FileSpreadsheet },
    { label: t('dashboard.doctorConnect', {}, 'Doctor Consultation'), path: '/dashboard/consultation', icon: Video },
    { label: isHindi ? 'सेटिंग्स' : 'Settings', path: '/dashboard/settings', icon: Settings }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen w-full bg-[#F6F0E4] dark:bg-[#1F150E] text-slate-900 dark:text-slate-100 overflow-hidden font-sans">

      {/* 1. DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#2B1E15]/95 backdrop-blur-xl transition-all duration-300 z-30 shrink-0 ${collapsed ? 'w-20' : 'w-72'
          }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-20 px-5 border-b border-slate-200 dark:border-slate-800">
          {!collapsed ? (
            <BrandLogo size="md" />
          ) : (
            <div className="w-full flex justify-center">
              <BrandLogo size="sm" showText={false} />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={collapsed ? 'Expand menu' : 'Collapse menu'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[15px] font-semibold transition-all duration-200 hover:translate-x-1 relative ${active
                    ? 'bg-cyan-500/15 border border-cyan-500/35 text-cyan-700 dark:text-cyan-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
              >
                <div className="relative shrink-0">
                  <Icon className={`w-5 h-5 ${active ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                  {collapsed && item.badge && (
                    <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </div>
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                {!collapsed && item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950 animate-pulse shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout Bottom */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {!collapsed ? (
            <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity cursor-pointer"
                title={isHindi ? 'प्रोफाइल देखें' : 'View Profile'}
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-500/30 bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center text-[15px] shrink-0">
                  {patientAvatar ? (
                    <img src={patientAvatar} alt={profileFullName} className="w-full h-full object-cover" />
                  ) : (
                    profileInitial
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-slate-900 dark:text-white truncate">
                    {profileFullName}
                  </p>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 truncate">
                    {isHindi ? 'आपकी स्वास्थ्य प्रोफाइल' : 'Your Health Profile'}
                  </p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer shrink-0"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              title="Log out"
              className="w-full flex justify-center p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">

        {/* Top Header Bar */}
        <header className="h-20 px-6 border-b border-slate-200 dark:border-slate-800/80 bg-white/85 dark:bg-[#2B1E15]/90 backdrop-blur-xl flex items-center justify-between shrink-0 z-20">

          {/* Mobile Menu Toggle & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div>
              <span className="text-[18px] sm:text-[20px] font-bold text-slate-900 dark:text-white">
                BioTrajectory
              </span>
              <span className="hidden sm:inline-block mx-2 text-slate-400">•</span>
              <span className="hidden sm:inline-block text-[14px] text-slate-500 dark:text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Active Family Profile Indicator */}
            {activeFamilyMember && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/40 text-purple-900 dark:text-purple-200 text-xs font-bold shadow-xs">
                <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>{isHindi ? 'परिवार सदस्य:' : 'Viewing:'} {activeFamilyMember.name}</span>
                <button
                  onClick={() => familyHealthService.setActiveProfileId(null)}
                  className="ml-1 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                  title={isHindi ? 'व्यक्तिगत डेटा पर लौटें' : 'Return to My Profile'}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Quick Family Access Pill */}
            <Link
              to="/dashboard/family"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-purple-700 dark:text-purple-300 transition-all cursor-pointer shadow-xs active:scale-95"
              title={isHindi ? 'परिवार स्वास्थ्य चक्र' : 'Family Health Circle'}
            >
              <Users className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span className="hidden sm:inline">{isHindi ? 'परिवार' : 'Family'}</span>
              {pendingFamilyApprovals > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black animate-pulse">
                  {pendingFamilyApprovals}
                </span>
              )}
            </Link>

            <Link
              to="/dashboard/devices"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-700 dark:text-cyan-300 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Bluetooth Connected Health Devices"
            >
              <Bluetooth className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
              <span className="hidden sm:inline">Bluetooth Devices</span>
            </Link>

            <LanguageSwitcher compact />
            <ThemeToggle />

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 relative transition-all cursor-pointer"
                title={isHindi ? 'सूचनाएं' : 'Notifications'}
              >
                <Bell className="w-5 h-5" />
                {notificationsList.length > 0 ? (
                  <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                  </span>
                ) : (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-88 sm:w-96 p-5 rounded-3xl bg-white dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-[15px] font-bold text-slate-900 dark:text-white">
                        {isHindi ? 'स्वास्थ्य सूचनाएं' : 'Health Notifications'}
                      </span>
                    </div>
                    {notificationsList.length > 0 ? (
                      <span className="text-[12px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                        {notificationsList.length} {isHindi ? 'चेतावनी' : 'Active Alerts'}
                      </span>
                    ) : (
                      <span className="text-[13px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        ✓ {isHindi ? 'सभी सामान्य' : 'All Clear'}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1 text-[13px]">
                    {/* Short Threshold Warnings Issued Here */}
                    {notificationsList.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-2xl border space-y-1 transition-all ${
                          alert.level === 'danger'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold flex items-center gap-1.5 text-xs">
                            {alert.level === 'danger' ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            ) : (
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                            <span>{alert.title}</span>
                          </span>
                          <span className="text-[10px] opacity-75 font-mono">{alert.date}</span>
                        </div>
                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug pl-5">
                          {alert.shortText}
                        </p>
                        <div className="pt-0.5 pl-5">
                          <Link
                            to="/dashboard/analytics"
                            onClick={() => setShowNotifications(false)}
                            className="text-[11px] font-bold text-cyan-700 dark:text-cyan-300 hover:underline inline-flex items-center gap-1"
                          >
                            <span>{isHindi ? 'ग्राफ़ पर रुझान देखें' : 'View Vital Trajectory'}</span>
                            <ChevronRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    ))}

                    {/* Standard System Status Update */}
                    <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 space-y-0.5">
                      <p className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                        {isHindi ? 'दैनिक वाइटल सिंक सक्रिय' : 'Biomarker Trajectory Synchronized'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                        {isHindi
                          ? 'आपके सभी रक्तचाप, हृदय गति और मूत्र बायोमार्कर ट्रैक हो रहे हैं।'
                          : 'Your longitudinal vital sign trajectories are up to date.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Settings button in Top Panel */}
            <Link
              to="/dashboard/settings"
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
              title={isHindi ? 'सेटिंग्स (Settings)' : 'Settings'}
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* User Avatar */}
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800 hover:opacity-80 transition-opacity"
              title={isHindi ? 'प्रोफाइल एवं खाता' : 'Profile & Account'}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan-500/40 bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 font-bold flex items-center justify-center text-[15px] shadow-xs">
                {patientAvatar ? (
                  <img src={patientAvatar} alt={profileFullName} className="w-full h-full object-cover" />
                ) : (
                  profileInitial
                )}
              </div>
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-[#F6F0E4]/95 dark:bg-[#1F150E]/95 backdrop-blur-xl p-5 space-y-2 z-30 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[16px] font-semibold ${active
                      ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white'
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-black bg-amber-500 text-slate-950 animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="w-full text-left flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[16px] text-rose-500 hover:bg-rose-500/10 cursor-pointer"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          </div>
        )}

        {/* Scrollable Viewport for nested pages */}
        <main className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
