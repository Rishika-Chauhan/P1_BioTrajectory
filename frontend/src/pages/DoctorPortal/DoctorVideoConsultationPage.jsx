
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  MessageSquare,
  User,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Send,
  FileText,
  RefreshCw,
  LockKeyhole,
  Calendar,
} from "lucide-react";

import { useDoctorAuth } from "../../context/DoctorAuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { doctorPatientService } from "../../services/doctorPatientService";

export default function DoctorVideoConsultationPage() {
  const [searchParams] = useSearchParams();
  const { doctor, isVerified } = useDoctorAuth();
  const { isHindi } = useLanguage();

  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(
    searchParams.get("patientId") || ""
  );

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

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
        (data) => {
          setPatients(data);
          setLoading(false);
        },
        (err) => {
          console.error("Video consultation patient roster error:", err);
          setError(
            err?.message || "Unable to load patients."
          );
          setLoading(false);
        }
      );

    return () => unsubscribe?.();
  }, [doctor?.uid]);

  useEffect(() => {
    if (!patients.length) {
      setSelectedPatientId("");
      return;
    }

    const requestedId = searchParams.get("patientId");

    const requestedPatient = patients.find(
      (patient) =>
        patient.id === requestedId ||
        patient.patientId === requestedId
    );

    const existingSelection = patients.find(
      (patient) =>
        patient.id === selectedPatientId ||
        patient.patientId === selectedPatientId
    );

    if (requestedPatient) {
      setSelectedPatientId(requestedPatient.patientId);
    } else if (!existingSelection) {
      setSelectedPatientId(patients[0].patientId);
    }
  }, [patients, searchParams, selectedPatientId]);

  const selectedPatient = useMemo(
    () =>
      patients.find(
        (patient) => patient.patientId === selectedPatientId
      ) || null,
    [patients, selectedPatientId]
  );

  const handleRefresh = async () => {
    if (!doctor?.uid) return;

    setRefreshing(true);
    setError("");

    try {
      const data =
        await doctorPatientService.getDoctorPatients(
          doctor.uid
        );

      setPatients(data);
    } catch (err) {
      console.error("Patient roster refresh failed:", err);
      setError(err?.message || "Unable to refresh patients.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSendMessage = (event) => {
    event.preventDefault();

    if (!newMessage.trim()) return;

    setChatMessages((previous) => [
      ...previous,
      {
        id: `${Date.now()}-${previous.length}`,
        text: newMessage.trim(),
        sender: "doctor",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setNewMessage("");
  };

  const patientName =
    selectedPatient?.name ||
    selectedPatient?.patientName ||
    "Patient";

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
              Video Consultation
            </span>

            {isVerified && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Doctor
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            {isHindi
              ? "वीडियो परामर्श"
              : "Video Consultation"}
          </h1>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isHindi
              ? "अपने अपॉइंटमेंट से जुड़े मरीज चुनें।"
              : "Select a patient associated with your appointments."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || refreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${
              refreshing ? "animate-spin" : ""
            }`}
          />
          {isHindi ? "रिफ्रेश" : "Refresh"}
        </button>
      </div>

      {/* Important integration notice */}
      <div className="rounded-2xl p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />

          <div>
            <h2 className="font-bold text-sm text-amber-900 dark:text-amber-200">
              Video conferencing is not connected yet
            </h2>

            <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 mt-1">
              This page currently provides patient selection and a
              consultation workspace. It does not establish a real
              WebRTC connection, transmit audio/video, create a
              conferencing room, or provide end-to-end encryption.
              Connect a conferencing provider before using it for
              actual consultations.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Patient selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" />
              {isHindi ? "मरीज चुनें" : "Select Patient"}
            </h2>

            <span className="text-xs text-slate-500">
              {loading ? "—" : patients.length}
            </span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-slate-500 text-sm">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              Loading patients...
            </div>
          ) : patients.length === 0 ? (
            <div className="py-8 text-center">
              <User className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                No patients available
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Patients with accepted or completed appointments will
                appear here.
              </p>
              <Link
                to="/doctor/appointments"
                className="inline-block mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Appointments
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {patients.map((patient) => {
                const name =
                  patient.name ||
                  patient.patientName ||
                  "Patient";

                return (
                  <button
                    type="button"
                    key={patient.patientId}
                    onClick={() =>
                      setSelectedPatientId(patient.patientId)
                    }
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      selectedPatientId === patient.patientId
                        ? "bg-blue-50 dark:bg-blue-950/30 border-blue-400 dark:border-blue-700"
                        : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-blue-300"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold shrink-0">
                      {name.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {patient.patientId}
                      </p>
                    </div>

                    {selectedPatientId === patient.patientId && (
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Consultation workspace */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>

              <div>
                <h2 className="font-bold text-slate-900 dark:text-white">
                  {isHindi
                    ? "परामर्श कार्यक्षेत्र"
                    : "Consultation Workspace"}
                </h2>
                <p className="text-xs text-slate-500">
                  {selectedPatient
                    ? patientName
                    : "Select a patient to continue"}
                </p>
              </div>
            </div>

            {!selectedPatient ? (
              <div className="aspect-video rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-center p-6">
                <VideoOff className="w-12 h-12 text-slate-500 mb-3" />
                <p className="text-white font-semibold">
                  No patient selected
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Choose a patient from the list to view the consultation
                  workspace.
                </p>
              </div>
            ) : (
              <>
                <div className="aspect-video rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-center p-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                    {patientName.charAt(0).toUpperCase()}
                  </div>

                  <h3 className="text-white text-lg font-bold mt-4">
                    {patientName}
                  </h3>

                  <p className="text-slate-400 text-sm mt-1">
                    {isHindi
                      ? "वीडियो सेवा कनेक्ट होने की प्रतीक्षा में"
                      : "Waiting for video provider integration"}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 text-xs">
                    <LockKeyhole className="w-3.5 h-3.5" />
                    Video session not connected
                  </span>
                </div>

                {/* Controls are explicitly disabled until real media integration */}
                <div className="flex items-center justify-center gap-3 mt-4">
                  <button
                    type="button"
                    disabled
                    title="Microphone integration is not connected"
                    className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-60 cursor-not-allowed"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    disabled
                    title="Camera integration is not connected"
                    className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-60 cursor-not-allowed"
                  >
                    <Video className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    disabled
                    title="No active call"
                    className="p-3 rounded-xl bg-rose-600 text-white opacity-50 cursor-not-allowed"
                  >
                    <PhoneOff className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Patient appointment details */}
          {selectedPatient && (
            <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Calendar className="w-5 h-5 text-blue-500" />
                {isHindi
                  ? "अपॉइंटमेंट जानकारी"
                  : "Appointment Information"}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">
                    Patient ID
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white break-all">
                    {selectedPatient.patientId}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">
                    Appointment Count
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {selectedPatient.appointmentCount}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">
                    Last Visit
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {selectedPatient.lastVisit}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <p className="text-xs text-slate-500">
                    Next Appointment
                  </p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {selectedPatient.nextFollowUp}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                <Link
                  to={`/doctor/patients/${selectedPatient.id}`}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Patient Details
                </Link>

                <Link
                  to="/doctor/appointments"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Appointments
                </Link>
              </div>
            </div>
          )}

          {/* Consultation notes */}
          <div className="rounded-2xl p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              {isHindi ? "अस्थायी नोट्स" : "Temporary Session Notes"}
            </h3>

            <p className="text-xs text-amber-700 dark:text-amber-400 mb-4">
              These notes exist only in this browser session. They are
              not saved to Firestore and are not a medical record.
            </p>

            <div className="space-y-3 max-h-52 overflow-y-auto">
              {chatMessages.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-5">
                  No messages in this temporary session.
                </p>
              ) : (
                chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800"
                  >
                    <div className="flex justify-between gap-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {message.sender === "doctor"
                          ? "Doctor"
                          : "Patient"}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {message.time}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                      {message.text}
                    </p>
                  </div>
                ))
              )}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="flex gap-2 mt-4"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(event) =>
                  setNewMessage(event.target.value)
                }
                placeholder="Write a temporary note..."
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-4 py-2.5 rounded-xl bg-blue-600 text-white disabled:opacity-50"
                title="Add temporary note"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
