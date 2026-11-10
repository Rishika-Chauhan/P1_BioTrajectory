import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, User, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import BrandLogo from './BrandLogo';
import { useAuth, getDashboardPath } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const targetDashboard = getDashboardPath(currentUser?.role);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-2xl border-b transition-colors duration-300 border-slate-200/70 dark:border-slate-800/70 bg-[#F5F8FC]/80 dark:bg-[#070B14]/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Theme-Adaptive High Clarity Brand Logo */}
          <BrandLogo />

          {/* Desktop Navigation Links — Strictly Home, Explore, About */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'Trajectory Console', path: '/' },
              { label: 'Home', path: '/home' },
              { label: 'Explore', path: '/explore' },
              { label: 'About', path: '/about' }
            ].map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-[16px] font-semibold transition-all duration-200 relative py-1 ${
                    active
                      ? 'text-cyan-600 dark:text-cyan-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400'
                  }`}
                >
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to={targetDashboard}
                  className="flex items-center gap-2 px-5 py-2.5 text-[15px] font-bold rounded-xl bg-cyan-500/15 border border-cyan-500/35 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-500/25 transition-all shadow-xs hover:shadow-[0_0_15px_rgba(0,217,255,0.2)] active:scale-95 cursor-pointer"
                >
                  <User className="w-4 h-4 text-cyan-500" />
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer active:scale-95"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-[16px] font-semibold text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[16px] font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/25 active:scale-95"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-[#F5F8FC]/95 dark:bg-[#070B14]/95 backdrop-blur-xl px-5 pt-4 pb-6 space-y-4">
          <div className="flex flex-col space-y-2">
            {[
              { label: 'Home', path: '/' },
              { label: 'Explore', path: '/explore' },
              { label: 'About', path: '/about' }
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl text-[17px] font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                    : 'text-slate-800 dark:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={targetDashboard}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 px-4 rounded-xl text-[16px] font-bold bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30"
                >
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 px-4 rounded-xl text-[15px] font-semibold text-red-500 hover:bg-red-500/10 cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-3 px-4 rounded-xl text-[16px] font-semibold border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-3 px-4 rounded-xl text-[16px] font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
