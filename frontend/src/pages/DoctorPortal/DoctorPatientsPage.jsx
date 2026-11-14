import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Plus,
  Video,
  FileText,
  Clock,
  Calendar,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown,
  Phone,
  QrCode
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { DoctorService } from '../../services/doctorService';

export default function DoctorPatientsPage() {
  const { doctor } = useDoctorAuth();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const list = DoctorService.getDoctorPatients(doctor?.uid || 'doc_mock_1');
    setPatients(list);
  }, [doctor]);

  const filteredPatients = (patients || []).filter((patient) => {
    const pName = patient.name || patient.patientName || '';
    const pCond = patient.condition || patient.primaryCondition || '';
    const pPhone = patient.phone || '';
    const lastVisit = patient.lastVisit || '';

    const matchesSearch =
      pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pCond.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pPhone.includes(searchTerm);

    if (!matchesSearch) return false;

    if (selectedFilter === 'recent') {
      return lastVisit.includes('Yesterday') || lastVisit.includes('Today') || lastVisit.includes('days');
    }
    if (selectedFilter === 'upcoming') {
      return !!patient.nextFollowUp;
    }
    if (selectedFilter === 'active') {
      return patient.status === 'Under Care' || patient.status === 'Monitoring' || patient.status === 'Active Consultation';
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              Doctor Practice Directory
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            My Authorized Patients
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Patient health vaults accessible through direct consultation consent or QR authorization.
          </p>
        </div>

        <Link
          to="/doctor/scan-qr"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <QrCode className="w-4 h-4" />
          Authorize New Patient (Scan QR)
        </Link>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by patient name, condition, or phone..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Patients' },
            { id: 'recent', label: 'Recent Visits' },
            { id: 'upcoming', label: 'Follow-ups' },
            { id: 'active', label: 'Active Care' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patient List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPatients.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-blue-500/30 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-base flex items-center justify-center">
                    {(p.name || p.patientName || 'P').charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                      {p.name || p.patientName || 'Patient'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {p.age || 42} yrs • {p.gender || 'Male'} • Blood: {p.bloodGroup || 'O+'}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                  {p.status}
                </span>
              </div>

              {/* Patient Info pills */}
              <div className="mt-4 space-y-2">
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-slate-400 text-[11px] block">Primary Concern:</span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{p.condition}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-400 block">Last Consultation:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{p.lastVisit}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-slate-400 block">Next Follow-Up:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{p.nextFollowUp || 'None'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{p.phone}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <Link
                to={`/doctor/patients/${p.id}`}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
              >
                Clinical File <ChevronRight className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-1.5">
                <Link
                  to={`/doctor/video-consultation?patientId=${p.id}&name=${encodeURIComponent(p.name)}`}
                  className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 hover:bg-purple-100 transition-colors"
                  title="Video Call"
                >
                  <Video className="w-4 h-4" />
                </Link>
                <Link
                  to={`/doctor/reports/new?patientId=${p.id}&name=${encodeURIComponent(p.name)}`}
                  className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                  title="Write Report"
                >
                  <FileText className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">No patients found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Try adjusting your search term or scan a patient QR code to add a patient.
          </p>
        </div>
      )}
    </div>
  );
}
