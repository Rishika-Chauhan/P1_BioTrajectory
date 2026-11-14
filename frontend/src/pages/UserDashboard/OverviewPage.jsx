import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Heart,
  Footprints,
  Clock,
  Droplet,
  Plus,
  Bot,
  QrCode,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Stethoscope,
  FileText,
  Bluetooth,
  RefreshCw,
  Activity,
  Settings as SettingsIcon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SAMPLE_DAILY_VITALS_7D } from '../../data/vitalsData';
import { BluetoothService } from '../../services/bluetoothService';
import AnimatedCounter from '../../components/common/AnimatedCounter';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function OverviewPage() {
  const { currentUser } = useAuth();
  const fallback = SAMPLE_DAILY_VITALS_7D[SAMPLE_DAILY_VITALS_7D.length - 1];

  const [latestVitals, setLatestVitals] = useState(() => {
    const saved = BluetoothService.getLatestVitals();
    return { ...fallback, ...saved };
  });

  const [isUrineDeviceEnabled, setIsUrineDeviceEnabled] = useState(() => BluetoothService.isUrineDeviceEnabled());
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  useEffect(() => {
    const handleVitalsUpdate = (e) => {
      if (e.detail) {
        setLatestVitals(prev => ({ ...prev, ...e.detail }));
      }
    };
    const handleUrineModeUpdate = (e) => {
      if (typeof e.detail === 'boolean') {
        setIsUrineDeviceEnabled(e.detail);
      }
    };
    window.addEventListener('biotrajectory_vitals_updated', handleVitalsUpdate);
    window.addEventListener('biotrajectory_urine_mode_updated', handleUrineModeUpdate);
    return () => {
      window.removeEventListener('biotrajectory_vitals_updated', handleVitalsUpdate);
      window.removeEventListener('biotrajectory_urine_mode_updated', handleUrineModeUpdate);
    };
  }, []);

  const handleToggleUrineDevice = (newMode) => {
    setIsUrineDeviceEnabled(newMode);
    BluetoothService.setUrineDeviceEnabled(newMode);
  };

  const handleQuickSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Reading BLE...');
    try {
      const res = await BluetoothService.syncAllConnectedDevices();
      const updated = BluetoothService.getLatestVitals();
      setLatestVitals(prev => ({ ...prev, ...updated }));
      setSyncStatus(`Synced (${res.syncedCount || 3} devices)`);
      setTimeout(() => setSyncStatus(null), 3000);
    } catch {
      setSyncStatus('Sync error');
      setTimeout(() => setSyncStatus(null), 3000);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* 1. Header Greeting & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome back, {currentUser?.name?.split(' ')[0] || 'Pranjal'}
            </h1>
            <span className="text-[13px] font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/25">
              Active Tracking
            </span>
          </div>
          <p className="text-[16px] text-slate-600 dark:text-slate-400">
            Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5">
          <Link
            to="/dashboard/devices"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-[15px] font-bold bg-cyan-500/15 text-cyan-500 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/25 transition-all cursor-pointer active:scale-95"
            title="Bluetooth Devices"
          >
            <Bluetooth className="w-5 h-5 animate-pulse" />
            <span>Connected Devices</span>
          </Link>
          <Link
            to="/dashboard/reports"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[15px] font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/20 active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Add Today's Reading</span>
          </Link>
          <Link
            to="/dashboard/assistant"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[15px] font-semibold glass-card text-slate-800 dark:text-slate-200 hover:border-cyan-500/50 transition-all cursor-pointer active:scale-95"
          >
            <Bot className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            <span>Ask Health AI</span>
          </Link>
          <Link
            to="/dashboard/qr"
            className="p-3 rounded-2xl glass-card text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/50 transition-all cursor-pointer active:scale-95"
            title="My Health QR"
          >
            <QrCode className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Bluetooth Live Telemetry Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-indigo-950/40 border border-cyan-500/30 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg shadow-cyan-950/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 relative shrink-0">
            <Bluetooth className="w-7 h-7 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-sm" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-extrabold text-[17px] text-slate-900 dark:text-white">
                Live Bluetooth Health Peripherals
              </h3>
              <span className="text-[12px] px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                BLE Active Stream
              </span>
            </div>
            <p className="text-[14px] text-slate-600 dark:text-slate-400">
              Synced with <strong className="text-cyan-400">Omron Evolv Cuff</strong> (BP), <strong className="text-emerald-400">Apple Watch / Garmin</strong> (Steps & Heart Rate), and <strong className="text-blue-400">10SG Optical Urine Analyzer</strong> (Proteins & SG).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleQuickSync}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[14px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/35 hover:bg-cyan-500/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{syncStatus || (isSyncing ? 'Retrieving BLE...' : 'Sync BLE Now')}</span>
          </button>
          <Link
            to="/dashboard/devices"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-[14px] font-bold bg-slate-800/80 hover:bg-slate-700/80 text-white transition-all border border-slate-700 cursor-pointer"
          >
            <span>Device Hub</span>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </Link>
        </div>
      </motion.div>

      {/* 2. Key Daily Cards Grid with Large Readable Text & Smooth Micro-Interactions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Blood Pressure Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="p-7 rounded-3xl glass-card glass-card-hover space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-bold text-slate-500 dark:text-slate-400">
              Blood Pressure
            </span>
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                <AnimatedCounter value={latestVitals.systolic} />/<AnimatedCounter value={latestVitals.diastolic} />
              </span>
              <span className="text-[15px] text-slate-400 font-sans">mmHg</span>
            </div>
            <p className="text-[15px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" />
              <span>Healthy resting range</span>
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[14px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
            <span>Resting Pulse:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
              <AnimatedCounter value={latestVitals.pulse} /> BPM
            </span>
          </div>
        </motion.div>

        {/* Daily Walking Steps */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="p-7 rounded-3xl glass-card glass-card-hover space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-bold text-slate-500 dark:text-slate-400">
              Daily Walking Steps
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Footprints className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                <AnimatedCounter value={latestVitals.steps} />
              </span>
              <span className="text-[15px] text-slate-400 font-sans">/ 8,000</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((latestVitals.steps / 8000) * 100, 100)}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="bg-emerald-500 h-full rounded-full"
              />
            </div>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[14px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
            <span>Distance:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">{latestVitals.distance} km</span>
          </div>
        </motion.div>

        {/* Active Exercise Time */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="p-7 rounded-3xl glass-card glass-card-hover space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-bold text-slate-500 dark:text-slate-400">
              Exercise Time
            </span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                <AnimatedCounter value={latestVitals.exerciseMins} />
              </span>
              <span className="text-[15px] text-slate-400 font-sans">minutes</span>
            </div>
            <p className="text-[15px] text-cyan-600 dark:text-cyan-400 font-semibold mt-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Surpassed 30-min goal</span>
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[14px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
            <span>Goal Status:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">On Track</span>
          </div>
        </motion.div>

        {/* Blood Oxygen Saturation (SpO2) Card - Common on Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.24 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="p-7 rounded-3xl glass-card glass-card-hover space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-bold text-slate-500 dark:text-slate-400">
              Blood Oxygen (SpO2)
            </span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-500" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                <AnimatedCounter value={latestVitals.spo2 || 98} />
              </span>
              <span className="text-[15px] text-slate-400 font-sans">%</span>
            </div>
            <p className="text-[15px] text-emerald-600 dark:text-emerald-400 font-semibold mt-2 flex items-center gap-1.5">
              <TrendingDown className="w-4 h-4" />
              <span>Optimal resting oxygenation</span>
            </p>
          </div>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[14px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
            <span>Resting Oximeter:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">Continuous Stream</span>
          </div>
        </motion.div>
      </div>

      {/* 3. Urine Diagnostic Telemetry Section - Showing Last Latest Recorded Readings */}
      {isUrineDeviceEnabled ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-7 sm:p-8 rounded-3xl glass-card space-y-6 border border-cyan-500/25 shadow-md"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Droplet className="w-6 h-6 text-cyan-500" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Urine Diagnostic Telemetry
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Last Latest Recorded Readings
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-semibold border border-cyan-500/20">
                    Recorded: Today 08:30 AM
                  </span>
                </div>
                <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1">
                  Last recorded spectral biomarker readings from your paired 10SG Optical Urine Analyzer.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Quick inline toggle to switch OFF & hide readings */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Readings ON</span>
                <button
                  type="button"
                  onClick={() => handleToggleUrineDevice(false)}
                  className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-emerald-500"
                  title="Switch OFF to hide readings"
                >
                  <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out" />
                </button>
              </div>

              <Link
                to="/dashboard/settings"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 bg-slate-100 dark:bg-slate-800/80 px-3 py-2 rounded-xl transition-colors shrink-0"
                title="Open Settings"
              >
                <SettingsIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Settings</span>
              </Link>
            </div>
          </div>

          {/* 4 Dedicated Biomarker Cards: Protein, pH Level, Glucose, Nitrite Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Protein Reading */}
            <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#070B14]/90 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-cyan-500/30 transition-all shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Protein (Albumin)
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {latestVitals.urineProtein || 'Negative'}
                </span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {latestVitals.urineProteinMg ? `${latestVitals.urineProteinMg} mg/dL` : '0 mg/dL'}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Glomerular barrier intact
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Last Recorded:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">Negative (&lt;15 mg/dL)</span>
              </div>
            </div>

            {/* 2. pH Level Reading */}
            <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#070B14]/90 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-cyan-500/30 transition-all shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  pH Level
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  Optimal
                </span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                  {latestVitals.urinePH || '6.5'}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Balanced healthy corridor
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Last Recorded:</span>
                <span className="font-semibold text-cyan-600 dark:text-cyan-400">6.5 pH</span>
              </div>
            </div>

            {/* 3. Glucose Reading */}
            <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#070B14]/90 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-cyan-500/30 transition-all shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Glucose Level
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Normal
                </span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {latestVitals.urineGlucose || 'Negative (0 mg/dL)'}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Zero renal spillage detected
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Last Recorded:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">0 mg/dL (Negative)</span>
              </div>
            </div>

            {/* 4. Nitrite Level Reading */}
            <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#070B14]/90 border border-slate-200 dark:border-slate-800 space-y-3 hover:border-cyan-500/30 transition-all shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Nitrite Level
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Clean
                </span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {latestVitals.urineNitrites || 'Negative'}
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  Zero bacterial nitrites detected
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>Last Recorded:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Negative (0 presence)</span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* When Urine Device is Switched OFF: Readings are hidden with an option to toggle them back on */
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="p-6 sm:p-7 rounded-3xl bg-slate-50/90 dark:bg-[#070B14]/90 border border-dashed border-slate-300 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 flex items-center justify-center shrink-0">
              <Droplet className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-[16px]">
                  Urine Diagnostic Readings (Switched OFF)
                </h3>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                  Readings Hidden
                </span>
              </div>
              <p className="text-[13px] text-slate-500 dark:text-slate-400">
                Last recorded readings for <strong>Protein</strong>, <strong>pH Level</strong>, <strong>Glucose</strong>, and <strong>Nitrite Level</strong> are hidden.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Direct Interactive Toggle Switch to turn readings back ON */}
            <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-xs">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Toggle ON:</span>
              <button
                type="button"
                onClick={() => handleToggleUrineDevice(true)}
                className="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600"
                title="Toggle Urine Device ON to show readings"
              >
                <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleToggleUrineDevice(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Droplet className="w-3.5 h-3.5 text-slate-950" />
              <span>Show Latest Readings</span>
            </button>

            <Link
              to="/dashboard/settings"
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              title="Open Settings"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              <span>Settings</span>
            </Link>
          </div>
        </motion.div>
      )}

      {/* 4. Helpful Health Summary & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Helpful Health Summary (7 cols) */}
        <div className="lg:col-span-7 p-8 rounded-3xl glass-card space-y-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Helpful Health Summary</h2>
                  <p className="text-[14px] text-emerald-600 dark:text-emerald-400 font-medium">All numbers look steady</p>
                </div>
              </div>

              <Link
                to="/dashboard/analytics"
                className="text-[14px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Full History on My Health</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 border border-slate-200 dark:border-slate-800 text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
              <p>
                "Your weekly blood pressure averaged <strong className="text-cyan-600 dark:text-cyan-300 font-mono">124 / 81 mmHg</strong>, which is in a good range. Blood oxygen remained solid at <strong className="text-emerald-600 dark:text-emerald-400 font-mono">98% SpO2</strong>. You also met your daily walking goal on 6 out of 7 days."
              </p>
              <p className="text-[14px] text-slate-500 dark:text-slate-400">
                Tip: Drink a glass of water after waking up tomorrow morning to keep your hydration steady.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
            <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Want to review daily history logs and trend charts?
            </span>
            <Link
              to="/dashboard/analytics"
              className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Go to My Health</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Quick Consult & Records (5 cols) */}
        <div className="lg:col-span-5 p-8 rounded-3xl glass-card space-y-5 flex flex-col justify-between shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Quick Consult & Records</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Connect with clinicians or review clinical uploads</p>
          </div>

          <div className="space-y-3 pt-2">
            <Link
              to="/dashboard/consultation"
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 hover:border-cyan-500/50 border border-slate-200 dark:border-slate-800 text-[15px] font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Stethoscope className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                <span>Talk to a Doctor Online</span>
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>
            <Link
              to="/dashboard/history"
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 hover:border-cyan-500/50 border border-slate-200 dark:border-slate-800 text-[15px] font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <span>Upload Your Reports</span>
              </span>
              <ChevronRight className="w-5 h-5 text-slate-400" />
            </Link>
            <Link
              to="/dashboard/settings"
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 hover:border-cyan-500/50 border border-slate-200 dark:border-slate-800 text-[15px] font-semibold text-slate-800 dark:text-slate-200 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <SettingsIcon className="w-5 h-5 text-[#00685f] dark:text-[#6bd8cb]" />
                <span>Urine Device Settings</span>
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
