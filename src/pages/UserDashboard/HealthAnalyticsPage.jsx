import React, { useState } from 'react';
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
  Activity
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { SAMPLE_DAILY_VITALS_7D } from '../../data/vitalsData';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function HealthAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const { isDark } = useTheme();

  const gridStroke = isDark ? 'rgba(51, 65, 85, 0.35)' : 'rgba(226, 232, 240, 0.8)';
  const textStroke = isDark ? '#8292A6' : '#64748B';

  // Custom Recharts Tooltip adapting to light and dark theme
  const CustomTooltip = ({ active, payload, label, unit = '' }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 rounded-2xl glass-card border border-slate-200 dark:border-slate-700 shadow-2xl text-[14px] space-y-1.5 backdrop-blur-md">
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
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Health
          </h1>
          <p className="text-[16px] text-slate-600 dark:text-slate-400 mt-1">
            See how your numbers change over days, weeks, and months in simple charts
          </p>
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 text-[15px] font-semibold shadow-xs">
          {[
            { id: '7d', label: '7-Day View' },
            { id: '30d', label: '30-Day View' },
            { id: '1y', label: '1-Year View' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setTimeRange(btn.id)}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                timeRange === btn.id
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-xs active:scale-95'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Helpful Friendly Principle Banner */}
      <div className="p-5 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-4 text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
        <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <p>
          <strong>Why separate charts?</strong> We believe your health is too important to compress into a fake "single score." Each signal — like your blood pressure, steps, and water intake — tells its own honest story.
        </p>
      </div>

      {/* Grid of Separate Analytical Charts with Smooth Transitions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Top Number (Systolic) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="p-8 rounded-3xl glass-card glass-card-hover space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Blood Pressure (Top Number)</h3>
                <p className="text-[14px] text-slate-500 dark:text-slate-400">Target: Under 120 mmHg</p>
              </div>
            </div>
            <span className="text-[16px] font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl">121 Latest</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SAMPLE_DAILY_VITALS_7D}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="dayName" stroke={textStroke} fontSize={13} />
                <YAxis domain={[100, 150]} stroke={textStroke} fontSize={13} />
                <Tooltip content={<CustomTooltip unit="mmHg" />} />
                <ReferenceLine y={120} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'Target (<120)', fill: '#10B981', fontSize: 13, position: 'insideTopRight' }} />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  name="Top Number"
                  stroke={isDark ? "#00D9FF" : "#008FAE"}
                  strokeWidth={3.5}
                  dot={{ r: 5, fill: isDark ? '#00D9FF' : '#008FAE' }}
                  activeDot={{ r: 7 }}
                  isAnimationActive={true}
                  animationDuration={1100}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 2. Bottom Number (Diastolic) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="p-8 rounded-3xl glass-card glass-card-hover space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Blood Pressure (Bottom Number)</h3>
                <p className="text-[14px] text-slate-500 dark:text-slate-400">Target: Under 80 mmHg</p>
              </div>
            </div>
            <span className="text-[16px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-3 py-1 rounded-xl">78 Latest</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SAMPLE_DAILY_VITALS_7D}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="dayName" stroke={textStroke} fontSize={13} />
                <YAxis domain={[60, 100]} stroke={textStroke} fontSize={13} />
                <Tooltip content={<CustomTooltip unit="mmHg" />} />
                <ReferenceLine y={80} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'Target (<80)', fill: '#10B981', fontSize: 13, position: 'insideTopRight' }} />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  name="Bottom Number"
                  stroke={isDark ? "#5479FF" : "#3B82F6"}
                  strokeWidth={3.5}
                  dot={{ r: 5, fill: isDark ? '#5479FF' : '#3B82F6' }}
                  activeDot={{ r: 7 }}
                  isAnimationActive={true}
                  animationDuration={1100}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 3. Daily Walking Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="p-8 rounded-3xl glass-card glass-card-hover space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Daily Walking Steps</h3>
                <p className="text-[14px] text-slate-500 dark:text-slate-400">Target: 8,000 steps a day</p>
              </div>
            </div>
            <span className="text-[16px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-xl">11,200 Steps</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SAMPLE_DAILY_VITALS_7D}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="dayName" stroke={textStroke} fontSize={13} />
                <YAxis stroke={textStroke} fontSize={13} />
                <Tooltip content={<CustomTooltip unit="steps" />} />
                <ReferenceLine y={8000} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'Goal (8,000)', fill: '#10B981', fontSize: 13 }} />
                <Bar
                  dataKey="steps"
                  name="Steps"
                  fill="#10B981"
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={1100}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 4. Active Exercise Duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="p-8 rounded-3xl glass-card glass-card-hover space-y-5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Active Exercise Time</h3>
                <p className="text-[14px] text-slate-500 dark:text-slate-400">Target: 30 minutes a day</p>
              </div>
            </div>
            <span className="text-[16px] font-mono font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl">55 Mins Latest</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SAMPLE_DAILY_VITALS_7D}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
                <XAxis dataKey="dayName" stroke={textStroke} fontSize={13} />
                <YAxis domain={[0, 70]} stroke={textStroke} fontSize={13} />
                <Tooltip content={<CustomTooltip unit="mins" />} />
                <ReferenceLine y={30} stroke={isDark ? "#00D9FF" : "#008FAE"} strokeDasharray="4 4" label={{ value: 'Daily Goal (30m)', fill: isDark ? '#00D9FF' : '#008FAE', fontSize: 13 }} />
                <Bar
                  dataKey="exerciseMins"
                  name="Exercise Minutes"
                  fill={isDark ? "#00D9FF" : "#008FAE"}
                  radius={[8, 8, 0, 0]}
                  isAnimationActive={true}
                  animationDuration={1100}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Your Recent Health History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-8 rounded-3xl glass-card space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Recent Health History</h2>
            <p className="text-[16px] text-slate-500 dark:text-slate-400 mt-0.5">Readings from your past few days</p>
          </div>
          <span className="text-[14px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 w-fit">
            Past 7 Days Recorded
          </span>
        </div>

        <div className="space-y-3.5">
          {[...SAMPLE_DAILY_VITALS_7D].reverse().map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white/60 dark:bg-[#0c1220]/80 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[16px] hover:border-cyan-500/40 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-bold text-slate-900 dark:text-white">{item.date}</span>
                  <span className="text-[14px] px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">
                    {item.dayName}
                  </span>
                  <span className="text-[12px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
                    {item.spo2 || 98}% SpO2
                  </span>
                </div>
                <p className="text-[15px] text-slate-500 dark:text-slate-400">{item.notes}</p>
              </div>

              <div className="sm:text-right space-y-0.5">
                <p className="text-cyan-600 dark:text-cyan-400 font-bold font-mono text-[17px]">{item.systolic}/{item.diastolic} mmHg</p>
                <p className="text-[15px] text-slate-500 dark:text-slate-400">{item.steps.toLocaleString()} steps • {item.exerciseMins}m exercise</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Safety Notice */}
      <DisclaimerBanner text="Notice: These trends help you observe changes in your everyday body signals over time. Always discuss your readings with a licensed healthcare provider." />
    </div>
  );
}
