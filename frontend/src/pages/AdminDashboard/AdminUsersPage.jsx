import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  Ban,
  Shield,
  Lock,
  AlertCircle
} from 'lucide-react';
import { ADMIN_USER_ACCOUNTS } from '../../data/adminData';

export default function AdminUsersPage() {
  const [users, setUsers] = useState(ADMIN_USER_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return {
          ...u,
          status: u.status === 'Active' ? 'Suspended' : 'Active'
        };
      }
      return u;
    }));
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Account Governance & User Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Inspect user authentication status, role tiering, and security audit flags
        </p>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3 text-xs text-purple-300">
        <Lock className="w-5 h-5 text-purple-400 shrink-0" />
        <span>
          <strong>Audit Constraint:</strong> User records do NOT expose personal medical files, conditions, vitals logs, or private AI chats to administrative staff.
        </span>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-[#101827] border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search accounts by name or email..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#070B14] border border-slate-800 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>

        <div className="flex items-center gap-2">
          {['All', 'Patient', 'Doctor', 'Administrator'].map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                roleFilter === role
                  ? 'bg-purple-500 text-white font-bold'
                  : 'bg-[#070B14] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* User Table */}
      <div className="p-6 rounded-3xl bg-[#101827] border border-slate-800 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-4">Account ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Privacy Tier</th>
                <th className="py-3 px-4">2FA Status</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">{user.id}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-[11px] text-slate-400">{user.email}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      user.role === 'Administrator'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                        : user.role === 'Doctor'
                        ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 font-mono text-[11px]">{user.privacyTier}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold ${user.twoFactorEnabled ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      user.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {user.role !== 'Administrator' && (
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          user.status === 'Active'
                            ? 'text-red-400 hover:bg-red-500/10 border border-red-500/20'
                            : 'text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20'
                        }`}
                      >
                        {user.status === 'Active' ? 'Suspend' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
