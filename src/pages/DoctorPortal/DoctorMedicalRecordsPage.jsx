import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Pill,
  Calendar,
  FolderOpen,
  ShieldCheck,
  ArrowRight,
  Activity,
  Stethoscope
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { DoctorService } from '../../services/doctorService';

export default function DoctorMedicalRecordsPage() {
  const { doctor } = useDoctorAuth();
  const [patients, setPatients] = useState([]);
  const [reports, setReports] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const doctorUid = doctor?.uid || 'doc_mock_1';
    setPatients(DoctorService.getDoctorPatients(doctorUid));
    setReports(DoctorService.getDoctorReports(doctorUid));
    setPrescriptions(DoctorService.getDoctorPrescriptions(doctorUid));
  }, [doctor]);

  const summaryCards = [
    {
      label: 'Active Patients',
      value: patients.length,
      detail: 'Authorized access',
      icon: FolderOpen,
      accent: 'blue'
    },
    {
      label: 'Signed Reports',
      value: reports.length,
      detail: 'Finalized in this cycle',
      icon: FileText,
      accent: 'cyan'
    },
    {
      label: 'Active Prescriptions',
      value: prescriptions.length,
      detail: 'Current treatment plans',
      icon: Pill,
      accent: 'emerald'
    },
    {
      label: 'Next Follow-up',
      value: '3 cases',
      detail: 'Within 7 days',
      icon: Calendar,
      accent: 'purple'
    }
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              Clinical Records
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
              <ShieldCheck className="w-3 h-3" /> Privacy Protected
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Medical Records & Care Summary
          </h1>
        </div>
        <Link
          to="/doctor/reports"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-slate-800 text-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-800 transition"
        >
          Review Reports
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryCards.map(({ label, value, detail, icon: Icon, accent }) => (
          <div key={label} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                accent === 'blue' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' :
                accent === 'cyan' ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/40 dark:text-cyan-300' :
                accent === 'emerald' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300' :
                'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{detail}</span>
            </div>

            <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent patient summaries</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">Updated today</span>
          </div>

          <div className="space-y-3">
            {patients.slice(0, 4).map((patient) => (
              <div key={patient.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">{patient.patientName || patient.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{patient.primaryCondition || patient.condition}</p>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                    {patient.status}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="rounded-lg bg-white dark:bg-slate-900/60 p-2">
                    <div className="text-slate-400 dark:text-slate-500">Last visit</div>
                    <div className="font-semibold mt-1">{patient.lastVisit || patient.lastConsultationAt}</div>
                  </div>
                  <div className="rounded-lg bg-white dark:bg-slate-900/60 p-2">
                    <div className="text-slate-400 dark:text-slate-500">Follow-up</div>
                    <div className="font-semibold mt-1">{patient.nextFollowUp || patient.nextFollowUpAt}</div>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <Link
                    to={`/doctor/patients/${patient.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Open record <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Latest care actions</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">Clinical timeline</span>
          </div>

          <div className="space-y-3">
            {reports.slice(0, 3).map((report) => (
              <div key={report.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-300 flex items-center justify-center">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{report.patientName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{report.createdAt}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">Signed</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{report.diagnosis || 'Clinical assessment recorded'}</p>
              </div>
            ))}

            {prescriptions.slice(0, 2).map((prescription) => (
              <div key={prescription.id} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
                      <Pill className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{prescription.patientName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{prescription.createdAt}</p>
                    </div>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">Active</span>
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                  {prescription.medicines?.length || 0} prescription item{(prescription.medicines?.length || 0) === 1 ? '' : 's'} recorded.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-300">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Clinical record status</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              All shared records remain patient-consented and are limited to users with direct clinical authorization. The portal does not expose full private histories to non-authorized roles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
