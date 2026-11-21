
import React from "react";
import {
  User,
  ShieldCheck,
  AlertCircle,
  Stethoscope,
  Building,
  Phone,
  Mail,
  Award,
  RefreshCw,
  Lock,
} from "lucide-react";

import { useDoctorAuth } from "../../context/DoctorAuthContext";
import { useLanguage } from "../../context/LanguageContext";

function ProfileField({ label, value, icon: Icon }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
        {label}
      </label>

      <div className="min-h-11 flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
        {Icon && <Icon size={16} className="text-slate-400 shrink-0" />}

        <span className="text-sm text-slate-800 dark:text-slate-200 break-all">
          {value || "Not provided"}
        </span>
      </div>
    </div>
  );
}

export default function DoctorProfilePage() {
  const {
    doctor,
    isVerified,
    loadingDoctor,
    authError,
    refreshDoctor,
  } = useDoctorAuth();

  const { isHindi } = useLanguage();

  const handleRefresh = async () => {
    try {
      await refreshDoctor();
    } catch (error) {
      console.error("Doctor profile refresh failed:", error);
    }
  };

  if (loadingDoctor && !doctor) {
    return (
      <div className="py-16 text-center text-slate-500">
        <RefreshCw className="animate-spin mx-auto mb-3" size={25} />
        Loading doctor profile...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50 text-amber-800">
        <AlertCircle className="inline mr-2" size={18} />
        No authenticated doctor profile is available. Please sign in again.
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
              {isHindi ? "चिकित्सक प्रोफाइल" : "Practitioner Profile"}
            </span>

            {isVerified ? (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck size={14} />
                {isHindi ? "सत्यापित" : "Verified"}
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center gap-1">
                <AlertCircle size={14} />
                {isHindi ? "समीक्षाधीन" : "Pending Verification"}
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            {isHindi ? "मेरी चिकित्सक प्रोफाइल" : "My Doctor Profile"}
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isHindi
              ? "आपके सत्यापित अकाउंट और आवेदन से प्राप्त विवरण।"
              : "Information retrieved from your authenticated account and doctor application."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loadingDoctor}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loadingDoctor ? "animate-spin" : ""}
          />
          {isHindi ? "रिफ्रेश" : "Refresh"}
        </button>
      </div>

      {authError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
          <AlertCircle className="inline mr-2" size={17} />
          {authError}
        </div>
      )}

      {/* Account summary */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent border border-blue-500/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-700 dark:text-blue-300">
            <User size={30} />
          </div>

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {doctor.fullName
                ? `Dr. ${doctor.fullName.replace(/^(Dr\.?\s*)+/i, "")}`
                : "Doctor"}
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {doctor.specialization || "Specialization not provided"}
            </p>

            <p className="text-xs text-slate-500 mt-1">
              {doctor.role || "Role unavailable"}
            </p>
          </div>
        </div>
      </div>

      {/* Medical credentials */}
      <section className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Award className="w-5 h-5 text-blue-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {isHindi ? "मेडिकल पंजीकरण एवं विशेषज्ञता" : "Medical Registration & Specialty"}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ProfileField
            label={isHindi ? "पूरा नाम" : "Full Name"}
            value={doctor.fullName}
            icon={User}
          />

          <ProfileField
            label={isHindi ? "पंजीकरण संख्या" : "Medical Registration Number"}
            value={doctor.registrationNumber || doctor.regNumber}
            icon={Lock}
          />

          <ProfileField
            label={isHindi ? "विशेषज्ञता" : "Specialization"}
            value={doctor.specialization}
            icon={Stethoscope}
          />

          <ProfileField
            label={isHindi ? "योग्यता" : "Qualifications"}
            value={doctor.qualification}
            icon={Award}
          />

          <ProfileField
            label={isHindi ? "जारी करने वाली परिषद" : "Issuing Medical Council"}
            value={doctor.issuingCouncil}
            icon={ShieldCheck}
          />
        </div>
      </section>

      {/* Practice information */}
      <section className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-100 dark:border-slate-800">
          <Building className="w-5 h-5 text-teal-500" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            {isHindi ? "क्लिनिक एवं संपर्क जानकारी" : "Practice & Contact Information"}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ProfileField
            label={isHindi ? "क्लिनिक का नाम" : "Clinic / Hospital"}
            value={doctor.clinicName || doctor.clinic}
            icon={Building}
          />

          <ProfileField
            label={isHindi ? "ईमेल" : "Email Address"}
            value={doctor.email}
            icon={Mail}
          />

          <ProfileField
            label={isHindi ? "फोन नंबर" : "Phone Number"}
            value={doctor.phone}
            icon={Phone}
          />
        </div>
      </section>

      {/* Backend-managed information */}
      <section className="rounded-2xl p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-slate-500" />

          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            {isHindi ? "सुरक्षा एवं प्रोफाइल प्रबंधन" : "Security & Profile Management"}
          </h3>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
          {isHindi
            ? "चिकित्सक की भूमिका और सत्यापन स्थिति विश्वसनीय बैकएंड द्वारा नियंत्रित होती है। मेडिकल पंजीकरण और योग्यता में बदलाव के लिए प्रशासनिक समीक्षा आवश्यक है।"
            : "Your doctor role and verification status are controlled by the trusted backend. Changes to medical registration and qualifications require administrative review."}
        </p>

        <p className="text-xs text-slate-500 mt-3">
          {isHindi
            ? "यह पेज वर्तमान में प्रोफाइल विवरण दिखाता है। क्लाइंट-साइड बदलाव सेव नहीं किए जाते।"
            : "This page currently displays profile information. Client-side profile edits are not enabled because a persistent profile-update endpoint is not implemented."}
        </p>
      </section>
    </div>
  );
}
