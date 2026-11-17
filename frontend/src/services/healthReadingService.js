
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
  'urine_test'
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
      type,
      values: cleanValues(values),
      source,
      measuredAt: normalizeMeasuredAt(measuredAt),
      createdAt: serverTimestamp(),
      notes: notes.trim()
    };

    const reference = await addDoc(
      getReadingsCollection(uid),
      record
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
        {
          id: 'demo-bp-01',
          type: 'blood_pressure',
          values: { systolic: 118, diastolic: 78, pulse: 72 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 3600000).toISOString(),
          notes: 'Resting morning blood pressure reading'
        },
        {
          id: 'demo-hr-01',
          type: 'heart_rate',
          values: { bpm: 72 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 3600000).toISOString(),
          notes: 'Resting pulse rate'
        },
        {
          id: 'demo-spo2-01',
          type: 'oxygen_saturation',
          values: { spo2: 99 },
          source: 'manual',
          measuredAt: new Date(Date.now() - 7200000).toISOString(),
          notes: 'Pulse oximeter reading'
        },
        {
          id: 'demo-act-01',
          type: 'activity',
          values: { steps: 8420, distanceKm: 6.2, exerciseMinutes: 45 },
          source: 'manual',
          measuredAt: new Date().toISOString(),
          notes: 'Daily pedometer step count'
        },
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
          notes: 'Biomarker reagent test strip scan'
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
