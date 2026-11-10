import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Moon,
  Sun,
  Bell,
  ShieldCheck,
  Bot,
  Database,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Save,
  X,
  Target,
  Droplet,
  Flame,
  Activity,
  Heart,
  Stethoscope,
  Info,
  Check,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { trajectoryStorage } from '../../services/trajectoryStorage';

const AGE_RANGES = [
  { id: '< 18', label: 'Under 18' },
  { id: '18–29', label: '18 – 29 years' },
  { id: '30–44', label: '30 – 44 years' },
  { id: '45–59', label: '45 – 59 years' },
  { id: '60–74', label: '60 – 74 years' },
  { id: '75+', label: '75+ years' }
];

const GOAL_OPTIONS = [
  {
    id: 'renal',
    title: 'Kidney & Microalbumin Stability',
    desc: 'Monitor urinary protein and albumin excretion to detect glomerular variations before clinical symptoms arise.',
    icon: Droplet
  },
  {
    id: 'metabolic',
    title: 'Metabolic & Ketone Trajectories',
    desc: 'Track carbohydrate metabolism, fasting state, and fat oxidation trends for nutritional or lifestyle calibration.',
    icon: Flame
  },
  {
    id: 'hydration',
    title: 'Hydration & Concentration Corridor',
    desc: 'Correlate specific gravity with daily fluid intake, exertion, and cardiovascular parameters.',
    icon: Activity
  },
  {
    id: 'physician',
    title: 'Doctor Consultation Preparation',
    desc: 'Equip your physician with verified longitudinal trends and non-diagnostic summary packets.',
    icon: Stethoscope
  },
  {
    id: 'preventive',
    title: 'General Preventive Discovery',
    desc: 'Establish your individual biological baseline and catch sustained multi-day drifts early.',
    icon: Heart
  }
];

export default function SettingsPage() {
  const { currentUser, healthProfile, updateHealthProfile, deleteAccountData } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('profile');
  const [toastMessage, setToastMessage] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Profile Form (Hydrated from healthProfile)
  const [name, setName] = useState(healthProfile?.name || currentUser?.name || 'Pranjal Sharma');
  const [ageRange, setAgeRange] = useState(healthProfile?.ageRange || '30–44');
  const [gender, setGender] = useState(healthProfile?.gender || 'Prefer not to say');
  const [units, setUnits] = useState(healthProfile?.units || 'metric');
  const [height, setHeight] = useState(healthProfile?.height || '');
  const [weight, setWeight] = useState(healthProfile?.weight || '');

  // Lifestyle Context
  const [activityLevel, setActivityLevel] = useState(healthProfile?.lifestyle?.activityLevel || 'Moderately Active');
  const [hydrationHabit, setHydrationHabit] = useState(healthProfile?.lifestyle?.hydrationHabit || 'Moderate (1.5–2.5 L/day)');
  const [testingSchedule, setTestingSchedule] = useState(healthProfile?.lifestyle?.testingSchedule || 'Second Morning Void (Recommended)');

  // Goals
  const [selectedGoals, setSelectedGoals] = useState(
    healthProfile?.goals || [
      'Kidney & Microalbumin Stability',
      'General Preventive Discovery'
    ]
  );
  const [customGoal, setCustomGoal] = useState(healthProfile?.customGoal || '');

  // Consent Preferences
  const [consentStore, setConsentStore] = useState(healthProfile?.consent?.storeAndProcessHealthData ?? true);
  const [consentDoctor, setConsentDoctor] = useState(healthProfile?.consent?.shareWithClinician ?? true);
  const [consentAI, setConsentAI] = useState(healthProfile?.consent?.aiAssistantAnalysis ?? true);
  const [consentScope, setConsentScope] = useState(healthProfile?.consent?.nonDiagnosticScopeAcknowledged ?? true);

  // Notifications
  const [notifications, setNotifications] = useState({
    abnormalAlerts: true,
    weeklyReportEmail: true,
    appointmentReminders: true
  });

  // AI & Data Sharing
  const [aiSettings, setAiSettings] = useState({
    analyzeDocuments: true,
    continuousModeling: true,
    shareAnonymousResearch: false
  });

  useEffect(() => {
    if (healthProfile) {
      if (healthProfile.name) setName(healthProfile.name);
      if (healthProfile.ageRange) setAgeRange(healthProfile.ageRange);
      if (healthProfile.gender) setGender(healthProfile.gender);
      if (healthProfile.units) setUnits(healthProfile.units);
      if (healthProfile.height) setHeight(healthProfile.height);
      if (healthProfile.weight) setWeight(healthProfile.weight);
      if (healthProfile.lifestyle) {
        if (healthProfile.lifestyle.activityLevel) setActivityLevel(healthProfile.lifestyle.activityLevel);
        if (healthProfile.lifestyle.hydrationHabit) setHydrationHabit(healthProfile.lifestyle.hydrationHabit);
        if (healthProfile.lifestyle.testingSchedule) setTestingSchedule(healthProfile.lifestyle.testingSchedule);
      }
      if (healthProfile.goals) setSelectedGoals(healthProfile.goals);
      if (healthProfile.customGoal !== undefined) setCustomGoal(healthProfile.customGoal);
      if (healthProfile.consent) {
        setConsentStore(Boolean(healthProfile.consent.storeAndProcessHealthData));
        setConsentDoctor(Boolean(healthProfile.consent.shareWithClinician));
        setConsentAI(Boolean(healthProfile.consent.aiAssistantAnalysis));
        setConsentScope(Boolean(healthProfile.consent.nonDiagnosticScopeAcknowledged));
      }
    }
  }, [healthProfile]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleGoal = (goalTitle) => {
    setSelectedGoals(prev =>
      prev.includes(goalTitle)
        ? prev.filter(g => g !== goalTitle)
        : [...prev, goalTitle]
    );
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const updated = updateHealthProfile({
      name,
      ageRange,
      gender,
      units,
      height: height ? parseFloat(height) : '',
      weight: weight ? parseFloat(weight) : '',
      lifestyle: {
        activityLevel,
        hydrationHabit,
        testingSchedule
      },
      goals: selectedGoals,
      customGoal,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString()
    });
    if (updated) {
      showToast('Health profile and baseline parameters updated successfully!');
    }
  };

  const handleConsentSave = () => {
    const updated = updateHealthProfile({
      consent: {
        storeAndProcessHealthData: consentStore,
        shareWithClinician: consentDoctor,
        aiAssistantAnalysis: consentAI,
        nonDiagnosticScopeAcknowledged: consentScope,
        updatedAt: new Date().toISOString()
      }
    });
    if (updated) {
      showToast('Consent preferences updated and securely recorded.');
    }
  };

  const handleDeleteAccountConfirm = () => {
    setDeleteModalOpen(false);
    deleteAccountData();
    alert('Your account profile, test strip logs, and local health ledger have been irreversibly purged.');
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#00685f] text-white font-bold text-sm shadow-2xl animate-fade-in border border-teal-300/30">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Settings &amp; Health Profile
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
          Manage your personal health profile, units, baseline goals, informed consent preferences, and data sovereignty.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 text-sm font-semibold overflow-x-auto shadow-xs">
        {[
          { id: 'profile', label: 'Health Profile & Goals', icon: User },
          { id: 'security', label: 'Privacy & Consent Preferences', icon: ShieldCheck },
          { id: 'ai', label: 'AI Assistant', icon: Bot },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'theme', label: 'Appearance', icon: Sun }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-[#00685f] text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* =========================================================================
          TAB 1: HEALTH PROFILE & BASELINE GOALS
      ========================================================================== */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 rounded-2xl bg-[#00685f]/15 text-[#00685f] dark:text-[#6bd8cb] text-3xl font-extrabold flex items-center justify-center">
              {name ? name[0].toUpperCase() : 'P'}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Age Bracket: {ageRange} • Units: {units.toUpperCase()} • Patient Ledger Active
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00685f]"
              />
            </div>

            {/* Age Range Bracket */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Age Range</span>
                <span className="text-[10px] text-slate-400 font-normal">Protects Exact DOB</span>
              </label>
              <select
                value={ageRange}
                onChange={e => setAgeRange(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00685f] font-medium"
              >
                {AGE_RANGES.map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>

            {/* Biological Sex (Optional) */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider">
                Biological Sex (Optional)
              </label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00685f] font-medium"
              >
                {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            {/* Preferred Measurement Units Toggle */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider block">
                Preferred Measurement Units
              </label>
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setUnits('metric')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${units === 'metric'
                      ? 'bg-[#00685f] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                >
                  Metric (kg, cm)
                </button>
                <button
                  type="button"
                  onClick={() => setUnits('imperial')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${units === 'imperial'
                      ? 'bg-[#00685f] text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                >
                  Imperial (lbs, in)
                </button>
              </div>
            </div>

            {/* Optional Height */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Height (Optional)</span>
                <span className="text-[10px] text-slate-400 font-normal">{units === 'metric' ? 'Centimeters (cm)' : 'Inches (in)'}</span>
              </label>
              <input
                type="number"
                value={height}
                onChange={e => setHeight(e.target.value)}
                placeholder={units === 'metric' ? 'e.g. 175' : 'e.g. 69'}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00685f]"
              />
            </div>

            {/* Optional Weight */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300 text-xs uppercase tracking-wider flex items-center justify-between">
                <span>Weight (Optional)</span>
                <span className="text-[10px] text-slate-400 font-normal">{units === 'metric' ? 'Kilograms (kg)' : 'Pounds (lbs)'}</span>
              </label>
              <input
                type="number"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder={units === 'metric' ? 'e.g. 70' : 'e.g. 154'}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00685f]"
              />
            </div>
          </div>

          {/* Lifestyle Information */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#00685f] dark:text-[#6bd8cb]">
              Optional Lifestyle Context (Calibrates Confounder Sensitivity)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={e => setActivityLevel(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Sedentary">Sedentary (Minimal)</option>
                  <option value="Lightly Active">Lightly Active (1-2x/wk)</option>
                  <option value="Moderately Active">Moderately Active (3-4x/wk)</option>
                  <option value="High Athletic / Endurance">High Athletic / Endurance</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Daily Hydration Habit</label>
                <select
                  value={hydrationHabit}
                  onChange={e => setHydrationHabit(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Low (< 1.5 L/day)">Low (&lt; 1.5 L/day)</option>
                  <option value="Moderate (1.5–2.5 L/day)">Moderate (1.5–2.5 L/day)</option>
                  <option value="High (3+ L/day)">High (3+ L/day)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Testing Schedule Window</label>
                <select
                  value={testingSchedule}
                  onChange={e => setTestingSchedule(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                >
                  <option value="Second Morning Void (Recommended)">Second Morning Void (Recommended)</option>
                  <option value="First Morning Void">First Morning Void</option>
                  <option value="Post-Workout">Post-Workout</option>
                  <option value="Evening Routine">Evening Routine</option>
                </select>
              </div>
            </div>
          </div>

          {/* Health-Monitoring Goals */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#00685f] dark:text-[#6bd8cb]">
              Health-Monitoring Goals
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GOAL_OPTIONS.map(g => {
                const Icon = g.icon;
                const isSelected = selectedGoals.includes(g.title);
                return (
                  <div
                    key={g.id}
                    onClick={() => toggleGoal(g.title)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3 ${isSelected
                        ? 'bg-[#00685f]/10 border-[#00685f]'
                        : 'bg-slate-50 dark:bg-[#070B14] border-slate-200 dark:border-slate-800'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#00685f] text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{g.title}</span>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => { }}
                          className="accent-[#00685f] rounded"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{g.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Custom Monitoring Goal (Optional)
              </label>
              <input
                type="text"
                value={customGoal}
                onChange={e => setCustomGoal(e.target.value)}
                placeholder="e.g. Track hydration recovery during summer training"
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-5 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold bg-[#00685f] text-white hover:bg-[#008378] transition-all shadow-md active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Health Profile</span>
            </button>
          </div>
        </form>
      )}

      {/* =========================================================================
          TAB 2: PRIVACY & INFORMED CONSENT PREFERENCES
      ========================================================================== */}
      {activeTab === 'security' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Privacy, Security &amp; Informed Consent</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Full transparency on data storage, physician sharing permissions, and non-diagnostic medical boundaries.
              </p>
            </div>
          </div>

          {/* Clear Scope Disclaimer: What BioTrajectory Does & Does NOT Do */}
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#070B14] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
              <ShieldCheck className="w-4 h-4 text-[#00685f]" />
              <span>What BioTrajectory Does and Does NOT Do</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> What We DO:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                  <li>Build your personal health baseline over repeated test strips</li>
                  <li>Track longitudinal trajectory envelopes and trends</li>
                  <li>Differentiate acute single-day blips from true multi-day drifts</li>
                  <li>Generate clinician-friendly objective summary reports</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1">
                <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <X className="w-4 h-4" /> What We DO NOT Do:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300 text-[11px]">
                  <li>Does NOT diagnose diseases or acute conditions</li>
                  <li>Does NOT prescribe medical treatments or dosages</li>
                  <li>Does NOT substitute for a licensed physician or specialist</li>
                  <li>Does NOT share any data without your separate permission</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Granular Consent Controls */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-sm uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Granular Consent Settings
            </h4>

            {/* Consent 1: Local Storage (Required for feature operation) */}
            <label className={`p-4 rounded-2xl border flex items-start gap-4 cursor-pointer transition-colors ${consentStore
                ? 'bg-[#00685f]/5 border-[#00685f]/40'
                : 'bg-slate-50 dark:bg-[#070B14] border-slate-200 dark:border-slate-800'
              }`}>
              <input
                type="checkbox"
                checked={consentStore}
                onChange={e => setConsentStore(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#00685f] rounded"
              />
              <div className="flex-1">
                <p className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                  1. Local Health Measurement Storage &amp; Processing (Essential)
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  Allows BioTrajectory to process urine test strip readings and connected Bluetooth vitals on your device to calculate rolling medians and personal baseline corridors.
                </p>
              </div>
            </label>

            {/* Consent 2: Voluntary Doctor Sharing (Separate & Optional) */}
            <label className={`p-4 rounded-2xl border flex items-start gap-4 cursor-pointer transition-colors ${consentDoctor
                ? 'bg-[#00687a]/5 border-[#00687a]/40'
                : 'bg-slate-50 dark:bg-[#070B14] border-slate-200 dark:border-slate-800'
              }`}>
              <input
                type="checkbox"
                checked={consentDoctor}
                onChange={e => setConsentDoctor(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#00687a] rounded"
              />
              <div className="flex-1">
                <p className="font-bold text-xs sm:text-sm text-[#00687a] dark:text-[#57dffe]">
                  2. Voluntary Physician Report Sharing (Separate &amp; Optional)
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  Allows voluntary export and handover packet generation for sharing with your doctor. Data is never automatically sent to any clinician without your explicit click.
                </p>
              </div>
            </label>

            {/* Consent 3: AI Assistant (Separate & Optional) */}
            <label className={`p-4 rounded-2xl border flex items-start gap-4 cursor-pointer transition-colors ${consentAI
                ? 'bg-[#006947]/5 border-[#006947]/40'
                : 'bg-slate-50 dark:bg-[#070B14] border-slate-200 dark:border-slate-800'
              }`}>
              <input
                type="checkbox"
                checked={consentAI}
                onChange={e => setConsentAI(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#006947] rounded"
              />
              <div className="flex-1">
                <p className="font-bold text-xs sm:text-sm text-[#006947] dark:text-[#6ffbbe]">
                  3. Grounded AI Trajectory Pattern Explanations (Separate &amp; Optional)
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  Enables AI-driven contextual explanations of personal trends and physiological factors (e.g. hydration and workout protein spikes).
                </p>
              </div>
            </label>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleConsentSave}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#00685f] text-white hover:bg-[#008378] transition-all shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Update Consent Preferences</span>
              </button>
            </div>
          </div>

          {/* Account & Data Deletion (Data Sovereignty) */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-base">
              <Trash2 className="w-5 h-5" />
              <h4>Purge Health Data &amp; Delete Account</h4>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
              Exercising your right to be forgotten: permanently erase all urine test strip readings, connected Bluetooth device logs, baseline statistics, and your profile from this system. This action cannot be undone.
            </p>
            <button
              type="button"
              onClick={() => setDeleteModalOpen(true)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/20 transition-colors inline-flex items-center gap-2"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete My Account &amp; Purge Biological Data</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: AI ASSISTANT PERMISSIONS
      ========================================================================== */}
      {activeTab === 'ai' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 text-sm">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Assistant Settings</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-xs">
              Configure how the Gemini-powered intelligence engine assists in explaining baseline corridors and test strip trends.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                key: 'analyzeDocuments',
                title: 'Allow Assistant to Interpret Longitudinal Logs',
                desc: 'Permits the AI to summarize multi-day trends and correlate specific gravity with protein readings.'
              },
              {
                key: 'continuousModeling',
                title: 'Track Health Trajectories',
                desc: 'Allows the system to calculate non-parametric rolling median corridors over 7-day and 30-day windows.'
              },
              {
                key: 'shareAnonymousResearch',
                title: 'Share Anonymized Research Numbers (Optional)',
                desc: 'Contribute de-identified numerical distributions to open science without any names or personal IDs.'
              }
            ].map(item => (
              <label key={item.key} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-[#00685f]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={aiSettings[item.key]}
                  onChange={e => {
                    setAiSettings({ ...aiSettings, [item.key]: e.target.checked });
                    showToast('AI permissions updated.');
                  }}
                  className="w-4 h-4 mt-0.5 rounded accent-[#00685f]"
                />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{item.title}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: NOTIFICATIONS
      ========================================================================== */}
      {activeTab === 'notifications' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 text-sm">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Notification Preferences</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-xs">
              Choose how and when BioTrajectory sends you baseline reminders and test prompts.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { key: 'abnormalAlerts', title: 'Persistent Deviation Alerts', desc: 'Get notified if a biomarker stays outside your personal baseline corridor for 3 consecutive morning sessions.' },
              { key: 'weeklyReportEmail', title: 'Weekly Baseline Summary', desc: 'Receive a concise digest of your rolling corridor stability every Monday morning.' },
              { key: 'appointmentReminders', title: 'Test Strip Schedule Reminders', desc: 'Helpful reminder timed to your selected void window (e.g., second morning void).' }
            ].map(item => (
              <label key={item.key} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-[#00685f]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={e => {
                    setNotifications({ ...notifications, [item.key]: e.target.checked });
                    showToast('Notification preference saved.');
                  }}
                  className="w-4 h-4 mt-0.5 rounded accent-[#00685f]"
                />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">{item.title}</p>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: APPEARANCE
      ========================================================================== */}
      {activeTab === 'theme' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 text-sm">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Visual Theme</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-xs">
              Switch between Light Mode and High-Contrast Dark Mode for optimal chart reading.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => { if (isDark) toggleTheme(); }}
              className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all ${!isDark
                  ? 'border-[#00685f] ring-2 ring-[#00685f]/20 bg-teal-50/50'
                  : 'border-slate-200 dark:border-slate-800'
                }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Light Theme</p>
                  <p className="text-xs text-slate-500 mt-0.5">High-contrast daytime clinical styling</p>
                </div>
              </div>
              {!isDark && <CheckCircle2 className="w-5 h-5 text-[#00685f]" />}
            </button>

            <button
              type="button"
              onClick={() => { if (!isDark) toggleTheme(); }}
              className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all ${isDark
                  ? 'border-[#00685f] ring-2 ring-[#00685f]/20 bg-[#070b14]'
                  : 'border-slate-200 dark:border-slate-800'
                }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-[#57dffe]" />
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">Dark Theme</p>
                  <p className="text-xs text-slate-500 mt-0.5">Low-glare clinical night palette</p>
                </div>
              </div>
              {isDark && <CheckCircle2 className="w-5 h-5 text-[#6bd8cb]" />}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Account & Health Data Deletion */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#101827] border border-rose-500/30 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Permanently Delete All Health Records?
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                This will immediately and permanently erase all urine test strip scans, personal baseline calculations, Bluetooth sensor readings, and your profile data from this browser storage. This cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccountConfirm}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-colors shadow-sm"
              >
                Yes, Purge Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
