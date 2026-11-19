
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  ShieldCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  AlertCircle,
  UserRound,
  Mail,
  Phone,
  Building2,
  GraduationCap,
  FileCheck
} from 'lucide-react';

import { doctorApi } from '../../services/doctorApi';

// --------------------------------------------------
// Normalize backend application data
// --------------------------------------------------

function normalizeApplication(item) {
  return {
    uid: item.uid || item.user_id || item.id || '',
    name: item.full_name || item.name || 'Name not provided',
    email: item.email || '',
    phone: item.phone || '',
    specialty: item.specialization || item.specialty || '',
    qualification: item.qualification || '',
    registrationNumber:
      item.registration_number || item.registrationNumber || '',
    issuingCouncil: item.issuing_council || item.issuingCouncil || '',
    clinicName: item.clinic_name || item.clinicName || '',
    status: String(item.status || 'PENDING').toUpperCase(),
    submittedAt: item.created_at || item.submitted_at || '',
    reviewNote: item.review_note || item.note || ''
  };
}

function extractApplications(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.applications)) {
    return response.applications;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  return [];
}

function formatDate(value) {
  if (!value) return 'Not available';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// --------------------------------------------------
// Status badge
// --------------------------------------------------

function StatusBadge({ status }) {
  const styles = {
    PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    APPROVED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20'
  };

  const labels = {
    PENDING: 'Pending review',
    APPROVED: 'Approved',
    REJECTED: 'Rejected'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${
        styles[status] || styles.PENDING
      }`}
    >
      {labels[status] || status}
    </span>
  );
}

// --------------------------------------------------
// Main component
// --------------------------------------------------

export default function AdminDoctorVerificationPage() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyUid, setBusyUid] = useState(null);

  // ------------------------------------------------
  // Fetch applications from trusted backend
  // ------------------------------------------------

  const loadApplications = useCallback(async (isManual = false) => {
    setLoading(true);
    setError('');

    if (isManual) {
      await new Promise((r) => setTimeout(r, 450));
    }

    try {
      // Fetch all applications. The backend should return
      // the actual application records, not demo records.
      const response = await doctorApi.getApplications('');

      const records = extractApplications(response)
        .map(normalizeApplication)
        .filter((item) => item.uid);

      setApplications(records);
    } catch (err) {
      console.error(
        '[AdminDoctorVerification] Fetch failed:',
        err
      );

      setError(
        err.message || 'Unable to load doctor applications.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  // ------------------------------------------------
  // Counts
  // ------------------------------------------------

  const counts = useMemo(() => ({
    pending: applications.filter(
      (item) => item.status === 'PENDING'
    ).length,

    approved: applications.filter(
      (item) => item.status === 'APPROVED'
    ).length,

    rejected: applications.filter(
      (item) => item.status === 'REJECTED'
    ).length
  }), [applications]);

  // ------------------------------------------------
  // Search and filters
  // ------------------------------------------------

  const filteredApplications = useMemo(() => {
    const term = search.trim().toLowerCase();

    return applications.filter((item) => {
      const matchesSearch =
        !term ||
        item.name.toLowerCase().includes(term) ||
        item.email.toLowerCase().includes(term) ||
        item.specialty.toLowerCase().includes(term) ||
        item.registrationNumber.toLowerCase().includes(term) ||
        item.issuingCouncil.toLowerCase().includes(term);

      const matchesStatus =
        statusFilter === 'ALL' ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  // ------------------------------------------------
  // Approve application
  // ------------------------------------------------

  const approveApplication = async (application) => {
    const confirmed = window.confirm(
      `Approve the doctor application for ${application.name}?\n\n` +
      'Only proceed after independently verifying the medical registration details.'
    );

    if (!confirmed) return;

    setBusyUid(application.uid);
    setActionError('');

    try {
      await doctorApi.approveApplication(
        application.uid,
        'Approved after administrator review.'
      );

      // Refresh from backend instead of modifying local data.
      await loadApplications();
    } catch (err) {
      console.error('[Doctor approval failed]', err);

      setActionError(
        err.message || 'Unable to approve this application.'
      );
    } finally {
      setBusyUid(null);
    }
  };

  // ------------------------------------------------
  // Reject application
  // ------------------------------------------------

  const rejectApplication = async (application) => {
    const note = window.prompt(
      `Enter the reason for rejecting ${application.name}'s application:`
    );

    if (note === null) return;

    if (!note.trim()) {
      setActionError('Please provide a rejection reason.');
      return;
    }

    const confirmed = window.confirm(
      `Reject the application for ${application.name}?`
    );

    if (!confirmed) return;

    setBusyUid(application.uid);
    setActionError('');

    try {
      await doctorApi.rejectApplication(
        application.uid,
        note.trim()
      );

      await loadApplications();
    } catch (err) {
      console.error('[Doctor rejection failed]', err);

      setActionError(
        err.message || 'Unable to reject this application.'
      );
    } finally {
      setBusyUid(null);
    }
  };

  // ------------------------------------------------
  // UI
  // ------------------------------------------------

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* Header */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Doctor Verification
          </h1>

          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Review submitted medical credentials and manage doctor applications.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadApplications(true)}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#251A11] text-slate-700 dark:text-slate-200 text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 cursor-pointer active:scale-95 transition-all shadow-xs"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
          />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Summary cards */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="rounded-2xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs p-5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs uppercase tracking-wider">
              Pending
            </span>
            <Clock3 className="w-4 h-4 text-amber-400" />
          </div>

          <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {counts.pending}
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs p-5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs uppercase tracking-wider">
              Approved
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>

          <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {counts.approved}
          </p>
        </div>

        <div className="rounded-2xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs p-5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs uppercase tracking-wider">
              Rejected
            </span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>

          <p className="mt-3 text-3xl font-extrabold text-slate-900 dark:text-white">
            {counts.rejected}
          </p>
        </div>

      </div>

      {/* Errors */}

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex gap-3 text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">
              Could not load applications
            </p>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      )}

      {actionError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex gap-3 text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{actionError}</p>
        </div>
      )}

      {/* Search and filter */}

      <div className="rounded-2xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs p-4">
        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search doctor, specialty, email or registration number..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white"
          >
            <option value="ALL">All applications</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>

        </div>
      </div>

      {/* Applications */}

      <div className="rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs shadow-sm overflow-hidden">

        {loading ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <RefreshCw className="w-7 h-7 text-cyan-400 animate-spin" />
            <p className="text-sm text-slate-400">
              Loading applications from server...
            </p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center gap-3">
            <UserRound className="w-9 h-9 text-slate-500" />

            <p className="text-slate-900 dark:text-white font-bold">
              No applications found
            </p>

            <p className="text-xs text-slate-400">
              There are no applications matching your search or filter.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">

            {filteredApplications.map((application) => {
              const isBusy = busyUid === application.uid;
              const isPending = application.status === 'PENDING';

              return (
                <div
                  key={application.uid}
                  className="p-5 sm:p-6 hover:bg-slate-50/80 dark:hover:bg-slate-800/20 transition-colors"
                >

                  {/* Applicant heading */}

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {application.name}
                        </h3>

                        <StatusBadge status={application.status} />
                      </div>

                      <p className="text-xs text-slate-500 mt-2 font-mono break-all">
                        UID: {application.uid}
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Submitted: {formatDate(application.submittedAt)}
                      </p>
                    </div>

                    {/* Actions */}

                    {isPending && (
                      <div className="flex flex-wrap gap-2">

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => approveApplication(application)}
                          className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-2 text-xs font-semibold disabled:opacity-50"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {isBusy ? 'Processing...' : 'Approve'}
                        </button>

                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => rejectApplication(application)}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-2 text-xs font-semibold disabled:opacity-50"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>

                      </div>
                    )}

                  </div>

                  {/* Applicant details */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

                    <div className="flex gap-3">
                      <Mail className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase text-slate-500">
                          Email
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-200 break-all">
                          {application.email || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Phone className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase text-slate-500">
                          Phone
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-200">
                          {application.phone || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <GraduationCap className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase text-slate-500">
                          Qualification
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-200">
                          {application.qualification || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <FileCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase text-slate-500">
                          Registration number
                        </p>
                        <p className="text-sm text-cyan-300 font-mono break-all">
                          {application.registrationNumber || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase text-slate-500">
                          Issuing council
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-200">
                          {application.issuingCouncil || 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Building2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[10px] uppercase text-slate-500">
                          Clinic / institution
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-200">
                          {application.clinicName || 'Not provided'}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Specialization */}

                  <div className="mt-5 pt-4 border-t border-slate-800">
                    <p className="text-[10px] uppercase text-slate-500 mb-1">
                      Specialization
                    </p>

                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {application.specialty || 'Not provided'}
                    </p>
                  </div>

                  {/* Review note */}

                  {application.reviewNote && (
                    <div className="mt-4 rounded-xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 p-3">
                      <p className="text-[10px] uppercase text-slate-500 mb-1">
                        Review note
                      </p>

                      <p className="text-xs text-slate-300">
                        {application.reviewNote}
                      </p>
                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

      </div>

      <p className="text-[11px] text-slate-500 leading-relaxed">
        Important: An application being approved in this dashboard must not be
        treated as proof that a medical licence is valid. Administrators must
        independently verify registration details with the relevant issuing
        medical authority before granting doctor access.
      </p>

    </div>
  );
}
