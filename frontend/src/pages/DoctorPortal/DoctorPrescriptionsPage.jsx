
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Pill,
  PlusCircle,
  Search,
  ShieldCheck,
  AlertTriangle,
  LockKeyhole,
} from "lucide-react";

import { useDoctorAuth } from "../../context/DoctorAuthContext";

export default function DoctorPrescriptionsPage() {
  const { doctor, isVerified } = useDoctorAuth();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">
              Pharmacotherapy Management
            </span>

            {isVerified && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Doctor
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Prescriptions Archive
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            View and manage prescriptions securely stored in Firestore.
          </p>
        </div>

        <Link
          to="/doctor/prescriptions/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Issue New Prescription
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search by patient name or medication..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Warning */}
      <div className="rounded-2xl p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />

          <div>
            <h2 className="font-bold text-sm text-amber-900 dark:text-amber-200">
              Firestore prescription storage is not connected yet
            </h2>

            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 mt-1">
              The previous implementation used localStorage and
              displayed fabricated medicine schedules, dietary advice,
              registration details, and digital signatures. Those
              records cannot be treated as genuine prescriptions.
              They are no longer displayed here.
            </p>
          </div>
        </div>
      </div>

      {/* Empty state */}
      <div className="min-h-[280px] flex flex-col items-center justify-center text-center rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 p-8">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
          <Pill className="w-8 h-8" />
        </div>

        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          No Firestore prescriptions available
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mt-2">
          Prescriptions will appear here after the Firestore
          prescription service, validated medicine fields,
          doctor authorization, and patient access rules are implemented.
        </p>

        <div className="mt-5 flex items-center gap-2 text-xs text-slate-400">
          <LockKeyhole className="w-4 h-4" />
          {doctor?.fullName || doctor?.name || "Doctor"}
        </div>
      </div>
    </div>
  );
}
