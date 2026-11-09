/**
 * BioTrajectory Clinical Vitals Dataset
 * Separate distinct physiological dimensions - NO combined synthetic score.
 */

export const VITALS_BASELINES = {
  systolic: {
    label: 'Systolic Blood Pressure',
    unit: 'mmHg',
    normalMax: 120,
    elevatedMax: 129,
    stage1Max: 139,
    description: 'Arterial pressure when heart beats.'
  },
  diastolic: {
    label: 'Diastolic Blood Pressure',
    unit: 'mmHg',
    normalMax: 80,
    stage1Max: 89,
    description: 'Arterial pressure between heart beats.'
  },
  steps: {
    label: 'Daily Walking Steps',
    unit: 'steps',
    target: 8000,
    optimal: 10000,
    description: 'Cumulative pedometer count.'
  },
  distance: {
    label: 'Walking Distance',
    unit: 'km',
    target: 6.0,
    description: 'Daily estimated ambulation distance.'
  },
  exercise: {
    label: 'Exercise Duration',
    unit: 'mins',
    target: 30,
    optimal: 45,
    description: 'Moderate-to-vigorous physical activity.'
  },
  urineProtein: {
    label: 'Urine Protein (Albumin)',
    unit: 'mg/dL',
    normal: 'Negative (<15)',
    description: 'Glomerular barrier permeability marker.'
  },
  urineSG: {
    label: 'Specific Gravity',
    unit: 'SG',
    normalMin: 1.010,
    normalMax: 1.025,
    description: 'Renal concentration & hydration index.'
  }
};

export const SAMPLE_DAILY_VITALS_7D = [
  {
    date: '2026-11-01',
    dayName: 'Sun',
    systolic: 122,
    diastolic: 79,
    pulse: 68,
    steps: 9240,
    distance: 6.4,
    exerciseMins: 45,
    urineProteinMg: 0,
    urineSG: 1.018,
    urinePH: 6.5,
    notes: 'Morning brisk outdoor walk, hydrated well'
  },
  {
    date: '2026-11-02',
    dayName: 'Mon',
    systolic: 128,
    diastolic: 82,
    pulse: 74,
    steps: 7650,
    distance: 5.3,
    exerciseMins: 30,
    urineProteinMg: 0,
    urineSG: 1.022,
    urinePH: 6.2,
    notes: 'Work desk day, mild afternoon fatigue'
  },
  {
    date: '2026-11-03',
    dayName: 'Tue',
    systolic: 131,
    diastolic: 84,
    pulse: 76,
    steps: 8100,
    distance: 5.7,
    exerciseMins: 35,
    urineProteinMg: 15, // trace
    urineSG: 1.024,
    urinePH: 6.0,
    notes: 'Heavy project deadline, late dinner'
  },
  {
    date: '2026-11-04',
    dayName: 'Wed',
    systolic: 135,
    diastolic: 86,
    pulse: 78,
    steps: 6400,
    distance: 4.4,
    exerciseMins: 20,
    urineProteinMg: 15,
    urineSG: 1.026,
    urinePH: 5.8,
    notes: 'High sodium intake at restaurant, lower hydration'
  },
  {
    date: '2026-11-05',
    dayName: 'Thu',
    systolic: 129,
    diastolic: 83,
    pulse: 72,
    steps: 8900,
    distance: 6.2,
    exerciseMins: 40,
    urineProteinMg: 0,
    urineSG: 1.019,
    urinePH: 6.4,
    notes: 'Zone 2 cycling session, increased water intake'
  },
  {
    date: '2026-11-06',
    dayName: 'Fri',
    systolic: 124,
    diastolic: 80,
    pulse: 70,
    steps: 10450,
    distance: 7.3,
    exerciseMins: 50,
    urineProteinMg: 0,
    urineSG: 1.017,
    urinePH: 6.6,
    notes: 'Evening run, feeling rested'
  },
  {
    date: '2026-11-07',
    dayName: 'Sat',
    systolic: 121,
    diastolic: 78,
    pulse: 66,
    steps: 11200,
    distance: 7.9,
    exerciseMins: 55,
    urineProteinMg: 0,
    urineSG: 1.016,
    urinePH: 6.5,
    notes: 'Weekend recovery hike, normal readings'
  }
];

export const SAMPLE_MONTHLY_VITALS = [
  { week: 'Week 1', avgSystolic: 123, avgDiastolic: 79, avgSteps: 8900, avgDistance: 6.2, avgExercise: 42, urineAbnormalCount: 0 },
  { week: 'Week 2', avgSystolic: 127, avgDiastolic: 82, avgSteps: 7800, avgDistance: 5.4, avgExercise: 32, urineAbnormalCount: 1 },
  { week: 'Week 3', avgSystolic: 133, avgDiastolic: 85, avgSteps: 7200, avgDistance: 5.0, avgExercise: 25, urineAbnormalCount: 2 },
  { week: 'Week 4', avgSystolic: 125, avgDiastolic: 80, avgSteps: 9400, avgDistance: 6.6, avgExercise: 46, urineAbnormalCount: 0 }
];

export const SAMPLE_YEARLY_VITALS = [
  { month: 'Jan', systolic: 126, diastolic: 81, steps: 8200, exercise: 35 },
  { month: 'Feb', systolic: 128, diastolic: 83, steps: 7900, exercise: 30 },
  { month: 'Mar', systolic: 125, diastolic: 80, steps: 8500, exercise: 40 },
  { month: 'Apr', systolic: 124, diastolic: 79, steps: 9100, exercise: 45 },
  { month: 'May', systolic: 130, diastolic: 84, steps: 7800, exercise: 28 },
  { month: 'Jun', systolic: 127, diastolic: 82, steps: 8300, exercise: 38 },
  { month: 'Jul', systolic: 123, diastolic: 79, steps: 8900, exercise: 42 },
  { month: 'Aug', systolic: 122, diastolic: 78, steps: 9400, exercise: 48 },
  { month: 'Sep', systolic: 129, diastolic: 83, steps: 7900, exercise: 32 },
  { month: 'Oct', systolic: 132, diastolic: 85, steps: 7400, exercise: 26 },
  { month: 'Nov', systolic: 125, diastolic: 80, steps: 8800, exercise: 41 }
];

export const SAMPLE_MEDICAL_DOCUMENTS = [
  {
    id: 'doc_001',
    title: 'Comprehensive Metabolic Panel (CMP)',
    type: 'Laboratory Report',
    date: '2026-10-24',
    provider: 'St. Jude Clinical Diagnostics',
    size: '1.4 MB',
    fileType: 'PDF',
    status: 'Verified',
    summary: 'Serum creatinine 0.92 mg/dL (Normal). Fasting glucose 94 mg/dL. Electrolytes balanced.'
  },
  {
    id: 'doc_002',
    title: 'Automated Urinalysis & Microscopic Sediment',
    type: 'Laboratory Report',
    date: '2026-10-18',
    provider: 'BioTrajectory Home Optical Strip Scan',
    size: '820 KB',
    fileType: 'PDF',
    status: 'Verified',
    summary: 'Protein: Negative. Specific gravity: 1.018. pH: 6.2. Leukocyte esterase: Negative.'
  },
  {
    id: 'doc_003',
    title: 'Cardiology Ambulatory BP Telemetry 24h',
    type: 'Prescriptions',
    date: '2026-09-12',
    provider: 'Dr. Aris Thorne, MD (Cardiovascular)',
    size: '2.1 MB',
    fileType: 'PDF',
    status: 'Reviewed',
    summary: 'No nocturnal dipping deficit. Recommended dietary sodium titration and ongoing tracking.'
  },
  {
    id: 'doc_004',
    title: 'Preventive Lipid Subfraction Panel',
    type: 'Previous records',
    date: '2026-07-04',
    provider: 'Advanced Preventive Health Labs',
    size: '950 KB',
    fileType: 'PDF',
    status: 'Archived',
    summary: 'ApoB: 88 mg/dL (Optimal < 90). LDL-C: 112 mg/dL. HDL-C: 56 mg/dL. Triglycerides: 104 mg/dL.'
  }
];
