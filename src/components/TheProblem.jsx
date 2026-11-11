import React, { useState } from 'react';
import {
  Calendar,
  FileSpreadsheet,
  HelpCircle,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { PDF_PROBLEM_SECTION } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function TheProblem() {
  const { isDark } = useTheme();

  // Interactive Snapshot Day Slider (Day 1 to Day 30)
  const [sliderDay, setSliderDay] = useState(22);
  const [problemTab, setProblemTab] = useState('paradigm'); // 'paradigm', 'epidemiology'

  // Simulated data for each key milestone day
  const milestoneData = {
    7: {
      protein: 5,
      sg: 1.020,
      notes: '14h overnight intermittent fast',
      snapshotDiagnosis: 'Normal snapshot, but reveals nothing about personal trends or future direction.',
      trajectoryInterpretation: 'Day 7 of baseline calibration. Homeostasis stable; personal corridor forming smoothly.'
    },
    15: {
      protein: 4,
      sg: 1.018,
      notes: '10-reading baseline confirmed',
      snapshotDiagnosis: 'Isolated number. Clinician cannot tell if 4 mg/dL is standard or recovering from an earlier issue.',
      trajectoryInterpretation: 'Personal 10-reading baseline officially active at 5.2 ± 1.1 mg/dL. Ready to detect meaningful deviations.'
    },
    22: {
      protein: 32,
      sg: 1.028,
      notes: 'Post intense half-marathon workout + heat dehydration',
      snapshotDiagnosis: 'ALARM! "Trace/1+ Proteinuria". Panic ensues; patient fears glomerulonephritis or kidney failure; unnecessary emergency lab panels booked.',
      trajectoryInterpretation: 'System recognizes a transient spike. High SG (1.028) indicates concentrated urine. Triggers review without alarm; watches for recovery.'
    },
    26: {
      protein: 8,
      sg: 1.019,
      notes: 'Post-workout recovery & rehydration',
      snapshotDiagnosis: 'Another random point. Was the previous 32 a laboratory glitch? Or is this 8 still pathological?',
      trajectoryInterpretation: 'Confirms spontaneous normalization back toward the 5.2 mg/dL corridor. Clinician reassured: zero acute pathology.'
    },
    30: {
      protein: 5,
      sg: 1.017,
      notes: 'Stable morning routine',
      snapshotDiagnosis: 'Normal snapshot. The entire multi-week story was completely missed by the traditional annual test.',
      trajectoryInterpretation: 'Full 30-day baseline integrity maintained. Rich, consented clinical chronology ready for doctor review.'
    }
  };

  const currentMilestone = milestoneData[sliderDay] || milestoneData[22];

  // SVG dimensions for the mini comparison trajectory
  const miniChartWidth = 500;
  const miniChartHeight = 160;
  const padding = { top: 20, right: 25, bottom: 25, left: 35 };

  const sampleDays = [1, 5, 11, 15, 19, 22, 24, 26, 30];
  const sampleValues = [5, 4, 6, 4, 7, 32, 18, 8, 5];

  const getMiniX = (i) => padding.left + (i / (sampleDays.length - 1)) * (miniChartWidth - padding.left - padding.right);
  const getMiniY = (val) => miniChartHeight - padding.bottom - ((val - 0) / 38) * (miniChartHeight - padding.top - padding.bottom);

  return (
    <section
      className={`relative py-20 transition-colors ${isDark ? 'bg-[#070b14]' : 'bg-[#faf8ff]'
        }`}
      id="problem"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Clinical Problem & Paradigm Shift */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-5 border-b border-inherit">
          <div className="max-w-2xl">
            <span className={`text-[11px] font-sans uppercase tracking-wider font-bold block mb-1 text-[#00685f] dark:text-[#6bd8cb]`}>
              Diagnostic Latency & Clinical Continuity
            </span>
            <h2 className={`font-sans text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
              The Point-in-Time Diagnostic Blindspot
            </h2>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Isolated annual urinalysis detects acute crises but misses insidious chronic trajectories. BioTrajectory captures the slope before irreversible tissue remodeling occurs.
            </p>
          </div>

          {/* Sub-view Switcher */}
          <div className={`inline-flex p-1 rounded-lg border self-start md:self-auto shrink-0 ${isDark ? 'bg-[#0d1526] border-slate-800' : 'bg-white border-slate-200'
            }`}>
            <button
              onClick={() => setProblemTab('paradigm')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${problemTab === 'paradigm'
                ? 'bg-[#00685f] text-white font-bold shadow-xs'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Interactive Simulator
            </button>
            <button
              onClick={() => setProblemTab('epidemiology')}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase tracking-wider transition-all ${problemTab === 'epidemiology'
                ? 'bg-[#00685f] text-white font-bold shadow-xs'
                : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Epidemiological Model
            </button>
          </div>
        </div>

        {/* 3 Core Problem Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {PDF_PROBLEM_SECTION.issues.map((issue, idx) => {
            const icons = [Calendar, FileSpreadsheet, HelpCircle];
            const Icon = icons[idx] || Calendar;
            return (
              <div
                key={issue.id}
                className={`relative rounded-xl p-6 border transition-all duration-300 group flex flex-col justify-between ${isDark
                  ? 'bg-[#0d1526] border-slate-800 hover:border-[#00685f]/50'
                  : 'bg-white border-[#e2e8f0] hover:border-[#00685f]/40 shadow-xs'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${isDark
                      ? 'bg-slate-900 border-slate-800 text-[#6bd8cb]'
                      : 'bg-[#00685f]/10 border-[#00685f]/20 text-[#00685f]'
                      }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-sans font-bold text-slate-400`}>
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className={`font-sans text-base font-bold mb-1.5 ${isDark ? 'text-white' : 'text-[#131b2e]'
                    }`}>
                    {issue.title}
                  </h3>

                  <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                    {issue.description}
                  </p>
                </div>

                <div className={`pt-3 border-t text-xs font-sans flex items-center space-x-1.5 ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-[#00687a]'
                  }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00685f]"></span>
                  <span className="italic">“{issue.badScenario}”</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* =========================================================================
            VIEW 1: INTERACTIVE PARADIGM SIMULATOR (SLIDER & DUAL-CARD VIEW)
        ========================================================================== */}
        {problemTab === 'paradigm' && (
          <div className={`rounded-xl border p-6 sm:p-8 shadow-xs transition-all ${isDark ? 'bg-[#0d1526] border-slate-800' : 'bg-white border-[#e2e8f0]'
            }`}>
            <div className={`flex flex-wrap items-center justify-between gap-4 pb-5 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div>
                <span className="text-[11px] font-sans uppercase font-bold text-[#00685f] dark:text-[#6bd8cb]">
                  Live Interactive Comparison
                </span>
                <h3 className={`text-xl font-bold font-sans mt-1 ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
                  The Isolated Snapshot Trap vs. Longitudinal Reality
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Drag the timeline slider below to test how standard episodic medicine misinterprets biological signals without historical baseline.
                </p>
              </div>

              {/* Slider Controller */}
              <div className="flex items-center space-x-2 text-xs font-sans">
                <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Test Day:</span>
                <div className="flex items-center space-x-1">
                  {[7, 15, 22, 26, 30].map((d) => (
                    <button
                      key={d}
                      onClick={() => setSliderDay(d)}
                      className={`px-3 py-1.5 rounded-md text-xs font-sans transition-all ${sliderDay === d
                        ? 'bg-[#00685f] text-white font-bold shadow-xs'
                        : isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      Day {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Side-by-Side Comparison Grid */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">

              {/* Left: The Flawed Snapshot Approach */}
              <div className={`p-5 rounded-xl border flex flex-col justify-between ${isDark ? 'bg-rose-950/20 border-rose-500/30' : 'bg-rose-50/70 border-rose-200'
                }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-sans font-bold uppercase bg-rose-500/20 text-rose-500 border border-rose-500/30">
                      Standard Practice: Isolated Snapshot
                    </span>
                    <span className="text-xs font-sans text-rose-400">Day {sliderDay} Reading</span>
                  </div>

                  <div className="my-3 p-4 rounded-lg bg-black/20 border border-rose-500/20 text-center">
                    <span className="text-xs font-sans uppercase text-slate-400 block mb-1">Measured Protein Concentration</span>
                    <div className="text-3xl font-extrabold font-sans text-rose-500">
                      {currentMilestone.protein} mg/dL
                    </div>
                    <span className="text-[11px] font-sans text-slate-400 mt-1 block">
                      Spec. Gravity: {currentMilestone.sg} • Notes: None available in siloed records
                    </span>
                  </div>

                  <h4 className="text-sm font-sans font-bold text-rose-900 dark:text-rose-200 mb-1">
                    Clinical Outcome:
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-rose-200/90' : 'text-rose-950'}`}>
                    {currentMilestone.snapshotDiagnosis}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-rose-500/20 flex items-center space-x-2 text-xs font-sans text-rose-400">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>Cost: Patient anxiety, misdiagnosis risk, unnecessary emergency labs.</span>
                </div>
              </div>

              {/* Right: The BioTrajectory Personal Longitudinal View */}
              <div className={`p-5 rounded-xl border flex flex-col justify-between ${isDark ? 'bg-[#006947]/10 border-[#006947]/30' : 'bg-[#006947]/5 border-[#006947]/20'
                }`}>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-sans font-bold uppercase bg-[#006947]/20 text-[#006947] dark:text-[#6ffbbe] border border-[#006947]/30">
                      BioTrajectory: Longitudinal History
                    </span>
                    <span className="text-xs font-sans text-[#006947] dark:text-[#6ffbbe]">10-Point Rolling Baseline</span>
                  </div>

                  {/* Embedded Mini Trajectory Chart */}
                  <div className="my-2 p-3 rounded-lg bg-black/20 border border-[#006947]/20 overflow-x-auto">
                    <svg viewBox={`0 0 ${miniChartWidth} ${miniChartHeight}`} className="w-full h-auto min-w-[380px]">
                      {/* Baseline Corridor Band */}
                      <rect
                        x={padding.left}
                        y={getMiniY(15)}
                        width={miniChartWidth - padding.left - padding.right}
                        height={getMiniY(0) - getMiniY(15)}
                        fill="rgba(0, 105, 71, 0.15)"
                        stroke="rgba(0, 105, 71, 0.4)"
                        strokeDasharray="3 3"
                      />
                      <text x={miniChartWidth - padding.right - 5} y={getMiniY(15) + 12} textAnchor="end" className="text-[9px] font-sans fill-[#006947] dark:fill-[#6ffbbe]">
                        Baseline Band (0–15 mg/dL)
                      </text>

                      {/* Trajectory Line */}
                      <polyline
                        fill="none"
                        stroke="#006947"
                        strokeWidth="2.5"
                        points={sampleDays.map((d, i) => `${getMiniX(i)},${getMiniY(sampleValues[i])}`).join(' ')}
                      />

                      {/* Points */}
                      {sampleDays.map((d, i) => {
                        const isCurrent = d === sliderDay;
                        return (
                          <g key={d}>
                            <circle
                              cx={getMiniX(i)}
                              cy={getMiniY(sampleValues[i])}
                              r={isCurrent ? 6 : 3.5}
                              fill={sampleValues[i] > 20 ? '#ba1a1a' : '#006947'}
                              stroke={isCurrent ? '#ffffff' : '#000000'}
                              strokeWidth={isCurrent ? 2 : 1}
                            />
                            <text
                              x={getMiniX(i)}
                              y={miniChartHeight - padding.bottom + 14}
                              textAnchor="middle"
                              className={`text-[8px] font-sans ${isCurrent ? 'fill-white font-bold' : 'fill-slate-500'}`}
                            >
                              D{d}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  <h4 className="text-sm font-sans font-bold text-[#006947] dark:text-[#6ffbbe] mt-2 mb-1">
                    Longitudinal Clarity:
                  </h4>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {currentMilestone.trajectoryInterpretation}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-[#006947]/20 flex items-center space-x-2 text-xs font-sans text-[#006947] dark:text-[#6ffbbe]">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Context: {currentMilestone.notes}</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: EPIDEMIOLOGICAL SILENT PROGRESSION VISUALIZATION
        ========================================================================== */}
        {problemTab === 'epidemiology' && (
          <div className={`rounded-xl border p-6 sm:p-8 shadow-xs transition-all ${isDark ? 'bg-[#0d1526] border-slate-800' : 'bg-white border-[#e2e8f0]'
            }`}>
            <div className="max-w-3xl mb-6">
              <span className="text-[11px] font-sans uppercase font-bold text-[#00685f] dark:text-[#6bd8cb]">
                Epidemiological Context
              </span>
              <h3 className={`text-xl font-bold font-sans mt-1 ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
                The Silent Progression Curve of Chronic Illness
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Chronic Kidney Disease (CKD) and diabetes develop over years with zero perceptible symptoms during the reversible early stages.
              </p>
            </div>

            {/* Stages Progression Visual Chart */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 mb-6">
              {[
                { stage: 'Stage 1', gfr: 'eGFR >90', status: 'Silent', reversible: true, desc: 'Kidney damage with normal function. Trace microprotein in urine.' },
                { stage: 'Stage 2', gfr: 'eGFR 60–89', status: 'Silent', reversible: true, desc: 'Mild loss of kidney function. Still completely asymptomatic.' },
                { stage: 'Stage 3', gfr: 'eGFR 30–59', status: 'Silent', reversible: true, desc: 'Moderate kidney loss. 9 in 10 still unaware without testing.' },
                { stage: 'Stage 4', gfr: 'eGFR 15–29', status: 'Symptomatic', reversible: false, desc: 'Severe reduction. Fatigue, fluid retention, nausea appear.' },
                { stage: 'Stage 5', gfr: 'eGFR <15', status: 'End-Stage', reversible: false, desc: 'Kidney failure. Requires permanent dialysis or renal transplant.' },
              ].map((s) => (
                <div
                  key={s.stage}
                  className={`p-3.5 rounded-lg border flex flex-col justify-between ${s.reversible
                    ? 'bg-[#006947]/5 border-[#006947]/20 dark:bg-[#006947]/15 dark:border-[#006947]/30'
                    : 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/30'
                    }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-xs font-sans">{s.stage}</span>
                      <span className={`text-[10px] font-sans px-2 py-0.2 rounded font-semibold ${s.reversible ? 'bg-[#006947]/15 text-[#006947] dark:text-[#6ffbbe]' : 'bg-rose-500/15 text-rose-500'
                        }`}>
                        {s.status}
                      </span>
                    </div>
                    <span className="text-[10px] font-sans block text-slate-400 mb-1">{s.gfr}</span>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {s.desc}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-inherit text-[10px] font-sans font-semibold">
                    {s.reversible ? (
                      <span className="text-[#006947] dark:text-[#6ffbbe]">✓ Reversible Window</span>
                    ) : (
                      <span className="text-rose-500">⚠️ Irreversible Damage</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Core Stats Box */}
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <div className="flex items-start space-x-3.5">
                <div className="text-3xl font-extrabold font-sans text-[#f59e0b]">9 in 10</div>
                <div>
                  <h5 className={`text-xs sm:text-sm font-bold font-sans ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
                    Adults with CKD do not know they have it
                  </h5>
                  <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Because early filtration decline produces zero pain or symptoms, point-in-time snapshot care fails to intervene before Stage 4.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5">
                <div className="text-3xl font-extrabold font-sans text-[#006947] dark:text-[#6ffbbe]">136M</div>
                <div>
                  <h5 className={`text-xs sm:text-sm font-bold font-sans ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
                    Indians live with prediabetes
                  </h5>
                  <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Representing a critical 3-to-5 year window where longitudinal tracking of micro-glucose and hydration can prevent progression to type-2 diabetes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
