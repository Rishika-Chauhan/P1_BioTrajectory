// Comprehensive clinical mock dataset and configuration for BioTrajectory
// Grounded strictly in the BioTrajectory Project Blueprint (PDF Sections 1 - 22 + Appendix)

// 1. Full 10-Parameter Biomarker Definitions (Multistix 10SG Standard)
export const BIOMARKER_DEFINITIONS = [
  {
    id: 'protein',
    name: 'Protein (Albumin)',
    shortName: 'PRO',
    unit: 'mg/dL',
    description: 'Measures albumin concentration in urine. Crucial for detecting early changes in glomerular filtration and microvascular renal permeability.',
    normalRange: 'Negative (<15 mg/dL)',
    baselineMean: 5.2,
    baselineMin: 0,
    baselineMax: 15,
    criticalThreshold: 30,
    colorScale: [
      { label: 'Neg (0)', value: 0, color: '#e8ea9c' },
      { label: 'Trace (15)', value: 15, color: '#d8e195' },
      { label: '+ (30)', value: 30, color: '#a7cd9a' },
      { label: '++ (100)', value: 100, color: '#68b19a' },
      { label: '+++ (300)', value: 300, color: '#328b8b' },
    ],
    biologicalContext: 'Can temporarily elevate after strenuous exercise (march proteinuria), fever, dehydration, or postural changes without indicating renal disease.',
    measurementConfounders: 'Highly concentrated urine (SG >1.025), alkaline urine (pH >8.0), or antiseptic skin washes.'
  },
  {
    id: 'specificGravity',
    name: 'Specific Gravity',
    shortName: 'SG',
    unit: 'density',
    description: 'Measures urine concentration and the renal tubules’ concentrating capability, serving as the master indicator of hydration status.',
    normalRange: '1.005 – 1.030',
    baselineMean: 1.018,
    baselineMin: 1.012,
    baselineMax: 1.024,
    criticalThreshold: 1.030,
    colorScale: [
      { label: '1.000', value: 1.000, color: '#2b3990' },
      { label: '1.010', value: 1.010, color: '#277478' },
      { label: '1.020', value: 1.020, color: '#568b44' },
      { label: '1.030', value: 1.030, color: '#978d38' },
    ],
    biologicalContext: 'Heavily driven by hydration state, ambient temperature, sweating, fluid intake timing, and sodium intake.',
    measurementConfounders: 'Radiographic contrast dyes, excessive proteinuria, or high ambient humidity affecting pad.'
  },
  {
    id: 'pH',
    name: 'pH Level',
    shortName: 'pH',
    unit: 'pH',
    description: 'Measures urinary acidity or alkalinity, reflecting systemic acid-base equilibrium and stone-formation risk.',
    normalRange: '5.0 – 8.0 (Median ~6.2)',
    baselineMean: 6.4,
    baselineMin: 6.0,
    baselineMax: 6.8,
    criticalThreshold: 7.8,
    colorScale: [
      { label: '5.0', value: 5.0, color: '#ea5d35' },
      { label: '6.0', value: 6.0, color: '#e08f36' },
      { label: '7.0', value: 7.0, color: '#7ab753' },
      { label: '8.0', value: 8.0, color: '#388b77' },
      { label: '9.0', value: 9.0, color: '#2b5282' },
    ],
    biologicalContext: 'Alkaline after vegetarian meals, citrus fruits, or sodium bicarbonate; acidic during prolonged fasting or ketogenic diets.',
    measurementConfounders: 'Bacterial breakdown of urea into ammonia if urine stands unread >1 hour at room temperature.'
  },
  {
    id: 'glucose',
    name: 'Glucose',
    shortName: 'GLU',
    unit: 'mg/dL',
    description: 'Detects renal glucosuria occurring when serum glucose exceeds the renal reabsorption threshold (~180 mg/dL).',
    normalRange: 'Negative (<15 mg/dL)',
    baselineMean: 0,
    baselineMin: 0,
    baselineMax: 15,
    criticalThreshold: 50,
    colorScale: [
      { label: 'Neg (0)', value: 0, color: '#88bfb8' },
      { label: 'Trace (100)', value: 100, color: '#8bb68b' },
      { label: 'Mod (250)', value: 250, color: '#ab9c5c' },
      { label: 'Large (500)', value: 500, color: '#93583b' },
    ],
    biologicalContext: 'Normally filtered and 100% reabsorbed in proximal tubules. Persistent elevations indicate potential glycemic dysregulation.',
    measurementConfounders: 'High doses of Vitamin C (ascorbic acid) can cause false negatives by reducing colorimetry reaction.'
  },
  {
    id: 'leukocytes',
    name: 'Leukocyte Esterase',
    shortName: 'LEU',
    unit: 'Leu/µL',
    description: 'Enzyme produced by granulocytic white blood cells, indicating inflammatory or immune activation in the urinary tract.',
    normalRange: 'Negative (<10 Leu/µL)',
    baselineMean: 0,
    baselineMin: 0,
    baselineMax: 10,
    criticalThreshold: 25,
    colorScale: [
      { label: 'Neg (0)', value: 0, color: '#f7ecd2' },
      { label: 'Trace (15)', value: 15, color: '#eed3bb' },
      { label: '+ (70)', value: 70, color: '#cca2b9' },
      { label: '++ (125)', value: 125, color: '#985888' },
    ],
    biologicalContext: 'Often signals lower urinary tract inflammation. Requires minimum 120-second enzymatic reaction for full color development.',
    measurementConfounders: 'Vaginal secretions, heavy proteinuria (>500 mg/dL), or high specific gravity.'
  },
  {
    id: 'ketones',
    name: 'Ketones (Acetoacetate)',
    shortName: 'KET',
    unit: 'mg/dL',
    description: 'Detects acetoacetic acid produced during fatty acid beta-oxidation, common during fasting, low carbohydrate diets, or endurance athletics.',
    normalRange: 'Negative (0 mg/dL)',
    baselineMean: 0,
    baselineMin: 0,
    baselineMax: 5,
    criticalThreshold: 15,
    colorScale: [
      { label: 'Neg (0)', value: 0, color: '#f8eecf' },
      { label: 'Trace (5)', value: 5, color: '#e5b9bd' },
      { label: 'Mod (40)', value: 40, color: '#9c3f68' },
      { label: 'Large (80)', value: 80, color: '#57173e' },
    ],
    biologicalContext: 'Elevates normally during intermittent fasting, strenuous endurance exercise, or low-carbohydrate nutrition.',
    measurementConfounders: 'Highly pigmented urine, levodopa metabolites, or strip exposure to humid air.'
  },
  {
    id: 'nitrite',
    name: 'Nitrite',
    shortName: 'NIT',
    unit: 'qualitative',
    description: 'Produced when gram-negative bacteria convert dietary nitrate to nitrite; requires ~4 hours bladder dwell time.',
    normalRange: 'Negative (0)',
    baselineMean: 0,
    baselineMin: 0,
    baselineMax: 0,
    criticalThreshold: 1,
    colorScale: [
      { label: 'Neg (0)', value: 0, color: '#fbf5e6' },
      { label: 'Pos (1)', value: 1, color: '#e86d8a' },
    ],
    biologicalContext: 'Strong specific indicator of bacterial colonization when paired with leukocyte esterase.',
    measurementConfounders: 'Diet low in dietary green vegetables (lack of nitrates), frequent urination before 4 hours.'
  },
  {
    id: 'blood',
    name: 'Blood / Occult Hb',
    shortName: 'BLD',
    unit: 'Ery/µL',
    description: 'Detects intact erythrocytes or free hemoglobin through pseudoperoxidase activity.',
    normalRange: 'Negative (0)',
    baselineMean: 0,
    baselineMin: 0,
    baselineMax: 5,
    criticalThreshold: 10,
    colorScale: [
      { label: 'Neg (0)', value: 0, color: '#f1ad47' },
      { label: 'Trace (10)', value: 10, color: '#889a42' },
      { label: '+ (25)', value: 25, color: '#387342' },
      { label: '++ (80)', value: 80, color: '#13472d' },
    ],
    biologicalContext: 'Transient microscopic hematuria frequently occurs following vigorous running or cycling.',
    measurementConfounders: 'Menstrual contamination, microbial peroxidases, or high ascorbic acid.'
  },
  {
    id: 'urobilinogen',
    name: 'Urobilinogen',
    shortName: 'URO',
    unit: 'mg/dL',
    description: 'Byproduct of bilirubin reduction in intestines, reabsorbed and excreted by kidneys; assists in hepatobiliary and hemolytic tracking.',
    normalRange: 'Normal (0.2 – 1.0 mg/dL)',
    baselineMean: 0.5,
    baselineMin: 0.2,
    baselineMax: 1.0,
    criticalThreshold: 2.0,
    colorScale: [
      { label: '0.2', value: 0.2, color: '#fbf1df' },
      { label: '1.0', value: 1.0, color: '#e8af69' },
      { label: '2.0', value: 2.0, color: '#e28b3b' },
      { label: '4.0', value: 4.0, color: '#cb5827' },
    ],
    biologicalContext: 'Increases in hemolytic states or hepatic overload; decreases in complete biliary obstruction.',
    measurementConfounders: 'Exposure of urine container to direct sunlight (rapid photo-oxidation of urobilinogen).'
  },
  {
    id: 'bilirubin',
    name: 'Bilirubin',
    shortName: 'BIL',
    unit: 'mg/dL',
    description: 'Detects conjugated water-soluble bilirubin; presence always warrants clinical consultation.',
    normalRange: 'Negative (0)',
    baselineMean: 0,
    baselineMin: 0,
    baselineMax: 0,
    criticalThreshold: 0.5,
    colorScale: [
      { label: 'Neg (0)', value: 0, color: '#faeec7' },
      { label: 'Trace (0.5)', value: 0.5, color: '#d8ba6c' },
      { label: '+ (1.0)', value: 1.0, color: '#c89d58' },
      { label: '++ (3.0)', value: 3.0, color: '#976a38' },
    ],
    biologicalContext: 'Normally completely absent in healthy urine as unconjugated bilirubin cannot cross glomerular barrier.',
    measurementConfounders: 'High doses of ascorbic acid or light exposure destroying bilirubin before optical scan.'
  }
];

// ============================================================================
// 2. Multi-Persona Longitudinal Datasets (PDF Section 11 & 14)
// ============================================================================

export const PATIENT_PERSONAS = [
  {
    id: 'arjun',
    name: 'Arjun Patel',
    age: 34,
    gender: 'Male',
    patientId: 'BT-9428',
    initials: 'AP',
    profileType: 'Endurance Athlete & Tech Worker',
    clinicalStory: 'Underwent half-marathon cross-training. Demonstrates a classic post-exercise dehydration spike on Day 22 followed by full spontaneous normalization.',
    baselineReadingsCount: 15,
    isBaselineEstablished: true,
    baselines: {
      protein: { normalCorridor: '5.2 ± 1.1 mg/dL' },
      specificGravity: { normalCorridor: '1.018 ± 0.003' },
      pH: { normalCorridor: '6.4 ± 0.2' },
      glucose: { normalCorridor: '0.0 mg/dL' },
      ketones: { normalCorridor: '0.0 – 5.0 mg/dL' }
    },
    history: [
      { day: 1, date: '2026-10-05', time: '07:15', protein: 5, specificGravity: 1.018, pH: 6.4, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 92, bleBpSystolic: 118, bleBpDiastolic: 78, bleHeartRate: 62, bleSpo2: 99, bleHydration: 58.4, notes: 'Baseline calibration 1. Normal hydration.', confirmed: true, sampleType: 'First morning' },
      { day: 3, date: '2026-10-07', time: '07:22', protein: 6, specificGravity: 1.019, pH: 6.3, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 94, bleBpSystolic: 120, bleBpDiastolic: 79, bleHeartRate: 64, bleSpo2: 98, bleHydration: 58.1, notes: 'Baseline collection 2.', confirmed: true, sampleType: 'First morning' },
      { day: 5, date: '2026-10-09', time: '07:30', protein: 4, specificGravity: 1.017, pH: 6.5, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.5, bilirubin: 0, bleCgmGlucose: 91, bleBpSystolic: 119, bleBpDiastolic: 78, bleHeartRate: 61, bleSpo2: 99, bleHydration: 58.8, notes: 'Normal routine recovery.', confirmed: true, sampleType: 'First morning' },
      { day: 7, date: '2026-10-11', time: '08:05', protein: 5, specificGravity: 1.020, pH: 6.2, glucose: 0, leukocytes: 0, ketones: 5, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 88, bleBpSystolic: 121, bleBpDiastolic: 80, bleHeartRate: 63, bleSpo2: 98, bleHydration: 57.6, notes: 'Sunday morning 14h intermittent fast.', confirmed: true, sampleType: 'First morning' },
      { day: 9, date: '2026-10-13', time: '07:10', protein: 5, specificGravity: 1.018, pH: 6.4, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.5, bilirubin: 0, bleCgmGlucose: 95, bleBpSystolic: 122, bleBpDiastolic: 79, bleHeartRate: 65, bleSpo2: 99, bleHydration: 58.2, notes: 'Workday check.', confirmed: true, sampleType: 'First morning' },
      { day: 11, date: '2026-10-15', time: '07:18', protein: 6, specificGravity: 1.019, pH: 6.5, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.3, bilirubin: 0, bleCgmGlucose: 93, bleBpSystolic: 120, bleBpDiastolic: 78, bleHeartRate: 63, bleSpo2: 98, bleHydration: 58.0, notes: 'Baseline stability confirmed.', confirmed: true, sampleType: 'First morning' },
      { day: 13, date: '2026-10-17', time: '07:45', protein: 5, specificGravity: 1.016, pH: 6.6, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 90, bleBpSystolic: 118, bleBpDiastolic: 77, bleHeartRate: 60, bleSpo2: 99, bleHydration: 59.2, notes: 'Well hydrated with electrolyte water.', confirmed: true, sampleType: 'First morning' },
      { day: 15, date: '2026-10-19', time: '07:12', protein: 4, specificGravity: 1.018, pH: 6.4, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 93, bleBpSystolic: 119, bleBpDiastolic: 79, bleHeartRate: 62, bleSpo2: 99, bleHydration: 58.5, notes: '10-session rolling baseline active.', confirmed: true, sampleType: 'First morning' },
      { day: 17, date: '2026-10-21', time: '07:20', protein: 6, specificGravity: 1.020, pH: 6.3, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 96, bleBpSystolic: 122, bleBpDiastolic: 80, bleHeartRate: 64, bleSpo2: 98, bleHydration: 57.9, notes: 'Normal routine.', confirmed: true, sampleType: 'First morning' },
      { day: 19, date: '2026-10-23', time: '07:35', protein: 7, specificGravity: 1.021, pH: 6.3, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.5, bilirubin: 0, bleCgmGlucose: 98, bleBpSystolic: 124, bleBpDiastolic: 81, bleHeartRate: 67, bleSpo2: 98, bleHydration: 56.8, notes: 'Moderate evening track session.', confirmed: true, sampleType: 'First morning' },
      { day: 22, date: '2026-10-26', time: '07:15', protein: 32, specificGravity: 1.028, pH: 6.1, glucose: 0, leukocytes: 0, ketones: 10, nitrite: 0, blood: 0, urobilinogen: 0.6, bilirubin: 0, bleCgmGlucose: 106, bleBpSystolic: 142, bleBpDiastolic: 88, bleHeartRate: 86, bleSpo2: 97, bleHydration: 51.2, notes: 'Intense 18km run in heat + low hydration. Flagged for review.', confirmed: true, flagged: true, deviationReason: 'Protein +3.8σ above baseline corridor; high SG indicates concentrated urine', sampleType: 'First morning' },
      { day: 24, date: '2026-10-28', time: '07:25', protein: 18, specificGravity: 1.023, pH: 6.3, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 97, bleBpSystolic: 128, bleBpDiastolic: 82, bleHeartRate: 72, bleSpo2: 98, bleHydration: 55.4, notes: 'Rest day + rehydration. Protein returning toward baseline.', confirmed: true, flagged: false, sampleType: 'First morning' },
      { day: 26, date: '2026-10-30', time: '07:15', protein: 8, specificGravity: 1.019, pH: 6.4, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 94, bleBpSystolic: 122, bleBpDiastolic: 79, bleHeartRate: 65, bleSpo2: 99, bleHydration: 57.5, notes: 'Near baseline corridor (8 mg/dL).', confirmed: true, sampleType: 'First morning' },
      { day: 28, date: '2026-11-01', time: '07:40', protein: 5, specificGravity: 1.018, pH: 6.4, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 92, bleBpSystolic: 119, bleBpDiastolic: 78, bleHeartRate: 63, bleSpo2: 99, bleHydration: 58.2, notes: 'Fully returned to personal baseline.', confirmed: true, sampleType: 'First morning' },
      { day: 30, date: '2026-11-03', time: '07:15', protein: 5, specificGravity: 1.017, pH: 6.5, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 93, bleBpSystolic: 120, bleBpDiastolic: 78, bleHeartRate: 62, bleSpo2: 99, bleHydration: 58.6, notes: 'Latest test session. Homeostasis stable.', confirmed: true, sampleType: 'First morning' },
    ]
  },
  {
    id: 'sunita',
    name: 'Sunita Rao',
    age: 58,
    gender: 'Female',
    patientId: 'BT-8812',
    initials: 'SR',
    profileType: 'Prediabetes & Metabolic Tracking',
    clinicalStory: 'Demonstrates subtle, non-acute upward creep in morning urinary glucose and persistent trace protein over 4 weeks—the classic silent progression that point-tests miss.',
    baselineReadingsCount: 15,
    isBaselineEstablished: true,
    baselines: {
      protein: { normalCorridor: '8.0 – 24.0 mg/dL (Upward Drift)' },
      specificGravity: { normalCorridor: '1.023 ± 0.002' },
      pH: { normalCorridor: '5.8 ± 0.2' },
      glucose: { normalCorridor: '0 → 100 mg/dL (Creep Detected)' },
      ketones: { normalCorridor: '0.0 mg/dL' }
    },
    history: [
      { day: 1, date: '2026-10-05', time: '06:50', protein: 8, specificGravity: 1.020, pH: 6.0, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 98, bleBpSystolic: 126, bleBpDiastolic: 82, bleHeartRate: 71, bleSpo2: 98, bleHydration: 54.2, notes: 'Baseline day 1. Fasting morning.', confirmed: true, sampleType: 'First morning' },
      { day: 3, date: '2026-10-07', time: '07:05', protein: 10, specificGravity: 1.021, pH: 5.9, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 102, bleBpSystolic: 127, bleBpDiastolic: 83, bleHeartRate: 72, bleSpo2: 98, bleHydration: 53.9, notes: 'Routine test.', confirmed: true, sampleType: 'First morning' },
      { day: 5, date: '2026-10-09', time: '07:00', protein: 9, specificGravity: 1.020, pH: 6.1, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.5, bilirubin: 0, bleCgmGlucose: 104, bleBpSystolic: 128, bleBpDiastolic: 82, bleHeartRate: 70, bleSpo2: 99, bleHydration: 54.0, notes: 'Normal morning.', confirmed: true, sampleType: 'First morning' },
      { day: 7, date: '2026-10-11', time: '07:15', protein: 11, specificGravity: 1.022, pH: 5.8, glucose: 15, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 115, bleBpSystolic: 130, bleBpDiastolic: 84, bleHeartRate: 74, bleSpo2: 97, bleHydration: 53.5, notes: 'Trace glucose noted post festival dinner.', confirmed: true, sampleType: 'First morning' },
      { day: 9, date: '2026-10-13', time: '06:55', protein: 12, specificGravity: 1.021, pH: 5.9, glucose: 10, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 118, bleBpSystolic: 131, bleBpDiastolic: 85, bleHeartRate: 73, bleSpo2: 98, bleHydration: 53.8, notes: 'Trace glucose recurring.', confirmed: true, sampleType: 'First morning' },
      { day: 11, date: '2026-10-15', time: '07:10', protein: 14, specificGravity: 1.023, pH: 5.8, glucose: 25, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.5, bilirubin: 0, bleCgmGlucose: 126, bleBpSystolic: 133, bleBpDiastolic: 86, bleHeartRate: 75, bleSpo2: 97, bleHydration: 53.2, notes: 'Glucose persistent above zero.', confirmed: true, sampleType: 'First morning' },
      { day: 13, date: '2026-10-17', time: '07:00', protein: 15, specificGravity: 1.022, pH: 5.9, glucose: 30, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.5, bilirubin: 0, bleCgmGlucose: 134, bleBpSystolic: 134, bleBpDiastolic: 86, bleHeartRate: 76, bleSpo2: 97, bleHydration: 53.0, notes: 'Morning fasting glucose confirmed.', confirmed: true, sampleType: 'First morning' },
      { day: 15, date: '2026-10-19', time: '06:50', protein: 16, specificGravity: 1.024, pH: 5.7, glucose: 45, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 142, bleBpSystolic: 136, bleBpDiastolic: 87, bleHeartRate: 77, bleSpo2: 98, bleHydration: 52.6, notes: 'Baseline corridor breached on glucose.', confirmed: true, flagged: true, deviationReason: 'Persistent upward glucose drift (45 mg/dL across 4 consecutive logs)', sampleType: 'First morning' },
      { day: 17, date: '2026-10-21', time: '07:12', protein: 18, specificGravity: 1.023, pH: 5.8, glucose: 60, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 155, bleBpSystolic: 137, bleBpDiastolic: 88, bleHeartRate: 78, bleSpo2: 97, bleHydration: 52.4, notes: 'Protein and glucose concurrent elevation.', confirmed: true, flagged: true, deviationReason: 'Protein reaching 18 mg/dL + Glucose 60 mg/dL', sampleType: 'First morning' },
      { day: 19, date: '2026-10-23', time: '07:05', protein: 20, specificGravity: 1.025, pH: 5.7, glucose: 75, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.5, bilirubin: 0, bleCgmGlucose: 164, bleBpSystolic: 139, bleBpDiastolic: 89, bleHeartRate: 79, bleSpo2: 96, bleHydration: 52.0, notes: 'Continuing drift. Diet diary updated.', confirmed: true, flagged: true, sampleType: 'First morning' },
      { day: 22, date: '2026-10-26', time: '06:58', protein: 22, specificGravity: 1.024, pH: 5.8, glucose: 80, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.5, bilirubin: 0, bleCgmGlucose: 172, bleBpSystolic: 141, bleBpDiastolic: 90, bleHeartRate: 80, bleSpo2: 97, bleHydration: 51.8, notes: 'Persistent metabolic trend.', confirmed: true, flagged: true, sampleType: 'First morning' },
      { day: 24, date: '2026-10-28', time: '07:00', protein: 21, specificGravity: 1.023, pH: 5.7, glucose: 85, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 176, bleBpSystolic: 140, bleBpDiastolic: 89, bleHeartRate: 81, bleSpo2: 97, bleHydration: 51.5, notes: 'Consistent 85 mg/dL glucose.', confirmed: true, flagged: true, sampleType: 'First morning' },
      { day: 26, date: '2026-10-30', time: '07:15', protein: 23, specificGravity: 1.024, pH: 5.8, glucose: 90, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.5, bilirubin: 0, bleCgmGlucose: 181, bleBpSystolic: 142, bleBpDiastolic: 91, bleHeartRate: 82, bleSpo2: 96, bleHydration: 51.2, notes: 'Clinician summary generated.', confirmed: true, flagged: true, sampleType: 'First morning' },
      { day: 28, date: '2026-11-01', time: '07:00', protein: 22, specificGravity: 1.023, pH: 5.7, glucose: 95, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.5, bilirubin: 0, bleCgmGlucose: 184, bleBpSystolic: 143, bleBpDiastolic: 91, bleHeartRate: 82, bleSpo2: 97, bleHydration: 51.0, notes: 'Scheduled physician consult.', confirmed: true, flagged: true, sampleType: 'First morning' },
      { day: 30, date: '2026-11-03', time: '06:45', protein: 24, specificGravity: 1.025, pH: 5.8, glucose: 100, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.5, bilirubin: 0, bleCgmGlucose: 188, bleBpSystolic: 144, bleBpDiastolic: 92, bleHeartRate: 83, bleSpo2: 96, bleHydration: 50.8, notes: 'Ready for doctor review with 30-day timeline.', confirmed: true, flagged: true, sampleType: 'First morning' },
    ]
  },
  {
    id: 'david',
    name: 'David Chen',
    age: 42,
    gender: 'Male',
    patientId: 'BT-7741',
    initials: 'DC',
    profileType: 'Nephrolithiasis (Stone Prevention) Protocol',
    clinicalStory: 'Monitors urinary pH and Specific Gravity longitudinally to prevent calcium oxalate and uric acid crystallization following previous lithotripsy.',
    baselineReadingsCount: 15,
    isBaselineEstablished: true,
    baselines: {
      protein: { normalCorridor: '4.5 ± 0.8 mg/dL' },
      specificGravity: { normalCorridor: '1.015 ± 0.002 (Dilute Target)' },
      pH: { normalCorridor: '6.5 ± 0.2 (Therapeutic Goal)' },
      glucose: { normalCorridor: '0.0 mg/dL' },
      ketones: { normalCorridor: '0.0 mg/dL' }
    },
    history: [
      { day: 1, date: '2026-10-05', time: '07:30', protein: 4, specificGravity: 1.026, pH: 5.3, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.5, bilirubin: 0, bleCgmGlucose: 89, bleBpSystolic: 122, bleBpDiastolic: 80, bleHeartRate: 64, bleSpo2: 99, bleHydration: 52.8, notes: 'High urine acidity (5.3) and density. Stone recurrence risk.', confirmed: true, flagged: true, deviationReason: 'pH <5.5 with high concentration increases uric acid stone precipitation risk', sampleType: 'First morning' },
      { day: 3, date: '2026-10-07', time: '07:20', protein: 5, specificGravity: 1.022, pH: 5.7, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 91, bleBpSystolic: 120, bleBpDiastolic: 79, bleHeartRate: 63, bleSpo2: 98, bleHydration: 54.5, notes: 'Added lemon water & citrate protocol.', confirmed: true, sampleType: 'First morning' },
      { day: 5, date: '2026-10-09', time: '07:40', protein: 4, specificGravity: 1.018, pH: 6.2, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 90, bleBpSystolic: 119, bleBpDiastolic: 78, bleHeartRate: 62, bleSpo2: 99, bleHydration: 56.2, notes: 'pH entering target therapeutic zone (6.2-6.8).', confirmed: true, sampleType: 'First morning' },
      { day: 7, date: '2026-10-11', time: '08:00', protein: 5, specificGravity: 1.015, pH: 6.5, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 93, bleBpSystolic: 118, bleBpDiastolic: 77, bleHeartRate: 61, bleSpo2: 99, bleHydration: 58.6, notes: 'Hydration 3L/day achieved. SG 1.015 optimal.', confirmed: true, sampleType: 'First morning' },
      { day: 9, date: '2026-10-13', time: '07:15', protein: 4, specificGravity: 1.014, pH: 6.4, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 89, bleBpSystolic: 117, bleBpDiastolic: 76, bleHeartRate: 60, bleSpo2: 99, bleHydration: 59.1, notes: 'Optimal urine dilution.', confirmed: true, sampleType: 'First morning' },
      { day: 11, date: '2026-10-15', time: '07:30', protein: 5, specificGravity: 1.016, pH: 6.6, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.5, bilirubin: 0, bleCgmGlucose: 92, bleBpSystolic: 119, bleBpDiastolic: 78, bleHeartRate: 63, bleSpo2: 98, bleHydration: 58.4, notes: 'Target pH maintained.', confirmed: true, sampleType: 'First morning' },
      { day: 13, date: '2026-10-17', time: '07:25', protein: 4, specificGravity: 1.015, pH: 6.5, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 91, bleBpSystolic: 118, bleBpDiastolic: 77, bleHeartRate: 62, bleSpo2: 99, bleHydration: 58.7, notes: 'Hydration tracking on point.', confirmed: true, sampleType: 'First morning' },
      { day: 15, date: '2026-10-19', time: '07:10', protein: 5, specificGravity: 1.015, pH: 6.5, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 90, bleBpSystolic: 118, bleBpDiastolic: 77, bleHeartRate: 61, bleSpo2: 99, bleHydration: 58.9, notes: 'Baseline target firmly established.', confirmed: true, sampleType: 'First morning' },
      { day: 17, date: '2026-10-21', time: '07:20', protein: 4, specificGravity: 1.016, pH: 6.4, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 94, bleBpSystolic: 120, bleBpDiastolic: 78, bleHeartRate: 63, bleSpo2: 98, bleHydration: 58.2, notes: 'Routine check.', confirmed: true, sampleType: 'First morning' },
      { day: 19, date: '2026-10-23', time: '07:35', protein: 6, specificGravity: 1.025, pH: 5.5, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.5, bilirubin: 0, bleCgmGlucose: 96, bleBpSystolic: 125, bleBpDiastolic: 81, bleHeartRate: 69, bleSpo2: 98, bleHydration: 53.0, notes: 'Forgot afternoon water bottle. SG spiked to 1.025.', confirmed: true, flagged: true, deviationReason: 'Dehydration dip: SG 1.025, pH dropped to 5.5', sampleType: 'First morning' },
      { day: 22, date: '2026-10-26', time: '07:15', protein: 5, specificGravity: 1.017, pH: 6.3, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 92, bleBpSystolic: 119, bleBpDiastolic: 78, bleHeartRate: 63, bleSpo2: 99, bleHydration: 57.8, notes: 'Re-hydrated promptly. pH restored to 6.3.', confirmed: true, sampleType: 'First morning' },
      { day: 24, date: '2026-10-28', time: '07:25', protein: 4, specificGravity: 1.014, pH: 6.5, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 89, bleBpSystolic: 117, bleBpDiastolic: 76, bleHeartRate: 60, bleSpo2: 99, bleHydration: 59.0, notes: 'Dilution restored.', confirmed: true, sampleType: 'First morning' },
      { day: 26, date: '2026-10-30', time: '07:15', protein: 5, specificGravity: 1.015, pH: 6.6, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 91, bleBpSystolic: 118, bleBpDiastolic: 77, bleHeartRate: 61, bleSpo2: 99, bleHydration: 58.8, notes: 'Stable.', confirmed: true, sampleType: 'First morning' },
      { day: 28, date: '2026-11-01', time: '07:40', protein: 4, specificGravity: 1.015, pH: 6.5, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 90, bleBpSystolic: 118, bleBpDiastolic: 77, bleHeartRate: 61, bleSpo2: 99, bleHydration: 59.2, notes: 'Hydration goal achieved 7 days in a row.', confirmed: true, sampleType: 'First morning' },
      { day: 30, date: '2026-11-03', time: '07:15', protein: 4, specificGravity: 1.014, pH: 6.6, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, urobilinogen: 0.4, bilirubin: 0, bleCgmGlucose: 91, bleBpSystolic: 117, bleBpDiastolic: 76, bleHeartRate: 60, bleSpo2: 99, bleHydration: 59.4, notes: 'Current day. Kidney stone prevention corridor intact.', confirmed: true, sampleType: 'First morning' },
    ]
  }
];

// Default history pointing to Arjun Patel's dataset
export const SAMPLE_30_DAY_HISTORY = PATIENT_PERSONAS[0].history;

// ============================================================================
// 3. Interactive Camera Strip Simulator Presets (PDF Section 5, 7 & 10)
// ============================================================================

export const SIMULATOR_PRESETS = [
  {
    id: 'normal-baseline',
    label: 'Standard Baseline Reading',
    description: 'Clean morning reading matching the user’s established home trajectory.',
    stripImageName: 'baseline-strip',
    readings: {
      protein: 5,
      specificGravity: 1.018,
      pH: 6.4,
      glucose: 0,
      leukocytes: 0,
      ketones: 0,
      nitrite: 0,
      blood: 0,
      urobilinogen: 0.4,
      bilirubin: 0
    },
    lightingQuality: 'Optimal (540 Lux)',
    luxValue: 540,
    tiltAngle: '0.4°',
    confidenceScore: 99.2,
    contextTag: 'Routine Morning'
  },
  {
    id: 'protein-spike',
    label: 'Illustrative Protein Elevation (Day 22)',
    description: 'Recreates the transient protein jump after intense exercise and dehydration.',
    stripImageName: 'elevated-protein-strip',
    readings: {
      protein: 32,
      specificGravity: 1.028,
      pH: 6.1,
      glucose: 0,
      leukocytes: 0,
      ketones: 10,
      nitrite: 0,
      blood: 0,
      urobilinogen: 0.6,
      bilirubin: 0
    },
    lightingQuality: 'Good (480 Lux)',
    luxValue: 480,
    tiltAngle: '1.1°',
    confidenceScore: 97.8,
    contextTag: 'Post-Workout + Mild Dehydration'
  },
  {
    id: 'fasting-ketones',
    label: 'Intermittent Fasting Shift',
    description: 'Mild ketone appearance with slight alkaline morning pH shift.',
    stripImageName: 'ketone-shift-strip',
    readings: {
      protein: 6,
      specificGravity: 1.015,
      pH: 7.2,
      glucose: 0,
      leukocytes: 0,
      ketones: 40,
      nitrite: 0,
      blood: 0,
      urobilinogen: 0.4,
      bilirubin: 0
    },
    lightingQuality: 'Optimal (510 Lux)',
    luxValue: 510,
    tiltAngle: '0.8°',
    confidenceScore: 98.6,
    contextTag: '18h Fasting'
  },
  {
    id: 'subtle-drift',
    label: 'Glycemic Drift Test (Trace Glucose & Protein)',
    description: 'Detects early trace glucose and microprotein drift as seen in prediabetes.',
    stripImageName: 'glycemic-drift-strip',
    readings: {
      protein: 20,
      specificGravity: 1.024,
      pH: 5.8,
      glucose: 75,
      leukocytes: 0,
      ketones: 0,
      nitrite: 0,
      blood: 0,
      urobilinogen: 0.5,
      bilirubin: 0
    },
    lightingQuality: 'Optimal (530 Lux)',
    luxValue: 530,
    tiltAngle: '0.5°',
    confidenceScore: 98.1,
    contextTag: 'Morning Fasting Check'
  }
];

// ============================================================================
// 4. Grounded Gemini AI Presets (PDF Section 6, 8, & 10)
// ============================================================================

export const GEMINI_PROMPT_PRESETS = [
  {
    id: 'explain-day-22',
    title: 'Explain the Day 22 Protein Shift',
    prompt: 'Can you explain why my protein was flagged on Day 22 and what it means?',
    response: {
      facts: 'On Day 22 (2026-10-26 at 07:15), your urine test registered Protein at 32 mg/dL (+ 1+), alongside a Specific Gravity of 1.028 and trace Ketones (10 mg/dL). Your established personal baseline for protein across previous sessions was 5.2 ± 1.1 mg/dL.',
      context: 'This represents a +3.8 standard deviation change above your baseline. The co-occurrence of elevated specific gravity (1.028) indicates concentrated urine, and your notes mention strenuous cross-training the prior evening. Intense muscular exertion and fluid loss are frequent benign causes of transient proteinuria.',
      limitations: 'Test strips have inherent colorimetric reading tolerances (±1 color block) and reflect urine concentration rather than 24-hour total protein excretion. This reading is NOT a medical diagnosis of renal pathology or glomerular disease.',
      recommendation: 'Your follow-up readings on Day 24 (18 mg/dL) and Day 26 (8 mg/dL) show progressive resolution toward your usual baseline. If protein elevation persists above 30 mg/dL across three consecutive well-hydrated morning readings, or if you experience lower back discomfort, edema, or foamy urine, please share this record with your clinician.'
    }
  },
  {
    id: 'baseline-summary',
    title: 'Summarize My 30-Day Health Trajectory',
    prompt: 'Summarize my overall 30-day baseline and whether my metrics are stable.',
    response: {
      facts: 'Across 15 confirmed test sessions over 30 days, 14 readings fell securely inside your personalized reference corridor. Your baseline parameters are: Mean pH 6.41 (stable), Mean Specific Gravity 1.019 (healthy hydration curve), Glucose Negative (100% stable), Leukocytes Negative (100% stable).',
      context: 'A single transient deviation occurred on Day 22, which fully resolved within 72 hours. Your personal trajectory demonstrates high physiological homeostasis and consistent morning collection adherence.',
      limitations: 'Urinalysis represents filtered metabolic byproducts over recent hours. It does not replace comprehensive blood chemistry, lipid panels, or clinical physical exams.',
      recommendation: 'Continue bi-weekly routine recordings. Your trajectory is currently well-characterized with high baseline confidence.'
    }
  },
  {
    id: 'doctor-prep',
    title: 'Draft Clinician Appointment Notes',
    prompt: 'Draft concise talking points for my upcoming appointment with my doctor.',
    response: {
      facts: 'Summary period: 30 days (15 sessions). Test Strip Model: Siemens Multistix 10SG equivalent. Confirmed baseline protein: 5.2 mg/dL. Peak recorded protein: 32 mg/dL on Day 22, normalized to 5 mg/dL by Day 28.',
      context: 'Doctor talking point: "I have maintained an encrypted longitudinal urine chemistry log. I noticed an isolated protein spike on Oct 26 corresponding to strenuous exercise, which resolved promptly. I wanted to verify whether any formal spot urine albumin-to-creatinine ratio (uACR) is warranted at my annual checkup."',
      limitations: 'Longitudinal home data is supplementary patient-generated health data (PGHD) intended to inform clinical dialogue, not self-triage.',
      recommendation: 'Export the PDF Clinician Summary below to provide your doctor with the timestamped chronological data table.'
    }
  },
  {
    id: 'biological-factors',
    title: 'What Factors Cause Changes Besides Illness?',
    prompt: 'What everyday lifestyle factors can shift these numbers without any illness being present?',
    response: {
      facts: 'Urine chemistry responds dynamically to acute physiological and environmental changes. A deviation from your baseline does not equate to illness.',
      context: 'Major non-disease confounders include: (1) Hydration timing: low fluid intake concentrates all metabolites, raising Specific Gravity and apparent protein density; (2) Exercise: high-intensity workouts cause temporary glomerular permeability and transient microscopic hematuria; (3) Diet: citrus or alkaline mineral waters raise pH, while high animal protein drops pH; (4) Menstrual cycle or hygiene: pad contamination can trigger leukocyte or trace blood flags.',
      limitations: 'BioTrajectory explicitly contextualizes each reading with sample timing and notes to prevent false alarm.',
      recommendation: 'Always record contextual notes (e.g. hydration, workout, meal timing) when logging readings.'
    }
  }
];

// ============================================================================
// 5. 6-Stage System Architecture & Live Data Pipeline (PDF Section 6 & 9)
// ============================================================================

export const ARCHITECTURE_PIPELINE_STAGES = [
  {
    stage: '01',
    layer: 'Input Layer',
    title: 'Optical Capture & Guided Entry',
    description: 'Captures reagent test strip via smartphone camera or manual keyboard entry. Real-time sensors enforce adequate ambient lux (>300 lux) and tilt limits (<5°).',
    component: 'Mobile Camera / Manual Entry Modal',
    algorithm: 'Lux sensor polling + Accelerometer orientation filter',
    deterministicRule: 'Rejects images with specular glare or insufficient lux before color estimation.',
    samplePayload: {
      captureType: 'guided_camera_feed',
      ambientLux: 520,
      tiltDegrees: 0.4,
      reactionTimerSec: 60,
      testLot: 'MS-10SG-LOT-702'
    }
  },
  {
    stage: '02',
    layer: 'Measurement Layer',
    title: 'OpenCV Chromatic Calibration & Pad Extraction',
    description: 'Normalizes raw RGB image against a standard white-balance reference card, converting to CIE L*a*b* color space for invariant pad segmentation.',
    component: 'OpenCV / WebAssembly Module',
    algorithm: 'ΔE* (CIE 1976 / 2000) distance matching against manufacturer color lookup tables',
    deterministicRule: 'Generative AI is strictly forbidden from reading raw strip colors or calculating numbers.',
    samplePayload: {
      calibratedRGB: [167, 205, 154],
      colorMatchPad: 'Protein',
      estimatedValue: 30,
      matchDeltaE: 1.84,
      readingConfidence: 0.978
    }
  },
  {
    stage: '03',
    layer: 'Safety Audit Layer',
    title: 'Mandatory User Audit & Confirmation',
    description: 'Presents estimated values alongside physical color swatches for mandatory user review, adjustment, and lifestyle context annotation.',
    component: 'Result Confirmation Modal',
    algorithm: 'User approval gatekeeper: save action blocked until explicit confirmation event',
    deterministicRule: 'Zero automated background saves. The user must review every estimated value.',
    samplePayload: {
      userConfirmed: true,
      overriddenByUser: false,
      userContextNotes: 'Evening cross-training session; low fluid intake.',
      clientTimestamp: '2026-10-26T07:15:00Z'
    }
  },
  {
    stage: '04',
    layer: 'Data Layer',
    title: 'Zero-Knowledge Encrypted Health Ledger',
    description: 'Persists timestamped biomarker records with cryptographic verification and test lot metadata. Raw photos are discarded immediately for privacy.',
    component: 'PostgreSQL / AES-256 Client Vault',
    algorithm: 'SHA-256 record hashing + AES-GCM 256-bit encryption at rest',
    deterministicRule: 'No health data monetization, third-party sharing, or advertising profiling.',
    samplePayload: {
      recordHash: 'sha256-a9f14d8c2b74...',
      encryptedPayload: 'aes256:d8c03ba88219...',
      retainedRawImage: false,
      userConsentActive: true
    }
  },
  {
    stage: '05',
    layer: 'Trajectory Layer',
    title: 'Longitudinal Baseline & Rolling Median Engine',
    description: 'Computes personal baselines using non-parametric rolling medians and interquartile deviation corridors (IQR), checking for 3-day persistence.',
    component: 'Python / Pandas Deterministic Trend Engine',
    algorithm: 'Rolling Median Corridor: Median ± 1.5 * IQR. Persistence: count(Δ > 2.5σ) >= 3',
    deterministicRule: 'Avoids misleading composite wellness scores. Treats each biomarker independently.',
    samplePayload: {
      biomarker: 'protein',
      personalRollingMedian: 5.2,
      iqrBand: [0, 15],
      currentReading: 32,
      sigmaDelta: 3.8,
      flaggedForReview: true,
      persistenceCount: 1,
      recommendationLevel: 'lifestyle_context_watch'
    }
  },
  {
    stage: '06',
    layer: 'AI Communication Layer',
    title: 'Grounded Gemini AI & Clinician Synthesis',
    description: 'Translates confirmed structured tables into plain language, explains physiological confounders (hydration/exercise), and formats doctor reports.',
    component: 'Gemini 3.8 Flash (High) via SDK',
    algorithm: 'Strict Few-Shot System Prompt with JSON Schema and zero-diagnosis negative constraints',
    deterministicRule: 'Gemini receives only confirmed data. Must state limitations and defer to clinicians.',
    samplePayload: {
      model: 'gemini-3.8-flash',
      groundedFactsSupplied: ['Protein: 32 mg/dL', 'SG: 1.028', 'Baseline: 5.2 mg/dL', 'Exercise Note'],
      diagnosisAttempted: false,
      clinicianSummaryGenerated: true
    }
  }
];

// ============================================================================
// 6. 7-Risk Clinical Safety Matrix (PDF Section 12, 13 & 17)
// ============================================================================

export const CLINICAL_RISK_MATRIX = [
  {
    id: 'camera-error',
    risk: 'Incorrect camera reading',
    why: 'Could create misleading trends and unnecessary patient panic.',
    mitigation: 'Controlled camera capture guide, ambient lux checks (>300 lux), tilt calibration, and mandatory user confirmation.',
    simulationTitle: 'Simulate Poor Lighting (<250 Lux)',
    simulatedBehavior: 'Camera viewfinder dims, red warning badge activates: "Low light hazard: colorimetry error risk ±1 color block. Capture disabled until light >300 lux."'
  },
  {
    id: 'false-alarm',
    risk: 'False reassurance or alarm',
    why: 'May delay critical medical care or cause acute anxiety.',
    mitigation: 'Cautious non-diagnostic language, clinical expert review of thresholds, and explicit "symptoms-first" priority banner.',
    simulationTitle: 'Simulate Severe Symptom Priority',
    simulatedBehavior: 'System displays prominent clinical advisory: "Symptoms always override app charts. If experiencing severe pain, fever, or bleeding, contact emergency care immediately."'
  },
  {
    id: 'insufficient-history',
    risk: 'Insufficient history',
    why: 'Baseline formed on 1–2 readings would be statistically noisy.',
    mitigation: 'System enforces minimum 10-reading threshold; displays "Baseline Pending" status and suppresses premature variance flags.',
    simulationTitle: 'Simulate Patient with Only 2 Readings',
    simulatedBehavior: 'Chart displays tentative dashed band with amber badge: "Baseline Pending (2/10 readings). Deviation flags suspended to prevent premature false alarms."'
  },
  {
    id: 'biological-variability',
    risk: 'Biological variability',
    why: 'Readings change naturally for non-disease reasons (exercise, dehydration).',
    mitigation: 'Contextual capture of timing, workouts, and hydration; checks Specific Gravity correlation before raising persistent flags.',
    simulationTitle: 'Simulate Day 22 Post-Workout Spike',
    simulatedBehavior: 'System correlates high Protein (32 mg/dL) with elevated Specific Gravity (1.028) and tags it "Transient exercise/dehydration variance; re-check in 48 hours."'
  },
  {
    id: 'privacy-breach',
    risk: 'Privacy breach',
    why: 'Biochemical urine data is deeply sensitive health telemetry.',
    mitigation: 'Data minimization, AES-256 local encrypted profile, raw images discarded immediately, zero health data monetization.',
    simulationTitle: 'Simulate Data Export & One-Click Purge',
    simulatedBehavior: 'Allows instant cryptographic download of patient ledger or permanent local zero-trace wipe.'
  },
  {
    id: 'ai-hallucination',
    risk: 'AI hallucination',
    why: 'Generative models might invent unsupported diagnostic conclusions.',
    mitigation: 'Gemini is fed only confirmed structured tables; strict system prompts prohibit diagnosis, treatment plans, or emergency triage.',
    simulationTitle: 'Simulate Gemini Guardrail Verification',
    simulatedBehavior: 'Inspects live Gemini prompt constraints: shows that any attempt to diagnose is blocked and converted into a clinician referral.'
  },
  {
    id: 'regulatory-complexity',
    risk: 'Regulatory complexity',
    why: 'Medical claims trigger Class II/III medical device obligations.',
    mitigation: 'Strictly positioned as a wellness and longitudinal personal tracking tool; non-diagnostic disclaimers on every view.',
    simulationTitle: 'Inspect Regulatory Boundary Disclaimers',
    simulatedBehavior: 'Highlights non-diagnostic disclaimers and explains the 5-phase clinical validation pathway before any diagnostic claims.'
  }
];

// ============================================================================
// 7. Judge Q&A and Key Messages (PDF Section 21 & 22)
// ============================================================================

export const JUDGE_QUESTIONS = [
  {
    q: 'Is this already available in the market?',
    a: 'Individual components and home urine strips exist commercially. BioTrajectory’s innovation is the integrated personal-trajectory workflow: moving away from isolated one-off snapshot interpretations to personalized longitudinal baselines, grounded AI explanation with explicit boundaries, and doctor-ready synthesis.'
  },
  {
    q: 'How do you ensure optical measurement accuracy across different cameras?',
    a: 'The first MVP relies on mandatory user confirmation. Camera capture is treated as an assistive estimate until validated against reference laboratory standards. Our computer vision pipeline incorporates ambient lux thresholds, white-balance calibration reference markers, and strict image rejection for glare or tilt.'
  },
  {
    q: 'Can AI diagnose disease in BioTrajectory?',
    a: 'Emphatically NO. AI is restricted strictly to an explanation and summarization role. It is provided confirmed structured data, dates, and validated reference facts. It is prohibited from generating diagnoses, prescribing therapies, or claiming predictive certainty.'
  },
  {
    q: 'Why start with urine instead of blood or saliva?',
    a: 'Urinalysis is non-invasive, accessible, repeatable, and has centuries of clinical validation with standardized commercial test strips. It provides immediate multi-organ metabolic signals (kidney filtration, acid-base, hydration, glucose, hepatic metabolites) suitable for longitudinal tracking without needles.'
  },
  {
    q: 'What is the single hardest challenge for this product?',
    a: 'Reliable measurement reproducibility across varied phone camera hardware, ambient lighting conditions, and user reaction timing—followed by clinical validation and maintaining rock-solid privacy trust without monetizing health records.'
  }
];

export const GLOSSARY_TERMS = [
  { term: 'Biomarker', definition: 'A measurable biological characteristic that provides objective information about biological processes, hydration, or renal filtration.' },
  { term: 'Personal Baseline', definition: 'An individualized statistical estimate of a person’s usual pattern formed only after sufficient repeated measurements (e.g. 10+ readings).' },
  { term: 'Trajectory', definition: 'A time-based chronological view showing how biological measurements shift relative to an individual’s own history over days, weeks, and months.' },
  { term: 'Deviation', definition: 'A statistically meaningful difference from an established baseline; it is not automatically a disease signal.' },
  { term: 'False Positive', definition: 'An alert triggered when no clinically significant pathology is present, mitigated in BioTrajectory via cautious language and persistence checks.' },
  { term: 'Clinical Validation', definition: 'Documented evidence that a diagnostic or monitoring tool performs safely, repeatably, and appropriately for its intended population.' }
];

// ============================================================================
// 8. Presentation Information
// ============================================================================

export const PRESENTATION_INFO = {
  organization: 'BioTrajectory Clinical Initiative',
  initiative: 'Longitudinal Preventive Health Program',
  platformType: 'PGHD Trajectory Intelligence',
  projectName: 'BioTrajectory',
  tagline: 'Healthcare that understands where your health is heading',
  secondaryTagline: 'Others measure your health. We track where it is going.',
  philosophies: [
    'Marker-by-marker trends, never one misleading health score.',
    'No automated result is a diagnosis. Every reading is user-confirmed, and every AI summary links back to the data.',
    'The core stack is open and verifiable. Anyone can inspect, extend, and audit.'
  ],
  clinicalAdvisors: ['Preventive Medicine Working Group', 'Clinical Nephrology Advisory Board'],
  links: {
    platform: '#live-prototype',
    contact: 'mailto:contact@biotrajectory.health'
  }
};

export const PDF_PROBLEM_SECTION = {
  headline: 'Healthcare starts when symptoms do.',
  issues: [
    {
      id: 'snapshots',
      title: 'Snapshots, not stories',
      description: 'One test shows one moment. Slow changes between visits go unseen.',
      icon: 'Calendar',
      badScenario: 'Single clinic test taken once a year gives an isolated data point without slope or context.'
    },
    {
      id: 'scattered',
      title: 'Scattered records',
      description: 'Tests done in different labs sit in silos, never connected into a continuous narrative.',
      icon: 'FileSpreadsheet',
      badScenario: 'Patient carries loose paper slips; clinician has 7 minutes to piece together 3 years of numbers.'
    },
    {
      id: 'unexplained',
      title: 'Numbers without meaning',
      description: 'Patients see "0.3 mg/dL" or "1.025" and Google symptoms, spiraling into unnecessary anxiety.',
      icon: 'HelpCircle',
      badScenario: 'Isolated reading of trace protein triggers immediate panic about kidney failure.'
    }
  ]
};

export const FOUR_LAYERS = [
  {
    number: '01',
    name: 'Measurement Layer',
    headline: 'High-Precision Optical & Manual Capture',
    description: 'Reads commercial urine test strips using smartphone camera optical correction algorithms or direct manual entry. Colorimetric calibration matrices correct for ambient lux, white balance, and chromatic distortion.',
    features: ['Guided framing & angle reticle', 'Lighting sufficiency check (>300 lux)', '60-second chemical reaction timer', 'Mandatory patient review & edit']
  },
  {
    number: '02',
    name: 'Context Layer',
    headline: 'Biophysical Environment & Timing',
    description: 'Captures the vital circumstances behind every biological reading: first morning void vs postprandial, hydration state, recent exercise load, and test lot/expiry metadata.',
    features: ['Circadian timing tags', 'Hydration index correlation', 'Exercise & dietary notes', 'Lot # and expiry tracking']
  },
  {
    number: '03',
    name: 'Personal Trajectory Layer',
    headline: 'Longitudinal Baseline & Deviation Engine',
    description: 'Constructs an individualized baseline over repeated sessions rather than relying solely on wide population reference brackets. Employs rolling medians and interquartile deviation bands.',
    features: ['Minimum 10-point baseline curve', 'Rolling variance corridors (IQR)', 'Multi-day persistence detection', 'No arbitrary composite wellness scores']
  },
  {
    number: '04',
    name: 'AI Communication Layer',
    headline: 'Cautious, Grounded Gemini Explanations',
    description: 'Translates complex chemical trajectories into plain, reassuring English and prepares doctor-ready clinical summaries. Strictly constrained by clinical guardrails—never diagnoses or prescribes.',
    features: ['Grounded solely in verified records', 'Transparent uncertainty disclosures', 'Clinical handover PDF drafting', 'Symptom-first escalation protocol']
  }
];

export const ROADMAP_PHASES = [
  {
    phase: 'Phase 1',
    title: 'Concept & Clinical Requirements',
    status: 'Completed',
    date: 'Q3 2026',
    deliverables: [
      'Commercial 10-parameter urinalysis strip selection and validation criteria',
      'Clinical consultation on non-diagnostic boundaries and escalation rules',
      'Consent, privacy, and zero-monetization ethical charter',
      'Safety language and patient disclosure framework'
    ]
  },
  {
    phase: 'Phase 2',
    title: 'Software MVP & Grounded AI',
    status: 'Current Prototype',
    date: 'Q4 2026',
    deliverables: [
      'Encrypted local profile and manual measurement entry system',
      'Interactive longitudinal trajectory dashboard with baseline corridors',
      'Illustrative statistical deviation detection engine',
      'Gemini AI grounded explanation layer and clinician exportable PDF brief'
    ]
  },
  {
    phase: 'Phase 3',
    title: 'Camera-Assisted Computer Vision',
    status: 'Next Stage',
    date: 'Q1-Q2 2027',
    deliverables: [
      'Controlled phone camera capture guide with real-time lux/tilt feedback',
      'Standardized color calibration card with OpenCV color space conversion',
      'Extensive testing across multiple phone cameras, lighting, and strip brands',
      'Comparative accuracy benchmarks against trained laboratory human readings'
    ]
  },
  {
    phase: 'Phase 4',
    title: 'Clinical Evaluation & Usability',
    status: 'Planned',
    date: 'Q3-Q4 2027',
    deliverables: [
      'Formal usability testing across varied digital literacy cohorts',
      'Evaluation of false-positive anxiety mitigation and comprehension rates',
      'Multidisciplinary clinical expert panel review of alert thresholds',
      'Ethics committee submission for prospective observational study'
    ]
  },
  {
    phase: 'Phase 5',
    title: 'Responsible Expansion & Ecosystem',
    status: 'Future Vision',
    date: '2028+',
    deliverables: [
      'Wearable integration (resting HR, HRV, sleep stages, continuous hydration)',
      'Clinician portal with patient-authorized cryptographic data sharing',
      'Offline-first and multilingual support for low-bandwidth community centers',
      'Exploration of hygienic smart bathroom and automated fixture integrations'
    ]
  }
];

export const PDF_TECH_STACK = [
  {
    category: 'FRONTEND',
    title: 'React 19 + Tailwind CSS',
    description: 'Web and mobile interface',
    icon: 'Layers',
    role: 'Responsive luxury patient portal and real-time SVG trajectory visualizations.'
  },
  {
    category: 'BACKEND',
    title: 'Python + FastAPI',
    description: 'Application and trend APIs',
    icon: 'Server',
    role: 'High-speed asynchronous endpoints for processing measurements and managing user profiles.'
  },
  {
    category: 'DATABASE',
    title: 'PostgreSQL',
    description: 'Structured readings; images kept only if needed',
    icon: 'Database',
    role: 'Relational storage for timestamped biochemical records; image discarding for privacy.'
  },
  {
    category: 'COMPUTER VISION',
    title: 'OpenCV',
    description: 'Image quality, colour conversion, strip regions',
    icon: 'Camera',
    role: 'Real-time color correction, ambient illumination checks, and colorimetric pad localization.'
  },
  {
    category: 'ANALYTICS',
    title: 'pandas + transparent rules',
    description: 'Baselines, persistence checks, variability',
    icon: 'Cpu',
    role: 'Deterministic mathematical engine computing rolling medians and multi-day persistence checks.'
  },
  {
    category: 'AI',
    title: 'Gemini 3.8 Flash (High)',
    description: 'Grounded explanations and clinician summaries',
    icon: 'Sparkles',
    role: 'Synthesizes non-diagnostic explanations and formats doctor-ready appointment notes.'
  },
  {
    category: 'CHARTS',
    title: 'Longitudinal Trajectory Engine',
    description: 'Per-marker trend view',
    icon: 'LineChart',
    role: 'High-fidelity baseline bands, interactive tooltips, and longitudinal trajectory charts.'
  },
  {
    category: 'DEPLOYMENT',
    title: 'Secure Cloud Demo',
    description: 'On-device processing explored for privacy',
    icon: 'Cloud',
    role: 'Zero-knowledge biometric isolation with client-side inference roadmap.'
  }
];

export const PDF_AUDIENCES = [
  {
    id: 'individuals',
    title: 'Individuals and families',
    description: 'An organised view of repeated measurements between check-ups.',
    metric: 'Peace of Mind',
    benefit: 'Replaces panic over isolated spikes with contextualized history.'
  },
  {
    id: 'rural',
    title: 'Rural and underserved communities',
    description: 'Pharmacies and health centres as future low-cost monitoring points.',
    metric: 'Accessible Screening',
    benefit: 'Low-cost commercial test strips combined with ubiquitous smartphones.'
  },
  {
    id: 'doctors',
    title: 'Doctors and clinicians',
    description: 'A consented timeline instead of only the latest result.',
    metric: 'Clinical Context',
    benefit: 'Patient-generated longitudinal trends replace single-visit recall bias.'
  },
  {
    id: 'researchers',
    title: 'Health systems and researchers',
    description: 'Better-targeted follow-up. De-identified data only with consent.',
    metric: 'Population Health',
    benefit: 'Early detection patterns in chronic kidney disease and prediabetes.'
  }
];

export const PDF_HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    name: 'Capture',
    summary: 'Guided photo of a supported urine strip, or manual entry.',
    details: 'Viewfinder reticle verifies phone angle and lighting lux (>300 lux) before triggering capture.',
    actionLabel: 'Try Camera Viewfinder'
  },
  {
    step: '02',
    name: 'Confirm',
    summary: 'The app estimates colour pads. You review and correct before saving.',
    details: 'Zero silent automated saves. The user has full agency to inspect color swatches and correct numbers.',
    actionLabel: 'Inspect Swatch Grid'
  },
  {
    step: '03',
    name: 'Store',
    summary: 'Timestamped, encrypted record with test metadata.',
    details: 'Zero-knowledge encrypted local storage with time of day, hydration context, and test strip lot #.',
    actionLabel: 'View Encrypted Record'
  },
  {
    step: '04',
    name: 'Compare',
    summary: 'The trend engine checks new values against your own baseline.',
    details: 'Deterministic pandas rolling median algorithm compares new test against personal corridor, not arbitrary scales.',
    actionLabel: 'Calculate Variance'
  },
  {
    step: '05',
    name: 'Explain',
    summary: 'Graphs and summary describes the change in plain language and states its limits.',
    details: 'Gemini translates statistical variance into clear language, highlighting non-disease factors like exercise.',
    actionLabel: 'Ask Gemini AI'
  },
  {
    step: '06',
    name: 'Share',
    summary: 'A consent-based clinician summary, exported as PDF.',
    details: 'Doctor-ready chronological table and trend graphs generated with patient cryptographic consent.',
    actionLabel: 'Generate Doctor PDF'
  }
];


export const PDF_SOLUTION_STEPS = [
  {
    step: '01',
    title: 'Measurement and context',
    description: 'A test strip is read using a phone camera or manual entry, with timestamp and metadata.',
    badge: 'Hardware & Mobile',
    detail: 'Combines optical image capture, lighting calibration (lux reticle), and optional manual override.'
  },
  {
    step: '02',
    title: 'Personal trajectory',
    description: 'Repeated readings build an individual baseline. Reference ranges show appropriate context.',
    badge: 'Personal Baseline',
    detail: 'Forms rolling baseline after 10+ entries. Never evaluates a point in isolation.'
  },
  {
    step: '03',
    title: 'Pattern review',
    description: 'Transparent rules flag persistent shifts for review. Never a diagnosis.',
    badge: 'Rule-Based Logic',
    detail: 'Monitors statistical deviations over consecutive readings. Rejects single-session noise.'
  },
  {
    step: '04',
    title: 'Explain and share',
    description: 'Gemini explains in plain words. Summaries go to a clinician only with consent.',
    badge: 'Grounded AI & Handover',
    detail: 'Plain-language summaries citing confirmed facts, explicitly stating limits, and generating PDF briefs.'
  }
];

// ============================================================================
// 9. Connected Bluetooth Health Devices (BLE / Web Bluetooth Telemetry)
// ============================================================================

export const BLUETOOTH_DEVICES = [
  {
    id: 'dexcom-cgm',
    name: 'Dexcom G7 Continuous Glucose Monitor',
    shortName: 'Dexcom G7 BLE',
    type: 'CGM',
    category: 'Metabolic & Glycemic Telemetry',
    icon: 'Activity',
    battery: 88,
    signalStrength: -62, // dBm
    status: 'connected',
    bleUuid: '0000181f-0000-1000-8000-00805f9b34fb',
    serviceName: 'Continuous Glucose (0x181F)',
    lastSync: 'Live (Every 5m)',
    activeMetric: 'bleCgmGlucose',
    metricLabel: 'CGM Glucose',
    currentValue: 94,
    unit: 'mg/dL',
    trend: 'stable',
    color: '#f59e0b',
    description: 'Streams interstitial glucose every 5 minutes. Cross-correlates with urinalysis glucose when above renal threshold (~180 mg/dL).'
  },
  {
    id: 'omron-bp',
    name: 'Omron Evolv Wireless Blood Pressure Cuff',
    shortName: 'Omron Evolv BLE',
    type: 'BPM',
    category: 'Hemodynamic & Cardiovascular',
    icon: 'Heart',
    battery: 94,
    signalStrength: -58,
    status: 'connected',
    bleUuid: '00001810-0000-1000-8000-00805f9b34fb',
    serviceName: 'Blood Pressure Service (0x1810)',
    lastSync: 'Today 07:14 AM',
    activeMetric: 'bleBpSystolic',
    metricLabel: 'BP Systolic',
    currentValue: 120,
    secondaryMetric: 'bleBpDiastolic',
    secondaryValue: 78,
    unit: 'mmHg',
    trend: 'optimal',
    color: '#ef4444',
    description: 'Oscillometric wireless cuff. Longitudinal blood pressure trends provide essential hemodynamic context for transient proteinuria spikes.'
  },
  {
    id: 'whoop-strap',
    name: 'WHOOP 4.0 Biometric Wearable',
    shortName: 'WHOOP 4.0 BLE',
    type: 'Wearable',
    category: 'Autonomic & Recovery Tone',
    icon: 'Watch',
    battery: 76,
    signalStrength: -65,
    status: 'connected',
    bleUuid: '0000180d-0000-1000-8000-00805f9b34fb',
    serviceName: 'Heart Rate & HRV (0x180D)',
    lastSync: 'Continuous Live Stream',
    activeMetric: 'bleHeartRate',
    metricLabel: 'Resting Heart Rate',
    currentValue: 62,
    unit: 'bpm',
    trend: 'recovering',
    color: '#10b981',
    description: 'Continuous photoplethysmography (PPG) capturing resting heart rate, recovery strain, and nocturnal autonomic tone.'
  },
  {
    id: 'withings-scale',
    name: 'Withings Body Smart Bioimpedance Scale',
    shortName: 'Withings Body BLE',
    type: 'Scale',
    category: 'Hydration & Body Composition',
    icon: 'Scale',
    battery: 92,
    signalStrength: -71,
    status: 'standby',
    bleUuid: '0000181d-0000-1000-8000-00805f9b34fb',
    serviceName: 'Weight Scale & Impedance (0x181D)',
    lastSync: 'Today 07:10 AM',
    activeMetric: 'bleHydration',
    metricLabel: 'Body Water %',
    currentValue: 58.4,
    unit: '%',
    trend: 'hydrated',
    color: '#06b6d4',
    description: 'Multi-frequency bioimpedance analysis measuring total body water percentage, directly correlating with urine Specific Gravity concentration.'
  }
];

export const BLUETOOTH_METRIC_CONFIGS = {
  bleCgmGlucose: {
    label: 'Bluetooth CGM Blood Glucose',
    shortLabel: 'CGM Glucose',
    unit: 'mg/dL',
    color: '#f59e0b',
    baselineMin: 70,
    baselineMax: 130,
    normalRange: '70 – 130 mg/dL',
    description: 'Continuous interstitial glucose via Bluetooth Low Energy CGM sensor'
  },
  bleBpSystolic: {
    label: 'Bluetooth Blood Pressure (Systolic)',
    shortLabel: 'BP Systolic',
    unit: 'mmHg',
    color: '#ef4444',
    baselineMin: 100,
    baselineMax: 130,
    normalRange: '100 – 130 mmHg',
    description: 'Oscillometric cuff systolic pressure'
  },
  bleHeartRate: {
    label: 'Wearable Resting Heart Rate',
    shortLabel: 'Heart Rate',
    unit: 'bpm',
    color: '#10b981',
    baselineMin: 55,
    baselineMax: 78,
    normalRange: '55 – 78 bpm',
    description: 'Continuous resting pulse rate via wearable PPG'
  },
  bleHydration: {
    label: 'Smart Scale Hydration Percentage',
    shortLabel: 'Body Water %',
    unit: '%',
    color: '#06b6d4',
    baselineMin: 55,
    baselineMax: 62,
    normalRange: '55 – 62 %',
    description: 'Bioimpedance total body water percentage'
  }
};

// ============================================================================
// 10. Multi-Modal Pie & Donut Chart Presets
// ============================================================================

export const PIE_CHART_PRESETS = [
  {
    id: 'time-in-corridor',
    title: 'Time in Baseline Corridor (TIC)',
    subtitle: 'Clinical KPI for Personalized Homeostasis Concordance',
    unit: '% of Logs',
    segments: [
      {
        id: 'homeostasis',
        label: 'In Optimal Corridor',
        value: 78,
        count: '24 Sessions',
        color: '#D5BF86', // Soft Fawn
        textColor: 'text-[#D5BF86]',
        badgeColor: 'bg-[#D5BF86]/20 text-[#3F0D12] border-[#D5BF86]/40',
        description: 'Readings tracking within the patient’s established 10-session rolling IQR baseline corridor.'
      },
      {
        id: 'transient',
        label: 'Transient Physiological Variance',
        value: 16,
        count: '5 Sessions',
        color: '#8D775F', // Faded Copper
        textColor: 'text-[#8D775F]',
        badgeColor: 'bg-[#8D775F]/20 text-[#3F0D12] border-[#8D775F]/40',
        description: 'Benign acute shifts explainable by vigorous exercise, hot climate sweat loss, or dietary buffers.'
      },
      {
        id: 'review-flagged',
        label: 'Clinical Review Flagged Zone',
        value: 6,
        count: '2 Sessions',
        color: '#A71D31', // Ruby Red
        textColor: 'text-[#A71D31]',
        badgeColor: 'bg-[#A71D31]/20 text-[#A71D31] border-[#A71D31]/40',
        description: 'Statistically persistent deviations exceeding +3σ across consecutive tests requiring physician consult.'
      }
    ]
  },
  {
    id: 'data-sources',
    title: 'Multi-Modal Data Ingestion Sources',
    subtitle: 'Distribution of Continuous PGHD Streams Across Modalities',
    unit: '% Data Ingested',
    segments: [
      {
        id: 'urinalysis',
        label: 'Urinalysis Reagent Strip Colorimetry',
        value: 38,
        count: '30 Strip Scans',
        color: '#A71D31', // Ruby Red
        textColor: 'text-[#A71D31]',
        badgeColor: 'bg-[#A71D31]/20 text-[#A71D31] border-[#A71D31]/40',
        description: 'Chemical reagent pads capturing kidney filtration, specific gravity, pH, and metabolic ketones.'
      },
      {
        id: 'cgm',
        label: 'Bluetooth CGM Interstitial Glucose',
        value: 30,
        count: '8,640 Pings',
        color: '#D5BF86', // Soft Fawn
        textColor: 'text-[#D5BF86]',
        badgeColor: 'bg-[#D5BF86]/20 text-[#3F0D12] border-[#D5BF86]/40',
        description: 'Continuous 5-minute BLE telemetry capturing glycemic variability and meal response excursions.'
      },
      {
        id: 'bp',
        label: 'Bluetooth Blood Pressure Cuff',
        value: 18,
        count: '60 Cuff Syncs',
        color: '#3F0D12', // Rich Mahogany
        textColor: 'text-[#3F0D12]',
        badgeColor: 'bg-[#3F0D12]/20 text-[#3F0D12] border-[#3F0D12]/40',
        description: 'Twice-daily oscillometric blood pressure readings tracking systemic hemodynamic pressure.'
      },
      {
        id: 'wearable',
        label: 'Wearable Heart Rate & Autonomic PPG',
        value: 14,
        count: 'Continuous',
        color: '#8D775F', // Faded Copper
        textColor: 'text-[#8D775F]',
        badgeColor: 'bg-[#8D775F]/20 text-[#8D775F] border-[#8D775F]/40',
        description: 'Nocturnal resting heart rate and HRV quantifying physiological exertion and recovery reserve.'
      }
    ]
  },
  {
    id: 'organ-systems',
    title: 'Physiological Systems Monitored',
    subtitle: 'Comprehensive Multi-Organ Homeostasis Concordance',
    unit: '% Biomarker Focus',
    segments: [
      {
        id: 'renal',
        label: 'Renal Glomerular Filtration & Integrity',
        value: 44,
        count: 'PRO • SG • pH',
        color: '#A71D31', // Ruby Red
        textColor: 'text-[#A71D31]',
        badgeColor: 'bg-[#A71D31]/20 text-[#A71D31] border-[#A71D31]/40',
        description: 'Tubular reabsorption, protein clearance, and urinary concentration capacity.'
      },
      {
        id: 'metabolic',
        label: 'Endocrine & Glycemic Homeostasis',
        value: 32,
        count: 'GLU • KET • CGM',
        color: '#D5BF86', // Soft Fawn
        textColor: 'text-[#D5BF86]',
        badgeColor: 'bg-[#D5BF86]/20 text-[#3F0D12] border-[#D5BF86]/40',
        description: 'Insulin sensitivity, carbohydrate turnover, and fasting ketone generation.'
      },
      {
        id: 'cardiovascular',
        label: 'Hemodynamics & Fluid Balance',
        value: 24,
        count: 'BP • HR • Body H2O',
        color: '#3F0D12', // Rich Mahogany
        textColor: 'text-[#3F0D12]',
        badgeColor: 'bg-[#3F0D12]/20 text-[#3F0D12] border-[#3F0D12]/40',
        description: 'Vascular resistance, arterial elasticity, and total extracellular water preservation.'
      }
    ]
  }
];

