import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Footprints,
  Clock,
  Droplet,
  Plus,
  Bot,
  QrCode,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Stethoscope,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SAMPLE_DAILY_VITALS_7D } from '../../data/vitalsData';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function OverviewPage() {
  const { currentUser } = useAuth();
  const latest = SAMPLE_DAILY_VITALS_7D[SAMPLE_DAILY_VITALS_7D.length - 1];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* 1. Header Greeting & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {currentUser?.name?.split(' ')[0] || 'Pranjal'}
            </h1>
            <span className="text-[15px] font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25">
              Active
            </span>
          </div>
          <p className="text-[17px] text-slate-600 dark:text-slate-400">
            Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5">
          <Link
            to="/dashboard/reports"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[17px] font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Add Today's Reading</span>
          </Link>
          <Link
            to="/dashboard/assistant"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[17px] font-semibold bg-white dark:bg-[#101827] border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-cyan-500/50 transition-all cursor-pointer"
          >
            <Bot className="w-5 h-5 text-cyan-400" />
            <span>Understand Your Results</span>
          </Link>
          <Link
            to="/dashboard/qr"
            className="p-3.5 rounded-2xl bg-white dark:bg-[#101827] border border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all cursor-pointer"
            title="My QR"
          >
            <QrCode className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* 2. Key Daily Cards Grid with Large Readable Text */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Blood Pressure Card */}
        <div className="p-7 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-bold text-slate-500 dark:text-slate-400">
              Blood Pressure
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                {latest.systolic}/{latest.diastolic}
              </span>
              <span className="text-[16px] text-slate-400 font-sans">mmHg</span>
            </div>
            <p className="text-[16px] text-emerald-500 dark:text-emerald-400 font-semibold mt-2 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" />
              <span>Healthy resting range</span>
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[15px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Resting Pulse:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{latest.pulse} BPM</span>
          </div>
        </div>

        {/* Daily Walking Steps */}
        <div className="p-7 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-bold text-slate-500 dark:text-slate-400">
              Daily Walking Steps
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Footprints className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                {latest.steps.toLocaleString()}
              </span>
              <span className="text-[16px] text-slate-400 font-sans">/ 8,000 goal</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
              <div
                style={{ width: `${Math.min((latest.steps / 8000) * 100, 100)}%` }}
                className="bg-emerald-500 h-full rounded-full"
              />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[15px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Walking Distance:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{latest.distance} km</span>
          </div>
        </div>

        {/* Active Exercise Time */}
        <div className="p-7 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-bold text-slate-500 dark:text-slate-400">
              Exercise Time
            </span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                {latest.exerciseMins}
              </span>
              <span className="text-[16px] text-slate-400 font-sans">minutes</span>
            </div>
            <p className="text-[16px] text-cyan-600 dark:text-cyan-400 font-semibold mt-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Surpassed 30-min goal</span>
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[15px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Weekly Total:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">185 minutes</span>
          </div>
        </div>

        {/* Urine Filter Check */}
        <div className="p-7 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-bold text-slate-500 dark:text-slate-400">
              Kidney Filter Check
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Droplet className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-500 font-mono">
                Clean (0 mg)
              </span>
            </div>
            <p className="text-[16px] text-slate-600 dark:text-slate-300 font-medium mt-2">
              Protein Check: <span className="text-emerald-500 font-bold">Negative</span>
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[15px] text-slate-500 dark:text-slate-400 flex justify-between">
            <span>Hydration Level:</span>
            <span className="font-bold text-emerald-500">Good & Clear</span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Recent Health Timeline & Simple Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Health Timeline (7 cols) */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Recent Health History</h2>
              <p className="text-[16px] text-slate-500 dark:text-slate-400 mt-0.5">Readings from your past few days</p>
            </div>
            <Link
              to="/dashboard/analytics"
              className="text-[16px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View Health Trends</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {SAMPLE_DAILY_VITALS_7D.slice(-4).reverse().map((item, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[16px]"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-slate-900 dark:text-white">{item.date}</span>
                    <span className="text-[14px] px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">
                      {item.dayName}
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
        </div>

        {/* Quick Health Assistant & Next Steps (5 cols) */}
        <div className="lg:col-span-5 p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-500 dark:text-cyan-400 flex items-center justify-center font-bold">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Helpful Health Summary</h2>
                <p className="text-[15px] text-emerald-500 font-medium">All numbers look steady</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-[17px] text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
              <p>
                "Your weekly blood pressure averaged <strong className="text-cyan-600 dark:text-cyan-300 font-mono">124 / 81 mmHg</strong>, which is in a good range. You also met your daily walking goal on 6 out of 7 days."
              </p>
              <p className="text-[15px] text-slate-500 dark:text-slate-400">
                Tip: Drink a glass of water after waking up tomorrow morning to keep your hydration steady.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Link
              to="/dashboard/consultation"
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] hover:border-cyan-500/50 border border-slate-200 dark:border-slate-800 text-[16px] font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-cyan-400" />
                <span>Talk to a Doctor Online</span>
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>
            <Link
              to="/dashboard/history"
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] hover:border-cyan-500/50 border border-slate-200 dark:border-slate-800 text-[16px] font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <span>Upload Your Reports</span>
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      <DisclaimerBanner text="Notice: BioTrajectory helps you track personal body signals and learn about health trends. It does not replace talking to a doctor or getting a personal medical diagnosis." />
    </div>
  );
}
