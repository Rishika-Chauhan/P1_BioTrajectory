import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ShieldCheck, Clock, Copy, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function QrProfilePage() {
  const { currentUser } = useAuth();
  const [token, setToken] = useState('biotrajectory_qr_unavailable');
  const [expiration, setExpiration] = useState('24h');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const secureShareUrl = `https://biotrajectory.health/access/patient?token=${token}&scope=selected`;

  const showToast = (message) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRevoke = () => {
    setToken('biotrajectory_qr_unavailable');
    setExpiration('24h');
    showToast('Secure QR access is disabled until a trusted token service is configured.');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(secureShareUrl);
    setCopied(true);
    showToast('Secure sharing link copied to your clipboard.');
    window.setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-cyan-400 text-slate-950 font-bold text-[15px] shadow-2xl">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          My QR
        </h1>
        <p className="text-[16px] text-slate-600 dark:text-slate-400 mt-2">
          Secure sharing is available only after a verified backend token issuer is configured.
        </p>
      </div>

      <div className="p-5 rounded-3xl bg-cyan-500/10 border border-cyan-500/25 flex items-start sm:items-center gap-4 text-[15px] text-slate-700 dark:text-slate-300 shadow-xs">
        <ShieldCheck className="w-6 h-6 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
        <span>
          <strong className="text-cyan-700 dark:text-cyan-300">Privacy notice:</strong> QR-based sharing is intentionally disabled until a trusted Firestore-backed token workflow is available.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] space-y-6 text-center flex flex-col items-center">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Secure medical QR</h3>
            <p className="text-[15px] text-slate-500 dark:text-slate-400">Unavailable until token issuance is enabled</p>
          </div>

          <div className="p-5 rounded-3xl bg-white shadow-md border-4 border-slate-200">
            <QRCodeSVG value={secureShareUrl} size={210} level="H" includeMargin={false} />
          </div>

          <div className="w-full p-4 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 border border-slate-200 dark:border-slate-800 text-[15px] text-left space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Name:</span>
              <span className="text-slate-900 dark:text-white font-bold">{currentUser?.name || 'User'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Status:</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">Token service pending</span>
            </div>
          </div>

          <div className="w-full flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleRevoke}
              className="w-full sm:w-1/2 py-3 px-4 rounded-2xl text-[14px] font-bold bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 transition-all"
            >
              Reset status
            </button>
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-1/2 py-3 px-4 rounded-2xl text-[14px] font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 transition-all shadow-xs"
            >
              <span className="inline-flex items-center gap-2"><Copy className="w-4 h-4" />{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        <div className="md:col-span-7 space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Share window</h3>
                <p className="text-[15px] text-slate-500 dark:text-slate-400 mt-1">This feature becomes active once the secure token system is live.</p>
              </div>
              <Clock className="w-6 h-6 text-cyan-500 shrink-0" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { id: '1h', label: '1 Hour' },
                { id: '24h', label: '24 Hours' },
                { id: '7d', label: '7 Days' },
                { id: 'once', label: 'One Time Only' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setExpiration(opt.id);
                    showToast(`Token window: ${opt.label}`);
                  }}
                  className={`py-2.5 px-3 rounded-2xl text-[15px] font-bold text-center ${expiration === opt.id ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950' : 'bg-slate-50/80 dark:bg-[#070B14]/80 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
