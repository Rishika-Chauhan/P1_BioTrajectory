import React, { useState } from 'react';
import { ShieldAlert, Lock, AlertOctagon, HeartHandshake } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ClinicalSafety() {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('principles'); // 'principles', 'matrix', 'privacy'

  const riskTable = [
    {
      risk: 'Incorrect camera reading',
      why: 'Could create misleading trends and unnecessary anxiety',
      mitigation: 'Controlled capture guide, lux thresholds, white calibration matrix, and mandatory manual user confirmation before saving.'
    },
    {
      risk: 'False reassurance or alarm',
      why: 'May delay necessary medical care or create acute anxiety',
      mitigation: 'Cautious non-diagnostic language, clinical expert review of thresholds, and explicit "symptoms-first" priority guidance.'
    },
    {
      risk: 'Insufficient history',
      why: 'Baseline formed on 1–2 readings would be statistically noisy',
      mitigation: 'System enforces minimum 10-reading threshold and displays baseline confidence index; refuses confident flags prematurely.'
    },
    {
      risk: 'Biological variability',
      why: 'Readings change naturally for benign non-disease reasons (exercise, dehydration)',
      mitigation: 'Contextual capture of timing, exercise, and fluid notes; longitudinal multi-day persistence checks before raising attention.'
    },
    {
      risk: 'AI hallucination',
      why: 'Language models might invent unsupported diagnostic conclusions',
      mitigation: 'Gemini is fed only confirmed structured tables; strict system prompts prohibit diagnosis, treatment plans, or emergency triage.'
    },
    {
      risk: 'Privacy breach',
      why: 'Biochemical urine data is deeply sensitive health telemetry',
      mitigation: 'Data minimization, AES-256 local encrypted profile, zero health data monetization, and one-click data purge.'
    }
  ];

  return (
    <section className={`relative py-24 transition-colors ${
      isDark ? 'bg-[#05070c]' : 'bg-[#fbfaf8]'
    }`} id="clinical-rigor">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-xs font-mono-code uppercase tracking-wider mb-4 ${
            isDark ? 'bg-rose-500/10 border-rose-500/25 text-rose-300' : 'bg-rose-50 border-rose-300 text-rose-900 shadow-sm'
          }`}>
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
            <span>Section 12, 13 & 17 • Clinical Safety & Ethics</span>
          </div>

          <h2 className={`font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Safety by Architecture
          </h2>
          <p className={`mt-4 text-base sm:text-lg font-light leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Healthcare technology demands uncompromising rigor. BioTrajectory enforces strict boundaries: never diagnosing, never replacing clinicians, and never compromising user privacy.
          </p>

          {/* Tab buttons */}
          <div className={`mt-8 inline-flex p-1 rounded-xl border shadow-sm ${
            isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'
          }`}>
            <button
              onClick={() => setActiveTab('principles')}
              className={`px-5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'principles'
                  ? isDark
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-amber-600 text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Core Principles
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'matrix'
                  ? isDark
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-amber-600 text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Risk & Mitigation Matrix
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`px-5 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all ${
                activeTab === 'privacy'
                  ? isDark
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'bg-amber-600 text-white shadow-sm'
                  : isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Privacy & Ethics Charter
            </button>
          </div>
        </div>

        {/* Tab 1: Core Principles */}
        {activeTab === 'principles' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Principle 1 */}
            <div className={`p-6 rounded-2xl border shadow-lg flex flex-col justify-between ${
              isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
            }`}>
              <div>
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-5 ${
                  isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-rose-50 border-rose-300 text-rose-600'
                }`}>
                  <AlertOctagon className="w-5 h-5" />
                </div>
                <h3 className={`font-cinzel text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Symptoms Always Overrule Dashboards
                </h3>
                <p className={`text-xs leading-relaxed font-light ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Users should never delay seeking medical care because an app shows no alert. Acute symptoms require clinical evaluation regardless of urine test numbers.
                </p>
              </div>
              <div className={`mt-6 pt-4 border-t text-[11px] font-mono-code ${
                isDark ? 'border-white/5 text-rose-300' : 'border-slate-100 text-rose-700 font-semibold'
              }`}>
                Non-diagnostic by strict design
              </div>
            </div>

            {/* Principle 2 */}
            <div className={`p-6 rounded-2xl border shadow-lg flex flex-col justify-between relative overflow-hidden ${
              isDark ? 'bg-[#090e18] border-amber-400/30' : 'bg-white border-amber-300'
            }`}>
              <div>
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-5 ${
                  isDark ? 'bg-amber-400/10 border-amber-400/30 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-700'
                }`}>
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h3 className={`font-cinzel text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  No Misleading Composite Scores
                </h3>
                <p className={`text-xs leading-relaxed font-light ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Unlike consumer wellness gadgets, BioTrajectory explicitly <strong className={isDark ? 'text-amber-200' : 'text-amber-800'}>refuses to combine unrelated biomarkers into a single red/green wellness score</strong>. Each parameter reflects independent physiology.
                </p>
              </div>
              <div className={`mt-6 pt-4 border-t text-[11px] font-mono-code ${
                isDark ? 'border-white/5 text-amber-300' : 'border-slate-100 text-amber-800 font-semibold'
              }`}>
                Section 8 & 11 Explicit Rule
              </div>
            </div>

            {/* Principle 3 */}
            <div className={`p-6 rounded-2xl border shadow-lg flex flex-col justify-between ${
              isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
            }`}>
              <div>
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-5 ${
                  isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-600'
                }`}>
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className={`font-cinzel text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Doctor in the Loop
                </h3>
                <p className={`text-xs leading-relaxed font-light ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  The software generates objective longitudinal timelines and concise talking points. Medical diagnoses, treatment plans, and drug prescriptions remain strictly with qualified clinicians.
                </p>
              </div>
              <div className={`mt-6 pt-4 border-t text-[11px] font-mono-code ${
                isDark ? 'border-white/5 text-emerald-400' : 'border-slate-100 text-emerald-700 font-semibold'
              }`}>
                Clinician-supervised paradigm
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Risk & Mitigation Table */}
        {activeTab === 'matrix' && (
          <div className={`rounded-2xl border p-6 sm:p-8 shadow-xl overflow-x-auto ${
            isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
          }`}>
            <h3 className={`text-sm font-semibold mb-4 flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span className={`font-mono-code uppercase font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                Section 17: Official Risks & Mitigation Table
              </span>
            </h3>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b text-[10px] font-mono-code uppercase ${
                  isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
                }`}>
                  <th className="py-3 px-4 w-1/4">Identified Risk</th>
                  <th className="py-3 px-4 w-1/3">Clinical Impact</th>
                  <th className="py-3 px-4">BioTrajectory Architectural Mitigation</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-white/5 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                {riskTable.map((row, idx) => (
                  <tr key={idx} className={isDark ? 'hover:bg-slate-800/30' : 'hover:bg-slate-50'}>
                    <td className={`py-3 px-4 font-semibold font-mono-code text-[11px] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {row.risk}
                    </td>
                    <td className="py-3 px-4 font-light">
                      {row.why}
                    </td>
                    <td className={`py-3 px-4 font-light ${isDark ? 'text-emerald-300/90' : 'text-emerald-800 font-medium'}`}>
                      {row.mitigation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Privacy & Ethics Charter */}
        {activeTab === 'privacy' && (
          <div className={`rounded-2xl border p-8 shadow-xl max-w-4xl mx-auto space-y-6 ${
            isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
          }`}>
            <div className={`flex items-center space-x-3 pb-4 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
              <Lock className={`w-5 h-5 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
              <div>
                <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Responsible AI & Health Data Charter
                </h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Strict adherence to Section 13 Privacy Guidelines</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`font-semibold block mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Data Minimization</span>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>We store only calibrated numerical parameters, timestamps, and voluntary lifestyle tags. Raw urine strip photos are processed locally and discarded immediately.</p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`font-semibold block mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>No Data Monetization</span>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Identifiable biological health records will never be rented, sold, or shared with advertising networks or data brokers under any circumstances.</p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`font-semibold block mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Informed, Granular Consent</span>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Sharing with healthcare providers occurs strictly through intentional, cryptographic patient authorization. The user retains complete ownership.</p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`font-semibold block mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>Right to Complete Erasure</span>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>A single tap in the Privacy Center instantly deletes all stored local and cloud baseline records with cryptographically verified deletion.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
