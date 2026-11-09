import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  Mail,
  LogOut,
  ShieldCheck,
  PhoneCall,
  CheckCircle2
} from 'lucide-react';
import { useAuth, USER_ROLES } from '../../context/AuthContext';

export default function DoctorSuspendedPage() {
  const { currentUser, logout, setUserRole } = useAuth();
  const navigate = useNavigate();
  const [restoredNotice, setRestoredNotice] = useState(false);

  const handleSimulateRestore = () => {
    setUserRole(USER_ROLES.DOCTOR);
    setRestoredNotice(true);
    setTimeout(() => {
      navigate('/doctor/dashboard');
    }, 1200);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white dark:bg-[#101827] border border-rose-500/30 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Warning Banner */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300">
          <ShieldAlert className="w-6 h-6 shrink-0 text-rose-500" />
          <div>
            <h2 className="text-sm font-bold">Clinical Access Suspended</h2>
            <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
              Role: <strong className="font-mono">DOCTOR_SUSPENDED</strong>
            </p>
          </div>
        </div>

        {/* Details Card */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Practitioner Account Restricted
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your clinical practitioner privileges have been temporarily frozen by clinical governance oversight.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Account:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser?.name} ({currentUser?.email})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Reason:</span>
              <span className="font-semibold text-rose-600 dark:text-rose-400">Periodic license re-credentialing audit</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Clinical Authority:</span>
              <span className="font-semibold text-rose-500">Revoked (Telemedicine & E-Rx disabled)</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/40 text-xs space-y-2 text-slate-600 dark:text-slate-300">
            <p className="font-bold text-slate-800 dark:text-slate-200">Appeals & Inquiries:</p>
            <p>
              To appeal this suspension or submit updated medical council license documentation, contact the Medical Oversight Committee:
            </p>
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold pt-1">
              <Mail className="w-3.5 h-3.5" />
              <span>oversight@biotrajectory.health</span>
            </div>
          </div>
        </div>

        {restoredNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            License Restored! Redirecting to Doctor Workspace...
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>

          <button
            type="button"
            onClick={handleSimulateRestore}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            Restore Clinical License (Test)
          </button>
        </div>
      </div>
    </div>
  );
}
