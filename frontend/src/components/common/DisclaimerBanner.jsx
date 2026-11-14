import React from 'react';
import { AlertCircle, ShieldAlert } from 'lucide-react';

export default function DisclaimerBanner({ text, type = 'info', className = '' }) {
  const defaultText =
    text ||
    'Notice: BioTrajectory is a health tracking and educational platform. It does not provide medical diagnoses, treatment plans, or emergency care. Always consult a licensed doctor for your medical decisions.';

  const isWarning = type === 'warning';

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border text-sm leading-relaxed transition-all shadow-xs ${
        isWarning
          ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700/50 text-amber-950 dark:text-amber-200'
          : 'bg-cyan-50/90 dark:bg-[#0b1728] border-cyan-300/80 dark:border-cyan-800/60 text-slate-800 dark:text-slate-200'
      } ${className}`}
    >
      {isWarning ? (
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-cyan-700 dark:text-cyan-400 shrink-0 mt-0.5" />
      )}
      <p className="font-medium text-slate-800 dark:text-slate-200">{defaultText}</p>
    </div>
  );
}
