import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Activity,
  Heart,
  Droplet,
  Scale,
  Sparkles,
  Info,
  Calendar,
  User,
  Sliders,
  Check,
  X,
  Target,
  FileText,
  AlertCircle,
  HelpCircle,
  Flame,
  Clock,
  Stethoscope
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { trajectoryStorage } from '../services/trajectoryStorage';

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

export default function HealthProfileModal({ isOpen, onClose, initialStep = 1, isEditMode = false }) {
  const { isDark } = useTheme();
  const { healthProfile, updateHealthProfile, currentUser } = useAuth();

  const [step, setStep] = useState(initialStep);
  const totalSteps = 7;

  // Form State
  const [name, setName] = useState('');
  const [ageRange, setAgeRange] = useState('30–44');
  const [gender, setGender] = useState('Prefer not to say');

  // Units & Biometrics
  const [units, setUnits] = useState('metric'); // 'metric' (kg, cm) | 'imperial' (lbs, in)
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  // Lifestyle Context
  const [activityLevel, setActivityLevel] = useState('Moderately Active');
  const [hydrationHabit, setHydrationHabit] = useState('Moderate (1.5–2.5 L/day)');
  const [testingSchedule, setTestingSchedule] = useState('Second Morning Void (Recommended)');

  // Goals
  const [selectedGoals, setSelectedGoals] = useState([
    'Kidney & Microalbumin Stability',
    'General Preventive Discovery'
  ]);
  const [customGoal, setCustomGoal] = useState('');

  // Consents
  const [consentStore, setConsentStore] = useState(true);
  const [consentDoctor, setConsentDoctor] = useState(true);
  const [consentAI, setConsentAI] = useState(true);
  const [scopeAcknowledged, setScopeAcknowledged] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');

  // Populate from existing profile
  useEffect(() => {
    if (healthProfile) {
      setName(healthProfile.name || currentUser?.name || 'Pranjal Sharma');
      setAgeRange(healthProfile.ageRange || '30–44');
      setGender(healthProfile.gender || 'Prefer not to say');
      setUnits(healthProfile.units || 'metric');
      setHeight(healthProfile.height ? String(healthProfile.height) : '');
      setWeight(healthProfile.weight ? String(healthProfile.weight) : '');
      if (healthProfile.lifestyle) {
        setActivityLevel(healthProfile.lifestyle.activityLevel || 'Moderately Active');
        setHydrationHabit(healthProfile.lifestyle.hydrationHabit || 'Moderate (1.5–2.5 L/day)');
        setTestingSchedule(healthProfile.lifestyle.testingSchedule || 'Second Morning Void (Recommended)');
      }
      if (healthProfile.goals && healthProfile.goals.length > 0) {
        setSelectedGoals(healthProfile.goals);
      }
      setCustomGoal(healthProfile.customGoal || '');
      if (healthProfile.consent) {
        setConsentStore(healthProfile.consent.storeAndProcessHealthData !== false);
        setConsentDoctor(healthProfile.consent.shareWithClinician !== false);
        setConsentAI(healthProfile.consent.aiAssistantAnalysis !== false);
        setScopeAcknowledged(healthProfile.consent.nonDiagnosticScopeAcknowledged !== false);
      }
    }
  }, [healthProfile, currentUser]);

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setErrorMessage('');
    }
  }, [isOpen, initialStep]);

  if (!isOpen) return null;

  const toggleGoal = (title) => {
    setSelectedGoals(prev =>
      prev.includes(title)
        ? prev.filter(g => g !== title)
        : [...prev, title]
    );
  };

  const handleNext = () => {
    setErrorMessage('');
    if (step === 2 && !name.trim()) {
      setErrorMessage('Please provide your name to personalize your health baseline.');
      return;
    }
    if (step === 6 && !consentStore) {
      setErrorMessage('Consent for storing and processing health measurements is required to construct your baseline.');
      return;
    }
    if (step === 6 && !scopeAcknowledged) {
      setErrorMessage('Please acknowledge the non-diagnostic scope before continuing.');
      return;
    }

    if (step < totalSteps) {
      setStep(prev => prev + 1);
    } else {
      handleFinalSave();
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleFinalSave = () => {
    const updatedProfile = {
      name: name.trim() || 'Pranjal Sharma',
      ageRange,
      gender,
      units,
      height: height ? parseFloat(height) : null,
      weight: weight ? parseFloat(weight) : null,
      lifestyle: {
        activityLevel,
        hydrationHabit,
        testingSchedule
      },
      goals: selectedGoals,
      customGoal: customGoal.trim(),
      consent: {
        storeAndProcessHealthData: consentStore,
        shareWithClinician: consentDoctor,
        aiAssistantAnalysis: consentAI,
        nonDiagnosticScopeAcknowledged: scopeAcknowledged,
        acceptedAt: new Date().toISOString()
      },
      onboardingCompleted: true,
      updatedAt: new Date().toISOString()
    };

    updateHealthProfile(updatedProfile);

    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3F0D12', '#A71D31', '#D5BF86', '#8D775F']
      });
    } catch (e) { }

    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-2xl border rounded-3xl shadow-2xl overflow-hidden transition-all my-auto ${isDark ? 'bg-[#2B0B0E] border-[#D5BF86]/30 text-[#FAF9EB]' : 'bg-[#FAF9EB] border-[#D5BF86] text-[#3F0D12]'
        }`}>

        {/* Modal Top Bar */}
        <div className={`p-5 sm:p-6 border-b flex items-center justify-between gap-4 ${isDark ? 'border-[#D5BF86]/20 bg-[#1D070A]' : 'border-[#D5BF86]/40 bg-white'
          }`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#A71D31]/15 text-[#A71D31] dark:text-[#D5BF86] border border-[#A71D31]/30 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-sans uppercase tracking-widest font-bold text-[#A71D31] dark:text-[#D5BF86]">
                {isEditMode ? 'Health Profile & Consent Manager' : 'First-Time Onboarding Experience'}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#3F0D12] dark:text-[#FAF9EB]">
                {step === 1 && 'Welcome to BioTrajectory'}
                {step === 2 && 'Personal Identity & Age Bracket'}
                {step === 3 && 'Biometrics & Preferred Units'}
                {step === 4 && 'Lifestyle & Circadian Context'}
                {step === 5 && 'Your Health Monitoring Goals'}
                {step === 6 && 'Governance & Granular Consent'}
                {step === 7 && 'Health Profile Ready'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-[#8D775F] dark:text-[#D5BF86]">
              Step {step} of {totalSteps}
            </span>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#8D775F] hover:text-[#A71D31] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Step Progress Line */}
        <div className="w-full bg-[#D5BF86]/30 h-1">
          <div
            className="bg-[#A71D31] h-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto space-y-6">

          {/* =========================================================================
              STEP 1: CONCEPTUAL FOUNDATION (SIMPLE LANGUAGE BASELINE & TRAJECTORY)
          ========================================================================== */}
          {step === 1 && (
            <div className="space-y-5 text-xs sm:text-sm">
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/20' : 'bg-[#FAF9EB] border-[#D5BF86]'
                }`}>
                <h3 className="font-bold text-sm sm:text-base text-[#A71D31] dark:text-[#D5BF86] mb-1">
                  Why Point-in-Time Tests Miss the Big Picture
                </h3>
                <p className="text-[#473228] dark:text-[#E8E5BA] leading-relaxed text-xs sm:text-sm">
                  Traditional checkups give you a single snapshot once a year. But a snapshot can panic you over a temporary post-workout protein blip, or completely miss a slow, subtle drift.
                </p>
              </div>

              {/* Visual Baseline & Trajectory Demonstration (Directly illustrating the platform chart) */}
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/30' : 'bg-white border-[#D5BF86]/70 shadow-sm'
                }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-[#D5BF86]/40">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#A71D31] animate-pulse"></span>
                    <span className="font-bold text-xs text-[#3F0D12] dark:text-[#FAF9EB]">
                      Personal Baseline Active (15 of 10 Recommended Sessions Logged)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#A71D31] font-semibold bg-[#A71D31]/10 px-2 py-0.5 rounded-full border border-[#A71D31]/20">
                    Personal Corridor: 0 – 15 mg/dL
                  </span>
                </div>

                <p className="text-[11px] text-[#8D775F] dark:text-[#D5BF86] mb-2 leading-relaxed">
                  Constructed via non-parametric rolling medians &amp; interquartile corridors. Avoids misleading composite wellness scores and single-point false alarms.
                </p>

                {/* Interactive SVG Chart matching the actual platform baseline graph */}
                <div className="w-full overflow-hidden rounded-xl bg-[#FAF9EB]/40 dark:bg-[#1D070A]/60 border border-[#D5BF86]/40 p-2">
                  <svg viewBox="0 0 540 180" className="w-full h-auto select-none font-mono">
                    <defs>
                      <linearGradient id="onboardingAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#A71D31" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#A71D31" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="onboardingCorridorGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D5BF86" stopOpacity="0.28" />
                        <stop offset="100%" stopColor="#D5BF86" stopOpacity="0.10" />
                      </linearGradient>
                    </defs>

                    {/* Gridlines */}
                    {[160, 125, 90, 55, 20].map((y, idx) => (
                      <line
                        key={idx}
                        x1="38"
                        y1={y}
                        x2="520"
                        y2={y}
                        stroke={isDark ? 'rgba(213, 191, 134, 0.12)' : 'rgba(141, 119, 95, 0.15)'}
                        strokeDasharray="3 3"
                      />
                    ))}

                    {/* Y-axis values */}
                    <text x="32" y="23" textAnchor="end" className="text-[8px] fill-[#8D775F]">34.5</text>
                    <text x="32" y="58" textAnchor="end" className="text-[8px] fill-[#8D775F]">25.9</text>
                    <text x="32" y="93" textAnchor="end" className="text-[8px] fill-[#8D775F]">17.3</text>
                    <text x="32" y="128" textAnchor="end" className="text-[8px] fill-[#8D775F]">8.6</text>
                    <text x="32" y="163" textAnchor="end" className="text-[8px] fill-[#8D775F]">0.0</text>

                    {/* Baseline corridor band (0 to 15 mg/dL -> y=160 to y=105) */}
                    <rect
                      x="38"
                      y="102"
                      width="482"
                      height="58"
                      fill="url(#onboardingCorridorGrad)"
                      stroke="#D5BF86"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                      rx="3"
                    />
                    <text
                      x="510"
                      y="115"
                      textAnchor="end"
                      className="text-[8px] font-semibold fill-[#8D775F] dark:fill-[#D5BF86]"
                    >
                      Personal Baseline Corridor (0 – 15 mg/dL)
                    </text>

                    {/* Review threshold line at 30 mg/dL -> y=38 */}
                    <line
                      x1="38"
                      y1="38"
                      x2="520"
                      y2="38"
                      stroke="#A71D31"
                      strokeWidth="1.2"
                      strokeDasharray="4 4"
                    />
                    <text
                      x="44"
                      y="34"
                      className="text-[8px] font-bold fill-[#A71D31]"
                    >
                      Review Threshold: 30 mg/dL
                    </text>

                    {/* Area fill under curve */}
                    <path
                      d="M 50 140 Q 80 135 110 136 T 170 144 T 230 137 T 290 140 T 350 140 Q 380 130 400 36 Q 415 80 430 102 Q 450 136 470 142 T 510 142 L 510 160 L 50 160 Z"
                      fill="url(#onboardingAreaGrad)"
                    />

                    {/* Trajectory line */}
                    <path
                      d="M 50 140 Q 80 135 110 136 T 170 144 T 230 137 T 290 140 T 350 140 Q 380 130 400 36 Q 415 80 430 102 Q 450 136 470 142 T 510 142"
                      fill="none"
                      stroke="#A71D31"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    />

                    {/* Data dots */}
                    {[
                      { x: 50, y: 140, label: 'D1', color: '#3F0D12' },
                      { x: 80, y: 135, label: 'D3', color: '#3F0D12' },
                      { x: 110, y: 144, label: 'D5', color: '#3F0D12' },
                      { x: 140, y: 138, label: 'D7', color: '#3F0D12' },
                      { x: 170, y: 140, label: 'D9', color: '#3F0D12' },
                      { x: 200, y: 136, label: 'D11', color: '#3F0D12' },
                      { x: 230, y: 140, label: 'D13', color: '#3F0D12' },
                      { x: 260, y: 145, label: 'D15', color: '#3F0D12' },
                      { x: 290, y: 137, label: 'D17', color: '#3F0D12' },
                      { x: 320, y: 133, label: 'D19', color: '#3F0D12' },
                      { x: 400, y: 36, label: 'D22', color: '#A71D31', isSpike: true },
                      { x: 430, y: 102, label: 'D24', color: '#D5BF86' },
                      { x: 460, y: 136, label: 'D26', color: '#3F0D12' },
                      { x: 485, y: 142, label: 'D28', color: '#3F0D12' },
                      { x: 510, y: 142, label: 'D30', color: '#3F0D12' }
                    ].map((pt, idx) => (
                      <g key={idx}>
                        {pt.isSpike && (
                          <circle cx={pt.x} cy={pt.y} r="8" fill="none" stroke="#A71D31" strokeWidth="1.2" opacity="0.6" />
                        )}
                        <circle cx={pt.x} cy={pt.y} r={pt.isSpike ? 4.5 : 3} fill={pt.color} stroke={isDark ? '#1D070A' : '#FAF9EB'} strokeWidth="1" />
                        <text x={pt.x} y="174" textAnchor="middle" className={`text-[8px] ${pt.isSpike ? 'fill-[#A71D31] font-bold' : 'fill-[#8D775F]'}`}>
                          {pt.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-[#D5BF86]/30 text-[10px]">
                  <div className="text-[#A71D31] font-medium">
                    ⚡ <strong>Snapshot test would panic:</strong> Day 22 spike (32 mg/dL) breaches threshold.
                  </div>
                  <div className="text-[#3F0D12] dark:text-[#D5BF86] font-medium">
                    🛡️ <strong>Trajectory context reassures:</strong> Rapidly resolves back to baseline corridor (5.2 mg/dL).
                  </div>
                </div>
              </div>

              {/* Explicit Boundaries: What BioTrajectory Does and Does NOT Do */}
              <div className={`p-4 rounded-2xl border space-y-3 ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/20' : 'bg-[#FAF9EB] border-[#D5BF86]'
                }`}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8D775F]">
                  <ShieldCheck className="w-4 h-4 text-[#A71D31]" />
                  <span>Clear Medical Governance & Platform Scope</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1.5">
                    <span className="font-bold text-[#3F0D12] dark:text-[#FAF9EB] flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#A71D31]" /> What BioTrajectory DOES:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-[#473228] dark:text-[#E8E5BA] text-[11px] leading-relaxed">
                      <li>Calculates your personal baseline corridor</li>
                      <li>Tracks multi-day biomarker trends</li>
                      <li>Provides grounded explanations using AI</li>
                      <li>Prepares objective reports for your doctor</li>
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-bold text-[#A71D31] flex items-center gap-1.5">
                      <X className="w-3.5 h-3.5" /> What BioTrajectory DOES NOT do:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-[#473228] dark:text-[#E8E5BA] text-[11px] leading-relaxed">
                      <li>Does NOT diagnose medical conditions</li>
                      <li>Does NOT prescribe medications or doses</li>
                      <li>Does NOT replace your physician or specialist</li>
                      <li>Does NOT sound false alarms on single blips</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 2: NAME & AGE BRACKET
          ========================================================================== */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8D775F]">
                  Full Name <span className="text-[#A71D31]">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pranjal Sharma"
                  className={`w-full p-3.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A71D31] ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/30 text-white' : 'bg-white border-[#D5BF86] text-[#3F0D12]'
                    }`}
                />
                <p className="text-[11px] text-[#8D775F]">
                  Used for labeling your personal ledger and voluntary doctor summary packets.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8D775F]">
                  Age Range <span className="text-[#A71D31]">*</span>
                </label>
                <p className="text-[11px] text-[#8D775F]">
                  Discrete age brackets protect your exact birth date while helping calibrate renal baseline reference envelopes.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {AGE_RANGES.map((r) => {
                    const isSelected = ageRange === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setAgeRange(r.id)}
                        className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer ${isSelected
                          ? 'bg-[#A71D31]/15 border-[#A71D31] text-[#A71D31] dark:text-[#D5BF86] ring-1 ring-[#A71D31]'
                          : isDark ? 'bg-[#1D070A] border-[#D5BF86]/20 text-[#D5BF86] hover:text-white' : 'bg-white border-[#D5BF86]/50 text-[#3F0D12]'
                          }`}
                      >
                        {r.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8D775F]">
                  Biological Sex (Optional)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['Male', 'Female', 'Other', 'Prefer not to say'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`p-2.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${gender === g
                        ? 'bg-[#A71D31]/15 border-[#A71D31] text-[#A71D31] dark:text-[#D5BF86] font-bold'
                        : isDark ? 'bg-[#1D070A] border-[#D5BF86]/20 text-[#D5BF86]' : 'bg-white border-[#D5BF86]/50 text-[#8D775F]'
                        }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 3: BIOMETRICS & PREFERRED UNITS (OPTIONAL)
          ========================================================================== */}
          {step === 3 && (
            <div className="space-y-5">
              {/* Unit Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl border bg-[#FAF9EB] dark:bg-[#1D070A] border-[#D5BF86]/40">
                <div>
                  <span className="font-bold text-xs uppercase tracking-wider block text-[#3F0D12] dark:text-[#FAF9EB]">Preferred Measurement Units</span>
                  <span className="text-[11px] text-[#8D775F]">Choose between international metric or standard imperial.</span>
                </div>
                <div className={`p-1 rounded-xl border text-xs font-bold flex items-center ${isDark ? 'bg-[#2B0B0E] border-[#D5BF86]/30' : 'bg-white border-[#D5BF86]'
                  }`}>
                  <button
                    type="button"
                    onClick={() => setUnits('metric')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${units === 'metric'
                      ? 'bg-[#A71D31] text-white shadow-xs'
                      : 'text-[#8D775F] hover:text-[#3F0D12]'
                      }`}
                  >
                    Metric (kg, cm)
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnits('imperial')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${units === 'imperial'
                      ? 'bg-[#A71D31] text-white shadow-xs'
                      : 'text-[#8D775F] hover:text-[#3F0D12]'
                      }`}
                  >
                    Imperial (lbs, in)
                  </button>
                </div>
              </div>

              {/* Optional Height & Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#8D775F] flex items-center justify-between">
                    <span>Height (Optional)</span>
                    <span className="text-[10px] text-[#8D775F]">{units === 'metric' ? 'cm' : 'inches'}</span>
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={units === 'metric' ? 'e.g. 175' : 'e.g. 69'}
                    className={`w-full p-3.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A71D31] ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/30 text-white' : 'bg-white border-[#D5BF86] text-[#3F0D12]'
                      }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#8D775F] flex items-center justify-between">
                    <span>Weight (Optional)</span>
                    <span className="text-[10px] text-[#8D775F]">{units === 'metric' ? 'kg' : 'lbs'}</span>
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={units === 'metric' ? 'e.g. 70' : 'e.g. 154'}
                    className={`w-full p-3.5 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#A71D31] ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/30 text-white' : 'bg-white border-[#D5BF86] text-[#3F0D12]'
                      }`}
                  />
                </div>
              </div>

              <div className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-start gap-3 ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/20 text-[#D5BF86]' : 'bg-[#FAF9EB] border-[#D5BF86] text-[#473228]'
                }`}>
                <Info className="w-4 h-4 text-[#A71D31] shrink-0 mt-0.5" />
                <span>
                  <strong>Privacy Rule:</strong> Height and weight are never mandatory. If entered, they help provide hydration estimates and optional wearable body composition sync.
                </span>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 4: LIFESTYLE & TESTING CONTEXT (OPTIONAL)
          ========================================================================== */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8D775F] block">
                  Typical Physical Activity Level (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'Sedentary', desc: 'Minimal structured exercise' },
                    { id: 'Lightly Active', desc: 'Walking, light daily activity 1-2x/wk' },
                    { id: 'Moderately Active', desc: 'Moderate workout 3-4 days/wk' },
                    { id: 'High Athletic / Endurance', desc: 'Intensive endurance, marathon, HIIT' }
                  ].map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setActivityLevel(act.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${activityLevel === act.id
                        ? 'bg-[#A71D31]/15 border-[#A71D31] text-[#3F0D12] dark:text-[#FAF9EB] ring-1 ring-[#A71D31]'
                        : isDark ? 'bg-[#1D070A] border-[#D5BF86]/20 text-[#8D775F]' : 'bg-[#FAF9EB] border-[#D5BF86] text-[#473228]'
                        }`}
                    >
                      <span className="font-bold text-xs block">{act.id}</span>
                      <span className="text-[11px] text-[#8D775F]">{act.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8D775F] block">
                  Usual Daily Fluid Intake (Optional)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    'Low (< 1.5 L/day)',
                    'Moderate (1.5–2.5 L/day)',
                    'High (3+ L/day)'
                  ].map((hyd) => (
                    <button
                      key={hyd}
                      type="button"
                      onClick={() => setHydrationHabit(hyd)}
                      className={`p-3 rounded-xl border text-xs text-left transition-all font-semibold ${hydrationHabit === hyd
                        ? 'bg-[#A71D31]/15 border-[#A71D31] text-[#A71D31] ring-1 ring-[#A71D31]'
                        : isDark ? 'bg-[#1D070A] border-[#D5BF86]/20 text-[#8D775F]' : 'bg-[#FAF9EB] border-[#D5BF86] text-[#473228]'
                        }`}
                    >
                      {hyd}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8D775F] block">
                  Preferred Test Schedule Window
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { id: 'Second Morning Void (Recommended)', tag: 'Best for specific gravity calibration' },
                    { id: 'First Morning Void', tag: 'High concentration baseline' },
                    { id: 'Post-Workout', tag: 'Tracks exercise-induced recovery' },
                    { id: 'Evening Routine', tag: 'End-of-day metabolic review' }
                  ].map((sched) => (
                    <button
                      key={sched.id}
                      type="button"
                      onClick={() => setTestingSchedule(sched.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${testingSchedule === sched.id
                        ? 'bg-[#A71D31]/15 border-[#A71D31] text-[#3F0D12] dark:text-[#FAF9EB] ring-1 ring-[#A71D31]'
                        : isDark ? 'bg-[#1D070A] border-[#D5BF86]/20 text-[#8D775F]' : 'bg-[#FAF9EB] border-[#D5BF86] text-[#473228]'
                        }`}
                    >
                      <span className="font-bold text-xs block">{sched.id}</span>
                      <span className="text-[11px] text-[#8D775F]">{sched.tag}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 5: HEALTH MONITORING GOALS
          ========================================================================== */}
          {step === 5 && (
            <div className="space-y-4">
              <p className="text-xs text-[#8D775F] leading-relaxed">
                Select the areas you wish to prioritize. BioTrajectory tailors baseline notification sensitivity and clinician report highlights to your goals.
              </p>

              <div className="space-y-2.5">
                {GOAL_OPTIONS.map((g) => {
                  const Icon = g.icon;
                  const isChecked = selectedGoals.includes(g.title);
                  return (
                    <div
                      key={g.id}
                      onClick={() => toggleGoal(g.title)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-start gap-3.5 ${isChecked
                        ? 'bg-[#A71D31]/10 border-[#A71D31] shadow-xs'
                        : isDark ? 'bg-[#1D070A] border-[#D5BF86]/20 hover:border-[#D5BF86]/40' : 'bg-[#FAF9EB] border-[#D5BF86] hover:border-[#A71D31]/50'
                        }`}
                    >
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isChecked
                        ? 'bg-[#A71D31] text-white shadow-xs'
                        : isDark ? 'bg-[#2A0B10] text-[#D5BF86]' : 'bg-[#FAF9EB] text-[#8D775F] border border-[#D5BF86]'
                        }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs sm:text-sm text-[#3F0D12] dark:text-[#FAF9EB]">{g.title}</h4>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => { }}
                            className="accent-[#A71D31] rounded"
                          />
                        </div>
                        <p className="text-[11px] text-[#8D775F] leading-relaxed mt-0.5">
                          {g.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#8D775F] block mb-1">
                  Custom Personal Health Goal (Optional)
                </label>
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  placeholder="e.g., Track post-marathon recovery and renal clearance over 30 days"
                  className={`w-full p-3 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-[#A71D31] ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/30 text-white' : 'bg-[#FAF9EB] border-[#D5BF86] text-[#3F0D12]'
                    }`}
                />
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 6: GRANULAR CONSENT & ETHICAL GOVERNANCE
          ========================================================================== */}
          {step === 6 && (
            <div className="space-y-4 text-xs sm:text-sm">
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/20' : 'bg-[#FAF9EB] border-[#D5BF86]'
                }`}>
                <h3 className="font-bold text-sm text-[#A71D31] mb-1">
                  Patient Data Sovereignty & Informed Consent
                </h3>
                <p className="text-xs text-[#8D775F] leading-relaxed">
                  BioTrajectory operates on a strict patient-first model: you control your measurements, your data is stored locally, and no data is shared without your explicit consent.
                </p>
              </div>

              <div className="space-y-3">
                {/* Consent 1: Local Storage and Processing (Required) */}
                <label className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-colors ${consentStore
                  ? 'bg-[#A71D31]/10 border-[#A71D31]'
                  : isDark ? 'bg-[#1D070A] border-[#D5BF86]/20' : 'bg-[#FAF9EB] border-[#D5BF86]'
                  }`}>
                  <input
                    type="checkbox"
                    checked={consentStore}
                    onChange={(e) => setConsentStore(e.target.checked)}
                    className="mt-1 accent-[#A71D31] rounded"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm block text-[#3F0D12] dark:text-[#FAF9EB]">
                      1. Consent for Storing and Processing Health Measurements <span className="text-[#A71D31]">*</span>
                    </span>
                    <p className="text-[11px] text-[#8D775F] leading-relaxed mt-0.5">
                      I consent to BioTrajectory recording, processing, and storing my repeated biological measurements (urine test strip readings and optional biosensor metrics) on my local device ledger to establish my personalized health baseline.
                    </p>
                  </div>
                </label>

                {/* Consent 2: Doctor Sharing (Separate & Optional) */}
                <label className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-colors ${consentDoctor
                  ? 'bg-[#A71D31]/10 border-[#A71D31]'
                  : isDark ? 'bg-[#1D070A] border-[#D5BF86]/20' : 'bg-[#FAF9EB] border-[#D5BF86]'
                  }`}>
                  <input
                    type="checkbox"
                    checked={consentDoctor}
                    onChange={(e) => setConsentDoctor(e.target.checked)}
                    className="mt-1 accent-[#A71D31] rounded"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm block text-[#A71D31]">
                      2. Separate Consent: Voluntary Physician Sharing (Optional)
                    </span>
                    <p className="text-[11px] text-[#8D775F] leading-relaxed mt-0.5">
                      I consent to generating structured clinician handover briefs and voluntarily sharing longitudinal summaries with my healthcare provider. BioTrajectory will never transmit data to any doctor without my explicit trigger.
                    </p>
                  </div>
                </label>

                {/* Consent 3: AI Assistant (Separate & Optional) */}
                <label className={`p-4 rounded-2xl border flex items-start gap-3.5 cursor-pointer transition-colors ${consentAI
                  ? 'bg-[#A71D31]/10 border-[#A71D31]'
                  : isDark ? 'bg-[#1D070A] border-[#D5BF86]/20' : 'bg-[#FAF9EB] border-[#D5BF86]'
                  }`}>
                  <input
                    type="checkbox"
                    checked={consentAI}
                    onChange={(e) => setConsentAI(e.target.checked)}
                    className="mt-1 accent-[#A71D31] rounded"
                  />
                  <div>
                    <span className="font-bold text-xs sm:text-sm block text-[#3F0D12] dark:text-[#FAF9EB]">
                      3. Separate Consent: AI Longitudinal Pattern Explanations (Optional)
                    </span>
                    <p className="text-[11px] text-[#8D775F] leading-relaxed mt-0.5">
                      I consent to receiving educational, non-diagnostic AI explanations of my trajectory shifts. I understand AI outputs explain potential physiological context and do not constitute clinical advice.
                    </p>
                  </div>
                </label>

                {/* Non-Diagnostic Acknowledgment */}
                <label className={`p-3.5 rounded-2xl border flex items-start gap-3.5 cursor-pointer ${scopeAcknowledged ? 'bg-[#A71D31]/10 border-[#A71D31]' : isDark ? 'border-[#D5BF86]/30' : 'border-[#D5BF86]'
                  }`}>
                  <input
                    type="checkbox"
                    checked={scopeAcknowledged}
                    onChange={(e) => setScopeAcknowledged(e.target.checked)}
                    className="mt-1 accent-[#A71D31] rounded"
                  />
                  <div>
                    <span className="font-bold text-xs text-[#A71D31] block">
                      Non-Diagnostic Platform Acknowledgment <span className="text-[#A71D31]">*</span>
                    </span>
                    <p className="text-[11px] text-[#8D775F] leading-relaxed mt-0.5">
                      I understand that BioTrajectory tracks longitudinal trends and personal baselines. It does not provide medical diagnoses, prescribe drugs, or substitute for a licensed healthcare provider.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* =========================================================================
              STEP 7: SUMMARY & ACTIVATION
          ========================================================================== */}
          {step === 7 && (
            <div className="space-y-5">
              <div className={`p-5 rounded-3xl border ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/30' : 'bg-[#FAF9EB] border-[#D5BF86]'
                }`}>
                <div className="flex items-center gap-3 pb-3 border-b border-inherit">
                  <div className="w-12 h-12 rounded-2xl bg-[#A71D31]/20 text-[#A71D31] flex items-center justify-center font-extrabold text-lg">
                    {name ? name[0].toUpperCase() : 'P'}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-[#3F0D12] dark:text-[#FAF9EB]">{name || 'Pranjal Sharma'}</h3>
                    <p className="text-xs text-[#8D775F]">
                      Age Bracket: {ageRange} • Units: {units.toUpperCase()}
                      {height && weight ? ` • ${height} ${units === 'metric' ? 'cm' : 'in'}, ${weight} ${units === 'metric' ? 'kg' : 'lbs'}` : ''}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4 text-xs">
                  <div>
                    <span className="font-bold text-[#8D775F] uppercase text-[10px] block mb-1">Health Goals:</span>
                    <ul className="space-y-1">
                      {selectedGoals.map((g, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-[#3F0D12] dark:text-[#FAF9EB]">
                          <Check className="w-3.5 h-3.5 text-[#A71D31]" />
                          <span>{g}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-bold text-[#8D775F] uppercase text-[10px] block mb-1">Testing Context:</span>
                    <p className="text-[#473228] dark:text-[#D5BF86]">Schedule: {testingSchedule}</p>
                    <p className="text-[#473228] dark:text-[#D5BF86] mt-1">Hydration: {hydrationHabit}</p>
                    <p className="text-[#473228] dark:text-[#D5BF86] mt-1">Activity: {activityLevel}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-inherit flex flex-wrap gap-2 text-[11px]">
                  <span className="px-2.5 py-1 rounded-full bg-[#A71D31]/15 text-[#A71D31] border border-[#A71D31]/30 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Local Ledger Active
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#D5BF86]/20 text-[#3F0D12] dark:text-[#FAF9EB] border border-[#D5BF86] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Doctor Packet Enabled
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#FAF9EB] dark:bg-[#1D070A] text-[#8D775F] border border-[#D5BF86] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#A71D31]" /> Non-Diagnostic Boundary Locked
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-2xl border text-xs leading-relaxed flex items-center gap-3 ${isDark ? 'bg-[#2A0B10] border-[#A71D31]/40 text-[#FAF9EB]' : 'bg-[#FAF9EB] border-[#D5BF86] text-[#3F0D12]'
                }`}>
                <CheckCircle2 className="w-5 h-5 shrink-0 text-[#A71D31]" />
                <span>
                  Everything is set! You are ready to log repeated test strips and establish your personalized biological baseline.
                </span>
              </div>
            </div>
          )}

          {/* Validation / Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-[#A71D31]/10 border border-[#A71D31]/30 text-[#A71D31] text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className={`p-4 sm:p-6 border-t flex items-center justify-between gap-3 ${isDark ? 'border-[#D5BF86]/20 bg-[#1D070A]' : 'border-[#D5BF86] bg-[#FAF9EB]'
          }`}>
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${isDark ? 'border-[#D5BF86]/30 text-[#D5BF86] hover:bg-[#2A0B10]' : 'border-[#D5BF86] text-[#3F0D12] hover:bg-white'
                }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2.5">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#8D775F] hover:text-[#3F0D12] dark:hover:text-[#FAF9EB] transition-colors"
              >
                Skip for now
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#A71D31] hover:bg-[#851625] text-white text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <span>{step === totalSteps ? 'Activate My Health Profile' : 'Continue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
