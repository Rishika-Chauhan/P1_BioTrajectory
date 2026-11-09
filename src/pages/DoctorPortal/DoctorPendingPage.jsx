import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  LogOut,
  FileText,
  Building,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';
import { useAuth, USER_ROLES } from '../../context/AuthContext';

export default function DoctorPendingPage() {
  const { currentUser, logout, setUserRole, refreshToken } = useAuth();
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [approvedNotice, setApprovedNotice] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshToken();
    setTimeout(() => {
      setIsRefreshing(false);
      if (currentUser?.role === USER_ROLES.DOCTOR) {
        navigate('/doctor/dashboard');
      }
    }, 1000);
  };

  const handleSimulateApproval = () => {
    setUserRole(USER_ROLES.DOCTOR);
    setApprovedNotice(true);
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
      <div className="max-w-xl w-full bg-white dark:bg-[#101827] border border-amber-500/30 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Warning Banner */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300">
          <Clock className="w-6 h-6 shrink-0 text-amber-500 animate-pulse" />
          <div>
            <h2 className="text-sm font-bold">Medical Credential Verification in Progress</h2>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              Role: <strong className="font-mono">DOCTOR_PENDING</strong>
            </p>
          </div>
        </div>

        {/* Doctor Information Card */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Welcome, {currentUser?.name || 'Doctor'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your clinical practitioner application is currently undergoing medical board verification.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Applicant Name:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser?.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Registered Email:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser?.email}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Registration Number:</span>
              <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                {currentUser?.claims?.medicalRegNumber || 'MCI-84729-A'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Clinical Verification Stage:</span>
              <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Stage 2: License Authenticity Check
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/40 text-xs space-y-1 text-slate-600 dark:text-slate-300">
            <p className="font-bold text-slate-800 dark:text-slate-200">What happens next?</p>
            <p>
              Once your medical license is cross-verified against state and national medical registries, full clinical features (telemedicine rooms, digital prescription issuance, consultation reports) will automatically unlock.
            </p>
          </div>
        </div>

        {approvedNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Credentials Approved! Redirecting to Doctor Workspace...
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

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              Check Status
            </button>

            <button
              type="button"
              onClick={handleSimulateApproval}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 text-xs font-bold hover:from-cyan-300 hover:to-blue-400 transition-all shadow-md flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              Approve Credentials (Test)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
