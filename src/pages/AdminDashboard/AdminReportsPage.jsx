import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { SYSTEM_WEBSITE_REPORTS } from '../../data/adminData';

export default function AdminReportsPage() {
  const [reports, setReports] = useState(SYSTEM_WEBSITE_REPORTS);

  const toggleStatus = (id) => {
    setReports(reports.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status: r.status === 'Resolved' ? 'In Review' : 'Resolved'
        };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Website & System Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor bug tickets, optical strip scanner calibration issues, and client feedback
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-[#101827] border border-slate-800 shadow-sm space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Title & Context</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Submitted Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {reports.map(rep => (
                <tr key={rep.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-4 font-mono text-slate-400">{rep.id}</td>
                  <td className="py-3 px-4 text-purple-400 font-bold">{rep.type}</td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-white">{rep.title}</p>
                    <p className="text-[11px] text-slate-400">{rep.notes}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rep.priority === 'High' ? 'text-red-400 bg-red-500/10' : 'text-cyan-400 bg-cyan-500/10'
                    }`}>
                      {rep.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{rep.submittedDate}</td>
                  <td className="py-3 px-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      rep.status === 'Resolved' ? 'text-emerald-400 bg-emerald-500/10' : 'text-amber-400 bg-amber-500/10'
                    }`}>
                      {rep.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toggleStatus(rep.id)}
                      className="px-2.5 py-1 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 text-xs"
                    >
                      {rep.status === 'Resolved' ? 'Reopen' : 'Mark Resolved'}
                    </button>
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
