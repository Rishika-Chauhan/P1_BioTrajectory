/**
 * BioTrajectory Danger Disease & Priority Person Service
 *
 * Automatically detects whether a patient is managing an active "danger disease"
 * (such as Cancer, severe cardiovascular, stroke, or critical organ failure)
 * and assigns them a prominent RED SIGN / CRITICAL PRIORITY PERSON designation.
 *
 * Priority persons are treated with expedited routing:
 * - Red Priority Sign in top dashboard navigation
 * - Urgent Clinical Priority Banner on Patient Dashboard
 * - Pinned to the top of Doctor practice directories with red highlight & badge
 * - Emergency Triage status on QR Health Passports & Doctor Appointment Queues
 */

export const DANGER_KEYWORDS = [
  'cancer',
  'carcinoma',
  'malignan',
  'tumor',
  'leukemia',
  'lymphoma',
  'stroke',
  'infarction',
  'heart failure',
  'aneurysm',
  'sepsis',
  'acute renal',
  'critical',
  'danger'
];

export const DEFAULT_DISEASE_HISTORY = [
  {
    id: 'dis-cancer-01',
    name: 'Colorectal Cancer',
    stage: 'Stage II',
    status: 'ongoing', // Facing
    timeline: 'Ongoing',
    isDanger: true, // Danger Disease
    dangerLevel: 'critical',
    category: 'Oncology',
    notes: 'Active oncology care with regular clinical surveillance, CEA biomarker trajectory monitoring, and targeted therapy.',
    diagnosedAt: 'Ongoing',
    editableBy: 'both', // 'both' | 'doctor' | 'patient'
    lastUpdatedBy: 'Doctor (Dr. Sarah Patel - Oncologist)',
    updatedAt: 'Nov 18, 2026'
  },
  {
    id: 'dis-bp-02',
    name: 'Essential Hypertension',
    stage: 'Stage 1',
    status: 'ongoing', // Facing
    timeline: 'Ongoing',
    isDanger: false,
    dangerLevel: 'moderate',
    category: 'Cardiovascular',
    notes: 'Longitudinal blood pressure tracking via daily digital cuff readings, low-sodium dietary plan, and routine physician reviews.',
    diagnosedAt: 'Ongoing',
    editableBy: 'both',
    lastUpdatedBy: 'Patient (Alex Johnson)',
    updatedAt: 'Nov 15, 2026'
  },
  {
    id: 'dis-jaundice-03',
    name: 'Jaundice (Hepatitis A)',
    stage: 'Resolved',
    status: 'resolved', // Faced
    timeline: '4 months ago',
    isDanger: false,
    dangerLevel: 'resolved',
    category: 'Hepatic',
    notes: 'Acute hepatic episode fully resolved; serum bilirubin and liver transaminases normalized on confirmatory follow-up lab panel.',
    diagnosedAt: '4 months ago',
    editableBy: 'both',
    lastUpdatedBy: 'Doctor (Dr. Sarah Patel)',
    updatedAt: 'Jul 12, 2026'
  },
  {
    id: 'dis-bronchitis-04',
    name: 'Acute Bronchitis',
    stage: 'Resolved',
    status: 'resolved', // Faced
    timeline: '1 year ago',
    isDanger: false,
    dangerLevel: 'resolved',
    category: 'Respiratory',
    notes: 'Treated with short course supportive therapy; complete pulmonary recovery achieved with no lasting respiratory symptoms.',
    diagnosedAt: '1 year ago',
    editableBy: 'both',
    lastUpdatedBy: 'Patient (Alex Johnson)',
    updatedAt: 'Nov 2025'
  }
];

export function normalizeDisease(item) {
  if (!item) return item;
  let name = item.name || '';
  if (name.includes('Ongoing Cancer (Colorectal Stage II') || name.includes('Cancer (Colorectal Stage II)')) {
    name = 'Colorectal Cancer';
  } else if (name.includes('Jaundice (Viral Hepatitis A)')) {
    name = 'Jaundice (Hepatitis A)';
  }
  let stage = item.stage;
  if (!stage) {
    if (name.toLowerCase().includes('cancer') || (item.name && item.name.includes('Stage II'))) {
      stage = 'Stage II';
    } else if (item.status === 'resolved') {
      stage = 'Resolved';
    }
  }
  let timeline = item.timeline || '';
  if (timeline.includes('Ongoing (Diagnosed')) {
    timeline = 'Ongoing';
  } else if (timeline.includes('4 months ago (Resolved)')) {
    timeline = '4 months ago';
  } else if (timeline.includes('1 year ago (Resolved)')) {
    timeline = '1 year ago';
  }
  const editableBy = item.editableBy || 'both'; // Can be changed by Doctor, Patient, or Both
  const lastUpdatedBy = item.lastUpdatedBy || (item.isDanger ? 'Doctor (Dr. Sarah Patel)' : 'Patient');
  const updatedAt = item.updatedAt || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return {
    ...item,
    name,
    stage,
    timeline,
    editableBy,
    lastUpdatedBy,
    updatedAt
  };
}

export function saveStoredDiseaseHistory(list) {
  try {
    localStorage.setItem('bt_user_disease_history', JSON.stringify(list));
  } catch {}
  notifyPriorityChanged();
}

export function getStoredDiseaseHistory() {
  try {
    const raw = localStorage.getItem('bt_user_disease_history');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeDisease);
      }
    }
  } catch {}
  return DEFAULT_DISEASE_HISTORY;
}

export function isConditionDanger(condition) {
  if (!condition) return false;
  if (condition.isDanger === true) return true;
  if (
    condition.dangerLevel === 'critical' ||
    condition.dangerLevel === 'danger' ||
    condition.dangerLevel === 'high'
  ) {
    return true;
  }
  const name = (condition.name || condition.title || condition.condition || '').toLowerCase();
  return DANGER_KEYWORDS.some((kw) => name.includes(kw));
}

export function getPatientPriorityStatus(customDiseasesOrPatient) {
  let list = [];

  if (Array.isArray(customDiseasesOrPatient)) {
    list = customDiseasesOrPatient;
  } else if (customDiseasesOrPatient && typeof customDiseasesOrPatient === 'object') {
    if (customDiseasesOrPatient.isPriority === true || customDiseasesOrPatient.isDanger === true) {
      const pName =
        customDiseasesOrPatient.dangerDisease ||
        customDiseasesOrPatient.condition ||
        'Critical High-Risk Condition';
      return {
        isPriority: true,
        dangerCount: 1,
        dangerDiseases: [{ name: pName, isDanger: true, status: 'ongoing' }],
        primaryDisease: pName,
        badgeLabel: '🚨 CRITICAL PRIORITY PERSON',
        badgeLabelShort: '🚨 PRIORITY PERSON',
        priorityLevel: 'EMERGENCY_TRIAGE',
        description: `Designated High-Priority Patient due to active ${pName}. Expedited triage, prioritized consultations, and accelerated clinical telemetry.`,
        descriptionHi: `सक्रिय ${pName} के कारण उच्च प्राथमिकता वाले रोगी के रूप में नामित। त्वरित परामर्श और आपातकालीन क्लिनिकल देखभाल।`,
        signColor: 'red'
      };
    }
    if (Array.isArray(customDiseasesOrPatient.medicalHistory)) {
      list = customDiseasesOrPatient.medicalHistory;
    } else if (Array.isArray(customDiseasesOrPatient.diseaseHistory)) {
      list = customDiseasesOrPatient.diseaseHistory;
    } else {
      list = getStoredDiseaseHistory();
    }
  } else {
    list = getStoredDiseaseHistory();
  }

  // Filter for ongoing danger conditions
  const ongoingDanger = list.filter((item) => {
    const isOngoing =
      item.status === 'ongoing' || item.status === 'facing' || item.status === 'active';
    return isOngoing && isConditionDanger(item);
  });

  if (ongoingDanger.length > 0) {
    const primary = ongoingDanger[0];
    return {
      isPriority: true,
      dangerCount: ongoingDanger.length,
      dangerDiseases: ongoingDanger,
      primaryDisease: primary.name || 'Ongoing Critical Condition',
      badgeLabel: '🚨 CRITICAL PRIORITY PERSON',
      badgeLabelShort: '🚨 PRIORITY PERSON',
      priorityLevel: 'EMERGENCY_TRIAGE',
      description: `Designated High-Priority Patient due to active danger disease (${primary.name}). Expedited triage, prioritized consultations, and accelerated clinical telemetry.`,
      descriptionHi: `सक्रिय गंभीर बीमारी (${primary.name}) के कारण उच्च प्राथमिकता वाले रोगी के रूप में नामित। त्वरित परामर्श और आपातकालीन क्लिनिकल देखभाल।`,
      signColor: 'red'
    };
  }

  return {
    isPriority: false,
    dangerCount: 0,
    dangerDiseases: [],
    primaryDisease: null,
    badgeLabel: null,
    badgeLabelShort: null,
    priorityLevel: 'STANDARD',
    description: null,
    descriptionHi: null,
    signColor: null
  };
}

export const PRIORITY_EVENT_NAME = 'bt_disease_history_changed';

export function notifyPriorityChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PRIORITY_EVENT_NAME));
  }
}

export function subscribeToPriorityChanges(callback) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => {
    callback(getPatientPriorityStatus());
  };
  window.addEventListener(PRIORITY_EVENT_NAME, handler);
  window.addEventListener('storage', handler);
  return () => {
    window.removeEventListener(PRIORITY_EVENT_NAME, handler);
    window.removeEventListener('storage', handler);
  };
}
