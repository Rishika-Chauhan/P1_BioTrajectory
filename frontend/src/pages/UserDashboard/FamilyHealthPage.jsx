
import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  Users, UserPlus, ShieldCheck, Activity, Lock, RefreshCw,
  Trash2, LogOut, XCircle, CheckCircle2, Heart, AlertCircle,
  Mail, Eye, FileText, BarChart3, Stethoscope, Loader2,
  Plus, Clock, Check, X, TrendingUp, Droplets, Footprints,
  HeartPulse, CalendarDays, ChevronDown
} from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';
import { useFamily } from '../../context/FamilyContext';
import { useAuth } from '../../context/AuthContext';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

const PERMISSION_FIELDS = [
  {
    key: 'viewReadings',
    label: 'Health readings',
    description: 'Allow family members to view your recorded health measurements.',
    icon: Activity,
  },
  {
    key: 'viewAnalytics',
    label: 'Health analytics',
    description: 'Allow access to your health analytics.',
    icon: BarChart3,
  },
  {
    key: 'viewMedicalHistory',
    label: 'Medical history',
    description: 'Allow access to your medical history.',
    icon: Stethoscope,
  },
  {
    key: 'viewReports',
    label: 'Health reports',
    description: 'Allow access to your health reports.',
    icon: FileText,
  },
];

const METRICS = {
  heart_rate: {
    title: 'Heart Rate',
    unit: 'bpm',
    field: 'bpm',
    icon: HeartPulse,
    color: '#E45D70',
  },
  oxygen_saturation: {
    title: 'Oxygen Saturation',
    unit: '%',
    field: 'spo2',
    icon: Droplets,
    color: '#3988D6',
  },
  activity: {
    title: 'Daily Steps',
    unit: 'steps',
    field: 'steps',
    icon: Footprints,
    color: '#269D78',
  },
  blood_pressure: {
    title: 'Systolic Pressure',
    unit: 'mmHg',
    field: 'systolic',
    icon: Activity,
    color: '#9B72CF',
  },
};

const FIELD_LABELS = {
  systolic: 'Systolic pressure',
  diastolic: 'Diastolic pressure',
  pulse: 'Pulse',
  bpm: 'Heart rate',
  spo2: 'Oxygen saturation',
  steps: 'Steps',
  distanceKm: 'Distance',
  exerciseMinutes: 'Exercise duration',
  glucose: 'Glucose',
  fastingGlucose: 'Fasting glucose',
  hba1c: 'HbA1c',
  protein: 'Urine protein',
  proteinMgDl: 'Urine protein',
  ph: 'Urine pH',
  specificGravity: 'Specific gravity',
  nitrites: 'Nitrites',
  hemoglobin: 'Hemoglobin',
  hematocrit: 'Hematocrit',
  wbc: 'White blood cells',
  rbc: 'Red blood cells',
  platelets: 'Platelets',
  creatinine: 'Creatinine',
  totalCholesterol: 'Total cholesterol',
  hdl: 'HDL cholesterol',
  ldl: 'LDL cholesterol',
  triglycerides: 'Triglycerides',
  title: 'Title',
  category: 'Category',
  doctorName: 'Doctor',
  facility: 'Facility',
  scanType: 'Scan type',
  region: 'Region',
  modality: 'Modality',
  findings: 'Findings',
  impression: 'Impression',
  diagnosis: 'Diagnosis',
  instructions: 'Instructions',
  chiefComplaint: 'Chief complaint',
  assessment: 'Assessment',
  recommendations: 'Recommendations',
  testSummary: 'Test summary',
  fileName: 'File name',
  fileType: 'File type',
};

const FIELD_UNITS = {
  systolic: 'mmHg',
  diastolic: 'mmHg',
  pulse: 'bpm',
  bpm: 'bpm',
  spo2: '%',
  steps: 'steps',
  distanceKm: 'km',
  exerciseMinutes: 'min',
  glucose: 'mg/dL',
  fastingGlucose: 'mg/dL',
  proteinMgDl: 'mg/dL',
  hemoglobin: 'g/dL',
  hematocrit: '%',
  wbc: '/mcL',
  rbc: 'M/mcL',
  platelets: '/mcL',
  creatinine: 'mg/dL',
  totalCholesterol: 'mg/dL',
  hdl: 'mg/dL',
  ldl: 'mg/dL',
  triglycerides: 'mg/dL',
};

const TYPE_LABELS = {
  blood_pressure: 'Blood Pressure',
  heart_rate: 'Heart Rate',
  oxygen_saturation: 'Oxygen Saturation',
  activity: 'Physical Activity',
  urine_test: 'Urine Test',
  blood_test: 'Blood Test',
  imaging_scan: 'Imaging Scan',
  prescription: 'Prescription',
  clinical_note: 'Clinical Note',
  document: 'Medical Document',
};

function getDateValue(reading) {
  return (
    reading?.measuredAt ||
    reading?.recordedAt ||
    reading?.timestamp ||
    reading?.createdAt ||
    reading?.date ||
    null
  );
}

function parseDate(value) {
  if (!value) return null;

  let date;

  if (value?.toDate && typeof value.toDate === 'function') {
    date = value.toDate();
  } else if (value?._seconds) {
    date = new Date(value._seconds * 1000);
  } else {
    date = new Date(value);
  }

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value) {
  const date = parseDate(value);
  if (!date) return 'Date unavailable';

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getValues(reading) {
  return reading?.values && typeof reading.values === 'object'
    ? reading.values
    : {};
}

function getTypeLabel(type) {
  return TYPE_LABELS[type] || 'Health Record';
}

function getMetricValue(reading, metric) {
  const values = getValues(reading);
  const value = values[metric.field];

  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : null;
}

function getLatestReading(readings, type) {
  return [...readings]
    .filter((reading) => reading.type === type)
    .sort((a, b) => {
      const dateA = parseDate(getDateValue(a))?.getTime() || 0;
      const dateB = parseDate(getDateValue(b))?.getTime() || 0;
      return dateB - dateA;
    })[0] || null;
}

function formatMetricValue(value, unit) {
  if (value === null || value === undefined) return 'Not available';

  return `${Number(value).toLocaleString('en-IN')} ${unit}`;
}

function getDisplayValue(key, value) {
  if (value === null || value === undefined) return 'Not available';

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      return value.map((item) =>
        typeof item === 'object' ? JSON.stringify(item) : String(item)
      ).join(', ');
    }

    return JSON.stringify(value);
  }

  const unit = FIELD_UNITS[key] || '';
  return `${value}${unit ? ` ${unit}` : ''}`;
}

/* --------------------------------------------------
   HEALTH SUMMARY CARD
-------------------------------------------------- */

function SummaryCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1F150E] p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">
            {value}
          </p>
          <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
        </div>

        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${color}18`, color }}
        >
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   SVG TREND CHART
-------------------------------------------------- */

function TrendChart({ readings, type }) {
  const metric = METRICS[type];

  if (!metric) return null;

  const points = readings
    .filter((reading) => reading.type === type)
    .map((reading) => ({
      value: getMetricValue(reading, metric),
      date: parseDate(getDateValue(reading)),
    }))
    .filter((item) => item.value !== null && item.date)
    .sort((a, b) => a.date - b.date)
    .slice(-12);

  if (points.length < 2) {
    return (
      <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center">
        <p className="text-sm text-slate-500">
          At least two readings are needed to display this trend.
        </p>
      </div>
    );
  }

  const width = 600;
  const height = 210;
  const padding = 35;

  const values = points.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const coordinates = points.map((point, index) => ({
    x: padding + (index / (points.length - 1)) * (width - padding * 2),
    y: height - padding -
      ((point.value - min) / range) * (height - padding * 2),
    ...point,
  }));

  const line = coordinates
    .map((point) => `${point.x},${point.y}`)
    .join(' ');

  const area = [
    `${coordinates[0].x},${height - padding}`,
    ...coordinates.map((point) => `${point.x},${point.y}`),
    `${coordinates[coordinates.length - 1].x},${height - padding}`,
  ].join(' ');

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-[#1F150E]">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white">
            {metric.title}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Last {points.length} available readings
          </p>
        </div>

        <span className="text-sm font-bold" style={{ color: metric.color }}>
          {formatMetricValue(points[points.length - 1].value, metric.unit)}
        </span>
      </div>

      <div className="w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto"
          role="img"
          aria-label={`${metric.title} trend chart`}
        >
          {[0, 1, 2, 3].map((index) => {
            const y = padding + index * ((height - padding * 2) / 3);

            return (
              <line
                key={index}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="currentColor"
                opacity="0.12"
                strokeDasharray="4 4"
              />
            );
          })}

          <polygon
            points={area}
            fill={metric.color}
            opacity="0.10"
          />

          <polyline
            points={line}
            fill="none"
            stroke={metric.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {coordinates.map((point, index) => (
            <g key={`${point.x}-${index}`}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill={metric.color}
                stroke="white"
                strokeWidth="2"
              />
              <title>
                {formatMetricValue(point.value, metric.unit)} — {formatDate(point.date)}
              </title>
            </g>
          ))}

          <text
            x={padding}
            y={height - 7}
            fill="currentColor"
            fontSize="11"
            opacity="0.65"
          >
            {points[0].date.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
            })}
          </text>

          <text
            x={width - padding}
            y={height - 7}
            textAnchor="end"
            fill="currentColor"
            fontSize="11"
            opacity="0.65"
          >
            {points[points.length - 1].date.toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
            })}
          </text>
        </svg>
      </div>

      <div className="flex justify-between text-xs text-slate-500 mt-2">
        <span>Lowest: {formatMetricValue(min, metric.unit)}</span>
        <span>Highest: {formatMetricValue(max, metric.unit)}</span>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   READABLE HEALTH RECORD CARD
-------------------------------------------------- */

function ReadingCard({ reading }) {
  const values = getValues(reading);

  const visibleEntries = Object.entries(values).filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      typeof value !== 'object'
  );

  const extraEntries = Object.entries(values).filter(
    ([, value]) =>
      value !== null &&
      value !== undefined &&
      typeof value === 'object'
  );

  return (
    <article className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1F150E] p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white">
            {getTypeLabel(reading.type)}
          </h3>

          {values.title && (
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              {values.title}
            </p>
          )}

          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" />
            {formatDate(getDateValue(reading))}
          </p>
        </div>

        <span className="self-start px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
          {reading.source || 'Recorded'}
        </span>
      </div>

      {visibleEntries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {visibleEntries.map(([key, value]) => (
            <div
              key={key}
              className="rounded-xl bg-slate-50 dark:bg-slate-800/60 p-3"
            >
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {FIELD_LABELS[key] || key}
              </p>

              <p className="text-base font-bold text-slate-900 dark:text-white mt-1 break-words">
                {getDisplayValue(key, value)}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500">
          No individual measurement values are available.
        </p>
      )}

      {extraEntries.map(([key, value]) => (
        <div key={key} className="mt-3">
          <p className="text-xs text-slate-500 mb-1">
            {FIELD_LABELS[key] || key}
          </p>
          <pre className="whitespace-pre-wrap break-words text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg text-slate-700 dark:text-slate-300">
            {JSON.stringify(value, null, 2)}
          </pre>
        </div>
      ))}

      {reading.notes && (
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
          <p className="text-xs font-bold text-slate-500 mb-1">Notes</p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            {reading.notes}
          </p>
        </div>
      )}
    </article>
  );
}

/* --------------------------------------------------
   RECENT READINGS TABLE
-------------------------------------------------- */

function ReadingsTable({ readings }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-800/70">
          <tr>
            <th className="p-3 font-bold">Date</th>
            <th className="p-3 font-bold">Record</th>
            <th className="p-3 font-bold">Main result</th>
            <th className="p-3 font-bold">Source</th>
          </tr>
        </thead>

        <tbody>
          {readings.slice(0, 20).map((reading, index) => {
            const values = getValues(reading);

            const mainResult = Object.entries(values).find(
              ([, value]) =>
                value !== null &&
                value !== undefined &&
                typeof value !== 'object'
            );

            return (
              <tr
                key={reading.id || index}
                className="border-t border-slate-200 dark:border-slate-700"
              >
                <td className="p-3 whitespace-nowrap text-slate-500">
                  {formatDate(getDateValue(reading))}
                </td>

                <td className="p-3 font-semibold text-slate-900 dark:text-white">
                  {getTypeLabel(reading.type)}
                </td>

                <td className="p-3 text-slate-700 dark:text-slate-300">
                  {mainResult
                    ? `${FIELD_LABELS[mainResult[0]] || mainResult[0]}: ${getDisplayValue(mainResult[0], mainResult[1])}`
                    : 'Details available in record'}
                </td>

                <td className="p-3 text-slate-500">
                  {reading.source || 'Recorded'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* --------------------------------------------------
   MAIN FAMILY HEALTH PAGE
-------------------------------------------------- */

export default function FamilyHealthPage() {
  const { isHindi } = useLanguage();
  const { currentUser } = useAuth();

  const {
    family,
    members,
    invitations,
    pendingInvitations,
    pendingInvitationsLoading,
    pendingInvitationsError,
    isOwner,
    myPermissions,
    loading,
    error,
    activeMember,
    activeMemberUid,
    activeMemberReadings,
    activeMemberPermissions,
    activeMemberLoading,
    activeMemberError,
    fetchFamily,
    fetchPendingInvitations,
    createFamily,
    inviteMember,
    acceptInvitation,
    rejectInvitation,
    revokeInvitation,
    removeMember,
    leaveFamily,
    disbandFamily,
    updateMyPermissions,
    selectMemberProfile,
    clearActiveMember,
  } = useFamily();

  const [familyName, setFamilyName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [busyAction, setBusyAction] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [selectedChart, setSelectedChart] = useState('heart_rate');
  const [showAllReadings, setShowAllReadings] = useState(false);

  const readingsSectionRef = useRef(null);

  const hindi = (en, hi) => isHindi ? hi : en;

  const showMessage = (text, type = 'success') => {
    setMessage(text);
    setMessageType(type);
  };

  const runAction = async (action, actionName = 'action') => {
    setBusy(true);
    setBusyAction(actionName);
    setMessage('');

    try {
      return await action();
    } catch (err) {
      showMessage(err.message || 'Something went wrong.', 'error');
      return null;
    } finally {
      setBusy(false);
      setBusyAction('');
    }
  };

  useEffect(() => {
    if (activeMemberUid && activeMember) {
      readingsSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [activeMemberUid, activeMember]);

  const readings = useMemo(() => {
    return [...(activeMemberReadings || [])].sort((a, b) => {
      const dateA = parseDate(getDateValue(a))?.getTime() || 0;
      const dateB = parseDate(getDateValue(b))?.getTime() || 0;
      return dateB - dateA;
    });
  }, [activeMemberReadings]);

  const latestHeartRate = getLatestReading(readings, 'heart_rate');
  const latestSpo2 = getLatestReading(readings, 'oxygen_saturation');
  const latestBP = getLatestReading(readings, 'blood_pressure');
  const latestActivity = getLatestReading(readings, 'activity');

  const heartRateValue = latestHeartRate
    ? getMetricValue(latestHeartRate, METRICS.heart_rate)
    : null;

  const spo2Value = latestSpo2
    ? getMetricValue(latestSpo2, METRICS.oxygen_saturation)
    : null;

  const systolic = latestBP?.values?.systolic;
  const diastolic = latestBP?.values?.diastolic;

  const stepsValue = latestActivity
    ? getMetricValue(latestActivity, METRICS.activity)
    : null;

  const handleRefresh = async () => {
    await Promise.all([fetchFamily(), fetchPendingInvitations()]);
    showMessage('Family information refreshed.');
  };

  const handleCreateFamily = async (e) => {
    e.preventDefault();

    if (familyName.trim().length < 2) {
      showMessage('Family name must contain at least 2 characters.', 'error');
      return;
    }

    const result = await runAction(
      () => createFamily(familyName.trim()),
      'create'
    );

    if (result) {
      setFamilyName('');
      setShowCreate(false);
      showMessage('Family created successfully.');
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();

    if (!inviteEmail.trim()) {
      showMessage('Enter the email address of the registered user.', 'error');
      return;
    }

    const result = await runAction(
      () => inviteMember(inviteEmail.trim()),
      'invite'
    );

    if (result) {
      setInviteEmail('');
      setShowInvite(false);
      showMessage('Invitation sent successfully.');
    }
  };

  const handleAcceptInvitation = async (id) => {
    const result = await runAction(
      () => acceptInvitation(id),
      `accept-${id}`
    );

    if (result) showMessage('You have joined the family successfully.');
  };

  const handleRejectInvitation = async (id) => {
    const result = await runAction(
      () => rejectInvitation(id),
      `reject-${id}`
    );

    if (result) showMessage('Invitation rejected.');
  };

  const handlePermissionChange = async (key, checked) => {
    const updated = { ...myPermissions, [key]: checked };

    await runAction(
      () => updateMyPermissions(updated),
      'permissions'
    );
  };

  const handleSelectMember = async (uid) => {
    await runAction(() => selectMemberProfile(uid), 'readings');
  };

  const handleRemoveMember = async (uid) => {
    const result = await runAction(
      () => removeMember(uid),
      'remove'
    );

    if (result) {
      setConfirmAction(null);
      showMessage('Family member removed.');
    }
  };

  const handleLeaveFamily = async () => {
    const result = await runAction(() => leaveFamily(), 'leave');

    if (result) {
      setConfirmAction(null);
      showMessage('You have left the family.');
    }
  };

  const handleDisbandFamily = async () => {
    const result = await runAction(() => disbandFamily(), 'disband');

    if (result) {
      setConfirmAction(null);
      showMessage('Family disbanded.');
    }
  };

  const handleRevokeInvitation = async (id) => {
    const result = await runAction(
      () => revokeInvitation(id),
      'revoke'
    );

    if (result) showMessage('Invitation revoked.');
  };

  const handleCloseReadings = () => {
    clearActiveMember();
    setShowAllReadings(false);
  };

  const formatFamilyDate = (value) => {
    if (!value) return 'Not available';
    return formatDate(value);
  };

  const isInvitationBusy = (id) => (
    busyAction === `accept-${id}` ||
    busyAction === `reject-${id}`
  );

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading family information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-7 pb-12">
      <DisclaimerBanner />

      {message && (
        <div
          className={`p-4 rounded-2xl flex items-start gap-3 border ${
            messageType === 'error'
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
          }`}
        >
          {messageType === 'error'
            ? <AlertCircle className="w-5 h-5 shrink-0" />
            : <CheckCircle2 className="w-5 h-5 shrink-0" />
          }

          <p className="text-sm font-semibold flex-1">{message}</p>

          <button onClick={() => setMessage('')}>
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* PAGE HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#A9D6F5]/20 border border-[#A9D6F5]/40 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#2672A8] dark:text-[#A9D6F5]" />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {hindi('Family Health Circle', 'परिवार स्वास्थ्य मंडल')}
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Manage family membership and control access to your health information.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={busy}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[#A9D6F5]/50 text-[#2672A8] dark:text-[#A9D6F5] font-bold text-sm hover:bg-[#A9D6F5]/10"
        >
          <RefreshCw className={`w-4 h-4 ${busy ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* RECEIVED INVITATIONS */}

      <section className="p-6 rounded-3xl bg-white dark:bg-[#1F150E] border border-[#A9D6F5]/50 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-500" />
            </div>

            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-white">
                Family Invitations
              </h2>
              <p className="text-xs text-slate-500">
                Invitations received by your account
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold">
            {pendingInvitations.length} pending
          </span>
        </div>

        {pendingInvitationsLoading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading invitations...
          </div>
        ) : pendingInvitationsError ? (
          <div className="text-sm text-rose-500">
            {pendingInvitationsError}
          </div>
        ) : pendingInvitations.length === 0 ? (
          <div className="p-5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-sm text-slate-500">
            No pending family invitations.
          </div>
        ) : (
          <div className="space-y-3">
            {pendingInvitations.map((invitation) => (
              <div
                key={invitation.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white">
                    {invitation.familyName || 'Family invitation'}
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Invited by: {invitation.inviterName || 'Family owner'}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {invitation.invitedEmail}
                  </p>

                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Expires: {formatFamilyDate(invitation.expiresAt)}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleAcceptInvitation(invitation.id)}
                    disabled={busy || isInvitationBusy(invitation.id)}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold disabled:opacity-50"
                  >
                    {busyAction === `accept-${invitation.id}`
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Check className="w-4 h-4 inline mr-1" />
                    }
                    Accept
                  </button>

                  <button
                    onClick={() => handleRejectInvitation(invitation.id)}
                    disabled={busy || isInvitationBusy(invitation.id)}
                    className="px-4 py-2 rounded-lg border border-rose-500/30 text-rose-500 text-xs font-bold disabled:opacity-50"
                  >
                    {busyAction === `reject-${invitation.id}`
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <X className="w-4 h-4 inline mr-1" />
                    }
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* NO FAMILY */}

      {!family && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-7 rounded-3xl bg-white dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#A9D6F5]/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-[#2672A8]" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Create a Family
            </h2>

            <p className="text-sm text-slate-500">
              Create a family group and become its owner. Invite other registered users to join.
            </p>

            <button
              onClick={() => setShowCreate(true)}
              className="px-5 py-3 rounded-xl bg-[#A9D6F5] text-[#1F150E] font-extrabold text-sm"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create Family
            </button>
          </div>

          <div className="p-7 rounded-3xl bg-white dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-emerald-600" />
            </div>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Join a Family
            </h2>

            <p className="text-sm text-slate-500">
              Check your pending invitations above. Accept an invitation to join a family.
            </p>

            <button
              onClick={fetchPendingInvitations}
              disabled={pendingInvitationsLoading}
              className="px-5 py-3 rounded-xl bg-emerald-600 text-white font-extrabold text-sm"
            >
              <RefreshCw className="w-4 h-4 inline mr-2" />
              Check Invitations
            </button>
          </div>
        </div>
      )}

      {/* FAMILY DASHBOARD */}

      {family && (
        <>
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-slate-400">
                  Current Family
                </span>

                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {family.name}
                </h2>

                <p className="text-xs text-slate-500 mt-2">
                  {family.memberCount ?? members.length} active members
                  {' · '}
                  {isOwner ? 'Owner' : 'Member'}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {isOwner && (
                  <button
                    onClick={() => setShowInvite(true)}
                    className="px-4 py-3 rounded-xl bg-[#A9D6F5] text-[#1F150E] font-bold text-sm"
                  >
                    <UserPlus className="w-4 h-4 inline mr-2" />
                    Invite Member
                  </button>
                )}

                {!isOwner && (
                  <button
                    onClick={() => setConfirmAction({ type: 'leave' })}
                    className="px-4 py-3 rounded-xl border border-rose-500/30 text-rose-500 font-bold text-sm"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Leave Family
                  </button>
                )}

                {isOwner && (
                  <button
                    onClick={() => setConfirmAction({ type: 'disband' })}
                    className="px-4 py-3 rounded-xl border border-rose-500/30 text-rose-500 font-bold text-sm"
                  >
                    Disband Family
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* FAMILY MEMBERS */}

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                Family Members
              </h2>

              <span className="text-xs text-slate-500">
                {members.length} members
              </span>
            </div>

            {members.length === 0 ? (
              <div className="p-8 text-center rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
                No active family members found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {members.map((member) => {
                  const isMe = member.uid === currentUser?.uid;
                  const isActive = activeMemberUid === member.uid;

                  return (
                    <div
                      key={member.uid}
                      className={`p-5 rounded-3xl bg-white dark:bg-[#1F150E] border ${
                        isActive
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-[#E8DFD1] dark:border-[#4A3525]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-extrabold text-slate-900 dark:text-white break-words">
                            {member.name || 'Family member'}

                            {isMe && (
                              <span className="ml-2 text-xs text-blue-500">
                                You
                              </span>
                            )}
                          </h3>

                          <p className="text-xs text-slate-500 mt-1 break-all">
                            {member.email || member.uid}
                          </p>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          member.familyRole === 'OWNER'
                            ? 'bg-blue-500/10 text-blue-600'
                            : 'bg-slate-500/10 text-slate-500'
                        }`}>
                          {member.familyRole}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600">
                        <ShieldCheck className="w-4 h-4" />
                        Active membership
                      </div>

                      <p className="mt-3 text-xs text-slate-500">
                        Joined: {formatFamilyDate(member.joinedAt)}
                      </p>

                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap gap-2">
                        {!isMe && (
                          <button
                            onClick={() => handleSelectMember(member.uid)}
                            disabled={busy}
                            className="px-3 py-2 rounded-lg bg-[#A9D6F5] text-[#1F150E] font-bold text-xs disabled:opacity-50"
                          >
                            <Eye className="w-3.5 h-3.5 inline mr-1" />
                            View Shared Readings
                          </button>
                        )}

                        {isActive && (
                          <button
                            onClick={handleCloseReadings}
                            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-bold"
                          >
                            Close Readings
                          </button>
                        )}

                        {isOwner && !isMe && (
                          <button
                            onClick={() => setConfirmAction({
                              type: 'remove',
                              uid: member.uid,
                              name: member.name,
                            })}
                            className="px-3 py-2 rounded-lg text-rose-500 border border-rose-500/20 text-xs font-bold"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* MY HEALTH SHARING PERMISSIONS */}

          <section className="p-6 rounded-3xl bg-white dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
              </div>

              <div>
                <h2 className="font-extrabold text-slate-900 dark:text-white">
                  My Health Data Permissions
                </h2>

                <p className="text-xs text-slate-500">
                  You control what other family members can access.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {PERMISSION_FIELDS.map((permission) => {
                const Icon = permission.icon;
                const checked = Boolean(myPermissions?.[permission.key]);

                return (
                  <div
                    key={permission.key}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 mt-1 text-[#2672A8] dark:text-[#A9D6F5]" />

                      <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {permission.label}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          {permission.description}
                        </p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={busy}
                      onChange={(e) => handlePermissionChange(
                        permission.key,
                        e.target.checked
                      )}
                      className="w-5 h-5 accent-blue-600 shrink-0 cursor-pointer"
                    />
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-slate-500 flex gap-2">
              <Lock className="w-4 h-4 shrink-0" />
              All permissions are disabled by default. Membership does not automatically grant medical-data access.
            </p>
          </section>

          {/* SHARED HEALTH DASHBOARD */}

          {activeMember && (
            <section
              ref={readingsSectionRef}
              className="scroll-mt-6 p-6 rounded-3xl bg-white dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Shared Health Dashboard
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Health records shared by {activeMember.name}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold">
                    {readings.length} records
                  </span>

                  <button
                    onClick={handleCloseReadings}
                    className="p-2 rounded-lg border border-slate-300 dark:border-slate-700"
                    title="Close readings"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {activeMemberLoading && (
                <div className="flex items-center gap-2 text-sm text-slate-500 py-6">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading authorized readings...
                </div>
              )}

              {activeMemberError && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm">
                  <Lock className="w-4 h-4 inline mr-2" />
                  {activeMemberError}
                </div>
              )}

              {!activeMemberLoading && !activeMemberError && (
                <>
                  {activeMemberPermissions && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Reading access: {activeMemberPermissions.viewReadings
                        ? 'Granted'
                        : 'Not granted'}
                    </div>
                  )}

                  {readings.length === 0 ? (
                    <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center">
                      <Activity className="w-9 h-9 mx-auto text-slate-400 mb-3" />
                      <h3 className="font-bold text-slate-700 dark:text-slate-200">
                        No shared readings available
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        This family member has not recorded any readings yet.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* SUMMARY CARDS */}

                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                          Latest Health Measurements
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
                          <SummaryCard
                            title="Heart Rate"
                            value={formatMetricValue(heartRateValue, 'bpm')}
                            subtitle={latestHeartRate
                              ? formatDate(getDateValue(latestHeartRate))
                              : 'No heart rate record'}
                            icon={HeartPulse}
                            color="#E45D70"
                          />

                          <SummaryCard
                            title="Oxygen Saturation"
                            value={formatMetricValue(spo2Value, '%')}
                            subtitle={latestSpo2
                              ? formatDate(getDateValue(latestSpo2))
                              : 'No oxygen record'}
                            icon={Droplets}
                            color="#3988D6"
                          />

                          <SummaryCard
                            title="Blood Pressure"
                            value={
                              systolic != null && diastolic != null
                                ? `${systolic}/${diastolic}`
                                : 'Not available'
                            }
                            subtitle={latestBP
                              ? 'mmHg · Latest record'
                              : 'No blood pressure record'}
                            icon={Activity}
                            color="#9B72CF"
                          />

                          <SummaryCard
                            title="Daily Steps"
                            value={stepsValue != null
                              ? stepsValue.toLocaleString('en-IN')
                              : 'Not available'}
                            subtitle={latestActivity
                              ? 'Latest activity record'
                              : 'No activity record'}
                            icon={Footprints}
                            color="#269D78"
                          />
                        </div>
                      </div>

                      {/* TREND CHARTS */}

                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">
                              Health Trends
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">
                              Visual trends based on recorded measurements
                            </p>
                          </div>

                          <select
                            value={selectedChart}
                            onChange={(e) => setSelectedChart(e.target.value)}
                            className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white"
                          >
                            {Object.entries(METRICS).map(([type, metric]) => (
                              <option key={type} value={type}>
                                {metric.title}
                              </option>
                            ))}
                          </select>
                        </div>

                        <TrendChart
                          readings={readings}
                          type={selectedChart}
                        />
                      </div>

                      {/* ALL AVAILABLE READING TYPES */}

                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                          All Health Records
                        </h3>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {Object.entries(TYPE_LABELS).map(([type, label]) => {
                            const count = readings.filter(
                              (reading) => reading.type === type
                            ).length;

                            return (
                              <div
                                key={type}
                                className="rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3"
                              >
                                <p className="text-xs text-slate-500">
                                  {label}
                                </p>
                                <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                                  {count}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {count === 1 ? 'record' : 'records'}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* READABLE RECORD CARDS */}

                      <div>
                        <div className="flex items-center justify-between gap-3 mb-3">
                          <h3 className="font-bold text-slate-900 dark:text-white">
                            Individual Health Records
                          </h3>

                          <button
                            onClick={() => setShowAllReadings((value) => !value)}
                            className="text-xs font-bold text-blue-600 flex items-center gap-1"
                          >
                            {showAllReadings ? 'Show recent only' : 'Show all records'}
                            <ChevronDown className={`w-4 h-4 transition-transform ${showAllReadings ? 'rotate-180' : ''}`} />
                          </button>
                        </div>

                        <div className="space-y-3">
                          {(showAllReadings ? readings : readings.slice(0, 5)).map(
                            (reading, index) => (
                              <ReadingCard
                                key={reading.id || index}
                                reading={reading}
                              />
                            )
                          )}
                        </div>
                      </div>

                      {/* RECENT READINGS TABLE */}

                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                          Recent Readings Table
                        </h3>

                        <ReadingsTable readings={readings} />
                      </div>
                    </>
                  )}
                </>
              )}
            </section>
          )}

          {/* OWNER'S SENT INVITATIONS */}

          {isOwner && (
            <section className="p-6 rounded-3xl bg-white dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500" />

                <h2 className="font-extrabold text-slate-900 dark:text-white">
                  Invitations Sent
                </h2>
              </div>

              {invitations.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No pending invitations.
                </p>
              ) : (
                invitations.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {invitation.email}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Expires: {formatFamilyDate(invitation.expiresAt)}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRevokeInvitation(invitation.id)}
                      disabled={busy}
                      className="px-3 py-2 rounded-lg border border-rose-500/30 text-rose-500 text-xs font-bold"
                    >
                      Revoke Invitation
                    </button>
                  </div>
                ))
              )}
            </section>
          )}
        </>
      )}

      {/* CREATE FAMILY MODAL */}

      {showCreate && (
        <Modal
          title="Create Family"
          onClose={() => setShowCreate(false)}
        >
          <form onSubmit={handleCreateFamily} className="space-y-4">
            <label className="text-sm font-bold block">
              Family Name
            </label>

            <input
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Enter family name"
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
              required
              minLength={2}
              maxLength={80}
            />

            <button
              disabled={busy}
              className="w-full p-3 rounded-xl bg-[#A9D6F5] text-[#1F150E] font-extrabold"
            >
              {busyAction === 'create' ? 'Creating...' : 'Create Family'}
            </button>
          </form>
        </Modal>
      )}

      {/* INVITE MODAL */}

      {showInvite && (
        <Modal
          title="Invite Family Member"
          onClose={() => setShowInvite(false)}
        >
          <form onSubmit={handleInvite} className="space-y-4">
            <p className="text-sm text-slate-500">
              Enter the email address of an existing registered BioTrajectory user. They will see your invitation in their Family Health page.
            </p>

            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="member@example.com"
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent"
              required
            />

            <button
              disabled={busy}
              className="w-full p-3 rounded-xl bg-[#A9D6F5] text-[#1F150E] font-extrabold"
            >
              {busyAction === 'invite' ? 'Sending invitation...' : 'Send Invitation'}
            </button>
          </form>
        </Modal>
      )}

      {/* CONFIRMATION MODAL */}

      {confirmAction && (
        <Modal
          title="Confirm Action"
          onClose={() => setConfirmAction(null)}
        >
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-5">
            {confirmAction.type === 'remove' &&
              `Remove ${confirmAction.name || 'this member'} from the family?`
            }

            {confirmAction.type === 'leave' &&
              'Are you sure you want to leave this family?'
            }

            {confirmAction.type === 'disband' &&
              'This will disband the entire family group. This action cannot be easily reversed.'
            }
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setConfirmAction(null)}
              className="flex-1 p-3 rounded-xl border border-slate-300 dark:border-slate-700 font-bold text-sm"
            >
              Cancel
            </button>

            <button
              disabled={busy}
              onClick={() => {
                if (confirmAction.type === 'remove') {
                  handleRemoveMember(confirmAction.uid);
                }

                if (confirmAction.type === 'leave') {
                  handleLeaveFamily();
                }

                if (confirmAction.type === 'disband') {
                  handleDisbandFamily();
                }
              }}
              className="flex-1 p-3 rounded-xl bg-rose-600 text-white font-bold text-sm"
            >
              Confirm
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* --------------------------------------------------
   REUSABLE MODAL
-------------------------------------------------- */

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl bg-white dark:bg-[#1F150E] border border-[#A9D6F5]/40 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {title}
          </h2>

          <button onClick={onClose}>
            <XCircle className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
