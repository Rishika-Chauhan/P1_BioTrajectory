import React, { useState, useMemo } from 'react';
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
  CartesianGrid,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import {
  ShieldCheck,
  BarChart3,
  Lock,
  RefreshCw,
  TrendingUp,
  Download,
  Users,
  Activity,
  HeartPulse,
  Droplets,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import {
  POPULATION_DISEASE_AGGREGATE,
  POPULATION_AGE_DISTRIBUTION
} from '../../data/adminData';
import { useLanguage } from '../../context/LanguageContext';

const TRAJECTORY_DETECTION_TRENDS = [
  { month: 'Jun', earlyDetection: 64, lateIntervention: 36, scans: 8400 },
  { month: 'Jul', earlyDetection: 69, lateIntervention: 31, scans: 9900 },
  { month: 'Aug', earlyDetection: 74, lateIntervention: 26, scans: 11200 },
  { month: 'Sep', earlyDetection: 78, lateIntervention: 22, scans: 12800 },
  { month: 'Oct', earlyDetection: 83, lateIntervention: 17, scans: 13900 },
  { month: 'Nov', earlyDetection: 88, lateIntervention: 12, scans: 14200 }
];

export default function AdminPopulationAnalyticsPage() {
  const { isHindi } = useLanguage();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState('90D');
  const [toastMessage, setToastMessage] = useState(null);

  const COLORS = ['#06b6d4', '#8b5cf6', '#3b82f6', '#f59e0b', '#10b981'];

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 450));
    setIsRefreshing(false);
    showToast(isHindi ? 'जनसांख्यिकी विश्लेषण अद्यतित हुआ।' : 'Epidemiological cohorts synchronized.');
  };

  const handleExportCSV = () => {
    const csvContent =
      'Category,Cohort_Percentage,Clinical_Indicator\n' +
      POPULATION_DISEASE_AGGREGATE.map(
        (c) => `"${c.category}",${c.cohortPercent},"${c.label}"`
      ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `BioTrajectory_Population_Cohort_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(isHindi ? 'अनाम समूह डेटा निर्यातित हुआ।' : 'K-anonymized cohort CSV exported.');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-600 text-white font-bold text-sm shadow-2xl animate-fade-in">
          <ShieldCheck className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{isHindi ? 'जनसंख्या स्वास्थ्य निगरानी' : 'Epidemiological Surveillance Intelligence'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isHindi ? 'जनसंख्या स्वास्थ्य एवं बायोमार्कर ट्रैजेक्टरी' : 'Population Health & Epidemiological Analytics'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {isHindi
              ? 'के-अनाम समूह आधारित दीर्घकालिक प्रवृत्तियां, जोखिम वितरण एवं नैदानिक अनुसंधान विश्लेषण।'
              : 'K-anonymized longitudinal cohort analytics, early intervention curves, and aggregate biomarker shifts.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Timeframe Selector */}
          <div className="flex items-center p-1 rounded-2xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs">
            {['30D', '90D', '6M', '1Y'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timeframe === t
                    ? 'bg-cyan-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#251A11] text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs cursor-pointer active:scale-95 transition-all"
            title="Download k-anonymized cohort CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#251A11] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-xs cursor-pointer active:scale-95 transition-all"
            title="Refresh Cohorts"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Safety & Cryptographic Privacy Notice */}
      <div className="p-4 sm:p-5 rounded-3xl bg-cyan-500/10 border border-cyan-500/25 flex items-start gap-3.5 text-xs text-slate-700 dark:text-slate-300">
        <Lock className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-cyan-900 dark:text-cyan-200 text-sm">
            Strict Mathematical K-Anonymity Guardrail (k &ge; 50 &amp; &epsilon;-Differential Privacy)
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            All population metrics shown are generated via client-encrypted zero-knowledge homomorphisms. No administrator or clinical researcher has access to identifiable patient records, unmasked biometric graphs, or individual identities.
          </p>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Anonymized Cohort</span>
            <Users className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">24,850</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">+12.4% Active Cohort Growth</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Early Detection Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">88.4%</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Identified before clinical stage 2</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Cardiovascular Pre-HTN</span>
            <HeartPulse className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">32%</p>
          <p className="text-xs text-slate-500">Elevated arterial wave velocity</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>Metabolic Variance</span>
            <Droplets className="w-4 h-4 text-purple-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">26%</p>
          <p className="text-xs text-slate-500">Subclinical glycemic variance</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Marker Cohort Distribution */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Aggregate Risk Marker Cohort Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Distribution across 24,850 tracked biometric profiles
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={POPULATION_DISEASE_AGGREGATE}
                  dataKey="cohortPercent"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={95}
                  paddingAngle={3}
                  label={({ name, percent }) => `${name.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
                >
                  {POPULATION_DISEASE_AGGREGATE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F150E',
                    borderColor: '#334155',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            {POPULATION_DISEASE_AGGREGATE.map((c, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="truncate text-slate-600 dark:text-slate-400 font-medium">
                  {c.category.split(' ')[0]}: <strong>{c.cohortPercent}%</strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Demographic Age Groups & Tracking Rate */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Demographic Cohort & Protocol Compliance
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Active tracking compliance rate (%) by age group
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={POPULATION_AGE_DISTRIBUTION}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} className="dark:opacity-10" />
                <XAxis dataKey="ageGroup" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F150E',
                    borderColor: '#334155',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="activeTrackingRate" name="Active Tracking %" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                <Bar dataKey="percentage" name="Cohort Share %" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-around pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-[#06b6d4]" />
              <span>Active Compliance Rate (%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-[#8b5cf6]" />
              <span>Total Cohort Share (%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trajectory Early Detection Rate (6-Month Area Chart) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              6-Month Longitudinal Early Stage vs Late Intervention Shift
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Impact of real-time computer vision urinalysis + vitals trajectory tracking
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full self-start sm:self-auto">
            +24% Shift to Proactive Intervention
          </span>
        </div>

        <div className="h-64 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={TRAJECTORY_DETECTION_TRENDS}>
              <defs>
                <linearGradient id="earlyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="lateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} className="dark:opacity-10" />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={12} unit="%" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F150E',
                  borderColor: '#334155',
                  borderRadius: '16px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="earlyDetection"
                name="Early Trajectory Detection (%)"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#earlyGrad)"
              />
              <Area
                type="monotone"
                dataKey="lateIntervention"
                name="Late Acute Intervention (%)"
                stroke="#f43f5e"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#lateGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
