
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
} from "lucide-react";

import { useDoctorAuth } from "../../context/DoctorAuthContext";
import { appointmentService } from "../../services/appointmentService";

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
  const { doctor } = useDoctorAuth();

  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!doctor?.uid) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const unsubscribe =
      appointmentService.subscribeToDoctorAppointments(
        doctor.uid,
        (data) => {
          setAppointments(data);
          setLoading(false);
        },
        (err) => {
          console.error("Appointment subscription failed:", err);
          setError(err.message || "Unable to load appointments.");
          setLoading(false);
        }
      );

    return unsubscribe;
  }, [doctor?.uid]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      if (activeTab === "today") {
        return apt.appointmentDate === getToday();
      }

      if (activeTab === "video") {
        return apt.type === "video";
      }

      if (activeTab === "in-person") {
        return apt.type === "in-person";
      }

      if (activeTab === "completed") {
        return apt.status === "COMPLETED";
      }

      if (activeTab === "pending") {
        return apt.status === "PENDING";
      }

      return true;
    });
  }, [appointments, activeTab]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);
      setError("");

      await appointmentService.updateStatus(appointmentId, status);
    } catch (err) {
      console.error("Appointment update failed:", err);
      setError(err.message || "Could not update appointment.");
    } finally {
      setUpdatingId(null);
    }
  };

  const tabs = [
    { id: "all", label: "All Appointments" },
    { id: "pending", label: "Pending Requests" },
    { id: "today", label: "Today's Schedule" },
    { id: "video", label: "Video Consultations" },
    { id: "in-person", label: "In-Person Visits" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <div className="space-y-7 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-teal-100 text-teal-700">
            Practice Scheduling
          </span>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-3">
            Consultation Appointments
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Manage appointment requests from your patients.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg text-sm ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 dark:bg-slate-800"
            }`}
          >
            <List size={18} />
          </button>

          <button
            onClick={() => setViewMode("calendar")}
            className={`p-2 rounded-lg text-sm ${
              viewMode === "calendar"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 dark:bg-slate-800"
            }`}
          >
            <CalendarDays size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border dark:border-slate-800">
          <p className="text-xs text-slate-500">Total</p>
          <p className="text-2xl font-bold">{appointments.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border dark:border-slate-800">
          <p className="text-xs text-slate-500">Pending</p>
          <p className="text-2xl font-bold text-amber-600">
            {appointments.filter((a) => a.status === "PENDING").length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border dark:border-slate-800">
          <p className="text-xs text-slate-500">Accepted</p>
          <p className="text-2xl font-bold text-emerald-600">
            {appointments.filter((a) => a.status === "ACCEPTED").length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border dark:border-slate-800">
          <p className="text-xs text-slate-500">Completed</p>
          <p className="text-2xl font-bold text-blue-600">
            {appointments.filter((a) => a.status === "COMPLETED").length}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
          <AlertCircle className="inline mr-2" size={17} />
          {error}
        </div>
      )}

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

      {loading ? (
        <div className="text-center py-16 text-slate-500">
          <RefreshCw className="animate-spin mx-auto mb-3" />
          Loading appointments from Firestore...
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
                          <User size={14} />
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
                        className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} className="inline mr-1" />
                        Accept
                      </button>

                      <button
                        disabled={updatingId === apt.id}
                        onClick={() =>
                          handleUpdateStatus(apt.id, "REJECTED")
                        }
                        className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs disabled:opacity-50"
                      >
                        <XCircle size={14} className="inline mr-1" />
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

          {filteredAppointments.length === 0 && (
            <div className="text-center py-14 bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800">
              <CalendarIcon className="mx-auto mb-3 text-slate-400" size={34} />
              <p className="font-semibold text-slate-800 dark:text-white">
                No appointments found
              </p>
              <p className="text-xs text-slate-500 mt-1">
                New patient requests will appear here automatically.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-5">
          <h3 className="font-bold mb-4">Appointment Calendar</h3>

          <div className="space-y-3">
            {filteredAppointments
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
                      {apt.appointmentTime} · {apt.patientName || "Patient"}
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

            {filteredAppointments.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-8">
                No appointments to display.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
