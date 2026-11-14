import React, { useState } from 'react';
import { Lock, ShieldCheck, Key, Server, RefreshCw, CheckCircle2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500 text-white font-bold text-xs shadow-2xl">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Security Auditing & Node Governance
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Cryptographic node validation, API rate limits, and audit logs
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-[#101827] border border-slate-800 space-y-4 text-xs">
        <h3 className="text-base font-bold text-white">System Cryptographic Audit Log</h3>
        
        <div className="space-y-3 pt-2">
          {[
            { title: 'Zero-Knowledge Enclave Verification', status: 'Passed (100%)', date: '2026-11-07 14:02 UTC' },
            { title: 'WebRTC Signaling Transport Encryption', status: 'TLS 1.3 Active', date: '2026-11-06 09:15 UTC' },
            { title: 'Ephemeral QR Token Auto-Expiry Daemon', status: 'Operational', date: '2026-11-05 22:30 UTC' }
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#070B14] border border-slate-800 flex items-center justify-between">
              <div>
                <p className="font-bold text-white">{item.title}</p>
                <p className="text-[11px] text-slate-400">{item.date}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {item.status}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 flex justify-end">
          <button
            onClick={() => showToast('Full cryptographic penetration audit re-dispatched.')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-500 hover:bg-purple-400 text-white flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Run Integrity Verification</span>
          </button>
        </div>
      </div>
    </div>
  );
}
