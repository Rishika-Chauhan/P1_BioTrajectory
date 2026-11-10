import React, { useState, useEffect } from 'react';
import {
  Activity,
  FileText,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onOpenDemo, onOpenReport }) {
  const { isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('live-prototype');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);

      // Section spy
      const sections = ['live-prototype', 'problem', 'biomarkers', 'clinical-rigor', 'architecture', 'pitch'];
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
    { label: 'Patient Dashboard', href: '#live-prototype', id: 'live-prototype', highlight: true },
    { label: 'Clinical Continuity', href: '#problem', id: 'problem' },
    { label: 'Biomarkers', href: '#biomarkers', id: 'biomarkers' },
    { label: 'Safety Governance', href: '#clinical-rigor', id: 'clinical-rigor' },
    { label: 'Architecture', href: '#architecture', id: 'architecture' },
    { label: 'Clinical FAQ', href: '#pitch', id: 'pitch' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? isDark
          ? 'bg-[#05070c]/90 backdrop-blur-2xl border-b border-white/[0.08] shadow-[0_10px_35px_rgba(0,0,0,0.8)]'
          : 'bg-[#faf9f6]/92 backdrop-blur-2xl border-b border-amber-950/10 shadow-[0_4px_25px_rgba(180,145,95,0.06)]'
        : isDark
          ? 'bg-[#05070c]/70 backdrop-blur-md border-b border-white/[0.05]'
          : 'bg-[#faf9f6]/85 backdrop-blur-md border-b border-amber-900/5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">

          {/* Brand Logo & Clinical Platform Badge */}
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div
              className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 ${isDark
                ? 'bg-gradient-to-br from-amber-500/20 via-slate-900 to-[#05070c] border border-amber-400/30 group-hover:border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
                : 'bg-gradient-to-br from-amber-100 via-amber-50 to-white border border-amber-300 group-hover:border-amber-400 shadow-[0_4px_15px_rgba(180,145,95,0.15)]'
                }`}
            >
              <Activity className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-700'} animate-pulse`} />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border border-inherit"></div>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className={`font-cinzel text-lg sm:text-xl font-bold tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  BIO<span className={isDark ? 'text-amber-400' : 'text-amber-700'}>TRAJECTORY</span>
                </span>
                <span
                  className={`text-[9px] uppercase font-mono-code font-bold tracking-wider px-2 py-0.5 rounded-full border ${isDark
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}
                >
                  PGHD Platform
                </span>
              </div>
              <p className={`text-[10px] font-mono-code tracking-wide hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Longitudinal Biomarker Intelligence
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Clean & Professional) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`relative px-3 py-1.5 rounded-lg text-xs font-mono-code uppercase tracking-wider transition-all duration-200 ${item.highlight
                    ? isDark
                      ? 'text-amber-300 font-bold bg-amber-400/10 border border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'text-amber-900 font-bold bg-amber-100 border border-amber-300 shadow-xs'
                    : isActive
                      ? isDark
                        ? 'text-white font-bold bg-white/10'
                        : 'text-slate-900 font-bold bg-slate-200/80'
                      : isDark
                        ? 'text-slate-400 hover:text-white hover:bg-white/5'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`}
                >
                  <span className="flex items-center space-x-1">
                    {item.highlight && <Sparkles className="w-3 h-3 text-amber-500" />}
                    <span>{item.label}</span>
                  </span>
                </a>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden sm:flex items-center space-x-2.5">

            {/* Theme Switcher Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all flex items-center justify-center ${isDark
                ? 'border-white/10 text-amber-300 bg-slate-900/80 hover:bg-slate-800 hover:border-amber-400/40 shadow-xs'
                : 'border-slate-300 text-amber-800 bg-white hover:bg-amber-50 shadow-xs'
                }`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            {/* Clinician Brief Button */}
            <button
              onClick={onOpenReport}
              className={`text-xs font-mono-code uppercase font-semibold tracking-wider px-3 py-2 rounded-xl border transition-all flex items-center space-x-1.5 ${isDark
                ? 'border-white/10 hover:border-amber-400/40 text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800'
                : 'border-slate-300 hover:border-amber-500 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 shadow-xs'
                }`}
            >
              <FileText className={`w-3.5 h-3.5 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
              <span>Clinician Brief</span>
            </button>

            {/* Launch Interactive Prototype CTA */}
            <button
              onClick={onOpenDemo}
              className={`group text-xs font-mono-code uppercase font-bold tracking-wider px-3.5 py-2 rounded-xl transition-all duration-300 flex items-center space-x-1.5 shadow-md ${isDark
                ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]'
                : 'bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white shadow-[0_4px_15px_rgba(180,145,95,0.3)] hover:shadow-[0_6px_20px_rgba(180,145,95,0.45)]'
                }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Telemetry Console</span>
              <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-xl border ${isDark ? 'border-white/10 text-amber-300 bg-slate-900' : 'border-slate-300 text-amber-800 bg-white'
                }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border ${isDark ? 'border-white/10 text-slate-300 bg-slate-900' : 'border-slate-300 text-slate-700 bg-white'
                }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden px-5 pt-3 pb-6 space-y-2 border-b animate-fadeIn ${isDark ? 'bg-[#090e18]/95 backdrop-blur-2xl border-white/10' : 'bg-white/95 backdrop-blur-2xl border-slate-200 shadow-2xl'
          }`}>
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2.5 px-3 rounded-lg text-xs font-mono-code uppercase tracking-wider transition-colors ${item.highlight
                ? isDark ? 'text-amber-300 bg-amber-400/10 font-bold' : 'text-amber-900 bg-amber-100 font-bold'
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
                onOpenReport();
              }}
              className={`w-full py-2.5 rounded-xl border text-xs font-mono-code uppercase font-semibold flex items-center justify-center space-x-2 ${isDark ? 'border-white/10 text-slate-200 bg-slate-800' : 'border-slate-300 text-slate-800 bg-slate-50'
                }`}
            >
              <FileText className="w-4 h-4 text-amber-500" />
              <span>Clinician Summary PDF</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white text-xs font-mono-code font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md"
            >
              <Activity className="w-4 h-4" />
              <span>Open Telemetry Console</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
