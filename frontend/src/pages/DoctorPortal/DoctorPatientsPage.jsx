
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Search,
  Video,
  FileText,
  ChevronRight,
  Phone,
  QrCode,
  RefreshCw,
  Calendar,
  Clock,
  AlertCircle,
} from "lucide-react";

import { useDoctorAuth } from "../../context/DoctorAuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { doctorPatientService } from "../../services/doctorPatientService";

export default function DoctorPatientsPage() {
  const { doctor } = useDoctorAuth();
  const { t, isHindi } = useLanguage();

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!doctor?.uid) {
      setPatients([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const unsubscribe =
      doctorPatientService.subscribeToDoctorPatients(
        doctor.uid,
        (patientList) => {
          setPatients(patientList);
          setLoading(false);
          setError("");
        },
        (err) => {
          console.error("Unable to load doctor patients:", err);
          setError(
            err?.message ||
              "Unable to load the patient list."
          );
          setLoading(false);
        }
      );

    return () => unsubscribe?.();
  }, [doctor?.uid]);

  const handleManualRefresh = async () => {
    if (!doctor?.uid) return;

    setIsRefreshing(true);
    setError("");

    try {
      const patientList =
        await doctorPatientService.getDoctorPatients(
          doctor.uid
        );

      setPatients(patientList);
    } catch (err) {
      console.error("Patient roster refresh failed:", err);
      setError(
        err?.message ||
          "Unable to refresh the patient list."
      );
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredPatients = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return patients
      .filter((patient) => {
        const name = (
          patient.name ||
          patient.patientName ||
          ""
        ).toLowerCase();

        const id = String(patient.patientId || "").toLowerCase();

        const matchesSearch =
          !term ||
          name.includes(term) ||
          id.includes(term);

        if (!matchesSearch) return false;

        if (selectedFilter === "recent") {
          return patient.hasRecentVisit;
        }

        if (selectedFilter === "upcoming") {
          return patient.hasUpcomingAppointment;
        }

        if (selectedFilter === "active") {
          return patient.hasActiveAppointment;
        }

        return true;
      })
      .sort((a, b) => {
        const aUpcoming = a.hasUpcomingAppointment ? 1 : 0;
        const bUpcoming = b.hasUpcomingAppointment ? 1 : 0;

        return (
          bUpcoming - aUpcoming ||
          (a.name || "").localeCompare(b.name || "")
        );
      });
  }, [patients, searchTerm, selectedFilter]);

  const filters = [
    {
      id: "all",
      label: t("doctor.filterAll", {}, "All Patients"),
    },
    {
      id: "recent",
      label: t("doctor.filterRecent", {}, "Recent Visits"),
    },
    {
      id: "upcoming",
      label: t("doctor.filterUpcoming", {}, "Upcoming Appointments"),
    },
    {
      id: "active",
      label: t("doctor.filterActive", {}, "Active Appointments"),
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              {t(
                "doctor.patientDirectory",
                {},
                "Doctor Practice Directory"
              )}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t(
              "doctor.authorizedPatients",
              {},
              "My Patients"
            )}
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1.5">
            {isHindi
              ? "आपकी स्वीकृत और पूर्ण अपॉइंटमेंट से जुड़े मरीज।"
              : "Patients with accepted or completed appointments assigned to you."}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || !doctor?.uid}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm shadow-xs hover:border-blue-500 cursor-pointer active:scale-95 transition-all disabled:opacity-60"
            title={
              isHindi
                ? "मरीज सूची रिफ्रेश करें"
                : "Refresh Patient Roster"
            }
          >
            <RefreshCw
              className={`w-4 h-4 ${
                isRefreshing
                  ? "animate-spin text-blue-500"
                  : ""
              }`}
            />
            <span>
              {isRefreshing
                ? isHindi
                  ? "रिफ्रेश..."
                  : "Refreshing..."
                : isHindi
                  ? "रिफ्रेश"
                  : "Refresh"}
            </span>
          </button>

          <Link
            to="/doctor/scan-qr"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <QrCode className="w-5 h-5" />
            {t(
              "doctor.authorizeNewPatient",
              {},
              "Authorize New Patient (Scan QR)"
            )}
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder={
              isHindi
                ? "नाम या मरीज ID से खोजें..."
                : "Search by patient name or patient ID..."
            }
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {filters.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-sm">
              {isHindi
                ? "मरीज सूची लोड नहीं हुई"
                : "Unable to load patients"}
            </p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {isHindi
              ? "मरीज लोड हो रहे हैं..."
              : "Loading patients..."}
          </p>
        </div>
      )}

      {/* Patient Cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => {
            const patientName =
              patient.name ||
              patient.patientName ||
              "Patient";

            return (
              <div
                key={patient.id}
                className="rounded-3xl p-6 shadow-sm transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40"
              >
                <div>
                  {/* Patient identity */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden font-bold text-lg flex items-center justify-center shrink-0 shadow-sm bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {patient.avatar ? (
                          <img
                            src={patient.avatar}
                            alt={patientName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          patientName.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg truncate">
                          {patientName}
                        </h3>

                        <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                          {isHindi ? "मरीज ID" : "Patient ID"}:{" "}
                          {patient.patientId}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] sm:text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shrink-0 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                      {patient.status}
                    </span>
                  </div>

                  {/* Appointment information */}
                  <div className="mt-5 space-y-3">
                    <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-extrabold uppercase tracking-wide block mb-1 text-slate-400">
                        {isHindi
                          ? "कुल अपॉइंटमेंट"
                          : "Total Appointments"}
                      </span>

                      <span className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                        {patient.appointmentCount}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 font-medium block text-xs">
                          {isHindi
                            ? "अंतिम विज़िट"
                            : "Last Visit"}
                        </span>

                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {patient.lastVisit}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                        <span className="text-slate-400 font-medium block text-xs">
                          {isHindi
                            ? "अगली अपॉइंटमेंट"
                            : "Next Appointment"}
                        </span>

                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {patient.nextFollowUp}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1 font-medium">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        {patient.hasUpcomingAppointment
                          ? isHindi
                            ? "आगामी अपॉइंटमेंट निर्धारित है"
                            : "Upcoming appointment scheduled"
                          : isHindi
                            ? "कोई आगामी अपॉइंटमेंट नहीं"
                            : "No upcoming appointment"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        {isHindi
                          ? "अपॉइंटमेंट इतिहास उपलब्ध"
                          : "Appointment history available"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Link
                    to={`/doctor/patients/${patient.id}`}
                    className="text-xs sm:text-sm font-extrabold hover:underline flex items-center gap-1 text-blue-600 dark:text-blue-400"
                  >
                    <span>
                      {isHindi
                        ? "मरीज विवरण"
                        : "Patient Details"}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/doctor/video-consultation?patientId=${patient.id}&name=${encodeURIComponent(patientName)}`}
                      className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 hover:bg-purple-100 transition-colors"
                      title={
                        isHindi
                          ? "वीडियो परामर्श"
                          : "Video Consultation"
                      }
                    >
                      <Video className="w-4 h-4" />
                    </Link>

                    <Link
                      to={`/doctor/reports/new?patientId=${patient.id}&name=${encodeURIComponent(patientName)}`}
                      className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                      title={
                        isHindi
                          ? "रिपोर्ट लिखें"
                          : "Write Report"
                      }
                    >
                      <FileText className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {!loading && filteredPatients.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />

          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            {t(
              "doctor.noPatientsFound",
              {},
              "No patients found"
            )}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {searchTerm
              ? isHindi
                ? "अपनी खोज बदलकर दोबारा प्रयास करें।"
                : "Try adjusting your search term."
              : isHindi
                ? "स्वीकृत या पूर्ण अपॉइंटमेंट वाले मरीज यहां दिखाई देंगे।"
                : "Patients with accepted or completed appointments will appear here."}
          </p>
        </div>
      )}
    </div>
  );
}
