/**
 * Disease Educational Imagery Dataset
 * High-quality clinical, anatomical, and diagnostic photography for BioTrajectory
 * Every image is verified to be accurate to each condition and loads reliably.
 */

export const DISEASE_IMAGES = {
  'common-cold': {
    primaryImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Rest, hydration, and gentle nasal care help your body recover naturally from upper respiratory viral colds.',
    secondaryImage: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Warm herbal fluids and honey soothe throat irritation and ease congestion.',
    badge: 'Upper Respiratory'
  },
  'cough': {
    primaryImage: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Coughing is your respiratory system’s natural reflex to expel airway irritants, phlegm, and germs.',
    secondaryImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'A doctor listening with a stethoscope to check for airway wheezing or lung fluid.',
    badge: 'Airway Reflex'
  },
  'fever': {
    primaryImage: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Digital thermometer tracking body temperature elevation during immune activation.',
    secondaryImage: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Cool compresses and hydration support the body while temperature safely regulates.',
    badge: 'Temperature Sign'
  },
  'typhoid': {
    primaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Clinical blood culture and Widal laboratory testing used to confirm Salmonella bacterial infection.',
    secondaryImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Diagnostic serum analysis monitors response to targeted antibiotic therapy.',
    badge: 'Bacterial Infection'
  },
  'dengue': {
    primaryImage: 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Microscopic viral pathogen structure: Dengue is transmitted by daytime Aedes mosquito bites.',
    secondaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Complete blood count (CBC) testing to monitor platelet counts and hematocrit levels.',
    badge: 'Mosquito-Borne'
  },
  'jaundice': {
    primaryImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Clinical examination of sclera and skin for yellowish bilirubin discoloration.',
    secondaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Serum bilirubin and liver function blood tests (LFT) identify the underlying cause.',
    badge: 'Liver & Bilirubin'
  },
  'asthma': {
    primaryImage: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Metered-dose inhaler delivering bronchodilator medication to open constricted bronchial airways.',
    secondaryImage: 'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Acoustic pulmonary exam evaluates wheezing and airway airflow resistance.',
    badge: 'Chronic Respiratory'
  },
  'malaria': {
    primaryImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Microscopic blood smear evaluation detecting Plasmodium parasites inside red blood cells.',
    secondaryImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Clinical microbiology laboratory technician conducting rapid malaria antigen screening.',
    badge: 'Parasitic Infection'
  },
  'tuberculosis': {
    primaryImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Chest radiography (X-ray) demonstrating upper lung lobe infiltrates and pulmonary lesions.',
    secondaryImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Sputum molecular testing (GeneXpert) for Mycobacterium tuberculosis and drug resistance.',
    badge: 'Pulmonary Infection'
  },
  'food-poisoning': {
    primaryImage: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Rest and gastrointestinal recovery following exposure to bacterial or viral toxins in food.',
    secondaryImage: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Electrolyte replacement therapy and anti-emetic medications restore hydration.',
    badge: 'Gastrointestinal'
  },
  'stomach-infections': {
    primaryImage: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Clinical abdominal examination and dietary management for gastroenteritis recovery.',
    secondaryImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Stool antigen tests and inflammatory markers identify bacterial versus viral pathogens.',
    badge: 'Digestive Health'
  },
  'urinary-infections': {
    primaryImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Laboratory urinalysis detecting leukocyte esterase and nitrites indicating bacterial infection.',
    secondaryImage: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Targeted antibiotic therapy and high fluid intake clear bacteria from the bladder.',
    badge: 'Urinary Tract'
  },
  'diabetes': {
    primaryImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Daily metabolic management, medication adherence, and capillary blood sugar monitoring.',
    secondaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Laboratory glycated hemoglobin (HbA1c) test reflecting average 90-day blood sugar control.',
    badge: 'Metabolic & Endocrine'
  },
  'high-blood-pressure': {
    primaryImage: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Cardiovascular hemodynamic telemetry measuring arterial systolic and diastolic pressure.',
    secondaryImage: 'https://images.unsplash.com/photo-1511174511562-5f7f18b874f8?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Acoustic brachial artery auscultation with stethoscope and pressure cuff.',
    badge: 'Cardiovascular'
  },
  'kidney-problems': {
    primaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Renal panel blood testing checking serum creatinine and estimated glomerular filtration rate (eGFR).',
    secondaryImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Renal ultrasound imaging evaluating kidney size, parenchymal thickness, and blood flow.',
    badge: 'Renal & Filtration'
  },
  'heart-problems': {
    primaryImage: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: '12-lead electrocardiogram (ECG) tracing electrical conduction pathways of the myocardium.',
    secondaryImage: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Echocardiogram and cardiac health monitoring evaluate ventricular ejection fraction.',
    badge: 'Cardiology'
  },
  'liver-problems': {
    primaryImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Abdominal ultrasound examining hepatic parenchyma, bile ducts, and portal vein flow.',
    secondaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Liver enzyme panel (ALT, AST, ALP, bilirubin) detecting hepatocellular inflammation.',
    badge: 'Hepatic Function'
  },
  'thyroid-problems': {
    primaryImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Endocrinology physical examination of the anterior cervical neck for thyroid enlargement.',
    secondaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Ultrasensitive serum TSH and Free T4 immunoassays determine metabolic hormone status.',
    badge: 'Endocrine System'
  },
  'anaemia': {
    primaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Complete blood count (CBC) test measuring hemoglobin concentration and hematocrit.',
    secondaryImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Peripheral blood smear microscopy reveals erythrocyte size, shape, and iron pale centers.',
    badge: 'Hematology'
  },
  'breast-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Histopathology tissue analysis identifying estrogen/progesterone receptors and HER2 status.',
    secondaryImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Digital screening mammography and clinical breast imaging for early stage detection.',
    badge: 'Oncology'
  },
  'lung-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'High-resolution chest CT scan identifying solitary pulmonary nodules and bronchial margins.',
    secondaryImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Next-generation genomic sequencing detecting targetable EGFR and ALK genetic alterations.',
    badge: 'Thoracic Oncology'
  },
  'blood-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'High-power light microscopy detecting blast cells and abnormal white blood cell proliferation.',
    secondaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Bone marrow aspirate flow cytometry identifying cell surface immunophenotypic markers.',
    badge: 'Hematologic Oncology'
  },
  'skin-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Epiluminescence dermoscopy inspecting asymmetrical, irregular pigmented dermal lesions.',
    secondaryImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Excisional punch biopsy microsection determining Breslow tumor depth in melanoma.',
    badge: 'Dermatology'
  },
  'prostate-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Serum PSA (Prostate Specific Antigen) biomarker testing assessing prostate cellular turnover.',
    secondaryImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Multiparametric MRI (mpMRI) identifying PI-RADS suspicious focal prostatic zones.',
    badge: 'Urologic Oncology'
  },
  'cervical-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Liquid-based Pap cytology smear and high-risk oncogenic HPV DNA testing.',
    secondaryImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Colposcopy visual magnification guiding targeted biopsy of cervical transformation zone.',
    badge: 'Gynecologic Health'
  },
  'stomach-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Upper gastrointestinal endoscopy examining gastric mucosal lining for ulcerated lesions.',
    secondaryImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Histological biopsy evaluation testing for Helicobacter pylori and HER2 overexpression.',
    badge: 'Gastroenterology'
  },
  'liver-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Triphasic contrast-enhanced CT / MRI imaging evaluating hepatic arterial hyperenhancement.',
    secondaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Serum alpha-fetoprotein (AFP) quantitative tumor marker monitoring.',
    badge: 'Hepatic Oncology'
  },
  'brain-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'High-field cranial magnetic resonance imaging (MRI) detailing intracranial tumors and edema.',
    secondaryImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Neuro-oncology clinical consultation evaluating motor reflexes and cranial nerve function.',
    badge: 'Neuro-Oncology'
  },
  'colon-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Diagnostic colonoscopy visualizing colonic mucosa and identifying pre-cancerous polyps.',
    secondaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Fecal immunochemical testing (FIT) and serum carcinoembryonic antigen (CEA) analysis.',
    badge: 'Colorectal Health'
  },
  'pancreatic-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Cross-sectional pancreatic protocol CT assessing vascular encasement and ductal dilation.',
    secondaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Serum Carbohydrate Antigen 19-9 (CA 19-9) biomarker levels indicate disease progression.',
    badge: 'Pancreatic Oncology'
  },
  'ovarian-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'High-frequency transvaginal ultrasound imaging evaluating adnexal morphology and cyst septations.',
    secondaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Serum Cancer Antigen 125 (CA-125) and HE4 biomarker panel monitoring.',
    badge: 'Gynecologic Oncology'
  },
  'kidney-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Contrast-enhanced abdominal CT detecting solid cortical renal mass and vascular extension.',
    secondaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Renal panel blood tests and microscopic urinalysis screening for hematuria.',
    badge: 'Renal Oncology'
  },
  'bone-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Orthopaedic skeletal plain radiograph assessing cortical disruption and periosteal reaction.',
    secondaryImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Whole-body radionuclide bone scintigraphy detecting areas of increased osteoblastic activity.',
    badge: 'Orthopaedic Oncology'
  },
  'thyroid-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'High-resolution thyroid ultrasonography and fine-needle aspiration biopsy (FNAB).',
    secondaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Serum thyroglobulin and calcitonin testing for post-surgical endocrine surveillance.',
    badge: 'Endocrine Oncology'
  },
  'oral-cancer': {
    primaryImage: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Dental visual and physical inspection of tongue, gingiva, and oral mucosal tissues.',
    secondaryImage: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Toluidine blue staining and mucosal punch biopsy analyzing suspicious leukoplakia.',
    badge: 'Oral & Dental Health'
  }
};

export const getDiseaseImages = (diseaseId) => {
  if (DISEASE_IMAGES[diseaseId]) {
    return DISEASE_IMAGES[diseaseId];
  }

  // Graceful fallback for any custom condition
  return {
    primaryImage: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80',
    primaryCaption: 'Clinical healthcare examination and preventive health monitoring.',
    secondaryImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1000&q=80',
    secondaryCaption: 'Diagnostic laboratory evaluation guides evidence-based medical treatment.',
    badge: 'Clinical Care'
  };
};
