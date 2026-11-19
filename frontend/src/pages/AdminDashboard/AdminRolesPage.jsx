import React, { useState } from 'react';
import {
  Key,
  Shield,
  Check,
  X,
  Lock,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  User,
  Stethoscope,
  Info,
  CheckCircle2,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function AdminRolesPage() {
  const { isHindi } = useLanguage();
  const [selectedRole, setSelectedRole] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const ROLES = [
    {
      id: 'USER',
      name: isHindi ? 'मरीज (Patient User)' : 'Patient User',
      badge: 'Zero-Knowledge E2EE',
      badgeColor: 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
      icon: User,
      desc: isHindi
        ? 'व्यक्तिगत बायोमार्कर, मूत्र विश्लेषण डेटा एवं एनक्रिप्शन कुंजियों का पूर्ण स्वामी।'
        : 'Sovereign owner of personal biological telemetry, client-side encryption keys, and family sharing authorizations.',
      sessionTimeout: '30 Days (Remember Me) / 15m Biometric Relock',
      permissions: [
        { label: 'Record & View Own Biomarker Telemetry', allowed: true },
        { label: 'Execute Computer Vision Urinalysis Scans', allowed: true },
        { label: 'Generate Ephemeral Clinic QR Codes', allowed: true },
        { label: 'Grant / Revoke Family Consent With 1-Click', allowed: true },
        { label: 'Book & Attend Telemedicine Video Consultations', allowed: true },
        { label: 'Access System Administrative Metrics', allowed: false },
        { label: 'Access Unconsented Patient Charts', allowed: false }
      ]
    },
    {
      id: 'DOCTOR',
      name: isHindi ? 'सत्यापित चिकित्सक (Verified Doctor)' : 'Verified Doctor / Clinician',
      badge: 'Verified Practitioner',
      badgeColor: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      icon: Stethoscope,
      desc: isHindi
        ? 'सत्यापित मेडिकल काउंसिल पंजीकरण के साथ मरीज-सहमति प्राप्त क्लिनिकल प्रदाता।'
        : 'State-licensed medical practitioner authorized to conduct video consultations, issue e-prescriptions, and review patient-consented telemetry.',
      sessionTimeout: '15 Minutes Inactivity (HIPAA Enforcement)',
      permissions: [
        { label: 'View Consented Patient Trajectory & Sensor Logs', allowed: true },
        { label: 'Initiate DTLS/SRTP Telemedicine Consultations', allowed: true },
        { label: 'Issue Digitally Signed E-Prescriptions', allowed: true },
        { label: 'Draft & Finalize Patient Clinical Reports', allowed: true },
        { label: 'Scan Emergency Patient QR Codes for Consent', allowed: true },
        { label: 'Modify Platform Core Governance Policies', allowed: false },
        { label: 'Access Unconsented Patient Telemetry', allowed: false }
      ]
    },
    {
      id: 'DOCTOR_PENDING',
      name: isHindi ? 'समीक्षाधीन चिकित्सक (Doctor Pending)' : 'Doctor Verification Pending',
      badge: 'Under Review',
      badgeColor: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      icon: AlertTriangle,
      desc: isHindi
        ? 'प्रशासनिक बोर्ड द्वारा मेडिकल काउंसिल पंजीकरण संख्या के सत्यापन की प्रतीक्षा में।'
        : 'Physician account pending state medical license and registration verification. Telemedicine and prescribing capabilities remain locked.',
      sessionTimeout: '30 Minutes Inactivity',
      permissions: [
        { label: 'Access Doctor Practice Dashboard Overview', allowed: true },
        { label: 'Explore Evidence-Based Disease Guidelines', allowed: true },
        { label: 'Update Medical Registration & Clinic Details', allowed: true },
        { label: 'Issue E-Prescriptions to Patients', allowed: false },
        { label: 'Host WebRTC Telemedicine Consultations', allowed: false },
        { label: 'Finalize Clinical Reports', allowed: false },
        { label: 'Access Patient Medical Charts', allowed: false }
      ]
    },
    {
      id: 'DOCTOR_SUSPENDED',
      name: isHindi ? 'निलंबित चिकित्सक (Doctor Suspended)' : 'Doctor Suspended',
      badge: 'Access Revoked',
      badgeColor: 'text-red-600 dark:text-red-400 bg-red-500/10 border-red-500/20',
      icon: ShieldAlert,
      desc: isHindi
        ? 'प्रशासनिक या क्लिनिकल निगरानी द्वारा खाता अस्थायी रूप से निलंबित।'
        : 'Clinical practice privileges revoked due to licensing audit or administrative governance review.',
      sessionTimeout: 'Immediate Session Termination',
      permissions: [
        { label: 'Access Educational Disease Database', allowed: false },
        { label: 'Issue E-Prescriptions', allowed: false },
        { label: 'Host Telemedicine Calls', allowed: false },
        { label: 'View Any Patient Data', allowed: false },
        { label: 'Access Doctor Workspace', allowed: false },
        { label: 'Appeal Suspension to Governance Board', allowed: true }
      ]
    },
    {
      id: 'ADMIN',
      name: isHindi ? 'प्रणाली व्यवस्थापक (Administrator)' : 'System Administrator',
      badge: 'Audited Governance',
      badgeColor: 'text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20',
      icon: Shield,
      desc: isHindi
        ? 'इन्फ्रास्ट्रक्चर, डॉक्टर लाइसेंस सत्यापन एवं सुरक्षा नोड्स का प्रबंधन।'
        : 'Platform operator managing cloud infrastructure, medical doctor licenses, educational content, and optical scanner calibration.',
      sessionTimeout: '15 Minutes Inactivity + Hardware 2FA',
      permissions: [
        { label: 'Approve / Reject Doctor Verification Submissions', allowed: true },
        { label: 'Manage Educational Disease Guides & CMS', allowed: true },
        { label: 'Inspect K-Anonymized Population Cohorts', allowed: true },
        { label: 'Review Optical Scanner Diagnostic Reports', allowed: true },
        { label: 'Suspend Abusive / Non-Compliant Accounts', allowed: true },
        { label: 'View Private Patient Medical Charts (Zero-Knowledge)', allowed: false }, // EXPLICIT PRIVACY BARRIER
        { label: 'Access Raw Patient Decryption Keys', allowed: false },                   // EXPLICIT PRIVACY BARRIER
        { label: 'Eavesdrop on Private Telemedicine Consultations', allowed: false }       // EXPLICIT PRIVACY BARRIER
      ]
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
            <Key className="w-3.5 h-3.5" />
            <span>{isHindi ? 'भूमिका-आधारित अभिगम नियंत्रण' : 'Role-Based Access Control (RBAC) Governance'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isHindi ? 'भूमिका एवं अनुमति मैट्रिक्स' : 'Role Permissions & Access Matrix'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {isHindi
              ? 'प्रणाली में एनक्रिप्शन स्तरों, क्लिनिकल अधिकारों और जीरो-नॉलेज गोपनीयता सीमाओं की विस्तृत सूची।'
              : 'Cryptographically bounded permission matrices ensuring zero unauthorized telemetry access across all 5 platform roles.'}
          </p>
        </div>
      </div>

      {/* Safety Barrier Banner */}
      <div className="p-5 rounded-3xl bg-cyan-500/10 border border-cyan-500/25 flex items-start gap-4 text-xs text-slate-700 dark:text-slate-300">
        <Lock className="w-6 h-6 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-cyan-900 dark:text-cyan-200">
            Absolute Clinical Privacy Boundary Enforced in Backend Claims
          </p>
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            BioTrajectory strictly separates platform governance from patient telemetry. Even the highest administrative credential (<code className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-mono">ADMIN</code>) possesses zero backend tokens or decryption keys to query individual patient health charts, urinalysis photos, or private AI consultations.
          </p>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ROLES.map((role) => {
          const Icon = role.icon;
          return (
            <div
              key={role.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between shadow-xs hover:border-cyan-500/40 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white leading-tight">
                        {role.name}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-400 block">{role.id}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${role.badgeColor}`}>
                    {role.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {role.desc}
                </p>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Session Policy:</span> {role.sessionTimeout}
                </div>

                {/* Permissions checklist */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  {role.permissions.map((perm, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1">
                      <span
                        className={`text-[12px] pr-2 ${
                          perm.allowed
                            ? 'text-slate-700 dark:text-slate-200 font-medium'
                            : 'text-slate-400 dark:text-slate-500 line-through'
                        }`}
                      >
                        {perm.label}
                      </span>
                      {perm.allowed ? (
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-red-400/80 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    setSelectedRole(role);
                    setModalOpen(true);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-500/10 border border-cyan-500/20 transition-all cursor-pointer"
                >
                  View JWT Claim Schema
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Claim Schema Modal */}
      {modalOpen && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-500" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  JWT Claims: {selectedRole.id}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                Every request dispatched to the BioTrajectory backend verifies this cryptographic claim payload via RSA-256 signatures:
              </p>
              <pre className="p-4 rounded-2xl bg-slate-900 text-cyan-300 font-mono text-[11px] overflow-x-auto leading-relaxed">
{`{
  "iss": "https://securetoken.google.com/biotrajectory",
  "aud": "biotrajectory-core",
  "role": "${selectedRole.id}",
  "mfa_verified": true,
  "clinical_clearance": ${selectedRole.id === 'DOCTOR' ? '"ACTIVE_PRACTITIONER"' : selectedRole.id === 'DOCTOR_PENDING' ? '"PENDING_VERIFICATION"' : '"NONE"'},
  "privacy_boundary": ${selectedRole.id === 'ADMIN' ? '"ZERO_KNOWLEDGE_GOVERNANCE"' : '"SOVEREIGN_PATIENT"'},
  "iat": 1731970800,
  "exp": 1731971700
}`}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
