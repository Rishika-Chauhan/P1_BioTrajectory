import React from 'react';
import { X, Printer } from 'lucide-react';
import { SAMPLE_30_DAY_HISTORY } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function ReportModal({ isOpen, onClose }) {
  const { isDark } = useTheme();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-fadeIn">
      
      {/* Modal Card */}
      <div className={`relative w-full max-w-4xl border rounded-2xl shadow-2xl overflow-hidden my-8 ${
        isDark ? 'bg-[#090e18] border-amber-400/30' : 'bg-white border-amber-300 shadow-[0_20px_60px_rgba(0,0,0,0.15)]'
      }`}>
        
        {/* Top Control Bar */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'bg-slate-900/90 border-white/10' : 'bg-[#fcfaf7] border-slate-200'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className={`text-xs font-mono-code uppercase font-semibold ${
              isDark ? 'text-amber-300' : 'text-amber-800'
            }`}>
              Official Patient Longitudinal Clinician Brief
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.print()}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono-code uppercase flex items-center space-x-1.5 transition-all shadow-sm ${
                isDark ? 'bg-amber-400 hover:bg-amber-300 text-slate-950' : 'bg-amber-600 hover:bg-amber-700 text-white'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print to PDF</span>
            </button>
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className={`p-6 sm:p-10 text-xs font-sans print:bg-white print:text-black ${
          isDark ? 'text-slate-200' : 'text-slate-800 bg-white'
        }`}>
          
          {/* Document Header */}
          <div className={`flex flex-wrap items-start justify-between border-b-2 pb-6 mb-6 ${
            isDark ? 'border-amber-400/30' : 'border-amber-500/40'
          }`}>
            <div>
              <div className="flex items-center space-x-2">
                <span className={`font-cinzel text-2xl font-bold tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  BioTrajectory
                </span>
                <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded border ${
                  isDark ? 'bg-amber-400/10 text-amber-300 border-amber-400/25' : 'bg-amber-100 text-amber-900 border-amber-300'
                }`}>
                  Longitudinal PGHD
                </span>
              </div>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Supplementary Patient-Generated Health Data Report
              </p>
            </div>

            <div className={`text-right text-[11px] font-mono-code ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              <div>Generated: 2026-11-03 07:45 UTC</div>
              <div>Report ID: BT-DOC-2026-9428-A</div>
              <div className={`font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                Audit Status: Cryptographically Confirmed
              </div>
            </div>
          </div>

          {/* Patient & Device Spec Metadata */}
          <div className={`grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border mb-6 font-mono-code text-[11px] ${
            isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <span className="block text-[9px] uppercase text-slate-400">Subject ID</span>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>BT-9428-ANON</strong>
            </div>
            <div>
              <span className="block text-[9px] uppercase text-slate-400">Monitoring Window</span>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>30 Days (15 Logs)</strong>
            </div>
            <div>
              <span className="block text-[9px] uppercase text-slate-400">Commercial Reagent Strip</span>
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>Multistix 10SG Lot#702</strong>
            </div>
            <div>
              <span className="block text-[9px] uppercase text-slate-400">Baseline Model</span>
              <strong className={isDark ? 'text-emerald-400' : 'text-emerald-700'}>10-Point Rolling Median</strong>
            </div>
          </div>

          {/* Clinical Synthesis Narrative */}
          <div className="space-y-4 mb-6">
            <h4 className={`text-xs font-mono-code uppercase tracking-wider font-bold ${
              isDark ? 'text-amber-300' : 'text-amber-800'
            }`}>
              1. Objective Longitudinal Chronology:
            </h4>
            
            <p className={`leading-relaxed font-light ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              This report compiles 15 verified morning urine test events recorded across a 30-day period. The subject established an individualized baseline characterized by normal urine concentration (mean Specific Gravity 1.018), normal pH (6.1–6.6), and consistently negative results for Glucose, Leukocyte Esterase, and Nitrite.
            </p>

            <div className={`p-4 rounded-xl border text-xs ${
              isDark ? 'bg-amber-950/20 border-amber-500/25' : 'bg-amber-50 border-amber-200'
            }`}>
              <strong className={`block mb-1 font-mono-code uppercase text-[10px] ${
                isDark ? 'text-amber-300' : 'text-amber-900'
              }`}>
                Noted Deviation: Day 22 (2026-10-26)
              </strong>
              <p className={`leading-relaxed ${isDark ? 'text-amber-200/90' : 'text-amber-950'}`}>
                An isolated spike in urinary Protein (32 mg/dL, 1+) occurred alongside elevated Specific Gravity (1.028) and trace Ketones (10 mg/dL). User recorded vigorous resistance cross-training 12 hours prior with reduced fluid intake. Subsequent readings on Day 24 (18 mg/dL) and Day 26 (8 mg/dL) demonstrated full spontaneous resolution to baseline without medication.
              </p>
            </div>
          </div>

          {/* Detailed Measurement Log Table */}
          <div className="mb-6">
            <h4 className={`text-xs font-mono-code uppercase tracking-wider font-bold mb-2 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
              2. Confirmed Laboratory Chronology (Selected Readings)
            </h4>

            <div className="overflow-x-auto">
              <table className={`w-full text-left font-mono-code text-[11px] border border-collapse ${
                isDark ? 'border-white/10' : 'border-slate-200'
              }`}>
                <thead className={`border-b text-[10px] uppercase ${
                  isDark ? 'bg-slate-900 border-white/10 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Timing</th>
                    <th className="py-2 px-3">Protein</th>
                    <th className="py-2 px-3">Spec. Gravity</th>
                    <th className="py-2 px-3">pH</th>
                    <th className="py-2 px-3">Ketones</th>
                    <th className="py-2 px-3">Confounders / Notes</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-white/5 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                  {SAMPLE_30_DAY_HISTORY.slice(-7).map((entry) => (
                    <tr key={entry.day} className={entry.flagged ? (isDark ? 'bg-amber-500/10' : 'bg-amber-50 font-semibold') : ''}>
                      <td className="py-2 px-3">{entry.date} (D{entry.day})</td>
                      <td className="py-2 px-3">{entry.time}</td>
                      <td className={`py-2 px-3 ${entry.flagged ? 'text-rose-600 font-bold' : ''}`}>{entry.protein} mg/dL</td>
                      <td className="py-2 px-3">{entry.specificGravity}</td>
                      <td className="py-2 px-3">{entry.pH}</td>
                      <td className="py-2 px-3">{entry.ketones} mg/dL</td>
                      <td className="py-2 px-3 text-[10px] text-slate-500">{entry.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Suggested Physician Discussion Points */}
          <div className={`p-4 rounded-xl border mb-6 ${
            isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
          }`}>
            <h4 className={`text-xs font-mono-code uppercase tracking-wider font-bold mb-2 ${
              isDark ? 'text-cyan-300' : 'text-sky-800'
            }`}>
              3. Suggested Discussion Questions for Physician:
            </h4>
            <ul className={`space-y-1.5 leading-relaxed text-xs ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <li>• In light of the transient Day 22 proteinuria resolving to baseline, is a spot urine albumin-to-creatinine ratio (uACR) recommended at the next annual checkup?</li>
              <li>• Are any modifications recommended regarding post-workout hydration targets given the specific gravity elevation?</li>
            </ul>
          </div>

          {/* Non-Diagnostic Boundary */}
          <div className={`p-4 rounded-xl border text-[10px] leading-relaxed ${
            isDark ? 'bg-slate-950 border-amber-400/20 text-slate-400' : 'bg-amber-50/70 border-amber-200 text-slate-600'
          }`}>
            <strong className={`block mb-1 ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>
              CLINICAL NOTICE & SCOPE LIMITATION:
            </strong>
            This summary is an informational document compiled from patient-recorded test strips. It does not constitute a clinical laboratory diagnosis, medical decision, or physician consultation. Symptoms always supersede app measurements.
          </div>

        </div>

      </div>
    </div>
  );
}
