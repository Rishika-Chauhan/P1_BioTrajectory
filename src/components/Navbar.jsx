import React, { useState, useEffect } from 'react';
import {
  Activity,
  FileText,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon,
  Camera,
  ShieldCheck,
  User
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onOpenDemo, onOpenReport, onOpenProfile }) {
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('live-prototype');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section spy
      const sections = ['live-prototype', 'problem', 'biomarkers'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Dashboard', href: '#live-prototype', id: 'live-prototype', highlight: true },
    { label: 'Continuity & Blindspot', href: '#problem', id: 'problem' },
    { label: 'Biomarkers Suite', href: '#biomarkers', id: 'biomarkers' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? isDark
          ? 'bg-[#080d18]/92 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_4px_25px_rgba(0,0,0,0.6)]'
          : 'bg-[#ffffff]/94 backdrop-blur-2xl border-b border-slate-200/80 shadow-[0_1px_12px_rgba(0,0,0,0.04)]'
        : isDark
          ? 'bg-[#080d18]/75 backdrop-blur-md border-b border-white/[0.05]'
          : 'bg-[#faf8ff]/85 backdrop-blur-md border-b border-slate-200/60'
        }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">

          {/* Brand Logo & Clinical Platform Badge */}
          <div
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 shadow-sm shrink-0 ${isDark
                ? 'bg-gradient-to-br from-[#008378]/30 via-slate-900 to-[#080d18] border border-[#008378]/40 group-hover:border-[#008378]/70 shadow-[0_0_15px_rgba(0,131,120,0.2)]'
                : 'bg-gradient-to-br from-[#00685f] to-[#008378] text-white border border-[#00685f]/20 shadow-[0_2px_10px_rgba(0,104,95,0.2)]'
                }`}
            >
              <Activity className={`w-5 h-5 ${isDark ? 'text-teal-400' : 'text-white'}`} />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-inherit"></div>
            </div>

            <div className="shrink-0">
              <div className="flex items-center space-x-2">
                <span className={`font-sans text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
                  Bio<span className={isDark ? 'text-teal-400' : 'text-[#00685f]'}>Trajectory</span>
                </span>
                <span
                  className={`text-[10px] font-sans font-semibold tracking-wide px-2 py-0.5 rounded-full border whitespace-nowrap hidden xl:inline-flex ${isDark
                    ? 'bg-teal-500/10 text-teal-300 border-teal-500/30'
                    : 'bg-[#f2f3ff] text-[#00685f] border-[#dae2fd]'
                    }`}
                >
                  Preventive Baseline Engine
                </span>
              </div>
              <p className={`text-[11px] font-sans tracking-tight hidden sm:block whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Longitudinal Biomarker Intelligence
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Clean Precision Humanism) */}
          <nav className="hidden lg:flex items-center space-x-1 shrink-0">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 ${item.highlight
                    ? isDark
                      ? 'text-teal-300 font-bold bg-teal-500/10 border border-teal-500/30 shadow-[0_0_15px_rgba(0,131,120,0.15)]'
                      : 'text-[#00685f] font-bold bg-[#f2f3ff] border border-[#dae2fd] shadow-xs'
                    : isActive
                      ? isDark
                        ? 'text-white font-bold bg-white/10'
                        : 'text-slate-900 font-bold bg-slate-200/70'
                      : isDark
                        ? 'text-slate-400 hover:text-white hover:bg-white/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                >
                  <span className="flex items-center space-x-1.5">
                    {item.highlight && <Sparkles className="w-3 h-3 text-teal-500" />}
                    <span>{item.label}</span>
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Right Action Cluster - Streamlined to Prevent Any Clipping */}
          <div className="hidden sm:flex items-center space-x-2 shrink-0">

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center shrink-0 ${isDark
                ? 'border-white/10 text-teal-300 bg-slate-900/80 hover:bg-slate-800 hover:border-teal-400/40 shadow-xs'
                : 'border-slate-200 text-[#00685f] bg-white hover:bg-slate-50 shadow-xs'
                }`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Health Profile & Baseline Goals Button */}
            <button
              onClick={onOpenProfile}
              className={`text-xs font-semibold tracking-wide px-2.5 sm:px-3 py-2 rounded-xl border transition-all flex items-center space-x-1.5 shrink-0 ${isDark
                ? 'border-white/10 hover:border-teal-400/40 text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800'
                : 'border-slate-200 hover:border-[#00685f] text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 shadow-xs'
                }`}
              title="View and update your health profile, units, and consent preferences"
            >
              <User className={`w-3.5 h-3.5 ${isDark ? 'text-teal-400' : 'text-[#00685f]'}`} />
              <span className="whitespace-nowrap">Profile &amp; Goals</span>
            </button>

            {/* Clinician Brief Button */}
            <button
              onClick={onOpenReport}
              className={`text-xs font-semibold tracking-wide px-2.5 sm:px-3 py-2 rounded-xl border transition-all flex items-center space-x-1.5 shrink-0 ${isDark
                ? 'border-white/10 hover:border-teal-400/40 text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800'
                : 'border-slate-200 hover:border-[#00685f] text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 shadow-xs'
                }`}
              title="Export Clinician Handover Packet"
            >
              <FileText className={`w-3.5 h-3.5 ${isDark ? 'text-teal-400' : 'text-[#00685f]'}`} />
              <span className="whitespace-nowrap">Doctor Packet</span>
            </button>

            {/* Launch Interactive Strip Scan CTA */}
            <button
              onClick={onOpenDemo}
              className={`group text-xs font-bold tracking-wide px-3 sm:px-3.5 py-2 rounded-xl transition-all duration-300 flex items-center space-x-1.5 shadow-sm shrink-0 whitespace-nowrap ${isDark
                ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-[0_0_20px_rgba(0,131,120,0.3)] hover:shadow-[0_0_30px_rgba(0,131,120,0.5)]'
                : 'bg-[#00685f] hover:bg-[#008378] text-white shadow-md shadow-[#00685f]/20 hover:shadow-lg'
                }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>+ Strip Scan</span>
              <ChevronRight className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border ${isDark ? 'border-white/10 text-teal-300 bg-slate-900' : 'border-slate-200 text-[#00685f] bg-white'
                }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border ${isDark ? 'border-white/10 text-slate-300 bg-slate-900' : 'border-slate-200 text-slate-700 bg-white'
                }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden px-5 pt-3 pb-6 space-y-2 border-b animate-fadeIn ${isDark ? 'bg-[#080d18]/95 backdrop-blur-2xl border-white/10' : 'bg-white/95 backdrop-blur-2xl border-slate-200 shadow-2xl'
          }`}>
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${item.highlight
                ? isDark ? 'text-teal-300 bg-teal-400/10 font-bold' : 'text-[#00685f] bg-teal-50 font-bold'
                : isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              {item.label}
            </a>
          ))}

          <div className="pt-3 border-t border-inherit flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenProfile) onOpenProfile();
              }}
              className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 ${isDark ? 'border-white/10 text-slate-200 bg-slate-800' : 'border-slate-200 text-slate-800 bg-slate-50'
                }`}
            >
              <User className="w-4 h-4 text-[#00685f] dark:text-teal-400" />
              <span>Health Profile &amp; Consents</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReport();
              }}
              className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 ${isDark ? 'border-white/10 text-slate-200 bg-slate-800' : 'border-slate-200 text-slate-800 bg-slate-50'
                }`}
            >
              <FileText className="w-4 h-4 text-teal-500" />
              <span>Export Doctor Packet</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full py-3 rounded-xl bg-[#00685f] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md"
            >
              <Camera className="w-4 h-4" />
              <span>+ Log Strip Scan</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
