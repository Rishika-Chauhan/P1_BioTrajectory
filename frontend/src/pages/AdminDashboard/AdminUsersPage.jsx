import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Lock,
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
      : date.toLocaleDateString(isHindi ? "hi-IN" : "en-IN");
  }

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await adminDashboardService.getUsers();
      setUsers(response.users);
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

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isHindi ? 'उपयोगकर्ता खाता प्रबंधन' : 'User Account Management'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isHindi
              ? 'प्रणाली के पंजीकृत उपयोगकर्ता प्रोफाइल एवं अधिकृत भूमिकाएं।'
              : 'Real Firebase user profiles and verified account roles.'}
          </p>
        </div>

        <button
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-sm font-semibold cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          {isHindi ? 'रीफ्रेश' : 'Refresh'}
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex gap-3 text-xs text-purple-800 dark:text-purple-200">
        <Lock className="w-5 h-5 shrink-0" />
        <p>
          {isHindi
            ? 'यह पृष्ठ केवल खाता जानकारी प्रदर्शित करता है। मरीजों के निजी मेडिकल रिकॉर्ड, रीडिंग और बातचीत गोपनीय हैं।'
            : 'This page displays account information only. Medical records, health readings and private AI conversations are not exposed.'}
        </p>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 p-4 space-y-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={isHindi ? "नाम, ईमेल या आईडी से खोजें..." : "Search by name, email or UID..."}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["ALL", isHindi ? "सभी" : "All"],
            ["USER", isHindi ? "मरीज" : "Patients"],
            ["DOCTOR", isHindi ? "डॉक्टर" : "Doctors"],
            ["DOCTOR_PENDING", isHindi ? "समीक्षाधीन" : "Doctor Pending"],
            ["DOCTOR_SUSPENDED", isHindi ? "निलंबित" : "Suspended Doctors"],
            ["ADMIN", isHindi ? "व्यवस्थापक" : "Administrators"],
            ["UNKNOWN", isHindi ? "अज्ञात" : "Unknown"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setRoleFilter(value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                roleFilter === value
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-slate-100 dark:bg-[#070B14] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 overflow-x-auto">
        {loading ? (
          <p className="p-8 text-center text-slate-400">
            {isHindi ? 'उपयोगकर्ता प्रोफाइल लोड हो रही हैं...' : 'Loading user profiles...'}
          </p>
        ) : error ? (
          <p className="p-8 text-center text-red-500">{error}</p>
        ) : filteredUsers.length === 0 ? (
          <p className="p-8 text-center text-slate-400">
            {isHindi ? 'कोई मेल खाता उपयोगकर्ता नहीं मिला।' : 'No matching user profiles found.'}
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-xs">
                <th className="p-4">{isHindi ? 'उपयोगकर्ता' : 'User'}</th>
                <th className="p-4">UID</th>
                <th className="p-4">{isHindi ? 'भूमिका' : 'Role'}</th>
                <th className="p-4">{isHindi ? 'पंजीकरण तिथि' : 'Registration date'}</th>
                <th className="p-4">{isHindi ? 'खाता स्थिति' : 'Account status'}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user.uid}>
                  <td className="p-4">
                    <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {user.email || (isHindi ? "ईमेल अनुपलब्ध" : "Email unavailable")}
                    </p>
                  </td>

                  <td className="p-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                    {user.uid}
                  </td>

                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    {ROLE_LABELS[user.role] || (isHindi ? "अज्ञात" : "Unknown")}
                  </td>

                  <td className="p-4 text-slate-700 dark:text-slate-300">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="p-4">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-slate-500">
        {isHindi
          ? `कुल ${users.length} में से ${filteredUsers.length} प्रोफाइल प्रदर्शित हैं।`
          : `Showing ${filteredUsers.length} of ${users.length} profiles.`}
      </p>
    </div>
  );
}