import React, { useState } from 'react';
import { X, Printer, CheckCircle2, Shield, QrCode, FileText, Activity } from 'lucide-react';
import { PATIENT_PERSONAS, BIOMARKER_DEFINITIONS } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function ReportModal({ isOpen, onClose }) {
  const { isDark } = useTheme();
  const [selectedPersonaId, setSelectedPersonaId] = useState('arjun');

  if (!isOpen) return null;

  const activePersona = PATIENT_PERSONAS.find((p) => p.id === selectedPersonaId) || PATIENT_PERSONAS[0];
  const history = activePersona.history;

  // Mini sparkline SVG generator
  const renderSparkline = (dataKey, color, height = 35, width = 140) => {
    const vals = history.map((d) => d[dataKey] ?? 0);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    const range = max - min || 1;

    const points = history.map((d, i) => {
      const x = (i / (history.length - 1)) * (width - 10) + 5;
      const y = height - 5 - (((d[dataKey] ?? 0) - min) / range) * (height - 10);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="inline-block overflow-visible">
        <polyline fill="none" stroke={color} strokeWidth="2" points={points} />
        {history.map((d, i) => {
          const x = (i / (history.length - 1)) * (width - 10) + 5;
          const y = height - 5 - (((d[dataKey] ?? 0) - min) / range) * (height - 10);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={d.flagged ? 3 : 1.5}
              fill={d.flagged ? '#ef4444' : color}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">

      {/* Modal Container */}
      <div className={`relative w-full max-w-4xl border rounded-3xl shadow-2xl overflow-hidden my-8 ${isDark ? 'bg-[#090e18] border-amber-400/30' : 'bg-white border-amber-300'
        }`}>

        {/* Top Control Bar (Non-Printable) */}
        <div className={`flex items-center justify-between px-6 py-4 border-b print:hidden ${isDark ? 'bg-slate-900/90 border-white/10' : 'bg-[#fcfaf7] border-slate-200'
          }`}>
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className={`text-xs font-mono-code uppercase font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'
              }`}>
              Official Patient Longitudinal Clinician Brief
            </span>

            {/* Persona Switcher in Modal */}
            <div className="hidden sm:flex items-center space-x-1.5 ml-4">
              {PATIENT_PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersonaId(p.id)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono-code transition-all ${selectedPersonaId === p.id
                      ? isDark ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-amber-700 text-white font-bold'
                      : isDark ? 'bg-slate-800 text-slate-300 hover:text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-code uppercase flex items-center space-x-1.5 transition-all shadow-md ${isDark ? 'bg-amber-400 hover:bg-amber-300 text-slate-950' : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Medical Document Body */}
        <div className={`p-6 sm:p-10 text-xs font-sans print:bg-white print:text-black ${isDark ? 'text-slate-200' : 'text-slate-800 bg-white'
          }`}>

          {/* Header Banner */}
          <div className={`flex flex-wrap items-start justify-between border-b-2 pb-6 mb-6 ${isDark ? 'border-amber-400/40' : 'border-amber-600/40'
            }`}>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`font-cinzel text-2xl sm:text-3xl font-extrabold tracking-wider ${isDark ? 'text-white' : 'text-slate-900'
                  }`}>
                  BioTrajectory
                </span>
                <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded border ${isDark ? 'bg-amber-400/10 text-amber-300 border-amber-400/25' : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                  Longitudinal PGHD Brief
                </span>
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Supplementary Patient-Generated Health Data Report for Healthcare Professionals
              </p>
            </div>

            <div className={`text-right text-[11px] font-mono-code ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <div>Generated: {new Date().toISOString().split('T')[0]} 08:30 UTC</div>
              <div>Report ID: BT-DOC-2026-{activePersona.id.toUpperCase()}-702</div>
              <div className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                Audit Status: 100% Cryptographically Verified
              </div>
            </div>
          </div>

          {/* Patient Specs Grid */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border mb-6 font-mono-code text-[11px] ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
            <div>
              <span className="block text-[9px] uppercase text-slate-400">Subject</span>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activePersona.name} ({activePersona.age}y)</strong>
            </div>
            <div>
              <span className="block text-[9px] uppercase text-slate-400">Monitoring Horizon</span>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>{history.length} Verified Logs (30D)</strong>
            </div>
            <div>
              <span className="block text-[9px] uppercase text-slate-400">Reagent Strip Type</span>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>Multistix 10SG Standard</strong>
            </div>
            <div>
              <span className="block text-[9px] uppercase text-slate-400">Baseline Algorithm</span>
              <strong className={isDark ? 'text-emerald-400' : 'text-emerald-700'}>Rolling Median & IQR Corridors</strong>
            </div>
          </div>

          {/* Biomarker Trajectory Sparklines Row */}
          <div className="mb-6">
            <h4 className="text-xs font-mono-code uppercase font-bold text-amber-500 mb-3">
              Longitudinal Parameter Sparklines (30-Day Trend Slopes)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-slate-950 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                <div>
                  <span className="block text-[10px] font-mono-code uppercase text-slate-400">Protein (PRO)</span>
                  <strong className="text-xs font-mono-code">Median: 5.2 mg/dL</strong>
                </div>
                {renderSparkline('protein', '#f59e0b')}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-slate-950 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                <div>
                  <span className="block text-[10px] font-mono-code uppercase text-slate-400">Specific Gravity (SG)</span>
                  <strong className="text-xs font-mono-code">Median: 1.018</strong>
                </div>
                {renderSparkline('specificGravity', '#38bdf8')}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-slate-950 border-white/10' : 'bg-slate-50 border-slate-200'
                }`}>
                <div>
                  <span className="block text-[10px] font-mono-code uppercase text-slate-400">pH Level</span>
                  <strong className="text-xs font-mono-code">Median: 6.4</strong>
                </div>
                {renderSparkline('pH', '#10b981')}
              </div>
            </div>
          </div>

          {/* Narrative Objective Chronology */}
          <div className="space-y-3 mb-6">
            <h4 className={`text-xs font-mono-code uppercase tracking-wider font-bold ${isDark ? 'text-amber-300' : 'text-amber-800'
              }`}>
              1. Objective Longitudinal Chronology & Confounder Context:
            </h4>

            <p className={`leading-relaxed font-light ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              This report compiles {history.length} verified morning test sessions across a 30-day continuous home monitoring window for {activePersona.name}. The subject established a personal baseline characterized by normal urine concentration (mean SG 1.018), stable pH (6.1–6.6), and consistently negative results for Leukocyte Esterase, Nitrite, and Bilirubin.
            </p>

            <div className={`p-4 rounded-xl border text-xs ${isDark ? 'bg-amber-950/20 border-amber-500/25' : 'bg-amber-50 border-amber-200'
              }`}>
              <strong className={`block mb-1 font-mono-code uppercase text-[10px] ${isDark ? 'text-amber-300' : 'text-amber-900'
                }`}>
                Clinical Case Observation: {activePersona.profileType}
              </strong>
              <p className={`leading-relaxed ${isDark ? 'text-amber-200/90' : 'text-amber-950'}`}>
                {activePersona.clinicalStory}
              </p>
            </div>
          </div>

          {/* Chronological Table */}
          <div className="mb-6">
            <h4 className={`text-xs font-mono-code uppercase tracking-wider font-bold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
              2. Confirmed Laboratory Chronology (Selected Readings)
            </h4>

            <div className="overflow-x-auto">
              <table className={`w-full text-left font-mono-code text-[11px] border border-collapse ${isDark ? 'border-white/10' : 'border-slate-200'
                }`}>
                <thead className={`border-b text-[10px] uppercase ${isDark ? 'bg-slate-900 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                  <tr>
                    <th className="py-2 px-3">Session</th>
                    <th className="py-2 px-3">Timing</th>
                    <th className="py-2 px-3">Protein</th>
                    <th className="py-2 px-3">Spec. Gravity</th>
                    <th className="py-2 px-3">pH</th>
                    <th className="py-2 px-3">Glucose</th>
                    <th className="py-2 px-3">Confounders / Notes</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-white/5 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                  {history.slice(-8).map((entry) => (
                    <tr key={entry.day} className={entry.flagged ? (isDark ? 'bg-rose-950/20' : 'bg-rose-50 font-semibold') : ''}>
                      <td className="py-2 px-3">Day {entry.day} ({entry.date})</td>
                      <td className="py-2 px-3">{entry.time}</td>
                      <td className={`py-2 px-3 ${entry.protein > 20 ? 'text-rose-500 font-bold' : ''}`}>{entry.protein} mg/dL</td>
                      <td className="py-2 px-3">{entry.specificGravity}</td>
                      <td className="py-2 px-3">{entry.pH}</td>
                      <td className="py-2 px-3">{entry.glucose} mg/dL</td>
                      <td className="py-2 px-3 text-[10px] text-slate-500">{entry.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinician Discussion Questions */}
          <div className={`p-4 rounded-xl border mb-6 ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
            <h4 className={`text-xs font-mono-code uppercase tracking-wider font-bold mb-2 ${isDark ? 'text-cyan-300' : 'text-sky-800'
              }`}>
              3. Suggested Discussion Questions for Physician Consultation:
            </h4>
            <ul className={`space-y-1.5 leading-relaxed text-xs list-disc list-inside ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <li>In light of the recorded transient deviation resolving promptly to baseline, is a formal spot urine albumin-to-creatinine ratio (uACR) recommended at the next annual checkup?</li>
              <li>Are any fluid intake or electrolyte adjustments advised given the observed specific gravity concentration curves during physical exertion?</li>
            </ul>
          </div>

          {/* Non-Diagnostic Clinical Boundary Disclaimer */}
          <div className={`p-4 rounded-xl border text-[10px] leading-relaxed mb-6 ${isDark ? 'bg-slate-950 border-amber-400/20 text-slate-400' : 'bg-amber-50/70 border-amber-200 text-slate-600'
            }`}>
            <strong className={`block mb-1 ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
              CLINICAL SCOPE & REGULATORY BOUNDARY NOTICE:
            </strong>
            This summary is an informational document compiled from patient-recorded urine test strips. It does not constitute a clinical laboratory diagnosis, medical decision, treatment prescription, or triage protocol. Real-world medical symptoms and clinician advice take absolute priority over any app reading.
          </div>

          {/* Doctor Signature & Stamp Area for Consultation */}
          <div className={`pt-6 border-t flex flex-wrap items-end justify-between gap-6 font-mono-code text-[11px] ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-600'
            }`}>
            <div>
              <span className="block text-[9px] uppercase text-slate-400">Attending Clinician Signature</span>
              <div className="w-56 h-10 border-b border-dashed border-slate-500 mt-2"></div>
              <span className="text-[9px] text-slate-500 mt-1 block">Dr. Name / Registration No.</span>
            </div>

            <div className="text-right">
              <span className="block text-[9px] uppercase text-slate-400">Clinic Verification Stamp</span>
              <div className="w-36 h-12 border border-dashed border-slate-500 rounded mt-1 flex items-center justify-center text-[9px] text-slate-500">
                [ CLINIC STAMP ]
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
