import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid
} from 'recharts';
import {
  Heart,
  Footprints,
  Clock,
  Droplet,
  Info,
  TrendingUp,
  Activity,
  BarChart2,
  ArrowRight,
  FlaskConical,
  ShieldCheck
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SAMPLE_DAILY_VITALS_7D } from '../../data/vitalsData';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

// Multi-line trajectory dataset matching reference UI
const HEALTH_OVERVIEW_DATA = [
  { date: 'Oct 15', ph: 6.2, protein: 12, sg: 1.015 },
  { date: 'Oct 19', ph: 6.5, protein: 15, sg: 1.018 },
  { date: 'Oct 22', ph: 6.9, protein: 14, sg: 1.016 },
  { date: 'Oct 26', ph: 6.4, protein: 19, sg: 1.021 },
  { date: 'Oct 29', ph: 6.3, protein: 22, sg: 1.022 },
  { date: 'Nov 2', ph: 6.7, protein: 18, sg: 1.017 },
  { date: 'Nov 5', ph: 6.4, protein: 23, sg: 1.020 },
  { date: 'Nov 9', ph: 6.6, protein: 21, sg: 1.018 },
  { date: 'Nov 14', ph: 6.8, protein: 22, sg: 1.019 }
];

export default function HealthAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30D');
  const { isDark } = useTheme();

  const gridStroke = isDark ? 'rgba(51, 65, 85, 0.35)' : 'rgba(226, 232, 240, 0.8)';
  const textStroke = isDark ? '#8292A6' : '#64748B';

  // Custom Recharts Tooltip adapting to light and dark theme
  const CustomTooltip = ({ active, payload, label, unit = '' }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3.5 rounded-2xl glass-card border border-slate-200 dark:border-slate-700 shadow-2xl text-[13px] space-y-1 backdrop-blur-md">
          <p className="font-bold text-slate-900 dark:text-slate-100">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-mono font-bold flex items-center justify-between gap-4">
              <span>{entry.name}:</span>
              <span>{entry.value} {unit}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 font-sans">

      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Health
          </h1>
          <p className="text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-400 mt-1">
            See how your numbers change over days, weeks, and months in simple charts
          </p>
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex items-center gap-1 p-1 rounded-full bg-white dark:bg-[#0A1226] border border-slate-200 dark:border-slate-800 text-xs font-bold shadow-xs">
          {['7D', '30D', '90D', 'All'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-1.5 rounded-full transition-all cursor-pointer ${timeRange === range
                  ? 'bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
          USER REQUESTED SECTION: YOUR HEALTH OVERVIEW & URINE COLOUR
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">

        {/* Left Card: "Your Health Overview" Multi-Line Trajectory Chart */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0A1226] border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-4 flex flex-col justify-between">

          {/* Header Row: Title + Time Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <BarChart2 className="w-4 h-4" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Your Health Overview
              </h2>
            </div>

            {/* Time Filter Pills: 7D, 30D, 90D, All */}
            <div className="flex items-center p-1 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
              {['7D', '30D', '90D', 'All'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded-full transition-all cursor-pointer ${timeRange === range
                      ? 'bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-xs'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* Legend Items */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
              pH
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
              Protein
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              Specific Gravity
            </span>
          </div>

          {/* Recharts Trajectory Multi-Line Spline */}
          <div className="w-full h-56 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={HEALTH_OVERVIEW_DATA} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                />
                <YAxis
                  domain={[5.5, 7.5]}
                  ticks={[5.8, 6.6, 7.2]}
                  tickFormatter={(val) => (val <= 6.0 ? 'Low' : val <= 6.8 ? 'Normal' : 'High')}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#94A3B8' }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="p-2.5 rounded-xl bg-slate-900 text-white text-xs shadow-xl border border-slate-700 space-y-1">
                          <p className="font-bold text-cyan-300">{label}</p>
                          <p className="text-sky-300">pH: {payload[0]?.value}</p>
                          <p className="text-purple-300">Protein: {payload[1]?.value} mg/dL</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="natural"
                  dataKey="ph"
                  stroke="#0284C7"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#0284C7' }}
                  activeDot={{ r: 6, fill: '#0284C7', stroke: '#FFFFFF', strokeWidth: 2 }}
                />
                <Line
                  type="natural"
                  dataKey="protein"
                  stroke="#9333EA"
                  strokeWidth={2.5}
                  dot={false}
                  strokeDasharray="4 2"
                />
                <Line
                  type="natural"
                  dataKey="sg"
                  stroke="#0D9488"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Active Highlight Marker Info */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
            <span>Baseline range: pH 6.0 – 7.2 (Stable corridor)</span>
            <span className="font-bold text-sky-600 dark:text-sky-400">pH: 6.8 • Nov 14</span>
          </div>
        </div>

        {/* Right Card: Urine Colour Analysis */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0A1226] border border-slate-200/90 dark:border-slate-800/90 shadow-sm flex flex-col justify-between space-y-4">

          {/* Header Row */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Urine Colour Analysis
              </h3>
            </div>
            <Link
              to="/dashboard/urine"
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* Circular 3D Glass Petri Dish / Sample Cup */}
          <div className="flex flex-col sm:flex-row items-center gap-5 my-auto">
            {/* 3D Glass Liquid Vessel */}
            <div className="relative w-28 h-28 shrink-0 rounded-full border-4 border-slate-200/90 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-lg shadow-amber-500/10 p-2 flex items-center justify-center">
              {/* Concentric Rim Specular Highlights */}
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-200 shadow-[inset_0_4px_12px_rgba(180,83,9,0.35)] relative overflow-hidden flex items-center justify-center">
                {/* Specular White Arc */}
                <div className="absolute top-1.5 left-2.5 w-8 h-3.5 rounded-full bg-white/45 blur-[0.6px] -rotate-30" />
                <div className="w-8 h-8 rounded-full bg-white/20 blur-[2px]" />
              </div>
            </div>

            {/* Analysis Text & Status */}
            <div className="space-y-1.5 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  Pale Yellow
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Normal
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Looks healthy!
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug">
                Your urine colour is within the normal hydration range.
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-1 text-right">
            Optical spectral analysis verified
          </div>
        </div>

      </div>

      {/* ========================================================
          USER REQUESTED SECTION: KEY BIOMARKERS (5 CARDS IN A ROW)
          ======================================================== */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0A1226] border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-cyan-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Key Biomarkers</h3>
          </div>
          <Link
            to="/dashboard/reports"
            className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* 5 Biomarker Mini-Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">

          {/* pH */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-center space-y-1.5 hover:border-cyan-500/30 transition-all">
            <div className="w-7 h-7 rounded-full bg-teal-500/15 text-teal-600 dark:text-teal-400 mx-auto flex items-center justify-center text-xs">
              💧
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">pH</span>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">6.8</p>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">↑ 0.2</span>
            <svg viewBox="0 0 40 10" className="w-full h-2.5 stroke-teal-500 fill-none" strokeWidth="2">
              <path d="M 2 8 Q 20 2, 38 5" />
            </svg>
          </div>

          {/* Protein */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-center space-y-1.5 hover:border-purple-500/30 transition-all">
            <div className="w-7 h-7 rounded-full bg-purple-500/15 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center text-xs">
              🧬
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Protein</span>
            <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">Trace</p>
            <span className="text-xs font-semibold text-slate-400 block">—</span>
            <svg viewBox="0 0 40 10" className="w-full h-2.5 stroke-purple-500 fill-none" strokeWidth="2">
              <path d="M 2 5 Q 20 7, 38 5" />
            </svg>
          </div>

          {/* Glucose */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-center space-y-1.5 hover:border-emerald-500/30 transition-all">
            <div className="w-7 h-7 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center text-xs">
              🛡️
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Glucose</span>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">Negative</p>
            <span className="text-xs font-semibold text-slate-400 block">—</span>
            <svg viewBox="0 0 40 10" className="w-full h-2.5 stroke-emerald-500 fill-none" strokeWidth="2">
              <path d="M 2 5 Q 20 5, 38 5" />
            </svg>
          </div>

          {/* Ketones */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-center space-y-1.5 hover:border-amber-500/30 transition-all">
            <div className="w-7 h-7 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center text-xs">
              ⚡
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Ketones</span>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">Negative</p>
            <span className="text-xs font-semibold text-slate-400 block">—</span>
            <svg viewBox="0 0 40 10" className="w-full h-2.5 stroke-amber-500 fill-none" strokeWidth="2">
              <path d="M 2 5 Q 20 5, 38 5" />
            </svg>
          </div>

          {/* Blood */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-800 text-center space-y-1.5 hover:border-rose-500/30 transition-all col-span-2 sm:col-span-1">
            <div className="w-7 h-7 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center text-xs">
              🩸
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">Blood</span>
            <p className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">Negative</p>
            <span className="text-xs font-semibold text-slate-400 block">—</span>
            <svg viewBox="0 0 40 10" className="w-full h-2.5 stroke-rose-500 fill-none" strokeWidth="2">
              <path d="M 2 5 Q 20 5, 38 5" />
            </svg>
          </div>

        </div>
      </div>

      {/* Helpful Friendly Principle Banner */}
      <div className="p-5 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-4 text-[14px] sm:text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
        <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong>Why separate charts?</strong> We believe your health is too important to compress into an arbitrary single score. Each signal — like your blood pressure, steps, and urine biomarkers — tells its own honest story.
        </p>
      </div>

      {/* Grid of Dedicated Vital Metrics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Top Number (Systolic) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0A1226] border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Blood Pressure (Top Number)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Target: Under 120 mmHg</p>
              </div>
            </div>
            <span className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl">121 Latest</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SAMPLE_DAILY_VITALS_7D}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="dayName" stroke={textStroke} fontSize={12} />
                <YAxis domain={[100, 150]} stroke={textStroke} fontSize={12} />
                <Tooltip content={<CustomTooltip unit="mmHg" />} />
                <ReferenceLine y={120} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'Target (<120)', fill: '#10B981', fontSize: 11, position: 'insideTopRight' }} />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  name="Top Number"
                  stroke={isDark ? "#00D9FF" : "#008FAE"}
                  strokeWidth={3}
                  dot={{ r: 4, fill: isDark ? '#00D9FF' : '#008FAE' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 2. Bottom Number (Diastolic) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0A1226] border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Blood Pressure (Bottom Number)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Target: Under 80 mmHg</p>
              </div>
            </div>
            <span className="text-sm font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-xl">78 Latest</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SAMPLE_DAILY_VITALS_7D}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="dayName" stroke={textStroke} fontSize={12} />
                <YAxis domain={[60, 100]} stroke={textStroke} fontSize={12} />
                <Tooltip content={<CustomTooltip unit="mmHg" />} />
                <ReferenceLine y={80} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'Target (<80)', fill: '#10B981', fontSize: 11, position: 'insideTopRight' }} />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  name="Bottom Number"
                  stroke={isDark ? "#5479FF" : "#3B82F6"}
                  strokeWidth={3}
                  dot={{ r: 4, fill: isDark ? '#5479FF' : '#3B82F6' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 3. Daily Walking Steps */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0A1226] border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daily Walking Steps</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Target: 8,000 steps a day</p>
              </div>
            </div>
            <span className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl">11,200 Steps</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SAMPLE_DAILY_VITALS_7D}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="dayName" stroke={textStroke} fontSize={12} />
                <YAxis stroke={textStroke} fontSize={12} />
                <Tooltip content={<CustomTooltip unit="steps" />} />
                <ReferenceLine y={8000} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'Goal (8,000)', fill: '#10B981', fontSize: 11 }} />
                <Bar
                  dataKey="steps"
                  name="Steps"
                  fill="#10B981"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 4. Active Exercise Duration */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0A1226] border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Exercise Time</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Target: 30 minutes a day</p>
              </div>
            </div>
            <span className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl">55 Mins Latest</span>
          </div>

          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SAMPLE_DAILY_VITALS_7D}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="dayName" stroke={textStroke} fontSize={12} />
                <YAxis domain={[0, 70]} stroke={textStroke} fontSize={12} />
                <Tooltip content={<CustomTooltip unit="mins" />} />
                <ReferenceLine y={30} stroke={isDark ? "#00D9FF" : "#008FAE"} strokeDasharray="4 4" label={{ value: 'Daily Goal (30m)', fill: isDark ? '#00D9FF' : '#008FAE', fontSize: 11 }} />
                <Bar
                  dataKey="exerciseMins"
                  name="Exercise Minutes"
                  fill={isDark ? "#00D9FF" : "#008FAE"}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Safety Notice */}
      <DisclaimerBanner compact={true} />
    </div>
  );
}
