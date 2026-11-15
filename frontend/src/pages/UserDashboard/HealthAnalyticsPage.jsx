
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
  CartesianGrid
} from 'recharts';

import {
  BarChart2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
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

// Build chart data exclusively from actual Firestore readings.
const buildChartData = (readings) => {
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
        date: date.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short'
        }),
        systolic: null,
        diastolic: null,
        heartRate: null,
        spo2: null,
        steps: null
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

      default:
        break;
    }
  });

  return [...dailyMap.values()].slice(-30);
};

export default function HealthAnalyticsPage() {
  const { currentUser } = useAuth();

  const uid = currentUser?.uid;

  const [readings, setReadings] = useState([]);
  const [timeRange, setTimeRange] = useState('30D');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch actual patient measurements from Firestore.
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
      // Service accepts a maximum of 100 records.
      const result = await healthReadingService.list(
        uid,
        MAX_READINGS
      );

      setReadings(Array.isArray(result) ? result : []);
    } catch (loadError) {
      console.error('Analytics load failed:', loadError);

      setError(
        loadError.message ||
        'Unable to load your health analytics.'
      );

      setReadings([]);
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    let active = true;

    const fetchReadings = async () => {
      if (!uid) {
        setReadings([]);
        setLoading(false);
        setError('');
        return;
      }

      setLoading(true);
      setError('');

      try {
        const result = await healthReadingService.list(
          uid,
          MAX_READINGS
        );

        if (active) {
          setReadings(Array.isArray(result) ? result : []);
        }
      } catch (loadError) {
        console.error('Analytics load failed:', loadError);

        if (active) {
          setError(
            loadError.message ||
            'Unable to load your health analytics.'
          );

          setReadings([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchReadings();

    return () => {
      active = false;
    };
  }, [uid, refreshKey]);

  // Determine selected time range.
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

  // Filter real Firestore readings.
  const filteredReadings = useMemo(() => {
    if (!readings.length) return [];

    const validDates = readings
      .map((reading) => toDate(reading.measuredAt)?.getTime())
      .filter(Number.isFinite);

    if (!validDates.length) return [];

    const latest = Math.max(...validDates);

    const cutoff = rangeMs === Number.MAX_SAFE_INTEGER
      ? Number.NEGATIVE_INFINITY
      : latest - rangeMs;

    return readings.filter((reading) => {
      const date = toDate(reading.measuredAt);

      return date && date.getTime() >= cutoff;
    });
  }, [readings, rangeMs]);

  // Generate chart points.
  const chartData = useMemo(
    () => buildChartData(filteredReadings),
    [filteredReadings]
  );

  // Find latest actual reading of each type.
  const latestSummary = useMemo(() => {
    const latestByType = {};

    const sorted = [...readings].sort((a, b) => {
      const left = toDate(a.measuredAt)?.getTime() || 0;
      const right = toDate(b.measuredAt)?.getTime() || 0;

      return right - left;
    });

    for (const reading of sorted) {
      if (!latestByType[reading.type]) {
        latestByType[reading.type] = reading;
      }
    }

    return latestByType;
  }, [readings]);

  const handleRefresh = () => {
    setRefreshKey((previous) => previous + 1);
  };

  const hasReadings = readings.length > 0;
  const hasFilteredReadings = filteredReadings.length > 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">

      <DisclaimerBanner />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Health analytics
          </h1>

          <p className="text-[16px] text-slate-600 dark:text-slate-400 mt-1">
            Charting actual Firestore measurements only.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A1226]">

          {['7D', '30D', '90D', 'All'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-2 rounded-full text-xs font-bold ${
                timeRange === range
                  ? 'bg-slate-900 dark:bg-cyan-500 text-white dark:text-slate-950'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {range}
            </button>
          ))}

        </div>
      </div>

      {/* Loading */}
      {loading ? (

        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-8 text-slate-600 dark:text-slate-300">
          Loading your Firestore analytics...
        </div>

      ) : error ? (

        /* Error */
        <div className="rounded-3xl border border-red-500/25 bg-red-500/5 p-6 text-red-700 dark:text-red-300 flex items-start gap-3">

          <AlertCircle className="w-5 h-5 mt-0.5" />

          <div>
            <p className="font-semibold">
              Unable to load analytics.
            </p>

            <p className="mt-1">
              {error}
            </p>

            <button
              onClick={handleRefresh}
              className="mt-3 underline font-medium"
            >
              Retry
            </button>
          </div>

        </div>

      ) : !hasReadings ? (

        /* No Firestore records */
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-8 text-slate-600 dark:text-slate-300">

          <BarChart2 className="w-8 h-8 text-cyan-500 mb-3" />

          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            No health measurements yet
          </h2>

          <p className="mt-2">
            No measurements have been recorded in your Firestore account.
            Add a manual reading or synchronize a supported device to
            populate your analytics.
          </p>

        </div>

      ) : (

        <>
          {/* Latest measurements */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Blood Pressure */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-5">

              <p className="text-sm text-slate-500">
                Latest BP
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">

                {latestSummary.blood_pressure?.values?.systolic != null &&
                latestSummary.blood_pressure?.values?.diastolic != null
                  ? `${latestSummary.blood_pressure.values.systolic}/${latestSummary.blood_pressure.values.diastolic}`
                  : 'Not available'}

              </p>

              <p className="text-xs text-slate-500 mt-1">
                mmHg
              </p>

            </div>

            {/* Heart Rate */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-5">

              <p className="text-sm text-slate-500">
                Latest heart rate
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">

                {latestSummary.heart_rate?.values?.bpm != null
                  ? `${latestSummary.heart_rate.values.bpm} bpm`
                  : 'Not available'}

              </p>

            </div>

            {/* SpO2 */}
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-5">

              <p className="text-sm text-slate-500">
                Latest SpO2
              </p>

              <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">

                {latestSummary.oxygen_saturation?.values?.spo2 != null
                  ? `${latestSummary.oxygen_saturation.values.spo2}%`
                  : 'Not available'}

              </p>

            </div>

          </div>

          {/* Chart */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-5 shadow-sm">

            <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">

              <div className="flex items-center gap-2 text-slate-900 dark:text-white">

                <BarChart2 className="w-4 h-4 text-cyan-500" />

                <h2 className="font-bold">
                  Recent measurement trend
                </h2>

              </div>

              <button
                onClick={handleRefresh}
                disabled={loading}
                className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 disabled:opacity-50"
              >

                <RefreshCw className="w-4 h-4" />

                Refresh

              </button>

            </div>

            {!hasFilteredReadings ? (

              <div className="py-12 text-center text-slate-500 dark:text-slate-400">

                No measurements found in the selected time range.

              </div>

            ) : chartData.length === 0 ? (

              <div className="py-12 text-center text-slate-500 dark:text-slate-400">

                No valid measurement dates are available for charting.

              </div>

            ) : (

              <div className="w-full h-72 mt-5">

                <ResponsiveContainer width="100%" height="100%">

                  <LineChart
                    data={chartData}
                    margin={{
                      top: 12,
                      right: 12,
                      left: 0,
                      bottom: 0
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(148,163,184,0.2)"
                    />

                    <XAxis
                      dataKey="date"
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fontSize: 11,
                        fill: '#94A3B8'
                      }}
                    />

                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{
                        fontSize: 11,
                        fill: '#94A3B8'
                      }}
                    />

                    <Tooltip />

                    <Line
                      type="monotone"
                      dataKey="systolic"
                      stroke="#22c55e"
                      strokeWidth={2.5}
                      dot={false}
                      connectNulls={false}
                      name="Systolic"
                    />

                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      stroke="#38bdf8"
                      strokeWidth={2.5}
                      dot={false}
                      connectNulls={false}
                      name="Diastolic"
                    />

                    <Line
                      type="monotone"
                      dataKey="heartRate"
                      stroke="#f97316"
                      strokeWidth={2.5}
                      dot={false}
                      connectNulls={false}
                      name="Heart rate"
                    />

                    <Line
                      type="monotone"
                      dataKey="spo2"
                      stroke="#a78bfa"
                      strokeWidth={2.5}
                      dot={false}
                      connectNulls={false}
                      name="SpO2"
                    />

                    <Line
                      type="monotone"
                      dataKey="steps"
                      stroke="#f43f5e"
                      strokeWidth={2.5}
                      dot={false}
                      connectNulls={false}
                      name="Steps"
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            )}

            <p className="text-xs text-slate-500 mt-4">
              Showing up to 100 most recent Firestore records.
              Measurements are grouped by calendar day.
            </p>

          </div>

        </>

      )}

    </div>
  );
}
