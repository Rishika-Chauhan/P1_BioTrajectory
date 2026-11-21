
import React from "react";
import { Link } from "react-router-dom";
import {
  QrCode,
  ShieldCheck,
  AlertTriangle,
  LockKeyhole,
  Camera,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { useDoctorAuth } from "../../context/DoctorAuthContext";

export default function DoctorScanQrPage() {
  const { isVerified } = useDoctorAuth();

  if (!isVerified) {
    return (
      <div className="max-w-3xl mx-auto p-6 rounded-2xl border border-amber-200 bg-amber-50 text-amber-800">
        <AlertTriangle className="inline mr-2" size={18} />
        Doctor verification is required to access patient authorization.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-12">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300">
            Patient Authorization
          </span>

          <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700 flex items-center gap-1">
            <AlertTriangle size={13} />
            Integration Pending
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Patient QR Authorization
        </h1>

        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
          Securely obtain patient consent before accessing clinical records.
        </p>
      </div>

      <div className="rounded-2xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 p-5 flex gap-3">
        <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />

        <div>
          <h2 className="font-bold text-amber-900 dark:text-amber-300">
            QR authorization is not connected yet
          </h2>

          <p className="text-sm text-amber-800 dark:text-amber-400 mt-1">
            The current application does not have a completed trusted
            token-issuance and verification workflow. Scanning or entering
            a token cannot currently authorize access to patient records.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center shadow-sm">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
          <QrCode size={42} />
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-5">
          Secure Patient Handshake
        </h2>

        <p className="max-w-xl mx-auto text-sm text-slate-500 dark:text-slate-400 mt-2">
          Camera scanning and manual token verification will be enabled
          after the backend securely verifies patient-issued, short-lived
          authorization tokens.
        </p>

        <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <Camera className="text-cyan-600 mb-3" size={22} />
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Camera QR Scanner
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Pending trusted token verification integration.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
            <LockKeyhole className="text-blue-600 mb-3" size={22} />
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
              Consent Verification
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Must be verified by a trusted backend before records are exposed.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-left">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <ShieldCheck size={18} className="text-emerald-600" />
            Required security checks
          </div>

          <ul className="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <li>• Patient identity must be verified.</li>
            <li>• Consent must be explicitly granted by the patient.</li>
            <li>• Tokens must expire and be protected against reuse.</li>
            <li>• The backend must verify doctor identity and permissions.</li>
            <li>• Access should be logged and revocable.</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
          <Link
            to="/doctor/patients"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
          >
            <FileText size={16} />
            View Appointment Patients
          </Link>

          <Link
            to="/doctor/appointments"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold"
          >
            <ArrowLeft size={16} />
            Back to Appointments
          </Link>
        </div>
      </div>
    </div>
  );
}
