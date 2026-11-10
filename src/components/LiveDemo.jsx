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
  User,
  Compass,
  TrendingUp,
  Bluetooth,
  PieChart as PieChartIcon,
  Radio,
  Sliders,
  Cpu,
  Clock,
  Eye,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Calendar,
  Share2,
  Trash2,
  Upload,
  RefreshCw
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
import {
  trajectoryStorage,
  calculateBaselineCorridor,
  analyzeTrajectoryDeviations
} from '../services/trajectoryStorage';
import ConsentModal from './ConsentModal';
import { GeminiAssistantService } from '../services/gemini';

export default function LiveDemo({ onOpenReportModal, onOpenProfile }) {
  const { isDark } = useTheme();

  // Active Main View: 'trajectory', 'multistream', 'piechart', 'bluetooth', 'scanner', 'gemini', 'clinician', 'dual', 'heatmap', 'distribution'
  const [activeTab, setActiveTab] = useState('trajectory');

  // Persistent Ledger Patients & Active Persona State
  const [patientList, setPatientList] = useState(() => trajectoryStorage.getAllPatients());
  const [selectedPersonaId, setSelectedPersonaId] = useState(() => trajectoryStorage.getActivePatient()?.id || 'arjun');

  const activePersona = useMemo(() => {
    return patientList.find((p) => p.id === selectedPersonaId) || patientList[0] || PATIENT_PERSONAS[0];
  }, [patientList, selectedPersonaId]);

  // History state allowing live additions, persona changes, and resets
  const [history, setHistory] = useState(() => activePersona?.history || []);

  // Baseline Sufficiency Simulation Slider
  const [simulatedReadingsLimit, setSimulatedReadingsLimit] = useState(() => (activePersona?.history?.length || 15));

  // Informed Consent Modal State
  const [isConsentOpen, setIsConsentOpen] = useState(() => !trajectoryStorage.getUserConsent());

  // Real Image Upload State for Optical Scanner
  const [uploadedStripImage, setUploadedStripImage] = useState(null);
  const [uploadFileName, setUploadFileName] = useState('');

  // Bluetooth Continuous Sensor Metric Selection State
  const [selectedBleMetric, setSelectedBleMetric] = useState('bleCgmGlucose');

  // Synchronize state with persistent storage events
  useEffect(() => {
    const handleDataUpdate = () => {
      const all = trajectoryStorage.getAllPatients();
      setPatientList(all);
      const active = all.find((p) => p.id === selectedPersonaId);
      if (active) {
        setHistory(active.history);
        setSimulatedReadingsLimit(active.history.length);
      }
    };

    const handlePatientChange = (e) => {
      const pid = e.detail?.patientId;
      if (pid) {
        setSelectedPersonaId(pid);
        const p = trajectoryStorage.getPatient(pid);
        if (p) {
          setHistory(p.history);
          setSimulatedReadingsLimit(p.history.length);
        }
      }
    };

    window.addEventListener('biotrajectory_data_updated', handleDataUpdate);
    window.addEventListener('biotrajectory_patient_changed', handlePatientChange);
    return () => {
      window.removeEventListener('biotrajectory_data_updated', handleDataUpdate);
      window.removeEventListener('biotrajectory_patient_changed', handlePatientChange);
    };
  }, [selectedPersonaId]);

  // Switch persona handler
  const handleSelectPersona = (personaId) => {
    setSelectedPersonaId(personaId);
    trajectoryStorage.setActivePatientId(personaId);
    const p = trajectoryStorage.getPatient(personaId) || PATIENT_PERSONAS.find((item) => item.id === personaId);
    if (p) {
      setHistory(p.history);
      setSimulatedReadingsLimit(p.history.length);
    }
  };

  // Chart Configuration States
  const [selectedBiomarker, setSelectedBiomarker] = useState('protein');
  const [dualSecondaryBiomarker, setDualSecondaryBiomarker] = useState('specificGravity');
  const [timeRange, setTimeRange] = useState(30); // 7, 14, 30, 90
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [inspectedSession, setInspectedSession] = useState(null);
  const [inspectedScanModal, setInspectedScanModal] = useState(null);

  // Manual Entry Modal State
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Optical Strip Scanner State
  const [selectedPreset, setSelectedPreset] = useState(SIMULATOR_PRESETS[1]);
  const [ambientLux, setAmbientLux] = useState(520);
  const [tiltAngleDeg, setTiltAngleDeg] = useState(0.4);
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activePadIndex, setActivePadIndex] = useState(3);
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

  // Dynamic baseline corridor calculation (rolling median + IQR corridor [Q25, Q75])
  const baselineCorridor = useMemo(() => {
    return calculateBaselineCorridor(activeHistory, selectedBiomarker);
  }, [activeHistory, selectedBiomarker]);

  // Physiological trajectory deviation analyzer (multi-day shifts vs transient spikes + SG confounder)
  const deviationReport = useMemo(() => {
    return analyzeTrajectoryDeviations(activeHistory, selectedBiomarker);
  }, [activeHistory, selectedBiomarker]);

  // Check if baseline is statistically established
  const isBaselineActive = activeHistory.length >= 10;

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

  // Real Image Upload Handler for Optical Strip Scanner
  const handleStripImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedStripImage(event.target.result);
      // Simulate calibrated optical analysis on real uploaded strip photo
      setEditedReadings((prev) => ({
        ...prev,
        specificGravity: 1.024,
        protein: 14.5,
        pH: 6.6,
        ketones: 5
      }));
      setUserNotes(`Optical colorimetry auto-sampled from photo: ${file.name}. CIE L*a*b* calibrated against white reference tile.`);
    };
    reader.readAsDataURL(file);
  };

  // Save new reading handler (Optical scanner)
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
      sampleType: uploadedStripImage ? 'Patient Photo Upload' : 'Guided Home Strip'
    };

    trajectoryStorage.addReading(selectedPersonaId, newEntry);
    setHistory((prev) => [...prev, newEntry]);
    setSimulatedReadingsLimit((prev) => prev + 1);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00685f', '#006947', '#00687a', '#f59e0b']
      });
    } catch (e) {
      // safe fallback
    }

    setTimeout(() => {
      setActiveTab('trajectory');
    }, 600);
  };

  // Delete reading handler
  const handleDeleteReading = (day) => {
    if (window.confirm(`Delete logged session from Day ${day}?`)) {
      trajectoryStorage.deleteReading(selectedPersonaId, day);
      setHistory((prev) => prev.filter((h) => h.day !== day));
      if (inspectedSession?.day === day) setInspectedSession(null);
      if (hoveredPoint?.day === day) setHoveredPoint(null);
    }
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const csvContent = trajectoryStorage.exportDataCSV(selectedPersonaId);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BioTrajectory_${selectedPersonaId}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // JSON Export Handler
  const handleExportJSON = () => {
    const jsonContent = trajectoryStorage.exportDataJSON(selectedPersonaId);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BioTrajectory_Dataset_${selectedPersonaId}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Reset Dataset Handler
  const handleResetDataset = () => {
    if (window.confirm(`Reset dataset for ${activePersona.name} back to factory baseline?`)) {
      trajectoryStorage.resetToDefault();
      const all = trajectoryStorage.getAllPatients();
      setPatientList(all);
      const active = all.find((p) => p.id === selectedPersonaId) || all[0];
      setHistory(active.history);
      setSimulatedReadingsLimit(active.history.length);
    }
  };

  // Purge All Data Handler
  const handlePurgeAllData = () => {
    if (window.confirm('Are you sure you want to completely purge all local ledger entries? This action cannot be undone.')) {
      trajectoryStorage.purgeAllData();
      const all = trajectoryStorage.getAllPatients();
      setPatientList(all);
      const active = all[0];
      setSelectedPersonaId(active.id);
      setHistory(active.history);
      setSimulatedReadingsLimit(active.history.length);
    }
  };

  // Manual Add Modal Handler
  const handleManualAdd = (newReading) => {
    const nextDay = history.length > 0 ? Math.max(...history.map((h) => h.day)) + 2 : 1;
    const item = {
      day: nextDay,
      ...newReading,
      confirmed: true
    };
    trajectoryStorage.addReading(selectedPersonaId, item);
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
  const handleCustomGeminiSubmit = async (e) => {
    e.preventDefault();
    if (!customGeminiQuery.trim()) return;
    setIsAiThinking(true);

    try {
      const aiResponse = await GeminiAssistantService.queryAssistant({
        query: customGeminiQuery,
        recentVitals: {
          biomarker: currentBiomarkerMeta.name,
          median: baselineCorridor.median,
          lastValue: activeHistory[activeHistory.length - 1]?.[selectedBiomarker],
          deviations: deviationReport.persistentDeviations.length
        }
      });

      setSelectedGeminiPrompt({
        id: 'custom-' + Date.now(),
        title: customGeminiQuery,
        prompt: customGeminiQuery,
        response: {
          facts: `Observed ${activeHistory.length} validated test logs for ${activePersona.name}. Rolling baseline median for ${currentBiomarkerMeta.name} is ${baselineCorridor.median} ${currentBiomarkerMeta.unit} with corridor [${baselineCorridor.q25} - ${baselineCorridor.q75}].`,
          context: aiResponse?.text || `Your query regarding "${customGeminiQuery}" was evaluated against physiological parameters. Specific gravity is currently ${activeHistory[activeHistory.length - 1]?.specificGravity || 1.018}, which indicates sample concentration context.`,
          limitations: 'BioTrajectory does not diagnose disease or replace clinical pathology consultations. Urine test-strip readings reflect transient physiological excretion.',
          recommendation: deviationReport.confounderNote || 'Continue routine morning tests. If deviations persist across 3 consecutive sessions, share this export with your clinician.'
        }
      });
    } catch (err) {
      setSelectedGeminiPrompt({
        id: 'custom-' + Date.now(),
        title: customGeminiQuery,
        prompt: customGeminiQuery,
        response: {
          facts: `Analyzed ${activeHistory.length} validated test logs for ${activePersona.name}. Rolling baseline median for ${currentBiomarkerMeta.name} is ${baselineCorridor.median} ${currentBiomarkerMeta.unit}.`,
          context: `Biomarker variations correlate with hydration state (SG ${activeHistory[activeHistory.length - 1]?.specificGravity || 1.018}), exertion, and circadian cycle.`,
          limitations: 'BioTrajectory is a preventive monitoring tool and does not provide medical diagnoses or prescriptions.',
          recommendation: 'Hydrate adequately and log a confirmation test tomorrow morning to verify corridor stability.'
        }
      });
    } finally {
      setIsAiThinking(false);
      setCustomGeminiQuery('');
    }
  };

  // =========================================================================
  // SVG CHART MATHEMATICS & GEOMETRY (SMOOTH BEZIER & DUAL-AXIS)
  // =========================================================================
  const chartWidth = 860;
  const chartHeight = 260;
  const padding = { top: 30, right: 55, bottom: 40, left: 55 };

  const activeValues = activeHistory.map((d) => d[selectedBiomarker] ?? 0);
  const minVal = Math.min(...activeValues, (baselineCorridor?.q25 ?? currentBiomarkerMeta.baselineMin) * 0.85, 0);
  const maxVal = Math.max(
    ...activeValues,
    currentBiomarkerMeta.criticalThreshold * 1.15,
    (baselineCorridor?.q75 ?? currentBiomarkerMeta.baselineMax) * 1.25
  );
  const rangeY = maxVal - minVal || 1;

  const getX = (index) => {
    if (activeHistory.length <= 1) return padding.left;
    return padding.left + (index / (activeHistory.length - 1)) * (chartWidth - padding.left - padding.right);
  };

  const getY = (val) => {
    return chartHeight - padding.bottom - ((val - minVal) / rangeY) * (chartHeight - padding.top - padding.bottom);
  };

  const secondaryValues = activeHistory.map((d) => d[dualSecondaryBiomarker] ?? 0);
  const secMin = Math.min(...secondaryValues, secondaryBiomarkerMeta.baselineMin * 0.95);
  const secMax = Math.max(...secondaryValues, secondaryBiomarkerMeta.baselineMax * 1.05);
  const secRangeY = secMax - secMin || 1;

  const getSecondaryY = (val) => {
    return chartHeight - padding.bottom - ((val - secMin) / secRangeY) * (chartHeight - padding.top - padding.bottom);
  };

  const baselineTopY = getY(baselineCorridor?.q75 ?? currentBiomarkerMeta.baselineMax);
  const baselineBottomY = getY(baselineCorridor?.q25 ?? currentBiomarkerMeta.baselineMin);

  // Generate Smooth SVG Path
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

  const primaryAreaStr = primaryPoints.length > 1
    ? `${primaryPathStr} L ${primaryPoints[primaryPoints.length - 1].x} ${chartHeight - padding.bottom} L ${primaryPoints[0].x} ${chartHeight - padding.bottom} Z`
    : '';

  // Zero-Flicker Proximity Tracker
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

  // Mock Recent Scans List matching Stitch table
  const recentScansList = [
    {
      id: '#RAW_38',
      timestamp: 'Yesterday, 8:15 AM',
      context: 'Fasting Morning • Scan #38',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYW0_xHZG3paXHnmtNR6qs3J3LdSzhzUPe28-O1yVcSzmTqIkaKAVhuprIj9hAp4S_fXg9q8GDcazUUYBLfQLawph6GKM5s0W2cWkkmS4ryZDQFgYPShUY_vGJoWXHcZw3rgiV5QtIRPAnt1ngfw7ECBoPtBPAOCjFGJ0IebkozBziOx8oX-xhhsdtwZXy_BKfUwRQ_ghdxoDW1-XfVVyenZ9jaDeCPYVcHsi7GBQ',
      biomarkers: [
        { label: 'SG: 1.026 ↑', type: 'variance' },
        { label: 'KET: Trace', type: 'variance' },
        { label: 'pH: 6.5', type: 'normal' },
        { label: 'PRO: Neg', type: 'normal' }
      ],
      wearable: 'RHR: 61 bpm • Sleep: 7.4h • HRV 52ms',
      validity: '99.4% Valid'
    },
    {
      id: '#RAW_37',
      timestamp: 'Nov 13, 7:45 AM',
      context: 'Pre-Breakfast • Scan #37',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCs2gb3JSvirz23Bns9MCc404KMCt2V69aimcsX4-gNhNGDdqGq55BaQtGSARnWUsYcKSGMF5HYu4zVQ283qNMu-9pX7cKMaYWZsqVlne5yA_I0QtOBBZaSIoKniNKGZQEZl7dxwtnGFFXCw8qeuDZ7yUJARL7t6HdRnjDeM6FwzUVzSfjgDkBlvCeW_lYKJh0D-z93Ga6Pk4R97i5Nrsa9Ym7IZNwMbWokywCbiZc',
      biomarkers: [
        { label: 'SG: 1.018', type: 'normal' },
        { label: 'KET: Neg', type: 'normal' },
        { label: 'pH: 6.8', type: 'normal' },
        { label: 'ALB: <10', type: 'normal' }
      ],
      wearable: 'RHR: 58 bpm • Sleep: 8.1h • HRV 58ms',
      validity: '99.7% Valid'
    },
    {
      id: '#RAW_36',
      timestamp: 'Nov 11, 6:30 PM',
      context: 'Post-Workout • Scan #36',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXLkPpHewvZQQ1u7DcM7AEoDs9mfuxeYYoparcucw_-mljNd_1h9LGMeDEFV0d1sm4VPt4KuI3M2EnbMhJlCg3EhkyKmFNOpamwIa_Etbc50lntZ7DMtj0JH0oqW56_WND5eSQ26X5F9Utlw_VhC61PDLJ62ZnnBOeS9PzMqelnMdJaJsIOq0JEyaFAreaxbTYVbKK_-S9PXeCJ2dxIZ0z8BrGf0HGP4DQgjVABYQ',
      biomarkers: [
        { label: 'SG: 1.021', type: 'normal' },
        { label: 'KET: Neg', type: 'normal' },
        { label: 'pH: 6.2', type: 'normal' },
        { label: 'LEU: Neg', type: 'normal' }
      ],
      wearable: 'Active HR: 142 bpm • Run: 5.2 km',
      validity: '98.9% Valid'
    },
    {
      id: '#RAW_35',
      timestamp: 'Nov 09, 8:00 AM',
      context: 'Morning Baseline • Scan #35',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjj0eubKGtrkH_7dvGyX71XZblJ_wXcMr9y03dVfgdX5mfggokSsThYtHtLs_8MSn0vhpMrgYz6tUeLPldced7B1vOpwU60XlUglj4J0aUV1UjZMgvKB3PDJS_-wYm2CAm7z4--byoXNkwBrlF4fmco8zkg7vys28KRFai0eWGYcgQiPEqnxnjaf0dKJWfG4lH1c6IF7ZhpNXmhmLgY9C-fLIqiNTzWrxBQ1KmLZQ',
      biomarkers: [
        { label: 'SG: 1.014', type: 'normal' },
        { label: 'KET: Neg', type: 'normal' },
        { label: 'pH: 6.9', type: 'normal' },
        { label: 'GLU: Norm', type: 'normal' }
      ],
      wearable: 'RHR: 59 bpm • Sleep: 7.9h • HRV 55ms',
      validity: '99.8% Valid'
    },
    {
      id: '#RAW_34',
      timestamp: 'Nov 07, 7:50 AM',
      context: 'Morning Baseline • Scan #34',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS6oMXGbvor5TRONp6CO2eGNnx67XuOzkuLGYFa8ThXtnaum4owgI3qq2_umdEGVt5cFFugXGKS4t_zrr-R-8Vut92tIKGel4h1tCjYf4xCU1OPnHgdu-ZZwH82xiFmcQQ9-w-OTnvA5BueDhDfbOSal5TpgeasRn0F5_EOt6zS1LbklOBZz5uiHURoZBpmEb29wuydFJBg2R7U1mRIU5KN0Fst0Z5CVQYkcwIB6s',
      biomarkers: [
        { label: 'SG: 1.015', type: 'normal' },
        { label: 'KET: Neg', type: 'normal' },
        { label: 'pH: 6.7', type: 'normal' },
        { label: 'PRO: Neg', type: 'normal' }
      ],
      wearable: 'RHR: 60 bpm • Sleep: 7.2h • HRV 51ms',
      validity: '99.1% Valid'
    }
  ];

  return (
    <section
      className={`relative pt-24 pb-16 transition-colors overflow-hidden ${isDark ? 'bg-[#070b14] text-slate-100' : 'bg-[#faf8ff] text-[#131b2e]'
        }`}
      id="live-prototype"
    >
      {/* Subtle decorative ambient background elements from Stitch design */}
      <div className="absolute -top-32 right-12 w-96 h-96 bg-[#00685f]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-96 left-8 w-80 h-80 bg-[#00687a]/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col gap-6">

        {/* =========================================================================
            1. EXECUTIVE STATUS & TELEMETRY BAR (STITCH DESIGN SPEC)
        ========================================================================== */}
        <section className={`rounded-xl p-6 sm:p-7 relative overflow-hidden transition-all border ${isDark
          ? 'bg-[#0d1526] border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-white border-[#e2e8f0] shadow-xs'
          }`}>
          {/* Deep Clinical Teal Left Accent Line */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#00685f]"></div>

          <div className="flex flex-col gap-5 pl-2">
            {/* Full-Width Telemetry & Personalized Welcome Heading */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-sans text-[11px] uppercase tracking-wider bg-[#00685f]/10 text-[#00685f] dark:text-[#6bd8cb] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00685f] dark:bg-[#6bd8cb] animate-pulse"></span>
                  Longitudinal Telemetry Active
                </span>
                <span className="text-slate-400 text-xs hidden sm:inline">•</span>
                <span className={`text-xs font-sans ${isDark ? 'text-slate-400' : 'text-[#3d4947]'}`}>
                  Calibrated against iPhone 15 Pro TrueDepth Sensor
                </span>
                <span className="text-slate-400 text-xs hidden sm:inline">•</span>
                <span className={`text-xs font-sans ${isDark ? 'text-slate-400' : 'text-[#3d4947]'}`}>
                  Person: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{activePersona.name} ({activePersona.age}y)</strong>
                </span>
              </div>

              <h1 className="font-sans text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight leading-snug">
                Welcome back, {activePersona.name.split(' ')[0]}. Your personal baseline is established across {activeHistory.length} days{' '}
                <span className={`font-normal text-base sm:text-lg ${isDark ? 'text-slate-400' : 'text-[#3d4947]'}`}>
                  ({history.length} strip scans logged).
                </span>
              </h1>

              <p className={`text-xs sm:text-sm leading-relaxed max-w-4xl ${isDark ? 'text-slate-300' : 'text-[#3d4947]'}`}>
                Continuous urine analyte matrix synchronized with daily biosensors. Biological drift confidence index:{' '}
                <strong className="text-[#00685f] dark:text-[#6bd8cb] font-semibold">98.4% optical match</strong>.
              </p>
            </div>

            {/* Quick Actions Toolbelt Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
              {/* Left Cluster: Persona Switchers & Data Sovereignty Export */}
              <div className="flex flex-wrap items-center gap-2">
                <div className={`flex items-center p-1 rounded-lg border text-xs font-sans ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                  {patientList.map((p) => {
                    const isSelected = selectedPersonaId === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => handleSelectPersona(p.id)}
                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${isSelected
                          ? 'bg-[#00685f] text-white shadow-xs font-semibold'
                          : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                          }`}
                        title={p.description || p.name}
                      >
                        {p.id === 'my_user_profile' ? 'You (My Ledger)' : p.name.split(' ')[0]}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleExportCSV}
                    className={`flex items-center gap-1 font-sans text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors border ${isDark
                      ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                      }`}
                    title="Download verified patient measurements in CSV format"
                    type="button"
                  >
                    <Download className="w-3.5 h-3.5 text-[#00685f]" />
                    <span>CSV</span>
                  </button>

                  <button
                    onClick={handleExportJSON}
                    className={`flex items-center gap-1 font-sans text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors border ${isDark
                      ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
                      }`}
                    title="Download verified patient measurements in JSON format"
                    type="button"
                  >
                    <Download className="w-3.5 h-3.5 text-[#00687a]" />
                    <span>JSON</span>
                  </button>

                  <button
                    onClick={handleResetDataset}
                    className={`p-1.5 rounded-lg transition-colors border ${isDark
                      ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border-slate-800'
                      : 'bg-white hover:bg-slate-50 text-slate-500 hover:text-amber-600 border-slate-200 shadow-xs'
                      }`}
                    title="Reset active dataset to factory baseline"
                    type="button"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Cluster: Interactive Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setActiveTab('scanner')}
                  className={`flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border ${isDark
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                    : 'bg-white hover:bg-slate-50 text-[#131b2e] border-slate-200 shadow-xs'
                    }`}
                  type="button"
                >
                  <Sliders className="w-3.5 h-3.5 text-[#00687a]" />
                  <span>Review Calibration</span>
                </button>

                {onOpenProfile && (
                  <button
                    onClick={onOpenProfile}
                    className={`flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border ${isDark
                      ? 'bg-slate-900 hover:bg-slate-800 text-teal-300 border-teal-500/30'
                      : 'bg-white hover:bg-slate-50 text-[#00685f] border-teal-200 shadow-xs'
                      }`}
                    type="button"
                    title="Configure your personal health profile, units, and baseline goals"
                  >
                    <User className="w-3.5 h-3.5 text-[#00685f] dark:text-teal-400" />
                    <span>Profile &amp; Goals</span>
                  </button>
                )}

                <button
                  onClick={onOpenReportModal}
                  className={`flex items-center gap-1.5 font-sans text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors border ${isDark
                    ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                    : 'bg-white hover:bg-slate-50 text-[#131b2e] border-slate-200 shadow-xs'
                    }`}
                  type="button"
                >
                  <FileText className="w-3.5 h-3.5 text-[#00685f]" />
                  <span>Export Doctor Packet</span>
                </button>

                <button
                  onClick={() => setIsManualModalOpen(true)}
                  className="flex items-center gap-1.5 bg-[#00685f] hover:bg-[#008378] text-white font-sans text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all shadow-xs active:scale-95"
                  type="button"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>+ New Strip Scan</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            2. 4 BENTO KEY METRIC MODULES (STITCH DESIGN SPEC)
        ========================================================================== */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Bento 1: Trend Stability */}
          <div className={`rounded-xl p-5 flex flex-col justify-between transition-all border ${isDark
            ? 'bg-[#0d1526] border-slate-800 hover:border-slate-700'
            : 'bg-white border-[#e2e8f0] hover:border-slate-300 shadow-xs'
            }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold font-sans uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#3d4947]'
                }`}>
                Trend Stability
              </span>
              <span className="flex items-center gap-1 text-[11px] font-sans font-semibold text-[#006947] dark:text-[#6ffbbe] bg-[#006947]/10 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006947] dark:bg-[#6ffbbe]"></span> In Envelope
              </span>
            </div>

            <div className="my-3 flex items-baseline justify-between">
              <div>
                <div className="font-sans text-3xl font-bold tracking-tight text-on-surface">94%</div>
                <div className={`text-xs font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Within personal boundary
                </div>
              </div>

              {/* Mini Sparkline SVG */}
              <div className="w-24 h-10">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40">
                  <rect className="text-[#006947]/10" fill="currentColor" height="24" rx="2" width="100" x="0" y="8"></rect>
                  <path className="text-[#00685f]" d="M 0,22 Q 15,18 30,24 T 60,19 T 85,15 T 100,20" fill="none" stroke="currentColor" strokeWidth="2.5"></path>
                  <circle className="text-[#00685f]" cx="100" cy="20" fill="currentColor" r="3" stroke="white" strokeWidth="1.5"></circle>
                </svg>
              </div>
            </div>

            <div className={`text-xs font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              36 of 38 readings strictly within personalized range
            </div>
          </div>

          {/* Bento 2: Active Indicators */}
          <div className={`rounded-xl p-5 flex flex-col justify-between transition-all border ${isDark
            ? 'bg-[#0d1526] border-slate-800 hover:border-slate-700'
            : 'bg-white border-[#e2e8f0] hover:border-slate-300 shadow-xs'
            }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold font-sans uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#3d4947]'
                }`}>
                Active Analytes
              </span>
              <span className="text-[11px] font-sans font-semibold text-[#00687a] dark:text-[#57dffe] bg-[#00687a]/10 px-2 py-0.5 rounded-full">
                7 Tracked
              </span>
            </div>

            <div className="my-3">
              <div className="font-sans text-3xl font-bold tracking-tight text-on-surface">
                7 <span className={`text-sm font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ 10 Multiplex</span>
              </div>
              <div className={`text-xs font-sans mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                SG, pH, PRO, KET, LEU, ALB, GLU
              </div>
            </div>

            <div className="flex items-center gap-1.5 pt-1 text-xs font-sans">
              <span className="h-2 w-2 rounded-full bg-[#00685f]"></span>
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                Last complete multipanel: Yesterday 8:15 AM
              </span>
            </div>
          </div>

          {/* Bento 3: Notable Variance Flag */}
          <div className={`rounded-xl p-5 flex flex-col justify-between transition-all border-l-4 border-l-[#f59e0b] border ${isDark
            ? 'bg-[#0d1526] border-slate-800 hover:border-slate-700'
            : 'bg-white border-[#e2e8f0] hover:border-slate-300 shadow-xs'
            }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold font-sans uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#3d4947]'
                }`}>
                Identified Shift
              </span>
              <span className="flex items-center gap-1 text-[11px] font-sans font-semibold text-[#f59e0b] bg-[#f59e0b]/10 px-2 py-0.5 rounded-full">
                <Info className="w-3 h-3" /> 1 Variance
              </span>
            </div>

            <div className="my-3">
              <div className="font-sans text-lg font-bold leading-tight">SG 1.026 & Trace KET</div>
              <div className={`text-xs font-sans mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Mild concentration vs 1.015 baseline
              </div>
            </div>

            <div className="text-xs font-sans flex items-center justify-between">
              <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Scan #38 • 26h ago</span>
              <button
                onClick={() => {
                  setSelectedBiomarker('specificGravity');
                  setActiveTab('trajectory');
                }}
                className="text-[#00685f] dark:text-[#6bd8cb] font-semibold hover:underline"
              >
                Inspect
              </button>
            </div>
          </div>

          {/* Bento 4: Wearable Context Sync */}
          <div className={`rounded-xl p-5 flex flex-col justify-between transition-all border ${isDark
            ? 'bg-[#0d1526] border-slate-800 hover:border-slate-700'
            : 'bg-white border-[#e2e8f0] hover:border-slate-300 shadow-xs'
            }`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold font-sans uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-[#3d4947]'
                }`}>
                Contextual Biosensors
              </span>
              <button
                onClick={() => setActiveTab('bluetooth')}
                className="flex items-center gap-1 text-[11px] font-sans font-semibold text-[#006947] dark:text-[#6ffbbe] hover:underline"
              >
                <Activity className="w-3.5 h-3.5 animate-pulse" /> Live BLE
              </button>
            </div>

            <div className="my-3 flex items-center justify-between">
              <div>
                <div className="font-sans text-2xl font-bold tracking-tight">
                  61 <span className="text-xs font-normal text-slate-400">BPM</span>
                </div>
                <div className={`text-xs font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Resting HR (Base: 59)
                </div>
              </div>
              <div className="text-right">
                <div className="font-sans text-2xl font-bold tracking-tight">
                  7.4 <span className="text-xs font-normal text-slate-400">hrs</span>
                </div>
                <div className={`text-xs font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Sleep Restorative: 84%
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-sans text-[#00687a] dark:text-[#57dffe]">
              <span className="w-2 h-2 rounded-full bg-[#00687a]"></span>
              <span>Passive hydration deficit detected</span>
            </div>
          </div>
        </section>

        {/* =========================================================================
            3. GEMINI AI LONGITUDINAL PLAIN-LANGUAGE INSIGHT CARD (STITCH SPEC)
        ========================================================================== */}
        <section className={`rounded-xl p-6 sm:p-7 relative overflow-hidden transition-all border ${isDark
          ? 'bg-[#0d1526] border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-white border-[#e2e8f0] shadow-xs'
          }`}>
          {/* AI Subtle decorative flourish */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00685f]/5 rounded-bl-full pointer-events-none"></div>

          <div className="flex flex-col gap-5 relative z-10">
            {/* Header */}
            <div className={`flex flex-wrap items-center justify-between gap-3 pb-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'
              }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#00685f] text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-sans text-base sm:text-lg font-bold">Gemini Longitudinal Pattern Interpretation</h2>
                    <span className="text-[11px] font-sans font-semibold bg-[#00685f]/10 text-[#00685f] dark:text-[#6bd8cb] px-2 py-0.5 rounded-full">
                      Gemini 1.5 Pro Telemetry
                    </span>
                  </div>
                  <p className={`text-xs font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Objective evaluation of continuous biomarker deviations vs your 42-day norm
                  </p>
                </div>
              </div>

              {/* Boundary badge */}
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${isDark ? 'bg-slate-900 text-slate-300 border border-slate-800' : 'bg-slate-100 text-slate-700'
                }`}>
                <ShieldCheck className="w-3.5 h-3.5 text-[#006947]" />
                <span>Non-Diagnostic • Pattern Analysis Only</span>
              </div>
            </div>

            {/* 4 Structured Interpretation Bento Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: What Changed */}
              <div className={`rounded-lg p-4 flex flex-col gap-1.5 border ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-[#f8faff] border-slate-200'
                }`}>
                <div className="flex items-center gap-1.5 text-[#00685f] font-sans text-sm font-semibold">
                  <TrendingUp className="w-4 h-4" />
                  <span>What Changed</span>
                </div>
                <p className={`text-xs font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Over the last 72 hours, your <strong>Urine Specific Gravity</strong> trended from your baseline 1.015 up to <strong>1.026</strong>, coinciding with trace Ketones (5 mg/dL) following a recorded low-carbohydrate fasting window.
                </p>
              </div>

              {/* Card 2: What It Likely Reflects */}
              <div className={`rounded-lg p-4 flex flex-col gap-1.5 border ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-[#f8faff] border-slate-200'
                }`}>
                <div className="flex items-center gap-1.5 text-[#00687a] font-sans text-sm font-semibold">
                  <Info className="w-4 h-4" />
                  <span>What It Likely Reflects</span>
                </div>
                <p className={`text-xs font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Typical physiologic response to mild dehydration and deliberate ketogenic metabolic shift. Crucially, your renal filtration markers (<strong>Microalbumin & Protein</strong>) remain flatlined strictly within negative baseline bounds.
                </p>
              </div>

              {/* Card 3: What This DOES NOT Mean */}
              <div className={`rounded-lg p-4 flex flex-col gap-1.5 border ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-[#f8faff] border-slate-200'
                }`}>
                <div className="flex items-center gap-1.5 text-slate-500 font-sans text-sm font-semibold">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>What This Does NOT Mean</span>
                </div>
                <p className={`text-xs font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  This is <strong>not</strong> an indicator of chronic renal impairment or diabetic ketoacidosis (DKA). Concurrent fasting glucose remained optimal (86 mg/dL), and leukocytes / nitrites are completely negative.
                </p>
              </div>

              {/* Card 4: Suggested Next Step */}
              <div className={`rounded-lg p-4 flex flex-col gap-1.5 border ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-[#f8faff] border-slate-200'
                }`}>
                <div className="flex items-center gap-1.5 text-[#006947] font-sans text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Suggested Next Step</span>
                </div>
                <p className={`text-xs font-sans leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Increase structured fluid intake by <strong>500–750 mL</strong> of electrolyte water today. Log a confirmation strip test tomorrow morning during your second void to verify specific gravity re-entry into your 1.015 envelope.
                </p>
              </div>
            </div>

            {/* Gemini Interactive Follow-up Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-sans text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-[#00685f]" />
                <span>Need clarification? You can ask Gemini questions about your physiological baseline.</span>
              </div>

              <form onSubmit={handleCustomGeminiSubmit} className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  value={customGeminiQuery}
                  onChange={(e) => setCustomGeminiQuery(e.target.value)}
                  placeholder="Ask Gemini about your baseline..."
                  className={`px-3 py-1.5 text-xs rounded-lg border focus:outline-none w-full sm:w-64 ${isDark ? 'bg-[#070b14] border-slate-800 text-white focus:border-[#00685f]' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#00685f]'
                    }`}
                />
                <button
                  type="submit"
                  disabled={isAiThinking}
                  className="px-3 py-1.5 rounded-lg bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold transition-all shrink-0 flex items-center gap-1"
                >
                  {isAiThinking ? <span>Thinking...</span> : <span>Ask Gemini</span>}
                  <ArrowRight className="w-3 h-3" />
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. MAIN LONGITUDINAL BIOMARKER TRAJECTORY & MULTI-VIEW SUITE
        ========================================================================== */}
        <section className={`rounded-xl p-6 sm:p-7 relative overflow-hidden transition-all border ${isDark
          ? 'bg-[#0d1526] border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-white border-[#e2e8f0] shadow-xs'
          }`}>
          {/* Main Trajectory Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4">
            <div>
              <h2 className="font-sans text-lg sm:text-xl font-bold tracking-tight">Multi-Analyte Trajectory Envelope</h2>
              <p className={`text-xs font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Continuous curve vs personalized historical standard deviation corridor (±1.5σ)
              </p>
            </div>

            {/* Timeframe & Analyte Selector Filters */}
            <div className="flex flex-wrap items-center gap-3">
              {/* 7D, 30D, 90D, 1Y toggles */}
              <div className={`p-1 rounded-lg flex items-center gap-1 border ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}>
                {[
                  { label: '7D', val: 7 },
                  { label: '30D', val: 30 },
                  { label: '90D', val: 90 },
                  { label: '1Y', val: 365 }
                ].map((t) => (
                  <button
                    key={t.label}
                    onClick={() => setTimeRange(t.val)}
                    className={`px-2.5 py-1 rounded text-xs font-sans font-semibold transition-all ${timeRange === t.val
                      ? isDark ? 'bg-[#00685f] text-white' : 'bg-white text-[#00685f] shadow-xs font-bold'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Biomarker Selector Pills */}
              <div className="hidden xl:flex items-center gap-1.5">
                {[
                  { id: 'specificGravity', label: 'Specific Gravity', color: '#00685f' },
                  { id: 'ketones', label: 'Ketones', color: '#00687a' },
                  { id: 'pH', label: 'Urine pH', color: '#6d7a77' },
                  { id: 'protein', label: 'Microalbumin/Protein', color: '#006947' }
                ].map((bio) => {
                  const isSelected = selectedBiomarker === bio.id;
                  return (
                    <button
                      key={bio.id}
                      onClick={() => setSelectedBiomarker(bio.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-sans font-semibold transition-all ${isSelected
                        ? 'bg-[#00685f]/15 text-[#00685f] dark:text-[#6bd8cb] ring-1 ring-[#00685f]'
                        : isDark ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: bio.color }}></span>
                      <span>{bio.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sub-View Switcher Tabs */}
          <div className={`mt-2 mb-6 flex flex-wrap items-center gap-1.5 p-1 rounded-xl border text-xs font-sans ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
            {[
              { id: 'trajectory', label: 'Trajectory Envelope', icon: Activity },
              { id: 'multistream', label: 'Multi-Stream (Strip + BLE)', icon: TrendingUp },
              { id: 'piechart', label: 'Corridor Pie Breakdown', icon: PieChartIcon },
              { id: 'bluetooth', label: 'Bluetooth BLE Hub', icon: Bluetooth },
              { id: 'scanner', label: 'Optical Strip Scanner', icon: Camera },
              { id: 'gemini', label: 'Grounded Gemini AI Lab', icon: Sparkles },
              { id: 'clinician', label: 'Doctor Handover Report', icon: FileText }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-semibold transition-all ${isActive
                    ? 'bg-[#00685f] text-white shadow-xs font-bold'
                    : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* VIEW TAB 1: TRAJECTORY ENVELOPE (MATCHING PERSONAL BASELINE SPEC) */}
          {activeTab === 'trajectory' && (
            <div className="flex flex-col gap-4">
              {/* Baseline Sufficiency & Data-Integrity Status Banner */}
              <div className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 transition-all ${isBaselineActive
                ? isDark ? 'bg-slate-900/40 border-emerald-500/30' : 'bg-emerald-50/70 border-emerald-300'
                : isDark ? 'bg-amber-950/20 border-amber-500/40' : 'bg-amber-50/80 border-amber-300'
                }`}>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${isBaselineActive ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-amber-500 animate-ping'
                    }`} />
                  <div>
                    <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {isBaselineActive
                        ? `Personal Baseline Active (${activeHistory.length} of 10 Recommended Sessions Logged)`
                        : `Baseline Formation Pending (${activeHistory.length} of 10 Sessions Recorded)`}
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
                    max={Math.max(15, history.length)}
                    value={simulatedReadingsLimit}
                    onChange={(e) => setSimulatedReadingsLimit(parseInt(e.target.value))}
                    className="w-28 accent-amber-500 cursor-pointer"
                    title="Drag to simulate having fewer or more logged sessions"
                  />
                  <span className="font-bold text-amber-500 w-8 text-right">{simulatedReadingsLimit} logs</span>
                </div>
              </div>

              {/* Chart Header Indicators matching exact screenshot */}
              <div className="flex flex-wrap items-center justify-between text-xs font-mono-code mt-1 mb-1 px-1">
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-amber-500">{currentBiomarkerMeta.name} ({currentBiomarkerMeta.unit})</span>
                  <span className="text-slate-400">Personal Median: ~{baselineCorridor.median}</span>
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

              {/* Main SVG Visualization */}
              <div className={`relative w-full rounded-xl p-4 overflow-x-auto border ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-[#fcfaff] border-slate-200'
                }`}>
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
                          stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                          strokeDasharray="4 4"
                        />
                        <text
                          x={padding.left - 10}
                          y={y + 3.5}
                          textAnchor="end"
                          className="text-[10px] font-sans fill-slate-400"
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
                        height={Math.max(8, baselineBottomY - baselineTopY)}
                        fill="url(#baselineCorridorGrad)"
                        stroke={isDark ? 'rgba(16, 185, 129, 0.4)' : 'rgba(5, 150, 105, 0.4)'}
                        strokeWidth="1"
                        strokeDasharray="3 3"
                        rx="3"
                      />
                      <text
                        x={chartWidth - padding.right - 8}
                        y={baselineTopY + 14}
                        textAnchor="end"
                        className={`text-[9px] font-mono-code font-semibold ${isDark ? 'fill-emerald-400' : 'fill-emerald-700'}`}
                      >
                        Personal Baseline Corridor ({baselineCorridor.q25} – {baselineCorridor.q75} {currentBiomarkerMeta.unit})
                      </text>
                    </g>
                  ) : (
                    <g>
                      <rect
                        x={padding.left}
                        y={baselineTopY}
                        width={chartWidth - padding.left - padding.right}
                        height={Math.max(8, baselineBottomY - baselineTopY)}
                        fill="none"
                        stroke={isDark ? 'rgba(245, 158, 11, 0.4)' : 'rgba(217, 119, 6, 0.4)'}
                        strokeWidth="1.5"
                        strokeDasharray="6 6"
                        rx="3"
                      />
                      <text
                        x={chartWidth - padding.right - 8}
                        y={baselineTopY + 14}
                        textAnchor="end"
                        className={`text-[9px] font-mono-code font-bold ${isDark ? 'fill-amber-400' : 'fill-amber-700'}`}
                      >
                        Tentative Baseline (Collecting Data: {activeHistory.length}/10)
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

                  {/* Data Points and Interactivity with Zero Flicker */}
                  {primaryPoints.map((pt) => {
                    const isHovered = hoveredPoint?.day === pt.data.day;
                    const val = pt.data[selectedBiomarker] ?? 0;
                    const isOverCritical = val >= currentBiomarkerMeta.criticalThreshold;
                    const isFlagged = pt.data.flagged || isOverCritical;

                    return (
                      <g
                        key={pt.data.day}
                        pointerEvents="none"
                      >
                        {/* Pulsing halo if flagged / over threshold */}
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

                        {/* Outer ring on hover - controlled via opacity for zero DOM mutation */}
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
                              : val > (baselineCorridor.q75 || currentBiomarkerMeta.baselineMax)
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

              {/* Fixed HUD Dock below chart */}
              <div className={`min-h-[72px] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 border transition-all ${hoveredPoint
                ? (hoveredPoint.flagged || (hoveredPoint[selectedBiomarker] >= currentBiomarkerMeta.criticalThreshold))
                  ? isDark ? 'bg-rose-950/30 border-rose-500/40' : 'bg-rose-50 border-rose-300'
                  : isDark ? 'bg-slate-900 border-[#00685f]/40' : 'bg-white border-[#00685f]/40 shadow-xs'
                : isDark ? 'bg-[#070b14] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                {hoveredPoint ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${(hoveredPoint.flagged || (hoveredPoint[selectedBiomarker] >= currentBiomarkerMeta.criticalThreshold))
                        ? 'bg-rose-500 animate-ping'
                        : 'bg-[#00685f]'
                        }`}></div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-sans text-xs font-bold">
                            Day {hoveredPoint.day} ({hoveredPoint.date} at {hoveredPoint.time})
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-sans font-semibold ${(hoveredPoint.flagged || (hoveredPoint[selectedBiomarker] >= currentBiomarkerMeta.criticalThreshold))
                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                            : 'bg-[#006947]/10 text-[#006947] dark:text-[#6ffbbe]'
                            }`}>
                            {(hoveredPoint.flagged || (hoveredPoint[selectedBiomarker] >= currentBiomarkerMeta.criticalThreshold))
                              ? 'Review Flagged (+3.8σ)'
                              : 'Within Personal Baseline'}
                          </span>
                        </div>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          <strong>Notes: </strong>{hoveredPoint.notes || 'Routine morning reading.'}
                          {hoveredPoint.specificGravity >= 1.025 && (
                            <span className="ml-2 text-amber-500 font-semibold">
                              (High Specific Gravity: Concentrated sample context)
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-sans">
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase">Protein</span>
                        <strong className={hoveredPoint.protein > 20 ? 'text-rose-500' : 'text-[#00685f]'}>
                          {hoveredPoint.protein} mg/dL
                        </strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase">Spec. Gravity</span>
                        <strong>{hoveredPoint.specificGravity}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase">pH</span>
                        <strong>{hoveredPoint.pH}</strong>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400 uppercase">Ketones</span>
                        <strong>{hoveredPoint.ketones} mg/dL</strong>
                      </div>
                      <button
                        onClick={() => handleDeleteReading(hoveredPoint.day)}
                        className="p-1 rounded text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete this reading"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-between w-full text-xs font-sans text-slate-400">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#00685f] animate-pulse" />
                      <span>Hover over any daily marker dot to inspect telemetry readings & clinical notes</span>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Click marker to inspect full record
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom Legend & Calibration Status */}
              <div className={`p-3 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs font-sans ${isDark ? 'bg-[#070b14] border border-slate-800' : 'bg-slate-100 border border-slate-200'
                }`}>
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#00685f]"></span> Specific Gravity</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#00687a]"></span> Ketone Shift</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#006947]"></span> Microalbumin Stable</span>
                  <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-400"></span> Leukocytes Zero</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Calibration: White Reference Standard Patch 99.8% Match · Non-Diagnostic Clinical Corridor
                </div>
              </div>
            </div>
          )}

          {/* VIEW TAB 2: MULTI-STREAM (ATTRACTIVELINECHART) */}
          {activeTab === 'multistream' && (
            <div className="mt-2">
              <AttractiveLineChart
                history={activeHistory}
                activePersona={activePersona}
                selectedBiomarker={selectedBiomarker}
                selectedBleMetric={selectedBleMetric}
              />
            </div>
          )}

          {/* VIEW TAB 3: CORRIDOR PIE BREAKDOWN (ATTRACTIVEPIECHART) */}
          {activeTab === 'piechart' && (
            <div className="mt-2">
              <AttractivePieChart activePersona={activePersona} />
            </div>
          )}

          {/* VIEW TAB 4: BLUETOOTH BLE HUB */}
          {activeTab === 'bluetooth' && (
            <div className="mt-2">
              <BluetoothHub
                onSelectMetricForChart={(metricKey) => {
                  setSelectedBleMetric(metricKey);
                  setActiveTab('multistream');
                }}
                onSyncDeviceData={() => {
                  const now = new Date();
                  const nextDay = history.length > 0 ? Math.max(...history.map((h) => h.day)) + 1 : 1;
                  const newEntry = {
                    day: nextDay,
                    date: now.toISOString().split('T')[0],
                    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    protein: baselineCorridor?.median || 6.2,
                    specificGravity: 1.018,
                    pH: 6.5,
                    glucose: 0,
                    ketones: 0,
                    blood: 0,
                    leukocytes: 0,
                    nitrite: 0,
                    urobilinogen: 0.2,
                    bilirubin: 0,
                    bleCgmGlucose: 98,
                    bleBpSystolic: 120,
                    bleBpDiastolic: 78,
                    bleHeartRate: 68,
                    bleSpo2: 98.5,
                    bleHydration: 58.2,
                    notes: 'Live BLE synchronized packet: continuous CGM, blood pressure, and resting heart rate data integrated.',
                    flagged: false,
                    confirmed: true,
                    sampleType: 'Bluetooth Synchronized Telemetry'
                  };
                  trajectoryStorage.addReading(selectedPersonaId, newEntry);
                  setHistory((prev) => [...prev, newEntry]);
                  setSimulatedReadingsLimit((prev) => prev + 1);
                }}
              />
            </div>
          )}

          {/* VIEW TAB 5: OPTICAL STRIP SCANNER (PHOTO UPLOAD & AUDIT) */}
          {activeTab === 'scanner' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-2">
              {/* Left 7 cols: Camera Viewfinder / Photo Upload */}
              <div className={`lg:col-span-7 rounded-xl p-5 border ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                <div className="flex items-center justify-between pb-3 border-b border-inherit text-xs font-sans">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-[#00685f]" />
                    <span className="font-semibold">Optical Colorimetric Calibration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-[#006947]/10 text-[#006947] font-semibold">
                      {ambientLux} Lux (Optimal)
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Tilt: {tiltAngleDeg}°
                    </span>
                  </div>
                </div>

                {/* Real Photo Upload Bar */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg border bg-slate-500/5 border-inherit text-xs">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-[#00685f]" />
                    <span className="font-semibold text-xs">Upload Real Strip Photo:</span>
                    {uploadFileName && (
                      <span className="px-2 py-0.5 rounded bg-[#00685f]/15 text-[#00685f] text-[11px] font-mono">
                        {uploadFileName}
                      </span>
                    )}
                  </div>
                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-[#00685f] hover:bg-[#008378] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs">
                    <Camera className="w-3.5 h-3.5" />
                    <span>Choose Photo / Snap</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleStripImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Viewport Simulation / Uploaded Photo Box */}
                <div className="mt-3 relative w-full h-[320px] rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <div className="absolute inset-4 border border-dashed border-[#00685f]/50 rounded pointer-events-none flex flex-col justify-between p-2 z-20">
                    <span className="text-[10px] text-[#00685f] font-mono">TARGET ALIGNED: CIE L*a*b* STANDARD</span>
                    <span className="text-[10px] text-[#00685f] font-mono">
                      {uploadedStripImage ? 'USER PHOTO LOADED • OPTICAL CONFIDENCE 99.1%' : 'EXPOSURE LOCKED • CONFIDENCE 99.4%'}
                    </span>
                  </div>

                  {uploadedStripImage ? (
                    <div className="relative w-full h-full flex items-center justify-center p-4">
                      <img
                        src={uploadedStripImage}
                        alt="Uploaded Urine Strip"
                        className="max-h-full max-w-full object-contain rounded"
                      />
                      {/* Sampling overlay reticle */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-48 h-12 border-2 border-[#00685f] rounded-lg bg-[#00685f]/10 flex items-center justify-around px-2">
                          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="w-3.5 h-3.5 rounded-full border border-white bg-emerald-500/80 animate-pulse" />
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* 10-Pad Strip Simulation */
                    <div className="relative z-10 w-16 h-[260px] bg-white rounded shadow-md flex flex-col items-center justify-between py-2 px-1">
                      <span className="text-[8px] font-mono text-slate-400 font-bold rotate-90 my-1">BT-10SG</span>
                      {BIOMARKER_DEFINITIONS.map((bio, idx) => {
                        const readingVal = editedReadings[bio.id] ?? 0;
                        const isSelectedPad = activePadIndex === idx;
                        const matchedSwatch = bio.colorScale.reduce((prev, curr) => {
                          return Math.abs(curr.value - readingVal) < Math.abs(prev.value - readingVal) ? curr : prev;
                        }, bio.colorScale[0]);

                        return (
                          <div
                            key={bio.id}
                            onClick={() => setActivePadIndex(idx)}
                            className={`w-10 h-3 rounded-xs border cursor-pointer transition-all ${isSelectedPad ? 'ring-2 ring-[#00685f] scale-110 shadow-sm' : 'border-black/20 hover:scale-105'
                              }`}
                            style={{ backgroundColor: matchedSwatch.color }}
                            title={`${bio.name}: ${readingVal} ${bio.unit}`}
                          />
                        );
                      })}
                      <div className="w-8 h-3 rounded bg-slate-300 text-[6px] text-center font-bold text-slate-600">PAD</div>
                    </div>
                  )}
                </div>

                {/* Environmental Controls */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-sans">
                  <div>
                    <label className="text-slate-400 block mb-1">Adjust Ambient Lux ({ambientLux})</label>
                    <input
                      type="range"
                      min="150"
                      max="800"
                      value={ambientLux}
                      onChange={(e) => setAmbientLux(parseInt(e.target.value))}
                      className="w-full accent-[#00685f]"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Camera Tilt ({tiltAngleDeg}°)</label>
                    <input
                      type="range"
                      min="-10"
                      max="10"
                      step="0.5"
                      value={tiltAngleDeg}
                      onChange={(e) => setTiltAngleDeg(parseFloat(e.target.value))}
                      className="w-full accent-[#00685f]"
                    />
                  </div>
                </div>
              </div>

              {/* Right 5 cols: Value Audit & Confirm */}
              <div className={`lg:col-span-5 rounded-xl p-5 border ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-[#00685f] mb-1">
                  Step 2: Mandatory Patient Audit
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Review values before writing to your cryptographically confirmed local baseline.
                </p>

                <div className="space-y-3 text-xs font-sans">
                  <div className="flex items-center justify-between p-2.5 rounded bg-white dark:bg-slate-900 border border-inherit">
                    <span className="font-semibold">Protein (Albumin)</span>
                    <input
                      type="number"
                      value={editedReadings.protein}
                      onChange={(e) => setEditedReadings({ ...editedReadings, protein: parseFloat(e.target.value) || 0 })}
                      className="w-20 px-2 py-1 text-right rounded border border-inherit bg-transparent"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded bg-white dark:bg-slate-900 border border-inherit">
                    <span className="font-semibold">Specific Gravity</span>
                    <input
                      type="number"
                      step="0.001"
                      value={editedReadings.specificGravity}
                      onChange={(e) => setEditedReadings({ ...editedReadings, specificGravity: parseFloat(e.target.value) || 1.018 })}
                      className="w-24 px-2 py-1 text-right rounded border border-inherit bg-transparent"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded bg-white dark:bg-slate-900 border border-inherit">
                    <span className="font-semibold">Urine pH</span>
                    <input
                      type="number"
                      step="0.1"
                      value={editedReadings.pH}
                      onChange={(e) => setEditedReadings({ ...editedReadings, pH: parseFloat(e.target.value) || 6.5 })}
                      className="w-20 px-2 py-1 text-right rounded border border-inherit bg-transparent"
                    />
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded bg-white dark:bg-slate-900 border border-inherit">
                    <span className="font-semibold">Ketones (AcAc)</span>
                    <input
                      type="number"
                      value={editedReadings.ketones || 0}
                      onChange={(e) => setEditedReadings({ ...editedReadings, ketones: parseFloat(e.target.value) || 0 })}
                      className="w-20 px-2 py-1 text-right rounded border border-inherit bg-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Lifestyle Context Note</label>
                    <textarea
                      rows={2}
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      className="w-full text-xs p-2 rounded border border-inherit bg-transparent"
                    />
                  </div>

                  <button
                    onClick={handleSaveReading}
                    className="w-full py-3 rounded-lg bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm & Save to Trajectory</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW TAB 6: GROUNDED GEMINI AI LAB */}
          {activeTab === 'gemini' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mt-2">
              <div className={`lg:col-span-5 rounded-xl p-5 border ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-[#00685f] mb-3">
                  Clinical Inquiry Presets
                </h3>
                <div className="space-y-2">
                  {GEMINI_PROMPT_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedGeminiPrompt(p)}
                      className={`w-full text-left p-3 rounded-lg border text-xs font-sans transition-all ${selectedGeminiPrompt.id === p.id
                        ? 'bg-[#00685f]/15 border-[#00685f] text-on-surface font-semibold'
                        : isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600'
                        }`}
                    >
                      <span className="block font-bold mb-0.5">{p.title}</span>
                      <p className="text-[11px] text-slate-400 line-clamp-2">{p.prompt}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className={`lg:col-span-7 rounded-xl p-5 border ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                <div className="flex items-center gap-2 pb-3 border-b border-inherit">
                  <Sparkles className="w-4 h-4 text-[#00685f]" />
                  <span className="font-sans text-xs font-bold uppercase tracking-wider text-[#00685f]">
                    Gemini 1.5 Pro Deterministic Output
                  </span>
                </div>

                <div className="mt-4 space-y-3 font-sans text-xs">
                  <div className="p-3 rounded bg-white dark:bg-slate-900 border border-inherit">
                    <span className="font-bold text-[#00685f] block mb-1">1. Confirmed Telemetry Facts:</span>
                    <p className="leading-relaxed text-slate-300">{selectedGeminiPrompt.response.facts}</p>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-slate-900 border border-inherit">
                    <span className="font-bold text-[#00687a] block mb-1">2. Physiological Explanations:</span>
                    <p className="leading-relaxed text-slate-300">{selectedGeminiPrompt.response.context}</p>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-slate-900 border border-inherit">
                    <span className="font-bold text-amber-500 block mb-1">3. Measurement Boundaries:</span>
                    <p className="leading-relaxed text-slate-300">{selectedGeminiPrompt.response.limitations}</p>
                  </div>
                  <div className="p-3 rounded bg-white dark:bg-slate-900 border border-inherit">
                    <span className="font-bold text-[#006947] block mb-1">4. Action & Clinician Guidance:</span>
                    <p className="leading-relaxed text-slate-300">{selectedGeminiPrompt.response.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW TAB 7: DOCTOR HANDOVER REPORT */}
          {activeTab === 'clinician' && (
            <div className={`rounded-xl p-6 border mt-2 ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-inherit">
                <div>
                  <h3 className="font-sans text-lg font-bold">Doctor-Ready Longitudinal Chronology</h3>
                  <p className="text-xs text-slate-400">
                    Prepares an objective, non-diagnostic timeline of confirmed measurements to save clinic consultation minutes.
                  </p>
                </div>
                <button
                  onClick={onOpenReportModal}
                  className="px-4 py-2 rounded-lg bg-[#00685f] text-white font-sans text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Launch Official Printable Report</span>
                </button>
              </div>

              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-sans">
                <div className="p-3 rounded bg-white dark:bg-slate-900 border border-inherit">
                  <span className="text-slate-400 text-[10px] uppercase block">Patient</span>
                  <strong>{activePersona.name} ({activePersona.age}y)</strong>
                </div>
                <div className="p-3 rounded bg-white dark:bg-slate-900 border border-inherit">
                  <span className="text-slate-400 text-[10px] uppercase block">Logged Sessions</span>
                  <strong>{activeHistory.length} Sessions Active</strong>
                </div>
                <div className="p-3 rounded bg-white dark:bg-slate-900 border border-inherit">
                  <span className="text-slate-400 text-[10px] uppercase block">Peak Variance</span>
                  <strong className="text-rose-500">Day 22 (32 mg/dL PRO)</strong>
                </div>
                <div className="p-3 rounded bg-white dark:bg-slate-900 border border-inherit">
                  <span className="text-slate-400 text-[10px] uppercase block">Audit Status</span>
                  <strong className="text-[#006947]">100% Patient Verified</strong>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            5. RECENT STRIP SCANS & OPTICAL TELEMETRY TABLE (STITCH SPEC)
        ========================================================================== */}
        <section className={`rounded-xl p-6 sm:p-7 relative overflow-hidden transition-all border ${isDark
          ? 'bg-[#0d1526] border-slate-800 shadow-[0_4px_24px_rgba(0,0,0,0.4)]'
          : 'bg-white border-[#e2e8f0] shadow-xs'
          }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
            <div>
              <h2 className="font-sans text-lg sm:text-xl font-bold tracking-tight">Recent Strip Scans & Optical Telemetry</h2>
              <p className={`text-xs font-sans ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Validated 10-pad spectrophotometric analysis with contextual biometrics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('clinician')}
                className="flex items-center gap-1 text-[#00685f] dark:text-[#6bd8cb] hover:underline text-xs font-semibold"
              >
                <span>View All 38 Scans</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto w-full mt-3">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className={`border-b text-slate-400 uppercase tracking-wider text-[11px] ${isDark ? 'border-slate-800 bg-[#070b14]' : 'border-slate-200 bg-slate-50'
                  }`}>
                  <th className="py-3 px-4 rounded-l-lg">Timestamp & Context</th>
                  <th className="py-3 px-4">Spectro Patch</th>
                  <th className="py-3 px-4">Biomarkers Overview</th>
                  <th className="py-3 px-4">Wearable Correlation</th>
                  <th className="py-3 px-4">Optical Match</th>
                  <th className="py-3 px-4 rounded-r-lg text-right">Verification</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
                {recentScansList.map((scan) => (
                  <tr key={scan.id} className="hover:bg-[#00685f]/5 transition-colors">
                    {/* Timestamp & Context */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-on-surface text-xs">{scan.timestamp}</span>
                        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                          <Sun className="w-3 h-3 text-[#f59e0b]" />
                          <span>{scan.context}</span>
                        </div>
                      </div>
                    </td>

                    {/* Spectro Patch Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={scan.img}
                          alt="Spectro diagnostic test strip patch"
                          className="w-12 h-6 object-cover rounded shadow-xs border border-slate-200 dark:border-slate-700"
                        />
                        <span className="text-[10px] font-mono text-slate-400">{scan.id}</span>
                      </div>
                    </td>

                    {/* Biomarkers Overview Chips */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {scan.biomarkers.map((b, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${b.type === 'variance'
                              ? 'bg-[#f59e0b]/15 text-[#f59e0b]'
                              : 'bg-[#006947]/10 text-[#006947] dark:text-[#6ffbbe]'
                              }`}
                          >
                            {b.label}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Wearable Correlation */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col text-slate-400 text-[11px]">
                        <span className="font-medium text-on-surface">{scan.wearable.split('•')[0]}</span>
                        <span className="text-slate-500">{scan.wearable.split('•').slice(1).join('•')}</span>
                      </div>
                    </td>

                    {/* Optical Match */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-[#006947]"></span>
                        <span className="font-semibold text-[#006947] dark:text-[#6ffbbe] text-xs">
                          {scan.validity}
                        </span>
                      </div>
                    </td>

                    {/* Verification Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setInspectedScanModal(scan)}
                        className="text-[#00685f] dark:text-[#6bd8cb] hover:underline font-semibold text-xs"
                      >
                        View Spectrum
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* =========================================================================
            6. PERSISTENT ACTION & SAFETY GUIDANCE DOCK (STITCH SPEC)
        ========================================================================== */}
        <section className={`rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 border ${isDark
          ? 'bg-[#0d1526] border-slate-800'
          : 'bg-white border-[#e2e8f0] shadow-xs'
          }`}>
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-full bg-[#00685f]/10 text-[#00685f] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#00685f]" />
            </div>
            <div className="flex flex-col font-sans">
              <span className="text-xs sm:text-sm font-bold text-on-surface">
                Continuous Longitudinal Integrity Active
              </span>
              <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Optical color chart #BT-CAL-2024 verified with ambient temperature compensation (21.4°C).
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 font-sans">
            <button
              onClick={() => {
                alert("Reminder scheduled for tomorrow at 8:00 AM for your second morning void test strip.");
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors border ${isDark
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-800'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              type="button"
            >
              <Clock className="w-3.5 h-3.5 text-[#00687a]" />
              <span>Schedule Tomorrow's Test</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00685f] hover:bg-[#008378] text-white font-bold text-xs transition-all shadow-xs"
              type="button"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share with Physician</span>
            </button>
          </div>
        </section>

      </div>

      {/* Manual Entry Modal */}
      <ManualEntryModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        onSave={handleManualAdd}
      />

      {/* User Onboarding and Non-Diagnostic Consent Modal */}
      <ConsentModal
        isOpen={isConsentOpen}
        onClose={() => setIsConsentOpen(false)}
      />

      {/* Spectrum Inspection Modal */}
      {inspectedScanModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl ${isDark ? 'bg-[#0d1526] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00685f]"></span>
                <h3 className="font-sans text-base font-bold">Spectrophotometric Log {inspectedScanModal.id}</h3>
              </div>
              <button
                onClick={() => setInspectedScanModal(null)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-4 font-sans text-xs">
              <div className="flex items-center gap-4">
                <img
                  src={inspectedScanModal.img}
                  alt="Raw strip macro"
                  className="w-28 h-14 object-cover rounded border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <span className="font-bold text-sm block">{inspectedScanModal.timestamp}</span>
                  <p className="text-slate-400">{inspectedScanModal.context}</p>
                  <p className="text-[#006947] font-semibold mt-1">Optical Match: {inspectedScanModal.validity}</p>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-50 dark:bg-slate-900 border border-inherit">
                <span className="font-bold block mb-1 text-slate-400 uppercase text-[10px]">Wearable Sync:</span>
                <p>{inspectedScanModal.wearable}</p>
              </div>

              <div className="p-3 rounded bg-slate-50 dark:bg-slate-900 border border-inherit">
                <span className="font-bold block mb-1 text-slate-400 uppercase text-[10px]">Analyte Deltas:</span>
                <div className="flex flex-wrap gap-2">
                  {inspectedScanModal.biomarkers.map((b, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#00685f]/10 text-[#00685f] font-semibold">
                      {b.label}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setInspectedScanModal(null)}
                className="w-full py-2.5 rounded-lg bg-[#00685f] hover:bg-[#008378] text-white font-bold transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
