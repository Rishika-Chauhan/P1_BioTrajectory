import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  AlertOctagon,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  FileCheck,
  UserX,
  Stethoscope,
  Terminal,
  HeartHandshake,
  ChevronRight
} from 'lucide-react';
import { CLINICAL_RISK_MATRIX } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function ClinicalSafety() {
  const { isDark } = useTheme();

  // Active Tab: 'risks', 'validation', 'privacy'
  const [activeTab, setActiveTab] = useState('risks');

  // Active Risk in the Interactive Simulator
  const [selectedRiskId, setSelectedRiskId] = useState(CLINICAL_RISK_MATRIX[0].id);
  const [activeSimulationOutput, setActiveSimulationOutput] = useState(null);

  const activeRisk = CLINICAL_RISK_MATRIX.find((r) => r.id === selectedRiskId) || CLINICAL_RISK_MATRIX[0];

  // Trigger interactive risk simulation
  const handleSimulateRisk = (risk) => {
    setActiveSimulationOutput({
      title: risk.simulationTitle,
      behavior: risk.simulatedBehavior,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  const validationPathwaySteps = [
    { step: '01', title: 'Commercial Test Selection', desc: 'Select one specific, commercially available 10-parameter reagent strip (Multistix 10SG standard) with defined intended use.' },
    { step: '02', title: 'Trained Human & Lab Reference', desc: 'Compare smartphone optical camera estimations against trained human clinical laboratory spectrophotometric readings under a documented protocol.' },
    { step: '03', title: 'Hardware & Environmental Permutations', desc: 'Test across 20+ entry-level and flagship smartphone cameras, lighting variances (150–800 Lux), angles (±15°), and timing conditions (45s–90s).' },
    { step: '04', title: 'Error Rate & Rejection Metrics', desc: 'Quantify inter-device agreement, optical repeatability, invalid-image rejection rates, and user correction frequencies.' },
    { step: '05', title: 'Clinician Threshold Review', desc: 'Have multidisciplinary nephrologists and general physicians review the trend rules, alert wording, and escalation logic.' },
    { step: '06', title: 'Prospective Clinical Study', desc: 'Conduct an observational study with ethics approval (IRB) and informed patient consent if real human subjects are enrolled.' },
    { step: '07', title: 'Regulatory Oversight & Clearance', desc: 'Obtain medical device regulatory advice (CDSCO / FDA / CE) before making diagnostic claims or offering automated clinical triage.' },
  ];

  return (
    <section
      className={`relative py-24 transition-colors ${isDark ? 'bg-[#05070c]' : 'bg-[#fbfaf8]'
        }`}
      id="clinical-rigor"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-xs font-mono-code uppercase tracking-wider mb-4 ${isDark ? 'bg-rose-500/10 border-rose-500/25 text-rose-300' : 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm'
            }`}>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>Blueprint Section 12, 13 & 17 • Clinical Safety</span>
          </div>

          <h2 className={`font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'
            }`}>
            Safety by Architecture
          </h2>

          <p className={`mt-4 text-base sm:text-lg font-light leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
            Healthcare technology demands uncompromising rigor. BioTrajectory enforces strict clinical boundaries: never diagnosing, never replacing clinicians, and prioritizing symptoms above all app charts.
          </p>

          {/* Golden Safety Priority Banner from PDF Section 12 */}
          <div className={`mt-6 p-4 rounded-2xl border text-xs max-w-2xl mx-auto flex items-start space-x-3 text-left ${isDark ? 'bg-rose-950/20 border-rose-500/40 text-rose-200' : 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm'
            }`}>
            <AlertOctagon className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold uppercase tracking-wide block mb-0.5">
                Golden Clinical Safety Rule (PDF Section 12):
              </strong>
              <span>
                “Users must never delay medical care because an app shows no alert. Real-world symptoms and clinician advice take absolute priority over the dashboard.”
              </span>
            </div>
          </div>

          {/* Tab buttons */}
          <div className={`mt-8 inline-flex p-1.5 rounded-2xl border shadow-sm ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
            }`}>
            {[
              { id: 'risks', label: '1. Risk & Mitigation Sandbox', icon: ShieldAlert },
              { id: 'validation', label: '2. 7-Step Validation Pathway', icon: FileCheck },
              { id: 'privacy', label: '3. Privacy & Responsible AI', icon: Lock },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${isActive
                      ? isDark
                        ? 'bg-amber-400 text-slate-950 font-bold shadow-md'
                        : 'bg-amber-600 text-white font-bold shadow-sm'
                      : isDark
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            TAB 1: INTERACTIVE RISK & MITIGATION SANDBOX (PDF Section 17)
        ========================================================================== */}
        {activeTab === 'risks' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left 5 Cols: 7 Risks Selector */}
            <div className={`lg:col-span-5 rounded-2xl border p-6 shadow-xl ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
              }`}>
              <span className={`text-xs font-mono-code uppercase font-bold text-amber-500 block mb-3`}>
                Select Clinical Risk from Section 17 Table:
              </span>

              <div className="space-y-2.5">
                {CLINICAL_RISK_MATRIX.map((risk, idx) => {
                  const isSelected = selectedRiskId === risk.id;
                  return (
                    <button
                      key={risk.id}
                      onClick={() => {
                        setSelectedRiskId(risk.id);
                        setActiveSimulationOutput(null);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex items-center justify-between ${isSelected
                          ? isDark
                            ? 'bg-amber-400/20 border-amber-400/60 text-white font-bold shadow-sm'
                            : 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs'
                          : isDark
                            ? 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-white hover:bg-slate-800/40'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className={`text-[10px] font-mono-code w-5 h-5 rounded flex items-center justify-center ${isSelected
                            ? isDark ? 'bg-amber-400 text-slate-950' : 'bg-amber-600 text-white'
                            : 'bg-black/20 text-slate-400'
                          }`}>
                          0{idx + 1}
                        </span>
                        <span>{risk.risk}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-500' : 'text-slate-500'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 7 Cols: Detailed Mitigation & Interactive Simulation Case */}
            <div className={`lg:col-span-7 rounded-2xl border p-6 sm:p-8 shadow-xl ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
              }`}>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono-code uppercase text-amber-500 font-bold block">
                    Risk Assessment & Architectural Defense
                  </span>
                  <h3 className={`text-xl font-bold font-cinzel mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {activeRisk.risk}
                  </h3>
                </div>

                <button
                  onClick={() => handleSimulateRisk(activeRisk)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono-code uppercase font-bold flex items-center space-x-1.5 transition-all shadow-md ${isDark ? 'bg-rose-500 hover:bg-rose-400 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'
                    }`}
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Test Defense Trigger</span>
                </button>
              </div>

              <div className="mt-5 space-y-4">
                <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <strong className="text-xs font-mono-code uppercase text-rose-400 block mb-1">
                    Why It Matters Clinically:
                  </strong>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {activeRisk.why}
                  </p>
                </div>

                <div className={`p-4 rounded-xl border ${isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-300'
                  }`}>
                  <strong className="text-xs font-mono-code uppercase text-emerald-400 block mb-1">
                    Built-In Mitigation Mechanism:
                  </strong>
                  <p className={`text-xs leading-relaxed ${isDark ? 'text-emerald-200/90' : 'text-emerald-950'}`}>
                    {activeRisk.mitigation}
                  </p>
                </div>

                {/* Simulated Failure Defense Output Box */}
                {activeSimulationOutput ? (
                  <div className="p-4 rounded-xl bg-slate-950 border border-amber-400/50 animate-fadeIn">
                    <div className="flex items-center justify-between text-xs font-mono-code text-amber-400 mb-2">
                      <span className="flex items-center space-x-1.5">
                        <Terminal className="w-4 h-4" />
                        <span>Defensive Guardrail Triggered ({activeSimulationOutput.timestamp})</span>
                      </span>
                      <span className="text-[10px] text-emerald-400">STATUS: SAFE</span>
                    </div>

                    <div className="p-3 rounded-lg bg-black/60 border border-white/10 text-xs font-mono-code text-slate-200 leading-relaxed">
                      {activeSimulationOutput.behavior}
                    </div>
                  </div>
                ) : (
                  <div className={`p-6 rounded-xl border border-dashed text-center text-xs ${isDark ? 'border-white/10 text-slate-500' : 'border-slate-300 text-slate-400'
                    }`}>
                    Click <strong>“Test Defense Trigger”</strong> above to simulate this failure scenario and observe the app's real-time safety response.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: 7-STEP CLINICAL VALIDATION PATHWAY (PDF Section 12)
        ========================================================================== */}
        {activeTab === 'validation' && (
          <div className={`rounded-3xl border p-6 sm:p-10 shadow-2xl ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
            }`}>
            <div className="max-w-3xl mb-8">
              <span className={`text-xs font-mono-code uppercase font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                Section 12: Rigorous Validation Pathway
              </span>
              <h3 className={`text-2xl font-bold font-cinzel mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                From Software Prototype to Regulatory Evidence
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Clinical validation follows an uncompromising 7-step sequence before real patient data collection or diagnostic claims can be legally made.
              </p>
            </div>

            <div className="space-y-4">
              {validationPathwaySteps.map((st, i) => (
                <div
                  key={st.step}
                  className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${isDark ? 'bg-slate-950/80 border-white/5 hover:border-amber-400/30' : 'bg-slate-50 border-slate-200 hover:border-amber-400 shadow-xs'
                    }`}
                >
                  <div className="flex items-start space-x-3.5">
                    <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-500 font-mono-code text-xs font-bold flex items-center justify-center shrink-0">
                      {st.step}
                    </span>
                    <div>
                      <h4 className={`text-sm font-bold font-cinzel ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {st.title}
                      </h4>
                      <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {st.desc}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono-code px-2.5 py-1 rounded border uppercase shrink-0 ${i < 2
                      ? isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                      : isDark ? 'bg-slate-900 text-slate-400 border-white/5' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                    {i < 2 ? 'Active Protocol' : 'Roadmap Phase'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: PRIVACY, DATA MINIMIZATION & ETHICAL AI (PDF Section 13)
        ========================================================================== */}
        {activeTab === 'privacy' && (
          <div className={`rounded-3xl border p-6 sm:p-10 shadow-2xl ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
            }`}>
            <div className="max-w-3xl mb-8">
              <span className={`text-xs font-mono-code uppercase font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                Section 13: Privacy & Responsible AI
              </span>
              <h3 className={`text-2xl font-bold font-cinzel mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Zero Health Data Monetization
              </h3>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Urine chemistry is deeply sensitive biological telemetry. BioTrajectory operates under a strict non-commercialization privacy pledge.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className={`text-sm font-bold font-cinzel mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Data Minimization & Purge
                </h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Raw smartphone strip photos are discarded immediately after optical pad segmentation. Users have permanent one-click deletion of their telemetry vault.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
                  <UserX className="w-5 h-5" />
                </div>
                <h4 className={`text-sm font-bold font-cinzel mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Purpose Limitation
                </h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Biochemical readings will NEVER be repackaged, monetized, sold to insurance providers, or used for behavioral profiling or advertising.
                </p>
              </div>

              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-3">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className={`text-sm font-bold font-cinzel mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Consent-Driven Sharing
                </h4>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Clinician reports are generated strictly on-demand when the patient explicitly requests an export, sealed with cryptographic audit timestamps.
                </p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
