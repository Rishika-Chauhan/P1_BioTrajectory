import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export default function DisclaimerBanner({ text, type = 'info', className = '' }) {
  const defaultText =
    text ||
    'BioTrajectory is a longitudinal physiological monitoring and educational platform. It does not provide medical diagnoses, treatment plans, or emergency triage. Always consult a qualified medical professional for health decisions.';

  const isWarning = type === 'warning';

  return (
    <div
      className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs leading-relaxed transition-all ${
        isWarning
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          : 'bg-blue-500/10 border-blue-500/25 text-slate-300'
      } ${className}`}
    >
      {isWarning ? (
        <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
      )}
      <p>{defaultText}</p>
    </div>
  );
}
