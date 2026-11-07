import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, FileText, Sparkles, ChevronRight, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Navbar({ onOpenDemo, onOpenReport }) {
  const { theme, isDark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Problem', href: '#problem' },
    { label: 'Solution', href: '#solution' },
    { label: 'Live Dashboard', href: '#live-prototype', highlight: true },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Biomarkers', href: '#biomarkers' },
    { label: 'Tech Stack', href: '#stack' },
    { label: 'Impact', href: '#who-needs-this' },
    { label: 'Roadmap', href: '#roadmap' },
    { label: 'Pitch Room', href: '#pitch' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isDark
            ? 'bg-[#05070c]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.8)]'
            : 'bg-[#fbfaf8]/90 backdrop-blur-xl border-b border-amber-900/10 shadow-[0_4px_25px_rgba(0,0,0,0.05)]'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Identity */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div
              className={`relative flex items-center justify-center w-11 h-11 rounded-xl transition-all ${
                isDark
                  ? 'bg-gradient-to-br from-amber-900/40 via-amber-700/20 to-slate-900 border border-amber-500/30 shadow-[0_0_20px_rgba(197,168,128,0.2)]'
                  : 'bg-gradient-to-br from-amber-100 via-amber-50 to-white border border-amber-300/70 shadow-[0_4px_15px_rgba(180,145,95,0.15)]'
              }`}
            >
              <Activity className={`w-5 h-5 ${isDark ? 'text-amber-300' : 'text-amber-700'} animate-pulse`} />
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 ${isDark ? 'border-[#05070c]' : 'border-[#fbfaf8]'}`}></div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`font-cinzel text-xl font-bold tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  BIO<span className={isDark ? 'text-amber-300' : 'text-amber-700'}>TRAJECTORY</span>
                </span>
                <span
                  className={`text-[10px] uppercase font-mono-code tracking-widest px-1.5 py-0.5 rounded ${
                    isDark
                      ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                      : 'bg-amber-100/70 text-amber-800 border border-amber-300/60'
                  }`}
                >
                  Blueprint v1.0
                </span>
              </div>
              <p className={`text-[11px] tracking-wide font-light hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Longitudinal Preventive Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-6">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-xs uppercase tracking-widest font-medium transition-all duration-200 ${
                  item.highlight
                    ? isDark
                      ? 'text-amber-300 font-semibold flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 shadow-[0_0_15px_rgba(217,119,6,0.15)]'
                      : 'text-amber-800 font-semibold flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 border border-amber-300/80 shadow-sm'
                    : isDark
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {item.highlight && <Sparkles className={`w-3 h-3 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />}
                {item.label}
              </a>
            ))}
          </div>

          {/* Actions & Theme Switcher */}
          <div className="hidden sm:flex items-center space-x-3">
            
            {/* Luxury Theme Switcher */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-lg border transition-all flex items-center space-x-1.5 ${
                isDark
                  ? 'border-white/10 text-amber-300 bg-slate-900/60 hover:bg-slate-800'
                  : 'border-amber-300/60 text-amber-800 bg-amber-50 hover:bg-amber-100 shadow-sm'
              }`}
              title={isDark ? 'Switch to Ivory Light Theme' : 'Switch to Obsidian Dark Theme'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="text-[11px] font-mono-code uppercase font-semibold">
                {isDark ? 'Light' : 'Dark'}
              </span>
            </button>

            {/* Clinician PDF Button */}
            <button
              onClick={onOpenReport}
              className={`text-xs font-medium tracking-wider uppercase px-4 py-2.5 rounded-lg border transition-all flex items-center space-x-2 ${
                isDark
                  ? 'border-slate-700/80 hover:border-amber-400/40 text-slate-300 hover:text-amber-200 bg-slate-900/60 hover:bg-slate-800/80'
                  : 'border-slate-300 hover:border-amber-400 text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 shadow-sm'
              }`}
            >
              <FileText className={`w-3.5 h-3.5 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
              <span>Clinician PDF</span>
            </button>

            {/* Interactive Prototype Button */}
            <button
              onClick={onOpenDemo}
              className={`group text-xs font-bold tracking-wider uppercase px-5 py-2.5 rounded-lg transition-all duration-300 flex items-center space-x-1.5 shadow-md ${
                isDark
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-[0_0_20px_rgba(197,168,128,0.25)] hover:shadow-[0_0_30px_rgba(197,168,128,0.45)]'
                  : 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-[0_4px_15px_rgba(180,145,95,0.25)] hover:shadow-[0_6px_20px_rgba(180,145,95,0.4)]'
              }`}
            >
              <span>Prototype</span>
              <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className={`p-1.5 rounded-lg border ${
                isDark ? 'border-white/10 text-amber-300 bg-slate-900' : 'border-amber-300 text-amber-800 bg-amber-50'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-lg ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className={`lg:hidden px-4 pt-3 pb-6 space-y-3 border-b ${
          isDark ? 'bg-[#0a0f1d]/95 backdrop-blur-2xl border-white/10' : 'bg-white/95 backdrop-blur-2xl border-slate-200 shadow-xl'
        }`}>
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block py-2 text-sm border-b ${
                isDark ? 'text-slate-300 hover:text-amber-300 border-white/5' : 'text-slate-700 hover:text-amber-800 border-slate-100'
              }`}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReport();
              }}
              className={`w-full py-2.5 rounded-lg border text-xs font-semibold uppercase flex items-center justify-center space-x-2 ${
                isDark ? 'border-slate-700 text-slate-200 bg-slate-800' : 'border-slate-300 text-slate-700 bg-slate-50'
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
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Live Prototype</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
