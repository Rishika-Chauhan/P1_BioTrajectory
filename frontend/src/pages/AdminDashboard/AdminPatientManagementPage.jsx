import React, { useMemo, useState } from 'react';
import { Users, ShieldCheck, Lock, Search, Activity, AlertTriangle } from 'lucide-react';
import { ADMIN_USER_ACCOUNTS } from '../../data/adminData';

export default function AdminPatientManagementPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const patients = useMemo(
    () => ADMIN_USER_ACCOUNTS.filter((account) => account.role === 'Patient'),
    []
  );

  const filteredPatients = patients.filter((patient) => {
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter;
    const q = search.toLowerCase();
    const matchesSearch = !q || patient.name.toLowerCase().includes(q) || patient.email.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Patient Management & Account Oversight
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor patient account health, active sessions, and privacy safeguards without exposing private medical records.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-3 text-xs text-purple-200">
        <Lock className="w-5 h-5 shrink-0 mt-0.5" />
        <span>
          Private patient chart data remains inaccessible to admins by design; this screen reviews only account-level status and consent metadata.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[#101827] border border-slate-800 p-5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs uppercase tracking-wider">Total patients</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">{patients.length}</p>
        </div>
        <div className="rounded-2xl bg-[#101827] border border-slate-800 p-5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs uppercase tracking-wider">Active</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">{patients.filter((p) => p.status === 'Active').length}</p>
        </div>
        <div className="rounded-2xl bg-[#101827] border border-slate-800 p-5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs uppercase tracking-wider">Suspended</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">{patients.filter((p) => p.status === 'Suspended').length}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#101827] border border-slate-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070B14] border border-slate-800 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          {['all', 'Active', 'Suspended'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition ${statusFilter === filter ? 'bg-purple-500 text-white' : 'bg-[#070B14] text-slate-400 border border-slate-800'}`}
            >
              {filter === 'all' ? 'All' : filter}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-[#101827] border border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-4">Patient</th>
                <th className="py-3 px-4">Privacy tier</th>
                <th className="py-3 px-4">2FA</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-white">{patient.name}</p>
                    <p className="text-[11px] text-slate-400">{patient.email}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{patient.privacyTier}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold ${patient.twoFactorEnabled ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {patient.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${patient.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{patient.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
