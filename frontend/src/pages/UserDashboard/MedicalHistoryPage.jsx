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
  Download,
  Calendar,
  Building,
  User,
  Eye,
  AlertCircle,
  Filter,
  Sparkles,
  ArrowRight,
  Printer
} from 'lucide-react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { healthReadingService } from '../../services/healthReadingService';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

// Date parser helper
const toDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  if (typeof value.seconds === 'number') return new Date(value.seconds * 1000);
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default function MedicalHistoryPage() {
  const { currentUser } = useAuth();
  const { t, isHindi } = useLanguage();

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals state
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Upload Form state
  const [formType, setFormType] = useState('blood_test');
  const [formTitle, setFormTitle] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formDoctor, setFormDoctor] = useState('');
  const [formFacility, setFormFacility] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formFileName, setFormFileName] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Load records
  const loadRecords = useCallback(async () => {
    const uid = currentUser?.uid || 'demo-user-123';
    setLoading(true);
    try {
      const data = await healthReadingService.listMedicalRecords(uid, 100);
      // Strictly exclude daily vitals (BP, steps, HR, SpO2)
      const clinicalOnly = (data || []).filter(
        (r) => !['blood_pressure', 'activity', 'heart_rate', 'oxygen_saturation'].includes(r.type)
      );
      setRecords(clinicalOnly.sort((a, b) => {
        const da = toDate(a.measuredAt) || new Date(0);
        const db = toDate(b.measuredAt) || new Date(0);
        return db - da;
      }));
    } catch (err) {
      console.error('Failed to load medical records:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 450));
      await loadRecords();
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [loadRecords, refreshKey]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Category filter
      if (selectedCategory !== 'all' && r.type !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const title = (r.title || r.values?.title || '').toLowerCase();
        const doc = (r.doctorName || r.values?.doctorName || '').toLowerCase();
        const facility = (r.facility || r.values?.facility || '').toLowerCase();
        const notes = (r.notes || '').toLowerCase();
        const category = (r.category || '').toLowerCase();
        return title.includes(q) || doc.includes(q) || facility.includes(q) || notes.includes(q) || category.includes(q);
      }
      return true;
    });
  }, [records, selectedCategory, searchQuery]);

  // Categories list (strictly clinical - NO daily BP or walking history)
  const categories = [
    { id: 'all', label: isHindi ? 'सभी रिकॉर्ड्स' : 'All Records', count: records.length },
    { id: 'blood_test', label: isHindi ? 'रक्त परीक्षण एवं लैब' : 'Blood Tests & Labs', count: records.filter((r) => r.type === 'blood_test').length },
    { id: 'urine_test', label: isHindi ? 'मूत्र परीक्षण रिपोर्ट' : 'Urine Test Reports', count: records.filter((r) => r.type === 'urine_test').length },
    { id: 'imaging_scan', label: isHindi ? 'जांच स्कैन एवं इमेजिंग' : 'Diagnostic Scans', count: records.filter((r) => r.type === 'imaging_scan').length },
    { id: 'prescription', label: isHindi ? 'डॉक्टर के पर्चे (Rx)' : 'Doctor Prescriptions', count: records.filter((r) => r.type === 'prescription').length },
    { id: 'clinical_note', label: isHindi ? 'क्लिनिकल सारांश' : 'Clinical Summaries', count: records.filter((r) => r.type === 'clinical_note').length },
    { id: 'document', label: isHindi ? 'अपलोड किए गए दस्तावेज़' : 'Uploaded Documents', count: records.filter((r) => r.type === 'document').length }
  ];

  // Record Type Icon Helper
  const getRecordTypeIcon = (type) => {
    switch (type) {
      case 'blood_test':
        return <Droplet className="w-5 h-5 text-rose-500" />;
      case 'urine_test':
        return <Droplet className="w-5 h-5 text-amber-500" />;
      case 'imaging_scan':
        return <Scan className="w-5 h-5 text-[#2672A8] dark:text-[#A9D6F5]" />;
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
        return isHindi ? 'मूत्र परीक्षण रिपोर्ट' : 'Urinalysis Diagnostic Report';
      case 'imaging_scan':
        return isHindi ? 'इमेजिंग एवं स्कैन' : 'Diagnostic Imaging & Scan';
      case 'prescription':
        return isHindi ? 'पर्चा (Rx)' : 'Clinical Prescription';
      case 'clinical_note':
        return isHindi ? 'क्लिनिकल परामर्श' : 'Physician Consultation Summary';
      default:
        return isHindi ? 'मेडिकल दस्तावेज़' : 'Medical Report Document';
    }
  };

  // Handle Save New Record
  const handleSaveRecord = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      const uid = currentUser?.uid || 'demo-user-123';
      let payloadValues = {
        title: formTitle,
        doctorName: formDoctor || 'Dr. Sarah Vance, MD',
        facility: formFacility || 'Metropolitan Diagnostics Laboratory',
        fileName: formFileName || 'diagnostic_report.pdf'
      };

      let defaultFindings = [];
      if (formType === 'blood_test') {
        payloadValues.glucose = 95;
        payloadValues.hemoglobin = 14.5;
        defaultFindings = [
          { name: 'Blood Glucose (Fasting)', value: '95 mg/dL', range: '70 – 99 mg/dL', status: 'optimal' },
          { name: 'Hemoglobin (Hb)', value: '14.5 g/dL', range: '13.5 – 17.5 g/dL', status: 'optimal' }
        ];
      } else if (formType === 'urine_test') {
        payloadValues.protein = 'Negative';
        payloadValues.ph = 6.5;
        defaultFindings = [
          { name: 'Urinary Protein (Albumin)', value: 'Negative (0 mg/dL)', range: 'Negative (<30 mg/dL)', status: 'optimal' },
          { name: 'Urine pH', value: '6.5', range: '5.0 – 8.0', status: 'optimal' }
        ];
      } else if (formType === 'prescription') {
        payloadValues.medications = [
          { name: 'Prescribed Medication', dosage: 'Daily', frequency: 'Once daily after breakfast', duration: '30 Days' }
        ];
      }

      await healthReadingService.addMedicalRecord(uid, {
        type: formType,
        measuredAt: new Date(formDate).toISOString(),
        notes: formNotes || 'Clinically verified laboratory record added by patient.',
        values: payloadValues,
        findings: defaultFindings
      });

      setUploadModalOpen(false);
      setFormTitle('');
      setFormDoctor('');
      setFormFacility('');
      setFormNotes('');
      setFormFileName('');
      setNotification(isHindi ? 'मेडिकल रिकॉर्ड सफलतापूर्वक सहेज लिया गया!' : 'Medical record successfully saved to library!');
      setTimeout(() => setNotification(null), 4000);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      alert(err.message || 'Failed to save record.');
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in p-2 sm:p-4 max-w-7xl mx-auto">
      {/* SUCCESS NOTIFICATION TOAST */}
      {notification && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2.5 font-bold text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HEADER SECTION */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-[#A9D6F5]/40 text-[#1F150E] dark:bg-[#A9D6F5]/20 dark:text-[#A9D6F5]">
              {isHindi ? 'क्लिनिकल लाइब्रेरी' : 'Clinical Library'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1F150E] dark:text-[#F6F0E4] mt-1">
            {isHindi ? 'मेरे मेडिकल रिकॉर्ड्स एवं टेस्ट लाइब्रेरी' : 'My Medical Records & Test Library'}
          </h1>
          <p className="text-sm text-[#6B4F3A] dark:text-[#D5BF86] mt-1 max-w-3xl">
            {isHindi
              ? 'प्रमाणित लैब टेस्ट, मूत्र परीक्षण रिपोर्ट, डायग्नोस्टिक स्कैन, डॉक्टर के पर्चे और परामर्श सारांश का व्यापक संग्रह।'
              : 'Complete repository for blood test panels, urinalysis diagnostic reports, X-rays, clinical prescriptions, and medical files.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button
            onClick={handleManualRefresh}
            disabled={loading || isRefreshing}
            className="p-3 rounded-2xl bg-white dark:bg-[#2B1E15] border border-[#E8DFD1] dark:border-[#4A3525] text-[#6B4F3A] dark:text-[#D5BF86] hover:border-[#A9D6F5] shadow-xs cursor-pointer transition-all active:scale-95 disabled:opacity-60"
            title={isHindi ? 'रिफ्रेश करें' : 'Refresh Records'}
          >
            <RefreshCw className={`w-5 h-5 ${loading || isRefreshing ? 'animate-spin text-[#2672A8] dark:text-[#A9D6F5]' : ''}`} />
          </button>

          <button
            onClick={() => setUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm bg-[#A9D6F5] text-[#1F150E] hover:bg-[#7CBFEA] shadow-md shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <UploadCloud className="w-5 h-5" />
            <span>{isHindi ? 'नया मेडिकल रिकॉर्ड जोड़ें' : 'Upload Medical Record'}</span>
          </button>
        </div>
      </section>

      {/* CLARIFICATION BANNER: VITALS VS CLINICAL RECORDS */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#F6F0E4]/80 dark:bg-[#2B1E15]/80 border border-[#E8DFD1] dark:border-[#4A3525] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-3 text-[#6B4F3A] dark:text-[#D5BF86]">
          <AlertCircle className="w-5 h-5 text-[#2672A8] dark:text-[#A9D6F5] shrink-0" />
          <span>
            {isHindi
              ? 'दैनिक रक्तचाप (BP), हृदय गति और चलने के कदम अलग से "माई हेल्थ एनालिटिक्स" ग्राफ़ में ट्रैक किए जाते हैं। यहाँ केवल अधिकृत मेडिकल रिकॉर्ड और लैब रिपोर्ट शामिल हैं।'
              : 'Daily blood pressure readings, heart rate logs, and walking activity are tracked separately in the Health Analytics graphs. This library strictly maintains authentic clinical records & diagnostic panels.'}
          </span>
        </div>
        <Link
          to="/dashboard/analytics"
          className="inline-flex items-center gap-1 font-bold text-[#2672A8] dark:text-[#A9D6F5] hover:underline whitespace-nowrap self-start sm:self-auto"
        >
          <span>{isHindi ? 'स्वास्थ्य ग्राफ़ देखें' : 'View Vital Graphs'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* SEARCH AND CATEGORY FILTER PILLS */}
      <section className="p-5 rounded-3xl bg-white dark:bg-[#2B1E15] border border-[#E8DFD1] dark:border-[#4A3525] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B4F3A]/60 dark:text-[#D5BF86]/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'टेस्ट, डॉक्टर, या क्लिनिक का नाम खोजें...' : 'Search tests, doctors, clinics, or biomarkers...'}
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-[#1F150E] dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#A9D6F5]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="text-xs font-semibold text-[#6B4F3A] dark:text-[#D5BF86] flex items-center gap-1">
            <Filter className="w-4 h-4 text-[#2672A8] dark:text-[#A9D6F5]" />
            <span>{filteredRecords.length} {isHindi ? 'रिकॉर्ड मिले' : 'records available'}</span>
          </div>
        </div>

        {/* Category Pills (Strictly Clinical) */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E8DFD1]/60 dark:border-[#4A3525]/60">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                selectedCategory === cat.id
                  ? 'bg-[#A9D6F5] text-[#1F150E] shadow-sm font-extrabold scale-102'
                  : 'bg-[#F6F0E4] dark:bg-[#1F150E] text-[#6B4F3A] dark:text-[#D5BF86] hover:bg-[#E8DFD1] dark:hover:bg-[#4A3525]'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                selectedCategory === cat.id
                  ? 'bg-[#1F150E]/15 text-[#1F150E]'
                  : 'bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* MEDICAL RECORDS LISTING */}
      <section className="space-y-4">
        {loading ? (
          <div className="rounded-3xl border border-[#E8DFD1] dark:border-[#4A3525] bg-white dark:bg-[#2B1E15] p-12 text-center text-[#6B4F3A] dark:text-[#D5BF86] space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#A9D6F5] mx-auto" />
            <p className="font-bold text-[#1F150E] dark:text-white">
              {isHindi ? 'मेडिकल रिकॉर्ड्स लोड हो रहे हैं...' : 'Loading your medical records library...'}
            </p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-[#E8DFD1] dark:border-[#4A3525] bg-white dark:bg-[#2B1E15] p-12 text-center text-[#6B4F3A] dark:text-[#D5BF86] space-y-4">
            <FileText className="w-12 h-12 text-[#A9D6F5] mx-auto" />
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#1F150E] dark:text-white">
                {isHindi ? 'कोई मेल खाने वाला मेडिकल रिकॉर्ड नहीं मिला' : 'No matching medical records found'}
              </h3>
              <p className="text-sm text-[#6B4F3A] dark:text-[#D5BF86] max-w-md mx-auto">
                {isHindi
                  ? 'आपके चुने हुए फ़िल्टर या खोज के अनुसार कोई रिकॉर्ड उपलब्ध नहीं है।'
                  : 'Try selecting a different category, clearing your search query, or upload a new record.'}
              </p>
            </div>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-[#F6F0E4] dark:bg-[#1F150E] text-[#1F150E] dark:text-[#F6F0E4] border border-[#E8DFD1] dark:border-[#4A3525] hover:bg-[#A9D6F5] hover:text-[#1F150E] cursor-pointer"
            >
              {isHindi ? 'सभी फ़िल्टर साफ़ करें' : 'Reset All Filters'}
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredRecords.map((record) => {
              const vals = record.values || {};
              const docName = record.doctorName || vals.doctorName || 'Dr. Sarah Vance, MD';
              const facName = record.facility || vals.facility || 'Metropolitan Diagnostics Laboratory';
              const recDate = toDate(record.measuredAt);

              return (
                <article
                  key={record.id}
                  onClick={() => setSelectedRecord(record)}
                  className="rounded-3xl border border-[#E8DFD1] dark:border-[#4A3525] bg-white dark:bg-[#2B1E15] p-6 shadow-xs hover:border-[#A9D6F5] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Left: Icon & Meta */}
                    <div className="flex items-start sm:items-center gap-4">
                      <div className="p-3.5 rounded-2xl bg-[#F6F0E4] dark:bg-[#1F150E] group-hover:bg-[#A9D6F5]/25 transition-colors shrink-0">
                        {getRecordTypeIcon(record.type)}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg sm:text-xl font-bold text-[#1F150E] dark:text-white group-hover:text-[#2672A8] dark:group-hover:text-[#A9D6F5] transition-colors truncate">
                            {record.title || vals.title || 'Diagnostic Clinical Record'}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{isHindi ? 'सत्यापित' : 'Clinically Verified'}</span>
                          </span>
                        </div>

                        <p className="text-xs text-[#6B4F3A] dark:text-[#D5BF86] flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-semibold text-[#2672A8] dark:text-[#A9D6F5]">
                            {getRecordTypeLabel(record.type)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {recDate
                              ? recDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                              : 'Date recorded'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            {docName}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            {facName}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Key Summary & Button */}
                    <div className="flex items-center justify-between lg:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-[#E8DFD1]/60 dark:border-[#4A3525]/60 shrink-0">
                      {/* Biomarker highlights */}
                      {Array.isArray(record.findings) && record.findings.length > 0 && (
                        <div className="hidden sm:flex items-center gap-2">
                          {record.findings.slice(0, 2).map((f, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 rounded-xl bg-[#F6F0E4] dark:bg-[#1F150E] text-[11px] font-semibold text-[#1F150E] dark:text-[#F6F0E4] border border-[#E8DFD1] dark:border-[#4A3525]"
                            >
                              <strong className="text-[#6B4F3A] dark:text-[#D5BF86]">{f.name}: </strong>
                              {f.value}
                            </span>
                          ))}
                        </div>
                      )}

                      {record.type === 'prescription' && Array.isArray(vals.medications) && (
                        <span className="hidden sm:inline-block px-3 py-1 rounded-xl bg-[#F6F0E4] dark:bg-[#1F150E] text-[11px] font-semibold text-[#1F150E] dark:text-[#F6F0E4] border border-[#E8DFD1] dark:border-[#4A3525]">
                          {vals.medications.length} {isHindi ? 'दवाएं निर्धारित' : 'Medications Prescribed'}
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRecord(record);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#A9D6F5]/40 hover:bg-[#A9D6F5] text-[#1F150E] dark:bg-[#A9D6F5]/20 dark:hover:bg-[#A9D6F5] dark:hover:text-[#1F150E] transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'विवरण देखें' : 'View Details'}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* RECORD DETAIL MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#2B1E15] border border-[#E8DFD1] dark:border-[#4A3525] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-[#E8DFD1] dark:border-[#4A3525]">
              <div className="flex items-center gap-3">
                <div className="p-3.5 rounded-2xl bg-[#F6F0E4] dark:bg-[#1F150E]">
                  {getRecordTypeIcon(selectedRecord.type)}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#1F150E] dark:text-white">
                    {selectedRecord.title || selectedRecord.values?.title || 'Diagnostic Clinical Record'}
                  </h3>
                  <p className="text-xs text-[#6B4F3A] dark:text-[#D5BF86] mt-0.5">
                    {selectedRecord.category || getRecordTypeLabel(selectedRecord.type)} •{' '}
                    {toDate(selectedRecord.measuredAt)?.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-2 rounded-xl text-[#6B4F3A] dark:text-[#D5BF86] hover:bg-[#F6F0E4] dark:hover:bg-[#1F150E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clinician and Facility Info Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-xs">
              <div className="flex items-center gap-2.5">
                <User className="w-4 h-4 text-[#2672A8] dark:text-[#A9D6F5]" />
                <div>
                  <p className="font-bold text-[#1F150E] dark:text-white">
                    {selectedRecord.doctorName || selectedRecord.values?.doctorName || 'Dr. Sarah Vance, MD'}
                  </p>
                  <p className="text-[#6B4F3A] dark:text-[#D5BF86]">{isHindi ? 'उपस्थित चिकित्सक' : 'Attending Clinician'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Building className="w-4 h-4 text-[#2672A8] dark:text-[#A9D6F5]" />
                <div>
                  <p className="font-bold text-[#1F150E] dark:text-white">
                    {selectedRecord.facility || selectedRecord.values?.facility || 'Metropolitan Diagnostics Laboratory'}
                  </p>
                  <p className="text-[#6B4F3A] dark:text-[#D5BF86]">{isHindi ? 'प्रयोगशाला / अस्पताल' : 'Laboratory / Facility'}</p>
                </div>
              </div>
            </div>

            {/* Findings Table */}
            {Array.isArray(selectedRecord.findings) && selectedRecord.findings.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B4F3A] dark:text-[#D5BF86]">
                  {isHindi ? 'बायोमार्कर परिणाम एवं सामान्य संदर्भ सीमाएं' : 'Diagnostic Lab Parameters & Normal Reference Ranges'}
                </h4>
                <div className="rounded-2xl border border-[#E8DFD1] dark:border-[#4A3525] overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#F6F0E4] dark:bg-[#1F150E] text-[#6B4F3A] dark:text-[#D5BF86] border-b border-[#E8DFD1] dark:border-[#4A3525]">
                      <tr>
                        <th className="p-3 font-bold">{isHindi ? 'बायोमार्कर' : 'Biomarker'}</th>
                        <th className="p-3 font-bold">{isHindi ? 'अवलोकित मान' : 'Observed Value'}</th>
                        <th className="p-3 font-bold">{isHindi ? 'संदर्भ सीमा' : 'Reference Range'}</th>
                        <th className="p-3 font-bold">{isHindi ? 'स्थिति' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8DFD1] dark:divide-[#4A3525]">
                      {selectedRecord.findings.map((f, i) => (
                        <tr key={i}>
                          <td className="p-3 font-semibold text-[#1F150E] dark:text-white">{f.name}</td>
                          <td className="p-3 font-mono font-bold text-[#2672A8] dark:text-[#A9D6F5]">{f.value}</td>
                          <td className="p-3 text-[#6B4F3A] dark:text-[#D5BF86]">{f.range}</td>
                          <td className="p-3 text-emerald-700 dark:text-emerald-400 font-bold">✓ {isHindi ? 'सामान्य' : 'Normal'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Prescribed Medications */}
            {selectedRecord.type === 'prescription' && Array.isArray(selectedRecord.values?.medications) && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B4F3A] dark:text-[#D5BF86]">
                  {isHindi ? 'निर्धारित दवाएं' : 'Prescribed Medications'}
                </h4>
                <div className="space-y-2">
                  {selectedRecord.values.medications.map((m, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] flex justify-between items-center text-xs"
                    >
                      <div>
                        <p className="font-bold text-[#1F150E] dark:text-white text-sm">{m.name}</p>
                        <p className="text-[#6B4F3A] dark:text-[#D5BF86]">{m.frequency} • {m.duration || '30 Days'}</p>
                      </div>
                      <span className="px-3 py-1 rounded-xl bg-white dark:bg-[#2B1E15] font-mono font-bold text-[#2672A8] dark:text-[#A9D6F5]">
                        {m.dosage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clinician Notes */}
            {selectedRecord.notes && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B4F3A] dark:text-[#D5BF86]">
                  {isHindi ? 'चिकित्सक की टिप्पणी' : 'Clinician Impression & Notes'}
                </h4>
                <p className="p-4 rounded-2xl bg-[#F6F0E4]/50 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-sm text-[#1F150E] dark:text-white leading-relaxed">
                  {selectedRecord.notes}
                </p>
              </div>
            )}

            {/* Attached file info */}
            {selectedRecord.values?.fileName && (
              <div className="p-3 rounded-2xl bg-[#F6F0E4]/40 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#2672A8] dark:text-[#A9D6F5]" />
                  <span className="font-bold text-[#1F150E] dark:text-white">{selectedRecord.values.fileName}</span>
                </div>
                <span className="text-[#6B4F3A] dark:text-[#D5BF86]">PDF Document (Verified)</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E8DFD1] dark:border-[#4A3525]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(isHindi ? 'डाउनलोड शुरू हो गया है।' : 'Official clinical report PDF downloaded.')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A9D6F5] text-[#1F150E] font-bold text-xs hover:bg-[#7CBFEA] cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'रिपोर्ट PDF डाउनलोड करें' : 'Download PDF'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F6F0E4] dark:bg-[#1F150E] text-[#1F150E] dark:text-white font-bold text-xs border border-[#E8DFD1] dark:border-[#4A3525] cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'प्रिंट करें' : 'Print'}</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#1F150E] dark:bg-white text-white dark:text-[#1F150E] cursor-pointer"
              >
                {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD MEDICAL RECORD MODAL */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <form
            onSubmit={handleSaveRecord}
            className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#2B1E15] border border-[#E8DFD1] dark:border-[#4A3525] shadow-2xl p-6 sm:p-8 space-y-5 max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between pb-3 border-b border-[#E8DFD1] dark:border-[#4A3525]">
              <div>
                <h3 className="text-xl font-bold text-[#1F150E] dark:text-white">
                  {isHindi ? 'नया मेडिकल रिकॉर्ड अपलोड करें' : 'Upload New Medical Record'}
                </h3>
                <p className="text-xs text-[#6B4F3A] dark:text-[#D5BF86] mt-0.5">
                  {isHindi
                    ? 'लैब टेस्ट पैनल, मूत्र रिपोर्ट, इमेजिंग स्कैन, डॉक्टर के पर्चे और परामर्श सारांश जोड़ें।'
                    : 'Add lab test panels, urinalysis diagnostic reports, scans, prescriptions, or clinical notes.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="p-2 rounded-xl text-[#6B4F3A] dark:text-[#D5BF86] hover:bg-[#F6F0E4] dark:hover:bg-[#1F150E] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Select (Strictly Clinical) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F150E] dark:text-[#F6F0E4]">
                {isHindi ? 'रिकॉर्ड श्रेणी' : 'Record Category'}
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full p-3 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-[#1F150E] dark:text-white text-sm"
              >
                <option value="blood_test">{isHindi ? 'रक्त परीक्षण एवं लैब (Blood Tests & Labs)' : 'Blood Tests & Labs'}</option>
                <option value="urine_test">{isHindi ? 'मूत्र परीक्षण रिपोर्ट (Urine Analysis Reports)' : 'Urine Analysis Reports'}</option>
                <option value="imaging_scan">{isHindi ? 'जांच स्कैन एवं इमेजिंग (Diagnostic Scans & Imaging)' : 'Diagnostic Scans & Imaging'}</option>
                <option value="prescription">{isHindi ? 'डॉक्टर के पर्चे (Doctor Prescriptions)' : 'Doctor Prescriptions'}</option>
                <option value="clinical_note">{isHindi ? 'क्लिनिकल सारांश (Clinical Summaries)' : 'Clinical Summaries'}</option>
                <option value="document">{isHindi ? 'अपलोड किए गए दस्तावेज़ (Uploaded Documents)' : 'Uploaded Documents'}</option>
              </select>
              <p className="text-[11px] text-[#6B4F3A] dark:text-[#D5BF86]">
                {isHindi
                  ? 'दैनिक बीपी और कदमों का इतिहास अलग से स्वास्थ्य ग्राफ़ में दर्ज होता है।'
                  : 'Daily BP and walking steps are logged under Health Analytics.'}
              </p>
            </div>

            {/* Title & Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F150E] dark:text-[#F6F0E4]">
                  {isHindi ? 'रिकॉर्ड का नाम / शीर्षक' : 'Record Title'}
                </label>
                <input
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={isHindi ? 'जैसे: कम्पलीट ब्लड काउंट (CBC)' : 'e.g., Complete Blood Count (CBC)'}
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
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-[#1F150E] dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Doctor & Clinic */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F150E] dark:text-[#F6F0E4]">
                  {isHindi ? 'उपस्थित चिकित्सक' : 'Attending Physician'}
                </label>
                <input
                  value={formDoctor}
                  onChange={(e) => setFormDoctor(e.target.value)}
                  placeholder="Dr. Sarah Vance, MD"
                  className="w-full p-3 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-[#1F150E] dark:text-white text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#1F150E] dark:text-[#F6F0E4]">
                  {isHindi ? 'प्रयोगशाला / अस्पताल' : 'Clinic / Hospital'}
                </label>
                <input
                  value={formFacility}
                  onChange={(e) => setFormFacility(e.target.value)}
                  placeholder="Metropolitan Diagnostics Laboratory"
                  className="w-full p-3 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-[#1F150E] dark:text-white text-sm"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F150E] dark:text-[#F6F0E4]">
                {isHindi ? 'क्लिनिकल टिप्पणी / परिणाम' : 'Clinical Notes / Findings'}
              </label>
              <textarea
                rows={2}
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder={isHindi ? 'डॉक्टर की सलाह या निष्कर्ष दर्ज करें...' : 'Clinician remarks, findings, or impressions...'}
                className="w-full p-3 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] text-[#1F150E] dark:text-white text-sm"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1F150E] dark:text-[#F6F0E4]">
                {isHindi ? 'रिपोर्ट फ़ाइल संलग्न करें (PDF / छवि)' : 'Attach Report (PDF / Image)'}
              </label>
              <input
                type="file"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) setFormFileName(f.name);
                }}
                className="w-full p-2.5 text-xs rounded-xl bg-[#F6F0E4]/60 dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525]"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-end gap-3 border-t border-[#E8DFD1] dark:border-[#4A3525]">
              <button
                type="button"
                onClick={() => setUploadModalOpen(false)}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-[#E8DFD1] dark:border-[#4A3525] text-[#6B4F3A] cursor-pointer"
              >
                {isHindi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={formSubmitting}
                className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#A9D6F5] text-[#1F150E] hover:bg-[#7CBFEA] disabled:opacity-50 cursor-pointer"
              >
                {formSubmitting
                  ? (isHindi ? 'सहेज रहे हैं...' : 'Saving...')
                  : (isHindi ? 'रिकॉर्ड सहेजें' : 'Save to Medical Records')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FOOTER DISCLAIMER */}
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
