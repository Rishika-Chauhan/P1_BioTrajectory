import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Activity,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  FileText,
  RotateCcw,
  Printer,
  Play,
  Pause,
  Info,
  Download,
  PlusCircle,
  Send,
  Sun,
  Check,
  BarChart2,
  Grid,
  Layers,
  UserCheck,
  Compass,
  TrendingUp,
  Bluetooth,
  PieChart as PieChartIcon,
  Radio,
  Sliders,
  Cpu
} from 'lucide-react';
import {
  BIOMARKER_DEFINITIONS,
  PATIENT_PERSONAS,
  SIMULATOR_PRESETS,
  GEMINI_PROMPT_PRESETS,
  BLUETOOTH_DEVICES,
  BLUETOOTH_METRIC_CONFIGS
} from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import ManualEntryModal from './ManualEntryModal';
import BluetoothHub from './BluetoothHub';
import AttractiveLineChart from './AttractiveLineChart';
import AttractivePieChart from './AttractivePieChart';

export default function LiveDemo({ onOpenReportModal }) {
  const { isDark } = useTheme();

  // Active Main Tab: 'trajectory', 'multistream', 'piechart', 'bluetooth', 'scanner', 'gemini', 'clinician'
  const [activeTab, setActiveTab] = useState('trajectory');

  // Selected Patient Persona: 'arjun', 'sunita', 'david', 'custom'
  const [selectedPersonaId, setSelectedPersonaId] = useState('arjun');
  const activePersona = useMemo(() => {
    return PATIENT_PERSONAS.find((p) => p.id === selectedPersonaId) || PATIENT_PERSONAS[0];
  }, [selectedPersonaId]);

  // History state allowing live additions, persona changes, and resets
  const [history, setHistory] = useState(activePersona.history);

  // Baseline Sufficiency Simulation Slider (PDF Section 11 & 17)
  const [simulatedReadingsLimit, setSimulatedReadingsLimit] = useState(15);

  // Bluetooth Continuous Sensor Metric Selection State
  const [selectedBleMetric, setSelectedBleMetric] = useState('bleCgmGlucose');

  // Switch persona handler
  const handleSelectPersona = (personaId) => {
    setSelectedPersonaId(personaId);
    const p = PATIENT_PERSONAS.find((item) => item.id === personaId);
    if (p) {
      setHistory(p.history);
      setSimulatedReadingsLimit(p.history.length);
    }
  };

  // Chart Configuration States
  const [chartMode, setChartMode] = useState('single'); // 'single', 'dual', 'heatmap', 'distribution'
  const [selectedBiomarker, setSelectedBiomarker] = useState('protein');
  const [dualSecondaryBiomarker, setDualSecondaryBiomarker] = useState('specificGravity');
  const [timeRange, setTimeRange] = useState(30); // 7, 14, 30
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [inspectedSession, setInspectedSession] = useState(null);

  // Manual Entry Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Optical Strip Scanner State
  const [selectedPreset, setSelectedPreset] = useState(SIMULATOR_PRESETS[1]); // Default to Day 22 spike
  const [ambientLux, setAmbientLux] = useState(520);
  const [tiltAngleDeg, setTiltAngleDeg] = useState(0.4);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activePadIndex, setActivePadIndex] = useState(3); // Protein pad default
  const [editedReadings, setEditedReadings] = useState(SIMULATOR_PRESETS[1].readings);
  const [userNotes, setUserNotes] = useState('Evening cross-training session; low fluid intake during afternoon.');
  const [lifestyleTag, setLifestyleTag] = useState('Post-Workout');

  // Grounded Gemini State
  const [selectedGeminiPrompt, setSelectedGeminiPrompt] = useState(GEMINI_PROMPT_PRESETS[0]);
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [customGeminiQuery, setCustomGeminiQuery] = useState('');
  const [showGroundingPayload, setShowGroundingPayload] = useState(false);

  // Filtered dataset based on time range and simulated baseline count
  const activeHistory = useMemo(() => {
    const limited = history.slice(0, simulatedReadingsLimit);
    return limited.slice(-timeRange);
  }, [history, simulatedReadingsLimit, timeRange]);

  // Check if baseline is statistically established (PDF requires minimum 10 readings)
  const isBaselineActive = simulatedReadingsLimit >= 10;

  // Active biomarker metadata
  const currentBiomarkerMeta = useMemo(() => {
    return BIOMARKER_DEFINITIONS.find((b) => b.id === selectedBiomarker) || BIOMARKER_DEFINITIONS[0];
  }, [selectedBiomarker]);

  const secondaryBiomarkerMeta = useMemo(() => {
    return BIOMARKER_DEFINITIONS.find((b) => b.id === dualSecondaryBiomarker) || BIOMARKER_DEFINITIONS[1];
  }, [dualSecondaryBiomarker]);

  // Optical Timer Effect
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

  // Save new reading handler
  const handleSaveReading = () => {
    const nextDay = history.length > 0 ? Math.max(...history.map((h) => h.day)) + 2 : 1;
    const isProteinElevated = (editedReadings.protein || 0) > 20;

    const newEntry = {
      day: nextDay,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      ...editedReadings,
      notes: `${lifestyleTag}: ${userNotes}`,
      confirmed: true,
      flagged: isProteinElevated,
      deviationReason: isProteinElevated ? 'Protein elevation +3.8σ above established baseline corridor' : null,
      sampleType: 'Guided Home Strip'
    };

    setHistory((prev) => [...prev, newEntry]);
    setSimulatedReadingsLimit((prev) => prev + 1);

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: isDark ? ['#f59e0b', '#10b981', '#38bdf8'] : ['#b45309', '#059669', '#0284c7']
      });
    } catch (e) {
      // safe fallback
    }

    setTimeout(() => {
      setActiveTab('trajectory');
    }, 600);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ['Day', 'Date', 'Time', 'Protein', 'SpecificGravity', 'pH', 'Glucose', 'Leukocytes', 'Ketones', 'Notes', 'Flagged'];
    const rows = history.map((h) => [
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
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `BioTrajectory_${selectedPersonaId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // JSON Export Handler
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `BioTrajectory_Dataset_${selectedPersonaId}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Manual Add Modal Handler
  const handleManualAdd = (newReading) => {
    const nextDay = history.length > 0 ? Math.max(...history.map((h) => h.day)) + 2 : 1;
    const item = {
      day: nextDay,
      ...newReading,
      confirmed: true
    };
    setHistory((prev) => [...prev, item]);
    setSimulatedReadingsLimit((prev) => prev + 1);
  };

  // Preset Select Handler
  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setEditedReadings(preset.readings);
    setAmbientLux(preset.luxValue || 520);
    setTiltAngleDeg(parseFloat(preset.tiltAngle) || 0.4);
    setUserNotes(preset.description);
  };

  // Custom Gemini query handler
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
          facts: `Analyzed ${activeHistory.length} validated test logs for ${activePersona.name}. Rolling baseline for ${currentBiomarkerMeta.name} is ${currentBiomarkerMeta.baselineMean} ${currentBiomarkerMeta.unit}.`,
          context: `Your question regarding "${customGeminiQuery}" was cross-referenced against sample timing and hydration metadata. Biomarkers fluctuate dynamically with muscle loading, fluid balance, and circadian rhythms.`,
          limitations: `BioTrajectory cannot diagnose illnesses or prescribe therapy. Urinalysis colorimetry has reading tolerances of ±1 color block.`,
          recommendation: `Continue bi-weekly morning test sessions. If values deviate persistently across 3 consecutive well-hydrated morning tests, export this report for your physician.`
        }
      });
      setIsAiThinking(false);
      setCustomGeminiQuery('');
    }, 600);
  };

  // =========================================================================
  // SVG CHART MATHEMATICS & GEOMETRY (SMOOTH BEZIER & DUAL-AXIS)
  // =========================================================================
  const chartWidth = 840;
  const chartHeight = 280;
  const padding = { top: 35, right: 60, bottom: 45, left: 60 };

  const activeValues = activeHistory.map((d) => d[selectedBiomarker] ?? 0);
  const minVal = Math.min(...activeValues, currentBiomarkerMeta.baselineMin * 0.9);
  const maxVal = Math.max(
    ...activeValues,
    currentBiomarkerMeta.criticalThreshold * 1.15,
    currentBiomarkerMeta.baselineMax * 1.25
  );
  const rangeY = maxVal - minVal || 1;

  const getX = (index) => {
    if (activeHistory.length <= 1) return padding.left;
    return padding.left + (index / (activeHistory.length - 1)) * (chartWidth - padding.left - padding.right);
  };

  const getY = (val) => {
    return chartHeight - padding.bottom - ((val - minVal) / rangeY) * (chartHeight - padding.top - padding.bottom);
  };

  // Secondary axis calculations for dual chart
  const secondaryValues = activeHistory.map((d) => d[dualSecondaryBiomarker] ?? 0);
  const secMin = Math.min(...secondaryValues, secondaryBiomarkerMeta.baselineMin * 0.95);
  const secMax = Math.max(...secondaryValues, secondaryBiomarkerMeta.baselineMax * 1.05);
  const secRangeY = secMax - secMin || 1;

  const getSecondaryY = (val) => {
    return chartHeight - padding.bottom - ((val - secMin) / secRangeY) * (chartHeight - padding.top - padding.bottom);
  };

  const baselineTopY = getY(currentBiomarkerMeta.baselineMax);
  const baselineBottomY = getY(currentBiomarkerMeta.baselineMin);

  // Generate Smooth SVG Path using Catmull-Rom or Cubic Bezier
  const buildSmoothPath = (pts) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const primaryPoints = activeHistory.map((d, i) => ({
    x: getX(i),
    y: getY(d[selectedBiomarker] ?? 0),
    data: d
  }));

  const secondaryPoints = activeHistory.map((d, i) => ({
    x: getX(i),
    y: getSecondaryY(d[dualSecondaryBiomarker] ?? 0),
    data: d
  }));

  const primaryPathStr = buildSmoothPath(primaryPoints);
  const secondaryPathStr = buildSmoothPath(secondaryPoints);

  // Closed area under primary curve
  const primaryAreaStr = primaryPoints.length > 1
    ? `${primaryPathStr} L ${primaryPoints[primaryPoints.length - 1].x} ${chartHeight - padding.bottom} L ${primaryPoints[0].x} ${chartHeight - padding.bottom} Z`
    : '';

  // Rock-solid SVG Scrubber & Proximity Tracker (Zero-Flicker & Zero Layout Thrashing)
  const handleChartMouseMove = (e) => {
    if (!primaryPoints || primaryPoints.length === 0) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    if (!rect.width) return;
    const clientX = e.clientX - rect.left;
    const svgX = (clientX / rect.width) * chartWidth;

    let closest = primaryPoints[0];
    let minDist = Math.abs(svgX - primaryPoints[0].x);
    for (let i = 1; i < primaryPoints.length; i++) {
      const dist = Math.abs(svgX - primaryPoints[i].x);
      if (dist < minDist) {
        minDist = dist;
        closest = primaryPoints[i];
      }
    }

    // Stable proximity activation threshold: 38px
    if (minDist <= 38) {
      if (hoveredPoint?.day !== closest.data.day) {
        setHoveredPoint(closest.data);
      }
    } else {
      if (hoveredPoint !== null) {
        setHoveredPoint(null);
      }
    }
  };

  const handleChartMouseLeave = () => {
    if (hoveredPoint !== null) {
      setHoveredPoint(null);
    }
  };

  const handleChartClick = () => {
    if (hoveredPoint) {
      setInspectedSession(hoveredPoint);
    }
  };

  return (
    <section
      className={`relative pt-24 pb-16 border-b transition-colors overflow-hidden ${isDark ? 'bg-[#05070c] border-white/[0.08]' : 'bg-[#faf9f6] border-amber-900/10'
        }`}
      id="live-prototype"
    >
      {/* Background Ambient Glows & Technical Grid */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] pointer-events-none ${isDark ? 'bg-amber-500/10' : 'bg-amber-300/20'
        }`}></div>
      <div className={`absolute top-1/3 left-1/4 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none ${isDark ? 'bg-emerald-500/8' : 'bg-emerald-400/15'
        }`}></div>
      <div className={`absolute top-2/3 right-1/4 w-[500px] h-[400px] rounded-full blur-[130px] pointer-events-none ${isDark ? 'bg-cyan-500/8' : 'bg-amber-400/15'
        }`}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">

        {/* =========================================================================
            TOP COMPACT TELEMETRY STATUS BAR (PATIENT & GRAPHS RIGHT ON TOP!)
        ========================================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono-code font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Live Patient Telemetry & Trajectory Console
            </span>
            <span className="text-slate-400 text-xs hidden sm:inline">•</span>
            <span className={`text-xs font-mono-code hidden sm:inline ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Individualized Baseline Corridor System
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-[11px] font-mono-code px-3 py-1 rounded-full border ${isDark
              ? 'bg-amber-400/10 text-amber-300 border-amber-400/20'
              : 'bg-amber-50 text-amber-900 border-amber-200 shadow-xs'
              }`}>
              10-Session Rolling IQR Baseline Active
            </span>
          </div>
        </div>

        {/* =========================================================================
            PATIENT COMMAND & IDENTITY CONSOLE (RIGHT ON TOP!)
        ========================================================================== */}
        <div className={`rounded-3xl border p-5 sm:p-7 mb-8 shadow-2xl backdrop-blur-xl transition-all ${isDark
          ? 'bg-[#090e18]/95 border-amber-400/30 shadow-[0_15px_45px_rgba(0,0,0,0.6)]'
          : 'bg-white border-amber-900/15 shadow-[0_15px_40px_rgba(180,145,95,0.08)]'
          }`}>
          {/* Top Row: Patient Avatar, Details, Switcher, and Direct Action CTAs */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-inherit">

            {/* Left: Active Patient Identity */}
            <div className="flex items-center space-x-4">
              <div className={`relative flex items-center justify-center w-14 h-14 rounded-2xl font-cinzel font-bold text-xl border shadow-inner ${isDark
                ? 'bg-gradient-to-br from-amber-400/20 to-slate-900 border-amber-400/40 text-amber-300'
                : 'bg-gradient-to-br from-amber-100 to-amber-50 border-amber-300 text-amber-800'
                }`}>
                <span>{activePersona.initials || activePersona.name.split(' ').map(n => n[0]).join('')}</span>
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-inherit animate-pulse"></span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className={`text-2xl sm:text-3xl font-cinzel font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                    {activePersona.name}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-wider border ${isDark
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    }`}>
                    Live Trajectory Active
                  </span>
                  <button
                    onClick={() => setActiveTab('bluetooth')}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono-code font-bold uppercase tracking-wider border flex items-center space-x-1.5 transition-all hover:scale-105 ${isDark
                      ? 'bg-blue-500/15 text-blue-300 border-blue-500/30 hover:border-blue-400'
                      : 'bg-blue-50 text-blue-800 border-blue-300 hover:border-blue-500 shadow-xs'
                      }`}
                    title="Click to view Connected Bluetooth Hub"
                  >
                    <Bluetooth className="w-3 h-3 text-blue-400 animate-pulse" />
                    <span>3 BLE Devices Connected (CGM • BP • Scale)</span>
                  </button>
                </div>

                <div className={`mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono-code ${isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                  <span>Age: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{activePersona.age}y</strong></span>
                  <span>•</span>
                  <span>Gender: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{activePersona.gender || 'Active'}</strong></span>
                  <span>•</span>
                  <span>Patient ID: <strong className={isDark ? 'text-amber-300' : 'text-amber-700'}>{activePersona.patientId || 'BT-9428'}</strong></span>
                  <span>•</span>
                  <span>Observation: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>30-Day Window ({history.length} Sessions)</strong></span>
                </div>
              </div>
            </div>

            {/* Center: Patient Persona Switcher Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-mono-code uppercase font-semibold mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Switch Patient:
              </span>
              {PATIENT_PERSONAS.map((persona) => {
                const isSelected = selectedPersonaId === persona.id;
                return (
                  <button
                    key={persona.id}
                    onClick={() => handleSelectPersona(persona.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all flex items-center space-x-2 border ${isSelected
                      ? isDark
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.35)] font-bold scale-105'
                        : 'bg-amber-700 text-white border-amber-800 shadow-md font-bold scale-105'
                      : isDark
                        ? 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white hover:bg-slate-800'
                        : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs'
                      }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>{persona.name} ({persona.age}y)</span>
                  </button>
                );
              })}
            </div>

            {/* Right: Direct Action CTAs (Generate Report & Log Strip) */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenReportModal}
                className={`px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center space-x-2 shadow-lg ${isDark
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.35)] hover:shadow-[0_0_35px_rgba(245,158,11,0.5)]'
                  : 'bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-md hover:shadow-lg'
                  }`}
              >
                <Printer className="w-4 h-4" />
                <span>Generate Clinician PDF Report</span>
              </button>

              <button
                onClick={() => setIsManualModalOpen(true)}
                className={`px-4 py-3 rounded-xl border text-xs font-semibold tracking-wide uppercase transition-all flex items-center space-x-2 ${isDark
                  ? 'bg-slate-900/80 hover:bg-slate-800 border-white/15 text-slate-200 hover:text-white'
                  : 'bg-white hover:bg-slate-50 border-slate-300 text-slate-700'
                  }`}
              >
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                <span>+ Log Test Strip</span>
              </button>

              <button
                onClick={handleExportCSV}
                className={`p-3 rounded-xl border text-xs transition-all ${isDark
                  ? 'bg-slate-900/80 hover:bg-slate-800 border-white/10 text-slate-300'
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 shadow-xs'
                  }`}
                title="Export CSV"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Clinical Story Narrative */}
          <div className={`mt-4 p-3.5 rounded-2xl border text-xs flex items-start space-x-3 ${isDark
            ? 'bg-slate-950/70 border-white/10 text-slate-300'
            : 'bg-amber-50/70 border-amber-200 text-slate-800'
            }`}>
            <span className="font-mono-code font-bold uppercase text-amber-500 text-[11px] shrink-0 mt-0.5">
              Clinical Case Focus:
            </span>
            <span className="leading-relaxed">
              {activePersona.clinicalStory}
            </span>
          </div>

          {/* 4 Real-time Telemetry Badges Right on Top */}
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono-code">
            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-950/80 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
              <span className={`block text-[10px] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Active Parameter
              </span>
              <span className={`text-sm font-bold block mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {currentBiomarkerMeta.name}
              </span>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>
                Latest: {activeHistory[activeHistory.length - 1]?.[selectedBiomarker] ?? 0} {currentBiomarkerMeta.unit}
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-950/80 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
              <span className={`block text-[10px] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Personal Baseline Corridor
              </span>
              <span className={`text-sm font-bold block mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                {activePersona.baselines?.[selectedBiomarker]?.normalCorridor || `${currentBiomarkerMeta.baselineMean} ${currentBiomarkerMeta.unit}`}
              </span>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                10-session rolling median IQR
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-950/80 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
              <span className={`block text-[10px] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Trajectory Direction
              </span>
              <span className={`text-sm font-bold block mt-0.5 ${selectedPersonaId === 'arjun'
                ? 'text-emerald-400'
                : selectedPersonaId === 'sunita'
                  ? 'text-amber-400'
                  : 'text-sky-400'
                }`}>
                {selectedPersonaId === 'arjun'
                  ? 'Normalized (0.0σ)'
                  : selectedPersonaId === 'sunita'
                    ? 'Upward Creep (+1.4σ)'
                    : 'Therapeutic Zone Active'}
              </span>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {selectedPersonaId === 'arjun' ? 'Day 22 spike resolved' : selectedPersonaId === 'sunita' ? 'Glucose creep tracked' : 'pH 6.5 target met'}
              </p>
            </div>

            <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-950/80 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
              <span className={`block text-[10px] uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Hydration Context (SG)
              </span>
              <span className={`text-sm font-bold block mt-0.5 ${isDark ? 'text-cyan-300' : 'text-teal-700'}`}>
                SG {activeHistory[activeHistory.length - 1]?.specificGravity ?? 1.018}
              </span>
              <p className={`text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Optimal fluid balance maintained
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            FEATURE TAB NAVIGATION (TRAJECTORY GRAPHS, STRIP SCANNER, GEMINI AI, REPORT)
        ========================================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className={`inline-flex p-1.5 rounded-2xl border shadow-md ${isDark ? 'bg-slate-900/90 border-white/10' : 'bg-white border-amber-900/10'
            }`}>
            {[
              { id: 'trajectory', label: '1. Trajectory Curves', icon: Activity },
              { id: 'multistream', label: '2. Multi-Stream Line Chart', icon: TrendingUp },
              { id: 'piechart', label: '3. Corridor & System Pie', icon: PieChartIcon },
              { id: 'bluetooth', label: '4. Bluetooth BLE Hub', icon: Bluetooth },
              { id: 'scanner', label: '5. Optical Strip Scanner', icon: Camera },
              { id: 'gemini', label: '6. Grounded Gemini AI', icon: Sparkles },
              { id: 'clinician', label: '7. Clinician Handover Report', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all ${isActive
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

          {/* Quick Trigger to Print Handover Report */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenReportModal}
              className={`px-4 py-2.5 rounded-xl text-xs font-mono-code uppercase font-semibold border flex items-center space-x-2 transition-all ${isDark
                ? 'border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 text-amber-300'
                : 'border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 shadow-xs'
                }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Doctor-Ready PDF</span>
            </button>
          </div>
        </div>

        {/* =========================================================================
            TAB 1: GUIDED STRIP SCANNER & OPTICAL CALIBRATOR
        ========================================================================== */}
        {activeTab === 'scanner' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left 7 Cols: Camera Viewfinder Simulation */}
            <div className={`lg:col-span-7 rounded-2xl border p-6 shadow-xl relative overflow-hidden ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
              }`}>
              {/* Header with real-time sensor tags */}
              <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b ${isDark ? 'border-white/10' : 'border-slate-100'
                }`}>
                <div className="flex items-center space-x-2">
                  <Camera className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-amber-600'}`} />
                  <span className={`text-sm font-semibold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Smartphone Optical Capture & Lux Calibration
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className={`flex items-center space-x-1 px-2.5 py-1 rounded font-mono-code border ${ambientLux >= 300
                    ? isDark ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-rose-500/10 text-rose-500 border-rose-500/30 font-bold animate-pulse'
                    }`}>
                    <Sun className="w-3 h-3" />
                    <span>{ambientLux} Lux ({ambientLux >= 300 ? 'Optimal' : 'Low Light!'})</span>
                  </span>

                  <span className={`px-2 py-1 rounded font-mono-code border ${Math.abs(tiltAngleDeg) <= 4
                    ? isDark ? 'bg-slate-800 text-slate-300 border-white/5' : 'bg-slate-100 text-slate-700 border-slate-200'
                    : 'bg-rose-500/10 text-rose-500 border-rose-500/30 font-bold'
                    }`}>
                    Tilt: {tiltAngleDeg}°
                  </span>
                </div>
              </div>

              {/* Viewport Simulation Box */}
              <div
                className={`mt-5 relative w-full h-[380px] rounded-xl overflow-hidden border flex items-center justify-center transition-all ${isDark ? 'bg-slate-950 border-white/10' : 'bg-slate-900 border-slate-300'
                  }`}
                style={{
                  filter: ambientLux < 300 ? `brightness(${ambientLux / 400})` : 'none'
                }}
              >
                {/* Background Reticle Grid */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

                {/* Perspective Guide Frame */}
                <div className="absolute inset-6 border-2 border-dashed border-amber-400/50 rounded-lg pointer-events-none flex flex-col justify-between p-3">
                  <div className="flex justify-between text-[10px] font-mono-code text-amber-300 font-semibold uppercase">
                    <span>Target Zone: Reagent Strip</span>
                    <span>CIE L*a*b* Calibrator Card</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono-code text-amber-300">
                    <span>Auto-Exposure Locked</span>
                    <span>Confidence: {selectedPreset.confidenceScore}%</span>
                  </div>
                </div>

                {/* Simulated 10-Pad Urine Test Strip with Interactive Pad Inspection */}
                <div
                  className="relative z-10 w-20 h-[300px] bg-[#f8fafc] rounded-md shadow-2xl border border-slate-300 flex flex-col items-center justify-between py-2 px-1 transition-transform"
                  style={{
                    transform: `rotate(${tiltAngleDeg}deg)`
                  }}
                >
                  <span className="text-[7px] font-mono-code text-slate-500 font-bold uppercase rotate-90 my-1">
                    BT-10SG
                  </span>

                  {/* 10 Test Pads */}
                  {BIOMARKER_DEFINITIONS.map((bio, idx) => {
                    const readingVal = editedReadings[bio.id] ?? 0;
                    const isSelectedPad = activePadIndex === idx;
                    // Find closest color swatch
                    const matchedSwatch = bio.colorScale.reduce((prev, curr) => {
                      return Math.abs(curr.value - readingVal) < Math.abs(prev.value - readingVal) ? curr : prev;
                    }, bio.colorScale[0]);

                    return (
                      <div
                        key={bio.id}
                        onClick={() => setActivePadIndex(idx)}
                        className={`w-12 h-4 rounded-xs border cursor-pointer transition-all flex items-center justify-center text-[8px] font-mono-code ${isSelectedPad
                          ? 'ring-2 ring-amber-400 scale-110 shadow-md border-amber-400 z-20'
                          : 'border-black/20 hover:scale-105'
                          }`}
                        style={{ backgroundColor: matchedSwatch.color }}
                        title={`${bio.name}: ${readingVal} ${bio.unit}`}
                      >
                        {isSelectedPad && <span className="text-[7px] font-bold text-black/70">✓</span>}
                      </div>
                    );
                  })}

                  <div className="w-8 h-4 rounded bg-slate-300 mt-1 flex items-center justify-center text-[7px] text-slate-600 font-bold">
                    PAD
                  </div>
                </div>

                {/* Real-Time Reaction Timer Display */}
                <div className="absolute top-4 right-4 bg-slate-900/95 border border-white/20 rounded-xl p-3 backdrop-blur-md flex items-center space-x-3 text-white shadow-lg">
                  <div className="relative w-9 h-9 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="2.5" className="text-slate-800" fill="none" />
                      <circle
                        cx="18"
                        cy="18"
                        r="15"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        className="text-amber-400 transition-all duration-1000"
                        strokeDasharray={94.2}
                        strokeDashoffset={94.2 * (1 - timerSeconds / 60)}
                        fill="none"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-mono-code font-bold">{timerSeconds}s</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono-code uppercase block text-slate-400">Reaction Time</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 text-xs"
                        title={isTimerRunning ? 'Pause' : 'Start'}
                      >
                        {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </button>
                      <button
                        onClick={() => {
                          setIsTimerRunning(false);
                          setTimerSeconds(60);
                        }}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 text-xs"
                        title="Reset 60s"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Warnings Overlay if Low Light or High Tilt */}
                {ambientLux < 300 && (
                  <div className="absolute bottom-4 inset-x-6 bg-rose-950/90 border border-rose-500/50 rounded-xl p-2.5 backdrop-blur-md flex items-center space-x-2 text-rose-200 text-xs animate-fadeIn">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>Low Light Hazard:</strong> Below 300 Lux. Colors may shift by ±1 block. Please turn on white room lighting.</span>
                  </div>
                )}
                {Math.abs(tiltAngleDeg) > 4 && (
                  <div className="absolute bottom-4 inset-x-6 bg-amber-950/90 border border-amber-500/50 rounded-xl p-2.5 backdrop-blur-md flex items-center space-x-2 text-amber-200 text-xs animate-fadeIn">
                    <Compass className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><strong>Perspective Tilt ({tiltAngleDeg}°):</strong> Please hold smartphone parallel to test strip to prevent aspect distortion.</span>
                  </div>
                )}
              </div>

              {/* Interactive Hardware Calibration Controls */}
              <div className={`mt-5 p-4 rounded-xl border grid grid-cols-1 md:grid-cols-2 gap-4 ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                <div>
                  <div className="flex justify-between text-xs font-mono-code mb-1">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Adjust Ambient Lux:</span>
                    <strong className="text-amber-500">{ambientLux} Lux</strong>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="800"
                    step="10"
                    value={ambientLux}
                    onChange={(e) => setAmbientLux(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono-code text-slate-500 mt-0.5">
                    <span>150 (Dim)</span>
                    <span>300 (Min Required)</span>
                    <span>800 (Bright)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono-code mb-1">
                    <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Camera Tilt Angle:</span>
                    <strong className="text-amber-500">{tiltAngleDeg}°</strong>
                  </div>
                  <input
                    type="range"
                    min="-10"
                    max="10"
                    step="0.5"
                    value={tiltAngleDeg}
                    onChange={(e) => setTiltAngleDeg(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono-code text-slate-500 mt-0.5">
                    <span>-10°</span>
                    <span>0° (Flat)</span>
                    <span>+10°</span>
                  </div>
                </div>
              </div>

              {/* Presets Switcher */}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className={`text-xs font-mono-code uppercase mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Test Presets:
                </span>
                {SIMULATOR_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handlePresetSelect(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono-code transition-all ${selectedPreset.id === p.id
                      ? isDark ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-amber-600 text-white font-bold'
                      : isDark ? 'bg-slate-900 text-slate-300 hover:text-white border border-white/5' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                      }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: Step 2 Mandatory Confirmation Audit (PDF Section 5 & 10) */}
            <div className={`lg:col-span-5 rounded-2xl border p-6 shadow-xl ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
              }`}>
              <div className={`pb-4 border-b ${isDark ? 'border-white/10' : 'border-slate-100'}`}>
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  <span className={`text-xs font-mono-code uppercase tracking-wider font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'
                    }`}>
                    Step 2: Mandatory Patient Confirmation & Audit
                  </span>
                </div>
                <h3 className={`text-lg font-bold font-cinzel mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Review & Audit Values
                </h3>
                <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Every reading requires patient verification. Generative models never write unconfirmed medical data into the database.
                </p>
              </div>

              {/* Pad Specific Inspector */}
              {(() => {
                const activeBio = BIOMARKER_DEFINITIONS[activePadIndex] || BIOMARKER_DEFINITIONS[0];
                const activeVal = editedReadings[activeBio.id] ?? 0;
                return (
                  <div className={`mt-4 p-4 rounded-xl border ${isDark ? 'bg-slate-950/80 border-amber-400/30' : 'bg-amber-50/70 border-amber-300/80'
                    }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono-code uppercase font-bold text-amber-500">
                        Inspecting: {activeBio.name}
                      </span>
                      <span className={`text-xs font-mono-code font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {activeVal} {activeBio.unit}
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5 mb-2">
                      {activeBio.colorScale.map((swatch, idx) => (
                        <button
                          key={idx}
                          onClick={() => setEditedReadings({ ...editedReadings, [activeBio.id]: swatch.value })}
                          className={`p-1.5 rounded-lg border text-center transition-all ${activeVal === swatch.value
                            ? 'ring-2 ring-amber-400 border-amber-400 font-bold scale-105'
                            : 'border-black/10 opacity-75 hover:opacity-100'
                            }`}
                        >
                          <div className="w-full h-4 rounded mb-1 border" style={{ backgroundColor: swatch.color }}></div>
                          <span className={`text-[9px] font-mono-code block ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            {swatch.label}
                          </span>
                        </button>
                      ))}
                    </div>

                    <p className={`text-[11px] leading-relaxed italic ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {activeBio.biologicalContext}
                    </p>
                  </div>
                );
              })()}

              {/* Fast Form Inputs for Key Biomarkers */}
              <div className="mt-4 space-y-3">
                <div className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-slate-900/70 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <div>
                    <span className={`text-xs font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Protein (Albumin)</span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Baseline: ~5 mg/dL</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={editedReadings.protein}
                      onChange={(e) => setEditedReadings({ ...editedReadings, protein: parseFloat(e.target.value) || 0 })}
                      className={`w-20 px-2 py-1 text-right text-xs font-mono-code rounded border ${isDark ? 'bg-slate-950 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                    />
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>mg/dL</span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-slate-900/70 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <div>
                    <span className={`text-xs font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Specific Gravity</span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Hydration index (1.005–1.030)</span>
                  </div>
                  <input
                    type="number"
                    step="0.001"
                    value={editedReadings.specificGravity}
                    onChange={(e) => setEditedReadings({ ...editedReadings, specificGravity: parseFloat(e.target.value) || 1.018 })}
                    className={`w-24 px-2 py-1 text-right text-xs font-mono-code rounded border ${isDark ? 'bg-slate-950 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                      }`}
                  />
                </div>

                <div className={`p-3 rounded-xl border flex items-center justify-between ${isDark ? 'bg-slate-900/70 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <div>
                    <span className={`text-xs font-semibold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Glucose</span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Normal: 0 (Neg)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={editedReadings.glucose}
                      onChange={(e) => setEditedReadings({ ...editedReadings, glucose: parseFloat(e.target.value) || 0 })}
                      className={`w-20 px-2 py-1 text-right text-xs font-mono-code rounded border ${isDark ? 'bg-slate-950 border-white/15 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                    />
                    <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>mg/dL</span>
                  </div>
                </div>

                {/* Lifestyle & Confounder Annotation */}
                <div className="pt-1">
                  <label className={`text-[11px] font-medium block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Select Lifestyle Context Tag:
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {['Post-Workout', '14h Fasting', 'Well-Hydrated', 'Dehydrated', 'First Morning Void'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setLifestyleTag(tag)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono-code border transition-all ${lifestyleTag === tag
                          ? isDark ? 'bg-amber-400 text-slate-950 font-bold border-amber-300' : 'bg-amber-600 text-white font-bold border-amber-700'
                          : isDark ? 'bg-slate-950 text-slate-400 border-white/5' : 'bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    value={userNotes}
                    onChange={(e) => setUserNotes(e.target.value)}
                    placeholder="Describe relevant factors: workout intensity, fluid intake, medication..."
                    className={`w-full text-xs p-2.5 rounded-xl border focus:outline-none ${isDark
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
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Save to Encrypted Trajectory</span>
                </button>
                <p className={`text-[10px] text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Values are stored locally in accordance with the BioTrajectory Zero-Monetization Privacy Charter.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: POLISHED LONGITUDINAL TRAJECTORY DASHBOARD & MULTI-CHART SUITE
        ========================================================================== */}
        {activeTab === 'trajectory' && (
          <div className={`rounded-2xl border p-6 sm:p-8 shadow-xl ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
            }`}>

            {/* Top Toolbar: Biomarker Selectors & View Modes */}
            <div className={`flex flex-wrap items-center justify-between gap-4 pb-6 border-b ${isDark ? 'border-white/10' : 'border-slate-100'
              }`}>
              {/* Primary Biomarkers */}
              <div className="flex flex-wrap items-center gap-1.5">
                {BIOMARKER_DEFINITIONS.slice(0, 6).map((bio) => (
                  <button
                    key={bio.id}
                    onClick={() => setSelectedBiomarker(bio.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${selectedBiomarker === bio.id
                      ? isDark
                        ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                        : 'bg-amber-600 text-white shadow-sm font-bold'
                      : isDark
                        ? 'bg-slate-900/60 text-slate-400 hover:text-white border border-white/5'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                      }`}
                  >
                    {bio.name}
                  </button>
                ))}
              </div>

              {/* Chart Mode Switcher */}
              <div className="flex items-center space-x-2 text-xs">
                <span className={`font-mono-code uppercase mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Chart Mode:</span>
                {[
                  { id: 'single', label: 'Single Trend', icon: TrendingUp },
                  { id: 'multistream', label: 'Multi-Stream (Strip + BLE)', icon: Activity },
                  { id: 'dual', label: 'Dual-Axis', icon: BarChart2 },
                  { id: 'piechart', label: 'Corridor Pie', icon: PieChartIcon },
                  { id: 'heatmap', label: 'Strip Matrix', icon: Grid },
                  { id: 'distribution', label: 'IQR Box', icon: Layers }
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isActive = chartMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setChartMode(mode.id)}
                      className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-mono-code text-xs transition-all ${isActive
                        ? isDark
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                          : 'bg-amber-700 text-white font-bold shadow-sm'
                        : isDark
                          ? 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                          : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                        }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Interactive Actions Row */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setIsManualModalOpen(true)}
                  className={`px-3.5 py-1.5 rounded-lg font-mono-code uppercase font-bold text-xs flex items-center space-x-1.5 transition-all shadow-sm ${isDark
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_15px_rgba(217,119,6,0.2)]'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>+ Log Reading by Hand</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className={`px-3 py-1.5 rounded-lg font-mono-code text-xs border flex items-center space-x-1.5 transition-all ${isDark
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
                  className={`px-3 py-1.5 rounded-lg font-mono-code text-xs border flex items-center space-x-1.5 transition-all ${isDark
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-white/10'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                    }`}
                  title="Download JSON"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Export JSON</span>
                </button>

                {/* Horizon Switcher */}
                <div className="flex items-center space-x-1 ml-2">
                  {[7, 14, 30].map((days) => (
                    <button
                      key={days}
                      onClick={() => setTimeRange(days)}
                      className={`px-2.5 py-1 rounded text-[11px] font-mono-code transition-all ${timeRange === days
                        ? isDark ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold' : 'bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold'
                        : isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      {days}D
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset to Active Persona */}
              <button
                onClick={() => {
                  setHistory(activePersona.history);
                  setSimulatedReadingsLimit(activePersona.history.length);
                }}
                className="text-[11px] font-mono-code text-slate-400 hover:text-amber-500 flex items-center space-x-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset {activePersona.name} Dataset</span>
              </button>
            </div>

            {/* Baseline Sufficiency & Data-Integrity Status Banner (PDF Section 11 & 17) */}
            <div className={`mt-5 p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${isBaselineActive
              ? isDark ? 'bg-slate-900/40 border-emerald-500/30' : 'bg-emerald-50/70 border-emerald-300'
              : isDark ? 'bg-amber-950/20 border-amber-500/40' : 'bg-amber-50/80 border-amber-300'
              }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${isBaselineActive ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500 animate-ping'
                  }`}></div>
                <div>
                  <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {isBaselineActive
                      ? `Personal Baseline Active (${simulatedReadingsLimit} of 10 Recommended Sessions Logged)`
                      : `Baseline Formation Pending (${simulatedReadingsLimit} of 10 Sessions Recorded)`}
                  </span>
                  <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {isBaselineActive
                      ? 'Constructed via non-parametric rolling medians & interquartile corridors. Avoids misleading composite wellness scores.'
                      : 'Statistical Stability Rule: Baselines require minimum 10 readings before locking corridors to avoid premature false alarms.'}
                  </p>
                </div>
              </div>

              {/* Interactive History Sufficiency Simulation Slider */}
              <div className="flex items-center space-x-3 text-xs font-mono-code">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Simulate History:</span>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={simulatedReadingsLimit}
                  onChange={(e) => setSimulatedReadingsLimit(parseInt(e.target.value))}
                  className="w-28 accent-amber-500 cursor-pointer"
                  title="Drag to simulate having fewer or more logged sessions"
                />
                <span className="font-bold text-amber-500 w-8 text-right">{simulatedReadingsLimit} logs</span>
              </div>
            </div>

            {/* =========================================================================
                CHART MODE 1: PRIMARY LONGITUDINAL TRAJECTORY CHART (SMOOTH SVG)
            ========================================================================== */}
            {chartMode === 'single' && (
              <div className="mt-6 relative">
                {/* Chart Header Indicators */}
                <div className="flex flex-wrap items-center justify-between text-xs font-mono-code mb-2 px-1">
                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-amber-500">{currentBiomarkerMeta.name} ({currentBiomarkerMeta.unit})</span>
                    <span className="text-slate-400">Personal Median: ~{currentBiomarkerMeta.baselineMean}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="flex items-center space-x-1 text-emerald-500">
                      <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500/20 border border-emerald-500/60 inline-block"></span>
                      <span>Personal Corridor</span>
                    </span>
                    <span className="flex items-center space-x-1 text-rose-500">
                      <span className="w-2.5 h-0.5 bg-rose-500 inline-block"></span>
                      <span>Advisory Threshold ({currentBiomarkerMeta.criticalThreshold})</span>
                    </span>
                  </div>
                </div>

                {/* SVG Render Canvas */}
                <div className="w-full overflow-x-auto">
                  <svg
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="w-full h-auto min-w-[700px] select-none"
                    onMouseMove={handleChartMouseMove}
                    onMouseLeave={handleChartMouseLeave}
                    onClick={handleChartClick}
                  >
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={isDark ? '#f59e0b' : '#d97706'} stopOpacity={isDark ? '0.35' : '0.25'} />
                        <stop offset="100%" stopColor={isDark ? '#38bdf8' : '#0284c7'} stopOpacity="0.0" />
                      </linearGradient>

                      <linearGradient id="baselineCorridorGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity={isDark ? '0.15' : '0.10'} />
                        <stop offset="100%" stopColor="#10b981" stopOpacity={isDark ? '0.05' : '0.03'} />
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
                            y={y + 3.5}
                            textAnchor="end"
                            className={`text-[10px] font-mono-code ${isDark ? 'fill-slate-500' : 'fill-slate-500'}`}
                          >
                            {currentBiomarkerMeta.unit === 'density' ? valAtY.toFixed(3) : valAtY.toFixed(1)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Baseline Band (Only shown confidently when >=10 readings) */}
                    {isBaselineActive ? (
                      <g>
                        <rect
                          x={padding.left}
                          y={baselineTopY}
                          width={chartWidth - padding.left - padding.right}
                          height={Math.max(6, baselineBottomY - baselineTopY)}
                          fill="url(#baselineCorridorGrad)"
                          stroke={isDark ? 'rgba(16, 185, 129, 0.4)' : 'rgba(5, 150, 105, 0.4)'}
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                        <text
                          x={chartWidth - padding.right - 8}
                          y={baselineTopY + 14}
                          textAnchor="end"
                          className={`text-[9px] font-mono-code ${isDark ? 'fill-emerald-400' : 'fill-emerald-700'}`}
                        >
                          Personal Baseline Corridor ({currentBiomarkerMeta.baselineMin} – {currentBiomarkerMeta.baselineMax} {currentBiomarkerMeta.unit})
                        </text>
                      </g>
                    ) : (
                      <g>
                        <rect
                          x={padding.left}
                          y={baselineTopY}
                          width={chartWidth - padding.left - padding.right}
                          height={Math.max(6, baselineBottomY - baselineTopY)}
                          fill="none"
                          stroke={isDark ? 'rgba(245, 158, 11, 0.4)' : 'rgba(217, 119, 6, 0.4)'}
                          strokeWidth="1.5"
                          strokeDasharray="6 6"
                        />
                        <text
                          x={chartWidth - padding.right - 8}
                          y={baselineTopY + 14}
                          textAnchor="end"
                          className={`text-[9px] font-mono-code font-bold ${isDark ? 'fill-amber-400' : 'fill-amber-700'}`}
                        >
                          Tentative Baseline (Collecting Data: {simulatedReadingsLimit}/10)
                        </text>
                      </g>
                    )}

                    {/* Critical Review Threshold Line */}
                    {getY(currentBiomarkerMeta.criticalThreshold) > padding.top && (
                      <g>
                        <line
                          x1={padding.left}
                          y1={getY(currentBiomarkerMeta.criticalThreshold)}
                          x2={chartWidth - padding.right}
                          y2={getY(currentBiomarkerMeta.criticalThreshold)}
                          stroke="#f43f5e"
                          strokeWidth="1.5"
                          strokeDasharray="4 4"
                          opacity="0.8"
                        />
                        <text
                          x={padding.left + 8}
                          y={getY(currentBiomarkerMeta.criticalThreshold) - 5}
                          className="text-[9px] font-mono-code fill-rose-500 font-bold"
                        >
                          Review Threshold: {currentBiomarkerMeta.criticalThreshold} {currentBiomarkerMeta.unit}
                        </text>
                      </g>
                    )}

                    {/* Area fill under curve */}
                    {primaryAreaStr && (
                      <path d={primaryAreaStr} fill="url(#areaGradient)" />
                    )}

                    {/* Smooth Trajectory Curve */}
                    {primaryPathStr && (
                      <path
                        d={primaryPathStr}
                        fill="none"
                        stroke={isDark ? '#f59e0b' : '#b45309'}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}

                    {/* Vertical Scrubber Guideline on Hover */}
                    {hoveredPoint && (
                      <line
                        x1={primaryPoints.find((p) => p.data.day === hoveredPoint.day)?.x ?? 0}
                        y1={padding.top}
                        x2={primaryPoints.find((p) => p.data.day === hoveredPoint.day)?.x ?? 0}
                        y2={chartHeight - padding.bottom}
                        stroke={isDark ? '#fbbf24' : '#b45309'}
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                        opacity="0.85"
                        pointerEvents="none"
                      />
                    )}

                    {/* Data Points and Interactivity */}
                    {primaryPoints.map((pt) => {
                      const isHovered = hoveredPoint?.day === pt.data.day;
                      const isFlagged = pt.data.flagged;
                      const val = pt.data[selectedBiomarker] ?? 0;
                      return (
                        <g
                          key={pt.data.day}
                          pointerEvents="none"
                        >
                          {/* Pulsing halo if flagged */}
                          {isFlagged && (
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="10"
                              fill="none"
                              stroke="#ef4444"
                              strokeWidth="1.5"
                              opacity="0.75"
                              pointerEvents="none"
                            />
                          )}

                          {/* Outer ring on hover - always present in DOM, controlled via opacity for zero DOM mutation */}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHovered ? 8 : 4}
                            fill="none"
                            stroke={isDark ? '#ffffff' : '#0f172a'}
                            strokeWidth="2"
                            opacity={isHovered ? 1 : 0}
                            pointerEvents="none"
                            style={{ transition: 'opacity 120ms ease, r 120ms ease' }}
                          />

                          {/* Point Dot */}
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isHovered ? 6 : 4}
                            fill={
                              isFlagged
                                ? '#ef4444'
                                : val > currentBiomarkerMeta.baselineMax
                                  ? '#f59e0b'
                                  : '#10b981'
                            }
                            stroke={isDark ? '#090e18' : '#ffffff'}
                            strokeWidth="1.5"
                            pointerEvents="none"
                            style={{ transition: 'r 120ms ease' }}
                          />

                          {/* X-Axis Date / Day Labels */}
                          <text
                            x={pt.x}
                            y={chartHeight - padding.bottom + 18}
                            textAnchor="middle"
                            pointerEvents="none"
                            className={`text-[9px] font-mono-code ${isHovered
                              ? isDark ? 'fill-amber-400 font-bold' : 'fill-amber-700 font-bold'
                              : isDark ? 'fill-slate-500' : 'fill-slate-600'
                              }`}
                          >
                            D{pt.data.day}
                          </text>
                        </g>
                      );
                    })}

                    {/* Seamless Invisible Interaction Tracking Surface */}
                    <rect
                      x={padding.left}
                      y={padding.top}
                      width={chartWidth - padding.left - padding.right}
                      height={chartHeight - padding.top - padding.bottom + 25}
                      fill="none"
                      pointerEvents="all"
                      style={{ cursor: hoveredPoint ? 'pointer' : 'default' }}
                    />
                  </svg>
                </div>

                {/* Fixed-Height Inspection HUD Dock (Zero Layout Shifts & Screen Shaking) */}
                <div className={`mt-3 min-h-[82px] rounded-xl border p-4 transition-all duration-200 flex flex-wrap items-center justify-between gap-4 shadow-sm ${hoveredPoint
                  ? hoveredPoint.flagged
                    ? isDark ? 'bg-rose-950/40 border-rose-500/40' : 'bg-rose-50 border-rose-300'
                    : isDark ? 'bg-slate-900/90 border-amber-400/30 shadow-[0_0_20px_rgba(245,158,11,0.1)]' : 'bg-white border-amber-300 shadow-md'
                  : isDark ? 'bg-slate-950/40 border-white/[0.06] text-slate-400' : 'bg-slate-50/80 border-slate-200 text-slate-500'
                  }`}>
                  {hoveredPoint ? (
                    <>
                      <div className="flex items-center space-x-3">
                        <div className={`w-3.5 h-3.5 rounded-full ${hoveredPoint.flagged ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className={`font-mono-code text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              Day {hoveredPoint.day} ({hoveredPoint.date} at {hoveredPoint.time})
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono-code border ${hoveredPoint.flagged
                              ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 font-bold'
                              : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              }`}>
                              {hoveredPoint.flagged ? 'Review Flagged (+3.8σ)' : 'Within Baseline'}
                            </span>
                          </div>
                          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            <strong>Notes: </strong>{hoveredPoint.notes || 'No contextual notes recorded.'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-xs font-mono-code">
                        <div>
                          <span className="block text-[10px] text-slate-400 uppercase">Protein</span>
                          <strong className={hoveredPoint.protein > 20 ? 'text-rose-500' : isDark ? 'text-white' : 'text-slate-900'}>
                            {hoveredPoint.protein} mg/dL
                          </strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 uppercase">Spec. Gravity</span>
                          <strong className={isDark ? 'text-white' : 'text-slate-900'}>{hoveredPoint.specificGravity}</strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 uppercase">pH</span>
                          <strong className={isDark ? 'text-white' : 'text-slate-900'}>{hoveredPoint.pH}</strong>
                        </div>
                        <div>
                          <span className="block text-[10px] text-slate-400 uppercase">Ketones</span>
                          <strong className={isDark ? 'text-white' : 'text-slate-900'}>{hoveredPoint.ketones} mg/dL</strong>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-between w-full text-xs font-mono-code">
                      <div className="flex items-center space-x-2.5">
                        <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
                        <span>Hover over any daily marker dot to inspect telemetry readings & clinical notes</span>
                      </div>
                      <span className={`text-[11px] px-2.5 py-1 rounded border hidden sm:inline-block ${isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-white border-slate-200 text-slate-600'
                        }`}>
                        Click marker to inspect full record
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* =========================================================================
                CHART MODE 2: SYNCHRONIZED DUAL-AXIS CORRELATION CHART
            ========================================================================== */}
            {chartMode === 'dual' && (
              <div className="mt-6 relative">
                <div className={`p-3.5 rounded-xl border mb-4 text-xs ${isDark ? 'bg-slate-950 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                  <strong className="text-amber-500">Dual-Axis Physiological Correlation: </strong>
                  Compare two biomarkers simultaneously. Notice how on Day 22, the elevation in Specific Gravity (1.028, urine concentration) coincides directly with the protein reading (32 mg/dL), confirming dehydration rather than chronic kidney disease!
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs font-mono-code mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span className="text-amber-500 font-bold">Left Axis: {currentBiomarkerMeta.name}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                    <span className="text-cyan-400 font-bold">Right Axis: </span>
                    <select
                      value={dualSecondaryBiomarker}
                      onChange={(e) => setDualSecondaryBiomarker(e.target.value)}
                      className={`px-2 py-1 rounded border text-xs font-mono-code ${isDark ? 'bg-slate-900 border-white/15 text-cyan-300' : 'bg-white border-slate-300 text-sky-800'
                        }`}
                    >
                      {BIOMARKER_DEFINITIONS.filter((b) => b.id !== selectedBiomarker).map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* SVG Dual-Axis Chart Canvas */}
                <div className="w-full overflow-x-auto">
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto min-w-[700px] select-none">
                    {/* Grid */}
                    {[0, 0.5, 1].map((pct, i) => {
                      const y = padding.top + pct * (chartHeight - padding.top - padding.bottom);
                      const leftVal = maxVal - pct * rangeY;
                      const rightVal = secMax - pct * secRangeY;
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
                          <text x={padding.left - 10} y={y + 3.5} textAnchor="end" className="text-[10px] font-mono-code fill-amber-500">
                            {currentBiomarkerMeta.unit === 'density' ? leftVal.toFixed(3) : leftVal.toFixed(1)}
                          </text>
                          <text x={chartWidth - padding.right + 10} y={y + 3.5} textAnchor="start" className="text-[10px] font-mono-code fill-cyan-400">
                            {secondaryBiomarkerMeta.unit === 'density' ? rightVal.toFixed(3) : rightVal.toFixed(1)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Primary Curve (Amber) */}
                    {primaryPathStr && (
                      <path d={primaryPathStr} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />
                    )}

                    {/* Secondary Curve (Cyan) */}
                    {secondaryPathStr && (
                      <path d={secondaryPathStr} fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="3 3" />
                    )}

                    {/* Points */}
                    {primaryPoints.map((pt, i) => (
                      <g key={i}>
                        <circle cx={pt.x} cy={pt.y} r="3.5" fill="#f59e0b" />
                        <circle cx={secondaryPoints[i].x} cy={secondaryPoints[i].y} r="3.5" fill="#38bdf8" />
                        <text x={pt.x} y={chartHeight - padding.bottom + 18} textAnchor="middle" className="text-[9px] font-mono-code fill-slate-500">
                          D{pt.data.day}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>
            )}

            {/* =========================================================================
                CHART MODE 3: 10-BIOMARKER MULTI-PAD HEATMAP TIMELINE MATRIX
            ========================================================================== */}
            {chartMode === 'heatmap' && (
              <div className="mt-6">
                <div className="mb-4 flex items-center justify-between text-xs font-mono-code">
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>
                    Complete 10-Pad Multi-Organ Strip Matrix across all {activeHistory.length} Test Days:
                  </span>
                  <div className="flex items-center space-x-3 text-[10px]">
                    <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span><span>Optimal</span></span>
                    <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span><span>Trace / Warning</span></span>
                    <span className="flex items-center space-x-1"><span className="w-2.5 h-2.5 rounded bg-rose-500"></span><span>Elevated</span></span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono-code text-xs border-collapse">
                    <thead>
                      <tr className={`border-b ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-600'}`}>
                        <th className="py-2 px-3 sticky left-0 z-10 bg-inherit font-bold">Biomarker</th>
                        {activeHistory.map((d) => (
                          <th key={d.day} className="py-2 px-2 text-center text-[10px]">D{d.day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className={`divide-y ${isDark ? 'divide-white/5' : 'divide-slate-200'}`}>
                      {BIOMARKER_DEFINITIONS.map((bio) => (
                        <tr key={bio.id} className="hover:bg-white/5 transition-colors">
                          <td className={`py-2 px-3 sticky left-0 z-10 font-medium ${isDark ? 'bg-[#090e18] text-white' : 'bg-white text-slate-900'}`}>
                            {bio.name}
                          </td>
                          {activeHistory.map((d) => {
                            const val = d[bio.id] ?? 0;
                            const isElevated = val > bio.criticalThreshold;
                            const isWarning = val > bio.baselineMax;
                            return (
                              <td key={d.day} className="py-1 px-1 text-center">
                                <div
                                  onClick={() => setSelectedBiomarker(bio.id)}
                                  className={`w-7 h-6 mx-auto rounded flex items-center justify-center text-[9px] font-bold cursor-pointer transition-transform hover:scale-110 ${isElevated
                                    ? 'bg-rose-500/80 text-white shadow-xs'
                                    : isWarning
                                      ? 'bg-amber-500/80 text-slate-950 shadow-xs'
                                      : isDark ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    }`}
                                  title={`${bio.name} on Day ${d.day}: ${val} ${bio.unit}`}
                                >
                                  {val}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* =========================================================================
                CHART MODE 4: DISTRIBUTION & ROLLING MEDIAN (IQR) BOX BREAKDOWN
            ========================================================================== */}
            {chartMode === 'distribution' && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`p-5 rounded-xl border md:col-span-2 ${isDark ? 'bg-slate-950 border-white/10' : 'bg-slate-50 border-slate-200'
                  }`}>
                  <h4 className="text-xs font-mono-code uppercase font-bold text-amber-500 mb-2">
                    Non-Parametric Rolling Median & Interquartile Corridor (IQR)
                  </h4>
                  <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Personal baselines avoid sensitive arithmetic means that get warped by temporary post-workout dehydration spikes. Non-parametric rolling medians protect against acute single-day distortion.
                  </p>

                  <div className="space-y-4 font-mono-code text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Personal Median ($M$):</span>
                        <strong className="text-emerald-400">{currentBiomarkerMeta.baselineMean} {currentBiomarkerMeta.unit}</strong>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full w-2/5"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Interquartile Range ($Q_1$ – $Q_3$):</span>
                        <strong className="text-amber-400">{currentBiomarkerMeta.baselineMin} – {currentBiomarkerMeta.baselineMax} {currentBiomarkerMeta.unit}</strong>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-amber-400 h-full w-3/5"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Critical Persistence Threshold:</span>
                        <strong className="text-rose-400">&gt; {currentBiomarkerMeta.criticalThreshold} {currentBiomarkerMeta.unit} for 3+ logs</strong>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                        <div className="bg-rose-500 h-full w-4/5"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`p-5 rounded-xl border flex flex-col justify-between ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                  <div>
                    <span className="text-[10px] font-mono-code uppercase tracking-wider text-slate-400 block mb-1">
                      Algorithmic Integrity
                    </span>
                    <h5 className={`font-cinzel text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      No Fake Composite Scores
                    </h5>
                    <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                      BioTrajectory avoids combining disparate biomarkers into an arbitrary single score. Each biological subsystem is evaluated in its natural physiological and biochemical units.
                    </p>
                  </div>
                  <div className="mt-4 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-400 font-mono-code">
                    ✓ Verified: Isolated Subsystem Evaluation
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                CHART MODE 5: ATTRACTIVE MULTI-STREAM OVERLAY (STRIP + BLE SENSORS)
            ========================================================================== */}
            {chartMode === 'multistream' && (
              <div className="mt-6">
                <AttractiveLineChart
                  history={activeHistory}
                  activePersona={activePersona}
                  selectedBiomarker={selectedBiomarker}
                  selectedBleMetric={selectedBleMetric}
                />
              </div>
            )}

            {/* =========================================================================
                CHART MODE 6: ATTRACTIVE DONUT & PIE CHART BREAKDOWN
            ========================================================================== */}
            {chartMode === 'piechart' && (
              <div className="mt-6">
                <AttractivePieChart activePersona={activePersona} />
              </div>
            )}

            {/* Click-to-Drill Inspection Drawer if user clicked a point */}
            {inspectedSession && (
              <div className={`mt-6 p-5 rounded-2xl border ${isDark ? 'bg-slate-950 border-amber-400/40' : 'bg-amber-50/80 border-amber-300'
                } animate-fadeIn`}>
                <div className="flex items-center justify-between pb-3 border-b border-amber-400/20">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <h4 className={`text-sm font-bold font-cinzel ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Detailed Session Inspector: Day {inspectedSession.day} ({inspectedSession.date} at {inspectedSession.time})
                    </h4>
                  </div>
                  <button
                    onClick={() => setInspectedSession(null)}
                    className="text-xs font-mono-code text-slate-400 hover:text-white"
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono-code text-xs">
                  <div className="p-2.5 rounded bg-white/5 border border-white/5">
                    <span className="block text-[9px] uppercase text-slate-400">Protein</span>
                    <strong className={inspectedSession.protein > 20 ? 'text-rose-400' : 'text-emerald-400'}>
                      {inspectedSession.protein} mg/dL
                    </strong>
                  </div>
                  <div className="p-2.5 rounded bg-white/5 border border-white/5">
                    <span className="block text-[9px] uppercase text-slate-400">Spec. Gravity</span>
                    <strong>{inspectedSession.specificGravity}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-white/5 border border-white/5">
                    <span className="block text-[9px] uppercase text-slate-400">pH</span>
                    <strong>{inspectedSession.pH}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-white/5 border border-white/5">
                    <span className="block text-[9px] uppercase text-slate-400">Glucose</span>
                    <strong>{inspectedSession.glucose} mg/dL</strong>
                  </div>
                  <div className="p-2.5 rounded bg-white/5 border border-white/5">
                    <span className="block text-[9px] uppercase text-slate-400">Ketones</span>
                    <strong>{inspectedSession.ketones} mg/dL</strong>
                  </div>
                </div>

                <div className="mt-3 text-xs">
                  <span className="font-semibold text-amber-500">Recorded Context: </span>
                  <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{inspectedSession.notes}</span>
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================================================
            TAB: ATTRACTIVE MULTI-STREAM LINE CHART (DIRECT FULL TAB)
        ========================================================================== */}
        {activeTab === 'multistream' && (
          <div className={`rounded-2xl border p-6 sm:p-8 shadow-xl ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
            }`}>
            <AttractiveLineChart
              history={activeHistory}
              activePersona={activePersona}
              selectedBiomarker={selectedBiomarker}
              selectedBleMetric={selectedBleMetric}
            />
          </div>
        )}

        {/* =========================================================================
            TAB: ATTRACTIVE DONUT & PIE CHART (DIRECT FULL TAB)
        ========================================================================== */}
        {activeTab === 'piechart' && (
          <div className={`rounded-2xl border p-6 sm:p-8 shadow-xl ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
            }`}>
            <AttractivePieChart activePersona={activePersona} />
          </div>
        )}

        {/* =========================================================================
            TAB: CONTINUOUS BLUETOOTH LOW ENERGY DEVICE HUB
        ========================================================================== */}
        {activeTab === 'bluetooth' && (
          <div className="space-y-6">
            <BluetoothHub
              onSelectMetricForChart={(metricKey) => {
                setSelectedBleMetric(metricKey);
                setActiveTab('multistream');
              }}
              onSyncDeviceData={() => {
                const now = new Date();
                const newEntry = {
                  day: history.length + 1,
                  date: now.toISOString().split('T')[0],
                  time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  protein: activePersona.baselines?.protein?.median || 6.2,
                  specificGravity: 1.018,
                  pH: 6.5,
                  glucose: 0,
                  ketones: 0,
                  blood: 0,
                  leukocytes: 0,
                  nitrite: 0,
                  urobilinogen: 0.2,
                  bilirubin: 0,
                  bleCgmGlucose: activeHistory[activeHistory.length - 1]?.bleCgmGlucose || 95,
                  bleBpSystolic: 118,
                  bleBpDiastolic: 76,
                  bleHeartRate: 68,
                  bleSpo2: 98.5,
                  bleHydration: 58.2,
                  notes: 'Live BLE synchronized packet: continuous CGM, blood pressure, and resting heart rate data integrated.',
                  flagged: false,
                  confirmed: true
                };
                setHistory(prev => [...prev, newEntry]);
                setSimulatedReadingsLimit(prev => prev + 1);
              }}
            />
          </div>
        )}

        {/* =========================================================================
            TAB 3: GROUNDED GEMINI AI & REASONING COPILOT (PDF Section 8 & 16)
        ========================================================================== */}
        {activeTab === 'gemini' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left 4 Cols: Clinical Prompt Selector */}
            <div className={`lg:col-span-4 rounded-2xl border p-6 shadow-xl ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
              }`}>
              <div className="flex items-center space-x-2 text-xs font-mono-code uppercase text-amber-500 font-bold mb-4">
                <Sparkles className="w-4 h-4" />
                <span>Grounded AI Explanatory Prompts</span>
              </div>
              <h3 className={`text-base font-cinzel font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Grounded Explanation Prompts
              </h3>

              <div className="space-y-2.5">
                {GEMINI_PROMPT_PRESETS.map((p) => {
                  const isSelected = selectedGeminiPrompt.id === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedGeminiPrompt(p);
                        setIsAiThinking(true);
                        setTimeout(() => setIsAiThinking(false), 500);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs ${isSelected
                        ? isDark
                          ? 'bg-amber-400/20 border-amber-400/60 text-white font-semibold'
                          : 'bg-amber-50 border-amber-400 text-amber-950 font-bold shadow-xs'
                        : isDark
                          ? 'bg-slate-900/50 border-white/5 text-slate-400 hover:text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                      <span className="block font-medium mb-1">{p.title}</span>
                      <p className={`text-[11px] font-light line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {p.prompt}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Custom Query Box */}
              <form onSubmit={handleCustomGeminiSubmit} className="mt-5 pt-4 border-t border-white/10">
                <label className={`text-[11px] font-mono-code uppercase block mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Ask Custom Health Trajectory Question:
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={customGeminiQuery}
                    onChange={(e) => setCustomGeminiQuery(e.target.value)}
                    placeholder="e.g. Could low water intake explain my SG?"
                    className={`flex-1 text-xs px-3 py-2 rounded-xl border focus:outline-none ${isDark ? 'bg-slate-950 border-white/10 text-white focus:border-amber-400' : 'bg-white border-slate-300 text-slate-900 focus:border-amber-500'
                      }`}
                  />
                  <button
                    type="submit"
                    className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

              {/* Grounding Toggle */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Show Grounding JSON:</span>
                <button
                  onClick={() => setShowGroundingPayload(!showGroundingPayload)}
                  className={`px-2.5 py-1 rounded font-mono-code text-[10px] ${showGroundingPayload ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                    }`}
                >
                  {showGroundingPayload ? 'Hide' : 'Inspect'}
                </button>
              </div>
            </div>

            {/* Right 8 Cols: Grounded Gemini AI Response (PDF Section 8) */}
            <div className={`lg:col-span-8 rounded-2xl border p-6 sm:p-8 shadow-xl ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
              }`}>
              <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b ${isDark ? 'border-white/10' : 'border-slate-100'
                }`}>
                <div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className={`text-xs font-mono-code uppercase font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'
                      }`}>
                      Gemini 3.8 Flash (High) • Deterministic Grounded Output
                    </span>
                  </div>
                  <h4 className={`text-base font-bold font-cinzel mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {selectedGeminiPrompt.title}
                  </h4>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono-code">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    ✓ Zero Diagnosis Guardrail
                  </span>
                </div>
              </div>

              {isAiThinking ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-3">
                  <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin"></div>
                  <span className="text-xs font-mono-code text-slate-400">
                    Querying confirmed structured telemetry across {activeHistory.length} sessions...
                  </span>
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  {/* Prompt Box */}
                  <div className={`p-3.5 rounded-xl border text-xs font-mono-code ${isDark ? 'bg-slate-950 border-white/5 text-amber-200' : 'bg-slate-100 border-slate-200 text-amber-900'
                    }`}>
                    <strong>User Inquiry: </strong>“{selectedGeminiPrompt.prompt}”
                  </div>

                  {/* 4 Grounded Sections Required by PDF Section 6 & 8 */}
                  <div className="space-y-4">
                    {/* Section 1: Facts */}
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
                      }`}>
                      <h5 className="text-xs font-mono-code uppercase font-bold text-amber-500 mb-1 flex items-center space-x-1.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>1. Confirmed Trend Facts (Observed Telemetry)</span>
                      </h5>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        {selectedGeminiPrompt.response.facts}
                      </p>
                    </div>

                    {/* Section 2: Physiological Context */}
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
                      }`}>
                      <h5 className="text-xs font-mono-code uppercase font-bold text-cyan-400 mb-1 flex items-center space-x-1.5">
                        <Info className="w-3.5 h-3.5" />
                        <span>2. Possible Physiological & Lifestyle Explanations</span>
                      </h5>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        {selectedGeminiPrompt.response.context}
                      </p>
                    </div>

                    {/* Section 3: Limitations & Uncertainty */}
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-amber-950/20 border-amber-500/30' : 'bg-amber-50 border-amber-200'
                      }`}>
                      <h5 className="text-xs font-mono-code uppercase font-bold text-amber-600 dark:text-amber-400 mb-1 flex items-center space-x-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>3. Measurement Limitations & Diagnostic Boundaries</span>
                      </h5>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-amber-200/90' : 'text-amber-950'}`}>
                        {selectedGeminiPrompt.response.limitations}
                      </p>
                    </div>

                    {/* Section 4: Action & Clinician Handover */}
                    <div className={`p-4 rounded-xl border ${isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
                      }`}>
                      <h5 className="text-xs font-mono-code uppercase font-bold text-emerald-600 dark:text-emerald-400 mb-1 flex items-center space-x-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>4. Next Steps & Clinician Consultation Guidance</span>
                      </h5>
                      <p className={`text-xs leading-relaxed ${isDark ? 'text-emerald-200/90' : 'text-emerald-950'}`}>
                        {selectedGeminiPrompt.response.recommendation}
                      </p>
                    </div>
                  </div>

                  {/* Optional Raw JSON Grounding Inspector */}
                  {showGroundingPayload && (
                    <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-amber-400/40 text-[10px] font-mono-code text-slate-300">
                      <span className="text-amber-400 uppercase font-bold block mb-1">
                        Exact Grounding JSON Sent to Gemini API (Deterministic Boundary):
                      </span>
                      <pre className="overflow-x-auto p-2 bg-black/60 rounded">
                        {JSON.stringify({
                          patientId: activePersona.id,
                          biomarker: currentBiomarkerMeta.id,
                          baseline: { median: currentBiomarkerMeta.baselineMean, iqr: [currentBiomarkerMeta.baselineMin, currentBiomarkerMeta.baselineMax] },
                          totalLogs: activeHistory.length,
                          recentReading: activeHistory[activeHistory.length - 1],
                          safetyInstructions: 'Prohibit medical diagnosis. Cite confirmed readings and state colorimetry tolerances.'
                        }, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 4: CLINICIAN SUMMARY & DOCTOR BRIEF (PDF Section 7 & 21)
        ========================================================================== */}
        {activeTab === 'clinician' && (
          <div className={`rounded-2xl border p-6 sm:p-8 shadow-xl ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
            }`}>
            <div className={`flex flex-wrap items-center justify-between gap-4 pb-6 border-b ${isDark ? 'border-white/10' : 'border-slate-100'
              }`}>
              <div>
                <span className={`text-xs font-mono-code uppercase font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                  Clinician Appointment Brief & Chronology
                </span>
                <h3 className={`text-2xl font-bold font-cinzel mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Doctor-Ready Longitudinal Chronology
                </h3>
                <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Prepares an objective, non-diagnostic timeline of confirmed measurements to save clinic consultation minutes.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={onOpenReportModal}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono-code uppercase flex items-center space-x-2 transition-all shadow-md ${isDark ? 'bg-amber-400 hover:bg-amber-300 text-slate-950' : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                >
                  <Printer className="w-4 h-4" />
                  <span>Launch Official Printable Report</span>
                </button>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono-code">
              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className="block text-[10px] uppercase text-slate-400">Patient</span>
                <strong className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{activePersona.name} ({activePersona.age}y)</strong>
                <p className="text-[10px] text-slate-500 mt-1">{activePersona.profileType}</p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className="block text-[10px] uppercase text-slate-400">Monitoring Window</span>
                <strong className={`text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeHistory.length} Test Sessions</strong>
                <p className="text-[10px] text-emerald-500 mt-1">Rolling Median Baseline Active</p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className="block text-[10px] uppercase text-slate-400">Peak Recorded Variance</span>
                <strong className="text-sm text-rose-500">Day 22 (32 mg/dL)</strong>
                <p className="text-[10px] text-amber-500 mt-1">Normalized to 5 mg/dL by Day 28</p>
              </div>

              <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className="block text-[10px] uppercase text-slate-400">Audit Status</span>
                <strong className="text-sm text-emerald-400">100% User Audited</strong>
                <p className="text-[10px] text-slate-500 mt-1">Cryptographic Local Store</p>
              </div>
            </div>

            {/* Chronological Table Preview */}
            <div className="mt-6">
              <h4 className={`text-xs font-mono-code uppercase font-bold mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Chronological Test Ledger (Latest Logs)
              </h4>
              <div className="overflow-x-auto">
                <table className={`w-full text-left font-mono-code text-xs border border-collapse ${isDark ? 'border-white/10' : 'border-slate-200'
                  }`}>
                  <thead className={`text-[10px] uppercase border-b ${isDark ? 'bg-slate-900 text-slate-400 border-white/10' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                    <tr>
                      <th className="py-2.5 px-3">Session</th>
                      <th className="py-2.5 px-3">Timing</th>
                      <th className="py-2.5 px-3">Protein</th>
                      <th className="py-2.5 px-3">Spec. Gravity</th>
                      <th className="py-2.5 px-3">pH</th>
                      <th className="py-2.5 px-3">Ketones</th>
                      <th className="py-2.5 px-3">Confounders / Notes</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-white/5 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
                    {activeHistory.slice(-7).map((entry) => (
                      <tr key={entry.day} className={entry.flagged ? (isDark ? 'bg-rose-950/20' : 'bg-rose-50 font-semibold') : ''}>
                        <td className="py-2 px-3">Day {entry.day} ({entry.date})</td>
                        <td className="py-2 px-3">{entry.time}</td>
                        <td className={`py-2 px-3 ${entry.protein > 20 ? 'text-rose-500 font-bold' : ''}`}>{entry.protein} mg/dL</td>
                        <td className="py-2 px-3">{entry.specificGravity}</td>
                        <td className="py-2 px-3">{entry.pH}</td>
                        <td className="py-2 px-3">{entry.ketones} mg/dL</td>
                        <td className="py-2 px-3 text-[11px] text-slate-500">{entry.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Clinician Handover Talking Points */}
            <div className={`mt-6 p-4 rounded-xl border text-xs ${isDark ? 'bg-slate-950 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
              <h5 className="font-mono-code uppercase font-bold text-amber-500 mb-1">
                Suggested Appointment Conversation Starters for Doctor:
              </h5>
              <ul className={`space-y-1 list-disc list-inside ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                <li>“I have tracked my urine chemistry longitudinally. On Oct 26 (Day 22), my protein spiked to 32 mg/dL with specific gravity 1.028 following an intense workout, but resolved to 5 mg/dL within 48 hours.”</li>
                <li>“Given this recovery trajectory, would you recommend adding a spot urine albumin-to-creatinine ratio (uACR) at my upcoming annual physical to double-check baseline glomerular filtration?”</li>
              </ul>
            </div>
          </div>
        )}

        {/* 4 Key Guiding Pillars */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className={`p-5 rounded-2xl border transition-all ${isDark
            ? 'bg-slate-900/40 border-white/5 hover:border-amber-400/30'
            : 'bg-white border-amber-900/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-amber-400/50'
            }`}>
            <div className={`flex items-center space-x-2 text-xs font-mono-code uppercase tracking-wider mb-1 ${isDark ? 'text-amber-300' : 'text-amber-700'
              }`}>
              <Compass className="w-3.5 h-3.5" />
              <span>Signal Input</span>
            </div>
            <div className={`text-lg font-semibold font-cinzel ${isDark ? 'text-white' : 'text-slate-900'}`}>
              10 Biomarkers
            </div>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Commercial reagent strips with guided optical camera framing & manual validation.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition-all ${isDark
            ? 'bg-slate-900/40 border-white/5 hover:border-emerald-400/30'
            : 'bg-white border-amber-900/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-emerald-400/50'
            }`}>
            <div className={`flex items-center space-x-2 text-xs font-mono-code uppercase tracking-wider mb-1 ${isDark ? 'text-emerald-300' : 'text-emerald-700'
              }`}>
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Trajectory Engine</span>
            </div>
            <div className={`text-lg font-semibold font-cinzel ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Personal Baseline
            </div>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Constructed after 10+ entries using rolling medians, eliminating arbitrary single scores.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition-all ${isDark
            ? 'bg-slate-900/40 border-white/5 hover:border-cyan-400/30'
            : 'bg-white border-amber-900/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-cyan-400/50'
            }`}>
            <div className={`flex items-center space-x-2 text-xs font-mono-code uppercase tracking-wider mb-1 ${isDark ? 'text-cyan-300' : 'text-sky-700'
              }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded AI</span>
            </div>
            <div className={`text-lg font-semibold font-cinzel ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Gemini Copilot
            </div>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Explains confirmed facts and uncertainty without hallucinating diagnoses.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition-all ${isDark
            ? 'bg-slate-900/40 border-white/5 hover:border-amber-400/30'
            : 'bg-white border-amber-900/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-amber-400/50'
            }`}>
            <div className={`flex items-center space-x-2 text-xs font-mono-code uppercase tracking-wider mb-1 ${isDark ? 'text-amber-300' : 'text-amber-700'
              }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Clinical Ethos</span>
            </div>
            <div className={`text-lg font-semibold font-cinzel ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Doctor in the Loop
            </div>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Doctor-ready timeline export; symptoms always take absolute priority.
            </p>
          </div>
        </div>

      </div>

      {/* Manual Entry Modal */}
      <ManualEntryModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSave={handleManualAdd}
      />
    </section>
  );
}
