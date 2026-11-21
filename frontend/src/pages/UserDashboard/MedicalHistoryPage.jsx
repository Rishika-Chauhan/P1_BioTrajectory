
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  FileText,
  UploadCloud,
  X,
  Search,
  CheckCircle2,
  RefreshCw,
  Droplet,
  FileSpreadsheet,
  Scan,
  Pill,
  Stethoscope,
  Calendar,
  Building,
  User,
  Eye,
  AlertCircle,
  Filter,
  ArrowRight,
  Printer
} from 'lucide-react';

import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { healthReadingService } from '../../services/healthReadingService';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

const toDate = (value) => {
  if (!value) return null;

  if (typeof value.toDate === 'function') {
    return value.toDate();
  }

  if (typeof value.seconds === 'number') {
    return new Date(value.seconds * 1000);
  }

  const date = value instanceof Date ? value : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const RECORD_TYPES = [
  'blood_test',
  'urine_test',
  'imaging_scan',
  'prescription',
  'clinical_note',
  'document'
];

export default function MedicalHistoryPage() {
  const { currentUser } = useAuth();
  const { isHindi } = useLanguage();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [notification, setNotification] = useState('');

  const [formType, setFormType] = useState('blood_test');
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(getLocalDateString());
  const [formDoctor, setFormDoctor] = useState('');
  const [formFacility, setFormFacility] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const loadRecords = useCallback(async () => {
    if (!currentUser?.uid) {
      setRecords([]);
      setLoadError(
        isHindi
          ? 'रिकॉर्ड देखने के लिए लॉगिन करें।'
          : 'Please sign in to view your medical records.'
      );
      setLoading(false);
      return;
    }

    setLoading(true);
    setLoadError('');

    try {
      const data = await healthReadingService.listMedicalRecords(
        currentUser.uid,
        100
      );

      const clinicalOnly = (data || []).filter(
        (record) =>
          ![
            'blood_pressure',
            'activity',
            'heart_rate',
            'oxygen_saturation'
          ].includes(record.type)
      );

      clinicalOnly.sort((a, b) => {
        const dateA = toDate(a.measuredAt) || new Date(0);
        const dateB = toDate(b.measuredAt) || new Date(0);

        return dateB - dateA;
      });

      setRecords(clinicalOnly);
    } catch (error) {
      console.error('Failed to load medical records:', error);

      setRecords([]);
      setLoadError(
        isHindi
          ? 'मेडिकल रिकॉर्ड लोड नहीं हो सके। कृपया दोबारा प्रयास करें।'
          : 'Unable to load medical records. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid, isHindi]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);

    try {
      await loadRecords();
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      if (
        selectedCategory !== 'all' &&
        record.type !== selectedCategory
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const values = record.values || {};

        const searchableFields = [
          record.title,
          values.title,
          record.doctorName,
          values.doctorName,
          record.facility,
          values.facility,
          record.notes,
          record.category
        ];

        return searchableFields.some((field) =>
          String(field || '').toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [records, selectedCategory, searchQuery]);

  const categories = [
    {
      id: 'all',
      label: isHindi ? 'सभी रिकॉर्ड्स' : 'All Records',
      count: records.length
    },
    {
      id: 'blood_test',
      label: isHindi ? 'रक्त परीक्षण एवं लैब' : 'Blood Tests & Labs',
      count: records.filter((r) => r.type === 'blood_test').length
    },
    {
      id: 'urine_test',
      label: isHindi ? 'मूत्र परीक्षण रिपोर्ट' : 'Urine Test Reports',
      count: records.filter((r) => r.type === 'urine_test').length
    },
    {
      id: 'imaging_scan',
      label: isHindi ? 'जांच स्कैन एवं इमेजिंग' : 'Diagnostic Scans',
      count: records.filter((r) => r.type === 'imaging_scan').length
    },
    {
      id: 'prescription',
      label: isHindi ? 'डॉक्टर के पर्चे (Rx)' : 'Doctor Prescriptions',
      count: records.filter((r) => r.type === 'prescription').length
    },
    {
      id: 'clinical_note',
      label: isHindi ? 'क्लिनिकल सारांश' : 'Clinical Summaries',
      count: records.filter((r) => r.type === 'clinical_note').length
    },
    {
      id: 'document',
      label: isHindi ? 'मेडिकल दस्तावेज़' : 'Medical Documents',
      count: records.filter((r) => r.type === 'document').length
    }
  ];

  const getRecordTypeIcon = (type) => {
    switch (type) {
      case 'blood_test':
        return <Droplet className="w-5 h-5 text-rose-500" />;

      case 'urine_test':
        return <Droplet className="w-5 h-5 text-amber-500" />;

      case 'imaging_scan':
        return (
          <Scan className="w-5 h-5 text-[#2672A8] dark:text-[#A9D6F5]" />
        );

      case 'prescription':
        return <Pill className="w-5 h-5 text-emerald-500" />;

      case 'clinical_note':
        return <Stethoscope className="w-5 h-5 text-purple-500" />;

      default:
        return <FileSpreadsheet className="w-5 h-5 text-sky-500" />;
    }
  };

  const getRecordTypeLabel = (type) => {
    switch (type) {
      case 'blood_test':
        return isHindi ? 'रक्त परीक्षण' : 'Blood Laboratory Panel';

      case 'urine_test':
        return isHindi ? 'मूत्र परीक्षण रिपोर्ट' : 'Urinalysis Report';

      case 'imaging_scan':
        return isHindi ? 'इमेजिंग एवं स्कैन' : 'Diagnostic Imaging & Scan';

      case 'prescription':
        return isHindi ? 'पर्चा (Rx)' : 'Prescription';

      case 'clinical_note':
        return isHindi ? 'क्लिनिकल परामर्श' : 'Clinical Consultation Note';

      default:
        return isHindi ? 'मेडिकल दस्तावेज़' : 'Medical Document';
    }
  };

  const resetForm = () => {
    setFormType('blood_test');
    setFormTitle('');
    setFormDate(getLocalDateString());
    setFormDoctor('');
    setFormFacility('');
    setFormNotes('');
  };

  const handleSaveRecord = async (event) => {
    event.preventDefault();

    if (!currentUser?.uid) {
      alert(
        isHindi
          ? 'रिकॉर्ड सहेजने के लिए लॉगिन करें।'
          : 'Please sign in before saving a medical record.'
      );
      return;
    }

    if (!formTitle.trim()) {
      alert(
        isHindi
          ? 'रिकॉर्ड का शीर्षक दर्ज करें।'
          : 'Please enter a record title.'
      );
      return;
    }

    if (!RECORD_TYPES.includes(formType)) {
      alert('Invalid record category.');
      return;
    }

    if (
      !formDate ||
      Number.isNaN(Date.parse(`${formDate}T00:00:00`))
    ) {
      alert(
        isHindi
          ? 'कृपया सही तारीख चुनें।'
          : 'Please select a valid date.'
      );
      return;
    }

    const today = getLocalDateString();

    if (formDate > today) {
      alert(
        isHindi
          ? 'भविष्य की तारीख स्वीकार नहीं है।'
          : 'A future examination date is not allowed.'
      );
      return;
    }

    const selectedDate = new Date(`${formDate}T12:00:00`);

    if (Number.isNaN(selectedDate.getTime())) {
      alert(
        isHindi
          ? 'कृपया सही तारीख चुनें।'
          : 'Please select a valid date.'
      );
      return;
    }

    setFormSubmitting(true);

    try {
      const values = {
        title: formTitle.trim()
      };

      if (formDoctor.trim()) {
        values.doctorName = formDoctor.trim();
      }

      if (formFacility.trim()) {
        values.facility = formFacility.trim();
      }

      await healthReadingService.addMedicalRecord(currentUser.uid, {
        type: formType,
        measuredAt: selectedDate.toISOString(),
        notes: formNotes.trim(),
        values
      });

      setUploadModalOpen(false);
      resetForm();

      setNotification(
        isHindi
          ? 'मेडिकल रिकॉर्ड सफलतापूर्वक सहेजा गया।'
          : 'Medical record saved successfully.'
      );

      window.setTimeout(() => {
        setNotification('');
      }, 4000);

      await loadRecords();
    } catch (error) {
      console.error('Failed to save medical record:', error);

      alert(
        error?.message ||
          (isHindi
            ? 'रिकॉर्ड सहेजा नहीं जा सका।'
            : 'Unable to save the medical record.')
      );
    } finally {
      setFormSubmitting(false);
    }
  };

  const getRecordTitle = (record) =>
    record.title ||
    record.values?.title ||
    (isHindi ? 'मेडिकल रिकॉर्ड' : 'Medical Record');

  const getRecordDoctor = (record) =>
    record.doctorName || record.values?.doctorName || '';

  const getRecordFacility = (record) =>
    record.facility || record.values?.facility || '';

  return (
    <div className="space-y-8 animate-fade-in p-2 sm:p-4 max-w-7xl mx-auto">

      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>{notification}</span>
          </div>

          <button
            onClick={() => setNotification('')}
            className="p-1 hover:opacity-75"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HEADER */}

      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#A9D6F5]/40 text-[#1F150E] dark:bg-[#A9D6F5]/20 dark:text-[#A9D6F5]">
              {isHindi ? 'मेडिकल लाइब्रेरी' : 'Medical Library'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1F150E] dark:text-[#F6F0E4] mt-1">
            {isHindi
              ? 'मेरे मेडिकल रिकॉर्ड्स एवं टेस्ट लाइब्रेरी'
              : 'My Medical Records & Test Library'}
          </h1>

          <p className="text-sm text-[#6B4F3A] dark:text-[#D5BF86] mt-1 max-w-3xl">
            {isHindi
              ? 'अपने मेडिकल रिकॉर्ड, लैब रिपोर्ट, स्कैन, पर्चे और क्लिनिकल नोट्स देखें।'
              : 'View your medical records, laboratory reports, scans, prescriptions, and clinical notes.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button
            onClick={handleManualRefresh}
            disabled={loading || isRefreshing}
            type="button"
            className="p-3 rounded-2xl bg-white dark:bg-[#2B1E15] border border-[#E8DFD1] dark:border-[#4A3525] text-[#6B4F3A] dark:text-[#D5BF86] hover:border-[#A9D6F5] shadow-xs transition-all active:scale-95 disabled:opacity-60"
            title={isHindi ? 'रिफ्रेश करें' : 'Refresh Records'}
          >
            <RefreshCw
              className={`w-5 h-5 ${
                loading || isRefreshing
                  ? 'animate-spin text-[#2672A8] dark:text-[#A9D6F5]'
                  : ''
              }`}
            />
          </button>

          <button
            onClick={() => setUploadModalOpen(true)}
            disabled={!currentUser?.uid}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm bg-[#A9D6F5] text-[#1F150E] hover:bg-[#7CBFEA] shadow-md shadow-sky-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UploadCloud className="w-5 h-5" />
            <span>
              {isHindi ? 'नया मेडिकल रिकॉर्ड जोड़ें' : 'Add Medical Record'}
            </span>
          </button>
        </div>
      </section>

      {/* INFORMATION BANNER */}

      <div className="p-4 sm:p-5 rounded-3xl bg-[#F6F0E4]/80 dark:bg-[#2B1E15]/80 border border-[#E8DFD1] dark:border-[#4A3525] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-3 text-[#6B4F3A] dark:text-[#D5BF86]">
          <AlertCircle className="w-5 h-5 text-[#2672A8] dark:text-[#A9D6F5] shrink-0" />

          <span>
            {isHindi
              ? 'दैनिक रक्तचाप, हृदय गति और गतिविधि अलग से हेल्थ एनालिटिक्स में ट्रैक किए जाते हैं। इस लाइब्रेरी में मेडिकल रिकॉर्ड दिखाए जाते हैं।'
              : 'Daily blood pressure, heart rate, and activity are tracked separately in Health Analytics. This library displays medical records.'}
          </span>
        </div>

        <Link
          to="/dashboard/analytics"
          className="inline-flex items-center gap-1 font-bold text-[#2672A8] dark:text-[#A9D6F5] hover:underline whitespace-nowrap self-start sm:self-auto"
        >
          <span>{isHindi ? 'स्वास्थ्य ग्राफ़ देखें' : 'View Health Analytics'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* SEARCH AND FILTERS */}

      <section className="p-5 rounded-3xl bg-white dark:bg-[#2B1E15] border border-[#E8DFD1] dark:border-[#4A3525] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B4F3A]/60 dark:text-[#D5BF86]/60" />

            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={
                isHindi
                  ? 'टेस्ट, डॉक्टर, या क्लिनिक का नाम खोजें...'
                  : 'Search tests, doctors, clinics, or records...'
              }
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-[#1F150E] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#A9D6F5]"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="text-xs font-semibold text-[#6B4F3A] dark:text-[#D5BF86] flex items-center gap-1">
            <Filter className="w-4 h-4 text-[#2672A8] dark:text-[#A9D6F5]" />
            <span>
              {filteredRecords.length}{' '}
              {isHindi ? 'रिकॉर्ड मिले' : 'records found'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E8DFD1]/60 dark:border-[#4A3525]/60">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              type="button"
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-[#A9D6F5] text-[#1F150E] shadow-sm'
                  : 'bg-[#F6F0E4] dark:bg-[#1F150E] text-[#6B4F3A] dark:text-[#D5BF86] hover:bg-[#E8DFD1] dark:hover:bg-[#4A3525]'
              }`}
            >
              <span>{category.label}</span>

              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/5 dark:bg-white/10">
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* RECORD LIST */}

      <section className="space-y-4">
        {loading ? (
          <div className="rounded-3xl border border-[#E8DFD1] dark:border-[#4A3525] bg-white dark:bg-[#2B1E15] p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#A9D6F5] mx-auto" />

            <p className="font-bold text-[#1F150E] dark:text-white">
              {isHindi
                ? 'मेडिकल रिकॉर्ड्स लोड हो रहे हैं...'
                : 'Loading medical records...'}
            </p>
          </div>
        ) : loadError ? (
          <div className="rounded-3xl border border-red-300 dark:border-red-900 bg-white dark:bg-[#2B1E15] p-10 text-center space-y-4">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />

            <p className="text-sm text-red-600 dark:text-red-400">
              {loadError}
            </p>

            <button
              onClick={loadRecords}
              type="button"
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#A9D6F5] text-[#1F150E]"
            >
              {isHindi ? 'दोबारा प्रयास करें' : 'Try Again'}
            </button>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#E8DFD1] dark:border-[#4A3525] bg-white dark:bg-[#2B1E15] p-12 text-center space-y-4">
            <FileText className="w-12 h-12 text-[#A9D6F5] mx-auto" />

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#1F150E] dark:text-white">
                {isHindi
                  ? 'कोई मेडिकल रिकॉर्ड नहीं मिला'
                  : 'No medical records found'}
              </h3>

              <p className="text-sm text-[#6B4F3A] dark:text-[#D5BF86] max-w-md mx-auto">
                {isHindi
                  ? 'अलग फ़िल्टर चुनें या नया मेडिकल रिकॉर्ड जोड़ें।'
                  : 'Try another filter or add a new medical record.'}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              type="button"
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#F6F0E4] dark:bg-[#1F150E] text-[#1F150E] dark:text-[#F6F0E4] border border-[#E8DFD1] dark:border-[#4A3525]"
            >
              {isHindi ? 'फ़िल्टर साफ़ करें' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRecords.map((record) => {
              const values = record.values || {};
              const doctor = getRecordDoctor(record);
              const facility = getRecordFacility(record);
              const recordDate = toDate(record.measuredAt);

              return (
                <article
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className="rounded-3xl border border-[#E8DFD1] dark:border-[#4A3525] bg-white dark:bg-[#2B1E15] p-6 shadow-xs hover:border-[#A9D6F5] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="p-3.5 rounded-2xl bg-[#F6F0E4] dark:bg-[#1F150E] group-hover:bg-[#A9D6F5]/25 transition-colors shrink-0">
                        {getRecordTypeIcon(record.type)}
                      </div>

                      <div className="space-y-2 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-bold text-[#1F150E] dark:text-white group-hover:text-[#2672A8] dark:group-hover:text-[#A9D6F5] transition-colors">
                            {getRecordTitle(record)}
                          </h3>

                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {isHindi ? 'असत्यापित' : 'Not Verified'}
                          </span>
                        </div>

                        <p className="text-xs text-[#6B4F3A] dark:text-[#D5BF86] flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-semibold text-[#2672A8] dark:text-[#A9D6F5]">
                            {getRecordTypeLabel(record.type)}
                          </span>

                          {recordDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {recordDate.toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          )}

                          {doctor && (
                            <span className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5" />
                              {doctor}
                            </span>
                          )}

                          {facility && (
                            <span className="flex items-center gap-1">
                              <Building className="w-3.5 h-3.5" />
                              {facility}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E8DFD1]/60 dark:border-[#4A3525]/60 shrink-0">
                      {record.type === 'prescription' &&
                        Array.isArray(values.medications) && (
                          <span className="hidden sm:inline-block px-3 py-1 rounded-xl bg-[#F6F0E4] dark:bg-[#1F150E] text-[11px] font-semibold text-[#1F150E] dark:text-[#F6F0E4] border border-[#E8DFD1] dark:border-[#4A3525]">
                            {values.medications.length}{' '}
                            {isHindi ? 'दवाएं' : 'Medications'}
                          </span>
                        )}

                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedRecord(record);
                        }}
                        type="button"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#A9D6F5]/40 hover:bg-[#A9D6F5] text-[#1F150E] dark:bg-[#A9D6F5]/20 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {isHindi ? 'विवरण देखें' : 'View Details'}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* RECORD DETAILS MODAL */}

      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#2B1E15] border border-[#E8DFD1] dark:border-[#4A3525] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">

            <div className="flex items-start justify-between pb-4 border-b border-[#E8DFD1] dark:border-[#4A3525]">
              <div className="flex items-center gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F6F0E4] dark:bg-[#1F150E]">
                  {getRecordTypeIcon(selectedRecord.type)}
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1F150E] dark:text-white">
                    {getRecordTitle(selectedRecord)}
                  </h3>

                  <p className="text-xs text-[#6B4F3A] dark:text-[#D5BF86] mt-0.5">
                    {getRecordTypeLabel(selectedRecord.type)}
                    {' • '}
                    {toDate(selectedRecord.measuredAt)?.toLocaleDateString(
                      'en-IN',
                      {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }
                    ) || (isHindi ? 'तिथि उपलब्ध नहीं' : 'Date unavailable')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                type="button"
                className="p-2 rounded-xl text-[#6B4F3A] dark:text-[#D5BF86] hover:bg-[#F6F0E4] dark:hover:bg-[#1F150E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {isHindi
                ? 'यह रिकॉर्ड स्वतंत्र रूप से चिकित्सकीय रूप से सत्यापित नहीं है।'
                : 'This record has not been independently clinically verified.'}
            </div>

            {/* DOCTOR AND FACILITY */}

            {(getRecordDoctor(selectedRecord) ||
              getRecordFacility(selectedRecord)) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-xs">

                {getRecordDoctor(selectedRecord) && (
                  <div className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-[#2672A8] dark:text-[#A9D6F5]" />

                    <div>
                      <p className="font-bold text-[#1F150E] dark:text-white">
                        {getRecordDoctor(selectedRecord)}
                      </p>
                      <p className="text-[#6B4F3A] dark:text-[#D5BF86]">
                        {isHindi ? 'चिकित्सक' : 'Doctor / Clinician'}
                      </p>
                    </div>
                  </div>
                )}

                {getRecordFacility(selectedRecord) && (
                  <div className="flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-[#2672A8] dark:text-[#A9D6F5]" />

                    <div>
                      <p className="font-bold text-[#1F150E] dark:text-white">
                        {getRecordFacility(selectedRecord)}
                      </p>
                      <p className="text-[#6B4F3A] dark:text-[#D5BF86]">
                        {isHindi ? 'अस्पताल / प्रयोगशाला' : 'Facility'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* FINDINGS */}

            {Array.isArray(selectedRecord.findings) &&
              selectedRecord.findings.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B4F3A] dark:text-[#D5BF86]">
                    {isHindi ? 'दर्ज किए गए परिणाम' : 'Recorded Findings'}
                  </h4>

                  <div className="rounded-2xl border border-[#E8DFD1] dark:border-[#4A3525] overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F6F0E4] dark:bg-[#1F150E] text-[#6B4F3A] dark:text-[#D5BF86]">
                        <tr>
                          <th className="p-3 font-bold">
                            {isHindi ? 'पैरामीटर' : 'Parameter'}
                          </th>
                          <th className="p-3 font-bold">
                            {isHindi ? 'दर्ज मान' : 'Recorded Value'}
                          </th>
                          <th className="p-3 font-bold">
                            {isHindi ? 'संदर्भ सीमा' : 'Reference Range'}
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#E8DFD1] dark:divide-[#4A3525]">
                        {selectedRecord.findings.map((finding, index) => (
                          <tr key={index}>
                            <td className="p-3 font-semibold text-[#1F150E] dark:text-white">
                              {finding.name || '—'}
                            </td>

                            <td className="p-3 font-mono font-bold text-[#2672A8] dark:text-[#A9D6F5]">
                              {finding.value || '—'}
                            </td>

                            <td className="p-3 text-[#6B4F3A] dark:text-[#D5BF86]">
                              {finding.range || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {/* PRESCRIPTIONS */}

            {selectedRecord.type === 'prescription' &&
              Array.isArray(selectedRecord.values?.medications) &&
              selectedRecord.values.medications.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B4F3A] dark:text-[#D5BF86]">
                    {isHindi ? 'दर्ज दवाएं' : 'Recorded Medications'}
                  </h4>

                  <div className="space-y-2">
                    {selectedRecord.values.medications.map(
                      (medication, index) => (
                        <div
                          key={index}
                          className="p-3.5 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-xs"
                        >
                          <p className="font-bold text-[#1F150E] dark:text-white text-sm">
                            {medication.name || '—'}
                          </p>

                          <p className="text-[#6B4F3A] dark:text-[#D5BF86]">
                            {medication.frequency || '—'}
                          </p>

                          <p className="text-[#2672A8] dark:text-[#A9D6F5] mt-1">
                            {medication.dosage || '—'}
                            {medication.duration
                              ? ` • ${medication.duration}`
                              : ''}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* NOTES */}

            {selectedRecord.notes && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B4F3A] dark:text-[#D5BF86]">
                  {isHindi ? 'टिप्पणियां' : 'Notes'}
                </h4>

                <p className="p-4 rounded-2xl bg-[#F6F0E4]/50 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-sm text-[#1F150E] dark:text-white leading-relaxed whitespace-pre-wrap">
                  {selectedRecord.notes}
                </p>
              </div>
            )}

            {/* ACTIONS */}

            <div className="pt-3 flex items-center justify-between gap-3 border-t border-[#E8DFD1] dark:border-[#4A3525]">
              <button
                onClick={() => window.print()}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F6F0E4] dark:bg-[#1F150E] text-[#1F150E] dark:text-white font-bold text-xs border border-[#E8DFD1] dark:border-[#4A3525]"
              >
                <Printer className="w-3.5 h-3.5" />
                {isHindi ? 'प्रिंट करें' : 'Print'}
              </button>

              <button
                onClick={() => setSelectedRecord(null)}
                type="button"
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#1F150E] dark:bg-white text-white dark:text-[#1F150E]"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD RECORD MODAL */}

      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <form
            onSubmit={handleSaveRecord}
            className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#2B1E15] border border-[#E8DFD1] dark:border-[#4A3525] shadow-2xl p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between pb-3 border-b border-[#E8DFD1] dark:border-[#4A3525]">
              <div>
                <h3 className="text-xl font-bold text-[#1F150E] dark:text-white">
                  {isHindi ? 'नया मेडिकल रिकॉर्ड जोड़ें' : 'Add Medical Record'}
                </h3>

                <p className="text-xs text-[#6B4F3A] dark:text-[#D5BF86] mt-1">
                  {isHindi
                    ? 'केवल वास्तविक जानकारी दर्ज करें।'
                    : 'Enter information from your actual medical record.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-2 rounded-xl text-[#6B4F3A] dark:text-[#D5BF86] hover:bg-[#F6F0E4] dark:hover:bg-[#1F150E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CATEGORY */}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F150E] dark:text-[#F6F0E4]">
                {isHindi ? 'रिकॉर्ड श्रेणी' : 'Record Category'}
              </label>

              <select
                value={formType}
                onChange={(event) => setFormType(event.target.value)}
                className="w-full p-3 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-[#1F150E] dark:text-white text-sm"
              >
                <option value="blood_test">Blood Tests & Labs</option>
                <option value="urine_test">Urine Analysis Reports</option>
                <option value="imaging_scan">Diagnostic Scans & Imaging</option>
                <option value="prescription">Doctor Prescriptions</option>
                <option value="clinical_note">Clinical Notes</option>
                <option value="document">Medical Documents</option>
              </select>
            </div>

            {/* TITLE AND DATE */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F150E] dark:text-[#F6F0E4]">
                  {isHindi ? 'रिकॉर्ड का शीर्षक' : 'Record Title'}
                </label>

                <input
                  required
                  maxLength={120}
                  value={formTitle}
                  onChange={(event) => setFormTitle(event.target.value)}
                  placeholder="e.g., Complete Blood Count (CBC)"
                  className="w-full p-3 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-[#1F150E] dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F150E] dark:text-[#F6F0E4]">
                  {isHindi ? 'जांच तिथि' : 'Examination Date'}
                </label>

                <input
                  type="date"
                  required
                  max={getLocalDateString()}
                  value={formDate}
                  onChange={(event) => setFormDate(event.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-[#1F150E] dark:text-white text-sm"
                />
              </div>
            </div>

            {/* DOCTOR AND FACILITY */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F150E] dark:text-[#F6F0E4]">
                  {isHindi ? 'चिकित्सक का नाम' : 'Doctor Name (Optional)'}
                </label>

                <input
                  maxLength={120}
                  value={formDoctor}
                  onChange={(event) => setFormDoctor(event.target.value)}
                  placeholder="Enter actual doctor name"
                  className="w-full p-3 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-[#1F150E] dark:text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F150E] dark:text-[#F6F0E4]">
                  {isHindi ? 'अस्पताल / लैब' : 'Hospital / Lab (Optional)'}
                </label>

                <input
                  maxLength={150}
                  value={formFacility}
                  onChange={(event) => setFormFacility(event.target.value)}
                  placeholder="Enter actual facility name"
                  className="w-full p-3 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-[#1F150E] dark:text-white text-sm"
                />
              </div>
            </div>

            {/* NOTES */}

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F150E] dark:text-[#F6F0E4]">
                {isHindi ? 'टिप्पणियां' : 'Notes (Optional)'}
              </label>

              <textarea
                rows={3}
                maxLength={2000}
                value={formNotes}
                onChange={(event) => setFormNotes(event.target.value)}
                placeholder={
                  isHindi
                    ? 'रिकॉर्ड से संबंधित वास्तविक जानकारी दर्ज करें...'
                    : 'Enter notes from your actual medical record...'
                }
                className="w-full p-3 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-[#1F150E] dark:text-white text-sm"
              />
            </div>

            {/* FILE STORAGE NOTICE */}

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-700 dark:text-amber-300 flex gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />

              <span>
                {isHindi
                  ? 'फ़ाइल अटैचमेंट अभी उपलब्ध नहीं है। वास्तविक फ़ाइल स्टोरेज कॉन्फ़िगर होने के बाद यह सुविधा जोड़ी जाएगी।'
                  : 'File attachments are temporarily unavailable. Actual file upload and download will be enabled after secure file storage is configured.'}
              </span>
            </div>

            {/* ACTIONS */}

            <div className="pt-2 flex justify-end gap-3 border-t border-[#E8DFD1] dark:border-[#4A3525]">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-[#E8DFD1] dark:border-[#4A3525] text-[#6B4F3A]"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={formSubmitting}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#A9D6F5] text-[#1F150E] hover:bg-[#7CBFEA] disabled:opacity-50"
              >
                {formSubmitting
                  ? isHindi
                    ? 'सहेज रहे हैं...'
                    : 'Saving...'
                  : isHindi
                    ? 'रिकॉर्ड सहेजें'
                    : 'Save Record'}
              </button>
            </div>
          </form>
        </div>
      )}

      <DisclaimerBanner
        text={
          isHindi
            ? 'सूचना: BioTrajectory एक स्वास्थ्य ट्रैकिंग और शैक्षिक मंच है। यह चिकित्सा निदान, उपचार योजनाएं या आपातकालीन देखभाल प्रदान नहीं करता है। हमेशा अपने लाइसेंस प्राप्त चिकित्सक से परामर्श करें।'
            : 'Notice: BioTrajectory is a health tracking and educational platform. It does not provide medical diagnoses, treatment plans, or emergency care. Always consult a licensed doctor for your medical decisions.'
        }
      />
    </div>
  );
}
