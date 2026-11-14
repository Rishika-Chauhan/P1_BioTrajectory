import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Info,
  CheckCircle2,
  Share2,
  ShieldCheck,
  AlertTriangle,
  Database,
  Camera,
  LogIn,
  Check
} from 'lucide-react';
import { DISEASES_DATABASE } from '../../data/diseasesData';
import { DatasetService } from '../../services/datasetService';
import { getDiseaseImages } from '../../data/diseaseImages';

export default function DiseaseDetailPage() {
  const { id } = useParams();
  const disease = DISEASES_DATABASE.find(d => d.id === id);
  const diseaseImages = disease ? getDiseaseImages(disease.id) : null;

  // Official statistics state
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [statsData, setStatsData] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [copied, setCopied] = useState(false);

  const isMountedRef = React.useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    if (!disease) return;

    async function loadStats() {
      setIsLoadingStats(true);
      try {
        const stats = await DatasetService.getDiseaseStatistics(disease.name, {
          country: selectedCountry,
          year: selectedYear
        });
        if (isMountedRef.current) setStatsData(stats);
      } catch (err) {
        console.error('Failed to load disease statistics:', err);
      } finally {
        if (isMountedRef.current) setIsLoadingStats(false);
      }
    }

    loadStats();
    return () => {
      isMountedRef.current = false;
    };
  }, [disease, selectedCountry, selectedYear]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!disease) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Topic Not Found</h2>
        <p className="text-[18px] text-slate-600 dark:text-slate-400">
          We could not find this health guide. It may have moved or been updated.
        </p>
        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[16px] font-bold bg-cyan-400 text-slate-950 shadow-md active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Health Library</span>
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-[16px] font-bold glass-card text-slate-900 dark:text-white hover:border-cyan-500/50 active:scale-95 cursor-pointer"
          >
            <LogIn className="w-5 h-5" />
            <span>Go to Login</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Navigation Top Bar: Back to Library & Back to Login */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-[14px] font-bold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Health Library</span>
          </Link>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-[14px] font-bold text-cyan-700 dark:text-cyan-300 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        </div>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-white px-4 py-2.5 rounded-xl glass-card cursor-pointer active:scale-95 transition-all shadow-xs"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4 text-cyan-500" />}
          <span>{copied ? 'Link Copied!' : 'Share Guide'}</span>
        </button>
      </div>

      {/* Main Header Banner with Hero Photo Accent */}
      <div className="p-8 sm:p-10 rounded-3xl glass-card border border-cyan-500/25 shadow-xl space-y-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
        
        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <span className="text-[13px] font-bold px-3.5 py-1 rounded-xl bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
            {disease.categoryGroup}
          </span>
          <span className="text-[13px] text-slate-500 dark:text-slate-400 italic">
            Medical term: <strong className="font-semibold not-italic text-slate-700 dark:text-slate-300">{disease.medicalName}</strong>
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight relative z-10">
          {disease.name}
        </h1>

        <p className="text-[18px] sm:text-[20px] text-slate-700 dark:text-slate-200 leading-relaxed font-normal relative z-10 max-w-3xl">
          {disease.shortDescription}
        </p>
      </div>

      {/* VISUAL CLINICAL GUIDE & RELATED PICTURES */}
      {diseaseImages && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-white">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">Related Clinical & Health Pictures</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Visual depictions of clinical presentations, medical tests, and healthy habits
                </p>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {diseaseImages.badge}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Picture 1: Clinical / Patient Presentation */}
            <div className="rounded-3xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg group hover:border-cyan-500/40 transition-all">
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={diseaseImages.primaryImage}
                  alt={`${disease.name} overview`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                  Clinical Overview
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span>{disease.name} — Clinical Presentation</span>
                </p>
                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {diseaseImages.primaryCaption}
                </p>
              </div>
            </div>

            {/* Picture 2: Diagnostic Testing & Prevention */}
            <div className="rounded-3xl glass-card border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg group hover:border-cyan-500/40 transition-all">
              <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={diseaseImages.secondaryImage}
                  alt={`${disease.name} diagnostic test`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-cyan-900/80 backdrop-blur-md text-[11px] font-bold text-cyan-200 border border-cyan-400/30">
                  Diagnosis & Prevention
                </div>
              </div>
              <div className="p-4 space-y-1.5">
                <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>Testing & Self-Care Approach</span>
                </p>
                <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                  {diseaseImages.secondaryCaption}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

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
      <div className="p-5 rounded-2xl bg-cyan-50/90 dark:bg-[#0b1728] border border-cyan-300/80 dark:border-cyan-800/60 flex items-start gap-3.5 text-sm text-slate-800 dark:text-slate-200 leading-relaxed shadow-xs">
        <Info className="w-5 h-5 text-cyan-700 dark:text-cyan-400 shrink-0 mt-0.5" />
        <p className="font-medium">
          <strong>Medical Notice:</strong> This guide is for educational understanding and personal tracking. It does not provide an individual medical diagnosis. Always consult a qualified doctor for health advice and treatment.
        </p>
      </div>

      {/* 8 COMPREHENSIVE SECTIONS */}
      <div className="space-y-8">
        
        {/* 1. What is it? */}
        <section className="p-8 rounded-3xl glass-card space-y-4">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              1
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">What is it?</h2>
          </div>
          <p className="text-[17px] text-slate-700 dark:text-slate-200 leading-relaxed pl-2 sm:pl-13">
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
          <ul className="space-y-3 pl-2 sm:pl-13">
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
          <ul className="space-y-3 pl-2 sm:pl-13">
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
          <p className="text-[17px] text-slate-700 dark:text-slate-200 leading-relaxed pl-2 sm:pl-13">
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
          <ul className="space-y-3 pl-2 sm:pl-13">
            {disease.whoIsAtRisk.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[16px] text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 mt-2" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 6. How can you reduce the risk */}
        <section className="p-8 rounded-3xl glass-card space-y-4">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              6
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">How can you reduce the risk?</h2>
          </div>
          <ul className="space-y-3 pl-2 sm:pl-13">
            {disease.howToReduceRisk.map((step, idx) => (
              <li key={idx} className="flex items-start gap-3 text-[16px] text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-2" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 7. When should you visit a doctor */}
        <section className="p-8 rounded-3xl glass-card space-y-4">
          <div className="flex items-center gap-3 text-slate-900 dark:text-white">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              7
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold">When should you visit a doctor?</h2>
          </div>
          <ul className="space-y-3 pl-2 sm:pl-13">
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
          <p className="text-[17px] text-slate-700 dark:text-slate-200 leading-relaxed pl-2 sm:pl-13">
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

      {/* Bottom Navigation & Call to Action with Back to Login Button */}
      <div className="p-8 sm:p-10 rounded-3xl glass-card border border-cyan-500/30 shadow-xl space-y-6 text-center">
        <div className="max-w-xl mx-auto space-y-2">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Track and Monitor Your Health Records
          </h3>
          <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Sign in to BioTrajectory to log your daily blood pressure, blood glucose, and test reports with intelligent AI insights.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl text-[16px] font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/25 active:scale-95 cursor-pointer"
          >
            <LogIn className="w-5 h-5" />
            <span>Back to Login Page</span>
          </Link>

          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl text-[16px] font-bold glass-card text-slate-800 dark:text-white hover:border-cyan-500/50 transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to All Health Topics</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
