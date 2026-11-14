import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Download,
  Heart,
  Footprints,
  Clock,
  Droplet,
  CheckCircle2,
  FileSpreadsheet,
  X,
  Bluetooth,
  RefreshCw
} from 'lucide-react';
import { SAMPLE_DAILY_VITALS_7D } from '../../data/vitalsData';
import { BluetoothService } from '../../services/bluetoothService';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function DailyReportsPage() {
  const [viewMode, setViewMode] = useState('daily');
  const [selectedDate, setSelectedDate] = useState('2026-11-07');
  const [records, setRecords] = useState(SAMPLE_DAILY_VITALS_7D);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isImportingBLE, setIsImportingBLE] = useState(false);

  // New reading form state with simple terms
  const [newReading, setNewReading] = useState({
    date: new Date().toISOString().split('T')[0],
    systolic: '120',
    diastolic: '80',
    pulse: '70',
    steps: '8500',
    distance: '5.9',
    exerciseMins: '30',
    urineProteinMg: '0',
    urineSG: '1.018',
    urinePH: '6.5',
    notes: 'Routine evening check'
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleImportFromBluetooth = async () => {
    setIsImportingBLE(true);
    try {
      await BluetoothService.syncAllConnectedDevices();
      const vitals = BluetoothService.getLatestVitals();
      setNewReading(prev => ({
        ...prev,
        systolic: String(vitals.systolic || prev.systolic),
        diastolic: String(vitals.diastolic || prev.diastolic),
        pulse: String(vitals.pulse || prev.pulse),
        steps: String(vitals.steps || prev.steps),
        distance: String(vitals.distance || prev.distance),
        exerciseMins: String(vitals.exerciseMins || prev.exerciseMins),
        urineProteinMg: String(vitals.urineProteinMg ?? prev.urineProteinMg),
        urineSG: String(vitals.urineSG || prev.urineSG),
        urinePH: String(vitals.urinePH || prev.urinePH),
        notes: `Imported via Bluetooth (${vitals.urineSource || 'Omron Cuff + Watch + Optical Analyzer'})`
      }));
      showToast('Imported readings from connected Bluetooth devices!');
    } catch {
      const vitals = BluetoothService.getLatestVitals();
      setNewReading(prev => ({
        ...prev,
        systolic: String(vitals.systolic || prev.systolic),
        diastolic: String(vitals.diastolic || prev.diastolic),
        pulse: String(vitals.pulse || prev.pulse),
        steps: String(vitals.steps || prev.steps),
        distance: String(vitals.distance || prev.distance),
        exerciseMins: String(vitals.exerciseMins || prev.exerciseMins),
        urineProteinMg: String(vitals.urineProteinMg ?? prev.urineProteinMg),
        urineSG: String(vitals.urineSG || prev.urineSG),
        urinePH: String(vitals.urinePH || prev.urinePH),
        notes: 'Imported from Bluetooth cached telemetry'
      }));
      showToast('Loaded latest cached Bluetooth telemetry!');
    } finally {
      setIsImportingBLE(false);
    }
  };

  const handleAddReading = (e) => {
    e.preventDefault();
    const entry = {
      date: newReading.date,
      dayName: 'Today',
      systolic: Number(newReading.systolic),
      diastolic: Number(newReading.diastolic),
      pulse: Number(newReading.pulse),
      steps: Number(newReading.steps),
      distance: Number(newReading.distance),
      exerciseMins: Number(newReading.exerciseMins),
      urineProteinMg: Number(newReading.urineProteinMg),
      urineSG: Number(newReading.urineSG),
      urinePH: Number(newReading.urinePH),
      notes: newReading.notes
    };

    setRecords([entry, ...records]);
    setModalOpen(false);
    showToast('Your health reading was saved successfully!');
  };

  const handleExportPDF = () => {
    showToast('Preparing your simple PDF health summary...');
  };

  const handleExportCSV = () => {
    showToast('Downloaded health data CSV spreadsheet.');
  };

  const currentRecord = records.find(r => r.date === selectedDate) || records[0];

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-[16px] shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Day
          </h1>
          <p className="text-[17px] text-slate-600 dark:text-slate-400 mt-1">
            Keep track of your blood pressure, daily steps, and simple home tests
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[17px] font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Add Today's Reading</span>
          </button>
          
          <div className="flex items-center gap-2 bg-white dark:bg-[#101827] border border-slate-300 dark:border-slate-800 rounded-2xl p-1.5 shadow-sm">
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 rounded-xl text-[16px] font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-500 flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>PDF Report</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 rounded-xl text-[16px] font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-500 flex items-center gap-2 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Spreadsheet</span>
            </button>
          </div>
        </div>
      </div>

      {/* View Mode & Date Selector */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        {/* Toggle Mode */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-[16px] font-semibold">
          <button
            onClick={() => setViewMode('daily')}
            className={`px-5 py-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'daily'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Daily View
          </button>
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-5 py-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'weekly'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-5 py-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'monthly'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Monthly View
          </button>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-3 text-[16px]">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <Calendar className="w-5 h-5 text-cyan-500" /> Select Day:
          </span>
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-[16px] font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
          >
            {records.map((r, i) => (
              <option key={i} value={r.date}>
                {r.date} ({r.dayName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Day Primary Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Blood Pressure Detail */}
        <div className="p-7 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-bold text-slate-500 dark:text-slate-400">Blood Pressure</span>
            <Heart className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
            {currentRecord.systolic} / {currentRecord.diastolic}
            <span className="text-[16px] text-slate-400 font-sans ml-1.5 font-normal">mmHg</span>
          </p>
          <div className="text-[15px] text-slate-600 dark:text-slate-400 space-y-1 pt-1">
            <p>Heart Rate: <strong className="text-slate-800 dark:text-slate-200 font-mono">{currentRecord.pulse} BPM</strong></p>
            <p className="text-emerald-500 font-semibold">Standard target: Under 120/80</p>
          </div>
        </div>

        {/* Steps & Distance */}
        <div className="p-7 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-bold text-slate-500 dark:text-slate-400">Daily Walk</span>
            <Footprints className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
            {currentRecord.steps.toLocaleString()}
            <span className="text-[16px] text-slate-400 font-sans ml-1.5 font-normal">steps</span>
          </p>
          <div className="text-[15px] text-slate-600 dark:text-slate-400 space-y-1 pt-1">
            <p>Distance Walked: <strong className="text-slate-800 dark:text-slate-200 font-mono">{currentRecord.distance} km</strong></p>
            <p className="text-cyan-500 font-semibold">Daily goal: 8,000 steps</p>
          </div>
        </div>

        {/* Physical Exercise */}
        <div className="p-7 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-bold text-slate-500 dark:text-slate-400">Exercise Time</span>
            <Clock className="w-5 h-5 text-cyan-500" />
          </div>
          <p className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
            {currentRecord.exerciseMins}
            <span className="text-[16px] text-slate-400 font-sans ml-1.5 font-normal">minutes</span>
          </p>
          <div className="text-[15px] text-slate-600 dark:text-slate-400 space-y-1 pt-1">
            <p>Intensity: <strong className="text-slate-800 dark:text-slate-200">Moderate / Aerobic</strong></p>
            <p className="text-emerald-500 font-semibold">Goal: At least 30 mins</p>
          </div>
        </div>

        {/* Kidney Filter & Hydration */}
        <div className="p-7 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-bold text-slate-500 dark:text-slate-400">Kidney Test Strip</span>
            <Droplet className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-500 font-mono">
            {currentRecord.urineProteinMg === 0 ? 'Clean (0 mg)' : `Trace (${currentRecord.urineProteinMg} mg)`}
          </p>
          <div className="text-[15px] text-slate-600 dark:text-slate-400 space-y-1 pt-1">
            <p>Hydration Balance: <strong className="text-emerald-500">Healthy</strong></p>
            <p>Clean kidney filter check</p>
          </div>
        </div>
      </div>

      {/* Historical Records Table with Large Readable Font */}
      <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Your Past Daily Logs</h2>
          <span className="text-[15px] text-slate-500 dark:text-slate-400 font-medium">{records.length} Saved Days</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[16px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
                <th className="py-4 px-4">Date</th>
                <th className="py-4 px-4">Blood Pressure</th>
                <th className="py-4 px-4">Heart Rate</th>
                <th className="py-4 px-4">Steps Walked</th>
                <th className="py-4 px-4">Distance</th>
                <th className="py-4 px-4">Exercise Time</th>
                <th className="py-4 px-4">Urine Protein</th>
                <th className="py-4 px-4">Overall Look</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {records.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                    {row.date}
                  </td>
                  <td className="py-4 px-4 text-cyan-600 dark:text-cyan-400 font-bold font-mono">
                    {row.systolic} / {row.diastolic} mmHg
                  </td>
                  <td className="py-4 px-4 font-mono text-slate-700 dark:text-slate-300">
                    {row.pulse} BPM
                  </td>
                  <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                    {row.steps.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-mono">
                    {row.distance} km
                  </td>
                  <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-mono">
                    {row.exerciseMins} mins
                  </td>
                  <td className="py-4 px-4 text-slate-700 dark:text-slate-300">
                    {row.urineProteinMg === 0 ? 'Clean (0)' : `Trace (${row.urineProteinMg})`}
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-[14px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
                      Healthy
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Reading Modal with Simple Labels */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-xl p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Record Today's Health Numbers</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-white cursor-pointer">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Bluetooth Import Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/40 to-indigo-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                  <Bluetooth className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-[15px]">Smart Device Quick-Import</h4>
                  <p className="text-[13px] text-slate-500 dark:text-slate-400">Fill instantly from connected BP Cuff, Smart Watch & Urine Analyzer</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleImportFromBluetooth}
                disabled={isImportingBLE}
                className="px-4 py-2 rounded-xl text-[14px] font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shrink-0 shadow-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isImportingBLE ? 'animate-spin' : ''}`} />
                <span>{isImportingBLE ? 'Syncing...' : 'Import from BLE'}</span>
              </button>
            </div>

            <form onSubmit={handleAddReading} className="space-y-5 text-[16px]">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Date</label>
                  <input
                    type="date"
                    value={newReading.date}
                    onChange={e => setNewReading({ ...newReading, date: e.target.value })}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Heart Rate (Pulse BPM)</label>
                  <input
                    type="number"
                    value={newReading.pulse}
                    onChange={e => setNewReading({ ...newReading, pulse: e.target.value })}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Top Number (Systolic)</label>
                  <input
                    type="number"
                    value={newReading.systolic}
                    onChange={e => setNewReading({ ...newReading, systolic: e.target.value })}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Bottom Number (Diastolic)</label>
                  <input
                    type="number"
                    value={newReading.diastolic}
                    onChange={e => setNewReading({ ...newReading, diastolic: e.target.value })}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Steps Walked</label>
                  <input
                    type="number"
                    value={newReading.steps}
                    onChange={e => setNewReading({ ...newReading, steps: e.target.value })}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Distance (km)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newReading.distance}
                    onChange={e => setNewReading({ ...newReading, distance: e.target.value })}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Exercise (mins)</label>
                  <input
                    type="number"
                    value={newReading.exerciseMins}
                    onChange={e => setNewReading({ ...newReading, exerciseMins: e.target.value })}
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              {/* Urine Diagnostic Analyzer Inputs */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-[15px]">
                    <Droplet className="w-4 h-4 text-blue-500" />
                    <span>Urine Analyzer Diagnostic</span>
                  </span>
                  <span className="text-[12px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 dark:text-blue-400 font-mono">
                    Spectrophotometer / Strip
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Protein (mg/dL)</label>
                    <input
                      type="number"
                      value={newReading.urineProteinMg}
                      onChange={e => setNewReading({ ...newReading, urineProteinMg: e.target.value })}
                      placeholder="0"
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#101827] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">Specific Gravity</label>
                    <input
                      type="text"
                      value={newReading.urineSG}
                      onChange={e => setNewReading({ ...newReading, urineSG: e.target.value })}
                      placeholder="1.018"
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#101827] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">pH Level</label>
                    <input
                      type="text"
                      value={newReading.urinePH}
                      onChange={e => setNewReading({ ...newReading, urinePH: e.target.value })}
                      placeholder="6.5"
                      className="w-full p-2.5 rounded-xl bg-white dark:bg-[#101827] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-sm"
                    />
                  </div>
                </div>
                <p className="text-[12px] text-slate-500 dark:text-slate-400">
                  Target baseline: 0 mg/dL (negative), SG 1.010 - 1.025, pH 5.5 - 7.5.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Personal Note (optional)</label>
                <input
                  type="text"
                  value={newReading.notes}
                  onChange={e => setNewReading({ ...newReading, notes: e.target.value })}
                  placeholder="e.g. Drank plenty of water, took a nice morning walk"
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 rounded-2xl text-[16px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-2xl text-[17px] font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-md cursor-pointer"
                >
                  Save My Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <DisclaimerBanner text="Notice: BioTrajectory is for personal tracking and wellness. It does not replace talking to a doctor or getting a personal medical diagnosis." />
    </div>
  );
}
