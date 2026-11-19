import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Search,
  Filter,
  AlertTriangle,
  FileCheck2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Activity,
  HeartPulse,
  Pill,
  FlaskConical,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Clock,
  BadgeAlert,
  Info,
  Layers,
  ArrowRight
} from 'lucide-react';
import { GLOBAL_DISEASE_LIST, GLOBAL_DISEASE_DATASETS } from '../../data/doctorExploreData';
import { useLanguage } from '../../context/LanguageContext';

export default function DoctorExplorePage() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [pillarFocus, setPillarFocus] = useState('all'); // 'all' | 'tests' | 'symptoms' | 'prescriptions'
  const [expandedIds, setExpandedIds] = useState(() => new Set(['diabetes', 'high-blood-pressure', 'dengue', 'colon-cancer']));
  const [copiedKey, setCopiedKey] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const categories = [
    { id: 'all', label: isHi ? 'सभी 35 रोग (All 35)' : 'All Conditions (35)', count: 35 },
    { id: 'common', label: isHi ? 'सामान्य बीमारियाँ (Common)' : 'Common Illnesses (12)', count: 12 },
    { id: 'chronic', label: isHi ? 'क्रोनिक व लाइफस्टाइल (Chronic)' : 'Chronic & Lifestyle (7)', count: 7 },
    { id: 'cancer', label: isHi ? 'ऑन्कोलॉजी / कैंसर (Cancer)' : 'Oncology / Cancers (16)', count: 16 },
  ];

  const pillarFilters = [
    { id: 'all', label: isHi ? 'तीनों स्तंभ (All 3 Pillars)' : 'All 3 Clinical Pillars', icon: Layers },
    { id: 'tests', label: isHi ? 'आवश्यक जाँच (Required Tests)' : 'Required Tests', icon: FlaskConical },
    { id: 'symptoms', label: isHi ? 'लक्षण (Symptoms)' : 'Clinical Symptoms', icon: Stethoscope },
    { id: 'prescriptions', label: isHi ? 'दवा / नुस्खा (Prescriptions)' : 'Prescriptions & Regimens', icon: Pill },
  ];

  const filteredDiseases = useMemo(() => {
    return GLOBAL_DISEASE_LIST.filter((d) => {
      // Category filter
      if (selectedCategory === 'common' && d.category !== 'Common Illnesses') return false;
      if (selectedCategory === 'chronic' && d.category !== 'Other Health Problems') return false;
      if (selectedCategory === 'cancer' && d.category !== 'Cancer Types') return false;

      // Search matching across all clinical dimensions
      if (!searchTerm.trim()) return true;

      const q = searchTerm.toLowerCase();

      // Basic fields
      const matchesBasic =
        (d.name && d.name.toLowerCase().includes(q)) ||
        (d.medicalName && d.medicalName.toLowerCase().includes(q)) ||
        d.icdCode?.toLowerCase().includes(q) ||
        d.datasetSource?.toLowerCase().includes(q) ||
        d.subCategory?.toLowerCase().includes(q);

      if (matchesBasic) return true;

      // Diagnostic tests
      const matchesTest = d.requiredTests?.some(
        (t) =>
          t.testName.toLowerCase().includes(q) ||
          t.purpose.toLowerCase().includes(q) ||
          t.type.toLowerCase().includes(q)
      );
      if (matchesTest) return true;

      // Symptoms
      const matchesSymptom =
        d.symptoms?.hallmark?.some((s) => s.toLowerCase().includes(q)) ||
        d.symptoms?.earlySigns?.some((s) => s.toLowerCase().includes(q)) ||
        d.symptoms?.redFlags?.some((s) => s.toLowerCase().includes(q));
      if (matchesSymptom) return true;

      // Prescriptions
      const matchesRx = d.prescriptions?.some(
        (p) =>
          p.drugName.toLowerCase().includes(q) ||
          p.regimenType.toLowerCase().includes(q) ||
          p.clinicalNotes.toLowerCase().includes(q)
      );
      if (matchesRx) return true;

      return false;
    });
  }, [selectedCategory, searchTerm]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedIds(new Set(filteredDiseases.map((d) => d.id)));
  };

  const collapseAll = () => {
    setExpandedIds(new Set());
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const copyToClipboard = (text, key, label = 'Prescription copied to clipboard') => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    triggerToast(label);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2500);
  };

  const handlePrescribeForPatient = (med, disease) => {
    const params = new URLSearchParams({
      medName: med.drugName,
      strength: med.strength || '',
      form: med.dosageForm || 'Tablet',
      freq: med.frequency || 'Once Daily',
      timing: med.timing || 'Morning after meals',
      duration: med.duration || '14 Days',
      disease: disease.name,
      notes: med.clinicalNotes || `Guideline protocol for ${disease.name}`,
    });
    navigate(`/doctor/prescriptions/new?${params.toString()}`);
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl border border-slate-700 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-5 duration-200 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              {isHi ? 'वैश्विक स्वास्थ्य क्लिनिकल डेटाबेस' : 'Global Health Clinical Knowledgebase'}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-medium">
              WHO • CDC • NCCN 2026 • AHA/ACC • ADA • KDIGO
            </span>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {isHi ? 'रोग प्रोटोकॉल व वैश्विक क्लिनिकल दिशानिर्देश' : 'Disease Protocols & Global Clinical Guidelines'}
            </h1>
            <p className="text-blue-100/80 text-xs sm:text-sm mt-2 leading-relaxed">
              {isHi
                ? '35 प्रमुख बीमारियों के लिए आवश्यक जाँचें (Required Tests), लक्षण (Symptoms), और साक्ष्य-आधारित दवा नुस्खे (Evidence-Based Prescriptions) सीधे एक ही स्थान पर उपलब्ध।'
                : 'Direct access to Required Diagnostic Tests, Hallmark & Red-Flag Symptoms, and Evidence-Based Pharmacotherapy Prescriptions across all 35 health conditions.'}
            </p>
          </div>

          {/* Quick Stats Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-blue-300 font-bold text-lg sm:text-xl">35 Diseases</div>
              <div className="text-slate-300 text-[11px]">Full Clinical Datasets</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-teal-300 font-bold text-lg sm:text-xl">120+ Tests</div>
              <div className="text-slate-300 text-[11px]">Lab & Imaging Protocols</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-amber-300 font-bold text-lg sm:text-xl">Red Flags</div>
              <div className="text-slate-300 text-[11px]">Emergency Indicators</div>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="text-rose-300 font-bold text-lg sm:text-xl">110+ Prescriptions</div>
              <div className="text-slate-300 text-[11px]">Dose, Timing & Precautions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Category Filters, and Pillar View Toggle */}
      <div className="space-y-4">
        {/* Universal Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              isHi
                ? 'रोग का नाम, जाँच (उदा. HbA1c, Troponin), लक्षण (उदा. छाती में दर्द, बुखार), या दवा (उदा. Metformin, Telmisartan) खोजें...'
                : 'Search by disease name, test (e.g. HbA1c, Troponin, GeneXpert), symptom (e.g. chest pain, fever), or drug (e.g. Metformin, Telmisartan)...'
            }
            className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Rows */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pt-1">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Pillar Focus Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 self-stretch sm:self-auto overflow-x-auto">
            {pillarFilters.map((p) => {
              const Icon = p.icon;
              const isActive = pillarFocus === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPillarFocus(p.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter & Global Accordion Controller */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-slate-900 dark:text-white">{filteredDiseases.length}</strong> of 35 clinical datasets
            </span>
            {searchTerm && (
              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 text-[11px] font-medium">
                filtered by "{searchTerm}"
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              Expand All
            </button>
            <span>•</span>
            <button
              onClick={collapseAll}
              className="text-xs text-slate-500 dark:text-slate-400 hover:underline font-semibold"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Disease Cards List */}
      <div className="space-y-6">
        {filteredDiseases.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
              <Search className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">No Matching Clinical Protocols Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              We couldn't find any disease matching "{searchTerm}". Try searching by generic drug name, symptom, or diagnostic test.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow hover:bg-blue-700"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          filteredDiseases.map((d) => {
            const isExpanded = expandedIds.has(d.id);
            const tests = d.requiredTests || [];
            const symptoms = d.symptoms || {};
            const prescriptions = d.prescriptions || [];

            // Quick summary text for clipboard
            const fullProtocolText = `BIO-TRAJECTORY CLINICAL PROTOCOL
Condition: ${d.name} (${d.medicalName}) [ICD: ${d.icdCode || 'N/A'}]
Standard: ${d.datasetSource} (${d.evidenceLevel})

1. REQUIRED DIAGNOSTIC TESTS:
${tests.map((t) => `• ${t.testName} [${t.type}] - ${t.purpose} (${t.urgency})`).join('\n')}

2. CLINICAL SYMPTOMS:
Hallmark: ${symptoms.hallmark?.join(', ') || 'N/A'}
Early Signs: ${symptoms.earlySigns?.join(', ') || 'N/A'}
Red Flags: ${symptoms.redFlags?.join('; ') || 'N/A'}

3. EVIDENCE-BASED PRESCRIPTIONS:
${prescriptions
  .map(
    (p) =>
      `• ${p.drugName} ${p.strength} (${p.dosageForm})\n  Frequency: ${p.frequency} | Timing: ${p.timing} | Duration: ${p.duration}\n  Regimen: ${p.regimenType}\n  Clinical Notes: ${p.clinicalNotes}`
  )
  .join('\n\n')}`;

            return (
              <div
                key={d.id}
                className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all"
              >
                {/* Card Header */}
                <div
                  onClick={() => toggleExpand(d.id)}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-md shadow-blue-500/10">
                      <Stethoscope className="w-6 h-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg">
                          {d.name}
                        </h2>
                        {d.medicalName && d.medicalName !== d.name && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            ({d.medicalName})
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
                          {d.category}
                        </span>
                        {d.icdCode && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            ICD-10: {d.icdCode}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          {d.datasetSource}
                        </span>
                        <span>•</span>
                        <span className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                          {d.evidenceLevel}
                        </span>
                      </div>

                      {d.overview && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 pt-0.5">
                          {d.overview}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Expand Chevron */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(fullProtocolText, `full-${d.id}`, 'Full disease clinical protocol copied!');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors"
                      title="Copy Complete Clinical Protocol"
                    >
                      {copiedKey === `full-${d.id}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Protocol</span>
                        </>
                      )}
                    </button>

                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed 3-Pillar Clinical Architecture */}
                {isExpanded && (
                  <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-6">
                    {/* The 3 Core Pillars in Responsive Grid */}
                    <div
                      className={`grid gap-6 ${
                        pillarFocus === 'all'
                          ? 'grid-cols-1 lg:grid-cols-3'
                          : 'grid-cols-1'
                      }`}
                    >
                      {/* ======================================================== */}
                      {/* PILLAR 1: REQUIRED DIAGNOSTIC TESTS                      */}
                      {/* ======================================================== */}
                      {(pillarFocus === 'all' || pillarFocus === 'tests') && (
                        <div className="p-5 rounded-2xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 space-y-4">
                          <div className="flex items-center justify-between border-b border-blue-100 dark:border-blue-900/40 pb-3">
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                              <div className="w-7 h-7 rounded-lg bg-blue-500 text-white flex items-center justify-center shrink-0">
                                <FlaskConical className="w-4 h-4" />
                              </div>
                              <span>Required Diagnostic Tests</span>
                            </div>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                              {tests.length} Standard Workups
                            </span>
                          </div>

                          <div className="space-y-3">
                            {tests.map((t, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-blue-100/80 dark:border-blue-900/30 space-y-1.5 shadow-xs"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <span className="font-bold text-slate-900 dark:text-white text-xs leading-snug">
                                    {t.testName}
                                  </span>
                                  {t.urgency && (
                                    <span
                                      className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                                        t.urgency.toLowerCase().includes('stat')
                                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                                          : t.urgency.toLowerCase().includes('priority')
                                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                      }`}
                                    >
                                      {t.urgency}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-1.5 text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                  <span>{t.type}</span>
                                </div>

                                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                                  {t.purpose}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* ======================================================== */}
                      {/* PILLAR 2: SYMPTOMS & CLINICAL PRESENTATION              */}
                      {/* ======================================================== */}
                      {(pillarFocus === 'all' || pillarFocus === 'symptoms') && (
                        <div className="p-5 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 space-y-4">
                          <div className="flex items-center justify-between border-b border-amber-100 dark:border-amber-900/40 pb-3">
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                              <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                                <Stethoscope className="w-4 h-4" />
                              </div>
                              <span>Symptoms & Clinical Signs</span>
                            </div>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                              Clinical Presentation
                            </span>
                          </div>

                          <div className="space-y-4 text-xs">
                            {/* Hallmark Symptoms */}
                            <div className="space-y-2">
                              <strong className="text-slate-900 dark:text-white font-bold block text-xs flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-teal-500" />
                                Hallmark Symptoms (Primary):
                              </strong>
                              <ul className="space-y-1.5 pl-1">
                                {symptoms.hallmark?.map((h, i) => (
                                  <li key={i} className="text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                    <span className="text-teal-600 dark:text-teal-400 font-bold shrink-0">•</span>
                                    <span>{h}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Early Warning Signs */}
                            {symptoms.earlySigns && symptoms.earlySigns.length > 0 && (
                              <div className="space-y-2 pt-2 border-t border-amber-100/60 dark:border-amber-900/30">
                                <strong className="text-slate-900 dark:text-white font-bold block text-xs flex items-center gap-1.5">
                                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                                  Early Warning Signs (Prodromal):
                                </strong>
                                <ul className="space-y-1.5 pl-1">
                                  {symptoms.earlySigns.map((es, i) => (
                                    <li key={i} className="text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                      <span className="text-amber-600 dark:text-amber-400 font-bold shrink-0">•</span>
                                      <span>{es}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Red Flag Alerts */}
                            {symptoms.redFlags && symptoms.redFlags.length > 0 && (
                              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 space-y-2">
                                <div className="flex items-center gap-1.5 font-bold text-rose-900 dark:text-rose-300 text-xs">
                                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                                  <span>Critical Red Flags (Emergency):</span>
                                </div>
                                <ul className="space-y-1 text-rose-800 dark:text-rose-300 pl-1 text-[11px]">
                                  {symptoms.redFlags.map((rf, i) => (
                                    <li key={i} className="flex items-start gap-1.5">
                                      <span className="font-bold text-rose-500 shrink-0">!</span>
                                      <span>{rf}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ======================================================== */}
                      {/* PILLAR 3: EVIDENCE-BASED PRESCRIPTION & PHARMACOTHERAPY  */}
                      {/* ======================================================== */}
                      {(pillarFocus === 'all' || pillarFocus === 'prescriptions') && (
                        <div className="p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 space-y-4">
                          <div className="flex items-center justify-between border-b border-emerald-100 dark:border-emerald-900/40 pb-3">
                            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
                              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                                <Pill className="w-4 h-4" />
                              </div>
                              <span>Evidence-Based Prescriptions</span>
                            </div>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                              {prescriptions.length} Regimens
                            </span>
                          </div>

                          <div className="space-y-3.5">
                            {prescriptions.map((med, idx) => {
                              const rxCopyText = `Rx: ${med.drugName} ${med.strength} (${med.dosageForm})
Frequency: ${med.frequency} | Timing: ${med.timing}
Duration: ${med.duration}
Regimen: ${med.regimenType}
Clinical Instructions: ${med.clinicalNotes}`;

                              const medKey = `${d.id}-med-${idx}`;

                              return (
                                <div
                                  key={idx}
                                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900/30 space-y-2.5 shadow-xs"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <div className="font-extrabold text-slate-900 dark:text-white text-xs">
                                        {med.drugName}
                                      </div>
                                      <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                                        {med.strength} • {med.dosageForm}
                                      </div>
                                    </div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                      {med.regimenType.split(' ')[0]}
                                    </span>
                                  </div>

                                  {/* Administration Schedule */}
                                  <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg text-slate-700 dark:text-slate-300">
                                    <div>
                                      <span className="text-slate-400 block">Frequency:</span>
                                      <strong className="text-slate-900 dark:text-slate-200">{med.frequency}</strong>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block">Duration:</span>
                                      <strong className="text-slate-900 dark:text-slate-200">{med.duration}</strong>
                                    </div>
                                    <div className="col-span-2 pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                                      <span className="text-slate-400 block">Timing & Food:</span>
                                      <span className="text-slate-700 dark:text-slate-300">{med.timing}</span>
                                    </div>
                                  </div>

                                  {/* Clinical Notes & Precautions */}
                                  <div className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded-lg border border-emerald-100/50 dark:border-emerald-900/30">
                                    <strong className="text-emerald-800 dark:text-emerald-300 font-semibold block text-[10px] uppercase">
                                      Clinical Cautions / Guidance:
                                    </strong>
                                    {med.clinicalNotes}
                                  </div>

                                  {/* Action Buttons for this Medication */}
                                  <div className="flex items-center gap-2 pt-1">
                                    <button
                                      onClick={() => copyToClipboard(rxCopyText, medKey, `Prescription for ${med.drugName} copied!`)}
                                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold transition-colors"
                                    >
                                      {copiedKey === medKey ? (
                                        <>
                                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                                          <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3.5 h-3.5" />
                                          <span>Copy Rx</span>
                                        </>
                                      )}
                                    </button>

                                    <button
                                      onClick={() => handlePrescribeForPatient(med, d)}
                                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-sm"
                                    >
                                      <Pill className="w-3 h-3" />
                                      <span>Prescribe</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Secondary Collapsible: Complications & Referral Criteria */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                          <HeartPulse className="w-4 h-4 text-purple-500" />
                          <span>Potential Long-Term Complications</span>
                        </div>
                        <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
                          {d.complications?.map((c, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-purple-500">•</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-2">
                        <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span>Specialist Referral Triggers</span>
                        </div>
                        <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px]">
                          {d.referralTriggers?.map((r, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-500">•</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Card Footer with Evidence Source Attribution */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                        <span>
                          Clinical Dataset Source: <strong className="text-slate-600 dark:text-slate-300">{d.datasetSource}</strong>
                        </span>
                      </div>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        ✓ Verified International Clinical Standard
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
