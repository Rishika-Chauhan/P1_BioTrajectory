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
  ChevronRight
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { DoctorService } from '../../services/doctorService';

export default function DoctorPatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctor } = useDoctorAuth();
  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [notes, setNotes] = useState('');
  const [noteList, setNoteList] = useState([]);

  useEffect(() => {
    const list = DoctorService.getDoctorPatients(doctor?.uid || 'doc_mock_1') || [];
    const found = list.find((p) => p.id === id || p.patientReferenceId === id);
    if (found) {
      setPatient(found);
      setNoteList([
        {
          id: 'n1',
          date: 'Nov 02, 2026',
          author: 'Dr. ' + (doctor?.fullName || 'Practitioner'),
          text: 'Patient responding well to Telmisartan. Advised continuous home BP monitoring twice weekly in morning.',
        },
        {
          id: 'n2',
          date: 'Oct 18, 2026',
          author: 'Dr. ' + (doctor?.fullName || 'Practitioner'),
          text: 'Initial presentation with recurring afternoon headaches. Fasting blood sugar normal. Started low sodium diet.',
        },
      ]);
    } else {
      // Mock patient fallback
      setPatient({
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
      });
    }
  }, [id, doctor]);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!notes.trim()) return;
    const newNote = {
      id: 'n_' + Date.now(),
      date: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: 'Dr. ' + (doctor?.fullName || 'Practitioner'),
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
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              {patient.name}
            </h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
              {patient.status}
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Patient ID: {patient.id} • Registered under your direct clinical care
          </p>
        </div>

        {/* Top Clinical Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to={`/doctor/video-consultation?patientId=${patient.id}&name=${encodeURIComponent(patient.name)}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium text-xs shadow-sm transition-colors"
          >
            <Video className="w-4 h-4" /> Start Video
          </Link>
          <Link
            to={`/doctor/reports/new?patientId=${patient.id}&name=${encodeURIComponent(patient.name)}&age=${patient.age}&gender=${patient.gender}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-sm transition-colors"
          >
            <FileText className="w-4 h-4" /> New Report
          </Link>
          <Link
            to={`/doctor/prescriptions/new?patientId=${patient.id}&name=${encodeURIComponent(patient.name)}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> New Prescription
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
              <span className="font-semibold text-slate-800 dark:text-slate-200">{patient.emergencyContact || 'Not recorded'}</span>
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
          className={`pb-3 font-semibold transition-colors relative ${
            activeTab === 'overview'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Clinical Notes & Timeline
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-3 font-semibold transition-colors relative ${
            activeTab === 'reports'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Past Reports & Summaries
        </button>
        <button
          onClick={() => setActiveTab('prescriptions')}
          className={`pb-3 font-semibold transition-colors relative ${
            activeTab === 'prescriptions'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Medications & Prescriptions
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

      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Hypertension Initial Assessment & Management Plan</h4>
              <p className="text-xs text-slate-500 mt-0.5">Consultation date: Nov 02, 2026 • In-Person Visit</p>
            </div>
            <Link
              to="/doctor/reports"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              View Document <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {activeTab === 'prescriptions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Telmisartan 40mg Tablet</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold">Active</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">1 tablet once daily in the morning after breakfast • Duration: 30 days</p>
          </div>
        </div>
      )}
    </div>
  );
}
