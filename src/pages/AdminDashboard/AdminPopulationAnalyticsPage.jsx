import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { ShieldCheck, BarChart3, Lock } from 'lucide-react';
import {
  POPULATION_DISEASE_AGGREGATE,
  POPULATION_AGE_DISTRIBUTION
} from '../../data/adminData';

export default function AdminPopulationAnalyticsPage() {
  const COLORS = ['#8B5CF6', '#00D9FF', '#3B82F6', '#F59E0B', '#10B981'];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Population Health Epidemiology Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          K-anonymized aggregate cohorts for clinical research and public health surveillance
        </p>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center gap-3 text-xs text-purple-300">
        <Lock className="w-5 h-5 text-purple-400 shrink-0" />
        <span>
          <strong>K-Anonymity (k &gt;= 50):</strong> Aggregate analytics are mathematically suppressed for cohorts under 50 participants to completely prevent re-identification.
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cohort Distribution */}
        <div className="p-6 rounded-3xl bg-[#101827] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Aggregate Risk Marker Distribution</h3>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={POPULATION_DISEASE_AGGREGATE}
                  dataKey="cohortPercent"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                >
                  {POPULATION_DISEASE_AGGREGATE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#070B14', borderColor: '#334155', fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Age Group Distribution */}
        <div className="p-6 rounded-3xl bg-[#101827] border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white">Demographic Cohorts & Active Tracking Rates</h3>
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={POPULATION_AGE_DISTRIBUTION}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="ageGroup" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: '#070B14', borderColor: '#334155', fontSize: '11px' }} />
                <Bar dataKey="activeTrackingRate" name="Active Tracking %" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
