import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  ShieldCheck,
  Clock,
  Key,
  RefreshCw,
  Copy,
  CheckCircle2,
  AlertTriangle,
  User,
  Heart,
  Phone,
  Share2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function QrProfilePage() {
  const { currentUser } = useAuth();
  const [token, setToken] = useState('bt_secure_token_982a7f01');
  const [expiration, setExpiration] = useState('24h');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Permission selection
  const [permissions, setPermissions] = useState({
    emergencyVitals: true,
    bloodPressureHistory: true,
    urineMarkers: false,
    uploadedDocuments: false
  });

  // Sharing history
  const [sharingHistory, setSharingHistory] = useState([
    {
      id: 'sh_01',
      recipient: 'Urgent Care Clinic (St. Jude)',
      date: 'Oct 18, 2026',
      expiry: 'Expired',
      status: 'Ended',
      scope: 'Emergency Contact & Blood Pressure'
    },
    {
      id: 'sh_02',
      recipient: 'Dr. Sarah Jenkins (Heart Doctor)',
      date: 'Nov 04, 2026',
      expiry: 'Active (18 hours left)',
      status: 'Active',
      scope: 'Blood Pressure & Reports'
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Secure URL - does NOT encode raw medical information inside the image!
  const secureShareUrl = `https://biotrajectory.health/access/patient?token=${token}&scope=selected`;

  const handleRevoke = () => {
    const newToken = `bt_secure_token_${Math.random().toString(36).substring(2, 10)}`;
    setToken(newToken);
    showToast('Old QR code cancelled. A fresh secure code was created.');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(secureShareUrl);
    setCopied(true);
    showToast('Secure sharing link copied to your clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-[16px] shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          My QR
        </h1>
        <p className="text-[17px] text-slate-600 dark:text-slate-400 mt-2">
          Show this code to a doctor or paramedic in an emergency to share your blood type and vital signs.
        </p>
      </div>

      {/* Strict Privacy Rule Notice */}
      <div className="p-5 rounded-3xl bg-cyan-500/10 border border-cyan-500/25 flex items-start sm:items-center gap-4 text-[16px] text-slate-700 dark:text-slate-300">
        <ShieldCheck className="w-6 h-6 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5 sm:mt-0" />
        <span>
          <strong className="text-cyan-700 dark:text-cyan-300">Your privacy is protected:</strong> This code creates a temporary, safe link. Your personal records are never permanently stored inside the image, and you can stop sharing at any time.
        </span>
      </div>

      {/* Main Grid: QR Code & Sharing Options */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: QR Display (5 cols) */}
        <div className="md:col-span-5 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 text-center flex flex-col items-center">
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Your Medical QR Code</h3>
            <p className="text-[16px] text-slate-500 dark:text-slate-400">Scan with any smartphone camera</p>
          </div>

          {/* QR Code Container */}
          <div className="p-5 rounded-3xl bg-white shadow-md border-4 border-cyan-400/30">
            <QRCodeSVG
              value={secureShareUrl}
              size={220}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Profile Summary Badge */}
          <div className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-[16px] text-left space-y-2.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Name:</span>
              <span className="text-slate-900 dark:text-white font-bold">{currentUser?.name || 'Pranjal Sharma'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Blood Type:</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">{currentUser?.bloodType || 'O+'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">Emergency Phone:</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">{currentUser?.emergencyContact?.phone || '+1 (555) 349-2910'}</span>
            </div>
          </div>

          {/* Revoke and Refresh Actions */}
          <div className="w-full flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleRevoke}
              className="w-full sm:w-1/2 py-3.5 px-4 rounded-2xl text-[16px] font-bold bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Make New Code</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="w-full sm:w-1/2 py-3.5 px-4 rounded-2xl text-[16px] font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Right Col: Scope Permissions & Expiry Config (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          
          {/* Permission Scopes Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Choose What You Share
              </h3>
              <p className="text-[16px] text-slate-500 dark:text-slate-400 mt-1">
                Pick only the health information you want doctors or paramedics to see:
              </p>
            </div>

            <div className="space-y-3 pt-1">
              {[
                { key: 'emergencyVitals', label: 'Emergency Contact & Blood Type', desc: 'Allows paramedic to contact your family and see your blood group right away.' },
                { key: 'bloodPressureHistory', label: 'Recent Blood Pressure', desc: 'Share your blood pressure numbers from the last 7 days.' },
                { key: 'urineMarkers', label: 'Simple Urine Check', desc: 'Share kidney filter and hydration test strip results.' },
                { key: 'uploadedDocuments', label: 'Past Reports', desc: 'Allow doctors to read your uploaded lab test reports.' }
              ].map(item => (
                <label
                  key={item.key}
                  className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-cyan-400/50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={permissions[item.key]}
                    onChange={e => setPermissions({ ...permissions, [item.key]: e.target.checked })}
                    className="w-5 h-5 mt-0.5 rounded border-slate-300 dark:border-slate-700 text-cyan-600 focus:ring-cyan-500"
                  />
                  <div>
                    <p className="text-[17px] font-bold text-slate-900 dark:text-white">{item.label}</p>
                    <p className="text-[15px] text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Expiration Settings Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">How Long This Code Works</h3>
                <p className="text-[16px] text-slate-500 dark:text-slate-400 mt-1">The link automatically stops working after this time:</p>
              </div>
              <Clock className="w-6 h-6 text-cyan-500 shrink-0" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {[
                { id: '1h', label: '1 Hour' },
                { id: '24h', label: '24 Hours' },
                { id: '7d', label: '7 Days' },
                { id: 'once', label: 'One Time Only' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => {
                    setExpiration(opt.id);
                    showToast(`Code will work for: ${opt.label}`);
                  }}
                  className={`py-3 px-3 rounded-2xl text-[16px] font-bold text-center transition-all ${
                    expiration === opt.id
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sharing History Log */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Who Has Viewed Your Code</h3>
          <p className="text-[16px] text-slate-500 dark:text-slate-400 mt-1">A simple history of doctors and clinics that received temporary access.</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[16px] border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-[15px] font-semibold">
                <th className="py-3.5 px-4">Doctor or Clinic</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">What Was Shared</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {sharingHistory.map(row => (
                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">{row.recipient}</td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400">{row.date}</td>
                  <td className="py-4 px-4 text-cyan-600 dark:text-cyan-400 font-medium">{row.scope}</td>
                  <td className="py-4 px-4">
                    <span className={`text-[14px] font-bold px-3 py-1 rounded-full border ${
                      row.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Safety Notice */}
      <DisclaimerBanner />
    </div>
  );
}
