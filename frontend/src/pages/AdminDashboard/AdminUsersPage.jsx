import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Lock,
  ShieldCheck,
  Stethoscope,
  Shield,
  AlertTriangle,
  User,
  Copy,
  CheckCircle2,
  X,
  Mail,
  Calendar,
  Key
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import adminDashboardService from "../../services/adminDashboardService";

export default function AdminUsersPage() {
  const { t, isHindi } = useLanguage();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const ROLE_LABELS = {
    USER: isHindi ? "मरीज (Patient)" : "Patient",
    DOCTOR: isHindi ? "चिकित्सक (Doctor)" : "Doctor",
    DOCTOR_PENDING: isHindi ? "समीक्षाधीन डॉक्टर" : "Doctor Pending",
    DOCTOR_SUSPENDED: isHindi ? "निलंबित डॉक्टर" : "Doctor Suspended",
    ADMIN: isHindi ? "व्यवस्थापक (Admin)" : "Administrator",
    UNKNOWN: isHindi ? "अज्ञात" : "Unknown",
  };

  function formatDate(value) {
    if (!value) return isHindi ? "अनुपलब्ध" : "Not available";
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? (isHindi ? "अनुपलब्ध" : "Not available")
      : date.toLocaleDateString(isHindi ? "hi-IN" : "en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
  }

  async function loadUsers(isManual = false) {
    try {
      setLoading(true);
      setError("");

      if (isManual) {
        await new Promise((r) => setTimeout(r, 450));
      }

      const response = await adminDashboardService.getUsers();
      setUsers(response.users);
      if (isManual) {
        showToast(isHindi ? "उपयोगकर्ता सूची अद्यतित हुई।" : "User directory synchronized.");
      }
    } catch (err) {
      setError(err.message || (isHindi ? "उपयोगकर्ता प्रोफाइल लोड करने में असमर्थ।" : "Unable to load user profiles."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      const matchesRole =
        roleFilter === "ALL" || user.role === roleFilter;

      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        (user.email || "").toLowerCase().includes(query) ||
        user.uid.toLowerCase().includes(query);

      return matchesRole && matchesSearch;
    });
  }, [users, searchQuery, roleFilter]);

  const doctorCount = users.filter(u => u.role === 'DOCTOR').length;
  const patientCount = users.filter(u => u.role === 'USER').length;
  const pendingCount = users.filter(u => u.role === 'DOCTOR_PENDING').length;

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard.`);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'DOCTOR':
        return 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'DOCTOR_PENDING':
        return 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'ADMIN':
        return 'text-purple-700 dark:text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'DOCTOR_SUSPENDED':
        return 'text-red-700 dark:text-red-400 bg-red-500/10 border-red-500/20';
      default:
        return 'text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
    }
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>{isHindi ? 'खाता एवं पहचान शासन' : 'Identity & Credential Governance'}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {isHindi ? 'उपयोगकर्ता खाता प्रबंधन' : 'User Account Directory'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
            {isHindi
              ? 'प्रणाली के पंजीकृत उपयोगकर्ता प्रोफाइल, प्राधिकृत भूमिकाएं एवं प्रमाणीकरण रिकॉर्ड्स।'
              : 'Real Firebase user authentication profiles, verified account roles, and clinical authorization states.'}
          </p>
        </div>

        <button
          onClick={() => loadUsers(true)}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#251A11] text-slate-700 dark:text-slate-200 text-sm font-bold hover:bg-slate-100 dark:hover:bg-slate-800/80 disabled:opacity-50 cursor-pointer active:scale-95 transition-all shadow-xs self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-cyan-500" : ""}`} />
          <span>{loading ? (isHindi ? 'रीफ्रेश...' : 'Refreshing...') : (isHindi ? 'रीफ्रेश' : 'Refresh Directory')}</span>
        </button>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-cyan-500/10 border border-cyan-500/25 flex items-start gap-3.5 text-xs text-slate-700 dark:text-slate-300">
        <Lock className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-cyan-900 dark:text-cyan-200 text-sm">
            Audited Account Identity Boundary
          </p>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            {isHindi
              ? 'यह पृष्ठ केवल खाता और भूमिका प्रबंधन प्रदर्शित करता है। मरीजों के व्यक्तिगत मेडिकल रिकॉर्ड, रीडिंग और बातचीत जीरो-नॉलेज एन्क्रिप्शन द्वारा सुरक्षित हैं।'
              : 'This interface manages account credentials, login providers, and RBAC roles. Individual biometric telemetry charts and private doctor consultations remain strictly end-to-end encrypted.'}
          </p>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total User Profiles
          </span>
          <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{users.length}</p>
          <p className="text-xs text-slate-500">Active Firebase Auth directory</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Patients (Users)
          </span>
          <p className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">{patientCount}</p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">Self-Tracking Enrolled</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Verified Clinicians
          </span>
          <p className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{doctorCount}</p>
          <p className="text-xs text-slate-500">Board-certified doctors</p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pending Doctor Review
          </span>
          <p className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{pendingCount}</p>
          <p className="text-xs text-slate-500">License verification queue</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={isHindi ? "नाम, ईमेल या आईडी से खोजें..." : "Search user accounts by name, email, or Firebase UID..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-500 font-semibold mr-1">{isHindi ? "भूमिका फ़िल्टर:" : "Role Filter:"}</span>
          {[
            ["ALL", isHindi ? "सभी" : "All Roles"],
            ["USER", isHindi ? "मरीज" : "Patients"],
            ["DOCTOR", isHindi ? "डॉक्टर" : "Doctors"],
            ["DOCTOR_PENDING", isHindi ? "समीक्षाधीन" : "Doctor Pending"],
            ["DOCTOR_SUSPENDED", isHindi ? "निलंबित" : "Suspended Doctors"],
            ["ADMIN", isHindi ? "व्यवस्थापक" : "Administrators"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setRoleFilter(value)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                roleFilter === value
                  ? "bg-cyan-500 text-slate-950 shadow-xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="p-4 sm:p-6 rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin mx-auto" />
            <p className="text-sm font-semibold text-slate-500">
              {isHindi ? 'उपयोगकर्ता प्रोफाइल लोड हो रही हैं...' : 'Loading verified user profiles...'}
            </p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 space-y-2">
            <AlertTriangle className="w-8 h-8 mx-auto" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {isHindi ? 'कोई मेल खाता उपयोगकर्ता नहीं मिला।' : 'No matching user profiles found.'}
            </h3>
            <p className="text-xs text-slate-500">Try modifying your search criteria or resetting the role filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4">{isHindi ? 'उपयोगकर्ता' : 'User Account'}</th>
                  <th className="py-3 px-4">Firebase UID</th>
                  <th className="py-3 px-4">{isHindi ? 'भूमिका' : 'Role'}</th>
                  <th className="py-3 px-4">{isHindi ? 'पंजीकरण तिथि' : 'Registration Date'}</th>
                  <th className="py-3 px-4">{isHindi ? 'खाता स्थिति' : 'Account Status'}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.uid}
                    className="hover:bg-slate-50/80 dark:hover:bg-[#2B1E15]/80 transition-colors cursor-pointer group"
                    onClick={() => {
                      setSelectedUser(user);
                      setModalOpen(true);
                    }}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs uppercase">
                          {user.name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">
                            {user.name}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {user.email || (isHindi ? "ईमेल अनुपलब्ध" : "Email unavailable")}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500 font-medium">
                      {user.uid}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getRoleBadge(user.role)}`}>
                        {ROLE_LABELS[user.role] || (isHindi ? "अज्ञात" : "Unknown")}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300 font-mono">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          user.status === 'ACTIVE'
                            ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                            : 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20'
                        }`}
                      >
                        {user.status || 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500">
        {isHindi
          ? `कुल ${users.length} में से ${filteredUsers.length} प्रोफाइल प्रदर्शित हैं।`
          : `Displaying ${filteredUsers.length} of ${users.length} verified accounts.`}
      </p>

      {/* User Details Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#251A11] border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                  {selectedUser.name?.[0] || 'U'}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {selectedUser.name}
                  </h3>
                  <span className="text-[11px] text-slate-500">{selectedUser.email}</span>
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
                    onClick={() => copyToClipboard(selectedUser.uid, 'Firebase UID')}
                    className="text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <p className="font-mono text-slate-800 dark:text-slate-200 break-all">{selectedUser.uid}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Role</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-1 block">
                    {ROLE_LABELS[selectedUser.role] || selectedUser.role}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Registration</span>
                  <span className="font-bold text-slate-900 dark:text-white mt-1 block">
                    {formatDate(selectedUser.createdAt)}
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Account Status</span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getRoleBadge(selectedUser.role)}`}>
                  {selectedUser.status || 'ACTIVE'}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
