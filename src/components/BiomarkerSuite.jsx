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
      className={`relative py-20 border-t transition-colors ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/20' : 'bg-[#F1F0CC] border-[#D5BF86]/40'
        }`}
      id="biomarkers"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Biomarker Reagent Panel Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-5 border-b border-[#D5BF86]/40">
          <div className="max-w-2xl">
            <span className="text-[11px] font-sans uppercase tracking-wider font-bold block mb-1 text-[#A71D31] dark:text-[#D5BF86]">
              Biochemical Specifications & Confounder Mechanics
            </span>
            <h2 className={`font-sans text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-[#FAF9EB]' : 'text-[#3F0D12]'}`}>
              The 10-Parameter Reagent Suite & Physiological Confounders
            </h2>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-[#D5BF86]' : 'text-[#473228]'}`}>
              Grounded in multi-parameter dry chemistry kinetics. Evaluates genuine chronic trends while mathematically filtering transient exercise, dehydration, and diet shifts.
            </p>
          </div>
          <div className={`text-xs font-sans px-3 py-1.5 rounded-lg border shrink-0 ${isDark ? 'bg-[#2B0B0E] border-[#D5BF86]/20 text-[#D5BF86]' : 'bg-[#FAF9EB] border-[#D5BF86] text-[#A71D31] shadow-xs'}`}>
            Standard Multistix 10SG Reagents
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* Biomarker List Selectors (10 Biomarkers) */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-[11px] font-sans uppercase text-[#8D775F] dark:text-[#D5BF86] font-bold block mb-2 px-1">
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
                  className={`p-3.5 rounded-xl cursor-pointer border transition-all duration-200 flex items-center justify-between ${isSelected
                      ? 'bg-[#A71D31]/15 border-[#A71D31] shadow-xs font-bold text-[#3F0D12] dark:text-[#FAF9EB]'
                      : isDark
                        ? 'bg-[#2B0B0E]/80 border-[#D5BF86]/20 hover:border-[#D5BF86]/50 text-[#FAF9EB]'
                        : 'bg-white border-[#D5BF86]/70 hover:border-[#D5BF86] text-[#3F0D12] shadow-xs'
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${isSelected
                          ? 'bg-[#A71D31] shadow-xs'
                          : isDark ? 'bg-[#D5BF86]/40' : 'bg-[#D5BF86]'
                        }`}
                    ></div>
                    <div>
                      <h4 className={`text-xs font-semibold ${isDark ? 'text-[#FAF9EB]' : 'text-[#3F0D12]'}`}>{bio.name}</h4>
                      <p className="text-[10px] font-sans text-[#8D775F] dark:text-[#D5BF86]">
                        Range: {bio.normalRange} • Unit: {bio.unit}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-[#A71D31] translate-x-1' : 'text-[#8D775F]'
                    }`} />
                </div>
              );
            })}
          </div>

          {/* Detailed Inspector Panel + Confounder Simulator */}
          <div className={`lg:col-span-7 rounded-xl border p-6 shadow-xs relative overflow-hidden ${isDark ? 'bg-[#2B0B0E] border-[#D5BF86]/20' : 'bg-white border-[#D5BF86]/70'
            }`}>
            <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D5BF86]/30`}>
              <div>
                <span className="text-[10px] font-sans uppercase tracking-wider font-bold text-[#A71D31] dark:text-[#D5BF86]">
                  Biomarker Telemetry Inspector
                </span>
                <h3 className={`font-sans text-xl font-bold mt-0.5 ${isDark ? 'text-[#FAF9EB]' : 'text-[#3F0D12]'}`}>
                  {selectedBio.name}
                </h3>
              </div>
              <div className="text-right font-sans">
                <span className="text-[10px] block uppercase text-[#8D775F]">Clinical Normal</span>
                <span className="text-xs font-bold text-[#A71D31]">{selectedBio.normalRange}</span>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 font-sans">
              <h4 className="text-[11px] uppercase tracking-wider mb-1 font-bold text-[#8D775F]">
                Physiological Mechanism & Significance
              </h4>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-[#E8E5BA]' : 'text-[#473228]'}`}>
                {selectedBio.description}
              </p>
            </div>

            {/* Colorimetric Reagent Pad Scale */}
            <div className={`mt-4 p-4 rounded-lg border ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/20' : 'bg-[#FAF9EB] border-[#D5BF86]/60'}`}>
              <span className="text-[11px] font-sans uppercase font-bold block mb-2 text-[#8D775F]">
                Commercial Colorimetric Pad Spectrum (Multistix 10SG):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {selectedBio.colorScale.map((pad, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div
                      className="w-full h-6 rounded border border-black/10 shadow-xs"
                      style={{ backgroundColor: pad.color }}
                    ></div>
                    <span className="text-[10px] font-sans mt-1 font-medium text-[#8D775F]">
                      {pad.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* =========================================================================
                INTERACTIVE PHYSIOLOGICAL CONFOUNDER SIMULATOR (PDF Section 11 & 12)
            ========================================================================== */}
            <div className={`mt-5 p-4 rounded-lg border ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/20' : 'bg-[#FAF9EB]/60 border-[#D5BF86]/60'
              }`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-sans uppercase font-bold text-[#A71D31] dark:text-[#D5BF86] flex items-center space-x-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Simulate Real-World Physiological Confounders</span>
                </span>
                <span className="text-[10px] font-sans text-[#8D775F]">Biological Variations</span>
              </div>

              {/* Confounder Switcher Pills */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {confounders.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveConfounder(c.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-sans transition-all cursor-pointer ${activeConfounder === c.id
                        ? 'bg-[#A71D31] text-white font-bold shadow-xs'
                        : isDark ? 'bg-[#1D070A] text-[#D5BF86] hover:text-white border border-[#D5BF86]/30' : 'bg-white text-[#473228] border border-[#D5BF86]'
                      }`}
                  >
                    {c.name.split('(')[0]}
                  </button>
                ))}
              </div>

              {/* Confounder Simulation Result Box */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center font-sans text-xs">
                <div className="sm:col-span-5 p-3 rounded-lg bg-black/20 border border-[#D5BF86]/30">
                  <span className="block text-[10px] uppercase text-[#8D775F] mb-0.5">Simulated Reading:</span>
                  <strong className="text-[#A71D31] text-sm">{currentConfounderInfo.impactOnCurrent.readingShift}</strong>
                  <span className="block text-[10px] mt-1 text-[#3F0D12] dark:text-[#D5BF86] font-semibold">
                    {currentConfounderInfo.impactOnCurrent.status}
                  </span>
                </div>
                <div className="sm:col-span-7">
                  <p className={`text-[11px] leading-relaxed ${isDark ? 'text-[#E8E5BA]' : 'text-[#473228]'}`}>
                    {currentConfounderInfo.impactOnCurrent.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Baseline Strategy & Non-Pathological Confounders Grid */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/20' : 'bg-[#FAF9EB] border-[#D5BF86]/60'}`}>
                <span className={`text-xs font-mono-code uppercase tracking-wider block mb-1 font-semibold text-[#A71D31]`}>
                  Baseline Corridor Strategy
                </span>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-[#E8E5BA]' : 'text-[#473228]'}`}>
                  Requires 10 confirmed sessions before baseline formation. Uses rolling medians to insulate against acute single-day distortion.
                </p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/20' : 'bg-[#FAF9EB] border-[#D5BF86]/60'}`}>
                <span className={`text-xs font-mono-code uppercase tracking-wider block mb-1 font-semibold text-[#8D775F] dark:text-[#D5BF86]`}>
                  Measurement Confounders
                </span>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-[#E8E5BA]' : 'text-[#473228]'}`}>
                  {selectedBio.measurementConfounders || selectedBio.biologicalContext}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className={`mt-5 pt-4 border-t flex items-center justify-between text-xs border-[#D5BF86]/30`}>
              <span className={`font-serif-lux italic ${isDark ? 'text-[#D5BF86]' : 'text-[#473228]'}`}>
                “A single snapshot is a riddle. A personal trajectory is an actionable story.”
              </span>
              <span className={`text-[11px] font-mono-code font-semibold text-[#A71D31]`}>
                100% Non-Diagnostic
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
