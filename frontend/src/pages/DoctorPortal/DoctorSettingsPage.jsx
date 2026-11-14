import React, { useState } from 'react';
import { CheckCircle2, Lock, ShieldCheck, Bell, RefreshCw, Save, Stethoscope } from 'lucide-react';

export default function DoctorSettingsPage() {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState({
    alerts: true,
    consent: true,
    telemedicine: true,
    autoSummary: false,
    followUps: true,
    secureNotes: true
  });

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const configRows = [
    ['Clinical alerts', 'alerts'],
    ['Patient consent prompts', 'consent'],
    ['Telemedicine availability', 'telemedicine'],
    ['Auto-generated care notes', 'autoSummary'],
    ['Follow-up reminders', 'followUps'],
    ['Secure note locking', 'secureNotes']
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-8">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300">
            Practice settings
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Clinical Workspace Preferences
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
          Manage consent checks, clinical alerts, and secure access preferences for your practice.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-300 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Secure practice controls</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Managed via approved clinical access rules</p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 text-sm font-semibold shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            Save changes
          </button>
        </div>

        <div className="space-y-3">
          {configRows.map(([label, key]) => (
            <div key={key} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-900/80 flex items-center justify-center text-slate-500 dark:text-slate-300">
                  {key.includes('alert') || key.includes('follow') ? <Bell className="w-4 h-4" /> : key.includes('consent') || key.includes('secure') ? <Lock className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{label}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Clinical workflow preference</p>
                </div>
              </div>

              <button
                type="button"
                aria-label={`Toggle ${label}`}
                onClick={() => toggle(key)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${settings[key] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white transition ${settings[key] ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-5">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Security review</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Last audit verified: 2 hours ago</p>
          </div>
        </div>
      </div>

      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xl">
          <CheckCircle2 className="w-4 h-4" />
          Preferences saved
        </div>
      )}
    </div>
  );
}
