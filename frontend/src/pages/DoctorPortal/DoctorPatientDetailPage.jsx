import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Heart,
  Activity,
  FileText,
  Video,
  PlusCircle,
  Calendar,
  Clock,
  ShieldCheck,
  Phone,
  AlertCircle,
  Pill,
  ExternalLink,
  ChevronRight,
  AlertOctagon,
  ShieldAlert,
  Zap,
  Check,
  Trash2,
  Plus,
  Stethoscope,
  X,
  Users,
  Eye,
  Printer,
  CheckCircle2
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DoctorService, formatDoctorTitle } from '../../services/doctorService';
import {
  getStoredDiseaseHistory,
  saveStoredDiseaseHistory,
  subscribeToPriorityChanges
} from '../../services/patientPriorityService';
import { getPatientAvatar } from '../../services/patientAvatarService';

export default function DoctorPatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctor } = useDoctorAuth();
  const { isHindi } = useLanguage();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState('');
  const [noteList, setNoteList] = useState([]);

  // Reports & Prescriptions State for this Patient
  const [patientReports, setPatientReports] = useState([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);
  const [selectedReportModal, setSelectedReportModal] = useState(null);
  const [showAddRxModal, setShowAddRxModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // New Prescription quick composer state
  const [newRxData, setNewRxData] = useState({
    medicineName: '',
    strength: '40mg',
    dosageForm: 'Tablet',
    frequency: 'Once Daily',
    timing: 'Morning after breakfast',
    duration: '30 Days',
    instructions: 'Take with water after meals.',
    dietAdvice: 'Maintain low-sodium DASH diet and drink 2.5L water daily.',
    nextReview: '14 days'
  });

  // Medical History (Diseases Faced & Facing) State & Realtime Sync
  const [diseaseList, setDiseaseList] = useState(() => getStoredDiseaseHistory());
  const [diseaseFilter, setDiseaseFilter] = useState('all');
  const [showAddConditionModal, setShowAddConditionModal] = useState(false);
  const [newDoctorCondition, setNewDoctorCondition] = useState({
    name: '',
    stage: 'Stage II',
    status: 'ongoing',
    timeline: 'Ongoing',
    isDanger: false,
    category: 'Oncology',
    notes: '',
    editableBy: 'both' // 'both' | 'doctor' | 'patient'
  });

  useEffect(() => {
    setDiseaseList(getStoredDiseaseHistory());
    const unsub = subscribeToPriorityChanges(() => {
      setDiseaseList(getStoredDiseaseHistory());
    });
    return unsub;
  }, []);

  const doctorDisplayName = formatDoctorTitle(doctor?.fullName || doctor?.name) || 'Dr. Sarah Patel';

  const handleDoctorToggleStatus = (diseaseId) => {
    const updated = diseaseList.map((d) => {
      if (d.id === diseaseId) {
        const nextStatus = d.status === 'ongoing' ? 'resolved' : 'ongoing';
        return {
          ...d,
          status: nextStatus,
          timeline: nextStatus === 'resolved' ? (d.timeline && !d.timeline.includes('Ongoing') ? d.timeline : 'Resolved') : 'Ongoing',
          lastUpdatedBy: `Doctor (${doctorDisplayName})`,
          updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
      }
      return d;
    });
    setDiseaseList(updated);
    saveStoredDiseaseHistory(updated);
  };

  const handleDoctorUpdateAuthority = (diseaseId, newAuthority) => {
    const updated = diseaseList.map((d) => {
      if (d.id === diseaseId) {
        return {
          ...d,
          editableBy: newAuthority,
          lastUpdatedBy: `Doctor (${doctorDisplayName})`,
          updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        };
      }
      return d;
    });
    setDiseaseList(updated);
    saveStoredDiseaseHistory(updated);
  };

  const handleDoctorDeleteCondition = (diseaseId) => {
    const updated = diseaseList.filter((d) => d.id !== diseaseId);
    setDiseaseList(updated);
    saveStoredDiseaseHistory(updated);
  };

  const handleDoctorAddCondition = (e) => {
    e.preventDefault();
    if (!newDoctorCondition.name.trim()) return;

    const isDanger = Boolean(newDoctorCondition.isDanger);
    const entry = {
      id: `dis-${Date.now()}`,
      name: newDoctorCondition.name.trim(),
      stage: newDoctorCondition.stage?.trim() || (isDanger ? 'Stage II' : 'Active'),
      status: newDoctorCondition.status,
      timeline: newDoctorCondition.timeline?.trim() || (newDoctorCondition.status === 'ongoing' ? 'Ongoing' : 'Resolved'),
      isDanger,
      dangerLevel: isDanger ? 'critical' : newDoctorCondition.status === 'ongoing' ? 'moderate' : 'resolved',
      category: newDoctorCondition.category?.trim() || 'General',
      notes: newDoctorCondition.notes?.trim() || (isDanger ? 'Clinical oncology management by attending physician.' : ''),
      editableBy: newDoctorCondition.editableBy || 'both',
      lastUpdatedBy: `Doctor (${doctorDisplayName})`,
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updated = [entry, ...diseaseList];
    setDiseaseList(updated);
    saveStoredDiseaseHistory(updated);
    setNewDoctorCondition({
      name: '',
      stage: 'Stage II',
      status: 'ongoing',
      timeline: 'Ongoing',
      isDanger: false,
      category: 'Oncology',
      notes: '',
      editableBy: 'both'
    });
    setShowAddConditionModal(false);
  };

  useEffect(() => {
    const list = DoctorService.getDoctorPatients(doctor?.uid || 'doc_mock_1') || [];
    const found = list.find((p) => p.id === id || p.patientReferenceId === id);
    if (found) {
      setPatient(found);
      setNoteList([
        {
          id: 'n1',
          date: 'Nov 02, 2026',
          author: formatDoctorTitle(doctor?.fullName || doctor?.name),
          text: 'Patient responding well to Telmisartan. Advised continuous home BP monitoring twice weekly in morning.',
        },
        {
          id: 'n2',
          date: 'Oct 18, 2026',
          author: formatDoctorTitle(doctor?.fullName || doctor?.name),
          text: 'Initial presentation with recurring afternoon headaches. Fasting blood sugar normal. Started low sodium diet.',
        },
      ]);
    } else {
      // Mock patient fallback
      const fallbackPatient = {
        id: id,
        name: 'Rahul Sharma',
        age: 45,
        gender: 'Male',
        phone: '+91 98765 43210',
        bloodGroup: 'B+',
        condition: 'Essential High Blood Pressure',
        lastVisit: 'Nov 02, 2026',
        nextFollowUp: 'Nov 16, 2026',
        status: 'Under Care',
        emergencyContact: '+91 98111 22334 (Spouse)',
      };
      setPatient(fallbackPatient);
    }
  }, [id, doctor]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const loadPatientClinicalRecords = (currentPatient) => {
    const activePatient = currentPatient || patient;
    if (!activePatient) return;

    const docUid = doctor?.uid || 'demo-doctor-uid-002';
    const allReports = DoctorService.getDoctorReports(docUid) || [];
    const allPrescriptions = DoctorService.getDoctorPrescriptions(docUid) || [];

    const pName = (activePatient.name || activePatient.patientName || '').toLowerCase().trim();
    const pId = activePatient.id || id;

    let matchedReports = allReports.filter(
      (r) => r.patientId === pId || (r.patientName && r.patientName.toLowerCase().trim() === pName)
    );

    let matchedPrescriptions = allPrescriptions.filter(
      (rx) => rx.patientId === pId || (rx.patientName && rx.patientName.toLowerCase().trim() === pName)
    );

    // Fallback baseline report if none found yet
    if (matchedReports.length === 0) {
      matchedReports = [
        {
          id: `rep_${pId}`,
          patientId: pId,
          patientName: activePatient.name || 'Rahul Sharma',
          doctorUid: docUid,
          doctorName: formatDoctorTitle(doctor?.fullName || doctor?.name),
          doctorRegNumber: doctor?.registrationNumber || 'MD-89241-US',
          clinicName: 'BioTrajectory Specialty Health Center',
          createdAt: activePatient.lastVisit?.replace(/\(.*?\)/g, '').trim() || '2026-11-02',
          type: activePatient.appointmentType || 'In-Person Consultation',
          diagnosis: activePatient.condition || 'Stage 1 Essential Hypertension',
          complaints: 'Routine longitudinal health trajectory review and vital monitoring check.',
          hpi: `${activePatient.age || 45}-year-old ${activePatient.gender || 'patient'} under active clinical management for longitudinal biomarker tracking.`,
          vitals: { bp: '134/86', heartRate: '76', spo2: '99', temp: '98.4', weight: '72' },
          examination: 'Patient is conscious, alert, oriented. Cardiac auscultation normal S1/S2 without murmurs. Breath sounds clear bilaterally.',
          tests: 'Complete Blood Count (CBC), Fasting Lipid Profile, 10SG urinalysis dipstick.',
          advice: 'Continue low-sodium DASH diet guidelines, maintain hydration, and take daily medications as prescribed.',
          followUp: activePatient.nextFollowUp || 'In 2 weeks',
          warningSigns: 'Seek emergency evaluation for severe sudden chest tightness, sudden shortness of breath, or visual blackout.',
          status: 'signed',
          signedAt: new Date().toISOString()
        }
      ];
    }

    // Fallback baseline prescription if none found yet
    if (matchedPrescriptions.length === 0) {
      matchedPrescriptions = [
        {
          id: `rx_${pId}`,
          patientId: pId,
          patientName: activePatient.name || 'Rahul Sharma',
          age: activePatient.age || 45,
          gender: activePatient.gender || 'Male',
          date: '2026-11-02',
          doctorName: formatDoctorTitle(doctor?.fullName || doctor?.name),
          diagnosis: activePatient.condition || 'Stage 1 Essential Hypertension',
          medicines: [
            {
              name: 'Telmisartan 40mg',
              dosage: '1 tablet once daily in the morning',
              timing: 'After breakfast with water',
              duration: '30 days',
              notes: 'Monitors systolic blood pressure; avoid sudden cessation.'
            }
          ],
          generalAdvice: 'Reduce dietary sodium (<2g/day), maintain 2.5L daily hydration, and engage in 30 minutes of aerobic exercise.',
          followUpDate: activePatient.nextFollowUp || 'In 2 weeks'
        }
      ];
    }

    setPatientReports(matchedReports);
    setPatientPrescriptions(matchedPrescriptions);
  };

  useEffect(() => {
    if (patient) {
      loadPatientClinicalRecords(patient);
    }
  }, [patient, doctor]);

  const handleSaveQuickRx = (e) => {
    e.preventDefault();
    if (!newRxData.medicineName.trim()) return;

    const docUid = doctor?.uid || 'demo-doctor-uid-002';
    const newRx = {
      id: 'rx_' + Date.now().toString(36),
      patientId: patient?.id || id,
      patientName: patient?.name || 'Patient',
      age: patient?.age || 35,
      gender: patient?.gender || 'Patient',
      date: new Date().toISOString().split('T')[0],
      doctorName: formatDoctorTitle(doctor?.fullName || doctor?.name),
      diagnosis: patient?.condition || 'Clinical Care Plan',
      medicines: [
        {
          name: newRxData.medicineName.trim(),
          strength: newRxData.strength || '',
          dosageForm: newRxData.dosageForm || 'Tablet',
          frequency: newRxData.frequency || 'Once Daily',
          timing: newRxData.timing || 'After meals',
          duration: newRxData.duration || '30 Days',
          notes: newRxData.instructions || 'Take as directed.'
        }
      ],
      generalAdvice: newRxData.dietAdvice,
      followUpDate: newRxData.nextReview
    };

    DoctorService.saveDoctorPrescription(docUid, newRx);
    loadPatientClinicalRecords(patient);
    setShowAddRxModal(false);
    setNewRxData({
      medicineName: '',
      strength: '40mg',
      dosageForm: 'Tablet',
      frequency: 'Once Daily',
      timing: 'Morning after breakfast',
      duration: '30 Days',
      instructions: 'Take with water after meals.',
      dietAdvice: 'Maintain low-sodium DASH diet and drink 2.5L water daily.',
      nextReview: '14 days'
    });
    showToast(isHindi ? `✓ ${newRx.medicines[0].name} का नुस्खा सफलतापूर्वक जोड़ा गया!` : `✓ Prescription for ${newRx.medicines[0].name} saved!`);
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!notes.trim()) return;
    const newNote = {
      id: 'n_' + Date.now(),
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: formatDoctorTitle(doctor?.fullName || doctor?.name),
      text: notes.trim(),
    };
    setNoteList([newNote, ...noteList]);
    setNotes('');
  };

  if (!patient) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Back button & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/doctor/patients"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to My Patients
          </Link>
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-gradient-to-tr from-cyan-400 to-blue-500 text-white font-bold flex items-center justify-center text-lg shadow-sm shrink-0">
              {patient.avatar || getPatientAvatar() ? (
                <img
                  src={patient.avatar || getPatientAvatar()}
                  alt={patient.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                patient.name.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  {patient.name}
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                  {patient.status}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
                Patient ID: {patient.id} • Registered under your direct clinical care
              </p>
            </div>
          </div>
        </div>

        {/* Top Clinical Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/doctor/video-consultation?patientId=${patient.id}&name=${encodeURIComponent(patient.name)}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
            title="Start Video Consultation"
          >
            <Video className="w-4 h-4" />
            <span>{isHindi ? 'वीडियो परामर्श' : 'Video Consultation'}</span>
          </Link>
          <Link
            to={`/doctor/reports/new?patientId=${patient.id}&name=${encodeURIComponent(patient.name)}&age=${patient.age}&gender=${patient.gender}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
            title="Write New Clinical Report"
          >
            <FileText className="w-4 h-4" />
            <span>{isHindi ? 'रिपोर्ट लिखें' : 'Write Report'}</span>
          </Link>
          <Link
            to={`/doctor/prescriptions/new?patientId=${patient.id}&name=${encodeURIComponent(patient.name)}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer active:scale-95"
            title="Add New Prescription"
          >
            <Pill className="w-4 h-4" />
            <span>{isHindi ? '+ नुस्खा जोड़ें' : '+ Add Prescription'}</span>
          </Link>
        </div>
      </div>

      {/* Demographic & Vitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Demographic Details
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Age / Gender:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{patient.age} yrs • {patient.gender}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Blood Group:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{patient.bloodGroup}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Contact Number:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{patient.phone}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Emergency Contact:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {typeof patient.emergencyContact === 'object' && patient.emergencyContact !== null
                  ? `${patient.emergencyContact.name || ''} ${patient.emergencyContact.phone || ''} ${patient.emergencyContact.relationship ? `(${patient.emergencyContact.relationship})` : ''}`.trim() || 'Not recorded'
                  : String(patient.emergencyContact || 'Not recorded')}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Consent Status:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Doctor Care Circle
              </span>
            </div>
          </div>
        </div>

        {/* Primary Diagnosis & Follow-up */}
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Active Diagnosis & Care Plan
          </h3>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/40">
              <span className="text-[11px] font-semibold text-blue-800 dark:text-blue-300">Primary Condition</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{patient.condition}</p>
            </div>

            <div className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="text-slate-500">Next Follow-Up Date:</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{patient.nextFollowUp || 'TBD'}</span>
            </div>
          </div>
        </div>

        {/* Latest Vitals Snapshot */}
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Latest Biometrics
          </h3>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Blood Pressure</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">134/86</p>
              <span className="text-[9px] text-amber-500 font-semibold">Mild High</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Heart Rate</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">76 bpm</p>
              <span className="text-[9px] text-emerald-500 font-semibold">Normal</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">SpO2</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">99 %</p>
              <span className="text-[9px] text-emerald-500 font-semibold">Optimal</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase">Weight / BMI</span>
              <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">72 kg (24.1)</p>
              <span className="text-[9px] text-emerald-500 font-semibold">Healthy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-sm">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 font-semibold transition-colors relative ${activeTab === 'overview'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
        >
          Clinical Notes & Timeline
        </button>
        <button
          onClick={() => setActiveTab('diseases')}
          className={`pb-3 font-semibold transition-colors relative flex items-center gap-2 ${activeTab === 'diseases'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
        >
          <span>Diseases Faced & Facing</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {diseaseList.length}
          </span>
          {diseaseList.some(d => d.status === 'ongoing' && d.isDanger) && (
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 font-semibold transition-colors relative flex items-center gap-1.5 ${activeTab === 'reports'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
        >
          <span>{isHindi ? 'पिछली रिपोर्ट्स एवं सारांश' : 'Past Reports & Summaries'}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
            {patientReports.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`pb-3 font-semibold transition-colors relative flex items-center gap-1.5 ${activeTab === 'prescriptions'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
        >
          <span>{isHindi ? 'दवाएं एवं नुस्खे (Prescriptions)' : 'Medications & Prescriptions'}</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400">
            {patientPrescriptions.length}
          </span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Add Doctor Note */}
          <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
              Add Practitioner Care Note
            </h3>
            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Record clinical impressions, observations, or follow-up instructions..."
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>

          {/* Timeline of Notes */}
          <div className="space-y-3">
            {noteList.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{n.author}</span>
                  <span>{n.date}</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {n.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Diseases Faced & Facing (Clinician Collaborative Management) */}
      {activeTab === 'diseases' && (() => {
        const filtered = diseaseList.filter((d) => {
          if (diseaseFilter === 'ongoing') return d.status === 'ongoing';
          if (diseaseFilter === 'resolved') return d.status === 'resolved';
          return true;
        });

        return (
          <div className="space-y-6">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Clinical Disease Registry: Faced & Facing</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Synchronized medical record. Modify clinical status and configure whether each condition can be changed by doctor, patient, or both.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddConditionModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Clinical Diagnosis</span>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              {[
                { id: 'all', label: `All Conditions (${diseaseList.length})` },
                {
                  id: 'ongoing',
                  label: `Facing / Ongoing (${diseaseList.filter(d => d.status === 'ongoing').length})`,
                  hasDanger: diseaseList.some(d => d.status === 'ongoing' && d.isDanger)
                },
                {
                  id: 'resolved',
                  label: `Faced / Resolved (${diseaseList.filter(d => d.status === 'resolved').length})`
                }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setDiseaseFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    diseaseFilter === tab.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {tab.hasDanger && (
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  )}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Grid of Diseases */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((disease) => {
                const isOngoing = disease.status === 'ongoing';
                const isDanger = (disease.isDanger || disease.dangerLevel === 'critical') && isOngoing;

                return (
                  <div
                    key={disease.id}
                    className={`p-5 rounded-3xl border transition-all space-y-3 relative shadow-xs ${
                      isDanger
                        ? 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/60 dark:border-rose-500/70 shadow-sm ring-1 ring-rose-500/20'
                        : isOngoing
                        ? 'bg-amber-500/5 dark:bg-slate-900/90 border-amber-500/30 dark:border-slate-800'
                        : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {/* Header: Name + Stage + State Toggle */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <h4 className={`font-extrabold text-base sm:text-lg tracking-tight ${
                          isDanger ? 'text-rose-900 dark:text-rose-100' : 'text-slate-900 dark:text-white'
                        }`}>
                          {disease.name}
                        </h4>
                        {disease.stage && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30">
                            {disease.stage}
                          </span>
                        )}
                        {isDanger && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] tracking-wide uppercase shadow-xs">
                            <AlertOctagon className="w-3 h-3" />
                            <span>CRITICAL / HIGH RISK</span>
                          </span>
                        )}
                      </div>

                      {/* Doctor State Toggle & Delete */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleDoctorToggleStatus(disease.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                            isOngoing
                              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 border border-amber-500/40'
                              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-900 dark:text-emerald-200 border border-emerald-500/40'
                          }`}
                          title="Click to toggle between Facing (Ongoing) and Faced (Resolved)"
                        >
                          {isOngoing ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                              <span>Facing (Ongoing)</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>Faced ({disease.timeline || 'Resolved'})</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDoctorDeleteCondition(disease.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-xl cursor-pointer"
                          title="Remove condition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 2-Line Clinical Notes */}
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {disease.notes || 'Documented in longitudinal patient record with verified biometric tracking.'}
                    </p>

                    {/* Authority / Can be changed by */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 text-[11px]">
                          Can be changed by:
                        </span>
                        <select
                          value={disease.editableBy || 'both'}
                          onChange={(e) => handleDoctorUpdateAuthority(disease.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer focus:outline-none ${
                            disease.editableBy === 'doctor'
                              ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/40'
                              : disease.editableBy === 'patient'
                              ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/40'
                              : 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          <option value="both">👨‍⚕️👤 Both (Doctor & Patient)</option>
                          <option value="doctor">👨‍⚕️ Doctor Only</option>
                          <option value="patient">👤 Patient Only</option>
                        </select>
                      </div>

                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        Updated by:{' '}
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {disease.lastUpdatedBy || 'Doctor & Patient'}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Doctor Add Condition Modal */}
            {showAddConditionModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                        Add Clinical Diagnosis (Physician Registry)
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddConditionModal(false)}
                      className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <form onSubmit={handleDoctorAddCondition} className="space-y-3.5 text-xs">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                        Condition / Disease Name
                      </label>
                      <input
                        type="text"
                        value={newDoctorCondition.name}
                        onChange={(e) => setNewDoctorCondition({ ...newDoctorCondition, name: e.target.value })}
                        placeholder="e.g. Colorectal Cancer, Essential Hypertension, Jaundice, Type 2 Diabetes"
                        className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    {/* Status & Timeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                          Clinical Status
                        </label>
                        <select
                          value={newDoctorCondition.status}
                          onChange={(e) => setNewDoctorCondition({ ...newDoctorCondition, status: e.target.value })}
                          className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none"
                        >
                          <option value="ongoing">Facing (Ongoing / Under Treatment)</option>
                          <option value="resolved">Faced (Past / Resolved)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                          Clinical Stage / Severity
                        </label>
                        <input
                          type="text"
                          value={newDoctorCondition.stage}
                          onChange={(e) => setNewDoctorCondition({ ...newDoctorCondition, stage: e.target.value })}
                          placeholder="e.g. Stage II, Stage 1, Acute, Chronic"
                          className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Authority & Danger */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                          Can be changed by
                        </label>
                        <select
                          value={newDoctorCondition.editableBy}
                          onChange={(e) => setNewDoctorCondition({ ...newDoctorCondition, editableBy: e.target.value })}
                          className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none"
                        >
                          <option value="both">👨‍⚕️👤 Both (Doctor & Patient)</option>
                          <option value="doctor">👨‍⚕️ Doctor Only</option>
                          <option value="patient">👤 Patient Only</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                          Timeline / Onset
                        </label>
                        <input
                          type="text"
                          value={newDoctorCondition.timeline}
                          onChange={(e) => setNewDoctorCondition({ ...newDoctorCondition, timeline: e.target.value })}
                          placeholder="e.g. Ongoing, 6 months ago"
                          className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Danger Illness Checkbox */}
                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        id="docIsDanger"
                        checked={newDoctorCondition.isDanger}
                        onChange={(e) => setNewDoctorCondition({ ...newDoctorCondition, isDanger: e.target.checked })}
                        className="mt-0.5 accent-rose-600 rounded cursor-pointer"
                      />
                      <label htmlFor="docIsDanger" className="cursor-pointer space-y-0.5 flex-1">
                        <strong className="block text-rose-700 dark:text-rose-300 font-extrabold text-xs">
                          🚨 Designate as Critical Danger Illness (Assigns Patient Red Priority Status)
                        </strong>
                        <p className="text-[11px] text-rose-800/80 dark:text-rose-200/80">
                          Immediately activates fast-track clinical triage and high-risk dashboard routing.
                        </p>
                      </label>
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                        Physician Clinical Directions / Notes
                      </label>
                      <textarea
                        rows={2}
                        value={newDoctorCondition.notes}
                        onChange={(e) => setNewDoctorCondition({ ...newDoctorCondition, notes: e.target.value })}
                        placeholder="e.g. Active oncology care with regular clinical surveillance and CEA biomarker trajectory monitoring."
                        className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setShowAddConditionModal(false)}
                        className="px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={!newDoctorCondition.name.trim()}
                        className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-extrabold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 transition-all shadow-sm cursor-pointer"
                      >
                        Save Clinical Diagnosis
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* TAB 3: PAST REPORTS & CLINICAL SUMMARIES                                 */}
      {/* ========================================================================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Action Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{isHindi ? `क्लिनिकल रिपोर्ट्स: ${patient.name}` : `Clinical Consultation Reports: ${patient.name}`}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isHindi
                  ? 'पिछली सत्यापित रिपोर्ट्स की समीक्षा करें अथवा वर्तमान विजिट के लिए नई क्लिनिकल रिपोर्ट तैयार करें।'
                  : 'Review signed visit documentation, check previous reports, or author a new clinical report.'}
              </p>
            </div>

            <Link
              to={`/doctor/reports/new?patientId=${patient.id}&name=${encodeURIComponent(patient.name)}&age=${patient.age || 45}&gender=${patient.gender || 'Patient'}`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              <span>{isHindi ? '✍️ नई रिपोर्ट लिखें' : '✍️ Write New Report'}</span>
            </Link>
          </div>

          {/* List of Previous Reports */}
          <div className="space-y-4">
            {patientReports.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {isHindi ? 'कोई पिछली रिपोर्ट उपलब्ध नहीं' : 'No previous clinical reports found'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isHindi ? 'इस मरीज के लिए पहली क्लिनिकल रिपोर्ट लिखने हेतु ऊपर दिए बटन का उपयोग करें।' : 'Click the button above to author the first consultation report.'}
                </p>
              </div>
            ) : (
              patientReports.map((report) => (
                <div
                  key={report.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {report.id}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          {report.createdAt || report.date} • {report.type || 'Consultation'}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          ✓ Signed by {report.doctorName || 'Doctor'}
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1.5">
                        {report.diagnosis || 'Clinical Evaluation'}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedReportModal(report)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-700 dark:text-purple-300 font-extrabold text-xs transition-all cursor-pointer shadow-xs active:scale-95"
                      >
                        <Eye className="w-4 h-4" />
                        <span>{isHindi ? 'पिछली रिपोर्ट जांचें' : 'Check Previous Report'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReportModal(report);
                          setTimeout(() => window.print(), 300);
                        }}
                        className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                        title="Print Report"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Vitals Snapshot */}
                  {report.vitals && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 text-[10px] block">BP (mmHg)</span>
                        <strong className="text-slate-900 dark:text-white font-bold">{report.vitals.bp || '136/86'}</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Heart Rate</span>
                        <strong className="text-slate-900 dark:text-white font-bold">{report.vitals.heartRate || '74'} bpm</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 text-[10px] block">SpO2 Oxygen</span>
                        <strong className="text-slate-900 dark:text-white font-bold">{report.vitals.spo2 || '98'} %</strong>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 text-[10px] block">Temperature</span>
                        <strong className="text-slate-900 dark:text-white font-bold">{report.vitals.temp || '98.6'} °F</strong>
                      </div>
                    </div>
                  )}

                  {/* Complaints & Physician Advice */}
                  <div className="space-y-2 text-xs">
                    {report.complaints && (
                      <p className="text-slate-600 dark:text-slate-300">
                        <strong className="text-slate-800 dark:text-slate-200">Complaints: </strong>
                        {report.complaints}
                      </p>
                    )}
                    {report.advice && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-950 dark:text-emerald-200">
                        <strong>Physician Guidance: </strong>
                        <span>{report.advice}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: MEDICATIONS & ELECTRONIC PRESCRIPTIONS                             */}
      {/* ========================================================================= */}
      {activeTab === 'prescriptions' && (
        <div className="space-y-6">
          {/* Action Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <span>{isHindi ? `दवाएं एवं नुस्खा सूची: ${patient.name}` : `Active Prescriptions & Medication Care: ${patient.name}`}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isHindi
                  ? 'सक्रिय इलेक्ट्रॉनिक नुस्खे देखें या इस मरीज के लिए नई दवा व खुराक जोड़ें।'
                  : 'Review active pharmaceuticals, dosage instructions, or issue an electronic prescription.'}
              </p>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <button
                type="button"
                onClick={() => setShowAddRxModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>{isHindi ? '+ त्वरित नुस्खा जोड़ें' : '+ Quick Add Rx'}</span>
              </button>

              <Link
                to={`/doctor/prescriptions/new?patientId=${patient.id}&name=${encodeURIComponent(patient.name)}`}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
              >
                <Pill className="w-4 h-4" />
                <span>{isHindi ? 'विस्तृत नुस्खा फॉर्म' : 'Full Prescription Form'}</span>
              </Link>
            </div>
          </div>

          {/* List of Prescriptions */}
          <div className="space-y-4">
            {patientPrescriptions.length === 0 ? (
              <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <Pill className="w-8 h-8 text-slate-400 mx-auto" />
                <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
                  {isHindi ? 'कोई सक्रिय नुस्खा नहीं' : 'No active prescriptions recorded'}
                </h4>
                <p className="text-xs text-slate-500">
                  {isHindi ? 'नया नुस्खा जोड़ने हेतु ऊपर दिए बटन पर क्लिक करें।' : 'Click "+ Quick Add Rx" above to prescribe medications for this patient.'}
                </p>
              </div>
            ) : (
              patientPrescriptions.map((rx) => (
                <div
                  key={rx.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300">
                          {rx.id}
                        </span>
                        <span className="text-xs font-bold text-slate-500">
                          Prescribed: {rx.date}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          ✓ Active Treatment Regimen
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1.5">
                        {rx.diagnosis || patient.condition}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print Rx</span>
                      </button>
                    </div>
                  </div>

                  {/* Medicines List */}
                  <div className="space-y-2.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Prescribed Medications:
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(rx.medicines || []).map((med, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <h5 className="font-extrabold text-sm text-slate-900 dark:text-white">
                              {med.name} {med.strength}
                            </h5>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-700 dark:text-blue-300">
                              {med.dosageForm || 'Tablet'}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300">
                            <strong>Dosage: </strong>{med.dosage || `${med.frequency || 'Once daily'} • ${med.timing || 'After meals'}`}
                          </p>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
                            <span>Duration: <strong className="text-slate-700 dark:text-slate-300">{med.duration || '30 Days'}</strong></span>
                            <span className="italic">{med.notes || med.instructions || 'As advised'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* General Advice & Review Date */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <p className="text-slate-600 dark:text-slate-300">
                      <strong>Dietary & Lifestyle Advice: </strong>
                      {rx.generalAdvice || 'Maintain low-sodium diet and hydrate regularly.'}
                    </p>
                    <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">
                      Next Review: {rx.followUpDate || 'In 2 weeks'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* QUICK ADD PRESCRIPTION MODAL                                              */}
      {/* ========================================================================= */}
      {showAddRxModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-2xl space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {isHindi ? `नुस्खा जोड़ें: ${patient.name}` : `Quick Prescribe for ${patient.name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddRxModal(false)}
                className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuickRx} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                  Medicine Name & Salt
                </label>
                <input
                  type="text"
                  value={newRxData.medicineName}
                  onChange={(e) => setNewRxData({ ...newRxData, medicineName: e.target.value })}
                  placeholder="e.g. Telmisartan, Metformin, Ferrous Ascorbate, Pantoprazole"
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                    Strength / Dose
                  </label>
                  <input
                    type="text"
                    value={newRxData.strength}
                    onChange={(e) => setNewRxData({ ...newRxData, strength: e.target.value })}
                    placeholder="e.g. 40mg, 500mg, 100mg"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                    Dosage Form
                  </label>
                  <select
                    value={newRxData.dosageForm}
                    onChange={(e) => setNewRxData({ ...newRxData, dosageForm: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Inhaler">Inhaler</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                    Frequency & Timing
                  </label>
                  <input
                    type="text"
                    value={newRxData.timing}
                    onChange={(e) => setNewRxData({ ...newRxData, timing: e.target.value })}
                    placeholder="e.g. Morning after breakfast"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newRxData.duration}
                    onChange={(e) => setNewRxData({ ...newRxData, duration: e.target.value })}
                    placeholder="e.g. 14 Days, 30 Days"
                    className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                  Special Instructions
                </label>
                <input
                  type="text"
                  value={newRxData.instructions}
                  onChange={(e) => setNewRxData({ ...newRxData, instructions: e.target.value })}
                  placeholder="e.g. Take with water; maintain daily morning BP logs."
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddRxModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newRxData.medicineName.trim()}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-extrabold disabled:opacity-50 transition-all shadow-sm cursor-pointer"
                >
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CHECK PREVIOUS REPORT MODAL (Full 13-Field Clinical View)                 */}
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
                    {isHindi ? 'परामर्श के दौरान मापे गए वाइटल्स:' : 'Recorded Vitals During Visit:'}
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

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1F150E] text-white border border-cyan-500/40 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
