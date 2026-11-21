
import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Video,
  Building,
  FileText,
  Pill,
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  Stethoscope,
  LockKeyhole,
} from "lucide-react";

import { useDoctorAuth } from "../../context/DoctorAuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { doctorPatientService } from "../../services/doctorPatientService";
import { appointmentService } from "../../services/appointmentService";

function formatDate(value, isHindi = false) {
  if (!value) return "Not available";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(
    isHindi ? "hi-IN" : "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function statusStyle(status) {
  switch (status) {
    case "ACCEPTED":
      return "bg-emerald-100 text-emerald-700";
    case "COMPLETED":
      return "bg-blue-100 text-blue-700";
    case "REJECTED":
      return "bg-rose-100 text-rose-700";
    case "CANCELLED":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

export default function DoctorPatientDetailPage() {
  const { id } = useParams();
  const { doctor } = useDoctorAuth();
  const { isHindi } = useLanguage();

  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!doctor?.uid || !id) {
      setPatient(null);
      setAppointments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const unsubscribePatients =
      doctorPatientService.subscribeToDoctorPatients(
        doctor.uid,
        (patientList) => {
          const matchedPatient = patientList.find(
            (item) =>
              item.patientId === id ||
              item.id === id
          );

          setPatient(matchedPatient || null);
          setLoading(false);
        },
        (err) => {
          console.error("Patient details listener failed:", err);
          setError(
            err?.message ||
              "Unable to load patient information."
          );
          setLoading(false);
        }
      );

    const unsubscribeAppointments =
      appointmentService.subscribeToDoctorAppointments(
        doctor.uid,
        (appointmentList) => {
          const patientAppointments =
            appointmentList.filter(
              (appointment) =>
                appointment.patientId === id
            );

          setAppointments(patientAppointments);
        },
        (err) => {
          console.error(
            "Patient appointment history failed:",
            err
          );

          setError(
            err?.message ||
              "Unable to load appointment history."
          );
        }
      );

    return () => {
      unsubscribePatients?.();
      unsubscribeAppointments?.();
    };
  }, [doctor?.uid, id]);

  const handleRefresh = async () => {
    if (!doctor?.uid || !id) return;

    setRefreshing(true);
    setError("");

    try {
      const [patientList, appointmentList] =
        await Promise.all([
          doctorPatientService.getDoctorPatients(
            doctor.uid
          ),
          appointmentService.getDoctorAppointments(
            doctor.uid
          ),
        ]);

      const matchedPatient = patientList.find(
        (item) =>
          item.patientId === id ||
          item.id === id
      );

      setPatient(matchedPatient || null);

      setAppointments(
        appointmentList.filter(
          (appointment) =>
            appointment.patientId === id
        )
      );
    } catch (err) {
      console.error("Patient details refresh failed:", err);

      setError(
        err?.message ||
          "Unable to refresh patient information."
      );
    } finally {
      setRefreshing(false);
    }
  };

  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort((a, b) => {
        const dateA =
          `${a.appointmentDate || ""}T${a.appointmentTime || ""}`;

        const dateB =
          `${b.appointmentDate || ""}T${b.appointmentTime || ""}`;

        return dateB.localeCompare(dateA);
      }),
    [appointments]
  );

  const completedCount = appointments.filter(
    (appointment) =>
      appointment.status === "COMPLETED"
  ).length;

  const acceptedCount = appointments.filter(
    (appointment) =>
      appointment.status === "ACCEPTED"
  ).length;

  const patientName =
    patient?.name ||
    patient?.patientName ||
    "Patient";

  if (loading) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-sm">
          {isHindi
            ? "मरीज की जानकारी लोड हो रही है..."
            : "Loading patient information..."}
        </p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-slate-400" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {isHindi
            ? "मरीज नहीं मिला"
            : "Patient Not Found"}
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          {isHindi
            ? "यह मरीज आपकी स्वीकृत या पूर्ण अपॉइंटमेंट सूची में उपलब्ध नहीं है।"
            : "This patient is not available in your accepted or completed appointment roster."}
        </p>

        {error && (
          <p className="text-sm text-rose-600 mt-3">
            {error}
          </p>
        )}

        <Link
          to="/doctor/patients"
          className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          {isHindi ? "मरीज सूची पर वापस जाएं" : "Back to Patients"}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-12">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5">
        <div>
          <Link
            to="/doctor/patients"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {isHindi ? "मेरे मरीज" : "Back to My Patients"}
          </Link>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center text-2xl font-bold shrink-0">
              {patientName.charAt(0).toUpperCase()}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
                  {patientName}
                </h1>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400">
                  {patient.status}
                </span>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 break-all">
                {isHindi ? "मरीज ID" : "Patient ID"}:{" "}
                {patient.patientId}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />
            {isHindi ? "रिफ्रेश" : "Refresh"}
          </button>

          <Link
            to={`/doctor/video-consultation?patientId=${encodeURIComponent(patient.patientId)}&name=${encodeURIComponent(patientName)}`}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
          >
            <Video className="w-4 h-4" />
            {isHindi ? "वीडियो परामर्श" : "Video Consultation"}
          </Link>

          <Link
            to="/doctor/appointments"
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
          >
            <Calendar className="w-4 h-4" />
            {isHindi ? "अपॉइंटमेंट" : "Appointments"}
          </Link>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Appointment summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? "कुल अपॉइंटमेंट" : "Total Appointments"}
            </p>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>

          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {appointments.length}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? "पूर्ण परामर्श" : "Completed Visits"}
            </p>
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
          </div>

          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {completedCount}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? "स्वीकृत अपॉइंटमेंट" : "Accepted Appointments"}
            </p>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>

          <p className="text-3xl font-extrabold text-slate-900 dark:text-white mt-3">
            {acceptedCount}
          </p>
        </div>
      </div>

      {/* Patient information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
            <User className="w-5 h-5 text-blue-500" />
            {isHindi ? "मरीज की जानकारी" : "Patient Information"}
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-sm text-slate-500">
                {isHindi ? "मरीज का नाम" : "Patient Name"}
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white text-right">
                {patientName}
              </span>
            </div>

            <div className="flex justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="text-sm text-slate-500">
                {isHindi ? "मरीज ID" : "Patient ID"}
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white text-right break-all">
                {patient.patientId}
              </span>
            </div>

            <div className="flex justify-between gap-4">
              <span className="text-sm text-slate-500">
                {isHindi ? "अपॉइंटमेंट रिकॉर्ड" : "Appointment Records"}
              </span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {patient.appointmentCount}
              </span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
            <Stethoscope className="w-5 h-5 text-teal-500" />
            {isHindi ? "क्लिनिकल जानकारी" : "Clinical Information"}
          </h2>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
            <LockKeyhole className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />

            <div>
              <p className="text-sm font-bold text-amber-900 dark:text-amber-200">
                {isHindi
                  ? "क्लिनिकल रिकॉर्ड उपलब्ध नहीं"
                  : "Clinical records are not connected"}
              </p>

              <p className="text-xs text-amber-800 dark:text-amber-300 mt-1">
                {isHindi
                  ? "निदान, मेडिकल इतिहास, एलर्जी, दवाएं और वाइटल्स यहां तभी दिखेंगे जब Firestore रिकॉर्ड और मरीज की अनुमति लागू होगी।"
                  : "Diagnoses, medical history, allergies, medications and vitals will appear here only after Firestore record storage and patient authorization are implemented."}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Appointment history */}
      <section className="rounded-2xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              {isHindi ? "अपॉइंटमेंट इतिहास" : "Appointment History"}
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              {isHindi
                ? "Firestore से प्राप्त वास्तविक अपॉइंटमेंट।"
                : "Actual appointments retrieved from Firestore."}
            </p>
          </div>

          <Link
            to="/doctor/appointments"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isHindi ? "सभी देखें" : "View All"}
          </Link>
        </div>

        {sortedAppointments.length === 0 ? (
          <div className="py-10 text-center">
            <Calendar className="w-9 h-9 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {isHindi
                ? "कोई अपॉइंटमेंट रिकॉर्ड नहीं"
                : "No appointment records found"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    {formatDate(
                      appointment.appointmentDate,
                      isHindi
                    )}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {appointment.appointmentTime ||
                        "Time not provided"}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      {appointment.type === "video" ? (
                        <Video className="w-3.5 h-3.5" />
                      ) : (
                        <Building className="w-3.5 h-3.5" />
                      )}
                      {appointment.type === "video"
                        ? "Video consultation"
                        : "In-person consultation"}
                    </span>
                  </div>

                  {appointment.reason && (
                    <p className="text-xs text-slate-500 mt-2">
                      {appointment.reason}
                    </p>
                  )}
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-full self-start sm:self-center ${statusStyle(
                    appointment.status
                  )}`}
                >
                  {appointment.status || "PENDING"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reports and prescriptions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {isHindi ? "मेडिकल रिपोर्ट" : "Medical Reports"}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi ? "Firestore कनेक्शन लंबित" : "Firestore integration pending"}
              </p>
            </div>
          </div>

          <Link
            to="/doctor/reports"
            className="inline-block mt-4 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {isHindi ? "रिपोर्ट पेज खोलें" : "Open Reports"}
          </Link>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <Pill className="w-5 h-5" />
            </div>

            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">
                {isHindi ? "प्रिस्क्रिप्शन" : "Prescriptions"}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi ? "Firestore कनेक्शन लंबित" : "Firestore integration pending"}
              </p>
            </div>
          </div>

          <Link
            to="/doctor/prescriptions"
            className="inline-block mt-4 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline"
          >
            {isHindi ? "प्रिस्क्रिप्शन पेज खोलें" : "Open Prescriptions"}
          </Link>
        </div>
      </section>
    </div>
  );
}
