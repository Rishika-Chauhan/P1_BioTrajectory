import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  FileText,
  Save,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  Printer,
  Eye,
  Info
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { DoctorService } from '../../services/doctorService';

export default function DoctorNewReportPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { doctor, isVerified } = useDoctorAuth();

  const patientId = searchParams.get('patientId') || 'p_01';
  const paramName = searchParams.get('name') || 'Rahul Sharma';
  const paramAge = searchParams.get('age') || '45';
  const paramGender = searchParams.get('gender') || 'Male';

  // 13 Clinical Fields State
  const [formData, setFormData] = useState({
    patientId: patientId,
    patientName: paramName,
    age: paramAge,
    gender: paramGender,
    consultationType: 'In-Person',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    complaints: 'Occasional morning occipital headache, mild fatigue, and borderline home BP readings over the last 10 days.',
    hpi: '45-year-old male with gradual onset of mild morning headaches for 2 weeks. No history of vision blurring, palpitations, or chest distress. Diet contains high sodium.',
    vitals: {
      bp: '138/88',
      heartRate: '76',
      spo2: '98',
      temp: '98.4',
      weight: '74',
    },
    examination: 'Patient is conscious, alert, and oriented. Chest clear bilaterally, S1 S2 heard with no murmurs. No pedal edema.',
    diagnosis: 'Stage 1 Essential Hypertension',
    tests: 'Complete Blood Count (CBC), Fasting Blood Glucose, Serum Creatinine, Lipid Profile, and 12-Lead ECG.',
    treatmentPlan: 'Initiate Telmisartan 40mg once daily in morning after breakfast. Recommend DASH dietary approach (sodium <2g/day) and 30 mins brisk walking daily.',
    followUp: '2 weeks (Nov 23, 2026)',
    warningSigns: 'Seek emergency care immediately if experiencing severe sudden chest pain, difficulty breathing, visual blackout, or neurological weakness.',
  });

  const [plainLanguageSummary, setPlainLanguageSummary] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVitalsChange = (vital, value) => {
    setFormData((prev) => ({
      ...prev,
      vitals: { ...prev.vitals, [vital]: value },
    }));
  };

  // Generate plain language summary for patient
  const handleGeneratePlainSummary = () => {
    const summary = DoctorService.generatePatientFriendlySummary(formData);
    setPlainLanguageSummary(summary);
  };

  // Save report
  const handleSaveReport = (status = 'draft') => {
    const newReport = {
      id: 'rep_' + Date.now().toString(36),
      patientId: formData.patientId,
      patientName: formData.patientName,
      doctorUid: doctor?.uid || 'doc_mock_1',
      doctorName: doctor?.fullName || 'Practitioner',
      doctorRegNumber: doctor?.regNumber || 'MCI-84729-A',
      clinicName: doctor?.clinicName || 'BioTrajectory Specialty Center',
      createdAt: formData.date,
      type: formData.consultationType,
      diagnosis: formData.diagnosis,
      complaints: formData.complaints,
      hpi: formData.hpi,
      vitals: formData.vitals,
      examination: formData.examination,
      tests: formData.tests,
      advice: formData.treatmentPlan,
      followUp: formData.followUp,
      warningSigns: formData.warningSigns,
      status: status,
      signedAt: status === 'signed' ? new Date().toISOString() : null,
      patientFriendlySummary: plainLanguageSummary,
    };

    DoctorService.saveDoctorReport(doctor?.uid || 'doc_mock_1', newReport);
    setIsSaved(true);
    setTimeout(() => {
      navigate('/doctor/reports');
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Back button & Title */}
      <div>
        <Link
          to="/doctor/reports"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Consultation Reports
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Write Consultation Report
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Standard 13-field clinical assessment with plain-language patient translation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGeneratePlainSummary}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-semibold hover:bg-purple-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Plain Language Summary
            </button>
            <button
              type="button"
              onClick={() => setIsPreviewOpen(!isPreviewOpen)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              {isPreviewOpen ? 'Hide Preview' : 'Document Preview'}
            </button>
          </div>
        </div>
      </div>

      {/* Notice on Doctor Verification */}
      {!isVerified && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-amber-800 dark:text-amber-300 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
          <span>
            <strong>Verification Notice:</strong> You are currently in review mode. You can create and save draft reports, but authoritative digital signature requires administrative verification of your medical license number.
          </span>
        </div>
      )}

      {/* Patient-Friendly Summary Box if Generated */}
      {plainLanguageSummary && (
        <div className="rounded-2xl p-6 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-transparent border border-teal-500/20 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              Patient-Friendly Plain Language Summary
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200">
              For Patient App Display
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            This simplified translation removes intimidating medical jargon so the patient understands their condition and required steps:
          </p>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/80 border border-teal-200 dark:border-teal-800/60 space-y-2 text-xs">
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block">Condition in Simple Words:</strong>
              <span className="text-teal-700 dark:text-teal-300 font-medium">{plainLanguageSummary.diagnosis}</span>
            </div>
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block">What the Doctor Recommends:</strong>
              <span className="text-slate-600 dark:text-slate-300">{plainLanguageSummary.carePlan}</span>
            </div>
            <div>
              <strong className="text-slate-800 dark:text-slate-200 block">When to Seek Urgent Care:</strong>
              <span className="text-rose-600 dark:text-rose-400">{plainLanguageSummary.warningSigns}</span>
            </div>
          </div>
        </div>
      )}

      {/* Main 13 Fields Form */}
      <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        {/* Section 1: Demographics & Consultation Context (Fields 1-4) */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            1. Patient & Consultation Identifiers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Patient Full Name
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => handleInputChange('patientName', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Age & Gender
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  placeholder="Age"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-2 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Consultation Type
              </label>
              <select
                value={formData.consultationType}
                onChange={(e) => handleInputChange('consultationType', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="In-Person">Clinic In-Person</option>
                <option value="Video Telemedicine">Video Telemedicine</option>
                <option value="Follow-up Call">Follow-up Call</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Date of Visit
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Vitals Recorded (Field 7) */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            2. Recorded Clinical Vitals
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <label className="block font-medium text-slate-500 mb-1">Blood Pressure</label>
              <input
                type="text"
                value={formData.vitals.bp}
                onChange={(e) => handleVitalsChange('bp', e.target.value)}
                placeholder="120/80"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-500 mb-1">Pulse (bpm)</label>
              <input
                type="text"
                value={formData.vitals.heartRate}
                onChange={(e) => handleVitalsChange('heartRate', e.target.value)}
                placeholder="72"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-500 mb-1">SpO2 (%)</label>
              <input
                type="text"
                value={formData.vitals.spo2}
                onChange={(e) => handleVitalsChange('spo2', e.target.value)}
                placeholder="99"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-500 mb-1">Temp (°F)</label>
              <input
                type="text"
                value={formData.vitals.temp}
                onChange={(e) => handleVitalsChange('temp', e.target.value)}
                placeholder="98.6"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-500 mb-1">Weight (kg)</label>
              <input
                type="text"
                value={formData.vitals.weight}
                onChange={(e) => handleVitalsChange('weight', e.target.value)}
                placeholder="70"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Complaints & HPI (Fields 5-6) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            3. Patient History & Chief Complaints
          </h3>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Chief Complaints (Signs & Symptoms reported)
            </label>
            <textarea
              value={formData.complaints}
              onChange={(e) => handleInputChange('complaints', e.target.value)}
              rows={2}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              History of Present Illness (HPI)
            </label>
            <textarea
              value={formData.hpi}
              onChange={(e) => handleInputChange('hpi', e.target.value)}
              rows={2}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Section 4: Examination & Diagnosis (Fields 8-9) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            4. Examination & Clinical Diagnosis
          </h3>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Physical Examination / Telemedicine Observations
            </label>
            <textarea
              value={formData.examination}
              onChange={(e) => handleInputChange('examination', e.target.value)}
              rows={2}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Provisional / Confirmed Diagnosis
            </label>
            <input
              type="text"
              value={formData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-blue-600 dark:text-blue-400 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Section 5: Tests & Treatment Plan (Fields 10-12) */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            5. Recommended Tests, Advice & Warning Signs
          </h3>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Recommended Diagnostic Investigations
            </label>
            <input
              type="text"
              value={formData.tests}
              onChange={(e) => handleInputChange('tests', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Clinical Treatment Plan & Lifestyle Advice
            </label>
            <textarea
              value={formData.treatmentPlan}
              onChange={(e) => handleInputChange('treatmentPlan', e.target.value)}
              rows={2}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Scheduled Follow-Up Review
              </label>
              <input
                type="text"
                value={formData.followUp}
                onChange={(e) => handleInputChange('followUp', e.target.value)}
                placeholder="e.g. 2 weeks"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
                Warning Signs (Emergency Red Flags)
              </label>
              <input
                type="text"
                value={formData.warningSigns}
                onChange={(e) => handleInputChange('warningSigns', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-rose-200 dark:border-rose-900/60 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Digital Signature & Seal (Field 13) */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Practitioner Digital Seal & Verification Stamp
              </h4>
              <p className="text-[11px] text-slate-500">
                Dr. {doctor?.fullName || 'Practitioner'} • Registration No: {doctor?.regNumber || 'MCI-84729-A'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => handleSaveReport('draft')}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Save Draft
            </button>

            <button
              type="button"
              disabled={!isVerified}
              onClick={() => handleSaveReport('signed')}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              Sign & Finalize Report
            </button>
          </div>
        </div>

        {isSaved && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Report saved successfully. Redirecting to reports archive...
          </div>
        )}
      </div>
    </div>
  );
}
