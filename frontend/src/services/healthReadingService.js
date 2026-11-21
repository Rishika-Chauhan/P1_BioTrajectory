
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

import { db } from './firebase';

const ALLOWED_SOURCES = new Set(['manual', 'imported']);

const DAILY_VITAL_TYPES = new Set([
  'blood_pressure',
  'heart_rate',
  'oxygen_saturation',
  'activity'
]);

const CLINICAL_TYPES = new Set([
  'urine_test',
  'blood_test',
  'imaging_scan',
  'prescription',
  'clinical_note',
  'document'
]);

const ALLOWED_TYPES = new Set([
  ...DAILY_VITAL_TYPES,
  ...CLINICAL_TYPES
]);

export const DEFAULT_CLINICAL_MEDICAL_RECORDS = [];

function isDemoUser(uid) {
  return (
    typeof uid === 'string' &&
    (
      uid.startsWith('demo-') ||
      uid === 'biotrajectory_demo_user'
    )
  );
}

function getReadingsCollection(uid) {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  if (!uid || typeof uid !== 'string') {
    throw new Error('A signed-in patient UID is required.');
  }

  return collection(db, 'patient_records', uid, 'readings');
}

function validateNumber(value, field, min, max, integer = false) {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < min ||
    value > max
  ) {
    throw new Error(
      `${field} must be a number between ${min} and ${max}.`
    );
  }

  if (integer && !Number.isInteger(value)) {
    throw new Error(`${field} must be a whole number.`);
  }
}

function validateOptionalNumber(values, field, min, max, integer = false) {
  if (values[field] !== undefined && values[field] !== null) {
    validateNumber(values[field], field, min, max, integer);
  }
}

function validateText(value, field, maxLength = 100) {
  if (
    typeof value !== 'string' ||
    value.trim().length === 0 ||
    value.length > maxLength
  ) {
    throw new Error(`${field} must be valid text.`);
  }
}

function cleanValues(values) {
  return Object.fromEntries(
    Object.entries(values).filter(
      ([, value]) => value !== undefined && value !== null
    )
  );
}

function validateValues(type, values) {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    throw new Error('Measurement values must be an object.');
  }

  const allowedFields = {
    blood_pressure: ['systolic', 'diastolic', 'pulse'],
    heart_rate: ['bpm'],
    oxygen_saturation: ['spo2'],
    activity: ['steps', 'distanceKm', 'exerciseMinutes'],

    urine_test: [
      'protein',
      'proteinMgDl',
      'ph',
      'glucose',
      'nitrites',
      'specificGravity'
    ],

    blood_test: [
      'title',
      'category',
      'glucose',
      'fastingGlucose',
      'hba1c',
      'totalCholesterol',
      'hdl',
      'ldl',
      'triglycerides',
      'hemoglobin',
      'hematocrit',
      'wbc',
      'rbc',
      'platelets',
      'creatinine',
      'doctorName',
      'facility'
    ],

    imaging_scan: [
      'title',
      'category',
      'scanType',
      'region',
      'modality',
      'radiationDose',
      'heartRate',
      'doctorName',
      'facility',
      'findings',
      'impression'
    ],

    prescription: [
      'title',
      'category',
      'doctorName',
      'facility',
      'medications',
      'instructions',
      'diagnosis'
    ],

    clinical_note: [
      'title',
      'category',
      'doctorName',
      'facility',
      'chiefComplaint',
      'assessment',
      'recommendations'
    ],

    document: [
      'title',
      'category',
      'doctorName',
      'facility',
      'fileType',
      'testSummary'
    ]
  };

  const permitted = allowedFields[type];

  if (!permitted) {
    throw new Error('Unsupported measurement type.');
  }

  const unknownFields = Object.keys(values).filter(
    (field) => !permitted.includes(field)
  );

  if (unknownFields.length > 0) {
    throw new Error(
      `Unsupported measurement field: ${unknownFields.join(', ')}`
    );
  }

  const suppliedFields = Object.keys(values).filter(
    (field) => values[field] !== null && values[field] !== undefined
  );

  if (suppliedFields.length === 0) {
    throw new Error('Enter at least one actual measurement.');
  }

  switch (type) {
    case 'blood_pressure':
      if (
        !Number.isFinite(values.systolic) ||
        !Number.isFinite(values.diastolic)
      ) {
        throw new Error(
          'Blood pressure requires systolic and diastolic values.'
        );
      }

      validateNumber(values.systolic, 'Systolic', 20, 300);
      validateNumber(values.diastolic, 'Diastolic', 10, 200);
      validateOptionalNumber(values, 'pulse', 20, 250);
      break;

    case 'heart_rate':
      validateNumber(values.bpm, 'Heart rate', 20, 250);
      break;

    case 'oxygen_saturation':
      validateNumber(values.spo2, 'SpO2', 0, 100);
      break;

    case 'activity':
      validateOptionalNumber(values, 'steps', 0, 200000, true);
      validateOptionalNumber(values, 'distanceKm', 0, 500);
      validateOptionalNumber(values, 'exerciseMinutes', 0, 1440);

      if (
        !['steps', 'distanceKm', 'exerciseMinutes'].some(
          (field) => values[field] !== undefined && values[field] !== null
        )
      ) {
        throw new Error('Enter at least one activity measurement.');
      }
      break;

    case 'urine_test':
      if (values.protein != null) {
        validateText(values.protein, 'Urine protein');
      }

      validateOptionalNumber(values, 'proteinMgDl', 0, 10000);
      validateOptionalNumber(values, 'ph', 0, 14);
      validateOptionalNumber(values, 'specificGravity', 1, 1.1);

      if (values.glucose != null) {
        validateText(values.glucose, 'Urine glucose');
      }

      if (values.nitrites != null) {
        validateText(values.nitrites, 'Urine nitrites');
      }
      break;

    default:
      break;
  }
}

/**
 * Normalize measurement dates to Firestore Timestamp.
 */
function normalizeMeasuredAt(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error('A valid measurement date and time is required.');
  }

  if (date.getTime() > Date.now() + 5 * 60 * 1000) {
    throw new Error('Measurement time cannot be in the future.');
  }

  return Timestamp.fromDate(date);
}

/**
 * Medical records use the same Firestore Timestamp format.
 */
function normalizeMedicalRecordDate(value) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error('A valid medical record date is required.');
  }

  if (date.getTime() > Date.now()) {
    throw new Error('Medical record date cannot be in the future.');
  }

  return Timestamp.fromDate(date);
}

function validateMedicalRecordInput(input) {
  if (!input || typeof input !== 'object') {
    throw new Error('Medical record information is required.');
  }

  if (!CLINICAL_TYPES.has(input.type)) {
    throw new Error('Select a valid medical record category.');
  }

  if (
    !input.values ||
    typeof input.values !== 'object' ||
    Array.isArray(input.values)
  ) {
    throw new Error('Medical record values must be an object.');
  }

  const values = cleanValues(input.values);

  if (
    typeof values.title !== 'string' ||
    !values.title.trim() ||
    values.title.length > 120
  ) {
    throw new Error('A valid medical record title is required.');
  }

  const permittedFields = new Set([
    'title',
    'category',
    'doctorName',
    'facility'
  ]);

  const unknownFields = Object.keys(values).filter(
    (field) => !permittedFields.has(field)
  );

  if (unknownFields.length > 0) {
    throw new Error(
      `Unsupported medical record field: ${unknownFields.join(', ')}`
    );
  }

  if (values.doctorName !== undefined) {
    validateText(values.doctorName, 'Doctor name', 120);
  }

  if (values.facility !== undefined) {
    validateText(values.facility, 'Facility name', 150);
  }

  if (values.category !== undefined) {
    validateText(values.category, 'Category', 100);
  }

  const notes = input.notes ?? '';

  if (typeof notes !== 'string' || notes.length > 1000) {
    throw new Error('Notes must be text with at most 1000 characters.');
  }

  const source = input.source || 'manual';

  if (!ALLOWED_SOURCES.has(source)) {
    throw new Error('Invalid medical record source.');
  }

  const measuredAt = normalizeMedicalRecordDate(input.measuredAt);

  let findings;

  if (input.findings !== undefined) {
    if (!Array.isArray(input.findings) || input.findings.length > 50) {
      throw new Error('Invalid medical record findings.');
    }

    findings = input.findings.map((finding) => {
      if (
        !finding ||
        typeof finding !== 'object' ||
        Array.isArray(finding)
      ) {
        throw new Error('Invalid finding entry.');
      }

      const cleanFinding = {};

      for (const field of ['name', 'value', 'range', 'status']) {
        if (finding[field] !== undefined && finding[field] !== null) {
          if (
            typeof finding[field] !== 'string' ||
            finding[field].length > 200
          ) {
            throw new Error(`Invalid finding field: ${field}`);
          }

          cleanFinding[field] = finding[field];
        }
      }

      return cleanFinding;
    });
  }

  return {
    type: input.type,
    values,
    source,
    measuredAt,
    notes: notes.trim(),
    ...(findings ? { findings } : {})
  };
}

/**
 * Demo-only simulated vital readings.
 * These are not real patient measurements.
 */
export function generateDemoVitalReadings() {
  const readings = [];
  const now = Date.now();
  const DAY_MS = 86400000;

  for (let day = 0; day < 90; day++) {
    const date = new Date(now - day * DAY_MS).toISOString();

    const trend = day / 90;
    const wave =
      Math.sin(day * 0.35) * 3.5 +
      Math.cos(day * 0.2) * 2;

    const noise = (day * 7) % 5 - 2;

    const systolic = Math.round(120 + trend * 9 + wave + noise);
    const diastolic = Math.round(78 + trend * 5 + wave * 0.6);
    const pulse = Math.round(72 + trend * 4 + wave * 0.8);

    const spo2 = Math.min(
      100,
      Math.max(96, Math.round(98.5 - trend * 0.5))
    );

    const steps = Math.round(
      8600 - trend * 2200 + Math.sin(day * 0.5) * 1100
    );

    readings.push(
      {
        id: `demo-bp-${day}`,
        type: 'blood_pressure',
        values: { systolic, diastolic, pulse },
        source: 'manual',
        measuredAt: date,
        notes: 'Simulated demo blood pressure reading'
      },
      {
        id: `demo-hr-${day}`,
        type: 'heart_rate',
        values: { bpm: pulse },
        source: 'manual',
        measuredAt: date,
        notes: 'Simulated demo heart rate'
      },
      {
        id: `demo-spo2-${day}`,
        type: 'oxygen_saturation',
        values: { spo2 },
        source: 'manual',
        measuredAt: date,
        notes: 'Simulated demo oxygen saturation'
      },
      {
        id: `demo-act-${day}`,
        type: 'activity',
        values: {
          steps,
          distanceKm: Number((steps * 0.00075).toFixed(2)),
          exerciseMinutes: Math.round(steps / 200)
        },
        source: 'manual',
        measuredAt: date,
        notes: 'Simulated demo activity'
      }
    );
  }

  return readings;
}

export const healthReadingService = {
  async add(uid, input = {}) {
    if (!uid) {
      throw new Error('A signed-in patient UID is required.');
    }

    const {
      type,
      values,
      source = 'manual',
      measuredAt,
      notes = ''
    } = input;

    if (!ALLOWED_TYPES.has(type)) {
      throw new Error('Select a valid measurement type.');
    }

    if (!ALLOWED_SOURCES.has(source)) {
      throw new Error('Only manual and imported readings are supported.');
    }

    validateValues(type, values);

    if (typeof notes !== 'string' || notes.length > 1000) {
      throw new Error('Notes must be text with at most 1000 characters.');
    }

    const record = {
      id: `reading-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      values: cleanValues(values),
      source,
      measuredAt: normalizeMeasuredAt(measuredAt),
      notes: notes.trim(),
      isCustom: true
    };

    if (isDemoUser(uid)) {
      let existing = [];

      try {
        const stored = localStorage.getItem('bt_demo_user_readings');
        const parsed = stored ? JSON.parse(stored) : [];

        if (Array.isArray(parsed)) {
          existing = parsed;
        }
      } catch {
        existing = [];
      }

      localStorage.setItem(
        'bt_demo_user_readings',
        JSON.stringify([record, ...existing])
      );

      return record;
    }

    const reference = await addDoc(
      getReadingsCollection(uid),
      {
        ...record,
        createdAt: serverTimestamp()
      }
    );

    return {
      id: reference.id,
      ...record
    };
  },

  async list(uid, limitCount = 500) {
    if (!uid) {
      throw new Error('A signed-in patient UID is required.');
    }

    if (
      !Number.isInteger(limitCount) ||
      limitCount < 1 ||
      limitCount > 1000
    ) {
      throw new Error('Limit must be between 1 and 1000.');
    }

    if (isDemoUser(uid)) {
      let custom = [];

      try {
        const stored = localStorage.getItem('bt_demo_user_readings');
        const parsed = stored ? JSON.parse(stored) : [];

        if (Array.isArray(parsed)) {
          custom = parsed;
        }
      } catch {
        custom = [];
      }

      return [
        ...custom,
        ...generateDemoVitalReadings()
      ].slice(0, limitCount);
    }

    const readingsQuery = query(
      getReadingsCollection(uid),
      orderBy('measuredAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(readingsQuery);

    return snapshot.docs.map((document) => ({
      id: document.id,
      ...document.data()
    }));
  },

  async listMedicalRecords(uid, limitCount = 100) {
    if (!uid) {
      throw new Error('A signed-in patient UID is required.');
    }

    if (
      !Number.isInteger(limitCount) ||
      limitCount < 1 ||
      limitCount > 100
    ) {
      throw new Error('Limit must be between 1 and 100.');
    }

    if (isDemoUser(uid)) {
      let storedRecords = [];

      try {
        const stored = localStorage.getItem(
          `bt_user_medical_records_${uid}`
        );

        const parsed = stored ? JSON.parse(stored) : [];

        if (Array.isArray(parsed)) {
          storedRecords = parsed;
        }
      } catch {
        storedRecords = [];
      }

      return storedRecords
        .filter((record) => CLINICAL_TYPES.has(record.type))
        .slice(0, limitCount);
    }

    const readingsQuery = query(
      getReadingsCollection(uid),
      orderBy('measuredAt', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(readingsQuery);

    return snapshot.docs
      .map((document) => ({
        id: document.id,
        ...document.data()
      }))
      .filter((record) => CLINICAL_TYPES.has(record.type));
  },

  async addMedicalRecord(uid, input = {}) {
    if (!uid) {
      throw new Error('A signed-in patient UID is required.');
    }

    const record = validateMedicalRecordInput(input);

    if (isDemoUser(uid)) {
      let existing = [];

      try {
        const stored = localStorage.getItem(
          `bt_user_medical_records_${uid}`
        );

        const parsed = stored ? JSON.parse(stored) : [];

        if (Array.isArray(parsed)) {
          existing = parsed;
        }
      } catch {
        existing = [];
      }

      const demoRecord = {
        id: `medrec-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ...record,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem(
        `bt_user_medical_records_${uid}`,
        JSON.stringify([demoRecord, ...existing])
      );

      return demoRecord;
    }

    const reference = await addDoc(
      getReadingsCollection(uid),
      {
        ...record,
        createdAt: serverTimestamp()
      }
    );

    return {
      id: reference.id,
      ...record
    };
  },

  computeThresholdAlerts(readings = [], isHindi = false) {
    const alerts = [];
    const seen = new Set();

    for (const reading of readings) {
      const values = reading.values || {};

      const measured = reading.measuredAt
        ? (
            typeof reading.measuredAt.toDate === 'function'
              ? reading.measuredAt.toDate()
              : new Date(reading.measuredAt)
          )
        : null;

      const dateStr =
        measured && !Number.isNaN(measured.getTime())
          ? measured.toLocaleDateString(
              isHindi ? 'hi-IN' : 'en-IN',
              { day: 'numeric', month: 'short' }
            )
          : (isHindi ? 'हाल ही में' : 'Recent');

      if (reading.type === 'blood_pressure' && !seen.has('bp')) {
        const systolic = Number(values.systolic);
        const diastolic = Number(values.diastolic);

        if (systolic >= 140 || diastolic >= 90) {
          seen.add('bp');

          alerts.push({
            id: `alert-bp-danger-${reading.id}`,
            metric: 'bp',
            level: 'danger',
            title: isHindi
              ? `रक्तचाप चेतावनी: ${systolic}/${diastolic} mmHg`
              : `High BP Alert: ${systolic}/${diastolic} mmHg`,
            shortText: isHindi
              ? 'रीडिंग बढ़ी हुई है। चिकित्सक से सलाह लें।'
              : 'Reading is elevated. Consult a healthcare professional.',
            date: dateStr
          });
        } else if (systolic >= 130 || diastolic >= 80) {
          seen.add('bp');

          alerts.push({
            id: `alert-bp-warn-${reading.id}`,
            metric: 'bp',
            level: 'warning',
            title: isHindi
              ? `रक्तचाप चेतावनी: ${systolic}/${diastolic} mmHg`
              : `Elevated BP: ${systolic}/${diastolic} mmHg`,
            shortText: isHindi
              ? 'रीडिंग सामान्य से ऊपर है।'
              : 'Reading is above the usual range.',
            date: dateStr
          });
        }
      }

      if (reading.type === 'urine_test' && !seen.has('urine')) {
        const protein =
          values.proteinMgDl ??
          (
            values.protein === 'Negative'
              ? 0
              : values.protein === 'Trace'
                ? 30
                : values.protein === '1+'
                  ? 100
                  : null
          );

        if (protein != null && protein >= 30) {
          seen.add('urine');

          alerts.push({
            id: `alert-urine-${reading.id}`,
            metric: 'urine',
            level: protein >= 100 ? 'danger' : 'warning',
            title: isHindi
              ? `मूत्र प्रोटीन रीडिंग: ${protein} mg/dL`
              : `Urine Protein Reading: ${protein} mg/dL`,
            shortText: isHindi
              ? 'इस परिणाम की व्याख्या चिकित्सक से करवाएं।'
              : 'Ask a healthcare professional to interpret this result.',
            date: dateStr
          });
        }
      }

      if (reading.type === 'oxygen_saturation' && !seen.has('spo2')) {
        const spo2 = Number(values.spo2);

        if (spo2 > 0 && spo2 < 95) {
          seen.add('spo2');

          alerts.push({
            id: `alert-spo2-${reading.id}`,
            metric: 'spo2',
            level: spo2 < 90 ? 'danger' : 'warning',
            title: isHindi
              ? `ऑक्सीजन रीडिंग: ${spo2}%`
              : `Oxygen Saturation: ${spo2}%`,
            shortText: isHindi
              ? 'रीडिंग कम है। उचित चिकित्सा सलाह लें।'
              : 'Reading is low. Seek appropriate medical advice.',
            date: dateStr
          });
        }
      }

      if (reading.type === 'heart_rate' && !seen.has('hr')) {
        const bpm = Number(values.bpm);

        if (bpm > 100) {
          seen.add('hr');

          alerts.push({
            id: `alert-hr-${reading.id}`,
            metric: 'hr',
            level: bpm >= 120 ? 'danger' : 'warning',
            title: isHindi
              ? `हृदय गति रीडिंग: ${bpm} bpm`
              : `Heart Rate Reading: ${bpm} bpm`,
            shortText: isHindi
              ? 'रीडिंग की चिकित्सक से समीक्षा करवाएं।'
              : 'Have this reading reviewed by a healthcare professional.',
            date: dateStr
          });
        }
      }

      if (reading.type === 'blood_test' && !seen.has('glucose')) {
        const glucose = Number(
          values.glucose ?? values.fastingGlucose
        );

        if (glucose >= 100) {
          seen.add('glucose');

          alerts.push({
            id: `alert-glucose-${reading.id}`,
            metric: 'glucose',
            level: glucose >= 126 ? 'danger' : 'warning',
            title: isHindi
              ? `ग्लूकोज रीडिंग: ${glucose} mg/dL`
              : `Glucose Reading: ${glucose} mg/dL`,
            shortText: isHindi
              ? 'इस परिणाम की चिकित्सक से समीक्षा करवाएं।'
              : 'Have this result reviewed by a healthcare professional.',
            date: dateStr
          });
        }
      }
    }

    return alerts;
  },

  async getLatestByType(uid, limitCount = 100) {
    const readings = await this.list(uid, limitCount);
    const latest = {};

    for (const reading of readings) {
      if (!latest[reading.type]) {
        latest[reading.type] = reading;
      }
    }

    return latest;
  }
};

export default healthReadingService;
