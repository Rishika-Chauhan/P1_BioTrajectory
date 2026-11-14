/**
 * Clinical Professional Expansion for Doctor Explore Module
 * Provides evidence-based diagnostic protocols, first-line clinical treatments,
 * potential complications, and specialist referral triggers.
 */

export const CLINICAL_DETAILS_BY_ID = {
  'high-blood-pressure': {
    recommendedDiagnosticTests: [
      '12-lead Electrocardiogram (ECG) to assess left ventricular hypertrophy (LVH)',
      'Basic Metabolic Panel: Serum Creatinine, eGFR, Blood Urea Nitrogen (BUN), Electrolytes (Na+, K+)',
      'Fasting Blood Glucose or HbA1c to screen for concomitant metabolic syndrome',
      'Urinalysis: Spot urine albumin-to-creatinine ratio (uACR)',
      'Lipid Profile (Total Cholesterol, LDL-C, HDL-C, Triglycerides)'
    ],
    treatmentOptions: [
      'First-line Monotherapy (based on ACC/AHA 2017 & ISH 2020 Guidelines): Thiazide diuretic (Chlorthalidone/HCTZ), CCB (Amlodipine), or ACEi/ARB',
      'Dual-combination therapy for baseline BP >20/10 mmHg above target',
      'Lifestyle interventions: Dietary Approaches to Stop Hypertension (DASH diet), sodium restriction (<1.5 to 2.0 g/day), weight reduction, regular aerobic exercise'
    ],
    possibleComplications: [
      'Hypertensive Heart Disease & Left Ventricular Failure',
      'Ischemic Stroke and Intracerebral Hemorrhage',
      'Hypertensive Nephrosclerosis & End-Stage Renal Disease (ESRD)',
      'Hypertensive Retinopathy (Grade I–IV)',
      'Aortic Dissection & Peripheral Artery Disease'
    ],
    specialistReferralCriteria: [
      'Resistant hypertension: BP uncontrolled despite adherence to >=3 antihypertensive agents of different classes (including a diuretic)',
      'Suspected secondary hypertension (sudden onset age <30 or >55, hypokalemia, renal bruits, Cushings features)',
      'Hypertensive crisis with target organ damage (refer to emergency department immediately)'
    ]
  },
  'diabetes': {
    recommendedDiagnosticTests: [
      'Fasting Plasma Glucose (FPG >= 126 mg/dL) confirmed on repeat test',
      'Glycated Hemoglobin (HbA1c >= 6.5%) using standardized NGSP methodology',
      '2-hour 75g Oral Glucose Tolerance Test (OGTT >= 200 mg/dL)',
      'Annual spot urine albumin-to-creatinine ratio (uACR) & eGFR for nephropathy screening',
      'Annual dilated eye examination by ophthalmologist for diabetic retinopathy'
    ],
    treatmentOptions: [
      'First-line: Metformin (unless eGFR < 30 mL/min/1.73m²) plus comprehensive lifestyle interventions',
      'Cardiorenal protection: SGLT2 inhibitors (Empagliflozin, Dapagliflozin) or GLP-1 receptor agonists if ASCVD, CKD, or heart failure present',
      'Second-line additions: DPP-4 inhibitors, Sulfonylureas (caution with hypoglycemia), Basal Insulin as needed'
    ],
    possibleComplications: [
      'Diabetic Nephropathy & Renal Failure',
      'Diabetic Retinopathy & Macular Edema',
      'Diabetic Peripheral & Autonomic Neuropathy',
      'Diabetic Foot Ulceration & Lower Extremity Amputation',
      'Accelerated Atherosclerotic Cardiovascular Disease (CAD, PVD, Stroke)'
    ],
    specialistReferralCriteria: [
      'Poor glycemic control despite dual/triple oral therapies (HbA1c > 9.0%)',
      'Onset of persistent microalbuminuria or macroalbuminuria',
      'Diabetic foot ulcer or peripheral neuro-ischemic changes (refer to Podiatry/Vascular Surgery)',
      'Pregnancy in a woman with pre-existing diabetes (refer to Maternal-Fetal Medicine)'
    ]
  },
  'dengue': {
    recommendedDiagnosticTests: [
      'Dengue NS1 Antigen (detectable days 1–5 of symptom onset)',
      'Dengue IgM / IgG ELISA antibodies (detectable from day 5 onward)',
      'Complete Blood Count (CBC) with serial hematocrit (Hct) and platelet monitoring',
      'Liver Function Tests (ALT/AST elevation typically correlates with disease severity)'
    ],
    treatmentOptions: [
      'Strict supportive therapy: Judicious isotonic fluid management (oral rehydration; IV crystalloids like Normal Saline or Ringer Lactate if oral intake failing)',
      'Paracetamol (Acetaminophen) for antipyresis: Max 3 to 4g daily in adults',
      'ABSOLUTE CONTRAINDICATION: Aspirin, Ibuprofen, and other NSAIDs due to severe antiplatelet effect and gastric bleeding risk'
    ],
    possibleComplications: [
      'Severe Dengue (Dengue Hemorrhagic Fever / Dengue Shock Syndrome)',
      'Plasma leakage leading to pleural effusion, ascites, and circulatory collapse',
      'Severe thrombocytopenia (<20,000/µL) with spontaneous mucocutaneous hemorrhage',
      'Severe acute organ involvement: hepatitis, myocarditis, encephalopathy'
    ],
    specialistReferralCriteria: [
      'Presence of clinical warning signs: severe abdominal pain, persistent vomiting, mucosal bleeding, lethargy, fluid accumulation',
      'Rapid rise in hematocrit (>20% from baseline) concurrent with precipitous drop in platelets',
      'Signs of circulatory failure or shock: hypotension, cold clammy extremities, narrow pulse pressure (<20 mmHg)'
    ]
  },
  'tuberculosis': {
    recommendedDiagnosticTests: [
      'Rapid Molecular Diagnostic: GeneXpert MTB/RIF or Truenat assay on sputum specimen',
      'Sputum smear microscopy for Acid-Fast Bacilli (AFB)',
      'Posterior-Anterior (PA) Chest Radiograph',
      'Mycobacterial liquid culture (MGIT) and Phenotypic Drug Susceptibility Testing (DST)'
    ],
    treatmentOptions: [
      'Drug-Susceptible TB Standard Regimen (6 months total): Intensive phase of 2 months with Isoniazid (H), Rifampicin (R), Pyrazinamide (Z), and Ethambutol (E), followed by 4 months continuation phase of HR',
      'Directly Observed Therapy (DOTS) protocol to ensure 100% adherence and prevent drug resistance',
      'Adjunctive Pyridoxine (Vitamin B6 25–50 mg daily) to prevent isoniazid-induced peripheral neuropathy'
    ],
    possibleComplications: [
      'Multi-Drug Resistant Tuberculosis (MDR-TB) and Extensively Drug-Resistant TB (XDR-TB)',
      'Permanent pulmonary fibrosis, bronchiectasis, and cavitation',
      'Pleural effusion, empyema, and pneumothorax',
      'Disseminated (Miliary) TB and Tuberculous Meningitis'
    ],
    specialistReferralCriteria: [
      'GeneXpert positive for Rifampicin resistance (refer to Drug-Resistant TB nodal center immediately)',
      'Extrapulmonary TB: CNS, spinal (Pott’s disease), pericardial, or disseminated presentation',
      'Failure to convert sputum smear to negative after 2 months of standard intensive therapy'
    ]
  },
  'breast-cancer': {
    recommendedDiagnosticTests: [
      'Diagnostic Bilateral Mammography & High-Resolution Breast Ultrasound',
      'Image-Guided Core Needle Biopsy (CNB) of identified breast mass and axillary nodes',
      'Histopathologic & Immunohistochemical (IHC) profiling: ER, PR, HER2/neu receptor status, and Ki-67 proliferation index',
      'Germline genetic testing (BRCA1/BRCA2, PALB2) if age <50 or strong family history',
      'Contrast-enhanced Breast MRI for high-risk or dense breast tissue evaluation'
    ],
    treatmentOptions: [
      'Multidisciplinary Tumor Board (MDT) personalized treatment protocol',
      'Surgical intervention: Breast-conserving surgery (lumpectomy) with sentinel lymph node biopsy (SLNB) vs. Total Mastectomy',
      'Adjuvant or Neoadjuvant Systemic Therapy: Chemotherapy (Anthracycline/Taxane), Targeted Therapy (Trastuzumab/Pertuzumab for HER2+)',
      'Endocrine Therapy for Hormone-Receptor Positive (ER+/PR+): Tamoxifen (premenopausal) or Aromatase Inhibitors (postmenopausal)',
      'Post-operative Radiation Therapy (WBI) following breast-conserving surgery'
    ],
    possibleComplications: [
      'Metastatic dissemination to bone, liver, lungs, and brain',
      'Post-lymphadenectomy secondary lymphedema of the ipsilateral arm',
      'Chemotherapy-induced cardiotoxicity, cytopenias, and neuropathy',
      'Locoregional tumor recurrence'
    ],
    specialistReferralCriteria: [
      'Any palpable dominant breast mass, persistent axillary lymphadenopathy, or suspicious nipple retraction',
      'BIRADS 4 or BIRADS 5 findings on screening mammogram (urgent referral to Surgical Oncology)',
      'Patients with confirmed BRCA pathogenic mutations for prophylactic risk-reduction consultations'
    ]
  }
};

/**
 * Helper to get clinical details with reliable fallback for any of the 35 diseases
 */
export function getClinicalDetailsForDisease(disease) {
  if (CLINICAL_DETAILS_BY_ID[disease.id]) {
    return CLINICAL_DETAILS_BY_ID[disease.id];
  }

  // Generic evidence-based clinical structure for other conditions
  return {
    recommendedDiagnosticTests: [
      `Complete Blood Count (CBC) with differential`,
      `Comprehensive Metabolic Panel (CMP): Renal and Hepatic functions`,
      `Targeted specific diagnostic imaging or laboratory markers for ${disease.name}`,
      `Clinical vital sign trajectory logging (BP, Pulse, Temperature)`
    ],
    treatmentOptions: [
      `Evidence-based guideline directed medical therapy for ${disease.name}`,
      `Supportive non-pharmacological interventions, lifestyle modifications, and risk factor control`,
      `Patient education and structured ambulatory follow-up intervals`
    ],
    possibleComplications: [
      `Disease progression and chronicity without therapeutic intervention`,
      `Secondary organ dysfunction or systemic stress`,
      `Impaired functional capacity and quality of life`
    ],
    specialistReferralCriteria: [
      `Uncertain diagnosis or atypical presentation failing standard empiric therapy`,
      `Severe, refractory, or rapidly escalating clinical signs`,
      `Presence of high-risk comorbidity requiring multidisciplinary co-management`
    ]
  };
}
