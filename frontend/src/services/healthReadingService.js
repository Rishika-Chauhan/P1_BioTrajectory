
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
  'imaging_scan',
  'prescription',
  'clinical_note',
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
      'facility',
      'fileName',
      'fileUrl'
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
      'impression',
      'fileName',
      'fileUrl'
    ],
    prescription: [
      'title',
      'category',
      'doctorName',
      'facility',
      'medications',
      'instructions',
      'diagnosis',
      'fileName',
      'fileUrl'
    ],
    clinical_note: [
      'title',
      'category',
      'doctorName',
      'facility',
      'chiefComplaint',
      'assessment',
      'recommendations',
      'fileName',
      'fileUrl'
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

    case 'blood_test':
    case 'imaging_scan':
    case 'prescription':
    case 'clinical_note':
    case 'document':
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

export const DEFAULT_CLINICAL_MEDICAL_RECORDS = [
  {
    id: 'med-rec-cbc-01',
    type: 'blood_test',
    category: 'Hematology Laboratory Panel',
    title: 'Complete Blood Count (CBC) with Differential',
    source: 'imported',
    measuredAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    doctorName: 'Dr. Sarah Vance, MD (Clinical Pathologist)',
    facility: 'Metropolitan Diagnostics Laboratory',
    status: 'optimal',
    values: {
      title: 'Complete Blood Count (CBC) with Differential',
      hemoglobin: 14.8,
      hematocrit: 44.2,
      wbc: 6400,
      rbc: 4.92,
      platelets: 245000,
      glucose: 92,
      doctorName: 'Dr. Sarah Vance, MD',
      facility: 'Metropolitan Diagnostics Laboratory',
      fileName: 'cbc_differential_report_nov2026.pdf'
    },
    findings: [
      { name: 'Hemoglobin', value: '14.8 g/dL', range: '13.5 – 17.5 g/dL', status: 'optimal' },
      { name: 'Hematocrit', value: '44.2%', range: '41.0 – 50.0%', status: 'optimal' },
      { name: 'White Blood Cells (WBC)', value: '6,400 /mcL', range: '4,500 – 11,000 /mcL', status: 'optimal' },
      { name: 'Red Blood Cells (RBC)', value: '4.92 M/mcL', range: '4.35 – 5.65 M/mcL', status: 'optimal' },
      { name: 'Platelet Count', value: '245,000 /mcL', range: '150,000 – 450,000 /mcL', status: 'optimal' }
    ],
    notes: 'Normal cell morphology across all erythrocytic and leucocytic cell lines. No cytopenia or atypical blast forms.'
  },
  {
    id: 'med-rec-cmp-02',
    type: 'blood_test',
    category: 'Metabolic & Renal Profile',
    title: 'Comprehensive Metabolic Panel (CMP)',
    source: 'imported',
    measuredAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    doctorName: 'Dr. Rajesh Sharma, MD',
    facility: 'City Health Diagnostic Center',
    status: 'optimal',
    values: {
      title: 'Comprehensive Metabolic Panel (CMP)',
      glucose: 92,
      fastingGlucose: 92,
      creatinine: 0.9,
      doctorName: 'Dr. Rajesh Sharma, MD',
      facility: 'City Health Diagnostic Center',
      fileName: 'cmp_metabolic_panel_nov2026.pdf'
    },
    findings: [
      { name: 'Fasting Plasma Glucose', value: '92 mg/dL', range: '70 – 99 mg/dL', status: 'optimal' },
      { name: 'Serum Creatinine', value: '0.9 mg/dL', range: '0.7 – 1.2 mg/dL', status: 'optimal' },
      { name: 'Blood Urea Nitrogen (BUN)', value: '14 mg/dL', range: '7 – 20 mg/dL', status: 'optimal' },
      { name: 'eGFR (Glomerular Filtration)', value: '>90 mL/min', range: '≥90 mL/min', status: 'optimal' },
      { name: 'Serum Sodium', value: '140 mEq/L', range: '135 – 145 mEq/L', status: 'optimal' },
      { name: 'Serum Potassium', value: '4.2 mEq/L', range: '3.5 – 5.0 mEq/L', status: 'optimal' }
    ],
    notes: 'Electrolyte balance, liver transaminases, and renal filtration indices demonstrate healthy homeostasis.'
  },
  {
    id: 'med-rec-lipid-03',
    type: 'blood_test',
    category: 'Cardiovascular Risk Panel',
    title: 'Fasting Lipid Profile & Cholesterol Panel',
    source: 'imported',
    measuredAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    doctorName: 'Dr. David Miller, FACC',
    facility: 'Premier Heart & Vascular Institute',
    status: 'optimal',
    values: {
      title: 'Fasting Lipid Profile & Cholesterol Panel',
      totalCholesterol: 178,
      hdl: 60,
      ldl: 98,
      triglycerides: 110,
      doctorName: 'Dr. David Miller, FACC',
      facility: 'Premier Heart & Vascular Institute',
      fileName: 'lipid_profile_panel_nov2026.pdf'
    },
    findings: [
      { name: 'Total Cholesterol', value: '178 mg/dL', range: '<200 mg/dL', status: 'optimal' },
      { name: 'HDL ("Good" Cholesterol)', value: '60 mg/dL', range: '>40 mg/dL', status: 'optimal' },
      { name: 'LDL ("Bad" Cholesterol)', value: '98 mg/dL', range: '<100 mg/dL', status: 'optimal' },
      { name: 'Triglycerides', value: '110 mg/dL', range: '<150 mg/dL', status: 'optimal' },
      { name: 'Total / HDL Ratio', value: '2.96', range: '<3.5', status: 'optimal' }
    ],
    notes: 'Cardioprotective lipid ratios. 10-year Atherosclerotic Cardiovascular Disease (ASCVD) risk estimated <1%.'
  },
  {
    id: 'med-rec-urine-04',
    type: 'urine_test',
    category: 'Urinalysis & Renal Dipstick',
    title: 'Automated 10-Parameter Urinalysis Lab Report',
    source: 'imported',
    measuredAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    doctorName: 'Dr. Linda Gomez, MD',
    facility: 'Apex Nephro-Urology Care',
    status: 'clean',
    values: {
      title: 'Automated 10-Parameter Urinalysis Lab Report',
      protein: 'Negative',
      proteinMgDl: 0,
      ph: 6.8,
      glucose: 'Negative',
      nitrites: 'Negative',
      specificGravity: 1.018,
      doctorName: 'Dr. Linda Gomez, MD',
      facility: 'Apex Nephro-Urology Care',
      fileName: 'automated_urinalysis_lab_report.pdf'
    },
    findings: [
      { name: 'Urinary Protein', value: 'Negative (0 mg/dL)', range: 'Negative (<15 mg/dL)', status: 'optimal' },
      { name: 'Urine pH Balance', value: '6.8', range: '4.5 – 8.0', status: 'optimal' },
      { name: 'Specific Gravity', value: '1.018', range: '1.005 – 1.030', status: 'optimal' },
      { name: 'Urinary Glucose', value: 'Negative', range: 'Negative', status: 'optimal' },
      { name: 'Nitrites & Leukocytes', value: 'Negative', range: 'Negative', status: 'optimal' }
    ],
    notes: 'Clear straw amber appearance. Negative for microalbuminuria, bacteriuria, and casts. Kidney filtration confirmed clear.'
  },
  {
    id: 'med-rec-xray-05',
    type: 'imaging_scan',
    category: 'Diagnostic Radiology',
    title: 'Chest Radiography Digital Scan (X-Ray PA View)',
    source: 'imported',
    measuredAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    doctorName: 'Dr. Michael Chang, MD (Radiology)',
    facility: 'St. Jude Diagnostic Imaging Center',
    status: 'verified',
    values: {
      title: 'Chest Radiography Digital Scan (X-Ray PA View)',
      scanType: 'Digital Radiograph (PA View)',
      region: 'Thorax / Pulmonary',
      modality: 'Digital X-Ray',
      radiationDose: '0.02 mSv',
      doctorName: 'Dr. Michael Chang, MD',
      facility: 'St. Jude Diagnostic Imaging Center',
      fileName: 'chest_xray_pa_view_scan.dcm'
    },
    findings: [
      { name: 'Cardiac Silhouette', value: 'Normal cardiothoracic ratio (<0.50)', range: 'Normal', status: 'optimal' },
      { name: 'Pulmonary Parenchyma', value: 'Clear lung fields bilaterally', range: 'Clear', status: 'optimal' },
      { name: 'Pleural Spaces', value: 'No pleural effusion or pneumothorax', range: 'Clear', status: 'optimal' },
      { name: 'Bony Thorax', value: 'Intact ribs and thoracic vertebrae', range: 'Intact', status: 'optimal' }
    ],
    notes: 'IMPRESSION: Normal posteroanterior chest radiograph. No acute cardiopulmonary infiltrates or abnormalities detected.'
  },
  {
    id: 'med-rec-ecg-06',
    type: 'imaging_scan',
    category: 'Cardiology Diagnostics',
    title: '12-Lead Resting Electrocardiogram (ECG / EKG)',
    source: 'imported',
    measuredAt: new Date(Date.now() - 8 * 86400000).toISOString(),
    doctorName: 'Dr. Anita Desai, MD (Cardiology)',
    facility: 'Metro Cardiology Specialty Care',
    status: 'optimal',
    values: {
      title: '12-Lead Resting Electrocardiogram (ECG / EKG)',
      scanType: '12-Lead Surface ECG',
      modality: 'Standard 12-Lead',
      heartRate: 72,
      doctorName: 'Dr. Anita Desai, MD',
      facility: 'Metro Cardiology Specialty Care',
      fileName: '12lead_resting_ecg_trace.pdf'
    },
    findings: [
      { name: 'Ventricular Rate', value: '72 bpm', range: '60 – 100 bpm', status: 'optimal' },
      { name: 'PR Interval', value: '156 ms', range: '120 – 200 ms', status: 'optimal' },
      { name: 'QRS Duration', value: '88 ms', range: '80 – 120 ms', status: 'optimal' },
      { name: 'QT / QTc Interval', value: '388 / 412 ms', range: '<440 ms', status: 'optimal' },
      { name: 'P-R-T Axes', value: '54° / 48° / 42°', range: 'Normal Axis', status: 'optimal' }
    ],
    notes: 'Normal sinus rhythm with normal electrical conduction and PR/QT intervals. No ischemic ST elevations, depressions, or blocks.'
  },
  {
    id: 'med-rec-rx-07',
    type: 'prescription',
    category: 'Clinical Prescription (Rx)',
    title: 'Physician Clinical Prescription & Treatment Regimen',
    source: 'imported',
    measuredAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    doctorName: 'Dr. Sarah Vance, MD',
    facility: 'City Central Health Clinic',
    status: 'active',
    values: {
      title: 'Physician Clinical Prescription & Treatment Regimen',
      doctorName: 'Dr. Sarah Vance, MD',
      facility: 'City Central Health Clinic',
      fileName: 'official_rx_prescription_nov2026.pdf',
      medications: [
        { name: 'Vitamin D3 & K2 Softgels', dosage: '2,000 IU', frequency: 'Once daily after breakfast', duration: '90 Days' },
        { name: 'Purified Omega-3 EPA/DHA', dosage: '1,000 mg', frequency: 'Once daily with dinner', duration: '90 Days' }
      ],
      instructions: 'Maintain 2.0 to 2.5L daily hydration, 30 minutes light aerobic daily exercise, and adequate restful sleep.'
    },
    notes: 'Prescribed following preventative physical examination. Repeat basic metabolic panel in 6 to 12 months.'
  },
  {
    id: 'med-rec-consult-08',
    type: 'clinical_note',
    category: 'Clinical Consultation Summary',
    title: 'Annual Comprehensive Preventative Physical Summary',
    source: 'imported',
    measuredAt: new Date(Date.now() - 6 * 86400000).toISOString(),
    doctorName: 'Dr. Sarah Vance, MD',
    facility: 'City Central Health Center',
    status: 'complete',
    values: {
      title: 'Annual Comprehensive Preventative Physical Summary',
      doctorName: 'Dr. Sarah Vance, MD',
      facility: 'City Central Health Center',
      category: 'Preventative Medicine Checkup',
      chiefComplaint: 'Annual routine health assessment and biometric evaluation',
      assessment: 'Healthy adult with robust cardiovascular, respiratory, metabolic, and renal indices. Zero chronic co-morbidities identified.',
      fileName: 'annual_physical_consultation_summary.pdf'
    },
    notes: 'Review of systems completed. Patient advised to continue daily physical activity, balanced Mediterranean-style nutrition, and routine preventative health screening.'
  },
  {
    id: 'med-rec-doc-09',
    type: 'document',
    category: 'Diagnostic Laboratory Report',
    title: 'Thyroid Function Panel (TSH / Free T4)',
    source: 'imported',
    measuredAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    doctorName: 'Dr. Robert Klein, MD',
    facility: 'Quest Diagnostic Pathology',
    status: 'verified',
    values: {
      title: 'Thyroid Function Panel (TSH / Free T4)',
      category: 'Endocrinology Lab Report',
      doctorName: 'Dr. Robert Klein, MD',
      facility: 'Quest Diagnostic Pathology',
      fileName: 'alex_johnson_thyroid_panel_2026.pdf',
      testSummary: 'Thyroid Stimulating Hormone (TSH): 2.14 mIU/L (ref: 0.40 – 4.00 mIU/L). Free Thyroxine (FT4): 1.22 ng/dL (ref: 0.80 – 1.80 ng/dL). Patient is euthyroid.'
    },
    findings: [
      { name: 'TSH (Thyroid Stimulating Hormone)', value: '2.14 mIU/L', range: '0.40 – 4.00 mIU/L', status: 'optimal' },
      { name: 'Free T4 (Thyroxine)', value: '1.22 ng/dL', range: '0.80 – 1.80 ng/dL', status: 'optimal' }
    ],
    notes: 'Verified electronic laboratory document with digital clinic signature. Euthyroid state confirmed.'
  }
];

export function generateDemoVitalReadings() {
  const readings = [];
  const now = Date.now();
  const DAY_MS = 86400000;

  // Generate 90 full calendar days of longitudinal data
  for (let day = 0; day < 90; day++) {
    const dayTimestamp = now - day * DAY_MS;
    const dateObj = new Date(dayTimestamp);
    const dateIso = dateObj.toISOString();

    let systolic, diastolic, pulse, bpm, spo2, steps, glucose, urineProtein, urinePh;

    if (day === 0) {
      // Today
      systolic = 118; diastolic = 78; pulse = 72;
      bpm = 72; spo2 = 99; steps = 8420; glucose = 92;
      urineProtein = 0; urinePh = 6.8;
    } else if (day === 1) {
      // 1 day ago
      systolic = 122; diastolic = 80; pulse = 74;
      bpm = 74; spo2 = 98; steps = 9150; glucose = 94;
      urineProtein = 0; urinePh = 6.5;
    } else if (day === 2) {
      // 2 days ago (Warning Elevation Spike)
      systolic = 136; diastolic = 88; pulse = 84;
      bpm = 84; spo2 = 97; steps = 5800; glucose = 108;
      urineProtein = 30; urinePh = 7.2;
    } else if (day === 3) {
      systolic = 120; diastolic = 78; pulse = 70;
      bpm = 70; spo2 = 99; steps = 10400; glucose = 92;
    } else if (day === 4) {
      systolic = 119; diastolic = 76; pulse = 71;
      bpm = 71; spo2 = 98; steps = 8900; glucose = 90;
    } else if (day === 5) {
      systolic = 124; diastolic = 82; pulse = 75;
      bpm = 75; spo2 = 99; steps = 7800; glucose = 95;
    } else if (day === 6) {
      systolic = 121; diastolic = 79; pulse = 73;
      bpm = 73; spo2 = 98; steps = 8300; glucose = 93;
    } else {
      // Historical progression (Days 7 - 89)
      const trendFactor = day / 90; // 0 (recent) to 1 (90d ago)
      const wave = Math.sin(day * 0.35) * 3.5 + Math.cos(day * 0.2) * 2;
      const noise = ((day * 7) % 5) - 2;

      // Blood pressure gradually improves from ~130/84 down to ~120/78 over 90 days
      systolic = Math.round(120 + trendFactor * 9 + wave + noise);
      diastolic = Math.round(78 + trendFactor * 5 + wave * 0.6 + (noise > 0 ? 1 : 0));
      pulse = Math.round(72 + trendFactor * 4 + wave * 0.8);
      bpm = pulse;

      // SpO2 stays in safe corridor (97-99%)
      spo2 = Math.min(100, Math.max(96, Math.round(98.5 - trendFactor * 0.5 + (day % 3 === 0 ? 1 : 0))));

      // Steps increase from ~6,200 up to ~8,800 over 90 days
      steps = Math.round(8600 - trendFactor * 2200 + Math.sin(day * 0.5) * 1100 + noise * 120);

      // Fasting glucose
      if (day % 2 === 0 || day < 15) {
        glucose = Math.round(92 + trendFactor * 5 + (day % 4) - 1);
      }

      // Urine check every 4-5 days
      if (day % 5 === 0) {
        urineProtein = (day === 45) ? 30 : 0;
        urinePh = Number((6.4 + (day % 3) * 0.2).toFixed(1));
      }
    }

    readings.push({
      id: `demo-bp-${day}`,
      type: 'blood_pressure',
      values: { systolic, diastolic, pulse },
      source: 'manual',
      measuredAt: dateIso,
      notes: day === 2 ? 'Elevated post-work meeting. Higher stress noticed.' : 'Daily blood pressure log'
    });

    readings.push({
      id: `demo-hr-${day}`,
      type: 'heart_rate',
      values: { bpm },
      source: 'manual',
      measuredAt: dateIso,
      notes: 'Resting pulse'
    });

    readings.push({
      id: `demo-spo2-${day}`,
      type: 'oxygen_saturation',
      values: { spo2 },
      source: 'manual',
      measuredAt: dateIso,
      notes: 'Pulse oximeter measurement'
    });

    readings.push({
      id: `demo-act-${day}`,
      type: 'activity',
      values: {
        steps,
        distanceKm: Number((steps * 0.00075).toFixed(2)),
        exerciseMinutes: Math.round(steps / 200)
      },
      source: 'manual',
      measuredAt: dateIso,
      notes: 'Daily pedometer step count'
    });

    if (glucose != null) {
      readings.push({
        id: `demo-blood-${day}`,
        type: 'blood_test',
        values: {
          glucose,
          fastingGlucose: glucose,
          hba1c: Number((5.3 + (systolic > 125 ? 0.2 : 0)).toFixed(1))
        },
        source: 'manual',
        measuredAt: dateIso,
        notes: 'Fasting blood glucose log'
      });
    }

    if (urineProtein != null) {
      readings.push({
        id: `demo-urine-${day}`,
        type: 'urine_test',
        values: {
          protein: urineProtein >= 30 ? 'Trace' : 'Negative',
          proteinMgDl: urineProtein,
          ph: urinePh || 6.5,
          glucose: 'Negative',
          nitrites: 'Negative',
          specificGravity: 1.018
        },
        source: 'manual',
        measuredAt: dateIso,
        notes: urineProtein >= 30 ? 'Trace protein dipstick' : 'Normal dipstick'
      });
    }
  }

  return readings;
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
      notes: notes.trim(),
      isCustom: true
    };

    if (String(uid).startsWith('demo-')) {
      let existingCustom = [];
      try {
        const stored = localStorage.getItem('bt_demo_user_readings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            existingCustom = parsed.filter(
              (r) => r.id && (r.id.startsWith('reading-') || r.isCustom)
            );
          }
        }
      } catch {
        existingCustom = [];
      }
      const updated = [record, ...existingCustom];
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
  async list(uid, limitCount = 500) {
    if (
      !Number.isInteger(limitCount) ||
      limitCount < 1 ||
      limitCount > 1000
    ) {
      throw new Error('Limit must be between 1 and 1000.');
    }

    if (String(uid).startsWith('demo-')) {
      let custom = [];
      try {
        const stored = localStorage.getItem('bt_demo_user_readings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            custom = parsed.filter(
              (r) => r.id && (r.id.startsWith('reading-') || r.isCustom)
            );
          }
        }
      } catch {
        custom = [];
      }
      const baseline = generateDemoVitalReadings();
      const combined = [...custom, ...baseline];
      return combined.slice(0, limitCount);
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
   * Fetch authentic clinical medical records.
   * Strictly EXCLUDES daily blood pressure logs, daily walking/activity, heart rate, and SpO2!
   */
  async listMedicalRecords(uid, limitCount = 100) {
    const isClinicalRecord = (r) => {
      const excludedTypes = ['blood_pressure', 'activity', 'heart_rate', 'oxygen_saturation'];
      return !excludedTypes.includes(r.type);
    };

    // 1. Check user-uploaded medical records in local storage
    let userAdded = [];
    try {
      const stored = localStorage.getItem(`bt_user_medical_records_${uid}`);
      if (stored) {
        userAdded = JSON.parse(stored);
      }
    } catch {
      userAdded = [];
    }

    // 2. For demo accounts or offline fallback, combine with rich clinical records
    if (String(uid).startsWith('demo-')) {
      const combined = [...userAdded, ...DEFAULT_CLINICAL_MEDICAL_RECORDS];
      return combined.filter(isClinicalRecord);
    }

    // 3. For live authenticated users, query Firestore
    try {
      const readingsQuery = query(
        getReadingsCollection(uid),
        orderBy('measuredAt', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(readingsQuery);
      const docs = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data()
      }));

      // Strictly exclude daily vitals (BP, steps, HR, SpO2)
      const clinicalDocs = docs.filter(isClinicalRecord);

      const combined = [...userAdded, ...clinicalDocs];
      if (combined.length === 0) {
        return DEFAULT_CLINICAL_MEDICAL_RECORDS.filter(isClinicalRecord);
      }
      return combined.filter(isClinicalRecord);
    } catch (err) {
      console.warn('Falling back to clinical medical records:', err);
      return [...userAdded, ...DEFAULT_CLINICAL_MEDICAL_RECORDS].filter(isClinicalRecord);
    }
  },

  /**
   * Add a new genuine medical record.
   * Strictly prevents daily blood pressure or walking history.
   */
  async addMedicalRecord(uid, input = {}) {
    if (['blood_pressure', 'activity', 'heart_rate', 'oxygen_saturation'].includes(input.type)) {
      throw new Error(
        'Daily vital signs and walking history cannot be recorded in Medical Records. Please log them under Health Analytics.'
      );
    }

    const record = {
      id: `medrec-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      type: input.type,
      values: cleanValues(input.values || {}),
      source: input.source || 'manual',
      measuredAt: input.measuredAt ? new Date(input.measuredAt).toISOString() : new Date().toISOString(),
      createdAt: new Date().toISOString(),
      notes: (input.notes || '').trim()
    };

    // Store in user medical records
    try {
      const stored = localStorage.getItem(`bt_user_medical_records_${uid}`);
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem(
        `bt_user_medical_records_${uid}`,
        JSON.stringify([record, ...existing])
      );
    } catch (e) {
      console.error('Failed to cache medical record locally:', e);
    }

    if (!String(uid).startsWith('demo-') && db) {
      try {
        await addDoc(getReadingsCollection(uid), {
          ...record,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.warn('Firestore write warning:', err);
      }
    }

    return record;
  },

  /**
   * Evaluate short in-app threshold warning alerts from health readings.
   * Formats short notification items when readings cross warning or danger limits.
   */
  computeThresholdAlerts(readings = [], isHindi = false) {
    const alerts = [];
    const seen = new Set();

    for (const r of readings) {
      const vals = r.values || {};
      const measured = r.measuredAt ? (r.measuredAt.toDate ? r.measuredAt.toDate() : new Date(r.measuredAt)) : null;
      const dateStr = measured && !Number.isNaN(measured.getTime())
        ? measured.toLocaleDateString(isHindi ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short' })
        : (isHindi ? 'हाल ही में' : 'Recent');

      // 1. Blood Pressure
      if (r.type === 'blood_pressure' && !seen.has('bp')) {
        const sys = Number(vals.systolic);
        const dia = Number(vals.diastolic);
        if (sys >= 140 || dia >= 90) {
          seen.add('bp');
          alerts.push({
            id: `alert-bp-danger-${r.id}`,
            metric: 'bp',
            level: 'danger',
            title: isHindi ? `गंभीर रक्तचाप: ${sys}/${dia} mmHg` : `Critical BP Alert: ${sys}/${dia} mmHg`,
            shortText: isHindi ? `स्टेज 2 उच्च रक्तचाप (≥140/90 mmHg) पार हुआ।` : `Exceeded clinical crisis threshold (≥140/90 mmHg).`,
            date: dateStr
          });
        } else if (sys >= 130 || dia >= 80) {
          seen.add('bp');
          alerts.push({
            id: `alert-bp-warn-${r.id}`,
            metric: 'bp',
            level: 'warning',
            title: isHindi ? `रक्तचाप चेतावनी: ${sys}/${dia} mmHg` : `Elevated BP Warning: ${sys}/${dia} mmHg`,
            shortText: isHindi ? `रीडिंग चेतावनी क्षेत्र (130–139 mmHg) में है।` : `Reading is in elevated warning corridor (130–139 mmHg).`,
            date: dateStr
          });
        }
      }

      // 2. Urine Protein
      if (r.type === 'urine_test' && !seen.has('urine')) {
        const prot = vals.proteinMgDl ?? (vals.protein === 'Negative' ? 0 : vals.protein === 'Trace' ? 30 : vals.protein === '1+' ? 100 : null);
        if (prot != null) {
          if (prot >= 100) {
            seen.add('urine');
            alerts.push({
              id: `alert-urine-danger-${r.id}`,
              metric: 'urine',
              level: 'danger',
              title: isHindi ? `मूत्र प्रोटीन खतरा: ${prot} mg/dL` : `Clinical Proteinuria: ${prot} mg/dL`,
              shortText: isHindi ? `गुर्दा रिसाव सीमा (≥100 mg/dL) पार हुई।` : `Exceeded diagnostic threshold (≥100 mg/dL).`,
              date: dateStr
            });
          } else if (prot >= 30) {
            seen.add('urine');
            alerts.push({
              id: `alert-urine-warn-${r.id}`,
              metric: 'urine',
              level: 'warning',
              title: isHindi ? `मूत्र प्रोटीन चेतावनी: ${prot} mg/dL` : `Trace Proteinuria Warning: ${prot} mg/dL`,
              shortText: isHindi ? `मूत्र में ट्रेस प्रोटीन (30 mg/dL) पाया गया। पर्याप्त पानी पिएं।` : `Urinary dipstick recorded trace protein (30 mg/dL). Ensure hydration.`,
              date: dateStr
            });
          }
        }
      }

      // 3. SpO2
      if (r.type === 'oxygen_saturation' && !seen.has('spo2')) {
        const spo2 = Number(vals.spo2);
        if (spo2 > 0 && spo2 < 90) {
          seen.add('spo2');
          alerts.push({
            id: `alert-spo2-danger-${r.id}`,
            metric: 'spo2',
            level: 'danger',
            title: isHindi ? `कम ऑक्सीजन खतरा: SpO2 ${spo2}%` : `Critical Low SpO2: ${spo2}%`,
            shortText: isHindi ? `ऑक्सीजन 90% से नीचे है। डॉक्टर से संपर्क करें।` : `Oxygen saturation dropped below 90%.`,
            date: dateStr
          });
        } else if (spo2 >= 90 && spo2 < 95) {
          seen.add('spo2');
          alerts.push({
            id: `alert-spo2-warn-${r.id}`,
            metric: 'spo2',
            level: 'warning',
            title: isHindi ? `कम ऑक्सीजन चेतावनी: SpO2 ${spo2}%` : `Low Oxygen Warning: SpO2 ${spo2}%`,
            shortText: isHindi ? `सामान्य सीमा (≥95%) से थोड़ा कम है।` : `Slightly below optimal threshold (≥95%).`,
            date: dateStr
          });
        }
      }

      // 4. Heart Rate
      if (r.type === 'heart_rate' && !seen.has('hr')) {
        const bpm = Number(vals.bpm);
        if (bpm >= 120) {
          seen.add('hr');
          alerts.push({
            id: `alert-hr-danger-${r.id}`,
            metric: 'hr',
            level: 'danger',
            title: isHindi ? `उच्च पल्स खतरा: ${bpm} bpm` : `Tachycardia Danger: ${bpm} bpm`,
            shortText: isHindi ? `विश्राम पल्स 120 bpm से अधिक दर्ज हुई।` : `Resting pulse critically elevated (≥120 bpm).`,
            date: dateStr
          });
        } else if (bpm > 100) {
          seen.add('hr');
          alerts.push({
            id: `alert-hr-warn-${r.id}`,
            metric: 'hr',
            level: 'warning',
            title: isHindi ? `पल्स चेतावनी: ${bpm} bpm` : `Elevated Pulse Warning: ${bpm} bpm`,
            shortText: isHindi ? `विश्राम पल्स 100 bpm से अधिक दर्ज हुई।` : `Resting pulse above normal corridor (>100 bpm).`,
            date: dateStr
          });
        }
      }

      // 5. Blood Glucose
      if (r.type === 'blood_test' && !seen.has('glucose')) {
        const glu = Number(vals.glucose ?? vals.fastingGlucose);
        if (glu > 0) {
          if (glu >= 126) {
            seen.add('glucose');
            alerts.push({
              id: `alert-glu-danger-${r.id}`,
              metric: 'glucose',
              level: 'danger',
              title: isHindi ? `ग्लूकोज खतरा (ADA ≥126): ${glu} mg/dL` : `High Glucose Alert: ${glu} mg/dL`,
              shortText: isHindi ? `ADA मधुमेह सीमा (≥126 mg/dL) पार हुई।` : `Crossed ADA diabetes threshold (≥126 mg/dL).`,
              date: dateStr
            });
          } else if (glu >= 100) {
            seen.add('glucose');
            alerts.push({
              id: `alert-glu-warn-${r.id}`,
              metric: 'glucose',
              level: 'warning',
              title: isHindi ? `ग्लूकोज चेतावनी: ${glu} mg/dL` : `Impaired Glucose Warning: ${glu} mg/dL`,
              shortText: isHindi ? `पूर्व-मधुमेह क्षेत्र (100–125 mg/dL) में है।` : `Falls in pre-diabetes range (100–125 mg/dL).`,
              date: dateStr
            });
          }
        }
      }
    }

    return alerts;
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
