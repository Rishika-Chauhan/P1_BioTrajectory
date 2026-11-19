
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Droplet,
  Camera,
  Upload,
  AlertTriangle,
  Info,
  ChevronRight,
  Sliders,
  Sparkles,
  RefreshCw,
  Activity,
  FileText,
  X
} from 'lucide-react';

import { BIOMARKER_DEFINITIONS } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { healthReadingService } from '../../services/healthReadingService';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

// Educational urine colour reference profiles.
// These are reference illustrations, NOT patient measurements.
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
    description: 'Pronounced solute concentration. May also result from high-dose B-complex vitamins, carrots/beta-carotene, or medication.',
    specificGravityEst: '1.028 – 1.034',
    recommendation: 'If colour persists despite fluid intake, consult your physician.'
  },
  {
    id: 'pink_red',
    label: 'Pinkish / Light Red',
    category: 'Trace Hematuria or Food Dyes',
    hex: '#F43F5E',
    fluidGradient: 'from-rose-500 via-red-400 to-rose-300',
    status: 'Evaluate',
    statusColor: 'rose',
    description: 'Can be benign food colouring or indicate blood in urine or urinary tract irritation.',
    specificGravityEst: 'Variable',
    recommendation: 'Confirm with appropriate testing and consult your physician.'
  },
  {
    id: 'clear',
    label: 'Completely Clear',
    category: 'Overhydration',
    hex: '#F8FAFC',
    fluidGradient: 'from-sky-100 via-slate-50 to-white',
    status: 'Dilute',
    statusColor: 'blue',
    description: 'Near-zero pigment concentration. May occur with excessive fluid consumption.',
    specificGravityEst: '< 1.005',
    recommendation: 'Consider fluid intake and consult a clinician if concerned.'
  }
];

// Educational physiological confounder examples.
// These do not modify or generate patient readings.
const CONFOUNDERS = [
  {
    id: 'baseline',
    name: 'Normal Homeostasis',
    factor: 'Standard hydration, balanced nutrition, normal rest',
    impact: 'Reflects a stable personal baseline without acute physiological disturbances.'
  },
  {
    id: 'dehydration',
    name: 'Acute Fluid Restriction (Dehydration)',
    factor: 'Sweat loss, low fluid intake, warm climate',
    impact: 'Reduced fluid intake can concentrate urine and affect specific gravity.'
  },
  {
    id: 'exercise',
    name: 'Post-Workout Exertion',
    factor: 'High-intensity resistance training or long-distance running',
    impact: 'Strenuous exercise can temporarily affect urine protein measurements.'
  },
  {
    id: 'diet',
    name: 'Dietary Shift',
    factor: 'Dietary changes and fasting',
    impact: 'Dietary factors can influence urine pH and other urinalysis measurements.'
  },
  {
    id: 'vitaminc',
    name: 'Vitamin C Supplementation',
    factor: 'High-dose ascorbic acid or multivitamin supplements',
    impact: 'Ascorbic acid can interfere with certain urine dipstick reactions and affect test interpretation.'
  }
];

const toDate = (value) => {
  if (!value) return null;

  if (typeof value.toDate === 'function') {
    return value.toDate();
  }

  if (typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000);
  }

  const date = value instanceof Date
    ? value
    : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const getLatestUrineReading = (readings) => {
  if (!Array.isArray(readings) || readings.length === 0) {
    return null;
  }

  return [...readings]
    .filter((reading) => reading.type === 'urine_test')
    .sort((left, right) => {
      const leftTime = toDate(left.measuredAt)?.getTime() || 0;
      const rightTime = toDate(right.measuredAt)?.getTime() || 0;

      return rightTime - leftTime;
    })[0] || null;
};

const hasActualValue = (value) => (
  value !== undefined &&
  value !== null &&
  value !== ''
);

const displayValue = (value) => (
  hasActualValue(value) ? String(value) : 'Not recorded'
);

export default function UrineAnalysisPage() {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;

  const [searchParams] = useSearchParams();

  const [selectedBio, setSelectedBio] = useState(
    BIOMARKER_DEFINITIONS[0]
  );

  const [selectedColour, setSelectedColour] = useState(
    URINE_COLOUR_PROFILES[0]
  );

  const [activeConfounder, setActiveConfounder] = useState('baseline');

  const [isScanModalOpen, setIsScanModalOpen] = useState(
    searchParams.get('scan') === 'true'
  );

  const [analyzingImage, setAnalyzingImage] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const [readings, setReadings] = useState([]);
  const [isLoadingReadings, setIsLoadingReadings] = useState(Boolean(uid));
  const [readingError, setReadingError] = useState('');

  // Load genuine measurements belonging to the authenticated patient.
  useEffect(() => {
    let active = true;

    const loadReadings = async () => {
      if (!uid) {
        setReadings([]);
        setIsLoadingReadings(false);
        setReadingError('');
        return;
      }

      setIsLoadingReadings(true);
      setReadingError('');

      try {
        const result = await healthReadingService.list(uid, 100);

        if (active) {
          setReadings(Array.isArray(result) ? result : []);
        }
      } catch (error) {
        console.error('Urine reading load failed:', error);

        if (active) {
          setReadingError(
            error.message || 'Unable to load your urine measurements.'
          );
          setReadings([]);
        }
      } finally {
        if (active) {
          setIsLoadingReadings(false);
        }
      }
    };

    loadReadings();

    return () => {
      active = false;
    };
  }, [uid]);

  // Get the newest genuine urine test.
  const latestUrineReading = useMemo(
    () => getLatestUrineReading(readings),
    [readings]
  );

  const latestUrineValues = latestUrineReading?.values ?? {};

  const hasUrineRecord = Object.values(latestUrineValues)
    .some(hasActualValue);

  // The scan workflow is informational only.
  // It does not generate or save medical measurements.
  const handleSimulateScan = () => {
    setAnalyzingImage(true);

    setTimeout(() => {
      setAnalyzingImage(false);

      setScanResult({
        title: 'Image analysis not connected',
        message: 'Scan upload is not connected to a verified measurement endpoint. Use verified urine test entries from your records to populate this page.'
      });
    }, 500);
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

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
              Urinalysis Reference Lab
            </span>

          </div>

          <p className="text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-400">
            Urinalysis reference information and your recorded measurements.
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
            className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-xs font-bold bg-white dark:bg-[#2B1E15] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-all shadow-xs cursor-pointer active:scale-95 shrink-0"
          >
            <Droplet className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>View Devices</span>
          </Link>

        </div>
      </div>

      {/* 2. Top Grid: Colour Reference and Firestore Measurements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

        {/* Left Card: Educational Urine Colour Reference */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0A1226] border border-slate-200/90 dark:border-slate-800/90 shadow-sm flex flex-col justify-between space-y-6">

          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">

            <div className="flex items-center gap-2.5">

              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
                <Droplet className="w-5 h-5 fill-amber-400 text-amber-500" />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Urine Colour Reference
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Educational colour examples, not a measured patient sample.
                </p>
              </div>

            </div>

            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              selectedColour.statusColor === 'emerald'
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

          {/* Educational colour illustration */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">

            <div className="sm:col-span-5 flex flex-col items-center justify-center">

              <div className="relative w-36 h-36 rounded-full border-4 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 shadow-xl p-2.5 flex items-center justify-center">

                <div className={`w-full h-full rounded-full bg-gradient-to-tr ${selectedColour.fluidGradient} shadow-[inset_0_4px_16px_rgba(0,0,0,0.25)] relative overflow-hidden flex items-center justify-center`}>

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

              <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-1">
                Illustrative reference
              </span>

            </div>

            <div className="sm:col-span-7 space-y-3.5">

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-1">

                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  Reference Information
                </p>

                <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedColour.description}
                </p>

              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">

                  <span className="text-slate-400 block text-[11px]">
                    Reference Specific Gravity
                  </span>

                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {selectedColour.specificGravityEst}
                  </span>

                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">

                  <span className="text-slate-400 block text-[11px]">
                    Reference Status
                  </span>

                  <span className="font-semibold text-cyan-600 dark:text-cyan-400 text-xs">
                    {selectedColour.status}
                  </span>

                </div>

              </div>

              {!hasUrineRecord && (
                <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 text-xs text-amber-800 dark:text-amber-200">
                  No verified urine measurement is recorded yet. Your patient-specific measurements will appear in the panel beside this reference.
                </div>
              )}

              <p className="text-[12px] text-slate-500 dark:text-slate-400 italic">
                Reference note: {selectedColour.recommendation}
              </p>

            </div>

          </div>

          {/* Colour Reference Selector */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">

            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">
              Explore Reference Urinalysis Colours:
            </span>

            <div className="grid grid-cols-6 gap-2">

              {URINE_COLOUR_PROFILES.map((color) => {

                const isSelected = selectedColour.id === color.id;

                return (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColour(color)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all cursor-pointer ${
                      isSelected
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

        {/* Right Card: Latest Firestore Urine Test */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#0A1226] border border-slate-200/90 dark:border-slate-800/90 shadow-sm flex flex-col justify-between space-y-5">

          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">

            <div className="flex items-center gap-2.5">

              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Activity className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Latest Urine Test
              </h3>

            </div>

            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              {isLoadingReadings
                ? 'Loading'
                : readingError
                  ? 'Unavailable'
                  : latestUrineReading
                    ? 'Recorded'
                    : 'No records'}
            </span>

          </div>

          {isLoadingReadings ? (

            <div className="py-8 text-center text-sm text-slate-500">
              Loading your Firestore urine measurements...
            </div>

          ) : readingError ? (

            <div className="py-8 text-center">

              <AlertTriangle className="w-7 h-7 text-amber-500 mx-auto mb-2" />

              <p className="text-sm text-red-500">
                {readingError}
              </p>

            </div>

          ) : !latestUrineReading || !hasUrineRecord ? (

            <div className="py-8 text-center">

              <Droplet className="w-8 h-8 text-slate-400 mx-auto mb-3" />

              <p className="font-semibold text-slate-800 dark:text-white">
                No urine test recorded
              </p>

              <p className="text-sm text-slate-500 mt-2">
                Your actual urine measurements will appear here after a test is recorded.
              </p>

            </div>

          ) : (

            <>

              <div className="space-y-2.5">

                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">
                  Latest Recorded Measurements
                </span>

                <div className="grid grid-cols-2 gap-3">

                  {/* pH */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">

                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                      Urine pH
                    </span>

                    <p className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">
                      {displayValue(latestUrineValues.ph)}
                    </p>

                  </div>

                  {/* Specific Gravity */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">

                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                      Specific Gravity
                    </span>

                    <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 font-mono mt-0.5">
                      {displayValue(latestUrineValues.specificGravity)}
                    </p>

                  </div>

                  {/* Protein */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">

                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                      Protein
                    </span>

                    <p className="text-lg font-extrabold text-slate-900 dark:text-white font-mono mt-1">

                      {hasActualValue(latestUrineValues.proteinMgDl)
                        ? `${latestUrineValues.proteinMgDl} mg/dL`
                        : displayValue(latestUrineValues.protein)}

                    </p>

                  </div>

                  {/* Glucose and Nitrites */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">

                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">
                      Glucose / Nitrites
                    </span>

                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-2">
                      Glucose: {displayValue(latestUrineValues.glucose)}
                    </p>

                    <p className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                      Nitrites: {displayValue(latestUrineValues.nitrites)}
                    </p>

                  </div>

                </div>
              </div>

              {/* Measurement metadata */}
              <div className="rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 p-4 space-y-2">

                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  Measurement Information
                </p>

                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Recorded:{' '}
                  {toDate(latestUrineReading.measuredAt)?.toLocaleString('en-IN') || 'Date unavailable'}
                </p>

                <p className="text-sm text-slate-700 dark:text-slate-300">
                  Source:{' '}
                  {latestUrineReading.source === 'manual'
                    ? 'Manual entry'
                    : latestUrineReading.source === 'imported'
                      ? 'Imported measurement'
                      : 'Unknown'}
                </p>

              </div>

            </>

          )}

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

      {/* 3. The 10-Parameter Reagent Suite */}
      <div className="p-7 sm:p-8 rounded-3xl bg-white dark:bg-[#0A1226] border border-slate-200/90 dark:border-slate-800/90 shadow-sm space-y-6">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">

          <div>

            <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-600 dark:text-cyan-400 block mb-1">
              Multistix 10SG Reference Suite
            </span>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              The 10-Parameter Reagent Reference Lab
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Explore reagent reference information, thresholds and biological mechanisms.
            </p>

          </div>

          <div className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-700 dark:text-slate-300 shrink-0">

            Active:{' '}
            <strong className="text-cyan-600 dark:text-cyan-400">
              {selectedBio?.name || 'Not available'}
            </strong>

          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Reagent Reference Selectors */}
          <div className="lg:col-span-5 space-y-2">

            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block px-1 mb-2">
              Select Reagent Pad:
            </span>

            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">

              {BIOMARKER_DEFINITIONS.map((bio) => {

                const isSelected = selectedBio?.id === bio.id;

                return (
                  <button
                    type="button"
                    key={bio.id}
                    onClick={() => setSelectedBio(bio)}
                    className={`w-full p-3 rounded-2xl border transition-all duration-200 flex items-center justify-between text-left ${
                      isSelected
                        ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-700 dark:text-cyan-300 font-bold shadow-xs'
                        : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >

                    <div className="flex items-center space-x-3">

                      <div className={`w-3 h-3 rounded-full shrink-0 ${
                        isSelected
                          ? 'bg-cyan-500 ring-4 ring-cyan-500/20'
                          : 'bg-slate-300 dark:bg-slate-700'
                      }`} />

                      <div>

                        <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 dark:text-white">
                          {bio.name}
                        </h4>

                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {bio.normalRange} • {bio.unit}
                        </p>

                      </div>

                    </div>

                    <ChevronRight className={`w-4 h-4 transition-transform ${
                      isSelected
                        ? 'text-cyan-600 dark:text-cyan-400 translate-x-1'
                        : 'text-slate-400'
                    }`} />

                  </button>
                );
              })}

            </div>

          </div>

          {/* Reagent Reference Details */}
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-5">

            {selectedBio ? (

              <>

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

                    <span className="text-[11px] text-slate-400 block">
                      Reference Range
                    </span>

                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                      {selectedBio.baselineMean} {selectedBio.unit}
                    </span>

                  </div>

                </div>

                <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedBio.description}
                </p>

                {/* Reference Colour Scale */}
                <div className="space-y-2">

                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Reference Colorimetric Pad Scale:
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

                {/* Biological Context */}
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

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  These are educational reference definitions, not your personal test results.
                </p>

              </>

            ) : (

              <p className="text-sm text-slate-500">
                No biomarker reference definitions are available.
              </p>

            )}

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
                Educational examples of factors that can influence urine test interpretation.
              </p>

            </div>

          </div>

          <span className="text-xs px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold border border-purple-500/20">
            Educational Simulator
          </span>

        </div>

        {/* Confounder Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

          {CONFOUNDERS.map((conf) => {

            const isActive = activeConfounder === conf.id;

            return (
              <button
                type="button"
                key={conf.id}
                onClick={() => setActiveConfounder(conf.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  isActive
                    ? 'border-purple-500 bg-purple-500/10 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >

                <div className="flex items-center justify-between mb-1">

                  <span className={`w-2.5 h-2.5 rounded-full ${
                    isActive
                      ? 'bg-purple-500'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`} />

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

        {/* Active Confounder Explanation */}
        {(() => {

          const current = CONFOUNDERS.find(
            (conf) => conf.id === activeConfounder
          );

          return (
            <div className="p-5 rounded-2xl bg-purple-500/5 dark:bg-purple-950/20 border border-purple-500/20 space-y-2">

              <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300">

                <Sparkles className="w-4 h-4 text-purple-500" />

                <span>Educational Example: {current?.name}</span>

              </div>

              <p className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed">
                {current?.impact}
              </p>

              <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400">
                This simulator provides educational context only. It does not change, predict or diagnose your recorded measurements.
              </div>

            </div>
          );

        })()}

      </div>

      {/* 5. Medical Safety Disclaimer */}
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
                      Image analysis is not currently connected.
                    </p>

                  </div>

                </div>

                <button
                  type="button"
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

                  <button
                    type="button"
                    onClick={handleSimulateScan}
                    disabled={analyzingImage}
                    className="w-full border-2 border-dashed border-cyan-500/40 hover:border-cyan-500 bg-cyan-500/5 dark:bg-cyan-950/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group disabled:opacity-60"
                  >

                    {analyzingImage ? (

                      <div className="space-y-3 flex flex-col items-center">

                        <RefreshCw className="w-10 h-10 text-cyan-500 animate-spin" />

                        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Checking scan availability...
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          No patient measurements are being generated.
                        </p>

                      </div>

                    ) : (

                      <>

                        <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                          <Upload className="w-7 h-7" />
                        </div>

                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                          Upload or capture a test strip
                        </p>

                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          This workflow is informational only and does not create patient readings.
                        </p>

                      </>

                    )}

                  </button>

                  <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">

                    <p>
                      • Verified urine values come from your Firestore readings.
                    </p>

                    <p>
                      • Image analysis must be validated before it can create medical records.
                    </p>

                  </div>

                </div>

              ) : (

                <div className="space-y-4 animate-fade-in">

                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center gap-3">

                    <Info className="w-5 h-5 text-amber-500 shrink-0" />

                    <div>

                      <h4 className="text-xs font-bold text-amber-700 dark:text-amber-300">
                        {scanResult.title}
                      </h4>

                      <p className="text-[11px] text-slate-600 dark:text-slate-300">
                        {scanResult.message}
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsScanModalOpen(false);
                      setScanResult(null);
                    }}
                    className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all cursor-pointer"
                  >
                    Close
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
