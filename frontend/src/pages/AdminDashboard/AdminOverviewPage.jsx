
import React, { useCallback, useEffect, useState } from "react";

import {
  Users,
  Stethoscope,
  CalendarCheck,
  Clock,
  Lock,
  Server,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import adminDashboardService from "../../services/adminDashboardService";

const cardStyle =
  "p-6 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm";

const formatNumber = (value) =>
  Number(value ?? 0).toLocaleString("en-IN");

function MetricCard({ title, value, description, icon: Icon, color }) {
  return (
    <div className={`${cardStyle} space-y-3`}>
      <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
        <span className="text-sm font-bold uppercase tracking-wider">
          {title}
        </span>

        <Icon className={`w-5 h-5 ${color}`} />
      </div>

      <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
        {value}
      </p>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}

function StatusRow({ label, value, color }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <span className="text-sm text-slate-600 dark:text-slate-300">
        {label}
      </span>

      <span className={`font-bold ${color}`}>
        {formatNumber(value)}
      </span>
    </div>
  );
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await adminDashboardService.getStats();
      setStats(response);
    } catch (err) {
      setError(
        err.message || "Unable to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const registrationHistory =
    stats?.users?.registrationHistory?.history ?? [];

  const chartData = registrationHistory.map((item) => ({
    month: `${item.month} ${item.year}`,
    newUsers: item.newUsers,
  }));

  const appointmentStatuses =
    stats?.appointments?.byStatus ?? {};

  const applicationStatuses =
    stats?.doctors?.applications ?? {};

  const lastUpdated = stats?.generatedAt
    ? new Date(stats.generatedAt).toLocaleString("en-IN")
    : null;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Admin Overview
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-400 mt-2">
            Live platform statistics from BioTrajectory.
          </p>
        </div>

        <button
          type="button"
          onClick={loadStats}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold transition"
        >
          <RefreshCw
            className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
          />
          {loading ? "Refreshing..." : "Refresh data"}
        </button>
      </div>

      {/* Privacy banner */}
      <div className="p-5 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex items-start gap-4">
        <Lock className="w-6 h-6 text-purple-600 dark:text-purple-400 shrink-0 mt-1" />

        <div>
          <p className="font-bold text-purple-700 dark:text-purple-300">
            Strict Patient Privacy Protection
          </p>

          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
            This dashboard displays administrative aggregates only.
            Administrators cannot view private patient readings,
            medical records, consultations or private AI conversations
            through this dashboard.
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && !stats && (
        <div className={`${cardStyle} flex items-center justify-center gap-3 py-16`}>
          <RefreshCw className="w-5 h-5 animate-spin text-purple-500" />

          <p className="text-slate-600 dark:text-slate-300">
            Loading real dashboard statistics...
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-1" />

            <div className="flex-1">
              <p className="font-bold text-red-600 dark:text-red-400">
                Dashboard data unavailable
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                {error}
              </p>

              <button
                type="button"
                onClick={loadStats}
                className="mt-3 text-sm font-bold text-red-600 dark:text-red-400 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard content */}
      {stats && (
        <>
          {/* Main metric cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            <MetricCard
              title="Registered Profiles"
              value={formatNumber(stats.users?.totalProfiles)}
              description="Firestore user profiles"
              icon={Users}
              color="text-purple-500"
            />

            <MetricCard
              title="Approved Doctors"
              value={formatNumber(stats.doctors?.approved)}
              description="Published doctor profiles"
              icon={Stethoscope}
              color="text-blue-500"
            />

            <MetricCard
              title="Total Appointments"
              value={formatNumber(stats.appointments?.total)}
              description="Recorded appointment documents"
              icon={CalendarCheck}
              color="text-cyan-500"
            />

            <MetricCard
              title="Pending Appointments"
              value={formatNumber(appointmentStatuses.PENDING)}
              description="Awaiting doctor response"
              icon={Clock}
              color="text-amber-500"
            />
          </div>

          {/* Registration chart and system status */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            <div className={`lg:col-span-8 ${cardStyle} space-y-5`}>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Monthly Profile Registrations
                </h2>

                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  New Firestore user profiles created each month.
                </p>
              </div>

              {stats.users?.registrationHistory?.available &&
              chartData.length > 0 ? (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="adminUserGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8B5CF6"
                            stopOpacity={0.4}
                          />

                          <stop
                            offset="95%"
                            stopColor="#8B5CF6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#64748B"
                        opacity={0.2}
                        vertical={false}
                      />

                      <XAxis
                        dataKey="month"
                        stroke="#64748B"
                        fontSize={12}
                      />

                      <YAxis
                        stroke="#64748B"
                        fontSize={12}
                        allowDecimals={false}
                      />

                      <Tooltip
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #CBD5E1",
                        }}
                        formatter={(value) => [
                          formatNumber(value),
                          "New profiles",
                        ]}
                      />

                      <Area
                        type="monotone"
                        dataKey="newUsers"
                        stroke="#8B5CF6"
                        strokeWidth={3}
                        fill="url(#adminUserGradient)"
                        name="New profiles"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center text-center text-slate-500 dark:text-slate-400">
                  Registration history is not available yet.
                </div>
              )}

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Source: {stats.users?.registrationHistory?.source || "Unavailable"}
              </p>
            </div>

            {/* System monitoring */}
            <div className={`lg:col-span-4 ${cardStyle} space-y-5`}>
              <div className="flex items-center gap-3">
                <Server className="w-6 h-6 text-emerald-500" />

                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  System Monitoring
                </h2>
              </div>

              <div className="py-5 border-y border-slate-100 dark:border-slate-800">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Uptime
                </p>

                <p className="text-2xl font-extrabold text-slate-700 dark:text-slate-200 mt-2">
                  Not monitored
                </p>

                <p className="text-xs text-slate-500 mt-2">
                  No uptime monitoring service is connected.
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Last statistics update
                </p>

                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-2">
                  {lastUpdated || "Unavailable"}
                </p>
              </div>

              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                Statistics endpoint responded successfully
              </div>
            </div>
          </div>

          {/* Appointment and application statistics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className={cardStyle}>
              <div className="flex items-center gap-3 mb-4">
                <CalendarCheck className="w-5 h-5 text-cyan-500" />

                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Appointment Statistics
                </h2>
              </div>

              <StatusRow
                label="Pending"
                value={appointmentStatuses.PENDING}
                color="text-amber-500"
              />

              <StatusRow
                label="Accepted"
                value={appointmentStatuses.ACCEPTED}
                color="text-blue-500"
              />

              <StatusRow
                label="Completed"
                value={appointmentStatuses.COMPLETED}
                color="text-emerald-500"
              />

              <StatusRow
                label="Rejected"
                value={appointmentStatuses.REJECTED}
                color="text-red-500"
              />
            </div>

            <div className={cardStyle}>
              <div className="flex items-center gap-3 mb-4">
                <Stethoscope className="w-5 h-5 text-purple-500" />

                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Doctor Application Statistics
                </h2>
              </div>

              <StatusRow
                label="Pending review"
                value={applicationStatuses.PENDING}
                color="text-amber-500"
              />

              <StatusRow
                label="Approved"
                value={applicationStatuses.APPROVED}
                color="text-emerald-500"
              />

              <StatusRow
                label="Rejected"
                value={applicationStatuses.REJECTED}
                color="text-red-500"
              />

              <StatusRow
                label="Currently approving"
                value={applicationStatuses.APPROVING}
                color="text-blue-500"
              />

              <StatusRow
                label="Currently rejecting"
                value={applicationStatuses.REJECTING}
                color="text-slate-500"
              />
            </div>
          </div>

          {/* Data source note */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>
              Data source: Firebase Admin SDK and Cloud Firestore.
            </span>

            <span>
              <TrendingUp className="w-3 h-3 inline mr-1" />
              Aggregate statistics only
            </span>
          </div>
        </>
      )}
    </div>
  );
}
