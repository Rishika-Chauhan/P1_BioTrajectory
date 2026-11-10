import React from 'react';
import { ROADMAP_PHASES } from '../data/mockData';
import { CheckCircle2, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Roadmap() {
  const { isDark } = useTheme();

  return (
    <section className={`relative py-24 transition-colors ${isDark ? 'bg-[#05070c]' : 'bg-[#fbfaf8]'
      }`} id="roadmap">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Development Milestones Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-inherit">
          <div className="max-w-2xl">
            <span className={`text-[11px] font-mono-code uppercase tracking-wider font-bold block mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              Platform Lifecycle & Validation Stages
            </span>
            <h2 className={`font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Strategic Horizons & Clinical Validation Pathway
            </h2>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Disciplined progression from working colorimetric prototype to formal IRB clinical trials, EHR interoperability, and multi-marker longitudinal prediction.
            </p>
          </div>
          <div className={`text-xs font-mono-code px-3.5 py-1.5 rounded-xl border shrink-0 ${isDark ? 'bg-slate-900 border-white/10 text-emerald-300' : 'bg-white border-slate-200 text-emerald-800 shadow-xs'}`}>
            Phase 1 Completed • Phase 2 Live Prototype
          </div>
        </div>

        {/* Roadmap Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {ROADMAP_PHASES.map((phase) => {
            const isCompleted = phase.status === 'Completed';
            const isCurrent = phase.status === 'Current Prototype';

            return (
              <div
                key={phase.phase}
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between shadow-lg ${isCurrent
                    ? isDark
                      ? 'bg-gradient-to-b from-[#11192e] to-[#090e18] border-amber-400/50 shadow-[0_10px_30px_rgba(217,119,6,0.15)] ring-1 ring-amber-400/30'
                      : 'bg-gradient-to-b from-amber-50 to-white border-amber-400 shadow-md ring-1 ring-amber-300'
                    : isCompleted
                      ? isDark
                        ? 'bg-[#090e18]/80 border-emerald-500/30'
                        : 'bg-white border-emerald-300'
                      : isDark
                        ? 'bg-[#090e18]/40 border-white/5 opacity-80'
                        : 'bg-white/80 border-slate-200 opacity-90'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-mono-code text-xs font-bold uppercase ${isDark ? 'text-amber-300' : 'text-amber-800'
                      }`}>
                      {phase.phase}
                    </span>
                    <span
                      className={`text-[10px] font-mono-code px-2 py-0.5 rounded border ${isCurrent
                          ? isDark
                            ? 'bg-amber-400/20 text-amber-200 border-amber-400/30 font-bold'
                            : 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                          : isCompleted
                            ? isDark
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold'
                            : isDark
                              ? 'bg-slate-800 text-slate-400 border-transparent'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                    >
                      {isCurrent ? 'MVP FOCUS' : phase.status}
                    </span>
                  </div>

                  <h3 className={`font-cinzel text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {phase.title}
                  </h3>
                  <span className={`text-[11px] font-mono-code block mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {phase.date}
                  </span>

                  <ul className="space-y-2">
                    {phase.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className={`text-[11px] leading-snug flex items-start space-x-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${isDark ? 'bg-amber-400/60' : 'bg-amber-600'
                          }`}></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {isCurrent && (
                  <div className={`mt-5 pt-3 border-t text-[10px] font-mono-code flex items-center justify-between ${isDark ? 'border-amber-400/20 text-amber-300' : 'border-amber-200 text-amber-800 font-semibold'
                    }`}>
                    <span>Active Prototype Focus</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Closing Smart-Bathroom Note */}
        <div className={`mt-14 p-6 rounded-2xl border max-w-4xl mx-auto text-center shadow-md ${isDark
            ? 'bg-gradient-to-r from-slate-900/80 via-amber-950/20 to-slate-900/80 border-amber-400/25'
            : 'bg-gradient-to-r from-amber-50/70 via-white to-amber-50/70 border-amber-300 shadow-[0_10px_25px_rgba(180,145,95,0.06)]'
          }`}>
          <p className={`font-serif-lux text-base sm:text-lg italic font-semibold leading-relaxed ${isDark ? 'text-amber-200' : 'text-amber-900'
            }`}>
            “Smart-bathroom sensing comes last, only after hygiene, calibration and regulatory questions are answered.”
          </p>
          <span className={`text-xs font-mono-code mt-2 block ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            — BioTrajectory Clinical Architecture Mandate
          </span>
        </div>

      </div>
    </section>
  );
}
