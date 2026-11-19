import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Pill,
  Calendar,
  FolderOpen,
  ShieldCheck,
  ArrowRight,
  Activity,
  Stethoscope,
  CheckCircle2,
  Check,
  AlertCircle,
  Plus,
  Search,
  ExternalLink,
  X,
  Printer,
  User,
  AlertOctagon,
  Heart,
  Sparkles,
  Eye,
  Video,
  Phone,
  Clock
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DoctorService, formatDoctorTitle } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';

export default function DoctorMedicalRecordsPage() {
  const { doctor } = useDoctorAuth();
  const { isHindi } = useLanguage();

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'completed' | 'ongoing' | 'priority'
  const [selectedReportModal, setSelectedReportModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const doctorUid = doctor?.uid || 'demo-doctor-uid-002';

  const loadAllData = () => {
    try {
      const pts = (typeof DoctorService?.getDoctorPatients === 'function' ? DoctorService.getDoctorPatients(doctorUid) : []) || [];
      const appts = (typeof appointmentService?.getDoctorAppointments === 'function'
        ? appointmentService.getDoctorAppointments(doctorUid)
        : (typeof appointmentService?.getStoredDoctorAppointments === 'function'
            ? appointmentService.getStoredDoctorAppointments(doctorUid)
            : [])) || [];
      const reps = (typeof DoctorService?.getDoctorReports === 'function' ? DoctorService.getDoctorReports(doctorUid) : []) || [];
      const rxs = (typeof DoctorService?.getDoctorPrescriptions === 'function' ? DoctorService.getDoctorPrescriptions(doctorUid) : []) || [];

      setPatients(pts);
      setAppointments(appts);
      setReports(reps);
      setPrescriptions(rxs);
    } catch (err) {
      console.warn('Error loading doctor medical records data:', err);
    }
  };

  useEffect(() => {
    loadAllData();

    // Listen to appointment changes across tabs
    const handleApptUpdate = () => {
      loadAllData();
    };

    window.addEventListener('bt_doctor_appointments_updated', handleApptUpdate);
    window.addEventListener('storage', handleApptUpdate);

    return () => {
      window.removeEventListener('bt_doctor_appointments_updated', handleApptUpdate);
      window.removeEventListener('storage', handleApptUpdate);
    };
  }, [doctorUid]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Mark appointment as completed directly from records page
  const handleMarkAppointmentCompleted = async (patientName, apptId) => {
    try {
      if (apptId) {
        await appointmentService.updateStatus(apptId, 'COMPLETED', doctorUid);
      } else {
        // Add completed appointment record if none existed
        const updated = appointments.map((a) => {
          if (a.patientName?.toLowerCase() === patientName?.toLowerCase()) {
            return { ...a, status: 'COMPLETED' };
          }
          return a;
        });
        localStorage.setItem(`bt_doctor_appointments_${doctorUid}`, JSON.stringify(updated));
      }
      loadAllData();
      showToast(
        isHindi
          ? `✓ ${patientName} का परामर्श सफलतापूर्वक 'पूर्ण' (Completed) चिह्नित किया गया!`
          : `✓ Appointment for ${patientName} marked as Completed!`
      );
    } catch (e) {
      console.error(e);
      showToast(e.message || 'Failed to update status.');
    }
  };

  // Associate each patient with their appointment completion status & reports
  const enrichedPatients = useMemo(() => {
    return patients.map((patient) => {
      const pName = (patient.patientName || patient.name || '').trim().toLowerCase();

      // Find matching appointments
      const matchedAppts = appointments.filter(
        (a) =>
          a.patientId === patient.id ||
          a.patientId === patient.patientId ||
          (a.patientName && a.patientName.trim().toLowerCase() === pName)
      );

      // Check for completed appointment
      const completedAppt = matchedAppts.find((a) => a.status === 'COMPLETED');
      const activeAppt = matchedAppts.find((a) => a.status === 'ACCEPTED' || a.status === 'PENDING');

      // Check if patient metadata specifies completed
      const isCompleted =
        Boolean(completedAppt) ||
        patient.appointmentStatus === 'COMPLETED' ||
        patient.status === 'Consultation Completed';

      const completedDate =
        completedAppt?.appointmentDate ||
        patient.completedAppointmentDate ||
        (isCompleted ? patient.lastVisit?.replace(/\(.*?\)/g, '').trim() : null);

      const completedTime = completedAppt?.appointmentTime || patient.completedAppointmentTime || '11:15';
      const completedType = completedAppt?.type === 'in-person' ? 'In-Person Visit' : 'Video Consultation';

      // Find previous reports for this patient
      const patientReports = reports.filter(
        (r) =>
          r.patientId === patient.id ||
          r.patientId === patient.patientId ||
          (r.patientName && r.patientName.trim().toLowerCase() === pName)
      );

      // Find previous prescriptions for this patient
      const patientPrescriptions = prescriptions.filter(
        (rx) =>
          rx.patientId === patient.id ||
          rx.patientId === patient.patientId ||
          (rx.patientName && rx.patientName.trim().toLowerCase() === pName)
      );

      return {
        ...patient,
        hasCompletedAppointment: isCompleted,
        completedAppointmentDetails: isCompleted
          ? {
              date: completedDate,
              time: completedTime,
              type: completedType,
              apptId: completedAppt?.id || null
            }
          : null,
        activeAppointmentDetails: activeAppt
          ? {
              id: activeAppt.id,
              date: activeAppt.appointmentDate,
              time: activeAppt.appointmentTime,
              type: activeAppt.type,
              status: activeAppt.status
            }
          : null,
        previousReports: patientReports,
        previousPrescriptions: patientPrescriptions
      };
    });
  }, [patients, appointments, reports, prescriptions]);

  // Filter & Search Logic
  const filteredPatients = useMemo(() => {
    return enrichedPatients.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = (p.name || p.patientName || '').toLowerCase().includes(q);
      const condMatch = (p.condition || p.primaryCondition || '').toLowerCase().includes(q);
      const idMatch = (p.id || '').toLowerCase().includes(q);

      if (q && !nameMatch && !condMatch && !idMatch) {
        return false;
      }

      if (activeFilter === 'completed') {
        return p.hasCompletedAppointment;
      }
      if (activeFilter === 'priority') {
        return p.isPriority || p.isDanger;
      }
      if (activeFilter === 'ongoing') {
        return !p.hasCompletedAppointment;
      }
      return true;
    });
  }, [enrichedPatients, searchQuery, activeFilter]);

  const completedCount = enrichedPatients.filter((p) => p.hasCompletedAppointment).length;
  const priorityCount = enrichedPatients.filter((p) => p.isPriority || p.isDanger).length;

  return (
    <div className="space-y-7 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1F150E] text-white border border-cyan-500/40 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-800 dark:text-cyan-300">
              {isHindi ? 'मरीज मेडिकल रिकॉर्ड्स' : 'Clinical Medical Records Registry'}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5" /> {isHindi ? 'सत्यापित क्लिनिकल रिकॉर्ड' : 'Certified Clinical Access'}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isHindi ? 'मेडिकल रिकॉर्ड्स एवं परामर्श पूर्णता सारांश' : 'Medical Records & Care Management'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            {isHindi
              ? 'मरीज का नाम, परामर्श पूर्णता मार्क, निदान बीमारी जांचें तथा रिपोर्ट लिखें या नुस्खा (Prescription) जोड़ें।'
              : 'Review patient records, appointment completion marks, diagnosed diseases, write clinical reports, and issue prescriptions.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0">
          <Link
            to="/doctor/reports/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-95"
            title={isHindi ? 'नई रिपोर्ट लिखें' : 'Write New Clinical Report'}
          >
            <FileText className="w-4 h-4" />
            <span>{isHindi ? 'नई रिपोर्ट लिखें' : 'Write Report'}</span>
          </Link>

          <Link
            to="/doctor/prescriptions/new"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm shadow-sm transition-all cursor-pointer active:scale-95"
            title={isHindi ? 'नया नुस्खा जोड़ें' : 'Add New Prescription'}
          >
            <Pill className="w-4 h-4" />
            <span>{isHindi ? '+ नुस्खा जोड़ें' : '+ Add Prescription'}</span>
          </Link>
        </div>
      </div>

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">{isHindi ? 'कुल मरीज' : 'Active Patients'}</span>
            <FolderOpen className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{enrichedPatients.length}</p>
          <span className="text-[11px] text-slate-500 font-medium">{isHindi ? 'सत्यापित केयर सर्कल' : 'Direct clinical roster'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300">
            <span className="text-xs font-bold uppercase tracking-wider">{isHindi ? 'परामर्श पूर्ण' : 'Completed Appts'}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-emerald-200">{completedCount}</p>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">✓ {isHindi ? 'पूर्णता मार्क सहित' : 'Marked Completed'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">{isHindi ? 'हस्ताक्षरित रिपोर्ट्स' : 'Signed Reports'}</span>
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{reports.length}</p>
          <span className="text-[11px] text-slate-500 font-medium">{isHindi ? 'सत्यापित विजिट नोट्स' : 'Clinical visit notes'}</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">{isHindi ? 'सक्रिय नुस्खे (Rx)' : 'Active Prescriptions'}</span>
            <Pill className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{prescriptions.length}</p>
          <span className="text-[11px] text-slate-500 font-medium">{isHindi ? 'ई-नुस्खे जारी' : 'Issued treatment plans'}</span>
        </div>
      </div>

      {/* Search Bar & Filter Options */}
      <div className="p-3 sm:p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isHindi
                  ? 'मरीज का नाम, बीमारी (Disease), या अपॉइंटमेंट स्थिति से खोजें...'
                  : 'Search by patient name, diagnosed disease, or appointment status...'
              }
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'all', label: isHindi ? `सभी रिकॉर्ड्स (${enrichedPatients.length})` : `All Records (${enrichedPatients.length})` },
              { id: 'completed', label: isHindi ? `✓ पूर्ण नियुक्तियां (${completedCount})` : `✓ Completed Appts (${completedCount})` },
              { id: 'priority', label: isHindi ? `🚨 उच्च जोखिम / कैंसर (${priorityCount})` : `🚨 High Risk (${priorityCount})` },
              { id: 'ongoing', label: isHindi ? 'लंबित / समीक्षाधीन' : 'Scheduled / Pending' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Patient Medical Records List */}
      <div className="space-y-4">
        {filteredPatients.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              {isHindi ? 'कोई मेडिकल रिकॉर्ड नहीं मिला' : 'No matching medical records found'}
            </h3>
            <p className="text-xs text-slate-500">
              {isHindi ? 'खोज शब्द बदलकर पुनः प्रयास करें।' : 'Try clearing your search query or filter options.'}
            </p>
          </div>
        ) : (
          filteredPatients.map((patient) => {
            const isCompleted = patient.hasCompletedAppointment;
            const completed = patient.completedAppointmentDetails;
            const activeAppt = patient.activeAppointmentDetails;
            const isDanger = patient.isPriority || patient.isDanger;
            const primaryDisease = patient.condition || patient.primaryCondition || 'Essential Health Care';

            // Extract clean disease name & stage
            let cleanDiseaseName = primaryDisease;
            let diseaseStage = null;
            if (primaryDisease.toLowerCase().includes('cancer')) {
              cleanDiseaseName = 'Colorectal Carcinoma';
              diseaseStage = 'Stage II (Active Oncology)';
            } else if (primaryDisease.toLowerCase().includes('hypertension')) {
              cleanDiseaseName = 'Essential Hypertension';
              diseaseStage = 'Stage 1 (Cardiovascular)';
            } else if (primaryDisease.toLowerCase().includes('fatigue') || primaryDisease.toLowerCase().includes('iron')) {
              cleanDiseaseName = 'Post-Viral Fatigue & Mild Iron Deficiency';
              diseaseStage = 'Mild Microcytic';
            } else if (primaryDisease.toLowerCase().includes('diabetes')) {
              cleanDiseaseName = 'Type 2 Diabetes Mellitus Screening';
              diseaseStage = 'Metabolic Surveillance';
            }

            return (
              <div
                key={patient.id}
                className={`p-5 sm:p-6 rounded-3xl border transition-all space-y-4 shadow-xs ${
                  isDanger
                    ? 'bg-gradient-to-r from-red-600/10 via-rose-600/5 to-white dark:to-slate-900 border-red-500/50 dark:border-red-500/60 shadow-red-500/5'
                    : isCompleted
                    ? 'bg-white dark:bg-slate-900 border-emerald-500/30 dark:border-emerald-500/40 shadow-emerald-500/5'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* 1. Header Row: Patient Name & Details + Appointed Completed Mark */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3.5 border-b border-slate-100 dark:border-slate-800">
                  {/* Patient Name & Bio */}
                  <div className="flex items-center gap-3.5">
                    <div className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-gradient-to-tr from-cyan-400 to-blue-500 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-xs">
                      {patient.avatar ? (
                        <img src={patient.avatar} alt={patient.name} className="w-full h-full object-cover" />
                      ) : (
                        (patient.name || 'P').charAt(0)
                      )}
                      {isCompleted && (
                        <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] text-white">
                          ✓
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link
                          to={`/doctor/patients/${patient.id}`}
                          className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {patient.patientName || patient.name}
                        </Link>

                        {isDanger && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-rose-600 text-white shadow-xs animate-pulse">
                            🚨 CRITICAL PRIORITY PATIENT
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5 flex items-center gap-2 flex-wrap">
                        <span>{patient.age || 34} yrs • {patient.gender || 'Patient'}</span>
                        <span>•</span>
                        <span>Blood: <strong className="text-rose-600">{patient.bloodGroup || 'O+'}</strong></span>
                        <span>•</span>
                        <span>ID: <code className="font-mono text-cyan-700 dark:text-cyan-300">{patient.id}</code></span>
                        <span>•</span>
                        <span>Phone: {patient.phone || '+1 (555) 019-2834'}</span>
                      </p>
                    </div>
                  </div>

                  {/* APPOINTED COMPLETED MARK (Prominent Badge) */}
                  <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
                    {isCompleted ? (
                      <div className="p-2.5 px-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-950 dark:text-emerald-100 flex items-center gap-2.5 shadow-xs">
                        <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          ✓
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black tracking-wide uppercase text-emerald-800 dark:text-emerald-300">
                              {isHindi ? '✓ परामर्श पूर्ण (Completed)' : '✓ APPOINTMENT COMPLETED'}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                            {completed?.date || 'Nov 17, 2026'} ({completed?.time || '11:15'}) • {completed?.type || 'Video Consultation'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="p-2.5 px-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 text-xs">
                          <span className="font-bold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>{activeAppt ? `Scheduled: ${activeAppt.time || '10:30'}` : 'Appointment Pending'}</span>
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            {activeAppt ? `${activeAppt.date} (${activeAppt.type})` : 'Awaiting clinical completion'}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleMarkAppointmentCompleted(patient.name || patient.patientName, activeAppt?.id)}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer active:scale-95 whitespace-nowrap flex items-center gap-1"
                          title="Mark this patient's appointment as completed"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{isHindi ? 'पूर्ण चिह्नित करें' : 'Mark Completed'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Middle Row: Diagnosed Disease & Clinical Trajectory Details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-1">
                  {/* Disease Info Box (7 cols) */}
                  <div className="md:col-span-7 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Stethoscope className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        <span>{isHindi ? 'निदान बीमारी (Diagnosed Disease):' : 'Diagnosed Disease & Condition:'}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        {diseaseStage && (
                          <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                            {diseaseStage}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isDanger
                            ? 'bg-rose-500/20 text-rose-800 dark:text-rose-300'
                            : 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300'
                        }`}>
                          {patient.status || 'Active Care'}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {cleanDiseaseName}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {patient.condition || 'Longitudinal vital sign monitoring with certified clinical telemetry tracking.'}
                    </p>
                  </div>

                  {/* Vitals / Last Care Actions Box (5 cols) */}
                  <div className="md:col-span-5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                        {isHindi ? 'क्लिनिकल रिकॉर्ड स्थिति' : 'Care Record Summary'}
                      </span>
                      <div className="mt-1.5 flex items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                          <FileText className="w-3.5 h-3.5" />
                          <span>{patient.previousReports?.length || 1} {isHindi ? 'रिपोर्ट्स' : 'Report(s)'}</span>
                        </span>
                        <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
                          <Pill className="w-3.5 h-3.5" />
                          <span>{patient.previousPrescriptions?.length || 1} {isHindi ? 'नुस्खे' : 'Rx Plan(s)'}</span>
                        </span>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                      <span>{isHindi ? 'अंतिम परामर्श:' : 'Last Visit:'} {patient.lastVisit || 'Today'}</span>
                      <span>{isHindi ? 'फॉलो-अप:' : 'Next Review:'} <strong className="text-slate-700 dark:text-slate-300">{patient.nextFollowUp || 'In 2 weeks'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* 3. Bottom Row: 4 Clinical Actions (Details, Write Report, Add Prescription, Previous Report) */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  {/* Primary Link to Patient Details */}
                  <Link
                    to={`/doctor/patients/${patient.id}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    <span>{isHindi ? 'मरीज का संपूर्ण विवरण देखें' : 'Check Patient Details & Full Record'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* Action Buttons: Write Report + Add Prescription + Check Previous Report */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Check Previous Report */}
                    {patient.previousReports && patient.previousReports.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setSelectedReportModal(patient.previousReports[0])}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-700 dark:text-purple-300 font-bold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
                        title={isHindi ? 'पिछली क्लिनिकल रिपोर्ट देखें' : 'View Previous Clinical Report'}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isHindi ? 'पिछली रिपोर्ट जांचें' : 'Check Previous Report'}</span>
                      </button>
                    )}

                    {/* Write Report */}
                    <Link
                      to={`/doctor/reports/new?patientId=${patient.id}&name=${encodeURIComponent(patient.name || patient.patientName)}&age=${patient.age || 34}&gender=${patient.gender || 'Male'}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                      title={isHindi ? 'इस मरीज के लिए रिपोर्ट लिखें' : 'Write Report for Patient'}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'रिपोर्ट लिखें' : 'Write Report'}</span>
                    </Link>

                    {/* Add Prescription */}
                    <Link
                      to={`/doctor/prescriptions/new?patientId=${patient.id}&name=${encodeURIComponent(patient.name || patient.patientName)}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                      title={isHindi ? 'नुस्खा (Prescription) जोड़ें' : 'Add Electronic Prescription'}
                    >
                      <Pill className="w-3.5 h-3.5" />
                      <span>{isHindi ? '+ नुस्खा जोड़ें' : '+ Add Prescription'}</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* CHECK PREVIOUS REPORT MODAL (Full 13-field clinical document view)         */}
      {/* ========================================================================= */}
      {selectedReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                    {isHindi ? 'पिछली क्लिनिकल परामर्श रिपोर्ट' : 'Previous Clinical Consultation Report'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Patient: <strong className="text-slate-800 dark:text-slate-200">{selectedReportModal.patientName}</strong> • ID: {selectedReportModal.id}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReportModal(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Content */}
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Doctor / Clinic Header */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white text-sm">
                    {formatDoctorTitle(selectedReportModal.doctorName || doctor?.fullName || 'Dr. Sarah Mitchell')}
                  </p>
                  <p className="text-xs text-slate-500">
                    {selectedReportModal.clinicName || 'BioTrajectory Specialty Health Center'} • Reg: {selectedReportModal.doctorRegNumber || 'MD-89241-US'}
                  </p>
                </div>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  ✓ SIGNED
                </span>
              </div>

              {/* Diagnosis Banner */}
              <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                  {isHindi ? 'चिकित्सीय निदान (Diagnosis):' : 'Primary Clinical Diagnosis:'}
                </span>
                <p className="font-black text-base text-slate-900 dark:text-white">
                  {selectedReportModal.diagnosis || 'Clinical evaluation completed'}
                </p>
              </div>

              {/* Vitals Snapshot */}
              {selectedReportModal.vitals && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {isHindi ? 'परामर्श के दौरान मापे गए वाइटल्स (Recorded Vitals):' : 'Recorded Vitals During Visit:'}
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 text-[10px] block">BP</span>
                      <strong className="text-slate-900 dark:text-white font-bold">{selectedReportModal.vitals.bp || '136/86'}</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 text-[10px] block">Heart Rate</span>
                      <strong className="text-slate-900 dark:text-white font-bold">{selectedReportModal.vitals.heartRate || '74'} bpm</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 text-[10px] block">SpO2</span>
                      <strong className="text-slate-900 dark:text-white font-bold">{selectedReportModal.vitals.spo2 || '98'} %</strong>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 text-[10px] block">Temp</span>
                      <strong className="text-slate-900 dark:text-white font-bold">{selectedReportModal.vitals.temp || '98.6'} °F</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Complaints & History */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {isHindi ? 'लक्षण एवं इतिहास:' : 'Chief Complaints & History:'}
                </span>
                <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
                  {selectedReportModal.complaints || selectedReportModal.hpi || 'Occasional morning tension and routine clinical check.'}
                </p>
              </div>

              {/* Clinical Advice & Care Plan */}
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {isHindi ? 'डॉक्टर का परामर्श एवं उपचार योजना:' : 'Physician Guidance & Care Plan:'}
                </span>
                <p className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  {selectedReportModal.advice || selectedReportModal.treatmentPlan || 'Follow low-sodium DASH nutritional guidelines and regular 30 min daily brisk walking.'}
                </p>
              </div>

              {/* Follow-up & Tests */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Recommended Tests</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200">{selectedReportModal.tests || 'Fasting blood sugar, lipid panel'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-0.5">
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Next Follow-Up</span>
                  <p className="font-bold text-blue-600 dark:text-blue-400">{selectedReportModal.followUp || 'In 2 weeks'}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isHindi ? 'प्रिंट / सेव करें' : 'Print / Export'}</span>
              </button>

              <div className="flex items-center gap-2">
                <Link
                  to={`/doctor/reports/new?patientId=${selectedReportModal.patientId}&name=${encodeURIComponent(selectedReportModal.patientName)}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  {isHindi ? 'नई रिपोर्ट लिखें' : 'Write Follow-Up Report'}
                </Link>

                <button
                  type="button"
                  onClick={() => setSelectedReportModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer"
                >
                  {isHindi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
