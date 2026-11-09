import React, { useState } from 'react';
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
  Info
} from 'lucide-react';
import {
  SAMPLE_DAILY_VITALS_7D
} from '../../data/vitalsData';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function HealthAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');

  // Custom Recharts Tooltip with 15px+ readable text
  const CustomTooltip = ({ active, payload, label, unit = '' }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 rounded-2xl bg-[#070B14] border border-slate-700 shadow-2xl text-[15px] space-y-1">
          <p className="font-bold text-slate-200">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="font-mono font-semibold">
              {entry.name}: {entry.value} {unit}
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
          <p className="text-[17px] text-slate-600 dark:text-slate-400 mt-1">
            See how your numbers change over days, weeks, and months in simple charts
          </p>
        </div>

        {/* Time Range Filter Buttons */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#101827] border border-slate-300 dark:border-slate-800 text-[16px] font-semibold shadow-sm">
          {[
            { id: '7d', label: '7-Day View' },
            { id: '30d', label: '30-Day View' },
            { id: '1y', label: '1-Year View' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setTimeRange(btn.id)}
              className={`px-5 py-2 rounded-xl transition-all cursor-pointer ${
                timeRange === btn.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Helpful Friendly Principle Banner */}
      <div className="p-5 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-4 text-[16px] text-slate-700 dark:text-slate-300 leading-relaxed">
        <Info className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
        <p>
          <strong>Why separate charts?</strong> We believe your health is too important to compress into a fake "single score." Each signal — like your blood pressure, steps, and water intake — tells its own honest story.
        </p>
      </div>

      {/* Grid of Separate Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. Top Number (Systolic) */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Blood Pressure (Top Number)</h3>
                <p className="text-[15px] text-slate-500 dark:text-slate-400">Target: Under 120 mmHg</p>
              </div>
            </div>
            <span className="text-[17px] font-mono font-bold text-cyan-600 dark:text-cyan-400">121 Latest</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SAMPLE_DAILY_VITALS_7D}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                <XAxis dataKey="dayName" stroke="#64748B" fontSize={13} />
                <YAxis domain={[100, 150]} stroke="#64748B" fontSize={13} />
                <Tooltip content={<CustomTooltip unit="mmHg" />} />
                <ReferenceLine y={120} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'Target (<120)', fill: '#10B981', fontSize: 13, position: 'insideTopRight' }} />
                <Line type="monotone" dataKey="systolic" name="Top Number" stroke="#00D9FF" strokeWidth={3.5} dot={{ r: 5, fill: '#00D9FF' }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Bottom Number (Diastolic) */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-500 flex items-center justify-center font-bold">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Blood Pressure (Bottom Number)</h3>
                <p className="text-[15px] text-slate-500 dark:text-slate-400">Target: Under 80 mmHg</p>
              </div>
            </div>
            <span className="text-[17px] font-mono font-bold text-blue-500">78 Latest</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SAMPLE_DAILY_VITALS_7D}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                <XAxis dataKey="dayName" stroke="#64748B" fontSize={13} />
                <YAxis domain={[60, 100]} stroke="#64748B" fontSize={13} />
                <Tooltip content={<CustomTooltip unit="mmHg" />} />
                <ReferenceLine y={80} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'Target (<80)', fill: '#10B981', fontSize: 13, position: 'insideTopRight' }} />
                <Line type="monotone" dataKey="diastolic" name="Bottom Number" stroke="#5479FF" strokeWidth={3.5} dot={{ r: 5, fill: '#5479FF' }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Daily Walking Steps */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center font-bold">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Daily Walking Steps</h3>
                <p className="text-[15px] text-slate-500 dark:text-slate-400">Target: 8,000 steps a day</p>
              </div>
            </div>
            <span className="text-[17px] font-mono font-bold text-emerald-500">11,200 Steps</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SAMPLE_DAILY_VITALS_7D}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                <XAxis dataKey="dayName" stroke="#64748B" fontSize={13} />
                <YAxis stroke="#64748B" fontSize={13} />
                <Tooltip content={<CustomTooltip unit="steps" />} />
                <ReferenceLine y={8000} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'Goal (8,000)', fill: '#10B981', fontSize: 13 }} />
                <Bar dataKey="steps" name="Steps" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Active Exercise Duration */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">Active Exercise Time</h3>
                <p className="text-[15px] text-slate-500 dark:text-slate-400">Target: 30 minutes a day</p>
              </div>
            </div>
            <span className="text-[17px] font-mono font-bold text-cyan-500">55 Mins Latest</span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SAMPLE_DAILY_VITALS_7D}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                <XAxis dataKey="dayName" stroke="#64748B" fontSize={13} />
                <YAxis domain={[0, 70]} stroke="#64748B" fontSize={13} />
                <Tooltip content={<CustomTooltip unit="mins" />} />
                <ReferenceLine y={30} stroke="#06B6D4" strokeDasharray="4 4" label={{ value: 'Daily Goal (30m)', fill: '#06B6D4', fontSize: 13 }} />
                <Bar dataKey="exerciseMins" name="Exercise Minutes" fill="#06B6D4" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <DisclaimerBanner text="Notice: These trends help you observe changes in your everyday body signals over time. Always discuss your readings with a licensed healthcare provider." />
    </div>
  );
}
