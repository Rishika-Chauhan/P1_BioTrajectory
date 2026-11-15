import React, { useEffect, useMemo, useState } from "react";
import {
  Users,
  ShieldCheck,
  AlertTriangle,
  Search,
  RefreshCw,
  Lock,
} from "lucide-react";
import adminDashboardService from "../../services/adminDashboardService";

function formatDate(value) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not available";

  return date.toLocaleDateString();
}

export default function AdminPatientManagementPage() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadPatients() {
    try {
      setLoading(true);
      setError("");

      const response = await adminDashboardService.getUsers();

      // USER is the regular patient/user role in this application.
      setPatients(
        response.users.filter((user) => user.role === "USER")
      );
    } catch (err) {
      setError(err.message || "Unable to load patient profiles.");
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

  const activeCount = patients.filter(
    (patient) => patient.status === "ACTIVE"
  ).length;

  const suspendedCount = patients.filter(
    (patient) => patient.status === "SUSPENDED"
  ).length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Patient Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Account-level patient profile management.
          </p>
        </div>

        <button
          onClick={loadPatients}
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
          Administrators can view account-level information only.
          Patient medical records, readings and private consultations
          remain inaccessible.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total patients"
          value={patients.length}
          icon={<Users className="w-5 h-5 text-blue-400" />}
        />

        <StatCard
          label="Active accounts"
          value={activeCount}
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
        />

        <StatCard
          label="Suspended accounts"
          value={suspendedCount}
          icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
        />
      </div>

      <div className="rounded-2xl bg-[#101827] border border-slate-800 p-4 flex flex-col md:flex-row gap-3 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email or UID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070B14] border border-slate-800 text-sm text-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="bg-[#070B14] border border-slate-800 text-white rounded-xl px-4 py-2 text-sm"
        >
          <option value="ALL">All statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
          <option value="UNKNOWN">Unknown</option>
        </select>
      </div>

      <div className="rounded-2xl bg-[#101827] border border-slate-800 overflow-x-auto">
        {loading ? (
          <p className="p-8 text-center text-slate-400">
            Loading real patient profiles...
          </p>
        ) : error ? (
          <p className="p-8 text-center text-red-400">{error}</p>
        ) : filteredPatients.length === 0 ? (
          <p className="p-8 text-center text-slate-400">
            No patient profiles found.
          </p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-xs">
                <th className="p-4">Patient</th>
                <th className="p-4">Firebase UID</th>
                <th className="p-4">Registration date</th>
                <th className="p-4">Account status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800">
              {filteredPatients.map((patient) => (
                <tr key={patient.uid}>
                  <td className="p-4">
                    <p className="font-semibold text-white">
                      {patient.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {patient.email || "Email unavailable"}
                    </p>
                  </td>

                  <td className="p-4 font-mono text-xs text-slate-400">
                    {patient.uid}
                  </td>

                  <td className="p-4 text-slate-300">
                    {formatDate(patient.createdAt)}
                  </td>

                  <td className="p-4">
                    <StatusLabel status={patient.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="rounded-2xl bg-[#101827] border border-slate-800 p-5">
      <div className="flex justify-between items-center">
        <span className="text-xs uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {icon}
      </div>
      <p className="mt-3 text-3xl font-extrabold text-white">{value}</p>
    </div>
  );
}

function StatusLabel({ status }) {
  const styles = {
    ACTIVE: "text-emerald-400 bg-emerald-500/10",
    SUSPENDED: "text-red-400 bg-red-500/10",
    UNKNOWN: "text-amber-400 bg-amber-500/10",
  };

  return (
    <span
      className={`px-2 py-1 rounded-lg text-xs font-semibold ${
        styles[status] || styles.UNKNOWN
      }`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}