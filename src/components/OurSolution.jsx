import React, { useState } from 'react';
import { Camera, LineChart, Search, MessageSquare, ChevronRight } from 'lucide-react';
import { PDF_SOLUTION_STEPS } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function OurSolution({ onOpenDemo }) {
  const { isDark } = useTheme();
  const [selectedStep, setSelectedStep] = useState(0);

  const stepIcons = [Camera, LineChart, Search, MessageSquare];

  return (
    <section className={`relative py-20 transition-colors border-t ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-[#faf8ff] border-slate-200'
      }`} id="solution">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Solution Framework Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-5 border-b border-inherit">
          <div className="max-w-2xl">
            <span className="text-[11px] font-sans uppercase tracking-wider font-bold block mb-1 text-[#00685f] dark:text-[#6bd8cb]">
              Continuous Baseline Intelligence
            </span>
            <h2 className={`font-sans text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
              The Four-Stage Trajectory Methodology
            </h2>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Turning repeated at-home urinalysis into a personal health timeline through guided colorimetry, individualized IQR baselines, and clinician-ready documentation.
            </p>
          </div>
          <div className={`text-xs font-sans px-3 py-1.5 rounded-lg border shrink-0 ${isDark ? 'bg-[#0d1526] border-slate-800 text-[#6bd8cb]' : 'bg-white border-slate-200 text-[#00685f] shadow-xs'}`}>
            Click any stage below to inspect technical architecture
          </div>
        </div>

        {/* 4 Interactive Solution Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {PDF_SOLUTION_STEPS.map((item, idx) => {
            const Icon = stepIcons[idx];
            const isSelected = selectedStep === idx;
            return (
              <div
                key={item.step}
                onClick={() => setSelectedStep(idx)}
                className={`relative rounded-xl p-6 border cursor-pointer transition-all duration-300 flex flex-col justify-between ${isSelected
                    ? isDark
                      ? 'bg-[#0d1526] border-[#00685f] shadow-[0_4px_24px_rgba(0,104,95,0.25)] ring-1 ring-[#00685f]'
                      : 'bg-white border-[#00685f] shadow-sm ring-1 ring-[#00685f]/40'
                    : isDark
                      ? 'bg-[#0d1526]/70 border-slate-800 hover:border-slate-700'
                      : 'bg-white border-[#e2e8f0] hover:border-slate-300 shadow-xs'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-sans font-bold uppercase px-2 py-0.5 rounded ${isSelected
                        ? 'bg-[#00685f]/15 text-[#00685f] dark:text-[#6bd8cb]'
                        : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}>
                      {item.badge}
                    </span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected
                        ? 'bg-[#00685f] text-white'
                        : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div className={`text-[11px] font-sans font-bold mb-1 ${isSelected ? 'text-[#00685f] dark:text-[#6bd8cb]' : 'text-slate-400'}`}>
                    Step {item.step}
                  </div>

                  <h3 className={`font-sans text-base font-bold mb-2 ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
                    {item.title}
                  </h3>

                  <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {item.description}
                  </p>
                </div>

                <div className={`pt-3 border-t text-xs flex items-center justify-between ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
                  <span className="font-sans text-[11px]">{isSelected ? 'Active Stage' : 'Click to inspect'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-[#00685f]' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Deep Dive Inspector */}
        <div className={`rounded-xl border p-6 mb-12 shadow-xs ${isDark
            ? 'bg-[#0d1526] border-slate-800'
            : 'bg-white border-[#e2e8f0]'
          }`}>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-inherit">
            <div className="flex items-center space-x-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00685f]"></span>
              <span className="text-xs font-sans font-bold uppercase tracking-wider text-[#00685f] dark:text-[#6bd8cb]">
                Step {PDF_SOLUTION_STEPS[selectedStep].step}: {PDF_SOLUTION_STEPS[selectedStep].title} — Architectural Guarantee
              </span>
            </div>
            <span className="text-xs font-sans text-slate-400">
              Non-Diagnostic • Strictly Deterministic
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
            <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="block font-bold mb-1 text-[#00685f] dark:text-[#6bd8cb] uppercase text-[11px]">Specification</span>
              <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {PDF_SOLUTION_STEPS[selectedStep].detail}
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="block font-bold mb-1 text-[#006947] dark:text-[#6ffbbe] uppercase text-[11px]">Patient Agency</span>
              <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Every reading is user-audited before persistence. The user can adjust color pad interpretations, add meal or workout notes, or purge records.
              </p>
            </div>

            <div className={`p-4 rounded-lg border ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <span className="block font-bold mb-1 text-[#00687a] dark:text-[#57dffe] uppercase text-[11px]">Clinical Safeguard</span>
              <p className={`leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Multi-day persistence check: single-day spikes never trigger urgent flags unless sustained across 3 consecutive sessions. Symptoms always take priority.
              </p>
            </div>
          </div>
        </div>

        {/* The Golden Takeaway Banner */}
        <div className={`rounded-xl p-8 sm:p-10 text-center border shadow-xs relative overflow-hidden ${isDark
            ? 'bg-[#0d1526] border-slate-800'
            : 'bg-white border-[#e2e8f0]'
          }`}>
          <div className="inline-block text-[11px] font-sans font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 bg-[#00685f]/10 text-[#00685f] dark:text-[#6bd8cb]">
            Core BioTrajectory Ethos
          </div>

          <h3 className={`font-sans text-2xl sm:text-3xl font-bold max-w-3xl mx-auto leading-tight ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
            “Others measure your health, <br className="hidden sm:inline" />
            <span className="text-[#00685f] dark:text-[#6bd8cb]">We track where it is going.”</span>
          </h3>

          <p className={`mt-3 text-sm max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Marker-by-marker trends, never one misleading composite score.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onOpenDemo}
              className="px-6 py-2.5 rounded-lg text-xs font-bold font-sans uppercase tracking-wider bg-[#00685f] hover:bg-[#008378] text-white transition-all shadow-xs"
            >
              See Live Day 22 Trajectory Spike
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
