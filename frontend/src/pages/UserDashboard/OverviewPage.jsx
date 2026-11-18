import React, {
  useState,
  useEffect,
  useMemo,
  useCallback
} from 'react';

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
  Stethoscope,
  FileText,
  Bluetooth,
  RefreshCw,
  Activity,
  Settings as SettingsIcon,
  AlertCircle
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { healthReadingService } from '../../services/healthReadingService';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

const EMPTY_VITALS = {
  systolic: null,
  diastolic: null,
  pulse: null,
  spo2: null,
  steps: null,
  distance: null,
  exerciseMins: null,
  urineProtein: null,
  urineProteinMg: null,
  urineSG: null,
  urinePH: null,
  urineGlucose: null,
  urineNitrites: null
};

const hasValue = (value) =>
  value !== null && value !== undefined && value !== '';

const displayValue = (value) =>
  hasValue(value) ? value : '—';

const getDate = (value) => {
  if (!value) return null;

  if (typeof value.toDate === 'function') {
    return value.toDate();
  }

  if (typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000);
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const getTimestamp = (reading) =>
  getDate(reading?.measuredAt)?.getTime() || 0;

const formatMeasurementDate = (reading) => {
  const date = getDate(reading?.measuredAt);

  if (!date) return 'Date unavailable';

  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

const getLatestReading = (readings, type) =>
  readings.find((reading) => reading.type === type) || null;

const mapReadingsToVitals = (readings) => {
  const vitals = { ...EMPTY_VITALS };

  const bloodPressure = getLatestReading(readings, 'blood_pressure');
  const heartRate = getLatestReading(readings, 'heart_rate');
  const oxygen = getLatestReading(readings, 'oxygen_saturation');
  const activity = getLatestReading(readings, 'activity');
  const urine = getLatestReading(readings, 'urine_test');

  if (bloodPressure?.values) {
    vitals.systolic = bloodPressure.values.systolic ?? null;
    vitals.diastolic = bloodPressure.values.diastolic ?? null;
    vitals.pulse = bloodPressure.values.pulse ?? null;
  }

  if (heartRate?.values?.bpm !== undefined) {
    vitals.pulse = heartRate.values.bpm;
  }

  if (oxygen?.values) {
    vitals.spo2 = oxygen.values.spo2 ?? null;
  }

  if (activity?.values) {
    vitals.steps = activity.values.steps ?? null;
    vitals.distance = activity.values.distanceKm ?? null;
    vitals.exerciseMins = activity.values.exerciseMinutes ?? null;
  }

  if (urine?.values) {
    vitals.urineProtein = urine.values.protein ?? null;
    vitals.urineProteinMg = urine.values.proteinMgDl ?? null;
    vitals.urinePH = urine.values.ph ?? null;
    vitals.urineGlucose = urine.values.glucose ?? null;
    vitals.urineNitrites = urine.values.nitrites ?? null;
    vitals.urineSG = urine.values.specificGravity ?? null;
  }

  return {
    vitals,
    latestByType: {
      blood_pressure: bloodPressure,
      heart_rate: heartRate,
      oxygen_saturation: oxygen,
      activity,
      urine_test: urine
    }
  };
};

export default function OverviewPage() {
  const { currentUser } = useAuth();
  const { t, isHindi } = useLanguage();

  const [readings, setReadings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadReadings = useCallback(async (showRefresh = false) => {
    if (!currentUser?.uid) {
      setReadings([]);
      setIsLoading(false);
      return;
    }

    if (showRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError('');

    try {
      const result = await healthReadingService.list(
        currentUser.uid,
        100
      );

      const sortedReadings = [...(result || [])].sort(
        (a, b) => getTimestamp(b) - getTimestamp(a)
      );

      setReadings(sortedReadings);
    } catch (err) {
      console.error('Firestore reading load failed:', err);

      setError(
        'Unable to load your health readings. Please try again.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    loadReadings();
  }, [loadReadings]);

  const { vitals, latestByType } = useMemo(
    () => mapReadingsToVitals(readings),
    [readings]
  );

  const firstName =
    currentUser?.name?.trim()?.split(' ')[0] || 'there';

  const hasBloodPressure =
    hasValue(vitals.systolic) &&
    hasValue(vitals.diastolic);

  const hasSteps = hasValue(vitals.steps);
  const hasSpo2 = hasValue(vitals.spo2);

  const hasUrineReadings =
    hasValue(vitals.urineProtein) ||
    hasValue(vitals.urineProteinMg) ||
    hasValue(vitals.urinePH) ||
    hasValue(vitals.urineGlucose) ||
    hasValue(vitals.urineNitrites) ||
    hasValue(vitals.urineSG);

  const hasAnyReadings = readings.length > 0;

  return (
    <div className="space-y-10 max-w-7xl mx-auto">

      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isHindi ? 'पुनः स्वागत है,' : 'Welcome back,'} {firstName}
            </h1>

            <span className="text-[13px] font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/25">
              {isHindi ? 'स्वास्थ्य डैशबोर्ड' : 'Health Dashboard'}
            </span>
          </div>

          <p className="text-[16px] text-slate-600 dark:text-slate-400">
            {isHindi ? 'आज है ' : 'Today is '}
            {new Date().toLocaleDateString(isHindi ? 'hi-IN' : 'en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric'
            })}
            .
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3.5">
          <Link
            to="/dashboard/devices"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-[15px] font-bold bg-cyan-500/15 text-cyan-500 dark:text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/25 transition-all"
          >
            <Bluetooth className="w-5 h-5" />
            <span>{isHindi ? 'कनेक्टेड डिवाइसेस' : 'Connected Devices'}</span>
          </Link>

          <Link
            to="/dashboard/reports"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[15px] font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/20"
          >
            <Plus className="w-5 h-5" />
            <span>{isHindi ? 'आज की रीडिंग जोड़ें' : "Add Today's Reading"}</span>
          </Link>

          <Link
            to="/dashboard/assistant"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[15px] font-semibold glass-card text-slate-800 dark:text-slate-200 hover:border-cyan-500/50 transition-all"
          >
            <Bot className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
            <span>Ask Health AI</span>
          </Link>

          <Link
            to="/dashboard/qr"
            className="p-3 rounded-2xl glass-card text-slate-600 dark:text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/50 transition-all"
            title="My Health QR"
          >
            <QrCode className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Health Data Status */}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-950/40 via-cyan-950/30 to-indigo-950/40 border border-cyan-500/30 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-lg shadow-cyan-950/20"
      >
        <div className="flex items-center gap-4">
          <div className="w-13 h-13 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
            <Activity className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="font-extrabold text-[17px] text-slate-900 dark:text-white">
                {isHindi ? 'स्वास्थ्य डेटा अवलोकन' : 'Health Data Overview'}
              </h3>

              <span className="text-[12px] px-2.5 py-0.5 rounded-full bg-slate-500/10 text-slate-500 dark:text-slate-400 font-bold border border-slate-500/30">
                {isLoading
                  ? (isHindi ? 'लोड हो रहा है' : 'Loading')
                  : error
                    ? (isHindi ? 'अनुपलब्ध' : 'Unavailable')
                    : `${readings.length} ${isHindi ? 'रिकॉर्ड्स' : 'Recorded'}`}
              </span>
            </div>

            <p className="text-[14px] text-slate-600 dark:text-slate-400">
              {isHindi
                ? 'यहां प्रदर्शित माप आपके सुरक्षित स्वास्थ्य रिकॉर्ड्स से प्राप्त किए गए हैं।'
                : 'Measurements displayed here are retrieved from your Firestore health records.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => loadReadings(true)}
            disabled={isLoading || isRefreshing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[14px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/35 hover:bg-cyan-500/30 transition-all disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                isRefreshing ? 'animate-spin' : ''
              }`}
            />
            <span>
              {isRefreshing
                ? (isHindi ? 'रीफ्रेश हो रहा है...' : 'Refreshing...')
                : (isHindi ? 'रीडिंग्स रीफ्रेश करें' : 'Refresh Readings')}
            </span>
          </button>

          <Link
            to="/dashboard/devices"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-[14px] font-bold bg-slate-800/80 hover:bg-slate-700/80 text-white transition-all border border-slate-700"
          >
            <span>Device Hub</span>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </Link>
        </div>
      </motion.div>

      {/* Loading */}

      {isLoading && (
        <div className="p-8 rounded-3xl glass-card text-center">
          <RefreshCw className="w-8 h-8 mx-auto text-cyan-500 animate-spin" />

          <p className="mt-3 text-slate-500 dark:text-slate-400">
            Loading your Firestore health readings...
          </p>
        </div>
      )}

      {/* Error */}

      {!isLoading && error && (
        <div className="p-5 rounded-2xl border border-rose-500/30 bg-rose-500/10 flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />

          <div className="flex-1">
            <p className="font-bold text-rose-600 dark:text-rose-400">
              Could not load health data
            </p>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              {error}
            </p>
          </div>

          <button
            onClick={() => loadReadings(true)}
            className="text-sm font-bold text-cyan-600 dark:text-cyan-400"
          >
            Retry
          </button>
        </div>
      )}

      {/* Dashboard Content */}

      {!isLoading && !error && (
        <>

          {/* Vital Cards */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Blood Pressure */}

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              whileHover={{ y: -4 }}
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
                    {hasBloodPressure
                      ? `${vitals.systolic}/${vitals.diastolic}`
                      : '—'}
                  </span>

                  <span className="text-[15px] text-slate-400">
                    mmHg
                  </span>
                </div>

                <p className="text-[14px] text-slate-500 dark:text-slate-400 font-semibold mt-2">
                  {latestByType.blood_pressure
                    ? formatMeasurementDate(latestByType.blood_pressure)
                    : 'No blood pressure reading yet'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[14px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
                <span>Heart Rate:</span>

                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {displayValue(vitals.pulse)}
                  {hasValue(vitals.pulse) ? ' BPM' : ''}
                </span>
              </div>
            </motion.div>

            {/* Steps */}

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              whileHover={{ y: -4 }}
              className="p-7 rounded-3xl glass-card glass-card-hover space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-bold text-slate-500 dark:text-slate-400">
                  Walking Steps
                </span>

                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Footprints className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono">
                    {displayValue(vitals.steps)}
                  </span>

                  <span className="text-[15px] text-slate-400">
                    steps
                  </span>
                </div>

                {hasSteps && (
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.min(
                          Math.max(Number(vitals.steps), 0) / 8000 * 100,
                          100
                        )}%`
                      }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="bg-emerald-500 h-full rounded-full"
                    />
                  </div>
                )}

                <p className="text-[14px] text-slate-500 dark:text-slate-400 font-semibold mt-2">
                  {latestByType.activity
                    ? formatMeasurementDate(latestByType.activity)
                    : 'No activity reading yet'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[14px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
                <span>Distance:</span>

                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                  {displayValue(vitals.distance)}
                  {hasValue(vitals.distance) ? ' km' : ''}
                </span>
              </div>
            </motion.div>

            {/* Exercise Time */}

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              whileHover={{ y: -4 }}
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
                    {displayValue(vitals.exerciseMins)}
                  </span>

                  <span className="text-[15px] text-slate-400">
                    minutes
                  </span>
                </div>

                <p className="text-[14px] text-slate-500 dark:text-slate-400 font-semibold mt-2">
                  {latestByType.activity
                    ? formatMeasurementDate(latestByType.activity)
                    : 'No exercise data available'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[14px] text-slate-500 dark:text-slate-400">
                Actual recorded activity
              </div>
            </motion.div>

            {/* Oxygen Saturation */}

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              whileHover={{ y: -4 }}
              className="p-7 rounded-3xl glass-card glass-card-hover space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-bold text-slate-500 dark:text-slate-400">
                  Blood Oxygen (SpO2)
                </span>

                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono">
                    {displayValue(vitals.spo2)}
                  </span>

                  <span className="text-[15px] text-slate-400">
                    %
                  </span>
                </div>

                <p className="text-[14px] text-slate-500 dark:text-slate-400 font-semibold mt-2">
                  {latestByType.oxygen_saturation
                    ? formatMeasurementDate(latestByType.oxygen_saturation)
                    : 'No oxygen reading yet'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[14px] text-slate-500 dark:text-slate-400">
                {hasSpo2 ? 'Recorded in Firestore' : 'Not available'}
              </div>
            </motion.div>

          </div>

          {/* Urine Health Readings */}

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
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Urine Health Readings
                  </h2>

                  <p className="text-[14px] text-slate-500 dark:text-slate-400 mt-1">
                    Actual recorded urine measurements.
                  </p>
                </div>
              </div>

              <Link
                to="/dashboard/reports"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                <Plus className="w-4 h-4" />
                Add Reading
              </Link>
            </div>

            {hasUrineReadings ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {[
                    ['Protein (Albumin)', vitals.urineProtein],
                    [
                      'Protein Concentration',
                      hasValue(vitals.urineProteinMg)
                        ? `${vitals.urineProteinMg} mg/dL`
                        : null
                    ],
                    ['pH Level', vitals.urinePH],
                    ['Glucose', vitals.urineGlucose],
                    ['Nitrites', vitals.urineNitrites],
                    ['Specific Gravity', vitals.urineSG]
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="p-5 rounded-2xl bg-slate-50/90 dark:bg-[#070B14]/90 border border-slate-200 dark:border-slate-800 space-y-3"
                    >
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        {label}
                      </span>

                      <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                        {displayValue(value)}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Latest urine test:{' '}
                  {formatMeasurementDate(latestByType.urine_test)}
                </p>
              </>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3">
                <Droplet className="w-10 h-10 mx-auto text-slate-400" />

                <h3 className="font-bold text-slate-800 dark:text-slate-200">
                  No urine readings available
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                  No urine measurements have been recorded in Firestore yet.
                </p>

                <Link
                  to="/dashboard/reports"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950"
                >
                  <Plus className="w-4 h-4" />
                  Add a Reading
                </Link>
              </div>
            )}
          </motion.div>

          {/* Health Summary and Quick Actions */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            <div className="lg:col-span-7 p-8 rounded-3xl glass-card space-y-5 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        Health Summary
                      </h2>

                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                        Based on available Firestore records
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/dashboard/analytics"
                    className="text-[14px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>Full History on My Health</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 border border-slate-200 dark:border-slate-800 text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed space-y-3">
                  {hasAnyReadings ? (
                    <p>
                      Your account has {readings.length} recorded health
                      measurement(s). Review the individual cards and
                      health history for the available data.
                    </p>
                  ) : (
                    <p>
                      No health readings are available yet. Add your first
                      measurement to begin tracking your health history.
                    </p>
                  )}

                  <p className="text-[14px] text-slate-500 dark:text-slate-400">
                    BioTrajectory displays recorded information and does
                    not assume missing measurements are normal.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Review your recorded history and trends.
                </span>

                <Link
                  to="/dashboard/analytics"
                  className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Go to My Health</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Quick Consult and Records */}

            <div className="lg:col-span-5 p-8 rounded-3xl glass-card space-y-5 flex flex-col justify-between shadow-sm">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Quick Consult & Records
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Connect with clinicians or review clinical uploads
                </p>
              </div>

              <div className="space-y-3 pt-2">

                <Link
                  to="/dashboard/consultation"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 hover:border-cyan-500/50 border border-slate-200 dark:border-slate-800 text-[15px] font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <Stethoscope className="w-5 h-5 text-cyan-500 dark:text-cyan-400" />
                    <span>Talk to a Doctor Online</span>
                  </span>

                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </Link>

                <Link
                  to="/dashboard/history"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 hover:border-cyan-500/50 border border-slate-200 dark:border-slate-800 text-[15px] font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                    <span>Upload Your Reports</span>
                  </span>

                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </Link>

                <Link
                  to="/dashboard/settings"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 hover:border-cyan-500/50 border border-slate-200 dark:border-slate-800 text-[15px] font-semibold text-slate-800 dark:text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-2.5">
                    <SettingsIcon className="w-5 h-5 text-[#00685f] dark:text-[#6bd8cb]" />
                    <span>Settings</span>
                  </span>

                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </Link>

              </div>
            </div>
          </div>
        </>
      )}

      <DisclaimerBanner
        text="Notice: BioTrajectory helps you track personal body signals and learn about health trends. It does not replace talking to a doctor or getting a personal medical diagnosis."
      />
    </div>
  );
}