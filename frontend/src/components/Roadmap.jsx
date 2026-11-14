import React from 'react';
import { ROADMAP_PHASES } from '../data/mockData';
import { CheckCircle2, Calendar } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Roadmap() {
  const { isDark } = useTheme();

  return (
    <section className={`relative py-20 transition-colors ${isDark ? 'bg-[#070b14]' : 'bg-[#faf8ff]'}`} id="roadmap">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Development Milestones Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#00685f]"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#00685f] dark:text-[#6bd8cb]">
                Platform Lifecycle & Validation Stages
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Strategic Horizons & Clinical Validation Pathway
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Disciplined progression from working colorimetric prototype to formal IRB clinical trials, EHR interoperability, and multi-marker longitudinal prediction.
            </p>
          </div>
          <div className="text-xs font-mono px-3.5 py-1.5 rounded-xl border shrink-0 bg-white dark:bg-[#0d1526] border-slate-200 dark:border-slate-800 text-[#006947] dark:text-[#6ffbbe] shadow-xs">
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
                className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between shadow-xs ${isCurrent
                  ? isDark
                    ? 'bg-[#0d1526] border-[#00685f] shadow-[0_8px_25px_rgba(0,104,95,0.2)] ring-1 ring-[#00685f]/40'
                    : 'bg-white border-[#00685f] shadow-md ring-1 ring-[#00685f]/30'
                  : isCompleted
                    ? isDark
                      ? 'bg-[#0a0f1d] border-[#006947]/30'
                      : 'bg-white border-[#006947]/30'
                    : isDark
                      ? 'bg-[#0a0f1d]/50 border-slate-800/80 opacity-80'
                      : 'bg-white/80 border-slate-200 opacity-90'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-mono text-xs font-bold uppercase ${isCurrent ? 'text-[#00685f] dark:text-[#6bd8cb]' : 'text-slate-500'
                      }`}>
                      {phase.phase}
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${isCurrent
                        ? 'bg-[#00685f]/15 text-[#00685f] dark:text-[#6bd8cb] border-[#00685f]/30 font-bold'
                        : isCompleted
                          ? 'bg-[#006947]/15 text-[#006947] dark:text-[#6ffbbe] border-[#006947]/30 font-semibold'
                          : isDark
                            ? 'bg-slate-800 text-slate-400 border-transparent'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                    >
                      {isCurrent ? 'MVP FOCUS' : phase.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold mb-1 text-slate-900 dark:text-white">
                    {phase.title}
                  </h3>
                  <span className="text-[11px] font-mono block mb-4 text-slate-500">
                    {phase.date}
                  </span>

                  <ul className="space-y-2">
                    {phase.deliverables.map((item, dIdx) => (
                      <li key={dIdx} className="text-[11px] leading-snug flex items-start space-x-1.5 text-slate-600 dark:text-slate-300">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-1 ${isCurrent ? 'bg-[#00685f]' : isCompleted ? 'bg-[#006947]' : 'bg-slate-400'
                          }`}></span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {isCurrent && (
                  <div className="mt-5 pt-3 border-t text-[10px] font-mono flex items-center justify-between border-slate-200 dark:border-slate-800 text-[#00685f] dark:text-[#6bd8cb] font-semibold">
                    <span>Active Prototype Focus</span>
                    <span className="w-2 h-2 rounded-full bg-[#00685f] animate-ping"></span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
