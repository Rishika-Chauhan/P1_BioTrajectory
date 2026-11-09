import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Pill,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Calendar,
  Clock,
  Printer
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { DoctorService } from '../../services/doctorService';

export default function DoctorNewPrescriptionPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { doctor, isVerified } = useDoctorAuth();

  const patientId = searchParams.get('patientId') || 'p_01';
  const patientName = searchParams.get('name') || 'Rahul Sharma';

  const [medicines, setMedicines] = useState([
    {
      name: 'Telmisartan',
      strength: '40mg',
      dosageForm: 'Tablet',
      frequency: 'Once Daily',
      timing: 'Morning after breakfast',
      duration: '30 Days',
      instructions: 'Take with a glass of water at the same time each morning.',
    },
  ]);

  const [dietAdvice, setDietAdvice] = useState('Maintain low sodium (<2g per day). Avoid processed foods and deep fried snacks.');
  const [nextReview, setNextReview] = useState('14 days');
  const [isSaved, setIsSaved] = useState(false);

  const commonMeds = [
    { name: 'Telmisartan', strength: '40mg', form: 'Tablet', freq: 'Once Daily', timing: 'Morning', inst: 'Take after breakfast.' },
    { name: 'Metformin', strength: '500mg', form: 'Tablet', freq: 'Twice Daily', timing: 'Morning & Night', inst: 'Take with meals to avoid stomach upset.' },
    { name: 'Paracetamol', strength: '650mg', form: 'Tablet', freq: 'As needed (SOS)', timing: 'When fever > 100°F', inst: 'Maximum 3 tablets per day with 6h gap.' },
    { name: 'Pantoprazole', strength: '40mg', form: 'Tablet', freq: 'Once Daily', timing: 'Morning empty stomach', inst: 'Take 30 minutes before breakfast.' },
    { name: 'Amoxicillin-Clav', strength: '625mg', form: 'Tablet', freq: 'Twice Daily', timing: 'Morning & Night', inst: 'Complete full 5-day course.' },
  ];

  const handleAddMedicine = (preset = null) => {
    if (preset) {
      setMedicines([
        ...medicines,
        {
          name: preset.name,
          strength: preset.strength,
          dosageForm: preset.form,
          frequency: preset.freq,
          timing: preset.timing,
          duration: '10 Days',
          instructions: preset.inst,
        },
      ]);
    } else {
      setMedicines([
        ...medicines,
        {
          name: '',
          strength: '',
          dosageForm: 'Tablet',
          frequency: 'Once Daily',
          timing: 'After meals',
          duration: '7 Days',
          instructions: 'Take as directed.',
        },
      ]);
    }
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (medicines.length === 0) return;

    const newPrescription = {
      id: 'rx_' + Date.now().toString(36),
      patientId,
      patientName,
      doctorUid: doctor?.uid || 'doc_mock_1',
      doctorName: doctor?.fullName || 'Practitioner',
      doctorRegNumber: doctor?.regNumber || 'MCI-84729-A',
      clinicName: doctor?.clinicName || 'BioTrajectory Specialty Center',
      createdAt: new Date().toISOString().split('T')[0],
      medicines,
      dietAdvice,
      nextReview,
      status: 'signed',
      signedAt: new Date().toISOString(),
    };

    DoctorService.saveDoctorPrescription(doctor?.uid || 'doc_mock_1', newPrescription);
    setIsSaved(true);
    setTimeout(() => {
      navigate('/doctor/prescriptions');
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <Link
          to="/doctor/prescriptions"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Prescriptions
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Issue Medical Prescription (Rx)
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Patient: <strong>{patientName}</strong> • Digital signature verified by BioTrajectory
            </p>
          </div>
        </div>
      </div>

      {!isVerified && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-amber-800 dark:text-amber-300 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
          <span>
            <strong>Verification Required:</strong> Your credentials are currently pending review. You can compose and test prescriptions, but patient pharmacy transmission is enabled only for verified practitioners.
          </span>
        </div>
      )}

      {/* Quick Suggestions Bar */}
      <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
          Quick Medicine Add:
        </span>
        <div className="flex flex-wrap gap-2">
          {commonMeds.map((med, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAddMedicine(med)}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 hover:border-teal-500 hover:text-teal-600 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3 h-3 text-teal-500" />
              <span>{med.name} {med.strength}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Medicines Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Prescribed Medications
            </h2>
            <button
              type="button"
              onClick={() => handleAddMedicine()}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 text-xs font-semibold hover:bg-teal-100 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Drug
            </button>
          </div>

          <div className="space-y-4">
            {medicines.map((med, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">Medicine #{index + 1}</span>
                  {medicines.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(index)}
                      className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Drug / Molecule Name
                    </label>
                    <input
                      type="text"
                      required
                      value={med.name}
                      onChange={(e) => handleMedChange(index, 'name', e.target.value)}
                      placeholder="e.g. Telmisartan"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Strength / Dose
                    </label>
                    <input
                      type="text"
                      required
                      value={med.strength}
                      onChange={(e) => handleMedChange(index, 'strength', e.target.value)}
                      placeholder="e.g. 40mg, 500mg, 10ml"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Dosage Form
                    </label>
                    <select
                      value={med.dosageForm}
                      onChange={(e) => handleMedChange(index, 'dosageForm', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="Tablet">Tablet</option>
                      <option value="Capsule">Capsule</option>
                      <option value="Syrup">Syrup</option>
                      <option value="Injection">Injection</option>
                      <option value="Inhaler">Inhaler</option>
                      <option value="Ointment">Ointment / Gel</option>
                      <option value="Drops">Eye / Ear Drops</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Frequency
                    </label>
                    <select
                      value={med.frequency}
                      onChange={(e) => handleMedChange(index, 'frequency', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    >
                      <option value="Once Daily">Once Daily (1-0-0 or 0-0-1)</option>
                      <option value="Twice Daily">Twice Daily (1-0-1)</option>
                      <option value="Thrice Daily">Thrice Daily (1-1-1)</option>
                      <option value="Four Times Daily">Four Times Daily (QID)</option>
                      <option value="As needed (SOS)">As needed (SOS)</option>
                      <option value="Once Weekly">Once Weekly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => handleMedChange(index, 'duration', e.target.value)}
                      placeholder="e.g. 5 days, 30 days"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Instructions for Patient
                    </label>
                    <input
                      type="text"
                      value={med.instructions}
                      onChange={(e) => handleMedChange(index, 'instructions', e.target.value)}
                      placeholder="e.g. After food with plenty of water"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dietary Advice & Review Date */}
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">
            Dietary Guidance & Next Follow-Up
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Dietary & Lifestyle Advice
              </label>
              <textarea
                value={dietAdvice}
                onChange={(e) => setDietAdvice(e.target.value)}
                rows={2}
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Next Review Date / Period
              </label>
              <input
                type="text"
                value={nextReview}
                onChange={(e) => setNextReview(e.target.value)}
                placeholder="e.g. 14 days"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Digital Signature Confirmation */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Authorized Electronic Signature
              </h4>
              <p className="text-[11px] text-slate-500">
                Dr. {doctor?.fullName || 'Practitioner'} • Medical Council Reg: {doctor?.regNumber || 'MCI-84729-A'}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isVerified}
            className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Sign & Issue Prescription
          </button>
        </div>

        {isSaved && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Prescription signed and issued successfully.
          </div>
        )}
      </form>
    </div>
  );
}
