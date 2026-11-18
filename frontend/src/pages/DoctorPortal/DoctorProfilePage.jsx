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
import { useLanguage } from '../../context/LanguageContext';
import { formatDoctorTitle, stripDoctorTitle } from '../../services/doctorService';

export default function DoctorProfilePage() {
  const { doctor, updateDoctorProfile, isVerified } = useDoctorAuth();
  const { t, isHindi } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: stripDoctorTitle(doctor?.fullName || 'Sarah Mitchell'),
    email: doctor?.email || 'doctor@biotrajectory.health',
    phone: doctor?.phone || '+1 (555) 234-5678',
    regNumber: doctor?.regNumber || doctor?.registrationNumber || 'MD-89241-US',
    specialization: doctor?.specialization || 'Cardiology & Preventive Medicine',
    qualification: doctor?.qualification || 'MD, FACP (Harvard Medical School)',
    clinicName: doctor?.clinicName || doctor?.clinic || 'BioTrajectory Clinical Research Center',
    consultationFee: doctor?.consultationFee || '$120 / session',
    workingHours: '09:00 AM - 05:00 PM (Mon-Sat)',
    bio: doctor?.bio || 'Senior Consultant Physician and Interventional Cardiologist with over 14 years of clinical experience in managing chronic hypertension, heart failure, and lifestyle metabolic disorders.',
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof updateDoctorProfile === 'function') {
      updateDoctorProfile(formData);
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
            {isHindi ? 'चिकित्सक साख एवं प्रमाणन' : 'Practitioner Credentials'}
          </span>
          {isVerified ? (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isHindi ? 'सत्यापित मेडिकल लाइसेंस' : 'Verified Medical License'}
            </span>
          ) : (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {isHindi ? 'समीक्षाधीन सत्यापन' : 'Verification Pending Review'}
            </span>
          )}
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          {isHindi ? 'चिकित्सक प्रोफाइल एवं क्लिनिकल रजिस्ट्री' : 'Practitioner Profile & Clinical Registry'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          {isHindi
            ? 'अपनी सत्यापित मेडिकल काउंसिल साख, क्लिनिकल उपलब्धता और क्लिनिक विवरण प्रबंधित करें।'
            : 'Manage your verified medical council credentials, clinical availability, and practice details.'}
        </p>
      </div>

      <div className="rounded-2xl p-5 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {isHindi ? 'क्लिनिकल एक्सेस स्थिति' : 'Clinical Access Status'}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            {isHindi ? 'वर्तमान भूमिका विश्वसनीय बैकएंड और टोकन द्वारा प्रबंधित है: ' : 'Current role is managed by the trusted backend and token claims: '}
            <strong className="font-mono text-blue-600 dark:text-blue-400">{doctor?.role || 'DOCTOR'}</strong>
          </p>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        {/* Medical Credentials */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <Award className="w-4 h-4 text-blue-500" />
            {isHindi ? 'मेडिकल पंजीकरण एवं विशेषज्ञता' : 'Medical Registration & Specialty'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isHindi ? 'पूरा कानूनी नाम' : 'Full Legal Name'}
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
                {isHindi ? 'मेडिकल पंजीकरण संख्या' : 'Medical Registration Number'}
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
                {isHindi ? 'चिकित्सीय विशेषज्ञता' : 'Medical Specialization'}
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
                {isHindi ? 'चिकित्सीय योग्यताएं / डिग्रियां' : 'Medical Qualifications / Degrees'}
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
            {isHindi ? 'क्लिनिक एवं प्रैक्टिस जानकारी' : 'Clinic & Practice Information'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isHindi ? 'क्लिनिक / अस्पताल का नाम व पता' : 'Clinic / Hospital Name & Address'}
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
                {isHindi ? 'व्यावसायिक संपर्क ईमेल' : 'Professional Contact Email'}
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
                {isHindi ? 'प्रैक्टिस फोन नंबर' : 'Practice Phone Number'}
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
                {isHindi ? 'परामर्श शुल्क' : 'Telemedicine Consultation Fee'}
              </label>
              <input
                type="text"
                placeholder="e.g. ₹800 / session"
                value={formData.consultationFee}
                onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {isHindi ? 'परामर्श उपलब्धता समय' : 'Consultation Availability Hours'}
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
            {isHindi ? 'क्लिनिकल सारांश एवं अनुभव बायो' : 'Clinical Summary & Experience Bio'}
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
              {isHindi ? 'डिजिटल हस्ताक्षर मुहर' : 'Digital Signature Stamp'}
            </span>
            <div className="font-serif italic text-lg text-slate-800 dark:text-slate-200">
              {formatDoctorTitle(formData.fullName)}
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              Medical Reg: {formData.regNumber} • BioTrajectory Public Key Encrypted
            </p>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isHindi ? 'प्रोफाइल सहेजें' : 'Save Profile Details'}</span>
          </button>
        </div>

        {isSaved && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{isHindi ? 'चिकित्सक प्रोफाइल सफलतापूर्वक अपडेट की गई।' : 'Practitioner profile updated successfully.'}</span>
          </div>
        )}
      </form>
    </div>
  );
}
