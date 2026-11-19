import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
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
  RotateCcw,
  Globe,
  Plus,
  AlertOctagon,
  ShieldAlert,
  Camera,
  Upload
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { trajectoryStorage } from '../../services/trajectoryStorage';
import { BluetoothService } from '../../services/bluetoothService';
import {
  notifyPriorityChanged,
  DEFAULT_DISEASE_HISTORY,
  normalizeDisease
} from '../../services/patientPriorityService';
import {
  getPatientAvatar,
  savePatientAvatar,
  resetPatientAvatar,
  subscribeToAvatarChanges,
  processImageFile,
  DEFAULT_PATIENT_PHOTO
} from '../../services/patientAvatarService';

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
  const { language, setLanguage, isHindi } = useLanguage();

  const [activeTab, setActiveTab] = useState('profile');
  const [toastMessage, setToastMessage] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [urineDeviceEnabled, setUrineDeviceEnabledState] = useState(() => BluetoothService.isUrineDeviceEnabled());

  const handleToggleUrineDevice = () => {
    const nextVal = !urineDeviceEnabled;
    setUrineDeviceEnabledState(nextVal);
    BluetoothService.setUrineDeviceEnabled(nextVal);
    showToast(
      nextVal
        ? 'Urine Device switched ON! Protein, pH, Glucose & Nitrite telemetry are now active on your Dashboard.'
        : 'Urine Device switched OFF. Urine telemetry is now hidden from your Dashboard.'
    );
  };

  // Profile Form (Hydrated from healthProfile)
  const [name, setName] = useState(healthProfile?.name || currentUser?.name || 'User');
  const [ageRange, setAgeRange] = useState(healthProfile?.ageRange || '30–44');
  const [avatar, setAvatar] = useState(() => getPatientAvatar());
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const photoInputRef = React.useRef(null);

  useEffect(() => {
    const unsub = subscribeToAvatarChanges((newAvatar) => {
      setAvatar(newAvatar);
    });
    return unsub;
  }, []);

  const handleSettingsPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingPhoto(true);
      const dataUrl = await processImageFile(file, 320, 320, 0.88);
      setAvatar(dataUrl);
      savePatientAvatar(dataUrl);
      updateHealthProfile({ avatar: dataUrl, photoURL: dataUrl });
      showToast(isHindi ? 'रोगी की फोटो अपडेट हो गई!' : 'Patient photo uploaded successfully!');
    } catch (err) {
      console.error('Failed to upload photo:', err);
      showToast(err.message || 'Failed to upload photo.');
    } finally {
      setIsUploadingPhoto(false);
      if (e.target) e.target.value = '';
    }
  };
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

  // Medical History: Diseases Faced & Facing
  const [diseaseHistory, setDiseaseHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('bt_user_disease_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed.map(normalizeDisease);
      }
    } catch {}
    return healthProfile?.medicalHistory?.map(normalizeDisease) || DEFAULT_DISEASE_HISTORY;
  });

  const [diseaseFilter, setDiseaseFilter] = useState('all'); // 'all', 'ongoing', 'resolved'
  const [showAddDiseaseModal, setShowAddDiseaseModal] = useState(false);
  const [newDisease, setNewDisease] = useState({
    name: '',
    stage: 'Stage II',
    status: 'ongoing',
    timeline: 'Ongoing',
    isDanger: false,
    category: 'General',
    notes: '',
    editableBy: 'both' // 'both' | 'doctor' | 'patient'
  });

  const handleToggleDiseaseStatus = (id) => {
    setDiseaseHistory((prev) => {
      const target = prev.find(d => d.id === id);
      if (target && target.editableBy === 'doctor') {
        showToast(isHindi 
          ? 'यह स्थिति केवल डॉक्टर द्वारा प्रबंधित है। स्थिति बदलने के लिए अपने डॉक्टर से संपर्क करें।' 
          : 'This condition is set to Doctor-Only management. Consult Dr. Patel to modify.');
        return prev;
      }

      const updated = prev.map((d) => {
        if (d.id === id) {
          const nextStatus = d.status === 'ongoing' ? 'resolved' : 'ongoing';
          return {
            ...d,
            status: nextStatus,
            timeline: nextStatus === 'resolved' ? (d.timeline && !d.timeline.includes('Ongoing') ? d.timeline : 'Resolved') : 'Ongoing',
            lastUpdatedBy: 'Patient (Alex Johnson)',
            updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          };
        }
        return d;
      });
      try {
        localStorage.setItem('bt_user_disease_history', JSON.stringify(updated));
      } catch {}
      notifyPriorityChanged();
      showToast(isHindi ? 'स्थिति अपडेट की गई!' : 'Disease status updated!');
      return updated;
    });
  };

  const handleUpdateAuthority = (id, newAuthority) => {
    setDiseaseHistory((prev) => {
      const updated = prev.map((d) => {
        if (d.id === id) {
          return {
            ...d,
            editableBy: newAuthority,
            lastUpdatedBy: 'Patient (Alex Johnson)',
            updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          };
        }
        return d;
      });
      try {
        localStorage.setItem('bt_user_disease_history', JSON.stringify(updated));
      } catch {}
      notifyPriorityChanged();
      showToast(isHindi 
        ? `परिवर्तन अनुमति सेट: ${newAuthority === 'both' ? 'डॉक्टर और रोगी दोनों' : newAuthority === 'doctor' ? 'केवल डॉक्टर' : 'केवल रोगी'}` 
        : `Permission updated: ${newAuthority === 'both' ? 'Both Doctor & Patient' : newAuthority === 'doctor' ? 'Doctor Only' : 'Patient Only'}`);
      return updated;
    });
  };

  const handleDeleteDisease = (id) => {
    setDiseaseHistory((prev) => {
      const target = prev.find(d => d.id === id);
      if (target && target.editableBy === 'doctor') {
        showToast(isHindi 
          ? 'यह स्थिति केवल डॉक्टर द्वारा प्रबंधित है। केवल डॉक्टर इसे हटा सकते हैं।' 
          : 'This condition is set to Doctor-Only. Only your clinician can remove it.');
        return prev;
      }

      const updated = prev.filter((d) => d.id !== id);
      try {
        localStorage.setItem('bt_user_disease_history', JSON.stringify(updated));
      } catch {}
      notifyPriorityChanged();
      showToast('Condition removed from medical history.');
      return updated;
    });
  };

  const handleAddDisease = (e) => {
    e.preventDefault();
    if (!newDisease.name.trim()) return;

    const isDanger = Boolean(newDisease.isDanger);
    const entry = {
      id: `dis-${Date.now()}`,
      name: newDisease.name.trim(),
      stage: newDisease.stage?.trim() || (isDanger ? 'Stage II' : 'Active'),
      status: newDisease.status,
      timeline: newDisease.timeline.trim() || (newDisease.status === 'ongoing' ? 'Ongoing' : 'Resolved'),
      isDanger,
      dangerLevel: isDanger ? 'critical' : newDisease.status === 'ongoing' ? 'moderate' : 'resolved',
      category: newDisease.category.trim() || 'General',
      notes: newDisease.notes.trim() || (isDanger ? 'Active clinical oncology/critical care.' : ''),
      editableBy: newDisease.editableBy || 'both',
      lastUpdatedBy: 'Patient (Alex Johnson)',
      updatedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    setDiseaseHistory((prev) => {
      const updated = [entry, ...prev];
      try {
        localStorage.setItem('bt_user_disease_history', JSON.stringify(updated));
      } catch {}
      notifyPriorityChanged();
      return updated;
    });

    setNewDisease({
      name: '',
      stage: 'Stage II',
      status: 'ongoing',
      timeline: 'Ongoing',
      isDanger: false,
      category: 'General',
      notes: '',
      editableBy: 'both'
    });
    setShowAddDiseaseModal(false);
    showToast('New condition added to your medical history.');
  };

  const filteredDiseases = diseaseHistory.filter((d) => {
    if (diseaseFilter === 'ongoing') return d.status === 'ongoing';
    if (diseaseFilter === 'resolved') return d.status === 'resolved';
    return true;
  });

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
    try {
      localStorage.setItem('bt_user_disease_history', JSON.stringify(diseaseHistory));
      notifyPriorityChanged();
    } catch {}
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
      medicalHistory: diseaseHistory,
      conditions: diseaseHistory.filter(d => d.status === 'ongoing').map(d => d.name),
      goals: selectedGoals,
      customGoal,
      onboardingCompleted: true,
      updatedAt: new Date().toISOString()
    });
    if (updated) {
      showToast('Health profile and disease history updated successfully!');
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
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#A9D6F5] text-[#1F150E] font-bold font-bold text-sm shadow-2xl animate-fade-in border border-teal-300/30">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {isHindi ? 'सेटिंग्स एवं स्वास्थ्य प्रोफाइल' : 'Settings & Health Profile'}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-2">
          {isHindi
            ? 'अपनी व्यक्तिगत स्वास्थ्य प्रोफाइल, इकाइयां, भाषा और कनेक्टेड उपकरण प्रबंधित करें।'
            : 'Manage your personal health profile, units, baseline goals, language, and connected devices.'}
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 text-sm font-semibold overflow-x-auto shadow-xs">
        {[
          { id: 'profile', label: isHindi ? 'स्वास्थ्य प्रोफाइल' : 'Health Profile & Goals', icon: User },
          { id: 'devices', label: isHindi ? 'कनेक्टेड डिवाइसेस' : 'Connected Devices', icon: Droplet },
          { id: 'language', label: isHindi ? 'भाषा (Language)' : 'Language / भाषा', icon: Globe },
          { id: 'security', label: isHindi ? 'गोपनीयता व सहमति' : 'Privacy & Consent', icon: ShieldCheck },
          { id: 'notifications', label: isHindi ? 'सूचनाएं' : 'Notifications', icon: Bell }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${activeTab === tab.id
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
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
        <form onSubmit={handleProfileSave} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-5 border-b border-slate-200 dark:border-slate-800">
            {/* Patient Photo Container with Upload Overlay */}
            <div className="relative group shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-md bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>

              <input
                type="file"
                ref={photoInputRef}
                onChange={handleSettingsPhotoUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={isUploadingPhoto}
                className="absolute inset-0 rounded-2xl bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
                title="Change Photo"
              >
                <Camera className="w-5 h-5 text-cyan-300" />
                <span className="text-[10px] font-bold">
                  {isUploadingPhoto ? '...' : 'Upload'}
                </span>
              </button>
            </div>

            <div className="text-center sm:text-left flex-1 min-w-0 space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">{name}</h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                  {isHindi ? 'सत्यापित रोगी' : 'Patient Ledger Active'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Age Bracket: {ageRange} • Units: {units.toUpperCase()} • Patient Ledger Active
              </p>
              <div className="pt-1.5 flex items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={isUploadingPhoto}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/25 font-bold text-xs transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploadingPhoto ? (isHindi ? 'अपलोड हो रहा है...' : 'Uploading...') : (isHindi ? 'फोटो अपलोड करें' : 'Upload Photo')}</span>
                </button>
              </div>
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
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A9D6F5]"
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
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A9D6F5] font-medium"
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
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A9D6F5] font-medium"
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
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setUnits('metric')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${units === 'metric'
                      ? 'bg-[#A9D6F5] text-[#1F150E] font-bold shadow-xs'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                    }`}
                >
                  Metric (kg, cm)
                </button>
                <button
                  type="button"
                  onClick={() => setUnits('imperial')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${units === 'imperial'
                      ? 'bg-[#A9D6F5] text-[#1F150E] font-bold shadow-xs'
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
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A9D6F5]"
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
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A9D6F5]"
              />
            </div>
          </div>

          {/* =========================================================================
              MEDICAL HISTORY: DISEASES FACED & FACING
          ========================================================================== */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-[#2672A8] dark:text-[#A9D6F5]" />
                  <h4 className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                    {isHindi ? 'चिकित्सीय इतिहास: रोग (भूतपूर्व एवं वर्तमान)' : 'Medical History: Diseases Faced & Facing'}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  {isHindi
                    ? 'वर्तमान में जारी स्थितियां (Facing) एवं पूर्व में ठीक हो चुकी बीमारियां (Faced) जैसे Jaundice, Cancer आदि।'
                    : 'Track active conditions under treatment (Facing) and past resolved medical episodes (Faced).'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddDiseaseModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#A9D6F5] text-[#1F150E] font-extrabold text-xs sm:text-sm hover:bg-[#7CBFEA] transition-all shadow-xs cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{isHindi ? '+ नई बीमारी जोड़ें' : '+ Add Disease / Condition'}</span>
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 pt-1">
              {[
                { id: 'all', label: isHindi ? `सभी (${diseaseHistory.length})` : `All (${diseaseHistory.length})` },
                {
                  id: 'ongoing',
                  label: isHindi
                    ? `वर्तमान / सक्रिय (${diseaseHistory.filter(d => d.status === 'ongoing').length})`
                    : `Facing (Ongoing) (${diseaseHistory.filter(d => d.status === 'ongoing').length})`,
                  hasDanger: diseaseHistory.some(d => d.status === 'ongoing' && d.isDanger)
                },
                {
                  id: 'resolved',
                  label: isHindi
                    ? `भूतपूर्व / ठीक हुए (${diseaseHistory.filter(d => d.status === 'resolved').length})`
                    : `Faced (Past / Resolved) (${diseaseHistory.filter(d => d.status === 'resolved').length})`
                }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setDiseaseFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    diseaseFilter === tab.id
                      ? 'bg-[#A9D6F5] text-[#1F150E] font-extrabold shadow-xs'
                      : 'bg-slate-100 dark:bg-[#1F150E] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2A1D15] border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {tab.hasDanger && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  )}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Disease Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {filteredDiseases.map((disease) => {
                const isOngoing = disease.status === 'ongoing';
                const isDanger = (disease.isDanger || disease.dangerLevel === 'critical') && isOngoing;

                return (
                  <div
                    key={disease.id}
                    className={`p-5 rounded-3xl border transition-all space-y-2.5 relative shadow-xs ${
                      isDanger
                        ? 'bg-rose-500/10 dark:bg-rose-950/30 border-rose-500/60 dark:border-rose-500/70 shadow-sm ring-1 ring-rose-500/20'
                        : isOngoing
                        ? 'bg-amber-500/5 dark:bg-[#1F150E] border-amber-500/30 dark:border-[#4A3525]'
                        : 'bg-slate-50/80 dark:bg-[#1F150E]/60 border-slate-200 dark:border-[#4A3525]'
                    }`}
                  >
                    {/* Header: Disease Name & State Toggle */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <h5 className={`font-extrabold text-base sm:text-lg tracking-tight ${
                          isDanger ? 'text-rose-950 dark:text-rose-100' : 'text-slate-900 dark:text-white'
                        }`}>
                          {disease.name}
                        </h5>
                        {disease.stage && (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-[#A9D6F5]/30 text-[#1F150E] dark:text-[#A9D6F5] border border-[#A9D6F5]/40">
                            {disease.stage}
                          </span>
                        )}
                        {isDanger && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[10px] tracking-wide uppercase shadow-xs">
                            <AlertOctagon className="w-3 h-3" />
                            {isHindi ? '🚨 गंभीर खतरा' : '🚨 Danger'}
                          </span>
                        )}
                      </div>

                      {/* State Badge (Interactive Toggle) & Delete */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleDiseaseStatus(disease.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                            isOngoing
                              ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-200 border border-amber-500/40'
                              : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-900 dark:text-emerald-200 border border-emerald-500/40'
                          }`}
                          title={isHindi ? 'स्थिति बदलने के लिए क्लिक करें' : 'Click to toggle Facing / Faced state'}
                        >
                          {isOngoing ? (
                            <>
                              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                              <span>{isHindi ? 'सक्रिय (Facing)' : 'Facing (Ongoing)'}</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                              <span>{isHindi ? `भूतपूर्व (${disease.timeline || 'Faced'})` : `Faced (${disease.timeline || 'Past'})`}</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteDisease(disease.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1.5 rounded-xl cursor-pointer"
                          title={isHindi ? 'हटाएं' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 2-Line Direction / Description */}
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                      {disease.notes || disease.description || (isHindi ? 'नैदानिक निगरानी एवं परामर्श दर्ज।' : 'Clinical management and continuous trajectory monitoring documented.')}
                    </p>

                    {/* Modifier & Authority Control: Doctor / Patient / Both */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-500 dark:text-slate-400 text-[11px]">
                          {isHindi ? 'परिवर्तन अनुमति:' : 'Can be changed by:'}
                        </span>
                        <select
                          value={disease.editableBy || 'both'}
                          onChange={(e) => handleUpdateAuthority(disease.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer focus:outline-none ${
                            disease.editableBy === 'doctor'
                              ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/40'
                              : disease.editableBy === 'patient'
                              ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/40'
                              : 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/40'
                          }`}
                        >
                          <option value="both">👨‍⚕️👤 Both (Doctor & Patient)</option>
                          <option value="doctor">👨‍⚕️ Doctor Only</option>
                          <option value="patient">👤 Patient Only</option>
                        </select>
                      </div>

                      <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                        {isHindi ? 'अंतिम बदलाव:' : 'Last updated:'}{' '}
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {disease.lastUpdatedBy || 'Doctor & Patient'}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lifestyle Information */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#2672A8] dark:text-[#A9D6F5]">
              Optional Lifestyle Context (Calibrates Confounder Sensitivity)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Activity Level</label>
                <select
                  value={activityLevel}
                  onChange={e => setActivityLevel(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
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
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
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
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
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
            <h4 className="font-bold text-sm uppercase tracking-wider text-[#2672A8] dark:text-[#A9D6F5]">
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
                        ? 'bg-[#A9D6F5]/10 border-[#A9D6F5]'
                        : 'bg-slate-50 dark:bg-[#1F150E] border-slate-200 dark:border-slate-800'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${isSelected ? 'bg-[#A9D6F5] text-[#1F150E] font-bold' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
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
                          className="accent-[#2672A8] rounded"
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
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-5 border-t border-slate-200 dark:border-slate-800">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-sm font-bold bg-[#A9D6F5] text-[#1F150E] font-bold hover:bg-[#7CBFEA] transition-all shadow-md active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>Save Health Profile</span>
            </button>
          </div>

          {/* ADD DISEASE MODAL */}
          {showAddDiseaseModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="w-full max-w-lg rounded-3xl bg-[#F6F0E4] dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] p-6 sm:p-7 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD1] dark:border-[#4A3525]">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-[#2672A8] dark:text-[#A9D6F5]" />
                    <h3 className="text-lg font-extrabold text-[#1F150E] dark:text-white">
                      {isHindi ? 'नई बीमारी / स्थिति जोड़ें' : 'Add Disease / Medical Condition'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddDiseaseModal(false)}
                    className="p-1 rounded-xl hover:bg-slate-200 dark:hover:bg-[#2A1D15] text-slate-500 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3.5 text-xs">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="font-bold text-[#1F150E] dark:text-white uppercase tracking-wider text-[11px]">
                      {isHindi ? 'बीमारी का नाम' : 'Disease / Condition Name'}
                    </label>
                    <input
                      type="text"
                      value={newDisease.name}
                      onChange={(e) => setNewDisease({ ...newDisease, name: e.target.value })}
                      placeholder={isHindi ? 'उदा. Jaundice, Cancer, Hypertension' : 'e.g. Jaundice, Cancer, Hypertension, Asthma'}
                      className="w-full p-3 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] text-sm text-[#1F150E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#A9D6F5]"
                      required
                    />
                  </div>

                  {/* Status & Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#1F150E] dark:text-white uppercase tracking-wider text-[11px]">
                        {isHindi ? 'स्थिति (Status)' : 'Status'}
                      </label>
                      <select
                        value={newDisease.status}
                        onChange={(e) => setNewDisease({ ...newDisease, status: e.target.value })}
                        className="w-full p-3 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] text-sm text-[#1F150E] dark:text-white focus:outline-none"
                      >
                        <option value="ongoing">{isHindi ? 'वर्तमान में जारी (Facing)' : 'Facing (Ongoing / Active)'}</option>
                        <option value="resolved">{isHindi ? 'भूतपूर्व / ठीक हुआ (Faced)' : 'Faced (Past / Resolved)'}</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-[#1F150E] dark:text-white uppercase tracking-wider text-[11px]">
                        {isHindi ? 'समयसीमा (कब हुआ / अवधि)' : 'Timeline / When'}
                      </label>
                      <input
                        type="text"
                        value={newDisease.timeline}
                        onChange={(e) => setNewDisease({ ...newDisease, timeline: e.target.value })}
                        placeholder={isHindi ? 'उदा. 4 months ago, Ongoing' : 'e.g. 4 months ago, Ongoing, 1 year ago'}
                        className="w-full p-3 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] text-sm text-[#1F150E] dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Danger Disease Toggle */}
                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      id="isDangerCheckbox"
                      checked={newDisease.isDanger}
                      onChange={(e) => setNewDisease({ ...newDisease, isDanger: e.target.checked })}
                      className="mt-0.5 accent-rose-600 rounded cursor-pointer"
                    />
                    <label htmlFor="isDangerCheckbox" className="cursor-pointer space-y-0.5 flex-1">
                      <strong className="block text-rose-700 dark:text-rose-300 font-extrabold text-xs">
                        {isHindi ? '🚨 गंभीर खतरा बीमारी (Sign of Danger Disease)' : '🚨 Mark as Danger Disease (High Risk)'}
                      </strong>
                      <p className="text-[11px] text-rose-800/80 dark:text-rose-200/80">
                        {isHindi
                          ? 'कैंसर, गंभीर हृदय रोग, अंग विफलता जैसी गंभीर बीमारियों के लिए चुनें।'
                          : 'Select for life-threatening or critical illnesses like Cancer, Cardiac Failure, or Malignancy.'}
                      </p>
                    </label>
                  </div>

                  {/* Stage & Who Can Change */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-[#1F150E] dark:text-white uppercase tracking-wider text-[11px]">
                        {isHindi ? 'रोग का चरण / स्टेज (Stage)' : 'Clinical Stage / Severity'}
                      </label>
                      <input
                        type="text"
                        value={newDisease.stage || ''}
                        onChange={(e) => setNewDisease({ ...newDisease, stage: e.target.value })}
                        placeholder="e.g. Stage II, Stage 1, Acute, Chronic"
                        className="w-full p-3 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] text-sm text-[#1F150E] dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-[#1F150E] dark:text-white uppercase tracking-wider text-[11px]">
                        {isHindi ? 'बदलने की अनुमति (Can be changed by)' : 'Who Can Change This?'}
                      </label>
                      <select
                        value={newDisease.editableBy || 'both'}
                        onChange={(e) => setNewDisease({ ...newDisease, editableBy: e.target.value })}
                        className="w-full p-3 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] text-sm text-[#1F150E] dark:text-white focus:outline-none"
                      >
                        <option value="both">👨‍⚕️👤 Both (Doctor & Patient)</option>
                        <option value="doctor">👨‍⚕️ Doctor Only</option>
                        <option value="patient">👤 Patient Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Category & Notes */}
                  <div className="space-y-1">
                    <label className="font-bold text-[#1F150E] dark:text-white uppercase tracking-wider text-[11px]">
                      {isHindi ? 'चिकित्सीय श्रेणी' : 'Clinical Category'}
                    </label>
                    <input
                      type="text"
                      value={newDisease.category}
                      onChange={(e) => setNewDisease({ ...newDisease, category: e.target.value })}
                      placeholder="e.g. Oncology, Hepatic (Liver), Cardiovascular, Pulmonary"
                      className="w-full p-3 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] text-sm text-[#1F150E] dark:text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#1F150E] dark:text-white uppercase tracking-wider text-[11px]">
                      {isHindi ? 'चिकित्सीय विवरण / नोट्स' : 'Clinical Notes / Treatment'}
                    </label>
                    <textarea
                      rows={2}
                      value={newDisease.notes}
                      onChange={(e) => setNewDisease({ ...newDisease, notes: e.target.value })}
                      placeholder={isHindi ? 'उदा. ऑन्कोलॉजी फॉलोअप जारी, लिवर एंजाइम सामान्य' : 'e.g. Oncology follow-up active, periodic biomarker tests'}
                      className="w-full p-3 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] text-sm text-[#1F150E] dark:text-white focus:outline-none resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E8DFD1] dark:border-[#4A3525]">
                  <button
                    type="button"
                    onClick={() => setShowAddDiseaseModal(false)}
                    className="px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2A1D15] cursor-pointer"
                  >
                    {isHindi ? 'रद्द करें' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={handleAddDisease}
                    disabled={!newDisease.name.trim()}
                    className="px-6 py-2.5 rounded-2xl bg-[#A9D6F5] text-[#1F150E] text-xs font-extrabold hover:bg-[#7CBFEA] disabled:opacity-50 transition-all shadow-sm cursor-pointer"
                  >
                    {isHindi ? 'बीमारी जोड़ें' : 'Add Disease'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      )}

      {/* =========================================================================
          TAB: URINE DIAGNOSTIC DEVICE & SENSORS (SETTINGS MODE)
      ========================================================================== */}
      {activeTab === 'devices' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 shadow-xs space-y-7 text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Urine Diagnostic Device Mode
                </h3>
                <span className={`text-xs px-3 py-1 rounded-full font-bold border flex items-center gap-1.5 ${
                  urineDeviceEnabled
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-500/10 text-slate-500 border-slate-400/30'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${urineDeviceEnabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                  {urineDeviceEnabled ? 'Device Active on Dashboard' : 'Device Switched OFF'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Controls whether your BioTrajectory 10SG Optical Urine Analyzer telemetry is displayed on your main Dashboard.
              </p>
            </div>

            {/* Interactive Setting Mode Toggle Switch */}
            <button
              type="button"
              onClick={handleToggleUrineDevice}
              className={`relative inline-flex h-9 w-18 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#A9D6F5] focus:ring-offset-2 ${
                urineDeviceEnabled ? 'bg-[#A9D6F5]' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              role="switch"
              aria-checked={urineDeviceEnabled}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-8 w-8 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center text-xs font-bold ${
                  urineDeviceEnabled ? 'translate-x-9 text-[#2672A8]' : 'translate-x-0 text-slate-400'
                }`}
              >
                {urineDeviceEnabled ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          {/* Biomarkers Streaming Explanation */}
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
              Telemetry Channels Streamed to Dashboard
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              When switched <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">ON</strong>, the following 4 clinical biomarker readings are calculated and rendered on your main Dashboard:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">1. Protein (Albumin)</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-500 font-bold">mg/dL</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Monitors glomerular barrier permeability and renal filtration integrity to detect microalbumin variation early.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">2. pH Level</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-bold">pH 6.0 – 7.0</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Reflects systemic acid-base equilibrium, dietary electrolyte influence, and metabolic buffering.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">3. Glucose Level</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 font-bold">mg/dL</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Detects renal glycemic spillage occurring when serum glucose exceeds the biological tubular reabsorption threshold (~180 mg/dL).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">4. Nitrite Level</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-500 font-bold">Indicator</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Identifies bacterial nitrate-to-nitrite reduction activity, providing early urinary tract microbiome surveillance.
                </p>
              </div>
            </div>
          </div>

          {/* Hardware Connection Card */}
          <div className="p-5 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-cyan-500/20 text-cyan-500 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <Droplet className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">BioTrajectory Smart Optical 10SG Spectrophotometer</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">BLE GATT Stream • 10-Channel Reflectance Sensor • Battery 96%</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleToggleUrineDevice}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                urineDeviceEnabled
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/25'
                  : 'bg-[#A9D6F5] text-[#1F150E] font-bold hover:bg-[#7CBFEA]'
              }`}
            >
              {urineDeviceEnabled ? 'Turn Device OFF' : 'Turn Device ON'}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PRIVACY & INFORMED CONSENT PREFERENCES
      ========================================================================== */}
      {activeTab === 'security' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 shadow-xs space-y-6 text-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Privacy, Security &amp; Informed Consent</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Full transparency on data storage, physician sharing permissions, and non-diagnostic medical boundaries.
              </p>
            </div>
          </div>

          {/* Clear Scope Disclaimer: What BioTrajectory Does & Does NOT Do */}
          <div className={`p-4 rounded-2xl border ${isDark ? 'bg-[#1F150E] border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
            <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
              <ShieldCheck className="w-4 h-4 text-[#2672A8]" />
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
                ? 'bg-[#A9D6F5]/5 border-[#A9D6F5]/40'
                : 'bg-slate-50 dark:bg-[#1F150E] border-slate-200 dark:border-slate-800'
              }`}>
              <input
                type="checkbox"
                checked={consentStore}
                onChange={e => setConsentStore(e.target.checked)}
                className="w-4 h-4 mt-0.5 accent-[#2672A8] rounded"
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
                : 'bg-slate-50 dark:bg-[#1F150E] border-slate-200 dark:border-slate-800'
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
                : 'bg-slate-50 dark:bg-[#1F150E] border-slate-200 dark:border-slate-800'
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
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#A9D6F5] text-[#1F150E] font-bold hover:bg-[#7CBFEA] transition-all shadow-xs"
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
          TAB 4: NOTIFICATIONS
      ========================================================================== */}
      {activeTab === 'notifications' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 text-sm">
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
              <label key={item.key} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-[#A9D6F5]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={notifications[item.key]}
                  onChange={e => {
                    setNotifications({ ...notifications, [item.key]: e.target.checked });
                    showToast('Notification preference saved.');
                  }}
                  className="w-4 h-4 mt-0.5 rounded accent-[#2672A8]"
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
          TAB: LANGUAGE SETTING
      ========================================================================== */}
      {activeTab === 'language' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 shadow-xs space-y-5 text-sm">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {isHindi ? 'वेबसाइट भाषा प्राथमिकता' : 'Language Preference'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mt-1 text-xs">
              {isHindi
                ? 'अपनी पसंदीदा भाषा चुनें। अंग्रेजी और हिंदी के बीच कभी भी स्विच कर सकते हैं।'
                : 'Select your preferred language. You can switch between English and Hindi at any time.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => {
                setLanguage('en');
                showToast('Switched to English');
              }}
              className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                language === 'en'
                  ? 'border-cyan-500 ring-2 ring-cyan-500/20 bg-cyan-50/50 dark:bg-cyan-950/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇬🇧</span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">English</p>
                  <p className="text-xs text-slate-500 mt-0.5">Clinical English terminology</p>
                </div>
              </div>
              {language === 'en' && <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
            </button>

            <button
              type="button"
              onClick={() => {
                setLanguage('hi');
                showToast('भाषा हिंदी में बदली गई');
              }}
              className={`p-5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                language === 'hi'
                  ? 'border-cyan-500 ring-2 ring-cyan-500/20 bg-cyan-50/50 dark:bg-cyan-950/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🇮🇳</span>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">हिंदी (Hindi)</p>
                  <p className="text-xs text-slate-500 mt-0.5">स्पष्ट, प्राकृतिक हिंदी अनुवाद</p>
                </div>
              </div>
              {language === 'hi' && <CheckCircle2 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />}
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Account & Health Data Deletion */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="max-w-md w-full p-6 sm:p-7 rounded-3xl bg-white dark:bg-[#2B1E15] border border-rose-500/30 shadow-2xl space-y-4">
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
