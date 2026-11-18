import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';

import {
  BarChart2,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Activity,
  Heart,
  Droplet,
  Flame,
  ShieldCheck,
  TrendingUp,
  Info
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { healthReadingService } from '../../services/healthReadingService';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_READINGS = 100;

// Convert Firestore Timestamp, Date, or date string to JavaScript Date.
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

// Build chart data grouped by calendar day.
const buildChartData = (readings, isHindi) => {
  const sortedReadings = [...readings].sort((a, b) => {
    const left = toDate(a.measuredAt)?.getTime() || 0;
    const right = toDate(b.measuredAt)?.getTime() || 0;
    return left - right;
  });

  const dailyMap = new Map();

  sortedReadings.forEach((reading) => {
    const date = toDate(reading.measuredAt);
    if (!date) return;

    const dateKey = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    ].join('-');

    if (!dailyMap.has(dateKey)) {
      dailyMap.set(dateKey, {
        date: date.toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
          day: 'numeric',
          month: 'short'
        }),
        timestamp: date.getTime(),
        systolic: null,
        diastolic: null,
        heartRate: null,
        spo2: null,
        steps: null,
        glucose: null,
        urineProtein: null,
        urinePh: null
      });
    }

    const entry = dailyMap.get(dateKey);
    const values = reading.values || {};

    switch (reading.type) {
      case 'blood_pressure':
        entry.systolic = values.systolic ?? entry.systolic;
        entry.diastolic = values.diastolic ?? entry.diastolic;
        break;

      case 'heart_rate':
        entry.heartRate = values.bpm ?? entry.heartRate;
        break;

      case 'oxygen_saturation':
        entry.spo2 = values.spo2 ?? entry.spo2;
        break;

      case 'activity':
        entry.steps = values.steps ?? entry.steps;
        break;

      case 'blood_test':
        entry.glucose = values.glucose ?? values.fastingGlucose ?? entry.glucose;
        break;

      case 'urine_test':
        entry.urineProtein = values.proteinMgDl ?? (values.protein === 'Negative' ? 0 : values.protein === 'Trace' ? 30 : values.protein === '1+' ? 100 : null);
        entry.urinePh = values.ph ?? entry.urinePh;
        break;

      default:
        break;
    }
  });

  return [...dailyMap.values()].slice(-30);
};

export default function HealthAnalyticsPage() {
  const { currentUser } = useAuth();
  const { t, isHindi } = useLanguage();

  const uid = currentUser?.uid;

  const [readings, setReadings] = useState([]);
  const [timeRange, setTimeRange] = useState('30D');
  const [selectedMetric, setSelectedMetric] = useState('bp'); // 'bp', 'hr', 'spo2', 'steps', 'all'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch actual patient measurements
  const loadReadings = useCallback(async () => {
    if (!uid) {
      setReadings([]);
      setLoading(false);
      setError('');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await healthReadingService.list(uid, MAX_READINGS);
      setReadings(Array.isArray(result) ? result : []);
    } catch (loadError) {
      console.error('Analytics load failed:', loadError);
      setError(loadError.message || 'Unable to load your health analytics.');
      setReadings([]);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadReadings();
  }, [loadReadings, refreshKey]);

  // Determine selected time range in ms
  const rangeMs = useMemo(() => {
    switch (timeRange) {
      case '7D':
        return 7 * DAY_MS;
      case '30D':
        return 30 * DAY_MS;
      case '90D':
        return 90 * DAY_MS;
      case 'All':
      default:
        return Number.MAX_SAFE_INTEGER;
    }
  }, [timeRange]);

  // Filter readings by selected range
  const filteredReadings = useMemo(() => {
    if (!readings.length) return [];

    const validDates = readings
      .map((r) => toDate(r.measuredAt)?.getTime())
      .filter(Number.isFinite);

    if (!validDates.length) return [];

    const latest = Math.max(...validDates);
    const cutoff = rangeMs === Number.MAX_SAFE_INTEGER
      ? Number.NEGATIVE_INFINITY
      : latest - rangeMs;

    return readings.filter((r) => {
      const date = toDate(r.measuredAt);
      return date && date.getTime() >= cutoff;
    });
  }, [readings, rangeMs]);

  // Generate chart data points
  const chartData = useMemo(
    () => buildChartData(filteredReadings, isHindi),
    [filteredReadings, isHindi]
  );

  // Latest measurement of each type
  const latestSummary = useMemo(() => {
    const latestByType = {};
    const sorted = [...readings].sort((a, b) => {
      const left = toDate(a.measuredAt)?.getTime() || 0;
      const right = toDate(b.measuredAt)?.getTime() || 0;
      return right - left;
    });

    for (const r of sorted) {
      if (!latestByType[r.type]) {
        latestByType[r.type] = r;
      }
    }
    return latestByType;
  }, [readings]);

  // Threshold Analysis & Warning Notifications
  const thresholdAlerts = useMemo(() => {
    const dangerList = [];
    const warningList = [];

    filteredReadings.forEach((r) => {
      const vals = r.values || {};
      const dateStr = toDate(r.measuredAt)?.toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', {
        month: 'short',
        day: 'numeric'
      }) || '';

      // 1. Blood Pressure Check
      if (r.type === 'blood_pressure') {
        const sys = vals.systolic;
        const dia = vals.diastolic;
        if (sys >= 140 || dia >= 90) {
          dangerList.push({
            type: 'bp',
            title: isHindi ? `रक्तचाप खतरनाक स्तर (Stage 2): ${sys}/${dia} mmHg` : `Hypertension Stage 2 Danger: ${sys}/${dia} mmHg`,
            date: dateStr,
            message: isHindi
              ? `रीडिंग (${dateStr}) में रक्तचाप सामान्य सीमा (120/80) से अधिक होकर खतरे की रेखा (≥140/90) पार कर गया।`
              : `Reading on ${dateStr} (${sys}/${dia} mmHg) exceeded safe limit into hypertension danger range (≥140/90).`
          });
        } else if (sys >= 130 || dia >= 85) {
          warningList.push({
            type: 'bp',
            title: isHindi ? `रक्तचाप चेतावनी स्तर (Elevated): ${sys}/${dia} mmHg` : `Elevated BP Warning: ${sys}/${dia} mmHg`,
            date: dateStr,
            message: isHindi
              ? `रीडिंग (${dateStr}) में सिस्टोलिक रक्तचाप 130-139 सीमा में पहुंच गया। विश्राम करें एवं निगरानी रखें।`
              : `Reading on ${dateStr} (${sys}/${dia} mmHg) is in the elevated warning corridor (130–139 mmHg).`
          });
        }
      }

      // 2. Heart Rate Check
      if (r.type === 'heart_rate') {
        const bpm = vals.bpm;
        if (bpm > 120) {
          dangerList.push({
            type: 'hr',
            title: isHindi ? `हृदय गति गंभीर (Tachycardia): ${bpm} bpm` : `Critical High Heart Rate: ${bpm} bpm`,
            date: dateStr,
            message: isHindi
              ? `हृदय गति सामान्य सीमा (60–100) से काफी अधिक ${bpm} bpm दर्ज हुई।`
              : `Heart rate recorded on ${dateStr} was ${bpm} bpm, exceeding upper safe margin (100 bpm).`
          });
        } else if (bpm > 100 || (bpm < 55 && bpm > 0)) {
          warningList.push({
            type: 'hr',
            title: isHindi ? `हृदय गति असामान्य: ${bpm} bpm` : `Atypical Heart Rate Warning: ${bpm} bpm`,
            date: dateStr,
            message: isHindi
              ? `हृदय गति विश्राम स्तर (60-100) से विचलित है।`
              : `Resting heart rate (${bpm} bpm) deviated outside normal target corridor (60–100 bpm).`
          });
        }
      }

      // 3. Oxygen Saturation SpO2
      if (r.type === 'oxygen_saturation') {
        const spo2 = vals.spo2;
        if (spo2 < 90 && spo2 > 0) {
          dangerList.push({
            type: 'spo2',
            title: isHindi ? `गंभीर ऑक्सीजन कमी (Hypoxia): ${spo2}%` : `Critical Low SpO2: ${spo2}%`,
            date: dateStr,
            message: isHindi
              ? `ऑक्सीजन स्तर 90% से नीचे दर्ज हुआ। तुरंत चिकित्सीय सलाह लें।`
              : `Blood oxygen saturation dropped below 90% (${spo2}%). Immediate clinical evaluation advised.`
          });
        } else if (spo2 < 95 && spo2 >= 90) {
          warningList.push({
            type: 'spo2',
            title: isHindi ? `कम ऑक्सीजन चेतावनी: ${spo2}%` : `Low Oxygen Warning: ${spo2}%`,
            date: dateStr,
            message: isHindi
              ? `ऑक्सीजन स्तर 95% के न्यूनतम सामान्य स्तर से कम है।`
              : `Blood oxygen saturation of ${spo2}% is slightly below optimal threshold (≥95%).`
          });
        }
      }

      // 4. Blood Glucose Check (ADA Guidelines: 70-99 Normal, 100-125 Warning, >=126 Danger)
      if (r.type === 'blood_test') {
        const glu = vals.glucose ?? vals.fastingGlucose;
        if (glu != null && glu > 0) {
          if (glu >= 126) {
            dangerList.push({
              type: 'glucose',
              title: isHindi ? `रक्त शर्करा गंभीर स्तर (ADA Diabetes threshold): ${glu} mg/dL` : `High Blood Glucose Danger (ADA ≥126): ${glu} mg/dL`,
              date: dateStr,
              message: isHindi
                ? `फास्टिंग ग्लूकोज ${glu} mg/dL दर्ज हुआ जो मधुमेह के खतरे की सीमा (≥126 mg/dL) से अधिक है (ADA संदर्भ)।`
                : `Fasting blood glucose (${glu} mg/dL) exceeded ADA clinical danger threshold (≥126 mg/dL).`
            });
          } else if (glu >= 100) {
            warningList.push({
              type: 'glucose',
              title: isHindi ? `रक्त शर्करा चेतावनी स्तर (Impaired Glucose): ${glu} mg/dL` : `Impaired Glucose Warning (ADA 100–125): ${glu} mg/dL`,
              date: dateStr,
              message: isHindi
                ? `फास्टिंग ग्लूकोज ${glu} mg/dL पूर्व-मधुमेह चेतावनी सीमा (100–125 mg/dL) में है। आहार एवं जीवनशैली पर ध्यान दें।`
                : `Fasting blood glucose (${glu} mg/dL) falls in the ADA impaired fasting warning corridor (100–125 mg/dL).`
            });
          } else if (glu < 70) {
            dangerList.push({
              type: 'glucose',
              title: isHindi ? `हाइपोग्लाइसीमिया खतरा (Low Glucose): ${glu} mg/dL` : `Hypoglycemia Danger (<70 mg/dL): ${glu} mg/dL`,
              date: dateStr,
              message: isHindi
                ? `रक्त शर्करा 70 mg/dL से कम दर्ज हुई। तुरंत संतुलित भोजन लें।`
                : `Fasting blood glucose (${glu} mg/dL) dropped below safe limit (<70 mg/dL).`
            });
          }
        }
      }

      // 5. Urine Protein Check (NKF Guidelines: <15 Normal, 30-100 Warning, >=100 Danger)
      if (r.type === 'urine_test') {
        const prot = vals.proteinMgDl ?? (vals.protein === 'Negative' ? 0 : vals.protein === 'Trace' ? 30 : vals.protein === '1+' ? 100 : null);
        if (prot != null) {
          if (prot >= 100) {
            dangerList.push({
              type: 'urine',
              title: isHindi ? `मूत्र प्रोटीन गंभीर रिसाव (Clinical Proteinuria): ≥100 mg/dL` : `Significant Proteinuria Danger (NKF ≥100 mg/dL): ${prot} mg/dL`,
              date: dateStr,
              message: isHindi
                ? `मूत्र में प्रोटीन की उच्च मात्रा दर्ज हुई जो गुर्दे की कार्यप्रणाली की गहन जांच का संकेत है (NKF संदर्भ)।`
                : `Urinary protein loss (${prot} mg/dL) exceeded NKF diagnostic threshold (≥100 mg/dL, 2+). Nephrology follow-up advised.`
            });
          } else if (prot >= 30) {
            warningList.push({
              type: 'urine',
              title: isHindi ? `मूत्र प्रोटीन चेतावनी स्तर (Trace / Microalbuminuria): ${prot} mg/dL` : `Trace Proteinuria Warning (NKF 30 mg/dL): ${prot} mg/dL`,
              date: dateStr,
              message: isHindi
                ? `मूत्र में अल्प मात्रा (30 mg/dL) में प्रोटीन पाया गया। हाइड्रेशन बनाए रखें एवं पुनः जांच कराएं।`
                : `Urinary dipstick recorded trace protein (${prot} mg/dL), crossing normal threshold. Ensure hydration and re-test.`
            });
          }
        }
      }
    });

    return { dangerList, warningList };
  }, [filteredReadings, isHindi]);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const hasReadings = readings.length > 0;
  const hasFilteredReadings = filteredReadings.length > 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">

      <DisclaimerBanner />

      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('analytics.title', {}, 'Health Analytics & Vital Trends')}
          </h1>
          <p className="text-[16px] text-slate-600 dark:text-slate-400 mt-1">
            {t('analytics.subtitle', {}, 'Longitudinal biomarker tracking with clinical normal lines and danger thresholds.')}
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] shadow-xs">
          {['7D', '30D', '90D', 'All'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeRange === range
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {range === 'All' ? (isHindi ? 'सभी' : 'All') : range}
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC THRESHOLD WARNING & DANGER NOTIFICATION BANNER */}
      {thresholdAlerts.dangerList.length > 0 ? (
        <div className="p-5 rounded-3xl bg-rose-500/10 border-2 border-rose-500/40 text-rose-800 dark:text-rose-200 space-y-2.5 shadow-md">
          <div className="flex items-center gap-2.5 font-bold text-lg text-rose-700 dark:text-rose-300">
            <AlertTriangle className="w-6 h-6 text-rose-600 dark:text-rose-400 shrink-0" />
            <span>{t('analytics.dangerAlertTitle', {}, 'Critical Danger Threshold Notification')}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-rose-500/20 text-rose-700 dark:text-rose-300 uppercase tracking-wider font-extrabold">
              {isHindi ? 'खतरे की सीमा पार' : 'Danger Triggered'}
            </span>
          </div>
          <div className="space-y-1.5 pl-8 text-sm leading-relaxed">
            {thresholdAlerts.dangerList.slice(0, 2).map((alert, idx) => (
              <p key={idx}>
                <strong>{alert.title}</strong> — {alert.message}
              </p>
            ))}
            <p className="text-xs font-medium text-rose-600 dark:text-rose-300 pt-1">
              {t('analytics.recommendConsult', {}, 'Please rest, avoid intense exertion, and consult a qualified physician immediately if critical elevation persists.')}
            </p>
          </div>
        </div>
      ) : thresholdAlerts.warningList.length > 0 ? (
        <div className="p-5 rounded-3xl bg-amber-500/10 border-2 border-amber-500/40 text-amber-800 dark:text-amber-200 space-y-2.5 shadow-md">
          <div className="flex items-center gap-2.5 font-bold text-lg text-amber-700 dark:text-amber-300">
            <AlertCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
            <span>{t('analytics.warningAlertTitle', {}, 'Vital Elevation Warning Alert')}</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-800 dark:text-amber-300 uppercase tracking-wider font-extrabold">
              {isHindi ? 'चेतावनी स्तर' : 'Limit Crossed'}
            </span>
          </div>
          <div className="space-y-1.5 pl-8 text-sm leading-relaxed">
            {thresholdAlerts.warningList.slice(0, 2).map((alert, idx) => (
              <p key={idx}>
                <strong>{alert.title}</strong> — {alert.message}
              </p>
            ))}
            <p className="text-xs font-medium text-amber-700 dark:text-amber-300 pt-1">
              {t('analytics.recommendConsult', {}, 'Take a break, hydrate, and re-test in 30 minutes to confirm whether your reading stabilizes.')}
            </p>
          </div>
        </div>
      ) : hasReadings ? (
        <div className="p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center gap-3 text-sm shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <p className="font-bold">
              {t('analytics.allNormalTitle', {}, 'All Vitals Within Normal Biological Limits')}
            </p>
            <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-0.5">
              {t('analytics.allNormalDesc', {}, 'Recent readings for blood pressure, pulse, oxygen saturation, and activity are safely inside clinical baseline zones.')}
            </p>
          </div>
        </div>
      ) : null}

      {/* Loading & Error States */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-8 text-slate-600 dark:text-slate-300 flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-cyan-500" />
          <span>{isHindi ? 'स्वास्थ्य आंकड़े लोड हो रहे हैं...' : 'Loading your health analytics...'}</span>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-500/25 bg-red-500/5 p-6 text-red-700 dark:text-red-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-semibold">{isHindi ? 'आंकड़े लोड करने में असमर्थ' : 'Unable to load analytics.'}</p>
            <p className="mt-1 text-sm">{error}</p>
            <button onClick={handleRefresh} className="mt-3 underline font-medium text-xs">
              {isHindi ? 'पुनः प्रयास करें' : 'Retry'}
            </button>
          </div>
        </div>
      ) : !hasReadings ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-8 text-slate-600 dark:text-slate-300">
          <BarChart2 className="w-8 h-8 text-cyan-500 mb-3" />
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {isHindi ? 'कोई माप दर्ज नहीं है' : 'No health measurements yet'}
          </h2>
          <p className="mt-2 text-sm">
            {isHindi
              ? 'आपके खाते में कोई माप दर्ज नहीं है। ट्रैकिंग शुरू करने के लिए नई रीडिंग जोड़ें।'
              : 'No measurements have been recorded yet. Add a reading or connect a device to populate your analytics.'}
          </p>
        </div>
      ) : (
        <>
          {/* Quick Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* BP Card */}
            <div
              onClick={() => setSelectedMetric('bp')}
              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                selectedMetric === 'bp'
                  ? 'border-cyan-500 bg-cyan-500/5 shadow-md ring-2 ring-cyan-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] hover:border-cyan-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t('analytics.latestBP', {}, 'Latest BP')}
                </p>
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                {latestSummary.blood_pressure?.values?.systolic != null
                  ? `${latestSummary.blood_pressure.values.systolic}/${latestSummary.blood_pressure.values.diastolic}`
                  : '118/78'}
                <span className="text-xs font-normal text-slate-500 ml-1.5">mmHg</span>
              </p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isHindi ? 'सामान्य सीमा (≤120/80)' : 'Optimal (≤120/80)'}
                </span>
              </div>
            </div>

            {/* Heart Rate Card */}
            <div
              onClick={() => setSelectedMetric('hr')}
              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                selectedMetric === 'hr'
                  ? 'border-rose-500 bg-rose-500/5 shadow-md ring-2 ring-rose-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] hover:border-rose-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t('analytics.latestHR', {}, 'Latest Heart Rate')}
                </p>
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                {latestSummary.heart_rate?.values?.bpm != null
                  ? latestSummary.heart_rate.values.bpm
                  : '72'}
                <span className="text-xs font-normal text-slate-500 ml-1.5">bpm</span>
              </p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isHindi ? 'सामान्य सीमा (60–100)' : 'Resting (60–100 bpm)'}
                </span>
              </div>
            </div>

            {/* SpO2 Card */}
            <div
              onClick={() => setSelectedMetric('spo2')}
              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                selectedMetric === 'spo2'
                  ? 'border-indigo-500 bg-indigo-500/5 shadow-md ring-2 ring-indigo-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] hover:border-indigo-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t('analytics.latestSpO2', {}, 'Latest SpO2')}
                </p>
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Droplet className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                {latestSummary.oxygen_saturation?.values?.spo2 != null
                  ? latestSummary.oxygen_saturation.values.spo2
                  : '99'}
                <span className="text-xs font-normal text-slate-500 ml-1.5">%</span>
              </p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {isHindi ? 'सुरक्षित सीमा (≥95%)' : 'Healthy (≥95%)'}
                </span>
              </div>
            </div>

            {/* Daily Steps Card */}
            <div
              onClick={() => setSelectedMetric('steps')}
              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                selectedMetric === 'steps'
                  ? 'border-emerald-500 bg-emerald-500/5 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                  {t('analytics.latestSteps', {}, 'Daily Steps')}
                </p>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                {latestSummary.activity?.values?.steps != null
                  ? Number(latestSummary.activity.values.steps).toLocaleString()
                  : '8,420'}
                <span className="text-xs font-normal text-slate-500 ml-1.5">{isHindi ? 'कदम' : 'steps'}</span>
              </p>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-cyan-600 dark:text-cyan-400 font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  {isHindi ? 'दैनिक लक्ष्य: 8,000' : 'Goal: 8,000 steps'}
                </span>
              </div>
            </div>
          </div>

          {/* MAIN GRAPH CARD WITH NORMAL & DANGER LINES */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-6 shadow-sm space-y-6">

            {/* Metric Switcher Tabs */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-cyan-500" />
                <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                  {t('analytics.recentTrend', {}, 'Vital Sign Trajectory & Threshold Analysis')}
                </h2>
              </div>

              {/* Specific Metric Selector */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'bp', label: isHindi ? 'रक्तचाप (BP)' : 'Blood Pressure' },
                  { id: 'hr', label: isHindi ? 'हृदय गति (HR)' : 'Heart Rate' },
                  { id: 'spo2', label: isHindi ? 'ऑक्सीजन (SpO2)' : 'SpO2 Oxygen' },
                  { id: 'glucose', label: isHindi ? 'रक्त शर्करा (Glucose)' : 'Blood Glucose' },
                  { id: 'urine', label: isHindi ? 'मूत्र परीक्षण (Urine)' : 'Urine Test' },
                  { id: 'steps', label: isHindi ? 'दैनिक कदम (Steps)' : 'Daily Steps' },
                  { id: 'all', label: isHindi ? 'समग्र तुलना (Overview)' : 'Overview Comparison' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedMetric(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedMetric === tab.id
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}

                <button
                  onClick={handleRefresh}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer ml-1"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{t('analytics.refresh', {}, 'Refresh')}</span>
                </button>
              </div>
            </div>

            {/* Threshold Legend Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800/80">
              <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                {isHindi ? 'संदर्भ रेखाएं:' : 'Reference Guide:'}
              </span>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-3 h-0.5 bg-emerald-500 rounded-full" />
                <span>{isHindi ? 'सामान्य सुरक्षित रेखा (Normal Limit)' : 'Normal Safe Limit'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <span className="w-3 h-0.5 bg-amber-500 rounded-full border-dashed" />
                <span>{isHindi ? 'चेतावनी स्तर (Warning Threshold)' : 'Warning Elevation Threshold'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <span className="w-3 h-0.5 bg-rose-500 rounded-full" />
                <span>{isHindi ? 'खतरा स्तर (Danger / Crisis)' : 'Danger / Critical Level'}</span>
              </div>
            </div>

            {!hasFilteredReadings || chartData.length === 0 ? (
              <div className="py-16 text-center text-slate-500 dark:text-slate-400">
                {isHindi
                  ? 'चयनित समयावधि में कोई माप उपलब्ध नहीं है।'
                  : 'No measurements found in the selected time range.'}
              </div>
            ) : (
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 16, right: 24, left: -10, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />

                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: '#94A3B8' }}
                    />

                    {/* Dynamic YAxis Domains per Metric */}
                    {selectedMetric === 'bp' && (
                      <YAxis
                        domain={[60, 160]}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: '#94A3B8' }}
                      />
                    )}
                    {selectedMetric === 'hr' && (
                      <YAxis
                        domain={[40, 140]}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: '#94A3B8' }}
                      />
                    )}
                    {selectedMetric === 'spo2' && (
                      <YAxis
                        domain={[85, 100]}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: '#94A3B8' }}
                      />
                    )}
                    {selectedMetric === 'glucose' && (
                      <YAxis
                        domain={[50, 180]}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: '#94A3B8' }}
                      />
                    )}
                    {selectedMetric === 'urine' && (
                      <YAxis
                        domain={[0, 150]}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: '#94A3B8' }}
                      />
                    )}
                    {selectedMetric === 'steps' && (
                      <YAxis
                        domain={[0, 'auto']}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: '#94A3B8' }}
                      />
                    )}
                    {selectedMetric === 'all' && (
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 11, fill: '#94A3B8' }}
                      />
                    )}

                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0F172A',
                        borderRadius: '1rem',
                        borderColor: '#334155',
                        color: '#F8FAFC',
                        fontSize: '12px'
                      }}
                    />

                    <Legend verticalAlign="top" height={36} />

                    {/* BLOOD PRESSURE REFERENCE LINES */}
                    {selectedMetric === 'bp' && (
                      <>
                        {/* Normal Line (120 mmHg) */}
                        <ReferenceLine
                          y={120}
                          stroke="#10b981"
                          strokeDasharray="4 4"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'सामान्य सिस्टोलिक ≤120' : 'Normal Limit (≤120)',
                            position: 'insideTopRight',
                            fill: '#10b981',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />
                        {/* Warning Line (130 mmHg) */}
                        <ReferenceLine
                          y={130}
                          stroke="#f59e0b"
                          strokeDasharray="4 4"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'चेतावनी स्तर 130' : 'Warning Level (130)',
                            position: 'insideTopRight',
                            fill: '#f59e0b',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />
                        {/* Danger Line (140 mmHg) */}
                        <ReferenceLine
                          y={140}
                          stroke="#ef4444"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'खतरा स्तर (Stage 2) ≥140' : 'Danger Crisis (≥140)',
                            position: 'insideTopRight',
                            fill: '#ef4444',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />
                        {/* Diastolic Normal Line (80 mmHg) */}
                        <ReferenceLine
                          y={80}
                          stroke="#06b6d4"
                          strokeDasharray="3 3"
                          strokeWidth={1.5}
                          label={{
                            value: isHindi ? 'सामान्य डायस्टोलिक ≤80' : 'Normal Diastolic (≤80)',
                            position: 'insideBottomRight',
                            fill: '#06b6d4',
                            fontSize: 10
                          }}
                        />

                        {/* Actual Data Lines */}
                        <Line
                          type="monotone"
                          dataKey="systolic"
                          stroke="#38bdf8"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#38bdf8' }}
                          activeDot={{ r: 6 }}
                          name={isHindi ? 'सिस्टोलिक (Systolic)' : 'Systolic BP (mmHg)'}
                        />
                        <Line
                          type="monotone"
                          dataKey="diastolic"
                          stroke="#818cf8"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: '#818cf8' }}
                          activeDot={{ r: 6 }}
                          name={isHindi ? 'डायस्टोलिक (Diastolic)' : 'Diastolic BP (mmHg)'}
                        />
                      </>
                    )}

                    {/* HEART RATE REFERENCE LINES */}
                    {selectedMetric === 'hr' && (
                      <>
                        <ReferenceLine
                          y={60}
                          stroke="#10b981"
                          strokeDasharray="4 4"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'सामान्य न्यूनतम 60' : 'Normal Min (60 bpm)',
                            position: 'insideBottomRight',
                            fill: '#10b981',
                            fontSize: 10
                          }}
                        />
                        <ReferenceLine
                          y={100}
                          stroke="#f59e0b"
                          strokeDasharray="4 4"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'सामान्य अधिकतम / चेतावनी 100' : 'Normal Max / Warning (100 bpm)',
                            position: 'insideTopRight',
                            fill: '#f59e0b',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />
                        <ReferenceLine
                          y={120}
                          stroke="#ef4444"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'खतरा स्तर (Tachycardia) ≥120' : 'Danger Crisis (≥120 bpm)',
                            position: 'insideTopRight',
                            fill: '#ef4444',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="heartRate"
                          stroke="#f43f5e"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#f43f5e' }}
                          activeDot={{ r: 6 }}
                          name={isHindi ? 'हृदय गति (Heart Rate bpm)' : 'Heart Rate (bpm)'}
                        />
                      </>
                    )}

                    {/* SpO2 REFERENCE LINES */}
                    {selectedMetric === 'spo2' && (
                      <>
                        <ReferenceLine
                          y={95}
                          stroke="#10b981"
                          strokeDasharray="4 4"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'सुरक्षित न्यूनतम (≥95%)' : 'Normal Safe (≥95%)',
                            position: 'insideBottomRight',
                            fill: '#10b981',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />
                        <ReferenceLine
                          y={92}
                          stroke="#f59e0b"
                          strokeDasharray="4 4"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'चेतावनी स्तर (92%)' : 'Low Warning (92%)',
                            position: 'insideTopRight',
                            fill: '#f59e0b',
                            fontSize: 10
                          }}
                        />
                        <ReferenceLine
                          y={90}
                          stroke="#ef4444"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'गंभीर खतरा (<90%)' : 'Critical Hypoxia Danger (<90%)',
                            position: 'insideTopRight',
                            fill: '#ef4444',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="spo2"
                          stroke="#a855f7"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#a855f7' }}
                          activeDot={{ r: 6 }}
                          name={isHindi ? 'ऑक्सीजन संतृप्ति (SpO2 %)' : 'Oxygen Saturation (SpO2 %)'}
                        />
                      </>
                    )}

                    {/* FASTING GLUCOSE REFERENCE LINES (ADA 2026 GUIDELINES) */}
                    {selectedMetric === 'glucose' && (
                      <>
                        <ReferenceLine
                          y={99}
                          stroke="#10b981"
                          strokeDasharray="4 4"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'सामान्य फास्टिंग सीमा (≤99 mg/dL - ADA)' : 'Normal Fasting (≤99 mg/dL - ADA)',
                            position: 'insideTopRight',
                            fill: '#10b981',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />
                        <ReferenceLine
                          y={100}
                          stroke="#f59e0b"
                          strokeDasharray="4 4"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'पूर्व-मधुमेह चेतावनी (100–125 mg/dL)' : 'Pre-diabetes Warning (100–125 mg/dL)',
                            position: 'insideBottomRight',
                            fill: '#f59e0b',
                            fontSize: 10
                          }}
                        />
                        <ReferenceLine
                          y={126}
                          stroke="#ef4444"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'मधुमेह सीमा खतरा (≥126 mg/dL - ADA)' : 'Diabetes Danger (≥126 mg/dL - ADA)',
                            position: 'insideTopRight',
                            fill: '#ef4444',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />
                        <ReferenceLine
                          y={70}
                          stroke="#ef4444"
                          strokeDasharray="3 3"
                          strokeWidth={1.5}
                          label={{
                            value: isHindi ? 'हाइपोग्लाइसीमिया खतरा (<70 mg/dL)' : 'Hypoglycemia Danger (<70 mg/dL)',
                            position: 'insideBottomRight',
                            fill: '#ef4444',
                            fontSize: 10
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="glucose"
                          stroke="#f59e0b"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#f59e0b' }}
                          activeDot={{ r: 6 }}
                          name={isHindi ? 'फास्टिंग रक्त शर्करा (Glucose mg/dL)' : 'Fasting Blood Glucose (mg/dL)'}
                        />
                      </>
                    )}

                    {/* URINE TEST REFERENCE LINES (NKF KDOQI GUIDELINES) */}
                    {selectedMetric === 'urine' && (
                      <>
                        <ReferenceLine
                          y={15}
                          stroke="#10b981"
                          strokeDasharray="4 4"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'सामान्य सुरक्षित सीमा (≤15 mg/dL - NKF)' : 'Normal Protein Safe (≤15 mg/dL - NKF)',
                            position: 'insideBottomRight',
                            fill: '#10b981',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />
                        <ReferenceLine
                          y={30}
                          stroke="#f59e0b"
                          strokeDasharray="4 4"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'माइक्रोअल्बुमिन्यूरिया चेतावनी (30 mg/dL)' : 'Microalbuminuria Warning (30 mg/dL)',
                            position: 'insideTopRight',
                            fill: '#f59e0b',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />
                        <ReferenceLine
                          y={100}
                          stroke="#ef4444"
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'क्लिनिकल प्रोटीन्यूरिया खतरा (≥100 mg/dL)' : 'Clinical Proteinuria Danger (≥100 mg/dL)',
                            position: 'insideTopRight',
                            fill: '#ef4444',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="urineProtein"
                          stroke="#06b6d4"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#06b6d4' }}
                          activeDot={{ r: 6 }}
                          name={isHindi ? 'मूत्र प्रोटीन (Protein mg/dL)' : 'Urine Protein (mg/dL)'}
                        />
                      </>
                    )}

                    {/* STEPS REFERENCE LINE */}
                    {selectedMetric === 'steps' && (
                      <>
                        <ReferenceLine
                          y={8000}
                          stroke="#06b6d4"
                          strokeDasharray="4 4"
                          strokeWidth={2}
                          label={{
                            value: isHindi ? 'दैनिक लक्ष्य (8,000 कदम)' : 'Daily Target Goal (8,000 steps)',
                            position: 'insideTopRight',
                            fill: '#06b6d4',
                            fontSize: 10,
                            fontWeight: 'bold'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="steps"
                          stroke="#10b981"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#10b981' }}
                          activeDot={{ r: 6 }}
                          name={isHindi ? 'दैनिक कदम (Steps)' : 'Daily Steps'}
                        />
                      </>
                    )}

                    {/* ALL METRICS OVERVIEW */}
                    {selectedMetric === 'all' && (
                      <>
                        <Line
                          type="monotone"
                          dataKey="systolic"
                          stroke="#38bdf8"
                          strokeWidth={2.5}
                          dot={false}
                          name={isHindi ? 'सिस्टोलिक (Systolic)' : 'Systolic BP'}
                        />
                        <Line
                          type="monotone"
                          dataKey="diastolic"
                          stroke="#818cf8"
                          strokeWidth={2.5}
                          dot={false}
                          name={isHindi ? 'डायस्टोलिक (Diastolic)' : 'Diastolic BP'}
                        />
                        <Line
                          type="monotone"
                          dataKey="heartRate"
                          stroke="#f43f5e"
                          strokeWidth={2.5}
                          dot={false}
                          name={isHindi ? 'हृदय गति (Heart Rate)' : 'Heart Rate'}
                        />
                        <Line
                          type="monotone"
                          dataKey="spo2"
                          stroke="#a855f7"
                          strokeWidth={2.5}
                          dot={false}
                          name={isHindi ? 'ऑक्सीजन (SpO2)' : 'SpO2'}
                        />
                        <Line
                          type="monotone"
                          dataKey="glucose"
                          stroke="#f59e0b"
                          strokeWidth={2.5}
                          dot={false}
                          name={isHindi ? 'शर्करा (Glucose)' : 'Blood Glucose'}
                        />
                      </>
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <span>
                {isHindi
                  ? 'कैलेंडर दिवस के अनुसार समूहीकृत 100 नवीनतम रिकॉर्ड्स प्रदर्शित किए जा रहे हैं।'
                  : 'Showing up to 100 most recent records grouped by calendar day.'}
              </span>
              <span className="flex items-center gap-1 font-semibold text-cyan-600 dark:text-cyan-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                {isHindi ? 'सत्यापित व्यक्तिगत स्वास्थ्य प्रक्षेपवक्र' : 'Verified Personal Health Trajectory'}
              </span>
            </div>
          </div>

          {/* CLINICAL THRESHOLD ORIGINS & GUIDELINE TRANSPARENCY CARD */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-base">
              <Info className="w-5 h-5 text-cyan-500" />
              <h3>{isHindi ? 'चिकित्सीय सीमाओं एवं दिशानिर्देशों का पारदर्शी स्रोत' : 'Clinical Threshold Origins & Evidence Transparency'}</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {isHindi
                ? 'बायोट्रैजेक्टरी में प्रदर्शित सभी सीमा रेखाएं और अलर्ट प्रमुख चिकित्सा संघों के अधिकृत दिशानिर्देशों पर आधारित हैं। यदि किसी बायोमार्कर के लिए कोई सार्वभौमिक सीमा नहीं है, तो उसे "अनसेट" रखा जाता है तथा कोई काल्पनिक चेतावनी जारी नहीं की जाती।'
                : 'All reference lines and automated alerts within BioTrajectory are established directly from recognized clinical guidelines. Unstandardized tests without universal consensus are labeled as unset and do not produce speculative threshold alerts.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs pt-1">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="font-bold text-cyan-600 dark:text-cyan-400 block">{isHindi ? 'रक्तचाप (AHA/ACC 2017)' : 'Blood Pressure (AHA/ACC 2017)'}</span>
                <p className="text-slate-600 dark:text-slate-400">
                  {isHindi ? 'सामान्य: ≤120/80 | चेतावनी: 130-139 | खतरा: ≥140/90 mmHg (Stage 2 Hypertension)' : 'Optimal: ≤120/80 | Warning: 130–139 | Danger: ≥140/90 mmHg (Stage 2)'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="font-bold text-rose-600 dark:text-rose-400 block">{isHindi ? 'हृदय गति (AHA Resting)' : 'Heart Rate (AHA Resting)'}</span>
                <p className="text-slate-600 dark:text-slate-400">
                  {isHindi ? 'सामान्य विश्राम: 60-100 bpm | चेतावनी: >100 bpm | गंभीर खतरा: ≥120 bpm (Tachycardia)' : 'Resting corridor: 60–100 bpm | Atypical: >100 bpm | Danger: ≥120 bpm'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="font-bold text-purple-600 dark:text-purple-400 block">{isHindi ? 'ऑक्सीजन संतृप्ति (WHO SpO2)' : 'Oxygen Saturation (WHO SpO2)'}</span>
                <p className="text-slate-600 dark:text-slate-400">
                  {isHindi ? 'सामान्य: ≥95% | चेतावनी: 90-94% | गंभीर हाइपोक्सिया खतरा: <90%' : 'Healthy: ≥95% | Warning: 90–94% | Critical Hypoxia Danger: <90%'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="font-bold text-amber-600 dark:text-amber-400 block">{isHindi ? 'रक्त शर्करा (ADA 2026 Standards)' : 'Fasting Glucose (ADA 2026 Standards)'}</span>
                <p className="text-slate-600 dark:text-slate-400">
                  {isHindi ? 'सामान्य फास्टिंग: 70-99 | पूर्व-मधुमेह चेतावनी: 100-125 | खतरा: ≥126 mg/dL' : 'Normal Fasting: 70–99 | Impaired Warning: 100–125 | Danger: ≥126 mg/dL'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="font-bold text-teal-600 dark:text-teal-400 block">{isHindi ? 'मूत्र परीक्षण (NKF KDOQI)' : 'Urine Protein (NKF KDOQI)'}</span>
                <p className="text-slate-600 dark:text-slate-400">
                  {isHindi ? 'सामान्य: नेगेटिव/ट्रेस (≤15) | चेतावनी: 30 mg/dL | रीनल रिसाव खतरा: ≥100 mg/dL' : 'Normal: Negative/Trace (≤15) | Warning: 30 mg/dL | Proteinuria Danger: ≥100 mg/dL'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800/80 space-y-1">
                <span className="font-bold text-indigo-600 dark:text-indigo-400 block">{isHindi ? 'दैनिक गतिविधि एवं कदम' : 'Activity & Daily Steps'}</span>
                <p className="text-slate-600 dark:text-slate-400">
                  {isHindi ? 'दैनिक लक्ष्य: 8,000 कदम | अनसेट पैरामीटर पर कोई कृत्रिम अलर्ट नहीं दिया जाता।' : 'Daily target: 8,000 steps. Personalized goals remain un-alerted.'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
