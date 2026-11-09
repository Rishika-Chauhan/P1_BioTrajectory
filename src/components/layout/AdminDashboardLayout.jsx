import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Shield,
  Users,
  Key,
  BookOpen,
  FileCheck,
  AlertCircle,
  BarChart3,
  MessageSquare,
  Activity,
  Cpu,
  Lock,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  LogOut,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import BrandLogo from '../common/BrandLogo';

export default function AdminDashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const adminNavItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: Shield },
    { label: 'User Accounts', path: '/admin/users', icon: Users },
    { label: 'Permissions', path: '/admin/roles', icon: Key },
    { label: 'Disease Guide', path: '/admin/diseases', icon: BookOpen },
    { label: 'Articles & Guides', path: '/admin/content', icon: FileCheck },
    { label: 'User Reports', path: '/admin/reports', icon: AlertCircle },
    { label: 'System Stats', path: '/admin/analytics', icon: BarChart3 },
    { label: 'User Feedback', path: '/admin/feedback', icon: MessageSquare },
    { label: 'Security Settings', path: '/admin/settings', icon: Lock }
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen w-full bg-[#F5F8FC] dark:bg-[#070B14] text-slate-900 dark:text-slate-100 overflow-hidden font-sans">
      
      {/* 1. ADMIN SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#090E18] transition-all duration-300 z-30 shrink-0 ${
          collapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Admin Header */}
        <div className="flex items-center justify-between h-20 px-5 border-b border-slate-200 dark:border-slate-800">
          {!collapsed ? (
            <BrandLogo
              to="/admin/dashboard"
              icon={Shield}
              subtitle="Admin Panel"
              size="md"
            />
          ) : (
            <div className="w-full flex justify-center">
              <BrandLogo
                to="/admin/dashboard"
                icon={Shield}
                size="sm"
                showText={false}
              />
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto">
          {adminNavItems.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                title={collapsed ? item.label : undefined}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[16px] font-semibold transition-all ${
                  active
                    ? 'bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'}`} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Admin Safety Audit Tag Bottom */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
          {!collapsed ? (
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-[#070B14] border border-purple-500/20 text-[14px] text-slate-600 dark:text-slate-400 space-y-1">
              <div className="flex items-center gap-2 font-bold text-purple-700 dark:text-purple-300">
                <Lock className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <span>Private Health Records</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 leading-snug">
                Admins cannot view private patient medical readings.
              </p>
            </div>
          ) : (
            <div className="flex justify-center p-2 text-purple-400" title="Private Health Records">
              <Lock className="w-5 h-5" />
            </div>
          )}

          {/* Switch back to patient portal link */}
          <Link
            to="/dashboard"
            className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-2xl text-[16px] font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 border border-slate-200 dark:border-slate-800 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {!collapsed && <span>Go to User Dashboard</span>}
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl text-[16px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. ADMIN MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        
        {/* Admin Header */}
        <header className="h-20 px-6 sm:px-8 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#090E18]/80 backdrop-blur-xl flex items-center justify-between shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-3">
              <span className="text-[17px] font-bold text-slate-900 dark:text-white">Admin Management</span>
              <span className="text-xs font-semibold bg-purple-500/15 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                System Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-600 dark:text-purple-300 font-bold flex items-center justify-center text-sm border border-purple-500/30">
                A
              </div>
              <span className="text-[16px] font-bold text-slate-800 dark:text-slate-200 hidden sm:inline">Dr. Sarah Vance</span>
            </div>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090E18] p-5 space-y-2 z-30 shrink-0">
            {adminNavItems.map(item => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-[16px] font-semibold ${
                    active ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
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
