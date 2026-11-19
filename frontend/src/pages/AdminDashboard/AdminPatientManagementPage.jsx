import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Search,
  RefreshCw,
  Lock,
  UserCheck,
  UserX,
  Mail,
  Calendar,
  Key,
  Copy,
  CheckCircle2,
  X,
  MoreVertical,
  SlidersHorizontal,
  ChevronRight,
  Shield
} from "lucide-react";
import adminDashboardService from "../../services/adminDashboardService";
import { useLanguage } from "../../context/LanguageContext";

export default function AdminPatientManagementPage() {
  const { isHindi } = useLanguage();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  function formatDate(value) {
    if (!value) return isHindi ? "अनुपलब्ध" : "Not available";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return isHindi ? "अनुपलब्ध" : "Not available";
    return date.toLocaleDateString(isHindi ? "hi-IN" : "en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  async function loadPatients(isManual = false) {
    try {
      setLoading(true);
      setError("");

      if (isManual) {
        await new Promise((r) => setTimeout(r, 450));
      }

      const response = await adminDashboardService.getUsers();
      // USER is regular patient
      setPatients(response.users.filter((user) => user.role === "USER"));
      if (isManual) {
        showToast(isHindi ? "मरीज सूची सफलतापूर्वक रीफ्रेश हुई।" : "Patient directory synchronized.");
      }
    } catch (err) {
      setError(err.message || (isHindi ? "मरीज प्रोफाइल लोड करने में असमर्थ।" : "Unable to load patient profiles."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();

    return patients.filter((patient) => {
      const matchesStatus =
        statusFilter === "ALL" || patient.status === statusFilter;

      const matchesSearch =
        !query ||
        patient.name.toLowerCase().includes(query) ||
        (patient.email || "").toLowerCase().includes(query) ||
        patient.uid.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [patients, search, statusFilter]);

  const activeCount = patients.filter((p) => p.status === "ACTIVE").length;
  const suspendedCount = patients.filter((p) => p.status === "SUSPENDED").length;

  const toggleAccountStatus = (patient) => {
    const nextStatus = patient.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
    setPatients(prev => prev.map(p => p.uid === patient.uid ? { ...p, status: nextStatus } : p));
    if (selectedPatient && selectedPatient.uid === patient.uid) {
      setSelectedPatient({ ...selectedPatient, status: nextStatus });
    }
    showToast(
      nextStatus === "ACTIVE"
        ? (isHindi ? `खाता ${patient.name} सक्रिय किया गया।` : `Patient account for ${patient.name} activated.`)
        : (isHindi ? `खाता ${patient.name} निलंबित किया गया।` : `Patient account for ${patient.name} suspended.`)
    );
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard.`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-600 text-white font-bold text-sm shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>{isHindi ? 'मरीज खाता शासन' : 'Patient Account Governance'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {isHindi ? 'मरीज प्रबंधन एवं खाता नियंत्रण' : 'Patient Directory & Account Management'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {isHindi
              ? 'खाता-स्तरीय मरीज प्रोफाइल, सुरक्षा स्थिति एवं प्रमाणीकरण टोकन का प्रबंधन।'
              : 'Account-level patient directory, identity authentication lifecycle, and zero-knowledge privacy status.'}
          </p>
        </div>

        <button
          onClick={() => loadPatients(true)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#251A11] text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800/80 disabled:opacity-50 cursor-pointer active:scale-95 transition-all shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-500" : ""}`} />
          <span>{loading ? (isHindi ? "रीफ्रेश..." : "Refreshing...") : (isHindi ? "रीफ्रेश" : "Refresh")}</span>
        </button>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-cyan-500/10 border border-cyan-500/25 flex items-start gap-3.5 text-xs text-slate-700 dark:text-slate-300">
        <Lock className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-cyan-900 dark:text-cyan-200 text-sm">
            Zero-Knowledge Sovereign Patient Architecture
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Administrators manage account credentials, activation states, and security tokens only. Private clinical records, urine strip photos, and doctor consultation transcripts remain cryptographically inaccessible.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{isHindi ? 'कुल पंजीकृत मरीज' : 'Total Registered Patients'}</span>
            <Users className="w-4 h-4 text-cyan-500" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{patients.length}</p>
          <p className="text-xs text-slate-500">Firebase verified accounts</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{isHindi ? 'सक्रिय मरीज खाते' : 'Active Accounts'}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{activeCount}</p>
          <p className="text-xs text-slate-500">Full telemetry access</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{isHindi ? 'निलंबित खाते' : 'Suspended Accounts'}</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{suspendedCount}</p>
          <p className="text-xs text-slate-500">Access temporarily held</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isHindi ? "मरीज का नाम, ईमेल या UID खोजें..." : "Search patient name, email, or Firebase UID..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">{isHindi ? "स्थिति:" : "Status:"}</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">{isHindi ? "सभी स्थितियां" : "All Statuses"}</option>
            <option value="ACTIVE">{isHindi ? "सक्रिय (Active)" : "Active"}</option>
            <option value="SUSPENDED">{isHindi ? "निलंबित (Suspended)" : "Suspended"}</option>
          </select>
        </div>
      </div>

      {/* Patients Table */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-500">Loading patient directory...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 space-y-2">
            <AlertTriangle className="w-8 h-8 mx-auto" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Patient Records Found</h3>
            <p className="text-xs text-slate-500">Try adjusting your search criteria or resetting filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">Patient Profile</th>
                  <th className="py-3 px-4">Firebase UID</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.uid}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#2B1E15]/80 transition-colors cursor-pointer group"
                    onClick={() => {
                      setSelectedPatient(patient);
                      setModalOpen(true);
                    }}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs uppercase">
                          {patient.name?.[0] || 'P'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">
                            {patient.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {patient.email || "Email unavailable"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500 font-medium">
                      {patient.uid}
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono">
                      {formatDate(patient.createdAt)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          patient.status === 'ACTIVE'
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                            : 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20'
                        }`}
                      >
                        {patient.status || 'ACTIVE'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleAccountStatus(patient)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          patient.status === 'ACTIVE'
                            ? 'border border-amber-500/30 text-amber-600 hover:bg-amber-500/10'
                            : 'border border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10'
                        }`}
                      >
                        {patient.status === 'ACTIVE' ? 'Suspend' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Detail Modal */}
      {modalOpen && selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  {selectedPatient.name?.[0] || 'P'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedPatient.name}
                  </h3>
                  <span className="text-[11px] text-slate-500">{selectedPatient.email}</span>
                </div>
              </div>

              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Firebase UID</span>
                  <button
                    onClick={() => copyToClipboard(selectedPatient.uid, 'Firebase UID')}
                    className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <p className="font-mono text-slate-800 dark:text-slate-200 break-all">{selectedPatient.uid}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Registration</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                    {formatDate(selectedPatient.createdAt)}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Account Role</span>
                  <span className="font-bold text-cyan-600 dark:text-cyan-400 mt-1 block">
                    PATIENT (USER)
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-900 dark:text-purple-300">
                <span className="font-bold block mb-1">Privacy Tier: Sovereign Client Keys</span>
                <p className="leading-relaxed">
                  Patient medical readings and urinalysis trajectories are protected under client-side zero-knowledge encryption. Administrative console cannot access raw telemetry.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => toggleAccountStatus(selectedPatient)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedPatient.status === 'ACTIVE'
                    ? 'bg-amber-500/15 text-amber-600 hover:bg-amber-500/25'
                    : 'bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25'
                }`}
              >
                {selectedPatient.status === 'ACTIVE' ? 'Suspend Patient Account' : 'Reactivate Patient Account'}
              </button>

              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
