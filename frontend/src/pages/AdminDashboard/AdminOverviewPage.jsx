import React from 'react';
import {
  Users,
  Activity,
  BookOpen,
  AlertCircle,
  TrendingUp,
  ShieldCheck,
  Lock,
  Cpu,
  ShieldAlert,
  Server
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import {
  ADMIN_METRICS,
  MONTHLY_USER_GROWTH,
  POPULATION_DISEASE_AGGREGATE
} from '../../data/adminData';

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* 1. Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Admin Overview
        </h1>
        <p className="text-[17px] text-slate-600 dark:text-slate-400 mt-2">
          High-level platform numbers, active users, and system health status.
        </p>
      </div>

      {/* 2. STRICT PRIVACY BANNER */}
      <div className="p-5 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-4 text-[16px] text-slate-700 dark:text-slate-300">
        <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-purple-700 dark:text-purple-300 text-[17px]">
            Strict Patient Privacy Protection
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[15px]">
            By system design, administrators <strong>cannot</strong> view private health records, personal blood pressure readings, doctor consultations, or private AI conversations.
          </p>
        </div>
      </div>

      {/* 3. Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[15px] font-bold uppercase tracking-wider">Total Users</span>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
            {ADMIN_METRICS.totalUsers.toLocaleString()}
          </p>
          <p className="text-emerald-600 dark:text-emerald-400 text-[15px] font-semibold flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" /> +12.4% this month
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[15px] font-bold uppercase tracking-wider">Active Members</span>
            <Activity className="w-5 h-5 text-cyan-500" />
          </div>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
            {ADMIN_METRICS.activeUsers.toLocaleString()}
          </p>
          <p className="text-cyan-600 dark:text-cyan-400 text-[15px] font-semibold">74% monthly active</p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[15px] font-bold uppercase tracking-wider">Disease Guide</span>
            <BookOpen className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
            {ADMIN_METRICS.diseaseCatalogEntries}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-[15px]">Medical topics explained</p>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-[15px] font-bold uppercase tracking-wider">System Status</span>
            <Server className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
            {ADMIN_METRICS.uptimePercentage}
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-[15px]">Healthy & operational</p>
        </div>
      </div>

      {/* 4. Chart Section: Monthly User Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Monthly User Growth</h3>
              <p className="text-[15px] text-slate-500 dark:text-slate-400">Total registered members and daily active participants</p>
            </div>
            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20 w-fit">
              +10,650 this year
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_USER_GROWTH}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" dark:stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={13} />
                <YAxis stroke="#64748B" fontSize={13} />
                <Tooltip contentStyle={{ borderRadius: '16px', fontSize: '15px' }} />
                <Area type="monotone" dataKey="totalUsers" stroke="#8B5CF6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorUsers)" name="Total Users" />
                <Area type="monotone" dataKey="activeUsers" stroke="#00D9FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorActive)" name="Active Members" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Aggregate Disease Breakdown */}
        <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Common Health Areas</h3>
            <p className="text-[15px] text-slate-500 dark:text-slate-400">Anonymous summary of topics explored</p>
          </div>

          <div className="space-y-4 pt-2">
            {POPULATION_DISEASE_AGGREGATE.map((item, idx) => (
              <div key={idx} className="space-y-2 text-[15px]">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{item.category}</span>
                  <span className="text-purple-600 dark:text-purple-400 font-bold">{item.cohortPercent}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${item.cohortPercent}%` }}
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
