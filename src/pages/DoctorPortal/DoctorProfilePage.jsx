import React, { useState } from 'react';
import {
  User,
  ShieldCheck,
  AlertCircle,
  Stethoscope,
  Building,
  Phone,
  Mail,
  Award,
  Clock,
  Save,
  CheckCircle2,
  Lock,
  RefreshCw
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';

export default function DoctorProfilePage() {
  const { doctor, doctorRole, updateDoctorRole, updateDoctorProfile, isVerified } = useDoctorAuth();

  const [formData, setFormData] = useState({
    fullName: doctor?.fullName || 'Vikram Malhotra',
    email: doctor?.email || 'dr.vikram@biotrajectory.com',
    phone: doctor?.phone || '+91 98765 43210',
    regNumber: doctor?.regNumber || 'MCI-84729-A',
    specialization: doctor?.specialization || 'Cardiology & Internal Medicine',
    qualification: doctor?.qualification || 'MBBS, MD (General Medicine), DM (Cardiology)',
    clinicName: doctor?.clinicName || 'Apollo Health City & BioTrajectory Tele-Care',
    consultationFee: '₹800',
    workingHours: '09:00 AM - 05:00 PM (Mon-Sat)',
    bio: 'Senior Consultant Physician and Interventional Cardiologist with over 14 years of clinical experience in managing chronic hypertension, heart failure, and lifestyle metabolic disorders.',
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateDoctorProfile(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
            Practitioner Credentials
          </span>
          {isVerified ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Verified Medical License
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Verification Pending Review
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Practitioner Profile & Clinical Registry
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Manage your verified medical council credentials, clinical availability, and practice details.
        </p>
      </div>

      {/* Role Switcher for Testing / Verification Demo */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Credential Verification Test Switcher
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Current status: <strong className="font-mono text-blue-600 dark:text-blue-400">{doctorRole}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => updateDoctorRole('DOCTOR_VERIFIED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              doctorRole === 'DOCTOR_VERIFIED'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50'
            }`}
          >
            Set Verified
          </button>
          <button
            type="button"
            onClick={() => updateDoctorRole('DOCTOR_PENDING')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              doctorRole === 'DOCTOR_PENDING'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-amber-50'
            }`}
          >
            Set Pending
          </button>
          <button
            type="button"
            onClick={() => updateDoctorRole('DOCTOR_SUSPENDED')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              doctorRole === 'DOCTOR_SUSPENDED'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-rose-50'
            }`}
          >
            Set Suspended
          </button>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        {/* Medical Credentials */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-500" />
            Medical Registration & Specialty
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Full Legal Name
              </label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Medical Registration Number
              </label>
              <input
                type="text"
                required
                value={formData.regNumber}
                onChange={(e) => handleInputChange('regNumber', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Medical Specialization
              </label>
              <input
                type="text"
                required
                value={formData.specialization}
                onChange={(e) => handleInputChange('specialization', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Medical Qualifications / Degrees
              </label>
              <input
                type="text"
                required
                value={formData.qualification}
                onChange={(e) => handleInputChange('qualification', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Clinic & Practice Information */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Building className="w-4 h-4 text-teal-500" />
            Clinic & Practice Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Clinic / Hospital Name & Address
              </label>
              <input
                type="text"
                required
                value={formData.clinicName}
                onChange={(e) => handleInputChange('clinicName', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Professional Contact Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Practice Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Telemedicine Consultation Fee
              </label>
              <input
                type="text"
                value={formData.consultationFee}
                onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Consultation Availability Hours
              </label>
              <input
                type="text"
                value={formData.workingHours}
                onChange={(e) => handleInputChange('workingHours', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Clinical Bio */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Clinical Summary & Experience Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            rows={3}
            className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          />
        </div>

        {/* Digital Signature Preview */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Digital Signature Stamp
            </span>
            <div className="font-serif italic text-lg text-slate-800 dark:text-slate-200">
              Dr. {formData.fullName}
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Medical Reg: {formData.regNumber} • BioTrajectory Public Key Encrypted
            </p>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors flex items-center gap-1.5 self-end sm:self-auto"
          >
            <Save className="w-4 h-4" /> Save Profile Details
          </button>
        </div>

        {isSaved && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Practitioner profile updated successfully.
          </div>
        )}
      </form>
    </div>
  );
}
