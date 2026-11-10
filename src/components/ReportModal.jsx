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
        <polyline fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" points={points} />
        {history.map((d, i) => {
          const x = (i / (history.length - 1)) * (width - 10) + 5;
          const y = height - 5 - (((d[dataKey] ?? 0) - min) / range) * (height - 10);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={d.flagged ? 3.5 : 1.5}
              fill={d.flagged ? '#f59e0b' : color}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">

      {/* Modal Container */}
      <div className={`relative w-full max-w-4xl border rounded-3xl shadow-2xl overflow-hidden my-8 ${isDark ? 'bg-[#0d1526] border-slate-800' : 'bg-white border-slate-200'
        }`}>

        {/* Top Control Bar (Non-Printable) */}
        <div className={`flex items-center justify-between px-6 py-4 border-b print:hidden ${isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-[#faf8ff] border-slate-200'
          }`}>
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#006947] animate-pulse"></span>
            <span className="text-xs font-mono uppercase font-semibold text-[#00685f] dark:text-[#6bd8cb]">
              Official Patient Longitudinal Clinician Brief
            </span>

            {/* Persona Switcher in Modal */}
            <div className="hidden sm:flex items-center space-x-1.5 ml-4">
              {PATIENT_PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersonaId(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${selectedPersonaId === p.id
                      ? 'bg-[#00685f] text-white font-bold shadow-xs'
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
              className="px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase flex items-center space-x-1.5 transition-all shadow-sm bg-[#00685f] hover:bg-[#008378] text-white"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-colors text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Medical Document Body */}
        <div className={`p-6 sm:p-10 text-xs font-sans print:bg-white print:text-black ${isDark ? 'text-slate-200' : 'text-slate-800 bg-white'
          }`}>

          {/* Header Banner */}
          <div className="flex flex-wrap items-start justify-between border-b-2 pb-6 mb-6 border-[#00685f]/30">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  BioTrajectory
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-[#00685f]/10 text-[#00685f] dark:text-[#6bd8cb] border-[#00685f]/25 font-bold">
                  Longitudinal PGHD Brief
                </span>
              </div>
              <p className="text-xs mt-1 text-slate-500">
                Supplementary Patient-Generated Health Data Report for Healthcare Professionals
              </p>
            </div>

            <div className="text-right text-[11px] font-mono text-slate-500">
              <div>Generated: {new Date().toISOString().split('T')[0]} 08:30 UTC</div>
              <div>Report ID: BT-DOC-2026-{activePersona.id.toUpperCase()}-702</div>
              <div className="font-semibold text-[#006947] dark:text-[#6ffbbe]">
                Audit Status: 100% Cryptographically Verified
              </div>
            </div>
          </div>

          {/* Patient Specs Grid */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border mb-6 font-mono text-[11px] ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
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
              <strong className="text-[#006947] dark:text-[#6ffbbe]">Rolling Median & IQR Corridors</strong>
            </div>
          </div>

          {/* Biomarker Trajectory Sparklines Row */}
          <div className="mb-6">
            <h4 className="text-xs font-mono uppercase font-bold text-[#00685f] dark:text-[#6bd8cb] mb-3">
              Longitudinal Parameter Sparklines (30-Day Trend Slopes)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-slate-400">Protein (PRO)</span>
                  <strong className="text-xs font-mono text-slate-800 dark:text-slate-200">Median: 5.2 mg/dL</strong>
                </div>
                {renderSparkline('protein', '#00685f')}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-slate-400">Specific Gravity (SG)</span>
                  <strong className="text-xs font-mono text-slate-800 dark:text-slate-200">Median: 1.018</strong>
                </div>
                {renderSparkline('specificGravity', '#00687a')}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-slate-400">pH Level</span>
                  <strong className="text-xs font-mono text-slate-800 dark:text-slate-200">Median: 6.4</strong>
                </div>
                {renderSparkline('pH', '#006947')}
              </div>
            </div>
          </div>

          {/* Narrative Objective Chronology */}
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#00685f] dark:text-[#6bd8cb]">
              1. Objective Longitudinal Chronology & Confounder Context:
            </h4>

            <p className="leading-relaxed text-slate-600 dark:text-slate-300">
              This report compiles {history.length} verified morning test sessions across a 30-day continuous home monitoring window for {activePersona.name}. The subject established a personal baseline characterized by normal urine concentration (mean SG 1.018), stable pH (6.1–6.6), and consistently negative results for Leukocyte Esterase, Nitrite, and Bilirubin.
            </p>

            <div className={`p-4 rounded-xl border text-xs ${isDark ? 'bg-[#00685f]/10 border-[#00685f]/20' : 'bg-[#00685f]/5 border-[#00685f]/15'
              }`}>
              <strong className="block mb-1 font-mono uppercase text-[10px] text-[#00685f] dark:text-[#6bd8cb]">
                Clinical Case Observation: {activePersona.profileType}
              </strong>
              <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                {activePersona.clinicalStory}
              </p>
            </div>
          </div>

          {/* Chronological Table */}
          <div className="mb-6">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold mb-2 text-slate-500">
              2. Confirmed Laboratory Chronology (Selected Readings)
            </h4>

            <div className="overflow-x-auto">
              <table className={`w-full text-left font-mono text-[11px] border border-collapse ${isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                <thead className={`border-b text-[10px] uppercase ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
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
                <tbody className={`divide-y ${isDark ? 'divide-slate-850 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                  {history.slice(-8).map((entry) => (
                    <tr key={entry.day} className={entry.flagged ? (isDark ? 'bg-[#f59e0b]/10' : 'bg-amber-50 font-semibold') : ''}>
                      <td className="py-2 px-3">Day {entry.day} ({entry.date})</td>
                      <td className="py-2 px-3">{entry.time}</td>
                      <td className={`py-2 px-3 ${entry.protein > 20 ? 'text-[#f59e0b] font-bold' : ''}`}>{entry.protein} mg/dL</td>
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
          <div className={`p-4 rounded-xl border mb-6 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold mb-2 text-[#00687a] dark:text-[#57dffe]">
              3. Suggested Discussion Questions for Physician Consultation:
            </h4>
            <ul className="space-y-1.5 leading-relaxed text-xs list-disc list-inside text-slate-600 dark:text-slate-300">
              <li>In light of the recorded transient deviation resolving promptly to baseline, is a formal spot urine albumin-to-creatinine ratio (uACR) recommended at the next annual checkup?</li>
              <li>Are any fluid intake or electrolyte adjustments advised given the observed specific gravity concentration curves during physical exertion?</li>
            </ul>
          </div>

          {/* Non-Diagnostic Clinical Boundary Disclaimer */}
          <div className={`p-4 rounded-xl border text-[10px] leading-relaxed mb-6 ${isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
            <strong className="block mb-1 text-[#00685f] dark:text-[#6bd8cb] font-bold">
              CLINICAL SCOPE & REGULATORY BOUNDARY NOTICE:
            </strong>
            This summary is an informational document compiled from patient-recorded urine test strips. It does not constitute a clinical laboratory diagnosis, medical decision, treatment prescription, or triage protocol. Real-world medical symptoms and clinician advice take absolute priority over any app reading.
          </div>

          {/* Doctor Signature & Stamp Area for Consultation */}
          <div className="pt-6 border-t flex flex-wrap items-end justify-between gap-6 font-mono text-[11px] border-slate-200 dark:border-slate-800 text-slate-500">
            <div>
              <span className="block text-[9px] uppercase text-slate-400">Attending Clinician Signature</span>
              <div className="w-56 h-10 border-b border-dashed border-slate-400 mt-2"></div>
              <span className="text-[9px] text-slate-500 mt-1 block">Dr. Name / Registration No.</span>
            </div>

            <div className="text-right">
              <span className="block text-[9px] uppercase text-slate-400">Clinic Verification Stamp</span>
              <div className="w-36 h-12 border border-dashed border-slate-400 rounded mt-1 flex items-center justify-center text-[9px] text-slate-500">
                [ CLINIC STAMP ]
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
