
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Calendar,
  Video,
  FileText,
  Clock,
  QrCode,
  ArrowRight,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Stethoscope,
} from "lucide-react";

import { useDoctorAuth } from "../../context/DoctorAuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { appointmentService } from "../../services/appointmentService";

function getToday() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");
}

function statusStyle(status) {
  switch (status) {
    case "ACCEPTED":
      return "bg-emerald-100 text-emerald-700";
    case "REJECTED":
      return "bg-rose-100 text-rose-700";
    case "COMPLETED":
      return "bg-blue-100 text-blue-700";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

function MetricCard({ icon: Icon, title, value, subtitle, color }) {
  return (
    <div className="rounded-2xl p-5 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>

        <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
          {value}
        </p>
      </div>

      <p className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

export default function DoctorOverviewPage() {
  const { doctor, isVerified } = useDoctorAuth();
  const { t, isHindi } = useLanguage();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!doctor?.uid || !isVerified) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const unsubscribe =
      appointmentService.subscribeToDoctorAppointments(
        doctor.uid,
        (data) => {
          setAppointments(Array.isArray(data) ? data : []);
          setLoading(false);
          setError("");
        },
        (err) => {
          console.error("Doctor overview appointment error:", err);
          setError(err?.message || "Unable to load appointments.");
          setLoading(false);
        }
      );

    return unsubscribe;
  }, [doctor?.uid, isVerified]);

  const handleRefresh = async () => {
    if (!doctor?.uid || !isVerified) {
      setError("Verified doctor account is required.");
      return;
    }

    setRefreshing(true);
    setError("");

    try {
      const data = await appointmentService.getDoctorAppointments(
        doctor.uid
      );

      setAppointments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Doctor overview refresh failed:", err);
      setError(err?.message || "Unable to refresh appointments.");
    } finally {
      setRefreshing(false);
    }
  };

  const today = getToday();

  const todayAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) => appointment.appointmentDate === today
      ),
    [appointments, today]
  );

  const upcomingVideoAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) =>
          appointment.type === "video" &&
          appointment.status === "ACCEPTED" &&
          appointment.appointmentDate >= today
      ),
    [appointments, today]
  );

  const pendingAppointments = useMemo(
    () =>
      appointments.filter(
        (appointment) => appointment.status === "PENDING"
      ),
    [appointments]
  );

  const uniquePatientCount = useMemo(() => {
    const patientIds = new Set(
      appointments
        .map((appointment) => appointment.patientId)
        .filter(Boolean)
    );

    return patientIds.size;
  }, [appointments]);

  const doctorName = doctor?.fullName || doctor?.name || "";
  const specialization = doctor?.specialization || "";
  const clinicName = doctor?.clinicName || "";

  return (
    <div className="space-y-8 pb-12">

      {/* Welcome banner */}
      <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-transparent border border-blue-500/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                {t("doctor.practicePortal", {}, "Doctor Practice Portal")}
              </span>

              {isVerified && (
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {t("doctor.verifiedPractitioner", {}, "Verified Practitioner")}
                </span>
              )}
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              {t("doctor.welcomeBack", {}, "Welcome back,")}{" "}
              {doctorName ? `Dr. ${doctorName.replace(/^(Dr\.?\s*)+/i, "")}` : "Doctor"}
            </h1>

            {(specialization || clinicName) && (
              <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                {specialization}
                {specialization && clinicName ? " • " : ""}
                {clinicName}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading || refreshing || !isVerified}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold hover:border-blue-500 cursor-pointer active:scale-95 transition-all disabled:opacity-60 shadow-xs"
              title={isHindi ? "डैशबोर्ड रिफ्रेश करें" : "Refresh Dashboard"}
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  refreshing ? "animate-spin text-blue-500" : ""
                }`}
              />
              <span>
                {refreshing
                  ? isHindi
                    ? "रिफ्रेश..."
                    : "Refreshing..."
                  : isHindi
                    ? "रिफ्रेश"
                    : "Refresh"}
              </span>
            </button>

            <Link
              to="/doctor/appointments"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all"
            >
              <Calendar className="w-4 h-4" />
              {t("doctor.appointments", {}, "Appointments")}
            </Link>

            <Link
              to="/doctor/scan-qr"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white text-sm font-medium hover:bg-slate-800 transition-all"
            >
              <QrCode className="w-4 h-4" />
              {t("doctor.scanQr", {}, "Scan Patient QR")}
            </Link>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          <AlertCircle className="inline mr-2" size={17} />
          {error}
        </div>
      )}

      {/* Appointment metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          icon={Users}
          title={isHindi ? "अपॉइंटमेंट वाले मरीज" : "Patients with Appointments"}
          value={loading ? "—" : uniquePatientCount}
          subtitle={
            isHindi
              ? "अपॉइंटमेंट रिकॉर्ड में अलग-अलग मरीज।"
              : "Distinct patients in your appointment records."
          }
          color="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
        />

        <MetricCard
          icon={Calendar}
          title={t("doctor.todayAppointments", {}, "Today's Appointments")}
          value={loading ? "—" : todayAppointments.length}
          subtitle={
            isHindi
              ? "आज के लिए निर्धारित परामर्श।"
              : "Appointments scheduled for today."
          }
          color="bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
        />

        <MetricCard
          icon={Video}
          title={t("doctor.upcomingVideo", {}, "Upcoming Video Consultations")}
          value={loading ? "—" : upcomingVideoAppointments.length}
          subtitle={
            isHindi
              ? "स्वीकृत वीडियो परामर्श बुकिंग।"
              : "Accepted video appointment bookings."
          }
          color="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
        />

        <MetricCard
          icon={FileText}
          title={isHindi ? "क्लिनिकल रिपोर्ट" : "Clinical Reports"}
          value="Not connected"
          subtitle={
            isHindi
              ? "रिपोर्ट स्टोरेज अभी उपलब्ध नहीं है।"
              : "Clinical report storage is not connected yet."
          }
          color="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
        />
      </div>

      {/* Today's appointments */}
      <div className="rounded-2xl p-6 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              {isHindi
                ? "आज का परामर्श कार्यक्रम"
                : "Today's Consultation Schedule"}
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {new Date().toLocaleDateString(
                isHindi ? "hi-IN" : "en-IN",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }
              )}
            </p>
          </div>

          <Link
            to="/doctor/appointments"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            {isHindi ? "पूरा कार्यक्रम देखें" : "Full Schedule"}
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-slate-500">
            <RefreshCw className="animate-spin mx-auto mb-3" />
            Loading appointments from Firestore...
          </div>
        ) : todayAppointments.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
            <Calendar className="mx-auto mb-3" size={34} />
            <p className="font-semibold">
              No appointments scheduled today
            </p>
            <p className="text-xs mt-1">
              New appointment requests will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm">
                    {(appointment.patientName || "P")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {appointment.patientName || "Patient"}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {appointment.reason || "No reason provided"}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {appointment.appointmentTime || "Time not provided"}
                      </span>

                      <span>
                        {appointment.type === "video" ? "Video" : "In-person"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusStyle(
                      appointment.status
                    )}`}
                  >
                    {appointment.status || "UNKNOWN"}
                  </span>

                  <Link
                    to="/doctor/appointments"
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending appointment requests */}
      <div className="rounded-2xl p-6 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Pending Appointment Requests
          </h2>

          <span className="text-sm font-bold text-amber-600">
            {loading ? "—" : pendingAppointments.length}
          </span>
        </div>

        {loading ? (
          <p className="text-sm text-slate-500">Loading...</p>
        ) : pendingAppointments.length === 0 ? (
          <p className="text-sm text-slate-500">
            No pending appointment requests.
          </p>
        ) : (
          <p className="text-sm text-slate-600 dark:text-slate-300">
            You have {pendingAppointments.length} appointment request(s)
            awaiting your review.
          </p>
        )}

        <Link
          to="/doctor/appointments"
          className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Review appointments
          <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Clinical records availability */}
      <div className="rounded-2xl p-6 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-teal-500" />
          Clinical Records
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Patient records, medical reports and prescriptions will become
          available after their secure Firestore workflows and patient
          authorization are implemented.
        </p>
      </div>
    </div>
  );
}
