import React from 'react';
import { Activity, ArrowUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer({ onOpenDemo, onOpenReport }) {
  const { isDark } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`relative border-t pt-14 pb-10 text-xs transition-colors ${isDark ? 'bg-[#18100A] border-[#E5DACB]/20 text-[#E5DACB]' : 'bg-[#FAF6EE] border-[#E5DACB] text-[#553C2A]'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b ${isDark ? 'border-[#E5DACB]/20' : 'border-[#E5DACB]/40'
          }`}>

          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={scrollToTop}>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#A9D6F5]-[#1F150E] shadow-xs">
                <Activity className="w-4 h-4" />
              </div>
              <span className="font-sans text-lg font-bold tracking-tight text-[#3D291A] dark:text-[#FAF6EE]">
                BioTrajectory
              </span>
              <span className="text-[10px] font-sans font-semibold bg-[#A9D6F5]/10 text-[#A9D6F5] dark:text-[#E5DACB] px-2 py-0.5 rounded-full border border-[#A9D6F5]/20">
                Preventive Baseline Engine
              </span>
            </div>

            <p className={`text-xs leading-relaxed max-w-sm ${isDark ? 'text-[#E5DACB]' : 'text-[#553C2A]'}`}>
              Healthcare That Understands Where Your Health Is Heading. Continuous individualized baseline intelligence for chronic disease prevention.
            </p>

            <div className="text-xs font-semibold text-[#A9D6F5]">
              “Others measure your health. We track where it is going.”
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className={`text-xs uppercase font-sans font-bold tracking-wider ${isDark ? 'text-[#FAF6EE]' : 'text-[#3D291A]'}`}>
              Platform Navigation
            </h4>
            <ul className="space-y-1.5 text-xs font-sans">
              <li><a href="#live-prototype" className="hover:text-[#A9D6F5] transition-colors">Patient Trajectory Dashboard</a></li>
              <li><a href="#problem" className="hover:text-[#A9D6F5] transition-colors">Diagnostic Continuity & Blindspot</a></li>
              <li><a href="#biomarkers" className="hover:text-[#A9D6F5] transition-colors">Biomarker Reagent Suite</a></li>
              <li><a href="#live-prototype" onClick={() => onOpenDemo && onOpenDemo()} className="hover:text-[#A9D6F5] transition-colors">Bluetooth BLE Hub</a></li>
            </ul>
          </div>

          {/* Governance & Disclaimers */}
          <div className="md:col-span-4 space-y-2">
            <h4 className={`text-xs uppercase font-sans font-bold tracking-wider ${isDark ? 'text-[#FAF6EE]' : 'text-[#3D291A]'}`}>
              Clinical Governance & Disclaimers
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-[#E5DACB]' : 'text-[#846752]'}`}>
              Designed as a preventive baseline engine. Not for standalone acute medical diagnosis or prescription. Formal clinical validation under IRB protocol.
            </p>
            <div className="pt-2 flex items-center space-x-2">
              <button
                onClick={onOpenReport}
                className="px-3 py-1.5 rounded-lg text-xs font-sans font-semibold bg-[#A9D6F5]-[#1F150E] hover:bg-[#7CBFEA] transition-all shadow-xs cursor-pointer"
              >
                Export Doctor Packet
              </button>
              <button
                onClick={scrollToTop}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${isDark
                    ? 'bg-[#2B1E15] hover:bg-[#3D291A] text-[#FAF6EE] border-[#E5DACB]/30'
                    : 'bg-white hover:bg-[#FAF6EE] text-[#3D291A] border-[#E5DACB]'
                  }`}
                title="Back to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stitch Bottom Microbar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#846752] dark:text-[#E5DACB] text-xs font-sans">
          <p>© 2026 BioTrajectory. Longitudinal Health Trend Platform. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-sans px-2.5 py-0.5 rounded-full bg-[#E5DACB]/20 text-[#3D291A] dark:text-[#E5DACB] border border-[#E5DACB]/30">
              v2.4.1 Baseline Precision
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
