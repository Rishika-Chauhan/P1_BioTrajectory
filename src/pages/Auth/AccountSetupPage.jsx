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
  CheckCircle2
} from 'lucide-react';
import { useAuth, USER_ROLES } from '../../context/AuthContext';

export default function AccountSetupPage() {
  const { currentUser, logout, setUserRole } = useAuth();
  const navigate = useNavigate();
  const [assignedRoleNotice, setAssignedRoleNotice] = useState(null);

  const handleAssignRole = (role, path) => {
    setUserRole(role);
    setAssignedRoleNotice(`Role assigned: ${role}. Proceeding...`);
    setTimeout(() => {
      navigate(path);
    }, 1000);
  };

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

          {assignedRoleNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{assignedRoleNotice}</span>
            </div>
          )}

          {/* Test Sandbox Role Provisioner */}
          <div className="p-4 rounded-2xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/50 dark:border-cyan-800/40 space-y-2.5">
            <span className="text-xs font-bold text-cyan-900 dark:text-cyan-200 block">
              Development Test Sandbox: Provision a Role Now
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleAssignRole(USER_ROLES.USER, '/dashboard')}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <UserCheck className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Assign USER</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Patient Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => handleAssignRole(USER_ROLES.DOCTOR, '/doctor/dashboard')}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Stethoscope className="w-3.5 h-3.5 text-blue-500" />
                  <span>Assign DOCTOR</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Doctor Workspace</span>
              </button>

              <button
                type="button"
                onClick={() => handleAssignRole(USER_ROLES.ADMIN, '/admin/dashboard')}
                className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500 text-left transition-all"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Shield className="w-3.5 h-3.5 text-purple-500" />
                  <span>Assign ADMIN</span>
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">Admin Console</span>
              </button>
            </div>
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
    </div>
  );
}
