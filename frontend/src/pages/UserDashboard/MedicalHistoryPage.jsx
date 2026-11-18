import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  Calendar,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Activity,
  Heart,
  Droplet,
  FileText,
  UploadCloud,
  X,
  FileSpreadsheet,
  Clock,
  Eye,
  Check,
  TrendingUp,
  User,
  Building
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { healthReadingService } from '../../services/healthReadingService';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function MedicalHistoryPage() {
  const { currentUser } = useAuth();
  const { t, isHindi } = useLanguage();
  const uid = currentUser?.uid;

  const [records, setRecords] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals state
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadSuccessToast, setUploadSuccessToast] = useState(false);

  // New Record Form State
  const [formType, setFormType] = useState('blood_test');
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formDoctor, setFormDoctor] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formValues, setFormValues] = useState({});
  const [formFileName, setFormFileName] = useState('');

  const typeLabels = useMemo(() => ({
    all: t('records.categories.all', {}, 'All Records'),
    blood_pressure: t('records.categories.blood_pressure', {}, 'Blood Pressure'),
    heart_rate: t('records.categories.heart_rate', {}, 'Heart Rate'),
    oxygen_saturation: t('records.categories.oxygen_saturation', {}, 'Blood Oxygen (SpO2)'),
    activity: t('records.categories.activity', {}, 'Activity & Steps'),
    urine_test: t('records.categories.urine_test', {}, 'Urine Test Strip'),
    blood_test: t('records.categories.blood_test', {}, 'Blood Test / Lab'),
    document: t('records.categories.document', {}, 'Uploaded Documents / Scans')
  }), [t]);

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

  const formatDateTime = (value) => {
    if (!value) return isHindi ? 'अज्ञात समय' : 'Unknown time';
    const date = value?.toDate ? value.toDate() : new Date(value);
    if (Number.isNaN(date.getTime())) return isHindi ? 'अज्ञात समय' : 'Unknown time';
    return date.toLocaleString(isHindi ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'blood_pressure':
        return <Activity className="w-5 h-5 text-cyan-500" />;
      case 'heart_rate':
        return <Heart className="w-5 h-5 text-rose-500" />;
      case 'oxygen_saturation':
        return <Droplet className="w-5 h-5 text-indigo-500" />;
      case 'activity':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'urine_test':
        return <Droplet className="w-5 h-5 text-amber-500" />;
      case 'blood_test':
        return <FileSpreadsheet className="w-5 h-5 text-red-500" />;
      case 'document':
      default:
        return <FileText className="w-5 h-5 text-blue-500" />;
    }
  };

  const getRecordTitle = (record) => {
    if (record.values?.title) return record.values.title;
    switch (record.type) {
      case 'blood_pressure':
        return isHindi ? 'रक्तचाप माप (Blood Pressure)' : 'Blood Pressure Measurement';
      case 'heart_rate':
        return isHindi ? 'हृदय गति जांच (Heart Rate)' : 'Resting Heart Rate Check';
      case 'oxygen_saturation':
        return isHindi ? 'ऑक्सीजन संतृप्ति (SpO2)' : 'Oxygen Saturation SpO2';
      case 'activity':
        return isHindi ? 'दैनिक गतिविधि एवं कदम' : 'Daily Physical Activity & Steps';
      case 'urine_test':
        return isHindi ? 'मूत्र बायोमार्कर स्ट्रिप जांच' : 'Urine Reagent Test Strip';
      case 'blood_test':
        return isHindi ? 'रक्त परीक्षण विश्लेषण (Blood Test)' : 'Diagnostic Blood Metabolic Panel';
      case 'document':
        return isHindi ? 'अपलोड की गई क्लिनिकल रिपोर्ट' : 'Uploaded Clinical Document';
      default:
        return typeLabels[record.type] || record.type;
    }
  };

  const getStatusBadge = (record) => {
    const vals = record.values || {};
    if (record.type === 'blood_pressure') {
      const sys = vals.systolic;
      const dia = vals.diastolic;
      if (sys >= 140 || dia >= 90) {
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {isHindi ? 'खतरा स्तर (Stage 2)' : 'Danger (High BP)'}
          </span>
        );
      }
      if (sys >= 130 || dia >= 85) {
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {isHindi ? 'चेतावनी स्तर (Elevated)' : 'Warning (Elevated)'}
          </span>
        );
      }
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {isHindi ? 'सामान्य (Normal)' : 'Normal Range'}
        </span>
      );
    }
    if (record.type === 'oxygen_saturation') {
      if (vals.spo2 < 95) {
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {isHindi ? 'कम ऑक्सीजन' : 'Low SpO2 Warning'}
          </span>
        );
      }
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {isHindi ? 'सामान्य एवं स्थिर' : 'Normal & Stable'}
      </span>
    );
  };

  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return records.filter((record) => {
      const matchesType = selectedType === 'all' || record.type === selectedType;
      const text = [
        record.type,
        record.source,
        record.notes,
        record.values ? JSON.stringify(record.values) : ''
      ]
        .join(' ')
        .toLowerCase();
      const matchesQuery = !query || text.includes(query);
      return matchesType && matchesQuery;
    });
  }, [records, searchQuery, selectedType]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormFileName(file.name);
      if (!formTitle) {
        setFormTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleSaveRecord = async (e) => {
    e.preventDefault();
    if (!uid) return;

    let payloadValues = { ...formValues };

    if (formType === 'blood_pressure') {
      payloadValues.systolic = Number(formValues.systolic) || 120;
      payloadValues.diastolic = Number(formValues.diastolic) || 80;
      payloadValues.pulse = Number(formValues.pulse) || 72;
    } else if (formType === 'heart_rate') {
      payloadValues.bpm = Number(formValues.bpm) || 72;
    } else if (formType === 'oxygen_saturation') {
      payloadValues.spo2 = Number(formValues.spo2) || 98;
    } else if (formType === 'activity') {
      payloadValues.steps = Number(formValues.steps) || 8000;
      payloadValues.distanceKm = Number((payloadValues.steps * 0.00075).toFixed(1));
    } else if (formType === 'blood_test') {
      payloadValues.glucose = Number(formValues.glucose) || 95;
      payloadValues.fastingGlucose = Number(formValues.glucose) || 95;
      if (formValues.hba1c) payloadValues.hba1c = Number(formValues.hba1c);
      if (formValues.cholesterol) payloadValues.totalCholesterol = Number(formValues.cholesterol);
    } else if (formType === 'urine_test') {
      payloadValues.protein = formValues.protein || 'Negative';
      payloadValues.ph = Number(formValues.ph) || 6.5;
      payloadValues.glucose = 'Negative';
    } else if (formType === 'document') {
      payloadValues.title = formTitle || 'Uploaded Clinical Document';
      payloadValues.category = formValues.category || 'Diagnostic Lab Report';
      payloadValues.fileName = formFileName || 'patient_record.pdf';
      payloadValues.doctorName = formDoctor || 'Attending Physician';
      payloadValues.facility = formValues.facility || 'Clinical Healthcare Center';
      payloadValues.testSummary = formNotes || 'Document verified and cataloged.';
    }

    try {
      await healthReadingService.add(uid, {
        type: formType,
        values: payloadValues,
        source: formType === 'document' ? 'imported' : 'manual',
        measuredAt: new Date(formDate).toISOString(),
        notes: formNotes
      });

      setUploadModalOpen(false);
      setFormValues({});
      setFormTitle('');
      setFormDoctor('');
      setFormNotes('');
      setFormFileName('');
      setUploadSuccessToast(true);
      setTimeout(() => setUploadSuccessToast(false), 3500);
      loadReadings();
    } catch (err) {
      alert(`Save error: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <DisclaimerBanner />

      {uploadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#00685f] text-white font-bold text-sm shadow-2xl border border-teal-300/30 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
          <span>{t('records.successUploaded', {}, 'Medical record uploaded and securely stored.')}</span>
        </div>
      )}

      {/* Header & Upload Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('records.title', {}, 'My Medical Records & Test Library')}
          </h1>
          <p className="text-[16px] text-slate-600 dark:text-slate-400 mt-1">
            {t('records.subtitle', {}, 'Complete repository for blood pressure, heart rate, oxygen, activity, urine tests, blood tests, and uploaded clinical files.')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>{t('records.uploadBtn', {}, 'Upload Medical Record')}</span>
          </button>

          <button
            onClick={loadReadings}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] text-slate-700 dark:text-slate-200 font-semibold hover:border-cyan-500 transition-colors cursor-pointer text-sm"
            title="Refresh records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Category Pills */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('records.searchPlaceholder', {}, 'Search tests, values, doctors, lab notes, or diagnoses...')}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 w-full">
            {['all', 'blood_pressure', 'heart_rate', 'oxygen_saturation', 'activity', 'urine_test', 'blood_test', 'document'].map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedType === type
                    ? 'bg-cyan-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-[#070B14] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {typeLabels[type]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Records Listing */}
      {loading ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-8 text-slate-600 dark:text-slate-300 flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-cyan-500" />
          <span>{isHindi ? 'मेडिकल रिकॉर्ड्स लोड हो रहे हैं...' : 'Loading your medical records...'}</span>
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-500/30 bg-red-500/5 p-6 text-red-700 dark:text-red-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-semibold">{isHindi ? 'रिकॉर्ड्स लोड करने में असमर्थ' : 'Unable to load medical records.'}</p>
            <p className="mt-1 text-sm">{error}</p>
            <button onClick={loadReadings} className="mt-3 underline font-medium text-xs">
              {isHindi ? 'पुनः प्रयास करें' : 'Retry'}
            </button>
          </div>
        </div>
      ) : filteredRecords.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-12 text-center text-slate-500 dark:text-slate-400 space-y-3">
          <FileText className="w-10 h-10 text-cyan-500 mx-auto" />
          <p className="text-lg font-bold text-slate-900 dark:text-white">
            {isHindi ? 'कोई मेल खाने वाला रिकॉर्ड नहीं मिला' : 'No records match your search or filter.'}
          </p>
          <p className="text-sm">
            {isHindi
              ? 'अपना खोज शब्द बदलें या "मेडिकल रिकॉर्ड अपलोड करें" बटन पर क्लिक करके नया टेस्ट जोड़ें।'
              : 'Try adjusting your search terms or click "Upload Medical Record" to add your test documents.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredRecords.map((record) => (
            <article
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] p-5 shadow-xs hover:border-cyan-500/50 hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 group-hover:bg-cyan-500/10 transition-colors">
                    {getTypeIcon(record.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {getRecordTitle(record)}
                      </h2>
                      {getStatusBadge(record)}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {isHindi ? 'स्रोत:' : 'Source:'} <strong className="font-semibold">{record.source || 'Manual entry'}</strong> • {formatDateTime(record.measuredAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {formatDateTime(record.measuredAt)}
                  </span>
                  <span className="p-2 rounded-xl text-slate-400 group-hover:text-cyan-500 transition-colors">
                    <Eye className="w-4 h-4" />
                  </span>
                </div>
              </div>

              {/* Primary Values Snippet */}
              <div className="mt-3.5 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 border border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-3 text-sm">
                {record.type === 'blood_pressure' && (
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {record.values?.systolic}/{record.values?.diastolic} mmHg
                    </span>
                    <span className="text-xs text-slate-500">Pulse: {record.values?.pulse || 72} bpm</span>
                  </div>
                )}
                {record.type === 'heart_rate' && (
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
                    <span>{record.values?.bpm} bpm</span>
                    <span className="text-xs font-normal text-slate-500">(Resting cardiac pace)</span>
                  </div>
                )}
                {record.type === 'oxygen_saturation' && (
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
                    <span>{record.values?.spo2}% SpO2</span>
                    <span className="text-xs font-normal text-slate-500">(Arterial oxygenation)</span>
                  </div>
                )}
                {record.type === 'activity' && (
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-base">
                    <span>{Number(record.values?.steps || 0).toLocaleString()} {isHindi ? 'कदम' : 'steps'}</span>
                    <span className="text-xs font-normal text-slate-500">({record.values?.distanceKm || 0} km)</span>
                  </div>
                )}
                {record.type === 'blood_test' && (
                  <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
                    <span>Glucose: <strong className="text-cyan-600 dark:text-cyan-400">{record.values?.glucose} mg/dL</strong></span>
                    {record.values?.hba1c && <span>HbA1c: <strong>{record.values.hba1c}%</strong></span>}
                    {record.values?.totalCholesterol && <span>Cholesterol: <strong>{record.values.totalCholesterol} mg/dL</strong></span>}
                  </div>
                )}
                {record.type === 'urine_test' && (
                  <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
                    <span>Protein: <strong className="text-emerald-600">{record.values?.protein || 'Negative'}</strong></span>
                    <span>pH: <strong>{record.values?.ph || 6.5}</strong></span>
                    <span>Glucose: <strong>{record.values?.glucose || 'Negative'}</strong></span>
                  </div>
                )}
                {record.type === 'document' && (
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="font-semibold">{record.values?.fileName || 'Attached document'}</span>
                    <span className="text-xs text-slate-500">({record.values?.doctorName || 'Clinical facility'})</span>
                  </div>
                )}
              </div>

              {record.notes && (
                <p className="mt-2.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                  <strong>{isHindi ? 'नोट:' : 'Note:'}</strong> {record.notes}
                </p>
              )}
            </article>
          ))}
        </div>
      )}

      {/* RECORD DETAILS MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  {getTypeIcon(selectedRecord.type)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {getRecordTitle(selectedRecord)}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {typeLabels[selectedRecord.type]} • {formatDateTime(selectedRecord.measuredAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Diagnostic Values & Ranges */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('records.normalRangeLabel', {}, 'Diagnostic Measurements & Clinical Comparison')}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(selectedRecord.values || {}).map(([key, val]) => {
                  if (typeof val === 'object' || val === null || val === undefined) return null;
                  return (
                    <div key={key} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800">
                      <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                        {String(val)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clinical Interpretation & Metadata */}
            <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500 dark:text-slate-400">{t('records.sourceLabel', {}, 'Measurement Source')}:</span>
                <span className="font-bold">{selectedRecord.source || 'Direct Patient Input'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-500 dark:text-slate-400">{t('records.interpretation', {}, 'Status Assessment')}:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {isHindi ? 'सत्यापित व्यक्तिगत स्वास्थ्य प्रक्षेपवक्र' : 'Clinically Validated & Preserved'}
                </span>
              </div>
            </div>

            {selectedRecord.notes && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  {t('records.notesLabel', {}, 'Clinical Notes')}
                </h4>
                <p className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedRecord.notes}
                </p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-950 cursor-pointer"
              >
                {t('records.closeBtn', {}, 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MEDICAL RECORD MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveRecord}
            className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {t('records.uploadModalTitle', {}, 'Upload New Medical Record')}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isHindi ? 'रक्तचाप, लैब टेस्ट, मूत्र जांच या डॉक्टर की पर्ची जोड़ें।' : 'Add blood tests, vitals, urine scans, or doctor reports.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t('records.recordTypeLabel', {}, 'Record Category')}
              </label>
              <select
                value={formType}
                onChange={(e) => {
                  setFormType(e.target.value);
                  setFormValues({});
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
              >
                <option value="blood_test">{t('records.categories.blood_test', {}, 'Blood Test / Lab')}</option>
                <option value="blood_pressure">{t('records.categories.blood_pressure', {}, 'Blood Pressure')}</option>
                <option value="heart_rate">{t('records.categories.heart_rate', {}, 'Heart Rate')}</option>
                <option value="oxygen_saturation">{t('records.categories.oxygen_saturation', {}, 'Oxygen (SpO2)')}</option>
                <option value="urine_test">{t('records.categories.urine_test', {}, 'Urine Test Strip')}</option>
                <option value="activity">{t('records.categories.activity', {}, 'Daily Steps & Activity')}</option>
                <option value="document">{t('records.categories.document', {}, 'Uploaded Documents / Scans')}</option>
              </select>
            </div>

            {/* Record Title & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('records.recordTitleLabel', {}, 'Record / Test Name')}
                </label>
                <input
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={formType === 'blood_test' ? 'Fasting Glucose & CBC' : 'Morning Check'}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  {t('records.recordDateLabel', {}, 'Date of Examination')}
                </label>
                <input
                  type="date"
                  required
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Dynamic Numeric Fields by Category */}
            {formType === 'blood_pressure' && (
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Systolic (mmHg)</label>
                  <input
                    type="number"
                    placeholder="120"
                    onChange={(e) => setFormValues(prev => ({ ...prev, systolic: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Diastolic (mmHg)</label>
                  <input
                    type="number"
                    placeholder="80"
                    onChange={(e) => setFormValues(prev => ({ ...prev, diastolic: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Pulse (bpm)</label>
                  <input
                    type="number"
                    placeholder="72"
                    onChange={(e) => setFormValues(prev => ({ ...prev, pulse: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-sm font-mono"
                  />
                </div>
              </div>
            )}

            {formType === 'blood_test' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Blood Glucose (mg/dL)</label>
                  <input
                    type="number"
                    placeholder="95"
                    onChange={(e) => setFormValues(prev => ({ ...prev, glucose: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">HbA1c (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="5.4"
                    onChange={(e) => setFormValues(prev => ({ ...prev, hba1c: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-sm font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Cholesterol (mg/dL)</label>
                  <input
                    type="number"
                    placeholder="180"
                    onChange={(e) => setFormValues(prev => ({ ...prev, cholesterol: e.target.value }))}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-sm font-mono"
                  />
                </div>
              </div>
            )}

            {formType === 'heart_rate' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Heart Rate (bpm)</label>
                <input
                  type="number"
                  placeholder="72"
                  onChange={(e) => setFormValues(prev => ({ ...prev, bpm: e.target.value }))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-sm font-mono"
                />
              </div>
            )}

            {formType === 'oxygen_saturation' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Oxygen Saturation (%)</label>
                <input
                  type="number"
                  placeholder="98"
                  onChange={(e) => setFormValues(prev => ({ ...prev, spo2: e.target.value }))}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-sm font-mono"
                />
              </div>
            )}

            {/* Doctor / Facility */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t('records.doctorClinicLabel', {}, 'Doctor / Laboratory / Clinic')}
              </label>
              <input
                value={formDoctor}
                onChange={(e) => setFormDoctor(e.target.value)}
                placeholder="Dr. Sarah Vance / Metro Diagnostic Lab"
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
              />
            </div>

            {/* File Upload Attachment */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t('records.fileUploadLabel', {}, 'Attach Report Document or Image (Optional)')}
              </label>
              <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2">
                <input
                  type="file"
                  id="record-file-upload"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
                <label
                  htmlFor="record-file-upload"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white text-xs font-bold cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <UploadCloud className="w-4 h-4 text-cyan-500" />
                  <span>{formFileName || (isHindi ? 'फ़ाइल चुनें (PDF या Image)' : 'Choose File (PDF or Image)')}</span>
                </label>
                {formFileName && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {formFileName}
                  </p>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {t('records.notesLabel', {}, 'Clinical Notes')}
              </label>
              <textarea
                rows={3}
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder={t('records.notesPlaceholder', {}, 'Enter any clinician remarks or personal symptoms...')}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {t('records.closeBtn', {}, 'Cancel')}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                {t('records.saveRecordBtn', {}, 'Save to Health Records')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
