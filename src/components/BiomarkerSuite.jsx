import React, { useState } from 'react';
import { BIOMARKER_DEFINITIONS } from '../data/mockData';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function BiomarkerSuite() {
  const { isDark } = useTheme();
  const [selectedBio, setSelectedBio] = useState(BIOMARKER_DEFINITIONS[0]);

  return (
    <section className={`relative py-24 border-t transition-colors ${
      isDark ? 'bg-[#070b14] border-white/[0.07]' : 'bg-[#f4efe8]/70 border-amber-900/10'
    }`} id="biomarkers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-xs font-mono-code uppercase tracking-wider mb-4 ${
            isDark ? 'bg-cyan-500/10 border-cyan-500/25 text-cyan-300' : 'bg-cyan-50 border-cyan-300 text-cyan-900 shadow-sm'
          }`}>
            <span>Section 10 & 11 • Urine Reagent Biomarkers</span>
          </div>

          <h2 className={`font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            The Multi-Organ Biomarker Suite
          </h2>
          <p className={`mt-4 text-base sm:text-lg font-light leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Urinalysis offers centuries of established clinical science. By tracking selected biochemical indicators longitudinally, BioTrajectory contextualizes everyday variability without premature alarm.
          </p>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Biomarker List Selectors */}
          <div className="lg:col-span-5 space-y-2.5">
            {BIOMARKER_DEFINITIONS.map((bio) => {
              const isSelected = selectedBio.id === bio.id;
              return (
                <div
                  key={bio.id}
                  onClick={() => setSelectedBio(bio)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? isDark
                        ? 'bg-gradient-to-r from-amber-400/20 via-slate-900 to-slate-900 border-amber-400/60 shadow-[0_5px_20px_rgba(217,119,6,0.15)]'
                        : 'bg-amber-50/80 border-amber-400 shadow-sm'
                      : isDark
                      ? 'bg-[#090e18]/70 border-white/5 hover:border-white/15 hover:bg-slate-800/40 text-slate-300'
                      : 'bg-white border-slate-200 hover:border-amber-300 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isSelected
                          ? isDark ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]' : 'bg-amber-600 shadow-sm'
                          : isDark ? 'bg-slate-700' : 'bg-slate-300'
                      }`}
                    ></div>
                    <div>
                      <h4 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{bio.name}</h4>
                      <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Unit: {bio.unit} • Range: {bio.normalRange}</p>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    isSelected ? (isDark ? 'text-amber-400 translate-x-1' : 'text-amber-700 translate-x-1') : 'text-slate-400'
                  }`} />
                </div>
              );
            })}
          </div>

          {/* Detailed Inspector Panel */}
          <div className={`lg:col-span-7 rounded-2xl border p-6 sm:p-8 shadow-xl relative overflow-hidden ${
            isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
          }`}>
            <div className={`flex flex-wrap items-center justify-between gap-3 pb-5 border-b ${
              isDark ? 'border-white/10' : 'border-slate-100'
            }`}>
              <div>
                <span className={`text-[10px] font-mono-code uppercase tracking-wider font-semibold ${
                  isDark ? 'text-amber-300' : 'text-amber-700'
                }`}>
                  Biomarker Deep Dive
                </span>
                <h3 className={`font-cinzel text-2xl font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedBio.name}
                </h3>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-mono-code block uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Population Reference</span>
                <span className={`text-xs font-mono-code font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{selectedBio.normalRange}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-5">
              <h4 className={`text-xs font-mono-code uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Clinical Relevance
              </h4>
              <p className={`text-sm leading-relaxed font-light ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {selectedBio.description}
              </p>
            </div>

            {/* Colorimetric Reagent Pad Scale */}
            <div className={`mt-6 p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-xs font-mono-code uppercase block mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Commercial Colorimetric Pad Spectrum:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {selectedBio.colorScale.map((pad, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className="w-full h-8 rounded-md border shadow-xs"
                      style={{ backgroundColor: pad.color }}
                    ></div>
                    <span className={`text-[10px] font-mono-code mt-1.5 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {pad.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Baseline Strategy & Confounders */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`text-xs font-mono-code uppercase tracking-wider block mb-1 font-semibold ${
                  isDark ? 'text-emerald-400' : 'text-emerald-800'
                }`}>
                  Baseline Modeling Strategy
                </span>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Requires 10 confirmed sessions before declaring baseline confidence. Uses rolling medians to filter acute outliers.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-amber-950/20 border-amber-500/25' : 'bg-amber-50 border-amber-200'}`}>
                <span className={`text-xs font-mono-code uppercase tracking-wider block mb-1 font-semibold ${
                  isDark ? 'text-amber-300' : 'text-amber-900'
                }`}>
                  Non-Pathological Confounders
                </span>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-amber-200/90' : 'text-amber-950'}`}>
                  {selectedBio.biologicalContext}
                </p>
              </div>
            </div>

            {/* Bottom Note */}
            <div className={`mt-6 pt-5 border-t flex items-center justify-between text-xs ${
              isDark ? 'border-white/10 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              <span className={`font-serif-lux italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                “A single number is a riddle. A personal trajectory is an actionable story.”
              </span>
              <span className={`text-[11px] font-mono-code font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                100% Non-Diagnostic
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
