// Comprehensive clinical mock dataset and configuration for BioTrajectory
// Grounded strictly in the BioTrajectory Project Blueprint

export const BIOMARKER_DEFINITIONS = [
  {
    id: 'protein',
    name: 'Protein',
    unit: 'mg/dL',
    description: 'Measures albumin concentration in urine. Helpful for tracking renal filtration changes.',
    normalRange: 'Negative to Trace (<15 mg/dL)',
    baselineMean: 5.2,
    baselineMin: 0,
    baselineMax: 15,
    criticalThreshold: 30,
    colorScale: [
      { label: 'Neg', value: 0, color: '#e8ea9c' },
      { label: 'Trace', value: 15, color: '#d8e195' },
      { label: '+ (30)', value: 30, color: '#a7cd9a' },
      { label: '++ (100)', value: 100, color: '#68b19a' },
      { label: '+++ (300)', value: 300, color: '#328b8b' },
    ],
    biologicalContext: 'Can temporarily elevate after strenuous exercise, fever, high protein intake, or dehydration without indicating kidney disease.'
  },
  {
    id: 'specificGravity',
    name: 'Specific Gravity',
    unit: 'density',
    description: 'Assesses urine concentration and kidney ability to concentrate fluids.',
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
    biologicalContext: 'Heavily driven by hydration state, sweat loss, fluid timing, and ambient climate.'
  },
  {
    id: 'pH',
    name: 'pH Level',
    unit: 'pH',
    description: 'Measures acidity or alkalinity of urine, reflecting systemic acid-base equilibrium.',
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
    biologicalContext: 'Alkaline after vegetarian meals or citrus; acidic during prolonged fasting or high-meat diets.'
  },
  {
    id: 'glucose',
    name: 'Glucose',
    unit: 'mg/dL',
    description: 'Detects renal glucosuria when serum glucose surpasses renal reabsorption capacity.',
    normalRange: 'Negative (<15 mg/dL)',
    baselineMean: 0,
    baselineMin: 0,
    baselineMax: 15,
    criticalThreshold: 50,
    colorScale: [
      { label: 'Neg', value: 0, color: '#88bfb8' },
      { label: '100', value: 100, color: '#8bb68b' },
      { label: '250', value: 250, color: '#ab9c5c' },
      { label: '500', value: 500, color: '#93583b' },
    ],
    biologicalContext: 'Normally absent. May appear following intense physiological stress or glycemic surges.'
  },
  {
    id: 'leukocytes',
    name: 'Leukocyte Esterase',
    unit: 'Leu/µL',
    description: 'Enzymatic marker of white blood cells, signalling immune activity.',
    normalRange: 'Negative (<10 Leu/µL)',
    baselineMean: 0,
    baselineMin: 0,
    baselineMax: 10,
    criticalThreshold: 25,
    colorScale: [
      { label: 'Neg', value: 0, color: '#f7ecd2' },
      { label: 'Trace', value: 15, color: '#eed3bb' },
      { label: '+ (70)', value: 70, color: '#cca2b9' },
      { label: '++ (125)', value: 125, color: '#985888' },
    ],
    biologicalContext: 'Positive results often accompany urinary tract inflammation or contamination.'
  },
  {
    id: 'ketones',
    name: 'Ketones (Acetoacetate)',
    unit: 'mg/dL',
    description: 'Indicates lipid metabolism during fasting, low carbohydrate intake, or intense conditioning.',
    normalRange: 'Negative (0 mg/dL)',
    baselineMean: 0,
    baselineMin: 0,
    baselineMax: 5,
    criticalThreshold: 15,
    colorScale: [
      { label: 'Neg', value: 0, color: '#f8eecf' },
      { label: 'Trace (5)', value: 5, color: '#e5b9bd' },
      { label: 'Mod (40)', value: 40, color: '#9c3f68' },
      { label: 'Large (80)', value: 80, color: '#57173e' },
    ],
    biologicalContext: 'Elevates naturally in ketogenic diets, overnight fasts, and endurance marathons.'
  },
  {
    id: 'nitrite',
    name: 'Nitrite',
    unit: 'qualitative',
    description: 'Formed when specific gram-negative bacteria convert dietary nitrate into nitrite.',
    normalRange: 'Negative',
    baselineMean: 0,
    baselineMin: 0,
    baselineMax: 0,
    criticalThreshold: 1,
    colorScale: [
      { label: 'Neg', value: 0, color: '#fbf5e6' },
      { label: 'Pos', value: 1, color: '#e86d8a' },
    ],
    biologicalContext: 'Requires urine to dwell in bladder ~4 hours for bacterial conversion to register.'
  },
  {
    id: 'blood',
    name: 'Blood / Occult Hb',
    unit: 'Ery/µL',
    description: 'Identifies intact erythrocytes or free hemoglobin.',
    normalRange: 'Negative',
    baselineMean: 0,
    baselineMin: 0,
    baselineMax: 5,
    criticalThreshold: 10,
    colorScale: [
      { label: 'Neg', value: 0, color: '#f1ad47' },
      { label: 'Trace (10)', value: 10, color: '#889a42' },
      { label: '+ (25)', value: 25, color: '#387342' },
      { label: '++ (80)', value: 80, color: '#13472d' },
    ],
    biologicalContext: 'Transient hematuria can follow intense running (march hematuria) or menstrual overlap.'
  }
];

// 30 days of longitudinal tracking data for a sample user "Patient BT-9428"
// Showing baseline formation, subtle variations, and a notable Day 22 transient variance
export const SAMPLE_30_DAY_HISTORY = [
  { day: 1, date: '2026-10-05', time: '07:15', protein: 5, specificGravity: 1.018, pH: 6.4, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, notes: 'Baseline collection 1. Hydrated normally.', confirmed: true, sampleType: 'First morning' },
  { day: 3, date: '2026-10-07', time: '07:22', protein: 6, specificGravity: 1.019, pH: 6.3, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, notes: 'Baseline collection 2.', confirmed: true, sampleType: 'First morning' },
  { day: 5, date: '2026-10-09', time: '07:30', protein: 4, specificGravity: 1.017, pH: 6.5, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, notes: 'Baseline collection 3. Mild run previous evening.', confirmed: true, sampleType: 'First morning' },
  { day: 7, date: '2026-10-11', time: '08:05', protein: 5, specificGravity: 1.020, pH: 6.2, glucose: 0, leukocytes: 0, ketones: 5, nitrite: 0, blood: 0, notes: 'Sunday morning, 14h fasting.', confirmed: true, sampleType: 'First morning' },
  { day: 9, date: '2026-10-13', time: '07:10', protein: 5, specificGravity: 1.018, pH: 6.4, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, notes: 'Routine check.', confirmed: true, sampleType: 'First morning' },
  { day: 11, date: '2026-10-15', time: '07:18', protein: 6, specificGravity: 1.019, pH: 6.5, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, notes: 'Baseline stability confirmed.', confirmed: true, sampleType: 'First morning' },
  { day: 13, date: '2026-10-17', time: '07:45', protein: 5, specificGravity: 1.016, pH: 6.6, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, notes: 'Increased hydration yesterday.', confirmed: true, sampleType: 'First morning' },
  { day: 15, date: '2026-10-19', time: '07:12', protein: 4, specificGravity: 1.018, pH: 6.4, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, notes: 'Personal baseline established (10 readings).', confirmed: true, sampleType: 'First morning' },
  { day: 17, date: '2026-10-21', time: '07:20', protein: 6, specificGravity: 1.020, pH: 6.3, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, notes: 'Normal routine.', confirmed: true, sampleType: 'First morning' },
  { day: 19, date: '2026-10-23', time: '07:35', protein: 7, specificGravity: 1.021, pH: 6.3, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, notes: 'Post gym workout.', confirmed: true, sampleType: 'First morning' },
  { day: 22, date: '2026-10-26', time: '07:15', protein: 32, specificGravity: 1.028, pH: 6.1, glucose: 0, leukocytes: 0, ketones: 10, nitrite: 0, blood: 0, notes: 'Intense cross-training + dehydration. Flagged for review.', confirmed: true, flagged: true, deviationReason: 'Protein +3.8 SD above baseline; high urine concentration', sampleType: 'First morning' },
  { day: 24, date: '2026-10-28', time: '07:25', protein: 18, specificGravity: 1.023, pH: 6.3, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, notes: 'Recovery day. Protein resolving back toward baseline.', confirmed: true, flagged: false, sampleType: 'First morning' },
  { day: 26, date: '2026-10-30', time: '07:15', protein: 8, specificGravity: 1.019, pH: 6.4, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, notes: 'Near baseline.', confirmed: true, sampleType: 'First morning' },
  { day: 28, date: '2026-11-01', time: '07:40', protein: 5, specificGravity: 1.018, pH: 6.4, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, notes: 'Baseline re-affirmed.', confirmed: true, sampleType: 'First morning' },
  { day: 30, date: '2026-11-03', time: '07:15', protein: 5, specificGravity: 1.017, pH: 6.5, glucose: 0, leukocytes: 0, ketones: 0, nitrite: 0, blood: 0, notes: 'Current day reading. Healthy baseline trend.', confirmed: true, sampleType: 'First morning' },
];

// Presets for the Interactive Strip Reader simulator
export const SIMULATOR_PRESETS = [
  {
    id: 'normal-baseline',
    label: 'Standard Baseline Reading',
    description: 'Clean reading matching established home trajectory.',
    stripImageName: 'baseline-strip',
    readings: {
      protein: 5,
      specificGravity: 1.018,
      pH: 6.4,
      glucose: 0,
      leukocytes: 0,
      ketones: 0,
      nitrite: 0,
      blood: 0
    },
    lightingQuality: 'Optimal (540 Lux)',
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
      blood: 0
    },
    lightingQuality: 'Good (480 Lux)',
    tiltAngle: '1.1°',
    confidenceScore: 97.8,
    contextTag: 'Post-Workout + Mild Dehydration'
  },
  {
    id: 'fasting-ketones',
    label: 'Intermittent Fasting Shift',
    description: 'Mild ketone appearance with alkaline morning pH shift.',
    stripImageName: 'ketone-shift-strip',
    readings: {
      protein: 6,
      specificGravity: 1.015,
      pH: 7.2,
      glucose: 0,
      leukocytes: 0,
      ketones: 40,
      nitrite: 0,
      blood: 0
    },
    lightingQuality: 'Optimal (510 Lux)',
    tiltAngle: '0.8°',
    confidenceScore: 98.6,
    contextTag: '18h Fasting'
  }
];

// Grounded Gemini AI responses according to Section 6, 8, & 10 rules
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

// 4 Layers of BioTrajectory (Section 4 of PDF)
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

// Implementation Roadmap (Section 15 of PDF)
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

// Judge Q&A and Key Messages (Section 21 & 22 of PDF)
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
// PDF EXACT SLIDE DATA & PRESENTATION METADATA
// ============================================================================

export const PRESENTATION_INFO = {
  event: 'ELITE CODERS PRESENTS',
  competition: 'CodeSprint 2026',
  lifecycle: 'IDEA → MVP → OPEN SOURCE → PITCH',
  teamName: 'Chauhan.rishika2007',
  projectName: 'BioTrajectory',
  tagline: 'Healthcare that understands where your health is heading',
  secondaryTagline: 'Others measure your health, We track where it is going.',
  philosophies: [
    'Marker-by-marker trends, never one misleading health score.',
    'No automated result is a diagnosis. Every reading is user-confirmed, and every AI summary links back to the data.',
    'The core stack is open source. Anyone can inspect, extend and contribute.'
  ],
  presentedBy: ['Rishika Chauhan', 'Riya Baisoya', 'Pranjal Kumar Pandey', 'Priyanshu'],
  socials: {
    website: 'Elitecoders.in',
    instagram: 'Elite_coders_',
    linkedin: 'Elite-coders',
    email: 'We@elitecoders.in'
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
      description: 'Results sit in labs, apps and paper. Nobody sees the whole timeline.',
      icon: 'FileSpreadsheet',
      badScenario: 'Disjointed lab reports, physical printouts, and doctor portals that never communicate.'
    },
    {
      id: 'numbers',
      title: 'Numbers without meaning',
      description: 'People get values with no personal context and no clear next step.',
      icon: 'HelpCircle',
      badScenario: 'Patient receives "Protein 30 mg/dL" with no clue whether it is a harmless workout artifact or chronic.'
    }
  ],
  statistics: [
    {
      value: '9 in 10',
      label: 'adults with chronic kidney disease do not know they have it',
      highlight: 'Silent progression without continuous tracking'
    },
    {
      value: '101M',
      label: 'Indians live with diabetes, and 136M more have prediabetes',
      highlight: '136M window where longitudinal trends guide prevention'
    },
    {
      value: '315M',
      label: 'Indians living with hypertension',
      highlight: 'High risk of secondary hypertensive nephropathy'
    }
  ]
};

export const PDF_SOLUTION_STEPS = [
  {
    step: '01',
    title: 'Measure',
    description: 'A supported urine test strip, read by phone camera or entered by hand.',
    badge: 'Input & Optical Capture',
    detail: 'Uses commercial reagent strips (e.g. 10-parameter) with guided framing or direct manual input.'
  },
  {
    step: '02',
    title: 'Learn your baseline',
    description: 'Your own history becomes the reference, once enough readings exist.',
    badge: 'Personal Reference',
    detail: 'Calculates non-parametric rolling median and IQR corridors to establish personal biological homeostasis.'
  },
  {
    step: '03',
    title: 'Spot change',
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

export const PDF_TECH_STACK = [
  {
    category: 'FRONTEND',
    title: 'React / React Native',
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
    title: 'Gemini API',
    description: 'Grounded explanations and clinician summaries',
    icon: 'Sparkles',
    role: 'Synthesizes non-diagnostic explanations and formats doctor-ready appointment notes.'
  },
  {
    category: 'CHARTS',
    title: 'Recharts / Chart.js',
    description: 'Per-marker trend view',
    icon: 'LineChart',
    role: 'High-fidelity baseline bands, interactive tooltips, and longitudinal trajectory charts.'
  },
  {
    category: 'DEPLOYMENT',
    title: 'Secure cloud demo',
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

