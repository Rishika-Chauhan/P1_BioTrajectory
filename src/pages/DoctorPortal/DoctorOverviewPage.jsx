import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Calendar,
  Video,
  FileText,
  Clock,
  QrCode,
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Search,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Stethoscope,
  ShieldCheck,
  BellRing
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { DoctorService } from '../../services/doctorService';

export default function DoctorOverviewPage() {
  const { doctor, isVerified, doctorRole } = useDoctorAuth();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load doctor data safely
    try {
      const doctorUid = doctor?.uid || 'doc_mock_1';
      const patientList = DoctorService.getDoctorPatients(doctorUid) || [];
      const appointmentList = DoctorService.getDoctorAppointments(doctorUid) || [];
      const reportList = DoctorService.getDoctorReports(doctorUid) || [];

      setPatients(patientList);
      setAppointments(appointmentList);
      setReports(reportList);
    } catch (err) {
      console.warn('Error fetching doctor practice records', err);
      setPatients([]);
      setAppointments([]);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [doctor]);

  const todayAppointments = (appointments || []).filter(a => a.date === 'Today' || a.date === new Date().toISOString().split('T')[0]);
  const videoCalls = (appointments || []).filter(a => a.type === 'video' && a.status === 'confirmed');
  const pendingReports = (reports || []).filter(r => r.status === 'draft');

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="rounded-2xl p-6 md:p-8 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-transparent border border-blue-500/20 dark:border-blue-500/10 backdrop-blur-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                Doctor Practice Portal
              </span>
              {isVerified ? (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Practitioner
                </span>
              ) : (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Verification Pending
                </span>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
              Welcome back, Dr. {doctor?.fullName || 'Practitioner'}
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base mt-1">
              {doctor?.specialization || 'General Physician'} • {doctor?.clinicName || 'BioTrajectory Health Network'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/doctor/scan-qr"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium text-sm shadow-md hover:shadow-lg transition-all"
            >
              <QrCode className="w-4 h-4" />
              Scan Patient QR
            </Link>
            <Link
              to="/doctor/reports/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white dark:text-slate-100 text-sm font-medium border border-slate-700/50 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              New Report
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl p-5 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Active
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Patients</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{patients.length}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Registered to your clinic</span>
            <Link to="/doctor/patients" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400">
              Today
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Today's Schedule</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {todayAppointments.length > 0 ? todayAppointments.length : 3}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>2 in-person, 1 video</span>
            <Link to="/doctor/appointments" className="text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-0.5">
              Schedule <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Video className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400">
              Telemedicine
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Upcoming Video Calls</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {videoCalls.length > 0 ? videoCalls.length : 2}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Next at 11:30 AM</span>
            <Link to="/doctor/video-consultation" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5">
              Call room <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400">
              Action Needed
            </span>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Reports</p>
            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {pendingReports.length > 0 ? pendingReports.length : 1}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Awaiting signature</span>
            <Link to="/doctor/reports" className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5">
              Review <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Schedule & Quick Clinical Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Today's Schedule & Consultations (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today's Schedule Card */}
          <div className="rounded-2xl p-6 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  Today's Consultation Schedule
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <Link
                to="/doctor/appointments"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Full Calendar <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {appointments.slice(0, 3).map((apt, idx) => (
                <div
                  key={apt.id || idx}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold flex items-center justify-center text-sm shrink-0">
                      {apt.patientName ? apt.patientName.charAt(0) : 'P'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                          {apt.patientName}
                        </h3>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                          apt.type === 'video'
                            ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                            : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                        }`}>
                          {apt.type === 'video' ? 'Video Call' : 'In-Person'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Reason: {apt.reason || 'General Follow-up'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {apt.time || '10:30 AM'}
                    </div>

                    {apt.type === 'video' ? (
                      <Link
                        to={`/doctor/video-consultation?patientId=${apt.patientId}&name=${encodeURIComponent(apt.patientName)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join Call
                      </Link>
                    ) : (
                      <Link
                        to={`/doctor/reports/new?patientId=${apt.patientId}&name=${encodeURIComponent(apt.patientName)}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-medium transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        Start Consult
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Patient Consultations */}
          <div className="rounded-2xl p-6 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-teal-500" />
                  Recent Patient Records & Consultations
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Authorized patients within your clinical care circle
                </p>
              </div>
              <Link
                to="/doctor/patients"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                View Directory <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <th className="pb-3 font-semibold">Patient</th>
                    <th className="pb-3 font-semibold">Condition</th>
                    <th className="pb-3 font-semibold">Last Visit</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {(patients || []).slice(0, 4).map((p, idx) => {
                    const patientName = p.name || p.patientName || 'Patient';
                    const condition = p.condition || p.primaryCondition || 'General Consultation';
                    const lastVisit = p.lastVisit || p.lastConsultationAt || 'Recent';
                    const status = p.status || p.currentStatus || 'Under Care';
                    const initial = patientName.charAt(0) || 'P';

                    return (
                      <tr key={p.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                              {initial}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white text-xs">{patientName}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">{p.age || 42}y • {p.gender || 'Male'} • {p.bloodGroup || 'O+'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                            {condition}
                          </span>
                        </td>
                        <td className="py-3 text-xs text-slate-600 dark:text-slate-400">
                          {lastVisit}
                        </td>
                        <td className="py-3">
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                            {status}
                          </span>
                        </td>
                      <td className="py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/doctor/patients/${p.id}`}
                            className="p-1 rounded-md text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Patient File"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Follow-up Reminders & Pending Reports (1 col) */}
        <div className="space-y-8">
          {/* Pending Consultation Reports */}
          <div className="rounded-2xl p-6 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-500" />
                Reports Awaiting Signature
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-semibold">
                {reports.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Reports finalized with your digital registration number become visible to the patient.
            </p>

            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white text-xs">{rep.patientName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{rep.diagnosis}</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                      {rep.status}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 dark:border-slate-800">
                    <span className="text-slate-400 text-[11px]">{rep.createdAt}</span>
                    <Link
                      to={`/doctor/reports`}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-[11px]"
                    >
                      Complete & Sign →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Follow-up Reminders Card */}
          <div className="rounded-2xl p-6 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BellRing className="w-4 h-4 text-cyan-500" />
                Follow-up Reminders
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Patients scheduled for clinical review this week:
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-cyan-50/50 dark:bg-cyan-950/20 border border-cyan-200/50 dark:border-cyan-800/40">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-cyan-900 dark:text-cyan-200">Rahul Sharma</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300">Tomorrow</span>
                </div>
                <p className="text-[11px] text-cyan-700 dark:text-cyan-400 mt-1">Review BP readings after 2 weeks of Telmisartan 40mg</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">Ananya Roy</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">3 days</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Check post-antibiotic recovery & liver function test</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-200">Vikram Malhotra</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">Next Monday</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Post-bronchoscopy assessment & inhaler technique review</p>
              </div>
            </div>
          </div>

          {/* Quick Doctor Knowledge Base link */}
          <div className="rounded-2xl p-5 bg-gradient-to-br from-blue-900/10 to-indigo-900/10 border border-blue-500/20">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-blue-500" />
              Clinical Disease Guidelines
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Access 35 standard diagnostic & therapeutic protocols tailored for verified doctors.
            </p>
            <Link
              to="/doctor/explore"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Open Clinical Guide <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
