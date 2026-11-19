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
          ? 'bg-[#18100A]/92 backdrop-blur-2xl border-b border-[#E5DACB]/20 shadow-[0_4px_25px_rgba(0,0,0,0.6)]'
          : 'bg-[#FFFFFF]/95 backdrop-blur-2xl border-b border-[#E5DACB]/60 shadow-[0_1px_12px_rgba(63,13,18,0.04)]'
        : isDark
          ? 'bg-[#18100A]/80 backdrop-blur-md border-b border-[#E5DACB]/15'
          : 'bg-[#F6F0E4]/90 backdrop-blur-md border-b border-[#E5DACB]/50'
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
                ? 'bg-gradient-to-br from-[#A9D6F5] to-[#3D291A] text-white border border-[#E5DACB]/40 shadow-[0_0_15px_rgba(167,29,49,0.3)]'
                : 'bg-gradient-to-br from-[#3D291A] via-[#66121D] to-[#A9D6F5] text-white border border-[#E5DACB]/30 shadow-[0_2px_10px_rgba(167,29,49,0.2)]'
                }`}
            >
              <Activity className="w-5 h-5 text-white" />
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#A9D6F5] rounded-full border-2 border-inherit"></div>
            </div>

            <div className="shrink-0">
              <div className="flex items-center space-x-2">
                <span className={`font-sans text-lg sm:text-xl font-bold tracking-tight whitespace-nowrap ${isDark ? 'text-[#FAF6EE]' : 'text-[#3D291A]'}`}>
                  Bio<span className="text-[#A9D6F5]">Trajectory</span>
                </span>
                <span
                  className={`text-[10px] font-sans font-semibold tracking-wide px-2 py-0.5 rounded-full border whitespace-nowrap hidden xl:inline-flex ${isDark
                    ? 'bg-[#3D291A] text-[#E5DACB] border-[#E5DACB]/30'
                    : 'bg-[#FAF6EE] text-[#A9D6F5] border-[#E5DACB]'
                    }`}
                >
                  Preventive Baseline Engine
                </span>
              </div>
              <p className={`text-[11px] font-sans tracking-tight hidden sm:block whitespace-nowrap ${isDark ? 'text-[#E5DACB]' : 'text-[#846752]'}`}>
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
                      ? 'text-[#FAF6EE] font-bold bg-[#A9D6F5]/25 border border-[#A9D6F5]/50 shadow-[0_0_15px_rgba(167,29,49,0.2)]'
                      : 'text-[#A9D6F5] font-bold bg-[#A9D6F5]/10 border border-[#A9D6F5]/30 shadow-xs'
                    : isActive
                      ? isDark
                        ? 'text-white font-bold bg-white/10'
                        : 'text-[#3D291A] font-bold bg-[#FAF6EE] border border-[#E5DACB]/40'
                      : isDark
                        ? 'text-[#E5DACB] hover:text-white hover:bg-white/5'
                        : 'text-[#846752] hover:text-[#3D291A] hover:bg-[#FAF6EE]'
                    }`}
                >
                  <span className="flex items-center space-x-1.5">
                    {item.highlight && <Sparkles className="w-3 h-3 text-[#A9D6F5]" />}
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
                ? 'border-[#E5DACB]/30 text-[#E5DACB] bg-[#2B1E15] hover:bg-[#3D291A] shadow-xs'
                : 'border-[#E5DACB] text-[#3D291A] bg-white hover:bg-[#FAF6EE] shadow-xs'
                }`}
              title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-[#E5DACB]" /> : <Moon className="w-3.5 h-3.5 text-[#3D291A]" />}
            </button>

            {/* Health Profile & Baseline Goals Button */}
            <button
              onClick={onOpenProfile}
              className={`text-xs font-semibold tracking-wide px-2.5 sm:px-3 py-2 rounded-xl border transition-all flex items-center space-x-1.5 shrink-0 ${isDark
                ? 'border-[#E5DACB]/30 hover:border-[#A9D6F5] text-[#FAF6EE] hover:text-white bg-[#2B1E15] hover:bg-[#3D291A]'
                : 'border-[#E5DACB] hover:border-[#A9D6F5] text-[#3D291A] hover:text-[#A9D6F5] bg-white hover:bg-[#FAF6EE] shadow-xs'
                }`}
              title="View and update your health profile, units, and consent preferences"
            >
              <User className="w-3.5 h-3.5 text-[#A9D6F5]" />
              <span className="whitespace-nowrap">Profile &amp; Goals</span>
            </button>

            {/* Clinician Brief Button */}
            <button
              onClick={onOpenReport}
              className={`text-xs font-semibold tracking-wide px-2.5 sm:px-3 py-2 rounded-xl border transition-all flex items-center space-x-1.5 shrink-0 ${isDark
                ? 'border-[#E5DACB]/30 hover:border-[#A9D6F5] text-[#FAF6EE] hover:text-white bg-[#2B1E15] hover:bg-[#3D291A]'
                : 'border-[#E5DACB] hover:border-[#A9D6F5] text-[#3D291A] hover:text-[#A9D6F5] bg-white hover:bg-[#FAF6EE] shadow-xs'
                }`}
              title="Export Clinician Handover Packet"
            >
              <FileText className="w-3.5 h-3.5 text-[#A9D6F5]" />
              <span className="whitespace-nowrap">Doctor Packet</span>
            </button>

            {/* Launch Interactive Strip Scan CTA */}
            <button
              onClick={onOpenDemo}
              className={`group text-xs font-bold tracking-wide px-3 sm:px-3.5 py-2 rounded-xl transition-all duration-300 flex items-center space-x-1.5 shadow-sm shrink-0 whitespace-nowrap ${isDark
                ? 'bg-gradient-to-r from-[#A9D6F5] to-[#7CBFEA] text-white shadow-[0_0_20px_rgba(167,29,49,0.3)] hover:shadow-[0_0_30px_rgba(167,29,49,0.5)]'
                : 'bg-[#A9D6F5]-[#7CBFEA]-[#1F150E] shadow-md shadow-[#A9D6F5]/25 hover:shadow-lg'
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
              className={`p-2 rounded-xl border ${isDark ? 'border-[#E5DACB]/30 text-[#E5DACB] bg-[#2B1E15]' : 'border-[#E5DACB] text-[#3D291A] bg-white'
                }`}
            >
              {isDark ? <Sun className="w-4 h-4 text-[#E5DACB]" /> : <Moon className="w-4 h-4 text-[#3D291A]" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border ${isDark ? 'border-[#E5DACB]/30 text-[#FAF6EE] bg-[#2B1E15]' : 'border-[#E5DACB] text-[#3D291A] bg-white'
                }`}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={`lg:hidden px-5 pt-3 pb-6 space-y-2 border-b animate-fadeIn ${isDark ? 'bg-[#18100A]/95 backdrop-blur-2xl border-[#E5DACB]/20' : 'bg-[#FAF6EE]/95 backdrop-blur-2xl border-[#E5DACB] shadow-2xl'
          }`}>
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2.5 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${item.highlight
                ? isDark ? 'text-[#FAF6EE] bg-[#A9D6F5]/30 font-bold' : 'text-[#A9D6F5] bg-[#A9D6F5]/10 font-bold'
                : isDark ? 'text-[#E5DACB] hover:text-white hover:bg-white/5' : 'text-[#3D291A] hover:text-[#A9D6F5] hover:bg-white'
                }`}
            >
              {item.label}
            </a>
          ))}

          <div className="pt-3 border-t border-[#E5DACB]/40 flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenProfile) onOpenProfile();
              }}
              className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 ${isDark ? 'border-[#E5DACB]/30 text-[#FAF6EE] bg-[#2B1E15]' : 'border-[#E5DACB] text-[#3D291A] bg-white'
                }`}
            >
              <User className="w-4 h-4 text-[#A9D6F5]" />
              <span>Health Profile &amp; Consents</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReport();
              }}
              className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-2 ${isDark ? 'border-[#E5DACB]/30 text-[#FAF6EE] bg-[#2B1E15]' : 'border-[#E5DACB] text-[#3D291A] bg-white'
                }`}
            >
              <FileText className="w-4 h-4 text-[#A9D6F5]" />
              <span>Export Doctor Packet</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full py-3 rounded-xl bg-[#A9D6F5]-[#7CBFEA]-[#1F150E] text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md transition-colors"
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
