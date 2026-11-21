
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
  Plus,
  X,
  Building,
  ChevronRight,
} from "lucide-react";

import { useDoctorAuth } from "../../context/DoctorAuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { appointmentService } from "../../services/appointmentService";
import { doctorPatientService } from "../../services/doctorPatientService";

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
  const { doctor } = useDoctorAuth();
  const { isHindi } = useLanguage();

  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newSchedule, setNewSchedule] = useState({
    patientId: "",
    appointmentDate: getToday(),
    appointmentTime: "10:30",
    type: "video",
    reason: "",
  });

  useEffect(() => {
    if (!doctor?.uid) {
      setAppointments([]);
      setPatients([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const unsubscribeAppointments =
      appointmentService.subscribeToDoctorAppointments(
        doctor.uid,
        (data) => {
          setAppointments(data);
          setLoading(false);
        },
        (err) => {
          console.error("Appointment subscription failed:", err);
          setError(
            err?.message || "Unable to load appointments."
          );
          setLoading(false);
        }
      );

    const unsubscribePatients =
      doctorPatientService.subscribeToDoctorPatients(
        doctor.uid,
        (data) => setPatients(data),
        (err) => {
          console.error("Patient roster subscription failed:", err);
          setError(
            err?.message || "Unable to load patient directory."
          );
        }
      );

    return () => {
      unsubscribeAppointments?.();
      unsubscribePatients?.();
    };
  }, [doctor?.uid]);

  const handleRefresh = async () => {
    if (!doctor?.uid) return;

    setLoading(true);
    setError("");

    try {
      const [appointmentData, patientData] = await Promise.all([
        appointmentService.getDoctorAppointments(doctor.uid),
        doctorPatientService.getDoctorPatients(doctor.uid),
      ]);

      setAppointments(appointmentData);
      setPatients(patientData);
    } catch (err) {
      console.error("Manual refresh failed:", err);
      setError(err?.message || "Unable to refresh appointments.");
    } finally {
      setLoading(false);
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
      const term = searchQuery.toLowerCase().trim();

      list = list.filter((apt) => {
        return (
          (apt.patientName || "").toLowerCase().includes(term) ||
          (apt.reason || "").toLowerCase().includes(term) ||
          (apt.appointmentDate || "").toLowerCase().includes(term) ||
          (apt.type || "").toLowerCase().includes(term) ||
          (apt.id || "").toLowerCase().includes(term)
        );
      });
    }

    return list;
  }, [appointments, activeTab, searchQuery]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);
      setError("");

      await appointmentService.updateStatus(
        appointmentId,
        status
      );

      setToastMessage(
        isHindi
          ? `अपॉइंटमेंट स्थिति ${status} में अपडेट की गई।`
          : `Appointment status updated to ${status}.`
      );

      setTimeout(() => setToastMessage(""), 3500);
    } catch (err) {
      console.error("Appointment update failed:", err);
      setError(err?.message || "Could not update appointment.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddScheduleSubmit = async (event) => {
    event.preventDefault();

    if (!doctor?.uid) {
      setError("Doctor account is not available.");
      return;
    }

    const selectedPatient = patients.find(
      (patient) => patient.patientId === newSchedule.patientId
    );

    if (!selectedPatient) {
      setError(
        isHindi
          ? "कृपया सूची से एक वैध मरीज चुनें।"
          : "Please select a valid patient from the list."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await appointmentService.addDoctorAppointment(doctor, {
        patientId: selectedPatient.patientId,
        patientName:
          selectedPatient.patientName ||
          selectedPatient.name ||
          "Patient",
        appointmentDate: newSchedule.appointmentDate,
        appointmentTime: newSchedule.appointmentTime,
        type: newSchedule.type,
        reason: newSchedule.reason,
      });

      setShowAddModal(false);

      setToastMessage(
        isHindi
          ? "अपॉइंटमेंट अनुरोध Firestore में सहेजा गया।"
          : "Appointment request saved to Firestore."
      );

      setTimeout(() => setToastMessage(""), 4000);

      setNewSchedule({
        patientId: "",
        appointmentDate: getToday(),
        appointmentTime: "10:30",
        type: "video",
        reason: "",
      });
    } catch (err) {
      console.error("Failed to add appointment:", err);
      setError(err?.message || "Failed to schedule appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: "all", label: isHindi ? "सभी नियुक्तियां" : "All Appointments" },
    { id: "pending", label: isHindi ? "लंबित अनुरोध" : "Pending Requests" },
    { id: "today", label: isHindi ? "आज का कार्यक्रम" : "Today's Schedule" },
    { id: "video", label: isHindi ? "वीडियो परामर्श" : "Video Consultations" },
    { id: "in-person", label: isHindi ? "प्रत्यक्ष मुलाकात" : "In-Person Visits" },
    { id: "completed", label: isHindi ? "पूर्ण" : "Completed" },
  ];

  return (
    <div className="space-y-7 pb-12">
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
              : "Manage appointment requests from your patients."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            disabled={patients.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {isHindi ? "नया शेड्यूल" : "Add Schedule"}
          </button>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-60"
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
            />
            {isHindi ? "रिफ्रेश" : "Refresh"}
          </button>

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: isHindi ? "कुल" : "Total",
            value: appointments.length,
            color: "text-slate-900 dark:text-white",
          },
          {
            label: isHindi ? "लंबित" : "Pending",
            value: appointments.filter((a) => a.status === "PENDING").length,
            color: "text-amber-600",
          },
          {
            label: isHindi ? "स्वीकृत" : "Accepted",
            value: appointments.filter((a) => a.status === "ACCEPTED").length,
            color: "text-emerald-600",
          },
          {
            label: isHindi ? "पूर्ण" : "Completed",
            value: appointments.filter((a) => a.status === "COMPLETED").length,
            color: "text-blue-600",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white dark:bg-slate-900 rounded-xl p-4 border dark:border-slate-800"
          >
            <p className="text-xs text-slate-500">{item.label}</p>
            <p className={`text-2xl font-bold ${item.color}`}>
              {loading ? "—" : item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={
              isHindi
                ? "मरीज का नाम, समस्या, दिनांक या आईडी से खोजें..."
                : "Search by patient name, reason, date or appointment ID..."
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
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
            type="button"
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
          {isHindi
            ? "Firestore से अपॉइंटमेंट लोड हो रहे हैं..."
            : "Loading appointments from Firestore..."}
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
                        type="button"
                        disabled={updatingId === apt.id}
                        onClick={() =>
                          handleUpdateStatus(apt.id, "ACCEPTED")
                        }
                        className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} className="inline mr-1" />
                        {isHindi ? "स्वीकार करें" : "Accept"}
                      </button>

                      <button
                        type="button"
                        disabled={updatingId === apt.id}
                        onClick={() =>
                          handleUpdateStatus(apt.id, "REJECTED")
                        }
                        className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs disabled:opacity-50"
                      >
                        <XCircle size={14} className="inline mr-1" />
                        {isHindi ? "अस्वीकार करें" : "Reject"}
                      </button>
                    </>
                  )}

                  {apt.status === "ACCEPTED" && (
                    <button
                      type="button"
                      disabled={updatingId === apt.id}
                      onClick={() =>
                        handleUpdateStatus(apt.id, "COMPLETED")
                      }
                      className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs disabled:opacity-50"
                    >
                      {isHindi ? "पूर्ण चिह्नित करें" : "Mark completed"}
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
                {isHindi ? "कोई नियुक्ति नहीं मिली" : "No appointments found"}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isHindi
                  ? "नए मरीज अनुरोध यहां दिखाई देंगे।"
                  : "New patient requests will appear here."}
              </p>
            </div>
          )}
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
                {isHindi
                  ? "प्रदर्शित करने के लिए कोई नियुक्ति नहीं है।"
                  : "No appointments to display."}
              </p>
            )}
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

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-7 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    {isHindi
                      ? "मरीज परामर्श शेड्यूल करें"
                      : "Schedule Patient Consultation"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isHindi
                      ? "मौजूदा मरीज चुनें और समय दर्ज करें।"
                      : "Select an existing patient and enter appointment details."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleAddScheduleSubmit}
              className="space-y-4 text-xs sm:text-sm"
            >
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isHindi ? "मरीज चुनें" : "Select Patient"} *
                </label>

                <select
                  required
                  value={newSchedule.patientId}
                  onChange={(event) =>
                    setNewSchedule({
                      ...newSchedule,
                      patientId: event.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                >
                  <option value="">
                    {isHindi ? "-- मरीज चुनें --" : "-- Select a patient --"}
                  </option>

                  {patients.map((patient) => (
                    <option
                      key={patient.patientId}
                      value={patient.patientId}
                    >
                      {patient.patientName || patient.name} ·{" "}
                      {patient.patientId}
                    </option>
                  ))}
                </select>

                <p className="text-xs text-slate-500">
                  {isHindi
                    ? "केवल आपके स्वीकृत या पूर्ण अपॉइंटमेंट वाले मरीज सूची में दिखते हैं।"
                    : "Only patients with accepted or completed appointments appear here."}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    {isHindi ? "परामर्श दिनांक" : "Appointment Date"} *
                  </label>

                  <input
                    type="date"
                    required
                    min={getToday()}
                    value={newSchedule.appointmentDate}
                    onChange={(event) =>
                      setNewSchedule({
                        ...newSchedule,
                        appointmentDate: event.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    {isHindi ? "परामर्श समय" : "Appointment Time"} *
                  </label>

                  <input
                    type="time"
                    required
                    value={newSchedule.appointmentTime}
                    onChange={(event) =>
                      setNewSchedule({
                        ...newSchedule,
                        appointmentTime: event.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isHindi ? "परामर्श का प्रकार" : "Consultation Mode"}
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() =>
                      setNewSchedule({
                        ...newSchedule,
                        type: "video",
                      })
                    }
                    className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 ${
                      newSchedule.type === "video"
                        ? "bg-purple-500/15 border-purple-500/50 text-purple-700 dark:text-purple-300"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    {isHindi ? "वीडियो परामर्श" : "Video"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setNewSchedule({
                        ...newSchedule,
                        type: "in-person",
                      })
                    }
                    className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 ${
                      newSchedule.type === "in-person"
                        ? "bg-blue-500/15 border-blue-500/50 text-blue-700 dark:text-blue-300"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <Building className="w-4 h-4" />
                    {isHindi ? "प्रत्यक्ष मुलाकात" : "In-Person"}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isHindi ? "परामर्श का कारण" : "Reason for Consultation"}
                </label>

                <input
                  type="text"
                  value={newSchedule.reason}
                  onChange={(event) =>
                    setNewSchedule({
                      ...newSchedule,
                      reason: event.target.value,
                    })
                  }
                  placeholder={
                    isHindi
                      ? "परामर्श का कारण दर्ज करें..."
                      : "Enter the reason for consultation..."
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold"
                >
                  {isHindi ? "रद्द करें" : "Cancel"}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting || patients.length === 0}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  {isSubmitting
                    ? isHindi
                      ? "सहेज रहे हैं..."
                      : "Scheduling..."
                    : isHindi
                      ? "शेड्यूल जोड़ें"
                      : "Add to Schedule"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
