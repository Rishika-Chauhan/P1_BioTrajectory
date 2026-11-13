import React, { useState } from 'react';
import { ShieldCheck, Clock3, CheckCircle2, XCircle, Search, ShieldAlert } from 'lucide-react';

const initialApplications = [
  { id: 'doc-1024', name: 'Dr. Neha Iyer', specialty: 'Endocrinology', license: 'MCI-88213', status: 'Pending review', risk: 'Low' },
  { id: 'doc-1041', name: 'Dr. Aaron Cole', specialty: 'Family Medicine', license: 'MCI-11920', status: 'Pending review', risk: 'Medium' },
  { id: 'doc-1089', name: 'Dr. Sofia Martins', specialty: 'Cardiology', license: 'MCI-43244', status: 'Approved', risk: 'Low' },
  { id: 'doc-1102', name: 'Dr. Lucas Bennett', specialty: 'Neurology', license: 'MCI-65091', status: 'Needs info', risk: 'Medium' }
];

export default function AdminDoctorVerificationPage() {
  const [applications, setApplications] = useState(initialApplications);
  const [search, setSearch] = useState('');

  const updateStatus = (id, nextStatus) => {
    setApplications((prev) => prev.map((item) => item.id === id ? { ...item, status: nextStatus } : item));
  };

  const filtered = applications.filter((item) => {
    const term = search.toLowerCase();
    return !term || item.name.toLowerCase().includes(term) || item.specialty.toLowerCase().includes(term) || item.license.toLowerCase().includes(term);
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Doctor Verification & Credential Review
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Verify medical licenses, board certification, and clinician eligibility before granting practice access.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[#101827] border border-slate-800 p-5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs uppercase tracking-wider">Pending</span>
            <Clock3 className="w-4 h-4 text-amber-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">{applications.filter((item) => item.status === 'Pending review').length}</p>
        </div>
        <div className="rounded-2xl bg-[#101827] border border-slate-800 p-5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs uppercase tracking-wider">Approved</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">{applications.filter((item) => item.status === 'Approved').length}</p>
        </div>
        <div className="rounded-2xl bg-[#101827] border border-slate-800 p-5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-xs uppercase tracking-wider">Needs info</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <p className="mt-3 text-3xl font-extrabold text-white">{applications.filter((item) => item.status === 'Needs info').length}</p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#101827] border border-slate-800 p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctor, specialty, or license..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070B14] border border-slate-800 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
      </div>

      <div className="rounded-3xl bg-[#101827] border border-slate-800 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-4">Applicant</th>
                <th className="py-3 px-4">Specialty</th>
                <th className="py-3 px-4">License</th>
                <th className="py-3 px-4">Risk</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((application) => (
                <tr key={application.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-white">{application.name}</p>
                    <p className="text-[11px] text-slate-400">{application.id}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{application.specialty}</td>
                  <td className="py-3 px-4 font-mono text-slate-400">{application.license}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${application.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {application.risk}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${application.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400' : application.status === 'Needs info' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {application.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => updateStatus(application.id, 'Approved')} className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 px-2.5 py-1.5 text-[10px] font-semibold">
                        <CheckCircle2 className="w-3 h-3" /> Approve
                      </button>
                      <button onClick={() => updateStatus(application.id, 'Needs info')} className="inline-flex items-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 px-2.5 py-1.5 text-[10px] font-semibold">
                        <XCircle className="w-3 h-3" /> Request info
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
