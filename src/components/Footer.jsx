import React from 'react';
import { Activity, ArrowUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer({ onOpenDemo, onOpenReport }) {
  const { isDark } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`relative border-t pt-14 pb-10 text-xs transition-colors ${
      isDark ? 'bg-[#070b14] border-slate-800 text-slate-400' : 'bg-[#f8faff] border-slate-200 text-slate-600'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>

          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={scrollToTop}>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00685f] text-white shadow-xs">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-sans text-lg font-bold tracking-tight text-on-surface">
                BioTrajectory
              </span>
              <span className="text-[10px] font-sans font-semibold bg-[#00685f]/10 text-[#00685f] dark:text-[#6bd8cb] px-2 py-0.5 rounded-full">
                Preventive Baseline Engine
              </span>
            </div>

            <p className={`text-xs leading-relaxed max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Healthcare That Understands Where Your Health Is Heading. Continuous individualized baseline intelligence for chronic disease prevention.
            </p>

            <div className="text-xs font-semibold text-[#00685f] dark:text-[#6bd8cb]">
              “Others measure your health. We track where it is going.”
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className={`text-xs uppercase font-sans font-bold tracking-wider ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
              Platform Navigation
            </h4>
            <ul className="space-y-1.5 text-xs font-sans">
              <li><a href="#live-prototype" className="hover:text-[#00685f] transition-colors">Patient Trajectory Dashboard</a></li>
              <li><a href="#problem" className="hover:text-[#00685f] transition-colors">Diagnostic Continuity & Blindspot</a></li>
              <li><a href="#biomarkers" className="hover:text-[#00685f] transition-colors">Biomarker Reagent Suite</a></li>
              <li><a href="#live-prototype" onClick={() => onOpenDemo && onOpenDemo()} className="hover:text-[#00685f] transition-colors">Bluetooth BLE Hub</a></li>
            </ul>
          </div>

          {/* Governance & Disclaimers */}
          <div className="md:col-span-4 space-y-2">
            <h4 className={`text-xs uppercase font-sans font-bold tracking-wider ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
              Clinical Governance & Disclaimers
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Designed as a preventive baseline engine. Not for standalone acute medical diagnosis or prescription. Formal clinical validation under IRB protocol.
            </p>
            <div className="pt-2 flex items-center space-x-2">
              <button
                onClick={onOpenReport}
                className="px-3 py-1.5 rounded-lg text-xs font-sans font-semibold bg-[#00685f] text-white hover:bg-[#008378] transition-all shadow-xs"
              >
                Export Doctor Packet
              </button>
              <button
                onClick={scrollToTop}
                className={`p-1.5 rounded-lg border transition-all ${
                  isDark
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="Back to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stitch Bottom Microbar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-xs font-sans">
          <p>© 2026 BioTrajectory. Longitudinal Health Trend Platform. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              v2.4.1 Baseline Precision
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
