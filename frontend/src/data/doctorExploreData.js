/**
 * BioTrajectory Clinical Professional Knowledgebase & Dataset Module
 * Provides authoritative evidence-based clinical protocols for all 35 health conditions.
 * Standards integrated: WHO Guidelines & EML, CDC Protocols, NCCN 2026, AHA/ACC, ADA 2026, KDIGO, GINA, AASLD.
 * Generated for BioTrajectory Doctor Portal Explore Engine.
 */

export const GLOBAL_DISEASE_DATASETS = {
  "common-cold": {
    "id": "common-cold",
    "name": "Common Cold",
    "medicalName": "Acute Viral Rhinitis",
    "category": "Common Illnesses",
    "subCategory": "Respiratory & Infections",
    "icdCode": "J00",
    "datasetSource": "CDC Respiratory Disease Guidance & WHO Model List of Essential Medicines",
    "evidenceLevel": "Level 1A (CDC / Cochrane Systematic Reviews)",
    "overview": "Acute self-limiting viral infection of upper respiratory mucosal epithelium primarily caused by rhinoviruses, coronaviruses, and adenoviruses.",
    "symptoms": {
      "hallmark": [
        "Nasal mucosal congestion and clear-to-mucopurulent rhinorrhea",
        "Scratchy, irritated pharynx and mild sore throat",
        "Paroxysmal sneezing and post-nasal drip cough",
        "Mild low-grade malaise and subjective forehead heaviness"
      ],
      "earlySigns": [
        "Palatal itching or dryness within 10-12 hours of exposure",
        "Mild conjunctival injection and watery eyes",
        "Transient chilliness without true rigors"
      ],
      "redFlags": [
        "Persistent high fever >38.5°C (>101.3°F) exceeding 4 days (suspect bacterial superinfection)",
        "Severe unilateral maxillary or frontal facial tenderness (acute rhinosinusitis)",
        "Stridor, tachypnea, or resting dyspnea",
        "Acute otalgia with bulging tympanic membrane (acute otitis media)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Rapid Respiratory Multiplex Viral RT-PCR",
        "type": "Point of Care / Lab Assay",
        "purpose": "Identifies Rhinovirus, Adenovirus, Enterovirus; rules out Influenza A/B, RSV, and SARS-CoV-2",
        "urgency": "Routine / Outpatient"
      },
      {
        "testName": "Complete Blood Count (CBC) with Differential",
        "type": "Laboratory Assay",
        "purpose": "Evaluates leukocyte count; normal or mild lymphocytosis confirms viral etiology without bacterial leukocytosis",
        "urgency": "Routine"
      },
      {
        "testName": "Rapid Antigen Detection Test (RADT) for Group A Strep",
        "type": "Point of Care Swab",
        "purpose": "Indicated if tonsillopharyngeal exudate present to exclude streptococcal pharyngitis (Centor Score >= 3)",
        "urgency": "Priority / Within 24h"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Paracetamol (Acetaminophen)",
        "strength": "650 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Every 6 hours as needed (SOS)",
        "timing": "After meals with water",
        "duration": "3 to 5 days",
        "regimenType": "First-Line Antipyretic & Analgesic",
        "clinicalNotes": "Do not exceed 3,000 mg in 24 hours. Safe in pregnancy and renal impairment; avoid in acute liver failure."
      },
      {
        "drugName": "Cetirizine Hydrochloride",
        "strength": "10 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "At bedtime",
        "duration": "5 days",
        "regimenType": "Second-Generation H1 Antihistamine",
        "clinicalNotes": "Suppresses rhinorrhea, sneezing, and histamine-mediated mucosal hypersecretion. Low sedative profile."
      },
      {
        "drugName": "Xylometazoline HCl 0.1% Nasal Spray",
        "strength": "0.1% (1 mg/mL)",
        "dosageForm": "Topical Nasal Spray",
        "frequency": "2 sprays per nostril BID",
        "timing": "Morning and before sleep",
        "duration": "Maximum 3 to 5 days strictly",
        "regimenType": "Topical Sympathomimetic Decongestant",
        "clinicalNotes": "CRITICAL PRECAUTION: Strictly limit use to <=5 days to prevent rhinitis medicamentosa (rebound chemical mucosal hypertrophy)."
      },
      {
        "drugName": "Isotonic Saline 0.9% Nasal Rinse",
        "strength": "0.9% w/v NaCl",
        "dosageForm": "Nasal Drops / Spray",
        "frequency": "3 to 4 times daily",
        "timing": "As needed before meals/sleep",
        "duration": "7 days",
        "regimenType": "Non-Pharmacological Mucociliary Cleanser",
        "clinicalNotes": "Clears thick inspissated secretions, facilitates mucociliary escalator clearance, zero drug interactions."
      }
    ],
    "complications": [
      "Secondary acute bacterial rhinosinusitis (1-2% of adult cases)",
      "Acute otitis media from Eustachian tube dysfunction",
      "Exacerbation of underlying bronchial asthma or COPD"
    ],
    "referralTriggers": [
      "Symptoms persisting >14 days without trajectory improvement",
      "Onset of biphasic illness (initial improvement followed by acute spike in fever and purulent sputum)",
      "Development of inspiratory stridor or subcostal retractions"
    ]
  },
  "cough": {
    "id": "cough",
    "name": "Cough (Acute & Subacute)",
    "medicalName": "Acute & Subacute Bronchial Cough",
    "category": "Common Illnesses",
    "subCategory": "Respiratory & Infections",
    "icdCode": "R05",
    "datasetSource": "ACCP (American College of Chest Physicians) Evidence-Based Cough Guidelines & WHO",
    "evidenceLevel": "Grade 1B (ACCP Clinical Consensus)",
    "overview": "Airway defensive reflex clearing tracheobronchial secretions; classified as acute (<3 weeks) or subacute (3-8 weeks post-infectious).",
    "symptoms": {
      "hallmark": [
        "Paroxysmal hacking cough (either dry non-productive or productive with sputum)",
        "Retrosternal chest muscular soreness from forceful coughing spasms",
        "Post-tussive throat irritation and sleep fragmentation",
        "Occasional throat clearing and hoarse vocal timbre"
      ],
      "earlySigns": [
        "Persistent tickle in trachea or larynx",
        "Post-nasal drip sensation trickling down posterior pharynx",
        "Mild exertional chest tightness"
      ],
      "redFlags": [
        "Frank hemoptysis or rust-colored sputum",
        "Resting hypoxemia (pulse oximetry SpO2 < 93% on ambient air)",
        "Unexplained B-symptoms: drenching night sweats, involuntary weight loss",
        "Unilateral pleuritic stabbing chest pain exacerbated on inspiration"
      ]
    },
    "requiredTests": [
      {
        "testName": "Standard Chest Radiograph (PA View)",
        "type": "Diagnostic Imaging",
        "purpose": "Essential to exclude pneumonia, lobar consolidation, cavitary tuberculosis, pneumothorax, or bronchogenic neoplasm",
        "urgency": "Priority / Within 24h if red flags"
      },
      {
        "testName": "Pulse Oximetry & Peak Expiratory Flow Rate (PEFR)",
        "type": "Point of Care / Pulmonary",
        "purpose": "Quantifies oxygenation and reversible bronchospastic airway obstruction",
        "urgency": "Stat / Immediate"
      },
      {
        "testName": "Sputum Gram Stain & Sputum Bacterial Culture",
        "type": "Microbiology Assay",
        "purpose": "Identifies Streptococcus pneumoniae, Haemophilus influenzae, or Moraxella catarrhalis in purulent productive cough",
        "urgency": "Routine"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Dextromethorphan Hydrobromide",
        "strength": "15 mg / 5 mL",
        "dosageForm": "Oral Syrup",
        "frequency": "10 mL every 6 to 8 hours as needed",
        "timing": "After meals; especially before bedtime",
        "duration": "5 to 7 days",
        "regimenType": "Centrally Acting Non-Opioid Antitussive",
        "clinicalNotes": "Suppresses medullary cough center for exhausting non-productive cough. CONTRAINDICATION: Do not combine with MAO inhibitors or SSRIs (serotonin syndrome risk)."
      },
      {
        "drugName": "Levosalbutamol + Ambroxol HCl",
        "strength": "(1 mg + 30 mg) / 5 mL",
        "dosageForm": "Oral Solution",
        "frequency": "5 mL three times daily (TID)",
        "timing": "Post-meal with lukewarm water",
        "duration": "5 to 7 days",
        "regimenType": "Bronchodilator & Mucolytic Secretolytic",
        "clinicalNotes": "Ambroxol depolymerizes mucopolysaccharides to thin phlegm; Levosalbutamol relieves reactive bronchial smooth muscle spasm."
      },
      {
        "drugName": "Inhaled Budesonide MDI with Spacer",
        "strength": "200 mcg per puff",
        "dosageForm": "Metered Dose Inhaler",
        "frequency": "2 puffs twice daily (BID)",
        "timing": "Morning and night; rinse mouth after use",
        "duration": "14 days",
        "regimenType": "Topical Inhaled Corticosteroid",
        "clinicalNotes": "Indicated for post-infectious bronchial hyperresponsiveness; rinses mouth to prevent oral candidiasis."
      }
    ],
    "complications": [
      "Post-tussive rib fracture in osteopenic individuals",
      "Cough syncope from transient drop in venous return",
      "Urinary stress incontinence in multiparous females"
    ],
    "referralTriggers": [
      "Cough refractory beyond 8 weeks (chronic cough algorithm)",
      "Hemoptysis of any quantity",
      "Abnormal infiltrate or mass lesion on chest radiography"
    ]
  },
  "fever": {
    "id": "fever",
    "name": "Fever (Acute Febrile Illness)",
    "medicalName": "Pyrexia / Acute Febrile Syndrome",
    "category": "Common Illnesses",
    "subCategory": "Fever & Mosquito-Borne",
    "icdCode": "R50.9",
    "datasetSource": "WHO IMAI (Integrated Management of Adolescent & Adult Illness) & CDC Guidance",
    "evidenceLevel": "Grade 1A (WHO Core Protocol)",
    "overview": "Regulated elevation of hypothalamic core set-point temperature above 38.0°C (100.4°F) driven by pyrogenic cytokines (IL-1, IL-6, TNF-alpha).",
    "symptoms": {
      "hallmark": [
        "Core body temperature elevation >38.0°C (>100.4°F)",
        "Rigors, shivering, teeth-chattering followed by intense flushing",
        "Profound generalized myalgia, arthralgia, and cephalalgia",
        "Sinus tachycardia (elevated 10 bpm per 1°C temperature rise)"
      ],
      "earlySigns": [
        "Malaise, anorexia, and cutaneous vasoconstriction (cold extremities)",
        "Dry mouth, mild dehydration, and concentrated urine",
        "Restlessness or mild lethargy"
      ],
      "redFlags": [
        "Altered mental status, confusion, or delirium",
        "Meningeal irritation signs: neck stiffness (nuchal rigidity), photophobia",
        "Petechial or purpuric rash that fails to blanch under glass pressure (meningococcemia / severe dengue)",
        "Hemodynamic instability: Systolic BP <90 mmHg or Mean Arterial Pressure <65 mmHg"
      ]
    },
    "requiredTests": [
      {
        "testName": "Complete Blood Count (CBC) with Peripheral Blood Smear",
        "type": "Laboratory Assay",
        "purpose": "Evaluates toxic granulation, neutrophilic leukocytosis (bacterial), leukopenia (viral/typhoid), and thrombocytopenia",
        "urgency": "Priority / Within 6h"
      },
      {
        "testName": "Serum Procalcitonin (PCT) & High-Sensitivity CRP",
        "type": "Biomarker Assay",
        "purpose": "Distinguishes systemic bacterial sepsis (PCT > 0.5 ng/mL) from self-limiting viral pyrexia",
        "urgency": "Priority / Within 6h"
      },
      {
        "testName": "Dual Automated Blood Culture Sets (Aerobic + Anaerobic)",
        "type": "Microbiology Gold Standard",
        "purpose": "2 sets from independent venipuncture sites strictly prior to antimicrobial initiation",
        "urgency": "Stat / Before Antibiotics"
      },
      {
        "testName": "Urine Routine/Microscopy and Urine Culture",
        "type": "Urinalysis",
        "purpose": "Assesses pyuria (>10 WBC/hpf) to rule out occult urinary tract infection and pyelonephritis",
        "urgency": "Priority / Within 12h"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Paracetamol (Acetaminophen)",
        "strength": "650 mg",
        "dosageForm": "Oral Tablet / IV Infusion",
        "frequency": "Every 6 hours as needed (SOS)",
        "timing": "Post-meal or slow IV over 15 mins",
        "duration": "3 to 5 days",
        "regimenType": "First-Line Antipyretic Agent",
        "clinicalNotes": "Primary antipyretic of choice globally. Adult ceiling: 3,000 mg/24h. Preserves platelet aggregation unlike aspirin."
      },
      {
        "drugName": "WHO Low-Osmolarity Oral Rehydration Salts (ORS)",
        "strength": "20.5 g sachet in 1 L potable water",
        "dosageForm": "Oral Electrolyte Solution",
        "frequency": "Ad libitum (target 2 to 3 Liters daily)",
        "timing": "Sipped continuously throughout the day",
        "duration": "Duration of febrile illness",
        "regimenType": "Electrolyte & Hydration Stabilization",
        "clinicalNotes": "Replaces insensible fluid losses from hyperventilation and diaphoresis; prevents prerenal azotemia."
      }
    ],
    "complications": [
      "Febrile delirium and dehydration-induced acute prerenal kidney injury",
      "Septic shock with multi-organ dysfunction syndrome (MODS)",
      "Disseminated intravascular coagulation (DIC)"
    ],
    "referralTriggers": [
      "Fever >39.5°C unyielding to antipyretics and active physical cooling",
      "Hypotension refractory to oral fluids requiring vasopressor support",
      "Presence of any meningeal or focal neurological deficit"
    ]
  },
  "typhoid": {
    "id": "typhoid",
    "name": "Typhoid Fever",
    "medicalName": "Enteric Fever (Salmonella enterica serovar Typhi)",
    "category": "Common Illnesses",
    "subCategory": "Fever & Mosquito-Borne",
    "icdCode": "A01.0",
    "datasetSource": "WHO Guidelines on the Prevention and Control of Enteric Fever & CDC Global Health",
    "evidenceLevel": "Grade 1A (WHO Strategic Advisory Group of Experts)",
    "overview": "Systemic invasive bacterial infection caused by Salmonella Typhi or Paratyphi transmitted via contaminated food and water.",
    "symptoms": {
      "hallmark": [
        "Step-ladder stepwise progressive high fever reaching 39-40°C by end of week 1",
        "Relative bradycardia inconsistent with high fever (Faget's sign / sphygmo-thermic dissociation)",
        "Heavily coated tongue with red margins ('typhoid tongue')",
        "Hepatosplenomegaly with gentle abdominal distension"
      ],
      "earlySigns": [
        "Persistent frontal throbbing cephalalgia and dry hacking cough",
        "Constipation in early week 1, evolving to pea-soup diarrhea in week 2",
        "Transient faint blanching salmon-colored macules on lower trunk ('rose spots')"
      ],
      "redFlags": [
        "Acute peritonitis from ileal Peyer's patch perforation (terminal ileum) typically in week 3",
        "Massive lower intestinal hemorrhage (melena or frank hematochezia)",
        "Typhoid encephalopathy ('coma vigil' / muttering delirium)",
        "Septic shock with hypothermia and profound hypotension"
      ]
    },
    "requiredTests": [
      {
        "testName": "Blood Culture via Automated BACTEC System",
        "type": "Microbiology Gold Standard",
        "purpose": "Diagnostic yield 75-80% in week 1 of illness before antibiotics; detects Salmonella enterica",
        "urgency": "Stat / Urgent"
      },
      {
        "testName": "Widal Tube Agglutination Test (Paired Sera)",
        "type": "Serology Assay",
        "purpose": "Significant diagnostic threshold: TO titer >= 1:160 and TH titer >= 1:160 with fourfold rise in convalescent serum",
        "urgency": "Routine"
      },
      {
        "testName": "Stool & Urine Bacterial Culture",
        "type": "Microbiology Assay",
        "purpose": "Higher sensitivity in weeks 2-3 of illness; identifies chronic fecal shedding carrier state",
        "urgency": "Routine"
      },
      {
        "testName": "CBC with Absolute Eosinophil Count (AEC)",
        "type": "Laboratory Assay",
        "purpose": "Classic hallmark: Leukopenia (WBC 3,000-5,000/µL) with virtual absence of eosinophils (aneosinophilia)",
        "urgency": "Priority / Within 12h"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Azithromycin Dihydrate",
        "strength": "500 mg (or 20 mg/kg/day)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD) on Day 1, then 500 mg OD",
        "timing": "1 hour before or 2 hours after meals",
        "duration": "7 to 10 days",
        "regimenType": "First-Line Oral Macrolide (Overcomes Fluoroquinolone Resistance)",
        "clinicalNotes": "Achieves high intracellular concentration inside reticuloendothelial macrophages. Low relapse rates (<3%)."
      },
      {
        "drugName": "Ceftriaxone Sodium",
        "strength": "2.0 g (or 50-75 mg/kg/day)",
        "dosageForm": "IV Infusion",
        "frequency": "Once daily (or 1 g Q12H)",
        "timing": "Slow IV infusion over 30 mins in 100 mL NS",
        "duration": "10 to 14 days",
        "regimenType": "First-Line Parenteral Cephalosporin (Hospitalized/Severe)",
        "clinicalNotes": "Indicated for severe enteric fever, toxic state, or oral intolerance. Drug of choice for MDR/XDR strains."
      },
      {
        "drugName": "Dexamethasone Sodium Phosphate",
        "strength": "3 mg/kg initial IV dose, then 1 mg/kg Q6H",
        "dosageForm": "IV Injection",
        "frequency": "Every 6 hours",
        "timing": "Concurrent with initial IV antibiotics",
        "duration": "48 hours only",
        "regimenType": "Adjunctive Corticosteroid for Severe Typhoid Encephalopathy",
        "clinicalNotes": "Significantly reduces mortality in severe typhoid shock/delirium. Discontinue after 48h to prevent mask of perforation."
      }
    ],
    "complications": [
      "Terminal ileal ulcer perforation and life-threatening fecal peritonitis (week 3)",
      "Severe intestinal hemorrhage from eroded mesenteric vessels",
      "Chronic asymptomatic gallbladder carrier state (excreting bacilli >12 months)"
    ],
    "referralTriggers": [
      "Sudden severe abdominal pain with guarding (immediate surgical exploratory laparotomy)",
      "Unresponsive to oral azithromycin after 96 hours of therapy",
      "Features of typhoid state: delirium, extreme prostration, involuntary twitching"
    ]
  },
  "dengue": {
    "id": "dengue",
    "name": "Dengue Fever",
    "medicalName": "Flavivirus Infection / Dengue Hemorrhagic Fever",
    "category": "Common Illnesses",
    "subCategory": "Fever & Mosquito-Borne",
    "icdCode": "A90",
    "datasetSource": "WHO Comprehensive Guidelines for Prevention and Control of Dengue & CDC Protocols",
    "evidenceLevel": "Grade 1A (WHO Global Standard)",
    "overview": "Arboviral infection transmitted by Aedes mosquitoes; manifests across a spectrum from self-limiting febrile illness to plasma leakage shock.",
    "symptoms": {
      "hallmark": [
        "Abrupt onset saddleback high fever (up to 40°C / 104°F) lasting 2-7 days",
        "Severe retro-orbital pain aggravated by eye movements",
        "Excruciating generalized bone and joint pain ('break-bone fever')",
        "Maculopapular rash appearing as islands of white in a sea of red during recovery"
      ],
      "earlySigns": [
        "Facial erythema, conjunctival suffusion, and intense frontal headache",
        "Marked anorexia, nausea, altered taste (metallic/bitter taste)",
        "Positive tourniquet test (>20 petechiae per square inch)"
      ],
      "redFlags": [
        "Critical Warning Signs (Day 3-7 at defervescence): Severe persistent abdominal pain or tenderness",
        "Persistent intractable vomiting (>=3 episodes in 1 hour or 4 in 6 hours)",
        "Clinical fluid accumulation: right-sided pleural effusion, ascites, gallbladder wall edema",
        "Mucosal bleeding (epistaxis, gingival bleed, hematemesis, menorrhagia)",
        "Rapid concurrent rise in hematocrit (>20%) with precipitous plunge in platelets (<50,000/µL)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Dengue NS1 Antigen ELISA",
        "type": "Serology Assay",
        "purpose": "Primary diagnostic marker in acute febrile phase (Days 1 to 5 from onset); sensitivity 85-95%",
        "urgency": "Priority / Within 6h"
      },
      {
        "testName": "Dengue IgM & IgG Capture ELISA",
        "type": "Serology Assay",
        "purpose": "Indicated from Day 5 onwards; IgM/IgG ratio distinguishes primary from secondary hyper-reactive dengue",
        "urgency": "Priority"
      },
      {
        "testName": "Serial Complete Blood Count (CBC) with Hematocrit (HCT)",
        "type": "Laboratory Assay",
        "purpose": "CRITICAL MONITORING: Baseline and Q12-24H hematocrit. A >20% increase heralds critical microvascular plasma leak",
        "urgency": "Stat / Continuous Tracking"
      },
      {
        "testName": "Platelet Count Tracking & Liver Enzymes (ALT/AST)",
        "type": "Laboratory Assay",
        "purpose": "AST characteristically higher than ALT; platelet nadir identifies bleeding vulnerability",
        "urgency": "Stat"
      },
      {
        "testName": "Abdominal Ultrasound & Chest Radiograph",
        "type": "Diagnostic Imaging",
        "purpose": "Detects subclinical gallbladder wall thickening, ascites, and right pleural effusion indicating plasma leakage",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Normal Saline (0.9% NaCl) or Ringer's Lactate IV",
        "strength": "5 to 7 mL/kg/hour titrated downward to 3-5 then 2 mL/kg/h",
        "dosageForm": "IV Crystalloid Infusion",
        "frequency": "Continuous IV infusion adjusted strictly to urine output and hematocrit",
        "timing": "During the critical plasma leakage phase (24-48 hours)",
        "duration": "24 to 48 hours maximum",
        "regimenType": "Isotonic Crystalloid Fluid Resuscitation",
        "clinicalNotes": "CORE LIFESAVING THERAPY: Maintain urine output at 0.5-1.0 mL/kg/h. Stop fluids promptly once hematocrit stabilizes to prevent pulmonary edema."
      },
      {
        "drugName": "Paracetamol (Acetaminophen)",
        "strength": "500 to 650 mg",
        "dosageForm": "Oral Tablet / IV Infusion",
        "frequency": "Every 6 hours as needed (Maximum 3,000 mg in 24 hours)",
        "timing": "Post-meal with water",
        "duration": "5 days",
        "regimenType": "Analgesic & Antipyretic",
        "clinicalNotes": "STRICT CONTRAINDICATION: Absolute ban on Aspirin, Ibuprofen, Diclofenac, Naproxen, or any NSAIDs (provokes severe gastric hemorrhage and fatal Reye's syndrome)."
      },
      {
        "drugName": "Carica Papaya Leaf Extract",
        "strength": "1,100 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Three times daily (TID)",
        "timing": "After meals",
        "duration": "5 days",
        "regimenType": "Thrombopoiesis Facilitating Nutraceutical Adjunct",
        "clinicalNotes": "Upregulates ALOX-12 and PTAFR genes to stimulate megakaryocytopoiesis and platelet release in uncomplicated thrombocytopenia."
      }
    ],
    "complications": [
      "Dengue Shock Syndrome (DSS) from massive intravascular fluid extravasation",
      "Severe internal hemorrhage (gastrointestinal, intracranial)",
      "Severe acute organ impairment: dengue fulminant hepatitis, myocarditis, encephalitis"
    ],
    "referralTriggers": [
      "Appearance of ANY clinical warning sign (severe abdominal pain, vomiting, lethargy)",
      "Narrowing pulse pressure (<=20 mmHg, e.g. BP 90/70 mmHg) or impalpable peripheral pulse",
      "Platelet count dropping below 20,000/µL or refractory rising hematocrit"
    ]
  },
  "jaundice": {
    "id": "jaundice",
    "name": "Jaundice & Acute Viral Hepatitis",
    "medicalName": "Hyperbilirubinemia & Acute Hepatic Inflammation",
    "category": "Common Illnesses",
    "subCategory": "Blood & Liver",
    "icdCode": "K72.0 / B15-B19",
    "datasetSource": "AASLD (American Association for the Study of Liver Diseases) & WHO Guidelines on Viral Hepatitis",
    "evidenceLevel": "Grade 1A (AASLD Clinical Practice Guidelines)",
    "overview": "Yellowish pigmentation of sclera, skin, and mucosa from serum bilirubin accumulation (>2.5-3.0 mg/dL) resulting from pre-hepatic, intra-hepatic, or post-hepatic pathology.",
    "symptoms": {
      "hallmark": [
        "Scleral icterus (yellowish discoloration visible in daylight) and golden-yellow skin",
        "Deep tea-colored or dark beer-colored urine containing bilirubin",
        "Pale, acholic (clay-colored) stools in obstructive/cholestatic patterns",
        "Severe generalized pruritus from cutaneous bile salt deposition"
      ],
      "earlySigns": [
        "Profound prodromal anorexia, sudden aversion to food and cigarette smoke",
        "Right upper quadrant dull aching pain and hepatic capsular stretch discomfort",
        "Low-grade fever, nausea, and marked physical fatigue"
      ],
      "redFlags": [
        "Asterixis (flapping tremor of outstretched dorsiflexed hands - hepatic encephalopathy)",
        "Reversal of day-night sleep cycle, confusion, agitation, or obtundation",
        "Spontaneous ecchymoses, epistaxis, or bleeding from venipuncture sites (prolonged INR > 1.5)",
        "Rapid shrinking of liver span on percussion (impending fulminant hepatic necrosis)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Serum Bilirubin (Total, Direct/Conjugated, and Indirect)",
        "type": "Laboratory Assay",
        "purpose": "Determines fractionation: Direct >50% confirms conjugated hepatic/cholestatic pattern; indirect >80% points to hemolysis",
        "urgency": "Priority / Within 6h"
      },
      {
        "testName": "Comprehensive Liver Panel: ALT, AST, Alkaline Phosphatase (ALP), GGT",
        "type": "Laboratory Assay",
        "purpose": "Transaminases >1,000 IU/L diagnostic of acute viral/ischemic/toxic hepatitis; ALP/GGT elevation points to biliary duct obstruction",
        "urgency": "Priority / Within 6h"
      },
      {
        "testName": "Acute Viral Hepatitis Serological Panel",
        "type": "Serology Assay",
        "purpose": "Anti-HAV IgM, HBsAg, Anti-HBc IgM, Anti-HCV RNA, Anti-HEV IgM; establishes precise etiologic organism",
        "urgency": "Priority"
      },
      {
        "testName": "Prothrombin Time (PT) and International Normalized Ratio (INR)",
        "type": "Coagulation Assay",
        "purpose": "MOST CRITICAL PROGNOSTIC PARAMETER: Directly reflects factor VII and hepatic synthetic capacity; INR >1.5 defines acute liver failure",
        "urgency": "Stat / Immediate"
      },
      {
        "testName": "High-Resolution Hepatobiliary Ultrasonography (USG)",
        "type": "Diagnostic Imaging",
        "purpose": "Rules out extrahepatic biliary obstruction (choledocholithiasis, common bile duct dilatation >6mm, mass lesions)",
        "urgency": "Priority / Within 12h"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Ursodeoxycholic Acid (UDCA)",
        "strength": "300 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Twice daily (BID)",
        "timing": "Post-meal with milk or food",
        "duration": "30 to 60 days",
        "regimenType": "Hepatoprotective Hydrophilic Choleretic",
        "clinicalNotes": "Displaces toxic hydrophobic bile acids, stabilizes hepatocyte and cholangiocyte canalicular membranes, and enhances biliary secretion."
      },
      {
        "drugName": "Phytomenadione (Vitamin K1)",
        "strength": "10 mg",
        "dosageForm": "Oral Tablet / Slow SC Injection",
        "frequency": "Once daily",
        "timing": "With main meal",
        "duration": "3 to 5 days",
        "regimenType": "Fat-Soluble Vitamin & Coagulation Cofactor",
        "clinicalNotes": "Differentiates cholestatic malabsorption of fat-soluble vitamins (INR normalizes after 48h) from true hepatic synthetic failure (INR remains elevated)."
      },
      {
        "drugName": "Silymarin (Purified Milk Thistle Flavonolignans)",
        "strength": "140 mg",
        "dosageForm": "Oral Capsule",
        "frequency": "Three times daily (TID)",
        "timing": "After meals",
        "duration": "30 days",
        "regimenType": "Antioxidant Hepatocyte Membrane Stabilizer",
        "clinicalNotes": "Inhibits lipid peroxidation, scavenges free radicals, and stimulates ribosomal RNA synthesis to promote hepatic regeneration."
      },
      {
        "drugName": "High-Carbohydrate, Low-Fat Medical Nutrition Therapy",
        "strength": "2,000-2,500 kcal/day (approx 70% carbohydrates)",
        "dosageForm": "Dietary Prescription",
        "frequency": "Small, frequent feedings (5-6 meals/day)",
        "timing": "Throughout waking hours",
        "duration": "Acute convalescent phase",
        "regimenType": "Metabolic Sparing Nutrition",
        "clinicalNotes": "Provides adequate glycogen stores, prevents gluconeogenic catabolism of amino acids, and minimizes biliary gallbladder contraction."
      }
    ],
    "complications": [
      "Acute liver failure with cerebral edema and herniation",
      "Hepatorenal syndrome type 1 (rapidly progressive oliguric renal failure)",
      "Severe coagulopathy and catastrophic spontaneous hemorrhage"
    ],
    "referralTriggers": [
      "Prolongation of INR >= 1.5 in any jaundiced patient (immediate tertiary liver transplant center transfer)",
      "Appearance of asterixis, confusion, or day-night reversal",
      "Serum bilirubin rising > 15 mg/dL or intractable vomiting with dehydration"
    ]
  },
  "asthma": {
    "id": "asthma",
    "name": "Asthma",
    "medicalName": "Bronchial Asthma & Acute Exacerbation",
    "category": "Common Illnesses",
    "subCategory": "Respiratory & Infections",
    "icdCode": "J45.9",
    "datasetSource": "GINA (Global Initiative for Asthma) 2025/2026 Guidelines & WHO Model List of Essential Medicines",
    "evidenceLevel": "Level 1A (GINA Global Strategy)",
    "overview": "Chronic inflammatory disorder of the conducting airways characterized by bronchial hyperresponsiveness, variable expiratory airflow limitation, and airway remodeling.",
    "symptoms": {
      "hallmark": [
        "Expiratory polyphonic wheezing heard throughout both lung fields",
        "Episodic shortness of breath provoked by cold air, viral triggers, or allergens",
        "Retrosternal chest tightness and nocturnal cough waking patient at 3-4 AM",
        "Prolonged expiratory phase with tachypnea"
      ],
      "earlySigns": [
        "Subtle nocturnal dry hacking cough without daytime symptoms",
        "Exertional breathlessness or limitation during sports/stairs",
        "Frequent throat clearing and nasal congestion (allergic triad)"
      ],
      "redFlags": [
        "Silent chest (complete disappearance of wheezing due to critical airflow reduction)",
        "Inability to complete full sentences in a single breath; speaking in single words",
        "Cyanosis, diaphoresis, exhaustion, or paradoxical thoracoabdominal breathing",
        "Peak Expiratory Flow (PEF) < 50% of personal best or predicted value"
      ]
    },
    "requiredTests": [
      {
        "testName": "Pre- and Post-Bronchodilator Spirometry",
        "type": "Pulmonary Function Test",
        "purpose": "Hallmark diagnostic criteria: FEV1/FVC < 0.70 with FEV1 reversibility >= 12% and >= 200 mL after 400 mcg inhaled salbutamol",
        "urgency": "Priority / Within 24-48h"
      },
      {
        "testName": "Peak Expiratory Flow (PEF) Diurnal Variability Diary",
        "type": "Point of Care / Home Monitoring",
        "purpose": "Twice daily monitoring; diurnal variability > 10% in adults supports asthma diagnosis",
        "urgency": "Routine"
      },
      {
        "testName": "Fractional Exhaled Nitric Oxide (FeNO)",
        "type": "Biomarker Assay",
        "purpose": "FeNO > 35-50 ppb identifies active eosinophilic Type-2 airway inflammation; predicts ICS responsiveness",
        "urgency": "Routine"
      },
      {
        "testName": "Chest Radiograph (PA View)",
        "type": "Diagnostic Imaging",
        "purpose": "Assesses hyperinflation; crucial to exclude pneumothorax, pneumomediastinum, or foreign body in acute exacerbation",
        "urgency": "Priority if severe"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Budesonide + Formoterol Fumarate DPI / MDI",
        "strength": "(160 mcg + 4.5 mcg) or (200 mcg + 6 mcg) per puff",
        "dosageForm": "Dry Powder Inhaler (DPI) / MDI with Spacer",
        "frequency": "1 to 2 puffs BID + 1 puff PRN for symptom relief (MART Regimen)",
        "timing": "Morning and evening; rinse mouth thoroughly with water after inhalation",
        "duration": "Long-term ongoing controller therapy",
        "regimenType": "GINA Track 1 Preferred Controller & Reliever (ICS-Formoterol)",
        "clinicalNotes": "Simultaneously treats inflammation and acute bronchospasm. Significantly lowers severe exacerbation risk compared to SABA monotherapy."
      },
      {
        "drugName": "Salbutamol (Albuterol) Sulfate MDI",
        "strength": "100 mcg per metered actuation",
        "dosageForm": "Pressurized Inhaler with Spacer Device",
        "frequency": "2 to 4 puffs every 4 hours as needed (SOS)",
        "timing": "During acute wheeze or 15 mins before exercise",
        "duration": "Rescue SOS use",
        "regimenType": "Short-Acting Beta-2 Agonist (SABA) Rescue",
        "clinicalNotes": "Rapid bronchodilation within 5 mins; over-reliance (>3 canisters/year) indicates poor controller compliance and increased mortality."
      },
      {
        "drugName": "Prednisolone Oral Burst",
        "strength": "40 mg once daily",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily in the morning",
        "timing": "After breakfast",
        "duration": "5 days strictly (no tapering required)",
        "regimenType": "Systemic Corticosteroid for Moderate-to-Severe Exacerbation",
        "clinicalNotes": "Rapidly suppresses airway mucosal edema and eosinophilic recruitment; short 5-day course avoids adrenal axis suppression."
      },
      {
        "drugName": "Montelukast Sodium",
        "strength": "10 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily at bedtime",
        "timing": "Night with or without food",
        "duration": "30 to 90 days",
        "regimenType": "Leukotriene Receptor Antagonist (LTRA)",
        "clinicalNotes": "Excellent adjunct for exercise-induced bronchospasm and concurrent allergic rhinitis. Monitor for rare neuropsychiatric mood changes."
      }
    ],
    "complications": [
      "Status Asthmaticus refractory to nebulized bronchodilators requiring ICU mechanical ventilation",
      "Pneumothorax and pneumomediastinum from alveolar rupture",
      "Permanent fixed airflow limitation from bronchial wall remodeling"
    ],
    "referralTriggers": [
      "Failure to achieve asthma control despite GINA Step 4 high-dose ICS-LABA (refer to Pulmonologist for biologic therapy: Dupilumab, Omalizumab)",
      "Frequent oral corticosteroid bursts (>=2 courses/year)",
      "Life-threatening exacerbation history (previous intubation or ICU admission)"
    ]
  },
  "malaria": {
    "id": "malaria",
    "name": "Malaria",
    "medicalName": "Plasmodium Falciparum & Plasmodium Vivax Infection",
    "category": "Common Illnesses",
    "subCategory": "Fever & Mosquito-Borne",
    "icdCode": "B50 / B51",
    "datasetSource": "WHO Guidelines for Malaria 2025/2026 & CDC Malaria Protocols",
    "evidenceLevel": "Grade 1A (WHO Core Treatment Guidelines)",
    "overview": "Protozoan intraerythrocytic parasitic infection transmitted by female Anopheles mosquitoes; P. falciparum responsible for nearly all severe and fatal disease.",
    "symptoms": {
      "hallmark": [
        "Classical malarial paroxysm: Cold stage (intense rigors) -> Hot stage (spiking pyrexia to 40.5°C) -> Sweating stage (drenching diaphoresis)",
        "Tertian (every 48 hours for P. falciparum/vivax) or quartan fever periodicity",
        "Hepatosplenomegaly with left hypochondrial fullness",
        "Mild scleral icterus and hemolytic anemia"
      ],
      "earlySigns": [
        "Nonspecific prodrome: throbbing frontal headache, generalized myalgia, anorexia",
        "Nausea, orthostatic lightheadedness, and dry cough",
        "Subtle conjunctival and palmar pallor"
      ],
      "redFlags": [
        "Cerebral Malaria: Impaired consciousness, unarousable coma (Glasgow Coma Scale < 11), repetitive generalized seizures",
        "Severe normocytic anemia (Hemoglobin < 7 g/dL or Hematocrit < 20%)",
        "Acute Kidney Injury (Serum Creatinine > 3.0 mg/dL or oliguria < 400 mL/day)",
        "Lactic Acidosis (Arterial pH < 7.35 or Venous Lactate > 5.0 mmol/L) with deep acidotic Kussmaul breathing",
        "Hemoglobinuria ('blackwater fever' with dark mahogany urine)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Peripheral Blood Smear (Thick and Thin Films)",
        "type": "Microscopy Gold Standard",
        "purpose": "Thick smear determines parasite presence and quantification (parasitemia %); thin smear identifies species (P. falciparum ring forms vs P. vivax schizonts)",
        "urgency": "Stat / Immediate"
      },
      {
        "testName": "Malaria Rapid Diagnostic Test (RDT)",
        "type": "Point of Care Lateral Flow",
        "purpose": "Detects P. falciparum HRP-2 (Histidine-Rich Protein II) and Pan-Plasmodium pLDH (Lactate Dehydrogenase)",
        "urgency": "Stat"
      },
      {
        "testName": "Complete Blood Count (CBC) with Platelets",
        "type": "Laboratory Assay",
        "purpose": "Assesses normocytic hemolytic anemia and profound thrombocytopenia (<50,000/µL)",
        "urgency": "Stat"
      },
      {
        "testName": "Point-of-Care Blood Glucose & Blood Gas / Serum Lactate",
        "type": "Point of Care Assay",
        "purpose": "MANDATORY: Screens for life-threatening hyperparasitemia-induced hypoglycemia (<40 mg/dL) and lactic acidosis",
        "urgency": "Stat"
      },
      {
        "testName": "Glucose-6-Phosphate Dehydrogenase (G6PD) Qualitative Assay",
        "type": "Enzymatic Screen",
        "purpose": "MANDATORY before administering Primaquine for P. vivax radical cure to prevent catastrophic acute hemolytic crisis",
        "urgency": "Priority / Before Radical Cure"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Artemether + Lumefantrine (ACT)",
        "strength": "20 mg / 120 mg per tablet (Adult dose: 4 tablets per dose)",
        "dosageForm": "Oral Tablet",
        "frequency": "6-dose regimen over 60 hours: Doses at 0h, 8h, 24h, 36h, 48h, and 60h",
        "timing": "MANDATORY: Administer with fatty meal or full-cream milk to ensure bioavailability of lumefantrine",
        "duration": "3 days (complete 6 doses)",
        "regimenType": "WHO First-Line Artemisinin-Based Combination Therapy (ACT)",
        "clinicalNotes": "Artemether rapidly reduces parasite biomass within 24-48h; lumefantrine clears residual parasites preventing recrudescence."
      },
      {
        "drugName": "Artesunate IV",
        "strength": "2.4 mg/kg IV reconstituted in sodium bicarbonate and normal saline",
        "dosageForm": "IV Injection",
        "frequency": "At 0 hours, 12 hours, and 24 hours, then once daily (OD)",
        "timing": "Slow IV bolus over 2-3 mins",
        "duration": "Minimum 24 hours until patient can tolerate oral ACT",
        "regimenType": "LIFESAVING GOLD STANDARD FOR SEVERE MALARIA",
        "clinicalNotes": "Significantly superior survival over IV Quinine (SEAQUAMAT and AQUAMAT trials). Monitor for delayed post-artesunate hemolytic anemia at days 7-21."
      },
      {
        "drugName": "Primaquine Phosphate (for P. vivax / P. ovale Radical Cure)",
        "strength": "0.25 to 0.5 mg/kg base (15 to 30 mg base daily)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "After meals",
        "duration": "14 days",
        "regimenType": "Hypnozoitocidal Radical Cure",
        "clinicalNotes": "Destroys dormant liver hypnozoites in P. vivax preventing relapses. CONTRAINDICATION: Severe G6PD deficiency and pregnancy (causes massive intravascular hemolysis)."
      },
      {
        "drugName": "Paracetamol (Acetaminophen)",
        "strength": "650 mg",
        "dosageForm": "Oral Tablet / IV",
        "frequency": "Every 6 hours as needed (SOS)",
        "timing": "Post-meal",
        "duration": "3 days",
        "regimenType": "Antipyretic",
        "clinicalNotes": "Avoid NSAIDs due to coexisting thrombocytopenia and hemorrhagic risks."
      }
    ],
    "complications": [
      "Cerebral malaria with irreversible brain injury and high case-fatality rate",
      "Acute Respiratory Distress Syndrome (ARDS) from alveolar-capillary leakage",
      "Massive intravascular hemolysis and acute hemoglobinuric tubular necrosis"
    ],
    "referralTriggers": [
      "Any criteria of Severe Malaria (impaired sensorium, jaundice + oliguria, parasitemia > 5%)",
      "Failure of clinical improvement or rising parasitemia at 48 hours of ACT",
      "Spontaneous bleeding or profound thrombocytopenia (<20,000/µL)"
    ]
  },
  "tuberculosis": {
    "id": "tuberculosis",
    "name": "Tuberculosis",
    "medicalName": "Pulmonary & Extrapulmonary Tuberculosis (Mycobacterium tuberculosis)",
    "category": "Common Illnesses",
    "subCategory": "Respiratory & Infections",
    "icdCode": "A15-A19",
    "datasetSource": "WHO Consolidated Guidelines on Tuberculosis 2025/2026 & Stop TB Global Protocols",
    "evidenceLevel": "Grade 1A (WHO Standard of Care)",
    "overview": "Chronic granulomatous infectious disease caused by Mycobacterium tuberculosis complex transmitting via airborne aerosol droplet nuclei.",
    "symptoms": {
      "hallmark": [
        "Persistent productive cough with mucopurulent sputum lasting >= 2 weeks",
        "Low-grade diurnal evening pyrexia (typically 37.8-38.5°C)",
        "Drenching night sweats soaking nightclothes and bed linens",
        "Progressive unintentional weight loss and profound asthenia"
      ],
      "earlySigns": [
        "Mild intermittent dry hacking cough misdiagnosed as smoker's cough",
        "Postprandial anorexia and gradual loss of subcutaneous fat",
        "Exertional dyspnea and localized wheeze or crepitations"
      ],
      "redFlags": [
        "Massive hemoptysis (>200 mL/24h) from ruptured Rasmussen's aneurysm in tuberculous cavity",
        "Tuberculous Meningitis: headache, persistent vomiting, neck stiffness, cranial nerve VI palsy",
        "Tension pneumothorax from subpleural caseous necrotic cavitation rupture",
        "Spinal Tuberculosis (Pott's Spine): acute paraparesis, gibbus deformity, and cauda equina compression"
      ]
    },
    "requiredTests": [
      {
        "testName": "GeneXpert MTB/RIF Ultra Molecular Automated Assay",
        "type": "Cartridge-Based Nucleic Acid Amplification (CBNAAT)",
        "purpose": "WHO-recommended primary diagnostic test: simultaneously identifies M. tuberculosis DNA and Rifampicin resistance (rpoB gene mutations) in <2 hours",
        "urgency": "Priority / Within 24h"
      },
      {
        "testName": "Fluorescence Acid-Fast Bacilli (AFB) Sputum Smear Microscopy",
        "type": "Microbiology Microscopy",
        "purpose": "Auramine-O staining or Ziehl-Neelsen staining on spot and early morning sputum specimens to quantify infectious bacillary burden",
        "urgency": "Priority"
      },
      {
        "testName": "Posterior-Anterior (PA) Chest Radiograph",
        "type": "Diagnostic Imaging",
        "purpose": "Hallmarks: Apical and posterior segment upper lobe fibrocavitary infiltrates, hilar adenopathy, pleural effusion, or miliary micronodules",
        "urgency": "Priority"
      },
      {
        "testName": "Liquid Mycobacterial Culture (MGIT 960 System) & Phenotypic DST",
        "type": "Microbiology Gold Standard",
        "purpose": "Automated liquid culture isolates viable bacilli and confirms phenotypic drug susceptibility to first- and second-line anti-TB agents",
        "urgency": "Routine"
      },
      {
        "testName": "Baseline Liver Function Tests (LFT) & Serum Creatinine",
        "type": "Laboratory Assay",
        "purpose": "MANDATORY BASELINE: Screens baseline transaminases and renal function before starting hepatotoxic regimen (Isoniazid, Rifampicin, Pyrazinamide)",
        "urgency": "Stat / Before Starting ATT"
      }
    ],
    "prescriptions": [
      {
        "drugName": "4-Drug Fixed Dose Combination (4-FDC: H-R-Z-E)",
        "strength": "Isoniazid 75mg + Rifampicin 150mg + Pyrazinamide 400mg + Ethambutol 275mg per tablet (3-5 tablets based on weight band)",
        "dosageForm": "Oral Fixed-Dose Combination Tablet",
        "frequency": "Once daily (OD) in morning",
        "timing": "Strictly on an empty stomach with plain water >= 1 hour before breakfast",
        "duration": "2 months (Intensive Phase: 56 daily doses)",
        "regimenType": "WHO Standard Intensive Phase Regimen",
        "clinicalNotes": "Directly Observed Therapy (DOTS). Rifampicin imparts harmless bright orange-red discoloration to urine and tears; Pyrazinamide may cause hyperuricemic arthralgia."
      },
      {
        "drugName": "3-Drug Fixed Dose Combination (3-FDC: H-R-E) or 2-FDC (H-R)",
        "strength": "Isoniazid 75mg + Rifampicin 150mg (+ Ethambutol 275mg) per tablet (3-5 tablets based on weight band)",
        "dosageForm": "Oral Fixed-Dose Combination Tablet",
        "frequency": "Once daily (OD) in morning",
        "timing": "Strictly on an empty stomach with plain water >= 1 hour before breakfast",
        "duration": "4 months (Continuation Phase: 112 daily doses)",
        "regimenType": "WHO Standard Continuation Phase Regimen",
        "clinicalNotes": "Sterilizes persistent semi-dormant bacillary persisters, preventing disease relapse and secondary emergence of drug resistance."
      },
      {
        "drugName": "Pyridoxine Hydrochloride (Vitamin B6)",
        "strength": "25 to 50 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "Morning with breakfast",
        "duration": "6 months (throughout entire anti-TB treatment)",
        "regimenType": "Neuroprotective Chemoprophylaxis",
        "clinicalNotes": "MANDATORY CO-PRESCRIPTION: Prevents Isoniazid-induced competitive inhibition of pyridoxine kinase and severe painful peripheral sensory neuropathy."
      }
    ],
    "complications": [
      "Multidrug-Resistant TB (MDR-TB: resistant to both Isoniazid and Rifampicin) requiring 9-18 month bedaquiline regimens",
      "Extensive pulmonary fibrosis, traction bronchiectasis, and chronic respiratory insufficiency",
      "Drug-Induced Liver Injury (DILI): Stop ATT immediately if transaminases rise > 5x ULN or > 3x with jaundice"
    ],
    "referralTriggers": [
      "GeneXpert positive for Rifampicin resistance (immediate transfer to Drug-Resistant TB Center)",
      "Hemoptysis >= 100 mL/day (urgent bronchial artery embolization / thoracic surgery)",
      "Failure of sputum smear conversion from positive to negative at completion of month 2"
    ]
  },
  "food-poisoning": {
    "id": "food-poisoning",
    "name": "Food Poisoning & Acute Gastroenteritis",
    "medicalName": "Acute Infectious Gastroenteritis & Enterotoxin Toxicosis",
    "category": "Common Illnesses",
    "subCategory": "Stomach & Digestion",
    "icdCode": "A05 / K52.9",
    "datasetSource": "CDC Foodborne Diseases Guidance, WHO Food Safety & ACG Gastroenteritis Guidelines",
    "evidenceLevel": "Grade 1A (ACG Clinical Consensus)",
    "overview": "Acute mucosal inflammation and secretomotor disturbance of the gastrointestinal tract caused by preformed bacterial toxins (S. aureus, B. cereus) or invasive enteric pathogens.",
    "symptoms": {
      "hallmark": [
        "Abrupt onset frequent loose watery stools (>=4-10 episodes within 24 hours)",
        "Paroxysmal spasmodic periumbilical and lower quadrant colicky abdominal pain",
        "Nausea and repetitive bouts of non-bilious or bilious vomiting",
        "Subjective chills, low-grade fever, and hyperactive bowel sounds (borborygmi)"
      ],
      "earlySigns": [
        "Sudden epigastric heaviness, excessive salivation, and malaise within 2-8 hours of suspect meal",
        "Diffuse bloated feeling and frequent eructations",
        "Dryness of lips and oral mucosa"
      ],
      "redFlags": [
        "Gross hematochezia or dysentery (frank macroscopic blood and mucus in stool)",
        "Severe orthostatic dizziness, lightheadedness, or syncope (intravascular volume contraction)",
        "Signs of Severe Dehydration: sunken eyeballs, lost skin turgor (tenting), oliguria/anuria > 8 hours",
        "Persistent high pyrexia (>38.5°C) with rigid abdominal guarding"
      ]
    },
    "requiredTests": [
      {
        "testName": "Stool Routine and Microscopic Examination",
        "type": "Microbiology Microscopy",
        "purpose": "Detects fecal leukocytes (>10 pus cells/hpf indicates invasive mucosal bacterial enteritis), RBCs, and protozoan cysts/trophozoites",
        "urgency": "Priority / Within 6h"
      },
      {
        "testName": "Comprehensive Serum Electrolytes, BUN, and Creatinine",
        "type": "Laboratory Assay",
        "purpose": "Evaluates prerenal azotemia (BUN/Creatinine ratio > 20:1), hypokalemia, and hypochloremic metabolic alkalosis/acidosis",
        "urgency": "Priority / Within 6h"
      },
      {
        "testName": "Multiplex Stool Enteric Pathogen PCR Panel",
        "type": "Molecular Assay",
        "purpose": "Identifies Salmonella, Shigella, Campylobacter, Shiga-toxin producing E. coli (STEC), Norovirus, and C. difficile toxin genes",
        "urgency": "Routine"
      }
    ],
    "prescriptions": [
      {
        "drugName": "WHO Low-Osmolarity Oral Rehydration Salts (ORS)",
        "strength": "20.5 g sachet in 1 L potable water (Osmolarity 245 mOsm/L)",
        "dosageForm": "Oral Electrolyte Solution",
        "frequency": "200 to 400 mL replacement after every loose stool episode",
        "timing": "Sipped slowly in small frequent sips",
        "duration": "3 to 5 days until diarrhea resolves",
        "regimenType": "CORNERSTONE LIFESAVING THERAPY",
        "clinicalNotes": "Leverages intact SGLT-1 intestinal brush border sodium-glucose co-transport to drive massive water reabsorption into enterocytes."
      },
      {
        "drugName": "Ondansetron Hydrochloride",
        "strength": "4 to 8 mg",
        "dosageForm": "Orally Disintegrating Tablet (ODT) / Slow IV",
        "frequency": "Every 8 hours as needed (SOS)",
        "timing": "Place on tongue 15 mins prior to oral fluids",
        "duration": "1 to 2 days maximum",
        "regimenType": "Potent 5-HT3 Receptor Antagonist Antiemetic",
        "clinicalNotes": "Blocks peripheral vagal afferents and central chemoreceptor trigger zone; aborts emesis allowing successful oral rehydration."
      },
      {
        "drugName": "Zinc Sulfate Monohydrate",
        "strength": "20 mg elemental zinc",
        "dosageForm": "Oral Tablet / Syrup",
        "frequency": "Once daily (OD)",
        "timing": "Post-meal",
        "duration": "14 days",
        "regimenType": "Enterocyte Regenerative Micronutrient",
        "clinicalNotes": "WHO recommendation: Promotes intestinal brush border villous regeneration, reduces diarrhea duration by 25%, and prevents recurrence."
      },
      {
        "drugName": "Ciprofloxacin HCl (or Azithromycin 500 mg OD)",
        "strength": "500 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Twice daily (BID)",
        "timing": "With water 2 hours after meals",
        "duration": "3 days strictly",
        "regimenType": "Empiric Fluoroquinolone (Strictly Reserved for Febrile/Invasive Dysentery)",
        "clinicalNotes": "Indicated strictly if macroscopic blood in stool or fever > 38.5°C. CONTRAINDICATION: Avoid if suspected STEC (O157:H7) as antibiotics induce Shiga toxin release triggering Hemolytic Uremic Syndrome (HUS)."
      }
    ],
    "complications": [
      "Severe acute hypovolemic shock and prerenal acute tubular necrosis",
      "Hemolytic Uremic Syndrome (microangiopathic hemolytic anemia, thrombocytopenia, AKI) with STEC",
      "Post-infectious Reactive Arthritis (Reiter's syndrome) following Salmonella or Shigella"
    ],
    "referralTriggers": [
      "Inability to retain any oral fluids for >12 hours despite antiemetics",
      "Signs of severe shock (systolic BP < 90 mmHg, cold extremities, confusion)",
      "Bloody diarrhea in elderly or immunocompromised patients"
    ]
  },
  "stomach-infections": {
    "id": "stomach-infections",
    "name": "Stomach Infections & Peptic Ulcer Disease",
    "medicalName": "Helicobacter pylori Gastritis & Peptic Ulcer Disease",
    "category": "Common Illnesses",
    "subCategory": "Stomach & Digestion",
    "icdCode": "K25 / K29.7",
    "datasetSource": "ACG Clinical Guideline for H. Pylori Infection & Maastricht VI / Florence European Consensus",
    "evidenceLevel": "Grade 1A (Maastricht VI Consensus)",
    "overview": "Gastric mucosal disruption and peptic ulceration primarily driven by Helicobacter pylori colonization and NSAID-induced prostaglandin inhibition.",
    "symptoms": {
      "hallmark": [
        "Burning or gnawing epigastric pain (duodenal ulcers: relieved by meals; gastric ulcers: precipitated by meals)",
        "Nocturnal epigastric pain awakening patient between midnight and 3 AM",
        "Postprandial early satiety, epigastric fullness, and persistent belching",
        "Nausea and intermittent waterbrash (sour fluid regurgitation)"
      ],
      "earlySigns": [
        "Epigastric ache occurring 2 to 3 hours after meals",
        "Recurrent non-cardiac chest and substernal burning",
        "Transient relief with over-the-counter antacids"
      ],
      "redFlags": [
        "Hematemesis (frank bright red blood or coffee-ground vomitus)",
        "Melena (tarry, sticky, foul-smelling black stools indicating upper GI bleed)",
        "Sudden catastrophic severe generalized peritonitis (ulcer perforation into peritoneal cavity)",
        "Gastric Outlet Obstruction: persistent projectile vomiting of undigested food eaten hours earlier",
        "Unintentional profound weight loss and progressive dysphagia"
      ]
    },
    "requiredTests": [
      {
        "testName": "13C-Urea Breath Test (UBT) or Stool Antigen Test (HpSA)",
        "type": "Diagnostic Non-Invasive Assay",
        "purpose": "Gold standard non-invasive test for active H. pylori infection; sensitivity/specificity >95%. MANDATORY: Must be off PPI for >=2 weeks and antibiotics for >=4 weeks",
        "urgency": "Routine / Outpatient"
      },
      {
        "testName": "Esophagogastroduodenoscopy (Upper GI Endoscopy / EGD)",
        "type": "Endoscopic Gold Standard",
        "purpose": "Direct mucosal visualization of ulcer crater, Forrest classification staging for bleeding ulcers, and targeted antral/corpus mucosal biopsies",
        "urgency": "Stat if bleeding / Priority"
      },
      {
        "testName": "Rapid Urease Test (RUT / CLO Test) on Endoscopic Biopsy",
        "type": "Point of Care Tissue Test",
        "purpose": "Colorimetric change within 1-2 hours confirms active bacterial urease enzyme production",
        "urgency": "Immediate during EGD"
      },
      {
        "testName": "Serum Ferritin & Complete Blood Count (CBC)",
        "type": "Laboratory Assay",
        "purpose": "Identifies microcytic hypochromic iron deficiency anemia from chronic occult mucosal weeping",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Bismuth Quadruple Therapy Regimen (14-Day Protocol)",
        "strength": "Esomeprazole 40mg BID + Bismuth Subsalicylate 300mg QID + Metronidazole 500mg TID/QID + Tetracycline HCl 500mg QID",
        "dosageForm": "Oral Multi-Agent Protocol",
        "frequency": "PPI: twice daily before meals; Bismuth, Metronidazole, Tetracycline: four times daily with meals and bedtime",
        "timing": "PPI 30-60 mins before breakfast & dinner; antibiotics with meals",
        "duration": "14 days strictly",
        "regimenType": "ACG & Maastricht VI Preferred First-Line Eradication Therapy",
        "clinicalNotes": "Overcomes high global clarithromycin resistance (>15-20%). Achieves >90% eradication. Counsel patient on harmless black discoloration of tongue and stool from bismuth."
      },
      {
        "drugName": "Esomeprazole Magnesium (or Pantoprazole)",
        "strength": "40 mg",
        "dosageForm": "Delayed-Release Oral Tablet / IV",
        "frequency": "Once or twice daily",
        "timing": "30 to 60 minutes before breakfast",
        "duration": "4 to 8 weeks after eradication protocol",
        "regimenType": "Potent Proton Pump Inhibitor (PPI)",
        "clinicalNotes": "Maintains intragastric pH > 6 to promote rapid ulcer healing and re-epithelialization of mucosal craters."
      },
      {
        "drugName": "Sucralfate Oral Suspension",
        "strength": "1.0 g / 10 mL",
        "dosageForm": "Oral Suspension",
        "frequency": "Four times daily (QID)",
        "timing": "1 hour before meals and at bedtime on an empty stomach",
        "duration": "4 weeks",
        "regimenType": "Cytoprotective Mucosal Barrier Binder",
        "clinicalNotes": "Polymerizes in acidic environment into viscous paste that selectively binds positively charged proteins in ulcer crater, forming mechanical shield."
      }
    ],
    "complications": [
      "Catastrophic acute upper gastrointestinal hemorrhage from erosion into gastroduodenal artery",
      "Acute free peritoneal perforation with pneumoperitoneum and septic peritonitis",
      "Gastric MALT lymphoma and intestinal-type gastric adenocarcinoma secondary to chronic H. pylori"
    ],
    "referralTriggers": [
      "Any evidence of hematemesis or melena (immediate emergency endoscopic hemostasis: clipping/thermal)",
      "Acute rigid, silent, board-like abdomen (emergency exploratory laparotomy for Graham patch repair)",
      "Persistent symptoms post-eradication in patient age > 55 with alarm features"
    ]
  },
  "urinary-infections": {
    "id": "urinary-infections",
    "name": "Urinary Tract Infections",
    "medicalName": "Acute Cystitis & Acute Pyelonephritis",
    "category": "Common Illnesses",
    "subCategory": "Kidneys & Urinary",
    "icdCode": "N39.0 / N10",
    "datasetSource": "IDSA (Infectious Diseases Society of America) Guidelines for Acute Uncomplicated Cystitis & Pyelonephritis & EAU",
    "evidenceLevel": "Grade 1A (IDSA Global Guidelines)",
    "overview": "Urothelial inflammatory response to bacterial invasion (Uropathogenic E. coli in 75-95%) spanning from lower bladder mucosal cystitis to parenchymal pyelonephritis.",
    "symptoms": {
      "hallmark": [
        "Severe scalding or burning dysuria during and immediately after micturition",
        "Urinary urgency (sudden compelling urge to urinate that is difficult to defer)",
        "Frequency (frequent voiding of small volumes every 15-30 minutes)",
        "Suprapubic aching tenderness and cloudy, turbid, malodorous urine"
      ],
      "earlySigns": [
        "Mild urethral irritation at termination of urination",
        "Nocturia awakening patient from sleep",
        "Microscopic or terminal pinkish hematuria"
      ],
      "redFlags": [
        "Costovertebral angle (CVA) tenderness or severe unilateral loin/flank pain",
        "High spiking fever (>38.5°C) with shaking rigors and nausea/vomiting (Acute Pyelonephritis)",
        "Urosepsis: Hypotension (systolic BP < 90 mmHg), altered mental state, tachypnea",
        "Acute urinary retention in elderly males with prostatic enlargement"
      ]
    },
    "requiredTests": [
      {
        "testName": "Urine Routine and Microscopic Examination",
        "type": "Urinalysis",
        "purpose": "Hallmark findings: Significant pyuria (>10 WBC/hpf or >25 WBC/µL uncentrifuged), bacteriuria, positive leukocyte esterase, and positive nitrite (enterobacteria)",
        "urgency": "Stat / Immediate"
      },
      {
        "testName": "Quantitative Clean-Catch Midstream Urine Culture & DST",
        "type": "Microbiology Gold Standard",
        "purpose": "Significant bacteriuria: >= 10^5 CFU/mL in asymptomatic; >= 10^3 CFU/mL in symptomatic females; isolates UPEC and tests susceptibility",
        "urgency": "Priority / Before Antibiotics"
      },
      {
        "testName": "Serum Creatinine, BUN, and Complete Blood Count (CBC)",
        "type": "Laboratory Assay",
        "purpose": "Essential if upper tract symptoms (pyelonephritis) present to evaluate renal parenchymal impairment and leukocytosis with left shift",
        "urgency": "Priority if febrile"
      },
      {
        "testName": "Ultrasound of Kidneys, Ureters, and Bladder (USG KUB)",
        "type": "Diagnostic Imaging",
        "purpose": "Indicated in complicated/recurrent UTI or pyelonephritis to rule out obstructive calculus, hydronephrosis, or perinephric abscess",
        "urgency": "Priority / Within 24h"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Nitrofurantoin Monohydrate / Macrocrystals",
        "strength": "100 mg",
        "dosageForm": "Oral Capsule",
        "frequency": "Twice daily (BID)",
        "timing": "Take with meals or milk to enhance bioavailability and minimize nausea",
        "duration": "5 days",
        "regimenType": "IDSA First-Line Agent for Acute Uncomplicated Cystitis",
        "clinicalNotes": "Concentrates exclusively in urine with negligible serum levels; preserves bowel and vaginal flora. CONTRAINDICATION: Ineffective in pyelonephritis (insufficient tissue levels) and contraindicated if eGFR < 30 mL/min."
      },
      {
        "drugName": "Fosfomycin Trometamol",
        "strength": "3.0 g",
        "dosageForm": "Granules for Oral Solution Sachet",
        "frequency": "Single dose therapy",
        "timing": "Dissolve in 100 mL cold water; take at bedtime after emptying bladder",
        "duration": "Single Dose",
        "regimenType": "IDSA First-Line Single-Dose Bactericidal Agent",
        "clinicalNotes": "Inhibits MurA bacterial cell wall synthesis. Exceptional compliance; maintains bactericidal urinary levels for >48 hours; active against ESBL E. coli."
      },
      {
        "drugName": "Phenazopyridine Hydrochloride",
        "strength": "200 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Three times daily (TID)",
        "timing": "After meals with a full glass of water",
        "duration": "Maximum 2 days strictly",
        "regimenType": "Urinary Tract Mucosal Analgesic",
        "clinicalNotes": "Provides rapid symptomatic relief of severe burning dysuria. CRITICAL COUNSELING: Discolors urine and tears bright reddish-orange; discolors contact lenses."
      },
      {
        "drugName": "Ceftriaxone Sodium (for Acute Pyelonephritis)",
        "strength": "1.0 g",
        "dosageForm": "IV Infusion",
        "frequency": "Once daily (OD)",
        "timing": "Slow IV infusion over 30 mins in 100 mL NS",
        "duration": "7 to 10 days (switch to oral ciprofloxacin when afebrile)",
        "regimenType": "First-Line Parenteral Cephalosporin for Acute Pyelonephritis",
        "clinicalNotes": "Achieves high renal parenchymal tissue concentrations; excellent activity against community enterobacteriaceae."
      }
    ],
    "complications": [
      "Perinephric abscess or emphysematous pyelonephritis in poorly controlled diabetics",
      "Severe Gram-negative urosepsis and endotoxic shock",
      "Chronic renal scarring and secondary hypertension following recurrent childhood pyelonephritis"
    ],
    "referralTriggers": [
      "High fever with flank pain failing to improve after 48-72 hours of IV antibiotics (urgent contrast CT to rule out renal abscess)",
      "Presence of obstructing ureteral calculus with infection (emergency urologic decompression via ureteral JJ stent or nephrostomy)",
      "Recurrent UTI (>=3 episodes/year) requiring cystoscopy and urologic evaluation"
    ]
  },
  "diabetes": {
    "id": "diabetes",
    "name": "Diabetes Mellitus (Type 2)",
    "medicalName": "Type 2 Diabetes Mellitus & Metabolic Syndrome",
    "category": "Other Health Problems",
    "subCategory": "Blood Sugar & Hormones",
    "icdCode": "E11.9",
    "datasetSource": "ADA (American Diabetes Association) Standards of Care in Diabetes 2026 & EASD",
    "evidenceLevel": "Grade A (ADA Clinical Practice Recommendations)",
    "overview": "Complex progressive metabolic disorder defined by insulin resistance, progressive pancreatic beta-cell secretory defect, and chronic hyperglycemia promoting microvascular and macrovascular pathology.",
    "symptoms": {
      "hallmark": [
        "Polyuria (excessive urination from osmotic diuresis) and nocturia",
        "Polydipsia (intense thirst secondary to hyperosmolarity)",
        "Polyphagia (compensatory cellular hunger) accompanied by unprovoked weight loss",
        "Transient blurred vision due to hyperosmolar lens swelling"
      ],
      "earlySigns": [
        "Profound postprandial somnolence and chronic fatigue",
        "Acanthosis nigricans (velvety hyperpigmented cutaneous plaques on neck and axillae)",
        "Recurrent cutaneous candidiasis, balanitis, or vulvovaginitis",
        "Slow-healing minor cuts and paresthesias in distal lower extremities"
      ],
      "redFlags": [
        "Hyperglycemic Hyperosmolar State (HHS): Blood glucose >600 mg/dL, serum osmolarity >320 mOsm/kg, profound dehydration, stupor/coma",
        "Diabetic Ketoacidosis (DKA): Kussmaul respirations, fruity acetone breath, abdominal pain, ketonuria",
        "Infected diabetic foot ulcer with ascending lymphangitis, crepitus, or probe-to-bone depth",
        "Sudden monocular visual loss (vitreous hemorrhage or retinal detachment)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Glycated Hemoglobin (HbA1c Assay via NGSP Standard)",
        "type": "Laboratory Assay",
        "purpose": "Diagnostic threshold >= 6.5%; general adult glycemic target < 7.0% (individualized: 6.5% for young/fit, <8.0% for frail elderly)",
        "urgency": "Priority / Routine"
      },
      {
        "testName": "Fasting Plasma Glucose (FPG) & 2-Hour 75g OGTT",
        "type": "Laboratory Assay",
        "purpose": "Fasting >= 8h: Diagnostic threshold >= 126 mg/dL (7.0 mmol/L); 2h OGTT >= 200 mg/dL (11.1 mmol/L) confirmed on repeat testing",
        "urgency": "Priority"
      },
      {
        "testName": "Spot Urine Albumin-to-Creatinine Ratio (uACR)",
        "type": "Urinalysis Biomarker",
        "purpose": "Annual mandatory nephropathy screen: Normal < 30 mg/g; Microalbuminuria 30-300 mg/g; Macroalbuminuria > 300 mg/g",
        "urgency": "Routine / Annual"
      },
      {
        "testName": "Serum Creatinine with CKD-EPI Estimated GFR (eGFR)",
        "type": "Laboratory Assay",
        "purpose": "Evaluates cardiorenal baseline; guides metformin and SGLT2i dosing safety thresholds",
        "urgency": "Priority"
      },
      {
        "testName": "Dilated Fundus Examination by Ophthalmologist",
        "type": "Specialist Evaluation",
        "purpose": "Screens for non-proliferative/proliferative diabetic retinopathy and clinically significant macular edema (CSME)",
        "urgency": "Annual Routine"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Metformin Hydrochloride Extended-Release (ER)",
        "strength": "500 to 1,000 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once or twice daily (BID)",
        "timing": "Take with evening meal to minimize gastrointestinal distress",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "Foundational First-Line Biguanide Insulin Sensitizer",
        "clinicalNotes": "Inhibits hepatic gluconeogenesis via AMPK activation; weight-neutral; reduces cardiovascular mortality. Monitor eGFR (safe down to 30 mL/min; discontinue if <30 mL/min due to rare lactic acidosis risk)."
      },
      {
        "drugName": "Empagliflozin (or Dapagliflozin)",
        "strength": "10 to 25 mg (Dapagliflozin 10 mg)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily in the morning",
        "timing": "With or without food",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "SGLT2 Inhibitor with Cardiorenal & Heart Failure Protection",
        "clinicalNotes": "Blocks proximal tubule glucose and sodium reabsorption. Mandatory guideline choice for patients with established ASCVD, heart failure (HFrEF/HFpEF), or CKD. Counsel on genital mycotic hygiene and euglycemic DKA warning."
      },
      {
        "drugName": "Semaglutide (Oral or Once-Weekly SC)",
        "strength": "Oral: 3mg -> 7mg -> 14mg OD; SC: 0.25mg -> 0.5mg -> 1.0mg weekly",
        "dosageForm": "Oral Tablet / Subcutaneous Pen Injector",
        "frequency": "Oral: once daily fasting; SC: once weekly on the same day",
        "timing": "Oral: wake up on empty stomach with <=120 mL plain water, wait 30 mins before food",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "GLP-1 Receptor Agonist with High Glycemic & Weight Loss Efficacy",
        "clinicalNotes": "Enhances glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying. Robust MACE reduction in ASCVD. Contraindicated in personal/family history of Medullary Thyroid Carcinoma or MEN-2."
      },
      {
        "drugName": "Glimepiride",
        "strength": "1 to 2 mg (titrated to max 4 mg)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "Immediately before the first main meal of the day (breakfast)",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "Second-Generation Sulfonylurea Secretagogue",
        "clinicalNotes": "Stimulates pancreatic beta-cell SUR-1 receptors. Cost-effective add-on; patient MUST be educated on recognizing and managing hypoglycemia (rule of 15)."
      }
    ],
    "complications": [
      "Diabetic Nephropathy & End-Stage Renal Disease (ESRD) requiring chronic hemodialysis",
      "Accelerated Atherosclerotic Cardiovascular Disease (Myocardial Infarction, Ischemic Stroke, Peripheral Artery Disease)",
      "Diabetic Peripheral Neuropathy, Charcot neuroarthropathy, and lower extremity amputations"
    ],
    "referralTriggers": [
      "Severe refractory glycemic dysregulation (HbA1c > 9.5%) despite triple oral combination therapy",
      "Rapidly declining eGFR (>5 mL/min/year drop) or new-onset macroalbuminuria (uACR > 300 mg/g)",
      "Presence of active diabetic foot ulceration or neuro-ischemic skin changes"
    ]
  },
  "high-blood-pressure": {
    "id": "high-blood-pressure",
    "name": "High Blood Pressure (Hypertension)",
    "medicalName": "Essential Hypertension & Hypertensive Urgency",
    "category": "Other Health Problems",
    "subCategory": "Heart & Circulation",
    "icdCode": "I10",
    "datasetSource": "ACC/AHA 2017/2026 Hypertension Guidelines, ISH Global Guidelines & WHO Protocol",
    "evidenceLevel": "Class 1, Level A (ACC/AHA Task Force)",
    "overview": "Persistent elevation of systemic arterial blood pressure (Systolic >= 130 mmHg or Diastolic >= 80 mmHg) leading to progressive cardiovascular, cerebral, and renal target organ damage.",
    "symptoms": {
      "hallmark": [
        "Predominantly asymptomatic ('the silent killer') detected during routine screening",
        "Suboccipital throbbing morning headache present on waking and fading by midday",
        "Exertional breathlessness, generalized fatigue, and lightheadedness",
        "Subjective bilateral high-pitched tinnitus and palpitations"
      ],
      "earlySigns": [
        "Mild unprovoked epistaxis (nosebleeds)",
        "Transient dizziness upon standing or bending over",
        "Facial flushing with emotional stress or moderate physical exertion"
      ],
      "redFlags": [
        "Hypertensive Emergency: BP > 180/120 mmHg accompanied by acute target organ dysfunction",
        "Acute aortic dissection: tearing retrosternal pain radiating straight to interscapular back",
        "Hypertensive encephalopathy: altered sensorium, seizures, papilledema, projectile vomiting",
        "Acute cardiogenic pulmonary edema: severe orthopnea, bilateral crackles, pink frothy sputum"
      ]
    },
    "requiredTests": [
      {
        "testName": "24-Hour Ambulatory Blood Pressure Monitoring (ABPM) / Home BP (HBPM)",
        "type": "Physiological Monitoring Gold Standard",
        "purpose": "Essential to confirm true sustained hypertension, assess nocturnal dipping profile, and rule out white-coat and masked hypertension",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "12-Lead Electrocardiogram (ECG)",
        "type": "Cardiac Electrophysiology",
        "purpose": "Evaluates Sokolow-Lyon criteria (S in V1 + R in V5/V6 >= 35 mm) and Cornell voltage for Left Ventricular Hypertrophy (LVH) and strain patterns",
        "urgency": "Priority"
      },
      {
        "testName": "Comprehensive Metabolic Panel (CMP): Serum Creatinine, eGFR, Electrolytes",
        "type": "Laboratory Assay",
        "purpose": "Assesses renal function, baseline potassium (screens for primary aldosteronism if hypokalemic), and sodium",
        "urgency": "Priority"
      },
      {
        "testName": "Spot Urine Albumin-to-Creatinine Ratio (uACR)",
        "type": "Urinalysis Biomarker",
        "purpose": "Detects subclinical hypertensive nephrosclerosis and microalbuminuria; independent cardiovascular risk marker",
        "urgency": "Routine"
      },
      {
        "testName": "Fasting Lipid Profile and Fasting Blood Glucose",
        "type": "Laboratory Assay",
        "purpose": "Mandatory to compute 10-year Atherosclerotic Cardiovascular Disease (ASCVD) risk percentage",
        "urgency": "Routine"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Telmisartan (or Losartan Potassium)",
        "strength": "40 to 80 mg (Losartan 50-100 mg)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "Morning at the same time every day with water",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "First-Line Angiotensin II Receptor Blocker (ARB)",
        "clinicalNotes": "Blocks AT1 receptors; highest lipophilicity and longest half-life (24 hours) in ARB class; provides sustained BP control through morning surge. Free from bradykinin cough. Recheck potassium and creatinine at 2 weeks."
      },
      {
        "drugName": "Amlodipine Besylate",
        "strength": "5 to 10 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "Morning or bedtime",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "First-Line Dihydropyridine Calcium Channel Blocker (CCB)",
        "clinicalNotes": "Potent peripheral arterial vasodilator. Highly effective monotherapy and synergistic with ARB. Warn patient regarding benign dependent pretibial edema (caused by precapillary arteriolar vasodilation, not fluid overload)."
      },
      {
        "drugName": "Chlorthalidone (or Hydrochlorothiazide)",
        "strength": "12.5 to 25 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily in the morning",
        "timing": "With breakfast",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "Thiazide-Like Diuretic",
        "clinicalNotes": "ALLHAT trial proven cardiovascular event reduction. Chlorthalidone preferred over HCTZ due to longer duration of action (48-72h). Monitor serum electrolytes (potassium, sodium) and uric acid."
      },
      {
        "drugName": "DASH Diet & Dietary Sodium Restriction Protocol",
        "strength": "< 1,500 to 2,000 mg elemental sodium/day (<5 g NaCl/day)",
        "dosageForm": "Evidence-Based Lifestyle Prescription",
        "frequency": "Continuous daily adherence",
        "timing": "Daily meals",
        "duration": "Lifelong",
        "regimenType": "Class 1 Non-Pharmacological Intervention",
        "clinicalNotes": "Yields systolic BP reduction of 8 to 14 mmHg (equivalent to full-dose single pharmacological monotherapy). Emphasize potassium-rich foods (fruits, vegetables, legumes) unless advanced CKD."
      }
    ],
    "complications": [
      "Hypertensive Heart Disease, Left Ventricular Hypertrophy, and Heart Failure (HFpEF)",
      "Ischemic Stroke, Lacunar Infarction, and Spontaneous Intracerebral Hemorrhage",
      "Hypertensive Nephrosclerosis leading to progressive End-Stage Renal Disease (ESRD)"
    ],
    "referralTriggers": [
      "Resistant Hypertension: BP remains above target despite concurrent adherence to >=3 antihypertensive agents of different classes (including a diuretic)",
      "Suspected Secondary Hypertension (sudden onset age <30 or >55, hypokalemic alkalosis, refractory snoring/OSA, epigastric bruits)",
      "Hypertensive crisis with any acute target organ compromise (immediate ER admission for IV Labetalol / Nicardipine)"
    ]
  },
  "kidney-problems": {
    "id": "kidney-problems",
    "name": "Chronic Kidney Disease (CKD)",
    "medicalName": "Chronic Kidney Disease & Renal Insufficiency (Stages 1 to 5)",
    "category": "Other Health Problems",
    "subCategory": "Kidneys & Urinary",
    "icdCode": "N18.9",
    "datasetSource": "KDIGO 2024/2026 Clinical Practice Guideline for Evaluation & Management of CKD & WHO",
    "evidenceLevel": "Grade 1A (KDIGO Global Consensus)",
    "overview": "Abnormalities of kidney structure or function present for >3 months with implications for health, defined by eGFR <60 mL/min/1.73m² or persistent albuminuria >=30 mg/g.",
    "symptoms": {
      "hallmark": [
        "Bilateral periorbital morning puffiness and dependent pitting pretibial/pedal edema",
        "Foamy, frothy urine due to significant proteinuria / albuminuria",
        "Nocturia (passing urine multiple times at night due to lost concentrating ability)",
        "Refractory or escalating hypertension and persistent generalized asthenia"
      ],
      "earlySigns": [
        "Subtle loss of stamina, pallor from normocytic normochromic anemia of CKD",
        "Metallic taste in mouth (dysgeusia), loss of appetite, and nausea",
        "Pruritus (itching) from uremic toxins and hyperphosphatemia"
      ],
      "redFlags": [
        "Uremic Pericarditis: pleuro-pericardial friction rub, severe chest pain worsened supine",
        "Uremic Encephalopathy: asterixis (flapping tremor), confusion, myoclonic twitches, coma",
        "Refractory severe hyperkalemia (Serum Potassium > 6.5 mEq/L) with peaked T-waves on ECG",
        "Intractable hypervolemia and flash pulmonary edema unresponsive to high-dose loop diuretics"
      ]
    },
    "requiredTests": [
      {
        "testName": "Serum Creatinine with CKD-EPI 2021 Creatinine-Cystatin C eGFR Equation",
        "type": "Laboratory Assay Gold Standard",
        "purpose": "Classifies CKD Stages: G1 (>=90), G2 (60-89), G3a (45-59), G3b (30-44), G4 (15-29), G5 (<15 mL/min/1.73m²)",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Spot Urine Albumin-to-Creatinine Ratio (uACR)",
        "type": "Urinalysis Staging Marker",
        "purpose": "Classifies Albuminuria Stages: A1 (<30 mg/g normal to mildly increased), A2 (30-300 mg/g microalbuminuria), A3 (>300 mg/g macroalbuminuria)",
        "urgency": "Priority"
      },
      {
        "testName": "Comprehensive Electrolyte & Mineral Bone Panel (K+, Na+, Ca2+, PO4, iPTH)",
        "type": "Laboratory Assay",
        "purpose": "Detects hyperkalemia, secondary hyperparathyroidism, hypocalcemia, and hyperphosphatemia (CKD-MBD)",
        "urgency": "Priority"
      },
      {
        "testName": "Renal Ultrasonography with Color Doppler",
        "type": "Diagnostic Imaging",
        "purpose": "Demonstrates bilateral small shrunken kidneys (bipolar length < 9 cm) with increased cortical echogenicity and lost corticomedullary differentiation",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Dapagliflozin (or Empagliflozin)",
        "strength": "10 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "Morning with water",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "KDIGO First-Line Renoprotective SGLT2 Inhibitor",
        "clinicalNotes": "DAPA-CKD & EMPA-KIDNEY landmark trials: Slows eGFR decline by 40-50% and dramatically cuts cardiovascular death in CKD with eGFR 20-60 mL/min and uACR > 200 mg/g. Can be continued until initiation of dialysis."
      },
      {
        "drugName": "Telmisartan (or Enalapril)",
        "strength": "20 to 40 mg (titrated to max tolerated)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "Morning with water",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "Renin-Angiotensin-Aldosterone System (RAAS) Blocker",
        "clinicalNotes": "Selectively dilates efferent renal arterioles, reducing intraglomerular hydrostatic pressure and proteinuria. Expected benign serum creatinine bump up to 30% acceptable. Monitor serum potassium."
      },
      {
        "drugName": "Torsemide (or Furosemide)",
        "strength": "10 to 20 mg (Torsemide) / 40 to 80 mg (Furosemide)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily in the morning",
        "timing": "Empty stomach",
        "duration": "Ongoing as needed for volume control",
        "regimenType": "High-Ceiling Loop Diuretic",
        "clinicalNotes": "Torsemide has superior, more predictable oral bioavailability (80-90%) than furosemide in uremic bowel edema. Titrated strictly to achieve euvolemia and control pretibial edema."
      },
      {
        "drugName": "Sodium Bicarbonate",
        "strength": "500 to 1,000 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Two to three times daily",
        "timing": "After meals",
        "duration": "Ongoing while serum bicarbonate < 22 mmol/L",
        "regimenType": "Alkalinizing Agent for Chronic Metabolic Acidosis",
        "clinicalNotes": "Target serum HCO3 22-26 mmol/L. Prevents progressive muscle protein wasting, preserves bone mineral density, and significantly slows rate of GFR loss."
      }
    ],
    "complications": [
      "End-Stage Renal Disease (ESRD) requiring renal replacement therapy (hemodialysis / peritoneal dialysis / transplant)",
      "Accelerated Uremic Cardiovascular Calcification, Sudden Cardiac Death, and Stroke",
      "Renal Osteodystrophy / Fracture from secondary and tertiary hyperparathyroidism"
    ],
    "referralTriggers": [
      "eGFR dropping below 30 mL/min/1.73m² (CKD Stage G4 - initiate timely vascular access arteriovenous fistula [AVF] planning)",
      "Rapid unexplained eGFR decline (>5 mL/min/year)",
      "Refractory hyperkalemia (K > 6.0 mEq/L) or nephrotic-range proteinuria (uACR > 2,000 mg/g)"
    ]
  },
  "heart-problems": {
    "id": "heart-problems",
    "name": "Heart Problems (Coronary Artery Disease & Heart Failure)",
    "medicalName": "Coronary Artery Disease & Congestive Heart Failure (CAD / CHF)",
    "category": "Other Health Problems",
    "subCategory": "Heart & Circulation",
    "icdCode": "I25.1 / I50.9",
    "datasetSource": "AHA/ACC 2023/2026 Chronic Coronary Disease & Heart Failure Guidelines, ESC",
    "evidenceLevel": "Class 1, Level A (AHA/ACC Guidelines)",
    "overview": "Atherosclerotic narrowing of coronary arteries resulting in myocardial ischemia, left ventricular remodeling, and heart failure with reduced or preserved ejection fraction.",
    "symptoms": {
      "hallmark": [
        "Classical Angina Pectoris: substernal heavy squeezing/crushing pressure provoked by exertion or cold, relieved by rest or sublingual nitroglycerin within 5 mins",
        "Radiation of ischemic discomfort to left shoulder, left arm, neck, or lower jaw",
        "Exertional dyspnea and reduced functional exercise tolerance (NYHA Class I-IV)",
        "Orthopnea (need for multiple pillows to breathe at night) and Paroxysmal Nocturnal Dyspnea (PND)"
      ],
      "earlySigns": [
        "Subtle shortness of breath when walking uphill or climbing one flight of stairs",
        "Unexplained profound post-exertional fatigue and bilateral ankle swelling",
        "Palpitations and occasional skipped heartbeats"
      ],
      "redFlags": [
        "Acute Coronary Syndrome (ACS / STEMI / NSTEMI): Unrelenting crushing retrosternal pain > 20 mins, diaphoresis, nausea, syncope",
        "Cardiogenic Shock: Systolic BP < 90 mmHg, cold clammy extremities, oliguria, confusion",
        "Flash Pulmonary Edema: sudden severe breathlessness, hypoxia, diffuse bibasilar wet crackles, pink sputum",
        "Malignant Ventricular Arrhythmias (Ventricular Tachycardia / VF arrest)"
      ]
    },
    "requiredTests": [
      {
        "testName": "12-Lead Electrocardiogram (ECG)",
        "type": "Cardiac Electrophysiology",
        "purpose": "Assesses ST-segment elevation/depression (>=1 mm in contiguous leads), pathologic Q-waves, T-wave inversion, new Left Bundle Branch Block (LBBB)",
        "urgency": "Stat / Within 10 minutes of presentation"
      },
      {
        "testName": "High-Sensitivity Cardiac Troponin-I / Troponin-T (hs-cTn)",
        "type": "Cardiac Biomarker Assay",
        "purpose": "0h/1h or 0h/2h rapid diagnostic algorithm for Acute Myocardial Infarction; detects myocardial necrosis",
        "urgency": "Stat / Immediate"
      },
      {
        "testName": "Transthoracic 2D-Echocardiography with Color Doppler",
        "type": "Diagnostic Imaging",
        "purpose": "Quantifies Left Ventricular Ejection Fraction (LVEF: HFrEF <=40%, HFmrEF 41-49%, HFpEF >=50%), regional wall motion abnormalities, and valvular stenosis/regurgitation",
        "urgency": "Priority / Within 24h"
      },
      {
        "testName": "N-Terminal pro-B-type Natriuretic Peptide (NT-proBNP)",
        "type": "Neurohormonal Biomarker",
        "purpose": "Biomarker of ventricular wall stretch and heart failure: Rule-out cutoff < 125 pg/mL non-acute; < 300 pg/mL acute dyspnea",
        "urgency": "Priority"
      },
      {
        "testName": "Coronary Computed Tomography Angiography (CCTA) / Invasive Coronary Angiogram",
        "type": "Angiographic Imaging",
        "purpose": "Definitive anatomical visualization of coronary stenosis, plaque burden, and fractional flow reserve (FFR)",
        "urgency": "Priority / Urgent if ACS"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Aspirin (Acetylsalicylic Acid - Enteric Coated)",
        "strength": "75 to 100 mg (Loading dose: 325 mg chewed in acute ACS)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "With main meal",
        "duration": "Indefinite lifelong therapy",
        "regimenType": "Antiplatelet Cyclooxygenase-1 (COX-1) Inhibitor",
        "clinicalNotes": "Irreversibly inhibits platelet thromboxane A2 production. Cornerstone of secondary atherothrombotic prevention across all clinical coronary disease."
      },
      {
        "drugName": "Atorvastatin Calcium (or Rosuvastatin)",
        "strength": "40 to 80 mg (Rosuvastatin 20 to 40 mg)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily at bedtime",
        "timing": "Night with or without food",
        "duration": "Indefinite lifelong therapy",
        "regimenType": "High-Intensity HMG-CoA Reductase Inhibitor",
        "clinicalNotes": "Achieves >= 50% LDL-C reduction with target LDL < 55 mg/dL (<1.4 mmol/L) in very high-risk CAD. Provides robust plaque stabilization, anti-inflammatory, and pleiotropic endothelial protection."
      },
      {
        "drugName": "Metoprolol Succinate Extended-Release (or Bisoprolol)",
        "strength": "25 to 50 mg (titrated to target 100-200 mg OD)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily in the morning",
        "timing": "With or immediately after breakfast",
        "duration": "Indefinite lifelong therapy",
        "regimenType": "Cardioselective Beta-1 Adrenergic Blocker",
        "clinicalNotes": "Reduces myocardial oxygen demand, limits ventricular remodeling, and significantly decreases sudden cardiac death in CAD and HFrEF. Target resting heart rate: 55-65 bpm."
      },
      {
        "drugName": "Nitroglycerin (Glyceryl Trinitrate) Sublingual",
        "strength": "0.4 mg (400 mcg)",
        "dosageForm": "Sublingual Tablet / Spray",
        "frequency": "1 tablet/spray sublingually every 5 mins up to 3 doses SOS for acute chest pain",
        "timing": "Place under tongue while seated (prevents postural syncope)",
        "duration": "Emergency SOS rescue",
        "regimenType": "Rapid-Acting Venous & Coronary Nitrate Vasodilator",
        "clinicalNotes": "Reduces cardiac preload and left ventricular end-diastolic pressure. CRITICAL WARNING: If chest pain persists >5 minutes after first dose, patient must activate emergency EMS (911/112) immediately. CONTRAINDICATION: Do not administer if PDE-5 inhibitor (sildenafil, tadalafil) taken within 24-48 hours (risk of fatal refractory hypotension)."
      }
    ],
    "complications": [
      "Acute ST-Elevation Myocardial Infarction (STEMI) with extensive anterior wall necrosis",
      "Malignant ventricular tachyarrhythmias and sudden cardiac arrest",
      "End-stage decompensated heart failure requiring cardiac resynchronization therapy (CRT-D) or LVAD"
    ],
    "referralTriggers": [
      "Any chest pain concerning for Acute Coronary Syndrome (immediate transfer to 24/7 Primary PCI catheterization lab)",
      "Refractory NYHA Class III-IV heart failure symptoms despite guideline-directed medical therapy (GDMT: ARNI + Beta-blocker + MRA + SGLT2i)",
      "Documented Left Ventricular Ejection Fraction <= 35% (referral for Implantable Cardioverter-Defibrillator [ICD])"
    ]
  },
  "liver-problems": {
    "id": "liver-problems",
    "name": "Liver Problems (Fatty Liver & Cirrhosis)",
    "medicalName": "Metabolic Dysfunction-Associated Steatohepatitis (MASH) & Cirrhosis",
    "category": "Other Health Problems",
    "subCategory": "Blood & Liver",
    "icdCode": "K76.0 / K74.6",
    "datasetSource": "AASLD Practice Guidance on NAFLD/MASH & EASL Clinical Practice Guidelines",
    "evidenceLevel": "Grade 1A (AASLD Practice Guidance)",
    "overview": "Spectrum of progressive liver injury starting with hepatic steatosis, progressing to inflammatory steatohepatitis (MASH), bridging fibrosis, and irreversible nodular cirrhosis.",
    "symptoms": {
      "hallmark": [
        "Right upper quadrant dull fullness, hepatic capsular tension, and chronic lethargy",
        "Cutaneous vascular stigmata: spider angiomas (spider nevi) on face/chest, palmar erythema",
        "Bilateral non-tender parotid gland enlargement and Dupuytren's palmar contracture",
        "Gradual progressive abdominal girth expansion (ascites) and dependent pedal edema"
      ],
      "earlySigns": [
        "Subtle postprandial fatigue, daytime drowsiness, and poor exercise tolerance",
        "Mild unprovoked upper abdominal fullness",
        "Incidental transaminase elevation (ALT > AST in steatohepatitis; AST > ALT in cirrhosis)"
      ],
      "redFlags": [
        "Decompensated Cirrhosis: Gross tense ascites, spontaneous bacterial peritonitis (SBP: fever + abdominal pain)",
        "Variceal Hemorrhage: Sudden massive hematemesis or melena from ruptured esophageal varices",
        "Hepatic Encephalopathy: Flapping tremor (asterixis), confusion, inversion of sleep-wake cycle, coma",
        "Hepatorenal Syndrome (HRS): Rapid oliguric renal failure with unremarkable urine sediment"
      ]
    },
    "requiredTests": [
      {
        "testName": "Comprehensive Liver Function Panel (ALT, AST, ALP, GGT, Albumin, Bilirubin)",
        "type": "Laboratory Assay",
        "purpose": "Evaluates hepatocellular vs cholestatic injury; AST:ALT ratio > 1 suggests advanced bridging fibrosis/cirrhosis",
        "urgency": "Priority"
      },
      {
        "testName": "FIB-4 Score Non-Invasive Fibrosis Calculation",
        "type": "Calculated Clinical Biomarker",
        "purpose": "Calculated using Age, AST, ALT, and Platelet count: <1.30 rules out advanced fibrosis (NPV >90%); >2.67 indicates high risk of F3-F4 advanced fibrosis",
        "urgency": "Routine / Outpatient"
      },
      {
        "testName": "Transient Elastography (FibroScan)",
        "type": "Quantitative Ultrasound Elastography",
        "purpose": "Measures liver stiffness in kilopascals (kPa; >12-15 kPa diagnostic of cirrhosis) and Controlled Attenuation Parameter (CAP in dB/m for steatosis)",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Upper Gastrointestinal Endoscopy (EGD)",
        "type": "Endoscopic Screening",
        "purpose": "Mandatory surveillance for gastroesophageal varices in all patients with confirmed cirrhosis or liver stiffness >= 20 kPa",
        "urgency": "Priority"
      },
      {
        "testName": "Liver Ultrasound + Serum Alpha-Fetoprotein (AFP) Every 6 Months",
        "type": "Surveillance Protocol",
        "purpose": "Mandatory semiannual screening for Hepatocellular Carcinoma (HCC) in all cirrhotic patients",
        "urgency": "Routine Semiannual"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Vitamin E (d-alpha-tocopherol)",
        "strength": "800 IU daily",
        "dosageForm": "Oral Softgel Capsule",
        "frequency": "Once daily (OD)",
        "timing": "With food",
        "duration": "12 to 24 months",
        "regimenType": "Antioxidant Lipid Peroxidation Scavenger (AASLD Recommended for Non-Diabetic MASH)",
        "clinicalNotes": "PIVENS trial: Significantly improves steatosis and lobular inflammation in biopsy-proven non-diabetic MASH. Avoid in men with high risk of prostate cancer."
      },
      {
        "drugName": "Spironolactone + Furosemide (Ascites Protocol)",
        "strength": "Spironolactone 100 mg + Furosemide 40 mg (100:40 mg ratio)",
        "dosageForm": "Oral Tablets",
        "frequency": "Once daily in the morning",
        "timing": "After breakfast",
        "duration": "Ongoing as needed for ascites maintenance",
        "regimenType": "Aldosterone Antagonist + Loop Diuretic Combination",
        "clinicalNotes": "The 100:40 mg ratio maintains serum potassium balance while successfully mobilizing ascitic fluid. Target weight loss: 0.5 kg/day (without edema) or 1.0 kg/day (with pedal edema)."
      },
      {
        "drugName": "Lactulose Oral Solution",
        "strength": "15 to 30 mL",
        "dosageForm": "Oral Liquid",
        "frequency": "Two to three times daily",
        "timing": "Titrated to achieve exactly 2 to 3 soft bowel movements per day",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "Non-Absorbable Synthetic Disaccharide for Encephalopathy",
        "clinicalNotes": "Metabolized by colonic bacteria into lactic and acetic acid; acidifies lumen to pH < 5, converting diffusible ammonia (NH3) into non-absorbable ammonium (NH4+) trapped in stool."
      },
      {
        "drugName": "Rifaximin",
        "strength": "550 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Twice daily (BID)",
        "timing": "With or without food",
        "duration": "Long-term secondary prevention",
        "regimenType": "Gut-Specific Non-Absorbable Antimicrobial",
        "clinicalNotes": "AASLD/EASL standard add-on to lactulose; reduces recurrent overt hepatic encephalopathy hospitalizations by >50%."
      }
    ],
    "complications": [
      "Acute variceal hemorrhage with exsanguinating shock and high 6-week mortality (15-20%)",
      "Spontaneous Bacterial Peritonitis (SBP) requiring urgent diagnostic paracentesis (PMN >= 250/µL)",
      "Hepatocellular Carcinoma (HCC) arising in cirrhotic parenchyma (annual incidence 2-4%)"
    ],
    "referralTriggers": [
      "First episode of clinical decompensation (ascites, variceal bleed, encephalopathy) -> Refer to Hepatologist for MELD score and Liver Transplant evaluation",
      "Any suspicion of variceal hemorrhage (emergency endoscopic band ligation [EBL] + IV Octreotide)",
      "New discrete liver nodule on screening ultrasound"
    ]
  },
  "thyroid-problems": {
    "id": "thyroid-problems",
    "name": "Thyroid Disorders (Hypo & Hyperthyroidism)",
    "medicalName": "Hypothyroidism (Hashimoto's) & Hyperthyroidism (Graves' Disease)",
    "category": "Other Health Problems",
    "subCategory": "Blood Sugar & Hormones",
    "icdCode": "E03.9 / E05.0",
    "datasetSource": "ATA (American Thyroid Association) Guidelines & Endocrine Society Practice Guidelines",
    "evidenceLevel": "Grade 1A (ATA Consensus Guidelines)",
    "overview": "Endocrine disorders of the hypothalamic-pituitary-thyroid axis characterized by either hormone deficiency (hypothyroidism) or excessive circulating free thyroid hormones (thyrotoxicosis/hyperthyroidism).",
    "symptoms": {
      "hallmark": [
        "Hypothyroidism: Extreme cold intolerance, sluggish speech, unprovoked weight gain, chronic constipation, dry brittle coarse hair, periorbital non-pitting edema (myxedema)",
        "Hyperthyroidism: Heat intolerance, excessive diaphoresis, unprovoked weight loss despite voracious appetite, fine resting tremor, palpitations, emotional lability",
        "Graves' Orbitopathy: Exophthalmos (proptosis), lid lag (von Graefe sign), staring gaze, diplopia",
        "Diffuse or nodular thyromegaly (goiter) with or without vascular systolic bruit"
      ],
      "earlySigns": [
        "Unexplained cognitive slowing, memory fog, fatigue, and depression",
        "Menstrual irregularities (menorrhagia in hypothyroidism; oligomenorrhea/amenorrhea in hyperthyroidism)",
        "Proximal muscle weakness (difficulty rising from a squatting chair position)"
      ],
      "redFlags": [
        "Myxedema Coma: Severe hypothermia (<35°C), hypoventilation, hypercapnia, severe bradycardia, obtundation",
        "Thyroid Storm: Hyperpyrexia (>40°C / 104°F), rapid atrial fibrillation, acute heart failure, agitation/delirium",
        "Rapidly expanding thyroid mass with vocal hoarseness and stridor (anaplastic transformation or lymphoma)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Third-Generation Serum Thyroid-Stimulating Hormone (TSH)",
        "type": "Chemiluminescent Immunoassay Gold Standard",
        "purpose": "Most sensitive screening test (Reference: 0.45 - 4.50 mIU/L). Elevated TSH indicates primary hypothyroidism; suppressed TSH (<0.01 mIU/L) indicates thyrotoxicosis",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Serum Free Thyroxine (Free T4) and Free Triiodothyronine (Free T3)",
        "type": "Laboratory Assay",
        "purpose": "Differentiates overt disease (abnormal Free T4/T3) from subclinical disease (normal Free T4/T3 with abnormal TSH)",
        "urgency": "Priority"
      },
      {
        "testName": "Anti-Thyroid Peroxidase (Anti-TPO) and Anti-Thyroglobulin (Anti-Tg) Antibodies",
        "type": "Autoantibody Serology",
        "purpose": "High titer (>100 IU/mL) confirms autoimmune Hashimoto's thyroiditis as underlying etiology",
        "urgency": "Routine"
      },
      {
        "testName": "TSH-Receptor Antibodies (TRAb) / Thyroid-Stimulating Immunoglobulin (TSI)",
        "type": "Autoantibody Serology",
        "purpose": "Diagnostic confirmation of Graves' disease; distinguishes Graves' from toxic multinodular goiter or subacute thyroiditis",
        "urgency": "Priority"
      },
      {
        "testName": "High-Resolution Thyroid Ultrasound with Color Flow Doppler",
        "type": "Diagnostic Imaging",
        "purpose": "Assesses diffuse hypoechoic architecture, vascularity ('thyroid inferno' in Graves'), and TI-RADS risk classification of concurrent nodules",
        "urgency": "Routine"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Levothyroxine Sodium (T4)",
        "strength": "1.6 mcg/kg ideal body weight/day (typical starting dose: 50 to 100 mcg daily; 25 mcg in elderly/CAD)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily in the morning",
        "timing": "Strictly on an empty stomach with plain water >= 30 to 60 minutes before breakfast",
        "duration": "Lifelong ongoing replacement therapy",
        "regimenType": "First-Line Synthetic Thyroid Hormone Replacement",
        "clinicalNotes": "CRITICAL COUNSELING: Must not take simultaneously with calcium, iron supplements, multivitamins, coffee, or antacids (space by >= 4 hours). Recheck serum TSH at 6 to 8 weeks after any dose adjustment."
      },
      {
        "drugName": "Methimazole (Thiamazole)",
        "strength": "10 to 30 mg daily (titrated to maintenance 5-10 mg OD)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "With meals",
        "duration": "12 to 18 months course for Graves' disease",
        "regimenType": "Thionamide Antithyroid Synthesis Inhibitor",
        "clinicalNotes": "Inhibits thyroid peroxidase-mediated iodination of tyrosine residues. Preferred over PTU due to lower hepatotoxicity. CRITICAL WARNING: Educate patient to immediately stop drug and obtain urgent CBC if sore throat or fever occurs (screens for rare 0.2-0.5% agranulocytosis)."
      },
      {
        "drugName": "Propranolol Hydrochloride",
        "strength": "20 to 40 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Three to four times daily (TID/QID)",
        "timing": "With food",
        "duration": "2 to 4 weeks during acute thyrotoxic control",
        "regimenType": "Non-Selective Beta-Adrenergic Blocker",
        "clinicalNotes": "Rapidly controls adrenergic thyrotoxic symptoms (tachycardia, tremor, heat intolerance, anxiety) and partially inhibits peripheral T4-to-T3 conversion at high doses."
      }
    ],
    "complications": [
      "Myxedema Coma with high mortality (20-40%) requiring ICU IV levothyroxine and hydrocortisone",
      "Thyrotoxic Thyroid Storm provoked by trauma/surgery/infection",
      "Persistent Atrial Fibrillation, Embolic Stroke, and Osteoporosis from untreated hyperthyroidism"
    ],
    "referralTriggers": [
      "Suspected Thyroid Storm or Myxedema Coma (immediate emergency intensive care resuscitation)",
      "Severe Graves' ophthalmopathy with sight-threatening compressive optic neuropathy",
      "Thyroid nodule with suspicious ACR TI-RADS 4 or 5 ultrasound features requiring fine needle aspiration"
    ]
  },
  "anaemia": {
    "id": "anaemia",
    "name": "Anaemia (Iron Deficiency & Megaloblastic)",
    "medicalName": "Iron Deficiency Anaemia & Nutritional Megaloblastic Anaemia",
    "category": "Other Health Problems",
    "subCategory": "Blood & Liver",
    "icdCode": "D50.9 / D53.9",
    "datasetSource": "WHO Guidelines on the Use of Ferritin Concentrations & British Society of Gastroenterology (BSG)",
    "evidenceLevel": "Grade 1A (WHO Core Guidelines)",
    "overview": "Reduction in total circulating red blood cell mass or hemoglobin concentration below reference cutoffs (<13.0 g/dL in adult males, <12.0 g/dL in non-pregnant females) compromising tissue oxygen delivery.",
    "symptoms": {
      "hallmark": [
        "Severe generalized physical fatigue, exertional breathlessness, and rapid exhaustion",
        "Marked conjunctival, subungual, and palmar crease pallor",
        "Postural lightheadedness, orthostatic dizziness, and pulsatile tinnitus",
        "Compensatory resting or exertional sinus tachycardia and functional systolic ejection murmur"
      ],
      "earlySigns": [
        "Pica: abnormal cravings for non-nutritive substances (ice chewing/pagophagia, dirt, clay, starch)",
        "Restless Legs Syndrome (Willis-Ekbom disease): irresistible urge to move legs at rest",
        "Koilonychia (concave spoon-shaped nails), angular cheilitis, atrophic glossitis (smooth sore tongue)"
      ],
      "redFlags": [
        "Hemodynamic instability: resting chest angina, presyncope, severe tachycardia (HR > 120 bpm)",
        "High-output congestive heart failure with peripheral edema and orthopnea",
        "Signs of occult macroscopic gastrointestinal hemorrhage: melena, hematochezia",
        "Neurological Megaloblastic Symptoms: subacute combined degeneration of spinal cord (loss of vibration/proprioception, ataxia)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Complete Blood Count (CBC) with Automated RBC Indices",
        "type": "Laboratory Assay",
        "purpose": "Hemoglobin, Hematocrit, Mean Corpuscular Volume (MCV <80 fL microcytic in IDA; >100 fL macrocytic in B12/folate), MCH, Red Cell Distribution Width (RDW elevated in IDA)",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Serum Ferritin & Complete Iron Studies (Serum Iron, TIBC, Transferrin Saturation)",
        "type": "Laboratory Assay Gold Standard",
        "purpose": "Serum Ferritin < 30 ng/mL diagnostic of iron deficiency (<100 ng/mL in inflammatory state); Transferrin Saturation (TSAT) < 16-20% confirms iron-deficient erythropoiesis",
        "urgency": "Priority"
      },
      {
        "testName": "Peripheral Blood Smear Examination (Leishman Stained)",
        "type": "Microscopy Gold Standard",
        "purpose": "Reveals microcytic hypochromic erythrocytes with pencil/cigar cells in IDA; macro-ovalocytes and hypersegmented neutrophils (>=5 lobes) in B12/folate deficiency",
        "urgency": "Priority"
      },
      {
        "testName": "Serum Vitamin B12 (Cyanocobalamin) & Serum Folate Assay",
        "type": "Chemiluminescent Immunoassay",
        "purpose": "Serum B12 < 200 pg/mL diagnostic of deficiency; rule out pernicious anemia via Anti-Intrinsic Factor antibodies",
        "urgency": "Routine"
      },
      {
        "testName": "Bidirectional Endoscopy (Gastroscopy + Colonoscopy) or FIT Test",
        "type": "Gastroenterology Diagnostic Workup",
        "purpose": "MANDATORY in adult males and postmenopausal females with unexplained IDA to exclude occult gastrointestinal malignancy (colorectal/gastric cancer)",
        "urgency": "Priority / Within 2-4 weeks"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Ferrous Ascorbate / Ferrous Sulfate (Elemental Iron 100 mg)",
        "strength": "100 mg elemental iron + 1.5 mg Folic Acid",
        "dosageForm": "Oral Film-Coated Tablet",
        "frequency": "Once daily or alternate-day dosing (e.g. Mon-Wed-Fri)",
        "timing": "Take on an empty stomach with a glass of water or Vitamin C (orange juice) to enhance absorption",
        "duration": "3 to 6 months (continue for 3 months after Hb normalizes to replenish marrow ferritin stores)",
        "regimenType": "First-Line Oral Hematinic Replacement",
        "clinicalNotes": "Alternate-day dosing (100 mg elemental iron every other day) reduces hepcidin elevation, maximizes fractional iron absorption, and cuts gastrointestinal constipation/nausea by 50%."
      },
      {
        "drugName": "Ferric Carboxymaltose (FCM)",
        "strength": "500 to 1,000 mg elemental iron in 100-250 mL 0.9% Normal Saline",
        "dosageForm": "IV Infusion",
        "frequency": "Single dose infused over 15 to 30 minutes (repeated once if Ganzoni iron deficit exceeds 1,000 mg)",
        "timing": "Slow IV infusion",
        "duration": "Single administration",
        "regimenType": "Parenteral Iron Formulation of Choice",
        "clinicalNotes": "Indicated for severe anemia (Hb < 8 g/dL), oral iron intolerance, inflammatory bowel disease, 2nd/3rd trimester pregnancy, or CKD. Non-dextran shell eliminates anaphylaxis risk."
      },
      {
        "drugName": "Methylcobalamin (Active Vitamin B12)",
        "strength": "1,000 to 1,500 mcg",
        "dosageForm": "Oral Tablet / Intramuscular Injection (1,000 mcg IM)",
        "frequency": "Oral: once daily; IM: 1,000 mcg alternate days x 1 week, then weekly x 4 weeks",
        "timing": "Morning with food",
        "duration": "3 months (lifelong if pernicious anemia)",
        "regimenType": "Active Neurotropic Coenzyme",
        "clinicalNotes": "Essential co-factor for methionine synthase; prevents irreversible demyelination of dorsal and lateral columns. Always correct B12 before or concurrently with folate to prevent subacute combined degeneration."
      }
    ],
    "complications": [
      "Severe high-output congestive heart failure and myocardial ischemia",
      "Permanent irreversible sensory and motor paraparesis from Vitamin B12 subacute combined degeneration",
      "Premature birth, low birth weight, and perinatal mortality in maternal gestational anemia"
    ],
    "referralTriggers": [
      "Symptomatic severe anemia with Hemoglobin < 7.0 g/dL (hospitalize for packed RBC transfusion and parenteral iron)",
      "Unexplained iron deficiency anemia in adult male or postmenopausal woman (immediate referral for fast-track bidirectional GI endoscopy)",
      "Progressive neurological deficits (paresthesias, ataxia, spasticity) in suspected megaloblastic deficiency"
    ]
  },
  "breast-cancer": {
    "id": "breast-cancer",
    "name": "Breast Cancer",
    "medicalName": "Invasive Ductal & Lobular Breast Carcinoma",
    "category": "Cancer Types",
    "subCategory": "Common Cancers",
    "icdCode": "C50.9",
    "datasetSource": "NCCN Clinical Practice Guidelines in Oncology (Breast Cancer) v2.2026 & ASCO",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant epithelial neoplasm originating from terminal ductal lobular units of the breast, classified by hormone receptor (ER/PR) and HER2/neu expression profiles.",
    "symptoms": {
      "hallmark": [
        "Painless, hard, irregular, solitary breast lump tethered to surrounding parenchyma or pectoralis fascia",
        "Cutaneous skin dimpling, tethering, or 'peau d'orange' (dermal lymphatic edema)",
        "Unilateral nipple retraction, inversion, or eczema-like crusting (Paget's disease)",
        "Spontaneous unilateral bloody or clear serosanguinous nipple discharge from a single duct"
      ],
      "earlySigns": [
        "Subtle localized parenchymal architectural distortion on self-examination",
        "Asymmetric breast tissue thickening or fullness not fluctuating with menstrual cycle",
        "Mild unprovoked axillary aching sensation"
      ],
      "redFlags": [
        "Palpable, firm, matted, immobile axillary or supraclavicular lymphadenopathy",
        "Inflammatory Breast Cancer: rapid erythema, warmth, and diffuse induration involving >one-third of breast mimicking mastitis",
        "Metastatic dissemination signs: persistent localized skeletal bone pain, dyspnea, jaundice, or focal neurological deficit"
      ]
    },
    "requiredTests": [
      {
        "testName": "Bilateral Diagnostic Digital Mammography & High-Frequency Ultrasound",
        "type": "Diagnostic Imaging Gold Standard",
        "purpose": "BI-RADS 1-6 reporting: identifies microcalcifications (pleomorphic/branching), spiculation, architectural distortion, and axillary nodal architecture",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Image-Guided Core Needle Biopsy (CNB) of Mass & Suspicious Axillary Nodes",
        "type": "Histopathology Gold Standard",
        "purpose": "Provides definitive histologic architecture (invasive ductal vs lobular) and distinguishes invasive carcinoma from in situ (DCIS/LCIS)",
        "urgency": "Priority / Within 1 week"
      },
      {
        "testName": "Immunohistochemical (IHC) Biomarker Panel (ER, PR, HER2/neu, Ki-67)",
        "type": "Molecular Pathology",
        "purpose": "MANDATORY: Establishes molecular subtype (Luminal A, Luminal B, HER2-enriched, Triple-Negative); HER2 equivocal (2+) reflexed to FISH testing",
        "urgency": "Priority"
      },
      {
        "testName": "Germline Genetic Testing (BRCA1, BRCA2, PALB2, TP53)",
        "type": "Genetic Assay",
        "purpose": "Recommended for age <= 50 years, triple-negative breast cancer, bilateral disease, or strong family history of breast/ovarian cancer",
        "urgency": "Routine / Pre-Surgical"
      },
      {
        "testName": "Whole-Body 18F-FDG PET-CT or Contrast CT Chest/Abdomen/Pelvis + Bone Scintigraphy",
        "type": "Staging Imaging",
        "purpose": "Mandatory staging for clinical Stage IIB, Stage III, and inflammatory breast cancer to evaluate distant skeletal/visceral metastases",
        "urgency": "Priority before systemic therapy"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Trastuzumab + Pertuzumab (Targeted HER2 Dual Blockade)",
        "strength": "Trastuzumab 8 mg/kg loading -> 6 mg/kg Q3W + Pertuzumab 840 mg loading -> 420 mg Q3W",
        "dosageForm": "IV Infusion",
        "frequency": "Every 3 weeks (Q3W)",
        "timing": "Slow IV infusion over 60 to 90 minutes",
        "duration": "1 year (18 cycles) in adjuvant/neoadjuvant setting",
        "regimenType": "Targeted Anti-HER2 Monoclonal Antibodies (for HER2-Positive Carcinoma)",
        "clinicalNotes": "Significantly prolongs disease-free and overall survival in HER2+ disease. Baseline and quarterly echocardiography mandatory (monitor for reversible drop in Left Ventricular Ejection Fraction [LVEF])."
      },
      {
        "drugName": "Doxorubicin + Cyclophosphamide followed by Paclitaxel (AC-T Protocol)",
        "strength": "Doxorubicin 60 mg/m² + Cyclophosphamide 600 mg/m² Q3W x 4 cycles -> Paclitaxel 80 mg/m² weekly x 12",
        "dosageForm": "IV Infusion",
        "frequency": "AC every 21 days x 4 cycles, followed by weekly paclitaxel x 12 weeks",
        "timing": "Inpatient/Daycare Day 1 of each cycle",
        "duration": "5 to 6 months total systemic chemotherapy",
        "regimenType": "NCCN Category 1 Anthracycline-Taxane Adjuvant Regimen",
        "clinicalNotes": "Premedicate with 5-HT3 antagonist (Ondansetron), Dexamethasone, and G-CSF pegfilgrastim support. Monitor cumulative lifetime doxorubicin dose (<450-500 mg/m²) to prevent cardiomyopathy."
      },
      {
        "drugName": "Anastrozole (or Letrozole / Exemestane)",
        "strength": "1.0 mg (Letrozole 2.5 mg)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "With or without food at the same time each day",
        "duration": "5 to 10 years ongoing adjuvant endocrine therapy",
        "regimenType": "Third-Generation Aromatase Inhibitor (for Postmenopausal ER+/PR+ Breast Cancer)",
        "clinicalNotes": "Inhibits peripheral conversion of androgens to estrogens. Superior to Tamoxifen in postmenopausal women. Monitor bone mineral density with baseline and biennial DEXA scans; co-prescribe Calcium (1,200 mg) and Vitamin D3 (1,000 IU)."
      },
      {
        "drugName": "Tamoxifen Citrate",
        "strength": "20 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "With water",
        "duration": "5 to 10 years adjuvant therapy",
        "regimenType": "Selective Estrogen Receptor Modulator (SERM - for Premenopausal ER+ Disease)",
        "clinicalNotes": "Competitively antagonizes estrogen receptors in breast tissue. Monitor for hot flashes, thromboembolism (DVT/PE risk), and annual gynecological screening for endometrial hyperplasia/carcinoma."
      }
    ],
    "complications": [
      "Distant metastatic dissemination to bone, lung, liver, and central nervous system",
      "Post-axillary dissection secondary lymphedema of the ipsilateral upper extremity",
      "Chemotherapy-induced premature ovarian failure and cardiotoxicity"
    ],
    "referralTriggers": [
      "Any palpable dominant breast mass or BIRADS 4/5 imaging finding (immediate referral to Multidisciplinary Breast Tumor Board)",
      "Skin erythema/edema involving the breast without lactational mastitis (urgent surgical biopsy for inflammatory carcinoma)",
      "New-onset localized bone tenderness or neurological deficit in a breast cancer survivor"
    ]
  },
  "lung-cancer": {
    "id": "lung-cancer",
    "name": "Lung Cancer",
    "medicalName": "Non-Small Cell & Small Cell Lung Carcinoma (NSCLC / SCLC)",
    "category": "Cancer Types",
    "subCategory": "Common Cancers",
    "icdCode": "C34.9",
    "datasetSource": "NCCN Guidelines for Non-Small Cell & Small Cell Lung Cancer v2.2026, IASLC & ESMO",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Consensus Guidelines)",
    "overview": "Malignant neoplasm of bronchial epithelium primarily driven by tobacco carcinogenesis or actionable oncogenic driver mutations (EGFR, ALK, KRAS, ROS1).",
    "symptoms": {
      "hallmark": [
        "New or altered persistent refractory cough lasting >3-4 weeks (in smokers: 'change in cough')",
        "Hemoptysis (blood-streaked sputum to frank macroscopic blood)",
        "Progressive exertional breathlessness, wheezing, and dull aching pleuritic chest discomfort",
        "Profound anorexia, severe muscle wasting, and unprovoked cachexia"
      ],
      "earlySigns": [
        "Recurrent episodes of localized bronchitis or unresolving post-obstructive pneumonia",
        "Subtle hoarseness of voice from recurrent laryngeal nerve traction",
        "Vague shoulder or periscapular muscular aching"
      ],
      "redFlags": [
        "Superior Vena Cava (SVC) Syndrome: facial plethoric edema, periorbital puffiness, prominent dilated chest wall collateral veins",
        "Horner's Syndrome (from apical Pancoast tumor): unilateral ptosis, miosis, and anhidrosis",
        "Spinal Cord Compression from vertebral metastases: bilateral lower limb weakness and sensory level",
        "Syndrome of Inappropriate Antidiuretic Hormone (SIADH): profound hyponatremia with confusion (common in SCLC)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Contrast-Enhanced High-Resolution Chest CT including Adrenals",
        "type": "Diagnostic Imaging Gold Standard",
        "purpose": "Defines primary pulmonary nodule/mass size, spiculation, mediastinal lymph node short-axis diameter (>10 mm suspicious), and adrenal metastases",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Bronchoscopy with Endobronchial Ultrasound (EBUS-TBNA) or CT-Guided Transthoracic Core Biopsy",
        "type": "Biopsy Tissue Acquisition",
        "purpose": "Essential for definitive histologic diagnosis (Adenocarcinoma vs Squamous Cell vs Small Cell) and mediastinal nodal staging (stations 2, 4, 7, 10, 11)",
        "urgency": "Priority / Within 1 week"
      },
      {
        "testName": "Comprehensive Next-Generation Sequencing (NGS) Genomic Mutation Panel",
        "type": "Molecular Pathology",
        "purpose": "MANDATORY in non-squamous NSCLC: Analyzes EGFR (exon 19 del, L858R), ALK, ROS1, BRAF V600E, KRAS G12C, MET exon 14 skipping, RET, NTRK fusions",
        "urgency": "Priority / Before Systemic Therapy"
      },
      {
        "testName": "Programmed Death-Ligand 1 (PD-L1) Immunohistochemistry (22C3 pharmDx Assay)",
        "type": "Immunohistochemistry",
        "purpose": "Tumor Proportion Score (TPS): TPS >= 50% qualifies for first-line single-agent immunotherapy (Pembrolizumab)",
        "urgency": "Priority"
      },
      {
        "testName": "Whole-Body 18F-FDG PET-CT and Contrast-Enhanced Brain MRI",
        "type": "Systemic Staging Imaging",
        "purpose": "Mandatory staging: excludes occult bone/liver metastases and asymptomatic intracranial brain metastases (present in 15-20% at diagnosis)",
        "urgency": "Priority before curative resection/chemoradiotherapy"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Osimertinib Mesylate",
        "strength": "80 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "With or without food at the same time each day",
        "duration": "Adjuvant: 3 years (ADAURA protocol); Metastatic: ongoing until progression",
        "regimenType": "Third-Generation CNS-Penetrant EGFR Tyrosine Kinase Inhibitor (TKI)",
        "clinicalNotes": "FLAURA and ADAURA landmark trials: First-line targeted therapy of choice for EGFR exon 19 del or L858R mutant NSCLC. Exceptional blood-brain barrier penetration prevents and treats brain metastases. Monitor for QTc prolongation and interstitial lung disease."
      },
      {
        "drugName": "Pembrolizumab (Anti-PD-1 Monoclonal Antibody)",
        "strength": "200 mg every 3 weeks (or 400 mg every 6 weeks)",
        "dosageForm": "IV Infusion",
        "frequency": "Every 3 to 6 weeks",
        "timing": "Slow IV infusion over 30 minutes",
        "duration": "Up to 2 years (35 cycles) or until disease progression",
        "regimenType": "Immune Checkpoint Inhibitor (First-Line for PD-L1 TPS >= 50%)",
        "clinicalNotes": "KEYNOTE-024/042 trials: Monotherapy first-line standard when PD-L1 >= 50% without EGFR/ALK alterations. Produces durable multi-year survival. Monitor for immune-related adverse events (irAEs: pneumonitis, colitis, hepatitis, thyroiditis)."
      },
      {
        "drugName": "Cisplatin + Pemetrexed (or Carboplatin AUC 5-6)",
        "strength": "Cisplatin 75 mg/m² + Pemetrexed 500 mg/m²",
        "dosageForm": "IV Infusion",
        "frequency": "Every 21 days (Q3W)",
        "timing": "Day 1 of each 21-day cycle",
        "duration": "4 cycles followed by maintenance Pemetrexed",
        "regimenType": "Platinum-Doublet Chemotherapy (First-Line for Advanced Non-Squamous NSCLC)",
        "clinicalNotes": "MANDATORY PREMEDICATION: Oral Folic Acid 400-1000 mcg daily and Vitamin B12 1000 mcg IM every 9 weeks (commenced 1-2 weeks prior to pemetrexed to prevent life-threatening hematologic/GI toxicity) plus Dexamethasone 4 mg BID x 3 days."
      }
    ],
    "complications": [
      "Intracranial brain metastases with mass effect and cerebral edema",
      "Malignant pleural effusion requiring indwelling pleural catheter or talc pleurodesis",
      "Life-threatening pulmonary hemorrhage / hemoptysis and bronchial obstruction"
    ],
    "referralTriggers": [
      "Unexplained hemoptysis or pulmonary infiltrate persisting > 4 weeks on chest X-ray in smoker (immediate CT chest and Pulmonology/Thoracic Oncology referral)",
      "Clinical signs of Superior Vena Cava obstruction (urgent radiation therapy / endovascular stenting)",
      "Suspicion of spinal cord compression (emergency whole-spine MRI and neurosurgical decompression)"
    ]
  },
  "blood-cancer": {
    "id": "blood-cancer",
    "name": "Blood Cancer (Leukemia & Lymphoma)",
    "medicalName": "Hematologic Malignancies (AML, ALL, CML, CLL & Non-Hodgkin Lymphoma)",
    "category": "Cancer Types",
    "subCategory": "Common Cancers",
    "icdCode": "C91-C95",
    "datasetSource": "NCCN Guidelines in Oncology (Hematologic Malignancies) & WHO Classification of Tumors of Hematopoietic Tissues",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Clonal malignant disorders of hematopoietic stem cells and lymphoid precursors leading to bone marrow failure, blast accumulation, and reticuloendothelial infiltration.",
    "symptoms": {
      "hallmark": [
        "Severe refractory exhaustion and extreme pallor from bone marrow erythroid failure",
        "Recurrent neutropenic opportunistic infections, persistent fevers, and oral mucositis",
        "Spontaneous bleeding manifestations: petechiae, purpura, gingival bleeding, recurrent epistaxis",
        "Generalized painless, rubbery, matted lymphadenopathy and massive splenomegaly"
      ],
      "earlySigns": [
        "Subtle fatigue not relieved by sleep, mild dyspnea on ordinary exertion",
        "Unexplained low-grade pyrexia and drenching night sweats soaking bedsheets",
        "Deep generalized sternal, rib, or long bone tenderness"
      ],
      "redFlags": [
        "Hyperleukocytosis / Leukostasis: WBC > 100,000/µL with hypoxemia, confusion, blurred vision, or priapism",
        "Acute Tumor Lysis Syndrome (TLS): Hyperkalemia, hyperuricemia, hyperphosphatemia, hypocalcemia, acute anuric kidney injury",
        "Disseminated Intravascular Coagulation (DIC): Consumptive coagulopathy with widespread oozing (classic in Acute Promyelocytic Leukemia [APL])"
      ]
    },
    "requiredTests": [
      {
        "testName": "Bone Marrow Aspiration & Trephine Core Biopsy",
        "type": "Hematopathology Gold Standard",
        "purpose": "Definitive diagnosis: morphology, Wright-Giemsa cytochemical staining; blast count >= 20% in marrow or blood defines Acute Leukemia (AML/ALL)",
        "urgency": "Stat / Within 24-48h"
      },
      {
        "testName": "Multiparameter Flow Cytometric Immunophenotyping",
        "type": "Flow Cytometry Gold Standard",
        "purpose": "Distinguishes myeloid from lymphoid lineage: CD19, CD20, CD22, CD10 (B-ALL); CD3, CD5, CD7 (T-ALL); CD13, CD33, CD117, MPO (AML)",
        "urgency": "Stat / Urgent"
      },
      {
        "testName": "Conventional Karyotyping & Fluorescence In Situ Hybridization (FISH)",
        "type": "Cytogenetics",
        "purpose": "Identifies diagnostic and prognostic translocations: t(9;22) BCR-ABL1 Philadelphia chromosome, t(15;17) PML-RARA in APL, inv(16), t(8;21), del(17p)",
        "urgency": "Priority"
      },
      {
        "testName": "Comprehensive Myeloid / Lymphoid NGS Mutation Panel",
        "type": "Molecular Assay",
        "purpose": "Detects actionable mutations: FLT3-ITD/TKD, NPM1, CEBPA, IDH1, IDH2, TP53, JAK2 V617F; guides targeted inhibitor therapy",
        "urgency": "Priority"
      },
      {
        "testName": "Metabolic Tumor Lysis Panel (Uric Acid, Potassium, Phosphorus, Calcium, LDH, Creatinine)",
        "type": "Laboratory Assay",
        "purpose": "MANDATORY STAT BASELINE: Cairo-Bishop criteria for laboratory and clinical tumor lysis syndrome screening prior to chemotherapy",
        "urgency": "Stat / Immediate"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Imatinib Mesylate (or Dasatinib / Nilotinib)",
        "strength": "400 mg once daily (titrated to 600-800 mg if needed)",
        "dosageForm": "Oral Film-Coated Tablet",
        "frequency": "Once daily (OD)",
        "timing": "With a large meal and a full tall glass of water (prevents GI irritation)",
        "duration": "Lifelong ongoing molecular remission therapy",
        "regimenType": "First-Line BCR-ABL1 Tyrosine Kinase Inhibitor for Chronic Myeloid Leukemia (CML)",
        "clinicalNotes": "Revolutionized CML care: transforms fatal leukemia into manageable condition with near-normal life expectancy. Monitor quantitative RT-PCR for BCR-ABL1 transcripts every 3 months (Major Molecular Response target <= 0.1% at 12 months)."
      },
      {
        "drugName": "Cytarabine + Daunorubicin ('7+3' Standard Induction Regimen)",
        "strength": "Cytarabine 100-200 mg/m²/day continuous IV x 7 days + Daunorubicin 60-90 mg/m² IV push x 3 days",
        "dosageForm": "IV Infusion",
        "frequency": "Continuous IV infusion over 7 days (Cytarabine) + daily IV push days 1-3 (Daunorubicin)",
        "timing": "Inpatient HEPA-filtered protective isolation unit",
        "duration": "Single 7-day induction cycle (re-biopsy marrow on Day 14/21)",
        "regimenType": "Standard Gold-Standard Induction Chemotherapy for Acute Myeloid Leukemia (AML)",
        "clinicalNotes": "Requires intensive inpatient supportive care: transfusions (maintain platelets > 10,000-20,000/µL, Hb > 8.0 g/dL), prophylactic Posaconazole and Levofloxacin during profound neutropenia."
      },
      {
        "drugName": "Rasburicase (Recombinant Urate Oxidase)",
        "strength": "0.2 mg/kg IV in 50 mL 0.9% Normal Saline",
        "dosageForm": "IV Infusion",
        "frequency": "Once daily",
        "timing": "Infuse over 30 minutes strictly",
        "duration": "1 to 3 days during induction cytoreduction",
        "regimenType": "Enzymatic Uric Acid Degradation for High-Risk Tumor Lysis Syndrome",
        "clinicalNotes": "Rapidly converts insoluble uric acid into highly soluble allantoin (5-10 times more soluble). CONTRAINDICATION: G6PD deficiency (causes severe methemoglobinemia and acute hemolysis). Blood samples for uric acid must be collected in pre-chilled heparin tubes on ice."
      },
      {
        "drugName": "Allopurinol",
        "strength": "300 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "After meals with aggressive oral hydration (>2-3 L/day)",
        "duration": "During cytoreductive phase",
        "regimenType": "Xanthine Oxidase Inhibitor for Low-to-Intermediate Risk TLS",
        "clinicalNotes": "Blocks synthesis of new uric acid. Prevents hyperuricemic crystal nephropathy."
      }
    ],
    "complications": [
      "Catastrophic neutropenic typhlitis or invasive fungal infection (Aspergillus / Mucorales)",
      "Fatal intracerebral or pulmonary hemorrhage from profound thrombocytopenia or DIC",
      "Acute anuric renal failure secondary to tumor lysis syndrome"
    ],
    "referralTriggers": [
      "Presence of peripheral blood blasts on routine smear (immediate emergency referral to tertiary Leukemia/BMT unit)",
      "Suspected Acute Promyelocytic Leukemia (start All-Trans Retinoic Acid [ATRA] immediately without waiting for cytogenetics to prevent fatal coagulopathy)",
      "WBC > 50,000/µL with respiratory or neurologic symptoms (urgent leukapheresis / hydroxyurea cytoreduction)"
    ]
  },
  "skin-cancer": {
    "id": "skin-cancer",
    "name": "Skin Cancer (Melanoma & Non-Melanoma)",
    "medicalName": "Cutaneous Malignant Melanoma & Keratinocyte Carcinomas (BCC / SCC)",
    "category": "Cancer Types",
    "subCategory": "Common Cancers",
    "icdCode": "C43.9 / C44.9",
    "datasetSource": "NCCN Guidelines for Cutaneous Melanoma v2.2026 & American Academy of Dermatology",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant transformation of epidermal melanocytes (melanoma) or keratinocytes (Basal Cell Carcinoma [BCC] and Squamous Cell Carcinoma [SCC]) driven by ultraviolet radiation damage.",
    "symptoms": {
      "hallmark": [
        "Melanoma ABCDE criteria: Asymmetry, Border irregularity, Color variegation (tan, black, brown, red, blue), Diameter > 6 mm, Evolving/changing size or elevation",
        "BCC: Pearly, translucent, rolled-border nodule with central depression, arborizing telangiectasias, and recurrent spontaneous crusting/bleeding",
        "SCC: Hyperkeratotic, indurated, crusted, erythematous plaque or non-healing ulcer on chronic sun-exposed head/neck surfaces",
        "'Ugly Duckling' sign: a pigmented nevus that looks distinctly different from all surrounding moles"
      ],
      "earlySigns": [
        "New localized itching, tingling, or tenderness in a pre-existing quiescent mole",
        "Subtle darkening or pigment spilling into surrounding normal skin",
        "A cutaneous sore that fails to heal after 4 to 6 weeks"
      ],
      "redFlags": [
        "Spontaneous ulceration and bleeding from a melanocytic lesion (correlates with higher Breslow depth)",
        "Presence of satellite cutaneous pigmented nodules within 2 cm of primary lesion",
        "Palpable, firm, enlarged regional lymphadenopathy (axillary, inguinal, or cervical)",
        "In-transit metastases: subcutaneous nodules between primary tumor and regional nodal basin"
      ]
    },
    "requiredTests": [
      {
        "testName": "Full-Body Digital Dermoscopy & Total Body Photography",
        "type": "Dermatologic Optical Diagnostic Gold Standard",
        "purpose": "Identifies dermatoscopic hallmarks: atypical pigment network, regression structures, blue-white veil, irregular streaks/pseudopods",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Complete Excisional Biopsy with 1 to 2 mm Margins",
        "type": "Histopathology Gold Standard",
        "purpose": "MANDATORY: Full-thickness elliptical excision preferred over shave/punch; preserves micro-architecture for precise Breslow tumor thickness (mm)",
        "urgency": "Priority / Within 1 week"
      },
      {
        "testName": "Histopathologic Staging: Breslow Depth, Ulceration, Mitotic Rate, Margins",
        "type": "Pathology Staging",
        "purpose": "Breslow depth in millimeters is single most critical T-category prognostic factor; determines indication for Sentinel Lymph Node Biopsy (SLNB)",
        "urgency": "Priority"
      },
      {
        "testName": "BRAF V600 Mutation Molecular Testing (V600E / V600K)",
        "type": "Molecular Assay",
        "purpose": "MANDATORY in Stage III and Stage IV melanoma: Identifies candidates for targeted BRAF/MEK inhibitor combination therapy",
        "urgency": "Priority"
      },
      {
        "testName": "Sentinel Lymph Node Biopsy (SLNB) with Technetium-99m & Blue Dye",
        "type": "Surgical Staging Procedure",
        "purpose": "Recommended for melanoma with Breslow thickness > 0.8 mm (or <0.8 mm with ulceration); accurate pathological regional nodal staging",
        "urgency": "Performed at time of Wide Local Excision"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Dabrafenib + Trametinib (Dual BRAF + MEK Kinase Inhibition)",
        "strength": "Dabrafenib 150 mg BID + Trametinib 2 mg OD",
        "dosageForm": "Oral Capsule (Dabrafenib) + Oral Tablet (Trametinib)",
        "frequency": "Dabrafenib: twice daily; Trametinib: once daily",
        "timing": "Strictly on an empty stomach >= 1 hour before or 2 hours after meals",
        "duration": "12 months adjuvant in Stage III; ongoing until progression in Stage IV",
        "regimenType": "Targeted MAPK Pathway Blockade for BRAF V600 Mutant Melanoma",
        "clinicalNotes": "COMBI-d / COMBI-AD trials: Dramatic rapid tumor regression and overall survival improvement. Dual blockade prevents paradoxical MAPK reactivation and cutaneous SCC. Educate patient on recognizing pyrexia syndrome (manage with drug holds and paracetamol)."
      },
      {
        "drugName": "Nivolumab + Ipilimumab (Dual PD-1 + CTLA-4 Immune Checkpoint Blockade)",
        "strength": "Nivolumab 1 mg/kg + Ipilimumab 3 mg/kg IV every 3 weeks x 4 doses -> Nivolumab 480 mg Q4W maintenance",
        "dosageForm": "IV Infusion",
        "frequency": "Every 3 weeks x 4 cycles, then every 4 weeks",
        "timing": "Slow IV infusion over 30 to 60 minutes",
        "duration": "Up to 2 years or until disease progression",
        "regimenType": "Dual Checkpoint Immunotherapy for Advanced / Metastatic Melanoma",
        "clinicalNotes": "CheckMate 067 trial: Unprecedented 50%+ 5-year overall survival in metastatic melanoma. High risk of autoimmune immune-related adverse events (irAEs: severe colitis, hypophysitis, hepatitis); requires prompt systemic corticosteroid protocol."
      },
      {
        "drugName": "Imiquimod 5% Topical Cream",
        "strength": "5% w/w cream (single-use sachet)",
        "dosageForm": "Topical Cream",
        "frequency": "5 times weekly at bedtime",
        "timing": "Apply sparingly to clean dry lesion; leave on for 8 hours then wash off with soap/water",
        "duration": "6 to 12 weeks",
        "regimenType": "Topical Toll-Like Receptor-7 (TLR-7) Immune Response Modifier",
        "clinicalNotes": "Indicated for superficial Basal Cell Carcinoma and Lentigo Maligna in non-surgical candidates or cosmetically sensitive facial zones."
      }
    ],
    "complications": [
      "Distant systemic metastatic dissemination to brain, liver, lungs, and bowel (melanoma has highest tropism for brain)",
      "Extensive local tissue destruction ('rodent ulcer' invasion into facial bone and orbit in neglected BCC)",
      "Secondary perineural invasion and cranial nerve neuropathies in cutaneous SCC"
    ],
    "referralTriggers": [
      "Any pigmented skin lesion with positive ABCDE criteria or Breslow thickness > 0.8 mm (refer immediately to Surgical Oncologist / Melanoma Specialist)",
      "Non-healing ulcer on face or lip lasting > 4 weeks",
      "Melanoma patient presenting with headache or focal neurologic symptoms (urgent contrast Brain MRI)"
    ]
  },
  "prostate-cancer": {
    "id": "prostate-cancer",
    "name": "Prostate Cancer",
    "medicalName": "Prostatic Adenocarcinoma",
    "category": "Cancer Types",
    "subCategory": "Other Cancers",
    "icdCode": "C61",
    "datasetSource": "NCCN Guidelines for Prostate Cancer v1.2026 & EAU Guidelines",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant epithelial neoplasm originating from peripheral zone glandular acini of the prostate gland, strongly driven by androgen receptor signaling.",
    "symptoms": {
      "hallmark": [
        "Predominantly asymptomatic in early stages, detected through screening PSA elevation",
        "Lower Urinary Tract Symptoms (LUTS): progressive urinary hesitancy, diminished caliber and force of urinary stream, terminal dribbling",
        "Nocturia (waking >=3-4 times per night) and sensation of incomplete bladder emptying",
        "Macroscopic hematuria or hematospermia (blood in ejaculate)"
      ],
      "earlySigns": [
        "Subtle weakening of urinary flow easily misattributed to benign prostatic hyperplasia (BPH)",
        "Occasional post-void dribbling and perineal fullness",
        "Mild unprovoked rise in serial PSA"
      ],
      "redFlags": [
        "Metastatic Skeletal Bone Pain: severe, unremitting, aching pain in lumbosacral spine, pelvis, or ribs, worse at night",
        "Spinal Cord Compression: progressive bilateral lower limb paraparesis, sensory loss, and urinary/fecal incontinence",
        "Acute Urinary Retention: painful palpable overdistended bladder requiring emergency urethral catheterization",
        "Bilateral ureteral obstruction with hydronephrosis and acute post-renal azotemia"
      ]
    },
    "requiredTests": [
      {
        "testName": "Serum Total Prostate-Specific Antigen (Total PSA) & Free-to-Total PSA Ratio",
        "type": "Biomarker Immunoassay Gold Standard",
        "purpose": "Reference range age-adjusted; PSA > 4.0 ng/mL warrants clinical evaluation; Free/Total ratio < 15% increases suspicion of cancer over BPH",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Multiparametric Prostate MRI (mpMRI via PI-RADS v2.1 Criteria)",
        "type": "Diagnostic Imaging Gold Standard",
        "purpose": "PI-RADS 1-5 scoring: T2-weighted, Diffusion-Weighted Imaging (DWI/ADC), Dynamic Contrast Enhancement (DCE); identifies index suspicious lesions before biopsy",
        "urgency": "Priority / Pre-Biopsy"
      },
      {
        "testName": "MRI-Transrectal Ultrasound (TRUS) Fusion Targeted Core Needle Biopsy",
        "type": "Histopathology Gold Standard",
        "purpose": "Combines mpMRI lesion targeting with 12-core systematic template; assigns ISUP Gleason Grade Group 1 (3+3) to Group 5 (4+5, 5+4, 5+5)",
        "urgency": "Priority"
      },
      {
        "testName": "68Ga-PSMA-11 PET-CT Whole-Body Molecular Imaging",
        "type": "Targeted Radiotracer Imaging",
        "purpose": "Highest sensitivity and specificity for nodal and distant osteoblastic metastases in intermediate-to-high risk or biochemical recurrence",
        "urgency": "Priority / Staging"
      },
      {
        "testName": "Serum Alkaline Phosphatase & Serum Calcium",
        "type": "Laboratory Assay",
        "purpose": "Significantly elevated in widespread osteoblastic skeletal metastatic disease",
        "urgency": "Routine"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Leuprolide Acetate (or Goserelin Acetate Depot)",
        "strength": "22.5 mg (3-month depot) or 45 mg (6-month depot)",
        "dosageForm": "Intramuscular / Subcutaneous Depot Injection",
        "frequency": "Every 3 to 6 months",
        "timing": "Administered by healthcare provider",
        "duration": "Adjuvant with radiation: 2-3 years; Metastatic: lifelong ongoing",
        "regimenType": "LHRH / GnRH Agonist for Androgen Deprivation Therapy (ADT)",
        "clinicalNotes": "Suppresses pituitary LH release, downregulating testicular testosterone production to castrate levels (<50 ng/dL). MANDATORY: Co-administer oral Bicalutamide for 2-4 weeks prior to initial depot to prevent symptomatic clinical tumor flare caused by initial LH surge."
      },
      {
        "drugName": "Enzalutamide (or Apalutamide / Darolutamide)",
        "strength": "160 mg",
        "dosageForm": "Oral Capsule / Tablet",
        "frequency": "Once daily (OD)",
        "timing": "With or without food at the same time each day",
        "duration": "Ongoing until disease progression",
        "regimenType": "Second-Generation Androgen Receptor Signaling Inhibitor (ARSI)",
        "clinicalNotes": "ARCHES / PROSPER / PREVAIL trials: Competitively inhibits androgen binding, nuclear translocation, and DNA association. Markedly improves overall survival in metastatic hormone-sensitive (mHSPC) and castration-resistant (CRPC) disease. Monitor for fatigue, hypertension, and rare seizure risk."
      },
      {
        "drugName": "Tamsulosin Hydrochloride",
        "strength": "0.4 mg",
        "dosageForm": "Modified-Release Oral Capsule",
        "frequency": "Once daily (OD)",
        "timing": "30 minutes after the same meal each day",
        "duration": "Ongoing as needed for voiding symptoms",
        "regimenType": "Uroselective Alpha-1A Adrenergic Antagonist",
        "clinicalNotes": "Relaxes smooth muscle tone in prostate stroma and bladder neck; improves peak urinary flow rate and relieves obstructive voiding symptoms."
      },
      {
        "drugName": "Zoledronic Acid (or Denosumab)",
        "strength": "4.0 mg in 100 mL Normal Saline (Denosumab 120 mg SC)",
        "dosageForm": "IV Infusion",
        "frequency": "Every 4 weeks",
        "timing": "Slow IV infusion over >= 15 minutes",
        "duration": "Ongoing in metastatic bone disease",
        "regimenType": "Bone-Targeted Antiresorptive Agent",
        "clinicalNotes": "Significantly delays Skeletal-Related Events (pathological fractures, spinal cord compression, need for radiation). Ensure baseline dental clearance to prevent osteonecrosis of the jaw (ONJ); co-prescribe Calcium + Vitamin D."
      }
    ],
    "complications": [
      "Extensive osteoblastic skeletal metastases with intractable bone pain and pathological fractures",
      "Malignant spinal cord compression with irreversible lower body paralysis",
      "Complete urinary outlet obstruction and bilateral hydronephrosis with renal failure"
    ],
    "referralTriggers": [
      "Confirmed Gleason score >= 7 (4+3) or PSA > 20 ng/mL (refer to Uro-Oncology multidisciplinary team for radical prostatectomy vs definitive EBRT+ADT)",
      "Acute back pain with new lower limb weakness in a prostate cancer patient (EMERGENCY whole-spine MRI for impending cord compression)",
      "Rising PSA post-radical prostatectomy (>0.2 ng/mL) or post-radiotherapy (nadir + 2 ng/mL - biochemical recurrence)"
    ]
  },
  "cervical-cancer": {
    "id": "cervical-cancer",
    "name": "Cervical Cancer",
    "medicalName": "Cervical Carcinoma (Squamous Cell & Adenocarcinoma)",
    "category": "Cancer Types",
    "subCategory": "Other Cancers",
    "icdCode": "C53.9",
    "datasetSource": "NCCN Guidelines for Cervical Cancer v1.2026, WHO Cervical Cancer Elimination Initiative & FIGO",
    "evidenceLevel": "Category 1 / Level 1A (NCCN / FIGO Consensus)",
    "overview": "Malignant epithelial neoplasm of uterine cervix etiologically driven by persistent high-risk Human Papillomavirus (hrHPV types 16, 18, 31, 33, 45, 52, 58) infection.",
    "symptoms": {
      "hallmark": [
        "Postcoital vaginal contact bleeding (bright red spotting immediately following intercourse)",
        "Irregular intermenstrual or postmenopausal vaginal hemorrhage",
        "Persistent watery, serosanguinous, or purulent foul-smelling vaginal discharge",
        "Deep pelvic dull aching pain and lower back discomfort"
      ],
      "earlySigns": [
        "Completely asymptomatic in premalignant stages (CIN I-III / HSIL), detected via Pap/HPV screening",
        "Mild unprovoked vaginal moisture",
        "Cervical contact bleeding during routine speculum examination"
      ],
      "redFlags": [
        "Severe unilateral lower extremity lymphedema from pelvic lymphatic occlusion",
        "Flank pain and costovertebral tenderness from parametrial ureteral encasement (hydronephrosis)",
        "Vesicovaginal or rectovaginal fistula formation (leakage of urine or feces via vagina)",
        "Sciatic nerve root pain radiating down posterior leg from sacral plexus tumor invasion"
      ]
    },
    "requiredTests": [
      {
        "testName": "High-Risk HPV DNA Testing & Liquid-Based Cytology (LBC / Pap Smear)",
        "type": "Primary Screening Gold Standard",
        "purpose": "WHO recommended primary screening modality: detects E6/E7 oncogene expression of hrHPV genotypes",
        "urgency": "Routine / Diagnostic"
      },
      {
        "testName": "Colposcopy with Acetic Acid & Lugol's Iodine Directed Biopsy + ECC",
        "type": "Histopathology Gold Standard",
        "purpose": "Magnified colposcopic visualization of abnormal transformation zone (acetowhite epithelium, punctation, mosaicism) and punch biopsy plus endocervical curettage",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Pelvic High-Resolution Contrast MRI",
        "type": "Diagnostic Staging Imaging Gold Standard",
        "purpose": "Optimal imaging modality to accurately measure cervical tumor diameter, depth of stromal invasion, vaginal extension, and parametrial invasion (FIGO stage IIB)",
        "urgency": "Priority / Pre-treatment"
      },
      {
        "testName": "Whole-Body 18F-FDG PET-CT Staging Scan",
        "type": "Nuclear Molecular Staging",
        "purpose": "Essential to evaluate pelvic and para-aortic retroperitoneal lymph node metastases and distant visceral dissemination",
        "urgency": "Priority"
      },
      {
        "testName": "Renal Function Panel (Serum Creatinine, BUN) & Renal Ultrasound",
        "type": "Laboratory & Imaging Assay",
        "purpose": "MANDATORY: Screens for bilateral or unilateral obstructive uropathy / hydronephrosis (which automatically upstages to FIGO Stage IIIC2/IVA)",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Cisplatin (Concurrent Chemoradiotherapy - CCRT)",
        "strength": "40 mg/m² (maximum capped at 70 mg per dose)",
        "dosageForm": "IV Infusion with Aggressive Hydration",
        "frequency": "Once weekly during external beam pelvic radiotherapy",
        "timing": "Infuse over 60 mins following 1,000 mL Normal Saline + Mannitol prehydration",
        "duration": "5 to 6 weekly cycles concomitant with EBRT",
        "regimenType": "Radiosensitizing Chemotherapy (NCCN Standard for Locally Advanced Stage IB3-IVA)",
        "clinicalNotes": "Inhibits sublethal radiation damage repair in cervical tumor cells; significantly improves overall survival. Monitor serum creatinine and electrolytes weekly (hold if eGFR < 50 mL/min); aggressive antiemetic pre-medication."
      },
      {
        "drugName": "Paclitaxel + Carboplatin + Bevacizumab (for Recurrent / Metastatic Disease)",
        "strength": "Paclitaxel 175 mg/m² + Carboplatin AUC 5 + Bevacizumab 15 mg/kg",
        "dosageForm": "IV Infusion",
        "frequency": "Every 21 days (Q3W)",
        "timing": "Day 1 of each 21-day cycle",
        "duration": "6 cycles followed by maintenance Bevacizumab",
        "regimenType": "First-Line Chemotherapy + Anti-VEGF Protocol (GOG 240 Trial)",
        "clinicalNotes": "First systemic regimen to cross the 12-month median overall survival threshold in metastatic cervical cancer. Premedicate with dexamethasone, diphenhydramine, and ranitidine; monitor blood pressure and urinalysis for proteinuria."
      },
      {
        "drugName": "Tranexamic Acid",
        "strength": "500 mg to 1,000 mg",
        "dosageForm": "Oral Tablet / Slow IV Injection",
        "frequency": "Three times daily (TID) as needed",
        "timing": "After meals or slow IV push over 10 minutes",
        "duration": "3 to 5 days during bleeding episodes",
        "regimenType": "Antifibrinolytic Hemostatic Agent",
        "clinicalNotes": "Rapidly controls acute excessive tumor-related vaginal oozing; does not increase systemic thromboembolism risk when used short-term."
      }
    ],
    "complications": [
      "Severe bilateral obstructive uropathy and uremic renal failure requiring emergent percutaneous nephrostomy (PCN)",
      "Catastrophic acute torrential vaginal hemorrhage from tumor erosion into uterine arteries",
      "Radiation-induced chronic proctitis, radiation cystitis, and rectovaginal fistula"
    ],
    "referralTriggers": [
      "Confirmed cervical biopsy showing invasive carcinoma or CIN III (immediate referral to Gynecologic Oncology multidisciplinary team)",
      "Gross hematuria, fecaluria, or watery leakage from vagina (urgent examination under anesthesia [EUA] for fistulae)",
      "Elevated serum creatinine with hydronephrosis in known cervical cancer"
    ]
  },
  "stomach-cancer": {
    "id": "stomach-cancer",
    "name": "Stomach Cancer (Gastric Cancer)",
    "medicalName": "Gastric Adenocarcinoma & Gastroesophageal Junction (GEJ) Tumors",
    "category": "Cancer Types",
    "subCategory": "Digestive Cancers",
    "icdCode": "C16.9",
    "datasetSource": "NCCN Clinical Practice Guidelines in Oncology (Gastric Cancer) v2.2026 & ESMO",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant epithelial adenocarcinoma arising from gastric mucosa, categorized into intestinal and diffuse types (Lauren classification) with high propensity for lymphatic and peritoneal metastasis.",
    "symptoms": {
      "hallmark": [
        "Persistent non-ulcer dyspepsia, epigastric discomfort, and early satiety (feeling full after eating small amounts)",
        "Unintentional, progressive, and profound weight loss with severe anorexia",
        "Postprandial vomiting of partially digested food (distal pyloric antral obstruction)",
        "Constant gnawing epigastric pain unaffected by food or standard antacid therapy"
      ],
      "earlySigns": [
        "Vague upper abdominal bloating and postprandial heaviness",
        "Mild fatigue secondary to occult microcytic iron deficiency anemia",
        "Subtle nausea and aversion to meat products"
      ],
      "redFlags": [
        "Upper Gastrointestinal Bleeding: hematemesis ('coffee-ground') or dark tarry melena",
        "Virchow's Node: hard, painless, palpable left supraclavicular lymph node",
        "Sister Mary Joseph Nodule: metastatic cutaneous periumbilical nodule",
        "Krukenberg Tumor: palpable bilateral adnexal ovarian masses in premenopausal women",
        "Malignant Peritoneal Carcinomatosis: shifting abdominal dullness and tense ascites"
      ]
    },
    "requiredTests": [
      {
        "testName": "Upper Gastrointestinal Endoscopy (EGD) with Multiple Mucosal Biopsies",
        "type": "Endoscopy & Histopathology Gold Standard",
        "purpose": "Direct visualization: MANDATORY >= 6 to 8 biopsies from ulcer margin and base to achieve >98% diagnostic accuracy and histological typing",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Contrast-Enhanced CT of Chest, Abdomen, and Pelvis",
        "type": "Staging Imaging Gold Standard",
        "purpose": "Evaluates gastric wall thickness, perigastric lymphadenopathy, hepatic metastases, and peritoneal carcinomatosis",
        "urgency": "Priority"
      },
      {
        "testName": "Diagnostic Staging Laparoscopy with Peritoneal Washings Cytology",
        "type": "Minimally Invasive Surgical Staging",
        "purpose": "MANDATORY in cT1b or higher resectable disease: detects radiographically occult peritoneal micrometastases in 20-30% of cases, avoiding futile non-curative laparotomy",
        "urgency": "Priority / Pre-Surgical"
      },
      {
        "testName": "HER2/neu Immunohistochemistry (IHC) & In Situ Hybridization (FISH)",
        "type": "Biomarker Assay",
        "purpose": "MANDATORY in advanced/metastatic disease: IHC 3+ or IHC 2+/FISH positive qualifies for targeted anti-HER2 therapy (Trastuzumab)",
        "urgency": "Priority"
      },
      {
        "testName": "Mismatch Repair / Microsatellite Instability (MMR/MSI) & PD-L1 CPS",
        "type": "Molecular Assay",
        "purpose": "Combined Positive Score (CPS >= 5): guides addition of Nivolumab or Pembrolizumab immunotherapy to first-line chemotherapy",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "FLOT Chemotherapy Regimen (Perioperative Protocol)",
        "strength": "Docetaxel 50 mg/m² + Oxaliplatin 85 mg/m² + Leucovorin 200 mg/m² + 5-Fluorouracil 2,600 mg/m² continuous IV over 24 hours",
        "dosageForm": "IV Infusion",
        "frequency": "Every 14 days (Q2W)",
        "timing": "Days 1-2 of each 14-day cycle",
        "duration": "4 cycles preoperative followed by 4 cycles postoperative (total 8 cycles)",
        "regimenType": "NCCN Category 1 Perioperative Standard for Resectable Gastric / GEJ Adenocarcinoma",
        "clinicalNotes": "FLOT4 trial: Substantially superior pathological complete response and 5-year overall survival (45% vs 36%) compared to older ECF/ECX regimens. Requires prophylactic G-CSF (pegfilgrastim) and intensive antiemetic prophylaxis."
      },
      {
        "drugName": "Trastuzumab (for HER2-Positive Advanced Gastric Cancer)",
        "strength": "8 mg/kg IV loading dose -> 6 mg/kg maintenance IV every 3 weeks",
        "dosageForm": "IV Infusion",
        "frequency": "Every 3 weeks (Q3W)",
        "timing": "Infuse over 60 to 90 minutes concurrent with chemotherapy",
        "duration": "Ongoing until disease progression",
        "regimenType": "Anti-HER2 Targeted Monoclonal Antibody (ToGA Protocol)",
        "clinicalNotes": "Significantly prolongs overall survival in HER2-overexpressing gastric adenocarcinoma. Baseline and every 3-month echocardiographic LVEF monitoring mandatory."
      },
      {
        "drugName": "Pantoprazole Sodium",
        "strength": "40 mg",
        "dosageForm": "Oral Tablet / Slow IV Injection",
        "frequency": "Twice daily (BID)",
        "timing": "30 to 60 minutes before breakfast and dinner",
        "duration": "Ongoing supportive therapy",
        "regimenType": "Proton Pump Inhibitor for Acid Suppression & Mucosal Protection",
        "clinicalNotes": "Controls tumor-associated acid erosion, mitigates mucosal capillary oozing, and enhances patient tolerance of oral intake."
      }
    ],
    "complications": [
      "Severe gastric outlet obstruction requiring endoscopic self-expanding metal stent (SEMS) placement or gastrojejunostomy",
      "Massive upper gastrointestinal hemorrhage from ulcerating tumor bed",
      "Rapid malignant cachexia and nutritional exhaustion from profound anorexia and malabsorption"
    ],
    "referralTriggers": [
      "New-onset dyspepsia in any patient age > 55 years or with ANY red flag symptom (immediate fast-track upper GI endoscopy within 2 weeks)",
      "Biopsy-proven gastric adenocarcinoma (referral to Upper GI Surgical Oncology Multidisciplinary Tumor Board)",
      "Sudden acute peritonitis from gastric tumor perforation (emergency surgical intervention)"
    ]
  },
  "liver-cancer": {
    "id": "liver-cancer",
    "name": "Liver Cancer (Hepatocellular Carcinoma)",
    "medicalName": "Hepatocellular Carcinoma (HCC) & Cholangiocarcinoma",
    "category": "Cancer Types",
    "subCategory": "Digestive Cancers",
    "icdCode": "C22.0",
    "datasetSource": "AASLD Guidelines for Treatment of Hepatocellular Carcinoma, EASL & NCCN",
    "evidenceLevel": "Category 1 / Level 1A (AASLD Consensus Guidelines)",
    "overview": "Primary malignant neoplasm of hepatocytes developing almost exclusively in the setting of chronic cirrhosis (secondary to Hepatitis B/C, alcohol, or MASH).",
    "symptoms": {
      "hallmark": [
        "Right upper quadrant dull gnawing pain and hepatic capsular stretch discomfort",
        "Abrupt clinical decompensation in a previously stable cirrhotic patient (new ascites, jaundice, or encephalopathy)",
        "Palpable firm, irregular, nodular hepatomegaly with audible arterial systolic bruit over the liver",
        "Profound anorexia, severe cachexia, and rapid unprovoked wasting"
      ],
      "earlySigns": [
        "Unexplained worsening of baseline fatigue and physical stamina",
        "Mild unprovoked rise in serum alkaline phosphatase or bilirubin",
        "Sudden destabilization of previously well-controlled diabetes mellitus"
      ],
      "redFlags": [
        "Spontaneous Tumor Rupture: sudden agonizing abdominal pain, peritoneal signs, and hypovolemic hemorrhagic shock (intraperitoneal bleeding)",
        "Malignant Portal Vein Tumor Thrombosis (PVTT): rapid development of intractable refractory ascites and massive splenomegaly",
        "Severe obstructive jaundice from biliary tumor thrombus migration into common bile duct"
      ]
    },
    "requiredTests": [
      {
        "testName": "Dynamic Multiphase Contrast-Enhanced Liver MRI or Multidetector CT",
        "type": "Diagnostic Imaging Gold Standard (LI-RADS Criteria)",
        "purpose": "AASLD Non-Invasive Diagnostic Criteria: Hallmark arterial phase hyperenhancement ('wash-in') followed by venous/delayed phase hypointensity ('washout') in cirrhosis is 100% specific; biopsy not required",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Serum Alpha-Fetoprotein (AFP) & PIVKA-II (DCP)",
        "type": "Serological Tumor Biomarkers",
        "purpose": "Serum AFP > 400 ng/mL in high-risk cirrhotic highly predictive of HCC; serial AFP tracks therapeutic response and recurrence",
        "urgency": "Priority"
      },
      {
        "testName": "Child-Pugh Score & ALBI Grade (Albumin-Bilirubin Functional Reserve)",
        "type": "Hepatic Functional Reserve Staging",
        "purpose": "MANDATORY: Classifies Child-Pugh A (5-6 points), B (7-9 points), C (10-15 points); determines eligibility for resection, ablation, TACE, or systemic therapy",
        "urgency": "Priority"
      },
      {
        "testName": "Upper GI Endoscopy (EGD) for Variceal Screening",
        "type": "Endoscopic Screening",
        "purpose": "MANDATORY prior to initiating anti-VEGF therapy (Bevacizumab): screen and prophylactically band high-risk esophageal varices to prevent fatal hemorrhage",
        "urgency": "Priority / Pre-treatment"
      },
      {
        "testName": "Chest CT & 99mTc Bone Scintigraphy",
        "type": "Staging Imaging",
        "purpose": "Mandatory to exclude extrahepatic pulmonary (most common) and skeletal metastases prior to surgical resection or liver transplantation",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Atezolizumab + Bevacizumab (IMbrave150 Protocol)",
        "strength": "Atezolizumab 1,200 mg IV + Bevacizumab 15 mg/kg IV",
        "dosageForm": "IV Infusion",
        "frequency": "Every 3 weeks (Q3W)",
        "timing": "Slow IV infusion over 60 minutes",
        "duration": "Ongoing until disease progression or unacceptable toxicity",
        "regimenType": "NCCN & AASLD Preferred First-Line Systemic Therapy for Unresectable HCC",
        "clinicalNotes": "Combines PD-L1 immune checkpoint inhibition with VEGF anti-angiogenic blockade. Significantly superior overall and progression-free survival compared to sorafenib. Contraindicated in untreated high-risk esophageal varices (bleeding risk) or severe autoimmune disease."
      },
      {
        "drugName": "Lenvatinib Mesylate",
        "strength": "8 mg once daily (for body weight < 60 kg) or 12 mg once daily (for body weight >= 60 kg)",
        "dosageForm": "Oral Capsule",
        "frequency": "Once daily (OD)",
        "timing": "With or without food at the same time each day",
        "duration": "Ongoing until disease progression",
        "regimenType": "First-Line Multi-Receptor Tyrosine Kinase Inhibitor (VEGFR 1-3, FGFR 1-4, PDGFR, RET)",
        "clinicalNotes": "REFLECT trial: Non-inferior overall survival with superior objective response rate (24% vs 9%) over sorafenib. High efficacy in viral and non-viral HCC. Monitor daily blood pressure (manage hypertension aggressively) and check urine dipstick for proteinuria."
      },
      {
        "drugName": "Sorafenib Tosylate",
        "strength": "400 mg (two 200 mg tablets)",
        "dosageForm": "Oral Tablet",
        "frequency": "Twice daily (BID)",
        "timing": "On an empty stomach >= 1 hour before or 2 hours after meals",
        "duration": "Ongoing until progression",
        "regimenType": "Established First-Line Oral Multikinase Inhibitor Alternative",
        "clinicalNotes": "SHARP landmark trial: First systemic agent to demonstrate survival benefit in advanced HCC. Counsel patient on Hand-Foot Skin Reaction (manage with urea creams and dose titration)."
      }
    ],
    "complications": [
      "Spontaneous acute intraperitoneal hemoperitoneum from tumor rupture with 30-50% acute mortality",
      "Accelerated liver failure and hepatic encephalopathy from extensive parenchymal replacement",
      "Portal hypertension crisis with massive exsanguinating variceal bleeding"
    ],
    "referralTriggers": [
      "New solitary liver lesion in a cirrhotic patient meeting Milan criteria (single nodule <=5 cm, or up to 3 nodules each <=3 cm) -> URGENT referral for Liver Transplantation",
      "Suspected HCC meeting surgical resection criteria (Child-Pugh A, normal bilirubin, no portal hypertension)",
      "Sudden acute severe abdominal pain with falling hemoglobin in known HCC patient (emergency hepatic transcatheter arterial embolization [TAE])"
    ]
  },
  "brain-cancer": {
    "id": "brain-cancer",
    "name": "Brain Cancer (Glioblastoma & High-Grade Glioma)",
    "medicalName": "Glioblastoma Multiforme (GBM) & Astrocytoma (WHO Grade 3-4)",
    "category": "Cancer Types",
    "subCategory": "Other Cancers",
    "icdCode": "C71.9",
    "datasetSource": "NCCN Clinical Practice Guidelines in Oncology (CNS Cancers) v1.2026 & EANO Guidelines",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Highly aggressive, infiltrative malignant neuroepithelial neoplasm of astrocytic lineage characterized by nuclear atypia, microvascular proliferation, and pseudopalisading necrosis.",
    "symptoms": {
      "hallmark": [
        "Progressive throbbing headache (worse in the morning, awakened from sleep, aggravated by coughing, bending, or Valsalva maneuvers)",
        "New adult-onset focal or generalized seizures in a patient without prior epilepsy history",
        "Progressive unilateral hemiparesis, focal motor weakness, or sensory loss",
        "Subacute personality alterations, executive dysfunction, emotional apathy, and cognitive slowing"
      ],
      "earlySigns": [
        "Subtle word-finding difficulties (anomic dysphasia) or comprehension deficits",
        "Mild unsteadiness, ataxia, or clumsy hand coordination",
        "Transient visual field cuts (homonymous hemianopia)"
      ],
      "redFlags": [
        "Triad of Acute Raised Intracranial Pressure (ICP): Bilateral papilledema, projectile vomiting without preceding nausea, severe somnolence",
        "Cushing's Triad (Impending Transtentorial Herniation): Bradycardia, irregular respiratory pattern, widening pulse pressure / hypertension",
        "Status Epilepticus: Continuous refractory seizures > 5 minutes without recovery of consciousness"
      ]
    },
    "requiredTests": [
      {
        "testName": "Multi-Sequence Contrast-Enhanced Brain MRI (T1, T2, FLAIR, T1+Gadolinium, DWI)",
        "type": "Neuroimaging Gold Standard",
        "purpose": "Hallmark appearance: Thick, irregular, nodular ring-enhancing mass with central hypointense necrosis and extensive surrounding FLAIR hyperintense vasogenic edema",
        "urgency": "Stat / Immediate"
      },
      {
        "testName": "Magnetic Resonance Spectroscopy (MRS) & Perfusion MRI (PWI)",
        "type": "Advanced Neuroimaging",
        "purpose": "Spectroscopy shows elevated Choline peak (membrane turnover), depressed N-acetylaspartate (NAA; neuronal loss), and prominent Lipid/Lactate necrosis peak; PWI shows high rCBV",
        "urgency": "Priority / Pre-Surgical"
      },
      {
        "testName": "Stereotactic Biopsy or Maximal Safe Surgical Resection Histopathology",
        "type": "Neuropathology Gold Standard",
        "purpose": "WHO 2021 CNS Classification: pleomorphic fibrillary astrocytes, robust microvascular endothelial glomeruloid proliferation, and pathognomonic pseudopalisading necrosis",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Molecular Biomarker Panel: IDH1/2 Mutation, MGMT Promoter Methylation, 1p/19q",
        "type": "Molecular Neuro-Oncology",
        "purpose": "CRITICAL: MGMT promoter methylation predicts dramatic sensitivity to Temozolomide; IDH-wildtype confirms Glioblastoma; rules out 1p/19q codeleted oligodendroglioma",
        "urgency": "Priority"
      },
      {
        "testName": "Functional MRI (fMRI) & Diffusion Tensor Imaging (DTI) Tractography",
        "type": "Presurgical Neurosurgical Mapping",
        "purpose": "Maps corticospinal motor tracts and Broca/Wernicke language areas to maximize safe extent of resection while preserving functional neurological eloquence",
        "urgency": "Priority / Pre-Operative"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Temozolomide (TMZ - Stupp Protocol)",
        "strength": "Concomitant: 75 mg/m²/day daily x 42 days during radiotherapy -> Maintenance: 150-200 mg/m²/day for 5 days every 28 days x 6 cycles",
        "dosageForm": "Oral Capsule",
        "frequency": "Daily during RT; Days 1 to 5 of every 28-day cycle during maintenance",
        "timing": "Once daily at bedtime strictly on an empty stomach with a full glass of water",
        "duration": "6 weeks concurrent chemoradiotherapy followed by 6 cycles maintenance",
        "regimenType": "Alkylating Chemotherapy Standard of Care (Stupp Landmark Regimen)",
        "clinicalNotes": "Crosses blood-brain barrier with 100% oral bioavailability; methylation of O6-guanine causes DNA double-strand breaks. Dramatic survival benefit in MGMT-methylated tumors. Premedicate with Ondansetron 8 mg 30-60 mins prior to each dose."
      },
      {
        "drugName": "Dexamethasone Sodium Phosphate",
        "strength": "4 to 16 mg daily in divided doses (e.g. 4 mg BID or QID, tapered rapidly to lowest effective dose)",
        "dosageForm": "Oral Tablet / IV Injection",
        "frequency": "Two to four times daily",
        "timing": "Morning and early afternoon with meals",
        "duration": "Shortest duration necessary to control peritumoral edema",
        "regimenType": "High-Potency Glucocorticoid for Vasogenic Cerebral Edema",
        "clinicalNotes": "Rapidly repairs breached blood-brain barrier tight junctions; alleviates headache and focal deficits within 24-48 hours. Co-prescribe PPI (Pantoprazole); monitor blood glucose daily."
      },
      {
        "drugName": "Levetiracetam",
        "strength": "500 to 1,000 mg",
        "dosageForm": "Oral Film-Coated Tablet / IV Infusion",
        "frequency": "Twice daily (BID)",
        "timing": "With or without food",
        "duration": "Ongoing maintenance",
        "regimenType": "First-Line Antiepileptic Agent for Brain Tumor-Related Epilepsy (BTRE)",
        "clinicalNotes": "Binds SV2A synaptic vesicle protein. First choice in neuro-oncology: zero hepatic cytochrome P450 enzyme induction (unlike phenytoin/carbamazepine), eliminating drug interactions with chemotherapy and steroids."
      },
      {
        "drugName": "Trimethoprim-Sulfamethoxazole (TMP-SMX)",
        "strength": "1 Double-Strength Tablet (160 mg TMP / 800 mg SMX)",
        "dosageForm": "Oral Tablet",
        "frequency": "Three times weekly (e.g. Mon-Wed-Fri)",
        "timing": "After meals with water",
        "duration": "Throughout concurrent Temozolomide + Radiotherapy",
        "regimenType": "Pneumocystis jirovecii Pneumonia (PJP) Chemoprophylaxis",
        "clinicalNotes": "MANDATORY during concurrent chemoradiotherapy and steroid use due to profound lymphopenia (CD4 count < 200/µL)."
      }
    ],
    "complications": [
      "Fatal cerebral tentorial or tonsillar herniation from uncontrollable malignant brain edema",
      "Intratumoral apoplexy / acute intracranial hemorrhage into glioblastoma bed",
      "Profound cognitive deterioration and loss of functional independence"
    ],
    "referralTriggers": [
      "New-onset adult seizure or progressive focal neurological deficit with ring-enhancing mass (immediate emergency transfer to Neurosurgery / Neuro-Oncology)",
      "Signs of impending brain herniation (immediate IV Mannitol 20% 1 g/kg, IV Dexamethasone 16 mg, and urgent surgical decompression)",
      "Suspected tumor recurrence vs radiation necrosis (refer for Advanced PET/Perfusion MRI and Re-resection / Tumor Treating Fields [Optune])"
    ]
  },
  "colon-cancer": {
    "id": "colon-cancer",
    "name": "Colon & Colorectal Cancer",
    "medicalName": "Colorectal Adenocarcinoma",
    "category": "Cancer Types",
    "subCategory": "Digestive Cancers",
    "icdCode": "C18.9 / C20",
    "datasetSource": "NCCN Guidelines for Colon & Rectal Cancer v1.2026, ESMO & ASCO",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant epithelial adenocarcinoma arising from the colonic or rectal mucosa via adenoma-carcinoma sequence or serrated polyp pathway.",
    "symptoms": {
      "hallmark": [
        "Persistent alteration in bowel habits lasting >4-6 weeks (alternating diarrhea and constipation, narrowing of stool caliber to 'pencil-thin')",
        "Hematochezia (fresh bright red rectal bleeding) or dark mahogany stools mixed with mucus",
        "Tenesmus (distressing, painful, persistent feeling of incomplete rectal evacuation - typical of rectal cancer)",
        "Unexplained, involuntary, progressive weight loss and crampy colicky lower abdominal pain"
      ],
      "earlySigns": [
        "Unexplained microcytic iron deficiency anemia (classic presentation of right-sided cecal/ascending colon tumors)",
        "Subtle abdominal distension and postprandial gas discomfort",
        "Occult blood detected on screening stool tests (FIT/FOBT)"
      ],
      "redFlags": [
        "Acute Complete Large Bowel Mechanical Obstruction: Obstipation, profound abdominal distension, feculent vomiting",
        "Acute Bowel Perforation: Rigid silent abdomen, intense guarding, free air under diaphragm on erect radiography",
        "Palpable, firm, irregular right lower quadrant or rectal mass on digital rectal examination (DRE)",
        "Massive hematochezia producing hemodynamic hypotension"
      ]
    },
    "requiredTests": [
      {
        "testName": "Complete Optical Diagnostic Colonoscopy with Multiple Biopsies",
        "type": "Endoscopy & Histopathology Gold Standard",
        "purpose": "Direct mucosal visualization of entire colon to cecum: identifies primary adenocarcinoma and synchronous neoplasms (present in 3-5%); multiple biopsies provide tissue architecture",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Serum Carcinoembryonic Antigen (CEA)",
        "type": "Serum Glycoprotein Tumor Biomarker",
        "purpose": "Baseline prognostic benchmark and post-treatment surveillance marker: elevated baseline CEA (>5 ng/mL) correlates with nodal/metastatic disease; essential for monitoring recurrence",
        "urgency": "Priority / Pre-Operative"
      },
      {
        "testName": "Contrast-Enhanced CT of Chest, Abdomen, and Pelvis",
        "type": "Tri-Compartment Staging Imaging Gold Standard",
        "purpose": "Accurately stages primary colonic wall invasion depth (T), regional mesenteric nodal involvement (N), and distant hepatic (most common) and pulmonary (M) metastases",
        "urgency": "Priority"
      },
      {
        "testName": "High-Resolution Thin-Slice Pelvic MRI",
        "type": "Diagnostic Imaging (Mandatory for Rectal Cancer)",
        "purpose": "Precisely evaluates relationship of rectal tumor to Circumferential Resection Margin (CRM), depth of extramural vascular invasion (EMVI), and mesorectal fascia",
        "urgency": "Priority / Rectal Staging"
      },
      {
        "testName": "Comprehensive Biomarker Panel: MMR/MSI, KRAS, NRAS, BRAF V600E, HER2",
        "type": "Molecular Pathology",
        "purpose": "MANDATORY in metastatic disease: Mismatch Repair (dMMR/MSI-H) predicts curative response to Pembrolizumab; RAS/BRAF wild-type required for anti-EGFR therapy (Cetuximab)",
        "urgency": "Priority / Before Systemic Therapy"
      }
    ],
    "prescriptions": [
      {
        "drugName": "mFOLFOX6 Adjuvant Chemotherapy Protocol",
        "strength": "Oxaliplatin 85 mg/m² IV + Leucovorin 400 mg/m² IV + 5-Fluorouracil 400 mg/m² IV bolus followed by 5-FU 2,400 mg/m² continuous IV over 46 hours",
        "dosageForm": "IV Infusion via Ambulatory Infusion Pump",
        "frequency": "Every 14 days (Q2W)",
        "timing": "Days 1 to 3 of each 14-day cycle",
        "duration": "6 months (12 cycles) or 3 months (CAPOX) for low-risk Stage III colon cancer (IDEA Trial)",
        "regimenType": "NCCN Category 1 Standard Adjuvant Chemotherapy for Stage III & High-Risk Stage II",
        "clinicalNotes": "MOSAIC trial: Substantially improves disease-free and overall survival. CRITICAL COUNSELING: Oxaliplatin causes acute cold-induced peripheral sensory neuropathy (educate patient to avoid cold drinks, touching cold metal, or breathing cold air during infusion week)."
      },
      {
        "drugName": "Pembrolizumab (Anti-PD-1 Monotherapy for MSI-H / dMMR Metastatic CRC)",
        "strength": "200 mg every 3 weeks (or 400 mg every 6 weeks)",
        "dosageForm": "IV Infusion",
        "frequency": "Every 3 to 6 weeks",
        "timing": "Slow IV infusion over 30 minutes",
        "duration": "Up to 2 years or until disease progression",
        "regimenType": "NCCN Category 1 Preferred First-Line Therapy for dMMR / MSI-High Metastatic Disease",
        "clinicalNotes": "KEYNOTE-177 landmark trial: Doubled progression-free survival (16.5 vs 8.2 months) compared to standard chemotherapy plus targeted therapy, with dramatically lower toxicities. Ineffective in proficient MMR (pMMR) tumors."
      },
      {
        "drugName": "Cetuximab (or Panitumumab)",
        "strength": "500 mg/m² IV every 2 weeks (or 400 mg/m² loading -> 250 mg/m² weekly)",
        "dosageForm": "IV Infusion",
        "frequency": "Every 14 days (Q2W)",
        "timing": "Slow IV infusion over 60 to 120 minutes with anti-allergy premedication",
        "duration": "Ongoing in metastatic setting",
        "regimenType": "Anti-EGFR Monoclonal Antibody (Strictly for KRAS/NRAS/BRAF Wild-Type Left-Sided Tumors)",
        "clinicalNotes": "TAILOR & FIRE-3 trials: Robust overall survival extension strictly in RAS-wildtype tumors originating from the splenic flexure to rectum (left-sided). Completely ineffective and potentially detrimental in RAS-mutant tumors. Causes acneiform papulopustular rash (treat with oral minocycline)."
      },
      {
        "drugName": "Loperamide Hydrochloride",
        "strength": "2 to 4 mg (initial dose 4 mg, then 2 mg after each unformed stool; max 16 mg/day)",
        "dosageForm": "Oral Capsule",
        "frequency": "As needed (SOS)",
        "timing": "After each loose stool",
        "duration": "Acute symptomatic control",
        "regimenType": "Peripheral Mu-Opioid Receptor Agonist Antidiarrheal",
        "clinicalNotes": "Controls chemotherapy-induced diarrhea (especially when combining with Irinotecan [FOLFIRI]). If diarrhea persists >24h despite loperamide, escalate to oral Octreotide."
      }
    ],
    "complications": [
      "Acute complete large bowel obstruction requiring emergency decompressive colostomy or self-expanding metal stenting",
      "Hepatic metastatic failure from extensive bilobar parenchymal replacement",
      "Oxaliplatin-induced chronic cumulative sensory peripheral neuropathy"
    ],
    "referralTriggers": [
      "Any unexplained rectal bleeding or iron deficiency anemia in patient age >= 45 years (fast-track referral for screening/diagnostic colonoscopy)",
      "Biopsy-proven colorectal cancer (referral to Colorectal Multidisciplinary Oncology Team for complete mesocolic excision [CME] / total mesorectal excision [TME])",
      "Isolated resectable colorectal liver metastases (referral to Hepato-Pancreato-Biliary [HPB] surgeon for staged or synchronous metastasectomy)"
    ]
  },
  "pancreatic-cancer": {
    "id": "pancreatic-cancer",
    "name": "Pancreatic Cancer",
    "medicalName": "Pancreatic Ductal Adenocarcinoma (PDAC)",
    "category": "Cancer Types",
    "subCategory": "Digestive Cancers",
    "icdCode": "C25.9",
    "datasetSource": "NCCN Guidelines for Pancreatic Adenocarcinoma v2.2026 & ESMO Guidelines",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Highly lethal malignancy originating from pancreatic ductal epithelium, characterized by dense desmoplastic stroma, intense neurotropism, and early micro-metastatic dissemination.",
    "symptoms": {
      "hallmark": [
        "Painless, progressive, obstructive jaundice (golden-yellow sclera, dark tea-colored urine, pale clay-colored stools) from pancreatic head tumors",
        "Deep, unrelenting, dull epigastric gnawing pain radiating straight through to the mid-thoracolumbar spine (characteristically eased by leaning forward)",
        "Rapid, profound, unyielding weight loss and skeletal muscle wasting (pancreatic cancer cachexia)",
        "Severe pruritus from systemic cutaneous bile salt deposition"
      ],
      "earlySigns": [
        "New-onset atypical Type 2 diabetes mellitus diagnosed within the past 12-24 months in a non-obese patient aged > 50",
        "Subtle postprandial dyspepsia, bloating, and greasy floating stools (steatorrhea)",
        "Unexplained persistent anorexia and loss of energy"
      ],
      "redFlags": [
        "Courvoisier's Sign: Palpable, smooth, non-tender, distended gallbladder in a jaundiced patient (strongly indicates malignant distal biliary obstruction)",
        "Trousseau's Syndrome (Trousseau's sign of malignancy): Migratory superficial thrombophlebitis in unusual sites (arms, trunk)",
        "Intractable gastric outlet obstruction from duodenal C-loop tumor encasement",
        "Malignant ascites and umbilical Sister Mary Joseph metastasis indicating peritoneal spread"
      ]
    },
    "requiredTests": [
      {
        "testName": "Dual-Phase Pancreatic Protocol Contrast Multidetector CT (MDCT)",
        "type": "Diagnostic Imaging Gold Standard",
        "purpose": "Thin-slice (<=1 mm) parenchymal and portal venous phase: defines tumor resectability based on relationship to Superior Mesenteric Artery (SMA), Celiac Axis, and SMV-Portal vein confluence",
        "urgency": "Stat / Priority"
      },
      {
        "testName": "Serum Carbohydrate Antigen 19-9 (CA 19-9)",
        "type": "Serological Tumor Biomarker",
        "purpose": "Diagnostic and prognostic monitoring marker: CA 19-9 > 100 U/mL suggests unresectability; > 1,000 U/mL indicates metastatic disease. NOTE: False-negative in Lewis blood group antigen-negative [Le a-b-] patients (7-10% of population)",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Endoscopic Ultrasound (EUS) with Fine Needle Aspiration/Biopsy (FNA/FNB)",
        "type": "Endosonography & Tissue Biopsy",
        "purpose": "Highest spatial resolution for imaging pancreatic head/body masses and vascular interfaces; core biopsy (FNB) provides definitive histopathological confirmation",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Magnetic Resonance Cholangiopancreatography (MRCP)",
        "type": "Diagnostic Magnetic Resonance",
        "purpose": "Demonstrates pathognomonic 'Double-Duct Sign': simultaneous smooth stricture and dilatation of both the Common Bile Duct and Main Pancreatic Duct",
        "urgency": "Priority"
      },
      {
        "testName": "Germline & Somatic Genomic Testing (BRCA1, BRCA2, PALB2, ATM, KRAS, MSI/MMR)",
        "type": "Molecular Oncology",
        "purpose": "MANDATORY in all diagnosed PDAC: BRCA1/2 or PALB2 mutations qualify for maintenance PARP inhibitor therapy (Olaparib) following platinum induction",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Modified FOLFIRINOX (mFOLFIRINOX Adjuvant Protocol)",
        "strength": "Oxaliplatin 85 mg/m² + Leucovorin 400 mg/m² + Irinotecan 150 mg/m² + 5-FU 2,400 mg/m² continuous IV over 46 hours (no 5-FU bolus)",
        "dosageForm": "IV Infusion via Portable CADD Infusion Pump",
        "frequency": "Every 14 days (Q2W)",
        "timing": "Days 1 to 3 of each 14-day cycle",
        "duration": "6 months (12 cycles) in adjuvant or neoadjuvant setting",
        "regimenType": "NCCN Category 1 Preferred Adjuvant & First-Line Regimen (ECOG 0-1)",
        "clinicalNotes": "PRODIGE 24 landmark trial: Extended median overall survival to an unprecedented 54.4 months in resected PDAC. Highly toxic: requires primary G-CSF pegfilgrastim support, intensive 5-HT3 antiemetics, and active diarrhea monitoring."
      },
      {
        "drugName": "Gemcitabine + Nab-Paclitaxel (Abraxane)",
        "strength": "Gemcitabine 1,000 mg/m² + Nab-Paclitaxel 125 mg/m²",
        "dosageForm": "IV Infusion",
        "frequency": "Administered on Days 1, 8, and 15 of every 28-day cycle",
        "timing": "Infuse Nab-paclitaxel over 30 mins followed by Gemcitabine over 30 mins",
        "duration": "Ongoing until disease progression",
        "regimenType": "First-Line Alternative Systemic Regimen (MPACT Trial)",
        "clinicalNotes": "First-line regimen for patients with borderline performance status (ECOG 1-2) or contraindications to FOLFIRINOX. Favorable tolerability profile. Monitor for neutropenia and peripheral sensory neuropathy."
      },
      {
        "drugName": "Pancrelipase (Pancreatic Enzyme Replacement Therapy - PERT)",
        "strength": "25,000 to 50,000 USP lipase units per full meal; 10,000 to 25,000 units per snack",
        "dosageForm": "Enteric-Coated Delayed-Release Oral Capsules",
        "frequency": "Taken with every single meal and snack throughout the day",
        "timing": "Swallowed whole with the first mouthful and spaced throughout the meal",
        "duration": "Lifelong ongoing replacement",
        "regimenType": "Mandatory Exocrine Pancreatic Insufficiency Replacement",
        "clinicalNotes": "ESSENTIAL SUPPORTIVE CARE: Pancreatic duct obstruction causes profound malabsorptive steatorrhea and malnutrition. PERT eliminates steatorrhea, restores fat-soluble vitamin absorption, and halts cachexia."
      },
      {
        "drugName": "Morphine Sulfate (or Fentanyl Transdermal Patch)",
        "strength": "Morphine 10 to 30 mg oral Q4H (or Fentanyl 25 to 50 mcg/hr patch changed Q72H)",
        "dosageForm": "Oral Tablet / Transdermal Matrix Patch",
        "frequency": "Scheduled round-the-clock with immediate-release rescue doses for breakthrough pain",
        "timing": "Continuous around-the-clock scheduled analgesia",
        "duration": "Ongoing analgesic management",
        "regimenType": "WHO Step 3 Strong Opioid Analgesia for Severe Splanchnic Pain",
        "clinicalNotes": "Pancreatic cancer produces excruciating retroperitoneal celiac plexus neuralgia. Co-prescribe stimulant laxatives (Senna); refer for CT- or EUS-guided percutaneous Celiac Plexus Neurolysis (CPN) for refractory pain."
      }
    ],
    "complications": [
      "Severe biliary sepsis / acute ascending cholangitis from occluded biliary stent",
      "Profound intractable pancreatic cancer cachexia with irreversible muscle loss",
      "High incidence of thromboembolism (deep vein thrombosis and fatal pulmonary embolism)"
    ],
    "referralTriggers": [
      "Painless jaundice in any adult (emergency same-week referral for Pancreatic Protocol CT and Endoscopic Biliary Stenting via ERCP)",
      "Resectable or borderline resectable pancreatic mass on imaging (referral to high-volume Pancreatic Surgery Center for Pancreaticoduodenectomy [Whipple Procedure])",
      "Unrelenting back pain in known pancreatic cancer (referral to Pain Management for Celiac Plexus Neurolysis)"
    ]
  },
  "ovarian-cancer": {
    "id": "ovarian-cancer",
    "name": "Ovarian Cancer",
    "medicalName": "Epithelial Ovarian, Fallopian Tube & Primary Peritoneal Carcinoma",
    "category": "Cancer Types",
    "subCategory": "Other Cancers",
    "icdCode": "C56.9",
    "datasetSource": "NCCN Guidelines for Ovarian Cancer v1.2026 & ESGO/ESMO Consensus Guidelines",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant neoplasm arising predominantly from the fimbriated end of the fallopian tube epithelium (High-Grade Serous Carcinoma [HGSC]), characterized by early widespread transcoelomic peritoneal dissemination.",
    "symptoms": {
      "hallmark": [
        "Persistent, unremitting abdominal bloating and increased abdominal girth (clothes feeling tight around the waist)",
        "Pelvic fullness, heaviness, or localized pelvic pain occurring > 12 days per month",
        "Early satiety (inability to finish normal-sized meals) and postprandial dyspepsia",
        "Urinary urgency and increased daytime/nocturnal frequency without documented infection"
      ],
      "earlySigns": [
        "Vague gastrointestinal symptoms easily and mistakenly misdiagnosed as Irritable Bowel Syndrome (IBS)",
        "Unexplained fatigue and mild lower back tightness",
        "Subtle constipation alternating with loose stools"
      ],
      "redFlags": [
        "Rapid development of gross tense peritoneal ascites with shifting dullness and fluid thrill",
        "Palpable, firm, irregular, fixed, non-tender adnexal mass on bimanual pelvic examination",
        "Malignant Pleural Effusion: progressive exertional dyspnea (Stage IVB disease)",
        "Subacute small bowel obstruction from diffuse peritoneal carcinomatosis ('omental caking')"
      ]
    },
    "requiredTests": [
      {
        "testName": "Transvaginal and Transabdominal Pelvic Color Doppler Ultrasound (TVS)",
        "type": "Pelvic Imaging Gold Standard",
        "purpose": "IOTA ultrasound rules: distinguishes benign from malignant adnexal cysts; identifies thick septations (>3 mm), solid papillary projections, vascular flow, and free peritoneal fluid",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Serum Cancer Antigen 125 (CA-125) & HE4 (ROMA Index)",
        "type": "Serological Tumor Biomarkers",
        "purpose": "Risk of Ovarian Malignancy Algorithm (ROMA): combines CA-125 and Human Epididymis Protein 4 (HE4) with menopausal status to stratify pre- and post-menopausal malignancy risk",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Contrast-Enhanced CT of Chest, Abdomen, and Pelvis",
        "type": "Staging Imaging Gold Standard",
        "purpose": "Evaluates extent of peritoneal carcinomatosis, omental cake, mesenteric deposits, diaphragmatic implants, pelvic/retroperitoneal lymphadenopathy, and pleural effusion",
        "urgency": "Priority"
      },
      {
        "testName": "Diagnostic Staging Laparoscopy (Fagotti Predictive Score)",
        "type": "Minimally Invasive Surgical Staging",
        "purpose": "Fagotti score assesses whether complete macroscopic cytoreduction (R0 resection) is achievable via primary debulking surgery vs initial neoadjuvant chemotherapy",
        "urgency": "Priority / Pre-Surgical"
      },
      {
        "testName": "Germline & Somatic BRCA1/BRCA2 and Homologous Recombination Deficiency (HRD)",
        "type": "Molecular Genetics",
        "purpose": "MANDATORY in all epithelial ovarian cancers: BRCA mutations or HRD genomic scar positivity predicts extraordinary sensitivity and survival benefit from PARP inhibitor maintenance",
        "urgency": "Priority / Tissue Testing"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Paclitaxel + Carboplatin Chemotherapy Protocol",
        "strength": "Paclitaxel 175 mg/m² (infused over 3 hours) + Carboplatin AUC 5 to 6 (infused over 1 hour)",
        "dosageForm": "IV Infusion",
        "frequency": "Every 21 days (Q3W)",
        "timing": "Day 1 of each 21-day cycle",
        "duration": "6 cycles total (adjuvant or 3 neoadjuvant + 3 adjuvant cycles)",
        "regimenType": "NCCN Category 1 Standard of Care First-Line Chemotherapy",
        "clinicalNotes": "GOG 111 & 158 landmark trials: Achieves >80% initial clinical response rate in high-grade serous carcinoma. MANDATORY PREMEDICATION: Dexamethasone 20 mg PO at 12h and 6h prior, plus Diphenhydramine 50 mg IV and Famotidine 20 mg IV 30 mins prior to paclitaxel to prevent severe hypersensitivity reactions."
      },
      {
        "drugName": "Olaparib (or Niraparib - PARP Inhibitor Maintenance)",
        "strength": "Olaparib 300 mg twice daily (Niraparib 200 to 300 mg once daily based on baseline weight/platelets)",
        "dosageForm": "Oral Film-Coated Tablet",
        "frequency": "Twice daily (Olaparib) or once daily (Niraparib)",
        "timing": "With or without food",
        "duration": "Up to 2 to 3 years maintenance following response to platinum chemotherapy",
        "regimenType": "Targeted Poly (ADP-Ribose) Polymerase (PARP) Inhibitor Maintenance",
        "clinicalNotes": "SOLO-1 & PRIMA trials: Synthetic lethality in homologous recombination-deficient tumors; quadruples median progression-free survival (56 vs 13.8 months in BRCA-mutated). Monitor Complete Blood Count monthly (watch for anemia, thrombocytopenia, and rare secondary AML/MDS risk)."
      },
      {
        "drugName": "Bevacizumab (Anti-VEGF Monoclonal Antibody)",
        "strength": "15 mg/kg IV",
        "dosageForm": "IV Infusion",
        "frequency": "Every 3 weeks (Q3W)",
        "timing": "Concomitant with cycles 2-6 of chemotherapy, then continued as single agent",
        "duration": "Up to 15 months total maintenance therapy (GOG-0218 protocol)",
        "regimenType": "Anti-Angiogenic Targeted Therapy (for Suboptimally Debulked Stage III/IV)",
        "clinicalNotes": "Particularly effective in patients with high-volume ascites and suboptimally debulked disease; delays ascites reaccumulation. Monitor blood pressure and urinalysis for proteinuria."
      }
    ],
    "complications": [
      "Recurrent intractable malignant ascites requiring frequent therapeutic paracentesis",
      "Malignant bowel sub-obstruction and obstruction from diffuse peritoneal implants",
      "Emergence of platinum-resistant ovarian cancer recurrence (<6 months treatment-free interval)"
    ],
    "referralTriggers": [
      "Pelvic mass on ultrasound accompanied by elevated CA-125 in a postmenopausal woman (immediate referral to Gynecologic Oncologist for maximal cytoreductive surgery)",
      "New-onset persistent bloating or early satiety lasting > 12 days per month in a woman aged > 50 (urgent pelvic ultrasound within 2 weeks)",
      "Known ovarian cancer presenting with severe nausea, bilious vomiting, and obstipation (emergency admission for malignant bowel obstruction)"
    ]
  },
  "kidney-cancer": {
    "id": "kidney-cancer",
    "name": "Kidney Cancer (Renal Cell Carcinoma)",
    "medicalName": "Renal Cell Carcinoma (Clear Cell, Papillary & Chromophobe RCC)",
    "category": "Cancer Types",
    "subCategory": "Other Cancers",
    "icdCode": "C64.9",
    "datasetSource": "NCCN Clinical Practice Guidelines in Oncology (Kidney Cancer) v2.2026 & EAU Guidelines",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant neoplasm arising from renal tubular epithelial cells (Clear Cell RCC in 75-80%), strongly driven by loss of von Hippel-Lindau (VHL) tumor suppressor gene and angiogenic overexpression.",
    "symptoms": {
      "hallmark": [
        "Over 60% discovered incidentally as an asymptomatic solid cortical mass on ultrasound/CT ('incidentaloma')",
        "Classic Clinical Triad (present simultaneously in <10% of modern cases, indicates advanced disease): Gross painless hematuria, flank/loin pain, and palpable abdominal mass",
        "Constitutional paraneoplastic signs: unexplained fever, night sweats, severe fatigue, rapid cachexia",
        "Secondary polycythemia (erythropoietin hypersecretion) or hypercalcemia (PTHrP secretion)"
      ],
      "earlySigns": [
        "Microscopic painless hematuria discovered on routine urine dipstick",
        "Vague dull aching sensation in flank or costovertebral angle",
        "New-onset refractory hypertension secondary to renin hypersecretion"
      ],
      "redFlags": [
        "Sudden onset of non-reducing right-sided varicocele or acute left-sided varicocele (indicates tumor thrombus extension into renal vein and Inferior Vena Cava [IVC])",
        "Bilateral lower extremity pitting edema with dilated collateral superficial abdominal wall veins (IVC occlusion)",
        "Severe intractable bone pain or pathological fracture (osteolytic skeletal metastases)",
        "Pulmonary metastases presenting with persistent cough and hemoptysis ('cannonball' metastases)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Quad-Phase Contrast-Enhanced CT of Abdomen and Pelvis",
        "type": "Diagnostic Imaging Gold Standard",
        "purpose": "Unenhanced, Corticomedullary, Nephrographic, and Excretory phases: Diagnostic hallmark is avid early arterial enhancement (>15-20 Hounsfield Unit increase over unenhanced) with rapid washout in Clear Cell RCC",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Contrast-Enhanced Abdominal MRI with MR Venography",
        "type": "Diagnostic Magnetic Resonance Imaging",
        "purpose": "Preferred in patients with iodinated contrast allergy and for precise cephalad mapping of tumor thrombus extension within the renal vein and IVC up to right atrium",
        "urgency": "Priority"
      },
      {
        "testName": "Contrast-Enhanced High-Resolution Chest CT",
        "type": "Staging Imaging Gold Standard",
        "purpose": "Lungs are the single most common site of distant hematogenous metastasis in RCC; mandatory staging for all solid renal cortical masses",
        "urgency": "Priority"
      },
      {
        "testName": "Serum Calcium, Alkaline Phosphatase, Hemoglobin, and Renal Function Panel",
        "type": "Laboratory Biomarker Assay",
        "purpose": "Evaluates paraneoplastic hypercalcemia, erythrocytosis/anemia, baseline contralateral GFR, and calculates IMDC (International Metastatic RCC Database Consortium) risk score",
        "urgency": "Priority"
      },
      {
        "testName": "Percutaneous Core Needle Biopsy of Renal Mass",
        "type": "Histopathology Assay",
        "purpose": "Indicated when active surveillance, ablative therapy (cryoablation/RFA), or upfront systemic therapy without cytoreductive nephrectomy is planned",
        "urgency": "Elective / Targeted"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Pembrolizumab + Axitinib (Combination IO + TKI Protocol)",
        "strength": "Pembrolizumab 200 mg IV every 3 weeks + Axitinib 5 mg orally twice daily",
        "dosageForm": "IV Infusion (Pembrolizumab) + Oral Film-Coated Tablet (Axitinib)",
        "frequency": "Pembrolizumab: every 3 weeks; Axitinib: twice daily (can titrate to 7-10 mg BID)",
        "timing": "Axitinib taken with or without food approx 12 hours apart; Pembrolizumab 30-min IV",
        "duration": "Pembrolizumab up to 2 years; Axitinib ongoing until disease progression",
        "regimenType": "NCCN Category 1 Preferred First-Line Regimen for Advanced / Metastatic Clear Cell RCC",
        "clinicalNotes": "KEYNOTE-426 trial: Combines PD-1 checkpoint inhibition with potent VEGFR 1-3 tyrosine kinase blockade. Significantly superior overall survival (80% vs 72% at 1 year) and objective response rate (59% vs 36%) over Sunitinib monotherapy. Monitor daily blood pressure (manage hypertension aggressively with ACEi/CCB)."
      },
      {
        "drugName": "Nivolumab + Cabozantinib (CheckMate 9ER Protocol)",
        "strength": "Nivolumab 240 mg IV every 2 weeks + Cabozantinib 40 mg orally once daily",
        "dosageForm": "IV Infusion + Oral Tablet",
        "frequency": "Nivolumab: every 2 weeks (or 480 mg Q4W); Cabozantinib: once daily",
        "timing": "Cabozantinib strictly on empty stomach >= 1 hour before or 2 hours after meals",
        "duration": "Ongoing until disease progression",
        "regimenType": "NCCN Category 1 Alternative First-Line Combination Regimen",
        "clinicalNotes": "Cabozantinib targets VEGFR, MET, and AXL kinases to overcome resistance. Robust progression-free survival benefit. Monitor for diarrhea, hand-foot skin reaction, and elevated transaminases."
      },
      {
        "drugName": "Sunitinib Malate (Single-Agent TKI)",
        "strength": "50 mg once daily for 4 weeks on therapy followed by 2 weeks off (Schedule 4/2)",
        "dosageForm": "Oral Hard Capsule",
        "frequency": "Once daily for 28 consecutive days, then 14 days rest (6-week cycle)",
        "timing": "With or without food",
        "duration": "Ongoing until disease progression",
        "regimenType": "Multi-Targeted Receptor Tyrosine Kinase Inhibitor Monotherapy",
        "clinicalNotes": "Established oral targeted monotherapy option for patients with contraindications to immune checkpoint inhibitors. Monitor blood pressure, thyroid function (TSH every 3 months), and cardiac LVEF."
      }
    ],
    "complications": [
      "Extensive cavoatrial tumor thrombus with pulmonary embolism or Budd-Chiari syndrome",
      "Intractable osteolytic bone metastases with hypercalcemia and pathological fractures",
      "Loss of renal function following nephrectomy requiring chronic dialysis if solitary kidney"
    ],
    "referralTriggers": [
      "Solid enhancing renal cortical mass identified on ultrasound or CT (immediate referral to Urologic Oncology for partial vs radical nephrectomy)",
      "New-onset varicocele in an adult male failing to decompress when recumbent (urgent renal ultrasound to rule out RCC tumor thrombus)",
      "Painless gross hematuria of any magnitude (urgent fast-track cystoscopy and contrast CT urography)"
    ]
  },
  "bone-cancer": {
    "id": "bone-cancer",
    "name": "Bone Cancer (Osteosarcoma & Ewing Sarcoma)",
    "medicalName": "Primary Malignant Bone Sarcomas (Osteosarcoma, Ewing Sarcoma & Chondrosarcoma)",
    "category": "Cancer Types",
    "subCategory": "Other Cancers",
    "icdCode": "C40-C41",
    "datasetSource": "NCCN Guidelines for Bone Cancer v1.2026, EURACAN & ESMO Clinical Practice Guidelines",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant mesenchymal tumors of the skeleton; Osteosarcoma is characterized by malignant osteoblasts producing immature osteoid matrix, typically in the metaphyseal growth plates of adolescents and young adults.",
    "symptoms": {
      "hallmark": [
        "Deep, unrelenting, aching bone pain, characteristically worse at night and awakening the patient from sound sleep, not relieved by rest",
        "Progressive firm, tender, warm bony swelling or palpable mass near the metaphyseal ends of long bones (distal femur, proximal tibia, proximal humerus)",
        "Persistent antalgic limp and joint stiffness often misattributed to a sports sprain or 'growing pains'",
        "Localized cutaneous erythema, warm skin, and visibly dilated superficial venous collaterals over the lesion"
      ],
      "earlySigns": [
        "Intermittent dull bone discomfort following physical activity",
        "Subtle limitation of joint range of motion (knee flexion or shoulder abduction)",
        "Minor trauma precipitating disproportionate and lingering bone pain"
      ],
      "redFlags": [
        "Pathological Fracture through the tumor site following trivial, low-energy trauma (compromises limb-sparing surgery)",
        "Pulmonary Metastatic Signs: unresolving cough, dyspnea, pleuritic chest pain (lungs are the primary site of distant spread)",
        "Rapid, warm, painful expansile swelling mimicking acute bacterial osteomyelitis",
        "Skip Metastases: discrete non-contiguous tumor nodules within the same involved bone marrow cavity"
      ]
    },
    "requiredTests": [
      {
        "testName": "Conventional Plain Radiographs of the Entire Involved Bone (Two Orthogonal Views)",
        "type": "Initial Diagnostic Imaging Gold Standard",
        "purpose": "Hallmark radiographic signs: Mixed osteolytic and osteoblastic lesion with ill-defined permeative cortical destruction, periosteal 'Codman's Triangle', and classic 'Sunburst' spiculation",
        "urgency": "Stat / Diagnostic"
      },
      {
        "testName": "High-Resolution Contrast-Enhanced MRI of the Entire Involved Anatomical Compartment",
        "type": "Diagnostic Imaging Gold Standard",
        "purpose": "MANDATORY: Must image the entire bone to evaluate longitudinal intramedullary tumor extent, soft tissue extraosseous component, proximity to neurovascular bundles, and exclude skip metastases",
        "urgency": "Priority / Pre-Biopsy"
      },
      {
        "testName": "Core Needle Biopsy by Experienced Orthopedic Oncologist",
        "type": "Histopathology Gold Standard",
        "purpose": "CRITICAL SURGICAL PRINCIPLE: Biopsy tract MUST be placed strictly along the longitudinal line of future definitive surgical incision to allow complete en-bloc resection and prevent tissue plane contamination",
        "urgency": "Priority / Specialized Center"
      },
      {
        "testName": "High-Resolution Contrast-Enhanced Chest CT",
        "type": "Staging Imaging Gold Standard",
        "purpose": "MANDATORY: Evaluates pulmonary parenchyma for nodular hematogenous metastases (present in 15-20% at diagnosis); dictates overall treatment strategy",
        "urgency": "Priority / Pre-Treatment"
      },
      {
        "testName": "Whole-Body 99mTc-Methylene Diphosphonate (MDP) Bone Scintigraphy / 18F-FDG PET-CT",
        "type": "Nuclear Medicine Skeletal Staging",
        "purpose": "Detects polyostotic bone involvement and distant skeletal metastases throughout the axial and appendicular skeleton",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "MAP Protocol (High-Dose Methotrexate + Doxorubicin + Cisplatin)",
        "strength": "High-Dose Methotrexate 12 g/m² IV (with Leucovorin rescue) + Doxorubicin 75 mg/m² continuous IV + Cisplatin 120 mg/m² IV",
        "dosageForm": "IV Infusion under Inpatient Nephroprotection Protocol",
        "frequency": "Multi-agent staged cycles alternating every 3 to 5 weeks",
        "timing": "Rigorous inpatient protocol with aggressive pre- and post-hydration and urine alkalinization",
        "duration": "9 to 10 months total (2-3 cycles neoadjuvant pre-op, followed by surgery, and 4-6 cycles adjuvant post-op)",
        "regimenType": "NCCN Category 1 Gold Standard Regimen for High-Grade Osteosarcoma",
        "clinicalNotes": "Transformed 5-year survival from <20% to >70% and enabled limb-sparing surgery in >85-90% of patients. MANDATORY: Urine pH must be maintained > 7.5 with IV sodium bicarbonate during high-dose methotrexate to prevent precipitation of MTX crystals in renal tubules. Leucovorin calcium rescue started strictly at 24 hours until serum MTX level drops < 0.1 µmol/L."
      },
      {
        "drugName": "VDC / IE Regimen (for Ewing Sarcoma)",
        "strength": "Vincristine 2 mg/m² + Doxorubicin 75 mg/m² + Cyclophosphamide 1,200 mg/m² alternating with Ifosfamide 1,800 mg/m² + Etoposide 100 mg/m²",
        "dosageForm": "IV Infusion",
        "frequency": "Every 2 weeks (compressed interval protocol)",
        "timing": "Inpatient chemotherapy ward",
        "duration": "14 to 17 cycles total (approx 9-10 months)",
        "regimenType": "Standard Multi-Agent Compressed Interval Protocol for Ewing Sarcoma",
        "clinicalNotes": "MANDATORY UROPROTECTION: Co-administer IV Mesna (2-mercaptoethane sulfonate sodium) with Ifosfamide and Cyclophosphamide to neutralize toxic acrolein metabolite and completely prevent hemorrhagic cystitis."
      },
      {
        "drugName": "Tramadol + Paracetamol Combination",
        "strength": "Tramadol 37.5 mg + Paracetamol 325 mg",
        "dosageForm": "Oral Film-Coated Tablet",
        "frequency": "Every 8 hours as needed (SOS)",
        "timing": "After meals with water",
        "duration": "Ongoing as needed for severe nocturnal bone pain",
        "regimenType": "Step 2 Opioid-Analgesic Combination for Bone Pain",
        "clinicalNotes": "Provides dual-mechanism analgesia (mu-opioid agonism plus serotonin/norepinephrine reuptake inhibition). Co-prescribe stool softener to prevent opioid-induced constipation."
      }
    ],
    "complications": [
      "Severe pathological fracture through necrotic bone lesion necessitating amputation",
      "Chemotherapy-induced severe myelosuppression, cardiotoxicity (doxorubicin), and nephrotoxicity",
      "Metastatic dissemination to lung parenchyma requiring thoracoscopic wedge resections (metastasectomy)"
    ],
    "referralTriggers": [
      "Unexplained bone pain worse at night or bony swelling in an adolescent or young adult (IMMEDIATE plain radiograph and direct referral to specialized Orthopedic Oncology Sarcoma Center BEFORE performing any biopsy)",
      "Suspected primary bone tumor on X-ray (NEVER perform an open biopsy in a non-specialist center; incorrect biopsy placement can compromise limb-sparing surgery)",
      "Sudden acute severe pain with inability to bear weight in a patient with a known bone lesion (acute pathological fracture)"
    ]
  },
  "thyroid-cancer": {
    "id": "thyroid-cancer",
    "name": "Thyroid Cancer",
    "medicalName": "Differentiated Thyroid Carcinoma (Papillary & Follicular Carcinoma)",
    "category": "Cancer Types",
    "subCategory": "Other Cancers",
    "icdCode": "C73",
    "datasetSource": "ATA (American Thyroid Association) Guidelines for Thyroid Nodules & Differentiated Thyroid Cancer 2026 & NCCN",
    "evidenceLevel": "Category 1 / Level 1A (ATA Consensus Guidelines)",
    "overview": "Malignant epithelial neoplasm originating from follicular cells of the thyroid gland (Papillary Thyroid Cancer in 85-90%, Follicular in 10%), characterized by slow indolent growth, lymphatic spread, and high iodine avidity.",
    "symptoms": {
      "hallmark": [
        "Painless, firm-to-hard, non-tender solitary thyroid nodule that ascends and descends with swallowing",
        "Palpable, firm, non-tender, persistent ipsilateral cervical lymphadenopathy (jugulodigastric / level III-IV lymph nodes)",
        "Asymmetric enlargement of one thyroid lobe noticed in the mirror or during collar buttoning",
        "Sensation of tightness, fullness, or a localized lump in the lower anterior neck"
      ],
      "earlySigns": [
        "Completely asymptomatic solitary thyroid nodule detected incidentally on carotid Doppler, cervical spine MRI, or neck CT",
        "Subtle sensation of tracheal pressure when lying supine",
        "Normal thyroid hormone levels (euthyroid state is classic; thyrotoxicosis is rare)"
      ],
      "redFlags": [
        "Persistent vocal hoarseness or altered vocal pitch from recurrent laryngeal nerve tumor invasion",
        "Progressive dysphagia (difficulty swallowing solids) from esophageal compression",
        "Inspiratory stridor, dyspnea, or wheezing from direct tracheal invasion / luminal compression",
        "Rapid, alarming expansion of a hard, woody, fixed neck mass over weeks (suspect Anaplastic Thyroid Carcinoma)"
      ]
    },
    "requiredTests": [
      {
        "testName": "High-Resolution Neck & Thyroid Ultrasound with Color Doppler",
        "type": "Ultrasonography Gold Standard",
        "purpose": "ACR TI-RADS v2024 classification: evaluates suspicious features (marked hypoechogenicity, taller-than-wide shape, irregular/infiltrative margins, punctate echogenic foci / microcalcifications, absent peripheral halo)",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Ultrasound-Guided Fine Needle Aspiration Cytology (FNAC)",
        "type": "Cytopathology Gold Standard",
        "purpose": "Reported via Bethesda System for Reporting Thyroid Cytopathology (Category I to VI): Category V (Suspicious for Malignancy, 60-75% risk) and Category VI (Malignant - Papillary Carcinoma, 97-99% risk) mandate surgical resection",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Molecular Testing on FNA Aspirate (ThyroSeq v3 or Afirma GSC Panel)",
        "type": "Molecular Pathology",
        "purpose": "Recommended for Bethesda III (AUS/FLUS) and IV (Follicular Neoplasm) indeterminate nodules: identifies BRAF V600E (high risk of lymph node metastasis), RET/PTC, RAS, and TERT promoter mutations",
        "urgency": "Priority / Indeterminate Nodules"
      },
      {
        "testName": "Preoperative Non-Contrast Neck & Upper Chest CT",
        "type": "Diagnostic Imaging",
        "purpose": "Evaluates substernal retrosternal goiter extension and aerodigestive invasion. CRITICAL: Iodinated radiocontrast MUST be avoided if radioactive iodine therapy is planned within 2-3 months",
        "urgency": "Priority if bulky/invasive"
      },
      {
        "testName": "Post-Operative Serum Thyroglobulin (Tg) & Anti-Thyroglobulin Antibodies (Anti-Tg)",
        "type": "Surveillance Tumor Biomarker Gold Standard",
        "purpose": "MANDATORY: Thyroglobulin is a highly sensitive surveillance biomarker for persistent or recurrent differentiated thyroid cancer following total thyroidectomy (target stimulated Tg < 1 ng/mL)",
        "urgency": "Routine Post-Operative"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Levothyroxine Sodium (TSH Suppression Therapy)",
        "strength": "2.0 to 2.5 mcg/kg/day (typically 125 to 200 mcg daily, titrated to target TSH)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily in the morning",
        "timing": "Strictly on an empty stomach with plain water >= 30 to 60 minutes before breakfast",
        "duration": "Lifelong ongoing suppressive therapy",
        "regimenType": "First-Line Postoperative Hormonal Suppression (ATA Guideline)",
        "clinicalNotes": "Suppresses pituitary TSH secretion to eliminate the major proliferative stimulus for thyroid cancer cells. Target TSH: High-Risk disease < 0.1 mIU/L; Intermediate-Risk 0.1 to 0.5 mIU/L; Low-Risk 0.5 to 2.0 mIU/L. Monitor for subclinical hyperthyroidism risks (osteoporosis, atrial fibrillation)."
      },
      {
        "drugName": "Radioactive Iodine (131I - Sodium Iodide I-131)",
        "strength": "30 mCi to 150 mCi (1.11 to 5.55 GBq) based on ATA risk stratification",
        "dosageForm": "Oral Capsule / Liquid Solution",
        "frequency": "Single ablation dose administered in radiation safety isolation room",
        "timing": "Administered on empty stomach following rhTSH injections or thyroid hormone withdrawal",
        "duration": "Single therapeutic administration",
        "regimenType": "Radioiodine Remnant Ablation (RRA) & Adjuvant Therapy",
        "clinicalNotes": "Emits beta radiation destroying residual microscopic normal thyroid bed tissue and occult iodine-avid metastases. MANDATORY PREPARATION: Strict low-iodine diet (<50 mcg/day) for 2 weeks prior; stimulate TSH > 30 mIU/L via Recombinant Human TSH (rhTSH - Thyrogen) or 4-week levothyroxine withdrawal."
      },
      {
        "drugName": "Lenvatinib Mesylate (for Radioiodine-Refractory DTC)",
        "strength": "24 mg once daily (two 10 mg + one 4 mg capsule)",
        "dosageForm": "Oral Hard Capsule",
        "frequency": "Once daily (OD)",
        "timing": "With or without food at the same time each day",
        "duration": "Ongoing until disease progression",
        "regimenType": "Multi-Kinase Inhibitor for Radioiodine-Refractory Differentiated Thyroid Cancer",
        "clinicalNotes": "SELECT landmark trial: Dramatic progression-free survival extension (18.3 vs 3.6 months) in progressive radioiodine-refractory thyroid cancer. Monitor daily blood pressure (hypertension in >70%), proteinuria, and QTc interval."
      },
      {
        "drugName": "Calcium Carbonate + Calcitriol (Active Vitamin D3)",
        "strength": "Elemental Calcium 1,000 to 2,000 mg daily + Calcitriol 0.25 to 0.5 mcg daily",
        "dosageForm": "Oral Tablets / Softgels",
        "frequency": "Divided two to three times daily",
        "timing": "With meals",
        "duration": "Short-term post-op (or lifelong if permanent hypoparathyroidism)",
        "regimenType": "Post-Thyroidectomy Hypocalcemia Prevention",
        "clinicalNotes": "Prevents symptomatic post-surgical tetany and carpopedal spasm resulting from transient parathyroid gland devascularization or inadvertent removal during total thyroidectomy and central neck dissection."
      }
    ],
    "complications": [
      "Permanent iatrogenic hypoparathyroidism causing severe hypocalcemia",
      "Recurrent laryngeal nerve injury causing permanent vocal cord paralysis and dysphonia",
      "Radioiodine-refractory distant pulmonary and skeletal metastatic progression"
    ],
    "referralTriggers": [
      "Thyroid nodule with suspicious ultrasound features (ACR TI-RADS 4 or 5) or diameter >= 1.5 cm (referral for ultrasound-guided FNAC)",
      "FNA cytology reporting Bethesda Category V (Suspicious) or VI (Malignant) -> Immediate referral to Head & Neck Endocrine Surgeon",
      "Thyroid mass presenting with vocal hoarseness, stridor, or fixation to adjacent structures (urgent surgical airway and oncologic evaluation)"
    ]
  },
  "oral-cancer": {
    "id": "oral-cancer",
    "name": "Oral Cancer (Oral Cavity Squamous Cell Carcinoma)",
    "medicalName": "Oral Cavity Squamous Cell Carcinoma (Tongue, Floor of Mouth, Buccal Mucosa)",
    "category": "Cancer Types",
    "subCategory": "Common Cancers",
    "icdCode": "C00-C06",
    "datasetSource": "NCCN Guidelines for Head and Neck Cancers v1.2026, WHO Classification & American Dental Association",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant epithelial neoplasm arising from the mucosal lining of the oral cavity (anterior two-thirds of tongue, buccal mucosa, floor of mouth, retromolar trigone), strongly linked to tobacco chewing, smoking, betel quid (areca nut), and alcohol synergy.",
    "symptoms": {
      "hallmark": [
        "Persistent, indurated, non-healing oral mucosal ulcer with rolled everted borders lasting > 3 weeks",
        "Exophytic, fungating, cauliflower-like mass or mucosal fissure that bleeds easily on touch",
        "Precancerous mucosal lesions: Leukoplakia (firm white patch that cannot be wiped off) or Erythroplakia (velvety fiery red patch, 85-90% harboring severe dysplasia/carcinoma)",
        "Referred Otalgia: persistent unyielding unilateral earache in the presence of a normal otoscopic exam (referred via auriculotemporal nerve or glossopharyngeal nerve)"
      ],
      "earlySigns": [
        "Subtle mucosal burning sensation, especially when eating spicy, hot, or acidic foods",
        "Unexplained localized numbness or tingling of the lower lip or chin (mental nerve hypesthesia from mandibular invasion)",
        "Unexplained loosening of adjacent dentition without obvious periodontal disease"
      ],
      "redFlags": [
        "Trismus: Inability to open mouth adequately (inter-incisal opening < 20 mm; indicates pterygoid muscle or infratemporal fossa invasion)",
        "Ankyloglossia: Tongue fixation, inability to protrude tongue straight, severe dysarthria (slurred speech)",
        "Palpable, stony-hard, fixed, non-tender jugulodigastric (Level II) cervical lymphadenopathy",
        "Frank pathological mandibular bone fracture or external cutaneous facial fistula"
      ]
    },
    "requiredTests": [
      {
        "testName": "Comprehensive Head & Neck Examination with Flexible Nasopharyngolaryngoscopy",
        "type": "Clinical Endoscopic Gold Standard",
        "purpose": "Thorough inspection and bimanual palpation of entire oral cavity and pharynx: mandatory flexible fiberoptic endoscopy to rule out synchronous second primary upper aerodigestive tumors (present in 10-15%)",
        "urgency": "Stat / Immediate"
      },
      {
        "testName": "Punch or Scalpel Incisional Wedge Biopsy of Oral Lesion",
        "type": "Histopathology Gold Standard",
        "purpose": "MANDATORY: Must include both the ulcerated lesion edge and adjacent normal-appearing mucosa with underlying submucosa to determine true histologic depth of invasion (DOI)",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Contrast-Enhanced MRI of Head and Neck with Dental Artifact Suppression",
        "type": "Diagnostic Imaging Gold Standard",
        "purpose": "Optimal imaging modality: accurately quantifies tumor Depth of Invasion (DOI in mm), intrinsic tongue muscular infiltration, floor of mouth invasion, and perineural spread along lingual/inferior alveolar nerves",
        "urgency": "Priority / Pre-Surgical"
      },
      {
        "testName": "Contrast-Enhanced CT of Neck + Orthopantomogram (OPG) / Dental CT",
        "type": "Surgical Staging Imaging",
        "purpose": "High-resolution bone window CT or OPG precisely identifies cortical bone erosion and marrow invasion of mandible or maxilla (mandibulectomy planning)",
        "urgency": "Priority"
      },
      {
        "testName": "High-Resolution Contrast Chest CT",
        "type": "Staging Imaging",
        "purpose": "Lungs are the primary site of distant hematogenous metastasis and high-risk site for tobacco-related synchronous primary bronchogenic carcinoma",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Cisplatin (Concurrent Adjuvant Chemoradiotherapy Protocol)",
        "strength": "100 mg/m² IV every 3 weeks (Days 1, 22, 43 of radiation) OR 40 mg/m² weekly",
        "dosageForm": "IV Infusion with Mannitol-Saline Hyperhydration",
        "frequency": "Every 21 days concurrent with definitive or postoperative radiotherapy",
        "timing": "Day 1 of radiation weeks 1, 4, and 7",
        "duration": "3 cycles (or 6 weekly cycles) concurrent with 60-66 Gy radiotherapy",
        "regimenType": "NCCN Category 1 Standard Adjuvant Chemoradiation for High-Risk Pathological Features",
        "clinicalNotes": "RTOG 9501 / EORTC 22931 trials: Mandatory post-operative standard for tumors with positive surgical margins (R1 resection) and/or Extracapsular Nodal Extension (ECE+ / ENE). Significantly reduces locoregional relapse and improves overall survival."
      },
      {
        "drugName": "Nivolumab (or Pembrolizumab - Anti-PD-1 Monotherapy)",
        "strength": "Nivolumab 240 mg IV Q2W (or 480 mg Q4W) / Pembrolizumab 200 mg IV Q3W",
        "dosageForm": "IV Infusion",
        "frequency": "Every 2 to 4 weeks",
        "timing": "Slow IV infusion over 30 to 60 minutes",
        "duration": "Up to 2 years or until disease progression",
        "regimenType": "FDA & NCCN Approved First-Line Immunotherapy for Recurrent / Metastatic HNSCC",
        "clinicalNotes": "CheckMate 141 & KEYNOTE-048 trials: Proven overall survival superiority over traditional cetuximab/platinum chemotherapy in platinum-refractory and PD-L1 expressing (CPS >= 1) recurrent/metastatic head and neck carcinoma."
      },
      {
        "drugName": "Chlorhexidine Gluconate 0.2% Oral Antiseptic Rinse",
        "strength": "0.2% w/v oral solution",
        "dosageForm": "Oral Mouthwash",
        "frequency": "10 to 15 mL swish and spit three times daily (TID)",
        "timing": "After meals",
        "duration": "Ongoing during surgical convalescence and radiotherapy",
        "regimenType": "Topical Antimicrobial Mucosal Decontaminant",
        "clinicalNotes": "Broad-spectrum bactericidal rinse; significantly reduces oral pathogenic bacterial load, prevents secondary infection of ulcerative beds, and reduces radiation-induced stomatitis severity."
      },
      {
        "drugName": "Magic Mouthwash (Compounded Anesthetic & Mucosal Protectant)",
        "strength": "Equal parts: Lidocaine 2% Viscous + Diphenhydramine 12.5mg/5mL + Aluminum/Magnesium Hydroxide suspension (1:1:1)",
        "dosageForm": "Compounded Oral Suspension",
        "frequency": "Swish 5 to 10 mL in mouth for 1 minute and expectorate every 4 to 6 hours as needed (SOS)",
        "timing": "15 to 30 minutes before oral food intake",
        "duration": "As needed during active mucositis",
        "regimenType": "Topical Analgesic & Cytoprotective Oral Suspension",
        "clinicalNotes": "Topical mucosal anesthesia alleviates excruciating oral pain, enabling essential oral nutritional hydration. Patient must avoid hot foods/liquids while oral cavity is anesthetized."
      }
    ],
    "complications": [
      "Severe trismus, speech loss, and profound dysphagia requiring permanent gastrostomy (PEG) feeding tube",
      "Carotid blowout syndrome (catastrophic fatal hemorrhage from tumor erosion into external or internal carotid artery)",
      "Severe radiation osteoradionecrosis (ORN) of the mandible requiring vascularized fibula free flap reconstruction"
    ],
    "referralTriggers": [
      "Any oral mucosal ulcer or white/red lesion persisting > 3 weeks without healing (mandatory referral for urgent biopsy to Head & Neck Surgical Oncologist / Oral Maxillofacial Surgeon)",
      "Unexplained tooth loosening with adjacent soft tissue swelling (rule out invasive carcinoma prior to dental extraction)",
      "Presence of trismus or referred otalgia in a patient with an oral lesion (immediate tertiary head & neck oncology center evaluation)"
    ]
  }
};

export const GLOBAL_DISEASE_LIST = [
  {
    "id": "common-cold",
    "name": "Common Cold",
    "medicalName": "Acute Viral Rhinitis",
    "category": "Common Illnesses",
    "subCategory": "Respiratory & Infections",
    "icdCode": "J00",
    "datasetSource": "CDC Respiratory Disease Guidance & WHO Model List of Essential Medicines",
    "evidenceLevel": "Level 1A (CDC / Cochrane Systematic Reviews)",
    "overview": "Acute self-limiting viral infection of upper respiratory mucosal epithelium primarily caused by rhinoviruses, coronaviruses, and adenoviruses.",
    "symptoms": {
      "hallmark": [
        "Nasal mucosal congestion and clear-to-mucopurulent rhinorrhea",
        "Scratchy, irritated pharynx and mild sore throat",
        "Paroxysmal sneezing and post-nasal drip cough",
        "Mild low-grade malaise and subjective forehead heaviness"
      ],
      "earlySigns": [
        "Palatal itching or dryness within 10-12 hours of exposure",
        "Mild conjunctival injection and watery eyes",
        "Transient chilliness without true rigors"
      ],
      "redFlags": [
        "Persistent high fever >38.5°C (>101.3°F) exceeding 4 days (suspect bacterial superinfection)",
        "Severe unilateral maxillary or frontal facial tenderness (acute rhinosinusitis)",
        "Stridor, tachypnea, or resting dyspnea",
        "Acute otalgia with bulging tympanic membrane (acute otitis media)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Rapid Respiratory Multiplex Viral RT-PCR",
        "type": "Point of Care / Lab Assay",
        "purpose": "Identifies Rhinovirus, Adenovirus, Enterovirus; rules out Influenza A/B, RSV, and SARS-CoV-2",
        "urgency": "Routine / Outpatient"
      },
      {
        "testName": "Complete Blood Count (CBC) with Differential",
        "type": "Laboratory Assay",
        "purpose": "Evaluates leukocyte count; normal or mild lymphocytosis confirms viral etiology without bacterial leukocytosis",
        "urgency": "Routine"
      },
      {
        "testName": "Rapid Antigen Detection Test (RADT) for Group A Strep",
        "type": "Point of Care Swab",
        "purpose": "Indicated if tonsillopharyngeal exudate present to exclude streptococcal pharyngitis (Centor Score >= 3)",
        "urgency": "Priority / Within 24h"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Paracetamol (Acetaminophen)",
        "strength": "650 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Every 6 hours as needed (SOS)",
        "timing": "After meals with water",
        "duration": "3 to 5 days",
        "regimenType": "First-Line Antipyretic & Analgesic",
        "clinicalNotes": "Do not exceed 3,000 mg in 24 hours. Safe in pregnancy and renal impairment; avoid in acute liver failure."
      },
      {
        "drugName": "Cetirizine Hydrochloride",
        "strength": "10 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "At bedtime",
        "duration": "5 days",
        "regimenType": "Second-Generation H1 Antihistamine",
        "clinicalNotes": "Suppresses rhinorrhea, sneezing, and histamine-mediated mucosal hypersecretion. Low sedative profile."
      },
      {
        "drugName": "Xylometazoline HCl 0.1% Nasal Spray",
        "strength": "0.1% (1 mg/mL)",
        "dosageForm": "Topical Nasal Spray",
        "frequency": "2 sprays per nostril BID",
        "timing": "Morning and before sleep",
        "duration": "Maximum 3 to 5 days strictly",
        "regimenType": "Topical Sympathomimetic Decongestant",
        "clinicalNotes": "CRITICAL PRECAUTION: Strictly limit use to <=5 days to prevent rhinitis medicamentosa (rebound chemical mucosal hypertrophy)."
      },
      {
        "drugName": "Isotonic Saline 0.9% Nasal Rinse",
        "strength": "0.9% w/v NaCl",
        "dosageForm": "Nasal Drops / Spray",
        "frequency": "3 to 4 times daily",
        "timing": "As needed before meals/sleep",
        "duration": "7 days",
        "regimenType": "Non-Pharmacological Mucociliary Cleanser",
        "clinicalNotes": "Clears thick inspissated secretions, facilitates mucociliary escalator clearance, zero drug interactions."
      }
    ],
    "complications": [
      "Secondary acute bacterial rhinosinusitis (1-2% of adult cases)",
      "Acute otitis media from Eustachian tube dysfunction",
      "Exacerbation of underlying bronchial asthma or COPD"
    ],
    "referralTriggers": [
      "Symptoms persisting >14 days without trajectory improvement",
      "Onset of biphasic illness (initial improvement followed by acute spike in fever and purulent sputum)",
      "Development of inspiratory stridor or subcostal retractions"
    ]
  },
  {
    "id": "cough",
    "name": "Cough (Acute & Subacute)",
    "medicalName": "Acute & Subacute Bronchial Cough",
    "category": "Common Illnesses",
    "subCategory": "Respiratory & Infections",
    "icdCode": "R05",
    "datasetSource": "ACCP (American College of Chest Physicians) Evidence-Based Cough Guidelines & WHO",
    "evidenceLevel": "Grade 1B (ACCP Clinical Consensus)",
    "overview": "Airway defensive reflex clearing tracheobronchial secretions; classified as acute (<3 weeks) or subacute (3-8 weeks post-infectious).",
    "symptoms": {
      "hallmark": [
        "Paroxysmal hacking cough (either dry non-productive or productive with sputum)",
        "Retrosternal chest muscular soreness from forceful coughing spasms",
        "Post-tussive throat irritation and sleep fragmentation",
        "Occasional throat clearing and hoarse vocal timbre"
      ],
      "earlySigns": [
        "Persistent tickle in trachea or larynx",
        "Post-nasal drip sensation trickling down posterior pharynx",
        "Mild exertional chest tightness"
      ],
      "redFlags": [
        "Frank hemoptysis or rust-colored sputum",
        "Resting hypoxemia (pulse oximetry SpO2 < 93% on ambient air)",
        "Unexplained B-symptoms: drenching night sweats, involuntary weight loss",
        "Unilateral pleuritic stabbing chest pain exacerbated on inspiration"
      ]
    },
    "requiredTests": [
      {
        "testName": "Standard Chest Radiograph (PA View)",
        "type": "Diagnostic Imaging",
        "purpose": "Essential to exclude pneumonia, lobar consolidation, cavitary tuberculosis, pneumothorax, or bronchogenic neoplasm",
        "urgency": "Priority / Within 24h if red flags"
      },
      {
        "testName": "Pulse Oximetry & Peak Expiratory Flow Rate (PEFR)",
        "type": "Point of Care / Pulmonary",
        "purpose": "Quantifies oxygenation and reversible bronchospastic airway obstruction",
        "urgency": "Stat / Immediate"
      },
      {
        "testName": "Sputum Gram Stain & Sputum Bacterial Culture",
        "type": "Microbiology Assay",
        "purpose": "Identifies Streptococcus pneumoniae, Haemophilus influenzae, or Moraxella catarrhalis in purulent productive cough",
        "urgency": "Routine"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Dextromethorphan Hydrobromide",
        "strength": "15 mg / 5 mL",
        "dosageForm": "Oral Syrup",
        "frequency": "10 mL every 6 to 8 hours as needed",
        "timing": "After meals; especially before bedtime",
        "duration": "5 to 7 days",
        "regimenType": "Centrally Acting Non-Opioid Antitussive",
        "clinicalNotes": "Suppresses medullary cough center for exhausting non-productive cough. CONTRAINDICATION: Do not combine with MAO inhibitors or SSRIs (serotonin syndrome risk)."
      },
      {
        "drugName": "Levosalbutamol + Ambroxol HCl",
        "strength": "(1 mg + 30 mg) / 5 mL",
        "dosageForm": "Oral Solution",
        "frequency": "5 mL three times daily (TID)",
        "timing": "Post-meal with lukewarm water",
        "duration": "5 to 7 days",
        "regimenType": "Bronchodilator & Mucolytic Secretolytic",
        "clinicalNotes": "Ambroxol depolymerizes mucopolysaccharides to thin phlegm; Levosalbutamol relieves reactive bronchial smooth muscle spasm."
      },
      {
        "drugName": "Inhaled Budesonide MDI with Spacer",
        "strength": "200 mcg per puff",
        "dosageForm": "Metered Dose Inhaler",
        "frequency": "2 puffs twice daily (BID)",
        "timing": "Morning and night; rinse mouth after use",
        "duration": "14 days",
        "regimenType": "Topical Inhaled Corticosteroid",
        "clinicalNotes": "Indicated for post-infectious bronchial hyperresponsiveness; rinses mouth to prevent oral candidiasis."
      }
    ],
    "complications": [
      "Post-tussive rib fracture in osteopenic individuals",
      "Cough syncope from transient drop in venous return",
      "Urinary stress incontinence in multiparous females"
    ],
    "referralTriggers": [
      "Cough refractory beyond 8 weeks (chronic cough algorithm)",
      "Hemoptysis of any quantity",
      "Abnormal infiltrate or mass lesion on chest radiography"
    ]
  },
  {
    "id": "fever",
    "name": "Fever (Acute Febrile Illness)",
    "medicalName": "Pyrexia / Acute Febrile Syndrome",
    "category": "Common Illnesses",
    "subCategory": "Fever & Mosquito-Borne",
    "icdCode": "R50.9",
    "datasetSource": "WHO IMAI (Integrated Management of Adolescent & Adult Illness) & CDC Guidance",
    "evidenceLevel": "Grade 1A (WHO Core Protocol)",
    "overview": "Regulated elevation of hypothalamic core set-point temperature above 38.0°C (100.4°F) driven by pyrogenic cytokines (IL-1, IL-6, TNF-alpha).",
    "symptoms": {
      "hallmark": [
        "Core body temperature elevation >38.0°C (>100.4°F)",
        "Rigors, shivering, teeth-chattering followed by intense flushing",
        "Profound generalized myalgia, arthralgia, and cephalalgia",
        "Sinus tachycardia (elevated 10 bpm per 1°C temperature rise)"
      ],
      "earlySigns": [
        "Malaise, anorexia, and cutaneous vasoconstriction (cold extremities)",
        "Dry mouth, mild dehydration, and concentrated urine",
        "Restlessness or mild lethargy"
      ],
      "redFlags": [
        "Altered mental status, confusion, or delirium",
        "Meningeal irritation signs: neck stiffness (nuchal rigidity), photophobia",
        "Petechial or purpuric rash that fails to blanch under glass pressure (meningococcemia / severe dengue)",
        "Hemodynamic instability: Systolic BP <90 mmHg or Mean Arterial Pressure <65 mmHg"
      ]
    },
    "requiredTests": [
      {
        "testName": "Complete Blood Count (CBC) with Peripheral Blood Smear",
        "type": "Laboratory Assay",
        "purpose": "Evaluates toxic granulation, neutrophilic leukocytosis (bacterial), leukopenia (viral/typhoid), and thrombocytopenia",
        "urgency": "Priority / Within 6h"
      },
      {
        "testName": "Serum Procalcitonin (PCT) & High-Sensitivity CRP",
        "type": "Biomarker Assay",
        "purpose": "Distinguishes systemic bacterial sepsis (PCT > 0.5 ng/mL) from self-limiting viral pyrexia",
        "urgency": "Priority / Within 6h"
      },
      {
        "testName": "Dual Automated Blood Culture Sets (Aerobic + Anaerobic)",
        "type": "Microbiology Gold Standard",
        "purpose": "2 sets from independent venipuncture sites strictly prior to antimicrobial initiation",
        "urgency": "Stat / Before Antibiotics"
      },
      {
        "testName": "Urine Routine/Microscopy and Urine Culture",
        "type": "Urinalysis",
        "purpose": "Assesses pyuria (>10 WBC/hpf) to rule out occult urinary tract infection and pyelonephritis",
        "urgency": "Priority / Within 12h"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Paracetamol (Acetaminophen)",
        "strength": "650 mg",
        "dosageForm": "Oral Tablet / IV Infusion",
        "frequency": "Every 6 hours as needed (SOS)",
        "timing": "Post-meal or slow IV over 15 mins",
        "duration": "3 to 5 days",
        "regimenType": "First-Line Antipyretic Agent",
        "clinicalNotes": "Primary antipyretic of choice globally. Adult ceiling: 3,000 mg/24h. Preserves platelet aggregation unlike aspirin."
      },
      {
        "drugName": "WHO Low-Osmolarity Oral Rehydration Salts (ORS)",
        "strength": "20.5 g sachet in 1 L potable water",
        "dosageForm": "Oral Electrolyte Solution",
        "frequency": "Ad libitum (target 2 to 3 Liters daily)",
        "timing": "Sipped continuously throughout the day",
        "duration": "Duration of febrile illness",
        "regimenType": "Electrolyte & Hydration Stabilization",
        "clinicalNotes": "Replaces insensible fluid losses from hyperventilation and diaphoresis; prevents prerenal azotemia."
      }
    ],
    "complications": [
      "Febrile delirium and dehydration-induced acute prerenal kidney injury",
      "Septic shock with multi-organ dysfunction syndrome (MODS)",
      "Disseminated intravascular coagulation (DIC)"
    ],
    "referralTriggers": [
      "Fever >39.5°C unyielding to antipyretics and active physical cooling",
      "Hypotension refractory to oral fluids requiring vasopressor support",
      "Presence of any meningeal or focal neurological deficit"
    ]
  },
  {
    "id": "typhoid",
    "name": "Typhoid Fever",
    "medicalName": "Enteric Fever (Salmonella enterica serovar Typhi)",
    "category": "Common Illnesses",
    "subCategory": "Fever & Mosquito-Borne",
    "icdCode": "A01.0",
    "datasetSource": "WHO Guidelines on the Prevention and Control of Enteric Fever & CDC Global Health",
    "evidenceLevel": "Grade 1A (WHO Strategic Advisory Group of Experts)",
    "overview": "Systemic invasive bacterial infection caused by Salmonella Typhi or Paratyphi transmitted via contaminated food and water.",
    "symptoms": {
      "hallmark": [
        "Step-ladder stepwise progressive high fever reaching 39-40°C by end of week 1",
        "Relative bradycardia inconsistent with high fever (Faget's sign / sphygmo-thermic dissociation)",
        "Heavily coated tongue with red margins ('typhoid tongue')",
        "Hepatosplenomegaly with gentle abdominal distension"
      ],
      "earlySigns": [
        "Persistent frontal throbbing cephalalgia and dry hacking cough",
        "Constipation in early week 1, evolving to pea-soup diarrhea in week 2",
        "Transient faint blanching salmon-colored macules on lower trunk ('rose spots')"
      ],
      "redFlags": [
        "Acute peritonitis from ileal Peyer's patch perforation (terminal ileum) typically in week 3",
        "Massive lower intestinal hemorrhage (melena or frank hematochezia)",
        "Typhoid encephalopathy ('coma vigil' / muttering delirium)",
        "Septic shock with hypothermia and profound hypotension"
      ]
    },
    "requiredTests": [
      {
        "testName": "Blood Culture via Automated BACTEC System",
        "type": "Microbiology Gold Standard",
        "purpose": "Diagnostic yield 75-80% in week 1 of illness before antibiotics; detects Salmonella enterica",
        "urgency": "Stat / Urgent"
      },
      {
        "testName": "Widal Tube Agglutination Test (Paired Sera)",
        "type": "Serology Assay",
        "purpose": "Significant diagnostic threshold: TO titer >= 1:160 and TH titer >= 1:160 with fourfold rise in convalescent serum",
        "urgency": "Routine"
      },
      {
        "testName": "Stool & Urine Bacterial Culture",
        "type": "Microbiology Assay",
        "purpose": "Higher sensitivity in weeks 2-3 of illness; identifies chronic fecal shedding carrier state",
        "urgency": "Routine"
      },
      {
        "testName": "CBC with Absolute Eosinophil Count (AEC)",
        "type": "Laboratory Assay",
        "purpose": "Classic hallmark: Leukopenia (WBC 3,000-5,000/µL) with virtual absence of eosinophils (aneosinophilia)",
        "urgency": "Priority / Within 12h"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Azithromycin Dihydrate",
        "strength": "500 mg (or 20 mg/kg/day)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD) on Day 1, then 500 mg OD",
        "timing": "1 hour before or 2 hours after meals",
        "duration": "7 to 10 days",
        "regimenType": "First-Line Oral Macrolide (Overcomes Fluoroquinolone Resistance)",
        "clinicalNotes": "Achieves high intracellular concentration inside reticuloendothelial macrophages. Low relapse rates (<3%)."
      },
      {
        "drugName": "Ceftriaxone Sodium",
        "strength": "2.0 g (or 50-75 mg/kg/day)",
        "dosageForm": "IV Infusion",
        "frequency": "Once daily (or 1 g Q12H)",
        "timing": "Slow IV infusion over 30 mins in 100 mL NS",
        "duration": "10 to 14 days",
        "regimenType": "First-Line Parenteral Cephalosporin (Hospitalized/Severe)",
        "clinicalNotes": "Indicated for severe enteric fever, toxic state, or oral intolerance. Drug of choice for MDR/XDR strains."
      },
      {
        "drugName": "Dexamethasone Sodium Phosphate",
        "strength": "3 mg/kg initial IV dose, then 1 mg/kg Q6H",
        "dosageForm": "IV Injection",
        "frequency": "Every 6 hours",
        "timing": "Concurrent with initial IV antibiotics",
        "duration": "48 hours only",
        "regimenType": "Adjunctive Corticosteroid for Severe Typhoid Encephalopathy",
        "clinicalNotes": "Significantly reduces mortality in severe typhoid shock/delirium. Discontinue after 48h to prevent mask of perforation."
      }
    ],
    "complications": [
      "Terminal ileal ulcer perforation and life-threatening fecal peritonitis (week 3)",
      "Severe intestinal hemorrhage from eroded mesenteric vessels",
      "Chronic asymptomatic gallbladder carrier state (excreting bacilli >12 months)"
    ],
    "referralTriggers": [
      "Sudden severe abdominal pain with guarding (immediate surgical exploratory laparotomy)",
      "Unresponsive to oral azithromycin after 96 hours of therapy",
      "Features of typhoid state: delirium, extreme prostration, involuntary twitching"
    ]
  },
  {
    "id": "dengue",
    "name": "Dengue Fever",
    "medicalName": "Flavivirus Infection / Dengue Hemorrhagic Fever",
    "category": "Common Illnesses",
    "subCategory": "Fever & Mosquito-Borne",
    "icdCode": "A90",
    "datasetSource": "WHO Comprehensive Guidelines for Prevention and Control of Dengue & CDC Protocols",
    "evidenceLevel": "Grade 1A (WHO Global Standard)",
    "overview": "Arboviral infection transmitted by Aedes mosquitoes; manifests across a spectrum from self-limiting febrile illness to plasma leakage shock.",
    "symptoms": {
      "hallmark": [
        "Abrupt onset saddleback high fever (up to 40°C / 104°F) lasting 2-7 days",
        "Severe retro-orbital pain aggravated by eye movements",
        "Excruciating generalized bone and joint pain ('break-bone fever')",
        "Maculopapular rash appearing as islands of white in a sea of red during recovery"
      ],
      "earlySigns": [
        "Facial erythema, conjunctival suffusion, and intense frontal headache",
        "Marked anorexia, nausea, altered taste (metallic/bitter taste)",
        "Positive tourniquet test (>20 petechiae per square inch)"
      ],
      "redFlags": [
        "Critical Warning Signs (Day 3-7 at defervescence): Severe persistent abdominal pain or tenderness",
        "Persistent intractable vomiting (>=3 episodes in 1 hour or 4 in 6 hours)",
        "Clinical fluid accumulation: right-sided pleural effusion, ascites, gallbladder wall edema",
        "Mucosal bleeding (epistaxis, gingival bleed, hematemesis, menorrhagia)",
        "Rapid concurrent rise in hematocrit (>20%) with precipitous plunge in platelets (<50,000/µL)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Dengue NS1 Antigen ELISA",
        "type": "Serology Assay",
        "purpose": "Primary diagnostic marker in acute febrile phase (Days 1 to 5 from onset); sensitivity 85-95%",
        "urgency": "Priority / Within 6h"
      },
      {
        "testName": "Dengue IgM & IgG Capture ELISA",
        "type": "Serology Assay",
        "purpose": "Indicated from Day 5 onwards; IgM/IgG ratio distinguishes primary from secondary hyper-reactive dengue",
        "urgency": "Priority"
      },
      {
        "testName": "Serial Complete Blood Count (CBC) with Hematocrit (HCT)",
        "type": "Laboratory Assay",
        "purpose": "CRITICAL MONITORING: Baseline and Q12-24H hematocrit. A >20% increase heralds critical microvascular plasma leak",
        "urgency": "Stat / Continuous Tracking"
      },
      {
        "testName": "Platelet Count Tracking & Liver Enzymes (ALT/AST)",
        "type": "Laboratory Assay",
        "purpose": "AST characteristically higher than ALT; platelet nadir identifies bleeding vulnerability",
        "urgency": "Stat"
      },
      {
        "testName": "Abdominal Ultrasound & Chest Radiograph",
        "type": "Diagnostic Imaging",
        "purpose": "Detects subclinical gallbladder wall thickening, ascites, and right pleural effusion indicating plasma leakage",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Normal Saline (0.9% NaCl) or Ringer's Lactate IV",
        "strength": "5 to 7 mL/kg/hour titrated downward to 3-5 then 2 mL/kg/h",
        "dosageForm": "IV Crystalloid Infusion",
        "frequency": "Continuous IV infusion adjusted strictly to urine output and hematocrit",
        "timing": "During the critical plasma leakage phase (24-48 hours)",
        "duration": "24 to 48 hours maximum",
        "regimenType": "Isotonic Crystalloid Fluid Resuscitation",
        "clinicalNotes": "CORE LIFESAVING THERAPY: Maintain urine output at 0.5-1.0 mL/kg/h. Stop fluids promptly once hematocrit stabilizes to prevent pulmonary edema."
      },
      {
        "drugName": "Paracetamol (Acetaminophen)",
        "strength": "500 to 650 mg",
        "dosageForm": "Oral Tablet / IV Infusion",
        "frequency": "Every 6 hours as needed (Maximum 3,000 mg in 24 hours)",
        "timing": "Post-meal with water",
        "duration": "5 days",
        "regimenType": "Analgesic & Antipyretic",
        "clinicalNotes": "STRICT CONTRAINDICATION: Absolute ban on Aspirin, Ibuprofen, Diclofenac, Naproxen, or any NSAIDs (provokes severe gastric hemorrhage and fatal Reye's syndrome)."
      },
      {
        "drugName": "Carica Papaya Leaf Extract",
        "strength": "1,100 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Three times daily (TID)",
        "timing": "After meals",
        "duration": "5 days",
        "regimenType": "Thrombopoiesis Facilitating Nutraceutical Adjunct",
        "clinicalNotes": "Upregulates ALOX-12 and PTAFR genes to stimulate megakaryocytopoiesis and platelet release in uncomplicated thrombocytopenia."
      }
    ],
    "complications": [
      "Dengue Shock Syndrome (DSS) from massive intravascular fluid extravasation",
      "Severe internal hemorrhage (gastrointestinal, intracranial)",
      "Severe acute organ impairment: dengue fulminant hepatitis, myocarditis, encephalitis"
    ],
    "referralTriggers": [
      "Appearance of ANY clinical warning sign (severe abdominal pain, vomiting, lethargy)",
      "Narrowing pulse pressure (<=20 mmHg, e.g. BP 90/70 mmHg) or impalpable peripheral pulse",
      "Platelet count dropping below 20,000/µL or refractory rising hematocrit"
    ]
  },
  {
    "id": "jaundice",
    "name": "Jaundice & Acute Viral Hepatitis",
    "medicalName": "Hyperbilirubinemia & Acute Hepatic Inflammation",
    "category": "Common Illnesses",
    "subCategory": "Blood & Liver",
    "icdCode": "K72.0 / B15-B19",
    "datasetSource": "AASLD (American Association for the Study of Liver Diseases) & WHO Guidelines on Viral Hepatitis",
    "evidenceLevel": "Grade 1A (AASLD Clinical Practice Guidelines)",
    "overview": "Yellowish pigmentation of sclera, skin, and mucosa from serum bilirubin accumulation (>2.5-3.0 mg/dL) resulting from pre-hepatic, intra-hepatic, or post-hepatic pathology.",
    "symptoms": {
      "hallmark": [
        "Scleral icterus (yellowish discoloration visible in daylight) and golden-yellow skin",
        "Deep tea-colored or dark beer-colored urine containing bilirubin",
        "Pale, acholic (clay-colored) stools in obstructive/cholestatic patterns",
        "Severe generalized pruritus from cutaneous bile salt deposition"
      ],
      "earlySigns": [
        "Profound prodromal anorexia, sudden aversion to food and cigarette smoke",
        "Right upper quadrant dull aching pain and hepatic capsular stretch discomfort",
        "Low-grade fever, nausea, and marked physical fatigue"
      ],
      "redFlags": [
        "Asterixis (flapping tremor of outstretched dorsiflexed hands - hepatic encephalopathy)",
        "Reversal of day-night sleep cycle, confusion, agitation, or obtundation",
        "Spontaneous ecchymoses, epistaxis, or bleeding from venipuncture sites (prolonged INR > 1.5)",
        "Rapid shrinking of liver span on percussion (impending fulminant hepatic necrosis)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Serum Bilirubin (Total, Direct/Conjugated, and Indirect)",
        "type": "Laboratory Assay",
        "purpose": "Determines fractionation: Direct >50% confirms conjugated hepatic/cholestatic pattern; indirect >80% points to hemolysis",
        "urgency": "Priority / Within 6h"
      },
      {
        "testName": "Comprehensive Liver Panel: ALT, AST, Alkaline Phosphatase (ALP), GGT",
        "type": "Laboratory Assay",
        "purpose": "Transaminases >1,000 IU/L diagnostic of acute viral/ischemic/toxic hepatitis; ALP/GGT elevation points to biliary duct obstruction",
        "urgency": "Priority / Within 6h"
      },
      {
        "testName": "Acute Viral Hepatitis Serological Panel",
        "type": "Serology Assay",
        "purpose": "Anti-HAV IgM, HBsAg, Anti-HBc IgM, Anti-HCV RNA, Anti-HEV IgM; establishes precise etiologic organism",
        "urgency": "Priority"
      },
      {
        "testName": "Prothrombin Time (PT) and International Normalized Ratio (INR)",
        "type": "Coagulation Assay",
        "purpose": "MOST CRITICAL PROGNOSTIC PARAMETER: Directly reflects factor VII and hepatic synthetic capacity; INR >1.5 defines acute liver failure",
        "urgency": "Stat / Immediate"
      },
      {
        "testName": "High-Resolution Hepatobiliary Ultrasonography (USG)",
        "type": "Diagnostic Imaging",
        "purpose": "Rules out extrahepatic biliary obstruction (choledocholithiasis, common bile duct dilatation >6mm, mass lesions)",
        "urgency": "Priority / Within 12h"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Ursodeoxycholic Acid (UDCA)",
        "strength": "300 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Twice daily (BID)",
        "timing": "Post-meal with milk or food",
        "duration": "30 to 60 days",
        "regimenType": "Hepatoprotective Hydrophilic Choleretic",
        "clinicalNotes": "Displaces toxic hydrophobic bile acids, stabilizes hepatocyte and cholangiocyte canalicular membranes, and enhances biliary secretion."
      },
      {
        "drugName": "Phytomenadione (Vitamin K1)",
        "strength": "10 mg",
        "dosageForm": "Oral Tablet / Slow SC Injection",
        "frequency": "Once daily",
        "timing": "With main meal",
        "duration": "3 to 5 days",
        "regimenType": "Fat-Soluble Vitamin & Coagulation Cofactor",
        "clinicalNotes": "Differentiates cholestatic malabsorption of fat-soluble vitamins (INR normalizes after 48h) from true hepatic synthetic failure (INR remains elevated)."
      },
      {
        "drugName": "Silymarin (Purified Milk Thistle Flavonolignans)",
        "strength": "140 mg",
        "dosageForm": "Oral Capsule",
        "frequency": "Three times daily (TID)",
        "timing": "After meals",
        "duration": "30 days",
        "regimenType": "Antioxidant Hepatocyte Membrane Stabilizer",
        "clinicalNotes": "Inhibits lipid peroxidation, scavenges free radicals, and stimulates ribosomal RNA synthesis to promote hepatic regeneration."
      },
      {
        "drugName": "High-Carbohydrate, Low-Fat Medical Nutrition Therapy",
        "strength": "2,000-2,500 kcal/day (approx 70% carbohydrates)",
        "dosageForm": "Dietary Prescription",
        "frequency": "Small, frequent feedings (5-6 meals/day)",
        "timing": "Throughout waking hours",
        "duration": "Acute convalescent phase",
        "regimenType": "Metabolic Sparing Nutrition",
        "clinicalNotes": "Provides adequate glycogen stores, prevents gluconeogenic catabolism of amino acids, and minimizes biliary gallbladder contraction."
      }
    ],
    "complications": [
      "Acute liver failure with cerebral edema and herniation",
      "Hepatorenal syndrome type 1 (rapidly progressive oliguric renal failure)",
      "Severe coagulopathy and catastrophic spontaneous hemorrhage"
    ],
    "referralTriggers": [
      "Prolongation of INR >= 1.5 in any jaundiced patient (immediate tertiary liver transplant center transfer)",
      "Appearance of asterixis, confusion, or day-night reversal",
      "Serum bilirubin rising > 15 mg/dL or intractable vomiting with dehydration"
    ]
  },
  {
    "id": "asthma",
    "name": "Asthma",
    "medicalName": "Bronchial Asthma & Acute Exacerbation",
    "category": "Common Illnesses",
    "subCategory": "Respiratory & Infections",
    "icdCode": "J45.9",
    "datasetSource": "GINA (Global Initiative for Asthma) 2025/2026 Guidelines & WHO Model List of Essential Medicines",
    "evidenceLevel": "Level 1A (GINA Global Strategy)",
    "overview": "Chronic inflammatory disorder of the conducting airways characterized by bronchial hyperresponsiveness, variable expiratory airflow limitation, and airway remodeling.",
    "symptoms": {
      "hallmark": [
        "Expiratory polyphonic wheezing heard throughout both lung fields",
        "Episodic shortness of breath provoked by cold air, viral triggers, or allergens",
        "Retrosternal chest tightness and nocturnal cough waking patient at 3-4 AM",
        "Prolonged expiratory phase with tachypnea"
      ],
      "earlySigns": [
        "Subtle nocturnal dry hacking cough without daytime symptoms",
        "Exertional breathlessness or limitation during sports/stairs",
        "Frequent throat clearing and nasal congestion (allergic triad)"
      ],
      "redFlags": [
        "Silent chest (complete disappearance of wheezing due to critical airflow reduction)",
        "Inability to complete full sentences in a single breath; speaking in single words",
        "Cyanosis, diaphoresis, exhaustion, or paradoxical thoracoabdominal breathing",
        "Peak Expiratory Flow (PEF) < 50% of personal best or predicted value"
      ]
    },
    "requiredTests": [
      {
        "testName": "Pre- and Post-Bronchodilator Spirometry",
        "type": "Pulmonary Function Test",
        "purpose": "Hallmark diagnostic criteria: FEV1/FVC < 0.70 with FEV1 reversibility >= 12% and >= 200 mL after 400 mcg inhaled salbutamol",
        "urgency": "Priority / Within 24-48h"
      },
      {
        "testName": "Peak Expiratory Flow (PEF) Diurnal Variability Diary",
        "type": "Point of Care / Home Monitoring",
        "purpose": "Twice daily monitoring; diurnal variability > 10% in adults supports asthma diagnosis",
        "urgency": "Routine"
      },
      {
        "testName": "Fractional Exhaled Nitric Oxide (FeNO)",
        "type": "Biomarker Assay",
        "purpose": "FeNO > 35-50 ppb identifies active eosinophilic Type-2 airway inflammation; predicts ICS responsiveness",
        "urgency": "Routine"
      },
      {
        "testName": "Chest Radiograph (PA View)",
        "type": "Diagnostic Imaging",
        "purpose": "Assesses hyperinflation; crucial to exclude pneumothorax, pneumomediastinum, or foreign body in acute exacerbation",
        "urgency": "Priority if severe"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Budesonide + Formoterol Fumarate DPI / MDI",
        "strength": "(160 mcg + 4.5 mcg) or (200 mcg + 6 mcg) per puff",
        "dosageForm": "Dry Powder Inhaler (DPI) / MDI with Spacer",
        "frequency": "1 to 2 puffs BID + 1 puff PRN for symptom relief (MART Regimen)",
        "timing": "Morning and evening; rinse mouth thoroughly with water after inhalation",
        "duration": "Long-term ongoing controller therapy",
        "regimenType": "GINA Track 1 Preferred Controller & Reliever (ICS-Formoterol)",
        "clinicalNotes": "Simultaneously treats inflammation and acute bronchospasm. Significantly lowers severe exacerbation risk compared to SABA monotherapy."
      },
      {
        "drugName": "Salbutamol (Albuterol) Sulfate MDI",
        "strength": "100 mcg per metered actuation",
        "dosageForm": "Pressurized Inhaler with Spacer Device",
        "frequency": "2 to 4 puffs every 4 hours as needed (SOS)",
        "timing": "During acute wheeze or 15 mins before exercise",
        "duration": "Rescue SOS use",
        "regimenType": "Short-Acting Beta-2 Agonist (SABA) Rescue",
        "clinicalNotes": "Rapid bronchodilation within 5 mins; over-reliance (>3 canisters/year) indicates poor controller compliance and increased mortality."
      },
      {
        "drugName": "Prednisolone Oral Burst",
        "strength": "40 mg once daily",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily in the morning",
        "timing": "After breakfast",
        "duration": "5 days strictly (no tapering required)",
        "regimenType": "Systemic Corticosteroid for Moderate-to-Severe Exacerbation",
        "clinicalNotes": "Rapidly suppresses airway mucosal edema and eosinophilic recruitment; short 5-day course avoids adrenal axis suppression."
      },
      {
        "drugName": "Montelukast Sodium",
        "strength": "10 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily at bedtime",
        "timing": "Night with or without food",
        "duration": "30 to 90 days",
        "regimenType": "Leukotriene Receptor Antagonist (LTRA)",
        "clinicalNotes": "Excellent adjunct for exercise-induced bronchospasm and concurrent allergic rhinitis. Monitor for rare neuropsychiatric mood changes."
      }
    ],
    "complications": [
      "Status Asthmaticus refractory to nebulized bronchodilators requiring ICU mechanical ventilation",
      "Pneumothorax and pneumomediastinum from alveolar rupture",
      "Permanent fixed airflow limitation from bronchial wall remodeling"
    ],
    "referralTriggers": [
      "Failure to achieve asthma control despite GINA Step 4 high-dose ICS-LABA (refer to Pulmonologist for biologic therapy: Dupilumab, Omalizumab)",
      "Frequent oral corticosteroid bursts (>=2 courses/year)",
      "Life-threatening exacerbation history (previous intubation or ICU admission)"
    ]
  },
  {
    "id": "malaria",
    "name": "Malaria",
    "medicalName": "Plasmodium Falciparum & Plasmodium Vivax Infection",
    "category": "Common Illnesses",
    "subCategory": "Fever & Mosquito-Borne",
    "icdCode": "B50 / B51",
    "datasetSource": "WHO Guidelines for Malaria 2025/2026 & CDC Malaria Protocols",
    "evidenceLevel": "Grade 1A (WHO Core Treatment Guidelines)",
    "overview": "Protozoan intraerythrocytic parasitic infection transmitted by female Anopheles mosquitoes; P. falciparum responsible for nearly all severe and fatal disease.",
    "symptoms": {
      "hallmark": [
        "Classical malarial paroxysm: Cold stage (intense rigors) -> Hot stage (spiking pyrexia to 40.5°C) -> Sweating stage (drenching diaphoresis)",
        "Tertian (every 48 hours for P. falciparum/vivax) or quartan fever periodicity",
        "Hepatosplenomegaly with left hypochondrial fullness",
        "Mild scleral icterus and hemolytic anemia"
      ],
      "earlySigns": [
        "Nonspecific prodrome: throbbing frontal headache, generalized myalgia, anorexia",
        "Nausea, orthostatic lightheadedness, and dry cough",
        "Subtle conjunctival and palmar pallor"
      ],
      "redFlags": [
        "Cerebral Malaria: Impaired consciousness, unarousable coma (Glasgow Coma Scale < 11), repetitive generalized seizures",
        "Severe normocytic anemia (Hemoglobin < 7 g/dL or Hematocrit < 20%)",
        "Acute Kidney Injury (Serum Creatinine > 3.0 mg/dL or oliguria < 400 mL/day)",
        "Lactic Acidosis (Arterial pH < 7.35 or Venous Lactate > 5.0 mmol/L) with deep acidotic Kussmaul breathing",
        "Hemoglobinuria ('blackwater fever' with dark mahogany urine)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Peripheral Blood Smear (Thick and Thin Films)",
        "type": "Microscopy Gold Standard",
        "purpose": "Thick smear determines parasite presence and quantification (parasitemia %); thin smear identifies species (P. falciparum ring forms vs P. vivax schizonts)",
        "urgency": "Stat / Immediate"
      },
      {
        "testName": "Malaria Rapid Diagnostic Test (RDT)",
        "type": "Point of Care Lateral Flow",
        "purpose": "Detects P. falciparum HRP-2 (Histidine-Rich Protein II) and Pan-Plasmodium pLDH (Lactate Dehydrogenase)",
        "urgency": "Stat"
      },
      {
        "testName": "Complete Blood Count (CBC) with Platelets",
        "type": "Laboratory Assay",
        "purpose": "Assesses normocytic hemolytic anemia and profound thrombocytopenia (<50,000/µL)",
        "urgency": "Stat"
      },
      {
        "testName": "Point-of-Care Blood Glucose & Blood Gas / Serum Lactate",
        "type": "Point of Care Assay",
        "purpose": "MANDATORY: Screens for life-threatening hyperparasitemia-induced hypoglycemia (<40 mg/dL) and lactic acidosis",
        "urgency": "Stat"
      },
      {
        "testName": "Glucose-6-Phosphate Dehydrogenase (G6PD) Qualitative Assay",
        "type": "Enzymatic Screen",
        "purpose": "MANDATORY before administering Primaquine for P. vivax radical cure to prevent catastrophic acute hemolytic crisis",
        "urgency": "Priority / Before Radical Cure"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Artemether + Lumefantrine (ACT)",
        "strength": "20 mg / 120 mg per tablet (Adult dose: 4 tablets per dose)",
        "dosageForm": "Oral Tablet",
        "frequency": "6-dose regimen over 60 hours: Doses at 0h, 8h, 24h, 36h, 48h, and 60h",
        "timing": "MANDATORY: Administer with fatty meal or full-cream milk to ensure bioavailability of lumefantrine",
        "duration": "3 days (complete 6 doses)",
        "regimenType": "WHO First-Line Artemisinin-Based Combination Therapy (ACT)",
        "clinicalNotes": "Artemether rapidly reduces parasite biomass within 24-48h; lumefantrine clears residual parasites preventing recrudescence."
      },
      {
        "drugName": "Artesunate IV",
        "strength": "2.4 mg/kg IV reconstituted in sodium bicarbonate and normal saline",
        "dosageForm": "IV Injection",
        "frequency": "At 0 hours, 12 hours, and 24 hours, then once daily (OD)",
        "timing": "Slow IV bolus over 2-3 mins",
        "duration": "Minimum 24 hours until patient can tolerate oral ACT",
        "regimenType": "LIFESAVING GOLD STANDARD FOR SEVERE MALARIA",
        "clinicalNotes": "Significantly superior survival over IV Quinine (SEAQUAMAT and AQUAMAT trials). Monitor for delayed post-artesunate hemolytic anemia at days 7-21."
      },
      {
        "drugName": "Primaquine Phosphate (for P. vivax / P. ovale Radical Cure)",
        "strength": "0.25 to 0.5 mg/kg base (15 to 30 mg base daily)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "After meals",
        "duration": "14 days",
        "regimenType": "Hypnozoitocidal Radical Cure",
        "clinicalNotes": "Destroys dormant liver hypnozoites in P. vivax preventing relapses. CONTRAINDICATION: Severe G6PD deficiency and pregnancy (causes massive intravascular hemolysis)."
      },
      {
        "drugName": "Paracetamol (Acetaminophen)",
        "strength": "650 mg",
        "dosageForm": "Oral Tablet / IV",
        "frequency": "Every 6 hours as needed (SOS)",
        "timing": "Post-meal",
        "duration": "3 days",
        "regimenType": "Antipyretic",
        "clinicalNotes": "Avoid NSAIDs due to coexisting thrombocytopenia and hemorrhagic risks."
      }
    ],
    "complications": [
      "Cerebral malaria with irreversible brain injury and high case-fatality rate",
      "Acute Respiratory Distress Syndrome (ARDS) from alveolar-capillary leakage",
      "Massive intravascular hemolysis and acute hemoglobinuric tubular necrosis"
    ],
    "referralTriggers": [
      "Any criteria of Severe Malaria (impaired sensorium, jaundice + oliguria, parasitemia > 5%)",
      "Failure of clinical improvement or rising parasitemia at 48 hours of ACT",
      "Spontaneous bleeding or profound thrombocytopenia (<20,000/µL)"
    ]
  },
  {
    "id": "tuberculosis",
    "name": "Tuberculosis",
    "medicalName": "Pulmonary & Extrapulmonary Tuberculosis (Mycobacterium tuberculosis)",
    "category": "Common Illnesses",
    "subCategory": "Respiratory & Infections",
    "icdCode": "A15-A19",
    "datasetSource": "WHO Consolidated Guidelines on Tuberculosis 2025/2026 & Stop TB Global Protocols",
    "evidenceLevel": "Grade 1A (WHO Standard of Care)",
    "overview": "Chronic granulomatous infectious disease caused by Mycobacterium tuberculosis complex transmitting via airborne aerosol droplet nuclei.",
    "symptoms": {
      "hallmark": [
        "Persistent productive cough with mucopurulent sputum lasting >= 2 weeks",
        "Low-grade diurnal evening pyrexia (typically 37.8-38.5°C)",
        "Drenching night sweats soaking nightclothes and bed linens",
        "Progressive unintentional weight loss and profound asthenia"
      ],
      "earlySigns": [
        "Mild intermittent dry hacking cough misdiagnosed as smoker's cough",
        "Postprandial anorexia and gradual loss of subcutaneous fat",
        "Exertional dyspnea and localized wheeze or crepitations"
      ],
      "redFlags": [
        "Massive hemoptysis (>200 mL/24h) from ruptured Rasmussen's aneurysm in tuberculous cavity",
        "Tuberculous Meningitis: headache, persistent vomiting, neck stiffness, cranial nerve VI palsy",
        "Tension pneumothorax from subpleural caseous necrotic cavitation rupture",
        "Spinal Tuberculosis (Pott's Spine): acute paraparesis, gibbus deformity, and cauda equina compression"
      ]
    },
    "requiredTests": [
      {
        "testName": "GeneXpert MTB/RIF Ultra Molecular Automated Assay",
        "type": "Cartridge-Based Nucleic Acid Amplification (CBNAAT)",
        "purpose": "WHO-recommended primary diagnostic test: simultaneously identifies M. tuberculosis DNA and Rifampicin resistance (rpoB gene mutations) in <2 hours",
        "urgency": "Priority / Within 24h"
      },
      {
        "testName": "Fluorescence Acid-Fast Bacilli (AFB) Sputum Smear Microscopy",
        "type": "Microbiology Microscopy",
        "purpose": "Auramine-O staining or Ziehl-Neelsen staining on spot and early morning sputum specimens to quantify infectious bacillary burden",
        "urgency": "Priority"
      },
      {
        "testName": "Posterior-Anterior (PA) Chest Radiograph",
        "type": "Diagnostic Imaging",
        "purpose": "Hallmarks: Apical and posterior segment upper lobe fibrocavitary infiltrates, hilar adenopathy, pleural effusion, or miliary micronodules",
        "urgency": "Priority"
      },
      {
        "testName": "Liquid Mycobacterial Culture (MGIT 960 System) & Phenotypic DST",
        "type": "Microbiology Gold Standard",
        "purpose": "Automated liquid culture isolates viable bacilli and confirms phenotypic drug susceptibility to first- and second-line anti-TB agents",
        "urgency": "Routine"
      },
      {
        "testName": "Baseline Liver Function Tests (LFT) & Serum Creatinine",
        "type": "Laboratory Assay",
        "purpose": "MANDATORY BASELINE: Screens baseline transaminases and renal function before starting hepatotoxic regimen (Isoniazid, Rifampicin, Pyrazinamide)",
        "urgency": "Stat / Before Starting ATT"
      }
    ],
    "prescriptions": [
      {
        "drugName": "4-Drug Fixed Dose Combination (4-FDC: H-R-Z-E)",
        "strength": "Isoniazid 75mg + Rifampicin 150mg + Pyrazinamide 400mg + Ethambutol 275mg per tablet (3-5 tablets based on weight band)",
        "dosageForm": "Oral Fixed-Dose Combination Tablet",
        "frequency": "Once daily (OD) in morning",
        "timing": "Strictly on an empty stomach with plain water >= 1 hour before breakfast",
        "duration": "2 months (Intensive Phase: 56 daily doses)",
        "regimenType": "WHO Standard Intensive Phase Regimen",
        "clinicalNotes": "Directly Observed Therapy (DOTS). Rifampicin imparts harmless bright orange-red discoloration to urine and tears; Pyrazinamide may cause hyperuricemic arthralgia."
      },
      {
        "drugName": "3-Drug Fixed Dose Combination (3-FDC: H-R-E) or 2-FDC (H-R)",
        "strength": "Isoniazid 75mg + Rifampicin 150mg (+ Ethambutol 275mg) per tablet (3-5 tablets based on weight band)",
        "dosageForm": "Oral Fixed-Dose Combination Tablet",
        "frequency": "Once daily (OD) in morning",
        "timing": "Strictly on an empty stomach with plain water >= 1 hour before breakfast",
        "duration": "4 months (Continuation Phase: 112 daily doses)",
        "regimenType": "WHO Standard Continuation Phase Regimen",
        "clinicalNotes": "Sterilizes persistent semi-dormant bacillary persisters, preventing disease relapse and secondary emergence of drug resistance."
      },
      {
        "drugName": "Pyridoxine Hydrochloride (Vitamin B6)",
        "strength": "25 to 50 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "Morning with breakfast",
        "duration": "6 months (throughout entire anti-TB treatment)",
        "regimenType": "Neuroprotective Chemoprophylaxis",
        "clinicalNotes": "MANDATORY CO-PRESCRIPTION: Prevents Isoniazid-induced competitive inhibition of pyridoxine kinase and severe painful peripheral sensory neuropathy."
      }
    ],
    "complications": [
      "Multidrug-Resistant TB (MDR-TB: resistant to both Isoniazid and Rifampicin) requiring 9-18 month bedaquiline regimens",
      "Extensive pulmonary fibrosis, traction bronchiectasis, and chronic respiratory insufficiency",
      "Drug-Induced Liver Injury (DILI): Stop ATT immediately if transaminases rise > 5x ULN or > 3x with jaundice"
    ],
    "referralTriggers": [
      "GeneXpert positive for Rifampicin resistance (immediate transfer to Drug-Resistant TB Center)",
      "Hemoptysis >= 100 mL/day (urgent bronchial artery embolization / thoracic surgery)",
      "Failure of sputum smear conversion from positive to negative at completion of month 2"
    ]
  },
  {
    "id": "food-poisoning",
    "name": "Food Poisoning & Acute Gastroenteritis",
    "medicalName": "Acute Infectious Gastroenteritis & Enterotoxin Toxicosis",
    "category": "Common Illnesses",
    "subCategory": "Stomach & Digestion",
    "icdCode": "A05 / K52.9",
    "datasetSource": "CDC Foodborne Diseases Guidance, WHO Food Safety & ACG Gastroenteritis Guidelines",
    "evidenceLevel": "Grade 1A (ACG Clinical Consensus)",
    "overview": "Acute mucosal inflammation and secretomotor disturbance of the gastrointestinal tract caused by preformed bacterial toxins (S. aureus, B. cereus) or invasive enteric pathogens.",
    "symptoms": {
      "hallmark": [
        "Abrupt onset frequent loose watery stools (>=4-10 episodes within 24 hours)",
        "Paroxysmal spasmodic periumbilical and lower quadrant colicky abdominal pain",
        "Nausea and repetitive bouts of non-bilious or bilious vomiting",
        "Subjective chills, low-grade fever, and hyperactive bowel sounds (borborygmi)"
      ],
      "earlySigns": [
        "Sudden epigastric heaviness, excessive salivation, and malaise within 2-8 hours of suspect meal",
        "Diffuse bloated feeling and frequent eructations",
        "Dryness of lips and oral mucosa"
      ],
      "redFlags": [
        "Gross hematochezia or dysentery (frank macroscopic blood and mucus in stool)",
        "Severe orthostatic dizziness, lightheadedness, or syncope (intravascular volume contraction)",
        "Signs of Severe Dehydration: sunken eyeballs, lost skin turgor (tenting), oliguria/anuria > 8 hours",
        "Persistent high pyrexia (>38.5°C) with rigid abdominal guarding"
      ]
    },
    "requiredTests": [
      {
        "testName": "Stool Routine and Microscopic Examination",
        "type": "Microbiology Microscopy",
        "purpose": "Detects fecal leukocytes (>10 pus cells/hpf indicates invasive mucosal bacterial enteritis), RBCs, and protozoan cysts/trophozoites",
        "urgency": "Priority / Within 6h"
      },
      {
        "testName": "Comprehensive Serum Electrolytes, BUN, and Creatinine",
        "type": "Laboratory Assay",
        "purpose": "Evaluates prerenal azotemia (BUN/Creatinine ratio > 20:1), hypokalemia, and hypochloremic metabolic alkalosis/acidosis",
        "urgency": "Priority / Within 6h"
      },
      {
        "testName": "Multiplex Stool Enteric Pathogen PCR Panel",
        "type": "Molecular Assay",
        "purpose": "Identifies Salmonella, Shigella, Campylobacter, Shiga-toxin producing E. coli (STEC), Norovirus, and C. difficile toxin genes",
        "urgency": "Routine"
      }
    ],
    "prescriptions": [
      {
        "drugName": "WHO Low-Osmolarity Oral Rehydration Salts (ORS)",
        "strength": "20.5 g sachet in 1 L potable water (Osmolarity 245 mOsm/L)",
        "dosageForm": "Oral Electrolyte Solution",
        "frequency": "200 to 400 mL replacement after every loose stool episode",
        "timing": "Sipped slowly in small frequent sips",
        "duration": "3 to 5 days until diarrhea resolves",
        "regimenType": "CORNERSTONE LIFESAVING THERAPY",
        "clinicalNotes": "Leverages intact SGLT-1 intestinal brush border sodium-glucose co-transport to drive massive water reabsorption into enterocytes."
      },
      {
        "drugName": "Ondansetron Hydrochloride",
        "strength": "4 to 8 mg",
        "dosageForm": "Orally Disintegrating Tablet (ODT) / Slow IV",
        "frequency": "Every 8 hours as needed (SOS)",
        "timing": "Place on tongue 15 mins prior to oral fluids",
        "duration": "1 to 2 days maximum",
        "regimenType": "Potent 5-HT3 Receptor Antagonist Antiemetic",
        "clinicalNotes": "Blocks peripheral vagal afferents and central chemoreceptor trigger zone; aborts emesis allowing successful oral rehydration."
      },
      {
        "drugName": "Zinc Sulfate Monohydrate",
        "strength": "20 mg elemental zinc",
        "dosageForm": "Oral Tablet / Syrup",
        "frequency": "Once daily (OD)",
        "timing": "Post-meal",
        "duration": "14 days",
        "regimenType": "Enterocyte Regenerative Micronutrient",
        "clinicalNotes": "WHO recommendation: Promotes intestinal brush border villous regeneration, reduces diarrhea duration by 25%, and prevents recurrence."
      },
      {
        "drugName": "Ciprofloxacin HCl (or Azithromycin 500 mg OD)",
        "strength": "500 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Twice daily (BID)",
        "timing": "With water 2 hours after meals",
        "duration": "3 days strictly",
        "regimenType": "Empiric Fluoroquinolone (Strictly Reserved for Febrile/Invasive Dysentery)",
        "clinicalNotes": "Indicated strictly if macroscopic blood in stool or fever > 38.5°C. CONTRAINDICATION: Avoid if suspected STEC (O157:H7) as antibiotics induce Shiga toxin release triggering Hemolytic Uremic Syndrome (HUS)."
      }
    ],
    "complications": [
      "Severe acute hypovolemic shock and prerenal acute tubular necrosis",
      "Hemolytic Uremic Syndrome (microangiopathic hemolytic anemia, thrombocytopenia, AKI) with STEC",
      "Post-infectious Reactive Arthritis (Reiter's syndrome) following Salmonella or Shigella"
    ],
    "referralTriggers": [
      "Inability to retain any oral fluids for >12 hours despite antiemetics",
      "Signs of severe shock (systolic BP < 90 mmHg, cold extremities, confusion)",
      "Bloody diarrhea in elderly or immunocompromised patients"
    ]
  },
  {
    "id": "stomach-infections",
    "name": "Stomach Infections & Peptic Ulcer Disease",
    "medicalName": "Helicobacter pylori Gastritis & Peptic Ulcer Disease",
    "category": "Common Illnesses",
    "subCategory": "Stomach & Digestion",
    "icdCode": "K25 / K29.7",
    "datasetSource": "ACG Clinical Guideline for H. Pylori Infection & Maastricht VI / Florence European Consensus",
    "evidenceLevel": "Grade 1A (Maastricht VI Consensus)",
    "overview": "Gastric mucosal disruption and peptic ulceration primarily driven by Helicobacter pylori colonization and NSAID-induced prostaglandin inhibition.",
    "symptoms": {
      "hallmark": [
        "Burning or gnawing epigastric pain (duodenal ulcers: relieved by meals; gastric ulcers: precipitated by meals)",
        "Nocturnal epigastric pain awakening patient between midnight and 3 AM",
        "Postprandial early satiety, epigastric fullness, and persistent belching",
        "Nausea and intermittent waterbrash (sour fluid regurgitation)"
      ],
      "earlySigns": [
        "Epigastric ache occurring 2 to 3 hours after meals",
        "Recurrent non-cardiac chest and substernal burning",
        "Transient relief with over-the-counter antacids"
      ],
      "redFlags": [
        "Hematemesis (frank bright red blood or coffee-ground vomitus)",
        "Melena (tarry, sticky, foul-smelling black stools indicating upper GI bleed)",
        "Sudden catastrophic severe generalized peritonitis (ulcer perforation into peritoneal cavity)",
        "Gastric Outlet Obstruction: persistent projectile vomiting of undigested food eaten hours earlier",
        "Unintentional profound weight loss and progressive dysphagia"
      ]
    },
    "requiredTests": [
      {
        "testName": "13C-Urea Breath Test (UBT) or Stool Antigen Test (HpSA)",
        "type": "Diagnostic Non-Invasive Assay",
        "purpose": "Gold standard non-invasive test for active H. pylori infection; sensitivity/specificity >95%. MANDATORY: Must be off PPI for >=2 weeks and antibiotics for >=4 weeks",
        "urgency": "Routine / Outpatient"
      },
      {
        "testName": "Esophagogastroduodenoscopy (Upper GI Endoscopy / EGD)",
        "type": "Endoscopic Gold Standard",
        "purpose": "Direct mucosal visualization of ulcer crater, Forrest classification staging for bleeding ulcers, and targeted antral/corpus mucosal biopsies",
        "urgency": "Stat if bleeding / Priority"
      },
      {
        "testName": "Rapid Urease Test (RUT / CLO Test) on Endoscopic Biopsy",
        "type": "Point of Care Tissue Test",
        "purpose": "Colorimetric change within 1-2 hours confirms active bacterial urease enzyme production",
        "urgency": "Immediate during EGD"
      },
      {
        "testName": "Serum Ferritin & Complete Blood Count (CBC)",
        "type": "Laboratory Assay",
        "purpose": "Identifies microcytic hypochromic iron deficiency anemia from chronic occult mucosal weeping",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Bismuth Quadruple Therapy Regimen (14-Day Protocol)",
        "strength": "Esomeprazole 40mg BID + Bismuth Subsalicylate 300mg QID + Metronidazole 500mg TID/QID + Tetracycline HCl 500mg QID",
        "dosageForm": "Oral Multi-Agent Protocol",
        "frequency": "PPI: twice daily before meals; Bismuth, Metronidazole, Tetracycline: four times daily with meals and bedtime",
        "timing": "PPI 30-60 mins before breakfast & dinner; antibiotics with meals",
        "duration": "14 days strictly",
        "regimenType": "ACG & Maastricht VI Preferred First-Line Eradication Therapy",
        "clinicalNotes": "Overcomes high global clarithromycin resistance (>15-20%). Achieves >90% eradication. Counsel patient on harmless black discoloration of tongue and stool from bismuth."
      },
      {
        "drugName": "Esomeprazole Magnesium (or Pantoprazole)",
        "strength": "40 mg",
        "dosageForm": "Delayed-Release Oral Tablet / IV",
        "frequency": "Once or twice daily",
        "timing": "30 to 60 minutes before breakfast",
        "duration": "4 to 8 weeks after eradication protocol",
        "regimenType": "Potent Proton Pump Inhibitor (PPI)",
        "clinicalNotes": "Maintains intragastric pH > 6 to promote rapid ulcer healing and re-epithelialization of mucosal craters."
      },
      {
        "drugName": "Sucralfate Oral Suspension",
        "strength": "1.0 g / 10 mL",
        "dosageForm": "Oral Suspension",
        "frequency": "Four times daily (QID)",
        "timing": "1 hour before meals and at bedtime on an empty stomach",
        "duration": "4 weeks",
        "regimenType": "Cytoprotective Mucosal Barrier Binder",
        "clinicalNotes": "Polymerizes in acidic environment into viscous paste that selectively binds positively charged proteins in ulcer crater, forming mechanical shield."
      }
    ],
    "complications": [
      "Catastrophic acute upper gastrointestinal hemorrhage from erosion into gastroduodenal artery",
      "Acute free peritoneal perforation with pneumoperitoneum and septic peritonitis",
      "Gastric MALT lymphoma and intestinal-type gastric adenocarcinoma secondary to chronic H. pylori"
    ],
    "referralTriggers": [
      "Any evidence of hematemesis or melena (immediate emergency endoscopic hemostasis: clipping/thermal)",
      "Acute rigid, silent, board-like abdomen (emergency exploratory laparotomy for Graham patch repair)",
      "Persistent symptoms post-eradication in patient age > 55 with alarm features"
    ]
  },
  {
    "id": "urinary-infections",
    "name": "Urinary Tract Infections",
    "medicalName": "Acute Cystitis & Acute Pyelonephritis",
    "category": "Common Illnesses",
    "subCategory": "Kidneys & Urinary",
    "icdCode": "N39.0 / N10",
    "datasetSource": "IDSA (Infectious Diseases Society of America) Guidelines for Acute Uncomplicated Cystitis & Pyelonephritis & EAU",
    "evidenceLevel": "Grade 1A (IDSA Global Guidelines)",
    "overview": "Urothelial inflammatory response to bacterial invasion (Uropathogenic E. coli in 75-95%) spanning from lower bladder mucosal cystitis to parenchymal pyelonephritis.",
    "symptoms": {
      "hallmark": [
        "Severe scalding or burning dysuria during and immediately after micturition",
        "Urinary urgency (sudden compelling urge to urinate that is difficult to defer)",
        "Frequency (frequent voiding of small volumes every 15-30 minutes)",
        "Suprapubic aching tenderness and cloudy, turbid, malodorous urine"
      ],
      "earlySigns": [
        "Mild urethral irritation at termination of urination",
        "Nocturia awakening patient from sleep",
        "Microscopic or terminal pinkish hematuria"
      ],
      "redFlags": [
        "Costovertebral angle (CVA) tenderness or severe unilateral loin/flank pain",
        "High spiking fever (>38.5°C) with shaking rigors and nausea/vomiting (Acute Pyelonephritis)",
        "Urosepsis: Hypotension (systolic BP < 90 mmHg), altered mental state, tachypnea",
        "Acute urinary retention in elderly males with prostatic enlargement"
      ]
    },
    "requiredTests": [
      {
        "testName": "Urine Routine and Microscopic Examination",
        "type": "Urinalysis",
        "purpose": "Hallmark findings: Significant pyuria (>10 WBC/hpf or >25 WBC/µL uncentrifuged), bacteriuria, positive leukocyte esterase, and positive nitrite (enterobacteria)",
        "urgency": "Stat / Immediate"
      },
      {
        "testName": "Quantitative Clean-Catch Midstream Urine Culture & DST",
        "type": "Microbiology Gold Standard",
        "purpose": "Significant bacteriuria: >= 10^5 CFU/mL in asymptomatic; >= 10^3 CFU/mL in symptomatic females; isolates UPEC and tests susceptibility",
        "urgency": "Priority / Before Antibiotics"
      },
      {
        "testName": "Serum Creatinine, BUN, and Complete Blood Count (CBC)",
        "type": "Laboratory Assay",
        "purpose": "Essential if upper tract symptoms (pyelonephritis) present to evaluate renal parenchymal impairment and leukocytosis with left shift",
        "urgency": "Priority if febrile"
      },
      {
        "testName": "Ultrasound of Kidneys, Ureters, and Bladder (USG KUB)",
        "type": "Diagnostic Imaging",
        "purpose": "Indicated in complicated/recurrent UTI or pyelonephritis to rule out obstructive calculus, hydronephrosis, or perinephric abscess",
        "urgency": "Priority / Within 24h"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Nitrofurantoin Monohydrate / Macrocrystals",
        "strength": "100 mg",
        "dosageForm": "Oral Capsule",
        "frequency": "Twice daily (BID)",
        "timing": "Take with meals or milk to enhance bioavailability and minimize nausea",
        "duration": "5 days",
        "regimenType": "IDSA First-Line Agent for Acute Uncomplicated Cystitis",
        "clinicalNotes": "Concentrates exclusively in urine with negligible serum levels; preserves bowel and vaginal flora. CONTRAINDICATION: Ineffective in pyelonephritis (insufficient tissue levels) and contraindicated if eGFR < 30 mL/min."
      },
      {
        "drugName": "Fosfomycin Trometamol",
        "strength": "3.0 g",
        "dosageForm": "Granules for Oral Solution Sachet",
        "frequency": "Single dose therapy",
        "timing": "Dissolve in 100 mL cold water; take at bedtime after emptying bladder",
        "duration": "Single Dose",
        "regimenType": "IDSA First-Line Single-Dose Bactericidal Agent",
        "clinicalNotes": "Inhibits MurA bacterial cell wall synthesis. Exceptional compliance; maintains bactericidal urinary levels for >48 hours; active against ESBL E. coli."
      },
      {
        "drugName": "Phenazopyridine Hydrochloride",
        "strength": "200 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Three times daily (TID)",
        "timing": "After meals with a full glass of water",
        "duration": "Maximum 2 days strictly",
        "regimenType": "Urinary Tract Mucosal Analgesic",
        "clinicalNotes": "Provides rapid symptomatic relief of severe burning dysuria. CRITICAL COUNSELING: Discolors urine and tears bright reddish-orange; discolors contact lenses."
      },
      {
        "drugName": "Ceftriaxone Sodium (for Acute Pyelonephritis)",
        "strength": "1.0 g",
        "dosageForm": "IV Infusion",
        "frequency": "Once daily (OD)",
        "timing": "Slow IV infusion over 30 mins in 100 mL NS",
        "duration": "7 to 10 days (switch to oral ciprofloxacin when afebrile)",
        "regimenType": "First-Line Parenteral Cephalosporin for Acute Pyelonephritis",
        "clinicalNotes": "Achieves high renal parenchymal tissue concentrations; excellent activity against community enterobacteriaceae."
      }
    ],
    "complications": [
      "Perinephric abscess or emphysematous pyelonephritis in poorly controlled diabetics",
      "Severe Gram-negative urosepsis and endotoxic shock",
      "Chronic renal scarring and secondary hypertension following recurrent childhood pyelonephritis"
    ],
    "referralTriggers": [
      "High fever with flank pain failing to improve after 48-72 hours of IV antibiotics (urgent contrast CT to rule out renal abscess)",
      "Presence of obstructing ureteral calculus with infection (emergency urologic decompression via ureteral JJ stent or nephrostomy)",
      "Recurrent UTI (>=3 episodes/year) requiring cystoscopy and urologic evaluation"
    ]
  },
  {
    "id": "diabetes",
    "name": "Diabetes Mellitus (Type 2)",
    "medicalName": "Type 2 Diabetes Mellitus & Metabolic Syndrome",
    "category": "Other Health Problems",
    "subCategory": "Blood Sugar & Hormones",
    "icdCode": "E11.9",
    "datasetSource": "ADA (American Diabetes Association) Standards of Care in Diabetes 2026 & EASD",
    "evidenceLevel": "Grade A (ADA Clinical Practice Recommendations)",
    "overview": "Complex progressive metabolic disorder defined by insulin resistance, progressive pancreatic beta-cell secretory defect, and chronic hyperglycemia promoting microvascular and macrovascular pathology.",
    "symptoms": {
      "hallmark": [
        "Polyuria (excessive urination from osmotic diuresis) and nocturia",
        "Polydipsia (intense thirst secondary to hyperosmolarity)",
        "Polyphagia (compensatory cellular hunger) accompanied by unprovoked weight loss",
        "Transient blurred vision due to hyperosmolar lens swelling"
      ],
      "earlySigns": [
        "Profound postprandial somnolence and chronic fatigue",
        "Acanthosis nigricans (velvety hyperpigmented cutaneous plaques on neck and axillae)",
        "Recurrent cutaneous candidiasis, balanitis, or vulvovaginitis",
        "Slow-healing minor cuts and paresthesias in distal lower extremities"
      ],
      "redFlags": [
        "Hyperglycemic Hyperosmolar State (HHS): Blood glucose >600 mg/dL, serum osmolarity >320 mOsm/kg, profound dehydration, stupor/coma",
        "Diabetic Ketoacidosis (DKA): Kussmaul respirations, fruity acetone breath, abdominal pain, ketonuria",
        "Infected diabetic foot ulcer with ascending lymphangitis, crepitus, or probe-to-bone depth",
        "Sudden monocular visual loss (vitreous hemorrhage or retinal detachment)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Glycated Hemoglobin (HbA1c Assay via NGSP Standard)",
        "type": "Laboratory Assay",
        "purpose": "Diagnostic threshold >= 6.5%; general adult glycemic target < 7.0% (individualized: 6.5% for young/fit, <8.0% for frail elderly)",
        "urgency": "Priority / Routine"
      },
      {
        "testName": "Fasting Plasma Glucose (FPG) & 2-Hour 75g OGTT",
        "type": "Laboratory Assay",
        "purpose": "Fasting >= 8h: Diagnostic threshold >= 126 mg/dL (7.0 mmol/L); 2h OGTT >= 200 mg/dL (11.1 mmol/L) confirmed on repeat testing",
        "urgency": "Priority"
      },
      {
        "testName": "Spot Urine Albumin-to-Creatinine Ratio (uACR)",
        "type": "Urinalysis Biomarker",
        "purpose": "Annual mandatory nephropathy screen: Normal < 30 mg/g; Microalbuminuria 30-300 mg/g; Macroalbuminuria > 300 mg/g",
        "urgency": "Routine / Annual"
      },
      {
        "testName": "Serum Creatinine with CKD-EPI Estimated GFR (eGFR)",
        "type": "Laboratory Assay",
        "purpose": "Evaluates cardiorenal baseline; guides metformin and SGLT2i dosing safety thresholds",
        "urgency": "Priority"
      },
      {
        "testName": "Dilated Fundus Examination by Ophthalmologist",
        "type": "Specialist Evaluation",
        "purpose": "Screens for non-proliferative/proliferative diabetic retinopathy and clinically significant macular edema (CSME)",
        "urgency": "Annual Routine"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Metformin Hydrochloride Extended-Release (ER)",
        "strength": "500 to 1,000 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once or twice daily (BID)",
        "timing": "Take with evening meal to minimize gastrointestinal distress",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "Foundational First-Line Biguanide Insulin Sensitizer",
        "clinicalNotes": "Inhibits hepatic gluconeogenesis via AMPK activation; weight-neutral; reduces cardiovascular mortality. Monitor eGFR (safe down to 30 mL/min; discontinue if <30 mL/min due to rare lactic acidosis risk)."
      },
      {
        "drugName": "Empagliflozin (or Dapagliflozin)",
        "strength": "10 to 25 mg (Dapagliflozin 10 mg)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily in the morning",
        "timing": "With or without food",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "SGLT2 Inhibitor with Cardiorenal & Heart Failure Protection",
        "clinicalNotes": "Blocks proximal tubule glucose and sodium reabsorption. Mandatory guideline choice for patients with established ASCVD, heart failure (HFrEF/HFpEF), or CKD. Counsel on genital mycotic hygiene and euglycemic DKA warning."
      },
      {
        "drugName": "Semaglutide (Oral or Once-Weekly SC)",
        "strength": "Oral: 3mg -> 7mg -> 14mg OD; SC: 0.25mg -> 0.5mg -> 1.0mg weekly",
        "dosageForm": "Oral Tablet / Subcutaneous Pen Injector",
        "frequency": "Oral: once daily fasting; SC: once weekly on the same day",
        "timing": "Oral: wake up on empty stomach with <=120 mL plain water, wait 30 mins before food",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "GLP-1 Receptor Agonist with High Glycemic & Weight Loss Efficacy",
        "clinicalNotes": "Enhances glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying. Robust MACE reduction in ASCVD. Contraindicated in personal/family history of Medullary Thyroid Carcinoma or MEN-2."
      },
      {
        "drugName": "Glimepiride",
        "strength": "1 to 2 mg (titrated to max 4 mg)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "Immediately before the first main meal of the day (breakfast)",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "Second-Generation Sulfonylurea Secretagogue",
        "clinicalNotes": "Stimulates pancreatic beta-cell SUR-1 receptors. Cost-effective add-on; patient MUST be educated on recognizing and managing hypoglycemia (rule of 15)."
      }
    ],
    "complications": [
      "Diabetic Nephropathy & End-Stage Renal Disease (ESRD) requiring chronic hemodialysis",
      "Accelerated Atherosclerotic Cardiovascular Disease (Myocardial Infarction, Ischemic Stroke, Peripheral Artery Disease)",
      "Diabetic Peripheral Neuropathy, Charcot neuroarthropathy, and lower extremity amputations"
    ],
    "referralTriggers": [
      "Severe refractory glycemic dysregulation (HbA1c > 9.5%) despite triple oral combination therapy",
      "Rapidly declining eGFR (>5 mL/min/year drop) or new-onset macroalbuminuria (uACR > 300 mg/g)",
      "Presence of active diabetic foot ulceration or neuro-ischemic skin changes"
    ]
  },
  {
    "id": "high-blood-pressure",
    "name": "High Blood Pressure (Hypertension)",
    "medicalName": "Essential Hypertension & Hypertensive Urgency",
    "category": "Other Health Problems",
    "subCategory": "Heart & Circulation",
    "icdCode": "I10",
    "datasetSource": "ACC/AHA 2017/2026 Hypertension Guidelines, ISH Global Guidelines & WHO Protocol",
    "evidenceLevel": "Class 1, Level A (ACC/AHA Task Force)",
    "overview": "Persistent elevation of systemic arterial blood pressure (Systolic >= 130 mmHg or Diastolic >= 80 mmHg) leading to progressive cardiovascular, cerebral, and renal target organ damage.",
    "symptoms": {
      "hallmark": [
        "Predominantly asymptomatic ('the silent killer') detected during routine screening",
        "Suboccipital throbbing morning headache present on waking and fading by midday",
        "Exertional breathlessness, generalized fatigue, and lightheadedness",
        "Subjective bilateral high-pitched tinnitus and palpitations"
      ],
      "earlySigns": [
        "Mild unprovoked epistaxis (nosebleeds)",
        "Transient dizziness upon standing or bending over",
        "Facial flushing with emotional stress or moderate physical exertion"
      ],
      "redFlags": [
        "Hypertensive Emergency: BP > 180/120 mmHg accompanied by acute target organ dysfunction",
        "Acute aortic dissection: tearing retrosternal pain radiating straight to interscapular back",
        "Hypertensive encephalopathy: altered sensorium, seizures, papilledema, projectile vomiting",
        "Acute cardiogenic pulmonary edema: severe orthopnea, bilateral crackles, pink frothy sputum"
      ]
    },
    "requiredTests": [
      {
        "testName": "24-Hour Ambulatory Blood Pressure Monitoring (ABPM) / Home BP (HBPM)",
        "type": "Physiological Monitoring Gold Standard",
        "purpose": "Essential to confirm true sustained hypertension, assess nocturnal dipping profile, and rule out white-coat and masked hypertension",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "12-Lead Electrocardiogram (ECG)",
        "type": "Cardiac Electrophysiology",
        "purpose": "Evaluates Sokolow-Lyon criteria (S in V1 + R in V5/V6 >= 35 mm) and Cornell voltage for Left Ventricular Hypertrophy (LVH) and strain patterns",
        "urgency": "Priority"
      },
      {
        "testName": "Comprehensive Metabolic Panel (CMP): Serum Creatinine, eGFR, Electrolytes",
        "type": "Laboratory Assay",
        "purpose": "Assesses renal function, baseline potassium (screens for primary aldosteronism if hypokalemic), and sodium",
        "urgency": "Priority"
      },
      {
        "testName": "Spot Urine Albumin-to-Creatinine Ratio (uACR)",
        "type": "Urinalysis Biomarker",
        "purpose": "Detects subclinical hypertensive nephrosclerosis and microalbuminuria; independent cardiovascular risk marker",
        "urgency": "Routine"
      },
      {
        "testName": "Fasting Lipid Profile and Fasting Blood Glucose",
        "type": "Laboratory Assay",
        "purpose": "Mandatory to compute 10-year Atherosclerotic Cardiovascular Disease (ASCVD) risk percentage",
        "urgency": "Routine"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Telmisartan (or Losartan Potassium)",
        "strength": "40 to 80 mg (Losartan 50-100 mg)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "Morning at the same time every day with water",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "First-Line Angiotensin II Receptor Blocker (ARB)",
        "clinicalNotes": "Blocks AT1 receptors; highest lipophilicity and longest half-life (24 hours) in ARB class; provides sustained BP control through morning surge. Free from bradykinin cough. Recheck potassium and creatinine at 2 weeks."
      },
      {
        "drugName": "Amlodipine Besylate",
        "strength": "5 to 10 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "Morning or bedtime",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "First-Line Dihydropyridine Calcium Channel Blocker (CCB)",
        "clinicalNotes": "Potent peripheral arterial vasodilator. Highly effective monotherapy and synergistic with ARB. Warn patient regarding benign dependent pretibial edema (caused by precapillary arteriolar vasodilation, not fluid overload)."
      },
      {
        "drugName": "Chlorthalidone (or Hydrochlorothiazide)",
        "strength": "12.5 to 25 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily in the morning",
        "timing": "With breakfast",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "Thiazide-Like Diuretic",
        "clinicalNotes": "ALLHAT trial proven cardiovascular event reduction. Chlorthalidone preferred over HCTZ due to longer duration of action (48-72h). Monitor serum electrolytes (potassium, sodium) and uric acid."
      },
      {
        "drugName": "DASH Diet & Dietary Sodium Restriction Protocol",
        "strength": "< 1,500 to 2,000 mg elemental sodium/day (<5 g NaCl/day)",
        "dosageForm": "Evidence-Based Lifestyle Prescription",
        "frequency": "Continuous daily adherence",
        "timing": "Daily meals",
        "duration": "Lifelong",
        "regimenType": "Class 1 Non-Pharmacological Intervention",
        "clinicalNotes": "Yields systolic BP reduction of 8 to 14 mmHg (equivalent to full-dose single pharmacological monotherapy). Emphasize potassium-rich foods (fruits, vegetables, legumes) unless advanced CKD."
      }
    ],
    "complications": [
      "Hypertensive Heart Disease, Left Ventricular Hypertrophy, and Heart Failure (HFpEF)",
      "Ischemic Stroke, Lacunar Infarction, and Spontaneous Intracerebral Hemorrhage",
      "Hypertensive Nephrosclerosis leading to progressive End-Stage Renal Disease (ESRD)"
    ],
    "referralTriggers": [
      "Resistant Hypertension: BP remains above target despite concurrent adherence to >=3 antihypertensive agents of different classes (including a diuretic)",
      "Suspected Secondary Hypertension (sudden onset age <30 or >55, hypokalemic alkalosis, refractory snoring/OSA, epigastric bruits)",
      "Hypertensive crisis with any acute target organ compromise (immediate ER admission for IV Labetalol / Nicardipine)"
    ]
  },
  {
    "id": "kidney-problems",
    "name": "Chronic Kidney Disease (CKD)",
    "medicalName": "Chronic Kidney Disease & Renal Insufficiency (Stages 1 to 5)",
    "category": "Other Health Problems",
    "subCategory": "Kidneys & Urinary",
    "icdCode": "N18.9",
    "datasetSource": "KDIGO 2024/2026 Clinical Practice Guideline for Evaluation & Management of CKD & WHO",
    "evidenceLevel": "Grade 1A (KDIGO Global Consensus)",
    "overview": "Abnormalities of kidney structure or function present for >3 months with implications for health, defined by eGFR <60 mL/min/1.73m² or persistent albuminuria >=30 mg/g.",
    "symptoms": {
      "hallmark": [
        "Bilateral periorbital morning puffiness and dependent pitting pretibial/pedal edema",
        "Foamy, frothy urine due to significant proteinuria / albuminuria",
        "Nocturia (passing urine multiple times at night due to lost concentrating ability)",
        "Refractory or escalating hypertension and persistent generalized asthenia"
      ],
      "earlySigns": [
        "Subtle loss of stamina, pallor from normocytic normochromic anemia of CKD",
        "Metallic taste in mouth (dysgeusia), loss of appetite, and nausea",
        "Pruritus (itching) from uremic toxins and hyperphosphatemia"
      ],
      "redFlags": [
        "Uremic Pericarditis: pleuro-pericardial friction rub, severe chest pain worsened supine",
        "Uremic Encephalopathy: asterixis (flapping tremor), confusion, myoclonic twitches, coma",
        "Refractory severe hyperkalemia (Serum Potassium > 6.5 mEq/L) with peaked T-waves on ECG",
        "Intractable hypervolemia and flash pulmonary edema unresponsive to high-dose loop diuretics"
      ]
    },
    "requiredTests": [
      {
        "testName": "Serum Creatinine with CKD-EPI 2021 Creatinine-Cystatin C eGFR Equation",
        "type": "Laboratory Assay Gold Standard",
        "purpose": "Classifies CKD Stages: G1 (>=90), G2 (60-89), G3a (45-59), G3b (30-44), G4 (15-29), G5 (<15 mL/min/1.73m²)",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Spot Urine Albumin-to-Creatinine Ratio (uACR)",
        "type": "Urinalysis Staging Marker",
        "purpose": "Classifies Albuminuria Stages: A1 (<30 mg/g normal to mildly increased), A2 (30-300 mg/g microalbuminuria), A3 (>300 mg/g macroalbuminuria)",
        "urgency": "Priority"
      },
      {
        "testName": "Comprehensive Electrolyte & Mineral Bone Panel (K+, Na+, Ca2+, PO4, iPTH)",
        "type": "Laboratory Assay",
        "purpose": "Detects hyperkalemia, secondary hyperparathyroidism, hypocalcemia, and hyperphosphatemia (CKD-MBD)",
        "urgency": "Priority"
      },
      {
        "testName": "Renal Ultrasonography with Color Doppler",
        "type": "Diagnostic Imaging",
        "purpose": "Demonstrates bilateral small shrunken kidneys (bipolar length < 9 cm) with increased cortical echogenicity and lost corticomedullary differentiation",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Dapagliflozin (or Empagliflozin)",
        "strength": "10 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "Morning with water",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "KDIGO First-Line Renoprotective SGLT2 Inhibitor",
        "clinicalNotes": "DAPA-CKD & EMPA-KIDNEY landmark trials: Slows eGFR decline by 40-50% and dramatically cuts cardiovascular death in CKD with eGFR 20-60 mL/min and uACR > 200 mg/g. Can be continued until initiation of dialysis."
      },
      {
        "drugName": "Telmisartan (or Enalapril)",
        "strength": "20 to 40 mg (titrated to max tolerated)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "Morning with water",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "Renin-Angiotensin-Aldosterone System (RAAS) Blocker",
        "clinicalNotes": "Selectively dilates efferent renal arterioles, reducing intraglomerular hydrostatic pressure and proteinuria. Expected benign serum creatinine bump up to 30% acceptable. Monitor serum potassium."
      },
      {
        "drugName": "Torsemide (or Furosemide)",
        "strength": "10 to 20 mg (Torsemide) / 40 to 80 mg (Furosemide)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily in the morning",
        "timing": "Empty stomach",
        "duration": "Ongoing as needed for volume control",
        "regimenType": "High-Ceiling Loop Diuretic",
        "clinicalNotes": "Torsemide has superior, more predictable oral bioavailability (80-90%) than furosemide in uremic bowel edema. Titrated strictly to achieve euvolemia and control pretibial edema."
      },
      {
        "drugName": "Sodium Bicarbonate",
        "strength": "500 to 1,000 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Two to three times daily",
        "timing": "After meals",
        "duration": "Ongoing while serum bicarbonate < 22 mmol/L",
        "regimenType": "Alkalinizing Agent for Chronic Metabolic Acidosis",
        "clinicalNotes": "Target serum HCO3 22-26 mmol/L. Prevents progressive muscle protein wasting, preserves bone mineral density, and significantly slows rate of GFR loss."
      }
    ],
    "complications": [
      "End-Stage Renal Disease (ESRD) requiring renal replacement therapy (hemodialysis / peritoneal dialysis / transplant)",
      "Accelerated Uremic Cardiovascular Calcification, Sudden Cardiac Death, and Stroke",
      "Renal Osteodystrophy / Fracture from secondary and tertiary hyperparathyroidism"
    ],
    "referralTriggers": [
      "eGFR dropping below 30 mL/min/1.73m² (CKD Stage G4 - initiate timely vascular access arteriovenous fistula [AVF] planning)",
      "Rapid unexplained eGFR decline (>5 mL/min/year)",
      "Refractory hyperkalemia (K > 6.0 mEq/L) or nephrotic-range proteinuria (uACR > 2,000 mg/g)"
    ]
  },
  {
    "id": "heart-problems",
    "name": "Heart Problems (Coronary Artery Disease & Heart Failure)",
    "medicalName": "Coronary Artery Disease & Congestive Heart Failure (CAD / CHF)",
    "category": "Other Health Problems",
    "subCategory": "Heart & Circulation",
    "icdCode": "I25.1 / I50.9",
    "datasetSource": "AHA/ACC 2023/2026 Chronic Coronary Disease & Heart Failure Guidelines, ESC",
    "evidenceLevel": "Class 1, Level A (AHA/ACC Guidelines)",
    "overview": "Atherosclerotic narrowing of coronary arteries resulting in myocardial ischemia, left ventricular remodeling, and heart failure with reduced or preserved ejection fraction.",
    "symptoms": {
      "hallmark": [
        "Classical Angina Pectoris: substernal heavy squeezing/crushing pressure provoked by exertion or cold, relieved by rest or sublingual nitroglycerin within 5 mins",
        "Radiation of ischemic discomfort to left shoulder, left arm, neck, or lower jaw",
        "Exertional dyspnea and reduced functional exercise tolerance (NYHA Class I-IV)",
        "Orthopnea (need for multiple pillows to breathe at night) and Paroxysmal Nocturnal Dyspnea (PND)"
      ],
      "earlySigns": [
        "Subtle shortness of breath when walking uphill or climbing one flight of stairs",
        "Unexplained profound post-exertional fatigue and bilateral ankle swelling",
        "Palpitations and occasional skipped heartbeats"
      ],
      "redFlags": [
        "Acute Coronary Syndrome (ACS / STEMI / NSTEMI): Unrelenting crushing retrosternal pain > 20 mins, diaphoresis, nausea, syncope",
        "Cardiogenic Shock: Systolic BP < 90 mmHg, cold clammy extremities, oliguria, confusion",
        "Flash Pulmonary Edema: sudden severe breathlessness, hypoxia, diffuse bibasilar wet crackles, pink sputum",
        "Malignant Ventricular Arrhythmias (Ventricular Tachycardia / VF arrest)"
      ]
    },
    "requiredTests": [
      {
        "testName": "12-Lead Electrocardiogram (ECG)",
        "type": "Cardiac Electrophysiology",
        "purpose": "Assesses ST-segment elevation/depression (>=1 mm in contiguous leads), pathologic Q-waves, T-wave inversion, new Left Bundle Branch Block (LBBB)",
        "urgency": "Stat / Within 10 minutes of presentation"
      },
      {
        "testName": "High-Sensitivity Cardiac Troponin-I / Troponin-T (hs-cTn)",
        "type": "Cardiac Biomarker Assay",
        "purpose": "0h/1h or 0h/2h rapid diagnostic algorithm for Acute Myocardial Infarction; detects myocardial necrosis",
        "urgency": "Stat / Immediate"
      },
      {
        "testName": "Transthoracic 2D-Echocardiography with Color Doppler",
        "type": "Diagnostic Imaging",
        "purpose": "Quantifies Left Ventricular Ejection Fraction (LVEF: HFrEF <=40%, HFmrEF 41-49%, HFpEF >=50%), regional wall motion abnormalities, and valvular stenosis/regurgitation",
        "urgency": "Priority / Within 24h"
      },
      {
        "testName": "N-Terminal pro-B-type Natriuretic Peptide (NT-proBNP)",
        "type": "Neurohormonal Biomarker",
        "purpose": "Biomarker of ventricular wall stretch and heart failure: Rule-out cutoff < 125 pg/mL non-acute; < 300 pg/mL acute dyspnea",
        "urgency": "Priority"
      },
      {
        "testName": "Coronary Computed Tomography Angiography (CCTA) / Invasive Coronary Angiogram",
        "type": "Angiographic Imaging",
        "purpose": "Definitive anatomical visualization of coronary stenosis, plaque burden, and fractional flow reserve (FFR)",
        "urgency": "Priority / Urgent if ACS"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Aspirin (Acetylsalicylic Acid - Enteric Coated)",
        "strength": "75 to 100 mg (Loading dose: 325 mg chewed in acute ACS)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "With main meal",
        "duration": "Indefinite lifelong therapy",
        "regimenType": "Antiplatelet Cyclooxygenase-1 (COX-1) Inhibitor",
        "clinicalNotes": "Irreversibly inhibits platelet thromboxane A2 production. Cornerstone of secondary atherothrombotic prevention across all clinical coronary disease."
      },
      {
        "drugName": "Atorvastatin Calcium (or Rosuvastatin)",
        "strength": "40 to 80 mg (Rosuvastatin 20 to 40 mg)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily at bedtime",
        "timing": "Night with or without food",
        "duration": "Indefinite lifelong therapy",
        "regimenType": "High-Intensity HMG-CoA Reductase Inhibitor",
        "clinicalNotes": "Achieves >= 50% LDL-C reduction with target LDL < 55 mg/dL (<1.4 mmol/L) in very high-risk CAD. Provides robust plaque stabilization, anti-inflammatory, and pleiotropic endothelial protection."
      },
      {
        "drugName": "Metoprolol Succinate Extended-Release (or Bisoprolol)",
        "strength": "25 to 50 mg (titrated to target 100-200 mg OD)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily in the morning",
        "timing": "With or immediately after breakfast",
        "duration": "Indefinite lifelong therapy",
        "regimenType": "Cardioselective Beta-1 Adrenergic Blocker",
        "clinicalNotes": "Reduces myocardial oxygen demand, limits ventricular remodeling, and significantly decreases sudden cardiac death in CAD and HFrEF. Target resting heart rate: 55-65 bpm."
      },
      {
        "drugName": "Nitroglycerin (Glyceryl Trinitrate) Sublingual",
        "strength": "0.4 mg (400 mcg)",
        "dosageForm": "Sublingual Tablet / Spray",
        "frequency": "1 tablet/spray sublingually every 5 mins up to 3 doses SOS for acute chest pain",
        "timing": "Place under tongue while seated (prevents postural syncope)",
        "duration": "Emergency SOS rescue",
        "regimenType": "Rapid-Acting Venous & Coronary Nitrate Vasodilator",
        "clinicalNotes": "Reduces cardiac preload and left ventricular end-diastolic pressure. CRITICAL WARNING: If chest pain persists >5 minutes after first dose, patient must activate emergency EMS (911/112) immediately. CONTRAINDICATION: Do not administer if PDE-5 inhibitor (sildenafil, tadalafil) taken within 24-48 hours (risk of fatal refractory hypotension)."
      }
    ],
    "complications": [
      "Acute ST-Elevation Myocardial Infarction (STEMI) with extensive anterior wall necrosis",
      "Malignant ventricular tachyarrhythmias and sudden cardiac arrest",
      "End-stage decompensated heart failure requiring cardiac resynchronization therapy (CRT-D) or LVAD"
    ],
    "referralTriggers": [
      "Any chest pain concerning for Acute Coronary Syndrome (immediate transfer to 24/7 Primary PCI catheterization lab)",
      "Refractory NYHA Class III-IV heart failure symptoms despite guideline-directed medical therapy (GDMT: ARNI + Beta-blocker + MRA + SGLT2i)",
      "Documented Left Ventricular Ejection Fraction <= 35% (referral for Implantable Cardioverter-Defibrillator [ICD])"
    ]
  },
  {
    "id": "liver-problems",
    "name": "Liver Problems (Fatty Liver & Cirrhosis)",
    "medicalName": "Metabolic Dysfunction-Associated Steatohepatitis (MASH) & Cirrhosis",
    "category": "Other Health Problems",
    "subCategory": "Blood & Liver",
    "icdCode": "K76.0 / K74.6",
    "datasetSource": "AASLD Practice Guidance on NAFLD/MASH & EASL Clinical Practice Guidelines",
    "evidenceLevel": "Grade 1A (AASLD Practice Guidance)",
    "overview": "Spectrum of progressive liver injury starting with hepatic steatosis, progressing to inflammatory steatohepatitis (MASH), bridging fibrosis, and irreversible nodular cirrhosis.",
    "symptoms": {
      "hallmark": [
        "Right upper quadrant dull fullness, hepatic capsular tension, and chronic lethargy",
        "Cutaneous vascular stigmata: spider angiomas (spider nevi) on face/chest, palmar erythema",
        "Bilateral non-tender parotid gland enlargement and Dupuytren's palmar contracture",
        "Gradual progressive abdominal girth expansion (ascites) and dependent pedal edema"
      ],
      "earlySigns": [
        "Subtle postprandial fatigue, daytime drowsiness, and poor exercise tolerance",
        "Mild unprovoked upper abdominal fullness",
        "Incidental transaminase elevation (ALT > AST in steatohepatitis; AST > ALT in cirrhosis)"
      ],
      "redFlags": [
        "Decompensated Cirrhosis: Gross tense ascites, spontaneous bacterial peritonitis (SBP: fever + abdominal pain)",
        "Variceal Hemorrhage: Sudden massive hematemesis or melena from ruptured esophageal varices",
        "Hepatic Encephalopathy: Flapping tremor (asterixis), confusion, inversion of sleep-wake cycle, coma",
        "Hepatorenal Syndrome (HRS): Rapid oliguric renal failure with unremarkable urine sediment"
      ]
    },
    "requiredTests": [
      {
        "testName": "Comprehensive Liver Function Panel (ALT, AST, ALP, GGT, Albumin, Bilirubin)",
        "type": "Laboratory Assay",
        "purpose": "Evaluates hepatocellular vs cholestatic injury; AST:ALT ratio > 1 suggests advanced bridging fibrosis/cirrhosis",
        "urgency": "Priority"
      },
      {
        "testName": "FIB-4 Score Non-Invasive Fibrosis Calculation",
        "type": "Calculated Clinical Biomarker",
        "purpose": "Calculated using Age, AST, ALT, and Platelet count: <1.30 rules out advanced fibrosis (NPV >90%); >2.67 indicates high risk of F3-F4 advanced fibrosis",
        "urgency": "Routine / Outpatient"
      },
      {
        "testName": "Transient Elastography (FibroScan)",
        "type": "Quantitative Ultrasound Elastography",
        "purpose": "Measures liver stiffness in kilopascals (kPa; >12-15 kPa diagnostic of cirrhosis) and Controlled Attenuation Parameter (CAP in dB/m for steatosis)",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Upper Gastrointestinal Endoscopy (EGD)",
        "type": "Endoscopic Screening",
        "purpose": "Mandatory surveillance for gastroesophageal varices in all patients with confirmed cirrhosis or liver stiffness >= 20 kPa",
        "urgency": "Priority"
      },
      {
        "testName": "Liver Ultrasound + Serum Alpha-Fetoprotein (AFP) Every 6 Months",
        "type": "Surveillance Protocol",
        "purpose": "Mandatory semiannual screening for Hepatocellular Carcinoma (HCC) in all cirrhotic patients",
        "urgency": "Routine Semiannual"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Vitamin E (d-alpha-tocopherol)",
        "strength": "800 IU daily",
        "dosageForm": "Oral Softgel Capsule",
        "frequency": "Once daily (OD)",
        "timing": "With food",
        "duration": "12 to 24 months",
        "regimenType": "Antioxidant Lipid Peroxidation Scavenger (AASLD Recommended for Non-Diabetic MASH)",
        "clinicalNotes": "PIVENS trial: Significantly improves steatosis and lobular inflammation in biopsy-proven non-diabetic MASH. Avoid in men with high risk of prostate cancer."
      },
      {
        "drugName": "Spironolactone + Furosemide (Ascites Protocol)",
        "strength": "Spironolactone 100 mg + Furosemide 40 mg (100:40 mg ratio)",
        "dosageForm": "Oral Tablets",
        "frequency": "Once daily in the morning",
        "timing": "After breakfast",
        "duration": "Ongoing as needed for ascites maintenance",
        "regimenType": "Aldosterone Antagonist + Loop Diuretic Combination",
        "clinicalNotes": "The 100:40 mg ratio maintains serum potassium balance while successfully mobilizing ascitic fluid. Target weight loss: 0.5 kg/day (without edema) or 1.0 kg/day (with pedal edema)."
      },
      {
        "drugName": "Lactulose Oral Solution",
        "strength": "15 to 30 mL",
        "dosageForm": "Oral Liquid",
        "frequency": "Two to three times daily",
        "timing": "Titrated to achieve exactly 2 to 3 soft bowel movements per day",
        "duration": "Long-term ongoing maintenance",
        "regimenType": "Non-Absorbable Synthetic Disaccharide for Encephalopathy",
        "clinicalNotes": "Metabolized by colonic bacteria into lactic and acetic acid; acidifies lumen to pH < 5, converting diffusible ammonia (NH3) into non-absorbable ammonium (NH4+) trapped in stool."
      },
      {
        "drugName": "Rifaximin",
        "strength": "550 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Twice daily (BID)",
        "timing": "With or without food",
        "duration": "Long-term secondary prevention",
        "regimenType": "Gut-Specific Non-Absorbable Antimicrobial",
        "clinicalNotes": "AASLD/EASL standard add-on to lactulose; reduces recurrent overt hepatic encephalopathy hospitalizations by >50%."
      }
    ],
    "complications": [
      "Acute variceal hemorrhage with exsanguinating shock and high 6-week mortality (15-20%)",
      "Spontaneous Bacterial Peritonitis (SBP) requiring urgent diagnostic paracentesis (PMN >= 250/µL)",
      "Hepatocellular Carcinoma (HCC) arising in cirrhotic parenchyma (annual incidence 2-4%)"
    ],
    "referralTriggers": [
      "First episode of clinical decompensation (ascites, variceal bleed, encephalopathy) -> Refer to Hepatologist for MELD score and Liver Transplant evaluation",
      "Any suspicion of variceal hemorrhage (emergency endoscopic band ligation [EBL] + IV Octreotide)",
      "New discrete liver nodule on screening ultrasound"
    ]
  },
  {
    "id": "thyroid-problems",
    "name": "Thyroid Disorders (Hypo & Hyperthyroidism)",
    "medicalName": "Hypothyroidism (Hashimoto's) & Hyperthyroidism (Graves' Disease)",
    "category": "Other Health Problems",
    "subCategory": "Blood Sugar & Hormones",
    "icdCode": "E03.9 / E05.0",
    "datasetSource": "ATA (American Thyroid Association) Guidelines & Endocrine Society Practice Guidelines",
    "evidenceLevel": "Grade 1A (ATA Consensus Guidelines)",
    "overview": "Endocrine disorders of the hypothalamic-pituitary-thyroid axis characterized by either hormone deficiency (hypothyroidism) or excessive circulating free thyroid hormones (thyrotoxicosis/hyperthyroidism).",
    "symptoms": {
      "hallmark": [
        "Hypothyroidism: Extreme cold intolerance, sluggish speech, unprovoked weight gain, chronic constipation, dry brittle coarse hair, periorbital non-pitting edema (myxedema)",
        "Hyperthyroidism: Heat intolerance, excessive diaphoresis, unprovoked weight loss despite voracious appetite, fine resting tremor, palpitations, emotional lability",
        "Graves' Orbitopathy: Exophthalmos (proptosis), lid lag (von Graefe sign), staring gaze, diplopia",
        "Diffuse or nodular thyromegaly (goiter) with or without vascular systolic bruit"
      ],
      "earlySigns": [
        "Unexplained cognitive slowing, memory fog, fatigue, and depression",
        "Menstrual irregularities (menorrhagia in hypothyroidism; oligomenorrhea/amenorrhea in hyperthyroidism)",
        "Proximal muscle weakness (difficulty rising from a squatting chair position)"
      ],
      "redFlags": [
        "Myxedema Coma: Severe hypothermia (<35°C), hypoventilation, hypercapnia, severe bradycardia, obtundation",
        "Thyroid Storm: Hyperpyrexia (>40°C / 104°F), rapid atrial fibrillation, acute heart failure, agitation/delirium",
        "Rapidly expanding thyroid mass with vocal hoarseness and stridor (anaplastic transformation or lymphoma)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Third-Generation Serum Thyroid-Stimulating Hormone (TSH)",
        "type": "Chemiluminescent Immunoassay Gold Standard",
        "purpose": "Most sensitive screening test (Reference: 0.45 - 4.50 mIU/L). Elevated TSH indicates primary hypothyroidism; suppressed TSH (<0.01 mIU/L) indicates thyrotoxicosis",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Serum Free Thyroxine (Free T4) and Free Triiodothyronine (Free T3)",
        "type": "Laboratory Assay",
        "purpose": "Differentiates overt disease (abnormal Free T4/T3) from subclinical disease (normal Free T4/T3 with abnormal TSH)",
        "urgency": "Priority"
      },
      {
        "testName": "Anti-Thyroid Peroxidase (Anti-TPO) and Anti-Thyroglobulin (Anti-Tg) Antibodies",
        "type": "Autoantibody Serology",
        "purpose": "High titer (>100 IU/mL) confirms autoimmune Hashimoto's thyroiditis as underlying etiology",
        "urgency": "Routine"
      },
      {
        "testName": "TSH-Receptor Antibodies (TRAb) / Thyroid-Stimulating Immunoglobulin (TSI)",
        "type": "Autoantibody Serology",
        "purpose": "Diagnostic confirmation of Graves' disease; distinguishes Graves' from toxic multinodular goiter or subacute thyroiditis",
        "urgency": "Priority"
      },
      {
        "testName": "High-Resolution Thyroid Ultrasound with Color Flow Doppler",
        "type": "Diagnostic Imaging",
        "purpose": "Assesses diffuse hypoechoic architecture, vascularity ('thyroid inferno' in Graves'), and TI-RADS risk classification of concurrent nodules",
        "urgency": "Routine"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Levothyroxine Sodium (T4)",
        "strength": "1.6 mcg/kg ideal body weight/day (typical starting dose: 50 to 100 mcg daily; 25 mcg in elderly/CAD)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily in the morning",
        "timing": "Strictly on an empty stomach with plain water >= 30 to 60 minutes before breakfast",
        "duration": "Lifelong ongoing replacement therapy",
        "regimenType": "First-Line Synthetic Thyroid Hormone Replacement",
        "clinicalNotes": "CRITICAL COUNSELING: Must not take simultaneously with calcium, iron supplements, multivitamins, coffee, or antacids (space by >= 4 hours). Recheck serum TSH at 6 to 8 weeks after any dose adjustment."
      },
      {
        "drugName": "Methimazole (Thiamazole)",
        "strength": "10 to 30 mg daily (titrated to maintenance 5-10 mg OD)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "With meals",
        "duration": "12 to 18 months course for Graves' disease",
        "regimenType": "Thionamide Antithyroid Synthesis Inhibitor",
        "clinicalNotes": "Inhibits thyroid peroxidase-mediated iodination of tyrosine residues. Preferred over PTU due to lower hepatotoxicity. CRITICAL WARNING: Educate patient to immediately stop drug and obtain urgent CBC if sore throat or fever occurs (screens for rare 0.2-0.5% agranulocytosis)."
      },
      {
        "drugName": "Propranolol Hydrochloride",
        "strength": "20 to 40 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Three to four times daily (TID/QID)",
        "timing": "With food",
        "duration": "2 to 4 weeks during acute thyrotoxic control",
        "regimenType": "Non-Selective Beta-Adrenergic Blocker",
        "clinicalNotes": "Rapidly controls adrenergic thyrotoxic symptoms (tachycardia, tremor, heat intolerance, anxiety) and partially inhibits peripheral T4-to-T3 conversion at high doses."
      }
    ],
    "complications": [
      "Myxedema Coma with high mortality (20-40%) requiring ICU IV levothyroxine and hydrocortisone",
      "Thyrotoxic Thyroid Storm provoked by trauma/surgery/infection",
      "Persistent Atrial Fibrillation, Embolic Stroke, and Osteoporosis from untreated hyperthyroidism"
    ],
    "referralTriggers": [
      "Suspected Thyroid Storm or Myxedema Coma (immediate emergency intensive care resuscitation)",
      "Severe Graves' ophthalmopathy with sight-threatening compressive optic neuropathy",
      "Thyroid nodule with suspicious ACR TI-RADS 4 or 5 ultrasound features requiring fine needle aspiration"
    ]
  },
  {
    "id": "anaemia",
    "name": "Anaemia (Iron Deficiency & Megaloblastic)",
    "medicalName": "Iron Deficiency Anaemia & Nutritional Megaloblastic Anaemia",
    "category": "Other Health Problems",
    "subCategory": "Blood & Liver",
    "icdCode": "D50.9 / D53.9",
    "datasetSource": "WHO Guidelines on the Use of Ferritin Concentrations & British Society of Gastroenterology (BSG)",
    "evidenceLevel": "Grade 1A (WHO Core Guidelines)",
    "overview": "Reduction in total circulating red blood cell mass or hemoglobin concentration below reference cutoffs (<13.0 g/dL in adult males, <12.0 g/dL in non-pregnant females) compromising tissue oxygen delivery.",
    "symptoms": {
      "hallmark": [
        "Severe generalized physical fatigue, exertional breathlessness, and rapid exhaustion",
        "Marked conjunctival, subungual, and palmar crease pallor",
        "Postural lightheadedness, orthostatic dizziness, and pulsatile tinnitus",
        "Compensatory resting or exertional sinus tachycardia and functional systolic ejection murmur"
      ],
      "earlySigns": [
        "Pica: abnormal cravings for non-nutritive substances (ice chewing/pagophagia, dirt, clay, starch)",
        "Restless Legs Syndrome (Willis-Ekbom disease): irresistible urge to move legs at rest",
        "Koilonychia (concave spoon-shaped nails), angular cheilitis, atrophic glossitis (smooth sore tongue)"
      ],
      "redFlags": [
        "Hemodynamic instability: resting chest angina, presyncope, severe tachycardia (HR > 120 bpm)",
        "High-output congestive heart failure with peripheral edema and orthopnea",
        "Signs of occult macroscopic gastrointestinal hemorrhage: melena, hematochezia",
        "Neurological Megaloblastic Symptoms: subacute combined degeneration of spinal cord (loss of vibration/proprioception, ataxia)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Complete Blood Count (CBC) with Automated RBC Indices",
        "type": "Laboratory Assay",
        "purpose": "Hemoglobin, Hematocrit, Mean Corpuscular Volume (MCV <80 fL microcytic in IDA; >100 fL macrocytic in B12/folate), MCH, Red Cell Distribution Width (RDW elevated in IDA)",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Serum Ferritin & Complete Iron Studies (Serum Iron, TIBC, Transferrin Saturation)",
        "type": "Laboratory Assay Gold Standard",
        "purpose": "Serum Ferritin < 30 ng/mL diagnostic of iron deficiency (<100 ng/mL in inflammatory state); Transferrin Saturation (TSAT) < 16-20% confirms iron-deficient erythropoiesis",
        "urgency": "Priority"
      },
      {
        "testName": "Peripheral Blood Smear Examination (Leishman Stained)",
        "type": "Microscopy Gold Standard",
        "purpose": "Reveals microcytic hypochromic erythrocytes with pencil/cigar cells in IDA; macro-ovalocytes and hypersegmented neutrophils (>=5 lobes) in B12/folate deficiency",
        "urgency": "Priority"
      },
      {
        "testName": "Serum Vitamin B12 (Cyanocobalamin) & Serum Folate Assay",
        "type": "Chemiluminescent Immunoassay",
        "purpose": "Serum B12 < 200 pg/mL diagnostic of deficiency; rule out pernicious anemia via Anti-Intrinsic Factor antibodies",
        "urgency": "Routine"
      },
      {
        "testName": "Bidirectional Endoscopy (Gastroscopy + Colonoscopy) or FIT Test",
        "type": "Gastroenterology Diagnostic Workup",
        "purpose": "MANDATORY in adult males and postmenopausal females with unexplained IDA to exclude occult gastrointestinal malignancy (colorectal/gastric cancer)",
        "urgency": "Priority / Within 2-4 weeks"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Ferrous Ascorbate / Ferrous Sulfate (Elemental Iron 100 mg)",
        "strength": "100 mg elemental iron + 1.5 mg Folic Acid",
        "dosageForm": "Oral Film-Coated Tablet",
        "frequency": "Once daily or alternate-day dosing (e.g. Mon-Wed-Fri)",
        "timing": "Take on an empty stomach with a glass of water or Vitamin C (orange juice) to enhance absorption",
        "duration": "3 to 6 months (continue for 3 months after Hb normalizes to replenish marrow ferritin stores)",
        "regimenType": "First-Line Oral Hematinic Replacement",
        "clinicalNotes": "Alternate-day dosing (100 mg elemental iron every other day) reduces hepcidin elevation, maximizes fractional iron absorption, and cuts gastrointestinal constipation/nausea by 50%."
      },
      {
        "drugName": "Ferric Carboxymaltose (FCM)",
        "strength": "500 to 1,000 mg elemental iron in 100-250 mL 0.9% Normal Saline",
        "dosageForm": "IV Infusion",
        "frequency": "Single dose infused over 15 to 30 minutes (repeated once if Ganzoni iron deficit exceeds 1,000 mg)",
        "timing": "Slow IV infusion",
        "duration": "Single administration",
        "regimenType": "Parenteral Iron Formulation of Choice",
        "clinicalNotes": "Indicated for severe anemia (Hb < 8 g/dL), oral iron intolerance, inflammatory bowel disease, 2nd/3rd trimester pregnancy, or CKD. Non-dextran shell eliminates anaphylaxis risk."
      },
      {
        "drugName": "Methylcobalamin (Active Vitamin B12)",
        "strength": "1,000 to 1,500 mcg",
        "dosageForm": "Oral Tablet / Intramuscular Injection (1,000 mcg IM)",
        "frequency": "Oral: once daily; IM: 1,000 mcg alternate days x 1 week, then weekly x 4 weeks",
        "timing": "Morning with food",
        "duration": "3 months (lifelong if pernicious anemia)",
        "regimenType": "Active Neurotropic Coenzyme",
        "clinicalNotes": "Essential co-factor for methionine synthase; prevents irreversible demyelination of dorsal and lateral columns. Always correct B12 before or concurrently with folate to prevent subacute combined degeneration."
      }
    ],
    "complications": [
      "Severe high-output congestive heart failure and myocardial ischemia",
      "Permanent irreversible sensory and motor paraparesis from Vitamin B12 subacute combined degeneration",
      "Premature birth, low birth weight, and perinatal mortality in maternal gestational anemia"
    ],
    "referralTriggers": [
      "Symptomatic severe anemia with Hemoglobin < 7.0 g/dL (hospitalize for packed RBC transfusion and parenteral iron)",
      "Unexplained iron deficiency anemia in adult male or postmenopausal woman (immediate referral for fast-track bidirectional GI endoscopy)",
      "Progressive neurological deficits (paresthesias, ataxia, spasticity) in suspected megaloblastic deficiency"
    ]
  },
  {
    "id": "breast-cancer",
    "name": "Breast Cancer",
    "medicalName": "Invasive Ductal & Lobular Breast Carcinoma",
    "category": "Cancer Types",
    "subCategory": "Common Cancers",
    "icdCode": "C50.9",
    "datasetSource": "NCCN Clinical Practice Guidelines in Oncology (Breast Cancer) v2.2026 & ASCO",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant epithelial neoplasm originating from terminal ductal lobular units of the breast, classified by hormone receptor (ER/PR) and HER2/neu expression profiles.",
    "symptoms": {
      "hallmark": [
        "Painless, hard, irregular, solitary breast lump tethered to surrounding parenchyma or pectoralis fascia",
        "Cutaneous skin dimpling, tethering, or 'peau d'orange' (dermal lymphatic edema)",
        "Unilateral nipple retraction, inversion, or eczema-like crusting (Paget's disease)",
        "Spontaneous unilateral bloody or clear serosanguinous nipple discharge from a single duct"
      ],
      "earlySigns": [
        "Subtle localized parenchymal architectural distortion on self-examination",
        "Asymmetric breast tissue thickening or fullness not fluctuating with menstrual cycle",
        "Mild unprovoked axillary aching sensation"
      ],
      "redFlags": [
        "Palpable, firm, matted, immobile axillary or supraclavicular lymphadenopathy",
        "Inflammatory Breast Cancer: rapid erythema, warmth, and diffuse induration involving >one-third of breast mimicking mastitis",
        "Metastatic dissemination signs: persistent localized skeletal bone pain, dyspnea, jaundice, or focal neurological deficit"
      ]
    },
    "requiredTests": [
      {
        "testName": "Bilateral Diagnostic Digital Mammography & High-Frequency Ultrasound",
        "type": "Diagnostic Imaging Gold Standard",
        "purpose": "BI-RADS 1-6 reporting: identifies microcalcifications (pleomorphic/branching), spiculation, architectural distortion, and axillary nodal architecture",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Image-Guided Core Needle Biopsy (CNB) of Mass & Suspicious Axillary Nodes",
        "type": "Histopathology Gold Standard",
        "purpose": "Provides definitive histologic architecture (invasive ductal vs lobular) and distinguishes invasive carcinoma from in situ (DCIS/LCIS)",
        "urgency": "Priority / Within 1 week"
      },
      {
        "testName": "Immunohistochemical (IHC) Biomarker Panel (ER, PR, HER2/neu, Ki-67)",
        "type": "Molecular Pathology",
        "purpose": "MANDATORY: Establishes molecular subtype (Luminal A, Luminal B, HER2-enriched, Triple-Negative); HER2 equivocal (2+) reflexed to FISH testing",
        "urgency": "Priority"
      },
      {
        "testName": "Germline Genetic Testing (BRCA1, BRCA2, PALB2, TP53)",
        "type": "Genetic Assay",
        "purpose": "Recommended for age <= 50 years, triple-negative breast cancer, bilateral disease, or strong family history of breast/ovarian cancer",
        "urgency": "Routine / Pre-Surgical"
      },
      {
        "testName": "Whole-Body 18F-FDG PET-CT or Contrast CT Chest/Abdomen/Pelvis + Bone Scintigraphy",
        "type": "Staging Imaging",
        "purpose": "Mandatory staging for clinical Stage IIB, Stage III, and inflammatory breast cancer to evaluate distant skeletal/visceral metastases",
        "urgency": "Priority before systemic therapy"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Trastuzumab + Pertuzumab (Targeted HER2 Dual Blockade)",
        "strength": "Trastuzumab 8 mg/kg loading -> 6 mg/kg Q3W + Pertuzumab 840 mg loading -> 420 mg Q3W",
        "dosageForm": "IV Infusion",
        "frequency": "Every 3 weeks (Q3W)",
        "timing": "Slow IV infusion over 60 to 90 minutes",
        "duration": "1 year (18 cycles) in adjuvant/neoadjuvant setting",
        "regimenType": "Targeted Anti-HER2 Monoclonal Antibodies (for HER2-Positive Carcinoma)",
        "clinicalNotes": "Significantly prolongs disease-free and overall survival in HER2+ disease. Baseline and quarterly echocardiography mandatory (monitor for reversible drop in Left Ventricular Ejection Fraction [LVEF])."
      },
      {
        "drugName": "Doxorubicin + Cyclophosphamide followed by Paclitaxel (AC-T Protocol)",
        "strength": "Doxorubicin 60 mg/m² + Cyclophosphamide 600 mg/m² Q3W x 4 cycles -> Paclitaxel 80 mg/m² weekly x 12",
        "dosageForm": "IV Infusion",
        "frequency": "AC every 21 days x 4 cycles, followed by weekly paclitaxel x 12 weeks",
        "timing": "Inpatient/Daycare Day 1 of each cycle",
        "duration": "5 to 6 months total systemic chemotherapy",
        "regimenType": "NCCN Category 1 Anthracycline-Taxane Adjuvant Regimen",
        "clinicalNotes": "Premedicate with 5-HT3 antagonist (Ondansetron), Dexamethasone, and G-CSF pegfilgrastim support. Monitor cumulative lifetime doxorubicin dose (<450-500 mg/m²) to prevent cardiomyopathy."
      },
      {
        "drugName": "Anastrozole (or Letrozole / Exemestane)",
        "strength": "1.0 mg (Letrozole 2.5 mg)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "With or without food at the same time each day",
        "duration": "5 to 10 years ongoing adjuvant endocrine therapy",
        "regimenType": "Third-Generation Aromatase Inhibitor (for Postmenopausal ER+/PR+ Breast Cancer)",
        "clinicalNotes": "Inhibits peripheral conversion of androgens to estrogens. Superior to Tamoxifen in postmenopausal women. Monitor bone mineral density with baseline and biennial DEXA scans; co-prescribe Calcium (1,200 mg) and Vitamin D3 (1,000 IU)."
      },
      {
        "drugName": "Tamoxifen Citrate",
        "strength": "20 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "With water",
        "duration": "5 to 10 years adjuvant therapy",
        "regimenType": "Selective Estrogen Receptor Modulator (SERM - for Premenopausal ER+ Disease)",
        "clinicalNotes": "Competitively antagonizes estrogen receptors in breast tissue. Monitor for hot flashes, thromboembolism (DVT/PE risk), and annual gynecological screening for endometrial hyperplasia/carcinoma."
      }
    ],
    "complications": [
      "Distant metastatic dissemination to bone, lung, liver, and central nervous system",
      "Post-axillary dissection secondary lymphedema of the ipsilateral upper extremity",
      "Chemotherapy-induced premature ovarian failure and cardiotoxicity"
    ],
    "referralTriggers": [
      "Any palpable dominant breast mass or BIRADS 4/5 imaging finding (immediate referral to Multidisciplinary Breast Tumor Board)",
      "Skin erythema/edema involving the breast without lactational mastitis (urgent surgical biopsy for inflammatory carcinoma)",
      "New-onset localized bone tenderness or neurological deficit in a breast cancer survivor"
    ]
  },
  {
    "id": "lung-cancer",
    "name": "Lung Cancer",
    "medicalName": "Non-Small Cell & Small Cell Lung Carcinoma (NSCLC / SCLC)",
    "category": "Cancer Types",
    "subCategory": "Common Cancers",
    "icdCode": "C34.9",
    "datasetSource": "NCCN Guidelines for Non-Small Cell & Small Cell Lung Cancer v2.2026, IASLC & ESMO",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Consensus Guidelines)",
    "overview": "Malignant neoplasm of bronchial epithelium primarily driven by tobacco carcinogenesis or actionable oncogenic driver mutations (EGFR, ALK, KRAS, ROS1).",
    "symptoms": {
      "hallmark": [
        "New or altered persistent refractory cough lasting >3-4 weeks (in smokers: 'change in cough')",
        "Hemoptysis (blood-streaked sputum to frank macroscopic blood)",
        "Progressive exertional breathlessness, wheezing, and dull aching pleuritic chest discomfort",
        "Profound anorexia, severe muscle wasting, and unprovoked cachexia"
      ],
      "earlySigns": [
        "Recurrent episodes of localized bronchitis or unresolving post-obstructive pneumonia",
        "Subtle hoarseness of voice from recurrent laryngeal nerve traction",
        "Vague shoulder or periscapular muscular aching"
      ],
      "redFlags": [
        "Superior Vena Cava (SVC) Syndrome: facial plethoric edema, periorbital puffiness, prominent dilated chest wall collateral veins",
        "Horner's Syndrome (from apical Pancoast tumor): unilateral ptosis, miosis, and anhidrosis",
        "Spinal Cord Compression from vertebral metastases: bilateral lower limb weakness and sensory level",
        "Syndrome of Inappropriate Antidiuretic Hormone (SIADH): profound hyponatremia with confusion (common in SCLC)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Contrast-Enhanced High-Resolution Chest CT including Adrenals",
        "type": "Diagnostic Imaging Gold Standard",
        "purpose": "Defines primary pulmonary nodule/mass size, spiculation, mediastinal lymph node short-axis diameter (>10 mm suspicious), and adrenal metastases",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Bronchoscopy with Endobronchial Ultrasound (EBUS-TBNA) or CT-Guided Transthoracic Core Biopsy",
        "type": "Biopsy Tissue Acquisition",
        "purpose": "Essential for definitive histologic diagnosis (Adenocarcinoma vs Squamous Cell vs Small Cell) and mediastinal nodal staging (stations 2, 4, 7, 10, 11)",
        "urgency": "Priority / Within 1 week"
      },
      {
        "testName": "Comprehensive Next-Generation Sequencing (NGS) Genomic Mutation Panel",
        "type": "Molecular Pathology",
        "purpose": "MANDATORY in non-squamous NSCLC: Analyzes EGFR (exon 19 del, L858R), ALK, ROS1, BRAF V600E, KRAS G12C, MET exon 14 skipping, RET, NTRK fusions",
        "urgency": "Priority / Before Systemic Therapy"
      },
      {
        "testName": "Programmed Death-Ligand 1 (PD-L1) Immunohistochemistry (22C3 pharmDx Assay)",
        "type": "Immunohistochemistry",
        "purpose": "Tumor Proportion Score (TPS): TPS >= 50% qualifies for first-line single-agent immunotherapy (Pembrolizumab)",
        "urgency": "Priority"
      },
      {
        "testName": "Whole-Body 18F-FDG PET-CT and Contrast-Enhanced Brain MRI",
        "type": "Systemic Staging Imaging",
        "purpose": "Mandatory staging: excludes occult bone/liver metastases and asymptomatic intracranial brain metastases (present in 15-20% at diagnosis)",
        "urgency": "Priority before curative resection/chemoradiotherapy"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Osimertinib Mesylate",
        "strength": "80 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "With or without food at the same time each day",
        "duration": "Adjuvant: 3 years (ADAURA protocol); Metastatic: ongoing until progression",
        "regimenType": "Third-Generation CNS-Penetrant EGFR Tyrosine Kinase Inhibitor (TKI)",
        "clinicalNotes": "FLAURA and ADAURA landmark trials: First-line targeted therapy of choice for EGFR exon 19 del or L858R mutant NSCLC. Exceptional blood-brain barrier penetration prevents and treats brain metastases. Monitor for QTc prolongation and interstitial lung disease."
      },
      {
        "drugName": "Pembrolizumab (Anti-PD-1 Monoclonal Antibody)",
        "strength": "200 mg every 3 weeks (or 400 mg every 6 weeks)",
        "dosageForm": "IV Infusion",
        "frequency": "Every 3 to 6 weeks",
        "timing": "Slow IV infusion over 30 minutes",
        "duration": "Up to 2 years (35 cycles) or until disease progression",
        "regimenType": "Immune Checkpoint Inhibitor (First-Line for PD-L1 TPS >= 50%)",
        "clinicalNotes": "KEYNOTE-024/042 trials: Monotherapy first-line standard when PD-L1 >= 50% without EGFR/ALK alterations. Produces durable multi-year survival. Monitor for immune-related adverse events (irAEs: pneumonitis, colitis, hepatitis, thyroiditis)."
      },
      {
        "drugName": "Cisplatin + Pemetrexed (or Carboplatin AUC 5-6)",
        "strength": "Cisplatin 75 mg/m² + Pemetrexed 500 mg/m²",
        "dosageForm": "IV Infusion",
        "frequency": "Every 21 days (Q3W)",
        "timing": "Day 1 of each 21-day cycle",
        "duration": "4 cycles followed by maintenance Pemetrexed",
        "regimenType": "Platinum-Doublet Chemotherapy (First-Line for Advanced Non-Squamous NSCLC)",
        "clinicalNotes": "MANDATORY PREMEDICATION: Oral Folic Acid 400-1000 mcg daily and Vitamin B12 1000 mcg IM every 9 weeks (commenced 1-2 weeks prior to pemetrexed to prevent life-threatening hematologic/GI toxicity) plus Dexamethasone 4 mg BID x 3 days."
      }
    ],
    "complications": [
      "Intracranial brain metastases with mass effect and cerebral edema",
      "Malignant pleural effusion requiring indwelling pleural catheter or talc pleurodesis",
      "Life-threatening pulmonary hemorrhage / hemoptysis and bronchial obstruction"
    ],
    "referralTriggers": [
      "Unexplained hemoptysis or pulmonary infiltrate persisting > 4 weeks on chest X-ray in smoker (immediate CT chest and Pulmonology/Thoracic Oncology referral)",
      "Clinical signs of Superior Vena Cava obstruction (urgent radiation therapy / endovascular stenting)",
      "Suspicion of spinal cord compression (emergency whole-spine MRI and neurosurgical decompression)"
    ]
  },
  {
    "id": "blood-cancer",
    "name": "Blood Cancer (Leukemia & Lymphoma)",
    "medicalName": "Hematologic Malignancies (AML, ALL, CML, CLL & Non-Hodgkin Lymphoma)",
    "category": "Cancer Types",
    "subCategory": "Common Cancers",
    "icdCode": "C91-C95",
    "datasetSource": "NCCN Guidelines in Oncology (Hematologic Malignancies) & WHO Classification of Tumors of Hematopoietic Tissues",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Clonal malignant disorders of hematopoietic stem cells and lymphoid precursors leading to bone marrow failure, blast accumulation, and reticuloendothelial infiltration.",
    "symptoms": {
      "hallmark": [
        "Severe refractory exhaustion and extreme pallor from bone marrow erythroid failure",
        "Recurrent neutropenic opportunistic infections, persistent fevers, and oral mucositis",
        "Spontaneous bleeding manifestations: petechiae, purpura, gingival bleeding, recurrent epistaxis",
        "Generalized painless, rubbery, matted lymphadenopathy and massive splenomegaly"
      ],
      "earlySigns": [
        "Subtle fatigue not relieved by sleep, mild dyspnea on ordinary exertion",
        "Unexplained low-grade pyrexia and drenching night sweats soaking bedsheets",
        "Deep generalized sternal, rib, or long bone tenderness"
      ],
      "redFlags": [
        "Hyperleukocytosis / Leukostasis: WBC > 100,000/µL with hypoxemia, confusion, blurred vision, or priapism",
        "Acute Tumor Lysis Syndrome (TLS): Hyperkalemia, hyperuricemia, hyperphosphatemia, hypocalcemia, acute anuric kidney injury",
        "Disseminated Intravascular Coagulation (DIC): Consumptive coagulopathy with widespread oozing (classic in Acute Promyelocytic Leukemia [APL])"
      ]
    },
    "requiredTests": [
      {
        "testName": "Bone Marrow Aspiration & Trephine Core Biopsy",
        "type": "Hematopathology Gold Standard",
        "purpose": "Definitive diagnosis: morphology, Wright-Giemsa cytochemical staining; blast count >= 20% in marrow or blood defines Acute Leukemia (AML/ALL)",
        "urgency": "Stat / Within 24-48h"
      },
      {
        "testName": "Multiparameter Flow Cytometric Immunophenotyping",
        "type": "Flow Cytometry Gold Standard",
        "purpose": "Distinguishes myeloid from lymphoid lineage: CD19, CD20, CD22, CD10 (B-ALL); CD3, CD5, CD7 (T-ALL); CD13, CD33, CD117, MPO (AML)",
        "urgency": "Stat / Urgent"
      },
      {
        "testName": "Conventional Karyotyping & Fluorescence In Situ Hybridization (FISH)",
        "type": "Cytogenetics",
        "purpose": "Identifies diagnostic and prognostic translocations: t(9;22) BCR-ABL1 Philadelphia chromosome, t(15;17) PML-RARA in APL, inv(16), t(8;21), del(17p)",
        "urgency": "Priority"
      },
      {
        "testName": "Comprehensive Myeloid / Lymphoid NGS Mutation Panel",
        "type": "Molecular Assay",
        "purpose": "Detects actionable mutations: FLT3-ITD/TKD, NPM1, CEBPA, IDH1, IDH2, TP53, JAK2 V617F; guides targeted inhibitor therapy",
        "urgency": "Priority"
      },
      {
        "testName": "Metabolic Tumor Lysis Panel (Uric Acid, Potassium, Phosphorus, Calcium, LDH, Creatinine)",
        "type": "Laboratory Assay",
        "purpose": "MANDATORY STAT BASELINE: Cairo-Bishop criteria for laboratory and clinical tumor lysis syndrome screening prior to chemotherapy",
        "urgency": "Stat / Immediate"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Imatinib Mesylate (or Dasatinib / Nilotinib)",
        "strength": "400 mg once daily (titrated to 600-800 mg if needed)",
        "dosageForm": "Oral Film-Coated Tablet",
        "frequency": "Once daily (OD)",
        "timing": "With a large meal and a full tall glass of water (prevents GI irritation)",
        "duration": "Lifelong ongoing molecular remission therapy",
        "regimenType": "First-Line BCR-ABL1 Tyrosine Kinase Inhibitor for Chronic Myeloid Leukemia (CML)",
        "clinicalNotes": "Revolutionized CML care: transforms fatal leukemia into manageable condition with near-normal life expectancy. Monitor quantitative RT-PCR for BCR-ABL1 transcripts every 3 months (Major Molecular Response target <= 0.1% at 12 months)."
      },
      {
        "drugName": "Cytarabine + Daunorubicin ('7+3' Standard Induction Regimen)",
        "strength": "Cytarabine 100-200 mg/m²/day continuous IV x 7 days + Daunorubicin 60-90 mg/m² IV push x 3 days",
        "dosageForm": "IV Infusion",
        "frequency": "Continuous IV infusion over 7 days (Cytarabine) + daily IV push days 1-3 (Daunorubicin)",
        "timing": "Inpatient HEPA-filtered protective isolation unit",
        "duration": "Single 7-day induction cycle (re-biopsy marrow on Day 14/21)",
        "regimenType": "Standard Gold-Standard Induction Chemotherapy for Acute Myeloid Leukemia (AML)",
        "clinicalNotes": "Requires intensive inpatient supportive care: transfusions (maintain platelets > 10,000-20,000/µL, Hb > 8.0 g/dL), prophylactic Posaconazole and Levofloxacin during profound neutropenia."
      },
      {
        "drugName": "Rasburicase (Recombinant Urate Oxidase)",
        "strength": "0.2 mg/kg IV in 50 mL 0.9% Normal Saline",
        "dosageForm": "IV Infusion",
        "frequency": "Once daily",
        "timing": "Infuse over 30 minutes strictly",
        "duration": "1 to 3 days during induction cytoreduction",
        "regimenType": "Enzymatic Uric Acid Degradation for High-Risk Tumor Lysis Syndrome",
        "clinicalNotes": "Rapidly converts insoluble uric acid into highly soluble allantoin (5-10 times more soluble). CONTRAINDICATION: G6PD deficiency (causes severe methemoglobinemia and acute hemolysis). Blood samples for uric acid must be collected in pre-chilled heparin tubes on ice."
      },
      {
        "drugName": "Allopurinol",
        "strength": "300 mg",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily (OD)",
        "timing": "After meals with aggressive oral hydration (>2-3 L/day)",
        "duration": "During cytoreductive phase",
        "regimenType": "Xanthine Oxidase Inhibitor for Low-to-Intermediate Risk TLS",
        "clinicalNotes": "Blocks synthesis of new uric acid. Prevents hyperuricemic crystal nephropathy."
      }
    ],
    "complications": [
      "Catastrophic neutropenic typhlitis or invasive fungal infection (Aspergillus / Mucorales)",
      "Fatal intracerebral or pulmonary hemorrhage from profound thrombocytopenia or DIC",
      "Acute anuric renal failure secondary to tumor lysis syndrome"
    ],
    "referralTriggers": [
      "Presence of peripheral blood blasts on routine smear (immediate emergency referral to tertiary Leukemia/BMT unit)",
      "Suspected Acute Promyelocytic Leukemia (start All-Trans Retinoic Acid [ATRA] immediately without waiting for cytogenetics to prevent fatal coagulopathy)",
      "WBC > 50,000/µL with respiratory or neurologic symptoms (urgent leukapheresis / hydroxyurea cytoreduction)"
    ]
  },
  {
    "id": "skin-cancer",
    "name": "Skin Cancer (Melanoma & Non-Melanoma)",
    "medicalName": "Cutaneous Malignant Melanoma & Keratinocyte Carcinomas (BCC / SCC)",
    "category": "Cancer Types",
    "subCategory": "Common Cancers",
    "icdCode": "C43.9 / C44.9",
    "datasetSource": "NCCN Guidelines for Cutaneous Melanoma v2.2026 & American Academy of Dermatology",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant transformation of epidermal melanocytes (melanoma) or keratinocytes (Basal Cell Carcinoma [BCC] and Squamous Cell Carcinoma [SCC]) driven by ultraviolet radiation damage.",
    "symptoms": {
      "hallmark": [
        "Melanoma ABCDE criteria: Asymmetry, Border irregularity, Color variegation (tan, black, brown, red, blue), Diameter > 6 mm, Evolving/changing size or elevation",
        "BCC: Pearly, translucent, rolled-border nodule with central depression, arborizing telangiectasias, and recurrent spontaneous crusting/bleeding",
        "SCC: Hyperkeratotic, indurated, crusted, erythematous plaque or non-healing ulcer on chronic sun-exposed head/neck surfaces",
        "'Ugly Duckling' sign: a pigmented nevus that looks distinctly different from all surrounding moles"
      ],
      "earlySigns": [
        "New localized itching, tingling, or tenderness in a pre-existing quiescent mole",
        "Subtle darkening or pigment spilling into surrounding normal skin",
        "A cutaneous sore that fails to heal after 4 to 6 weeks"
      ],
      "redFlags": [
        "Spontaneous ulceration and bleeding from a melanocytic lesion (correlates with higher Breslow depth)",
        "Presence of satellite cutaneous pigmented nodules within 2 cm of primary lesion",
        "Palpable, firm, enlarged regional lymphadenopathy (axillary, inguinal, or cervical)",
        "In-transit metastases: subcutaneous nodules between primary tumor and regional nodal basin"
      ]
    },
    "requiredTests": [
      {
        "testName": "Full-Body Digital Dermoscopy & Total Body Photography",
        "type": "Dermatologic Optical Diagnostic Gold Standard",
        "purpose": "Identifies dermatoscopic hallmarks: atypical pigment network, regression structures, blue-white veil, irregular streaks/pseudopods",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Complete Excisional Biopsy with 1 to 2 mm Margins",
        "type": "Histopathology Gold Standard",
        "purpose": "MANDATORY: Full-thickness elliptical excision preferred over shave/punch; preserves micro-architecture for precise Breslow tumor thickness (mm)",
        "urgency": "Priority / Within 1 week"
      },
      {
        "testName": "Histopathologic Staging: Breslow Depth, Ulceration, Mitotic Rate, Margins",
        "type": "Pathology Staging",
        "purpose": "Breslow depth in millimeters is single most critical T-category prognostic factor; determines indication for Sentinel Lymph Node Biopsy (SLNB)",
        "urgency": "Priority"
      },
      {
        "testName": "BRAF V600 Mutation Molecular Testing (V600E / V600K)",
        "type": "Molecular Assay",
        "purpose": "MANDATORY in Stage III and Stage IV melanoma: Identifies candidates for targeted BRAF/MEK inhibitor combination therapy",
        "urgency": "Priority"
      },
      {
        "testName": "Sentinel Lymph Node Biopsy (SLNB) with Technetium-99m & Blue Dye",
        "type": "Surgical Staging Procedure",
        "purpose": "Recommended for melanoma with Breslow thickness > 0.8 mm (or <0.8 mm with ulceration); accurate pathological regional nodal staging",
        "urgency": "Performed at time of Wide Local Excision"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Dabrafenib + Trametinib (Dual BRAF + MEK Kinase Inhibition)",
        "strength": "Dabrafenib 150 mg BID + Trametinib 2 mg OD",
        "dosageForm": "Oral Capsule (Dabrafenib) + Oral Tablet (Trametinib)",
        "frequency": "Dabrafenib: twice daily; Trametinib: once daily",
        "timing": "Strictly on an empty stomach >= 1 hour before or 2 hours after meals",
        "duration": "12 months adjuvant in Stage III; ongoing until progression in Stage IV",
        "regimenType": "Targeted MAPK Pathway Blockade for BRAF V600 Mutant Melanoma",
        "clinicalNotes": "COMBI-d / COMBI-AD trials: Dramatic rapid tumor regression and overall survival improvement. Dual blockade prevents paradoxical MAPK reactivation and cutaneous SCC. Educate patient on recognizing pyrexia syndrome (manage with drug holds and paracetamol)."
      },
      {
        "drugName": "Nivolumab + Ipilimumab (Dual PD-1 + CTLA-4 Immune Checkpoint Blockade)",
        "strength": "Nivolumab 1 mg/kg + Ipilimumab 3 mg/kg IV every 3 weeks x 4 doses -> Nivolumab 480 mg Q4W maintenance",
        "dosageForm": "IV Infusion",
        "frequency": "Every 3 weeks x 4 cycles, then every 4 weeks",
        "timing": "Slow IV infusion over 30 to 60 minutes",
        "duration": "Up to 2 years or until disease progression",
        "regimenType": "Dual Checkpoint Immunotherapy for Advanced / Metastatic Melanoma",
        "clinicalNotes": "CheckMate 067 trial: Unprecedented 50%+ 5-year overall survival in metastatic melanoma. High risk of autoimmune immune-related adverse events (irAEs: severe colitis, hypophysitis, hepatitis); requires prompt systemic corticosteroid protocol."
      },
      {
        "drugName": "Imiquimod 5% Topical Cream",
        "strength": "5% w/w cream (single-use sachet)",
        "dosageForm": "Topical Cream",
        "frequency": "5 times weekly at bedtime",
        "timing": "Apply sparingly to clean dry lesion; leave on for 8 hours then wash off with soap/water",
        "duration": "6 to 12 weeks",
        "regimenType": "Topical Toll-Like Receptor-7 (TLR-7) Immune Response Modifier",
        "clinicalNotes": "Indicated for superficial Basal Cell Carcinoma and Lentigo Maligna in non-surgical candidates or cosmetically sensitive facial zones."
      }
    ],
    "complications": [
      "Distant systemic metastatic dissemination to brain, liver, lungs, and bowel (melanoma has highest tropism for brain)",
      "Extensive local tissue destruction ('rodent ulcer' invasion into facial bone and orbit in neglected BCC)",
      "Secondary perineural invasion and cranial nerve neuropathies in cutaneous SCC"
    ],
    "referralTriggers": [
      "Any pigmented skin lesion with positive ABCDE criteria or Breslow thickness > 0.8 mm (refer immediately to Surgical Oncologist / Melanoma Specialist)",
      "Non-healing ulcer on face or lip lasting > 4 weeks",
      "Melanoma patient presenting with headache or focal neurologic symptoms (urgent contrast Brain MRI)"
    ]
  },
  {
    "id": "prostate-cancer",
    "name": "Prostate Cancer",
    "medicalName": "Prostatic Adenocarcinoma",
    "category": "Cancer Types",
    "subCategory": "Other Cancers",
    "icdCode": "C61",
    "datasetSource": "NCCN Guidelines for Prostate Cancer v1.2026 & EAU Guidelines",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant epithelial neoplasm originating from peripheral zone glandular acini of the prostate gland, strongly driven by androgen receptor signaling.",
    "symptoms": {
      "hallmark": [
        "Predominantly asymptomatic in early stages, detected through screening PSA elevation",
        "Lower Urinary Tract Symptoms (LUTS): progressive urinary hesitancy, diminished caliber and force of urinary stream, terminal dribbling",
        "Nocturia (waking >=3-4 times per night) and sensation of incomplete bladder emptying",
        "Macroscopic hematuria or hematospermia (blood in ejaculate)"
      ],
      "earlySigns": [
        "Subtle weakening of urinary flow easily misattributed to benign prostatic hyperplasia (BPH)",
        "Occasional post-void dribbling and perineal fullness",
        "Mild unprovoked rise in serial PSA"
      ],
      "redFlags": [
        "Metastatic Skeletal Bone Pain: severe, unremitting, aching pain in lumbosacral spine, pelvis, or ribs, worse at night",
        "Spinal Cord Compression: progressive bilateral lower limb paraparesis, sensory loss, and urinary/fecal incontinence",
        "Acute Urinary Retention: painful palpable overdistended bladder requiring emergency urethral catheterization",
        "Bilateral ureteral obstruction with hydronephrosis and acute post-renal azotemia"
      ]
    },
    "requiredTests": [
      {
        "testName": "Serum Total Prostate-Specific Antigen (Total PSA) & Free-to-Total PSA Ratio",
        "type": "Biomarker Immunoassay Gold Standard",
        "purpose": "Reference range age-adjusted; PSA > 4.0 ng/mL warrants clinical evaluation; Free/Total ratio < 15% increases suspicion of cancer over BPH",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Multiparametric Prostate MRI (mpMRI via PI-RADS v2.1 Criteria)",
        "type": "Diagnostic Imaging Gold Standard",
        "purpose": "PI-RADS 1-5 scoring: T2-weighted, Diffusion-Weighted Imaging (DWI/ADC), Dynamic Contrast Enhancement (DCE); identifies index suspicious lesions before biopsy",
        "urgency": "Priority / Pre-Biopsy"
      },
      {
        "testName": "MRI-Transrectal Ultrasound (TRUS) Fusion Targeted Core Needle Biopsy",
        "type": "Histopathology Gold Standard",
        "purpose": "Combines mpMRI lesion targeting with 12-core systematic template; assigns ISUP Gleason Grade Group 1 (3+3) to Group 5 (4+5, 5+4, 5+5)",
        "urgency": "Priority"
      },
      {
        "testName": "68Ga-PSMA-11 PET-CT Whole-Body Molecular Imaging",
        "type": "Targeted Radiotracer Imaging",
        "purpose": "Highest sensitivity and specificity for nodal and distant osteoblastic metastases in intermediate-to-high risk or biochemical recurrence",
        "urgency": "Priority / Staging"
      },
      {
        "testName": "Serum Alkaline Phosphatase & Serum Calcium",
        "type": "Laboratory Assay",
        "purpose": "Significantly elevated in widespread osteoblastic skeletal metastatic disease",
        "urgency": "Routine"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Leuprolide Acetate (or Goserelin Acetate Depot)",
        "strength": "22.5 mg (3-month depot) or 45 mg (6-month depot)",
        "dosageForm": "Intramuscular / Subcutaneous Depot Injection",
        "frequency": "Every 3 to 6 months",
        "timing": "Administered by healthcare provider",
        "duration": "Adjuvant with radiation: 2-3 years; Metastatic: lifelong ongoing",
        "regimenType": "LHRH / GnRH Agonist for Androgen Deprivation Therapy (ADT)",
        "clinicalNotes": "Suppresses pituitary LH release, downregulating testicular testosterone production to castrate levels (<50 ng/dL). MANDATORY: Co-administer oral Bicalutamide for 2-4 weeks prior to initial depot to prevent symptomatic clinical tumor flare caused by initial LH surge."
      },
      {
        "drugName": "Enzalutamide (or Apalutamide / Darolutamide)",
        "strength": "160 mg",
        "dosageForm": "Oral Capsule / Tablet",
        "frequency": "Once daily (OD)",
        "timing": "With or without food at the same time each day",
        "duration": "Ongoing until disease progression",
        "regimenType": "Second-Generation Androgen Receptor Signaling Inhibitor (ARSI)",
        "clinicalNotes": "ARCHES / PROSPER / PREVAIL trials: Competitively inhibits androgen binding, nuclear translocation, and DNA association. Markedly improves overall survival in metastatic hormone-sensitive (mHSPC) and castration-resistant (CRPC) disease. Monitor for fatigue, hypertension, and rare seizure risk."
      },
      {
        "drugName": "Tamsulosin Hydrochloride",
        "strength": "0.4 mg",
        "dosageForm": "Modified-Release Oral Capsule",
        "frequency": "Once daily (OD)",
        "timing": "30 minutes after the same meal each day",
        "duration": "Ongoing as needed for voiding symptoms",
        "regimenType": "Uroselective Alpha-1A Adrenergic Antagonist",
        "clinicalNotes": "Relaxes smooth muscle tone in prostate stroma and bladder neck; improves peak urinary flow rate and relieves obstructive voiding symptoms."
      },
      {
        "drugName": "Zoledronic Acid (or Denosumab)",
        "strength": "4.0 mg in 100 mL Normal Saline (Denosumab 120 mg SC)",
        "dosageForm": "IV Infusion",
        "frequency": "Every 4 weeks",
        "timing": "Slow IV infusion over >= 15 minutes",
        "duration": "Ongoing in metastatic bone disease",
        "regimenType": "Bone-Targeted Antiresorptive Agent",
        "clinicalNotes": "Significantly delays Skeletal-Related Events (pathological fractures, spinal cord compression, need for radiation). Ensure baseline dental clearance to prevent osteonecrosis of the jaw (ONJ); co-prescribe Calcium + Vitamin D."
      }
    ],
    "complications": [
      "Extensive osteoblastic skeletal metastases with intractable bone pain and pathological fractures",
      "Malignant spinal cord compression with irreversible lower body paralysis",
      "Complete urinary outlet obstruction and bilateral hydronephrosis with renal failure"
    ],
    "referralTriggers": [
      "Confirmed Gleason score >= 7 (4+3) or PSA > 20 ng/mL (refer to Uro-Oncology multidisciplinary team for radical prostatectomy vs definitive EBRT+ADT)",
      "Acute back pain with new lower limb weakness in a prostate cancer patient (EMERGENCY whole-spine MRI for impending cord compression)",
      "Rising PSA post-radical prostatectomy (>0.2 ng/mL) or post-radiotherapy (nadir + 2 ng/mL - biochemical recurrence)"
    ]
  },
  {
    "id": "cervical-cancer",
    "name": "Cervical Cancer",
    "medicalName": "Cervical Carcinoma (Squamous Cell & Adenocarcinoma)",
    "category": "Cancer Types",
    "subCategory": "Other Cancers",
    "icdCode": "C53.9",
    "datasetSource": "NCCN Guidelines for Cervical Cancer v1.2026, WHO Cervical Cancer Elimination Initiative & FIGO",
    "evidenceLevel": "Category 1 / Level 1A (NCCN / FIGO Consensus)",
    "overview": "Malignant epithelial neoplasm of uterine cervix etiologically driven by persistent high-risk Human Papillomavirus (hrHPV types 16, 18, 31, 33, 45, 52, 58) infection.",
    "symptoms": {
      "hallmark": [
        "Postcoital vaginal contact bleeding (bright red spotting immediately following intercourse)",
        "Irregular intermenstrual or postmenopausal vaginal hemorrhage",
        "Persistent watery, serosanguinous, or purulent foul-smelling vaginal discharge",
        "Deep pelvic dull aching pain and lower back discomfort"
      ],
      "earlySigns": [
        "Completely asymptomatic in premalignant stages (CIN I-III / HSIL), detected via Pap/HPV screening",
        "Mild unprovoked vaginal moisture",
        "Cervical contact bleeding during routine speculum examination"
      ],
      "redFlags": [
        "Severe unilateral lower extremity lymphedema from pelvic lymphatic occlusion",
        "Flank pain and costovertebral tenderness from parametrial ureteral encasement (hydronephrosis)",
        "Vesicovaginal or rectovaginal fistula formation (leakage of urine or feces via vagina)",
        "Sciatic nerve root pain radiating down posterior leg from sacral plexus tumor invasion"
      ]
    },
    "requiredTests": [
      {
        "testName": "High-Risk HPV DNA Testing & Liquid-Based Cytology (LBC / Pap Smear)",
        "type": "Primary Screening Gold Standard",
        "purpose": "WHO recommended primary screening modality: detects E6/E7 oncogene expression of hrHPV genotypes",
        "urgency": "Routine / Diagnostic"
      },
      {
        "testName": "Colposcopy with Acetic Acid & Lugol's Iodine Directed Biopsy + ECC",
        "type": "Histopathology Gold Standard",
        "purpose": "Magnified colposcopic visualization of abnormal transformation zone (acetowhite epithelium, punctation, mosaicism) and punch biopsy plus endocervical curettage",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Pelvic High-Resolution Contrast MRI",
        "type": "Diagnostic Staging Imaging Gold Standard",
        "purpose": "Optimal imaging modality to accurately measure cervical tumor diameter, depth of stromal invasion, vaginal extension, and parametrial invasion (FIGO stage IIB)",
        "urgency": "Priority / Pre-treatment"
      },
      {
        "testName": "Whole-Body 18F-FDG PET-CT Staging Scan",
        "type": "Nuclear Molecular Staging",
        "purpose": "Essential to evaluate pelvic and para-aortic retroperitoneal lymph node metastases and distant visceral dissemination",
        "urgency": "Priority"
      },
      {
        "testName": "Renal Function Panel (Serum Creatinine, BUN) & Renal Ultrasound",
        "type": "Laboratory & Imaging Assay",
        "purpose": "MANDATORY: Screens for bilateral or unilateral obstructive uropathy / hydronephrosis (which automatically upstages to FIGO Stage IIIC2/IVA)",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Cisplatin (Concurrent Chemoradiotherapy - CCRT)",
        "strength": "40 mg/m² (maximum capped at 70 mg per dose)",
        "dosageForm": "IV Infusion with Aggressive Hydration",
        "frequency": "Once weekly during external beam pelvic radiotherapy",
        "timing": "Infuse over 60 mins following 1,000 mL Normal Saline + Mannitol prehydration",
        "duration": "5 to 6 weekly cycles concomitant with EBRT",
        "regimenType": "Radiosensitizing Chemotherapy (NCCN Standard for Locally Advanced Stage IB3-IVA)",
        "clinicalNotes": "Inhibits sublethal radiation damage repair in cervical tumor cells; significantly improves overall survival. Monitor serum creatinine and electrolytes weekly (hold if eGFR < 50 mL/min); aggressive antiemetic pre-medication."
      },
      {
        "drugName": "Paclitaxel + Carboplatin + Bevacizumab (for Recurrent / Metastatic Disease)",
        "strength": "Paclitaxel 175 mg/m² + Carboplatin AUC 5 + Bevacizumab 15 mg/kg",
        "dosageForm": "IV Infusion",
        "frequency": "Every 21 days (Q3W)",
        "timing": "Day 1 of each 21-day cycle",
        "duration": "6 cycles followed by maintenance Bevacizumab",
        "regimenType": "First-Line Chemotherapy + Anti-VEGF Protocol (GOG 240 Trial)",
        "clinicalNotes": "First systemic regimen to cross the 12-month median overall survival threshold in metastatic cervical cancer. Premedicate with dexamethasone, diphenhydramine, and ranitidine; monitor blood pressure and urinalysis for proteinuria."
      },
      {
        "drugName": "Tranexamic Acid",
        "strength": "500 mg to 1,000 mg",
        "dosageForm": "Oral Tablet / Slow IV Injection",
        "frequency": "Three times daily (TID) as needed",
        "timing": "After meals or slow IV push over 10 minutes",
        "duration": "3 to 5 days during bleeding episodes",
        "regimenType": "Antifibrinolytic Hemostatic Agent",
        "clinicalNotes": "Rapidly controls acute excessive tumor-related vaginal oozing; does not increase systemic thromboembolism risk when used short-term."
      }
    ],
    "complications": [
      "Severe bilateral obstructive uropathy and uremic renal failure requiring emergent percutaneous nephrostomy (PCN)",
      "Catastrophic acute torrential vaginal hemorrhage from tumor erosion into uterine arteries",
      "Radiation-induced chronic proctitis, radiation cystitis, and rectovaginal fistula"
    ],
    "referralTriggers": [
      "Confirmed cervical biopsy showing invasive carcinoma or CIN III (immediate referral to Gynecologic Oncology multidisciplinary team)",
      "Gross hematuria, fecaluria, or watery leakage from vagina (urgent examination under anesthesia [EUA] for fistulae)",
      "Elevated serum creatinine with hydronephrosis in known cervical cancer"
    ]
  },
  {
    "id": "stomach-cancer",
    "name": "Stomach Cancer (Gastric Cancer)",
    "medicalName": "Gastric Adenocarcinoma & Gastroesophageal Junction (GEJ) Tumors",
    "category": "Cancer Types",
    "subCategory": "Digestive Cancers",
    "icdCode": "C16.9",
    "datasetSource": "NCCN Clinical Practice Guidelines in Oncology (Gastric Cancer) v2.2026 & ESMO",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant epithelial adenocarcinoma arising from gastric mucosa, categorized into intestinal and diffuse types (Lauren classification) with high propensity for lymphatic and peritoneal metastasis.",
    "symptoms": {
      "hallmark": [
        "Persistent non-ulcer dyspepsia, epigastric discomfort, and early satiety (feeling full after eating small amounts)",
        "Unintentional, progressive, and profound weight loss with severe anorexia",
        "Postprandial vomiting of partially digested food (distal pyloric antral obstruction)",
        "Constant gnawing epigastric pain unaffected by food or standard antacid therapy"
      ],
      "earlySigns": [
        "Vague upper abdominal bloating and postprandial heaviness",
        "Mild fatigue secondary to occult microcytic iron deficiency anemia",
        "Subtle nausea and aversion to meat products"
      ],
      "redFlags": [
        "Upper Gastrointestinal Bleeding: hematemesis ('coffee-ground') or dark tarry melena",
        "Virchow's Node: hard, painless, palpable left supraclavicular lymph node",
        "Sister Mary Joseph Nodule: metastatic cutaneous periumbilical nodule",
        "Krukenberg Tumor: palpable bilateral adnexal ovarian masses in premenopausal women",
        "Malignant Peritoneal Carcinomatosis: shifting abdominal dullness and tense ascites"
      ]
    },
    "requiredTests": [
      {
        "testName": "Upper Gastrointestinal Endoscopy (EGD) with Multiple Mucosal Biopsies",
        "type": "Endoscopy & Histopathology Gold Standard",
        "purpose": "Direct visualization: MANDATORY >= 6 to 8 biopsies from ulcer margin and base to achieve >98% diagnostic accuracy and histological typing",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Contrast-Enhanced CT of Chest, Abdomen, and Pelvis",
        "type": "Staging Imaging Gold Standard",
        "purpose": "Evaluates gastric wall thickness, perigastric lymphadenopathy, hepatic metastases, and peritoneal carcinomatosis",
        "urgency": "Priority"
      },
      {
        "testName": "Diagnostic Staging Laparoscopy with Peritoneal Washings Cytology",
        "type": "Minimally Invasive Surgical Staging",
        "purpose": "MANDATORY in cT1b or higher resectable disease: detects radiographically occult peritoneal micrometastases in 20-30% of cases, avoiding futile non-curative laparotomy",
        "urgency": "Priority / Pre-Surgical"
      },
      {
        "testName": "HER2/neu Immunohistochemistry (IHC) & In Situ Hybridization (FISH)",
        "type": "Biomarker Assay",
        "purpose": "MANDATORY in advanced/metastatic disease: IHC 3+ or IHC 2+/FISH positive qualifies for targeted anti-HER2 therapy (Trastuzumab)",
        "urgency": "Priority"
      },
      {
        "testName": "Mismatch Repair / Microsatellite Instability (MMR/MSI) & PD-L1 CPS",
        "type": "Molecular Assay",
        "purpose": "Combined Positive Score (CPS >= 5): guides addition of Nivolumab or Pembrolizumab immunotherapy to first-line chemotherapy",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "FLOT Chemotherapy Regimen (Perioperative Protocol)",
        "strength": "Docetaxel 50 mg/m² + Oxaliplatin 85 mg/m² + Leucovorin 200 mg/m² + 5-Fluorouracil 2,600 mg/m² continuous IV over 24 hours",
        "dosageForm": "IV Infusion",
        "frequency": "Every 14 days (Q2W)",
        "timing": "Days 1-2 of each 14-day cycle",
        "duration": "4 cycles preoperative followed by 4 cycles postoperative (total 8 cycles)",
        "regimenType": "NCCN Category 1 Perioperative Standard for Resectable Gastric / GEJ Adenocarcinoma",
        "clinicalNotes": "FLOT4 trial: Substantially superior pathological complete response and 5-year overall survival (45% vs 36%) compared to older ECF/ECX regimens. Requires prophylactic G-CSF (pegfilgrastim) and intensive antiemetic prophylaxis."
      },
      {
        "drugName": "Trastuzumab (for HER2-Positive Advanced Gastric Cancer)",
        "strength": "8 mg/kg IV loading dose -> 6 mg/kg maintenance IV every 3 weeks",
        "dosageForm": "IV Infusion",
        "frequency": "Every 3 weeks (Q3W)",
        "timing": "Infuse over 60 to 90 minutes concurrent with chemotherapy",
        "duration": "Ongoing until disease progression",
        "regimenType": "Anti-HER2 Targeted Monoclonal Antibody (ToGA Protocol)",
        "clinicalNotes": "Significantly prolongs overall survival in HER2-overexpressing gastric adenocarcinoma. Baseline and every 3-month echocardiographic LVEF monitoring mandatory."
      },
      {
        "drugName": "Pantoprazole Sodium",
        "strength": "40 mg",
        "dosageForm": "Oral Tablet / Slow IV Injection",
        "frequency": "Twice daily (BID)",
        "timing": "30 to 60 minutes before breakfast and dinner",
        "duration": "Ongoing supportive therapy",
        "regimenType": "Proton Pump Inhibitor for Acid Suppression & Mucosal Protection",
        "clinicalNotes": "Controls tumor-associated acid erosion, mitigates mucosal capillary oozing, and enhances patient tolerance of oral intake."
      }
    ],
    "complications": [
      "Severe gastric outlet obstruction requiring endoscopic self-expanding metal stent (SEMS) placement or gastrojejunostomy",
      "Massive upper gastrointestinal hemorrhage from ulcerating tumor bed",
      "Rapid malignant cachexia and nutritional exhaustion from profound anorexia and malabsorption"
    ],
    "referralTriggers": [
      "New-onset dyspepsia in any patient age > 55 years or with ANY red flag symptom (immediate fast-track upper GI endoscopy within 2 weeks)",
      "Biopsy-proven gastric adenocarcinoma (referral to Upper GI Surgical Oncology Multidisciplinary Tumor Board)",
      "Sudden acute peritonitis from gastric tumor perforation (emergency surgical intervention)"
    ]
  },
  {
    "id": "liver-cancer",
    "name": "Liver Cancer (Hepatocellular Carcinoma)",
    "medicalName": "Hepatocellular Carcinoma (HCC) & Cholangiocarcinoma",
    "category": "Cancer Types",
    "subCategory": "Digestive Cancers",
    "icdCode": "C22.0",
    "datasetSource": "AASLD Guidelines for Treatment of Hepatocellular Carcinoma, EASL & NCCN",
    "evidenceLevel": "Category 1 / Level 1A (AASLD Consensus Guidelines)",
    "overview": "Primary malignant neoplasm of hepatocytes developing almost exclusively in the setting of chronic cirrhosis (secondary to Hepatitis B/C, alcohol, or MASH).",
    "symptoms": {
      "hallmark": [
        "Right upper quadrant dull gnawing pain and hepatic capsular stretch discomfort",
        "Abrupt clinical decompensation in a previously stable cirrhotic patient (new ascites, jaundice, or encephalopathy)",
        "Palpable firm, irregular, nodular hepatomegaly with audible arterial systolic bruit over the liver",
        "Profound anorexia, severe cachexia, and rapid unprovoked wasting"
      ],
      "earlySigns": [
        "Unexplained worsening of baseline fatigue and physical stamina",
        "Mild unprovoked rise in serum alkaline phosphatase or bilirubin",
        "Sudden destabilization of previously well-controlled diabetes mellitus"
      ],
      "redFlags": [
        "Spontaneous Tumor Rupture: sudden agonizing abdominal pain, peritoneal signs, and hypovolemic hemorrhagic shock (intraperitoneal bleeding)",
        "Malignant Portal Vein Tumor Thrombosis (PVTT): rapid development of intractable refractory ascites and massive splenomegaly",
        "Severe obstructive jaundice from biliary tumor thrombus migration into common bile duct"
      ]
    },
    "requiredTests": [
      {
        "testName": "Dynamic Multiphase Contrast-Enhanced Liver MRI or Multidetector CT",
        "type": "Diagnostic Imaging Gold Standard (LI-RADS Criteria)",
        "purpose": "AASLD Non-Invasive Diagnostic Criteria: Hallmark arterial phase hyperenhancement ('wash-in') followed by venous/delayed phase hypointensity ('washout') in cirrhosis is 100% specific; biopsy not required",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Serum Alpha-Fetoprotein (AFP) & PIVKA-II (DCP)",
        "type": "Serological Tumor Biomarkers",
        "purpose": "Serum AFP > 400 ng/mL in high-risk cirrhotic highly predictive of HCC; serial AFP tracks therapeutic response and recurrence",
        "urgency": "Priority"
      },
      {
        "testName": "Child-Pugh Score & ALBI Grade (Albumin-Bilirubin Functional Reserve)",
        "type": "Hepatic Functional Reserve Staging",
        "purpose": "MANDATORY: Classifies Child-Pugh A (5-6 points), B (7-9 points), C (10-15 points); determines eligibility for resection, ablation, TACE, or systemic therapy",
        "urgency": "Priority"
      },
      {
        "testName": "Upper GI Endoscopy (EGD) for Variceal Screening",
        "type": "Endoscopic Screening",
        "purpose": "MANDATORY prior to initiating anti-VEGF therapy (Bevacizumab): screen and prophylactically band high-risk esophageal varices to prevent fatal hemorrhage",
        "urgency": "Priority / Pre-treatment"
      },
      {
        "testName": "Chest CT & 99mTc Bone Scintigraphy",
        "type": "Staging Imaging",
        "purpose": "Mandatory to exclude extrahepatic pulmonary (most common) and skeletal metastases prior to surgical resection or liver transplantation",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Atezolizumab + Bevacizumab (IMbrave150 Protocol)",
        "strength": "Atezolizumab 1,200 mg IV + Bevacizumab 15 mg/kg IV",
        "dosageForm": "IV Infusion",
        "frequency": "Every 3 weeks (Q3W)",
        "timing": "Slow IV infusion over 60 minutes",
        "duration": "Ongoing until disease progression or unacceptable toxicity",
        "regimenType": "NCCN & AASLD Preferred First-Line Systemic Therapy for Unresectable HCC",
        "clinicalNotes": "Combines PD-L1 immune checkpoint inhibition with VEGF anti-angiogenic blockade. Significantly superior overall and progression-free survival compared to sorafenib. Contraindicated in untreated high-risk esophageal varices (bleeding risk) or severe autoimmune disease."
      },
      {
        "drugName": "Lenvatinib Mesylate",
        "strength": "8 mg once daily (for body weight < 60 kg) or 12 mg once daily (for body weight >= 60 kg)",
        "dosageForm": "Oral Capsule",
        "frequency": "Once daily (OD)",
        "timing": "With or without food at the same time each day",
        "duration": "Ongoing until disease progression",
        "regimenType": "First-Line Multi-Receptor Tyrosine Kinase Inhibitor (VEGFR 1-3, FGFR 1-4, PDGFR, RET)",
        "clinicalNotes": "REFLECT trial: Non-inferior overall survival with superior objective response rate (24% vs 9%) over sorafenib. High efficacy in viral and non-viral HCC. Monitor daily blood pressure (manage hypertension aggressively) and check urine dipstick for proteinuria."
      },
      {
        "drugName": "Sorafenib Tosylate",
        "strength": "400 mg (two 200 mg tablets)",
        "dosageForm": "Oral Tablet",
        "frequency": "Twice daily (BID)",
        "timing": "On an empty stomach >= 1 hour before or 2 hours after meals",
        "duration": "Ongoing until progression",
        "regimenType": "Established First-Line Oral Multikinase Inhibitor Alternative",
        "clinicalNotes": "SHARP landmark trial: First systemic agent to demonstrate survival benefit in advanced HCC. Counsel patient on Hand-Foot Skin Reaction (manage with urea creams and dose titration)."
      }
    ],
    "complications": [
      "Spontaneous acute intraperitoneal hemoperitoneum from tumor rupture with 30-50% acute mortality",
      "Accelerated liver failure and hepatic encephalopathy from extensive parenchymal replacement",
      "Portal hypertension crisis with massive exsanguinating variceal bleeding"
    ],
    "referralTriggers": [
      "New solitary liver lesion in a cirrhotic patient meeting Milan criteria (single nodule <=5 cm, or up to 3 nodules each <=3 cm) -> URGENT referral for Liver Transplantation",
      "Suspected HCC meeting surgical resection criteria (Child-Pugh A, normal bilirubin, no portal hypertension)",
      "Sudden acute severe abdominal pain with falling hemoglobin in known HCC patient (emergency hepatic transcatheter arterial embolization [TAE])"
    ]
  },
  {
    "id": "brain-cancer",
    "name": "Brain Cancer (Glioblastoma & High-Grade Glioma)",
    "medicalName": "Glioblastoma Multiforme (GBM) & Astrocytoma (WHO Grade 3-4)",
    "category": "Cancer Types",
    "subCategory": "Other Cancers",
    "icdCode": "C71.9",
    "datasetSource": "NCCN Clinical Practice Guidelines in Oncology (CNS Cancers) v1.2026 & EANO Guidelines",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Highly aggressive, infiltrative malignant neuroepithelial neoplasm of astrocytic lineage characterized by nuclear atypia, microvascular proliferation, and pseudopalisading necrosis.",
    "symptoms": {
      "hallmark": [
        "Progressive throbbing headache (worse in the morning, awakened from sleep, aggravated by coughing, bending, or Valsalva maneuvers)",
        "New adult-onset focal or generalized seizures in a patient without prior epilepsy history",
        "Progressive unilateral hemiparesis, focal motor weakness, or sensory loss",
        "Subacute personality alterations, executive dysfunction, emotional apathy, and cognitive slowing"
      ],
      "earlySigns": [
        "Subtle word-finding difficulties (anomic dysphasia) or comprehension deficits",
        "Mild unsteadiness, ataxia, or clumsy hand coordination",
        "Transient visual field cuts (homonymous hemianopia)"
      ],
      "redFlags": [
        "Triad of Acute Raised Intracranial Pressure (ICP): Bilateral papilledema, projectile vomiting without preceding nausea, severe somnolence",
        "Cushing's Triad (Impending Transtentorial Herniation): Bradycardia, irregular respiratory pattern, widening pulse pressure / hypertension",
        "Status Epilepticus: Continuous refractory seizures > 5 minutes without recovery of consciousness"
      ]
    },
    "requiredTests": [
      {
        "testName": "Multi-Sequence Contrast-Enhanced Brain MRI (T1, T2, FLAIR, T1+Gadolinium, DWI)",
        "type": "Neuroimaging Gold Standard",
        "purpose": "Hallmark appearance: Thick, irregular, nodular ring-enhancing mass with central hypointense necrosis and extensive surrounding FLAIR hyperintense vasogenic edema",
        "urgency": "Stat / Immediate"
      },
      {
        "testName": "Magnetic Resonance Spectroscopy (MRS) & Perfusion MRI (PWI)",
        "type": "Advanced Neuroimaging",
        "purpose": "Spectroscopy shows elevated Choline peak (membrane turnover), depressed N-acetylaspartate (NAA; neuronal loss), and prominent Lipid/Lactate necrosis peak; PWI shows high rCBV",
        "urgency": "Priority / Pre-Surgical"
      },
      {
        "testName": "Stereotactic Biopsy or Maximal Safe Surgical Resection Histopathology",
        "type": "Neuropathology Gold Standard",
        "purpose": "WHO 2021 CNS Classification: pleomorphic fibrillary astrocytes, robust microvascular endothelial glomeruloid proliferation, and pathognomonic pseudopalisading necrosis",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Molecular Biomarker Panel: IDH1/2 Mutation, MGMT Promoter Methylation, 1p/19q",
        "type": "Molecular Neuro-Oncology",
        "purpose": "CRITICAL: MGMT promoter methylation predicts dramatic sensitivity to Temozolomide; IDH-wildtype confirms Glioblastoma; rules out 1p/19q codeleted oligodendroglioma",
        "urgency": "Priority"
      },
      {
        "testName": "Functional MRI (fMRI) & Diffusion Tensor Imaging (DTI) Tractography",
        "type": "Presurgical Neurosurgical Mapping",
        "purpose": "Maps corticospinal motor tracts and Broca/Wernicke language areas to maximize safe extent of resection while preserving functional neurological eloquence",
        "urgency": "Priority / Pre-Operative"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Temozolomide (TMZ - Stupp Protocol)",
        "strength": "Concomitant: 75 mg/m²/day daily x 42 days during radiotherapy -> Maintenance: 150-200 mg/m²/day for 5 days every 28 days x 6 cycles",
        "dosageForm": "Oral Capsule",
        "frequency": "Daily during RT; Days 1 to 5 of every 28-day cycle during maintenance",
        "timing": "Once daily at bedtime strictly on an empty stomach with a full glass of water",
        "duration": "6 weeks concurrent chemoradiotherapy followed by 6 cycles maintenance",
        "regimenType": "Alkylating Chemotherapy Standard of Care (Stupp Landmark Regimen)",
        "clinicalNotes": "Crosses blood-brain barrier with 100% oral bioavailability; methylation of O6-guanine causes DNA double-strand breaks. Dramatic survival benefit in MGMT-methylated tumors. Premedicate with Ondansetron 8 mg 30-60 mins prior to each dose."
      },
      {
        "drugName": "Dexamethasone Sodium Phosphate",
        "strength": "4 to 16 mg daily in divided doses (e.g. 4 mg BID or QID, tapered rapidly to lowest effective dose)",
        "dosageForm": "Oral Tablet / IV Injection",
        "frequency": "Two to four times daily",
        "timing": "Morning and early afternoon with meals",
        "duration": "Shortest duration necessary to control peritumoral edema",
        "regimenType": "High-Potency Glucocorticoid for Vasogenic Cerebral Edema",
        "clinicalNotes": "Rapidly repairs breached blood-brain barrier tight junctions; alleviates headache and focal deficits within 24-48 hours. Co-prescribe PPI (Pantoprazole); monitor blood glucose daily."
      },
      {
        "drugName": "Levetiracetam",
        "strength": "500 to 1,000 mg",
        "dosageForm": "Oral Film-Coated Tablet / IV Infusion",
        "frequency": "Twice daily (BID)",
        "timing": "With or without food",
        "duration": "Ongoing maintenance",
        "regimenType": "First-Line Antiepileptic Agent for Brain Tumor-Related Epilepsy (BTRE)",
        "clinicalNotes": "Binds SV2A synaptic vesicle protein. First choice in neuro-oncology: zero hepatic cytochrome P450 enzyme induction (unlike phenytoin/carbamazepine), eliminating drug interactions with chemotherapy and steroids."
      },
      {
        "drugName": "Trimethoprim-Sulfamethoxazole (TMP-SMX)",
        "strength": "1 Double-Strength Tablet (160 mg TMP / 800 mg SMX)",
        "dosageForm": "Oral Tablet",
        "frequency": "Three times weekly (e.g. Mon-Wed-Fri)",
        "timing": "After meals with water",
        "duration": "Throughout concurrent Temozolomide + Radiotherapy",
        "regimenType": "Pneumocystis jirovecii Pneumonia (PJP) Chemoprophylaxis",
        "clinicalNotes": "MANDATORY during concurrent chemoradiotherapy and steroid use due to profound lymphopenia (CD4 count < 200/µL)."
      }
    ],
    "complications": [
      "Fatal cerebral tentorial or tonsillar herniation from uncontrollable malignant brain edema",
      "Intratumoral apoplexy / acute intracranial hemorrhage into glioblastoma bed",
      "Profound cognitive deterioration and loss of functional independence"
    ],
    "referralTriggers": [
      "New-onset adult seizure or progressive focal neurological deficit with ring-enhancing mass (immediate emergency transfer to Neurosurgery / Neuro-Oncology)",
      "Signs of impending brain herniation (immediate IV Mannitol 20% 1 g/kg, IV Dexamethasone 16 mg, and urgent surgical decompression)",
      "Suspected tumor recurrence vs radiation necrosis (refer for Advanced PET/Perfusion MRI and Re-resection / Tumor Treating Fields [Optune])"
    ]
  },
  {
    "id": "colon-cancer",
    "name": "Colon & Colorectal Cancer",
    "medicalName": "Colorectal Adenocarcinoma",
    "category": "Cancer Types",
    "subCategory": "Digestive Cancers",
    "icdCode": "C18.9 / C20",
    "datasetSource": "NCCN Guidelines for Colon & Rectal Cancer v1.2026, ESMO & ASCO",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant epithelial adenocarcinoma arising from the colonic or rectal mucosa via adenoma-carcinoma sequence or serrated polyp pathway.",
    "symptoms": {
      "hallmark": [
        "Persistent alteration in bowel habits lasting >4-6 weeks (alternating diarrhea and constipation, narrowing of stool caliber to 'pencil-thin')",
        "Hematochezia (fresh bright red rectal bleeding) or dark mahogany stools mixed with mucus",
        "Tenesmus (distressing, painful, persistent feeling of incomplete rectal evacuation - typical of rectal cancer)",
        "Unexplained, involuntary, progressive weight loss and crampy colicky lower abdominal pain"
      ],
      "earlySigns": [
        "Unexplained microcytic iron deficiency anemia (classic presentation of right-sided cecal/ascending colon tumors)",
        "Subtle abdominal distension and postprandial gas discomfort",
        "Occult blood detected on screening stool tests (FIT/FOBT)"
      ],
      "redFlags": [
        "Acute Complete Large Bowel Mechanical Obstruction: Obstipation, profound abdominal distension, feculent vomiting",
        "Acute Bowel Perforation: Rigid silent abdomen, intense guarding, free air under diaphragm on erect radiography",
        "Palpable, firm, irregular right lower quadrant or rectal mass on digital rectal examination (DRE)",
        "Massive hematochezia producing hemodynamic hypotension"
      ]
    },
    "requiredTests": [
      {
        "testName": "Complete Optical Diagnostic Colonoscopy with Multiple Biopsies",
        "type": "Endoscopy & Histopathology Gold Standard",
        "purpose": "Direct mucosal visualization of entire colon to cecum: identifies primary adenocarcinoma and synchronous neoplasms (present in 3-5%); multiple biopsies provide tissue architecture",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Serum Carcinoembryonic Antigen (CEA)",
        "type": "Serum Glycoprotein Tumor Biomarker",
        "purpose": "Baseline prognostic benchmark and post-treatment surveillance marker: elevated baseline CEA (>5 ng/mL) correlates with nodal/metastatic disease; essential for monitoring recurrence",
        "urgency": "Priority / Pre-Operative"
      },
      {
        "testName": "Contrast-Enhanced CT of Chest, Abdomen, and Pelvis",
        "type": "Tri-Compartment Staging Imaging Gold Standard",
        "purpose": "Accurately stages primary colonic wall invasion depth (T), regional mesenteric nodal involvement (N), and distant hepatic (most common) and pulmonary (M) metastases",
        "urgency": "Priority"
      },
      {
        "testName": "High-Resolution Thin-Slice Pelvic MRI",
        "type": "Diagnostic Imaging (Mandatory for Rectal Cancer)",
        "purpose": "Precisely evaluates relationship of rectal tumor to Circumferential Resection Margin (CRM), depth of extramural vascular invasion (EMVI), and mesorectal fascia",
        "urgency": "Priority / Rectal Staging"
      },
      {
        "testName": "Comprehensive Biomarker Panel: MMR/MSI, KRAS, NRAS, BRAF V600E, HER2",
        "type": "Molecular Pathology",
        "purpose": "MANDATORY in metastatic disease: Mismatch Repair (dMMR/MSI-H) predicts curative response to Pembrolizumab; RAS/BRAF wild-type required for anti-EGFR therapy (Cetuximab)",
        "urgency": "Priority / Before Systemic Therapy"
      }
    ],
    "prescriptions": [
      {
        "drugName": "mFOLFOX6 Adjuvant Chemotherapy Protocol",
        "strength": "Oxaliplatin 85 mg/m² IV + Leucovorin 400 mg/m² IV + 5-Fluorouracil 400 mg/m² IV bolus followed by 5-FU 2,400 mg/m² continuous IV over 46 hours",
        "dosageForm": "IV Infusion via Ambulatory Infusion Pump",
        "frequency": "Every 14 days (Q2W)",
        "timing": "Days 1 to 3 of each 14-day cycle",
        "duration": "6 months (12 cycles) or 3 months (CAPOX) for low-risk Stage III colon cancer (IDEA Trial)",
        "regimenType": "NCCN Category 1 Standard Adjuvant Chemotherapy for Stage III & High-Risk Stage II",
        "clinicalNotes": "MOSAIC trial: Substantially improves disease-free and overall survival. CRITICAL COUNSELING: Oxaliplatin causes acute cold-induced peripheral sensory neuropathy (educate patient to avoid cold drinks, touching cold metal, or breathing cold air during infusion week)."
      },
      {
        "drugName": "Pembrolizumab (Anti-PD-1 Monotherapy for MSI-H / dMMR Metastatic CRC)",
        "strength": "200 mg every 3 weeks (or 400 mg every 6 weeks)",
        "dosageForm": "IV Infusion",
        "frequency": "Every 3 to 6 weeks",
        "timing": "Slow IV infusion over 30 minutes",
        "duration": "Up to 2 years or until disease progression",
        "regimenType": "NCCN Category 1 Preferred First-Line Therapy for dMMR / MSI-High Metastatic Disease",
        "clinicalNotes": "KEYNOTE-177 landmark trial: Doubled progression-free survival (16.5 vs 8.2 months) compared to standard chemotherapy plus targeted therapy, with dramatically lower toxicities. Ineffective in proficient MMR (pMMR) tumors."
      },
      {
        "drugName": "Cetuximab (or Panitumumab)",
        "strength": "500 mg/m² IV every 2 weeks (or 400 mg/m² loading -> 250 mg/m² weekly)",
        "dosageForm": "IV Infusion",
        "frequency": "Every 14 days (Q2W)",
        "timing": "Slow IV infusion over 60 to 120 minutes with anti-allergy premedication",
        "duration": "Ongoing in metastatic setting",
        "regimenType": "Anti-EGFR Monoclonal Antibody (Strictly for KRAS/NRAS/BRAF Wild-Type Left-Sided Tumors)",
        "clinicalNotes": "TAILOR & FIRE-3 trials: Robust overall survival extension strictly in RAS-wildtype tumors originating from the splenic flexure to rectum (left-sided). Completely ineffective and potentially detrimental in RAS-mutant tumors. Causes acneiform papulopustular rash (treat with oral minocycline)."
      },
      {
        "drugName": "Loperamide Hydrochloride",
        "strength": "2 to 4 mg (initial dose 4 mg, then 2 mg after each unformed stool; max 16 mg/day)",
        "dosageForm": "Oral Capsule",
        "frequency": "As needed (SOS)",
        "timing": "After each loose stool",
        "duration": "Acute symptomatic control",
        "regimenType": "Peripheral Mu-Opioid Receptor Agonist Antidiarrheal",
        "clinicalNotes": "Controls chemotherapy-induced diarrhea (especially when combining with Irinotecan [FOLFIRI]). If diarrhea persists >24h despite loperamide, escalate to oral Octreotide."
      }
    ],
    "complications": [
      "Acute complete large bowel obstruction requiring emergency decompressive colostomy or self-expanding metal stenting",
      "Hepatic metastatic failure from extensive bilobar parenchymal replacement",
      "Oxaliplatin-induced chronic cumulative sensory peripheral neuropathy"
    ],
    "referralTriggers": [
      "Any unexplained rectal bleeding or iron deficiency anemia in patient age >= 45 years (fast-track referral for screening/diagnostic colonoscopy)",
      "Biopsy-proven colorectal cancer (referral to Colorectal Multidisciplinary Oncology Team for complete mesocolic excision [CME] / total mesorectal excision [TME])",
      "Isolated resectable colorectal liver metastases (referral to Hepato-Pancreato-Biliary [HPB] surgeon for staged or synchronous metastasectomy)"
    ]
  },
  {
    "id": "pancreatic-cancer",
    "name": "Pancreatic Cancer",
    "medicalName": "Pancreatic Ductal Adenocarcinoma (PDAC)",
    "category": "Cancer Types",
    "subCategory": "Digestive Cancers",
    "icdCode": "C25.9",
    "datasetSource": "NCCN Guidelines for Pancreatic Adenocarcinoma v2.2026 & ESMO Guidelines",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Highly lethal malignancy originating from pancreatic ductal epithelium, characterized by dense desmoplastic stroma, intense neurotropism, and early micro-metastatic dissemination.",
    "symptoms": {
      "hallmark": [
        "Painless, progressive, obstructive jaundice (golden-yellow sclera, dark tea-colored urine, pale clay-colored stools) from pancreatic head tumors",
        "Deep, unrelenting, dull epigastric gnawing pain radiating straight through to the mid-thoracolumbar spine (characteristically eased by leaning forward)",
        "Rapid, profound, unyielding weight loss and skeletal muscle wasting (pancreatic cancer cachexia)",
        "Severe pruritus from systemic cutaneous bile salt deposition"
      ],
      "earlySigns": [
        "New-onset atypical Type 2 diabetes mellitus diagnosed within the past 12-24 months in a non-obese patient aged > 50",
        "Subtle postprandial dyspepsia, bloating, and greasy floating stools (steatorrhea)",
        "Unexplained persistent anorexia and loss of energy"
      ],
      "redFlags": [
        "Courvoisier's Sign: Palpable, smooth, non-tender, distended gallbladder in a jaundiced patient (strongly indicates malignant distal biliary obstruction)",
        "Trousseau's Syndrome (Trousseau's sign of malignancy): Migratory superficial thrombophlebitis in unusual sites (arms, trunk)",
        "Intractable gastric outlet obstruction from duodenal C-loop tumor encasement",
        "Malignant ascites and umbilical Sister Mary Joseph metastasis indicating peritoneal spread"
      ]
    },
    "requiredTests": [
      {
        "testName": "Dual-Phase Pancreatic Protocol Contrast Multidetector CT (MDCT)",
        "type": "Diagnostic Imaging Gold Standard",
        "purpose": "Thin-slice (<=1 mm) parenchymal and portal venous phase: defines tumor resectability based on relationship to Superior Mesenteric Artery (SMA), Celiac Axis, and SMV-Portal vein confluence",
        "urgency": "Stat / Priority"
      },
      {
        "testName": "Serum Carbohydrate Antigen 19-9 (CA 19-9)",
        "type": "Serological Tumor Biomarker",
        "purpose": "Diagnostic and prognostic monitoring marker: CA 19-9 > 100 U/mL suggests unresectability; > 1,000 U/mL indicates metastatic disease. NOTE: False-negative in Lewis blood group antigen-negative [Le a-b-] patients (7-10% of population)",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Endoscopic Ultrasound (EUS) with Fine Needle Aspiration/Biopsy (FNA/FNB)",
        "type": "Endosonography & Tissue Biopsy",
        "purpose": "Highest spatial resolution for imaging pancreatic head/body masses and vascular interfaces; core biopsy (FNB) provides definitive histopathological confirmation",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Magnetic Resonance Cholangiopancreatography (MRCP)",
        "type": "Diagnostic Magnetic Resonance",
        "purpose": "Demonstrates pathognomonic 'Double-Duct Sign': simultaneous smooth stricture and dilatation of both the Common Bile Duct and Main Pancreatic Duct",
        "urgency": "Priority"
      },
      {
        "testName": "Germline & Somatic Genomic Testing (BRCA1, BRCA2, PALB2, ATM, KRAS, MSI/MMR)",
        "type": "Molecular Oncology",
        "purpose": "MANDATORY in all diagnosed PDAC: BRCA1/2 or PALB2 mutations qualify for maintenance PARP inhibitor therapy (Olaparib) following platinum induction",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Modified FOLFIRINOX (mFOLFIRINOX Adjuvant Protocol)",
        "strength": "Oxaliplatin 85 mg/m² + Leucovorin 400 mg/m² + Irinotecan 150 mg/m² + 5-FU 2,400 mg/m² continuous IV over 46 hours (no 5-FU bolus)",
        "dosageForm": "IV Infusion via Portable CADD Infusion Pump",
        "frequency": "Every 14 days (Q2W)",
        "timing": "Days 1 to 3 of each 14-day cycle",
        "duration": "6 months (12 cycles) in adjuvant or neoadjuvant setting",
        "regimenType": "NCCN Category 1 Preferred Adjuvant & First-Line Regimen (ECOG 0-1)",
        "clinicalNotes": "PRODIGE 24 landmark trial: Extended median overall survival to an unprecedented 54.4 months in resected PDAC. Highly toxic: requires primary G-CSF pegfilgrastim support, intensive 5-HT3 antiemetics, and active diarrhea monitoring."
      },
      {
        "drugName": "Gemcitabine + Nab-Paclitaxel (Abraxane)",
        "strength": "Gemcitabine 1,000 mg/m² + Nab-Paclitaxel 125 mg/m²",
        "dosageForm": "IV Infusion",
        "frequency": "Administered on Days 1, 8, and 15 of every 28-day cycle",
        "timing": "Infuse Nab-paclitaxel over 30 mins followed by Gemcitabine over 30 mins",
        "duration": "Ongoing until disease progression",
        "regimenType": "First-Line Alternative Systemic Regimen (MPACT Trial)",
        "clinicalNotes": "First-line regimen for patients with borderline performance status (ECOG 1-2) or contraindications to FOLFIRINOX. Favorable tolerability profile. Monitor for neutropenia and peripheral sensory neuropathy."
      },
      {
        "drugName": "Pancrelipase (Pancreatic Enzyme Replacement Therapy - PERT)",
        "strength": "25,000 to 50,000 USP lipase units per full meal; 10,000 to 25,000 units per snack",
        "dosageForm": "Enteric-Coated Delayed-Release Oral Capsules",
        "frequency": "Taken with every single meal and snack throughout the day",
        "timing": "Swallowed whole with the first mouthful and spaced throughout the meal",
        "duration": "Lifelong ongoing replacement",
        "regimenType": "Mandatory Exocrine Pancreatic Insufficiency Replacement",
        "clinicalNotes": "ESSENTIAL SUPPORTIVE CARE: Pancreatic duct obstruction causes profound malabsorptive steatorrhea and malnutrition. PERT eliminates steatorrhea, restores fat-soluble vitamin absorption, and halts cachexia."
      },
      {
        "drugName": "Morphine Sulfate (or Fentanyl Transdermal Patch)",
        "strength": "Morphine 10 to 30 mg oral Q4H (or Fentanyl 25 to 50 mcg/hr patch changed Q72H)",
        "dosageForm": "Oral Tablet / Transdermal Matrix Patch",
        "frequency": "Scheduled round-the-clock with immediate-release rescue doses for breakthrough pain",
        "timing": "Continuous around-the-clock scheduled analgesia",
        "duration": "Ongoing analgesic management",
        "regimenType": "WHO Step 3 Strong Opioid Analgesia for Severe Splanchnic Pain",
        "clinicalNotes": "Pancreatic cancer produces excruciating retroperitoneal celiac plexus neuralgia. Co-prescribe stimulant laxatives (Senna); refer for CT- or EUS-guided percutaneous Celiac Plexus Neurolysis (CPN) for refractory pain."
      }
    ],
    "complications": [
      "Severe biliary sepsis / acute ascending cholangitis from occluded biliary stent",
      "Profound intractable pancreatic cancer cachexia with irreversible muscle loss",
      "High incidence of thromboembolism (deep vein thrombosis and fatal pulmonary embolism)"
    ],
    "referralTriggers": [
      "Painless jaundice in any adult (emergency same-week referral for Pancreatic Protocol CT and Endoscopic Biliary Stenting via ERCP)",
      "Resectable or borderline resectable pancreatic mass on imaging (referral to high-volume Pancreatic Surgery Center for Pancreaticoduodenectomy [Whipple Procedure])",
      "Unrelenting back pain in known pancreatic cancer (referral to Pain Management for Celiac Plexus Neurolysis)"
    ]
  },
  {
    "id": "ovarian-cancer",
    "name": "Ovarian Cancer",
    "medicalName": "Epithelial Ovarian, Fallopian Tube & Primary Peritoneal Carcinoma",
    "category": "Cancer Types",
    "subCategory": "Other Cancers",
    "icdCode": "C56.9",
    "datasetSource": "NCCN Guidelines for Ovarian Cancer v1.2026 & ESGO/ESMO Consensus Guidelines",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant neoplasm arising predominantly from the fimbriated end of the fallopian tube epithelium (High-Grade Serous Carcinoma [HGSC]), characterized by early widespread transcoelomic peritoneal dissemination.",
    "symptoms": {
      "hallmark": [
        "Persistent, unremitting abdominal bloating and increased abdominal girth (clothes feeling tight around the waist)",
        "Pelvic fullness, heaviness, or localized pelvic pain occurring > 12 days per month",
        "Early satiety (inability to finish normal-sized meals) and postprandial dyspepsia",
        "Urinary urgency and increased daytime/nocturnal frequency without documented infection"
      ],
      "earlySigns": [
        "Vague gastrointestinal symptoms easily and mistakenly misdiagnosed as Irritable Bowel Syndrome (IBS)",
        "Unexplained fatigue and mild lower back tightness",
        "Subtle constipation alternating with loose stools"
      ],
      "redFlags": [
        "Rapid development of gross tense peritoneal ascites with shifting dullness and fluid thrill",
        "Palpable, firm, irregular, fixed, non-tender adnexal mass on bimanual pelvic examination",
        "Malignant Pleural Effusion: progressive exertional dyspnea (Stage IVB disease)",
        "Subacute small bowel obstruction from diffuse peritoneal carcinomatosis ('omental caking')"
      ]
    },
    "requiredTests": [
      {
        "testName": "Transvaginal and Transabdominal Pelvic Color Doppler Ultrasound (TVS)",
        "type": "Pelvic Imaging Gold Standard",
        "purpose": "IOTA ultrasound rules: distinguishes benign from malignant adnexal cysts; identifies thick septations (>3 mm), solid papillary projections, vascular flow, and free peritoneal fluid",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Serum Cancer Antigen 125 (CA-125) & HE4 (ROMA Index)",
        "type": "Serological Tumor Biomarkers",
        "purpose": "Risk of Ovarian Malignancy Algorithm (ROMA): combines CA-125 and Human Epididymis Protein 4 (HE4) with menopausal status to stratify pre- and post-menopausal malignancy risk",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Contrast-Enhanced CT of Chest, Abdomen, and Pelvis",
        "type": "Staging Imaging Gold Standard",
        "purpose": "Evaluates extent of peritoneal carcinomatosis, omental cake, mesenteric deposits, diaphragmatic implants, pelvic/retroperitoneal lymphadenopathy, and pleural effusion",
        "urgency": "Priority"
      },
      {
        "testName": "Diagnostic Staging Laparoscopy (Fagotti Predictive Score)",
        "type": "Minimally Invasive Surgical Staging",
        "purpose": "Fagotti score assesses whether complete macroscopic cytoreduction (R0 resection) is achievable via primary debulking surgery vs initial neoadjuvant chemotherapy",
        "urgency": "Priority / Pre-Surgical"
      },
      {
        "testName": "Germline & Somatic BRCA1/BRCA2 and Homologous Recombination Deficiency (HRD)",
        "type": "Molecular Genetics",
        "purpose": "MANDATORY in all epithelial ovarian cancers: BRCA mutations or HRD genomic scar positivity predicts extraordinary sensitivity and survival benefit from PARP inhibitor maintenance",
        "urgency": "Priority / Tissue Testing"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Paclitaxel + Carboplatin Chemotherapy Protocol",
        "strength": "Paclitaxel 175 mg/m² (infused over 3 hours) + Carboplatin AUC 5 to 6 (infused over 1 hour)",
        "dosageForm": "IV Infusion",
        "frequency": "Every 21 days (Q3W)",
        "timing": "Day 1 of each 21-day cycle",
        "duration": "6 cycles total (adjuvant or 3 neoadjuvant + 3 adjuvant cycles)",
        "regimenType": "NCCN Category 1 Standard of Care First-Line Chemotherapy",
        "clinicalNotes": "GOG 111 & 158 landmark trials: Achieves >80% initial clinical response rate in high-grade serous carcinoma. MANDATORY PREMEDICATION: Dexamethasone 20 mg PO at 12h and 6h prior, plus Diphenhydramine 50 mg IV and Famotidine 20 mg IV 30 mins prior to paclitaxel to prevent severe hypersensitivity reactions."
      },
      {
        "drugName": "Olaparib (or Niraparib - PARP Inhibitor Maintenance)",
        "strength": "Olaparib 300 mg twice daily (Niraparib 200 to 300 mg once daily based on baseline weight/platelets)",
        "dosageForm": "Oral Film-Coated Tablet",
        "frequency": "Twice daily (Olaparib) or once daily (Niraparib)",
        "timing": "With or without food",
        "duration": "Up to 2 to 3 years maintenance following response to platinum chemotherapy",
        "regimenType": "Targeted Poly (ADP-Ribose) Polymerase (PARP) Inhibitor Maintenance",
        "clinicalNotes": "SOLO-1 & PRIMA trials: Synthetic lethality in homologous recombination-deficient tumors; quadruples median progression-free survival (56 vs 13.8 months in BRCA-mutated). Monitor Complete Blood Count monthly (watch for anemia, thrombocytopenia, and rare secondary AML/MDS risk)."
      },
      {
        "drugName": "Bevacizumab (Anti-VEGF Monoclonal Antibody)",
        "strength": "15 mg/kg IV",
        "dosageForm": "IV Infusion",
        "frequency": "Every 3 weeks (Q3W)",
        "timing": "Concomitant with cycles 2-6 of chemotherapy, then continued as single agent",
        "duration": "Up to 15 months total maintenance therapy (GOG-0218 protocol)",
        "regimenType": "Anti-Angiogenic Targeted Therapy (for Suboptimally Debulked Stage III/IV)",
        "clinicalNotes": "Particularly effective in patients with high-volume ascites and suboptimally debulked disease; delays ascites reaccumulation. Monitor blood pressure and urinalysis for proteinuria."
      }
    ],
    "complications": [
      "Recurrent intractable malignant ascites requiring frequent therapeutic paracentesis",
      "Malignant bowel sub-obstruction and obstruction from diffuse peritoneal implants",
      "Emergence of platinum-resistant ovarian cancer recurrence (<6 months treatment-free interval)"
    ],
    "referralTriggers": [
      "Pelvic mass on ultrasound accompanied by elevated CA-125 in a postmenopausal woman (immediate referral to Gynecologic Oncologist for maximal cytoreductive surgery)",
      "New-onset persistent bloating or early satiety lasting > 12 days per month in a woman aged > 50 (urgent pelvic ultrasound within 2 weeks)",
      "Known ovarian cancer presenting with severe nausea, bilious vomiting, and obstipation (emergency admission for malignant bowel obstruction)"
    ]
  },
  {
    "id": "kidney-cancer",
    "name": "Kidney Cancer (Renal Cell Carcinoma)",
    "medicalName": "Renal Cell Carcinoma (Clear Cell, Papillary & Chromophobe RCC)",
    "category": "Cancer Types",
    "subCategory": "Other Cancers",
    "icdCode": "C64.9",
    "datasetSource": "NCCN Clinical Practice Guidelines in Oncology (Kidney Cancer) v2.2026 & EAU Guidelines",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant neoplasm arising from renal tubular epithelial cells (Clear Cell RCC in 75-80%), strongly driven by loss of von Hippel-Lindau (VHL) tumor suppressor gene and angiogenic overexpression.",
    "symptoms": {
      "hallmark": [
        "Over 60% discovered incidentally as an asymptomatic solid cortical mass on ultrasound/CT ('incidentaloma')",
        "Classic Clinical Triad (present simultaneously in <10% of modern cases, indicates advanced disease): Gross painless hematuria, flank/loin pain, and palpable abdominal mass",
        "Constitutional paraneoplastic signs: unexplained fever, night sweats, severe fatigue, rapid cachexia",
        "Secondary polycythemia (erythropoietin hypersecretion) or hypercalcemia (PTHrP secretion)"
      ],
      "earlySigns": [
        "Microscopic painless hematuria discovered on routine urine dipstick",
        "Vague dull aching sensation in flank or costovertebral angle",
        "New-onset refractory hypertension secondary to renin hypersecretion"
      ],
      "redFlags": [
        "Sudden onset of non-reducing right-sided varicocele or acute left-sided varicocele (indicates tumor thrombus extension into renal vein and Inferior Vena Cava [IVC])",
        "Bilateral lower extremity pitting edema with dilated collateral superficial abdominal wall veins (IVC occlusion)",
        "Severe intractable bone pain or pathological fracture (osteolytic skeletal metastases)",
        "Pulmonary metastases presenting with persistent cough and hemoptysis ('cannonball' metastases)"
      ]
    },
    "requiredTests": [
      {
        "testName": "Quad-Phase Contrast-Enhanced CT of Abdomen and Pelvis",
        "type": "Diagnostic Imaging Gold Standard",
        "purpose": "Unenhanced, Corticomedullary, Nephrographic, and Excretory phases: Diagnostic hallmark is avid early arterial enhancement (>15-20 Hounsfield Unit increase over unenhanced) with rapid washout in Clear Cell RCC",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Contrast-Enhanced Abdominal MRI with MR Venography",
        "type": "Diagnostic Magnetic Resonance Imaging",
        "purpose": "Preferred in patients with iodinated contrast allergy and for precise cephalad mapping of tumor thrombus extension within the renal vein and IVC up to right atrium",
        "urgency": "Priority"
      },
      {
        "testName": "Contrast-Enhanced High-Resolution Chest CT",
        "type": "Staging Imaging Gold Standard",
        "purpose": "Lungs are the single most common site of distant hematogenous metastasis in RCC; mandatory staging for all solid renal cortical masses",
        "urgency": "Priority"
      },
      {
        "testName": "Serum Calcium, Alkaline Phosphatase, Hemoglobin, and Renal Function Panel",
        "type": "Laboratory Biomarker Assay",
        "purpose": "Evaluates paraneoplastic hypercalcemia, erythrocytosis/anemia, baseline contralateral GFR, and calculates IMDC (International Metastatic RCC Database Consortium) risk score",
        "urgency": "Priority"
      },
      {
        "testName": "Percutaneous Core Needle Biopsy of Renal Mass",
        "type": "Histopathology Assay",
        "purpose": "Indicated when active surveillance, ablative therapy (cryoablation/RFA), or upfront systemic therapy without cytoreductive nephrectomy is planned",
        "urgency": "Elective / Targeted"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Pembrolizumab + Axitinib (Combination IO + TKI Protocol)",
        "strength": "Pembrolizumab 200 mg IV every 3 weeks + Axitinib 5 mg orally twice daily",
        "dosageForm": "IV Infusion (Pembrolizumab) + Oral Film-Coated Tablet (Axitinib)",
        "frequency": "Pembrolizumab: every 3 weeks; Axitinib: twice daily (can titrate to 7-10 mg BID)",
        "timing": "Axitinib taken with or without food approx 12 hours apart; Pembrolizumab 30-min IV",
        "duration": "Pembrolizumab up to 2 years; Axitinib ongoing until disease progression",
        "regimenType": "NCCN Category 1 Preferred First-Line Regimen for Advanced / Metastatic Clear Cell RCC",
        "clinicalNotes": "KEYNOTE-426 trial: Combines PD-1 checkpoint inhibition with potent VEGFR 1-3 tyrosine kinase blockade. Significantly superior overall survival (80% vs 72% at 1 year) and objective response rate (59% vs 36%) over Sunitinib monotherapy. Monitor daily blood pressure (manage hypertension aggressively with ACEi/CCB)."
      },
      {
        "drugName": "Nivolumab + Cabozantinib (CheckMate 9ER Protocol)",
        "strength": "Nivolumab 240 mg IV every 2 weeks + Cabozantinib 40 mg orally once daily",
        "dosageForm": "IV Infusion + Oral Tablet",
        "frequency": "Nivolumab: every 2 weeks (or 480 mg Q4W); Cabozantinib: once daily",
        "timing": "Cabozantinib strictly on empty stomach >= 1 hour before or 2 hours after meals",
        "duration": "Ongoing until disease progression",
        "regimenType": "NCCN Category 1 Alternative First-Line Combination Regimen",
        "clinicalNotes": "Cabozantinib targets VEGFR, MET, and AXL kinases to overcome resistance. Robust progression-free survival benefit. Monitor for diarrhea, hand-foot skin reaction, and elevated transaminases."
      },
      {
        "drugName": "Sunitinib Malate (Single-Agent TKI)",
        "strength": "50 mg once daily for 4 weeks on therapy followed by 2 weeks off (Schedule 4/2)",
        "dosageForm": "Oral Hard Capsule",
        "frequency": "Once daily for 28 consecutive days, then 14 days rest (6-week cycle)",
        "timing": "With or without food",
        "duration": "Ongoing until disease progression",
        "regimenType": "Multi-Targeted Receptor Tyrosine Kinase Inhibitor Monotherapy",
        "clinicalNotes": "Established oral targeted monotherapy option for patients with contraindications to immune checkpoint inhibitors. Monitor blood pressure, thyroid function (TSH every 3 months), and cardiac LVEF."
      }
    ],
    "complications": [
      "Extensive cavoatrial tumor thrombus with pulmonary embolism or Budd-Chiari syndrome",
      "Intractable osteolytic bone metastases with hypercalcemia and pathological fractures",
      "Loss of renal function following nephrectomy requiring chronic dialysis if solitary kidney"
    ],
    "referralTriggers": [
      "Solid enhancing renal cortical mass identified on ultrasound or CT (immediate referral to Urologic Oncology for partial vs radical nephrectomy)",
      "New-onset varicocele in an adult male failing to decompress when recumbent (urgent renal ultrasound to rule out RCC tumor thrombus)",
      "Painless gross hematuria of any magnitude (urgent fast-track cystoscopy and contrast CT urography)"
    ]
  },
  {
    "id": "bone-cancer",
    "name": "Bone Cancer (Osteosarcoma & Ewing Sarcoma)",
    "medicalName": "Primary Malignant Bone Sarcomas (Osteosarcoma, Ewing Sarcoma & Chondrosarcoma)",
    "category": "Cancer Types",
    "subCategory": "Other Cancers",
    "icdCode": "C40-C41",
    "datasetSource": "NCCN Guidelines for Bone Cancer v1.2026, EURACAN & ESMO Clinical Practice Guidelines",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant mesenchymal tumors of the skeleton; Osteosarcoma is characterized by malignant osteoblasts producing immature osteoid matrix, typically in the metaphyseal growth plates of adolescents and young adults.",
    "symptoms": {
      "hallmark": [
        "Deep, unrelenting, aching bone pain, characteristically worse at night and awakening the patient from sound sleep, not relieved by rest",
        "Progressive firm, tender, warm bony swelling or palpable mass near the metaphyseal ends of long bones (distal femur, proximal tibia, proximal humerus)",
        "Persistent antalgic limp and joint stiffness often misattributed to a sports sprain or 'growing pains'",
        "Localized cutaneous erythema, warm skin, and visibly dilated superficial venous collaterals over the lesion"
      ],
      "earlySigns": [
        "Intermittent dull bone discomfort following physical activity",
        "Subtle limitation of joint range of motion (knee flexion or shoulder abduction)",
        "Minor trauma precipitating disproportionate and lingering bone pain"
      ],
      "redFlags": [
        "Pathological Fracture through the tumor site following trivial, low-energy trauma (compromises limb-sparing surgery)",
        "Pulmonary Metastatic Signs: unresolving cough, dyspnea, pleuritic chest pain (lungs are the primary site of distant spread)",
        "Rapid, warm, painful expansile swelling mimicking acute bacterial osteomyelitis",
        "Skip Metastases: discrete non-contiguous tumor nodules within the same involved bone marrow cavity"
      ]
    },
    "requiredTests": [
      {
        "testName": "Conventional Plain Radiographs of the Entire Involved Bone (Two Orthogonal Views)",
        "type": "Initial Diagnostic Imaging Gold Standard",
        "purpose": "Hallmark radiographic signs: Mixed osteolytic and osteoblastic lesion with ill-defined permeative cortical destruction, periosteal 'Codman's Triangle', and classic 'Sunburst' spiculation",
        "urgency": "Stat / Diagnostic"
      },
      {
        "testName": "High-Resolution Contrast-Enhanced MRI of the Entire Involved Anatomical Compartment",
        "type": "Diagnostic Imaging Gold Standard",
        "purpose": "MANDATORY: Must image the entire bone to evaluate longitudinal intramedullary tumor extent, soft tissue extraosseous component, proximity to neurovascular bundles, and exclude skip metastases",
        "urgency": "Priority / Pre-Biopsy"
      },
      {
        "testName": "Core Needle Biopsy by Experienced Orthopedic Oncologist",
        "type": "Histopathology Gold Standard",
        "purpose": "CRITICAL SURGICAL PRINCIPLE: Biopsy tract MUST be placed strictly along the longitudinal line of future definitive surgical incision to allow complete en-bloc resection and prevent tissue plane contamination",
        "urgency": "Priority / Specialized Center"
      },
      {
        "testName": "High-Resolution Contrast-Enhanced Chest CT",
        "type": "Staging Imaging Gold Standard",
        "purpose": "MANDATORY: Evaluates pulmonary parenchyma for nodular hematogenous metastases (present in 15-20% at diagnosis); dictates overall treatment strategy",
        "urgency": "Priority / Pre-Treatment"
      },
      {
        "testName": "Whole-Body 99mTc-Methylene Diphosphonate (MDP) Bone Scintigraphy / 18F-FDG PET-CT",
        "type": "Nuclear Medicine Skeletal Staging",
        "purpose": "Detects polyostotic bone involvement and distant skeletal metastases throughout the axial and appendicular skeleton",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "MAP Protocol (High-Dose Methotrexate + Doxorubicin + Cisplatin)",
        "strength": "High-Dose Methotrexate 12 g/m² IV (with Leucovorin rescue) + Doxorubicin 75 mg/m² continuous IV + Cisplatin 120 mg/m² IV",
        "dosageForm": "IV Infusion under Inpatient Nephroprotection Protocol",
        "frequency": "Multi-agent staged cycles alternating every 3 to 5 weeks",
        "timing": "Rigorous inpatient protocol with aggressive pre- and post-hydration and urine alkalinization",
        "duration": "9 to 10 months total (2-3 cycles neoadjuvant pre-op, followed by surgery, and 4-6 cycles adjuvant post-op)",
        "regimenType": "NCCN Category 1 Gold Standard Regimen for High-Grade Osteosarcoma",
        "clinicalNotes": "Transformed 5-year survival from <20% to >70% and enabled limb-sparing surgery in >85-90% of patients. MANDATORY: Urine pH must be maintained > 7.5 with IV sodium bicarbonate during high-dose methotrexate to prevent precipitation of MTX crystals in renal tubules. Leucovorin calcium rescue started strictly at 24 hours until serum MTX level drops < 0.1 µmol/L."
      },
      {
        "drugName": "VDC / IE Regimen (for Ewing Sarcoma)",
        "strength": "Vincristine 2 mg/m² + Doxorubicin 75 mg/m² + Cyclophosphamide 1,200 mg/m² alternating with Ifosfamide 1,800 mg/m² + Etoposide 100 mg/m²",
        "dosageForm": "IV Infusion",
        "frequency": "Every 2 weeks (compressed interval protocol)",
        "timing": "Inpatient chemotherapy ward",
        "duration": "14 to 17 cycles total (approx 9-10 months)",
        "regimenType": "Standard Multi-Agent Compressed Interval Protocol for Ewing Sarcoma",
        "clinicalNotes": "MANDATORY UROPROTECTION: Co-administer IV Mesna (2-mercaptoethane sulfonate sodium) with Ifosfamide and Cyclophosphamide to neutralize toxic acrolein metabolite and completely prevent hemorrhagic cystitis."
      },
      {
        "drugName": "Tramadol + Paracetamol Combination",
        "strength": "Tramadol 37.5 mg + Paracetamol 325 mg",
        "dosageForm": "Oral Film-Coated Tablet",
        "frequency": "Every 8 hours as needed (SOS)",
        "timing": "After meals with water",
        "duration": "Ongoing as needed for severe nocturnal bone pain",
        "regimenType": "Step 2 Opioid-Analgesic Combination for Bone Pain",
        "clinicalNotes": "Provides dual-mechanism analgesia (mu-opioid agonism plus serotonin/norepinephrine reuptake inhibition). Co-prescribe stool softener to prevent opioid-induced constipation."
      }
    ],
    "complications": [
      "Severe pathological fracture through necrotic bone lesion necessitating amputation",
      "Chemotherapy-induced severe myelosuppression, cardiotoxicity (doxorubicin), and nephrotoxicity",
      "Metastatic dissemination to lung parenchyma requiring thoracoscopic wedge resections (metastasectomy)"
    ],
    "referralTriggers": [
      "Unexplained bone pain worse at night or bony swelling in an adolescent or young adult (IMMEDIATE plain radiograph and direct referral to specialized Orthopedic Oncology Sarcoma Center BEFORE performing any biopsy)",
      "Suspected primary bone tumor on X-ray (NEVER perform an open biopsy in a non-specialist center; incorrect biopsy placement can compromise limb-sparing surgery)",
      "Sudden acute severe pain with inability to bear weight in a patient with a known bone lesion (acute pathological fracture)"
    ]
  },
  {
    "id": "thyroid-cancer",
    "name": "Thyroid Cancer",
    "medicalName": "Differentiated Thyroid Carcinoma (Papillary & Follicular Carcinoma)",
    "category": "Cancer Types",
    "subCategory": "Other Cancers",
    "icdCode": "C73",
    "datasetSource": "ATA (American Thyroid Association) Guidelines for Thyroid Nodules & Differentiated Thyroid Cancer 2026 & NCCN",
    "evidenceLevel": "Category 1 / Level 1A (ATA Consensus Guidelines)",
    "overview": "Malignant epithelial neoplasm originating from follicular cells of the thyroid gland (Papillary Thyroid Cancer in 85-90%, Follicular in 10%), characterized by slow indolent growth, lymphatic spread, and high iodine avidity.",
    "symptoms": {
      "hallmark": [
        "Painless, firm-to-hard, non-tender solitary thyroid nodule that ascends and descends with swallowing",
        "Palpable, firm, non-tender, persistent ipsilateral cervical lymphadenopathy (jugulodigastric / level III-IV lymph nodes)",
        "Asymmetric enlargement of one thyroid lobe noticed in the mirror or during collar buttoning",
        "Sensation of tightness, fullness, or a localized lump in the lower anterior neck"
      ],
      "earlySigns": [
        "Completely asymptomatic solitary thyroid nodule detected incidentally on carotid Doppler, cervical spine MRI, or neck CT",
        "Subtle sensation of tracheal pressure when lying supine",
        "Normal thyroid hormone levels (euthyroid state is classic; thyrotoxicosis is rare)"
      ],
      "redFlags": [
        "Persistent vocal hoarseness or altered vocal pitch from recurrent laryngeal nerve tumor invasion",
        "Progressive dysphagia (difficulty swallowing solids) from esophageal compression",
        "Inspiratory stridor, dyspnea, or wheezing from direct tracheal invasion / luminal compression",
        "Rapid, alarming expansion of a hard, woody, fixed neck mass over weeks (suspect Anaplastic Thyroid Carcinoma)"
      ]
    },
    "requiredTests": [
      {
        "testName": "High-Resolution Neck & Thyroid Ultrasound with Color Doppler",
        "type": "Ultrasonography Gold Standard",
        "purpose": "ACR TI-RADS v2024 classification: evaluates suspicious features (marked hypoechogenicity, taller-than-wide shape, irregular/infiltrative margins, punctate echogenic foci / microcalcifications, absent peripheral halo)",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Ultrasound-Guided Fine Needle Aspiration Cytology (FNAC)",
        "type": "Cytopathology Gold Standard",
        "purpose": "Reported via Bethesda System for Reporting Thyroid Cytopathology (Category I to VI): Category V (Suspicious for Malignancy, 60-75% risk) and Category VI (Malignant - Papillary Carcinoma, 97-99% risk) mandate surgical resection",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Molecular Testing on FNA Aspirate (ThyroSeq v3 or Afirma GSC Panel)",
        "type": "Molecular Pathology",
        "purpose": "Recommended for Bethesda III (AUS/FLUS) and IV (Follicular Neoplasm) indeterminate nodules: identifies BRAF V600E (high risk of lymph node metastasis), RET/PTC, RAS, and TERT promoter mutations",
        "urgency": "Priority / Indeterminate Nodules"
      },
      {
        "testName": "Preoperative Non-Contrast Neck & Upper Chest CT",
        "type": "Diagnostic Imaging",
        "purpose": "Evaluates substernal retrosternal goiter extension and aerodigestive invasion. CRITICAL: Iodinated radiocontrast MUST be avoided if radioactive iodine therapy is planned within 2-3 months",
        "urgency": "Priority if bulky/invasive"
      },
      {
        "testName": "Post-Operative Serum Thyroglobulin (Tg) & Anti-Thyroglobulin Antibodies (Anti-Tg)",
        "type": "Surveillance Tumor Biomarker Gold Standard",
        "purpose": "MANDATORY: Thyroglobulin is a highly sensitive surveillance biomarker for persistent or recurrent differentiated thyroid cancer following total thyroidectomy (target stimulated Tg < 1 ng/mL)",
        "urgency": "Routine Post-Operative"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Levothyroxine Sodium (TSH Suppression Therapy)",
        "strength": "2.0 to 2.5 mcg/kg/day (typically 125 to 200 mcg daily, titrated to target TSH)",
        "dosageForm": "Oral Tablet",
        "frequency": "Once daily in the morning",
        "timing": "Strictly on an empty stomach with plain water >= 30 to 60 minutes before breakfast",
        "duration": "Lifelong ongoing suppressive therapy",
        "regimenType": "First-Line Postoperative Hormonal Suppression (ATA Guideline)",
        "clinicalNotes": "Suppresses pituitary TSH secretion to eliminate the major proliferative stimulus for thyroid cancer cells. Target TSH: High-Risk disease < 0.1 mIU/L; Intermediate-Risk 0.1 to 0.5 mIU/L; Low-Risk 0.5 to 2.0 mIU/L. Monitor for subclinical hyperthyroidism risks (osteoporosis, atrial fibrillation)."
      },
      {
        "drugName": "Radioactive Iodine (131I - Sodium Iodide I-131)",
        "strength": "30 mCi to 150 mCi (1.11 to 5.55 GBq) based on ATA risk stratification",
        "dosageForm": "Oral Capsule / Liquid Solution",
        "frequency": "Single ablation dose administered in radiation safety isolation room",
        "timing": "Administered on empty stomach following rhTSH injections or thyroid hormone withdrawal",
        "duration": "Single therapeutic administration",
        "regimenType": "Radioiodine Remnant Ablation (RRA) & Adjuvant Therapy",
        "clinicalNotes": "Emits beta radiation destroying residual microscopic normal thyroid bed tissue and occult iodine-avid metastases. MANDATORY PREPARATION: Strict low-iodine diet (<50 mcg/day) for 2 weeks prior; stimulate TSH > 30 mIU/L via Recombinant Human TSH (rhTSH - Thyrogen) or 4-week levothyroxine withdrawal."
      },
      {
        "drugName": "Lenvatinib Mesylate (for Radioiodine-Refractory DTC)",
        "strength": "24 mg once daily (two 10 mg + one 4 mg capsule)",
        "dosageForm": "Oral Hard Capsule",
        "frequency": "Once daily (OD)",
        "timing": "With or without food at the same time each day",
        "duration": "Ongoing until disease progression",
        "regimenType": "Multi-Kinase Inhibitor for Radioiodine-Refractory Differentiated Thyroid Cancer",
        "clinicalNotes": "SELECT landmark trial: Dramatic progression-free survival extension (18.3 vs 3.6 months) in progressive radioiodine-refractory thyroid cancer. Monitor daily blood pressure (hypertension in >70%), proteinuria, and QTc interval."
      },
      {
        "drugName": "Calcium Carbonate + Calcitriol (Active Vitamin D3)",
        "strength": "Elemental Calcium 1,000 to 2,000 mg daily + Calcitriol 0.25 to 0.5 mcg daily",
        "dosageForm": "Oral Tablets / Softgels",
        "frequency": "Divided two to three times daily",
        "timing": "With meals",
        "duration": "Short-term post-op (or lifelong if permanent hypoparathyroidism)",
        "regimenType": "Post-Thyroidectomy Hypocalcemia Prevention",
        "clinicalNotes": "Prevents symptomatic post-surgical tetany and carpopedal spasm resulting from transient parathyroid gland devascularization or inadvertent removal during total thyroidectomy and central neck dissection."
      }
    ],
    "complications": [
      "Permanent iatrogenic hypoparathyroidism causing severe hypocalcemia",
      "Recurrent laryngeal nerve injury causing permanent vocal cord paralysis and dysphonia",
      "Radioiodine-refractory distant pulmonary and skeletal metastatic progression"
    ],
    "referralTriggers": [
      "Thyroid nodule with suspicious ultrasound features (ACR TI-RADS 4 or 5) or diameter >= 1.5 cm (referral for ultrasound-guided FNAC)",
      "FNA cytology reporting Bethesda Category V (Suspicious) or VI (Malignant) -> Immediate referral to Head & Neck Endocrine Surgeon",
      "Thyroid mass presenting with vocal hoarseness, stridor, or fixation to adjacent structures (urgent surgical airway and oncologic evaluation)"
    ]
  },
  {
    "id": "oral-cancer",
    "name": "Oral Cancer (Oral Cavity Squamous Cell Carcinoma)",
    "medicalName": "Oral Cavity Squamous Cell Carcinoma (Tongue, Floor of Mouth, Buccal Mucosa)",
    "category": "Cancer Types",
    "subCategory": "Common Cancers",
    "icdCode": "C00-C06",
    "datasetSource": "NCCN Guidelines for Head and Neck Cancers v1.2026, WHO Classification & American Dental Association",
    "evidenceLevel": "Category 1 / Level 1A (NCCN Practice Guidelines)",
    "overview": "Malignant epithelial neoplasm arising from the mucosal lining of the oral cavity (anterior two-thirds of tongue, buccal mucosa, floor of mouth, retromolar trigone), strongly linked to tobacco chewing, smoking, betel quid (areca nut), and alcohol synergy.",
    "symptoms": {
      "hallmark": [
        "Persistent, indurated, non-healing oral mucosal ulcer with rolled everted borders lasting > 3 weeks",
        "Exophytic, fungating, cauliflower-like mass or mucosal fissure that bleeds easily on touch",
        "Precancerous mucosal lesions: Leukoplakia (firm white patch that cannot be wiped off) or Erythroplakia (velvety fiery red patch, 85-90% harboring severe dysplasia/carcinoma)",
        "Referred Otalgia: persistent unyielding unilateral earache in the presence of a normal otoscopic exam (referred via auriculotemporal nerve or glossopharyngeal nerve)"
      ],
      "earlySigns": [
        "Subtle mucosal burning sensation, especially when eating spicy, hot, or acidic foods",
        "Unexplained localized numbness or tingling of the lower lip or chin (mental nerve hypesthesia from mandibular invasion)",
        "Unexplained loosening of adjacent dentition without obvious periodontal disease"
      ],
      "redFlags": [
        "Trismus: Inability to open mouth adequately (inter-incisal opening < 20 mm; indicates pterygoid muscle or infratemporal fossa invasion)",
        "Ankyloglossia: Tongue fixation, inability to protrude tongue straight, severe dysarthria (slurred speech)",
        "Palpable, stony-hard, fixed, non-tender jugulodigastric (Level II) cervical lymphadenopathy",
        "Frank pathological mandibular bone fracture or external cutaneous facial fistula"
      ]
    },
    "requiredTests": [
      {
        "testName": "Comprehensive Head & Neck Examination with Flexible Nasopharyngolaryngoscopy",
        "type": "Clinical Endoscopic Gold Standard",
        "purpose": "Thorough inspection and bimanual palpation of entire oral cavity and pharynx: mandatory flexible fiberoptic endoscopy to rule out synchronous second primary upper aerodigestive tumors (present in 10-15%)",
        "urgency": "Stat / Immediate"
      },
      {
        "testName": "Punch or Scalpel Incisional Wedge Biopsy of Oral Lesion",
        "type": "Histopathology Gold Standard",
        "purpose": "MANDATORY: Must include both the ulcerated lesion edge and adjacent normal-appearing mucosa with underlying submucosa to determine true histologic depth of invasion (DOI)",
        "urgency": "Priority / Diagnostic"
      },
      {
        "testName": "Contrast-Enhanced MRI of Head and Neck with Dental Artifact Suppression",
        "type": "Diagnostic Imaging Gold Standard",
        "purpose": "Optimal imaging modality: accurately quantifies tumor Depth of Invasion (DOI in mm), intrinsic tongue muscular infiltration, floor of mouth invasion, and perineural spread along lingual/inferior alveolar nerves",
        "urgency": "Priority / Pre-Surgical"
      },
      {
        "testName": "Contrast-Enhanced CT of Neck + Orthopantomogram (OPG) / Dental CT",
        "type": "Surgical Staging Imaging",
        "purpose": "High-resolution bone window CT or OPG precisely identifies cortical bone erosion and marrow invasion of mandible or maxilla (mandibulectomy planning)",
        "urgency": "Priority"
      },
      {
        "testName": "High-Resolution Contrast Chest CT",
        "type": "Staging Imaging",
        "purpose": "Lungs are the primary site of distant hematogenous metastasis and high-risk site for tobacco-related synchronous primary bronchogenic carcinoma",
        "urgency": "Priority"
      }
    ],
    "prescriptions": [
      {
        "drugName": "Cisplatin (Concurrent Adjuvant Chemoradiotherapy Protocol)",
        "strength": "100 mg/m² IV every 3 weeks (Days 1, 22, 43 of radiation) OR 40 mg/m² weekly",
        "dosageForm": "IV Infusion with Mannitol-Saline Hyperhydration",
        "frequency": "Every 21 days concurrent with definitive or postoperative radiotherapy",
        "timing": "Day 1 of radiation weeks 1, 4, and 7",
        "duration": "3 cycles (or 6 weekly cycles) concurrent with 60-66 Gy radiotherapy",
        "regimenType": "NCCN Category 1 Standard Adjuvant Chemoradiation for High-Risk Pathological Features",
        "clinicalNotes": "RTOG 9501 / EORTC 22931 trials: Mandatory post-operative standard for tumors with positive surgical margins (R1 resection) and/or Extracapsular Nodal Extension (ECE+ / ENE). Significantly reduces locoregional relapse and improves overall survival."
      },
      {
        "drugName": "Nivolumab (or Pembrolizumab - Anti-PD-1 Monotherapy)",
        "strength": "Nivolumab 240 mg IV Q2W (or 480 mg Q4W) / Pembrolizumab 200 mg IV Q3W",
        "dosageForm": "IV Infusion",
        "frequency": "Every 2 to 4 weeks",
        "timing": "Slow IV infusion over 30 to 60 minutes",
        "duration": "Up to 2 years or until disease progression",
        "regimenType": "FDA & NCCN Approved First-Line Immunotherapy for Recurrent / Metastatic HNSCC",
        "clinicalNotes": "CheckMate 141 & KEYNOTE-048 trials: Proven overall survival superiority over traditional cetuximab/platinum chemotherapy in platinum-refractory and PD-L1 expressing (CPS >= 1) recurrent/metastatic head and neck carcinoma."
      },
      {
        "drugName": "Chlorhexidine Gluconate 0.2% Oral Antiseptic Rinse",
        "strength": "0.2% w/v oral solution",
        "dosageForm": "Oral Mouthwash",
        "frequency": "10 to 15 mL swish and spit three times daily (TID)",
        "timing": "After meals",
        "duration": "Ongoing during surgical convalescence and radiotherapy",
        "regimenType": "Topical Antimicrobial Mucosal Decontaminant",
        "clinicalNotes": "Broad-spectrum bactericidal rinse; significantly reduces oral pathogenic bacterial load, prevents secondary infection of ulcerative beds, and reduces radiation-induced stomatitis severity."
      },
      {
        "drugName": "Magic Mouthwash (Compounded Anesthetic & Mucosal Protectant)",
        "strength": "Equal parts: Lidocaine 2% Viscous + Diphenhydramine 12.5mg/5mL + Aluminum/Magnesium Hydroxide suspension (1:1:1)",
        "dosageForm": "Compounded Oral Suspension",
        "frequency": "Swish 5 to 10 mL in mouth for 1 minute and expectorate every 4 to 6 hours as needed (SOS)",
        "timing": "15 to 30 minutes before oral food intake",
        "duration": "As needed during active mucositis",
        "regimenType": "Topical Analgesic & Cytoprotective Oral Suspension",
        "clinicalNotes": "Topical mucosal anesthesia alleviates excruciating oral pain, enabling essential oral nutritional hydration. Patient must avoid hot foods/liquids while oral cavity is anesthetized."
      }
    ],
    "complications": [
      "Severe trismus, speech loss, and profound dysphagia requiring permanent gastrostomy (PEG) feeding tube",
      "Carotid blowout syndrome (catastrophic fatal hemorrhage from tumor erosion into external or internal carotid artery)",
      "Severe radiation osteoradionecrosis (ORN) of the mandible requiring vascularized fibula free flap reconstruction"
    ],
    "referralTriggers": [
      "Any oral mucosal ulcer or white/red lesion persisting > 3 weeks without healing (mandatory referral for urgent biopsy to Head & Neck Surgical Oncologist / Oral Maxillofacial Surgeon)",
      "Unexplained tooth loosening with adjacent soft tissue swelling (rule out invasive carcinoma prior to dental extraction)",
      "Presence of trismus or referred otalgia in a patient with an oral lesion (immediate tertiary head & neck oncology center evaluation)"
    ]
  }
];

/**
 * Backward-compatible clinical details map for existing portal views
 */
export const CLINICAL_DETAILS_BY_ID = {
  "common-cold": {
    "recommendedDiagnosticTests": [
      "Rapid Respiratory Multiplex Viral RT-PCR (Identifies Rhinovirus, Adenovirus, Enterovirus; rules out Influenza A/B, RSV, and SARS-CoV-2)",
      "Complete Blood Count (CBC) with Differential (Evaluates leukocyte count; normal or mild lymphocytosis confirms viral etiology without bacterial leukocytosis)",
      "Rapid Antigen Detection Test (RADT) for Group A Strep (Indicated if tonsillopharyngeal exudate present to exclude streptococcal pharyngitis (Centor Score >= 3))"
    ],
    "treatmentOptions": [
      "First-Line Antipyretic & Analgesic: Paracetamol (Acetaminophen) (650 mg, Every 6 hours as needed (SOS), 3 to 5 days) - Do not exceed 3,000 mg in 24 hours. Safe in pregnancy and renal impairment; avoid in acute liver failure.",
      "Second-Generation H1 Antihistamine: Cetirizine Hydrochloride (10 mg, Once daily (OD), 5 days) - Suppresses rhinorrhea, sneezing, and histamine-mediated mucosal hypersecretion. Low sedative profile.",
      "Topical Sympathomimetic Decongestant: Xylometazoline HCl 0.1% Nasal Spray (0.1% (1 mg/mL), 2 sprays per nostril BID, Maximum 3 to 5 days strictly) - CRITICAL PRECAUTION: Strictly limit use to <=5 days to prevent rhinitis medicamentosa (rebound chemical mucosal hypertrophy).",
      "Non-Pharmacological Mucociliary Cleanser: Isotonic Saline 0.9% Nasal Rinse (0.9% w/v NaCl, 3 to 4 times daily, 7 days) - Clears thick inspissated secretions, facilitates mucociliary escalator clearance, zero drug interactions."
    ],
    "possibleComplications": [
      "Secondary acute bacterial rhinosinusitis (1-2% of adult cases)",
      "Acute otitis media from Eustachian tube dysfunction",
      "Exacerbation of underlying bronchial asthma or COPD"
    ],
    "specialistReferralCriteria": [
      "Symptoms persisting >14 days without trajectory improvement",
      "Onset of biphasic illness (initial improvement followed by acute spike in fever and purulent sputum)",
      "Development of inspiratory stridor or subcostal retractions"
    ]
  },
  "cough": {
    "recommendedDiagnosticTests": [
      "Standard Chest Radiograph (PA View) (Essential to exclude pneumonia, lobar consolidation, cavitary tuberculosis, pneumothorax, or bronchogenic neoplasm)",
      "Pulse Oximetry & Peak Expiratory Flow Rate (PEFR) (Quantifies oxygenation and reversible bronchospastic airway obstruction)",
      "Sputum Gram Stain & Sputum Bacterial Culture (Identifies Streptococcus pneumoniae, Haemophilus influenzae, or Moraxella catarrhalis in purulent productive cough)"
    ],
    "treatmentOptions": [
      "Centrally Acting Non-Opioid Antitussive: Dextromethorphan Hydrobromide (15 mg / 5 mL, 10 mL every 6 to 8 hours as needed, 5 to 7 days) - Suppresses medullary cough center for exhausting non-productive cough. CONTRAINDICATION: Do not combine with MAO inhibitors or SSRIs (serotonin syndrome risk).",
      "Bronchodilator & Mucolytic Secretolytic: Levosalbutamol + Ambroxol HCl ((1 mg + 30 mg) / 5 mL, 5 mL three times daily (TID), 5 to 7 days) - Ambroxol depolymerizes mucopolysaccharides to thin phlegm; Levosalbutamol relieves reactive bronchial smooth muscle spasm.",
      "Topical Inhaled Corticosteroid: Inhaled Budesonide MDI with Spacer (200 mcg per puff, 2 puffs twice daily (BID), 14 days) - Indicated for post-infectious bronchial hyperresponsiveness; rinses mouth to prevent oral candidiasis."
    ],
    "possibleComplications": [
      "Post-tussive rib fracture in osteopenic individuals",
      "Cough syncope from transient drop in venous return",
      "Urinary stress incontinence in multiparous females"
    ],
    "specialistReferralCriteria": [
      "Cough refractory beyond 8 weeks (chronic cough algorithm)",
      "Hemoptysis of any quantity",
      "Abnormal infiltrate or mass lesion on chest radiography"
    ]
  },
  "fever": {
    "recommendedDiagnosticTests": [
      "Complete Blood Count (CBC) with Peripheral Blood Smear (Evaluates toxic granulation, neutrophilic leukocytosis (bacterial), leukopenia (viral/typhoid), and thrombocytopenia)",
      "Serum Procalcitonin (PCT) & High-Sensitivity CRP (Distinguishes systemic bacterial sepsis (PCT > 0.5 ng/mL) from self-limiting viral pyrexia)",
      "Dual Automated Blood Culture Sets (Aerobic + Anaerobic) (2 sets from independent venipuncture sites strictly prior to antimicrobial initiation)",
      "Urine Routine/Microscopy and Urine Culture (Assesses pyuria (>10 WBC/hpf) to rule out occult urinary tract infection and pyelonephritis)"
    ],
    "treatmentOptions": [
      "First-Line Antipyretic Agent: Paracetamol (Acetaminophen) (650 mg, Every 6 hours as needed (SOS), 3 to 5 days) - Primary antipyretic of choice globally. Adult ceiling: 3,000 mg/24h. Preserves platelet aggregation unlike aspirin.",
      "Electrolyte & Hydration Stabilization: WHO Low-Osmolarity Oral Rehydration Salts (ORS) (20.5 g sachet in 1 L potable water, Ad libitum (target 2 to 3 Liters daily), Duration of febrile illness) - Replaces insensible fluid losses from hyperventilation and diaphoresis; prevents prerenal azotemia."
    ],
    "possibleComplications": [
      "Febrile delirium and dehydration-induced acute prerenal kidney injury",
      "Septic shock with multi-organ dysfunction syndrome (MODS)",
      "Disseminated intravascular coagulation (DIC)"
    ],
    "specialistReferralCriteria": [
      "Fever >39.5°C unyielding to antipyretics and active physical cooling",
      "Hypotension refractory to oral fluids requiring vasopressor support",
      "Presence of any meningeal or focal neurological deficit"
    ]
  },
  "typhoid": {
    "recommendedDiagnosticTests": [
      "Blood Culture via Automated BACTEC System (Diagnostic yield 75-80% in week 1 of illness before antibiotics; detects Salmonella enterica)",
      "Widal Tube Agglutination Test (Paired Sera) (Significant diagnostic threshold: TO titer >= 1:160 and TH titer >= 1:160 with fourfold rise in convalescent serum)",
      "Stool & Urine Bacterial Culture (Higher sensitivity in weeks 2-3 of illness; identifies chronic fecal shedding carrier state)",
      "CBC with Absolute Eosinophil Count (AEC) (Classic hallmark: Leukopenia (WBC 3,000-5,000/µL) with virtual absence of eosinophils (aneosinophilia))"
    ],
    "treatmentOptions": [
      "First-Line Oral Macrolide (Overcomes Fluoroquinolone Resistance): Azithromycin Dihydrate (500 mg (or 20 mg/kg/day), Once daily (OD) on Day 1, then 500 mg OD, 7 to 10 days) - Achieves high intracellular concentration inside reticuloendothelial macrophages. Low relapse rates (<3%).",
      "First-Line Parenteral Cephalosporin (Hospitalized/Severe): Ceftriaxone Sodium (2.0 g (or 50-75 mg/kg/day), Once daily (or 1 g Q12H), 10 to 14 days) - Indicated for severe enteric fever, toxic state, or oral intolerance. Drug of choice for MDR/XDR strains.",
      "Adjunctive Corticosteroid for Severe Typhoid Encephalopathy: Dexamethasone Sodium Phosphate (3 mg/kg initial IV dose, then 1 mg/kg Q6H, Every 6 hours, 48 hours only) - Significantly reduces mortality in severe typhoid shock/delirium. Discontinue after 48h to prevent mask of perforation."
    ],
    "possibleComplications": [
      "Terminal ileal ulcer perforation and life-threatening fecal peritonitis (week 3)",
      "Severe intestinal hemorrhage from eroded mesenteric vessels",
      "Chronic asymptomatic gallbladder carrier state (excreting bacilli >12 months)"
    ],
    "specialistReferralCriteria": [
      "Sudden severe abdominal pain with guarding (immediate surgical exploratory laparotomy)",
      "Unresponsive to oral azithromycin after 96 hours of therapy",
      "Features of typhoid state: delirium, extreme prostration, involuntary twitching"
    ]
  },
  "dengue": {
    "recommendedDiagnosticTests": [
      "Dengue NS1 Antigen ELISA (Primary diagnostic marker in acute febrile phase (Days 1 to 5 from onset); sensitivity 85-95%)",
      "Dengue IgM & IgG Capture ELISA (Indicated from Day 5 onwards; IgM/IgG ratio distinguishes primary from secondary hyper-reactive dengue)",
      "Serial Complete Blood Count (CBC) with Hematocrit (HCT) (CRITICAL MONITORING: Baseline and Q12-24H hematocrit. A >20% increase heralds critical microvascular plasma leak)",
      "Platelet Count Tracking & Liver Enzymes (ALT/AST) (AST characteristically higher than ALT; platelet nadir identifies bleeding vulnerability)",
      "Abdominal Ultrasound & Chest Radiograph (Detects subclinical gallbladder wall thickening, ascites, and right pleural effusion indicating plasma leakage)"
    ],
    "treatmentOptions": [
      "Isotonic Crystalloid Fluid Resuscitation: Normal Saline (0.9% NaCl) or Ringer's Lactate IV (5 to 7 mL/kg/hour titrated downward to 3-5 then 2 mL/kg/h, Continuous IV infusion adjusted strictly to urine output and hematocrit, 24 to 48 hours maximum) - CORE LIFESAVING THERAPY: Maintain urine output at 0.5-1.0 mL/kg/h. Stop fluids promptly once hematocrit stabilizes to prevent pulmonary edema.",
      "Analgesic & Antipyretic: Paracetamol (Acetaminophen) (500 to 650 mg, Every 6 hours as needed (Maximum 3,000 mg in 24 hours), 5 days) - STRICT CONTRAINDICATION: Absolute ban on Aspirin, Ibuprofen, Diclofenac, Naproxen, or any NSAIDs (provokes severe gastric hemorrhage and fatal Reye's syndrome).",
      "Thrombopoiesis Facilitating Nutraceutical Adjunct: Carica Papaya Leaf Extract (1,100 mg, Three times daily (TID), 5 days) - Upregulates ALOX-12 and PTAFR genes to stimulate megakaryocytopoiesis and platelet release in uncomplicated thrombocytopenia."
    ],
    "possibleComplications": [
      "Dengue Shock Syndrome (DSS) from massive intravascular fluid extravasation",
      "Severe internal hemorrhage (gastrointestinal, intracranial)",
      "Severe acute organ impairment: dengue fulminant hepatitis, myocarditis, encephalitis"
    ],
    "specialistReferralCriteria": [
      "Appearance of ANY clinical warning sign (severe abdominal pain, vomiting, lethargy)",
      "Narrowing pulse pressure (<=20 mmHg, e.g. BP 90/70 mmHg) or impalpable peripheral pulse",
      "Platelet count dropping below 20,000/µL or refractory rising hematocrit"
    ]
  },
  "jaundice": {
    "recommendedDiagnosticTests": [
      "Serum Bilirubin (Total, Direct/Conjugated, and Indirect) (Determines fractionation: Direct >50% confirms conjugated hepatic/cholestatic pattern; indirect >80% points to hemolysis)",
      "Comprehensive Liver Panel: ALT, AST, Alkaline Phosphatase (ALP), GGT (Transaminases >1,000 IU/L diagnostic of acute viral/ischemic/toxic hepatitis; ALP/GGT elevation points to biliary duct obstruction)",
      "Acute Viral Hepatitis Serological Panel (Anti-HAV IgM, HBsAg, Anti-HBc IgM, Anti-HCV RNA, Anti-HEV IgM; establishes precise etiologic organism)",
      "Prothrombin Time (PT) and International Normalized Ratio (INR) (MOST CRITICAL PROGNOSTIC PARAMETER: Directly reflects factor VII and hepatic synthetic capacity; INR >1.5 defines acute liver failure)",
      "High-Resolution Hepatobiliary Ultrasonography (USG) (Rules out extrahepatic biliary obstruction (choledocholithiasis, common bile duct dilatation >6mm, mass lesions))"
    ],
    "treatmentOptions": [
      "Hepatoprotective Hydrophilic Choleretic: Ursodeoxycholic Acid (UDCA) (300 mg, Twice daily (BID), 30 to 60 days) - Displaces toxic hydrophobic bile acids, stabilizes hepatocyte and cholangiocyte canalicular membranes, and enhances biliary secretion.",
      "Fat-Soluble Vitamin & Coagulation Cofactor: Phytomenadione (Vitamin K1) (10 mg, Once daily, 3 to 5 days) - Differentiates cholestatic malabsorption of fat-soluble vitamins (INR normalizes after 48h) from true hepatic synthetic failure (INR remains elevated).",
      "Antioxidant Hepatocyte Membrane Stabilizer: Silymarin (Purified Milk Thistle Flavonolignans) (140 mg, Three times daily (TID), 30 days) - Inhibits lipid peroxidation, scavenges free radicals, and stimulates ribosomal RNA synthesis to promote hepatic regeneration.",
      "Metabolic Sparing Nutrition: High-Carbohydrate, Low-Fat Medical Nutrition Therapy (2,000-2,500 kcal/day (approx 70% carbohydrates), Small, frequent feedings (5-6 meals/day), Acute convalescent phase) - Provides adequate glycogen stores, prevents gluconeogenic catabolism of amino acids, and minimizes biliary gallbladder contraction."
    ],
    "possibleComplications": [
      "Acute liver failure with cerebral edema and herniation",
      "Hepatorenal syndrome type 1 (rapidly progressive oliguric renal failure)",
      "Severe coagulopathy and catastrophic spontaneous hemorrhage"
    ],
    "specialistReferralCriteria": [
      "Prolongation of INR >= 1.5 in any jaundiced patient (immediate tertiary liver transplant center transfer)",
      "Appearance of asterixis, confusion, or day-night reversal",
      "Serum bilirubin rising > 15 mg/dL or intractable vomiting with dehydration"
    ]
  },
  "asthma": {
    "recommendedDiagnosticTests": [
      "Pre- and Post-Bronchodilator Spirometry (Hallmark diagnostic criteria: FEV1/FVC < 0.70 with FEV1 reversibility >= 12% and >= 200 mL after 400 mcg inhaled salbutamol)",
      "Peak Expiratory Flow (PEF) Diurnal Variability Diary (Twice daily monitoring; diurnal variability > 10% in adults supports asthma diagnosis)",
      "Fractional Exhaled Nitric Oxide (FeNO) (FeNO > 35-50 ppb identifies active eosinophilic Type-2 airway inflammation; predicts ICS responsiveness)",
      "Chest Radiograph (PA View) (Assesses hyperinflation; crucial to exclude pneumothorax, pneumomediastinum, or foreign body in acute exacerbation)"
    ],
    "treatmentOptions": [
      "GINA Track 1 Preferred Controller & Reliever (ICS-Formoterol): Budesonide + Formoterol Fumarate DPI / MDI ((160 mcg + 4.5 mcg) or (200 mcg + 6 mcg) per puff, 1 to 2 puffs BID + 1 puff PRN for symptom relief (MART Regimen), Long-term ongoing controller therapy) - Simultaneously treats inflammation and acute bronchospasm. Significantly lowers severe exacerbation risk compared to SABA monotherapy.",
      "Short-Acting Beta-2 Agonist (SABA) Rescue: Salbutamol (Albuterol) Sulfate MDI (100 mcg per metered actuation, 2 to 4 puffs every 4 hours as needed (SOS), Rescue SOS use) - Rapid bronchodilation within 5 mins; over-reliance (>3 canisters/year) indicates poor controller compliance and increased mortality.",
      "Systemic Corticosteroid for Moderate-to-Severe Exacerbation: Prednisolone Oral Burst (40 mg once daily, Once daily in the morning, 5 days strictly (no tapering required)) - Rapidly suppresses airway mucosal edema and eosinophilic recruitment; short 5-day course avoids adrenal axis suppression.",
      "Leukotriene Receptor Antagonist (LTRA): Montelukast Sodium (10 mg, Once daily at bedtime, 30 to 90 days) - Excellent adjunct for exercise-induced bronchospasm and concurrent allergic rhinitis. Monitor for rare neuropsychiatric mood changes."
    ],
    "possibleComplications": [
      "Status Asthmaticus refractory to nebulized bronchodilators requiring ICU mechanical ventilation",
      "Pneumothorax and pneumomediastinum from alveolar rupture",
      "Permanent fixed airflow limitation from bronchial wall remodeling"
    ],
    "specialistReferralCriteria": [
      "Failure to achieve asthma control despite GINA Step 4 high-dose ICS-LABA (refer to Pulmonologist for biologic therapy: Dupilumab, Omalizumab)",
      "Frequent oral corticosteroid bursts (>=2 courses/year)",
      "Life-threatening exacerbation history (previous intubation or ICU admission)"
    ]
  },
  "malaria": {
    "recommendedDiagnosticTests": [
      "Peripheral Blood Smear (Thick and Thin Films) (Thick smear determines parasite presence and quantification (parasitemia %); thin smear identifies species (P. falciparum ring forms vs P. vivax schizonts))",
      "Malaria Rapid Diagnostic Test (RDT) (Detects P. falciparum HRP-2 (Histidine-Rich Protein II) and Pan-Plasmodium pLDH (Lactate Dehydrogenase))",
      "Complete Blood Count (CBC) with Platelets (Assesses normocytic hemolytic anemia and profound thrombocytopenia (<50,000/µL))",
      "Point-of-Care Blood Glucose & Blood Gas / Serum Lactate (MANDATORY: Screens for life-threatening hyperparasitemia-induced hypoglycemia (<40 mg/dL) and lactic acidosis)",
      "Glucose-6-Phosphate Dehydrogenase (G6PD) Qualitative Assay (MANDATORY before administering Primaquine for P. vivax radical cure to prevent catastrophic acute hemolytic crisis)"
    ],
    "treatmentOptions": [
      "WHO First-Line Artemisinin-Based Combination Therapy (ACT): Artemether + Lumefantrine (ACT) (20 mg / 120 mg per tablet (Adult dose: 4 tablets per dose), 6-dose regimen over 60 hours: Doses at 0h, 8h, 24h, 36h, 48h, and 60h, 3 days (complete 6 doses)) - Artemether rapidly reduces parasite biomass within 24-48h; lumefantrine clears residual parasites preventing recrudescence.",
      "LIFESAVING GOLD STANDARD FOR SEVERE MALARIA: Artesunate IV (2.4 mg/kg IV reconstituted in sodium bicarbonate and normal saline, At 0 hours, 12 hours, and 24 hours, then once daily (OD), Minimum 24 hours until patient can tolerate oral ACT) - Significantly superior survival over IV Quinine (SEAQUAMAT and AQUAMAT trials). Monitor for delayed post-artesunate hemolytic anemia at days 7-21.",
      "Hypnozoitocidal Radical Cure: Primaquine Phosphate (for P. vivax / P. ovale Radical Cure) (0.25 to 0.5 mg/kg base (15 to 30 mg base daily), Once daily (OD), 14 days) - Destroys dormant liver hypnozoites in P. vivax preventing relapses. CONTRAINDICATION: Severe G6PD deficiency and pregnancy (causes massive intravascular hemolysis).",
      "Antipyretic: Paracetamol (Acetaminophen) (650 mg, Every 6 hours as needed (SOS), 3 days) - Avoid NSAIDs due to coexisting thrombocytopenia and hemorrhagic risks."
    ],
    "possibleComplications": [
      "Cerebral malaria with irreversible brain injury and high case-fatality rate",
      "Acute Respiratory Distress Syndrome (ARDS) from alveolar-capillary leakage",
      "Massive intravascular hemolysis and acute hemoglobinuric tubular necrosis"
    ],
    "specialistReferralCriteria": [
      "Any criteria of Severe Malaria (impaired sensorium, jaundice + oliguria, parasitemia > 5%)",
      "Failure of clinical improvement or rising parasitemia at 48 hours of ACT",
      "Spontaneous bleeding or profound thrombocytopenia (<20,000/µL)"
    ]
  },
  "tuberculosis": {
    "recommendedDiagnosticTests": [
      "GeneXpert MTB/RIF Ultra Molecular Automated Assay (WHO-recommended primary diagnostic test: simultaneously identifies M. tuberculosis DNA and Rifampicin resistance (rpoB gene mutations) in <2 hours)",
      "Fluorescence Acid-Fast Bacilli (AFB) Sputum Smear Microscopy (Auramine-O staining or Ziehl-Neelsen staining on spot and early morning sputum specimens to quantify infectious bacillary burden)",
      "Posterior-Anterior (PA) Chest Radiograph (Hallmarks: Apical and posterior segment upper lobe fibrocavitary infiltrates, hilar adenopathy, pleural effusion, or miliary micronodules)",
      "Liquid Mycobacterial Culture (MGIT 960 System) & Phenotypic DST (Automated liquid culture isolates viable bacilli and confirms phenotypic drug susceptibility to first- and second-line anti-TB agents)",
      "Baseline Liver Function Tests (LFT) & Serum Creatinine (MANDATORY BASELINE: Screens baseline transaminases and renal function before starting hepatotoxic regimen (Isoniazid, Rifampicin, Pyrazinamide))"
    ],
    "treatmentOptions": [
      "WHO Standard Intensive Phase Regimen: 4-Drug Fixed Dose Combination (4-FDC: H-R-Z-E) (Isoniazid 75mg + Rifampicin 150mg + Pyrazinamide 400mg + Ethambutol 275mg per tablet (3-5 tablets based on weight band), Once daily (OD) in morning, 2 months (Intensive Phase: 56 daily doses)) - Directly Observed Therapy (DOTS). Rifampicin imparts harmless bright orange-red discoloration to urine and tears; Pyrazinamide may cause hyperuricemic arthralgia.",
      "WHO Standard Continuation Phase Regimen: 3-Drug Fixed Dose Combination (3-FDC: H-R-E) or 2-FDC (H-R) (Isoniazid 75mg + Rifampicin 150mg (+ Ethambutol 275mg) per tablet (3-5 tablets based on weight band), Once daily (OD) in morning, 4 months (Continuation Phase: 112 daily doses)) - Sterilizes persistent semi-dormant bacillary persisters, preventing disease relapse and secondary emergence of drug resistance.",
      "Neuroprotective Chemoprophylaxis: Pyridoxine Hydrochloride (Vitamin B6) (25 to 50 mg, Once daily (OD), 6 months (throughout entire anti-TB treatment)) - MANDATORY CO-PRESCRIPTION: Prevents Isoniazid-induced competitive inhibition of pyridoxine kinase and severe painful peripheral sensory neuropathy."
    ],
    "possibleComplications": [
      "Multidrug-Resistant TB (MDR-TB: resistant to both Isoniazid and Rifampicin) requiring 9-18 month bedaquiline regimens",
      "Extensive pulmonary fibrosis, traction bronchiectasis, and chronic respiratory insufficiency",
      "Drug-Induced Liver Injury (DILI): Stop ATT immediately if transaminases rise > 5x ULN or > 3x with jaundice"
    ],
    "specialistReferralCriteria": [
      "GeneXpert positive for Rifampicin resistance (immediate transfer to Drug-Resistant TB Center)",
      "Hemoptysis >= 100 mL/day (urgent bronchial artery embolization / thoracic surgery)",
      "Failure of sputum smear conversion from positive to negative at completion of month 2"
    ]
  },
  "food-poisoning": {
    "recommendedDiagnosticTests": [
      "Stool Routine and Microscopic Examination (Detects fecal leukocytes (>10 pus cells/hpf indicates invasive mucosal bacterial enteritis), RBCs, and protozoan cysts/trophozoites)",
      "Comprehensive Serum Electrolytes, BUN, and Creatinine (Evaluates prerenal azotemia (BUN/Creatinine ratio > 20:1), hypokalemia, and hypochloremic metabolic alkalosis/acidosis)",
      "Multiplex Stool Enteric Pathogen PCR Panel (Identifies Salmonella, Shigella, Campylobacter, Shiga-toxin producing E. coli (STEC), Norovirus, and C. difficile toxin genes)"
    ],
    "treatmentOptions": [
      "CORNERSTONE LIFESAVING THERAPY: WHO Low-Osmolarity Oral Rehydration Salts (ORS) (20.5 g sachet in 1 L potable water (Osmolarity 245 mOsm/L), 200 to 400 mL replacement after every loose stool episode, 3 to 5 days until diarrhea resolves) - Leverages intact SGLT-1 intestinal brush border sodium-glucose co-transport to drive massive water reabsorption into enterocytes.",
      "Potent 5-HT3 Receptor Antagonist Antiemetic: Ondansetron Hydrochloride (4 to 8 mg, Every 8 hours as needed (SOS), 1 to 2 days maximum) - Blocks peripheral vagal afferents and central chemoreceptor trigger zone; aborts emesis allowing successful oral rehydration.",
      "Enterocyte Regenerative Micronutrient: Zinc Sulfate Monohydrate (20 mg elemental zinc, Once daily (OD), 14 days) - WHO recommendation: Promotes intestinal brush border villous regeneration, reduces diarrhea duration by 25%, and prevents recurrence.",
      "Empiric Fluoroquinolone (Strictly Reserved for Febrile/Invasive Dysentery): Ciprofloxacin HCl (or Azithromycin 500 mg OD) (500 mg, Twice daily (BID), 3 days strictly) - Indicated strictly if macroscopic blood in stool or fever > 38.5°C. CONTRAINDICATION: Avoid if suspected STEC (O157:H7) as antibiotics induce Shiga toxin release triggering Hemolytic Uremic Syndrome (HUS)."
    ],
    "possibleComplications": [
      "Severe acute hypovolemic shock and prerenal acute tubular necrosis",
      "Hemolytic Uremic Syndrome (microangiopathic hemolytic anemia, thrombocytopenia, AKI) with STEC",
      "Post-infectious Reactive Arthritis (Reiter's syndrome) following Salmonella or Shigella"
    ],
    "specialistReferralCriteria": [
      "Inability to retain any oral fluids for >12 hours despite antiemetics",
      "Signs of severe shock (systolic BP < 90 mmHg, cold extremities, confusion)",
      "Bloody diarrhea in elderly or immunocompromised patients"
    ]
  },
  "stomach-infections": {
    "recommendedDiagnosticTests": [
      "13C-Urea Breath Test (UBT) or Stool Antigen Test (HpSA) (Gold standard non-invasive test for active H. pylori infection; sensitivity/specificity >95%. MANDATORY: Must be off PPI for >=2 weeks and antibiotics for >=4 weeks)",
      "Esophagogastroduodenoscopy (Upper GI Endoscopy / EGD) (Direct mucosal visualization of ulcer crater, Forrest classification staging for bleeding ulcers, and targeted antral/corpus mucosal biopsies)",
      "Rapid Urease Test (RUT / CLO Test) on Endoscopic Biopsy (Colorimetric change within 1-2 hours confirms active bacterial urease enzyme production)",
      "Serum Ferritin & Complete Blood Count (CBC) (Identifies microcytic hypochromic iron deficiency anemia from chronic occult mucosal weeping)"
    ],
    "treatmentOptions": [
      "ACG & Maastricht VI Preferred First-Line Eradication Therapy: Bismuth Quadruple Therapy Regimen (14-Day Protocol) (Esomeprazole 40mg BID + Bismuth Subsalicylate 300mg QID + Metronidazole 500mg TID/QID + Tetracycline HCl 500mg QID, PPI: twice daily before meals; Bismuth, Metronidazole, Tetracycline: four times daily with meals and bedtime, 14 days strictly) - Overcomes high global clarithromycin resistance (>15-20%). Achieves >90% eradication. Counsel patient on harmless black discoloration of tongue and stool from bismuth.",
      "Potent Proton Pump Inhibitor (PPI): Esomeprazole Magnesium (or Pantoprazole) (40 mg, Once or twice daily, 4 to 8 weeks after eradication protocol) - Maintains intragastric pH > 6 to promote rapid ulcer healing and re-epithelialization of mucosal craters.",
      "Cytoprotective Mucosal Barrier Binder: Sucralfate Oral Suspension (1.0 g / 10 mL, Four times daily (QID), 4 weeks) - Polymerizes in acidic environment into viscous paste that selectively binds positively charged proteins in ulcer crater, forming mechanical shield."
    ],
    "possibleComplications": [
      "Catastrophic acute upper gastrointestinal hemorrhage from erosion into gastroduodenal artery",
      "Acute free peritoneal perforation with pneumoperitoneum and septic peritonitis",
      "Gastric MALT lymphoma and intestinal-type gastric adenocarcinoma secondary to chronic H. pylori"
    ],
    "specialistReferralCriteria": [
      "Any evidence of hematemesis or melena (immediate emergency endoscopic hemostasis: clipping/thermal)",
      "Acute rigid, silent, board-like abdomen (emergency exploratory laparotomy for Graham patch repair)",
      "Persistent symptoms post-eradication in patient age > 55 with alarm features"
    ]
  },
  "urinary-infections": {
    "recommendedDiagnosticTests": [
      "Urine Routine and Microscopic Examination (Hallmark findings: Significant pyuria (>10 WBC/hpf or >25 WBC/µL uncentrifuged), bacteriuria, positive leukocyte esterase, and positive nitrite (enterobacteria))",
      "Quantitative Clean-Catch Midstream Urine Culture & DST (Significant bacteriuria: >= 10^5 CFU/mL in asymptomatic; >= 10^3 CFU/mL in symptomatic females; isolates UPEC and tests susceptibility)",
      "Serum Creatinine, BUN, and Complete Blood Count (CBC) (Essential if upper tract symptoms (pyelonephritis) present to evaluate renal parenchymal impairment and leukocytosis with left shift)",
      "Ultrasound of Kidneys, Ureters, and Bladder (USG KUB) (Indicated in complicated/recurrent UTI or pyelonephritis to rule out obstructive calculus, hydronephrosis, or perinephric abscess)"
    ],
    "treatmentOptions": [
      "IDSA First-Line Agent for Acute Uncomplicated Cystitis: Nitrofurantoin Monohydrate / Macrocrystals (100 mg, Twice daily (BID), 5 days) - Concentrates exclusively in urine with negligible serum levels; preserves bowel and vaginal flora. CONTRAINDICATION: Ineffective in pyelonephritis (insufficient tissue levels) and contraindicated if eGFR < 30 mL/min.",
      "IDSA First-Line Single-Dose Bactericidal Agent: Fosfomycin Trometamol (3.0 g, Single dose therapy, Single Dose) - Inhibits MurA bacterial cell wall synthesis. Exceptional compliance; maintains bactericidal urinary levels for >48 hours; active against ESBL E. coli.",
      "Urinary Tract Mucosal Analgesic: Phenazopyridine Hydrochloride (200 mg, Three times daily (TID), Maximum 2 days strictly) - Provides rapid symptomatic relief of severe burning dysuria. CRITICAL COUNSELING: Discolors urine and tears bright reddish-orange; discolors contact lenses.",
      "First-Line Parenteral Cephalosporin for Acute Pyelonephritis: Ceftriaxone Sodium (for Acute Pyelonephritis) (1.0 g, Once daily (OD), 7 to 10 days (switch to oral ciprofloxacin when afebrile)) - Achieves high renal parenchymal tissue concentrations; excellent activity against community enterobacteriaceae."
    ],
    "possibleComplications": [
      "Perinephric abscess or emphysematous pyelonephritis in poorly controlled diabetics",
      "Severe Gram-negative urosepsis and endotoxic shock",
      "Chronic renal scarring and secondary hypertension following recurrent childhood pyelonephritis"
    ],
    "specialistReferralCriteria": [
      "High fever with flank pain failing to improve after 48-72 hours of IV antibiotics (urgent contrast CT to rule out renal abscess)",
      "Presence of obstructing ureteral calculus with infection (emergency urologic decompression via ureteral JJ stent or nephrostomy)",
      "Recurrent UTI (>=3 episodes/year) requiring cystoscopy and urologic evaluation"
    ]
  },
  "diabetes": {
    "recommendedDiagnosticTests": [
      "Glycated Hemoglobin (HbA1c Assay via NGSP Standard) (Diagnostic threshold >= 6.5%; general adult glycemic target < 7.0% (individualized: 6.5% for young/fit, <8.0% for frail elderly))",
      "Fasting Plasma Glucose (FPG) & 2-Hour 75g OGTT (Fasting >= 8h: Diagnostic threshold >= 126 mg/dL (7.0 mmol/L); 2h OGTT >= 200 mg/dL (11.1 mmol/L) confirmed on repeat testing)",
      "Spot Urine Albumin-to-Creatinine Ratio (uACR) (Annual mandatory nephropathy screen: Normal < 30 mg/g; Microalbuminuria 30-300 mg/g; Macroalbuminuria > 300 mg/g)",
      "Serum Creatinine with CKD-EPI Estimated GFR (eGFR) (Evaluates cardiorenal baseline; guides metformin and SGLT2i dosing safety thresholds)",
      "Dilated Fundus Examination by Ophthalmologist (Screens for non-proliferative/proliferative diabetic retinopathy and clinically significant macular edema (CSME))"
    ],
    "treatmentOptions": [
      "Foundational First-Line Biguanide Insulin Sensitizer: Metformin Hydrochloride Extended-Release (ER) (500 to 1,000 mg, Once or twice daily (BID), Long-term ongoing maintenance) - Inhibits hepatic gluconeogenesis via AMPK activation; weight-neutral; reduces cardiovascular mortality. Monitor eGFR (safe down to 30 mL/min; discontinue if <30 mL/min due to rare lactic acidosis risk).",
      "SGLT2 Inhibitor with Cardiorenal & Heart Failure Protection: Empagliflozin (or Dapagliflozin) (10 to 25 mg (Dapagliflozin 10 mg), Once daily in the morning, Long-term ongoing maintenance) - Blocks proximal tubule glucose and sodium reabsorption. Mandatory guideline choice for patients with established ASCVD, heart failure (HFrEF/HFpEF), or CKD. Counsel on genital mycotic hygiene and euglycemic DKA warning.",
      "GLP-1 Receptor Agonist with High Glycemic & Weight Loss Efficacy: Semaglutide (Oral or Once-Weekly SC) (Oral: 3mg -> 7mg -> 14mg OD; SC: 0.25mg -> 0.5mg -> 1.0mg weekly, Oral: once daily fasting; SC: once weekly on the same day, Long-term ongoing maintenance) - Enhances glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying. Robust MACE reduction in ASCVD. Contraindicated in personal/family history of Medullary Thyroid Carcinoma or MEN-2.",
      "Second-Generation Sulfonylurea Secretagogue: Glimepiride (1 to 2 mg (titrated to max 4 mg), Once daily (OD), Long-term ongoing maintenance) - Stimulates pancreatic beta-cell SUR-1 receptors. Cost-effective add-on; patient MUST be educated on recognizing and managing hypoglycemia (rule of 15)."
    ],
    "possibleComplications": [
      "Diabetic Nephropathy & End-Stage Renal Disease (ESRD) requiring chronic hemodialysis",
      "Accelerated Atherosclerotic Cardiovascular Disease (Myocardial Infarction, Ischemic Stroke, Peripheral Artery Disease)",
      "Diabetic Peripheral Neuropathy, Charcot neuroarthropathy, and lower extremity amputations"
    ],
    "specialistReferralCriteria": [
      "Severe refractory glycemic dysregulation (HbA1c > 9.5%) despite triple oral combination therapy",
      "Rapidly declining eGFR (>5 mL/min/year drop) or new-onset macroalbuminuria (uACR > 300 mg/g)",
      "Presence of active diabetic foot ulceration or neuro-ischemic skin changes"
    ]
  },
  "high-blood-pressure": {
    "recommendedDiagnosticTests": [
      "24-Hour Ambulatory Blood Pressure Monitoring (ABPM) / Home BP (HBPM) (Essential to confirm true sustained hypertension, assess nocturnal dipping profile, and rule out white-coat and masked hypertension)",
      "12-Lead Electrocardiogram (ECG) (Evaluates Sokolow-Lyon criteria (S in V1 + R in V5/V6 >= 35 mm) and Cornell voltage for Left Ventricular Hypertrophy (LVH) and strain patterns)",
      "Comprehensive Metabolic Panel (CMP): Serum Creatinine, eGFR, Electrolytes (Assesses renal function, baseline potassium (screens for primary aldosteronism if hypokalemic), and sodium)",
      "Spot Urine Albumin-to-Creatinine Ratio (uACR) (Detects subclinical hypertensive nephrosclerosis and microalbuminuria; independent cardiovascular risk marker)",
      "Fasting Lipid Profile and Fasting Blood Glucose (Mandatory to compute 10-year Atherosclerotic Cardiovascular Disease (ASCVD) risk percentage)"
    ],
    "treatmentOptions": [
      "First-Line Angiotensin II Receptor Blocker (ARB): Telmisartan (or Losartan Potassium) (40 to 80 mg (Losartan 50-100 mg), Once daily (OD), Long-term ongoing maintenance) - Blocks AT1 receptors; highest lipophilicity and longest half-life (24 hours) in ARB class; provides sustained BP control through morning surge. Free from bradykinin cough. Recheck potassium and creatinine at 2 weeks.",
      "First-Line Dihydropyridine Calcium Channel Blocker (CCB): Amlodipine Besylate (5 to 10 mg, Once daily (OD), Long-term ongoing maintenance) - Potent peripheral arterial vasodilator. Highly effective monotherapy and synergistic with ARB. Warn patient regarding benign dependent pretibial edema (caused by precapillary arteriolar vasodilation, not fluid overload).",
      "Thiazide-Like Diuretic: Chlorthalidone (or Hydrochlorothiazide) (12.5 to 25 mg, Once daily in the morning, Long-term ongoing maintenance) - ALLHAT trial proven cardiovascular event reduction. Chlorthalidone preferred over HCTZ due to longer duration of action (48-72h). Monitor serum electrolytes (potassium, sodium) and uric acid.",
      "Class 1 Non-Pharmacological Intervention: DASH Diet & Dietary Sodium Restriction Protocol (< 1,500 to 2,000 mg elemental sodium/day (<5 g NaCl/day), Continuous daily adherence, Lifelong) - Yields systolic BP reduction of 8 to 14 mmHg (equivalent to full-dose single pharmacological monotherapy). Emphasize potassium-rich foods (fruits, vegetables, legumes) unless advanced CKD."
    ],
    "possibleComplications": [
      "Hypertensive Heart Disease, Left Ventricular Hypertrophy, and Heart Failure (HFpEF)",
      "Ischemic Stroke, Lacunar Infarction, and Spontaneous Intracerebral Hemorrhage",
      "Hypertensive Nephrosclerosis leading to progressive End-Stage Renal Disease (ESRD)"
    ],
    "specialistReferralCriteria": [
      "Resistant Hypertension: BP remains above target despite concurrent adherence to >=3 antihypertensive agents of different classes (including a diuretic)",
      "Suspected Secondary Hypertension (sudden onset age <30 or >55, hypokalemic alkalosis, refractory snoring/OSA, epigastric bruits)",
      "Hypertensive crisis with any acute target organ compromise (immediate ER admission for IV Labetalol / Nicardipine)"
    ]
  },
  "kidney-problems": {
    "recommendedDiagnosticTests": [
      "Serum Creatinine with CKD-EPI 2021 Creatinine-Cystatin C eGFR Equation (Classifies CKD Stages: G1 (>=90), G2 (60-89), G3a (45-59), G3b (30-44), G4 (15-29), G5 (<15 mL/min/1.73m²))",
      "Spot Urine Albumin-to-Creatinine Ratio (uACR) (Classifies Albuminuria Stages: A1 (<30 mg/g normal to mildly increased), A2 (30-300 mg/g microalbuminuria), A3 (>300 mg/g macroalbuminuria))",
      "Comprehensive Electrolyte & Mineral Bone Panel (K+, Na+, Ca2+, PO4, iPTH) (Detects hyperkalemia, secondary hyperparathyroidism, hypocalcemia, and hyperphosphatemia (CKD-MBD))",
      "Renal Ultrasonography with Color Doppler (Demonstrates bilateral small shrunken kidneys (bipolar length < 9 cm) with increased cortical echogenicity and lost corticomedullary differentiation)"
    ],
    "treatmentOptions": [
      "KDIGO First-Line Renoprotective SGLT2 Inhibitor: Dapagliflozin (or Empagliflozin) (10 mg, Once daily (OD), Long-term ongoing maintenance) - DAPA-CKD & EMPA-KIDNEY landmark trials: Slows eGFR decline by 40-50% and dramatically cuts cardiovascular death in CKD with eGFR 20-60 mL/min and uACR > 200 mg/g. Can be continued until initiation of dialysis.",
      "Renin-Angiotensin-Aldosterone System (RAAS) Blocker: Telmisartan (or Enalapril) (20 to 40 mg (titrated to max tolerated), Once daily (OD), Long-term ongoing maintenance) - Selectively dilates efferent renal arterioles, reducing intraglomerular hydrostatic pressure and proteinuria. Expected benign serum creatinine bump up to 30% acceptable. Monitor serum potassium.",
      "High-Ceiling Loop Diuretic: Torsemide (or Furosemide) (10 to 20 mg (Torsemide) / 40 to 80 mg (Furosemide), Once daily in the morning, Ongoing as needed for volume control) - Torsemide has superior, more predictable oral bioavailability (80-90%) than furosemide in uremic bowel edema. Titrated strictly to achieve euvolemia and control pretibial edema.",
      "Alkalinizing Agent for Chronic Metabolic Acidosis: Sodium Bicarbonate (500 to 1,000 mg, Two to three times daily, Ongoing while serum bicarbonate < 22 mmol/L) - Target serum HCO3 22-26 mmol/L. Prevents progressive muscle protein wasting, preserves bone mineral density, and significantly slows rate of GFR loss."
    ],
    "possibleComplications": [
      "End-Stage Renal Disease (ESRD) requiring renal replacement therapy (hemodialysis / peritoneal dialysis / transplant)",
      "Accelerated Uremic Cardiovascular Calcification, Sudden Cardiac Death, and Stroke",
      "Renal Osteodystrophy / Fracture from secondary and tertiary hyperparathyroidism"
    ],
    "specialistReferralCriteria": [
      "eGFR dropping below 30 mL/min/1.73m² (CKD Stage G4 - initiate timely vascular access arteriovenous fistula [AVF] planning)",
      "Rapid unexplained eGFR decline (>5 mL/min/year)",
      "Refractory hyperkalemia (K > 6.0 mEq/L) or nephrotic-range proteinuria (uACR > 2,000 mg/g)"
    ]
  },
  "heart-problems": {
    "recommendedDiagnosticTests": [
      "12-Lead Electrocardiogram (ECG) (Assesses ST-segment elevation/depression (>=1 mm in contiguous leads), pathologic Q-waves, T-wave inversion, new Left Bundle Branch Block (LBBB))",
      "High-Sensitivity Cardiac Troponin-I / Troponin-T (hs-cTn) (0h/1h or 0h/2h rapid diagnostic algorithm for Acute Myocardial Infarction; detects myocardial necrosis)",
      "Transthoracic 2D-Echocardiography with Color Doppler (Quantifies Left Ventricular Ejection Fraction (LVEF: HFrEF <=40%, HFmrEF 41-49%, HFpEF >=50%), regional wall motion abnormalities, and valvular stenosis/regurgitation)",
      "N-Terminal pro-B-type Natriuretic Peptide (NT-proBNP) (Biomarker of ventricular wall stretch and heart failure: Rule-out cutoff < 125 pg/mL non-acute; < 300 pg/mL acute dyspnea)",
      "Coronary Computed Tomography Angiography (CCTA) / Invasive Coronary Angiogram (Definitive anatomical visualization of coronary stenosis, plaque burden, and fractional flow reserve (FFR))"
    ],
    "treatmentOptions": [
      "Antiplatelet Cyclooxygenase-1 (COX-1) Inhibitor: Aspirin (Acetylsalicylic Acid - Enteric Coated) (75 to 100 mg (Loading dose: 325 mg chewed in acute ACS), Once daily (OD), Indefinite lifelong therapy) - Irreversibly inhibits platelet thromboxane A2 production. Cornerstone of secondary atherothrombotic prevention across all clinical coronary disease.",
      "High-Intensity HMG-CoA Reductase Inhibitor: Atorvastatin Calcium (or Rosuvastatin) (40 to 80 mg (Rosuvastatin 20 to 40 mg), Once daily at bedtime, Indefinite lifelong therapy) - Achieves >= 50% LDL-C reduction with target LDL < 55 mg/dL (<1.4 mmol/L) in very high-risk CAD. Provides robust plaque stabilization, anti-inflammatory, and pleiotropic endothelial protection.",
      "Cardioselective Beta-1 Adrenergic Blocker: Metoprolol Succinate Extended-Release (or Bisoprolol) (25 to 50 mg (titrated to target 100-200 mg OD), Once daily in the morning, Indefinite lifelong therapy) - Reduces myocardial oxygen demand, limits ventricular remodeling, and significantly decreases sudden cardiac death in CAD and HFrEF. Target resting heart rate: 55-65 bpm.",
      "Rapid-Acting Venous & Coronary Nitrate Vasodilator: Nitroglycerin (Glyceryl Trinitrate) Sublingual (0.4 mg (400 mcg), 1 tablet/spray sublingually every 5 mins up to 3 doses SOS for acute chest pain, Emergency SOS rescue) - Reduces cardiac preload and left ventricular end-diastolic pressure. CRITICAL WARNING: If chest pain persists >5 minutes after first dose, patient must activate emergency EMS (911/112) immediately. CONTRAINDICATION: Do not administer if PDE-5 inhibitor (sildenafil, tadalafil) taken within 24-48 hours (risk of fatal refractory hypotension)."
    ],
    "possibleComplications": [
      "Acute ST-Elevation Myocardial Infarction (STEMI) with extensive anterior wall necrosis",
      "Malignant ventricular tachyarrhythmias and sudden cardiac arrest",
      "End-stage decompensated heart failure requiring cardiac resynchronization therapy (CRT-D) or LVAD"
    ],
    "specialistReferralCriteria": [
      "Any chest pain concerning for Acute Coronary Syndrome (immediate transfer to 24/7 Primary PCI catheterization lab)",
      "Refractory NYHA Class III-IV heart failure symptoms despite guideline-directed medical therapy (GDMT: ARNI + Beta-blocker + MRA + SGLT2i)",
      "Documented Left Ventricular Ejection Fraction <= 35% (referral for Implantable Cardioverter-Defibrillator [ICD])"
    ]
  },
  "liver-problems": {
    "recommendedDiagnosticTests": [
      "Comprehensive Liver Function Panel (ALT, AST, ALP, GGT, Albumin, Bilirubin) (Evaluates hepatocellular vs cholestatic injury; AST:ALT ratio > 1 suggests advanced bridging fibrosis/cirrhosis)",
      "FIB-4 Score Non-Invasive Fibrosis Calculation (Calculated using Age, AST, ALT, and Platelet count: <1.30 rules out advanced fibrosis (NPV >90%); >2.67 indicates high risk of F3-F4 advanced fibrosis)",
      "Transient Elastography (FibroScan) (Measures liver stiffness in kilopascals (kPa; >12-15 kPa diagnostic of cirrhosis) and Controlled Attenuation Parameter (CAP in dB/m for steatosis))",
      "Upper Gastrointestinal Endoscopy (EGD) (Mandatory surveillance for gastroesophageal varices in all patients with confirmed cirrhosis or liver stiffness >= 20 kPa)",
      "Liver Ultrasound + Serum Alpha-Fetoprotein (AFP) Every 6 Months (Mandatory semiannual screening for Hepatocellular Carcinoma (HCC) in all cirrhotic patients)"
    ],
    "treatmentOptions": [
      "Antioxidant Lipid Peroxidation Scavenger (AASLD Recommended for Non-Diabetic MASH): Vitamin E (d-alpha-tocopherol) (800 IU daily, Once daily (OD), 12 to 24 months) - PIVENS trial: Significantly improves steatosis and lobular inflammation in biopsy-proven non-diabetic MASH. Avoid in men with high risk of prostate cancer.",
      "Aldosterone Antagonist + Loop Diuretic Combination: Spironolactone + Furosemide (Ascites Protocol) (Spironolactone 100 mg + Furosemide 40 mg (100:40 mg ratio), Once daily in the morning, Ongoing as needed for ascites maintenance) - The 100:40 mg ratio maintains serum potassium balance while successfully mobilizing ascitic fluid. Target weight loss: 0.5 kg/day (without edema) or 1.0 kg/day (with pedal edema).",
      "Non-Absorbable Synthetic Disaccharide for Encephalopathy: Lactulose Oral Solution (15 to 30 mL, Two to three times daily, Long-term ongoing maintenance) - Metabolized by colonic bacteria into lactic and acetic acid; acidifies lumen to pH < 5, converting diffusible ammonia (NH3) into non-absorbable ammonium (NH4+) trapped in stool.",
      "Gut-Specific Non-Absorbable Antimicrobial: Rifaximin (550 mg, Twice daily (BID), Long-term secondary prevention) - AASLD/EASL standard add-on to lactulose; reduces recurrent overt hepatic encephalopathy hospitalizations by >50%."
    ],
    "possibleComplications": [
      "Acute variceal hemorrhage with exsanguinating shock and high 6-week mortality (15-20%)",
      "Spontaneous Bacterial Peritonitis (SBP) requiring urgent diagnostic paracentesis (PMN >= 250/µL)",
      "Hepatocellular Carcinoma (HCC) arising in cirrhotic parenchyma (annual incidence 2-4%)"
    ],
    "specialistReferralCriteria": [
      "First episode of clinical decompensation (ascites, variceal bleed, encephalopathy) -> Refer to Hepatologist for MELD score and Liver Transplant evaluation",
      "Any suspicion of variceal hemorrhage (emergency endoscopic band ligation [EBL] + IV Octreotide)",
      "New discrete liver nodule on screening ultrasound"
    ]
  },
  "thyroid-problems": {
    "recommendedDiagnosticTests": [
      "Third-Generation Serum Thyroid-Stimulating Hormone (TSH) (Most sensitive screening test (Reference: 0.45 - 4.50 mIU/L). Elevated TSH indicates primary hypothyroidism; suppressed TSH (<0.01 mIU/L) indicates thyrotoxicosis)",
      "Serum Free Thyroxine (Free T4) and Free Triiodothyronine (Free T3) (Differentiates overt disease (abnormal Free T4/T3) from subclinical disease (normal Free T4/T3 with abnormal TSH))",
      "Anti-Thyroid Peroxidase (Anti-TPO) and Anti-Thyroglobulin (Anti-Tg) Antibodies (High titer (>100 IU/mL) confirms autoimmune Hashimoto's thyroiditis as underlying etiology)",
      "TSH-Receptor Antibodies (TRAb) / Thyroid-Stimulating Immunoglobulin (TSI) (Diagnostic confirmation of Graves' disease; distinguishes Graves' from toxic multinodular goiter or subacute thyroiditis)",
      "High-Resolution Thyroid Ultrasound with Color Flow Doppler (Assesses diffuse hypoechoic architecture, vascularity ('thyroid inferno' in Graves'), and TI-RADS risk classification of concurrent nodules)"
    ],
    "treatmentOptions": [
      "First-Line Synthetic Thyroid Hormone Replacement: Levothyroxine Sodium (T4) (1.6 mcg/kg ideal body weight/day (typical starting dose: 50 to 100 mcg daily; 25 mcg in elderly/CAD), Once daily in the morning, Lifelong ongoing replacement therapy) - CRITICAL COUNSELING: Must not take simultaneously with calcium, iron supplements, multivitamins, coffee, or antacids (space by >= 4 hours). Recheck serum TSH at 6 to 8 weeks after any dose adjustment.",
      "Thionamide Antithyroid Synthesis Inhibitor: Methimazole (Thiamazole) (10 to 30 mg daily (titrated to maintenance 5-10 mg OD), Once daily (OD), 12 to 18 months course for Graves' disease) - Inhibits thyroid peroxidase-mediated iodination of tyrosine residues. Preferred over PTU due to lower hepatotoxicity. CRITICAL WARNING: Educate patient to immediately stop drug and obtain urgent CBC if sore throat or fever occurs (screens for rare 0.2-0.5% agranulocytosis).",
      "Non-Selective Beta-Adrenergic Blocker: Propranolol Hydrochloride (20 to 40 mg, Three to four times daily (TID/QID), 2 to 4 weeks during acute thyrotoxic control) - Rapidly controls adrenergic thyrotoxic symptoms (tachycardia, tremor, heat intolerance, anxiety) and partially inhibits peripheral T4-to-T3 conversion at high doses."
    ],
    "possibleComplications": [
      "Myxedema Coma with high mortality (20-40%) requiring ICU IV levothyroxine and hydrocortisone",
      "Thyrotoxic Thyroid Storm provoked by trauma/surgery/infection",
      "Persistent Atrial Fibrillation, Embolic Stroke, and Osteoporosis from untreated hyperthyroidism"
    ],
    "specialistReferralCriteria": [
      "Suspected Thyroid Storm or Myxedema Coma (immediate emergency intensive care resuscitation)",
      "Severe Graves' ophthalmopathy with sight-threatening compressive optic neuropathy",
      "Thyroid nodule with suspicious ACR TI-RADS 4 or 5 ultrasound features requiring fine needle aspiration"
    ]
  },
  "anaemia": {
    "recommendedDiagnosticTests": [
      "Complete Blood Count (CBC) with Automated RBC Indices (Hemoglobin, Hematocrit, Mean Corpuscular Volume (MCV <80 fL microcytic in IDA; >100 fL macrocytic in B12/folate), MCH, Red Cell Distribution Width (RDW elevated in IDA))",
      "Serum Ferritin & Complete Iron Studies (Serum Iron, TIBC, Transferrin Saturation) (Serum Ferritin < 30 ng/mL diagnostic of iron deficiency (<100 ng/mL in inflammatory state); Transferrin Saturation (TSAT) < 16-20% confirms iron-deficient erythropoiesis)",
      "Peripheral Blood Smear Examination (Leishman Stained) (Reveals microcytic hypochromic erythrocytes with pencil/cigar cells in IDA; macro-ovalocytes and hypersegmented neutrophils (>=5 lobes) in B12/folate deficiency)",
      "Serum Vitamin B12 (Cyanocobalamin) & Serum Folate Assay (Serum B12 < 200 pg/mL diagnostic of deficiency; rule out pernicious anemia via Anti-Intrinsic Factor antibodies)",
      "Bidirectional Endoscopy (Gastroscopy + Colonoscopy) or FIT Test (MANDATORY in adult males and postmenopausal females with unexplained IDA to exclude occult gastrointestinal malignancy (colorectal/gastric cancer))"
    ],
    "treatmentOptions": [
      "First-Line Oral Hematinic Replacement: Ferrous Ascorbate / Ferrous Sulfate (Elemental Iron 100 mg) (100 mg elemental iron + 1.5 mg Folic Acid, Once daily or alternate-day dosing (e.g. Mon-Wed-Fri), 3 to 6 months (continue for 3 months after Hb normalizes to replenish marrow ferritin stores)) - Alternate-day dosing (100 mg elemental iron every other day) reduces hepcidin elevation, maximizes fractional iron absorption, and cuts gastrointestinal constipation/nausea by 50%.",
      "Parenteral Iron Formulation of Choice: Ferric Carboxymaltose (FCM) (500 to 1,000 mg elemental iron in 100-250 mL 0.9% Normal Saline, Single dose infused over 15 to 30 minutes (repeated once if Ganzoni iron deficit exceeds 1,000 mg), Single administration) - Indicated for severe anemia (Hb < 8 g/dL), oral iron intolerance, inflammatory bowel disease, 2nd/3rd trimester pregnancy, or CKD. Non-dextran shell eliminates anaphylaxis risk.",
      "Active Neurotropic Coenzyme: Methylcobalamin (Active Vitamin B12) (1,000 to 1,500 mcg, Oral: once daily; IM: 1,000 mcg alternate days x 1 week, then weekly x 4 weeks, 3 months (lifelong if pernicious anemia)) - Essential co-factor for methionine synthase; prevents irreversible demyelination of dorsal and lateral columns. Always correct B12 before or concurrently with folate to prevent subacute combined degeneration."
    ],
    "possibleComplications": [
      "Severe high-output congestive heart failure and myocardial ischemia",
      "Permanent irreversible sensory and motor paraparesis from Vitamin B12 subacute combined degeneration",
      "Premature birth, low birth weight, and perinatal mortality in maternal gestational anemia"
    ],
    "specialistReferralCriteria": [
      "Symptomatic severe anemia with Hemoglobin < 7.0 g/dL (hospitalize for packed RBC transfusion and parenteral iron)",
      "Unexplained iron deficiency anemia in adult male or postmenopausal woman (immediate referral for fast-track bidirectional GI endoscopy)",
      "Progressive neurological deficits (paresthesias, ataxia, spasticity) in suspected megaloblastic deficiency"
    ]
  },
  "breast-cancer": {
    "recommendedDiagnosticTests": [
      "Bilateral Diagnostic Digital Mammography & High-Frequency Ultrasound (BI-RADS 1-6 reporting: identifies microcalcifications (pleomorphic/branching), spiculation, architectural distortion, and axillary nodal architecture)",
      "Image-Guided Core Needle Biopsy (CNB) of Mass & Suspicious Axillary Nodes (Provides definitive histologic architecture (invasive ductal vs lobular) and distinguishes invasive carcinoma from in situ (DCIS/LCIS))",
      "Immunohistochemical (IHC) Biomarker Panel (ER, PR, HER2/neu, Ki-67) (MANDATORY: Establishes molecular subtype (Luminal A, Luminal B, HER2-enriched, Triple-Negative); HER2 equivocal (2+) reflexed to FISH testing)",
      "Germline Genetic Testing (BRCA1, BRCA2, PALB2, TP53) (Recommended for age <= 50 years, triple-negative breast cancer, bilateral disease, or strong family history of breast/ovarian cancer)",
      "Whole-Body 18F-FDG PET-CT or Contrast CT Chest/Abdomen/Pelvis + Bone Scintigraphy (Mandatory staging for clinical Stage IIB, Stage III, and inflammatory breast cancer to evaluate distant skeletal/visceral metastases)"
    ],
    "treatmentOptions": [
      "Targeted Anti-HER2 Monoclonal Antibodies (for HER2-Positive Carcinoma): Trastuzumab + Pertuzumab (Targeted HER2 Dual Blockade) (Trastuzumab 8 mg/kg loading -> 6 mg/kg Q3W + Pertuzumab 840 mg loading -> 420 mg Q3W, Every 3 weeks (Q3W), 1 year (18 cycles) in adjuvant/neoadjuvant setting) - Significantly prolongs disease-free and overall survival in HER2+ disease. Baseline and quarterly echocardiography mandatory (monitor for reversible drop in Left Ventricular Ejection Fraction [LVEF]).",
      "NCCN Category 1 Anthracycline-Taxane Adjuvant Regimen: Doxorubicin + Cyclophosphamide followed by Paclitaxel (AC-T Protocol) (Doxorubicin 60 mg/m² + Cyclophosphamide 600 mg/m² Q3W x 4 cycles -> Paclitaxel 80 mg/m² weekly x 12, AC every 21 days x 4 cycles, followed by weekly paclitaxel x 12 weeks, 5 to 6 months total systemic chemotherapy) - Premedicate with 5-HT3 antagonist (Ondansetron), Dexamethasone, and G-CSF pegfilgrastim support. Monitor cumulative lifetime doxorubicin dose (<450-500 mg/m²) to prevent cardiomyopathy.",
      "Third-Generation Aromatase Inhibitor (for Postmenopausal ER+/PR+ Breast Cancer): Anastrozole (or Letrozole / Exemestane) (1.0 mg (Letrozole 2.5 mg), Once daily (OD), 5 to 10 years ongoing adjuvant endocrine therapy) - Inhibits peripheral conversion of androgens to estrogens. Superior to Tamoxifen in postmenopausal women. Monitor bone mineral density with baseline and biennial DEXA scans; co-prescribe Calcium (1,200 mg) and Vitamin D3 (1,000 IU).",
      "Selective Estrogen Receptor Modulator (SERM - for Premenopausal ER+ Disease): Tamoxifen Citrate (20 mg, Once daily (OD), 5 to 10 years adjuvant therapy) - Competitively antagonizes estrogen receptors in breast tissue. Monitor for hot flashes, thromboembolism (DVT/PE risk), and annual gynecological screening for endometrial hyperplasia/carcinoma."
    ],
    "possibleComplications": [
      "Distant metastatic dissemination to bone, lung, liver, and central nervous system",
      "Post-axillary dissection secondary lymphedema of the ipsilateral upper extremity",
      "Chemotherapy-induced premature ovarian failure and cardiotoxicity"
    ],
    "specialistReferralCriteria": [
      "Any palpable dominant breast mass or BIRADS 4/5 imaging finding (immediate referral to Multidisciplinary Breast Tumor Board)",
      "Skin erythema/edema involving the breast without lactational mastitis (urgent surgical biopsy for inflammatory carcinoma)",
      "New-onset localized bone tenderness or neurological deficit in a breast cancer survivor"
    ]
  },
  "lung-cancer": {
    "recommendedDiagnosticTests": [
      "Contrast-Enhanced High-Resolution Chest CT including Adrenals (Defines primary pulmonary nodule/mass size, spiculation, mediastinal lymph node short-axis diameter (>10 mm suspicious), and adrenal metastases)",
      "Bronchoscopy with Endobronchial Ultrasound (EBUS-TBNA) or CT-Guided Transthoracic Core Biopsy (Essential for definitive histologic diagnosis (Adenocarcinoma vs Squamous Cell vs Small Cell) and mediastinal nodal staging (stations 2, 4, 7, 10, 11))",
      "Comprehensive Next-Generation Sequencing (NGS) Genomic Mutation Panel (MANDATORY in non-squamous NSCLC: Analyzes EGFR (exon 19 del, L858R), ALK, ROS1, BRAF V600E, KRAS G12C, MET exon 14 skipping, RET, NTRK fusions)",
      "Programmed Death-Ligand 1 (PD-L1) Immunohistochemistry (22C3 pharmDx Assay) (Tumor Proportion Score (TPS): TPS >= 50% qualifies for first-line single-agent immunotherapy (Pembrolizumab))",
      "Whole-Body 18F-FDG PET-CT and Contrast-Enhanced Brain MRI (Mandatory staging: excludes occult bone/liver metastases and asymptomatic intracranial brain metastases (present in 15-20% at diagnosis))"
    ],
    "treatmentOptions": [
      "Third-Generation CNS-Penetrant EGFR Tyrosine Kinase Inhibitor (TKI): Osimertinib Mesylate (80 mg, Once daily (OD), Adjuvant: 3 years (ADAURA protocol); Metastatic: ongoing until progression) - FLAURA and ADAURA landmark trials: First-line targeted therapy of choice for EGFR exon 19 del or L858R mutant NSCLC. Exceptional blood-brain barrier penetration prevents and treats brain metastases. Monitor for QTc prolongation and interstitial lung disease.",
      "Immune Checkpoint Inhibitor (First-Line for PD-L1 TPS >= 50%): Pembrolizumab (Anti-PD-1 Monoclonal Antibody) (200 mg every 3 weeks (or 400 mg every 6 weeks), Every 3 to 6 weeks, Up to 2 years (35 cycles) or until disease progression) - KEYNOTE-024/042 trials: Monotherapy first-line standard when PD-L1 >= 50% without EGFR/ALK alterations. Produces durable multi-year survival. Monitor for immune-related adverse events (irAEs: pneumonitis, colitis, hepatitis, thyroiditis).",
      "Platinum-Doublet Chemotherapy (First-Line for Advanced Non-Squamous NSCLC): Cisplatin + Pemetrexed (or Carboplatin AUC 5-6) (Cisplatin 75 mg/m² + Pemetrexed 500 mg/m², Every 21 days (Q3W), 4 cycles followed by maintenance Pemetrexed) - MANDATORY PREMEDICATION: Oral Folic Acid 400-1000 mcg daily and Vitamin B12 1000 mcg IM every 9 weeks (commenced 1-2 weeks prior to pemetrexed to prevent life-threatening hematologic/GI toxicity) plus Dexamethasone 4 mg BID x 3 days."
    ],
    "possibleComplications": [
      "Intracranial brain metastases with mass effect and cerebral edema",
      "Malignant pleural effusion requiring indwelling pleural catheter or talc pleurodesis",
      "Life-threatening pulmonary hemorrhage / hemoptysis and bronchial obstruction"
    ],
    "specialistReferralCriteria": [
      "Unexplained hemoptysis or pulmonary infiltrate persisting > 4 weeks on chest X-ray in smoker (immediate CT chest and Pulmonology/Thoracic Oncology referral)",
      "Clinical signs of Superior Vena Cava obstruction (urgent radiation therapy / endovascular stenting)",
      "Suspicion of spinal cord compression (emergency whole-spine MRI and neurosurgical decompression)"
    ]
  },
  "blood-cancer": {
    "recommendedDiagnosticTests": [
      "Bone Marrow Aspiration & Trephine Core Biopsy (Definitive diagnosis: morphology, Wright-Giemsa cytochemical staining; blast count >= 20% in marrow or blood defines Acute Leukemia (AML/ALL))",
      "Multiparameter Flow Cytometric Immunophenotyping (Distinguishes myeloid from lymphoid lineage: CD19, CD20, CD22, CD10 (B-ALL); CD3, CD5, CD7 (T-ALL); CD13, CD33, CD117, MPO (AML))",
      "Conventional Karyotyping & Fluorescence In Situ Hybridization (FISH) (Identifies diagnostic and prognostic translocations: t(9;22) BCR-ABL1 Philadelphia chromosome, t(15;17) PML-RARA in APL, inv(16), t(8;21), del(17p))",
      "Comprehensive Myeloid / Lymphoid NGS Mutation Panel (Detects actionable mutations: FLT3-ITD/TKD, NPM1, CEBPA, IDH1, IDH2, TP53, JAK2 V617F; guides targeted inhibitor therapy)",
      "Metabolic Tumor Lysis Panel (Uric Acid, Potassium, Phosphorus, Calcium, LDH, Creatinine) (MANDATORY STAT BASELINE: Cairo-Bishop criteria for laboratory and clinical tumor lysis syndrome screening prior to chemotherapy)"
    ],
    "treatmentOptions": [
      "First-Line BCR-ABL1 Tyrosine Kinase Inhibitor for Chronic Myeloid Leukemia (CML): Imatinib Mesylate (or Dasatinib / Nilotinib) (400 mg once daily (titrated to 600-800 mg if needed), Once daily (OD), Lifelong ongoing molecular remission therapy) - Revolutionized CML care: transforms fatal leukemia into manageable condition with near-normal life expectancy. Monitor quantitative RT-PCR for BCR-ABL1 transcripts every 3 months (Major Molecular Response target <= 0.1% at 12 months).",
      "Standard Gold-Standard Induction Chemotherapy for Acute Myeloid Leukemia (AML): Cytarabine + Daunorubicin ('7+3' Standard Induction Regimen) (Cytarabine 100-200 mg/m²/day continuous IV x 7 days + Daunorubicin 60-90 mg/m² IV push x 3 days, Continuous IV infusion over 7 days (Cytarabine) + daily IV push days 1-3 (Daunorubicin), Single 7-day induction cycle (re-biopsy marrow on Day 14/21)) - Requires intensive inpatient supportive care: transfusions (maintain platelets > 10,000-20,000/µL, Hb > 8.0 g/dL), prophylactic Posaconazole and Levofloxacin during profound neutropenia.",
      "Enzymatic Uric Acid Degradation for High-Risk Tumor Lysis Syndrome: Rasburicase (Recombinant Urate Oxidase) (0.2 mg/kg IV in 50 mL 0.9% Normal Saline, Once daily, 1 to 3 days during induction cytoreduction) - Rapidly converts insoluble uric acid into highly soluble allantoin (5-10 times more soluble). CONTRAINDICATION: G6PD deficiency (causes severe methemoglobinemia and acute hemolysis). Blood samples for uric acid must be collected in pre-chilled heparin tubes on ice.",
      "Xanthine Oxidase Inhibitor for Low-to-Intermediate Risk TLS: Allopurinol (300 mg, Once daily (OD), During cytoreductive phase) - Blocks synthesis of new uric acid. Prevents hyperuricemic crystal nephropathy."
    ],
    "possibleComplications": [
      "Catastrophic neutropenic typhlitis or invasive fungal infection (Aspergillus / Mucorales)",
      "Fatal intracerebral or pulmonary hemorrhage from profound thrombocytopenia or DIC",
      "Acute anuric renal failure secondary to tumor lysis syndrome"
    ],
    "specialistReferralCriteria": [
      "Presence of peripheral blood blasts on routine smear (immediate emergency referral to tertiary Leukemia/BMT unit)",
      "Suspected Acute Promyelocytic Leukemia (start All-Trans Retinoic Acid [ATRA] immediately without waiting for cytogenetics to prevent fatal coagulopathy)",
      "WBC > 50,000/µL with respiratory or neurologic symptoms (urgent leukapheresis / hydroxyurea cytoreduction)"
    ]
  },
  "skin-cancer": {
    "recommendedDiagnosticTests": [
      "Full-Body Digital Dermoscopy & Total Body Photography (Identifies dermatoscopic hallmarks: atypical pigment network, regression structures, blue-white veil, irregular streaks/pseudopods)",
      "Complete Excisional Biopsy with 1 to 2 mm Margins (MANDATORY: Full-thickness elliptical excision preferred over shave/punch; preserves micro-architecture for precise Breslow tumor thickness (mm))",
      "Histopathologic Staging: Breslow Depth, Ulceration, Mitotic Rate, Margins (Breslow depth in millimeters is single most critical T-category prognostic factor; determines indication for Sentinel Lymph Node Biopsy (SLNB))",
      "BRAF V600 Mutation Molecular Testing (V600E / V600K) (MANDATORY in Stage III and Stage IV melanoma: Identifies candidates for targeted BRAF/MEK inhibitor combination therapy)",
      "Sentinel Lymph Node Biopsy (SLNB) with Technetium-99m & Blue Dye (Recommended for melanoma with Breslow thickness > 0.8 mm (or <0.8 mm with ulceration); accurate pathological regional nodal staging)"
    ],
    "treatmentOptions": [
      "Targeted MAPK Pathway Blockade for BRAF V600 Mutant Melanoma: Dabrafenib + Trametinib (Dual BRAF + MEK Kinase Inhibition) (Dabrafenib 150 mg BID + Trametinib 2 mg OD, Dabrafenib: twice daily; Trametinib: once daily, 12 months adjuvant in Stage III; ongoing until progression in Stage IV) - COMBI-d / COMBI-AD trials: Dramatic rapid tumor regression and overall survival improvement. Dual blockade prevents paradoxical MAPK reactivation and cutaneous SCC. Educate patient on recognizing pyrexia syndrome (manage with drug holds and paracetamol).",
      "Dual Checkpoint Immunotherapy for Advanced / Metastatic Melanoma: Nivolumab + Ipilimumab (Dual PD-1 + CTLA-4 Immune Checkpoint Blockade) (Nivolumab 1 mg/kg + Ipilimumab 3 mg/kg IV every 3 weeks x 4 doses -> Nivolumab 480 mg Q4W maintenance, Every 3 weeks x 4 cycles, then every 4 weeks, Up to 2 years or until disease progression) - CheckMate 067 trial: Unprecedented 50%+ 5-year overall survival in metastatic melanoma. High risk of autoimmune immune-related adverse events (irAEs: severe colitis, hypophysitis, hepatitis); requires prompt systemic corticosteroid protocol.",
      "Topical Toll-Like Receptor-7 (TLR-7) Immune Response Modifier: Imiquimod 5% Topical Cream (5% w/w cream (single-use sachet), 5 times weekly at bedtime, 6 to 12 weeks) - Indicated for superficial Basal Cell Carcinoma and Lentigo Maligna in non-surgical candidates or cosmetically sensitive facial zones."
    ],
    "possibleComplications": [
      "Distant systemic metastatic dissemination to brain, liver, lungs, and bowel (melanoma has highest tropism for brain)",
      "Extensive local tissue destruction ('rodent ulcer' invasion into facial bone and orbit in neglected BCC)",
      "Secondary perineural invasion and cranial nerve neuropathies in cutaneous SCC"
    ],
    "specialistReferralCriteria": [
      "Any pigmented skin lesion with positive ABCDE criteria or Breslow thickness > 0.8 mm (refer immediately to Surgical Oncologist / Melanoma Specialist)",
      "Non-healing ulcer on face or lip lasting > 4 weeks",
      "Melanoma patient presenting with headache or focal neurologic symptoms (urgent contrast Brain MRI)"
    ]
  },
  "prostate-cancer": {
    "recommendedDiagnosticTests": [
      "Serum Total Prostate-Specific Antigen (Total PSA) & Free-to-Total PSA Ratio (Reference range age-adjusted; PSA > 4.0 ng/mL warrants clinical evaluation; Free/Total ratio < 15% increases suspicion of cancer over BPH)",
      "Multiparametric Prostate MRI (mpMRI via PI-RADS v2.1 Criteria) (PI-RADS 1-5 scoring: T2-weighted, Diffusion-Weighted Imaging (DWI/ADC), Dynamic Contrast Enhancement (DCE); identifies index suspicious lesions before biopsy)",
      "MRI-Transrectal Ultrasound (TRUS) Fusion Targeted Core Needle Biopsy (Combines mpMRI lesion targeting with 12-core systematic template; assigns ISUP Gleason Grade Group 1 (3+3) to Group 5 (4+5, 5+4, 5+5))",
      "68Ga-PSMA-11 PET-CT Whole-Body Molecular Imaging (Highest sensitivity and specificity for nodal and distant osteoblastic metastases in intermediate-to-high risk or biochemical recurrence)",
      "Serum Alkaline Phosphatase & Serum Calcium (Significantly elevated in widespread osteoblastic skeletal metastatic disease)"
    ],
    "treatmentOptions": [
      "LHRH / GnRH Agonist for Androgen Deprivation Therapy (ADT): Leuprolide Acetate (or Goserelin Acetate Depot) (22.5 mg (3-month depot) or 45 mg (6-month depot), Every 3 to 6 months, Adjuvant with radiation: 2-3 years; Metastatic: lifelong ongoing) - Suppresses pituitary LH release, downregulating testicular testosterone production to castrate levels (<50 ng/dL). MANDATORY: Co-administer oral Bicalutamide for 2-4 weeks prior to initial depot to prevent symptomatic clinical tumor flare caused by initial LH surge.",
      "Second-Generation Androgen Receptor Signaling Inhibitor (ARSI): Enzalutamide (or Apalutamide / Darolutamide) (160 mg, Once daily (OD), Ongoing until disease progression) - ARCHES / PROSPER / PREVAIL trials: Competitively inhibits androgen binding, nuclear translocation, and DNA association. Markedly improves overall survival in metastatic hormone-sensitive (mHSPC) and castration-resistant (CRPC) disease. Monitor for fatigue, hypertension, and rare seizure risk.",
      "Uroselective Alpha-1A Adrenergic Antagonist: Tamsulosin Hydrochloride (0.4 mg, Once daily (OD), Ongoing as needed for voiding symptoms) - Relaxes smooth muscle tone in prostate stroma and bladder neck; improves peak urinary flow rate and relieves obstructive voiding symptoms.",
      "Bone-Targeted Antiresorptive Agent: Zoledronic Acid (or Denosumab) (4.0 mg in 100 mL Normal Saline (Denosumab 120 mg SC), Every 4 weeks, Ongoing in metastatic bone disease) - Significantly delays Skeletal-Related Events (pathological fractures, spinal cord compression, need for radiation). Ensure baseline dental clearance to prevent osteonecrosis of the jaw (ONJ); co-prescribe Calcium + Vitamin D."
    ],
    "possibleComplications": [
      "Extensive osteoblastic skeletal metastases with intractable bone pain and pathological fractures",
      "Malignant spinal cord compression with irreversible lower body paralysis",
      "Complete urinary outlet obstruction and bilateral hydronephrosis with renal failure"
    ],
    "specialistReferralCriteria": [
      "Confirmed Gleason score >= 7 (4+3) or PSA > 20 ng/mL (refer to Uro-Oncology multidisciplinary team for radical prostatectomy vs definitive EBRT+ADT)",
      "Acute back pain with new lower limb weakness in a prostate cancer patient (EMERGENCY whole-spine MRI for impending cord compression)",
      "Rising PSA post-radical prostatectomy (>0.2 ng/mL) or post-radiotherapy (nadir + 2 ng/mL - biochemical recurrence)"
    ]
  },
  "cervical-cancer": {
    "recommendedDiagnosticTests": [
      "High-Risk HPV DNA Testing & Liquid-Based Cytology (LBC / Pap Smear) (WHO recommended primary screening modality: detects E6/E7 oncogene expression of hrHPV genotypes)",
      "Colposcopy with Acetic Acid & Lugol's Iodine Directed Biopsy + ECC (Magnified colposcopic visualization of abnormal transformation zone (acetowhite epithelium, punctation, mosaicism) and punch biopsy plus endocervical curettage)",
      "Pelvic High-Resolution Contrast MRI (Optimal imaging modality to accurately measure cervical tumor diameter, depth of stromal invasion, vaginal extension, and parametrial invasion (FIGO stage IIB))",
      "Whole-Body 18F-FDG PET-CT Staging Scan (Essential to evaluate pelvic and para-aortic retroperitoneal lymph node metastases and distant visceral dissemination)",
      "Renal Function Panel (Serum Creatinine, BUN) & Renal Ultrasound (MANDATORY: Screens for bilateral or unilateral obstructive uropathy / hydronephrosis (which automatically upstages to FIGO Stage IIIC2/IVA))"
    ],
    "treatmentOptions": [
      "Radiosensitizing Chemotherapy (NCCN Standard for Locally Advanced Stage IB3-IVA): Cisplatin (Concurrent Chemoradiotherapy - CCRT) (40 mg/m² (maximum capped at 70 mg per dose), Once weekly during external beam pelvic radiotherapy, 5 to 6 weekly cycles concomitant with EBRT) - Inhibits sublethal radiation damage repair in cervical tumor cells; significantly improves overall survival. Monitor serum creatinine and electrolytes weekly (hold if eGFR < 50 mL/min); aggressive antiemetic pre-medication.",
      "First-Line Chemotherapy + Anti-VEGF Protocol (GOG 240 Trial): Paclitaxel + Carboplatin + Bevacizumab (for Recurrent / Metastatic Disease) (Paclitaxel 175 mg/m² + Carboplatin AUC 5 + Bevacizumab 15 mg/kg, Every 21 days (Q3W), 6 cycles followed by maintenance Bevacizumab) - First systemic regimen to cross the 12-month median overall survival threshold in metastatic cervical cancer. Premedicate with dexamethasone, diphenhydramine, and ranitidine; monitor blood pressure and urinalysis for proteinuria.",
      "Antifibrinolytic Hemostatic Agent: Tranexamic Acid (500 mg to 1,000 mg, Three times daily (TID) as needed, 3 to 5 days during bleeding episodes) - Rapidly controls acute excessive tumor-related vaginal oozing; does not increase systemic thromboembolism risk when used short-term."
    ],
    "possibleComplications": [
      "Severe bilateral obstructive uropathy and uremic renal failure requiring emergent percutaneous nephrostomy (PCN)",
      "Catastrophic acute torrential vaginal hemorrhage from tumor erosion into uterine arteries",
      "Radiation-induced chronic proctitis, radiation cystitis, and rectovaginal fistula"
    ],
    "specialistReferralCriteria": [
      "Confirmed cervical biopsy showing invasive carcinoma or CIN III (immediate referral to Gynecologic Oncology multidisciplinary team)",
      "Gross hematuria, fecaluria, or watery leakage from vagina (urgent examination under anesthesia [EUA] for fistulae)",
      "Elevated serum creatinine with hydronephrosis in known cervical cancer"
    ]
  },
  "stomach-cancer": {
    "recommendedDiagnosticTests": [
      "Upper Gastrointestinal Endoscopy (EGD) with Multiple Mucosal Biopsies (Direct visualization: MANDATORY >= 6 to 8 biopsies from ulcer margin and base to achieve >98% diagnostic accuracy and histological typing)",
      "Contrast-Enhanced CT of Chest, Abdomen, and Pelvis (Evaluates gastric wall thickness, perigastric lymphadenopathy, hepatic metastases, and peritoneal carcinomatosis)",
      "Diagnostic Staging Laparoscopy with Peritoneal Washings Cytology (MANDATORY in cT1b or higher resectable disease: detects radiographically occult peritoneal micrometastases in 20-30% of cases, avoiding futile non-curative laparotomy)",
      "HER2/neu Immunohistochemistry (IHC) & In Situ Hybridization (FISH) (MANDATORY in advanced/metastatic disease: IHC 3+ or IHC 2+/FISH positive qualifies for targeted anti-HER2 therapy (Trastuzumab))",
      "Mismatch Repair / Microsatellite Instability (MMR/MSI) & PD-L1 CPS (Combined Positive Score (CPS >= 5): guides addition of Nivolumab or Pembrolizumab immunotherapy to first-line chemotherapy)"
    ],
    "treatmentOptions": [
      "NCCN Category 1 Perioperative Standard for Resectable Gastric / GEJ Adenocarcinoma: FLOT Chemotherapy Regimen (Perioperative Protocol) (Docetaxel 50 mg/m² + Oxaliplatin 85 mg/m² + Leucovorin 200 mg/m² + 5-Fluorouracil 2,600 mg/m² continuous IV over 24 hours, Every 14 days (Q2W), 4 cycles preoperative followed by 4 cycles postoperative (total 8 cycles)) - FLOT4 trial: Substantially superior pathological complete response and 5-year overall survival (45% vs 36%) compared to older ECF/ECX regimens. Requires prophylactic G-CSF (pegfilgrastim) and intensive antiemetic prophylaxis.",
      "Anti-HER2 Targeted Monoclonal Antibody (ToGA Protocol): Trastuzumab (for HER2-Positive Advanced Gastric Cancer) (8 mg/kg IV loading dose -> 6 mg/kg maintenance IV every 3 weeks, Every 3 weeks (Q3W), Ongoing until disease progression) - Significantly prolongs overall survival in HER2-overexpressing gastric adenocarcinoma. Baseline and every 3-month echocardiographic LVEF monitoring mandatory.",
      "Proton Pump Inhibitor for Acid Suppression & Mucosal Protection: Pantoprazole Sodium (40 mg, Twice daily (BID), Ongoing supportive therapy) - Controls tumor-associated acid erosion, mitigates mucosal capillary oozing, and enhances patient tolerance of oral intake."
    ],
    "possibleComplications": [
      "Severe gastric outlet obstruction requiring endoscopic self-expanding metal stent (SEMS) placement or gastrojejunostomy",
      "Massive upper gastrointestinal hemorrhage from ulcerating tumor bed",
      "Rapid malignant cachexia and nutritional exhaustion from profound anorexia and malabsorption"
    ],
    "specialistReferralCriteria": [
      "New-onset dyspepsia in any patient age > 55 years or with ANY red flag symptom (immediate fast-track upper GI endoscopy within 2 weeks)",
      "Biopsy-proven gastric adenocarcinoma (referral to Upper GI Surgical Oncology Multidisciplinary Tumor Board)",
      "Sudden acute peritonitis from gastric tumor perforation (emergency surgical intervention)"
    ]
  },
  "liver-cancer": {
    "recommendedDiagnosticTests": [
      "Dynamic Multiphase Contrast-Enhanced Liver MRI or Multidetector CT (AASLD Non-Invasive Diagnostic Criteria: Hallmark arterial phase hyperenhancement ('wash-in') followed by venous/delayed phase hypointensity ('washout') in cirrhosis is 100% specific; biopsy not required)",
      "Serum Alpha-Fetoprotein (AFP) & PIVKA-II (DCP) (Serum AFP > 400 ng/mL in high-risk cirrhotic highly predictive of HCC; serial AFP tracks therapeutic response and recurrence)",
      "Child-Pugh Score & ALBI Grade (Albumin-Bilirubin Functional Reserve) (MANDATORY: Classifies Child-Pugh A (5-6 points), B (7-9 points), C (10-15 points); determines eligibility for resection, ablation, TACE, or systemic therapy)",
      "Upper GI Endoscopy (EGD) for Variceal Screening (MANDATORY prior to initiating anti-VEGF therapy (Bevacizumab): screen and prophylactically band high-risk esophageal varices to prevent fatal hemorrhage)",
      "Chest CT & 99mTc Bone Scintigraphy (Mandatory to exclude extrahepatic pulmonary (most common) and skeletal metastases prior to surgical resection or liver transplantation)"
    ],
    "treatmentOptions": [
      "NCCN & AASLD Preferred First-Line Systemic Therapy for Unresectable HCC: Atezolizumab + Bevacizumab (IMbrave150 Protocol) (Atezolizumab 1,200 mg IV + Bevacizumab 15 mg/kg IV, Every 3 weeks (Q3W), Ongoing until disease progression or unacceptable toxicity) - Combines PD-L1 immune checkpoint inhibition with VEGF anti-angiogenic blockade. Significantly superior overall and progression-free survival compared to sorafenib. Contraindicated in untreated high-risk esophageal varices (bleeding risk) or severe autoimmune disease.",
      "First-Line Multi-Receptor Tyrosine Kinase Inhibitor (VEGFR 1-3, FGFR 1-4, PDGFR, RET): Lenvatinib Mesylate (8 mg once daily (for body weight < 60 kg) or 12 mg once daily (for body weight >= 60 kg), Once daily (OD), Ongoing until disease progression) - REFLECT trial: Non-inferior overall survival with superior objective response rate (24% vs 9%) over sorafenib. High efficacy in viral and non-viral HCC. Monitor daily blood pressure (manage hypertension aggressively) and check urine dipstick for proteinuria.",
      "Established First-Line Oral Multikinase Inhibitor Alternative: Sorafenib Tosylate (400 mg (two 200 mg tablets), Twice daily (BID), Ongoing until progression) - SHARP landmark trial: First systemic agent to demonstrate survival benefit in advanced HCC. Counsel patient on Hand-Foot Skin Reaction (manage with urea creams and dose titration)."
    ],
    "possibleComplications": [
      "Spontaneous acute intraperitoneal hemoperitoneum from tumor rupture with 30-50% acute mortality",
      "Accelerated liver failure and hepatic encephalopathy from extensive parenchymal replacement",
      "Portal hypertension crisis with massive exsanguinating variceal bleeding"
    ],
    "specialistReferralCriteria": [
      "New solitary liver lesion in a cirrhotic patient meeting Milan criteria (single nodule <=5 cm, or up to 3 nodules each <=3 cm) -> URGENT referral for Liver Transplantation",
      "Suspected HCC meeting surgical resection criteria (Child-Pugh A, normal bilirubin, no portal hypertension)",
      "Sudden acute severe abdominal pain with falling hemoglobin in known HCC patient (emergency hepatic transcatheter arterial embolization [TAE])"
    ]
  },
  "brain-cancer": {
    "recommendedDiagnosticTests": [
      "Multi-Sequence Contrast-Enhanced Brain MRI (T1, T2, FLAIR, T1+Gadolinium, DWI) (Hallmark appearance: Thick, irregular, nodular ring-enhancing mass with central hypointense necrosis and extensive surrounding FLAIR hyperintense vasogenic edema)",
      "Magnetic Resonance Spectroscopy (MRS) & Perfusion MRI (PWI) (Spectroscopy shows elevated Choline peak (membrane turnover), depressed N-acetylaspartate (NAA; neuronal loss), and prominent Lipid/Lactate necrosis peak; PWI shows high rCBV)",
      "Stereotactic Biopsy or Maximal Safe Surgical Resection Histopathology (WHO 2021 CNS Classification: pleomorphic fibrillary astrocytes, robust microvascular endothelial glomeruloid proliferation, and pathognomonic pseudopalisading necrosis)",
      "Molecular Biomarker Panel: IDH1/2 Mutation, MGMT Promoter Methylation, 1p/19q (CRITICAL: MGMT promoter methylation predicts dramatic sensitivity to Temozolomide; IDH-wildtype confirms Glioblastoma; rules out 1p/19q codeleted oligodendroglioma)",
      "Functional MRI (fMRI) & Diffusion Tensor Imaging (DTI) Tractography (Maps corticospinal motor tracts and Broca/Wernicke language areas to maximize safe extent of resection while preserving functional neurological eloquence)"
    ],
    "treatmentOptions": [
      "Alkylating Chemotherapy Standard of Care (Stupp Landmark Regimen): Temozolomide (TMZ - Stupp Protocol) (Concomitant: 75 mg/m²/day daily x 42 days during radiotherapy -> Maintenance: 150-200 mg/m²/day for 5 days every 28 days x 6 cycles, Daily during RT; Days 1 to 5 of every 28-day cycle during maintenance, 6 weeks concurrent chemoradiotherapy followed by 6 cycles maintenance) - Crosses blood-brain barrier with 100% oral bioavailability; methylation of O6-guanine causes DNA double-strand breaks. Dramatic survival benefit in MGMT-methylated tumors. Premedicate with Ondansetron 8 mg 30-60 mins prior to each dose.",
      "High-Potency Glucocorticoid for Vasogenic Cerebral Edema: Dexamethasone Sodium Phosphate (4 to 16 mg daily in divided doses (e.g. 4 mg BID or QID, tapered rapidly to lowest effective dose), Two to four times daily, Shortest duration necessary to control peritumoral edema) - Rapidly repairs breached blood-brain barrier tight junctions; alleviates headache and focal deficits within 24-48 hours. Co-prescribe PPI (Pantoprazole); monitor blood glucose daily.",
      "First-Line Antiepileptic Agent for Brain Tumor-Related Epilepsy (BTRE): Levetiracetam (500 to 1,000 mg, Twice daily (BID), Ongoing maintenance) - Binds SV2A synaptic vesicle protein. First choice in neuro-oncology: zero hepatic cytochrome P450 enzyme induction (unlike phenytoin/carbamazepine), eliminating drug interactions with chemotherapy and steroids.",
      "Pneumocystis jirovecii Pneumonia (PJP) Chemoprophylaxis: Trimethoprim-Sulfamethoxazole (TMP-SMX) (1 Double-Strength Tablet (160 mg TMP / 800 mg SMX), Three times weekly (e.g. Mon-Wed-Fri), Throughout concurrent Temozolomide + Radiotherapy) - MANDATORY during concurrent chemoradiotherapy and steroid use due to profound lymphopenia (CD4 count < 200/µL)."
    ],
    "possibleComplications": [
      "Fatal cerebral tentorial or tonsillar herniation from uncontrollable malignant brain edema",
      "Intratumoral apoplexy / acute intracranial hemorrhage into glioblastoma bed",
      "Profound cognitive deterioration and loss of functional independence"
    ],
    "specialistReferralCriteria": [
      "New-onset adult seizure or progressive focal neurological deficit with ring-enhancing mass (immediate emergency transfer to Neurosurgery / Neuro-Oncology)",
      "Signs of impending brain herniation (immediate IV Mannitol 20% 1 g/kg, IV Dexamethasone 16 mg, and urgent surgical decompression)",
      "Suspected tumor recurrence vs radiation necrosis (refer for Advanced PET/Perfusion MRI and Re-resection / Tumor Treating Fields [Optune])"
    ]
  },
  "colon-cancer": {
    "recommendedDiagnosticTests": [
      "Complete Optical Diagnostic Colonoscopy with Multiple Biopsies (Direct mucosal visualization of entire colon to cecum: identifies primary adenocarcinoma and synchronous neoplasms (present in 3-5%); multiple biopsies provide tissue architecture)",
      "Serum Carcinoembryonic Antigen (CEA) (Baseline prognostic benchmark and post-treatment surveillance marker: elevated baseline CEA (>5 ng/mL) correlates with nodal/metastatic disease; essential for monitoring recurrence)",
      "Contrast-Enhanced CT of Chest, Abdomen, and Pelvis (Accurately stages primary colonic wall invasion depth (T), regional mesenteric nodal involvement (N), and distant hepatic (most common) and pulmonary (M) metastases)",
      "High-Resolution Thin-Slice Pelvic MRI (Precisely evaluates relationship of rectal tumor to Circumferential Resection Margin (CRM), depth of extramural vascular invasion (EMVI), and mesorectal fascia)",
      "Comprehensive Biomarker Panel: MMR/MSI, KRAS, NRAS, BRAF V600E, HER2 (MANDATORY in metastatic disease: Mismatch Repair (dMMR/MSI-H) predicts curative response to Pembrolizumab; RAS/BRAF wild-type required for anti-EGFR therapy (Cetuximab))"
    ],
    "treatmentOptions": [
      "NCCN Category 1 Standard Adjuvant Chemotherapy for Stage III & High-Risk Stage II: mFOLFOX6 Adjuvant Chemotherapy Protocol (Oxaliplatin 85 mg/m² IV + Leucovorin 400 mg/m² IV + 5-Fluorouracil 400 mg/m² IV bolus followed by 5-FU 2,400 mg/m² continuous IV over 46 hours, Every 14 days (Q2W), 6 months (12 cycles) or 3 months (CAPOX) for low-risk Stage III colon cancer (IDEA Trial)) - MOSAIC trial: Substantially improves disease-free and overall survival. CRITICAL COUNSELING: Oxaliplatin causes acute cold-induced peripheral sensory neuropathy (educate patient to avoid cold drinks, touching cold metal, or breathing cold air during infusion week).",
      "NCCN Category 1 Preferred First-Line Therapy for dMMR / MSI-High Metastatic Disease: Pembrolizumab (Anti-PD-1 Monotherapy for MSI-H / dMMR Metastatic CRC) (200 mg every 3 weeks (or 400 mg every 6 weeks), Every 3 to 6 weeks, Up to 2 years or until disease progression) - KEYNOTE-177 landmark trial: Doubled progression-free survival (16.5 vs 8.2 months) compared to standard chemotherapy plus targeted therapy, with dramatically lower toxicities. Ineffective in proficient MMR (pMMR) tumors.",
      "Anti-EGFR Monoclonal Antibody (Strictly for KRAS/NRAS/BRAF Wild-Type Left-Sided Tumors): Cetuximab (or Panitumumab) (500 mg/m² IV every 2 weeks (or 400 mg/m² loading -> 250 mg/m² weekly), Every 14 days (Q2W), Ongoing in metastatic setting) - TAILOR & FIRE-3 trials: Robust overall survival extension strictly in RAS-wildtype tumors originating from the splenic flexure to rectum (left-sided). Completely ineffective and potentially detrimental in RAS-mutant tumors. Causes acneiform papulopustular rash (treat with oral minocycline).",
      "Peripheral Mu-Opioid Receptor Agonist Antidiarrheal: Loperamide Hydrochloride (2 to 4 mg (initial dose 4 mg, then 2 mg after each unformed stool; max 16 mg/day), As needed (SOS), Acute symptomatic control) - Controls chemotherapy-induced diarrhea (especially when combining with Irinotecan [FOLFIRI]). If diarrhea persists >24h despite loperamide, escalate to oral Octreotide."
    ],
    "possibleComplications": [
      "Acute complete large bowel obstruction requiring emergency decompressive colostomy or self-expanding metal stenting",
      "Hepatic metastatic failure from extensive bilobar parenchymal replacement",
      "Oxaliplatin-induced chronic cumulative sensory peripheral neuropathy"
    ],
    "specialistReferralCriteria": [
      "Any unexplained rectal bleeding or iron deficiency anemia in patient age >= 45 years (fast-track referral for screening/diagnostic colonoscopy)",
      "Biopsy-proven colorectal cancer (referral to Colorectal Multidisciplinary Oncology Team for complete mesocolic excision [CME] / total mesorectal excision [TME])",
      "Isolated resectable colorectal liver metastases (referral to Hepato-Pancreato-Biliary [HPB] surgeon for staged or synchronous metastasectomy)"
    ]
  },
  "pancreatic-cancer": {
    "recommendedDiagnosticTests": [
      "Dual-Phase Pancreatic Protocol Contrast Multidetector CT (MDCT) (Thin-slice (<=1 mm) parenchymal and portal venous phase: defines tumor resectability based on relationship to Superior Mesenteric Artery (SMA), Celiac Axis, and SMV-Portal vein confluence)",
      "Serum Carbohydrate Antigen 19-9 (CA 19-9) (Diagnostic and prognostic monitoring marker: CA 19-9 > 100 U/mL suggests unresectability; > 1,000 U/mL indicates metastatic disease. NOTE: False-negative in Lewis blood group antigen-negative [Le a-b-] patients (7-10% of population))",
      "Endoscopic Ultrasound (EUS) with Fine Needle Aspiration/Biopsy (FNA/FNB) (Highest spatial resolution for imaging pancreatic head/body masses and vascular interfaces; core biopsy (FNB) provides definitive histopathological confirmation)",
      "Magnetic Resonance Cholangiopancreatography (MRCP) (Demonstrates pathognomonic 'Double-Duct Sign': simultaneous smooth stricture and dilatation of both the Common Bile Duct and Main Pancreatic Duct)",
      "Germline & Somatic Genomic Testing (BRCA1, BRCA2, PALB2, ATM, KRAS, MSI/MMR) (MANDATORY in all diagnosed PDAC: BRCA1/2 or PALB2 mutations qualify for maintenance PARP inhibitor therapy (Olaparib) following platinum induction)"
    ],
    "treatmentOptions": [
      "NCCN Category 1 Preferred Adjuvant & First-Line Regimen (ECOG 0-1): Modified FOLFIRINOX (mFOLFIRINOX Adjuvant Protocol) (Oxaliplatin 85 mg/m² + Leucovorin 400 mg/m² + Irinotecan 150 mg/m² + 5-FU 2,400 mg/m² continuous IV over 46 hours (no 5-FU bolus), Every 14 days (Q2W), 6 months (12 cycles) in adjuvant or neoadjuvant setting) - PRODIGE 24 landmark trial: Extended median overall survival to an unprecedented 54.4 months in resected PDAC. Highly toxic: requires primary G-CSF pegfilgrastim support, intensive 5-HT3 antiemetics, and active diarrhea monitoring.",
      "First-Line Alternative Systemic Regimen (MPACT Trial): Gemcitabine + Nab-Paclitaxel (Abraxane) (Gemcitabine 1,000 mg/m² + Nab-Paclitaxel 125 mg/m², Administered on Days 1, 8, and 15 of every 28-day cycle, Ongoing until disease progression) - First-line regimen for patients with borderline performance status (ECOG 1-2) or contraindications to FOLFIRINOX. Favorable tolerability profile. Monitor for neutropenia and peripheral sensory neuropathy.",
      "Mandatory Exocrine Pancreatic Insufficiency Replacement: Pancrelipase (Pancreatic Enzyme Replacement Therapy - PERT) (25,000 to 50,000 USP lipase units per full meal; 10,000 to 25,000 units per snack, Taken with every single meal and snack throughout the day, Lifelong ongoing replacement) - ESSENTIAL SUPPORTIVE CARE: Pancreatic duct obstruction causes profound malabsorptive steatorrhea and malnutrition. PERT eliminates steatorrhea, restores fat-soluble vitamin absorption, and halts cachexia.",
      "WHO Step 3 Strong Opioid Analgesia for Severe Splanchnic Pain: Morphine Sulfate (or Fentanyl Transdermal Patch) (Morphine 10 to 30 mg oral Q4H (or Fentanyl 25 to 50 mcg/hr patch changed Q72H), Scheduled round-the-clock with immediate-release rescue doses for breakthrough pain, Ongoing analgesic management) - Pancreatic cancer produces excruciating retroperitoneal celiac plexus neuralgia. Co-prescribe stimulant laxatives (Senna); refer for CT- or EUS-guided percutaneous Celiac Plexus Neurolysis (CPN) for refractory pain."
    ],
    "possibleComplications": [
      "Severe biliary sepsis / acute ascending cholangitis from occluded biliary stent",
      "Profound intractable pancreatic cancer cachexia with irreversible muscle loss",
      "High incidence of thromboembolism (deep vein thrombosis and fatal pulmonary embolism)"
    ],
    "specialistReferralCriteria": [
      "Painless jaundice in any adult (emergency same-week referral for Pancreatic Protocol CT and Endoscopic Biliary Stenting via ERCP)",
      "Resectable or borderline resectable pancreatic mass on imaging (referral to high-volume Pancreatic Surgery Center for Pancreaticoduodenectomy [Whipple Procedure])",
      "Unrelenting back pain in known pancreatic cancer (referral to Pain Management for Celiac Plexus Neurolysis)"
    ]
  },
  "ovarian-cancer": {
    "recommendedDiagnosticTests": [
      "Transvaginal and Transabdominal Pelvic Color Doppler Ultrasound (TVS) (IOTA ultrasound rules: distinguishes benign from malignant adnexal cysts; identifies thick septations (>3 mm), solid papillary projections, vascular flow, and free peritoneal fluid)",
      "Serum Cancer Antigen 125 (CA-125) & HE4 (ROMA Index) (Risk of Ovarian Malignancy Algorithm (ROMA): combines CA-125 and Human Epididymis Protein 4 (HE4) with menopausal status to stratify pre- and post-menopausal malignancy risk)",
      "Contrast-Enhanced CT of Chest, Abdomen, and Pelvis (Evaluates extent of peritoneal carcinomatosis, omental cake, mesenteric deposits, diaphragmatic implants, pelvic/retroperitoneal lymphadenopathy, and pleural effusion)",
      "Diagnostic Staging Laparoscopy (Fagotti Predictive Score) (Fagotti score assesses whether complete macroscopic cytoreduction (R0 resection) is achievable via primary debulking surgery vs initial neoadjuvant chemotherapy)",
      "Germline & Somatic BRCA1/BRCA2 and Homologous Recombination Deficiency (HRD) (MANDATORY in all epithelial ovarian cancers: BRCA mutations or HRD genomic scar positivity predicts extraordinary sensitivity and survival benefit from PARP inhibitor maintenance)"
    ],
    "treatmentOptions": [
      "NCCN Category 1 Standard of Care First-Line Chemotherapy: Paclitaxel + Carboplatin Chemotherapy Protocol (Paclitaxel 175 mg/m² (infused over 3 hours) + Carboplatin AUC 5 to 6 (infused over 1 hour), Every 21 days (Q3W), 6 cycles total (adjuvant or 3 neoadjuvant + 3 adjuvant cycles)) - GOG 111 & 158 landmark trials: Achieves >80% initial clinical response rate in high-grade serous carcinoma. MANDATORY PREMEDICATION: Dexamethasone 20 mg PO at 12h and 6h prior, plus Diphenhydramine 50 mg IV and Famotidine 20 mg IV 30 mins prior to paclitaxel to prevent severe hypersensitivity reactions.",
      "Targeted Poly (ADP-Ribose) Polymerase (PARP) Inhibitor Maintenance: Olaparib (or Niraparib - PARP Inhibitor Maintenance) (Olaparib 300 mg twice daily (Niraparib 200 to 300 mg once daily based on baseline weight/platelets), Twice daily (Olaparib) or once daily (Niraparib), Up to 2 to 3 years maintenance following response to platinum chemotherapy) - SOLO-1 & PRIMA trials: Synthetic lethality in homologous recombination-deficient tumors; quadruples median progression-free survival (56 vs 13.8 months in BRCA-mutated). Monitor Complete Blood Count monthly (watch for anemia, thrombocytopenia, and rare secondary AML/MDS risk).",
      "Anti-Angiogenic Targeted Therapy (for Suboptimally Debulked Stage III/IV): Bevacizumab (Anti-VEGF Monoclonal Antibody) (15 mg/kg IV, Every 3 weeks (Q3W), Up to 15 months total maintenance therapy (GOG-0218 protocol)) - Particularly effective in patients with high-volume ascites and suboptimally debulked disease; delays ascites reaccumulation. Monitor blood pressure and urinalysis for proteinuria."
    ],
    "possibleComplications": [
      "Recurrent intractable malignant ascites requiring frequent therapeutic paracentesis",
      "Malignant bowel sub-obstruction and obstruction from diffuse peritoneal implants",
      "Emergence of platinum-resistant ovarian cancer recurrence (<6 months treatment-free interval)"
    ],
    "specialistReferralCriteria": [
      "Pelvic mass on ultrasound accompanied by elevated CA-125 in a postmenopausal woman (immediate referral to Gynecologic Oncologist for maximal cytoreductive surgery)",
      "New-onset persistent bloating or early satiety lasting > 12 days per month in a woman aged > 50 (urgent pelvic ultrasound within 2 weeks)",
      "Known ovarian cancer presenting with severe nausea, bilious vomiting, and obstipation (emergency admission for malignant bowel obstruction)"
    ]
  },
  "kidney-cancer": {
    "recommendedDiagnosticTests": [
      "Quad-Phase Contrast-Enhanced CT of Abdomen and Pelvis (Unenhanced, Corticomedullary, Nephrographic, and Excretory phases: Diagnostic hallmark is avid early arterial enhancement (>15-20 Hounsfield Unit increase over unenhanced) with rapid washout in Clear Cell RCC)",
      "Contrast-Enhanced Abdominal MRI with MR Venography (Preferred in patients with iodinated contrast allergy and for precise cephalad mapping of tumor thrombus extension within the renal vein and IVC up to right atrium)",
      "Contrast-Enhanced High-Resolution Chest CT (Lungs are the single most common site of distant hematogenous metastasis in RCC; mandatory staging for all solid renal cortical masses)",
      "Serum Calcium, Alkaline Phosphatase, Hemoglobin, and Renal Function Panel (Evaluates paraneoplastic hypercalcemia, erythrocytosis/anemia, baseline contralateral GFR, and calculates IMDC (International Metastatic RCC Database Consortium) risk score)",
      "Percutaneous Core Needle Biopsy of Renal Mass (Indicated when active surveillance, ablative therapy (cryoablation/RFA), or upfront systemic therapy without cytoreductive nephrectomy is planned)"
    ],
    "treatmentOptions": [
      "NCCN Category 1 Preferred First-Line Regimen for Advanced / Metastatic Clear Cell RCC: Pembrolizumab + Axitinib (Combination IO + TKI Protocol) (Pembrolizumab 200 mg IV every 3 weeks + Axitinib 5 mg orally twice daily, Pembrolizumab: every 3 weeks; Axitinib: twice daily (can titrate to 7-10 mg BID), Pembrolizumab up to 2 years; Axitinib ongoing until disease progression) - KEYNOTE-426 trial: Combines PD-1 checkpoint inhibition with potent VEGFR 1-3 tyrosine kinase blockade. Significantly superior overall survival (80% vs 72% at 1 year) and objective response rate (59% vs 36%) over Sunitinib monotherapy. Monitor daily blood pressure (manage hypertension aggressively with ACEi/CCB).",
      "NCCN Category 1 Alternative First-Line Combination Regimen: Nivolumab + Cabozantinib (CheckMate 9ER Protocol) (Nivolumab 240 mg IV every 2 weeks + Cabozantinib 40 mg orally once daily, Nivolumab: every 2 weeks (or 480 mg Q4W); Cabozantinib: once daily, Ongoing until disease progression) - Cabozantinib targets VEGFR, MET, and AXL kinases to overcome resistance. Robust progression-free survival benefit. Monitor for diarrhea, hand-foot skin reaction, and elevated transaminases.",
      "Multi-Targeted Receptor Tyrosine Kinase Inhibitor Monotherapy: Sunitinib Malate (Single-Agent TKI) (50 mg once daily for 4 weeks on therapy followed by 2 weeks off (Schedule 4/2), Once daily for 28 consecutive days, then 14 days rest (6-week cycle), Ongoing until disease progression) - Established oral targeted monotherapy option for patients with contraindications to immune checkpoint inhibitors. Monitor blood pressure, thyroid function (TSH every 3 months), and cardiac LVEF."
    ],
    "possibleComplications": [
      "Extensive cavoatrial tumor thrombus with pulmonary embolism or Budd-Chiari syndrome",
      "Intractable osteolytic bone metastases with hypercalcemia and pathological fractures",
      "Loss of renal function following nephrectomy requiring chronic dialysis if solitary kidney"
    ],
    "specialistReferralCriteria": [
      "Solid enhancing renal cortical mass identified on ultrasound or CT (immediate referral to Urologic Oncology for partial vs radical nephrectomy)",
      "New-onset varicocele in an adult male failing to decompress when recumbent (urgent renal ultrasound to rule out RCC tumor thrombus)",
      "Painless gross hematuria of any magnitude (urgent fast-track cystoscopy and contrast CT urography)"
    ]
  },
  "bone-cancer": {
    "recommendedDiagnosticTests": [
      "Conventional Plain Radiographs of the Entire Involved Bone (Two Orthogonal Views) (Hallmark radiographic signs: Mixed osteolytic and osteoblastic lesion with ill-defined permeative cortical destruction, periosteal 'Codman's Triangle', and classic 'Sunburst' spiculation)",
      "High-Resolution Contrast-Enhanced MRI of the Entire Involved Anatomical Compartment (MANDATORY: Must image the entire bone to evaluate longitudinal intramedullary tumor extent, soft tissue extraosseous component, proximity to neurovascular bundles, and exclude skip metastases)",
      "Core Needle Biopsy by Experienced Orthopedic Oncologist (CRITICAL SURGICAL PRINCIPLE: Biopsy tract MUST be placed strictly along the longitudinal line of future definitive surgical incision to allow complete en-bloc resection and prevent tissue plane contamination)",
      "High-Resolution Contrast-Enhanced Chest CT (MANDATORY: Evaluates pulmonary parenchyma for nodular hematogenous metastases (present in 15-20% at diagnosis); dictates overall treatment strategy)",
      "Whole-Body 99mTc-Methylene Diphosphonate (MDP) Bone Scintigraphy / 18F-FDG PET-CT (Detects polyostotic bone involvement and distant skeletal metastases throughout the axial and appendicular skeleton)"
    ],
    "treatmentOptions": [
      "NCCN Category 1 Gold Standard Regimen for High-Grade Osteosarcoma: MAP Protocol (High-Dose Methotrexate + Doxorubicin + Cisplatin) (High-Dose Methotrexate 12 g/m² IV (with Leucovorin rescue) + Doxorubicin 75 mg/m² continuous IV + Cisplatin 120 mg/m² IV, Multi-agent staged cycles alternating every 3 to 5 weeks, 9 to 10 months total (2-3 cycles neoadjuvant pre-op, followed by surgery, and 4-6 cycles adjuvant post-op)) - Transformed 5-year survival from <20% to >70% and enabled limb-sparing surgery in >85-90% of patients. MANDATORY: Urine pH must be maintained > 7.5 with IV sodium bicarbonate during high-dose methotrexate to prevent precipitation of MTX crystals in renal tubules. Leucovorin calcium rescue started strictly at 24 hours until serum MTX level drops < 0.1 µmol/L.",
      "Standard Multi-Agent Compressed Interval Protocol for Ewing Sarcoma: VDC / IE Regimen (for Ewing Sarcoma) (Vincristine 2 mg/m² + Doxorubicin 75 mg/m² + Cyclophosphamide 1,200 mg/m² alternating with Ifosfamide 1,800 mg/m² + Etoposide 100 mg/m², Every 2 weeks (compressed interval protocol), 14 to 17 cycles total (approx 9-10 months)) - MANDATORY UROPROTECTION: Co-administer IV Mesna (2-mercaptoethane sulfonate sodium) with Ifosfamide and Cyclophosphamide to neutralize toxic acrolein metabolite and completely prevent hemorrhagic cystitis.",
      "Step 2 Opioid-Analgesic Combination for Bone Pain: Tramadol + Paracetamol Combination (Tramadol 37.5 mg + Paracetamol 325 mg, Every 8 hours as needed (SOS), Ongoing as needed for severe nocturnal bone pain) - Provides dual-mechanism analgesia (mu-opioid agonism plus serotonin/norepinephrine reuptake inhibition). Co-prescribe stool softener to prevent opioid-induced constipation."
    ],
    "possibleComplications": [
      "Severe pathological fracture through necrotic bone lesion necessitating amputation",
      "Chemotherapy-induced severe myelosuppression, cardiotoxicity (doxorubicin), and nephrotoxicity",
      "Metastatic dissemination to lung parenchyma requiring thoracoscopic wedge resections (metastasectomy)"
    ],
    "specialistReferralCriteria": [
      "Unexplained bone pain worse at night or bony swelling in an adolescent or young adult (IMMEDIATE plain radiograph and direct referral to specialized Orthopedic Oncology Sarcoma Center BEFORE performing any biopsy)",
      "Suspected primary bone tumor on X-ray (NEVER perform an open biopsy in a non-specialist center; incorrect biopsy placement can compromise limb-sparing surgery)",
      "Sudden acute severe pain with inability to bear weight in a patient with a known bone lesion (acute pathological fracture)"
    ]
  },
  "thyroid-cancer": {
    "recommendedDiagnosticTests": [
      "High-Resolution Neck & Thyroid Ultrasound with Color Doppler (ACR TI-RADS v2024 classification: evaluates suspicious features (marked hypoechogenicity, taller-than-wide shape, irregular/infiltrative margins, punctate echogenic foci / microcalcifications, absent peripheral halo))",
      "Ultrasound-Guided Fine Needle Aspiration Cytology (FNAC) (Reported via Bethesda System for Reporting Thyroid Cytopathology (Category I to VI): Category V (Suspicious for Malignancy, 60-75% risk) and Category VI (Malignant - Papillary Carcinoma, 97-99% risk) mandate surgical resection)",
      "Molecular Testing on FNA Aspirate (ThyroSeq v3 or Afirma GSC Panel) (Recommended for Bethesda III (AUS/FLUS) and IV (Follicular Neoplasm) indeterminate nodules: identifies BRAF V600E (high risk of lymph node metastasis), RET/PTC, RAS, and TERT promoter mutations)",
      "Preoperative Non-Contrast Neck & Upper Chest CT (Evaluates substernal retrosternal goiter extension and aerodigestive invasion. CRITICAL: Iodinated radiocontrast MUST be avoided if radioactive iodine therapy is planned within 2-3 months)",
      "Post-Operative Serum Thyroglobulin (Tg) & Anti-Thyroglobulin Antibodies (Anti-Tg) (MANDATORY: Thyroglobulin is a highly sensitive surveillance biomarker for persistent or recurrent differentiated thyroid cancer following total thyroidectomy (target stimulated Tg < 1 ng/mL))"
    ],
    "treatmentOptions": [
      "First-Line Postoperative Hormonal Suppression (ATA Guideline): Levothyroxine Sodium (TSH Suppression Therapy) (2.0 to 2.5 mcg/kg/day (typically 125 to 200 mcg daily, titrated to target TSH), Once daily in the morning, Lifelong ongoing suppressive therapy) - Suppresses pituitary TSH secretion to eliminate the major proliferative stimulus for thyroid cancer cells. Target TSH: High-Risk disease < 0.1 mIU/L; Intermediate-Risk 0.1 to 0.5 mIU/L; Low-Risk 0.5 to 2.0 mIU/L. Monitor for subclinical hyperthyroidism risks (osteoporosis, atrial fibrillation).",
      "Radioiodine Remnant Ablation (RRA) & Adjuvant Therapy: Radioactive Iodine (131I - Sodium Iodide I-131) (30 mCi to 150 mCi (1.11 to 5.55 GBq) based on ATA risk stratification, Single ablation dose administered in radiation safety isolation room, Single therapeutic administration) - Emits beta radiation destroying residual microscopic normal thyroid bed tissue and occult iodine-avid metastases. MANDATORY PREPARATION: Strict low-iodine diet (<50 mcg/day) for 2 weeks prior; stimulate TSH > 30 mIU/L via Recombinant Human TSH (rhTSH - Thyrogen) or 4-week levothyroxine withdrawal.",
      "Multi-Kinase Inhibitor for Radioiodine-Refractory Differentiated Thyroid Cancer: Lenvatinib Mesylate (for Radioiodine-Refractory DTC) (24 mg once daily (two 10 mg + one 4 mg capsule), Once daily (OD), Ongoing until disease progression) - SELECT landmark trial: Dramatic progression-free survival extension (18.3 vs 3.6 months) in progressive radioiodine-refractory thyroid cancer. Monitor daily blood pressure (hypertension in >70%), proteinuria, and QTc interval.",
      "Post-Thyroidectomy Hypocalcemia Prevention: Calcium Carbonate + Calcitriol (Active Vitamin D3) (Elemental Calcium 1,000 to 2,000 mg daily + Calcitriol 0.25 to 0.5 mcg daily, Divided two to three times daily, Short-term post-op (or lifelong if permanent hypoparathyroidism)) - Prevents symptomatic post-surgical tetany and carpopedal spasm resulting from transient parathyroid gland devascularization or inadvertent removal during total thyroidectomy and central neck dissection."
    ],
    "possibleComplications": [
      "Permanent iatrogenic hypoparathyroidism causing severe hypocalcemia",
      "Recurrent laryngeal nerve injury causing permanent vocal cord paralysis and dysphonia",
      "Radioiodine-refractory distant pulmonary and skeletal metastatic progression"
    ],
    "specialistReferralCriteria": [
      "Thyroid nodule with suspicious ultrasound features (ACR TI-RADS 4 or 5) or diameter >= 1.5 cm (referral for ultrasound-guided FNAC)",
      "FNA cytology reporting Bethesda Category V (Suspicious) or VI (Malignant) -> Immediate referral to Head & Neck Endocrine Surgeon",
      "Thyroid mass presenting with vocal hoarseness, stridor, or fixation to adjacent structures (urgent surgical airway and oncologic evaluation)"
    ]
  },
  "oral-cancer": {
    "recommendedDiagnosticTests": [
      "Comprehensive Head & Neck Examination with Flexible Nasopharyngolaryngoscopy (Thorough inspection and bimanual palpation of entire oral cavity and pharynx: mandatory flexible fiberoptic endoscopy to rule out synchronous second primary upper aerodigestive tumors (present in 10-15%))",
      "Punch or Scalpel Incisional Wedge Biopsy of Oral Lesion (MANDATORY: Must include both the ulcerated lesion edge and adjacent normal-appearing mucosa with underlying submucosa to determine true histologic depth of invasion (DOI))",
      "Contrast-Enhanced MRI of Head and Neck with Dental Artifact Suppression (Optimal imaging modality: accurately quantifies tumor Depth of Invasion (DOI in mm), intrinsic tongue muscular infiltration, floor of mouth invasion, and perineural spread along lingual/inferior alveolar nerves)",
      "Contrast-Enhanced CT of Neck + Orthopantomogram (OPG) / Dental CT (High-resolution bone window CT or OPG precisely identifies cortical bone erosion and marrow invasion of mandible or maxilla (mandibulectomy planning))",
      "High-Resolution Contrast Chest CT (Lungs are the primary site of distant hematogenous metastasis and high-risk site for tobacco-related synchronous primary bronchogenic carcinoma)"
    ],
    "treatmentOptions": [
      "NCCN Category 1 Standard Adjuvant Chemoradiation for High-Risk Pathological Features: Cisplatin (Concurrent Adjuvant Chemoradiotherapy Protocol) (100 mg/m² IV every 3 weeks (Days 1, 22, 43 of radiation) OR 40 mg/m² weekly, Every 21 days concurrent with definitive or postoperative radiotherapy, 3 cycles (or 6 weekly cycles) concurrent with 60-66 Gy radiotherapy) - RTOG 9501 / EORTC 22931 trials: Mandatory post-operative standard for tumors with positive surgical margins (R1 resection) and/or Extracapsular Nodal Extension (ECE+ / ENE). Significantly reduces locoregional relapse and improves overall survival.",
      "FDA & NCCN Approved First-Line Immunotherapy for Recurrent / Metastatic HNSCC: Nivolumab (or Pembrolizumab - Anti-PD-1 Monotherapy) (Nivolumab 240 mg IV Q2W (or 480 mg Q4W) / Pembrolizumab 200 mg IV Q3W, Every 2 to 4 weeks, Up to 2 years or until disease progression) - CheckMate 141 & KEYNOTE-048 trials: Proven overall survival superiority over traditional cetuximab/platinum chemotherapy in platinum-refractory and PD-L1 expressing (CPS >= 1) recurrent/metastatic head and neck carcinoma.",
      "Topical Antimicrobial Mucosal Decontaminant: Chlorhexidine Gluconate 0.2% Oral Antiseptic Rinse (0.2% w/v oral solution, 10 to 15 mL swish and spit three times daily (TID), Ongoing during surgical convalescence and radiotherapy) - Broad-spectrum bactericidal rinse; significantly reduces oral pathogenic bacterial load, prevents secondary infection of ulcerative beds, and reduces radiation-induced stomatitis severity.",
      "Topical Analgesic & Cytoprotective Oral Suspension: Magic Mouthwash (Compounded Anesthetic & Mucosal Protectant) (Equal parts: Lidocaine 2% Viscous + Diphenhydramine 12.5mg/5mL + Aluminum/Magnesium Hydroxide suspension (1:1:1), Swish 5 to 10 mL in mouth for 1 minute and expectorate every 4 to 6 hours as needed (SOS), As needed during active mucositis) - Topical mucosal anesthesia alleviates excruciating oral pain, enabling essential oral nutritional hydration. Patient must avoid hot foods/liquids while oral cavity is anesthetized."
    ],
    "possibleComplications": [
      "Severe trismus, speech loss, and profound dysphagia requiring permanent gastrostomy (PEG) feeding tube",
      "Carotid blowout syndrome (catastrophic fatal hemorrhage from tumor erosion into external or internal carotid artery)",
      "Severe radiation osteoradionecrosis (ORN) of the mandible requiring vascularized fibula free flap reconstruction"
    ],
    "specialistReferralCriteria": [
      "Any oral mucosal ulcer or white/red lesion persisting > 3 weeks without healing (mandatory referral for urgent biopsy to Head & Neck Surgical Oncologist / Oral Maxillofacial Surgeon)",
      "Unexplained tooth loosening with adjacent soft tissue swelling (rule out invasive carcinoma prior to dental extraction)",
      "Presence of trismus or referred otalgia in a patient with an oral lesion (immediate tertiary head & neck oncology center evaluation)"
    ]
  }
};

/**
 * Helper to retrieve rich clinical dataset for any disease (by ID or disease object)
 */
export function getClinicalDatasetForDisease(diseaseOrId) {
  const id = typeof diseaseOrId === 'string' ? diseaseOrId : (diseaseOrId?.id || '');
  if (GLOBAL_DISEASE_DATASETS[id]) {
    return GLOBAL_DISEASE_DATASETS[id];
  }

  // Safe fallback if disease not found
  return {
    id,
    name: typeof diseaseOrId === 'object' ? (diseaseOrId.name || 'Medical Condition') : 'Medical Condition',
    medicalName: 'Clinical Condition',
    category: 'General Medicine',
    subCategory: 'Clinical Protocol',
    icdCode: 'R69',
    datasetSource: 'WHO Global Clinical Standard & Clinical Practice Guidelines',
    evidenceLevel: 'Consensus Standard',
    overview: 'Evidence-based clinical protocol and therapeutic guidelines.',
    symptoms: {
      hallmark: ['Clinical hallmark presentations', 'Associated symptoms requiring medical evaluation'],
      earlySigns: ['Subtle early indicators', 'Mild prodromal signs'],
      redFlags: ['Severe unyielding distress', 'Hemodynamic instability', 'Target organ compromise']
    },
    requiredTests: [
      { testName: 'Complete Blood Count (CBC) with Differential', type: 'Laboratory Assay', purpose: 'Baseline cellular evaluation', urgency: 'Priority' },
      { testName: 'Comprehensive Metabolic Panel (CMP)', type: 'Laboratory Assay', purpose: 'Renal and hepatic baseline', urgency: 'Priority' },
      { testName: 'Targeted Diagnostic Imaging / Biomarkers', type: 'Diagnostic Imaging', purpose: 'Direct condition verification', urgency: 'Routine' }
    ],
    prescriptions: [
      {
        drugName: 'Evidence-Based Guideline Directed Therapy',
        strength: 'Standard therapeutic dose',
        dosageForm: 'Oral / Parenteral',
        frequency: 'As directed',
        timing: 'Post-meal',
        duration: 'As indicated',
        regimenType: 'First-Line Guideline Protocol',
        clinicalNotes: 'Follow standard international clinical dosing guidelines; adjust for renal/hepatic function.'
      }
    ],
    complications: ['Disease progression without medical intervention', 'Secondary organ compromise'],
    referralTriggers: ['Atypical presentation or poor response to initial therapy', 'Development of red flag symptoms']
  };
}

/**
 * Legacy compatibility helper
 */
export function getClinicalDetailsForDisease(disease) {
  const ds = getClinicalDatasetForDisease(disease);
  return {
    recommendedDiagnosticTests: ds.requiredTests.map(t => `${t.testName} (${t.purpose})`),
    treatmentOptions: ds.prescriptions.map(p => `${p.regimenType}: ${p.drugName} (${p.strength}, ${p.frequency}) - ${p.clinicalNotes}`),
    possibleComplications: ds.complications,
    specialistReferralCriteria: ds.referralTriggers
  };
}
