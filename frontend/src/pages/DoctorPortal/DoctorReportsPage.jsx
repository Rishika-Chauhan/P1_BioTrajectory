
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Search,
  ShieldCheck,
  AlertCircle,
  PlusCircle,
  RefreshCw,
} from "lucide-react";

import { useDoctorAuth } from "../../context/DoctorAuthContext";

export default function DoctorReportsPage() {
  const { doctor, isVerified } = useDoctorAuth();

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
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
            Consultation Reports
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            View and manage consultation reports stored in your clinical records.
          </p>
        </div>

        <Link
          to="/doctor/reports/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Report
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search reports by patient or diagnosis..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />

          <div>
            <h2 className="font-bold text-sm text-amber-900 dark:text-amber-200">
              Firestore report storage is not connected yet
            </h2>

            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 mt-1">
              Existing reports were loaded from a local demo service.
              They are not verified clinical records. This page no longer
              displays those records or generates sample diagnoses,
              vitals, treatments, or digital signatures.
            </p>
          </div>
        </div>
      </div>

      <div className="min-h-[280px] flex flex-col items-center justify-center text-center rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-8">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
          <FileText className="w-8 h-8" />
        </div>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          No Firestore reports available
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mt-2">
          Consultation reports will appear here after the Firestore
          report service, access rules, and doctor authorization
          workflow are implemented.
        </p>

        <div className="mt-5 text-xs text-slate-400">
          Signed in as: {doctor?.fullName || doctor?.name || "Doctor"}
        </div>
      </div>
    </div>
  );
}
