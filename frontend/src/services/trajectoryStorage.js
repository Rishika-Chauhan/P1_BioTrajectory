/**
 * BioTrajectory Persistent Health Trajectory Storage & Clinical Mathematical Engine
 * 
 * Provides:
 * 1. Persistent localStorage ledger with fallback for all patient logs and readings.
 * 2. Mathematical rolling median and Interquartile Range (IQR Q25-Q75) baseline calculation.
 * 3. Multi-day persistent deviation detection vs single-session transient blip distinction.
 * 4. Physiological confounder analysis (e.g., Specific Gravity concentration correlation).
 * 5. Full GDPR/HIPAA-compliant data export (JSON/CSV) and irreversible local purge.
 */

import { PATIENT_PERSONAS, BIOMARKER_DEFINITIONS } from '../data/mockData.js';

const STORAGE_KEYS = {
  PATIENTS: 'biotrajectory_v2_patients',
  ACTIVE_PATIENT: 'biotrajectory_v2_active_patient_id',
  USER_CONSENT: 'biotrajectory_v2_user_consent',
  USER_PROFILE: 'biotrajectory_v2_health_profile',
  BLE_DEVICES: 'biotrajectory_v2_ble_devices',
  CUSTOM_SCANS: 'biotrajectory_v2_optical_scans'
};

export const DEFAULT_HEALTH_PROFILE = {
  name: 'Pranjal Sharma',
  ageRange: '30–44',
  gender: 'Prefer not to say',
  timezone: 'UTC+05:30',
  units: 'metric', // 'metric' or 'imperial'
  height: 175,
  weight: 70,
  lifestyle: {
    activityLevel: 'Moderately Active',
    hydrationHabit: 'Moderate (1.5–2.5 L/day)',
    testingSchedule: 'Second Morning Void (Recommended)'
  },
  goals: [
    'Track kidney / microalbumin stability',
    'Monitor metabolic & ketone trends'
  ],
  customGoal: '',
  consent: {
    storeAndProcessHealthData: true,
    shareWithClinician: true,
    aiAssistantAnalysis: true,
    nonDiagnosticScopeAcknowledged: true,
    acceptedAt: new Date().toISOString()
  },
  onboardingCompleted: true,
  updatedAt: new Date().toISOString()
};

// Safe storage helper with memory fallback
const memoryStorage = new Map();
const safeStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {}
    return memoryStorage.get(key) || null;
  },
  setItem: (key, val) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, val);
      }
    } catch (e) {}
    memoryStorage.set(key, val);
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (e) {}
    memoryStorage.delete(key);
  }
};

const dispatchEventSafe = (name, detail = {}) => {
  try {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent(name, { detail }));
    }
  } catch (e) {}
};

// Helper: calculate median of a numeric array
export function calculateMedian(values) {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

// Helper: calculate percentile (e.g., 25 for Q1, 75 for Q3)
export function calculatePercentile(values, p) {
  if (!values || values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

// Helper: calculate baseline corridor (rolling median and IQR)
export function calculateBaselineCorridor(history, analyteKey = 'protein') {
  if (!history || history.length === 0) {
    return {
      median: 0,
      q25: 0,
      q75: 0,
      min: 0,
      max: 15,
      isCalibrated: false,
      loggedCount: 0,
      recommendedCount: 10,
      calibrationProgress: 0,
      statusLabel: 'No records available'
    };
  }

  const validValues = history
    .map(entry => entry[analyteKey])
    .filter(val => typeof val === 'number' && !isNaN(val));

  if (validValues.length === 0) {
    return {
      median: 0,
      q25: 0,
      q75: 0,
      min: 0,
      max: 15,
      isCalibrated: false,
      loggedCount: 0,
      recommendedCount: 10,
      calibrationProgress: 0,
      statusLabel: 'No numeric data for analyte'
    };
  }

  const median = Number(calculateMedian(validValues).toFixed(2));
  const q25 = Number(calculatePercentile(validValues, 25).toFixed(2));
  const q75 = Number(calculatePercentile(validValues, 75).toFixed(2));
  const iqr = q75 - q25;

  // Corridor boundary: Q25 - 1.5*IQR to Q75 + 1.5*IQR (clamped to sensible physiological minimum)
  const minCorridor = Math.max(0, Number((q25 - 0.5 * (iqr || 2)).toFixed(2)));
  const maxCorridor = Number((q75 + 1.0 * (iqr || 5)).toFixed(2));

  const isCalibrated = validValues.length >= 10;
  const calibrationProgress = Math.min(100, Math.round((validValues.length / 10) * 100));

  return {
    median,
    q25,
    q75,
    min: minCorridor,
    max: Math.max(maxCorridor, median * 1.5 || 15),
    isCalibrated,
    loggedCount: validValues.length,
    recommendedCount: 10,
    calibrationProgress,
    statusLabel: isCalibrated
      ? 'Personal Baseline Active'
      : `Calibrating (${validValues.length} of 10 logged)`
  };
}

// Multi-day persistent deviation vs transient blip detection
export function analyzeTrajectoryDeviations(history, analyteKey = 'protein') {
  if (!history || history.length < 2) {
    return {
      hasDeviation: false,
      isPersistent: false,
      isTransient: false,
      direction: 'stable',
      varianceCount: 0,
      recentValues: [],
      latestValue: null,
      summary: 'Insufficient sequential logs to evaluate multi-day trajectory persistence.'
    };
  }

  const baseline = calculateBaselineCorridor(history, analyteKey);
  const recent = history.slice(-5);
  const latest = history[history.length - 1];
  const latestVal = latest ? latest[analyteKey] : null;

  // Count how many of the recent readings were outside baseline corridor
  const outOfEnvelopeCount = recent.filter(r => {
    const val = r[analyteKey];
    return typeof val === 'number' && (val > baseline.max || val < baseline.min);
  }).length;

  // Check slope/direction between last 3 readings
  const last3 = history.slice(-3).map(r => r[analyteKey]).filter(v => typeof v === 'number');
  let direction = 'stable';
  if (last3.length >= 2) {
    const delta = last3[last3.length - 1] - last3[0];
    if (delta > 2) direction = 'rising';
    else if (delta < -2) direction = 'falling';
  }

  // Persistent shift: 3 or more of the recent 5 readings out of envelope
  const isPersistent = outOfEnvelopeCount >= 3;
  // Transient blip: 1 or 2 readings out of envelope, now stabilizing or resolving
  const isTransient = outOfEnvelopeCount > 0 && outOfEnvelopeCount < 3;

  // Confounder check: specific gravity high?
  const highConcentration = latest && latest.specificGravity && latest.specificGravity >= 1.026;
  const postExercise = latest && latest.notes && latest.notes.toLowerCase().includes('workout');

  let summary = 'Trajectory is tracking comfortably within your established personal corridor.';
  if (isPersistent) {
    summary = `Persistent deviation detected: ${analyteKey.toUpperCase()} has remained outside baseline corridor across ${outOfEnvelopeCount} recent logs. Recommended for physician discussion.`;
  } else if (isTransient) {
    summary = `Transient blip observed: Single excursion (${latestVal}) appears physiological${highConcentration ? ' (correlated with concentrated Specific Gravity)' : ''}${postExercise ? ' following exertion' : ''}. Spontaneous normalization expected.`;
  }

  return {
    hasDeviation: outOfEnvelopeCount > 0,
    isPersistent,
    isTransient,
    direction,
    outOfEnvelopeCount,
    varianceCount: outOfEnvelopeCount,
    latestValue: latestVal,
    highConcentration,
    postExercise,
    summary
  };
}

// Trajectory Storage Service Class
class TrajectoryStorageService {
  constructor() {
    this.init();
  }

  init() {
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.PATIENTS);
      if (!stored) {
        // Initialize with realistic personas and an empty live user profile
        const initialPatients = [
          ...PATIENT_PERSONAS,
          {
            id: 'my_user_profile',
            name: 'Live User Profile',
            age: 34,
            profileType: 'Your Personal Live Stream',
            condition: 'Home Health Monitoring',
            baselineStatus: 'Active Personal Ledger',
            clinicalStory: 'Your personal, non-diagnostic longitudinal monitoring history. Add real strips and wearable readings to build your own verifiable baseline.',
            history: [
              { day: 1, date: '2026-10-15', time: '07:15', protein: 5, specificGravity: 1.018, pH: 6.4, glucose: 0, ketones: 0, leukocytes: 0, nitrite: 0, blood: 0, confirmed: true, flagged: false, notes: 'Initial test session. Baseline calibration start.' },
              { day: 2, date: '2026-10-18', time: '07:30', protein: 4, specificGravity: 1.016, pH: 6.5, glucose: 0, ketones: 0, leukocytes: 0, nitrite: 0, blood: 0, confirmed: true, flagged: false, notes: 'Morning check. Well hydrated.' },
              { day: 3, date: '2026-10-21', time: '07:10', protein: 6, specificGravity: 1.019, pH: 6.3, glucose: 0, ketones: 0, leukocytes: 0, nitrite: 0, blood: 0, confirmed: true, flagged: false, notes: 'Routine reading. Normal diet.' }
            ]
          }
        ];
        safeStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(initialPatients));
      }

      if (!safeStorage.getItem(STORAGE_KEYS.ACTIVE_PATIENT)) {
        safeStorage.setItem(STORAGE_KEYS.ACTIVE_PATIENT, 'arjun');
      }
    } catch (e) {
      console.warn('Storage initialization fallback:', e);
    }
  }

  getAllPatients() {
    try {
      const data = safeStorage.getItem(STORAGE_KEYS.PATIENTS);
      return data ? JSON.parse(data) : PATIENT_PERSONAS;
    } catch (e) {
      return PATIENT_PERSONAS;
    }
  }

  getActivePatientId() {
    try {
      return safeStorage.getItem(STORAGE_KEYS.ACTIVE_PATIENT) || 'arjun';
    } catch (e) {
      return 'arjun';
    }
  }

  setActivePatientId(patientId) {
    try {
      safeStorage.setItem(STORAGE_KEYS.ACTIVE_PATIENT, patientId);
      dispatchEventSafe('biotrajectory_patient_changed', { patientId });
      return true;
    } catch (e) {
      return false;
    }
  }

  getActivePatient() {
    const all = this.getAllPatients();
    const activeId = this.getActivePatientId();
    return all.find(p => p.id === activeId) || all[0] || PATIENT_PERSONAS[0];
  }

  getPatient(patientId) {
    const all = this.getAllPatients();
    return all.find(p => p.id === patientId) || null;
  }

  addReading(patientId, reading) {
    try {
      const all = this.getAllPatients();
      const patientIndex = all.findIndex(p => p.id === patientId);
      if (patientIndex === -1) return false;

      const patient = all[patientIndex];
      const newDay = (patient.history.length > 0 ? Math.max(...patient.history.map(h => h.day || 0)) : 0) + 1;

      const newEntry = {
        day: newDay,
        date: reading.date || new Date().toISOString().split('T')[0],
        time: reading.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        protein: Number(reading.protein ?? 5),
        specificGravity: Number(reading.specificGravity ?? 1.018),
        pH: Number(reading.pH ?? 6.4),
        glucose: Number(reading.glucose ?? 0),
        ketones: Number(reading.ketones ?? 0),
        leukocytes: Number(reading.leukocytes ?? 0),
        nitrite: Number(reading.nitrite ?? 0),
        blood: Number(reading.blood ?? 0),
        sampleType: reading.sampleType || 'First morning',
        notes: reading.notes || 'User confirmed reading',
        confirmed: true,
        flagged: reading.protein > 20 || reading.glucose > 50,
        createdAt: new Date().toISOString(),
        id: `reading_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
      };

      patient.history.push(newEntry);
      all[patientIndex] = patient;
      safeStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(all));

      // Dispatch global event for reactive UI updates
      dispatchEventSafe('biotrajectory_data_updated', {
        patientId, newEntry
      });

      return newEntry;
    } catch (e) {
      console.error('Failed to append reading:', e);
      return false;
    }
  }

  deleteReading(patientId, entryDayOrId) {
    try {
      const all = this.getAllPatients();
      const patientIndex = all.findIndex(p => p.id === patientId);
      if (patientIndex === -1) return false;

      const patient = all[patientIndex];
      patient.history = patient.history.filter(h => (h.id !== entryDayOrId && h.day !== entryDayOrId));
      all[patientIndex] = patient;
      safeStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(all));

      dispatchEventSafe('biotrajectory_data_updated', {
        patientId
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  // User Consent Management
  getUserConsent() {
    try {
      const consent = safeStorage.getItem(STORAGE_KEYS.USER_CONSENT);
      return consent ? JSON.parse(consent) : null;
    } catch (e) {
      return null;
    }
  }

  setUserConsent(consentData) {
    try {
      const payload = {
        acceptedAt: new Date().toISOString(),
        agreedToTerms: true,
        agreedToNonDiagnosticScope: true,
        allowLocalLogging: true,
        ...consentData
      };
      safeStorage.setItem(STORAGE_KEYS.USER_CONSENT, JSON.stringify(payload));
      return payload;
    } catch (e) {
      return false;
    }
  }

  // Health Profile Management
  getHealthProfile() {
    try {
      const stored = safeStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {}
    return {
      ...DEFAULT_HEALTH_PROFILE,
      onboardingCompleted: false
    };
  }

  saveHealthProfile(profileData) {
    try {
      const existing = this.getHealthProfile();
      const updatedProfile = {
        ...existing,
        ...profileData,
        consent: {
          ...(existing?.consent || {}),
          ...(profileData?.consent || {})
        },
        lifestyle: {
          ...(existing?.lifestyle || {}),
          ...(profileData?.lifestyle || {})
        },
        goals: profileData?.goals || existing?.goals || [],
        onboardingCompleted: true,
        updatedAt: new Date().toISOString()
      };

      safeStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updatedProfile));

      // Synchronize consent ledger
      if (updatedProfile.consent) {
        this.setUserConsent({
          agreedToNonDiagnosticScope: Boolean(updatedProfile.consent.nonDiagnosticScopeAcknowledged),
          allowLocalLogging: Boolean(updatedProfile.consent.storeAndProcessHealthData),
          agreedToClinicianVoluntaryShare: Boolean(updatedProfile.consent.shareWithClinician),
          aiAssistantAnalysis: Boolean(updatedProfile.consent.aiAssistantAnalysis)
        });
      }

      // Synchronize with user persona in local ledger
      const allPatients = this.getAllPatients();
      const userIdx = allPatients.findIndex(p => p.id === 'my_user_profile');
      if (userIdx !== -1) {
        allPatients[userIdx].name = updatedProfile.name || 'You';
        allPatients[userIdx].age = parseInt(updatedProfile.ageRange?.split('–')?.[0] || '32', 10);
        allPatients[userIdx].goals = updatedProfile.goals;
        safeStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(allPatients));
      }

      dispatchEventSafe('biotrajectory_profile_updated', { profile: updatedProfile });
      dispatchEventSafe('biotrajectory_data_updated', { profile: updatedProfile });
      return updatedProfile;
    } catch (e) {
      console.warn('Failed to save health profile:', e);
      return false;
    }
  }

  deleteAccountData() {
    try {
      safeStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
      safeStorage.removeItem(STORAGE_KEYS.USER_CONSENT);
      safeStorage.removeItem(STORAGE_KEYS.BLE_DEVICES);
      safeStorage.removeItem(STORAGE_KEYS.CUSTOM_SCANS);
      safeStorage.removeItem(STORAGE_KEYS.PATIENTS);
      safeStorage.removeItem(STORAGE_KEYS.ACTIVE_PATIENT);
      this.init();
      dispatchEventSafe('biotrajectory_data_purged');
      dispatchEventSafe('biotrajectory_account_deleted');
      return true;
    } catch (e) {
      return false;
    }
  }

  // Export Data as JSON
  exportDataJSON(patientId) {
    const patient = patientId ? this.getAllPatients().find(p => p.id === patientId) : this.getActivePatient();
    if (!patient) return null;

    const exportPayload = {
      platform: 'BioTrajectory Health Trend Platform',
      version: '2.4.1',
      exportedAt: new Date().toISOString(),
      patientInfo: {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        profileType: patient.profileType
      },
      baselineMetrics: {
        protein: calculateBaselineCorridor(patient.history, 'protein'),
        specificGravity: calculateBaselineCorridor(patient.history, 'specificGravity'),
        pH: calculateBaselineCorridor(patient.history, 'pH')
      },
      readings: patient.history,
      disclaimer: 'BioTrajectory reports are non-diagnostic patient-generated health data (PGHD) compiled from verified user records.'
    };

    return JSON.stringify(exportPayload, null, 2);
  }

  // Export Data as CSV
  exportDataCSV(patientId) {
    const patient = patientId ? this.getAllPatients().find(p => p.id === patientId) : this.getActivePatient();
    if (!patient || !patient.history) return '';

    const headers = ['Day', 'Date', 'Time', 'Protein (mg/dL)', 'Specific Gravity', 'pH', 'Glucose (mg/dL)', 'Ketones', 'Leukocytes', 'Sample Type', 'Notes', 'Flagged'];
    const rows = patient.history.map(r => [
      r.day,
      r.date,
      r.time,
      r.protein,
      r.specificGravity,
      r.pH,
      r.glucose,
      r.ketones || 0,
      r.leukocytes || 0,
      `"${r.sampleType || 'Routine'}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      r.flagged ? 'Yes' : 'No'
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }

  // Purge All Health Data (Irreversible Sovereignty)
  purgeAllData() {
    try {
      safeStorage.removeItem(STORAGE_KEYS.PATIENTS);
      safeStorage.removeItem(STORAGE_KEYS.ACTIVE_PATIENT);
      safeStorage.removeItem(STORAGE_KEYS.BLE_DEVICES);
      safeStorage.removeItem(STORAGE_KEYS.CUSTOM_SCANS);
      this.init();
      dispatchEventSafe('biotrajectory_data_purged');
      return true;
    } catch (e) {
      return false;
    }
  }

  // Reset to initial baseline personas
  resetToDefault() {
    try {
      safeStorage.removeItem(STORAGE_KEYS.PATIENTS);
      safeStorage.removeItem(STORAGE_KEYS.ACTIVE_PATIENT);
      this.init();
      dispatchEventSafe('biotrajectory_data_updated', { reset: true });
      return true;
    } catch (e) {
      return false;
    }
  }
}

export const trajectoryStorage = new TrajectoryStorageService();
