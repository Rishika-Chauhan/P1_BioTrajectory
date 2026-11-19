import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  Calendar,
  Plus,
  Heart,
  Footprints,
  Clock,
  Droplet,
  CheckCircle2,
  FileSpreadsheet,
  X,
  Activity,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

import { useAuth } from '../../context/AuthContext';
import { healthReadingService } from '../../services/healthReadingService';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const EMPTY_FORM = {
  type: 'blood_pressure',
  date: getLocalDateString(),
  systolic: '',
  diastolic: '',
  pulse: '',
  bpm: '',
  spo2: '',
  steps: '',
  distanceKm: '',
  exerciseMinutes: '',
  protein: '',
  proteinMgDl: '',
  ph: '',
  glucose: '',
  nitrites: '',
  specificGravity: '',
  notes: ''
};

const formatDate = (timestamp) => {
  if (!timestamp) return 'Unknown date';

  const date = timestamp.toDate
    ? timestamp.toDate()
    : new Date(timestamp);

  return Number.isNaN(date.getTime())
    ? 'Unknown date'
    : date.toLocaleDateString();
};

const formatDateInput = (timestamp) => {
  if (!timestamp) return '';

  const date = timestamp.toDate
    ? timestamp.toDate()
    : new Date(timestamp);

  if (Number.isNaN(date.getTime())) return '';

  return getLocalDateString(date);
};

const displayValue = (value, unit = '') => {
  if (value === null || value === undefined || value === '') {
    return '—';
  }

  return `${value}${unit ? ` ${unit}` : ''}`;
};

function createMeasurementDate(dateString) {
  if (!dateString || !/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new Error('Select a valid measurement date.');
  }

  const [year, month, day] = dateString.split('-').map(Number);

  const selectedDate = new Date(year, month - 1, day);
  const today = new Date();

  // Reject invalid calendar dates such as February 31.
  if (
    selectedDate.getFullYear() !== year ||
    selectedDate.getMonth() !== month - 1 ||
    selectedDate.getDate() !== day
  ) {
    throw new Error('Select a valid measurement date.');
  }

  // Compare calendar dates using the user's local timezone.
  const todayString = getLocalDateString(today);

  if (dateString > todayString) {
    throw new Error('Measurement date cannot be in the future.');
  }

  // For today's readings, use the actual current local time.
  if (dateString === todayString) {
    return new Date();
  }

  // Historical readings use noon as a date-only placeholder.
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export default function DailyReportsPage() {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;

  const [records, setRecords] = useState([]);

  const [selectedDate, setSelectedDate] = useState(
    getLocalDateString()
  );

  const [viewMode, setViewMode] = useState('daily');

  const [modalOpen, setModalOpen] = useState(false);
  const [newReading, setNewReading] = useState({ ...EMPTY_FORM });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(''), 3500);
  };

  const activeUid = uid || 'demo-user-123';

  const loadReadings = useCallback(async (isManual = false) => {
    setLoading(true);
    setErrorMessage('');

    if (isManual) {
      await new Promise((r) => setTimeout(r, 450));
    }

    try {
      const result = await healthReadingService.list(activeUid, 100);

      const sortedResult = [...(result || [])].sort((a, b) => {
        const dateA = a.measuredAt?.toDate
          ? a.measuredAt.toDate().getTime()
          : new Date(a.measuredAt).getTime();

        const dateB = b.measuredAt?.toDate
          ? b.measuredAt.toDate().getTime()
          : new Date(b.measuredAt).getTime();

        return (dateB || 0) - (dateA || 0);
      });

      setRecords(sortedResult);
    } catch (error) {
      console.error('Could not load health readings:', error);

      setErrorMessage(
        error.message || 'Could not load your health readings.'
      );
    } finally {
      setLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    loadReadings();
  }, [loadReadings]);

  const updateField = (field, value) => {
    setNewReading((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const toNumber = (value) => {
    if (value.trim() === '') return null;

    const number = Number(value);

    if (!Number.isFinite(number)) {
      throw new Error('Enter valid numeric measurements.');
    }

    return number;
  };

  const buildMeasurement = () => {
    const values = {};

    switch (newReading.type) {
      case 'blood_pressure':
        values.systolic = toNumber(newReading.systolic);
        values.diastolic = toNumber(newReading.diastolic);
        values.pulse = toNumber(newReading.pulse);
        break;

      case 'heart_rate':
        values.bpm = toNumber(newReading.bpm);
        break;

      case 'oxygen_saturation':
        values.spo2 = toNumber(newReading.spo2);
        break;

      case 'activity':
        values.steps = toNumber(newReading.steps);
        values.distanceKm = toNumber(newReading.distanceKm);
        values.exerciseMinutes = toNumber(newReading.exerciseMinutes);
        break;

      case 'urine_test':
        values.protein = newReading.protein.trim() || null;
        values.proteinMgDl = toNumber(newReading.proteinMgDl);
        values.ph = toNumber(newReading.ph);
        values.glucose = newReading.glucose.trim() || null;
        values.nitrites = newReading.nitrites.trim() || null;
        values.specificGravity = toNumber(newReading.specificGravity);
        break;

      default:
        throw new Error('Select a valid measurement type.');
    }

    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(
        ([, value]) => value !== null && value !== undefined
      )
    );

    if (Object.keys(cleanedValues).length === 0) {
      throw new Error('Enter at least one measurement before saving.');
    }

    return cleanedValues;
  };

  const handleAddReading = async (event) => {
    event.preventDefault();

    if (!uid) {
      setErrorMessage('Please sign in before saving a measurement.');
      return;
    }

    setSaving(true);
    setErrorMessage('');

    try {
      if (!newReading.date) {
        throw new Error('Select the measurement date.');
      }

      const measuredAt = createMeasurementDate(newReading.date);

      const values = buildMeasurement();

      await healthReadingService.add(uid, {
        type: newReading.type,
        values,
        source: 'manual',
        measuredAt,
        notes: newReading.notes
      });

      setModalOpen(false);
      setNewReading({
        ...EMPTY_FORM,
        date: getLocalDateString()
      });

      setSelectedDate(getLocalDateString());

      await loadReadings();

      showToast('Your reading was saved to your account.');
    } catch (error) {
      console.error('Reading save failed:', error);

      setErrorMessage(
        error.message || 'Could not save your reading.'
      );
    } finally {
      setSaving(false);
    }
  };

  const selectedRecords = useMemo(() => {
    if (!selectedDate) return [];

    if (viewMode === 'daily') {
      return records.filter(
        (record) => formatDateInput(record.measuredAt) === selectedDate
      );
    }

    const [year, month, day] = selectedDate.split('-').map(Number);
    const anchorDate = new Date(year, month - 1, day);

    if (Number.isNaN(anchorDate.getTime())) return [];

    if (viewMode === 'weekly') {
      const startDate = new Date(anchorDate);
      const daysSinceMonday = (startDate.getDay() + 6) % 7;

      startDate.setDate(startDate.getDate() - daysSinceMonday);

      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);

      return records.filter((record) => {
        const recordDateString = formatDateInput(record.measuredAt);

        if (!recordDateString) return false;

        const [recordYear, recordMonth, recordDay] =
          recordDateString.split('-').map(Number);

        const recordDate = new Date(
          recordYear,
          recordMonth - 1,
          recordDay
        );

        return recordDate >= startDate && recordDate < endDate;
      });
    }

    const selectedMonth =
      `${anchorDate.getFullYear()}-${String(
        anchorDate.getMonth() + 1
      ).padStart(2, '0')}`;

    return records.filter((record) =>
      formatDateInput(record.measuredAt).startsWith(selectedMonth)
    );
  }, [records, selectedDate, viewMode]);

  const latestByType = useMemo(() => {
    const result = {};

    for (const record of records) {
      if (!result[record.type]) {
        result[record.type] = record;
      }
    }

    return result;
  }, [records]);

  const latestBP = latestByType.blood_pressure?.values;
  const latestActivity = latestByType.activity?.values;
  const latestHeartRate = latestByType.heart_rate?.values;
  const latestUrine = latestByType.urine_test?.values;

  const exportCSV = () => {
    if (records.length === 0) {
      showToast('There are no readings to export.');
      return;
    }

    const rows = [
      ['Date', 'Type', 'Values', 'Source', 'Notes']
    ];

    records.forEach((record) => {
      rows.push([
        formatDate(record.measuredAt),
        record.type,
        JSON.stringify(record.values),
        record.source,
        record.notes || ''
      ]);
    });

    const csv = rows
      .map((row) =>
        row.map((value) =>
          `"${String(value).replace(/"/g, '""')}"`
        ).join(',')
      )
      .join('\n');

    const blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'biotrajectory-health-readings.csv';
    link.click();

    URL.revokeObjectURL(url);

    showToast('Your CSV export has been generated.');
  };

  const renderField = (label, field, options = {}) => (
    <div className="space-y-1.5" key={field}>
      <label className="font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <input
        type={options.type || 'number'}
        step={options.step || 'any'}
        min={options.min}
        max={options.max}
        value={newReading[field]}
        onChange={(event) => updateField(field, event.target.value)}
        placeholder={options.placeholder || ''}
        className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
      />
    </div>
  );

  const renderSelect = (label, field, options) => (
    <div className="space-y-1.5" key={field}>
      <label className="font-semibold text-slate-700 dark:text-slate-300">
        {label}
      </label>

      <select
        value={newReading[field]}
        onChange={(event) => updateField(field, event.target.value)}
        className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
      >
        <option value="">Not recorded</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  const renderMeasurementForm = () => {
    switch (newReading.type) {
      case 'blood_pressure':
        return (
          <div className="grid grid-cols-2 gap-4">
            {renderField('Systolic (mmHg)', 'systolic')}
            {renderField('Diastolic (mmHg)', 'diastolic')}
            {renderField('Pulse (BPM, optional)', 'pulse')}
          </div>
        );

      case 'heart_rate':
        return (
          <div className="grid grid-cols-2 gap-4">
            {renderField('Heart rate (BPM)', 'bpm')}
          </div>
        );

      case 'oxygen_saturation':
        return (
          <div className="grid grid-cols-2 gap-4">
            {renderField('SpO₂ (%)', 'spo2', {
              min: 0,
              max: 100
            })}
          </div>
        );

      case 'activity':
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {renderField('Steps', 'steps', {
              min: 0,
              step: 1
            })}

            {renderField('Distance (km)', 'distanceKm', {
              min: 0
            })}

            {renderField('Exercise (minutes)', 'exerciseMinutes', {
              min: 0
            })}
          </div>
        );

      case 'urine_test':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderSelect('Protein result', 'protein', [
                'Negative',
                'Trace',
                '+',
                '++',
                '+++'
              ])}

              {renderField('Protein (mg/dL)', 'proteinMgDl', {
                min: 0
              })}

              {renderField('Specific gravity', 'specificGravity', {
                min: 1,
                max: 1.1,
                step: '0.001'
              })}

              {renderField('pH', 'ph', {
                min: 0,
                max: 14,
                step: '0.1'
              })}

              {renderSelect('Glucose', 'glucose', [
                'Negative',
                'Trace',
                '+',
                '++',
                '+++'
              ])}

              {renderSelect('Nitrites', 'nitrites', [
                'Negative',
                'Positive'
              ])}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold shadow-2xl">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            My Day
          </h1>

          <p className="text-[17px] text-slate-600 dark:text-slate-400 mt-1">
            Your recorded health measurements and activity history
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setErrorMessage('');
              setNewReading({
                ...EMPTY_FORM,
                date: getLocalDateString()
              });
              setModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl text-[17px] font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-md"
          >
            <Plus className="w-5 h-5" />
            Add Today's Reading
          </button>

          <button
            onClick={exportCSV}
            className="px-4 py-3 rounded-xl text-sm font-semibold bg-white dark:bg-[#2B1E15] border border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-2"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={() => loadReadings(true)}
            disabled={loading}
            className="p-3 rounded-xl bg-white dark:bg-[#2B1E15] border border-slate-300 dark:border-slate-800 hover:border-cyan-500 cursor-pointer active:scale-95 transition-all disabled:opacity-60"
            title="Refresh readings"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-500' : ''}`}
            />
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="p-5 rounded-3xl bg-white dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800">
          {['daily', 'weekly', 'monthly'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-5 py-2 rounded-xl capitalize ${
                viewMode === mode
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {mode} View
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-cyan-500" />

          <label className="text-slate-600 dark:text-slate-400">
            Select day:
          </label>

          <input
            type="date"
            value={selectedDate}
            max={getLocalDateString()}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="p-2 rounded-xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="p-7 rounded-3xl bg-white dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex justify-between">
            <span className="font-bold text-slate-500 dark:text-slate-400">
              Blood Pressure
            </span>

            <Heart className="w-5 h-5 text-rose-500" />
          </div>

          <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {latestBP
              ? `${latestBP.systolic} / ${latestBP.diastolic}`
              : '—'}

            <span className="text-sm text-slate-400 ml-1">mmHg</span>
          </p>

          <p className="text-sm text-slate-500">
            Pulse: {displayValue(latestBP?.pulse, 'BPM')}
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-white dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex justify-between">
            <span className="font-bold text-slate-500 dark:text-slate-400">
              Daily Activity
            </span>

            <Footprints className="w-5 h-5 text-emerald-500" />
          </div>

          <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {displayValue(latestActivity?.steps)}
          </p>

          <p className="text-sm text-slate-500">
            Distance: {displayValue(latestActivity?.distanceKm, 'km')}
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-white dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex justify-between">
            <span className="font-bold text-slate-500 dark:text-slate-400">
              Heart Rate
            </span>

            <Clock className="w-5 h-5 text-cyan-500" />
          </div>

          <p className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
            {displayValue(
              latestHeartRate?.bpm ?? latestBP?.pulse,
              'BPM'
            )}
          </p>

          <p className="text-sm text-slate-500">
            Latest recorded measurement
          </p>
        </div>

        <div className="p-7 rounded-3xl bg-white dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex justify-between">
            <span className="font-bold text-slate-500 dark:text-slate-400">
              Urine Test
            </span>

            <Droplet className="w-5 h-5 text-blue-500" />
          </div>

          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {latestUrine?.protein || '—'}
          </p>

          <p className="text-sm text-slate-500">
            Specific gravity: {displayValue(latestUrine?.specificGravity)}
          </p>
        </div>
      </div>

      <div className="p-7 rounded-3xl bg-white dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-5">
          Recorded Measurements
        </h2>

        {loading ? (
          <p className="text-slate-500">
            Loading your Firestore records...
          </p>
        ) : selectedRecords.length === 0 ? (
          <div className="py-12 text-center">
            <Activity className="w-12 h-12 mx-auto text-slate-300 mb-3" />

            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              No readings for this date
            </h3>

            <p className="text-slate-500 mt-2">
              Your actual measurements will appear here after you save them.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Measurement</th>
                  <th className="py-3 px-3">Values</th>
                  <th className="py-3 px-3">Source</th>
                  <th className="py-3 px-3">Notes</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {selectedRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="py-4 px-3">
                      {formatDate(record.measuredAt)}
                    </td>

                    <td className="py-4 px-3 font-semibold">
                      {record.type.replaceAll('_', ' ')}
                    </td>

                    <td className="py-4 px-3">
                      {Object.entries(record.values)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(' | ')}
                    </td>

                    <td className="py-4 px-3 capitalize">
                      {record.source}
                    </td>

                    <td className="py-4 px-3">
                      {record.notes || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-xl p-8 rounded-3xl bg-white dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                Add Health Measurement
              </h3>

              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-red-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-sm text-slate-500">
              Enter measurements from an actual test or device. Blank fields
              will not be saved.
            </p>

            <form onSubmit={handleAddReading} className="space-y-5">

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Measurement type
                </label>

                <select
                  value={newReading.type}
                  onChange={(event) =>
                    setNewReading({
                      ...EMPTY_FORM,
                      type: event.target.value,
                      date: newReading.date
                    })
                  }
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="blood_pressure">Blood pressure</option>
                  <option value="heart_rate">Heart rate</option>
                  <option value="oxygen_saturation">Blood oxygen (SpO₂)</option>
                  <option value="activity">Activity</option>
                  <option value="urine_test">Urine test</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Measurement date
                </label>

                <input
                  type="date"
                  value={newReading.date}
                  max={getLocalDateString()}
                  onChange={(event) => updateField('date', event.target.value)}
                  required
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {renderMeasurementForm()}

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  Notes (optional)
                </label>

                <textarea
                  value={newReading.notes}
                  onChange={(event) => updateField('notes', event.target.value)}
                  maxLength={1000}
                  rows={3}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="Add context about this measurement"
                />
              </div>

              {errorMessage && (
                <p className="text-sm text-red-500">
                  {errorMessage}
                </p>
              )}

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3 rounded-2xl text-slate-600 dark:text-slate-400"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-7 py-3 rounded-2xl font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Reading'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DisclaimerBanner text="BioTrajectory is for personal health tracking and wellness. It does not provide a medical diagnosis or replace professional medical advice." />
    </div>
  );
}