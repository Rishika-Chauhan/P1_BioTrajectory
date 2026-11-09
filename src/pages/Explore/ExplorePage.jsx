import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  Heart,
  Droplets,
  Activity,
  ShieldCheck,
  Info,
  Sparkles,
  BookOpen,
  Filter,
  Globe,
  Database,
  Calendar,
  AlertTriangle,
  FileText,
  Thermometer,
  Stethoscope
} from 'lucide-react';
import {
  DISEASES_DATABASE,
  PRIMARY_CATEGORIES,
  SUB_CATEGORIES
} from '../../data/diseasesData';
import { DatasetService, OFFICIAL_SOURCES } from '../../services/datasetService';

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState('library'); // 'library' or 'datasets'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrimaryCategory, setSelectedPrimaryCategory] = useState('All Conditions');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');

  // Dataset explorer filter state
  const [datasetSearch, setDatasetSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedMetric, setSelectedMetric] = useState('All');
  const [datasetsList, setDatasetsList] = useState([]);
  const [isLoadingDatasets, setIsLoadingDatasets] = useState(false);

  // Load datasets when dataset tab is active or filters change
  useEffect(() => {
    let isMounted = true;
    async function fetchDatasets() {
      setIsLoadingDatasets(true);
      try {
        const results = await DatasetService.searchDatasets(datasetSearch, {
          country: selectedCountry,
          year: selectedYear,
          metricType: selectedMetric
        });
        if (isMounted) setDatasetsList(results);
      } catch (err) {
        console.error('Failed to load datasets:', err);
      } finally {
        if (isMounted) setIsLoadingDatasets(false);
      }
    }
    fetchDatasets();
    return () => { isMounted = false; };
  }, [datasetSearch, selectedCountry, selectedYear, selectedMetric]);

  // Filter diseases in library
  const filteredDiseases = useMemo(() => {
    return DISEASES_DATABASE.filter(disease => {
      const matchesPrimary =
        selectedPrimaryCategory === 'All Conditions' ||
        disease.categoryGroup === selectedPrimaryCategory;

      const matchesSub =
        selectedSubCategory === 'All' ||
        disease.subCategory === selectedSubCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        disease.name.toLowerCase().includes(q) ||
        (disease.medicalName && disease.medicalName.toLowerCase().includes(q)) ||
        disease.shortDescription.toLowerCase().includes(q) ||
        disease.signsYouMayNotice.some(s => s.toLowerCase().includes(q));

      return matchesPrimary && matchesSub && matchesSearch;
    });
  }, [searchQuery, selectedPrimaryCategory, selectedSubCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[14px] font-bold bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/25 shadow-xs">
          <BookOpen className="w-4 h-4 text-cyan-500 dark:text-cyan-400" />
          <span>Public Health Library & Official Datasets</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
          Understand Your Health
        </h1>

        <p className="text-[19px] sm:text-[20px] text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Learn about common health problems in simple language, backed by verified global health statistics.
        </p>
      </div>

      {/* Main View Mode Selector (Library vs Official Datasets) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-card text-[15px] font-semibold w-fit shadow-xs">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'library'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-xs active:scale-95'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Disease Information Library
          </button>
          <button
            onClick={() => setActiveTab('datasets')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'datasets'
                ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-xs active:scale-95'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Official Health Datasets</span>
          </button>
        </div>

        <span className="text-[14px] text-slate-500 dark:text-slate-400">
          Sources: WHO GHO, India Data.gov.in, and CDC
        </span>
      </div>

      {/* TAB 1: DISEASE INFORMATION LIBRARY */}
      {activeTab === 'library' && (
        <div className="space-y-8">
          
          {/* Important Symptom Notice */}
          <div className="p-5 rounded-3xl bg-cyan-500/10 border border-cyan-500/25 flex items-start gap-4 text-[15px] text-slate-800 dark:text-slate-200 leading-relaxed shadow-xs">
            <AlertTriangle className="w-6 h-6 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-cyan-800 dark:text-cyan-300">Important Medical Context:</strong>{' '}
              Fever, cough, and jaundice are natural warning signs of an underlying condition (like an infection, allergy, or liver issue), rather than diseases by themselves. Always look for the root cause with a healthcare provider.
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search a health problem..."
              className="w-full pl-14 pr-12 py-4 rounded-2xl glass-card text-[17px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/60 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {/* Primary Category Tabs */}
          <div className="space-y-3">
            <p className="text-[14px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Categories
            </p>
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
              {PRIMARY_CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedPrimaryCategory(category);
                    setSelectedSubCategory('All');
                  }}
                  className={`px-5 py-2.5 rounded-2xl text-[15px] font-semibold shrink-0 transition-all cursor-pointer ${
                    selectedPrimaryCategory === category
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20 active:scale-95'
                      : 'glass-card text-slate-700 dark:text-slate-300 hover:border-cyan-500/50'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {SUB_CATEGORIES.map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-3.5 py-1.5 rounded-xl text-[13px] font-medium shrink-0 transition-all cursor-pointer ${
                  selectedSubCategory === sub
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

          {/* Disease Cards Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-[15px] text-slate-500 dark:text-slate-400 font-medium">
                Showing {filteredDiseases.length} health condition{filteredDiseases.length !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredDiseases.length === 0 ? (
              <div className="p-12 text-center rounded-3xl glass-card space-y-4">
                <Info className="w-10 h-10 text-cyan-500 dark:text-cyan-400 mx-auto" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">No results found</h3>
                <p className="text-[16px] text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  Try searching with a different word or select "All Conditions" above.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedPrimaryCategory('All Conditions');
                    setSelectedSubCategory('All');
                  }}
                  className="px-6 py-2.5 rounded-xl text-[15px] font-bold bg-cyan-400 text-slate-950 cursor-pointer shadow-xs active:scale-95"
                >
                  Reset Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDiseases.map(disease => (
                  <Link
                    key={disease.id}
                    to={`/explore/${disease.id}`}
                    className="glass-card glass-card-hover group p-6 sm:p-7 rounded-3xl flex flex-col justify-between space-y-5 transition-all"
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                          {disease.categoryGroup}
                        </span>

                        {disease.isSymptomSign && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                            Sign / Symptom
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                        {disease.name}
                      </h3>

                      <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        {disease.shortDescription}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[15px] font-bold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
                      <span>Read Simple Guide</span>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: OFFICIAL HEALTH DATASETS (WHO, INDIA DATA.GOV.IN, CDC) */}
      {activeTab === 'datasets' && (
        <div className="space-y-8">
          
          {/* Section Introduction */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Official Disease Datasets & Statistics
              </h2>
            </div>
            <p className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore public health statistics retrieved directly from official government surveillance portals and the World Health Organization. We clearly distinguish between reported cases, estimated cases, prevalence, and incidence rates.
            </p>

            {/* Official Source Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {OFFICIAL_SOURCES.map(src => (
                <div key={src.id} className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 border border-slate-200 dark:border-slate-800 text-[14px]">
                  <p className="font-bold text-slate-900 dark:text-white">{src.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{src.coverage}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dataset Filters */}
          <div className="p-6 rounded-3xl glass-card space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Keyword Search */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Search Disease / Keyword
                </label>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={datasetSearch}
                    onChange={e => setDatasetSearch(e.target.value)}
                    placeholder="e.g. Dengue, TB, Diabetes..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-[15px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              {/* Country Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={e => setSelectedCountry(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-[15px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                >
                  <option value="All">All Countries / Regions</option>
                  <option value="India">India (National / MOHFW)</option>
                  <option value="Global">Global (Worldwide / WHO)</option>
                  <option value="United States">United States (CDC)</option>
                </select>
              </div>

              {/* Year Filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-[15px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                >
                  <option value="All">All Available Years</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>

              {/* Metric Type */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Measurement Type
                </label>
                <select
                  value={selectedMetric}
                  onChange={e => setSelectedMetric(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-[15px] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                >
                  <option value="All">All Measurements</option>
                  <option value="Reported Cases">Reported Cases</option>
                  <option value="Estimated Cases">Estimated Cases</option>
                  <option value="Prevalence Rate">Prevalence Rate</option>
                  <option value="Incidence Rate">Incidence Rate</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dataset Results Table / Cards */}
          <div className="space-y-4">
            <p className="text-[15px] text-slate-500 dark:text-slate-400 font-medium">
              Found {datasetsList.length} verified official dataset{datasetsList.length !== 1 ? 's' : ''}
            </p>

            {datasetsList.length === 0 ? (
              <div className="p-12 text-center rounded-3xl glass-card space-y-3">
                <Info className="w-10 h-10 text-cyan-500 mx-auto" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Reliable statistics are currently unavailable for this region.
                </h3>
                <p className="text-[15px] text-slate-500 dark:text-slate-400">
                  Try adjusting the country or year filter to view official statistics from other reporting periods.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {datasetsList.map(ds => (
                  <div
                    key={ds.id}
                    className="p-6 sm:p-7 rounded-3xl glass-card glass-card-hover space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
                            {ds.country} ({ds.region})
                          </span>
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                            {ds.metricType}
                          </span>
                          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            Year {ds.year}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                          {ds.datasetName}
                        </h3>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <span className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 block font-mono">
                          {typeof ds.value === 'number' ? ds.value.toLocaleString() : ds.value}
                        </span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {ds.unit}
                        </span>
                      </div>
                    </div>

                    <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      <strong>Measurement Definition:</strong> {ds.definition}
                    </p>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <span>Source: <strong className="text-slate-700 dark:text-slate-300">{ds.source}</strong></span>
                      <span>Last Updated: {ds.lastUpdated}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
