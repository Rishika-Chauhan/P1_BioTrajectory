import React, { useState } from 'react';
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
  Activity,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import BrandLogo from '../common/BrandLogo';

export default function UserDashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  // Simplified friendly navigation labels matching exact specification
  const navItems = [
    { label: 'Home', path: '/dashboard', icon: LayoutDashboard },
    { label: 'My Day', path: '/dashboard/reports', icon: FileSpreadsheet },
    { label: 'My Health', path: '/dashboard/analytics', icon: LineChart },
    { label: 'My Records', path: '/dashboard/history', icon: FolderHeart },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Ask AI', path: '/dashboard/assistant', icon: Bot },
    { label: 'Talk to Doctor', path: '/dashboard/consultation', icon: Video },
    { label: 'My QR', path: '/dashboard/qr', icon: QrCode },
    { label: 'Settings', path: '/dashboard/settings', icon: Settings }
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
    <div className="flex h-screen w-full bg-[#F5F8FC] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      
      {/* 1. DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-[#070B14]/95 backdrop-blur-xl transition-all duration-300 z-30 shrink-0 ${
          collapsed ? 'w-20' : 'w-72'
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
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[15px] font-semibold transition-all duration-200 hover:translate-x-1 ${
                  active
                    ? 'bg-cyan-500/15 border border-cyan-500/35 text-cyan-700 dark:text-cyan-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400'}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout Bottom */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          {!collapsed ? (
            <div className="p-3 rounded-2xl bg-slate-100/80 dark:bg-[#101827] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold flex items-center justify-center text-[15px] shrink-0">
                  {currentUser?.name?.[0] || 'P'}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-bold text-slate-900 dark:text-white truncate">
                    {currentUser?.name || 'Pranjal Sharma'}
                  </p>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400 truncate">
                    Your Health Profile
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Log out"
                className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-500/10 transition-colors cursor-pointer"
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
        <header className="h-20 px-6 border-b border-slate-200 dark:border-slate-800/80 bg-white/85 dark:bg-[#070B14]/90 backdrop-blur-xl flex items-center justify-between shrink-0 z-20">
          
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
          <div className="flex items-center gap-4">
            <ThemeToggle />

            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 relative transition-all cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-88 p-5 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-2xl z-50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-[15px] font-bold text-slate-900 dark:text-white">Recent Updates</span>
                    <span className="text-[14px] text-cyan-600 dark:text-cyan-400 font-semibold">2 New</span>
                  </div>
                  <div className="space-y-3 text-[14px]">
                    <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 space-y-1">
                      <p className="font-bold text-cyan-700 dark:text-cyan-300">Blood Pressure Logged</p>
                      <p className="text-slate-600 dark:text-slate-300 leading-snug">Morning check: 121/78 mmHg (Healthy range).</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 space-y-1">
                      <p className="font-bold text-slate-800 dark:text-slate-200">Weekly Summary</p>
                      <p className="text-slate-600 dark:text-slate-400 leading-snug">Your 7-day trends are ready to view.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar */}
            <Link
              to="/dashboard/settings"
              className="flex items-center gap-2.5 pl-3 border-l border-slate-200 dark:border-slate-800 hover:opacity-80 transition-opacity"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 text-slate-950 font-bold flex items-center justify-center text-[15px] shadow-xs">
                {currentUser?.name?.[0] || 'P'}
              </div>
            </Link>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-[#F5F8FC]/95 dark:bg-[#070B14]/95 backdrop-blur-xl p-5 space-y-2 z-30 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[16px] font-semibold ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30'
                      : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
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
