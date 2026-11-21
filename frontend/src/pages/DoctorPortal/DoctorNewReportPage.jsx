
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  AlertTriangle,
  LockKeyhole,
} from "lucide-react";

import { useDoctorAuth } from "../../context/DoctorAuthContext";

export default function DoctorNewReportPage() {
  const [searchParams] = useSearchParams();
  const { doctor, isVerified } = useDoctorAuth();

  const patientId = searchParams.get("patientId");
  const patientName = searchParams.get("name");

  return (
    <div className="max-w-4xl mx-auto space-y-7 pb-12">
      <div>
        <Link
          to="/doctor/reports"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Consultation Reports
        </Link>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
            Clinical Documentation
          </span>

          {isVerified && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Doctor
            </span>
          )}
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Write Consultation Report
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Clinical report creation will be enabled after secure Firestore
          integration.
        </p>
      </div>

      <div className="rounded-2xl p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />

          <div>
            <h2 className="font-bold text-sm text-amber-900 dark:text-amber-200">
              Report creation temporarily unavailable
            </h2>

            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 mt-1">
              The previous form contained pre-filled fictional patient
              information, sample clinical measurements, and a demo
              diagnosis. It also saved to localStorage instead of
              Firestore. These behaviours have been disabled to prevent
              accidental creation of false medical records.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>

          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">
              Report Details
            </h2>
            <p className="text-xs text-slate-500">
              Selected patient information
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70">
            <p className="text-xs text-slate-500 mb-1">
              Patient Name
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {patientName || "No patient selected"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70">
            <p className="text-xs text-slate-500 mb-1">
              Patient ID
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white break-all">
              {patientId || "Not available"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70">
            <p className="text-xs text-slate-500 mb-1">
              Doctor
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {doctor?.fullName || doctor?.name || "Not available"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70">
            <p className="text-xs text-slate-500 mb-1">
              Doctor Verification
            </p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {isVerified ? "Verified" : "Pending verification"}
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold text-sm">
            <LockKeyhole className="w-4 h-4 text-amber-500" />
            Secure storage not configured
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Before enabling this form, we need a Firestore report
            collection, validated report fields, doctor ownership checks,
            patient authorization, and a trusted signature workflow.
            A frontend verification flag alone is not sufficient to
            authorize a medical signature.
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Link
            to="/doctor/reports"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold"
          >
            Back to Reports
          </Link>
        </div>
      </div>
    </div>
  );
}
