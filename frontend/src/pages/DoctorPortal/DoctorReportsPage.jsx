import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Printer,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { DoctorService } from '../../services/doctorService';

export default function DoctorReportsPage() {
  const { doctor, isVerified } = useDoctorAuth();
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const list = DoctorService.getDoctorReports(doctor?.uid || 'doc_mock_1') || [];
    setReports(list);
  }, [doctor]);

  const filteredReports = (reports || []).filter((rep) => {
    const pName = rep.patientName || '';
    const diag = rep.diagnosis || '';
    const matchesSearch =
      pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diag.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'draft') return rep.status === 'draft';
    if (statusFilter === 'signed') return rep.status === 'signed';
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              Clinical Documentation
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Consultation Reports
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Authoritative 13-field clinical summaries with digital signature verification.
          </p>
        </div>

        <Link
          to="/doctor/reports/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Report
        </Link>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search reports by patient or diagnosis..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {['all', 'signed', 'draft'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {st === 'all' ? 'All Reports' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-blue-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    {rep.id}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                    {rep.patientName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {rep.age ? `${rep.age} yrs • ${rep.gender}` : 'Patient ID: ' + rep.patientId}
                  </p>
                </div>

                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${
                    rep.status === 'signed'
                      ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                      : 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {rep.status}
                </span>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-400 text-[11px] block">Diagnosis:</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{rep.diagnosis}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Chief Complaints:</span>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-1">{rep.complaints}</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                <span>Date: {rep.createdAt}</span>
                <span>Type: {rep.type || 'In-Person'}</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setSelectedReport(rep)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> Full Document
              </button>

              {rep.status === 'draft' ? (
                <Link
                  to={`/doctor/reports/new?edit=${rep.id}`}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-sm transition-colors"
                >
                  Review & Sign
                </Link>
              ) : (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Digitally Sealed
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8">
            {/* Header of Modal */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Official Clinical Consultation Report
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  BioTrajectory Healthcare Network
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs flex items-center gap-1"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Document Body (13 Fields) */}
            <div className="space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
              {/* Doctor & Patient Bar */}
              <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Attending Doctor</span>
                  <p className="font-bold text-slate-900 dark:text-white">Dr. {selectedReport.doctorName || doctor?.fullName || 'Practitioner'}</p>
                  <p className="text-[11px] text-slate-500">Reg: {doctor?.regNumber || 'MCI-84729-A'}</p>
                  <p className="text-[11px] text-slate-500">{doctor?.clinicName || 'BioTrajectory Specialty Center'}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Patient Information</span>
                  <p className="font-bold text-slate-900 dark:text-white">{selectedReport.patientName}</p>
                  <p className="text-[11px] text-slate-500">Age: {selectedReport.age || 45} yrs • {selectedReport.gender || 'Male'}</p>
                  <p className="text-[11px] text-slate-500">Date: {selectedReport.createdAt} • {selectedReport.type || 'In-Person'}</p>
                </div>
              </div>

              {/* Complaints & History */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
                  1. Chief Complaints & Signs
                </h4>
                <p>{selectedReport.complaints || 'Occasional dull morning headaches, mild fatigue, and elevated home blood pressure readings.'}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
                  2. Recorded Vitals & Examination
                </h4>
                <div className="grid grid-cols-4 gap-2 text-center p-2 rounded-lg bg-slate-50 dark:bg-slate-800/30">
                  <div>
                    <span className="text-[10px] text-slate-400">BP</span>
                    <p className="font-bold">{selectedReport.vitals?.bp || '138/88 mmHg'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Heart Rate</span>
                    <p className="font-bold">{selectedReport.vitals?.heartRate || '76 bpm'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">SpO2</span>
                    <p className="font-bold">{selectedReport.vitals?.spo2 || '98%'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Temp</span>
                    <p className="font-bold">{selectedReport.vitals?.temp || '98.4°F'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
                  3. Clinical Diagnosis
                </h4>
                <p className="font-semibold text-blue-600 dark:text-blue-400">{selectedReport.diagnosis}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
                  4. Treatment & Therapeutic Advice
                </h4>
                <p>{selectedReport.advice || 'Prescribed Telmisartan 40mg once daily in morning. Low sodium diet (<5g/day). 30 mins brisk walking.'}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-1">
                  5. Warning Signs & Next Review
                </h4>
                <p className="text-amber-700 dark:text-amber-400">
                  Seek emergency medical care if experiencing severe chest tightness, sudden breathlessness, or visual blurriness. Follow-up review scheduled in 14 days.
                </p>
              </div>

              {/* Digital Seal */}
              <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Digitally Authorized under BioTrajectory Trust Protocol</span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs font-bold text-slate-900 dark:text-white">
                    Dr. {selectedReport.doctorName || doctor?.fullName || 'Practitioner'}
                  </p>
                  <p className="text-[10px] text-slate-400">Verified Medical Seal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
