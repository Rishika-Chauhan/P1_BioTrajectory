
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

const ALLOWED_TYPES = new Set([
  'blood_pressure',
  'heart_rate',
  'oxygen_saturation',
  'activity',
  'urine_test',
  'blood_test',
  'document'
]);

function getReadingsCollection(uid) {
  if (!db) {
    throw new Error('Firestore is not initialized.');
  }

  if (!uid) {
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

function validateText(value, field) {
  if (
    typeof value !== 'string' ||
    value.trim().length === 0 ||
    value.length > 100
  ) {
    throw new Error(`${field} must be a non-empty text value.`);
  }
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
      'glucose',
      'fastingGlucose',
      'hba1c',
      'totalCholesterol',
      'hdl',
      'ldl',
      'triglycerides',
      'hemoglobin',
      'platelets',
      'creatinine'
    ],
    document: [
      'title',
      'category',
      'fileName',
      'fileUrl',
      'fileType',
      'doctorName',
      'facility',
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
      if (values.protein !== undefined && values.protein !== null) {
        validateText(values.protein, 'Urine protein');
      }

      validateOptionalNumber(values, 'proteinMgDl', 0, 10000);
      validateOptionalNumber(values, 'ph', 0, 14);
      validateOptionalNumber(values, 'specificGravity', 1, 1.1);

      if (values.glucose !== undefined && values.glucose !== null) {
        validateText(values.glucose, 'Urine glucose');
      }

      if (values.nitrites !== undefined && values.nitrites !== null) {
        validateText(values.nitrites, 'Urine nitrites');
      }
      break;

    default:
      throw new Error('Unsupported measurement type.');
  }
}

function normalizeMeasuredAt(value) {
  const date = value instanceof Date
    ? value
    : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error('A valid measurement date and time is required.');
  }

  if (date.getTime() > Date.now() + 5 * 60 * 1000) {
    throw new Error('Measurement time cannot be in the future.');
  }

  return Timestamp.fromDate(date);
}

function cleanValues(values) {
  return Object.fromEntries(
    Object.entries(values).filter(
      ([, value]) => value !== undefined && value !== null
    )
  );
}

export const healthReadingService = {
  /**
   * Add one genuine health measurement.
   *
   * Supported client sources:
   * - manual
   * - imported
   *
   * Bluetooth writes will be added after real device
   * measurement decoding and trusted-source validation.
   */
  async add(uid, input = {}) {
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
      throw new Error(
        'Only manual and imported readings can currently be added from the application.'
      );
    }

    validateValues(type, values);

    if (typeof notes !== 'string' || notes.length > 1000) {
      throw new Error('Notes must be text with at most 1000 characters.');
    }

    const record = {
      id: `reading-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type,
      values: cleanValues(values),
      source,
      measuredAt: normalizeMeasuredAt(measuredAt),
      createdAt: new Date().toISOString(),
      notes: notes.trim()
    };

    if (String(uid).startsWith('demo-')) {
      let existing = [];
      try {
        const stored = localStorage.getItem('bt_demo_user_readings');
        existing = stored ? JSON.parse(stored) : await this.list(uid, 100);
      } catch {
        existing = [];
      }
      const updated = [record, ...existing];
      localStorage.setItem('bt_demo_user_readings', JSON.stringify(updated));
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

  /**
   * Get recent measurements for one patient.
   * Newest measurement comes first.
   */
  async list(uid, limitCount = 50) {
    if (
      !Number.isInteger(limitCount) ||
      limitCount < 1 ||
      limitCount > 100
    ) {
      throw new Error('Limit must be between 1 and 100.');
    }

    if (String(uid).startsWith('demo-')) {
      const stored = localStorage.getItem('bt_demo_user_readings');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          // ignore
        }
      }
      return [
        // Today (Nov 17)
        {
          id: 'demo-bp-01',
          type: 'blood_pressure',
          values: { systolic: 118, diastolic: 78, pulse: 72 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 3600000).toISOString(),
          notes: 'Resting morning blood pressure reading (Healthy & Stable)'
        },
        {
          id: 'demo-hr-01',
          type: 'heart_rate',
          values: { bpm: 72 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 3600000).toISOString(),
          notes: 'Resting heart rate in normal zone'
        },
        {
          id: 'demo-spo2-01',
          type: 'oxygen_saturation',
          values: { spo2: 99 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 7200000).toISOString(),
          notes: 'Room air pulse oximeter measurement'
        },
        {
          id: 'demo-act-01',
          type: 'activity',
          values: { steps: 8420, distanceKm: 6.2, exerciseMinutes: 45 },
          source: 'manual',
          measuredAt: new Date().toISOString(),
          notes: 'Daily pedometer step count'
        },
        // Nov 16
        {
          id: 'demo-bp-02',
          type: 'blood_pressure',
          values: { systolic: 122, diastolic: 80, pulse: 74 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 86400000).toISOString(),
          notes: 'Evening reading after walking'
        },
        {
          id: 'demo-hr-02',
          type: 'heart_rate',
          values: { bpm: 74 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 86400000).toISOString(),
          notes: 'Evening resting pulse'
        },
        {
          id: 'demo-spo2-02',
          type: 'oxygen_saturation',
          values: { spo2: 98 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 86400000).toISOString(),
          notes: 'Normal oxygen saturation'
        },
        {
          id: 'demo-act-02',
          type: 'activity',
          values: { steps: 9150, distanceKm: 6.8, exerciseMinutes: 50 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 86400000).toISOString(),
          notes: 'Daily activity goal met'
        },
        // Nov 15: Warning Elevation Day! (Systolic 136, Diastolic 88)
        {
          id: 'demo-bp-03',
          type: 'blood_pressure',
          values: { systolic: 136, diastolic: 88, pulse: 84 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          notes: 'Elevated post-work meeting. Higher stress noticed.'
        },
        {
          id: 'demo-hr-03',
          type: 'heart_rate',
          values: { bpm: 84 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          notes: 'Elevated pulse rate during stressful day'
        },
        {
          id: 'demo-spo2-03',
          type: 'oxygen_saturation',
          values: { spo2: 97 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          notes: 'SpO2 normal'
        },
        {
          id: 'demo-act-03',
          type: 'activity',
          values: { steps: 5800, distanceKm: 4.1, exerciseMinutes: 20 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          notes: 'Low activity day'
        },
        // Nov 14
        {
          id: 'demo-bp-04',
          type: 'blood_pressure',
          values: { systolic: 120, diastolic: 78, pulse: 70 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          notes: 'Normal resting blood pressure'
        },
        {
          id: 'demo-hr-04',
          type: 'heart_rate',
          values: { bpm: 70 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          notes: 'Resting pulse'
        },
        {
          id: 'demo-spo2-04',
          type: 'oxygen_saturation',
          values: { spo2: 99 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          notes: 'Normal SpO2'
        },
        {
          id: 'demo-act-04',
          type: 'activity',
          values: { steps: 10400, distanceKm: 7.9, exerciseMinutes: 60 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          notes: 'Exceeded 10k daily step goal'
        },
        // Nov 13
        {
          id: 'demo-bp-05',
          type: 'blood_pressure',
          values: { systolic: 119, diastolic: 76, pulse: 71 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 4 * 86400000).toISOString(),
          notes: 'Optimal blood pressure'
        },
        {
          id: 'demo-hr-05',
          type: 'heart_rate',
          values: { bpm: 71 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 4 * 86400000).toISOString(),
          notes: 'Resting pulse'
        },
        {
          id: 'demo-spo2-05',
          type: 'oxygen_saturation',
          values: { spo2: 98 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 4 * 86400000).toISOString(),
          notes: 'Good saturation'
        },
        {
          id: 'demo-act-05',
          type: 'activity',
          values: { steps: 8900, distanceKm: 6.5, exerciseMinutes: 45 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 4 * 86400000).toISOString(),
          notes: 'Walk in the park'
        },
        // Nov 12
        {
          id: 'demo-bp-06',
          type: 'blood_pressure',
          values: { systolic: 124, diastolic: 82, pulse: 75 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          notes: 'Normal BP reading'
        },
        {
          id: 'demo-hr-06',
          type: 'heart_rate',
          values: { bpm: 75 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          notes: 'Normal HR'
        },
        {
          id: 'demo-spo2-06',
          type: 'oxygen_saturation',
          values: { spo2: 99 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          notes: 'Normal SpO2'
        },
        {
          id: 'demo-act-06',
          type: 'activity',
          values: { steps: 7800, distanceKm: 5.8, exerciseMinutes: 40 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          notes: 'Daily step count'
        },
        // Urine Test record Nov 16
        {
          id: 'demo-urine-01',
          type: 'urine_test',
          values: {
            protein: 'Negative',
            proteinMgDl: 0,
            ph: 6.5,
            glucose: 'Negative',
            nitrites: 'Negative',
            specificGravity: 1.015
          },
          source: 'manual',
          measuredAt: new Date(Date.now() - 86400000).toISOString(),
          notes: 'Clean renal filtration and normal urine biomarker dipstick'
        },
        // Urine Test record Nov 17 (Today)
        {
          id: 'demo-urine-today',
          type: 'urine_test',
          values: {
            protein: 'Negative',
            proteinMgDl: 0,
            ph: 6.8,
            glucose: 'Negative',
            nitrites: 'Negative',
            specificGravity: 1.018
          },
          source: 'manual',
          measuredAt: new Date(Date.now() - 3600000).toISOString(),
          notes: 'Morning urinalysis dipstick: clear renal indices and neutral pH.'
        },
        // Urine Test record Nov 15 (Trace warning)
        {
          id: 'demo-urine-warning',
          type: 'urine_test',
          values: {
            protein: 'Trace',
            proteinMgDl: 30,
            ph: 7.2,
            glucose: 'Negative',
            nitrites: 'Negative',
            specificGravity: 1.022
          },
          source: 'manual',
          measuredAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          notes: 'Transient trace protein recorded following dehydration and stressful work day.'
        },
        // Blood Test record Nov 17 (Today)
        {
          id: 'demo-blood-today',
          type: 'blood_test',
          values: {
            glucose: 92,
            fastingGlucose: 92,
            hba1c: 5.4,
            totalCholesterol: 178,
            hdl: 60,
            ldl: 98,
            hemoglobin: 14.9,
            platelets: 248000
          },
          source: 'manual',
          measuredAt: new Date(Date.now() - 7200000).toISOString(),
          notes: 'Morning fingerstick fasting blood glucose measurement (optimal biological corridor).'
        },
        // Blood Test record Nov 15 (Elevated Warning)
        {
          id: 'demo-blood-warning',
          type: 'blood_test',
          values: {
            glucose: 108,
            fastingGlucose: 108,
            hba1c: 5.5,
            totalCholesterol: 190,
            hdl: 56,
            ldl: 110
          },
          source: 'manual',
          measuredAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          notes: 'Fasting glucose slightly elevated (108 mg/dL) into prediabetes warning threshold (ADA).'
        },
        // Blood Test record Nov 14
        {
          id: 'demo-blood-01',
          type: 'blood_test',
          values: {
            glucose: 94,
            fastingGlucose: 94,
            hba1c: 5.4,
            totalCholesterol: 182,
            hdl: 58,
            ldl: 104,
            hemoglobin: 14.8,
            platelets: 245000
          },
          source: 'imported',
          measuredAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          notes: 'Annual fasting metabolic & lipid panel by Metro Diagnostic Labs'
        },
        // Document record
        {
          id: 'demo-doc-01',
          type: 'document',
          values: {
            title: 'Annual Comprehensive Physical Examination',
            category: 'Diagnostic Lab Report',
            fileName: 'alex_johnson_lab_report_2026.pdf',
            doctorName: 'Dr. Sarah Vance, MD',
            facility: 'City Central Health Center',
            testSummary: 'All organ systems clear; cardiac and renal function within normal biological corridors.'
          },
          source: 'imported',
          measuredAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          notes: 'Verified electronic health summary signed by attending physician'
        }
      ];
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

  /**
   * Get the newest reading of each type from recent records.
   */
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
