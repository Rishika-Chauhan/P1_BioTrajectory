
import React, { useCallback, useEffect, useState } from "react";
import adminDashboardService from "../../services/adminDashboardService";

const PERIODS = [
  { label: "7 Days", value: "7d" },
  { label: "30 Days", value: "30d" },
  { label: "6 Months", value: "6m" },
  { label: "1 Year", value: "1y" },
];

const formatNumber = (value, decimals = 2) => {
  if (value === null || value === undefined) return null;

  const number = Number(value);

  return Number.isFinite(number)
    ? number.toFixed(decimals)
    : null;
};

const formatDate = (value) => {
  if (!value) return "Unknown date";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// --------------------------------------------------
// Metric Card
// --------------------------------------------------

function MetricCard({
  title,
  metric,
  icon,
  description,
}) {
  const available = metric?.available === true;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <div className="mt-4 flex items-baseline gap-2">
            {available ? (
              <>
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                  {formatNumber(metric.average)}
                </span>

                <span className="text-sm text-slate-500">
                  {metric.unit}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-slate-400">
                Unavailable
              </span>
            )}
          </div>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-xl dark:bg-cyan-950">
          {icon}
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-800">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {available
            ? `${metric.patientCount} distinct patients included`
            : metric?.reason || "Data not available"}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}

// --------------------------------------------------
// Trend Panel
// --------------------------------------------------

function TrendPanel({ title, data }) {
  const validData = Array.isArray(data) ? data : [];

  const maxValue = Math.max(
    ...validData.map((item) => Number(item.average) || 0),
    1
  );

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <h3 className="font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Population average over time
      </p>

      {validData.length === 0 ? (
        <div className="mt-5 flex min-h-32 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400 dark:bg-slate-800">
          No trend data available
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {validData.map((item, index) => {
            const value = Number(item.average);
            const width = Math.max(3, (value / maxValue) * 100);

            return (
              <div key={`${item.period}-${index}`}>
                <div className="mb-2 flex justify-between gap-3 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">
                    {formatDate(item.period)}
                  </span>

                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatNumber(value)} {item.unit}
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-cyan-500 transition-all"
                    style={{ width: `${width}%` }}
                  />
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {item.patientCount} distinct patients
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------
// Main Page
// --------------------------------------------------

export default function AdminMedicalRecordsPage() {
  const [period, setPeriod] = useState("30d");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAggregates = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response =
        await adminDashboardService.getMedicalAggregates(period);

      setData(response);
    } catch (err) {
      console.error("Medical aggregates error:", err);
      setData(null);
      setError(
        err.message || "Unable to load population medical statistics."
      );
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAggregates();
  }, [fetchAggregates]);

  const metrics = data?.metrics || {};
  const trends = data?.trends || {};
  const privacy = data?.privacy || {};

  const diabetes = data?.diabetesPrevalence;
  const predictions = data?.predictions;

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 sm:p-6 lg:p-8 dark:bg-slate-950">

      {/* Header */}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🩺</span>

            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              Population Medical Records
            </h1>
          </div>

          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Anonymized population-level health statistics based on
            patient medical readings stored in Firestore.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAggregates}
          disabled={loading}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          {loading ? "Refreshing..." : "⟳ Refresh data"}
        </button>
      </div>

      {/* Privacy notice */}

      <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-4 dark:border-cyan-900 dark:bg-cyan-950/30">
        <div className="flex items-start gap-3">
          <span className="text-xl">🔒</span>

          <div>
            <h3 className="text-sm font-semibold text-cyan-900 dark:text-cyan-200">
              Privacy-protected population analytics
            </h3>

            <p className="mt-1 text-xs leading-5 text-cyan-800 dark:text-cyan-300">
              This dashboard displays aggregate statistics only.
              Individual patient identities, medical records and readings
              are not exposed. Metrics are subject to a minimum cohort
              threshold of {privacy.minimumDistinctPatients ?? 50} distinct
              patients.
            </p>
          </div>
        </div>
      </div>

      {/* Period filters */}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Reporting period
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Select the period for population statistics.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {PERIODS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setPeriod(item.value)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold transition ${
                period === item.value
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
            Unable to load medical aggregates
          </p>

          <p className="mt-1 text-sm text-red-700 dark:text-red-400">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchAggregates}
            className="mt-3 text-xs font-semibold text-red-800 underline dark:text-red-300"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading */}

      {loading && (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <div className="h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-cyan-600" />

          <p className="mt-4 text-sm text-slate-500">
            Loading population health statistics...
          </p>
        </div>
      )}

      {/* Dashboard data */}

      {!loading && !error && data && (
        <>
          {/* Environment */}

          <div className="flex flex-wrap justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <p>
              Environment:{" "}
              <span className="font-semibold uppercase">
                {privacy.environment || "Unknown"}
              </span>
            </p>

            <p>
              Last updated: {formatDate(data.generatedAt)}
            </p>
          </div>

          {/* Metrics */}

          <section>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Population health indicators
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Average values calculated from eligible patient readings.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Average systolic BP"
                metric={metrics.averageSystolic}
                icon="❤️"
                description="Blood pressure upper value"
              />

              <MetricCard
                title="Average diastolic BP"
                metric={metrics.averageDiastolic}
                icon="🩺"
                description="Blood pressure lower value"
              />

              <MetricCard
                title="Average fasting glucose"
                metric={metrics.averageGlucose}
                icon="🩸"
                description="Fasting glucose readings only"
              />

              <MetricCard
                title="Average HbA1c"
                metric={metrics.averageHbA1c}
                icon="📊"
                description="Glycated haemoglobin"
              />
            </div>
          </section>

          {/* BP cohort warning */}

          {metrics.averageSystolic?.available &&
            metrics.averageDiastolic?.available &&
            metrics.averageSystolic.patientCount !==
              metrics.averageDiastolic.patientCount && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Blood pressure cohort counts differ
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-400">
                  Systolic and diastolic averages currently use different
                  patient counts. They should not be interpreted as paired
                  population averages until the backend uses the same
                  eligible patient cohort for both.
                </p>
              </div>
            )}

          {/* Trends */}

          <section>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Health trends
              </h2>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Aggregated blood pressure trends over the selected period.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <TrendPanel
                title="Systolic blood pressure"
                data={trends.systolic}
              />

              <TrendPanel
                title="Diastolic blood pressure"
                data={trends.diastolic}
              />
            </div>
          </section>

          {/* Additional indicators */}

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">

            {/* Diabetes prevalence */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Diabetes prevalence
              </h3>

              {diabetes?.available === true ? (
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {formatNumber(diabetes.percentage)}%
                  </p>

                  <p className="mt-2 text-xs text-slate-500">
                    Population-level prevalence
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Unavailable
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {diabetes?.reason ||
                      "Reliable population-level diagnosis data is not available."}
                  </p>
                </div>
              )}
            </div>

            {/* Predictions */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Predictive health analytics
              </h3>

              {predictions?.available === true ? (
                <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Predictions available
                  </p>
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Not available
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    {predictions?.reason ||
                      "No validated population prediction model is currently connected."}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Footer */}

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
              <strong className="text-slate-700 dark:text-slate-200">
                Data protection:
              </strong>{" "}
              Statistics are generated by the backend from eligible
              Firestore readings. Individual patient records are not
              displayed. Metrics below the configured privacy threshold
              may be withheld.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
