import React, { useState } from 'react';
import { Camera, LineChart, Search, MessageSquare, ArrowRight, Check, ShieldAlert, Sparkles, ChevronRight } from 'lucide-react';
import { PDF_SOLUTION_STEPS } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function OurSolution({ onOpenDemo, onOpenScanner }) {
  const { isDark } = useTheme();
  const [selectedStep, setSelectedStep] = useState(0);

  const stepIcons = [Camera, LineChart, Search, MessageSquare];

  return (
    <section className={`relative py-28 transition-colors border-t ${
      isDark ? 'bg-[#070b14] border-white/5' : 'bg-[#f4efe8]/50 border-amber-900/10'
    }`} id="solution">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-xs font-mono-code uppercase tracking-widest mb-4 ${
            isDark ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-xs'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>The Four-Step Engine • PDF Slide 3</span>
          </div>

          <h2 className={`font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Our Solution
          </h2>

          <p className={`mt-4 text-base sm:text-xl font-serif-lux italic max-w-2xl mx-auto ${
            isDark ? 'text-amber-200/90' : 'text-amber-900'
          }`}>
            “BioTrajectory turns repeated, everyday measurements into a personal health timeline.”
          </p>
        </div>

        {/* 4 Interactive Solution Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PDF_SOLUTION_STEPS.map((item, idx) => {
            const Icon = stepIcons[idx];
            const isSelected = selectedStep === idx;
            return (
              <div
                key={item.step}
                onClick={() => setSelectedStep(idx)}
                className={`relative rounded-2xl p-7 border cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? isDark
                      ? 'bg-gradient-to-b from-[#11192e] to-[#090e18] border-amber-400 shadow-[0_10px_35px_rgba(217,119,6,0.2)] ring-1 ring-amber-400/40'
                      : 'bg-white border-amber-500 shadow-[0_15px_35px_rgba(180,145,95,0.12)] ring-1 ring-amber-400/60'
                    : isDark
                    ? 'bg-[#090e18]/80 border-white/10 hover:border-white/20'
                    : 'bg-white/80 border-amber-900/10 hover:border-amber-300 shadow-xs'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-xs font-mono-code uppercase px-2.5 py-0.5 rounded border ${
                      isSelected
                        ? isDark ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-bold' : 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                        : isDark ? 'bg-slate-800 text-slate-400 border-transparent' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {item.badge}
                    </span>
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                      isSelected
                        ? isDark ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-amber-700 text-white border-amber-800'
                        : isDark ? 'bg-slate-900 text-slate-400 border-white/5' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className={`font-mono-code text-xs mb-1 ${
                    isSelected ? (isDark ? 'text-amber-300' : 'text-amber-700 font-bold') : (isDark ? 'text-slate-500' : 'text-slate-400')
                  }`}>
                    Step {item.step}
                  </div>

                  <h3 className={`font-cinzel text-xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                    {item.title}
                  </h3>

                  <p className={`text-sm leading-relaxed mb-4 ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {item.description}
                  </p>
                </div>

                <div className={`pt-4 border-t text-xs flex items-center justify-between ${
                  isDark ? 'border-white/5 text-slate-400' : 'border-slate-100 text-slate-500'
                }`}>
                  <span className="font-mono-code text-[11px]">{isSelected ? 'Active Step' : 'Click to inspect'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-amber-500' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Deep Dive Inspector */}
        <div className={`rounded-2xl border p-6 sm:p-8 mb-16 shadow-lg ${
          isDark
            ? 'bg-[#090e18] border-white/10'
            : 'bg-white border-amber-900/10 shadow-[0_10px_30px_rgba(0,0,0,0.03)]'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-inherit">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <span className={`text-xs font-mono-code uppercase font-semibold ${
                isDark ? 'text-amber-300' : 'text-amber-800'
              }`}>
                Step {PDF_SOLUTION_STEPS[selectedStep].step}: {PDF_SOLUTION_STEPS[selectedStep].title} — Architectural Guarantee
              </span>
            </div>
            <span className={`text-xs font-mono-code ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Non-Diagnostic • Strictly Deterministic
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="block font-semibold mb-1 text-amber-700 dark:text-amber-300 font-mono-code uppercase">Specification</span>
              <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {PDF_SOLUTION_STEPS[selectedStep].detail}
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="block font-semibold mb-1 text-emerald-700 dark:text-emerald-300 font-mono-code uppercase">Patient Agency</span>
              <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Every reading is user-audited before persistence. The user can adjust color pad interpretations, add meal or workout notes, or purge records.
              </p>
            </div>

            <div className={`p-4 rounded-xl border ${
              isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="block font-semibold mb-1 text-sky-700 dark:text-sky-300 font-mono-code uppercase">Clinical Safeguard</span>
              <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Multi-day persistence check: single-day spikes never trigger urgent flags unless sustained across 3 consecutive sessions. Symptoms always take priority.
              </p>
            </div>
          </div>
        </div>

        {/* The Golden Takeaway Banner (From Slide 3) */}
        <div className={`rounded-3xl p-8 sm:p-12 text-center border shadow-xl relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-r from-amber-950/40 via-[#0a0f1d] to-amber-950/40 border-amber-400/30'
            : 'bg-gradient-to-r from-amber-100/60 via-white to-amber-100/60 border-amber-300/80 shadow-[0_15px_40px_rgba(180,145,95,0.08)]'
        }`}>
          <div className={`inline-block text-xs font-mono-code uppercase tracking-widest px-3 py-1 rounded-full mb-4 ${
            isDark ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20' : 'bg-amber-100 text-amber-900 border border-amber-300'
          }`}>
            Core BioTrajectory Ethos
          </div>

          <h3 className={`font-cinzel text-2xl sm:text-4xl md:text-5xl font-extrabold max-w-4xl mx-auto leading-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            “Others measure your health, <br className="hidden sm:inline" />
            <span className="text-amber-600 dark:text-amber-400">We track where it is going.”</span>
          </h3>

          <p className={`mt-4 text-sm sm:text-base font-serif-lux italic max-w-2xl mx-auto ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Marker-by-marker trends, never one misleading health score.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenDemo}
              className={`px-7 py-3 rounded-xl text-xs font-bold font-mono-code uppercase tracking-wider transition-all shadow-md ${
                isDark
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 shadow-[0_0_20px_rgba(217,119,6,0.25)]'
                  : 'bg-gradient-to-r from-amber-600 to-amber-800 text-white'
              }`}
            >
              See Live Day 22 Trajectory Spike
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
