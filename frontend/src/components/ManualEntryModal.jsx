import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useTheme } from '../context/ThemeContext';
import { trajectoryStorage } from '../services/trajectoryStorage.js';

export default function ManualEntryModal({ isOpen, onClose, onSave, onAddReading, activePatientId }) {
  const { isDark } = useTheme();

  const [form, setForm] = useState({
    protein: 5,
    specificGravity: 1.018,
    pH: 6.4,
    glucose: 0,
    leukocytes: 0,
    ketones: 0,
    nitrite: 0,
    blood: 0,
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
      nitrite: Number(form.nitrite || 0),
      blood: Number(form.blood || 0),
      sampleType: form.sampleType,
      notes: form.notes,
      confirmed: true,
      flagged: Number(form.protein) > 20
    };

    const targetId = activePatientId || trajectoryStorage.getActivePatientId();
    trajectoryStorage.addReading(targetId, newEntry);

    const callback = onSave || onAddReading;
    if (callback) {
      callback(newEntry);
    }

    try {
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3D291A', '#A9D6F5', '#E5DACB', '#846752']
      });
    } catch (err) { }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-xl border rounded-2xl shadow-2xl overflow-hidden my-8 ${isDark ? 'bg-[#18100A] border-[#E5DACB]/30' : 'bg-[#FAF6EE] border-[#E5DACB]'
        }`}>

        {/* Top Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'bg-[#2A0B10] border-[#E5DACB]/20' : 'bg-white border-[#E5DACB]'
          }`}>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A9D6F5]"></span>
            <h3 className="text-base font-bold text-[#3D291A] dark:text-[#FAF6EE]">
              Manual Reagent Strip Entry & Audit Log
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors text-[#846752] hover:text-[#3D291A] dark:hover:text-[#FAF6EE] hover:bg-[#E5DACB]/20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          <p className="text-xs text-[#846752]">
            Enter readings directly by hand from any supported commercial 10-parameter test strip. All values will be plotted immediately on your personal trajectory.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase mb-1 font-semibold text-[#3D291A] dark:text-[#FAF6EE]">
                Protein (mg/dL)
              </label>
              <select
                value={form.protein}
                onChange={(e) => setForm({ ...form, protein: Number(e.target.value) })}
                className={`w-full p-2.5 rounded-xl border text-xs font-mono ${isDark ? 'bg-[#18100A] border-[#E5DACB]/30 text-white' : 'bg-white border-[#E5DACB] text-[#3D291A]'
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
              <label className="block text-xs font-mono uppercase mb-1 font-semibold text-[#3D291A] dark:text-[#FAF6EE]">
                Specific Gravity
              </label>
              <select
                value={form.specificGravity}
                onChange={(e) => setForm({ ...form, specificGravity: Number(e.target.value) })}
                className={`w-full p-2.5 rounded-xl border text-xs font-mono ${isDark ? 'bg-[#18100A] border-[#E5DACB]/30 text-white' : 'bg-white border-[#E5DACB] text-[#3D291A]'
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
              <label className="block text-xs font-mono uppercase mb-1 font-semibold text-[#3D291A] dark:text-[#FAF6EE]">
                pH Level
              </label>
              <select
                value={form.pH}
                onChange={(e) => setForm({ ...form, pH: Number(e.target.value) })}
                className={`w-full p-2.5 rounded-xl border text-xs font-mono ${isDark ? 'bg-[#18100A] border-[#E5DACB]/30 text-white' : 'bg-white border-[#E5DACB] text-[#3D291A]'
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
              <label className="block text-xs font-mono uppercase mb-1 font-semibold text-[#3D291A] dark:text-[#FAF6EE]">
                Glucose (mg/dL)
              </label>
              <select
                value={form.glucose}
                onChange={(e) => setForm({ ...form, glucose: Number(e.target.value) })}
                className={`w-full p-2.5 rounded-xl border text-xs font-mono ${isDark ? 'bg-[#18100A] border-[#E5DACB]/30 text-white' : 'bg-white border-[#E5DACB] text-[#3D291A]'
                  }`}
              >
                <option value={0}>Negative (0 mg/dL)</option>
                <option value={50}>Trace (50 mg/dL)</option>
                <option value={100}>Positive (100 mg/dL)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase mb-1 font-semibold text-[#3D291A] dark:text-[#FAF6EE]">
                Ketones (mg/dL)
              </label>
              <select
                value={form.ketones}
                onChange={(e) => setForm({ ...form, ketones: Number(e.target.value) })}
                className={`w-full p-2.5 rounded-xl border text-xs font-mono ${isDark ? 'bg-[#18100A] border-[#E5DACB]/30 text-white' : 'bg-white border-[#E5DACB] text-[#3D291A]'
                  }`}
              >
                <option value={0}>Negative (0 mg/dL)</option>
                <option value={5}>Trace (5 mg/dL)</option>
                <option value={15}>Moderate (15 mg/dL)</option>
                <option value={40}>High (40 mg/dL)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase mb-1 font-semibold text-[#3D291A] dark:text-[#FAF6EE]">
                Leukocytes (Leu/µL)
              </label>
              <select
                value={form.leukocytes}
                onChange={(e) => setForm({ ...form, leukocytes: Number(e.target.value) })}
                className={`w-full p-2.5 rounded-xl border text-xs font-mono ${isDark ? 'bg-[#18100A] border-[#E5DACB]/30 text-white' : 'bg-white border-[#E5DACB] text-[#3D291A]'
                  }`}
              >
                <option value={0}>Negative (0 Leu/µL)</option>
                <option value={15}>Trace (15 Leu/µL)</option>
                <option value={70}>Positive (70 Leu/µL)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase mb-1 font-semibold text-[#3D291A] dark:text-[#FAF6EE]">
              Contextual Notes (Exercise, Hydration, Food)
            </label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={`w-full p-2.5 rounded-xl border text-xs ${isDark ? 'bg-[#18100A] border-[#E5DACB]/30 text-white' : 'bg-white border-[#E5DACB] text-[#3D291A]'
                }`}
              placeholder="e.g. Post-marathon workout, 14hr fasting"
            />
          </div>

          <div className={`p-3 rounded-xl border text-[11px] font-mono flex items-center space-x-2 ${isDark ? 'bg-[#2A0B10] border-[#E5DACB]/30 text-[#FAF6EE]' : 'bg-white border-[#E5DACB] text-[#3D291A]'
            }`}>
            <AlertCircle className="w-4 h-4 shrink-0 text-[#A9D6F5]" />
            <span>Audit Guarantee: You are confirming these values before saving. No auto-diagnosis.</span>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-mono border ${isDark ? 'border-[#E5DACB]/30 text-[#E5DACB] hover:bg-[#2A0B10]' : 'border-[#E5DACB] text-[#3D291A] hover:bg-white'
                }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#A9D6F5]-[#7CBFEA]-[#1F150E] text-xs font-mono font-bold uppercase tracking-wider transition-all shadow-sm flex items-center space-x-1.5"
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
