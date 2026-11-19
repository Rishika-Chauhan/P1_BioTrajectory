
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
  Check,
  Phone,
  FileText
} from "lucide-react";

import { useDoctorAuth } from "../../context/DoctorAuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { appointmentService } from "../../services/appointmentService";
import { DoctorService } from "../../services/doctorService";

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
  const { t, isHindi } = useLanguage();

  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(Boolean(doctor?.uid));
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Schedule Form State
  const [newSchedule, setNewSchedule] = useState({
    patientName: "",
    selectedPatientId: "custom",
    appointmentDate: getToday(),
    appointmentTime: "10:30",
    type: "video",
    reason: "",
    status: "ACCEPTED"
  });

  // Registered patients from DoctorService for easy 1-click selection
  const existingPatients = useMemo(() => {
    return DoctorService.getDoctorPatients(doctor?.uid || 'doc_mock_1') || [];
  }, [doctor?.uid]);

  useEffect(() => {
    if (!doctor?.uid) return;

    let isMounted = true;
    const unsubscribe = appointmentService.subscribeToDoctorAppointments(
      doctor.uid,
      (data) => {
        if (isMounted) {
          setAppointments(data);
          setLoading(false);
        }
      },
      (err) => {
        if (isMounted) {
          console.error("Appointment subscription failed:", err);
          setError(err.message || "Unable to load appointments.");
          setLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [doctor?.uid]);

  const handleRefresh = async () => {
    setLoading(true);
    setError("");
    try {
      await new Promise((r) => setTimeout(r, 450));
      const uid = doctor?.uid || 'doc_mock_1';
      const data = await appointmentService.getDoctorAppointments(uid);
      if (Array.isArray(data)) {
        setAppointments(data);
      }
    } catch (err) {
      console.error("Manual refresh failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    let list = appointments;

    // 1. Tab filtering
    if (activeTab === "today") {
      list = list.filter((apt) => apt.appointmentDate === getToday());
    } else if (activeTab === "video") {
      list = list.filter((apt) => apt.type === "video");
    } else if (activeTab === "in-person") {
      list = list.filter((apt) => apt.type === "in-person");
    } else if (activeTab === "completed") {
      list = list.filter((apt) => apt.status === "COMPLETED");
    } else if (activeTab === "pending") {
      list = list.filter((apt) => apt.status === "PENDING");
    }

    // 2. Patient search query filtering
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((apt) => {
        const nameMatch = (apt.patientName || "").toLowerCase().includes(q);
        const reasonMatch = (apt.reason || "").toLowerCase().includes(q);
        const dateMatch = (apt.appointmentDate || "").toLowerCase().includes(q);
        const typeMatch = (apt.type || "").toLowerCase().includes(q);
        const idMatch = (apt.id || "").toLowerCase().includes(q);
        return nameMatch || reasonMatch || dateMatch || typeMatch || idMatch;
      });
    }

    return list;
  }, [appointments, activeTab, searchQuery]);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      setUpdatingId(appointmentId);
      setError("");

      await appointmentService.updateStatus(appointmentId, status, doctor?.uid);
      setToastMessage(
        isHindi
          ? `✓ अपॉइंटमेंट स्थिति '${status}' में अपडेट की गई!`
          : `✓ Appointment status updated to ${status}!`
      );
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error("Appointment update failed:", err);
      setError(err.message || "Could not update appointment.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddScheduleSubmit = async (e) => {
    e.preventDefault();
    let finalPatientName = newSchedule.patientName.trim();
    let finalPatientId = newSchedule.selectedPatientId;

    if (finalPatientId !== "custom") {
      const found = existingPatients.find((p) => p.id === finalPatientId);
      if (found) {
        finalPatientName = found.name || found.patientName || finalPatientName;
      }
    }

    if (!finalPatientName) {
      setError(isHindi ? "कृपया मरीज का नाम चुनें या दर्ज करें।" : "Please select or enter a patient name.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      const created = await appointmentService.addDoctorAppointment(doctor, {
        patientId: finalPatientId === "custom" ? `pat-${Date.now()}` : finalPatientId,
        patientName: finalPatientName,
        appointmentDate: newSchedule.appointmentDate,
        appointmentTime: newSchedule.appointmentTime,
        type: newSchedule.type,
        reason: newSchedule.reason || (isHindi ? "नियमित क्लिनिकल परामर्श" : "Routine Clinical Consultation"),
        status: newSchedule.status,
      });

      setShowAddModal(false);
      setToastMessage(
        isHindi
          ? `✓ ${finalPatientName} के लिए ${formatDate(newSchedule.appointmentDate)} (${newSchedule.appointmentTime}) का परामर्श शेड्यूल जोड़ दिया गया!`
          : `✓ Consultation successfully scheduled for ${finalPatientName} on ${formatDate(newSchedule.appointmentDate)} at ${newSchedule.appointmentTime}!`
      );
      setTimeout(() => setToastMessage(null), 4500);

      // Reset form to defaults
      setNewSchedule({
        patientName: "",
        selectedPatientId: "custom",
        appointmentDate: getToday(),
        appointmentTime: "10:30",
        type: "video",
        reason: "",
        status: "ACCEPTED",
      });
    } catch (err) {
      console.error("Failed to add schedule:", err);
      setError(err.message || "Failed to schedule appointment.");
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
            {isHindi ? 'क्लिनिक शेड्यूलिंग' : 'Practice Scheduling'}
          </span>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mt-3">
            {isHindi ? 'परामर्श नियुक्तियां' : 'Consultation Appointments'}
          </h1>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {isHindi ? 'अपने मरीजों से प्राप्त परामर्श अनुरोध प्रबंधित करें।' : 'Manage appointment requests from your patients.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-600/30 transition-all cursor-pointer active:scale-95 whitespace-nowrap"
            title={isHindi ? 'नया मरीज शेड्यूल जोड़ें' : 'Add New Patient Schedule'}
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{isHindi ? '+ नया शेड्यूल' : '+ Add Schedule'}</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 border dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-500 cursor-pointer active:scale-95 transition-all disabled:opacity-60 shadow-xs"
            title={isHindi ? 'अपॉइंटमेंट्स रिफ्रेश करें' : 'Refresh Appointments'}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-500' : ''}`} />
            <span>{loading ? (isHindi ? 'रिफ्रेश...' : 'Refreshing...') : (isHindi ? 'रिफ्रेश' : 'Refresh')}</span>
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg text-sm cursor-pointer ${
              viewMode === "list"
                ? "bg-blue-600 text-white"
                : "bg-slate-200 dark:bg-slate-800"
            }`}
            title="List View"
          >
            <List size={18} />
          </button>

          <button
            onClick={() => setViewMode("calendar")}
            className={`p-2 rounded-lg text-sm cursor-pointer ${
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
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border dark:border-slate-800">
          <p className="text-xs text-slate-500">{isHindi ? 'कुल' : 'Total'}</p>
          <p className="text-2xl font-bold">{appointments.length}</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border dark:border-slate-800">
          <p className="text-xs text-slate-500">{isHindi ? 'लंबित' : 'Pending'}</p>
          <p className="text-2xl font-bold text-amber-600">
            {appointments.filter((a) => a.status === "PENDING").length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border dark:border-slate-800">
          <p className="text-xs text-slate-500">{isHindi ? 'स्वीकृत' : 'Accepted'}</p>
          <p className="text-2xl font-bold text-emerald-600">
            {appointments.filter((a) => a.status === "ACCEPTED").length}
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border dark:border-slate-800">
          <p className="text-xs text-slate-500">{isHindi ? 'पूर्ण' : 'Completed'}</p>
          <p className="text-2xl font-bold text-blue-600">
            {appointments.filter((a) => a.status === "COMPLETED").length}
          </p>
        </div>
      </div>

      {/* Patient Search Option */}
      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              isHindi
                ? "मरीज का नाम, समस्या, दिनांक या आईडी से खोजें..."
                : "Search patient by name, health condition, date, or appointment ID..."
            }
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {searchQuery && (
          <div className="flex items-center justify-between sm:justify-start gap-2.5 px-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>
              {filteredAppointments.length} {isHindi ? "परामर्श मिले" : "matching results"}
            </span>
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-bold"
            >
              {isHindi ? "साफ़ करें" : "Clear filter"}
            </button>
          </div>
        )}
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
                        {isHindi ? 'स्वीकार करें' : 'Accept'}
                      </button>

                      <button
                        disabled={updatingId === apt.id}
                        onClick={() =>
                          handleUpdateStatus(apt.id, "REJECTED")
                        }
                        className="px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs disabled:opacity-50"
                      >
                        <XCircle size={14} className="inline mr-1" />
                        {isHindi ? 'अस्वीकार करें' : 'Reject'}
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
                      {isHindi ? 'पूर्ण चिह्नित करें' : 'Mark completed'}
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
                {isHindi ? 'कोई नियुक्ति नहीं मिली' : 'No appointments found'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isHindi
                  ? 'नए मरीज के अनुरोध यहां अपने आप दिखाई देंगे।'
                  : 'New patient requests will appear here automatically.'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border dark:border-slate-800 p-5">
          <h3 className="font-bold mb-4">{isHindi ? 'नियुक्ति कैलेंडर' : 'Appointment Calendar'}</h3>

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
                {isHindi ? 'प्रदर्शित करने के लिए कोई नियुक्ति नहीं है।' : 'No appointments to display.'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Toast Notification */}
      {/* ------------------------------------------------------------- */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white border border-cyan-500/40 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* Add Schedule Modal */}
      {/* ------------------------------------------------------------- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl p-6 sm:p-7 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    {isHindi ? 'मरीज परामर्श शेड्यूल करें' : 'Schedule Patient Consultation'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isHindi ? 'परामर्श समय और मरीज का विवरण दर्ज करें' : 'Add an appointment schedule for an existing or new patient.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddScheduleSubmit} className="space-y-4 text-xs sm:text-sm">
              {/* Patient Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isHindi ? 'मरीज चुनें या नया नाम दर्ज करें' : 'Select Patient or Enter Name'} *
                </label>
                <select
                  value={newSchedule.selectedPatientId}
                  onChange={(e) => {
                    const val = e.target.value;
                    const found = existingPatients.find((p) => p.id === val);
                    setNewSchedule({
                      ...newSchedule,
                      selectedPatientId: val,
                      patientName: found ? (found.name || found.patientName) : newSchedule.patientName,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                >
                  <option value="custom">
                    {isHindi ? '+ नया मरीज (मैनुअल नाम टाइप करें)' : '+ New / Custom Patient (Type Below)'}
                  </option>
                  {existingPatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name || p.patientName} {p.condition ? `(${p.condition.split('—')[0].trim()})` : ''}
                    </option>
                  ))}
                </select>

                {newSchedule.selectedPatientId === 'custom' && (
                  <input
                    type="text"
                    required
                    value={newSchedule.patientName}
                    onChange={(e) => setNewSchedule({ ...newSchedule, patientName: e.target.value })}
                    placeholder={isHindi ? 'मरीज का पूरा नाम (e.g. John Doe)...' : 'Patient full name (e.g. Marcus Vance)...'}
                    className="w-full mt-2 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                )}
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    {isHindi ? 'परामर्श दिनांक' : 'Appointment Date'} *
                  </label>
                  <input
                    type="date"
                    required
                    value={newSchedule.appointmentDate}
                    onChange={(e) => setNewSchedule({ ...newSchedule, appointmentDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300 block">
                    {isHindi ? 'परामर्श समय' : 'Appointment Time'} *
                  </label>
                  <input
                    type="time"
                    required
                    value={newSchedule.appointmentTime}
                    onChange={(e) => setNewSchedule({ ...newSchedule, appointmentTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  />
                </div>
              </div>

              {/* Consultation Type Selector */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isHindi ? 'परामर्श का प्रकार (Mode)' : 'Consultation Mode'}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setNewSchedule({ ...newSchedule, type: 'video' })}
                    className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      newSchedule.type === 'video'
                        ? 'bg-purple-500/15 border-purple-500/50 text-purple-700 dark:text-purple-300 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <span>{isHindi ? 'वीडियो परामर्श' : 'Video Consultation'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewSchedule({ ...newSchedule, type: 'in-person' })}
                    className={`p-3 rounded-2xl border text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      newSchedule.type === 'in-person'
                        ? 'bg-blue-500/15 border-blue-500/50 text-blue-700 dark:text-blue-300 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{isHindi ? 'प्रत्यक्ष क्लिनिक मुलाकात' : 'In-Person Clinic Visit'}</span>
                  </button>
                </div>
              </div>

              {/* Clinical Notes / Reason */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isHindi ? 'परामर्श का कारण / क्लीनिकल नोट्स' : 'Clinical Focus / Purpose of Visit'}
                </label>
                <input
                  type="text"
                  value={newSchedule.reason}
                  onChange={(e) => setNewSchedule({ ...newSchedule, reason: e.target.value })}
                  placeholder={
                    isHindi
                      ? 'उदा. कार्डियोवैस्कुलर बीपी ट्रैजेक्टरी फॉलो-अप, यूरिनलिसिस समीक्षा...'
                      : 'e.g. Cardiovascular BP surveillance, urinalysis baseline review...'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                />
              </div>

              {/* Schedule Confirmation Status */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300 block">
                  {isHindi ? 'प्रारंभिक स्थिति (Status)' : 'Initial Schedule Status'}
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs sm:text-sm">
                    <input
                      type="radio"
                      name="scheduleStatus"
                      value="ACCEPTED"
                      checked={newSchedule.status === 'ACCEPTED'}
                      onChange={() => setNewSchedule({ ...newSchedule, status: 'ACCEPTED' })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                      {isHindi ? '✓ स्वीकृत (Confirmed)' : '✓ Accepted (Confirmed)'}
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-xs sm:text-sm">
                    <input
                      type="radio"
                      name="scheduleStatus"
                      value="PENDING"
                      checked={newSchedule.status === 'PENDING'}
                      onChange={() => setNewSchedule({ ...newSchedule, status: 'PENDING' })}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-amber-700 dark:text-amber-400 font-bold">
                      {isHindi ? '⏳ लंबित (Pending Review)' : '⏳ Pending Review'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-blue-600/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  )}
                  <span>{isSubmitting ? (isHindi ? 'सहेज रहे हैं...' : 'Scheduling...') : (isHindi ? 'शेड्यूल जोड़ें' : 'Add to Schedule')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
