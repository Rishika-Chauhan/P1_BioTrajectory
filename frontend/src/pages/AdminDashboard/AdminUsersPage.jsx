import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  Lock,
} from "lucide-react";
import adminDashboardService from "../../services/adminDashboardService";

const ROLE_LABELS = {
  USER: "Patient",
  DOCTOR: "Doctor",
  DOCTOR_PENDING: "Doctor Pending",
  DOCTOR_SUSPENDED: "Doctor Suspended",
  ADMIN: "Administrator",
  UNKNOWN: "Unknown",
};

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleDateString();
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await adminDashboardService.getUsers();
      setUsers(response.users);
    } catch (err) {
      setError(err.message || "Unable to load user profiles.");
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
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            User Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real Firebase user profiles and verified account roles.
          </p>
        </div>

        <button
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex gap-3 text-xs text-purple-200">
        <Lock className="w-5 h-5 shrink-0" />
        <p>
          This page displays account information only. Medical records,
          health readings and private AI conversations are not exposed.
        </p>
      </div>

      <div className="rounded-2xl bg-[#101827] border border-slate-800 p-4 space-y-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by name, email or UID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070B14] border border-slate-800 text-sm text-white"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            ["ALL", "All"],
            ["USER", "Patients"],
            ["DOCTOR", "Doctors"],
            ["DOCTOR_PENDING", "Doctor Pending"],
            ["DOCTOR_SUSPENDED", "Suspended Doctors"],
            ["ADMIN", "Administrators"],
            ["UNKNOWN", "Unknown"],
          ].map(([value, label]) => (
            <button
              key={value}
              onClick={() => setRoleFilter(value)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                roleFilter === value
                  ? "bg-purple-500 text-white"
                  : "bg-[#070B14] text-slate-400 border border-slate-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-[#101827] border border-slate-800 overflow-x-auto">
        {loading ? (
          <p className="p-8 text-center text-slate-400">
            Loading Firebase user profiles...
          </p>
        ) : error ? (
          <p className="p-8 text-center text-red-400">{error}</p>
        ) : filteredUsers.length === 0 ? (
          <p className="p-8 text-center text-slate-400">
            No matching user profiles found.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs">
                <th className="p-4">User</th>
                <th className="p-4">UID</th>
                <th className="p-4">Role</th>
                <th className="p-4">Registration date</th>
                <th className="p-4">Account status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {filteredUsers.map((user) => (
                <tr key={user.uid}>
                  <td className="p-4">
                    <p className="font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-slate-400">
                      {user.email || "Email unavailable"}
                    </p>
                  </td>

                  <td className="p-4 font-mono text-xs text-slate-400">
                    {user.uid}
                  </td>

                  <td className="p-4 text-slate-300">
                    {ROLE_LABELS[user.role] || "Unknown"}
                  </td>

                  <td className="p-4 text-slate-300">
                    {formatDate(user.createdAt)}
                  </td>

                  <td className="p-4">
                    <span className="text-xs font-semibold text-slate-300">
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
        Showing {filteredUsers.length} of {users.length} profiles.
      </p>
    </div>
  );
}