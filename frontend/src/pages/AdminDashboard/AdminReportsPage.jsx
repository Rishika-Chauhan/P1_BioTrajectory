import React, { useState, useMemo } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Filter,
  ShieldAlert,
  Cpu,
  Smartphone,
  ExternalLink,
  ChevronRight,
  X,
  FileCode,
  Check,
  Send,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { SYSTEM_WEBSITE_REPORTS } from '../../data/adminData';
import { useLanguage } from '../../context/LanguageContext';

const EXTENDED_SYSTEM_REPORTS = [
  ...SYSTEM_WEBSITE_REPORTS,
  {
    id: 'rep_104',
    type: 'Optical Calibration',
    priority: 'High',
    status: 'In Review',
    submittedDate: '2026-11-18',
    title: 'Warm tungsten incandescent lighting creates 8% yellow shift on urine leukocyte pad',
    reporter: 'Dr. Sarah Mitchell (Internal Audit)',
    device: 'iOS 18 Safari & Android 15 Chrome',
    notes: 'Computer vision colorimetry model needs auto white-balance matrix adjustment for domestic warm lighting.',
    resolutionNotes: 'Testing updated OpenCV CLAHE histogram equalization patch.'
  },
  {
    id: 'rep_105',
    type: 'WebRTC Signaling',
    priority: 'Medium',
    status: 'In Review',
    submittedDate: '2026-11-17',
    title: 'STUN/TURN fallback latency jitter during doctor multi-hop NAT traversal',
    reporter: 'Internal Infrastructure Telemetry',
    device: 'Linux / Kubernetes Ingress',
    notes: 'Packet loss elevated to 1.4% on certain residential symmetric NAT gateways. Falling back to TURN relay.',
    resolutionNotes: 'Deployed additional European & Asian relay nodes.'
  },
  {
    id: 'rep_106',
    type: 'Bluetooth Sync',
    priority: 'Low',
    status: 'Resolved',
    submittedDate: '2026-11-14',
    title: 'Omron BP7000 Bluetooth LE GATT characteristic 0x2A35 parsing exception',
    reporter: 'usr_88291 (Pranjal Sharma)',
    device: 'Chromium Web Bluetooth API',
    notes: 'Hex offset was reading cuff inflation status as pulse rate in rare firmware v2.1 units.',
    resolutionNotes: 'Resolved in frontend bluetoothService.js v2.4 parser release.'
  }
];

export default function AdminReportsPage() {
  const { isHindi } = useLanguage();
  const [reports, setReports] = useState(EXTENDED_SYSTEM_REPORTS);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedReport, setSelectedReport] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [newNoteInput, setNewNoteInput] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 450));
    setReports([...EXTENDED_SYSTEM_REPORTS]);
    setIsRefreshing(false);
    showToast(isHindi ? 'रिपोर्ट सूची रीफ्रेश हुई।' : 'System diagnostic reports refreshed.');
  };

  const toggleStatus = (id) => {
    setReports(reports.map(r => {
      if (r.id === id) {
        const next = r.status === 'Resolved' ? 'In Review' : 'Resolved';
        showToast(`Report ${r.id} marked as ${next}.`);
        return { ...r, status: next };
      }
      return r;
    }));
  };

  const handleUpdateNotes = (e) => {
    e.preventDefault();
    if (!selectedReport) return;
    setReports(reports.map(r => {
      if (r.id === selectedReport.id) {
        return {
          ...r,
          resolutionNotes: newNoteInput
        };
      }
      return r;
    }));
    showToast(isHindi ? 'निवारण नोट सहेजा गया।' : 'Resolution log updated.');
    setSelectedReport(prev => ({ ...prev, resolutionNotes: newNoteInput }));
    setNewNoteInput('');
  };

  const filteredReports = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return reports.filter(r => {
      const matchSearch = !q ||
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q));

      const matchPriority = priorityFilter === 'ALL' || r.priority === priorityFilter;
      const matchType = typeFilter === 'ALL' || r.type === typeFilter;
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;

      return matchSearch && matchPriority && matchType && matchStatus;
    });
  }, [reports, searchQuery, priorityFilter, typeFilter, statusFilter]);

  const openTicketsCount = reports.filter(r => r.status !== 'Resolved').length;
  const highPriorityCount = reports.filter(r => r.priority === 'High' && r.status !== 'Resolved').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-600 text-white font-bold text-sm shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>{isHindi ? 'सिस्टम एवं हार्डवेयर टिकट्स' : 'Hardware, Optical & System Diagnostics'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isHindi ? 'वेबसाइट एवं सिस्टम रिपोर्ट्स' : 'Website & System Bug Tracking'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {isHindi
              ? 'कंप्यूटर विजन स्ट्रिप स्कैनर अंशांकन, सिग्नलिंग इन्फ्रास्ट्रक्चर और क्लाइंट बग्स की निगरानी।'
              : 'Monitor real-time optical sensor calibration anomalies, WebRTC signaling performance, and user-submitted incident logs.'}
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#251A11] text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800/80 disabled:opacity-50 cursor-pointer active:scale-95 transition-all shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-500' : ''}`} />
          <span>{isRefreshing ? (isHindi ? 'रीफ्रेश...' : 'Refreshing...') : (isHindi ? 'रीफ्रेश' : 'Refresh Reports')}</span>
        </button>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Active Open Incidents
          </span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{openTicketsCount}</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-bold">Awaiting Engineering Review</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Critical Priority Alerts
          </span>
          <p className="text-3xl font-extrabold text-red-600 dark:text-red-400">{highPriorityCount}</p>
          <p className="text-xs text-slate-500">Fast-track SLA &lt; 4 hours</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Optical Scanner Accuracy
          </span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">99.78%</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">14-parameter automated check</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Signaling Uptime
          </span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">99.99%</p>
          <p className="text-xs text-cyan-600 dark:text-cyan-400 font-bold">DTLS / SRTP zero-drop</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isHindi ? 'रिपोर्ट आईडी, शीर्षक या सिस्टम घटक खोजें...' : 'Search by Report ID, component, or technical description...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {['ALL', 'High', 'Medium', 'Low'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  priorityFilter === p
                    ? 'bg-cyan-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {p === 'ALL' ? (isHindi ? 'सभी प्राथमिकता' : 'All Priority') : p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
          <span className="text-slate-500 font-semibold shrink-0">{isHindi ? 'स्थिति:' : 'Status:'}</span>
          {['ALL', 'In Review', 'Resolved', 'Backlog'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st === 'ALL' ? (isHindi ? 'सभी स्थितियां' : 'All Statuses') : st}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Table */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Report ID</th>
                <th className="py-3 px-4">Component / Type</th>
                <th className="py-3 px-4">Diagnostic Details</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {filteredReports.map((rep) => (
                <tr
                  key={rep.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-[#2B1E15]/80 transition-colors group cursor-pointer"
                  onClick={() => {
                    setSelectedReport(rep);
                    setNewNoteInput(rep.resolutionNotes || '');
                    setDetailModalOpen(true);
                  }}
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-600 dark:text-cyan-400">
                    {rep.id}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-purple-600 dark:text-purple-400 whitespace-nowrap">
                    {rep.type}
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{rep.title}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{rep.notes}</p>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        rep.priority === 'High'
                          ? 'text-red-700 dark:text-red-400 bg-red-500/10 border border-red-500/20'
                          : rep.priority === 'Medium'
                          ? 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20'
                          : 'text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20'
                      }`}
                    >
                      {rep.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-mono whitespace-nowrap">
                    {rep.submittedDate}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        rep.status === 'Resolved'
                          ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                          : 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleStatus(rep.id)}
                      className="px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 text-xs font-semibold cursor-pointer active:scale-95 transition-all"
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

      {filteredReports.length === 0 && (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Incidents Clear</h3>
          <p className="text-sm text-slate-500">No system reports or tickets match your selected filters.</p>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {detailModalOpen && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{selectedReport.id}</span>
                <span className="text-slate-400">•</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedReport.type}</span>
              </div>
              <button onClick={() => setDetailModalOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedReport.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Priority: {selectedReport.priority}
                </span>
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  Status: {selectedReport.status}
                </span>
                <span className="text-slate-500">Logged on {selectedReport.submittedDate}</span>
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <span className="font-bold text-slate-500 block mb-0.5">Reporter & Environment:</span>
                <span className="text-slate-900 dark:text-white font-mono">{selectedReport.reporter}</span>
                {selectedReport.device && <p className="text-slate-500 mt-0.5">{selectedReport.device}</p>}
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-500 block mb-0.5">Technical Diagnostics & Stack Log:</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">{selectedReport.notes}</p>
              </div>
            </div>

            {/* Resolution log & note editing */}
            <form onSubmit={handleUpdateNotes} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Remediation & Patch Log:
                </label>
                <textarea
                  rows={3}
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  placeholder="Record remediation actions taken, commit hash, or deployed patch version..."
                  className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    toggleStatus(selectedReport.id);
                    setSelectedReport(prev => ({
                      ...prev,
                      status: prev.status === 'Resolved' ? 'In Review' : 'Resolved'
                    }));
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedReport.status === 'Resolved'
                      ? 'bg-amber-500/15 text-amber-600 hover:bg-amber-500/25'
                      : 'bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25'
                  }`}
                >
                  {selectedReport.status === 'Resolved' ? 'Reopen Ticket' : 'Mark as Resolved'}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDetailModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Log</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
