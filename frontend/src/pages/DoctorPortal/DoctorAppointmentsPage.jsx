
import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CalendarDays,
  List,
  RefreshCw,
  Search,
  Building,
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

function formatDate(value) {
  if (!value) return "Date not provided";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function statusStyle(status) {
  switch (status) {
    case "ACCEPTED":
      return "bg-emerald-100 text-emerald-700";
    case "REJECTED":
      return "bg-rose-100 text-rose-700";
    case "COMPLETED":
      return "bg-blue-100 text-blue-700";
    case "CANCELLED":
      return "bg-slate-100 text-slate-600";
    default:
      return "bg-amber-100 text-amber-700";
  }
}

export default function DoctorAppointmentsPage() {
  const { doctor, isVerified } = useDoctorAuth();
  const { isHindi } = useLanguage();

  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");

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
          console.error("Appointment subscription failed:", err);
          setError(err?.message || "Unable to load appointments.");
          setLoading(false);
        }
      );

    return unsubscribe;
  }, [doctor?.uid, isVerified]);

  const handleRefresh = async () => {
    if (!doctor?.uid || !isVerified) {
      setError("A verified doctor account is required.");
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
      console.error("Manual refresh failed:", err);
      setError(err?.message || "Unable to refresh appointments.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, status) => {
    if (!doctor?.uid || !isVerified) {
      setError("A verified doctor account is required.");
      return;
    }

    try {
      setUpdatingId(appointmentId);
      setError("");

      await appointmentService.updateStatus(appointmentId, status);

      setToastMessage(
        isHindi
          ? `अपॉइंटमेंट स्थिति ${status} में अपडेट की गई।`
          : `Appointment status updated to ${status}.`
      );

      setTimeout(() => setToastMessage(""), 3000);
    } catch (err) {
      console.error("Appointment update failed:", err);
      setError(err?.message || "Could not update appointment.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredAppointments = useMemo(() => {
    let list = [...appointments];

    if (activeTab === "today") {
      list = list.filter(
        (apt) => apt.appointmentDate === getToday()
      );
    } else if (activeTab === "video") {
      list = list.filter((apt) => apt.type === "video");
    } else if (activeTab === "in-person") {
      list = list.filter((apt) => apt.type === "in-person");
    } else if (activeTab === "completed") {
      list = list.filter((apt) => apt.status === "COMPLETED");
    } else if (activeTab === "pending") {
      list = list.filter((apt) => apt.status === "PENDING");
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();

      list = list.filter((apt) => {
        return (
          (apt.patientName || "").toLowerCase().includes(query) ||
          (apt.reason || "").toLowerCase().includes(query) ||
          (apt.appointmentDate || "").toLowerCase().includes(query) ||
          (apt.type || "").toLowerCase().includes(query) ||
          (apt.id || "").toLowerCase().includes(query)
        );
      });
    }

    return list.sort((a, b) => {
      const dateA = `${a.appointmentDate || ""}T${a.appointmentTime || ""}`;
      const dateB = `${b.appointmentDate || ""}T${b.appointmentTime || ""}`;

      return dateB.localeCompare(dateA);
    });
  }, [appointments, activeTab, searchQuery]);

  const tabs = [
    { id: "all", label: isHindi ? "सभी नियुक्तियां" : "All Appointments" },
    { id: "pending", label: isHindi ? "लंबित अनुरोध" : "Pending Requests" },
    { id: "today", label: isHindi ? "आज का कार्यक्रम" : "Today's Schedule" },
    { id: "video", label: isHindi ? "वीडियो परामर्श" : "Video Consultations" },
    { id: "in-person", label: isHindi ? "प्रत्यक्ष मुलाकात" : "In-Person Visits" },
    { id: "completed", label: isHindi ? "पूर्ण" : "Completed" },
  ];

  const counts = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "PENDING").length,
    accepted: appointments.filter((a) => a.status === "ACCEPTED").length,
    completed: appointments.filter((a) => a.status === "COMPLETED").length,
  };

  if (!isVerified) {
    return (
      <div className="p-6 rounded-2xl border border-amber-200 bg-amber-50 text-amber-800">
        <AlertCircle className="inline mr-2" size={18} />
        Doctor verification is required to access appointment management.
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-700">
            {isHindi ? "क्लिनिक शेड्यूलिंग" : "Practice Scheduling"}
          </span>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-3">
            {isHindi ? "परामर्श नियुक्तियां" : "Consultation Appointments"}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {isHindi
              ? "अपने मरीजों से प्राप्त परामर्श अनुरोध प्रबंधित करें।"
              : "Manage appointment requests received from your patients."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          {refreshing
            ? "Refreshing..."
            : isHindi
              ? "रिफ्रेश"
              : "Refresh"}
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border dark:border-slate-800">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-2xl font-bold">
            {loading ? "—" : counts.total}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border dark:border-slate-800">
          <p className="text-xs text-slate-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">
            {loading ? "—" : counts.pending}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border dark:border-slate-800">
          <p className="text-xs text-slate-500">Accepted</p>
          <p className="text-2xl font-bold text-emerald-600">
            {loading ? "—" : counts.accepted}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border dark:border-slate-800">
          <p className="text-xs text-slate-500">Completed</p>
          <p className="text-2xl font-bold text-blue-600">
            {loading ? "—" : counts.completed}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 ml-2" />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            isHindi
              ? "मरीज का नाम, समस्या, दिनांक या आईडी से खोजें..."
              : "Search by patient name, reason, date, or appointment ID..."
          }
          className="w-full py-2 bg-transparent text-sm text-slate-900 dark:text-white outline-none"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-xs text-blue-600 px-2"
          >
            Clear
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          <AlertCircle className="inline mr-2" size={17} />
          {error}
        </div>
      )}

      {/* Filters and view controls */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border dark:border-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 dark:bg-slate-800"
            }`}
            title="List View"
          >
            <List size={18} />
          </button>

          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            className={`p-2 rounded-lg ${
              viewMode === "calendar"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 dark:bg-slate-800"
            }`}
            title="Calendar View"
          >
            <CalendarDays size={18} />
          </button>
        </div>
      </div>

      {/* Appointment data */}
      {loading ? (
        <div className="text-center py-16 text-slate-500">
          <RefreshCw className="animate-spin mx-auto mb-3" />
          Loading appointments from Firestore...
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="text-center py-14 bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800">
          <CalendarIcon className="mx-auto mb-3 text-slate-400" size={34} />

          <p className="font-semibold text-slate-800 dark:text-white">
            {isHindi ? "कोई नियुक्ति नहीं मिली" : "No appointments found"}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {isHindi
              ? "मरीजों द्वारा बुक की गई नियुक्तियां यहां दिखाई देंगी।"
              : "Appointments booked by patients will appear here."}
          </p>
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <User size={22} />
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {apt.patientName || "Patient"}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {apt.reason || "No reason provided"}
                    </p>

                    <div className="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <CalendarIcon size={14} />
                        {formatDate(apt.appointmentDate)}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {apt.appointmentTime || "Time not provided"}
                      </span>

                      <span className="flex items-center gap-1">
                        {apt.type === "video" ? (
                          <Video size={14} />
                        ) : (
                          <Building size={14} />
                        )}
                        {apt.type === "video" ? "Video" : "In-person"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full ${statusStyle(
                      apt.status
                    )}`}
                  >
                    {apt.status || "PENDING"}
                  </span>

                  {apt.status === "PENDING" && (
                    <>
                      <button
                        disabled={updatingId === apt.id}
                        onClick={() =>
                          handleUpdateStatus(apt.id, "ACCEPTED")
                        }
                        className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs disabled:opacity-50 flex items-center gap-1"
                      >
                        <CheckCircle2 size={14} />
                        Accept
                      </button>

                      <button
                        disabled={updatingId === apt.id}
                        onClick={() =>
                          handleUpdateStatus(apt.id, "REJECTED")
                        }
                        className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs disabled:opacity-50 flex items-center gap-1"
                      >
                        <XCircle size={14} />
                        Reject
                      </button>
                    </>
                  )}

                  {apt.status === "ACCEPTED" && (
                    <button
                      disabled={updatingId === apt.id}
                      onClick={() =>
                        handleUpdateStatus(apt.id, "COMPLETED")
                      }
                      className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs disabled:opacity-50"
                    >
                      Mark completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-5">
          <h3 className="font-bold mb-4">
            {isHindi ? "नियुक्ति कैलेंडर" : "Appointment Calendar"}
          </h3>

          <div className="space-y-3">
            {[...filteredAppointments]
              .filter((apt) => apt.appointmentDate)
              .sort((a, b) =>
                a.appointmentDate.localeCompare(b.appointmentDate)
              )
              .map((apt) => (
                <div
                  key={apt.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800"
                >
                  <div>
                    <p className="font-semibold text-sm">
                      {formatDate(apt.appointmentDate)}
                    </p>

                    <p className="text-xs text-slate-500">
                      {apt.appointmentTime || "Time not provided"} ·{" "}
                      {apt.patientName || "Patient"}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${statusStyle(
                      apt.status
                    )}`}
                  >
                    {apt.status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white border border-cyan-500/40 shadow-2xl flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">
            {toastMessage}
          </span>
        </div>
      )}
    </div>
  );
}
