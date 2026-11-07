import React, { useState } from 'react';
import { X, CheckCircle, Plus, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';

export default function ManualEntryModal({ isOpen, onClose, onAddReading }) {
  const { isDark } = useTheme();

  const [form, setForm] = useState({
    protein: 5,
    specificGravity: 1.018,
    pH: 6.4,
    glucose: 0,
    leukocytes: 0,
    ketones: 0,
    sampleType: 'First morning',
    notes: 'Routine test session. Well-hydrated.'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      protein: Number(form.protein),
      specificGravity: Number(form.specificGravity),
      pH: Number(form.pH),
      glucose: Number(form.glucose),
      leukocytes: Number(form.leukocytes),
      ketones: Number(form.ketones),
      sampleType: form.sampleType,
      notes: form.notes,
      confirmed: true,
      flagged: Number(form.protein) > 20
    };

    onAddReading(newEntry);

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: isDark ? ['#c5a880', '#10b981', '#ffffff'] : ['#b45309', '#059669', '#1e293b']
      });
    } catch (err) {}

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-xl border rounded-2xl shadow-2xl overflow-hidden my-8 ${
        isDark ? 'bg-[#090e18] border-amber-400/30' : 'bg-white border-amber-300 shadow-[0_20px_60px_rgba(0,0,0,0.12)]'
      }`}>
        
        {/* Top Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'bg-slate-900 border-white/10' : 'bg-[#faf8f5] border-slate-200'
        }`}>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <h3 className={`font-cinzel text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Manual Test Strip Log (Slide 3 & 5)
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Enter readings directly by hand from any supported commercial 10-parameter test strip. All values will be plotted immediately on your personal trajectory.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-mono-code uppercase mb-1 font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Protein (mg/dL)
              </label>
              <select
                value={form.protein}
                onChange={(e) => setForm({ ...form, protein: Number(e.target.value) })}
                className={`w-full p-2.5 rounded-xl border text-xs font-mono-code ${
                  isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value={0}>Negative (0 mg/dL)</option>
                <option value={5}>Trace (5 mg/dL)</option>
                <option value={15}>Trace High (15 mg/dL)</option>
                <option value={32}>1+ (30-32 mg/dL) [Spike]</option>
                <option value={100}>2+ (100 mg/dL)</option>
                <option value={300}>3+ (300 mg/dL)</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-mono-code uppercase mb-1 font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Specific Gravity
              </label>
              <select
                value={form.specificGravity}
                onChange={(e) => setForm({ ...form, specificGravity: Number(e.target.value) })}
                className={`w-full p-2.5 rounded-xl border text-xs font-mono-code ${
                  isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value={1.005}>1.005 (Dilute / High Hydration)</option>
                <option value={1.015}>1.015 (Healthy)</option>
                <option value={1.018}>1.018 (Optimal Baseline)</option>
                <option value={1.025}>1.025 (Concentrated)</option>
                <option value={1.028}>1.028 (High / Post-Workout)</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-mono-code uppercase mb-1 font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                pH Level
              </label>
              <select
                value={form.pH}
                onChange={(e) => setForm({ ...form, pH: Number(e.target.value) })}
                className={`w-full p-2.5 rounded-xl border text-xs font-mono-code ${
                  isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value={5.5}>5.5 (Acidic)</option>
                <option value={6.0}>6.0 (Normal)</option>
                <option value={6.4}>6.4 (Standard Baseline)</option>
                <option value={7.0}>7.0 (Neutral)</option>
                <option value={7.5}>7.5 (Alkaline)</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-mono-code uppercase mb-1 font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Glucose (mg/dL)
              </label>
              <select
                value={form.glucose}
                onChange={(e) => setForm({ ...form, glucose: Number(e.target.value) })}
                className={`w-full p-2.5 rounded-xl border text-xs font-mono-code ${
                  isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value={0}>Negative (0 mg/dL)</option>
                <option value={50}>Trace (50 mg/dL)</option>
                <option value={100}>Positive (100 mg/dL)</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-mono-code uppercase mb-1 font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Ketones (mg/dL)
              </label>
              <select
                value={form.ketones}
                onChange={(e) => setForm({ ...form, ketones: Number(e.target.value) })}
                className={`w-full p-2.5 rounded-xl border text-xs font-mono-code ${
                  isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value={0}>Negative (0 mg/dL)</option>
                <option value={5}>Trace (5 mg/dL)</option>
                <option value={15}>Moderate (15 mg/dL)</option>
                <option value={40}>High (40 mg/dL)</option>
              </select>
            </div>

            <div>
              <label className={`block text-xs font-mono-code uppercase mb-1 font-semibold ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Leukocytes (Leu/µL)
              </label>
              <select
                value={form.leukocytes}
                onChange={(e) => setForm({ ...form, leukocytes: Number(e.target.value) })}
                className={`w-full p-2.5 rounded-xl border text-xs font-mono-code ${
                  isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value={0}>Negative (0 Leu/µL)</option>
                <option value={15}>Trace (15 Leu/µL)</option>
                <option value={70}>Positive (70 Leu/µL)</option>
              </select>
            </div>
          </div>

          <div>
            <label className={`block text-xs font-mono-code uppercase mb-1 font-semibold ${
              isDark ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Contextual Notes (Exercise, Hydration, Food)
            </label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={`w-full p-2.5 rounded-xl border text-xs ${
                isDark ? 'bg-slate-950 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
              placeholder="e.g. Post-marathon workout, 14hr fasting"
            />
          </div>

          <div className={`p-3 rounded-xl border text-[11px] font-mono-code flex items-center space-x-2 ${
            isDark ? 'bg-amber-950/20 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
            <span>Audit Guarantee: You are confirming these values before saving. No auto-diagnosis.</span>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-mono-code border ${
                isDark ? 'border-white/10 text-slate-400 hover:text-white' : 'border-slate-300 text-slate-600 hover:text-slate-900'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono-code font-bold uppercase tracking-wider transition-colors shadow-md flex items-center space-x-1.5"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Confirm & Append to Trajectory</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
