import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  ComposedChart,
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
  Info,
  Footprints,
  Sparkles,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { healthReadingService } from '../../services/healthReadingService';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

// Plain-language easy subtitles and guidance for each metric
const EASY_SUBS_CONFIG = {
  bp: {
    title: { en: 'Understanding Blood Pressure', hi: 'रक्तचाप (BP) समझें' },
    sub: {
      en: 'Tracks pumping pressure (systolic) and resting pressure (diastolic) in arteries.',
      hi: 'धमनियों में पंपिंग दबाव (सिस्टोलिक) और विश्राम दबाव (डायस्टोलिक) को मापता है।'
    },
    normal: { en: '<120/80 mmHg (Optimal resting level)', hi: '<120/80 mmHg (आदर्श विश्राम सीमा)' },
    warning: { en: '130–139 or 80–89 mmHg (Elevated — rest & re-test)', hi: '130–139 या 80–89 mmHg (बढ़ा हुआ — आराम कर पुनः मापें)' },
    danger: { en: '≥140/90 mmHg (Stage 2 — seek medical advice)', hi: '≥140/90 mmHg (गंभीर स्तर — डॉक्टर से परामर्श लें)' },
    tip: { en: 'Sit quietly for 5 minutes with uncrossed feet before taking a reading.', hi: 'रीडिंग लेने से पहले 5 मिनट शांत बैठें और पैर सीधे रखें।' }
  },
  hr: {
    title: { en: 'Understanding Resting Heart Rate', hi: 'विश्राम हृदय गति (HR) समझें' },
    sub: {
      en: 'Heartbeats per minute (bpm) while relaxed and stationary.',
      hi: 'विश्राम अवस्था में प्रति मिनट दिल की धड़कनों की संख्या (bpm)।'
    },
    normal: { en: '60–100 bpm (Healthy resting corridor)', hi: '60–100 bpm (स्वस्थ विश्राम दायरा)' },
    warning: { en: '>100 bpm (Elevated from stress, caffeine, or dehydration)', hi: '>100 bpm (तनाव, कैफीन या पानी की कमी से बढ़ी हुई)' },
    danger: { en: '≥120 bpm (Sustained tachycardia — clinical review recommended)', hi: '≥120 bpm (लगातार उच्च धड़कन — चिकित्सीय जांच आवश्यक)' },
    tip: { en: 'Slow deep breaths and adequate hydration help normalize pulse.', hi: 'धीमी गहरी सांसें और पर्याप्त पानी पल्स को सामान्य करने में मदद करते हैं।' }
  },
  spo2: {
    title: { en: 'Understanding Blood Oxygen (SpO2)', hi: 'रक्त ऑक्सीजन (SpO2) समझें' },
    sub: {
      en: 'Percentage of oxygen carrying hemoglobin circulating in your bloodstream.',
      hi: 'रक्त में ऑक्सीजन ले जाने वाले हीमोग्लोबिन का प्रतिशत।'
    },
    normal: { en: '95%–100% (Optimal tissue oxygenation)', hi: '95%–100% (उत्कृष्ट ऑक्सीजन स्तर)' },
    warning: { en: '90%–94% (Mild hypoxia — sit upright and breathe deeply)', hi: '90%–94% (हल्की कमी — सीधे बैठकर गहरी सांसें लें)' },
    danger: { en: '<90% (Critical hypoxia — requires urgent attention)', hi: '<90% (गंभीर खतरा — तत्काल चिकित्सीय सहायता लें)' },
    tip: { en: 'Ensure finger is warm and pulse oximeter sensor is clean.', hi: 'सटीक ऑक्सीमीटर रीडिंग के लिए उंगली गर्म और साफ रखें।' }
  },
  glucose: {
    title: { en: 'Understanding Blood Glucose', hi: 'रक्त शर्करा (ग्लूकोज) समझें' },
    sub: {
      en: 'Fasting blood sugar measured after 8 hours without food intake.',
      hi: '8 घंटे खाली पेट रहने के बाद मापा गया रक्त शर्करा स्तर।'
    },
    normal: { en: '70–99 mg/dL (Normal fasting metabolic range)', hi: '70–99 mg/dL (सामान्य फास्टिंग स्तर)' },
    warning: { en: '100–125 mg/dL (Pre-diabetes / impaired fasting)', hi: '100–125 mg/dL (पूर्व-मधुमेह चेतावनी सीमा)' },
    danger: { en: '≥126 mg/dL or <70 mg/dL (Diabetes threshold or low sugar)', hi: '≥126 mg/dL या <70 mg/dL (मधुमेह सीमा या कम शर्करा)' },
    tip: { en: 'A 15-minute gentle stroll after eating helps stabilize glucose.', hi: 'भोजन के बाद 15 मिनट टहलना ग्लूकोज को स्थिर रखने में मदद करता है।' }
  },
  urine: {
    title: { en: 'Understanding Urine Protein & Kidney Health', hi: 'मूत्र प्रोटीन एवं गुर्दा स्वास्थ्य समझें' },
    sub: {
      en: 'Measures kidney filtration efficiency and retention of essential proteins.',
      hi: 'गुर्दे की फिल्टर क्षमता और आवश्यक प्रोटीन के ठहराव को मापता है।'
    },
    normal: { en: 'Negative / Trace (<15 mg/dL — healthy kidneys)', hi: 'नेगेटिव / ट्रेस (<15 mg/dL — स्वस्थ गुर्दे)' },
    warning: { en: '30 mg/dL (Microalbuminuria — recheck after hydrating)', hi: '30 mg/dL (माइक्रोअल्बुमिन्यूरिया — पानी पीकर पुनः जांचें)' },
    danger: { en: '≥100 mg/dL (Clinical proteinuria — consult doctor if persistent)', hi: '≥100 mg/dL (प्रोटीन रिसाव — बने रहने पर डॉक्टर से परामर्श करें)' },
    tip: { en: 'Drink 2 to 2.5 liters of water daily to support kidney function.', hi: 'गुर्दों के स्वस्थ कार्य के लिए रोजाना 2 से 2.5 लीटर पानी पिएं।' }
  },
  steps: {
    title: { en: 'Understanding Daily Steps & Walking', hi: 'दैनिक कदम एवं शारीरिक सक्रियता समझें' },
    sub: {
      en: 'Daily walking distance building cardiovascular and metabolic resilience.',
      hi: 'हृदय और चयापचय को स्वस्थ रखने के लिए दैनिक पैदल चलना।'
    },
    normal: { en: '≥8,000 steps/day (Target daily active goal)', hi: '≥8,000 कदम/दिन (आदर्श दैनिक लक्ष्य)' },
    warning: { en: '4,000–7,999 steps/day (Moderate activity corridor)', hi: '4,000–7,999 कदम/दिन (मध्यम सक्रियता सीमा)' },
    danger: { en: '<3,000 steps/day (Sedentary — prolonged stillness)', hi: '<3,000 कदम/दिन (निष्क्रिय — लंबे समय बैठना)' },
    tip: { en: 'Take a quick 3-minute stroll or stretch every hour of sitting.', hi: 'हर घंटे 3 मिनट का छोटा ब्रेक लेकर टहलें या खिंचाव करें।' }
  },
  all: {
    title: { en: 'Understanding Multi-Vital Trajectory', hi: 'समग्र स्वास्थ्य रुझान समझें' },
    sub: {
      en: 'Synchronized view of circulatory, pulmonary, and metabolic biomarkers.',
      hi: 'रक्तचाप, दिल की धड़कन, ऑक्सीजन और शर्करा का संयुक्त रुझान।'
    },
    normal: { en: 'All monitored biomarkers within certified clinical ranges.', hi: 'सभी बायोमार्कर अपने प्रमाणित सामान्य स्तर पर हैं।' },
    warning: { en: 'Amber markers indicate readings approaching upper limits.', hi: 'पीले रंग के मार्कर चेतावनी सीमा के करीब मान दर्शाते हैं।' },
    danger: { en: 'Red points indicate sustained clinical threshold elevation.', hi: 'लाल बिंदु गंभीर नैदानिक सीमा पार करने का संकेत देते हैं।' },
    tip: { en: 'Consistent logging creates clear longitudinal trends for your doctor.', hi: 'नियमित रिकॉर्डिंग आपके डॉक्टर को सटीक निर्णय लेने में मदद करती है।' }
  }
};

const DAY_MS = 24 * 60 * 60 * 1000;
const MAX_READINGS = 1000;

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

  return [...dailyMap.values()];
};

export default function HealthAnalyticsPage() {
  const { currentUser } = useAuth();
  const { t, isHindi } = useLanguage();

  const uid = currentUser?.uid;

  const [readings, setReadings] = useState([]);
  const [timeRange, setTimeRange] = useState('30D');
  const [selectedMetric, setSelectedMetric] = useState('bp'); // 'bp', 'hr', 'spo2', 'steps', 'all'
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function fetchReadings() {
      if (!uid) {
        setReadings([]);
        setError('');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const result = await healthReadingService.list(uid, MAX_READINGS);

        if (!ignore) {
          setReadings(Array.isArray(result) ? result : []);
        }
      } catch (loadError) {
        if (!ignore) {
          console.error('Analytics load failed:', loadError);
          setError(loadError.message || 'Unable to load your health analytics.');
          setReadings([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchReadings();

    return () => {
      ignore = true;
    };
  }, [uid]);

  // Filter readings by selected calendar range (7D, 30D, 90D, or All)
  const filteredReadings = useMemo(() => {
    if (!readings.length) return [];
    if (timeRange === 'All') return readings;

    const daysCount = timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : timeRange === '90D' ? 90 : null;
    if (!daysCount) return readings;

    const validDates = readings
      .map((r) => toDate(r.measuredAt)?.getTime())
      .filter(Number.isFinite);

    if (!validDates.length) return [];

    const latestMs = Math.max(...validDates);
    const latestDate = new Date(latestMs);
    // Align to the start of the latest calendar day (00:00:00)
    const startOfLatestDay = new Date(
      latestDate.getFullYear(),
      latestDate.getMonth(),
      latestDate.getDate()
    ).getTime();

    // Include (daysCount - 1) prior full calendar days
    const cutoff = startOfLatestDay - ((daysCount - 1) * DAY_MS);

    return readings.filter((r) => {
      const date = toDate(r.measuredAt);
      return date && date.getTime() >= cutoff;
    });
  }, [readings, timeRange]);

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

  const handleRefresh = async () => {
    if (!uid) {
      setReadings([]);
      setError('');
      return;
    }

    setIsRefreshing(true);
    setError('');

    try {
      const result = await healthReadingService.list(uid, MAX_READINGS);
      setReadings(Array.isArray(result) ? result : []);
    } catch (loadError) {
      console.error('Analytics load failed:', loadError);
      setError(loadError.message || 'Unable to load your health analytics.');
    } finally {
      setIsRefreshing(false);
    }
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
        <div className="flex items-center">
          <div className="flex items-center gap-1 p-1 rounded-2xl border border-[#E8DFD1] dark:border-[#4A3525] bg-[#F6F0E4]/60 dark:bg-[#2B1E15] shadow-xs">
            {[
              { id: '7D', label: isHindi ? '7 दिन' : '7D' },
              { id: '30D', label: isHindi ? '30 दिन' : '30D' },
              { id: '90D', label: isHindi ? '90 दिन' : '90D' },
              { id: 'All', label: isHindi ? 'सभी' : 'All' }
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setTimeRange(id)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  timeRange === id
                    ? 'bg-[#A9D6F5] text-[#1F150E] dark:bg-[#A9D6F5] dark:text-[#1F150E] shadow-sm font-extrabold ring-1 ring-[#A9D6F5]/50'
                    : 'text-[#6B4F3A] dark:text-[#D5BF86] hover:bg-white/60 dark:hover:bg-[#3D2B1E]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

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
                <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {t('analytics.latestBP', {}, 'Latest BP')}
                </p>
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Activity className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {
                  latestSummary.blood_pressure?.values?.systolic != null &&
                  latestSummary.blood_pressure?.values?.diastolic != null
                    ? `${latestSummary.blood_pressure.values.systolic}/${latestSummary.blood_pressure.values.diastolic}`
                    : '—'
                }
                <span className="text-sm font-medium text-slate-500 ml-1.5">mmHg</span>
              </p>
              <div className="mt-2 flex items-center justify-between text-xs sm:text-sm font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {isHindi ? 'नवीनतम दर्ज माप' : 'Latest recorded value'}
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
                <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {t('analytics.latestHR', {}, 'Latest Heart Rate')}
                </p>
                <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  <Heart className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {
                  latestSummary.heart_rate?.values?.bpm != null
                    ? latestSummary.heart_rate.values.bpm
                    : '—'
                }
                <span className="text-sm font-medium text-slate-500 ml-1.5">bpm</span>
              </p>
              <div className="mt-2 flex items-center justify-between text-xs sm:text-sm font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {isHindi ? 'नवीनतम दर्ज माप' : 'Latest recorded value'}
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
                <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {t('analytics.latestSpO2', {}, 'Latest SpO2')}
                </p>
                <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Droplet className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {
                  latestSummary.oxygen_saturation?.values?.spo2 != null
                    ? latestSummary.oxygen_saturation.values.spo2
                    : '—'
                }
                <span className="text-sm font-medium text-slate-500 ml-1.5">%</span>
              </p>
              <div className="mt-2 flex items-center justify-between text-xs sm:text-sm font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {isHindi ? 'नवीनतम दर्ज माप' : 'Latest recorded value'}
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
                <p className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                  {t('analytics.latestSteps', {}, 'Daily Steps')}
                </p>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {
                  latestSummary.activity?.values?.steps != null
                    ? Number(latestSummary.activity.values.steps).toLocaleString()
                    : '—'
                }
                <span className="text-sm font-medium text-slate-500 ml-1.5">{isHindi ? 'कदम' : 'steps'}</span>
              </p>
              <div className="mt-2 flex items-center justify-between text-xs sm:text-sm font-semibold">
                <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4" />
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
                    className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
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
                  disabled={loading || isRefreshing}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer ml-1 active:scale-95 transition-all disabled:opacity-60"
                  title={isHindi ? 'आंकड़े पुनः लोड करें' : 'Refresh analytics'}
                >
                  <RefreshCw className={`w-4 h-4 ${isRefreshing || loading ? 'animate-spin text-cyan-500' : ''}`} />
                  <span>{isRefreshing ? (isHindi ? 'रीफ्रेश...' : 'Refreshing...') : t('analytics.refresh', {}, 'Refresh')}</span>
                </button>
              </div>
            </div>

            {/* Threshold Legend Bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E]/80 border border-[#E8DFD1] dark:border-[#4A3525]">
              <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs">
                {isHindi ? 'संदर्भ रेखाएं:' : 'Reference Guide:'}
              </span>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <span className="w-3.5 h-1 bg-emerald-500 rounded-full" />
                <span>{isHindi ? 'सामान्य सुरक्षित रेखा (Normal Limit)' : 'Normal Safe Limit'}</span>
              </div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <span className="w-3.5 h-1 bg-amber-500 rounded-full border-dashed" />
                <span>{isHindi ? 'चेतावनी स्तर (Warning Threshold)' : 'Warning Elevation Threshold'}</span>
              </div>
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                <span className="w-3.5 h-1 bg-rose-500 rounded-full" />
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
              <div className="w-full h-84">
                <ResponsiveContainer width="100%" height="100%">
                  {/* 1. DAILY STEPS -> BARCHART */}
                  {selectedMetric === 'steps' ? (
                    <BarChart data={chartData} margin={{ top: 16, right: 24, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                      <XAxis dataKey="date" minTickGap={20} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <YAxis domain={[0, 15000]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1F150E', borderRadius: 12, border: '1px solid #4A3525', color: '#F6F0E4' }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
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
                      <Bar dataKey="steps" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={timeRange === '7D' ? 36 : timeRange === '30D' ? 14 : 7} name={isHindi ? 'दैनिक कदम (Steps)' : 'Daily Walking Steps'} />
                    </BarChart>
                  ) : selectedMetric === 'hr' ? (
                    /* 2. HEART RATE -> AREACHART WITH GRADIENT */
                    <AreaChart data={chartData} margin={{ top: 16, right: 24, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                      <XAxis dataKey="date" minTickGap={20} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <YAxis domain={[40, 140]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1F150E', borderRadius: 12, border: '1px solid #4A3525', color: '#F6F0E4' }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <ReferenceLine y={60} stroke="#10b981" strokeDasharray="4 4" strokeWidth={2} label={{ value: isHindi ? 'सामान्य 60 bpm' : 'Normal Min (60 bpm)', position: 'insideBottomRight', fill: '#10b981', fontSize: 10 }} />
                      <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={2} label={{ value: isHindi ? 'चेतावनी 100 bpm' : 'Warning Max (100 bpm)', position: 'insideTopRight', fill: '#f59e0b', fontSize: 10, fontWeight: 'bold' }} />
                      <ReferenceLine y={120} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} label={{ value: isHindi ? 'खतरा ≥120 bpm' : 'Danger Crisis (≥120 bpm)', position: 'insideTopRight', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                      <Area type="monotone" dataKey="heartRate" stroke="#f43f5e" strokeWidth={3} fill="url(#hrGradient)" dot={chartData.length <= 14 ? { r: 4, fill: '#f43f5e' } : chartData.length <= 35 ? { r: 2.5, fill: '#f43f5e' } : false} activeDot={{ r: 6 }} name={isHindi ? 'हृदय गति (Heart Rate bpm)' : 'Heart Rate (bpm)'} />
                    </AreaChart>
                  ) : selectedMetric === 'spo2' ? (
                    /* 3. SpO2 -> AREACHART WITH GRADIENT */
                    <AreaChart data={chartData} margin={{ top: 16, right: 24, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="spo2Gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a855f7" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                      <XAxis dataKey="date" minTickGap={20} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <YAxis domain={[85, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1F150E', borderRadius: 12, border: '1px solid #4A3525', color: '#F6F0E4' }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <ReferenceLine y={95} stroke="#10b981" strokeDasharray="4 4" strokeWidth={2} label={{ value: isHindi ? 'सुरक्षित ≥95%' : 'Optimal (≥95%)', position: 'insideBottomRight', fill: '#10b981', fontSize: 10, fontWeight: 'bold' }} />
                      <ReferenceLine y={92} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={2} label={{ value: isHindi ? 'चेतावनी 92%' : 'Warning (92%)', position: 'insideTopRight', fill: '#f59e0b', fontSize: 10 }} />
                      <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} label={{ value: isHindi ? 'गंभीर खतरा <90%' : 'Severe Hypoxia (<90%)', position: 'insideTopRight', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                      <Area type="monotone" dataKey="spo2" stroke="#a855f7" strokeWidth={3} fill="url(#spo2Gradient)" dot={chartData.length <= 14 ? { r: 4, fill: '#a855f7' } : chartData.length <= 35 ? { r: 2.5, fill: '#a855f7' } : false} activeDot={{ r: 6 }} name={isHindi ? 'ऑक्सीजन संतृप्ति (SpO2 %)' : 'Oxygen Saturation (SpO2 %)'} />
                    </AreaChart>
                  ) : selectedMetric === 'glucose' ? (
                    /* 4. GLUCOSE -> AREACHART WITH AMBER GRADIENT */
                    <AreaChart data={chartData} margin={{ top: 16, right: 24, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                      <XAxis dataKey="date" minTickGap={20} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <YAxis domain={[50, 180]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1F150E', borderRadius: 12, border: '1px solid #4A3525', color: '#F6F0E4' }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <ReferenceLine y={99} stroke="#10b981" strokeDasharray="4 4" strokeWidth={2} label={{ value: isHindi ? 'सामान्य ≤99 mg/dL' : 'Normal Fasting (≤99)', position: 'insideTopRight', fill: '#10b981', fontSize: 10, fontWeight: 'bold' }} />
                      <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={2} label={{ value: isHindi ? 'पूर्व-मधुमेह 100–125' : 'Pre-diabetes (100–125)', position: 'insideBottomRight', fill: '#f59e0b', fontSize: 10 }} />
                      <ReferenceLine y={126} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} label={{ value: isHindi ? 'मधुमेह सीमा ≥126' : 'Diabetes Danger (≥126)', position: 'insideTopRight', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                      <Area type="monotone" dataKey="glucose" stroke="#f59e0b" strokeWidth={3} fill="url(#glucoseGradient)" dot={chartData.length <= 14 ? { r: 4, fill: '#f59e0b' } : chartData.length <= 35 ? { r: 2.5, fill: '#f59e0b' } : false} activeDot={{ r: 6 }} name={isHindi ? 'फास्टिंग रक्त शर्करा (mg/dL)' : 'Fasting Blood Glucose (mg/dL)'} />
                    </AreaChart>
                  ) : selectedMetric === 'urine' ? (
                    /* 5. URINE -> BARCHART FOR PROTEIN CONCENTRATION */
                    <BarChart data={chartData} margin={{ top: 16, right: 24, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                      <XAxis dataKey="date" minTickGap={20} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <YAxis domain={[0, 150]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1F150E', borderRadius: 12, border: '1px solid #4A3525', color: '#F6F0E4' }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <ReferenceLine y={15} stroke="#10b981" strokeDasharray="4 4" strokeWidth={2} label={{ value: isHindi ? 'सामान्य सुरक्षित ≤15' : 'Normal Safe (≤15 mg/dL)', position: 'insideBottomRight', fill: '#10b981', fontSize: 10, fontWeight: 'bold' }} />
                      <ReferenceLine y={30} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={2} label={{ value: isHindi ? 'चेतावनी 30 mg/dL' : 'Microalbuminuria (30 mg/dL)', position: 'insideTopRight', fill: '#f59e0b', fontSize: 10, fontWeight: 'bold' }} />
                      <ReferenceLine y={100} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} label={{ value: isHindi ? 'प्रोटीन्यूरिया खतरा ≥100' : 'Proteinuria Danger (≥100 mg/dL)', position: 'insideTopRight', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                      <Bar dataKey="urineProtein" fill="#06b6d4" radius={[6, 6, 0, 0]} maxBarSize={timeRange === '7D' ? 36 : timeRange === '30D' ? 14 : 7} name={isHindi ? 'मूत्र प्रोटीन (Protein mg/dL)' : 'Urine Protein (mg/dL)'} />
                    </BarChart>
                  ) : selectedMetric === 'all' ? (
                    /* 6. OVERVIEW COMPARISON -> COMPOSED CHART */
                    <ComposedChart data={chartData} margin={{ top: 16, right: 24, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                      <XAxis dataKey="date" minTickGap={20} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <YAxis domain={[50, 160]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1F150E', borderRadius: 12, border: '1px solid #4A3525', color: '#F6F0E4' }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="systolic" stroke="#38bdf8" strokeWidth={2.5} dot={false} name={isHindi ? 'सिस्टोलिक BP' : 'Systolic BP'} />
                      <Line type="monotone" dataKey="diastolic" stroke="#818cf8" strokeWidth={2.5} dot={false} name={isHindi ? 'डायस्टोलिक BP' : 'Diastolic BP'} />
                      <Line type="monotone" dataKey="heartRate" stroke="#f43f5e" strokeWidth={2.5} dot={false} name={isHindi ? 'हृदय गति' : 'Heart Rate'} />
                      <Line type="monotone" dataKey="spo2" stroke="#a855f7" strokeWidth={2.5} dot={false} name={isHindi ? 'ऑक्सीजन (SpO2)' : 'SpO2'} />
                      <Line type="monotone" dataKey="glucose" stroke="#f59e0b" strokeWidth={2.5} dot={false} name={isHindi ? 'शर्करा' : 'Blood Glucose'} />
                    </ComposedChart>
                  ) : (
                    /* 7. BLOOD PRESSURE -> DUAL LINE CHART */
                    <LineChart data={chartData} margin={{ top: 16, right: 24, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
                      <XAxis dataKey="date" minTickGap={20} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <YAxis domain={[60, 160]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#94A3B8' }} />
                      <Tooltip contentStyle={{ backgroundColor: '#1F150E', borderRadius: 12, border: '1px solid #4A3525', color: '#F6F0E4' }} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <ReferenceLine y={120} stroke="#10b981" strokeDasharray="4 4" strokeWidth={2} label={{ value: isHindi ? 'सामान्य सिस्टोलिक ≤120' : 'Normal Limit (≤120)', position: 'insideTopRight', fill: '#10b981', fontSize: 10, fontWeight: 'bold' }} />
                      <ReferenceLine y={130} stroke="#f59e0b" strokeDasharray="4 4" strokeWidth={2} label={{ value: isHindi ? 'चेतावनी स्तर 130' : 'Warning Level (130)', position: 'insideTopRight', fill: '#f59e0b', fontSize: 10, fontWeight: 'bold' }} />
                      <ReferenceLine y={140} stroke="#ef4444" strokeDasharray="5 5" strokeWidth={2} label={{ value: isHindi ? 'खतरा स्तर (Stage 2) ≥140' : 'Danger Crisis (≥140)', position: 'insideTopRight', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                      <ReferenceLine y={80} stroke="#06b6d4" strokeDasharray="3 3" strokeWidth={1.5} label={{ value: isHindi ? 'सामान्य डायस्टोलिक ≤80' : 'Normal Diastolic (≤80)', position: 'insideBottomRight', fill: '#06b6d4', fontSize: 10 }} />
                      <Line type="monotone" dataKey="systolic" stroke="#38bdf8" strokeWidth={3} dot={chartData.length <= 14 ? { r: 4, fill: '#38bdf8' } : chartData.length <= 35 ? { r: 2.5, fill: '#38bdf8' } : false} activeDot={{ r: 6 }} name={isHindi ? 'सिस्टोलिक (Systolic)' : 'Systolic BP (mmHg)'} />
                      <Line type="monotone" dataKey="diastolic" stroke="#818cf8" strokeWidth={2.5} dot={chartData.length <= 14 ? { r: 4, fill: '#818cf8' } : chartData.length <= 35 ? { r: 2.5, fill: '#818cf8' } : false} activeDot={{ r: 6 }} name={isHindi ? 'डायस्टोलिक (Diastolic)' : 'Diastolic BP (mmHg)'} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}

            {/* EASY SUBS CARD: FRIENDLY PLAIN LANGUAGE EXPLANATION */}
            {(() => {
              const subConfig = EASY_SUBS_CONFIG[selectedMetric] || EASY_SUBS_CONFIG.bp;
              return (
                <div className="p-5 sm:p-6 rounded-3xl bg-[#F6F0E4]/60 dark:bg-[#1F150E]/80 border border-[#E8DFD1] dark:border-[#4A3525] space-y-3.5 shadow-xs">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-[#2672A8] dark:text-[#A9D6F5]" />
                    <h3 className="font-extrabold text-lg sm:text-xl text-[#1F150E] dark:text-white">
                      {isHindi ? subConfig.title.hi : subConfig.title.en}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base font-medium text-[#6B4F3A] dark:text-[#D5BF86] leading-relaxed">
                    {isHindi ? subConfig.sub.hi : subConfig.sub.en}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-2">
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-100 text-xs sm:text-sm font-medium">
                      <strong className="block text-emerald-700 dark:text-emerald-300 font-bold text-sm sm:text-base mb-1">
                        ✓ {isHindi ? 'सामान्य सुरक्षित' : 'Normal & Safe'}
                      </strong>
                      {isHindi ? subConfig.normal.hi : subConfig.normal.en}
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-950 dark:text-amber-100 text-xs sm:text-sm font-medium">
                      <strong className="block text-amber-700 dark:text-amber-300 font-bold text-sm sm:text-base mb-1">
                        ⚠ {isHindi ? 'चेतावनी स्तर' : 'Warning Level'}
                      </strong>
                      {isHindi ? subConfig.warning.hi : subConfig.warning.en}
                    </div>

                    <div className="p-3.5 sm:p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-950 dark:text-rose-100 text-xs sm:text-sm font-medium">
                      <strong className="block text-rose-700 dark:text-rose-300 font-bold text-sm sm:text-base mb-1">
                        ✕ {isHindi ? 'खतरा स्तर' : 'Danger Level'}
                      </strong>
                      {isHindi ? subConfig.danger.hi : subConfig.danger.en}
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#A9D6F5]/20 border border-[#A9D6F5]/40 text-xs sm:text-sm font-medium text-[#1F150E] dark:text-[#F6F0E4] flex items-center gap-2.5">
                    <HelpCircle className="w-5 h-5 text-[#2672A8] dark:text-[#A9D6F5] shrink-0" />
                    <span>
                      <strong className="font-bold">{isHindi ? 'स्वास्थ्य टिप: ' : 'Health Tip: '}</strong>
                      {isHindi ? subConfig.tip.hi : subConfig.tip.en}
                    </span>
                  </div>
                </div>
              );
            })()}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#E8DFD1] dark:border-[#4A3525] text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <span>
                {isHindi
                  ? `कैलेंडर दिवस के अनुसार समूहीकृत ${chartData.length} दैनिक रिकॉर्ड्स प्रदर्शित किए जा रहे हैं (${timeRange === 'All' ? 'समग्र इतिहास' : timeRange})।`
                  : `Showing ${chartData.length} daily entries for ${timeRange === 'All' ? 'all recorded history' : timeRange}.`}
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-cyan-600 dark:text-cyan-400">
                <ShieldCheck className="w-4 h-4" />
                {isHindi ? 'सत्यापित व्यक्तिगत स्वास्थ्य प्रक्षेपवक्र' : 'Verified Personal Health Trajectory'}
              </span>
            </div>
          </div>

          {/* CLINICAL THRESHOLD ORIGINS & GUIDELINE TRANSPARENCY CARD */}
          <div className="rounded-3xl border border-[#E8DFD1] dark:border-[#4A3525] bg-white dark:bg-[#1F150E]/90 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg sm:text-xl">
              <Info className="w-5 h-5 text-[#2672A8] dark:text-[#A9D6F5]" />
              <h3>{isHindi ? 'चिकित्सीय सीमाओं एवं दिशानिर्देशों का पारदर्शी स्रोत' : 'Clinical Threshold Origins & Evidence Transparency'}</h3>
            </div>
            <p className="text-sm sm:text-base font-medium text-[#6B4F3A]/80 dark:text-[#D5BF86]/90 leading-relaxed">
              {isHindi
                ? 'सभी सीमा रेखाएं प्रमाणित नैदानिक दिशानिर्देशों (AHA, ACC, ADA, WHO) पर आधारित हैं। झूठी चेतावनियों से बचने के लिए असत्यापित परीक्षणों पर काल्पनिक अलर्ट जारी नहीं किए जाते हैं।'
                : 'All reference lines follow certified clinical guidelines (AHA, ACC, ADA, WHO). Biomarkers without universal clinical consensus remain un-alerted to prevent false alarms.'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
              <div className="p-4 rounded-2xl bg-[#F6F0E4]/70 dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] space-y-1">
                <span className="font-bold text-sm sm:text-base text-cyan-700 dark:text-cyan-400 block">{isHindi ? 'रक्तचाप (AHA/ACC)' : 'Blood Pressure (AHA/ACC)'}</span>
                <p className="text-xs sm:text-sm font-medium text-[#1F150E]/80 dark:text-[#F6F0E4]/80">
                  {isHindi ? 'सामान्य: ≤120/80 | चेतावनी: 130–139 | खतरा: ≥140/90 mmHg' : 'Optimal: ≤120/80 | Warning: 130–139 | Danger: ≥140/90 mmHg'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F6F0E4]/70 dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] space-y-1">
                <span className="font-bold text-sm sm:text-base text-rose-700 dark:text-rose-400 block">{isHindi ? 'हृदय गति (AHA Resting)' : 'Heart Rate (AHA Resting)'}</span>
                <p className="text-xs sm:text-sm font-medium text-[#1F150E]/80 dark:text-[#F6F0E4]/80">
                  {isHindi ? 'सामान्य विश्राम: 60–100 | चेतावनी: >100 | खतरा: ≥120 bpm' : 'Resting: 60–100 bpm | Elevated: >100 | Danger: ≥120 bpm'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F6F0E4]/70 dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] space-y-1">
                <span className="font-bold text-sm sm:text-base text-purple-700 dark:text-purple-400 block">{isHindi ? 'ऑक्सीजन संतृप्ति (WHO SpO2)' : 'Oxygen Saturation (WHO SpO2)'}</span>
                <p className="text-xs sm:text-sm font-medium text-[#1F150E]/80 dark:text-[#F6F0E4]/80">
                  {isHindi ? 'सामान्य: ≥95% | चेतावनी: 90–94% | हाइपोक्सिया खतरा: <90%' : 'Healthy: ≥95% | Warning: 90–94% | Hypoxia Danger: <90%'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F6F0E4]/70 dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] space-y-1">
                <span className="font-bold text-sm sm:text-base text-amber-700 dark:text-amber-400 block">{isHindi ? 'रक्त शर्करा (ADA Standards)' : 'Fasting Glucose (ADA Standards)'}</span>
                <p className="text-xs sm:text-sm font-medium text-[#1F150E]/80 dark:text-[#F6F0E4]/80">
                  {isHindi ? 'फास्टिंग सामान्य: 70–99 | पूर्व-मधुमेह: 100–125 | खतरा: ≥126 mg/dL' : 'Fasting: 70–99 | Pre-diabetes: 100–125 | Danger: ≥126 mg/dL'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F6F0E4]/70 dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] space-y-1">
                <span className="font-bold text-teal-700 dark:text-teal-400 block">{isHindi ? 'मूत्र परीक्षण (NKF KDOQI)' : 'Urine Protein (NKF KDOQI)'}</span>
                <p className="text-xs sm:text-sm font-medium text-[#1F150E]/80 dark:text-[#F6F0E4]/80">
                  {isHindi ? 'सामान्य: ≤15 | माइक्रोअल्बुमिन: 30 | प्रोटीन्यूरिया खतरा: ≥100 mg/dL' : 'Normal: ≤15 | Warning: 30 mg/dL | Proteinuria Danger: ≥100 mg/dL'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F6F0E4]/70 dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] space-y-1">
                <span className="font-bold text-sky-700 dark:text-sky-400 block">{isHindi ? 'दैनिक गतिविधि एवं कदम' : 'Activity & Daily Steps'}</span>
                <p className="text-xs sm:text-sm font-medium text-[#1F150E]/80 dark:text-[#F6F0E4]/80">
                  {isHindi ? 'दैनिक लक्ष्य: 8,000 कदम | अनसेट लक्ष्य पर कोई काल्पनिक चेतावनी नहीं।' : 'Target: 8,000 steps/day | Custom goals without false alarms.'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}