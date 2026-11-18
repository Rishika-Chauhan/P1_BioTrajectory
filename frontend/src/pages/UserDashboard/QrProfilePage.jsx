import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import {
  ShieldCheck,
  Clock,
  Copy,
  CheckCircle2,
  Settings,
  User,
  Bluetooth,
  Sun,
  Moon,
  Globe,
  Heart,
  Droplet,
  Activity,
  Check,
  ChevronRight,
  Save,
  Lock,
  Smartphone,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { BluetoothService } from '../../services/bluetoothService';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

/**
 * Normalization helpers to prevent React runtime crash:
 * "Objects are not valid as a React child (found: object with keys {name, relationship, phone})"
 */
const normalizeContactToString = (val) => {
  if (!val) return '+1 (555) 234-5678 (Spouse)';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    const parts = [
      val.name,
      val.relationship ? `(${val.relationship})` : '',
      val.phone
    ].filter(Boolean);
    return parts.join(' ') || '+1 (555) 234-5678 (Spouse)';
  }
  return String(val);
};

const normalizeAllergiesToString = (val) => {
  if (!val) return 'None recorded';
  if (Array.isArray(val)) return val.join(', ') || 'None recorded';
  if (typeof val === 'string') return val;
  return String(val);
};

const normalizeConditionsToString = (val) => {
  if (!val) return 'Mild Hypertension (Monitored)';
  if (Array.isArray(val)) return val.join(', ') || 'None recorded';
  if (typeof val === 'string') return val;
  return String(val);
};

export default function QrProfilePage() {
  const { currentUser, healthProfile, updateHealthProfile } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();
  const { language, setLanguage, t, isHindi } = useLanguage();

  const [activeView, setActiveView] = useState('profile'); // 'profile' or 'accountSettings'
  const [token, setToken] = useState('biotrajectory_qr_demo_token');
  const [expiration, setExpiration] = useState('24h');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Device telemetry state
  const [urineDeviceEnabled, setUrineDeviceEnabled] = useState(() =>
    BluetoothService.isUrineDeviceEnabled()
  );
  const [scanningDevices, setScanningDevices] = useState(false);

  // Profile Form state - safely initialized with normalizers
  const [name, setName] = useState(() =>
    healthProfile?.name || currentUser?.name || currentUser?.displayName || 'Alex Johnson'
  );
  const [ageRange, setAgeRange] = useState(() => healthProfile?.ageRange || '30–44');
  const [gender, setGender] = useState(() => healthProfile?.gender || 'Male');
  const [bloodGroup, setBloodGroup] = useState(() => healthProfile?.bloodGroup || 'O+');
  const [emergencyContact, setEmergencyContact] = useState(() =>
    normalizeContactToString(healthProfile?.emergencyContact)
  );
  const [allergies, setAllergies] = useState(() =>
    normalizeAllergiesToString(healthProfile?.allergies)
  );
  const [conditions, setConditions] = useState(() =>
    normalizeConditionsToString(healthProfile?.conditions)
  );
  const [height, setHeight] = useState(() => healthProfile?.height ? String(healthProfile.height) : '178');
  const [weight, setWeight] = useState(() => healthProfile?.weight ? String(healthProfile.weight) : '72');

  // Synchronize state when healthProfile changes
  useEffect(() => {
    if (healthProfile) {
      if (healthProfile.name) setName(healthProfile.name);
      else if (currentUser?.name) setName(currentUser.name);

      if (healthProfile.ageRange) setAgeRange(healthProfile.ageRange);
      if (healthProfile.gender) setGender(healthProfile.gender);
      if (healthProfile.bloodGroup) setBloodGroup(healthProfile.bloodGroup);
      if (healthProfile.emergencyContact !== undefined) {
        setEmergencyContact(normalizeContactToString(healthProfile.emergencyContact));
      }
      if (healthProfile.allergies !== undefined) {
        setAllergies(normalizeAllergiesToString(healthProfile.allergies));
      }
      if (healthProfile.conditions !== undefined) {
        setConditions(normalizeConditionsToString(healthProfile.conditions));
      }
      if (healthProfile.height !== undefined && healthProfile.height !== null) {
        setHeight(String(healthProfile.height));
      }
      if (healthProfile.weight !== undefined && healthProfile.weight !== null) {
        setWeight(String(healthProfile.weight));
      }
    }
  }, [healthProfile, currentUser]);

  const secureShareUrl = `https://biotrajectory.health/access/patient?token=${token}&scope=emergency_vitals`;

  const showToast = (message) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(null), 3500);
  };

  const handleToggleUrineDevice = () => {
    const nextVal = !urineDeviceEnabled;
    setUrineDeviceEnabled(nextVal);
    BluetoothService.setUrineDeviceEnabled(nextVal);
    showToast(
      nextVal
        ? (isHindi ? 'यूरिन बायोमार्कर डिवाइस सक्रिय किया गया!' : 'Urine Strip Analyzer switched ON! Telemetry is active.')
        : (isHindi ? 'यूरिन बायोमार्कर डिवाइस बंद किया गया।' : 'Urine Strip Analyzer switched OFF.')
    );
  };

  const handleScanDevices = () => {
    setScanningDevices(true);
    setTimeout(() => {
      setScanningDevices(false);
      showToast(isHindi ? '2 ब्लूटूथ स्वास्थ्य उपकरण खोजे गए और सिंक किए गए!' : '2 Bluetooth health devices discovered and synced!');
    }, 1500);
  };

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(secureShareUrl);
      setCopied(true);
      showToast(isHindi ? 'आपातकालीन लिंक क्लिपबोर्ड पर कॉपी हुआ!' : 'Secure emergency link copied to your clipboard!');
      window.setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      showToast(isHindi ? 'लिंक कॉपी नहीं हो सका' : 'Could not copy link');
    }
  };

  const handleSaveProfile = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setIsSaving(true);
    try {
      await updateHealthProfile({
        name,
        ageRange,
        gender,
        bloodGroup,
        emergencyContact,
        allergies,
        conditions,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        consent: {
          storeAndProcessHealthData: true,
          nonDiagnosticScopeAcknowledged: true,
          ...(healthProfile?.consent || {})
        },
        updatedAt: new Date().toISOString()
      });
      showToast(
        isHindi
          ? 'प्रोफाइल एवं खाता सेटिंग्स सफलतापूर्वक सुरक्षित की गईं!'
          : 'Profile & account settings saved successfully!'
      );
    } catch (error) {
      console.error('Error saving profile:', error);
      showToast(
        isHindi
          ? `सेव करने में त्रुटि: ${error.message || 'कृपया पुनः प्रयास करें'}`
          : `Error saving profile: ${error.message || 'Please try again'}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <DisclaimerBanner />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-cyan-400 text-slate-950 font-bold text-sm shadow-2xl animate-fade-in border border-cyan-300">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* HEADER WITH ACCOUNT SETTINGS BUTTON ON TOP RIGHT CORNER (User Req)    */}
      {/* --------------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20">
              {isHindi ? 'रोगी पहचान पोर्टल' : 'Patient Identity & Preferences'}
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {isHindi ? 'सत्यापित खाता' : 'Verified Account'}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {activeView === 'accountSettings'
              ? (isHindi ? 'खाता सेटिंग्स एवं प्राथमिकताएं' : 'Account Settings & Preferences')
              : (isHindi ? 'मेरी स्वास्थ्य प्रोफाइल एवं आपातकालीन आईडी' : 'Patient Health Profile & Emergency ID')}
          </h1>
          <p className="text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-400 mt-1">
            {activeView === 'accountSettings'
              ? (isHindi ? 'कनेक्टेड डिवाइसेस, डार्क/लाइट थीम, भाषा और व्यक्तिगत खाता विवरण प्रबंधित करें।' : 'Manage connected health peripherals, dark/light theme, language, and clinical profile credentials.')
              : (isHindi ? 'अपनी डिजिटल मेडिकल आईडी, आपातकालीन संपर्क और त्वरित सेटिंग्स देखें।' : 'View your digital emergency QR token, verified medical passport, and quick health peripherals.')}
          </p>
        </div>

        {/* TOP RIGHT CORNER ACCOUNT SETTINGS ACTION BUTTONS */}
        <div className="shrink-0 flex items-center gap-2">
          {activeView === 'profile' ? (
            <button
              type="button"
              onClick={() => setActiveView('accountSettings')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 shadow-md shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
              title={isHindi ? 'खाता सेटिंग्स खोलें' : 'Open Account Settings'}
            >
              <Settings className="w-4 h-4" />
              <span>{isHindi ? 'खाता सेटिंग्स (Account Settings)' : 'Account Settings'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setActiveView('profile')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
              title={isHindi ? 'प्रोफाइल एवं क्यूआर पर वापस जाएं' : 'Back to Profile & Emergency QR'}
            >
              <User className="w-4 h-4" />
              <span>{isHindi ? 'प्रोफाइल पर वापस जाएं' : 'Back to Profile'}</span>
            </button>
          )}

          <Link
            to="/dashboard/settings"
            className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isHindi ? 'पूर्ण सेटिंग्स पृष्ठ खोलें' : 'Open Comprehensive Settings Page'}
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 1. DEVICE CONNECTIVITY, THEME & LANGUAGE CONTROLS (Req 1)             */}
      {/* --------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* CONNECT DEVICES CARD */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Bluetooth className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {isHindi ? 'कनेक्टेड डिवाइसेस' : 'Connect Devices'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isHindi ? 'ब्लूटूथ एवं पेरिफेरल्स' : 'Bluetooth & Health Peripherals'}
                </p>
              </div>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Active Receiver" />
          </div>

          <div className="space-y-3 pt-1">
            {/* Urine Analyzer switch */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {isHindi ? 'यूरिन बायोमार्कर स्ट्रिप' : 'Urine Strip Analyzer'}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {urineDeviceEnabled
                    ? (isHindi ? 'टेलीमेट्री सक्रिय' : 'Active Telemetry')
                    : (isHindi ? 'निष्क्रिय' : 'Disabled')}
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleUrineDevice}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                  urineDeviceEnabled ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                title="Toggle Urine Device Telemetry"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    urineDeviceEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Smart BP Cuff */}
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {isHindi ? 'स्मार्ट ब्लड प्रेशर कफ' : 'Smart BP Cuff'}
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {isHindi ? 'सिंक किया गया' : 'Paired'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleScanDevices}
              disabled={scanningDevices}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Bluetooth className={`w-3.5 h-3.5 ${scanningDevices ? 'animate-spin' : ''}`} />
              <span>
                {scanningDevices
                  ? (isHindi ? 'डिवाइस स्कैन हो रहे हैं...' : 'Scanning for Devices...')
                  : (isHindi ? 'नए डिवाइस से कनेक्ट करें' : 'Scan & Pair Devices')}
              </span>
            </button>
          </div>
        </div>

        {/* DARK AND LIGHT THEME SETTING */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {isHindi ? 'थीम एवं दिखावट' : 'Theme & Appearance'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isDark ? (isHindi ? 'डार्क मोड सक्रिय' : 'Dark Mode Active') : (isHindi ? 'लाइट मोड सक्रिय' : 'Light Mode Active')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                if (isDark) toggleTheme();
                showToast(isHindi ? 'लाइट मोड चालू किया गया' : 'Switched to Light Theme');
              }}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                !isDark
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <span className="text-xs">{isHindi ? 'लाइट थीम (Light)' : 'Light Theme'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!isDark) toggleTheme();
                showToast(isHindi ? 'डार्क मोड चालू किया गया' : 'Switched to Dark Theme');
              }}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                isDark
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <Moon className="w-5 h-5 text-indigo-400" />
              <span className="text-xs">{isHindi ? 'डार्क थीम (Dark)' : 'Dark Theme'}</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            {isHindi ? 'थीम पूरे डैशबोर्ड और चार्ट्स में लागू होती है।' : 'Theme applies system-wide across charts & dashboards.'}
          </p>
        </div>

        {/* ENGLISH OR HINDI LANGUAGE SETTING */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {isHindi ? 'भाषा चयन (Language)' : 'Language / भाषा'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHindi ? 'वर्तमान: हिंदी (Hindi)' : 'Current: English'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setLanguage('en');
                showToast('Switched to English');
              }}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                language === 'en'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <span className="text-lg">🇬🇧</span>
              <span className="text-xs font-bold">English</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLanguage('hi');
                showToast('भाषा हिंदी में बदली गई');
              }}
              className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-2 ${
                language === 'hi'
                  ? 'border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
              }`}
            >
              <span className="text-lg">🇮🇳</span>
              <span className="text-xs font-bold">हिंदी (Hindi)</span>
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
            {isHindi ? 'पूरी वेबसाइट और मेडिकल रिकॉर्ड्स तुरंत अनुवादित होते हैं।' : 'Translates entire website and health library instantly.'}
          </p>
        </div>
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* 2. MAIN BODY: EITHER ACCOUNT SETTINGS OR PROFILE OVERVIEW             */}
      {/* --------------------------------------------------------------------- */}
      {activeView === 'accountSettings' ? (
        /* ACCOUNT SETTINGS FORM VIEW */
        <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {isHindi ? 'व्यक्तिगत खाता विवरण एवं सेटिंग्स' : 'Personal Account Details & Baseline Information'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isHindi
                    ? 'यह जानकारी आपकी स्वास्थ्य रिपोर्ट, चार्ट्स और डिजिटल आपातकालीन कार्ड में उपयोग होती है।'
                    : 'Used for clinical graphs, baseline thresholds, and digital emergency identification.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-md active:scale-95 transition-all cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? (isHindi ? 'सहेज रहे हैं...' : 'Saving...') : (isHindi ? 'सेव करें' : 'Save Changes')}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {isHindi ? 'पूरा नाम' : 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Age Group */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {isHindi ? 'आयु वर्ग' : 'Age Group'}
              </label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="18–29">18 – 29 years</option>
                <option value="30–44">30 – 44 years</option>
                <option value="45–59">45 – 59 years</option>
                <option value="60–74">60 – 74 years</option>
                <option value="75+">75+ years</option>
              </select>
            </div>

            {/* Gender */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {isHindi ? 'लिंग' : 'Gender'}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            {/* Blood Group */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {isHindi ? 'ब्लड ग्रुप' : 'Blood Group'}
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:border-cyan-500"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {isHindi ? 'आपातकालीन संपर्क' : 'Emergency Contact'}
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="+1 (555) 234-5678 (Spouse)"
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Height (cm) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {isHindi ? 'ऊंचाई (सेमी)' : 'Height (cm)'}
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="178"
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Weight (kg) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {isHindi ? 'वजन (किग्रा)' : 'Weight (kg)'}
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="72"
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Allergies */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {isHindi ? 'ज्ञात एलर्जी' : 'Known Allergies'}
              </label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="Penicillin, Peanuts, etc."
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Monitored Conditions */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                {isHindi ? 'निगरानी की जा रही स्थितियां' : 'Monitored Conditions'}
              </label>
              <input
                type="text"
                value={conditions}
                onChange={(e) => setConditions(e.target.value)}
                placeholder="Mild Hypertension, Type 2 Diabetes, etc."
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </form>
      ) : (
        /* PROFILE OVERVIEW & EMERGENCY QR VIEW */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* QR Card */}
          <div className="md:col-span-5 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] space-y-6 text-center flex flex-col items-center shadow-sm">
            <div className="space-y-1">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isHindi ? 'डिजिटल मेडिकल क्यूआर' : 'Emergency Medical QR'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isHindi ? 'पैरामेडिक्स और क्लिनिक के लिए सुरक्षित त्वरित स्कैन' : 'Instant scan for paramedics and emergency clinicians'}
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-white shadow-md border-4 border-slate-200/80">
              <QRCodeSVG value={secureShareUrl} size={200} level="H" includeMargin={false} />
            </div>

            <div className="w-full p-4 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 border border-slate-200 dark:border-slate-800 text-xs text-left space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{isHindi ? 'रोगी का नाम:' : 'Patient Name:'}</span>
                <span className="text-slate-900 dark:text-white font-bold">{name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{isHindi ? 'रक्त समूह:' : 'Blood Group:'}</span>
                <span className="font-extrabold text-rose-600 dark:text-rose-400">{bloodGroup}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">{isHindi ? 'आपातकालीन संपर्क:' : 'Emergency:'}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]" title={emergencyContact}>
                  {emergencyContact}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full py-3 px-4 rounded-2xl text-xs font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 transition-all shadow-xs cursor-pointer active:scale-95 flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? (isHindi ? 'कॉपी हो गया!' : 'Copied!') : (isHindi ? 'आपातकालीन लिंक कॉपी करें' : 'Copy Emergency Link')}</span>
            </button>
          </div>

          {/* Profile Overview Details */}
          <div className="md:col-span-7 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#101827] space-y-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {isHindi ? 'रोगी पहचान एवं स्वास्थ्य सारांश' : 'Patient Passport & Health Identity'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isHindi ? 'बायोट्रैजेक्टरी सत्यापित स्वास्थ्य प्रोफाइल' : 'BioTrajectory Verified Health Profile'}
                  </p>
                </div>
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">{isHindi ? 'ईमेल पता' : 'Account Email'}</span>
                  <span className="font-bold text-slate-900 dark:text-white truncate block mt-0.5">
                    {currentUser?.email || 'patient@biotrajectory.health'}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">{isHindi ? 'आयु वर्ग' : 'Age Bracket'}</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{ageRange}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">{isHindi ? 'लिंग' : 'Gender'}</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-0.5">{gender}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">{isHindi ? 'ज्ञात एलर्जी' : 'Allergies'}</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-0.5 truncate" title={allergies}>
                    {allergies}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200/80 dark:border-slate-800 col-span-2">
                  <span className="text-xs text-slate-500 block">{isHindi ? 'निगरानी की जा रही स्थितियां' : 'Monitored Conditions'}</span>
                  <span className="font-bold text-slate-900 dark:text-white block mt-0.5 truncate" title={conditions}>
                    {conditions}
                  </span>
                </div>
              </div>

              {/* Share Window */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {isHindi ? 'क्यूआर टोकन वैधता अवधि:' : 'QR Token Validity Window:'}
                  </span>
                  <Clock className="w-4 h-4 text-cyan-500" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: '1h', label: isHindi ? '1 घंटा' : '1 Hour' },
                    { id: '24h', label: isHindi ? '24 घंटे' : '24 Hours' },
                    { id: '7d', label: isHindi ? '7 दिन' : '7 Days' },
                    { id: 'once', label: isHindi ? '1 बार' : 'One Time' }
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => {
                        setExpiration(opt.id);
                        showToast(isHindi ? `टोकन विंडो ${opt.label} पर सेट की गई` : `Token window set to ${opt.label}`);
                      }}
                      className={`py-2 px-2 rounded-xl text-xs font-bold text-center cursor-pointer transition-all ${
                        expiration === opt.id
                          ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow-xs'
                          : 'bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
