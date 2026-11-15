import React, { useEffect, useMemo, useState } from "react";

import {
  Search,
  Stethoscope,
  ShieldCheck,
  RefreshCw,
  UserRound,
  CalendarClock,
  Video,
  AlertCircle,
  History,
  CheckCircle2,
  X,
  CalendarDays,
  Clock,
  MapPin,
  ClipboardList,
} from "lucide-react";

import { approvedDoctorService } from "../../services/approvedDoctorService";
import { appointmentService } from "../../services/appointmentService";
import DisclaimerBanner from "../../components/common/DisclaimerBanner";

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatAppointmentDate(dateString) {
  if (!dateString) return "Date unavailable";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatAppointmentTime(timeString) {
  if (!timeString) return "Time unavailable";

  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function getStatusStyle(status) {
  switch (status) {
    case "ACCEPTED":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300";
    case "REJECTED":
      return "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300";
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
    default:
      return "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
  }
}

function getStatusDescription(status) {
  switch (status) {
    case "ACCEPTED":
      return "The doctor has accepted your appointment request.";
    case "REJECTED":
      return "The doctor has declined this appointment request.";
    case "COMPLETED":
      return "This appointment has been marked as completed.";
    default:
      return "Your appointment request is waiting for doctor approval.";
  }
}

export default function DoctorConsultationPage() {
  const [activeTab, setActiveTab] = useState("browse");

  // Doctor discovery
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] =
    useState("All Specialties");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  // Patient appointment history
  const [appointments, setAppointments] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [historyFilter, setHistoryFilter] = useState("ALL");

  // Booking
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("in-person");
  const [reason, setReason] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  // Load approved doctors
  useEffect(() => {
    let active = true;

    const loadDoctors = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await approvedDoctorService.getAll();

        if (active) {
          setDoctors(result);
        }
      } catch (err) {
        console.error("Failed to load doctors:", err);

        if (active) {
          setError(err.message || "Unable to load approved doctors.");
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadDoctors();

    return () => {
      active = false;
    };
  }, [reloadKey]);

  // Subscribe to the logged-in patient's appointments.
  // Firestore updates this list automatically when the doctor changes a status.
  useEffect(() => {
    if (activeTab !== "history") return;

    setHistoryLoading(true);
    setHistoryError("");

    const unsubscribe = appointmentService.subscribeToPatientAppointments(
      (data) => {
        setAppointments(data);
        setHistoryLoading(false);
        setHistoryError("");
      },
      (err) => {
        console.error("Unable to load patient appointment history:", err);
        setHistoryError(
          err.message || "Unable to load your appointment history."
        );
        setHistoryLoading(false);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [activeTab]);

  // Specialties
  const specialties = useMemo(() => {
    const unique = [
      ...new Set(
        doctors
          .map((doctor) => doctor.specialty?.trim())
          .filter(Boolean)
      ),
    ];

    return [
      "All Specialties",
      ...unique.sort((a, b) => a.localeCompare(b)),
    ];
  }, [doctors]);

  // Doctor search
  const filteredDoctors = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesSpecialty =
        selectedSpecialty === "All Specialties" ||
        doctor.specialty === selectedSpecialty;

      const searchableText = [
        doctor.name,
        doctor.fullName,
        doctor.specialty,
        doctor.qualification,
        doctor.clinic,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        matchesSpecialty &&
        (!query || searchableText.includes(query))
      );
    });
  }, [doctors, selectedSpecialty, searchQuery]);

  // History filter
  const filteredAppointments = useMemo(() => {
    if (historyFilter === "ALL") return appointments;

    return appointments.filter(
      (appointment) => appointment.status === historyFilter
    );
  }, [appointments, historyFilter]);

  const appointmentCounts = useMemo(() => {
    return {
      ALL: appointments.length,
      PENDING: appointments.filter((a) => a.status === "PENDING").length,
      ACCEPTED: appointments.filter((a) => a.status === "ACCEPTED").length,
      REJECTED: appointments.filter((a) => a.status === "REJECTED").length,
      COMPLETED: appointments.filter((a) => a.status === "COMPLETED").length,
    };
  }, [appointments]);

  const handleRetry = () => {
    setReloadKey((previous) => previous + 1);
  };

  const openBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentDate("");
    setAppointmentTime("");
    setAppointmentType("in-person");
    setReason("");
    setBookingError("");
    setBookingSuccess("");
    setShowBookingModal(true);
  };

  const closeBooking = () => {
    if (bookingLoading) return;

    setShowBookingModal(false);
    setSelectedDoctor(null);
    setBookingError("");
  };

  const handleBooking = async (event) => {
    event.preventDefault();

    if (!selectedDoctor) {
      setBookingError("Please select a doctor.");
      return;
    }

    if (!appointmentDate || !appointmentTime) {
      setBookingError("Please select a date and time.");
      return;
    }

    const requestedDateTime = new Date(
      `${appointmentDate}T${appointmentTime}`
    );

    if (
      Number.isNaN(requestedDateTime.getTime()) ||
      requestedDateTime <= new Date()
    ) {
      setBookingError("Please select a future date and time.");
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");

      await appointmentService.createAppointment(selectedDoctor, {
        appointmentDate,
        appointmentTime,
        type: appointmentType,
        reason,
      });

      setShowBookingModal(false);
      setSelectedDoctor(null);
      setBookingSuccess(
        "Appointment request submitted successfully. You can track its status in Past Doctor Visits."
      );
    } catch (err) {
      console.error("Appointment booking failed:", err);
      setBookingError(
        err.message || "Unable to submit appointment request."
      );
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Talk to Doctor
          </h1>
          <p className="text-[17px] text-slate-600 dark:text-slate-400 mt-1">
            Discover and request consultations with approved doctors.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 text-sm font-semibold">
          <button
            onClick={() => setActiveTab("browse")}
            className={`px-5 py-2.5 rounded-xl ${
              activeTab === "browse"
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Find a Doctor
          </button>

          <button
            onClick={() => setActiveTab("history")}
            className={`px-5 py-2.5 rounded-xl ${
              activeTab === "history"
                ? "bg-cyan-500 text-slate-950 font-bold"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Past Doctor Visits
          </button>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {bookingSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>
            <p className="font-bold">Request submitted</p>
            <p>{bookingSuccess}</p>
          </div>
          <button
            onClick={() => setBookingSuccess("")}
            className="ml-auto"
            aria-label="Dismiss"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* DOCTOR DISCOVERY */}
      {activeTab === "browse" && (
        <div className="space-y-6">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-700 dark:text-emerald-400">
                Verified doctor listings
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Only profiles approved by an administrator are displayed.
              </p>
            </div>
          </div>

          {/* SEARCH */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search doctor or specialty..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1">
              {specialties.map((specialty) => (
                <button
                  key={specialty}
                  onClick={() => setSelectedSpecialty(specialty)}
                  className={`px-4 py-2.5 rounded-2xl text-sm font-semibold whitespace-nowrap ${
                    selectedSpecialty === specialty
                      ? "bg-cyan-500 text-slate-950"
                      : "bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {specialty}
                </button>
              ))}
            </div>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <RefreshCw className="w-9 h-9 text-cyan-500 animate-spin mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Loading approved doctors
              </h3>
              <p className="text-slate-500 mt-1">
                Fetching doctor profiles from Firestore.
              </p>
            </div>
          )}

          {/* ERROR */}
          {!loading && error && (
            <div className="p-8 rounded-3xl border border-red-300 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-center">
              <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Unable to load doctors
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                {error}
              </p>
              <button
                onClick={handleRetry}
                className="mt-5 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold"
              >
                Try Again
              </button>
            </div>
          )}

          {/* EMPTY */}
          {!loading && !error && doctors.length === 0 && (
            <div className="p-10 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 text-center">
              <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                No approved doctors yet
              </h3>
              <p className="text-slate-500 mt-2">
                Approved doctor profiles will appear here after verification.
              </p>
              <button
                onClick={handleRetry}
                className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          )}

          {/* NO SEARCH RESULTS */}
          {!loading &&
            !error &&
            doctors.length > 0 &&
            filteredDoctors.length === 0 && (
              <div className="p-10 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 text-center">
                <Search className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  No matching doctors
                </h3>
                <p className="text-slate-500 mt-2">
                  Try another name or specialty.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSpecialty("All Specialties");
                  }}
                  className="mt-4 text-cyan-600 font-semibold"
                >
                  Clear filters
                </button>
              </div>
            )}

          {/* DOCTOR CARDS */}
          {!loading && !error && filteredDoctors.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {filteredDoctors.length} approved doctor
                  {filteredDoctors.length !== 1 ? "s" : ""} found
                </p>

                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 text-sm font-semibold text-cyan-600 dark:text-cyan-400"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor.uid}
                    className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/40 transition-all space-y-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                        <UserRound className="w-8 h-8 text-cyan-500" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white break-words">
                          {doctor.name}
                        </h3>
                        <p className="text-sm text-cyan-600 dark:text-cyan-400 font-semibold mt-1">
                          {doctor.specialty}
                        </p>
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          Administrator approved
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-4">
                      {doctor.qualification && (
                        <div className="flex items-start gap-3">
                          <Stethoscope className="w-5 h-5 text-slate-400 shrink-0" />
                          <div>
                            <p className="text-xs text-slate-500">
                              Qualification
                            </p>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {doctor.qualification}
                            </p>
                          </div>
                        </div>
                      )}

                      {doctor.clinic && (
                        <div className="flex items-start gap-3">
                          <CalendarClock className="w-5 h-5 text-slate-400 shrink-0" />
                          <div>
                            <p className="text-xs text-slate-500">
                              Clinic / Organization
                            </p>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                              {doctor.clinic}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        Public profile from verified application
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => openBooking(doctor)}
                          className="py-3 px-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2"
                        >
                          <CalendarClock className="w-4 h-4" />
                          Book Appointment
                        </button>

                        <button
                          type="button"
                          disabled
                          title="Video consultation is not connected yet."
                          className="py-3 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
                        >
                          <Video className="w-4 h-4" />
                          Video soon
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* PATIENT APPOINTMENT HISTORY */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Your Appointments
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Live updates from your doctor appointment requests.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Firestore updates
            </div>
          </div>

          {/* STATUS COUNTS */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { key: "ALL", label: "All", color: "text-slate-700 dark:text-white" },
              { key: "PENDING", label: "Pending", color: "text-amber-600" },
              { key: "ACCEPTED", label: "Accepted", color: "text-blue-600" },
              { key: "REJECTED", label: "Rejected", color: "text-rose-600" },
              { key: "COMPLETED", label: "Completed", color: "text-emerald-600" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setHistoryFilter(item.key)}
                className={`p-4 rounded-2xl border text-left transition ${
                  historyFilter === item.key
                    ? "border-cyan-500 bg-cyan-500/10"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827]"
                }`}
              >
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.label}
                </p>
                <p className={`text-2xl font-extrabold mt-1 ${item.color}`}>
                  {appointmentCounts[item.key]}
                </p>
              </button>
            ))}
          </div>

          {/* HISTORY LOADING */}
          {historyLoading && (
            <div className="py-16 text-center rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800">
              <RefreshCw className="w-9 h-9 text-cyan-500 animate-spin mx-auto mb-3" />
              <p className="font-semibold text-slate-800 dark:text-white">
                Loading your appointments...
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Connecting to your Firestore records.
              </p>
            </div>
          )}

          {/* HISTORY ERROR */}
          {!historyLoading && historyError && (
            <div className="p-6 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/20">
              <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-semibold">
                <AlertCircle size={20} />
                Unable to load appointment history
              </div>
              <p className="text-sm mt-2 text-rose-700 dark:text-rose-300">
                {historyError}
              </p>
              <p className="text-xs mt-2 text-slate-500">
                Check that you are logged in and that your Firestore rules allow
                patients to read appointments where patientId matches their UID.
              </p>
            </div>
          )}

          {/* EMPTY HISTORY */}
          {!historyLoading &&
            !historyError &&
            appointments.length === 0 && (
              <div className="p-10 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 text-center">
                <History className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  No appointments yet
                </h3>
                <p className="text-slate-500 mt-2">
                  When you request a consultation, it will appear here.
                </p>
                <button
                  onClick={() => setActiveTab("browse")}
                  className="mt-5 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold"
                >
                  Find a Doctor
                </button>
              </div>
            )}

          {/* FILTERED EMPTY STATE */}
          {!historyLoading &&
            !historyError &&
            appointments.length > 0 &&
            filteredAppointments.length === 0 && (
              <div className="p-8 rounded-2xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 text-center">
                <ClipboardList className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 dark:text-white">
                  No {historyFilter.toLowerCase()} appointments
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Try selecting another status filter.
                </p>
              </div>
            )}

          {/* APPOINTMENT CARDS */}
          {!historyLoading &&
            !historyError &&
            filteredAppointments.length > 0 && (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center shrink-0">
                          <Stethoscope className="w-6 h-6 text-cyan-500" />
                        </div>

                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {appointment.doctorName || "Doctor"}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Doctor consultation
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold w-fit ${getStatusStyle(
                          appointment.status
                        )}`}
                      >
                        {appointment.status || "PENDING"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <CalendarDays className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Date</p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {formatAppointmentDate(appointment.appointmentDate)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Time</p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {formatAppointmentTime(appointment.appointmentTime)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {appointment.type === "video" ? (
                          <Video className="w-5 h-5 text-slate-400" />
                        ) : (
                          <MapPin className="w-5 h-5 text-slate-400" />
                        )}
                        <div>
                          <p className="text-xs text-slate-500">
                            Consultation type
                          </p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                            {appointment.type === "video"
                              ? "Video consultation request"
                              : "Clinic / In-person"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <CalendarClock className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="text-xs text-slate-500">Request ID</p>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 break-all">
                            {appointment.id}
                          </p>
                        </div>
                      </div>
                    </div>

                    {appointment.reason && (
                      <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                          Reason for consultation
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                          {appointment.reason}
                        </p>
                      </div>
                    )}

                    <div className="mt-5 flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{getStatusDescription(appointment.status)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      )}

      {/* BOOKING MODAL */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Request an Appointment
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  With {selectedDoctor.name}
                </p>
                <p className="text-xs text-cyan-600 mt-1">
                  {selectedDoctor.specialty}
                </p>
              </div>

              <button
                onClick={closeBooking}
                disabled={bookingLoading}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close booking form"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Appointment date
                </label>
                <div className="relative">
                  <CalendarDays
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="date"
                    required
                    min={getLocalDate()}
                    value={appointmentDate}
                    onChange={(event) =>
                      setAppointmentDate(event.target.value)
                    }
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Preferred time
                </label>
                <div className="relative">
                  <Clock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="time"
                    required
                    value={appointmentTime}
                    onChange={(event) =>
                      setAppointmentTime(event.target.value)
                    }
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  This is a requested time, not a confirmed available slot.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Consultation type
                </label>
                <select
                  value={appointmentType}
                  onChange={(event) => setAppointmentType(event.target.value)}
                  className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="in-person">Clinic / In-person</option>
                  <option value="video">Video consultation request</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
                  Reason for consultation (optional)
                </label>
                <textarea
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder="Briefly describe why you need a consultation..."
                  className="w-full px-3 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-y"
                />
              </div>

              {bookingError && (
                <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm">
                  <AlertCircle className="inline mr-2" size={16} />
                  {bookingError}
                </div>
              )}

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 text-xs">
                Submitting this form sends an appointment request. The
                appointment is not confirmed until the doctor accepts it.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeBooking}
                  disabled={bookingLoading}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="flex-1 px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold disabled:opacity-50"
                >
                  {bookingLoading ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DisclaimerBanner />
    </div>
  );
}