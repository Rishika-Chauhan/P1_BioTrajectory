import React, { useState } from 'react';
import {
  Stethoscope,
  Search,
  Filter,
  AlertTriangle,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  Activity,
  HeartPulse
} from 'lucide-react';
import { DISEASES_DATABASE } from '../../data/diseasesData';
import { CLINICAL_DETAILS_BY_ID } from '../../data/doctorExploreData';

export default function DoctorExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedDiseaseId, setExpandedDiseaseId] = useState(null);
  const [viewPerspective, setViewPerspective] = useState('clinical'); // 'clinical' | 'patient'

  const categories = [
    { id: 'all', label: 'All Conditions (35)' },
    { id: 'common', label: 'Common Illnesses' },
    { id: 'chronic', label: 'Chronic & Lifestyle' },
    { id: 'cancer', label: 'Oncology' },
  ];

  const filteredDiseases = DISEASES_DATABASE.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.simpleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory === 'common') return d.category === 'Common Illnesses';
    if (selectedCategory === 'chronic') return d.category === 'Other Health Problems';
    if (selectedCategory === 'cancer') return d.category === 'Cancer Types';
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedDiseaseId(expandedDiseaseId === id ? null : id);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              Clinical Knowledge Base
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
            Disease Protocols & Clinical Guidelines
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
            Standard diagnostic pathways, pharmacotherapy protocols, and referral triggers for 35 conditions.
          </p>
        </div>

        {/* View Perspective Switcher */}
        <div className="p-1 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center gap-1 self-start sm:self-auto">
          <button
            onClick={() => setViewPerspective('clinical')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewPerspective === 'clinical'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Clinical Protocol View
          </button>
          <button
            onClick={() => setViewPerspective('patient')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              viewPerspective === 'patient'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Patient-Friendly View
          </button>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by medical condition or simple name..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Diseases List */}
      <div className="space-y-4">
        {filteredDiseases.map((d) => {
          const clinical = CLINICAL_DETAILS_BY_ID[d.id] || {
            recommendedDiagnosticTests: ['Complete Blood Count (CBC)', 'Organ-specific metabolic panel'],
            treatmentOptions: ['Standard evidence-based clinical management', 'Symptomatic relief'],
            possibleComplications: ['Secondary systemic complications if untreated'],
            specialistReferralCriteria: ['Atypical presentation or poor response to initial therapy'],
          };
          const tests = clinical.recommendedDiagnosticTests || clinical.diagnosticTests || [];
          const treatments = clinical.treatmentOptions || clinical.treatmentGuidelines || [];
          const complications = clinical.possibleComplications || clinical.complications || [];
          const referralTriggers = clinical.specialistReferralCriteria || clinical.referralTriggers || [];
          const isExpanded = expandedDiseaseId === d.id;

          return (
            <div
              key={d.id}
              className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm transition-all"
            >
              <div
                onClick={() => toggleExpand(d.id)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-bold text-lg flex items-center justify-center shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        {d.name}
                      </h3>
                      {d.simpleName !== d.name && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          ({d.simpleName})
                        </span>
                      )}
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                        {d.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-1">
                      {d.whatIsIt}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold hidden sm:inline">
                    {isExpanded ? 'Hide Protocol' : 'Clinical Details'}
                  </span>
                  <div className="p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              {/* Expanded Clinical Sections */}
              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-5">
                  {viewPerspective === 'clinical' ? (
                    /* Clinical View */
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                      {/* Diagnostic Tests */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                          <FileCheck2 className="w-4 h-4 text-blue-500" />
                          <span>Recommended Diagnostic Workup</span>
                        </div>
                        <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                          {tests.map((t, idx) => (
                            <li key={idx}>• {t}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Treatment Protocols */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                          <Activity className="w-4 h-4 text-teal-500" />
                          <span>Standard Therapeutic Guidelines</span>
                        </div>
                        <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                          {treatments.map((g, idx) => (
                            <li key={idx}>• {g}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Clinical Complications */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                          <HeartPulse className="w-4 h-4 text-purple-500" />
                          <span>Potential Complications & Risks</span>
                        </div>
                        <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                          {complications.map((c, idx) => (
                            <li key={idx}>• {c}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Specialist Referral Triggers */}
                      <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-rose-900 dark:text-rose-300">
                          <AlertTriangle className="w-4 h-4 text-rose-500" />
                          <span>Red Flags & Specialist Referral Triggers</span>
                        </div>
                        <ul className="space-y-1 text-rose-800 dark:text-rose-300">
                          {referralTriggers.map((r, idx) => (
                            <li key={idx}>• {r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    /* Patient-Friendly Explanation View */
                    <div className="p-4 rounded-xl bg-teal-50/40 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/40 space-y-3 text-xs">
                      <div>
                        <strong className="text-teal-900 dark:text-teal-200 block font-bold mb-1">
                          How this is explained to the patient:
                        </strong>
                        <p className="text-slate-700 dark:text-slate-300">{d.whatIsIt}</p>
                      </div>
                      <div>
                        <strong className="text-teal-900 dark:text-teal-200 block font-bold mb-1">
                          Signs the patient is instructed to notice:
                        </strong>
                        <ul className="list-disc pl-4 space-y-0.5 text-slate-700 dark:text-slate-300">
                          {d.signs?.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Evidence-based clinical guidelines reviewed for verified BioTrajectory practitioners.</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
