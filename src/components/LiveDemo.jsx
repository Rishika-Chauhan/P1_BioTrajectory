import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Activity,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  FileText,
  RotateCcw,
  Shield,
  Printer,
  Play,
  Pause,
  RefreshCw,
  ChevronRight,
  Info,
  Download,
  PlusCircle,
  Send,
  Sliders
} from 'lucide-react';
import {
  BIOMARKER_DEFINITIONS,
  SAMPLE_30_DAY_HISTORY,
  SIMULATOR_PRESETS,
  GEMINI_PROMPT_PRESETS
} from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import ManualEntryModal from './ManualEntryModal';

export default function LiveDemo({ onOpenReportModal }) {
  const { isDark } = useTheme();

  // Active demo step tab
  const [activeTab, setActiveTab] = useState('trajectory'); // 'scanner', 'trajectory', 'gemini', 'clinician'

  // Selected Biomarker for Trajectory Chart
  const [selectedBiomarker, setSelectedBiomarker] = useState('protein');
  const [timeRange, setTimeRange] = useState(30); // 7, 14, 30

  // History state allowing live additions
  const [history, setHistory] = useState(SAMPLE_30_DAY_HISTORY);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Manual Entry Modal
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Custom Gemini query input
  const [customGeminiQuery, setCustomGeminiQuery] = useState('');

  // Scanner Simulator State
  const [selectedPreset, setSelectedPreset] = useState(SIMULATOR_PRESETS[1]); // Default to Day 22 spike
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [editedReadings, setEditedReadings] = useState(SIMULATOR_PRESETS[1].readings);
  const [userNotes, setUserNotes] = useState('Evening cross-training session; low fluid intake during afternoon.');

  // Gemini Chat State
  const [selectedGeminiPrompt, setSelectedGeminiPrompt] = useState(GEMINI_PROMPT_PRESETS[0]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ['day', 'date', 'time', 'protein', 'specificGravity', 'pH', 'glucose', 'leukocytes', 'ketones', 'notes', 'flagged'];
    const rows = history.map(h => [
      h.day,
      h.date,
      h.time,
      h.protein,
      h.specificGravity,
      h.pH,
      h.glucose,
      h.leukocytes,
      h.ketones,
      `"${(h.notes || '').replace(/"/g, '""')}"`,
      h.flagged ? 'TRUE' : 'FALSE'
    ].join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BioTrajectory_Patient_BT9428_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Export Handler
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `BioTrajectory_Dataset_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Manual Add Handler
  const handleManualAdd = (newReading) => {
    const nextDay = history.length > 0 ? Math.max(...history.map(h => h.day)) + 2 : 1;
    const item = {
      day: nextDay,
      ...newReading
    };
    setHistory(prev => [...prev, item]);
  };

  // Custom Gemini Query Submit
  const handleCustomGeminiSubmit = (e) => {
    e.preventDefault();
    if (!customGeminiQuery.trim()) return;
    setIsAiThinking(true);
    setTimeout(() => {
      setSelectedGeminiPrompt({
        id: 'custom-' + Date.now(),
        title: customGeminiQuery,
        prompt: customGeminiQuery,
        response: {
          facts: `Analyzed ${history.length} logged sessions. Current 30-day baseline for ${currentBiomarkerMeta.name} is ${currentBiomarkerMeta.baselineMean} ${currentBiomarkerMeta.unit}.`,
          context: `Your inquiry concerning "${customGeminiQuery}" was evaluated against non-parametric rolling median bands and sample metadata. Urinalysis responds dynamically to hydration, muscular loading, and dietary acid load.`,
          limitations: `BioTrajectory cannot diagnose or predict disease from PGHD (patient-generated health data). Strip colorimetry has reading tolerances of ±1 color block.`,
          recommendation: `Maintain your bi-weekly test schedule. If you notice persistent deviation across 3+ consecutive morning tests, share this record with your physician.`
        }
      });
      setIsAiThinking(false);
      setCustomGeminiQuery('');
    }, 600);
  };

  // Timer effect for 60s strip reaction
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Handle Preset Change
  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setEditedReadings(preset.readings);
  };

  // Handle Reading Confirmation & Save
  const handleSaveReading = () => {
    const newEntry = {
      day: history.length * 2 + 1,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...editedReadings,
      notes: userNotes,
      confirmed: true,
      flagged: editedReadings.protein > 20,
      deviationReason: editedReadings.protein > 20 ? 'Protein elevation +3.8 SD' : null,
      sampleType: 'Guided Home Strip'
    };

    setHistory((prev) => [...prev, newEntry]);

    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: isDark ? ['#c5a880', '#10b981', '#ffffff'] : ['#b45309', '#059669', '#1e293b']
      });
    } catch (e) {
      // safe fallback
    }

    setTimeout(() => {
      setActiveTab('trajectory');
    }, 600);
  };

  // Gemini Prompt Trigger
  const handleGeminiTrigger = (preset) => {
    setSelectedGeminiPrompt(preset);
    setIsAiThinking(true);
    setTimeout(() => {
      setIsAiThinking(false);
    }, 700);
  };

  const currentBiomarkerMeta = BIOMARKER_DEFINITIONS.find((b) => b.id === selectedBiomarker) || BIOMARKER_DEFINITIONS[0];
  const filteredHistory = history.slice(-timeRange);

  // SVG Chart Dimensions & Computations
  const chartWidth = 760;
  const chartHeight = 260;
  const padding = { top: 30, right: 30, bottom: 40, left: 55 };

  const values = filteredHistory.map((d) => d[selectedBiomarker] ?? 0);
  const minVal = Math.min(...values, currentBiomarkerMeta.baselineMin * 0.9);
  const maxVal = Math.max(...values, currentBiomarkerMeta.criticalThreshold * 1.15, currentBiomarkerMeta.baselineMax * 1.2);
  const rangeY = maxVal - minVal || 1;

  const getX = (index) => {
    if (filteredHistory.length <= 1) return padding.left;
    return padding.left + (index / (filteredHistory.length - 1)) * (chartWidth - padding.left - padding.right);
  };

  const getY = (val) => {
    return chartHeight - padding.bottom - ((val - minVal) / rangeY) * (chartHeight - padding.top - padding.bottom);
  };

  const baselineTopY = getY(currentBiomarkerMeta.baselineMax);
  const baselineBottomY = getY(currentBiomarkerMeta.baselineMin);

  return (
    <section className={`relative py-24 border-y transition-colors ${
      isDark ? 'bg-[#070b14] border-white/[0.07]' : 'bg-[#f4efe8]/70 border-amber-900/10'
    }`} id="live-prototype">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-xs font-mono-code uppercase tracking-wider mb-4 ${
            isDark ? 'bg-amber-400/10 border-amber-400/25 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm'
          }`}>
            <Activity className="w-3.5 h-3.5" />
            <span>Section 10 & 21 • Live Software MVP Prototype</span>
          </div>

          <h2 className={`font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            The Personal Trajectory Experience
          </h2>
          <p className={`mt-4 text-base sm:text-lg font-light leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Experience the complete four-step journey outlined in the blueprint: from optical strip scanning with mandatory user confirmation, to individualized baseline modeling, grounded Gemini explanations, and clinician export.
          </p>

          {/* Flow Navigation Tabs */}
          <div className={`mt-8 inline-flex p-1.5 rounded-2xl border shadow-md ${
            isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white border-amber-900/10'
          }`}>
            {[
              { id: 'scanner', label: '1. Guided Strip Reader', icon: Camera },
              { id: 'trajectory', label: '2. Trajectory Engine', icon: Activity },
              { id: 'gemini', label: '3. Grounded Gemini AI', icon: Sparkles },
              { id: 'clinician', label: '4. Clinician Summary', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${
                    isActive
                      ? isDark
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-[0_0_20px_rgba(217,119,6,0.3)]'
                        : 'bg-gradient-to-r from-amber-600 to-amber-800 text-white shadow-md'
                      : isDark
                      ? 'text-slate-400 hover:text-white hover:bg-white/5'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            TAB 1: GUIDED STRIP SCANNER & USER CONFIRMATION
        ========================================================================== */}
        {activeTab === 'scanner' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Camera Frame */}
            <div className={`lg:col-span-7 rounded-2xl border p-6 shadow-xl relative overflow-hidden ${
              isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
            }`}>
              <div className={`flex items-center justify-between pb-4 border-b ${
                isDark ? 'border-white/10' : 'border-slate-100'
              }`}>
                <div className="flex items-center space-x-2">
                  <Camera className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
                  <span className={`text-sm font-semibold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Simulated Smartphone Optical Capture
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className={`flex items-center space-x-1 px-2.5 py-1 rounded font-mono-code border ${
                    isDark ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Lighting: {selectedPreset.lightingQuality}</span>
                  </span>
                  <span className={`px-2 py-1 rounded font-mono-code border ${
                    isDark ? 'bg-slate-800 text-slate-300 border-white/5' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    Tilt: {selectedPreset.tiltAngle}
                  </span>
                </div>
              </div>

              {/* Camera Viewport Simulation */}
              <div className={`mt-5 relative w-full h-[360px] rounded-xl overflow-hidden border flex items-center justify-center ${
                isDark ? 'bg-slate-950 border-white/10' : 'bg-slate-900 border-slate-300'
              }`}>
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
                
                {/* Framing guides */}
                <div className="absolute inset-8 border-2 border-dashed border-amber-400/50 rounded-lg pointer-events-none flex flex-col justify-between p-3">
                  <div className="flex justify-between text-[10px] font-mono-code text-amber-300 font-semibold uppercase">
                    <span>Target Zone: Reagent Strip</span>
                    <span>Optical Calibrator [ColorMatrix v1]</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono-code text-amber-300">
                    <span>Auto-Exposure Locked</span>
                    <span>Confidence: {selectedPreset.confidenceScore}%</span>
                  </div>
                </div>

                {/* Simulated Urine Test Strip */}
                <div className="relative z-10 w-16 h-[270px] bg-[#f8fafc] rounded-md shadow-2xl border border-slate-300 flex flex-col items-center justify-between py-3 px-1">
                  <span className="text-[7px] font-mono-code text-slate-500 font-bold uppercase rotate-90 my-1">
                    BT-10SG
                  </span>
                  <div className="w-8 h-4 rounded-xs border border-black/20" style={{ backgroundColor: editedReadings.leukocytes > 0 ? '#985888' : '#f7ecd2' }} title="Leukocytes"></div>
                  <div className="w-8 h-4 rounded-xs border border-black/20" style={{ backgroundColor: editedReadings.nitrite > 0 ? '#e86d8a' : '#fbf5e6' }} title="Nitrite"></div>
                  <div className="w-8 h-4 rounded-xs border border-black/20" style={{ backgroundColor: '#e28b3b' }} title="Urobilinogen"></div>
                  <div className="w-8 h-4 rounded-xs border border-black/20" style={{ backgroundColor: editedReadings.protein > 20 ? '#a7cd9a' : '#e8ea9c' }} title="Protein"></div>
                  <div className="w-8 h-4 rounded-xs border border-black/20" style={{ backgroundColor: editedReadings.pH > 7.0 ? '#388b77' : '#e08f36' }} title="pH"></div>
                  <div className="w-8 h-4 rounded-xs border border-black/20" style={{ backgroundColor: editedReadings.blood > 0 ? '#387342' : '#f1ad47' }} title="Blood"></div>
                  <div className="w-8 h-4 rounded-xs border border-black/20" style={{ backgroundColor: editedReadings.specificGravity > 1.025 ? '#978d38' : '#568b44' }} title="Specific Gravity"></div>
                  <div className="w-8 h-4 rounded-xs border border-black/20" style={{ backgroundColor: editedReadings.ketones > 0 ? '#9c3f68' : '#f8eecf' }} title="Ketones"></div>
                  <div className="w-8 h-4 rounded-xs border border-black/20" style={{ backgroundColor: '#c89d58' }} title="Bilirubin"></div>
                  <div className="w-8 h-4 rounded-xs border border-black/20" style={{ backgroundColor: editedReadings.glucose > 0 ? '#8bb68b' : '#88bfb8' }} title="Glucose"></div>
                  <div className="w-6 h-6 rounded-full bg-slate-300 mt-1 flex items-center justify-center text-[7px] text-slate-600 font-bold">
                    PAD
                  </div>
                </div>

                {/* Reaction Timer */}
                <div className="absolute top-4 right-4 bg-slate-900/90 border border-white/20 rounded-xl p-2.5 backdrop-blur-md flex items-center space-x-3 text-white">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-mono-code">Read Timer</span>
                    <span className="text-amber-300 font-mono-code font-bold text-sm">{timerSeconds}s</span>
                  </div>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-1.5 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30"
                  >
                    {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setTimerSeconds(60);
                      setIsTimerRunning(false);
                    }}
                    className="p-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Scenarios */}
              <div className={`mt-4 pt-3 border-t ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                <span className={`text-xs block mb-2 font-mono-code uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Select Demonstration Scenario:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SIMULATOR_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset)}
                      className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                        selectedPreset.id === preset.id
                          ? isDark
                            ? 'bg-amber-400/15 border-amber-400/40 text-amber-200'
                            : 'bg-amber-50 border-amber-400 text-amber-900 font-semibold shadow-xs'
                          : isDark
                          ? 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <div className={`font-semibold mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{preset.label}</div>
                      <div className={`text-[11px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{preset.contextTag}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Mandatory User Confirmation */}
            <div className={`lg:col-span-5 rounded-2xl border p-6 shadow-xl ${
              isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
            }`}>
              <div className={`flex items-center justify-between pb-4 border-b ${
                isDark ? 'border-white/10' : 'border-slate-100'
              }`}>
                <div>
                  <h3 className={`text-sm font-semibold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span>Mandatory User Confirmation</span>
                  </h3>
                  <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Section 5: User reviews and edits before encrypted storage
                  </p>
                </div>
                <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded border ${
                  isDark ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                }`}>
                  Pre-save Audit
                </span>
              </div>

              {/* Inputs */}
              <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-slate-900/70 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <span className={`text-xs font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Protein (Albumin)</span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Baseline Mean: 5.2 mg/dL</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={editedReadings.protein}
                      onChange={(e) => setEditedReadings({ ...editedReadings, protein: parseFloat(e.target.value) || 0 })}
                      className={`w-20 px-2 py-1 text-right text-xs font-mono-code rounded border ${
                        isDark ? 'bg-slate-950 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>mg/dL</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-slate-900/70 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <span className={`text-xs font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Specific Gravity</span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Baseline Range: 1.012 – 1.024</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      step="0.001"
                      value={editedReadings.specificGravity}
                      onChange={(e) => setEditedReadings({ ...editedReadings, specificGravity: parseFloat(e.target.value) || 1.015 })}
                      className={`w-20 px-2 py-1 text-right text-xs font-mono-code rounded border ${
                        isDark ? 'bg-slate-950 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-slate-900/70 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <span className={`text-xs font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Urine pH</span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Normal: 5.0 – 8.0</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      step="0.1"
                      value={editedReadings.pH}
                      onChange={(e) => setEditedReadings({ ...editedReadings, pH: parseFloat(e.target.value) || 6.0 })}
                      className={`w-20 px-2 py-1 text-right text-xs font-mono-code rounded border ${
                        isDark ? 'bg-slate-950 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  isDark ? 'bg-slate-900/70 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <span className={`text-xs font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Ketones</span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Normal: Negative (0)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={editedReadings.ketones}
                      onChange={(e) => setEditedReadings({ ...editedReadings, ketones: parseFloat(e.target.value) || 0 })}
                      className={`w-20 px-2 py-1 text-right text-xs font-mono-code rounded border ${
                        isDark ? 'bg-slate-950 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                    />
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>mg/dL</span>
                  </div>
                </div>

                <div className="pt-2">
                  <label className={`text-[11px] font-medium block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Contextual Lifestyle & Sample Notes:
                  </label>
                  <textarea
                    rows={2}
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="e.g. Post heavy resistance training, fast duration..."
                    className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none ${
                      isDark
                        ? 'bg-slate-950 border-white/10 text-slate-200 focus:border-amber-400'
                        : 'bg-white border-slate-300 text-slate-800 focus:border-amber-500'
                    }`}
                  ></textarea>
                </div>
              </div>

              {/* Action Button */}
              <div className={`mt-5 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-100'} flex flex-col space-y-2`}>
                <button
                  onClick={handleSaveReading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Save to Encrypted Trajectory</span>
                </button>
                <p className={`text-[10px] text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Values are stored locally in accordance with the BioTrajectory Privacy Charter.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: LONGITUDINAL TRAJECTORY DASHBOARD
        ========================================================================== */}
        {activeTab === 'trajectory' && (
          <div className={`rounded-2xl border p-6 sm:p-8 shadow-xl ${
            isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
          }`}>
            
            {/* Toolbar */}
            <div className={`flex flex-wrap items-center justify-between gap-4 pb-6 border-b ${
              isDark ? 'border-white/10' : 'border-slate-100'
            }`}>
              <div className="flex flex-wrap items-center gap-2">
                {BIOMARKER_DEFINITIONS.slice(0, 6).map((bio) => (
                  <button
                    key={bio.id}
                    onClick={() => setSelectedBiomarker(bio.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      selectedBiomarker === bio.id
                        ? isDark
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-amber-600 text-white shadow-sm'
                        : isDark
                        ? 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {bio.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className={`font-mono-code uppercase mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Time Horizon:</span>
                {[7, 14, 30].map((days) => (
                  <button
                    key={days}
                    onClick={() => setTimeRange(days)}
                    className={`px-3 py-1 rounded-md font-mono-code transition-all ${
                      timeRange === days
                        ? isDark
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                        : isDark
                        ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-white/5'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {days}D
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Interactive Actions Row */}
            <div className={`mt-4 flex flex-wrap items-center justify-between gap-3 text-xs`}>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsManualModalOpen(true)}
                  className={`px-3.5 py-1.5 rounded-lg font-mono-code uppercase font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm ${
                    isDark
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_15px_rgba(217,119,6,0.2)]'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Log Reading by Hand</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className={`px-3 py-1.5 rounded-lg font-mono-code text-xs border flex items-center space-x-1.5 transition-all ${
                    isDark
                      ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-white/10'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                  }`}
                  title="Download CSV"
                >
                  <Download className="w-3.5 h-3.5 text-amber-500" />
                  <span>Export CSV</span>
                </button>

                <button
                  onClick={handleExportJSON}
                  className={`px-3 py-1.5 rounded-lg font-mono-code text-xs border flex items-center space-x-1.5 transition-all ${
                    isDark
                      ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-white/10'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                  }`}
                  title="Download JSON"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Export JSON</span>
                </button>
              </div>

              <button
                onClick={() => setHistory(SAMPLE_30_DAY_HISTORY)}
                className={`text-[11px] font-mono-code text-slate-400 hover:text-amber-500 flex items-center space-x-1 transition-colors`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset 30-Day Dataset</span>
              </button>
            </div>

            {/* Baseline Corridor Status Banner */}
            <div className={`mt-6 flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border ${
              isDark ? 'bg-slate-900/40 border-white/5' : 'bg-amber-50/60 border-amber-200'
            }`}>
              <div className="flex items-center space-x-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm"></div>
                <div>
                  <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Personal Baseline Established (15 Validated Sessions)
                  </span>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Calculated using non-parametric rolling median & interquartile corridors. Avoids arbitrary composite scores.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-xs font-mono-code">
                <div className="flex items-center space-x-1.5">
                  <span className={`w-3 h-3 rounded-xs border ${
                    isDark ? 'bg-amber-400/20 border-amber-400/50' : 'bg-amber-200 border-amber-400'
                  }`}></span>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Personal Baseline Band</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Recorded Reading</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className={isDark ? 'text-rose-300' : 'text-rose-700'}>Flagged Variance</span>
                </div>
              </div>
            </div>

            {/* Interactive SVG Longitudinal Trajectory Chart */}
            <div className="mt-6 relative">
              <div className="w-full overflow-x-auto">
                <svg
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  className="w-full h-auto min-w-[620px] select-none"
                >
                  <defs>
                    <linearGradient id="baselineCorridorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={isDark ? '#c5a880' : '#d97706'} stopOpacity={isDark ? '0.18' : '0.12'} />
                      <stop offset="100%" stopColor={isDark ? '#10b981' : '#059669'} stopOpacity={isDark ? '0.08' : '0.05'} />
                    </linearGradient>

                    <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#0284c7" />
                      <stop offset="50%" stopColor={isDark ? '#c5a880' : '#b45309'} />
                      <stop offset="75%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                    const y = padding.top + pct * (chartHeight - padding.top - padding.bottom);
                    const valAtY = maxVal - pct * rangeY;
                    return (
                      <g key={i}>
                        <line
                          x1={padding.left}
                          y1={y}
                          x2={chartWidth - padding.right}
                          y2={y}
                          stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}
                          strokeDasharray="4 4"
                        />
                        <text
                          x={padding.left - 10}
                          y={y + 4}
                          textAnchor="end"
                          className={`text-[9px] font-mono-code ${isDark ? 'fill-slate-500' : 'fill-slate-500'}`}
                        >
                          {currentBiomarkerMeta.unit === 'density' ? valAtY.toFixed(3) : valAtY.toFixed(1)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Baseline Band */}
                  <rect
                    x={padding.left}
                    y={baselineTopY}
                    width={chartWidth - padding.left - padding.right}
                    height={Math.max(4, baselineBottomY - baselineTopY)}
                    fill="url(#baselineCorridorGrad)"
                    stroke={isDark ? 'rgba(197, 168, 128, 0.35)' : 'rgba(180, 145, 95, 0.45)'}
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={chartWidth - padding.right - 8}
                    y={baselineTopY + 14}
                    textAnchor="end"
                    className={`text-[9px] font-mono-code ${isDark ? 'fill-amber-300/80' : 'fill-amber-800'}`}
                  >
                    Baseline Band ({currentBiomarkerMeta.baselineMin} - {currentBiomarkerMeta.baselineMax} {currentBiomarkerMeta.unit})
                  </text>

                  {/* Trajectory Line */}
                  <path
                    d={filteredHistory
                      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d[selectedBiomarker] ?? 0)}`)
                      .join(' ')}
                    fill="none"
                    stroke="url(#lineGrad)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Nodes */}
                  {filteredHistory.map((d, i) => {
                    const cx = getX(i);
                    const cy = getY(d[selectedBiomarker] ?? 0);
                    const isFlagged = d.flagged && selectedBiomarker === 'protein';
                    const isHovered = hoveredPoint && hoveredPoint.day === d.day;

                    return (
                      <g
                        key={d.day}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredPoint(d)}
                        onMouseLeave={() => setHoveredPoint(null)}
                      >
                        {isFlagged && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r="12"
                            fill="rgba(244, 63, 94, 0.25)"
                            className="animate-ping"
                          />
                        )}

                        <circle
                          cx={cx}
                          cy={cy}
                          r={isHovered ? 7 : isFlagged ? 6 : 4.5}
                          fill={isFlagged ? '#e11d48' : isDark ? '#c5a880' : '#b45309'}
                          stroke={isDark ? '#090e18' : '#ffffff'}
                          strokeWidth="2"
                        />

                        <text
                          x={cx}
                          y={chartHeight - 12}
                          textAnchor="middle"
                          className={`text-[8px] font-mono-code ${isDark ? 'fill-slate-400' : 'fill-slate-600'}`}
                        >
                          D{d.day}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Hover Tooltip */}
              {hoveredPoint && (
                <div
                  className={`absolute z-20 p-3 rounded-xl border text-xs shadow-2xl backdrop-blur-xl pointer-events-none transition-all ${
                    isDark ? 'bg-slate-900/95 border-amber-400/30' : 'bg-white border-amber-300 text-slate-800'
                  }`}
                  style={{
                    left: `${Math.min(getX(filteredHistory.findIndex((h) => h.day === hoveredPoint.day)), chartWidth - 220)}px`,
                    top: '20px'
                  }}
                >
                  <div className={`flex items-center justify-between gap-3 pb-1.5 mb-1.5 border-b ${
                    isDark ? 'border-white/10' : 'border-slate-100'
                  }`}>
                    <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Day {hoveredPoint.day} ({hoveredPoint.date})
                    </span>
                    <span className="text-[10px] font-mono-code text-slate-400">{hoveredPoint.time}</span>
                  </div>
                  <div className={`font-mono-code font-bold text-sm ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                    {currentBiomarkerMeta.name}: {hoveredPoint[selectedBiomarker]} {currentBiomarkerMeta.unit}
                  </div>
                  <div className={`text-[11px] mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {hoveredPoint.notes || 'Routine scheduled morning void.'}
                  </div>
                  {hoveredPoint.flagged && (
                    <div className="mt-2 text-[10px] text-rose-700 bg-rose-50 p-1.5 rounded border border-rose-300 flex items-center space-x-1">
                      <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>{hoveredPoint.deviationReason}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Telemetry Cards */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Baseline Median</span>
                <span className={`text-lg font-mono-code font-bold mt-1 block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentBiomarkerMeta.baselineMean} {currentBiomarkerMeta.unit}
                </span>
                <span className="text-[11px] text-slate-400">95% Confidence Corridor</span>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Observed Variance (IQR)</span>
                <span className={`text-lg font-mono-code font-bold mt-1 block ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  ± 1.1 {currentBiomarkerMeta.unit}
                </span>
                <span className={`text-[11px] ${isDark ? 'text-emerald-400/80' : 'text-emerald-700'}`}>Low noise / Reproducible</span>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Persistence Check</span>
                <span className={`text-lg font-mono-code font-bold mt-1 block ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                  Transient (1 Day)
                </span>
                <span className="text-[11px] text-slate-400">Resolved spontaneously by D26</span>
              </div>

              <div className={`p-4 rounded-xl border flex flex-col justify-between ${
                isDark ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Clinical Summary Status</span>
                <button
                  onClick={() => setActiveTab('clinician')}
                  className={`mt-2 text-xs font-semibold flex items-center space-x-1 py-1 ${
                    isDark ? 'text-amber-300 hover:text-white' : 'text-amber-700 hover:text-amber-900'
                  }`}
                >
                  <span>Export Doctor Brief</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Context Note */}
            <div className={`mt-6 p-4 rounded-xl border text-xs flex items-start space-x-3 ${
              isDark ? 'bg-amber-950/20 border-amber-500/20 text-amber-200/90' : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}>
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className={isDark ? 'text-amber-300' : 'text-amber-900'}>Biological Variability Guidance: </strong>
                {currentBiomarkerMeta.biologicalContext} BioTrajectory compares readings against your own history, avoiding false alarm when lifestyle factors cause temporary shifts.
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: GROUNDED GEMINI AI HEALTH EXPLAINER
        ========================================================================== */}
        {activeTab === 'gemini' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Prompts */}
            <div className={`lg:col-span-5 rounded-2xl border p-6 shadow-xl ${
              isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
            }`}>
              <div className={`flex items-center space-x-2 pb-4 border-b ${
                isDark ? 'border-white/10' : 'border-slate-100'
              }`}>
                <Sparkles className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
                <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Grounded Gemini AI Copilot
                </h3>
              </div>

              <p className={`mt-3 text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                As specified in <strong className={isDark ? 'text-white' : 'text-slate-900'}>Section 8 of the blueprint</strong>: Gemini acts exclusively as an explanation and summarization layer. It receives confirmed structured records and is forbidden from diagnosing, prescribing, or hallucinating medical certainty.
              </p>

              {/* Guardrails checklist */}
              <div className={`mt-4 p-3 rounded-xl border space-y-2 text-xs ${
                isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`flex items-center space-x-2 text-[11px] ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Grounding: Uses only approved recorded data</span>
                </div>
                <div className={`flex items-center space-x-2 text-[11px] ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Tone: Cautious, non-diagnostic language</span>
                </div>
                <div className={`flex items-center space-x-2 text-[11px] ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>Safety: Distinguishes facts from physiological hypotheses</span>
                </div>
              </div>

              {/* Questions */}
              <div className="mt-6">
                <span className={`text-xs font-mono-code uppercase block mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Select Grounded Clinical Query:
                </span>
                <div className="space-y-2">
                  {GEMINI_PROMPT_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleGeminiTrigger(preset)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                        selectedGeminiPrompt.id === preset.id
                          ? isDark
                            ? 'bg-amber-400/15 border-amber-400/40 text-amber-200 font-semibold'
                            : 'bg-amber-50 border-amber-400 text-amber-900 font-semibold shadow-xs'
                          : isDark
                          ? 'bg-slate-900/40 border-white/5 text-slate-300 hover:text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="pr-2">{preset.title}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    </button>
                  ))}
                </div>

                {/* Custom User Query Input */}
                <div className={`mt-5 pt-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                  <span className={`text-xs font-mono-code uppercase block mb-2 font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                    Ask Your Own Question:
                  </span>
                  <form onSubmit={handleCustomGeminiSubmit} className="flex gap-2">
                    <input
                      type="text"
                      value={customGeminiQuery}
                      onChange={(e) => setCustomGeminiQuery(e.target.value)}
                      placeholder="e.g. Why did protein spike on Day 22?"
                      className={`flex-1 text-xs p-2.5 rounded-xl border focus:outline-none ${
                        isDark ? 'bg-slate-950 border-white/10 text-white focus:border-amber-400' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-amber-500'
                      }`}
                    />
                    <button
                      type="submit"
                      disabled={isAiThinking || !customGeminiQuery.trim()}
                      className="px-3.5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold disabled:opacity-40 transition-colors flex items-center justify-center"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Right: Response Stream */}
            <div className={`lg:col-span-7 rounded-2xl border p-6 shadow-xl ${
              isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
            }`}>
              <div className={`flex items-center justify-between pb-4 border-b ${
                isDark ? 'border-white/10' : 'border-slate-100'
              }`}>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                  <span className={`text-xs font-mono-code uppercase ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Grounded AI Reasoning Stream
                  </span>
                </div>
                <span className={`text-[10px] font-mono-code ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Model: Gemini 3.8 Flash (High)
                </span>
              </div>

              <div className="mt-5 space-y-4 max-h-[500px] overflow-y-auto pr-1">
                {isAiThinking ? (
                  <div className="p-8 text-center">
                    <RefreshCw className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-3" />
                    <p className={`text-xs font-mono-code ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Synthesizing confirmed trajectory records & applying clinical safety guardrails...
                    </p>
                  </div>
                ) : (
                  <div>
                    {/* User Prompt */}
                    <div className="flex items-start space-x-3 mb-6">
                      <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                        isDark ? 'bg-slate-800 border-white/10 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700'
                      }`}>
                        U
                      </div>
                      <div className={`p-3.5 rounded-xl border text-xs leading-relaxed max-w-lg ${
                        isDark ? 'bg-slate-900 border-white/10 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}>
                        {selectedGeminiPrompt.prompt}
                      </div>
                    </div>

                    {/* Gemini Response Quadrants */}
                    <div className="flex items-start space-x-3">
                      <div className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                        isDark ? 'bg-amber-400/20 border-amber-400/40 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-800'
                      }`}>
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 space-y-3">
                        
                        {/* Section 1: Facts */}
                        <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                          isDark ? 'bg-slate-900/80 border-white/10' : 'bg-sky-50/70 border-sky-200'
                        }`}>
                          <span className={`text-[10px] font-mono-code uppercase tracking-wider block font-semibold mb-1 ${
                            isDark ? 'text-cyan-300' : 'text-sky-900'
                          }`}>
                            1. Confirmed Structured Observations
                          </span>
                          <p className={isDark ? 'text-slate-200' : 'text-slate-800'}>{selectedGeminiPrompt.response.facts}</p>
                        </div>

                        {/* Section 2: Context */}
                        <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                          isDark ? 'bg-slate-900/80 border-white/10' : 'bg-amber-50/70 border-amber-200'
                        }`}>
                          <span className={`text-[10px] font-mono-code uppercase tracking-wider block font-semibold mb-1 ${
                            isDark ? 'text-amber-300' : 'text-amber-900'
                          }`}>
                            2. Physiological Context & Confounding Factors
                          </span>
                          <p className={isDark ? 'text-slate-200' : 'text-slate-800'}>{selectedGeminiPrompt.response.context}</p>
                        </div>

                        {/* Section 3: Limitations */}
                        <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                          isDark ? 'bg-amber-950/20 border-amber-500/25 text-amber-200/90' : 'bg-rose-50/70 border-rose-200 text-rose-950'
                        }`}>
                          <span className={`text-[10px] font-mono-code uppercase tracking-wider block font-semibold mb-1 ${
                            isDark ? 'text-amber-400' : 'text-rose-900'
                          }`}>
                            3. Explicit Measurement Limitations & Non-Diagnostic Notice
                          </span>
                          <p>{selectedGeminiPrompt.response.limitations}</p>
                        </div>

                        {/* Section 4: Recommendation */}
                        <div className={`p-4 rounded-xl border text-xs leading-relaxed ${
                          isDark ? 'bg-emerald-950/20 border-emerald-500/25 text-emerald-200/90' : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                        }`}>
                          <span className={`text-[10px] font-mono-code uppercase tracking-wider block font-semibold mb-1 ${
                            isDark ? 'text-emerald-300' : 'text-emerald-900'
                          }`}>
                            4. Clinician Engagement Recommendation
                          </span>
                          <p>{selectedGeminiPrompt.response.recommendation}</p>
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 4: CLINICIAN SUMMARY BRIEF
        ========================================================================== */}
        {activeTab === 'clinician' && (
          <div className={`max-w-4xl mx-auto rounded-2xl border p-6 sm:p-10 shadow-2xl ${
            isDark ? 'bg-[#0a0f1d] border-white/15' : 'bg-white border-amber-900/10'
          }`}>
            
            {/* Report Header */}
            <div className={`flex flex-wrap items-center justify-between gap-4 pb-6 border-b ${
              isDark ? 'border-white/15' : 'border-slate-200'
            }`}>
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`font-cinzel text-xl font-bold tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    BioTrajectory
                  </span>
                  <span className={`text-[10px] uppercase font-mono-code px-2 py-0.5 rounded border ${
                    isDark ? 'bg-amber-400/10 text-amber-300 border-amber-400/20' : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}>
                    Patient Longitudinal Handover Document
                  </span>
                </div>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Generated for Medical Review • Non-Diagnostic Clinical Supplementary PGHD
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => window.print()}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border flex items-center space-x-1.5 transition-all ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-white/10'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300 shadow-xs'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5 text-amber-600" />
                  <span>Print / Save PDF</span>
                </button>
              </div>
            </div>

            {/* Metadata Grid */}
            <div className={`mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl border text-xs font-mono-code ${
              isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
            }`}>
              <div>
                <span className={`block text-[10px] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Patient Identifier</span>
                <strong className={isDark ? 'text-white' : 'text-slate-900'}>BT-9428-ANON</strong>
              </div>
              <div>
                <span className={`block text-[10px] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Observation Window</span>
                <strong className={isDark ? 'text-white' : 'text-slate-900'}>30 Days (15 Logs)</strong>
              </div>
              <div>
                <span className={`block text-[10px] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Strip Reagent Brand</span>
                <strong className={isDark ? 'text-white' : 'text-slate-900'}>Multistix 10SG Lot#702</strong>
              </div>
              <div>
                <span className={`block text-[10px] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Trajectory Baseline</span>
                <strong className={isDark ? 'text-emerald-400' : 'text-emerald-700'}>Established (95% CI)</strong>
              </div>
            </div>

            {/* Narrative Findings */}
            <div className="mt-6 space-y-4">
              <h4 className={`text-xs font-mono-code uppercase tracking-wider font-semibold ${
                isDark ? 'text-amber-300' : 'text-amber-800'
              }`}>
                Clinical Longitudinal Findings:
              </h4>

              <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                isDark ? 'bg-slate-900/40 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <p>
                  <strong>1. Baseline Stability:</strong> Across 15 morning test events, patient exhibits tight physiological homeostasis for Urine pH (mean 6.41, range 6.1–6.6), Specific Gravity (median 1.018), and persistent negative readings for Glucose, Leukocyte Esterase, and Nitrite.
                </p>
                <p>
                  <strong>2. Transient Variance on Day 22 (2026-10-26):</strong> An isolated protein reading of 32 mg/dL (+ 1+) coincided with high urine concentration (Specific Gravity 1.028) and trace ketones (10 mg/dL). Notes indicate intense prior evening cross-training and dehydration.
                </p>
                <p>
                  <strong>3. Resolution:</strong> Follow-up evaluations on Day 24 (18 mg/dL) and Day 26 (8 mg/dL) demonstrated full spontaneous resolution back to baseline without pharmacological intervention.
                </p>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-xs font-mono-code border-collapse">
                  <thead>
                    <tr className={`border-b text-[10px] uppercase ${
                      isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'
                    }`}>
                      <th className="py-2.5 px-3">Date / Day</th>
                      <th className="py-2.5 px-3">Protein</th>
                      <th className="py-2.5 px-3">Spec. Gravity</th>
                      <th className="py-2.5 px-3">pH</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-white/5 text-slate-300' : 'divide-slate-100 text-slate-700'}`}>
                    {history.slice(-6).map((row) => (
                      <tr key={row.day} className={row.flagged ? (isDark ? 'bg-amber-500/10' : 'bg-amber-50') : ''}>
                        <td className={`py-2.5 px-3 font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          Day {row.day} ({row.date})
                        </td>
                        <td className={`py-2.5 px-3 ${row.flagged ? 'text-rose-600 font-bold' : ''}`}>{row.protein} mg/dL</td>
                        <td className="py-2.5 px-3">{row.specificGravity}</td>
                        <td className="py-2.5 px-3">{row.pH}</td>
                        <td className="py-2.5 px-3">
                          {row.flagged ? (
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300 text-[10px]">
                              Variance Flag
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[10px]">
                              Within Baseline
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mandatory Disclaimers */}
              <div className={`mt-6 p-4 rounded-xl border text-[11px] space-y-1.5 ${
                isDark ? 'bg-slate-950 border-amber-400/20 text-slate-400' : 'bg-amber-50/50 border-amber-200 text-slate-600'
              }`}>
                <div className={`font-semibold uppercase tracking-wider font-mono-code ${
                  isDark ? 'text-amber-300' : 'text-amber-900'
                }`}>
                  Mandatory Clinical Advisory & Limitations:
                </div>
                <p>
                  • BioTrajectory is a non-diagnostic digital health monitoring concept. Urinalysis test strips reflect recent urinary concentration and are susceptible to lighting, timing, hydration, and user technique.
                </p>
                <p>
                  • A stable baseline does not guarantee absence of disease. Any persistent deviation, hematuria, or concerning constitutional symptoms must receive prompt medical evaluation by a qualified physician.
                </p>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Manual Entry Modal */}
      <ManualEntryModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onAddReading={handleManualAdd}
      />

    </section>
  );
}
