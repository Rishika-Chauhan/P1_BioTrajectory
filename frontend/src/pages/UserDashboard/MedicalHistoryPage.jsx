import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Calendar, ShieldCheck, AlertCircle, RefreshCw, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { healthReadingService } from '../../services/healthReadingService';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

const TYPE_LABELS = {
  blood_pressure: 'Blood pressure',
  heart_rate: 'Heart rate',
  oxygen_saturation: 'Oxygen saturation',
  activity: 'Activity',
  urine_test: 'Urine test'
};

const formatDateTime = (value) => {
  if (!value) return 'Unknown time';
  const date = value?.toDate ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Unknown time';
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

const formatValues = (reading) => {
  if (!reading?.values || typeof reading.values !== 'object') return 'No values recorded';

  const entries = Object.entries(reading.values)
    .map(([key, value]) => {
      if (value === null || value === undefined || value === '') return null;
      const label = key
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (char) => char.toUpperCase());
      return `${label}: ${value}`;
    })
    .filter(Boolean);

  return entries.length ? entries.join(' • ') : 'No values recorded';
};

export default function MedicalHistoryPage() {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;
  const [records, setRecords] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReadings = useCallback(async () => {
    if (!uid) {
      setRecords([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await healthReadingService.list(uid, 100);
      setRecords((result || []).sort((a, b) => {
        const left = a.measuredAt?.toDate ? a.measuredAt.toDate().getTime() : new Date(a.measuredAt || 0).getTime();
        const right = b.measuredAt?.toDate ? b.measuredAt.toDate().getTime() : new Date(b.measuredAt || 0).getTime();
        return right - left;
      }));
    } catch (loadError) {
      console.error('Medical history load failed:', loadError);
      setError(loadError.message || 'Unable to load your health history.');
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadReadings();
  }, [loadReadings]);

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return records.filter((record) => {
      const matchesType = selectedType === 'all' || record.type === selectedType;
      const text = [record.type, record.source, record.notes, record.values ? JSON.stringify(record.values) : '']
        .join(' ')
        .toLowerCase();
      const matchesQuery = !query || text.includes(query);
      return matchesType && matchesQuery;
    });
  }, [records, searchQuery, selectedType]);

  const hasAnyData = records.length > 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <DisclaimerBanner />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Medical history
          </h1>
          <p className="text-[16px] text-slate-600 dark:text-slate-400 mt-1">
            Your saved measurements from Firestore, ordered by time.
          </p>
        </div>

        <button
          onClick={loadReadings}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0A1226] text-slate-700 dark:text-slate-200 font-semibold hover:border-cyan-500 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="p-4 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search notes, type, or values"
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {['all', 'blood_pressure', 'heart_rate', 'oxygen_saturation', 'activity', 'urine_test'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-2 rounded-full text-sm font-semibold ${selectedType === type ? 'bg-cyan-500 text-slate-950' : 'bg-slate-100 dark:bg-[#070B14] text-slate-600 dark:text-slate-300'}`}
              >
                {type === 'all' ? 'All' : TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-8 text-slate-600 dark:text-slate-300">
          Loading your health history from Firestore...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6 text-red-700 dark:text-red-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to load medical history.</p>
            <p className="mt-1">{error}</p>
            <button onClick={loadReadings} className="mt-3 underline font-medium">Retry</button>
          </div>
        </div>
      ) : !hasAnyData ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-8 text-slate-600 dark:text-slate-300">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">No measurements recorded yet.</p>
              <p className="mt-2">No readings have been saved for your account in Firestore. Add a manual reading from the daily reports page to begin tracking.</p>
            </div>
          </div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-8 text-slate-600 dark:text-slate-300">
          No readings match your current search or filter.
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <article key={record.id} className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{TYPE_LABELS[record.type] || record.type}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{record.source || 'manual'} • {formatDateTime(record.measuredAt)}</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDateTime(record.measuredAt)}
                </span>
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-100 dark:border-slate-800 p-4 text-slate-700 dark:text-slate-200 text-sm md:text-base">
                {formatValues(record)}
              </div>

              {record.notes ? (
                <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">Notes:</span> {record.notes}
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

