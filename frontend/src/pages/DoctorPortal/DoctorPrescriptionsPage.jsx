import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Pill,
  PlusCircle,
  Search,
  CheckCircle2,
  Calendar,
  Printer,
  Eye,
  ShieldCheck,
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { DoctorService } from '../../services/doctorService';

export default function DoctorPrescriptionsPage() {
  const { doctor } = useDoctorAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRx, setSelectedRx] = useState(null);

  useEffect(() => {
    const list = DoctorService.getDoctorPrescriptions(doctor?.uid || 'doc_mock_1') || [];
    setPrescriptions(list);
  }, [doctor]);

  const filteredRx = (prescriptions || []).filter(
    (rx) => {
      const pName = rx.patientName || '';
      const matchesPatient = pName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMed = rx.medicines?.some((m) => (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesPatient || matchesMed;
    }
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300">
              Pharmacotherapy Management
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Prescriptions Archive
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Verified electronic prescriptions with patient-friendly dosage schedules.
          </p>
        </div>

        <Link
          to="/doctor/prescriptions/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Issue New Prescription
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by patient name or medication..."
          className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Prescriptions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRx.map((rx) => (
          <div
            key={rx.id}
            className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-teal-500/30 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    {rx.id}
                  </span>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base mt-0.5">
                    {rx.patientName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Date: {rx.createdAt}
                  </p>
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Signed
                </span>
              </div>

              {/* Medicines Summary */}
              <div className="mt-4 space-y-2">
                <span className="text-slate-400 text-xs font-semibold block">Prescribed Medicines:</span>
                {rx.medicines?.map((med, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200">
                      <span>{med.name} {med.strength}</span>
                      <span className="text-teal-600 dark:text-teal-400 font-normal">{med.frequency}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{med.instructions} • {med.duration}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedRx(rx)}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> View Prescription & Schedule
              </button>

              <span className="text-[11px] text-slate-400">
                Dr. {rx.doctorName || doctor?.fullName || 'Practitioner'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Prescription Preview Modal */}
      {selectedRx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-teal-600 dark:text-teal-400 font-bold">
                  Official Medical Prescription (Rx)
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  BioTrajectory Tele-Clinic
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 text-xs flex items-center gap-1"
                >
                  <Printer className="w-4 h-4" /> Print
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRx(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Doctor & Patient Information Header */}
            <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Dr. {selectedRx.doctorName || doctor?.fullName || 'Practitioner'}</p>
                <p className="text-slate-500">Reg: {doctor?.regNumber || 'MCI-84729-A'}</p>
                <p className="text-slate-500">{doctor?.clinicName || 'BioTrajectory Specialty Center'}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900 dark:text-white">Patient: {selectedRx.patientName}</p>
                <p className="text-slate-500">Prescription Date: {selectedRx.createdAt}</p>
              </div>
            </div>

            {/* Medicines Detailed Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Prescribed Pharmacotherapy (Rx)
              </h4>
              <div className="space-y-2">
                {selectedRx.medicines?.map((m, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <strong className="text-slate-900 dark:text-white text-sm">{m.name} {m.strength}</strong>
                      <p className="text-slate-500 mt-0.5">{m.instructions}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-teal-600 dark:text-teal-400">{m.frequency}</span>
                      <p className="text-slate-400 text-[11px]">{m.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Medicine Schedule Card */}
            <div className="rounded-xl p-4 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-800/60">
              <div className="flex items-center gap-2 text-teal-800 dark:text-teal-300 text-xs font-bold mb-2">
                <Sparkles className="w-4 h-4" />
                Plain Language Patient Schedule Card
              </div>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Morning</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">1 Tablet</span>
                  <span className="text-[10px] text-teal-600 block">After Breakfast</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Afternoon</span>
                  <span className="font-bold text-slate-400 dark:text-slate-500">—</span>
                  <span className="text-[10px] text-slate-400 block">No Dose</span>
                </div>
                <div className="p-2 rounded-lg bg-white dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Night</span>
                  <span className="font-bold text-slate-400 dark:text-slate-500">—</span>
                  <span className="text-[10px] text-slate-400 block">No Dose</span>
                </div>
              </div>
            </div>

            {/* Instructions & Signature */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <p className="text-slate-500">
                Diet: Low salt intake. Next review in 2 weeks.
              </p>
              <div className="text-right">
                <span className="font-bold font-mono text-slate-900 dark:text-white">
                  Dr. {selectedRx.doctorName || doctor?.fullName || 'Practitioner'}
                </span>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                  <ShieldCheck className="w-3.5 h-3.5" /> Digitally Signed
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
