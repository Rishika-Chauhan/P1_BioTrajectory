import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Droplet,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronRight,
  Sliders,
  Sparkles,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Activity,
  FileText,
  Eye,
  X
} from 'lucide-react';
import { BIOMARKER_DEFINITIONS } from '../../data/mockData';
import { BluetoothService } from '../../services/bluetoothService';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';
import DeviceThumbnail from '../../components/common/DeviceThumbnail';

// Urine color categories with clinical descriptions and hydration scoring
const URINE_COLOUR_PROFILES = [
  {
    id: 'pale_yellow',
    label: 'Pale Yellow',
    category: 'Optimal Hydration',
    hex: '#FDE047',
    fluidGradient: 'from-amber-300 via-yellow-300 to-amber-200',
    status: 'Normal',
    statusColor: 'emerald',
    description: 'Gold standard physiological hydration. Normal urochrome pigment concentration with healthy renal perfusion.',
    specificGravityEst: '1.012 – 1.018',
    recommendation: 'Maintain your current fluid intake (~2.0 - 2.5 L/day).'
  },
  {
    id: 'straw',
    label: 'Transparent Straw',
    category: 'High Hydration',
    hex: '#FEF08A',
    fluidGradient: 'from-yellow-200 via-amber-100 to-yellow-50',
    status: 'Optimal',
    statusColor: 'cyan',
    description: 'Very well hydrated. Solutes are highly diluted. Frequent if consuming high quantities of water or post-infusion.',
    specificGravityEst: '1.005 – 1.010',
    recommendation: 'Hydration is excellent. Ensure electrolyte balance during prolonged endurance activities.'
  },
  {
    id: 'amber',
    label: 'Amber / Dark Yellow',
    category: 'Mild Dehydration',
    hex: '#D97706',
    fluidGradient: 'from-amber-600 via-amber-500 to-yellow-600',
    status: 'Notice',
    statusColor: 'amber',
    description: 'Concentrated urine. The kidneys are actively conserving water in response to perspiration, fasting, or low fluid intake.',
    specificGravityEst: '1.022 – 1.028',
    recommendation: 'Drink a glass of water now. Monitor next void after 90 minutes.'
  },
  {
    id: 'deep_amber',
    label: 'Deep Amber / Orange',
    category: 'Significant Dehydration / Dietary',
    hex: '#B45309',
    fluidGradient: 'from-amber-700 via-orange-600 to-amber-800',
    status: 'Attention',
    statusColor: 'amber',
    description: 'Pronounced solute concentration. May also result from high-dose B-complex vitamins, carrots/beta-carotene, or sulfasalazine.',
    specificGravityEst: '1.028 – 1.034',
    recommendation: 'Hydrate immediately. If color persists despite fluid intake, evaluate bilirubin or consult your doctor.'
  },
  {
    id: 'pink_red',
    label: 'Pinkish / Light Red',
    category: 'Trace Hematuria or Food Dyes',
    hex: '#F43F5E',
    fluidGradient: 'from-rose-500 via-red-400 to-rose-300',
    status: 'Evaluate',
    statusColor: 'rose',
    description: 'Can be benign food coloring (beetroot, blackberries, rhubarb) or indicate microscopic RBC excretion / urinary tract irritation.',
    specificGravityEst: 'Variable',
    recommendation: 'Confirm with dipstick occult blood pad. Consult your physician if food confounders are ruled out.'
  },
  {
    id: 'clear',
    label: 'Completely Clear',
    category: 'Overhydration',
    hex: '#F8FAFC',
    fluidGradient: 'from-sky-100 via-slate-50 to-white',
    status: 'Dilute',
    statusColor: 'blue',
    description: 'Near-zero pigment concentration. Usually indicates excessive fluid consumption or diuretic intake.',
    specificGravityEst: '< 1.005',
    recommendation: 'Ease fluid intake slightly to prevent hyponatremia (electrolyte dilution).'
  }
];

// Physiological confounders simulator
const CONFOUNDERS = [
  {
    id: 'baseline',
    name: 'Normal Homeostasis',
    factor: 'Standard hydration, balanced nutrition, normal rest',
    impact: 'Reflects stable personal baseline corridor without acute physiological disturbances.'
  },
  {
    id: 'dehydration',
    name: 'Acute Fluid Restriction (Dehydration)',
    factor: 'Sweat loss, low fluid intake, warm climate',
    impact: 'Kidneys reabsorb water to preserve circulating volume; elevates Specific Gravity (>1.026) and concentrated Trace Protein without renal damage.'
  },
  {
    id: 'exercise',
    name: 'Post-Workout Exertion (March Effect)',
    factor: 'High-intensity resistance training or long-distance running',
    impact: 'Strenuous exertion transiently alters glomerular permeability and tubular reabsorption, causing benign transient proteinuria (+30 mg/dL).'
  },
  {
    id: 'diet',
    name: 'Dietary Shift (Ketogenic vs Alkaline)',
    factor: 'High-fat low-carb or citrus-rich nutrition',
    impact: 'Urine pH rapidly buffers metabolic acids. Fasting elevates ketones (15–40 mg/dL); high citrus elevates urinary citrate and pH (>7.5).'
  },
  {
    id: 'vitaminc',
    name: 'Vitamin C Mega-Dose (>500 mg)',
    factor: 'High-dose ascorbic acid or multivitamin supplements',
    impact: 'Ascorbic acid is a strong reducing agent that chemically inhibits peroxidase reactions on glucose and occult blood pads, producing potential false negatives.'
  }
];

export default function UrineAnalysisPage() {
  const [searchParams] = useSearchParams();
  const [selectedBio, setSelectedBio] = useState(BIOMARKER_DEFINITIONS[0]);
  const [selectedColour, setSelectedColour] = useState(URINE_COLOUR_PROFILES[0]);
  const [activeConfounder, setActiveConfounder] = useState('baseline');
  const [isScanModalOpen, setIsScanModalOpen] = useState(searchParams.get('scan') === 'true');
  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  // Live Bluetooth device readings
  const [vitals, setVitals] = useState(() => BluetoothService.getLatestVitals());

  useEffect(() => {
    const handleVitals = (e) => {
      if (e.detail) setVitals(prev => ({ ...prev, ...e.detail }));
    };
    window.addEventListener('biotrajectory_vitals_updated', handleVitals);
    return () => window.removeEventListener('biotrajectory_vitals_updated', handleVitals);
  }, []);

  const handleSimulateScan = () => {
    setAnalyzingImage(true);
    setTimeout(() => {
      setAnalyzingImage(false);
      setScanResult({
        timestamp: 'Just now',
        confidence: '99.2%',
        padsDetected: 10,
        ph: 6.6,
        protein: 'Negative (0 mg/dL)',
        specificGravity: 1.018,
        glucose: 'Negative',
        ketones: 'Negative',
        leukocytes: 'Negative',
        nitrites: 'Negative',
        blood: 'Negative'
      });
    }, 1800);
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 font-sans">

      {/* 1. Page Header & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Urine Analysis
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping inline-block" />
              Multistix 10SG Optical Lab
            </span>
          </div>
          <p className="text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-400">
            Comprehensive 10-parameter optical urinalysis, colour spectroscopy, and biological confounder mechanics
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap shrink-0">
          <button
            onClick={() => setIsScanModalOpen(true)}
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-sm shadow-cyan-500/20 active:scale-95 cursor-pointer shrink-0"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Test Strip</span>
          </button>

          <Link
            to="/dashboard/devices"
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-xs font-bold bg-white dark:bg-[#101827] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            <Droplet className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Pair 10SG Analyzer</span>
          </Link>
        </div>
      </div>

      {/* 2. Top Grid: Urine Colour Analysis & Real-Time Spectrophotometry Hardware Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Left Card: 3D Urine Colour & Spectrophotometry (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0A1226] border border-slate-200/90 dark:border-slate-800/90 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Droplet className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Urine Colour & Optical Spectroscopy
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select a sample color to inspect hydration index and biological context
                </p>
              </div>
            </div>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${selectedColour.statusColor === 'emerald'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                : selectedColour.statusColor === 'cyan'
                  ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25'
                  : selectedColour.statusColor === 'rose'
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/25'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25'
              }`}>
              {selectedColour.status}
            </span>
          </div>

          {/* Interactive Vessel & Detail Display */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">

            {/* 3D Glass Liquid Sample Dish */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 rounded-full border-4 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-xl p-2.5 flex items-center justify-center transition-all duration-300">
                {/* Simulated Fluid Core */}
                <div className={`w-full h-full rounded-full bg-gradient-to-tr ${selectedColour.fluidGradient} shadow-[inset_0_4px_16px_rgba(0,0,0,0.25)] relative overflow-hidden flex items-center justify-center transition-all duration-500`}>
                  {/* Glass Reflection Arc */}
                  <div className="absolute top-2 left-3 w-10 h-4 rounded-full bg-white/45 blur-[0.8px] -rotate-30" />
                  <div className="absolute bottom-2 right-4 w-7 h-2 rounded-full bg-white/20 blur-[1px]" />
                </div>
              </div>
              <span className="text-sm font-bold text-slate-900 dark:text-white mt-3">
                {selectedColour.label}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {selectedColour.category}
              </span>
            </div>

            {/* Description & Metrics */}
            <div className="sm:col-span-7 space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Clinical Assessment
                </p>
                <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedColour.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Est. Specific Gravity</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {selectedColour.specificGravityEst}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Next Step</span>
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400 text-xs">
                    {selectedColour.status === 'Normal' || selectedColour.status === 'Optimal' ? 'On Track' : 'Drink Water'}
                  </span>
                </div>
              </div>

              <p className="text-[12px] text-slate-500 dark:text-slate-400 italic">
                Tip: {selectedColour.recommendation}
              </p>
            </div>
          </div>

          {/* Color Palette Selector Bar */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
              Explore Reference Urinalysis Colors:
            </span>
            <div className="grid grid-cols-6 gap-2">
              {URINE_COLOUR_PROFILES.map((color) => {
                const isSelected = selectedColour.id === color.id;
                return (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColour(color)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${isSelected
                        ? 'border-cyan-500 bg-cyan-500/10 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50'
                      }`}
                  >
                    <span
                      className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 shadow-xs"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 truncate w-full text-center">
                      {color.label.split(' ')[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Card: Live Paired Hardware & Last Test Reading (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0A1226] border border-slate-200/90 dark:border-slate-800/90 shadow-sm flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Spectrophotometer Stream
              </h3>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/25 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              10SG Connected
            </span>
          </div>

          {/* Device Miniature Card */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <DeviceThumbnail deviceId="biotrajectory-optical-10sg" type="urine" size="md" />
            <div className="space-y-0.5">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                BioTrajectory Smart Optical 10SG
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                10-Channel Reflectance Vector • Battery: 96%
              </p>
              <p className="text-xs text-cyan-600 dark:text-cyan-400 font-semibold pt-1">
                Last Optical Sync: Today, 08:30 AM
              </p>
            </div>
          </div>

          {/* Quick Biomarker Highlights */}
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
              Latest Recorded Primary Vitals:
            </span>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Urine pH
                </span>
                <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">
                  {vitals.urinePH || 6.5}
                </p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Balanced Corridor
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Specific Gravity
                </span>
                <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 font-mono mt-0.5">
                  {vitals.urineSG || 1.018}
                </p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Euhydrated (1.018)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Protein (Albumin)
                </span>
                <p className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-0.5">
                  {vitals.urineProteinMg ? `${vitals.urineProteinMg} mg` : '0 mg/dL'}
                </p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Barrier Intact
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Glucose & Nitrites
                </span>
                <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                  Clean / Neg
                </p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Zero spillage
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/dashboard/reports"
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>View Full Historical Urinalysis Logs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 3. The 10-Parameter Reagent Suite: Master-Detail Interactive Lab */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#0A1226] border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-600 dark:text-cyan-400 block mb-1">
              Multistix 10SG Standard Diagnostic Suite
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              The 10-Parameter Reagent Lab & Color Scales
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Select any reagent pad below to inspect dry chemistry kinetics, reference thresholds, and biological mechanisms
            </p>
          </div>
          <div className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300 shrink-0">
            Active: <strong className="text-cyan-600 dark:text-cyan-400">{selectedBio.name}</strong>
          </div>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: 10 Biomarker Pad Selectors (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block px-1 mb-2">
              Select Reagent Pad (10 Parameters):
            </span>
            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {BIOMARKER_DEFINITIONS.map((bio) => {
                const isSelected = selectedBio.id === bio.id;
                return (
                  <div
                    key={bio.id}
                    onClick={() => setSelectedBio(bio)}
                    className={`p-3 rounded-2xl cursor-pointer border transition-all duration-200 flex items-center justify-between ${isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-700 dark:text-cyan-300 font-bold shadow-xs'
                        : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full shrink-0 ${isSelected ? 'bg-cyan-500 ring-4 ring-cyan-500/20' : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                      />
                      <div>
                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                          {bio.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {bio.normalRange} • {bio.unit}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-cyan-600 dark:text-cyan-400 translate-x-1' : 'text-slate-400'}`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Reagent Chemical Kinetics, Color Palette & Mechanism (7 cols) */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase">
                  Reagent ID: {selectedBio.shortName}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {selectedBio.name}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Baseline Corridor</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {selectedBio.baselineMean} {selectedBio.unit}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedBio.description}
            </p>

            {/* Colorimetric Test Pad Threshold Scale */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Diagnostic Colorimetric Pad Scale:
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {selectedBio.colorScale.map((pad, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 flex flex-col items-center gap-1.5 shadow-xs"
                  >
                    <div
                      className="w-full h-8 rounded-lg shadow-inner border border-black/10"
                      style={{ backgroundColor: pad.color }}
                    />
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300 text-center leading-tight">
                      {pad.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Biological Context & Confounders */}
            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                  <Info className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Physiological Context</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedBio.biologicalContext}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Known Measurement Confounders</span>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
                  {selectedBio.measurementConfounders}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Physiological Confounder Simulator */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#0A1226] border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Physiological Confounder Engine
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Simulate how real-world lifestyle stressors transiently affect urine test strips without indicating disease
              </p>
            </div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
            BioTrajectory Baseline Shield
          </span>
        </div>

        {/* Confounder Selector Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {CONFOUNDERS.map((conf) => {
            const isActive = activeConfounder === conf.id;
            return (
              <button
                key={conf.id}
                onClick={() => setActiveConfounder(conf.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${isActive
                    ? 'border-purple-500 bg-purple-500/10 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${isActive ? 'bg-purple-500' : 'bg-slate-300 dark:bg-slate-700'}`} />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {conf.id === 'baseline' ? 'Normal' : 'Stressor'}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {conf.name}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Active Confounder Explanation Card */}
        {(() => {
          const current = CONFOUNDERS.find(c => c.id === activeConfounder);
          return (
            <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Simulated Mechanism: {current?.name}</span>
              </div>
              <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                {current?.impact}
              </p>
              <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400">
                <strong>Why BioTrajectory is Different:</strong> Single point-in-time apps trigger panic alerts on transient shifts. BioTrajectory contextualizes your multi-day corridor before recommending physician consultations.
              </div>
            </div>
          );
        })()}
      </div>

      {/* 5. Non-Diagnostic Medical Safety Disclaimer */}
      <DisclaimerBanner />

      {/* 6. Scan Test Strip Modal */}
      <AnimatePresence>
        {isScanModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#0A1226] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Scan Urine Test Strip
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Align your 10SG strip under neutral white lighting
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsScanModalOpen(false);
                    setScanResult(null);
                  }}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!scanResult ? (
                <div className="space-y-4">
                  {/* Upload Box / Camera Mock */}
                  <div
                    onClick={handleSimulateScan}
                    className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-500 bg-cyan-500/5 dark:bg-cyan-950/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                  >
                    {analyzingImage ? (
                      <div className="space-y-3 flex flex-col items-center">
                        <RefreshCw className="w-10 h-10 text-cyan-500 animate-spin" />
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Optical Spectrometry in Progress...
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Aligning 10 reagent pads & calibrating white balance
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                          <Upload className="w-7 h-7" />
                        </div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Click to Upload or Capture Test Strip
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Supports Multistix 10SG, Siemens, Vivoo, and standard 10-parameter strips
                        </p>
                      </>
                    )}
                  </div>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                    <p>• Lay strip flat on a clean white paper towel for accurate camera white-balance.</p>
                    <p>• Avoid direct sunlight or heavy shadows across the reagent pads.</p>
                  </div>
                </div>
              ) : (
                /* Scan Analysis Result */
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                        10 Pads Successfully Analyzed
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        Optical match confidence: {scanResult.confidence}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Urine pH</span>
                      <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">{scanResult.ph} (Balanced)</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Specific Gravity</span>
                      <span className="font-mono font-bold text-teal-600 dark:text-teal-400">{scanResult.specificGravity}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Protein (Albumin)</span>
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{scanResult.protein}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                      <span className="text-slate-400 block text-[10px]">Glucose & Nitrites</span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Negative / Clean</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsScanModalOpen(false);
                      setScanResult(null);
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all cursor-pointer"
                  >
                    Save Scan to My Records
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

