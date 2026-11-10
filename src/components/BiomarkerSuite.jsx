import React, { useState } from 'react';
import { BIOMARKER_DEFINITIONS } from '../data/mockData';
import { ChevronRight, Sliders, Activity, Info, ShieldCheck, AlertTriangle, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function BiomarkerSuite() {
  const { isDark } = useTheme();
  const [selectedBio, setSelectedBio] = useState(BIOMARKER_DEFINITIONS[0]);
  
  // Interactive Confounder Simulator State
  const [activeConfounder, setActiveConfounder] = useState('baseline'); // 'baseline', 'dehydration', 'exercise', 'diet', 'vitaminc'

  // Confounder definitions and simulated impacts
  const confounders = [
    {
      id: 'baseline',
      name: 'Normal Homeostasis',
      factor: 'Standard hydration, balanced nutrition, normal rest',
      impactOnCurrent: {
        readingShift: `${selectedBio.baselineMean} ${selectedBio.unit}`,
        status: 'Optimal Baseline',
        colorIdx: 0,
        explanation: 'Reflects stable personal baseline without acute physiological disturbances.'
      }
    },
    {
      id: 'dehydration',
      name: 'Acute Fluid Restriction (Dehydration)',
      factor: 'Sweat loss, low fluid intake, hot climate',
      impactOnCurrent: {
        readingShift: selectedBio.id === 'protein' ? '30 mg/dL (Trace/+)' : selectedBio.id === 'specificGravity' ? '1.028 (High Density)' : 'Concentrated shift',
        status: 'Physiological Concentration',
        colorIdx: Math.min(2, selectedBio.colorScale.length - 1),
        explanation: 'Kidneys actively reabsorb water to preserve blood volume, concentrating all urinary solutes and elevating apparent density without intrinsic renal injury.'
      }
    },
    {
      id: 'exercise',
      name: 'Post-Workout Exertion (March Effect)',
      factor: 'High-intensity resistance or endurance training',
      impactOnCurrent: {
        readingShift: selectedBio.id === 'protein' ? '32 mg/dL (+3.8σ)' : selectedBio.id === 'ketones' ? '15 mg/dL' : 'Mild elevation',
        status: 'Transient Exertion Shift',
        colorIdx: Math.min(2, selectedBio.colorScale.length - 1),
        explanation: 'Strenuous muscular exertion temporarily alters glomerular filtration pressure and tubular reabsorption, causing transient benign proteinuria.'
      }
    },
    {
      id: 'diet',
      name: 'Dietary Shift (Alkaline vs Acidic)',
      factor: 'High citrus/vegetables vs ketogenic/high animal protein',
      impactOnCurrent: {
        readingShift: selectedBio.id === 'pH' ? '7.8 (Alkaline) or 5.2 (Acidic)' : selectedBio.id === 'ketones' ? '40 mg/dL' : 'Subtle ionic shift',
        status: 'Metabolic Nutrition Response',
        colorIdx: Math.min(3, selectedBio.colorScale.length - 1),
        explanation: 'Urine pH rapidly buffers blood acid-base equilibrium. Citrus increases urinary citrate and pH; prolonged fasting promotes ketogenesis.'
      }
    },
    {
      id: 'vitaminc',
      name: 'Ascorbic Acid (Vitamin C Mega-dose)',
      factor: 'High-dose multivitamin or immune supplements (>500mg)',
      impactOnCurrent: {
        readingShift: selectedBio.id === 'glucose' || selectedBio.id === 'blood' ? 'False Negative (0 mg/dL)' : 'Chemical Interference Risk',
        status: 'Colorimetric Inhibition',
        colorIdx: 0,
        explanation: 'Ascorbic acid is a strong reducing agent that chemically neutralizes hydrogen peroxide intermediates in glucose and occult blood enzymatic pads.'
      }
    }
  ];

  const currentConfounderInfo = confounders.find((c) => c.id === activeConfounder) || confounders[0];

  return (
    <section
      className={`relative py-24 border-t transition-colors ${
        isDark ? 'bg-[#070b14] border-white/[0.07]' : 'bg-[#f4efe8]/70 border-amber-900/10'
      }`}
      id="biomarkers"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Biomarker Reagent Panel Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-inherit">
          <div className="max-w-2xl">
            <span className={`text-[11px] font-mono-code uppercase tracking-wider font-bold block mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
              Biochemical Specifications & Confounder Mechanics
            </span>
            <h2 className={`font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              The 10-Parameter Reagent Suite & Physiological Confounders
            </h2>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Grounded in multi-parameter dry chemistry kinetics. Evaluates genuine chronic trends while mathematically filtering transient exercise, dehydration, and diet shifts.
            </p>
          </div>
          <div className={`text-xs font-mono-code px-3.5 py-1.5 rounded-xl border shrink-0 ${isDark ? 'bg-slate-900 border-white/10 text-cyan-300' : 'bg-white border-slate-200 text-teal-800 shadow-xs'}`}>
            Standard Multistix 10SG Reagents
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Biomarker List Selectors (10 Biomarkers) */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-[10px] font-mono-code uppercase text-slate-400 font-bold block mb-2 px-1">
              Select Biomarker from Multistix 10SG Reagent Strip:
            </span>
            {BIOMARKER_DEFINITIONS.map((bio) => {
              const isSelected = selectedBio.id === bio.id;
              return (
                <div
                  key={bio.id}
                  onClick={() => {
                    setSelectedBio(bio);
                    setActiveConfounder('baseline');
                  }}
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all duration-200 flex items-center justify-between ${
                    isSelected
                      ? isDark
                        ? 'bg-gradient-to-r from-amber-400/20 via-slate-900 to-slate-900 border-amber-400/60 shadow-[0_5px_20px_rgba(245,158,11,0.15)] font-bold'
                        : 'bg-amber-50/90 border-amber-500 shadow-sm font-bold ring-1 ring-amber-400/40'
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
                      <h4 className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{bio.name}</h4>
                      <p className={`text-[10px] font-mono-code ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Range: {bio.normalRange} • Unit: {bio.unit}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${
                    isSelected ? (isDark ? 'text-amber-400 translate-x-1' : 'text-amber-700 translate-x-1') : 'text-slate-400'
                  }`} />
                </div>
              );
            })}
          </div>

          {/* Detailed Inspector Panel + Confounder Simulator */}
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
                  Biomarker Telemetry Inspector
                </span>
                <h3 className={`font-cinzel text-2xl font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {selectedBio.name}
                </h3>
              </div>
              <div className="text-right">
                <span className={`text-[10px] font-mono-code block uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Clinical Normal</span>
                <span className={`text-xs font-mono-code font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>{selectedBio.normalRange}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4">
              <h4 className={`text-xs font-mono-code uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Physiological Mechanism & Significance
              </h4>
              <p className={`text-xs leading-relaxed font-light ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {selectedBio.description}
              </p>
            </div>

            {/* Colorimetric Reagent Pad Scale */}
            <div className={`mt-5 p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
              <span className={`text-xs font-mono-code uppercase block mb-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Commercial Colorimetric Pad Spectrum (Multistix 10SG):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {selectedBio.colorScale.map((pad, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className="w-full h-7 rounded-md border shadow-xs"
                      style={{ backgroundColor: pad.color }}
                    ></div>
                    <span className={`text-[10px] font-mono-code mt-1 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {pad.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* =========================================================================
                INTERACTIVE PHYSIOLOGICAL CONFOUNDER SIMULATOR (PDF Section 11 & 12)
            ========================================================================== */}
            <div className={`mt-6 p-5 rounded-xl border ${
              isDark ? 'bg-slate-950/90 border-amber-400/30' : 'bg-amber-50/80 border-amber-300'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono-code uppercase font-bold text-amber-500 flex items-center space-x-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Simulate Real-World Physiological Confounders</span>
                </span>
                <span className="text-[10px] font-mono-code text-slate-400">Biological Variations</span>
              </div>

              {/* Confounder Switcher Pills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {confounders.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveConfounder(c.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-code transition-all ${
                      activeConfounder === c.id
                        ? isDark ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-amber-700 text-white font-bold'
                        : isDark ? 'bg-slate-900 text-slate-400 hover:text-white border border-white/5' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {c.name.split('(')[0]}
                  </button>
                ))}
              </div>

              {/* Confounder Simulation Result Box */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center font-mono-code text-xs">
                <div className="sm:col-span-5 p-3 rounded-lg bg-black/40 border border-white/10">
                  <span className="block text-[9px] uppercase text-slate-400 mb-0.5">Simulated Reading:</span>
                  <strong className="text-amber-400 text-sm">{currentConfounderInfo.impactOnCurrent.readingShift}</strong>
                  <span className={`block text-[10px] mt-1 ${
                    activeConfounder === 'baseline' ? 'text-emerald-400' : 'text-rose-400 font-bold'
                  }`}>
                    Status: {currentConfounderInfo.impactOnCurrent.status}
                  </span>
                </div>

                <div className="sm:col-span-7 text-xs font-sans">
                  <span className="block font-semibold text-amber-500 text-[11px] font-mono-code mb-0.5">
                    Biological Mechanism:
                  </span>
                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {currentConfounderInfo.impactOnCurrent.explanation}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono-code text-slate-400">
                <span>BioTrajectory Defense: Specific Gravity correlation + 48h recovery rule</span>
                <span className="text-emerald-400 font-bold">Prevents False Panic</span>
              </div>
            </div>

            {/* Baseline Strategy & Non-Pathological Confounders Grid */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`text-xs font-mono-code uppercase tracking-wider block mb-1 font-semibold ${
                  isDark ? 'text-emerald-400' : 'text-emerald-800'
                }`}>
                  Baseline Corridor Strategy
                </span>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Requires 10 confirmed sessions before baseline formation. Uses rolling medians to insulate against acute single-day distortion.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-amber-950/20 border-amber-500/25' : 'bg-amber-50 border-amber-200'}`}>
                <span className={`text-xs font-mono-code uppercase tracking-wider block mb-1 font-semibold ${
                  isDark ? 'text-amber-300' : 'text-amber-900'
                }`}>
                  Measurement Confounders
                </span>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-amber-200/90' : 'text-amber-950'}`}>
                  {selectedBio.measurementConfounders || selectedBio.biologicalContext}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className={`mt-5 pt-4 border-t flex items-center justify-between text-xs ${
              isDark ? 'border-white/10 text-slate-400' : 'border-slate-100 text-slate-500'
            }`}>
              <span className={`font-serif-lux italic ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                “A single snapshot is a riddle. A personal trajectory is an actionable story.”
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
