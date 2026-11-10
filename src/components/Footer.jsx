import React from 'react';
import { Activity, ArrowUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Footer({ onOpenDemo, onOpenReport }) {
  const { isDark } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={`relative border-t pt-16 pb-12 text-xs transition-colors ${isDark ? 'bg-[#04060a] border-white/10 text-slate-400' : 'bg-[#ede8df] border-amber-900/10 text-slate-600'
      }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b ${isDark ? 'border-white/5' : 'border-slate-300/60'
          }`}>

          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={scrollToTop}>
              <div className={`flex items-center justify-center w-9 h-9 rounded-lg border ${isDark ? 'bg-amber-500/20 border-amber-400/30 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-800'
                }`}>
                <Activity className="w-4 h-4" />
              </div>
              <span className={`font-cinzel text-lg font-bold tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                BIO<span className={isDark ? 'text-amber-300' : 'text-amber-700'}>TRAJECTORY</span>
              </span>
            </div>

            <p className={`text-xs leading-relaxed font-light max-w-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Healthcare That Understands Where Your Health Is Heading. Continuous individualized baseline intelligence for chronic prevention.
            </p>

            <div className={`text-[11px] font-mono-code ${isDark ? 'text-amber-300/80' : 'text-amber-900'}`}>
              “Others measure your health. We track where it is going.”
            </div>

            {/* Contact & Platform Links */}
            <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono-code">
              <a href="#live-prototype" className="px-2.5 py-1 rounded border border-inherit hover:text-amber-600 transition-colors">
                🌐 Telemetry Console
              </a>
              <span className="px-2.5 py-1 rounded border border-inherit">
                Clinical Telemetry
              </span>
              <a href="mailto:contact@biotrajectory.health" className="px-2.5 py-1 rounded border border-inherit hover:text-amber-600 transition-colors">
                ✉️ Clinical Inquiries
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className={`text-xs uppercase font-mono-code tracking-wider font-semibold ${isDark ? 'text-white' : 'text-slate-900'
              }`}>
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#live-prototype" className={`transition-colors ${isDark ? 'hover:text-amber-300' : 'hover:text-amber-800'}`}>Patient Dashboard</a></li>
              <li><a href="#problem" className={`transition-colors ${isDark ? 'hover:text-amber-300' : 'hover:text-amber-800'}`}>Diagnostic Continuity</a></li>
              <li><a href="#solution" className={`transition-colors ${isDark ? 'hover:text-amber-300' : 'hover:text-amber-800'}`}>Trajectory Architecture</a></li>
              <li><a href="#biomarkers" className={`transition-colors ${isDark ? 'hover:text-amber-300' : 'hover:text-amber-800'}`}>Biomarker Chemistry</a></li>
              <li><a href="#clinical-rigor" className={`transition-colors ${isDark ? 'hover:text-amber-300' : 'hover:text-amber-800'}`}>Clinical Safety Rigor</a></li>
              <li><a href="#architecture" className={`transition-colors ${isDark ? 'hover:text-amber-300' : 'hover:text-amber-800'}`}>System Architecture</a></li>
              <li><a href="#roadmap" className={`transition-colors ${isDark ? 'hover:text-amber-300' : 'hover:text-amber-800'}`}>Clinical Horizons</a></li>
              <li><a href="#pitch" className={`transition-colors ${isDark ? 'hover:text-amber-300' : 'hover:text-amber-800'}`}>Clinical FAQ & Verification</a></li>
            </ul>
          </div>

          {/* Governance & Disclaimers */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className={`text-xs uppercase font-mono-code tracking-wider font-semibold ${isDark ? 'text-white' : 'text-slate-900'
              }`}>
              Clinical Staging & Integrity
            </h4>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Designed as a staged prototype today. Formal clinical sensitivity, specificity, and diagnostic trials are scheduled for Phase 4 under Institutional Review Board (IRB) oversight.
            </p>
            <div className="pt-2 flex items-center space-x-3">
              <button
                onClick={onOpenReport}
                className={`px-3 py-1.5 rounded text-[11px] font-mono-code border transition-all ${isDark
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                  }`}
              >
                Clinician Brief Format
              </button>
              <button
                onClick={scrollToTop}
                className={`p-1.5 rounded border transition-all ${isDark
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-white/10'
                    : 'bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-300 shadow-xs'
                  }`}
                title="Back to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Mandatory Regulatory & Legal Disclaimer */}
        <div className={`mt-8 p-5 rounded-xl border space-y-2 ${isDark ? 'bg-slate-950/80 border-white/5' : 'bg-white border-amber-300/70 shadow-xs'
          }`}>
          <div className={`text-[11px] font-mono-code uppercase tracking-wider font-semibold ${isDark ? 'text-amber-300' : 'text-amber-900'
            }`}>
            Clinical Regulatory Disclaimer & Non-Diagnostic Intended Use:
          </div>
          <p className={`text-[11px] leading-relaxed font-light ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            BioTrajectory is an investigational software platform and clinical research prototype. This application is not medical advice, a diagnostic device, a clinical protocol, or evidence of formal regulatory clearance. The platform must not be used to diagnose, treat, prevent, or rule out disease. All health decisions require professional clinician evaluation; symptoms always take priority over telemetry.
          </p>
        </div>

        {/* Copyright */}
        <div className={`mt-8 flex flex-wrap items-center justify-between text-[11px] font-mono-code ${isDark ? 'text-slate-500' : 'text-slate-500'
          }`}>
          <span>© 2026 BioTrajectory Platform. Designed for Longitudinal Clinical Intelligence.</span>
          <span>Validated Reagent Colorimetry & Grounded AI Architecture</span>
        </div>

      </div>
    </footer>
  );
}
