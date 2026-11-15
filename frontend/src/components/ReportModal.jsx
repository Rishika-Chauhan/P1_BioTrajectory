import React from 'react';
import { X, ShieldCheck } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function ReportModal({ isOpen, onClose }) {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md">
      <div className={`relative w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden my-8 ${isDark ? 'bg-[#050814] border-[#D5BF86]/30' : 'bg-[#FAF9EB] border-[#D5BF86]'}`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'bg-[#2A0B10] border-[#D5BF86]/20' : 'bg-white border-[#D5BF86]'}`}>
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-5 h-5 text-[#A71D31]" />
            <span className="text-xs font-mono uppercase font-semibold text-[#3F0D12] dark:text-[#FAF9EB]">
              Clinical summary unavailable
            </span>
          </div>

          <button onClick={onClose} className="p-2 rounded-xl transition-colors text-[#8D775F] hover:text-[#3F0D12] dark:hover:text-[#FAF9EB] hover:bg-[#D5BF86]/20">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`p-6 sm:p-8 text-xs font-sans ${isDark ? 'text-[#FAF9EB]' : 'text-[#3F0D12] bg-[#FAF9EB]'}`}>
          <h2 className="text-2xl font-bold">No patient report is available yet.</h2>
          <p className="mt-4 leading-6 text-sm text-[#8D775F] dark:text-[#FAF9EB]/80">
            This report view is intentionally blank until a verified Firestore-backed clinical workflow and authorized doctor record are available.
          </p>
        </div>
      </div>
    </div>
  );
}

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
