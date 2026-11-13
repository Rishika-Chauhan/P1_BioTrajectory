import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  AlertCircle,
  UserCheck,
  Stethoscope,
  Shield,
  LogOut,
  ArrowRight,
  CheckCircle2,
  Activity,
  Sparkles
} from 'lucide-react';
import { useAuth, USER_ROLES } from '../../context/AuthContext';
import HealthProfileModal from '../../components/HealthProfileModal';

export default function AccountSetupPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Notice */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
          <HelpCircle className="w-6 h-6 shrink-0 text-cyan-500" />
          <div>
            <h2 className="text-sm font-bold">Account Setup & Role Assignment Required</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Role: <strong className="font-mono text-cyan-600 dark:text-cyan-400">UNASSIGNED / UNKNOWN</strong>
            </p>
          </div>
        </div>

        {/* Details Card */}
        <div className="space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              No Authorized Role Detected
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your account authenticated successfully with Firebase, but no trusted custom claims role has been assigned to your ID token yet.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-500">Authenticated Email:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{currentUser?.email}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Firebase UID:</span>
              <span className="font-mono text-slate-600 dark:text-slate-400">{currentUser?.uid || currentUser?.id}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            In production, contact your organization administrator or clinical onboarding manager to provision custom claims for your account.
          </p>

          {/* First-Time Health Profile & Consent Onboarding Action */}
          <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-teal-900 dark:text-teal-200 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#00685f]" />
                <span>Health Profile &amp; Informed Consent Setup</span>
              </span>
              <span className="text-[10px] font-mono font-semibold text-[#00685f] dark:text-[#6bd8cb] bg-teal-100 dark:bg-teal-900/40 px-2 py-0.5 rounded-full">
                7-Step Guided Flow
              </span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Define your age bracket, optional biometric units, lifestyle context, baseline tracking goals, and data privacy consent preferences.
            </p>
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complete My Health Profile Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/50 dark:border-cyan-800/40 space-y-2">
            <span className="text-xs font-bold text-cyan-900 dark:text-cyan-200 block">
              Access is currently pending trusted provisioning
            </span>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Contact your platform administrator or medical onboarding team to grant the appropriate role and token claims for this account.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {/* Embedded Health Profile & Consent Modal */}
      <HealthProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialStep={1}
      />
    </div>
  );
}
