import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Lock, AlertCircle } from 'lucide-react';
import { trajectoryStorage } from '../services/trajectoryStorage.js';
import { useTheme } from '../context/ThemeContext';

export default function ConsentModal({ isOpen, onClose }) {
  const { isDark } = useTheme();
  const [agreedScope, setAgreedScope] = useState(true);
  const [agreedLocal, setAgreedLocal] = useState(true);
  const [agreedClinician, setAgreedClinician] = useState(true);

  if (!isOpen) return null;

  const handleConfirm = () => {
    trajectoryStorage.setUserConsent({
      agreedToNonDiagnosticScope: agreedScope,
      allowLocalLogging: agreedLocal,
      agreedToClinicianVoluntaryShare: agreedClinician
    });
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-lg border rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 ${isDark ? 'bg-[#18100A] border-[#E5DACB]/30 text-[#FAF6EE]' : 'bg-[#FAF6EE] border-[#E5DACB] text-[#3D291A]'
        }`}>

        {/* Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-[#E5DACB]">
          <div className="w-10 h-10 rounded-xl bg-[#A9D6F5]/15 text-[#A9D6F5] border border-[#A9D6F5]/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest font-bold text-[#A9D6F5]">
              Patient Governance & Informed Consent
            </span>
            <h3 className="text-lg font-bold text-[#3D291A] dark:text-[#FAF6EE]">
              Welcome to BioTrajectory
            </h3>
          </div>
        </div>

        {/* Core Principles */}
        <p className="text-xs leading-relaxed text-[#553C2A] dark:text-[#E5DACB]">
          BioTrajectory is a preventive health platform designed to help you build a personal biological baseline from repeated measurements over time. Before you log your first session, please confirm your understanding of our non-diagnostic clinical boundaries:
        </p>

        <div className="space-y-3 text-xs">
          <label className={`p-3 rounded-xl border flex items-start space-x-3 cursor-pointer transition-colors ${agreedScope ? 'bg-[#A9D6F5]/10 border-[#A9D6F5]' : isDark ? 'border-[#E5DACB]/20' : 'border-[#E5DACB]'
            }`}>
            <input
              type="checkbox"
              checked={agreedScope}
              onChange={(e) => setAgreedScope(e.target.checked)}
              className="mt-0.5 accent-[#A9D6F5] rounded"
            />
            <span className="leading-snug">
              <strong>Non-Diagnostic Scope:</strong> I understand that BioTrajectory tracks longitudinal trends and does not provide automated diagnoses, prescribe medications, or replace professional medical consultation.
            </span>
          </label>

          <label className={`p-3 rounded-xl border flex items-start space-x-3 cursor-pointer transition-colors ${agreedLocal ? 'bg-[#A9D6F5]/10 border-[#A9D6F5]' : isDark ? 'border-[#E5DACB]/20' : 'border-[#E5DACB]'
            }`}>
            <input
              type="checkbox"
              checked={agreedLocal}
              onChange={(e) => setAgreedLocal(e.target.checked)}
              className="mt-0.5 accent-[#A9D6F5] rounded"
            />
            <span className="leading-snug">
              <strong>Local Data Sovereignty:</strong> My test strip records and biosensor metrics are stored on my local device ledger with zero third-party cloud scraping. I retain the right to export or purge my data at any time.
            </span>
          </label>

          <label className={`p-3 rounded-xl border flex items-start space-x-3 cursor-pointer transition-colors ${agreedClinician ? 'bg-[#A9D6F5]/10 border-[#A9D6F5]' : isDark ? 'border-[#E5DACB]/20' : 'border-[#E5DACB]'
            }`}>
            <input
              type="checkbox"
              checked={agreedClinician}
              onChange={(e) => setAgreedClinician(e.target.checked)}
              className="mt-0.5 accent-[#A9D6F5] rounded"
            />
            <span className="leading-snug">
              <strong>Voluntary Physician Review:</strong> I will use exported longitudinal briefs as supplementary patient-generated health data (PGHD) to discuss with my healthcare provider.
            </span>
          </label>
        </div>

        <div className={`p-3 rounded-xl border text-[11px] leading-relaxed flex items-center space-x-2 ${isDark ? 'bg-[#2A0B10] border-[#E5DACB]/30 text-[#FAF6EE]' : 'bg-white border-[#E5DACB] text-[#3D291A]'
          }`}>
          <Lock className="w-4 h-4 shrink-0 text-[#A9D6F5]" />
          <span>Cryptographic audit guarantee: All readings require mandatory user verification before writing.</span>
        </div>

        <div className="pt-2">
          <button
            onClick={handleConfirm}
            disabled={!agreedScope || !agreedLocal || !agreedClinician}
            className={`w-full py-3 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all shadow-sm flex items-center justify-center space-x-2 ${agreedScope && agreedLocal && agreedClinician
                ? 'bg-[#A9D6F5]-[#7CBFEA]-[#1F150E] cursor-pointer'
                : 'bg-[#E5DACB]/40 text-[#846752] cursor-not-allowed'
              }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Agree & Activate Personal Baseline</span>
          </button>
        </div>

      </div>
    </div>
  );
}

