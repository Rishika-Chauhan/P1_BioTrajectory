import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Info,
  HelpCircle,
  AlertCircle,
  Eye,
  Users,
  BarChart2,
  CheckCircle2,
  Stethoscope,
  BookOpen,
  Share2,
  Wind,
  ShieldCheck,
  AlertTriangle,
  Database,
  Calendar,
  Globe
} from 'lucide-react';
import { DISEASES_DATABASE } from '../../data/diseasesData';
import { DatasetService } from '../../services/datasetService';

export default function DiseaseDetailPage() {
  const { id } = useParams();
  const disease = DISEASES_DATABASE.find(d => d.id === id);

  // Official statistics state
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [statsData, setStatsData] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    if (!disease) return;

    let isMounted = true;
    async function loadStats() {
      setIsLoadingStats(true);
      try {
        const stats = await DatasetService.getDiseaseStatistics(disease.name, {
          country: selectedCountry,
          year: selectedYear
        });
        if (isMounted) setStatsData(stats);
      } catch (err) {
        console.error('Failed to load disease statistics:', err);
      } finally {
        if (isMounted) setIsLoadingStats(false);
      }
    }

    loadStats();
    return () => { isMounted = false; };
  }, [disease, selectedCountry, selectedYear]);

  if (!disease) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Topic Not Found</h2>
        <p className="text-[18px] text-slate-600 dark:text-slate-400">We could not find this health guide.</p>
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[16px] font-bold bg-cyan-400 text-slate-950 shadow-md active:scale-95 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to All Health Topics</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Back Link & Share */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-[15px] font-bold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Health Library</span>
        </Link>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert('Guide link copied to clipboard!');
          }}
          className="inline-flex items-center gap-2 text-[14px] font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white px-4 py-2 rounded-xl glass-card cursor-pointer active:scale-95 transition-all"
        >
          <Share2 className="w-4 h-4 text-cyan-500" />
          <span>Share Guide</span>
        </button>
      </div>

      {/* Main Header Banner */}
      <div className="p-8 sm:p-10 rounded-3xl glass-card border border-cyan-500/25 shadow-xl space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[90px] pointer-events-none rounded-full" />
        
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <span className="text-[14px] font-bold px-3.5 py-1 rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/25">
            {disease.categoryGroup}
          </span>
          <span className="text-[14px] text-slate-500 dark:text-slate-400 italic">
            Medical term: {disease.medicalName}
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight relative z-10">
          {disease.name}
        </h1>

        <p className="text-[18px] sm:text-[20px] text-slate-700 dark:text-slate-200 leading-relaxed font-normal relative z-10">
          {disease.shortDescription}
        </p>
      </div>

      {/* Critical Sign / Symptom Notice */}
      {disease.isSymptomSign && (
        <div className="p-6 rounded-3xl bg-cyan-500/10 border-2 border-cyan-500/30 flex items-start gap-4 text-[16px] text-slate-900 dark:text-slate-100 leading-relaxed shadow-xs">
          <AlertTriangle className="w-7 h-7 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <h3 className="font-bold text-lg text-cyan-800 dark:text-cyan-300">
              Understanding Symptoms vs Diseases
            </h3>
            <p className="text-slate-700 dark:text-slate-300">
              {disease.symptomNotice}
            </p>
          </div>
        </div>
      )}

      {/* Non-Diagnostic Disclaimer */}
      <div className="p-5 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-start gap-4 text-[15px] text-slate-700 dark:text-slate-300 leading-relaxed">
        <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-1" />
        <p>
          <strong>Medical Notice:</strong> This guide is for educational understanding and personal tracking. It does not provide an individual medical diagnosis. Always consult a qualified doctor for health advice and treatment.
        </p>
      </div>

      {/* 8 REQUIRED SECTIONS */}
      <div className="space-y-8">
        
        {/* 1. What is it? */}
        <section className="p-8 rounded-3xl glass-card space-y-4">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              1
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">What is it?</h2>
          </div>
          <p className="text-[17px] text-slate-700 dark:text-slate-200 leading-relaxed pl-13">
            {disease.whatIsIt}
          </p>
        </section>

        {/* 2. Why does it happen? */}
        <section className="p-8 rounded-3xl glass-card space-y-4">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              2
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">Why does it happen?</h2>
          </div>
          <ul className="space-y-3 pl-13">
            {disease.whyDoesItHappen.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[16px] text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. Signs you may notice */}
        <section className="p-8 rounded-3xl glass-card space-y-4">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              3
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">Signs you may notice</h2>
          </div>
          <ul className="space-y-3 pl-13">
            {disease.signsYouMayNotice.map((sign, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[16px] text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 shrink-0 mt-2" />
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 4. How does it spread, if applicable? */}
        <section className="p-8 rounded-3xl glass-card space-y-4">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              4
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">How does it spread, if applicable?</h2>
          </div>
          <p className="text-[17px] text-slate-700 dark:text-slate-200 leading-relaxed pl-13">
            {disease.howDoesItSpread}
          </p>
        </section>

        {/* 5. Who may be at risk? */}
        <section className="p-8 rounded-3xl glass-card space-y-4">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              5
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">Who may be at risk?</h2>
          </div>
          <ul className="space-y-3 pl-13">
            {disease.whoIsAtRisk.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[16px] text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 6. How to reduce the risk */}
        <section className="p-8 rounded-3xl glass-card space-y-4">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              6
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">How can you reduce the risk?</h2>
          </div>
          <ul className="space-y-3 pl-13">
            {disease.howToReduceRisk.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[16px] text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 7. When to visit a doctor */}
        <section className="p-8 rounded-3xl glass-card space-y-4">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              7
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">When should you visit a doctor?</h2>
          </div>
          <ul className="space-y-3 pl-13">
            {disease.whenToSeeDoctor.map((warning, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[16px] text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 8. How common is it? */}
        <section className="p-8 rounded-3xl glass-card space-y-4">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              8
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">How common is it?</h2>
          </div>
          <p className="text-[17px] text-slate-700 dark:text-slate-200 leading-relaxed pl-13">
            {disease.howCommonIsIt}
          </p>
        </section>

        {/* Medically Verified References */}
        <section className="p-8 rounded-3xl glass-card space-y-3">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Medically Verified References
          </h3>
          <ul className="space-y-2 text-[15px] text-slate-600 dark:text-slate-400">
            {disease.reliableSources.map((source, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0" />
                <span>{source}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* SECTION E: OFFICIAL DATASETS & REGIONAL STATISTICS INTEGRATION */}
        <section className="p-8 rounded-3xl glass-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-sm font-bold uppercase tracking-wider">
                <Database className="w-4 h-4" />
                <span>Official Surveillance Statistics</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                Public Datasets for {disease.name}
              </h3>
            </div>

            {/* Regional Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedCountry}
                onChange={e => setSelectedCountry(e.target.value)}
                className="py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="All">All Regions</option>
                <option value="India">India (data.gov.in)</option>
                <option value="Global">Global (WHO)</option>
                <option value="United States">United States (CDC)</option>
              </select>

              <select
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                className="py-2.5 px-3.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="All">All Years</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
              </select>
            </div>
          </div>

          {/* Dataset Results View */}
          {isLoadingStats ? (
            <p className="text-[16px] text-slate-400 py-6 text-center">Loading verified statistics...</p>
          ) : statsData && !statsData.hasData ? (
            <div className="p-8 text-center rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 border border-slate-200 dark:border-slate-800 space-y-2">
              <Info className="w-8 h-8 text-cyan-500 mx-auto" />
              <p className="text-[16px] font-bold text-slate-900 dark:text-white">
                Reliable statistics are currently unavailable for this region.
              </p>
              <p className="text-[14px] text-slate-500 dark:text-slate-400">
                Official surveillance data has not yet been registered for the chosen country/year combination.
              </p>
            </div>
          ) : statsData && statsData.datasets.length > 0 ? (
            <div className="space-y-4">
              {statsData.datasets.map(ds => (
                <div
                  key={ds.id}
                  className="p-6 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 border border-slate-200 dark:border-slate-800 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                          {ds.country} ({ds.region})
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          {ds.metricType}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          Year {ds.year}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mt-1.5">
                        {ds.datasetName}
                      </h4>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 font-mono block">
                        {typeof ds.value === 'number' ? ds.value.toLocaleString() : ds.value}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {ds.unit}
                      </span>
                    </div>
                  </div>

                  <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Definition:</strong> {ds.definition}
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span>Source: <strong className="text-slate-700 dark:text-slate-300">{ds.source}</strong></span>
                    <span>Last Updated: {ds.lastUpdated}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 border border-slate-200 dark:border-slate-800 space-y-2">
              <Info className="w-8 h-8 text-cyan-500 mx-auto" />
              <p className="text-[16px] font-bold text-slate-900 dark:text-white">
                Reliable statistics are currently unavailable for this region.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
