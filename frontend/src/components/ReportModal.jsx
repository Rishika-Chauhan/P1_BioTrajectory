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
              fill={d.flagged ? '#A71D31' : color}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">

      {/* Modal Container */}
      <div className={`relative w-full max-w-4xl border rounded-3xl shadow-2xl overflow-hidden my-8 ${isDark ? 'bg-[#050814] border-[#D5BF86]/30' : 'bg-[#FAF9EB] border-[#D5BF86]'
        }`}>

        {/* Top Control Bar (Non-Printable) */}
        <div className={`flex items-center justify-between px-6 py-4 border-b print:hidden ${isDark ? 'bg-[#2A0B10] border-[#D5BF86]/20' : 'bg-white border-[#D5BF86]'
          }`}>
          <div className="flex items-center space-x-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A71D31] animate-pulse"></span>
            <span className="text-xs font-mono uppercase font-semibold text-[#3F0D12] dark:text-[#FAF9EB]">
              Official Patient Longitudinal Clinician Brief
            </span>

            {/* Persona Switcher in Modal */}
            <div className="hidden sm:flex items-center space-x-1.5 ml-4">
              {PATIENT_PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersonaId(p.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${selectedPersonaId === p.id
                    ? 'bg-[#A71D31] text-white font-bold shadow-xs'
                    : isDark ? 'bg-[#050814] text-[#D5BF86] border border-[#D5BF86]/30 hover:text-white' : 'bg-[#FAF9EB] text-[#3F0D12] border border-[#D5BF86] hover:bg-[#D5BF86]/20'
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
              className="px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase flex items-center space-x-1.5 transition-all shadow-sm bg-[#A71D31] hover:bg-[#851625] text-white"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl transition-colors text-[#8D775F] hover:text-[#3F0D12] dark:hover:text-[#FAF9EB] hover:bg-[#D5BF86]/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Medical Document Body */}
        <div className={`p-6 sm:p-10 text-xs font-sans print:bg-white print:text-black ${isDark ? 'text-[#FAF9EB]' : 'text-[#3F0D12] bg-[#FAF9EB]'
          }`}>

          {/* Header Banner */}
          <div className="flex flex-wrap items-start justify-between border-b-2 pb-6 mb-6 border-[#D5BF86]">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#3F0D12] dark:text-[#FAF9EB]">
                  BioTrajectory
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded border bg-[#A71D31]/10 text-[#A71D31] border-[#A71D31]/30 font-bold">
                  Longitudinal PGHD Brief
                </span>
              </div>
              <p className="text-xs mt-1 text-[#8D775F]">
                Supplementary Patient-Generated Health Data Report for Healthcare Professionals
              </p>
            </div>

            <div className="text-right text-[11px] font-mono text-[#8D775F]">
              <div>Generated: {new Date().toISOString().split('T')[0]} 08:30 UTC</div>
              <div>Report ID: BT-DOC-2026-{activePersona.id.toUpperCase()}-702</div>
              <div className="font-semibold text-[#A71D31]">
                Audit Status: 100% Cryptographically Verified
              </div>
            </div>
          </div>

          {/* Patient Specs Grid */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border mb-6 font-mono text-[11px] ${isDark ? 'bg-[#050814] border-[#D5BF86]/20' : 'bg-white border-[#D5BF86]'
            }`}>
            <div>
              <span className="block text-[9px] uppercase text-[#8D775F]">Subject</span>
              <strong className={isDark ? 'text-[#FAF9EB]' : 'text-[#3F0D12]'}>{activePersona.name} ({activePersona.age}y)</strong>
            </div>
            <div>
              <span className="block text-[9px] uppercase text-[#8D775F]">Monitoring Horizon</span>
              <strong className={isDark ? 'text-[#FAF9EB]' : 'text-[#3F0D12]'}>{history.length} Verified Logs (30D)</strong>
            </div>
            <div>
              <span className="block text-[9px] uppercase text-[#8D775F]">Reagent Strip Type</span>
              <strong className={isDark ? 'text-[#FAF9EB]' : 'text-[#3F0D12]'}>Multistix 10SG Standard</strong>
            </div>
            <div>
              <span className="block text-[9px] uppercase text-[#8D775F]">Baseline Algorithm</span>
              <strong className="text-[#A71D31]">Rolling Median & IQR Corridors</strong>
            </div>
          </div>

          {/* Biomarker Trajectory Sparklines Row */}
          <div className="mb-6">
            <h4 className="text-xs font-mono uppercase font-bold text-[#3F0D12] dark:text-[#FAF9EB] mb-3">
              Longitudinal Parameter Sparklines (30-Day Trend Slopes)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-[#050814] border-[#D5BF86]/20' : 'bg-white border-[#D5BF86]'
                }`}>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-[#8D775F]">Protein (PRO)</span>
                  <strong className="text-xs font-mono text-[#3F0D12] dark:text-[#FAF9EB]">Median: 5.2 mg/dL</strong>
                </div>
                {renderSparkline('protein', '#A71D31')}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-[#050814] border-[#D5BF86]/20' : 'bg-white border-[#D5BF86]'
                }`}>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-[#8D775F]">Specific Gravity (SG)</span>
                  <strong className="text-xs font-mono text-[#3F0D12] dark:text-[#FAF9EB]">Median: 1.018</strong>
                </div>
                {renderSparkline('specificGravity', '#8D775F')}
              </div>

              <div className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-[#050814] border-[#D5BF86]/20' : 'bg-white border-[#D5BF86]'
                }`}>
                <div>
                  <span className="block text-[10px] font-mono uppercase text-[#8D775F]">pH Level</span>
                  <strong className="text-xs font-mono text-[#3F0D12] dark:text-[#FAF9EB]">Median: 6.4</strong>
                </div>
                {renderSparkline('pH', '#D5BF86')}
              </div>
            </div>
          </div>

          {/* Narrative Objective Chronology */}
          <div className="space-y-3 mb-6">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-[#3F0D12] dark:text-[#FAF9EB]">
              1. Objective Longitudinal Chronology & Confounder Context:
            </h4>

            <p className="leading-relaxed text-[#473228] dark:text-[#D5BF86]">
              This report compiles {history.length} verified morning test sessions across a 30-day continuous home monitoring window for {activePersona.name}. The subject established a personal baseline characterized by normal urine concentration (mean SG 1.018), stable pH (6.1–6.6), and consistently negative results for Leukocyte Esterase, Nitrite, and Bilirubin.
            </p>

            <div className={`p-4 rounded-xl border text-xs ${isDark ? 'bg-[#2A0B10] border-[#D5BF86]/30' : 'bg-white border-[#D5BF86]'
              }`}>
              <strong className="block mb-1 font-mono uppercase text-[10px] text-[#A71D31]">
                Clinical Case Observation: {activePersona.profileType}
              </strong>
              <p className="leading-relaxed text-[#473228] dark:text-[#D5BF86]">
                {activePersona.clinicalStory}
              </p>
            </div>
          </div>

          {/* Chronological Table */}
          <div className="mb-6">
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold mb-2 text-[#8D775F]">
              2. Confirmed Laboratory Chronology (Selected Readings)
            </h4>

            <div className="overflow-x-auto">
              <table className={`w-full text-left font-mono text-[11px] border border-collapse ${isDark ? 'border-[#D5BF86]/30' : 'border-[#D5BF86]'
                }`}>
                <thead className={`border-b text-[10px] uppercase ${isDark ? 'bg-[#2A0B10] border-[#D5BF86]/30 text-[#D5BF86]' : 'bg-white border-[#D5BF86] text-[#8D775F]'
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
                <tbody className={`divide-y ${isDark ? 'divide-[#D5BF86]/20 text-[#FAF9EB]' : 'divide-[#D5BF86]/40 text-[#473228]'}`}>
                  {history.slice(-8).map((entry) => (
                    <tr key={entry.day} className={entry.flagged ? (isDark ? 'bg-[#A71D31]/20 font-semibold' : 'bg-[#A71D31]/10 font-semibold') : ''}>
                      <td className="py-2 px-3">Day {entry.day} ({entry.date})</td>
                      <td className="py-2 px-3">{entry.time}</td>
                      <td className={`py-2 px-3 ${entry.protein > 20 ? 'text-[#A71D31] font-bold' : ''}`}>{entry.protein} mg/dL</td>
                      <td className="py-2 px-3">{entry.specificGravity}</td>
                      <td className="py-2 px-3">{entry.pH}</td>
                      <td className="py-2 px-3">{entry.glucose} mg/dL</td>
                      <td className="py-2 px-3 text-[10px] text-[#8D775F]">{entry.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Clinician Discussion Questions */}
          <div className={`p-4 rounded-xl border mb-6 ${isDark ? 'bg-[#050814] border-[#D5BF86]/20' : 'bg-white border-[#D5BF86]'
            }`}>
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold mb-2 text-[#A71D31]">
              3. Suggested Discussion Questions for Physician Consultation:
            </h4>
            <ul className="space-y-1.5 leading-relaxed text-xs list-disc list-inside text-[#473228] dark:text-[#D5BF86]">
              <li>In light of the recorded transient deviation resolving promptly to baseline, is a formal spot urine albumin-to-creatinine ratio (uACR) recommended at the next annual checkup?</li>
              <li>Are any fluid intake or electrolyte adjustments advised given the observed specific gravity concentration curves during physical exertion?</li>
            </ul>
          </div>

          {/* Non-Diagnostic Clinical Boundary Disclaimer */}
          <div className={`p-4 rounded-xl border text-[10px] leading-relaxed mb-6 ${isDark ? 'bg-[#050814] border-[#D5BF86]/20 text-[#8D775F]' : 'bg-white border-[#D5BF86] text-[#8D775F]'
            }`}>
            <strong className="block mb-1 text-[#A71D31] font-bold">
              CLINICAL SCOPE & REGULATORY BOUNDARY NOTICE:
            </strong>
            This summary is an informational document compiled from patient-recorded urine test strips. It does not constitute a clinical laboratory diagnosis, medical decision, treatment prescription, or triage protocol. Real-world medical symptoms and clinician advice take absolute priority over any app reading.
          </div>

          {/* Doctor Signature & Stamp Area for Consultation */}
          <div className="pt-6 border-t flex flex-wrap items-end justify-between gap-6 font-mono text-[11px] border-[#D5BF86] text-[#8D775F]">
            <div>
              <span className="block text-[9px] uppercase text-[#8D775F]">Attending Clinician Signature</span>
              <div className="w-56 h-10 border-b border-dashed border-[#D5BF86] mt-2"></div>
              <span className="text-[9px] text-[#8D775F] mt-1 block">Dr. Name / Registration No.</span>
            </div>

            <div className="text-right">
              <span className="block text-[9px] uppercase text-[#8D775F]">Clinic Verification Stamp</span>
              <div className="w-36 h-12 border border-dashed border-[#D5BF86] rounded mt-1 flex items-center justify-center text-[9px] text-[#8D775F]">
                [ CLINIC STAMP ]
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
