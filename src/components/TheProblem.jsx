import React, { useState } from 'react';
import { Calendar, FileSpreadsheet, HelpCircle, ArrowRight, AlertTriangle, ShieldCheck, TrendingUp, Clock } from 'lucide-react';
import { PDF_PROBLEM_SECTION } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function TheProblem() {
  const { isDark } = useTheme();
  const [activeComparison, setActiveComparison] = useState('trajectory'); // 'snapshot' vs 'trajectory'

  const iconMap = {
    Calendar: Calendar,
    FileSpreadsheet: FileSpreadsheet,
    HelpCircle: HelpCircle
  };

  return (
    <section className={`relative py-28 transition-colors ${
      isDark ? 'bg-[#05070c]' : 'bg-[#faf9f6]'
    }`} id="problem">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Pill & Editorial Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-xs font-mono-code uppercase tracking-widest mb-4 shadow-xs ${
            isDark
              ? 'bg-amber-400/10 border-amber-400/25 text-amber-300'
              : 'bg-amber-50 border-amber-300/80 text-amber-900'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>The Clinical Dilemma • PDF Slide 2</span>
          </div>

          <h2 className={`font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {PDF_PROBLEM_SECTION.headline}
          </h2>
          
          <p className={`mt-4 text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            Traditional medicine reacts to acute crises. By the time symptoms surface, organ stress has compounded quietly for months.
          </p>
        </div>

        {/* 3 Core Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PDF_PROBLEM_SECTION.issues.map((issue, idx) => {
            const Icon = iconMap[issue.icon] || Calendar;
            return (
              <div
                key={issue.id}
                className={`relative rounded-2xl p-7 border transition-all duration-300 group flex flex-col justify-between ${
                  isDark
                    ? 'bg-[#090e18] border-white/10 hover:border-amber-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
                    : 'bg-white border-amber-900/10 hover:border-amber-400/80 shadow-[0_10px_30px_rgba(180,145,95,0.06)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${
                      isDark
                        ? 'bg-slate-900 border-white/10 text-amber-300 group-hover:scale-105 group-hover:bg-amber-400/20'
                        : 'bg-amber-50 border-amber-200 text-amber-800 group-hover:scale-105 group-hover:bg-amber-100'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-xs font-mono-code font-bold ${
                      isDark ? 'text-slate-600' : 'text-slate-300'
                    }`}>
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className={`font-cinzel text-xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {issue.title}
                  </h3>

                  <p className={`text-sm leading-relaxed mb-4 font-light ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {issue.description}
                  </p>
                </div>

                <div className={`pt-4 border-t text-xs font-mono-code flex items-center space-x-1.5 ${
                  isDark ? 'border-white/5 text-amber-300/80' : 'border-amber-100 text-amber-900/80'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  <span className="italic">“{issue.badScenario}”</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 2 Big Impact Statistics (9 in 10 & 101M) */}
        <div className={`rounded-3xl border p-8 sm:p-12 mb-16 shadow-xl ${
          isDark
            ? 'bg-gradient-to-br from-[#0c1424] via-[#080d1a] to-[#05070c] border-amber-400/25'
            : 'bg-gradient-to-br from-amber-50/70 via-white to-amber-100/30 border-amber-300/70 shadow-[0_15px_40px_rgba(180,145,95,0.08)]'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Stat 1: 9 in 10 */}
            <div className={`md:col-span-5 text-center md:text-left md:border-r pr-0 md:pr-8 ${
              isDark ? 'border-white/10' : 'border-amber-200/80'
            }`}>
              <div className="font-cinzel text-5xl sm:text-6xl md:text-7xl font-extrabold text-amber-600 dark:text-amber-400 tracking-tight">
                9 in 10
              </div>
              <p className={`mt-3 text-base sm:text-lg font-light leading-snug ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}>
                adults with chronic kidney disease do not know they have it
              </p>
              <span className={`inline-block mt-3 text-xs font-mono-code uppercase px-2.5 py-1 rounded border ${
                isDark ? 'bg-amber-400/10 text-amber-300 border-amber-400/20' : 'bg-amber-100 text-amber-900 border-amber-300/80'
              }`}>
                Silent Progression
              </span>
            </div>

            {/* Stat 2: 101M */}
            <div className="md:col-span-7 text-center md:text-left pl-0 md:pl-4">
              <div className="font-cinzel text-5xl sm:text-6xl md:text-7xl font-extrabold text-amber-700 dark:text-amber-300 tracking-tight">
                101M
              </div>
              <p className={`mt-3 text-base sm:text-lg font-light leading-snug ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}>
                Indians live with diabetes, and <strong className="font-semibold text-amber-700 dark:text-amber-300">136M more</strong> have prediabetes
              </p>
              <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                <span className={`text-xs font-mono-code uppercase px-3 py-1 rounded-full border ${
                  isDark ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}>
                  136M Reversible Prevention Window
                </span>
                <span className={`text-xs font-mono-code uppercase px-3 py-1 rounded-full border ${
                  isDark ? 'bg-slate-800 text-slate-300 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}>
                  315M With Hypertension
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Interactive Comparison: Single Snapshot vs Continuous Trajectory */}
        <div className={`rounded-2xl border p-6 sm:p-8 ${
          isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10 shadow-sm'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className={`text-xs font-mono-code uppercase tracking-wider font-semibold ${
                isDark ? 'text-amber-300' : 'text-amber-800'
              }`}>
                Interactive Paradigm Comparison
              </span>
              <h4 className={`font-cinzel text-xl font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Snapshot vs Trajectory
              </h4>
            </div>

            {/* Switcher Buttons */}
            <div className={`p-1 rounded-xl border flex items-center space-x-1 ${
              isDark ? 'bg-slate-950 border-white/10' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setActiveComparison('snapshot')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeComparison === 'snapshot'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                The Isolated Snapshot
              </button>
              <button
                onClick={() => setActiveComparison('trajectory')}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeComparison === 'trajectory'
                    ? isDark ? 'bg-amber-400 text-slate-950 shadow-sm' : 'bg-amber-700 text-white shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                The BioTrajectory Story
              </button>
            </div>
          </div>

          {/* Comparative Demonstration Container */}
          {activeComparison === 'snapshot' ? (
            <div className={`p-6 rounded-xl border ${
              isDark ? 'bg-rose-950/20 border-rose-500/30' : 'bg-rose-50/70 border-rose-200'
            }`}>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-600 border border-rose-300 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-rose-900 dark:text-rose-200 font-cinzel">
                    Day 22: Isolated Clinic Reading = 32 mg/dL Protein
                  </h5>
                  <p className="mt-1 text-xs text-rose-800/90 dark:text-rose-300/80 leading-relaxed">
                    Without prior history, this test registers in the danger zone. The patient is terrified, suspects acute renal failure, and undergoes costly emergency laboratory panels—ignorant that it was merely post-gym dehydration that resolved 48 hours later.
                  </p>
                  <div className="mt-3 flex items-center space-x-2 text-[11px] font-mono-code text-rose-700 dark:text-rose-400">
                    <span>Outcome: False panic, needless anxiety, zero baseline context.</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`p-6 rounded-xl border ${
              isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50/70 border-emerald-200'
            }`}>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 border border-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 font-cinzel">
                    Day 22: BioTrajectory Longitudinal Context
                  </h5>
                  <p className="mt-1 text-xs text-emerald-800/90 dark:text-emerald-300/80 leading-relaxed">
                    BioTrajectory knows the patient’s established 15-day baseline is 5.2 mg/dL. It notes concurrent elevated specific gravity (1.028) and workout notes. Transparent statistical rules flag it for review, watch it resolve to 18 then 8 mg/dL, and provide peace of mind.
                  </p>
                  <div className="mt-3 flex items-center space-x-2 text-[11px] font-mono-code text-emerald-700 dark:text-emerald-400">
                    <span>Outcome: Calm clinical understanding, informed doctor conversation.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
}
