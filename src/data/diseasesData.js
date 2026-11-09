export const PRIMARY_CATEGORIES = [
  'All Conditions',
  'Common Illnesses',
  'Other Health Problems',
  'Cancer Types'
];

export const SUB_CATEGORIES = [
  'All',
  'Respiratory & Infections',
  'Stomach & Digestion',
  'Fever & Mosquito-Borne',
  'Heart & Circulation',
  'Blood Sugar & Hormones',
  'Kidneys & Urinary',
  'Blood & Liver',
  'Common Cancers',
  'Digestive Cancers',
  'Other Cancers'
];

export const DISEASES_DATABASE = [
  // ==========================================
  // 1. COMMON ILLNESSES (12 conditions)
  // ==========================================
  {
    id: 'common-cold',
    name: 'Common Cold',
    medicalName: 'Acute Viral Rhinitis',
    categoryGroup: 'Common Illnesses',
    subCategory: 'Respiratory & Infections',
    illustrationIcon: 'Wind',
    shortDescription: 'A mild viral infection of your nose and throat that usually gets better on its own within a week.',
    whatIsIt: 'The common cold is a harmless viral infection that affects your upper breathing passages — mainly your nose, sinuses, and throat. It makes your nose stuffy or runny and can leave you feeling slightly under the weather for a few days.',
    whyDoesItHappen: [
      'Infection by common respiratory viruses, most often rhinoviruses',
      'Touching surfaces with virus droplets and then touching your nose, eyes, or mouth',
      'Being close to someone who is coughing or sneezing without covering their mouth',
      'Spending time in crowded indoor spaces during cold weather'
    ],
    signsYouMayNotice: [
      'Runny or blocked nose with clear or cloudy mucus',
      'Mild sore throat or scratchy feeling in the throat',
      'Sneezing and mild head congestion',
      'Slight tiredness and mild body aches',
      'A gentle, dry cough that may linger for a few days'
    ],
    howDoesItSpread: 'Spreads easily through tiny air droplets when an infected person sneezes, coughs, or talks, and by touching contaminated objects like doorknobs or phones.',
    whoIsAtRisk: [
      'Young children who are building their immune defenses',
      'People with weakened immune systems',
      'Anyone who lacks sleep or is experiencing high stress',
      'People exposed to smoke or air pollution'
    ],
    howToReduceRisk: [
      'Wash your hands frequently with soap and warm water for at least 20 seconds',
      'Avoid touching your face, eyes, and mouth with unwashed hands',
      'Stay away from people who are actively sneezing or coughing',
      'Clean frequently touched objects at home and work regularly',
      'Drink plenty of fluids and get 7 to 8 hours of sleep'
    ],
    whenToSeeDoctor: [
      'Your symptoms last longer than 10 to 14 days without any improvement',
      'You develop a high fever (above 101.3°F or 38.5°C) or severe chills',
      'You experience trouble breathing, wheezing, or chest tightness',
      'You feel severe sinus pain around your eyes or forehead'
    ],
    howCommonIsIt: 'Extremely common. Most adults get 2 to 3 colds per year, while young children can get 6 or more.',
    reliableSources: [
      'Centers for Disease Control and Prevention (CDC) — Common Cold',
      'World Health Organization (WHO) — Respiratory Pathogens',
      'Mayo Clinic Health Reference — Common Cold'
    ],
    datasetKey: 'common-cold',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-15'
  },
  {
    id: 'cough',
    name: 'Cough',
    medicalName: 'Tussis (Symptom & Reflex)',
    categoryGroup: 'Common Illnesses',
    subCategory: 'Respiratory & Infections',
    illustrationIcon: 'Activity',
    isSymptomSign: true,
    symptomNotice: 'Important Notice: A cough is your body’s natural protective reflex and usually a sign of an underlying condition (like a cold, flu, asthma, or allergy), rather than an isolated illness by itself.',
    shortDescription: 'Your body’s natural way of clearing irritants, mucus, or infections from your airways.',
    whatIsIt: 'A cough is a sudden, forceful push of air out of your lungs. It is your respiratory system’s defense mechanism designed to keep your throat and breathing passages free of mucus, dust, smoke, or germs.',
    whyDoesItHappen: [
      'Viral infections like colds, the flu, or bronchitis',
      'Post-nasal drip (mucus dripping down the back of your throat from a cold or sinus issue)',
      'Airborne irritants like dust, vehicle exhaust, or smoke',
      'Underlying airway sensitivities such as asthma or allergies',
      'Acid from the stomach flowing back into the esophagus (acid reflux)'
    ],
    signsYouMayNotice: [
      'Dry, ticklish cough with little to no mucus',
      'Wet, chesty cough bringing up clear, yellow, or greenish mucus',
      'Scratchy or raw feeling in the throat after repeated coughing',
      'Mild chest soreness from overworked breathing muscles'
    ],
    howDoesItSpread: 'A cough itself is a reflex, but if caused by a virus or bacteria, the droplets released during a cough can spread the underlying infection to others.',
    whoIsAtRisk: [
      'People exposed to tobacco smoke or air pollution',
      'Individuals with seasonal allergies or asthma',
      'People recovering from a recent cold or sinus infection'
    ],
    howToReduceRisk: [
      'Always cover your mouth with your elbow or a tissue when coughing',
      'Drink warm water, herbal teas, or warm broth with honey to soothe the throat',
      'Use a room humidifier or inhale steam from a warm shower',
      'Avoid smoking and stay away from secondhand smoke'
    ],
    whenToSeeDoctor: [
      'A cough lasts longer than 3 weeks (chronic cough)',
      'You cough up blood or rust-colored phlegm',
      'You have shortness of breath, wheezing, or difficulty speaking',
      'You notice unexplained weight loss, night sweats, or a persistent high fever'
    ],
    howCommonIsIt: 'One of the most frequent reasons people visit a primary care doctor worldwide, especially during change of seasons.',
    reliableSources: [
      'American Lung Association — Understanding Cough',
      'National Health Service (NHS) — Cough Guide',
      'World Health Organization (WHO) — Clinical Triage'
    ],
    datasetKey: 'cough',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-20'
  },
  {
    id: 'fever',
    name: 'Fever',
    medicalName: 'Pyrexia (Symptom & Immune Response)',
    categoryGroup: 'Common Illnesses',
    subCategory: 'Fever & Mosquito-Borne',
    illustrationIcon: 'Thermometer',
    isSymptomSign: true,
    symptomNotice: 'Important Notice: Fever is an immune defense signal and a sign of an underlying cause (such as a viral infection, bacterial illness, or inflammation), rather than a separate disease by itself.',
    shortDescription: 'A temporary rise in body temperature as your immune system mobilizes to fight an infection.',
    whatIsIt: 'A fever happens when your body’s internal thermostat — located in a part of the brain called the hypothalamus — turns up your temperature. This makes your body a less welcoming environment for bacteria and viruses to multiply.',
    whyDoesItHappen: [
      'Viral infections such as influenza, dengue, colds, or COVID-19',
      'Bacterial infections like typhoid, urinary tract infections, or pneumonia',
      'Sun exposure or heat exhaustion',
      'Body’s natural immune reaction after vaccinations'
    ],
    signsYouMayNotice: [
      'Body temperature measured at 100.4°F (38°C) or higher on a thermometer',
      'Feeling shivering cold or getting goosebumps even when warm',
      'Sweating as the body temperature starts to cool down',
      'Mild headache, loss of appetite, and general tiredness'
    ],
    howDoesItSpread: 'A fever itself cannot be caught from someone; however, the virus or bacterium causing the fever can spread from person to person.',
    whoIsAtRisk: [
      'Infants and young children with developing immune systems',
      'Elderly individuals',
      'Anyone currently fighting an active infection'
    ],
    howToReduceRisk: [
      'Get plenty of bed rest to allow your immune system to do its work',
      'Drink plenty of fluids: water, clear soups, and oral rehydration salts (ORS)',
      'Wear lightweight, breathable cotton clothes and keep the room well-ventilated',
      'Use a lukewarm damp sponge on the forehead if feeling overheated'
    ],
    whenToSeeDoctor: [
      'Body temperature exceeds 103°F (39.4°C) or does not come down with over-the-counter medicine',
      'The fever persists for more than 3 consecutive days',
      'Accompanied by a stiff neck, confusion, seizure, or extreme drowsiness',
      'In babies under 3 months with a temperature of 100.4°F (38°C) or higher (seek emergency care)'
    ],
    howCommonIsIt: 'Virtually every human experiences multiple fevers throughout life as a standard immune response.',
    reliableSources: [
      'World Health Organization (WHO) — Management of Fever',
      'CDC — Fever Evaluation Guidelines',
      'American Academy of Pediatrics'
    ],
    datasetKey: 'fever',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-22'
  },
  {
    id: 'typhoid',
    name: 'Typhoid',
    medicalName: 'Typhoid Fever (Salmonella enterica)',
    categoryGroup: 'Common Illnesses',
    subCategory: 'Fever & Mosquito-Borne',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'A bacterial infection caused by contaminated food or water that brings high fever and stomach pain.',
    whatIsIt: 'Typhoid is an intestinal and bloodstream infection caused by the bacterium Salmonella Typhi. It can lead to prolonged high fever, fatigue, and severe stomach discomfort if not treated promptly with proper antibiotics.',
    whyDoesItHappen: [
      'Drinking water contaminated with sewage or sewage runoff',
      'Eating raw or undercooked street food prepared with unsafe water',
      'Food handled by someone who carries the bacteria and did not wash hands properly',
      'Poor community sanitation and unsealed drainage systems'
    ],
    signsYouMayNotice: [
      'High, sustained fever that gradually climbs each day (step-ladder fever)',
      'Stomach pain, swollen belly, and cramping',
      'Loss of appetite and dry tongue with white coating',
      'Headache and extreme weakness or body exhaustion',
      'Constipation at first, followed sometimes by diarrhea in later stages'
    ],
    howDoesItSpread: 'Spreads through the fecal-oral route — primarily by consuming water or food contaminated by the waste of an infected person or carrier.',
    whoIsAtRisk: [
      'People living in or traveling to regions with limited access to clean tap water',
      'Children and young adults in crowded urban settlements',
      'People who regularly consume unboiled water or raw street beverages'
    ],
    howToReduceRisk: [
      'Always drink boiled, filtered, or sealed bottled water',
      'Eat hot, freshly cooked food; avoid raw salads and cut fruits sold open in the market',
      'Wash hands thoroughly with soap before eating and after using the restroom',
      'Consider the typhoid vaccine if living in or traveling to an area where typhoid is common'
    ],
    whenToSeeDoctor: [
      'Fever stays above 101°F for more than 2 days with stomach cramps or weakness',
      'You experience severe stomach tenderness, vomiting, or cannot keep fluids down',
      'Signs of severe dehydration like dry lips, dark urine, or extreme dizziness'
    ],
    howCommonIsIt: 'Over 11 million people are affected each year globally, predominantly in South Asia, Southeast Asia, and Sub-Saharan Africa.',
    reliableSources: [
      'World Health Organization (WHO) — Typhoid Fact Sheet',
      'Indian Council of Medical Research (ICMR) — Enteric Fever Guidelines',
      'CDC — Typhoid Fever'
    ],
    datasetKey: 'typhoid',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-18'
  },
  {
    id: 'dengue',
    name: 'Dengue',
    medicalName: 'Dengue Virus (DENV)',
    categoryGroup: 'Common Illnesses',
    subCategory: 'Fever & Mosquito-Borne',
    illustrationIcon: 'AlertTriangle',
    shortDescription: 'A mosquito-borne viral fever that causes sudden high body temperature, joint pain, and fatigue.',
    whatIsIt: 'Dengue is a viral infection transmitted to humans through the bites of infected female Aedes mosquitoes. It is often referred to as "breakbone fever" because of the intense muscle and joint aches it can cause.',
    whyDoesItHappen: [
      'Bite of an Aedes aegypti or Aedes albopictus mosquito carrying the dengue virus',
      'Mosquitoes breeding in clean standing water in open buckets, coolers, or flowerpots',
      'Peak biting times typically occurring during early morning and late afternoon'
    ],
    signsYouMayNotice: [
      'Sudden onset of high fever reaching 104°F (40°C)',
      'Intense pain behind the eyeballs that worsens when moving eyes',
      'Severe headache, muscle aches, and joint stiffness',
      'Red skin rash appearing 2 to 5 days after the fever starts',
      'Nausea, vomiting, and loss of taste'
    ],
    howDoesItSpread: 'Spread exclusively by mosquito bites. It does not spread directly from person to person through casual contact.',
    whoIsAtRisk: [
      'Residents of tropical and subtropical regions during and after monsoon rains',
      'People with standing water containers around their living spaces',
      'Individuals who have had dengue before (higher risk of severe dengue upon second infection)'
    ],
    howToReduceRisk: [
      'Empty, clean, or cover any open water containers, air coolers, and flower pots weekly',
      'Apply mosquito repellent creams containing DEET or picaridin when outdoors',
      'Sleep under mosquito nets or use window screens',
      'Wear loose, light-colored, long-sleeved shirts and full-length pants'
    ],
    whenToSeeDoctor: [
      'Warning signs appear: severe stomach pain, persistent vomiting, or bleeding gums',
      'Sudden drop in platelet count on routine blood test (CBC)',
      'Extreme fatigue, restlessness, or cold, clammy hands and feet (emergency care needed)'
    ],
    howCommonIsIt: 'About 390 million dengue infections occur each year across more than 100 tropical and subtropical countries.',
    reliableSources: [
      'World Health Organization (WHO) — Dengue and Severe Dengue',
      'National Vector Borne Disease Control Programme (NVBDCP India)',
      'Centers for Disease Control and Prevention (CDC)'
    ],
    datasetKey: 'dengue',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-11-01'
  },
  {
    id: 'jaundice',
    name: 'Jaundice',
    medicalName: 'Icterus (Symptom & Clinical Sign)',
    categoryGroup: 'Common Illnesses',
    subCategory: 'Blood & Liver',
    illustrationIcon: 'Eye',
    isSymptomSign: true,
    symptomNotice: 'Important Notice: Jaundice is not a single disease — it is a visible clinical sign showing that bilirubin has built up in your body, usually pointing to an underlying liver, gallbladder, or blood condition.',
    shortDescription: 'Yellowing of the whites of your eyes and skin caused by a buildup of a yellow pigment named bilirubin.',
    whatIsIt: 'When your body breaks down old red blood cells, it creates a yellowish waste substance called bilirubin. Normally, your liver filters it out into digestive bile. If the liver is inflamed, overworked, or bile ducts are blocked, bilirubin enters your bloodstream, tinting tissues yellow.',
    whyDoesItHappen: [
      'Viral hepatitis infections (Hepatitis A, B, C, or E) inflaming liver cells',
      'Gallstones blocking the bile drainage tube',
      'Heavy long-term alcohol consumption harming liver tissues',
      'Certain medications or toxic exposures affecting liver clearance',
      'Rapid breakdown of red blood cells (hemolytic anemia)'
    ],
    signsYouMayNotice: [
      'Yellow tint visible in the whites of your eyes (often first noticeable place)',
      'Skin looking pale yellow or golden',
      'Dark, tea-colored urine despite drinking water',
      'Pale or clay-colored bowel movements',
      'Persistent itchiness across the skin without an obvious rash'
    ],
    howDoesItSpread: 'Jaundice itself does not spread. However, if caused by Hepatitis A or E, it spreads through contaminated food and water; if caused by Hepatitis B or C, it spreads through blood and body fluids.',
    whoIsAtRisk: [
      'People drinking unboiled water in areas with poor sanitation (Hepatitis A and E)',
      'Heavy alcohol drinkers',
      'People with gallstones or family history of gallbladder problems'
    ],
    howToReduceRisk: [
      'Get vaccinated against Hepatitis A and Hepatitis B',
      'Always drink clean, purified, or boiled water',
      'Wash your hands before preparing or eating food',
      'Limit or avoid alcohol to protect liver cells',
      'Avoid taking over-the-counter painkillers or herbal tonics without a doctor’s guidance'
    ],
    whenToSeeDoctor: [
      'Any visible yellowing of the eyes or skin should be evaluated by a healthcare professional promptly',
      'You experience intense upper-right stomach pain, high fever, or vomiting',
      'You feel extreme confusion, drowsiness, or notice easy skin bruising'
    ],
    howCommonIsIt: 'Very common in newborns as a temporary physiological condition, and common in adults during water-borne hepatitis outbreaks.',
    reliableSources: [
      'World Health Organization (WHO) — Hepatitis and Jaundice',
      'American Liver Foundation — Understanding Jaundice',
      'National Institutes of Health (NIH)'
    ],
    datasetKey: 'jaundice',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-25'
  },
  {
    id: 'asthma',
    name: 'Asthma',
    medicalName: 'Bronchial Asthma',
    categoryGroup: 'Common Illnesses',
    subCategory: 'Respiratory & Infections',
    illustrationIcon: 'Activity',
    shortDescription: 'A long-term condition that makes the airways in your lungs swell, narrow, and produce extra mucus.',
    whatIsIt: 'Asthma is a chronic respiratory condition where the small tubes that carry air into and out of your lungs become sensitive, inflamed, and easily irritated. When triggered, the airway muscles tighten up, making it harder to breathe.',
    whyDoesItHappen: [
      'Genetic predisposition: having parents or family members with asthma or allergies',
      'Inhaling triggers like dust mites, animal dander, pollen, or mold',
      'Exposure to tobacco smoke, vehicle emissions, and factory smoke',
      'Cold dry air, physical exercise, or sudden weather shifts',
      'Chest colds or respiratory viral infections'
    ],
    signsYouMayNotice: [
      'A whistling or squeaking sound when breathing out (wheezing)',
      'Shortness of breath or feeling like you cannot take a full deep breath',
      'Tightness, stiffness, or heaviness across the chest',
      'Frequent coughing, especially at night or early in the morning'
    ],
    howDoesItSpread: 'Asthma is a non-communicable chronic condition. It cannot be caught from another person.',
    whoIsAtRisk: [
      'Children and adults with personal or family history of allergies (eczema, hay fever)',
      'People living in heavily polluted urban areas',
      'Workers exposed to dust, chemicals, or flour dust regularly'
    ],
    howToReduceRisk: [
      'Identify and avoid your personal triggers (like dust, pet fur, or smoke)',
      'Keep bedrooms clean and dust-free; wash bedding in hot water weekly',
      'Keep inhalers easily accessible and use preventer inhalers regularly as prescribed by your doctor',
      'Wear a protective mask on days with high outdoor air pollution'
    ],
    whenToSeeDoctor: [
      'Your quick-relief rescue inhaler does not ease breathing within 15 minutes',
      'Your breathing is so rapid that talking in full sentences is difficult',
      'Your lips or fingernails appear pale or bluish (call emergency services immediately)'
    ],
    howCommonIsIt: 'More than 260 million people worldwide live with asthma, and it is the most common chronic disease among children.',
    reliableSources: [
      'Global Initiative for Asthma (GINA)',
      'World Health Organization (WHO) — Asthma Fact Sheet',
      'American Lung Association'
    ],
    datasetKey: 'asthma',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-12'
  },
  {
    id: 'malaria',
    name: 'Malaria',
    medicalName: 'Plasmodium Parasite Infection',
    categoryGroup: 'Common Illnesses',
    subCategory: 'Fever & Mosquito-Borne',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'A preventable and treatable infection transmitted through the bite of an infected Anopheles mosquito.',
    whatIsIt: 'Malaria is caused by tiny single-celled parasites belonging to the Plasmodium family. When an infected mosquito bites you, the parasite travels through your bloodstream to your liver and red blood cells, causing recurring fever cycles.',
    whyDoesItHappen: [
      'Bite from an infected female Anopheles mosquito',
      'Mosquitoes breeding in stagnant water, puddles, ditches, and overgrown grass',
      'Mosquitoes biting predominantly between dusk and dawn'
    ],
    signsYouMayNotice: [
      'Episodes of high fever starting with shaking chills (rigors)',
      'Profuse sweating as the fever breaks several hours later',
      'Severe headache, nausea, and vomiting',
      'General body pain, joint fatigue, and muscle weakness'
    ],
    howDoesItSpread: 'Transmitted almost entirely through mosquito bites. It does not spread through casual touching, sneezing, or saliva.',
    whoIsAtRisk: [
      'Infants and children under 5 years old',
      'Pregnant women in malaria-endemic areas',
      'Travelers visiting tropical regions without preventive medication'
    ],
    howToReduceRisk: [
      'Sleep under insecticide-treated bed nets (ITNs) every night',
      'Apply mosquito repellents on exposed skin in the evening and nighttime',
      'Clear stagnant water and puddles near houses to stop mosquito breeding',
      'Take preventive antimalarial pills if advised by a travel clinic before visiting risk zones'
    ],
    whenToSeeDoctor: [
      'Any recurring high fever with shivering chills after being in a mosquito-prone area',
      'Extreme drowsiness, confusion, or convulsions (signs of severe cerebral malaria)',
      'Inability to drink or severe yellowing of the eyes'
    ],
    howCommonIsIt: 'Around 249 million cases occur worldwide each year, primarily in Africa, parts of Asia, and South America.',
    reliableSources: [
      'World Health Organization (WHO) — World Malaria Report',
      'NVBDCP India — National Malaria Elimination Guidelines',
      'CDC — Malaria Division'
    ],
    datasetKey: 'malaria',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-28'
  },
  {
    id: 'tuberculosis',
    name: 'Tuberculosis',
    medicalName: 'Mycobacterium tuberculosis (TB)',
    categoryGroup: 'Common Illnesses',
    subCategory: 'Respiratory & Infections',
    illustrationIcon: 'Activity',
    shortDescription: 'A treatable bacterial infection that mostly attacks your lungs but can affect other parts of the body.',
    whatIsIt: 'Tuberculosis (TB) is an infection caused by bacteria that typically infect the lungs (pulmonary TB). While it can be serious if left untreated, complete medical cures are achievable with a standardized multi-month course of antibiotics.',
    whyDoesItHappen: [
      'Inhaling microscopic airborne droplets containing TB bacteria from an untreated person',
      'Living or working in poorly ventilated, overcrowded spaces',
      'A weakened immune system that cannot contain dormant bacteria inside the lungs'
    ],
    signsYouMayNotice: [
      'A persistent cough that lasts for 3 weeks or longer',
      'Coughing up phlegm, sometimes with traces of blood',
      'Low-grade fever, especially rising in the evening hours',
      'Drenching night sweats that soak clothing or bedding',
      'Unexplained weight loss and ongoing loss of appetite'
    ],
    howDoesItSpread: 'Spreads through the air when a person with active untreated lung TB coughs, sneezes, spits, or speaks. It requires prolonged close contact to spread.',
    whoIsAtRisk: [
      'People with weakened immune defenses, such as those living with HIV or diabetes',
      'People who smoke or are undernourished',
      'Close household contacts of an untreated person with active TB'
    ],
    howToReduceRisk: [
      'BCG vaccination given to babies provides significant protection against severe forms of childhood TB',
      'Ensure cross-ventilation with fresh air and sunlight in homes and workplaces',
      'Complete the full prescribed antibiotic course without stopping early if diagnosed',
      'Wear a protective mask if caring for an actively coughing patient until cleared by a doctor'
    ],
    whenToSeeDoctor: [
      'Any cough lasting longer than 2 to 3 weeks must be tested with a simple sputum test and chest X-ray',
      'You notice blood in your spit or cough',
      'You have rapid weight loss and recurring evening fevers'
    ],
    howCommonIsIt: 'About 10.6 million people develop active TB each year globally, with major national elimination programs active worldwide.',
    reliableSources: [
      'World Health Organization (WHO) — Global Tuberculosis Report',
      'Central TB Division (CTD) — National TB Elimination Programme (NTEP India)',
      'CDC — Tuberculosis Division'
    ],
    datasetKey: 'tuberculosis',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-30'
  },
  {
    id: 'food-poisoning',
    name: 'Food Poisoning',
    medicalName: 'Acute Foodborne Illness',
    categoryGroup: 'Common Illnesses',
    subCategory: 'Stomach & Digestion',
    illustrationIcon: 'AlertTriangle',
    shortDescription: 'Illness caused by eating food or drinking water contaminated with harmful germs or their toxins.',
    whatIsIt: 'Food poisoning is an irritation and inflammation of your digestive tract that happens when you consume food containing harmful bacteria (like Salmonella or E. coli), viruses, or toxins. Most cases clear up within a few days with rest and hydration.',
    whyDoesItHappen: [
      'Eating raw or undercooked meat, poultry, seafood, or eggs',
      'Leaving cooked food at room temperature for more than 2 hours',
      'Cross-contamination: using the same cutting board or knife for raw meat and fresh vegetables',
      'Food prepared by someone who did not wash their hands after using the toilet'
    ],
    signsYouMayNotice: [
      'Upset stomach and sudden cramping belly pain',
      'Nausea and frequent vomiting',
      'Watery diarrhea that begins a few hours to a day after eating',
      'Mild fever, body weakness, and chills'
    ],
    howDoesItSpread: 'Not usually spread directly from person to person, but anyone sharing the same contaminated food item can fall ill simultaneously.',
    whoIsAtRisk: [
      'Elderly individuals and young children under 5',
      'Pregnant women',
      'Anyone with a compromised immune system'
    ],
    howToReduceRisk: [
      'Keep raw meats completely separate from ready-to-eat foods in your kitchen',
      'Cook foods to safe internal temperatures; boil and reheat food thoroughly',
      'Store cooked leftovers in the refrigerator within 2 hours',
      'Wash cutting boards, utensils, and countertops with hot soapy water after preparing raw ingredients'
    ],
    whenToSeeDoctor: [
      'You cannot keep any fluids down for more than 12 hours due to vomiting',
      'Diarrhea lasts more than 3 days, or you notice blood in your stool',
      'Signs of severe dehydration: very dry mouth, little to no urination, or dizziness when standing'
    ],
    howCommonIsIt: 'Around 600 million cases occur worldwide each year — nearly 1 in 10 people fall ill from contaminated food annually.',
    reliableSources: [
      'World Health Organization (WHO) — Food Safety',
      'Food Safety and Standards Authority of India (FSSAI)',
      'Centers for Disease Control and Prevention (CDC)'
    ],
    datasetKey: 'food-poisoning',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-14'
  },
  {
    id: 'stomach-infections',
    name: 'Stomach Infections',
    medicalName: 'Acute Gastroenteritis',
    categoryGroup: 'Common Illnesses',
    subCategory: 'Stomach & Digestion',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'Inflammation of the stomach and intestines caused by viruses or bacteria, leading to diarrhea and cramps.',
    whatIsIt: 'Often called "stomach flu" (though not caused by the influenza virus), acute gastroenteritis is an infection of the intestines. It disrupts normal water absorption in your bowels, causing frequent loose bowel movements and stomach rumbling.',
    whyDoesItHappen: [
      'Rotavirus or norovirus infections spreading quickly through close contact',
      'Bacterial bugs in water or unpasteurized dairy',
      'Poor handwashing after using the restroom or changing diapers'
    ],
    signsYouMayNotice: [
      'Watery diarrhea occurring multiple times a day',
      'Painful cramping in the lower stomach area',
      'Feeling bloated, nauseous, or vomiting',
      'Mild low-grade fever and sluggishness'
    ],
    howDoesItSpread: 'Highly contagious. Spreads easily when an infected person touches surfaces or prepares food without washing hands.',
    whoIsAtRisk: [
      'Schoolchildren and toddlers in daycares',
      'Residents in community care or dormitories',
      'Travelers visiting places with differing water filtration standards'
    ],
    howToReduceRisk: [
      'Wash hands thoroughly with soap, especially after using the bathroom and before handling food',
      'Disinfect contaminated surfaces immediately if someone at home is sick',
      'Drink oral rehydration solution (ORS) with clean water to replace lost minerals'
    ],
    whenToSeeDoctor: [
      'Diarrhea lasts longer than 48 hours without showing signs of slowing',
      'Stool contains blood, black tarry color, or pus',
      'You feel dizzy, faint, or cannot produce urine for 8 hours'
    ],
    howCommonIsIt: 'One of the most widespread short-term illnesses across all age groups globally.',
    reliableSources: [
      'World Health Organization (WHO) — Diarrheal Disease',
      'CDC — Viral Gastroenteritis',
      'National Health Portal (NHP India)'
    ],
    datasetKey: 'stomach-infections',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-19'
  },
  {
    id: 'urinary-infections',
    name: 'Urinary Infections',
    medicalName: 'Urinary Tract Infection (UTI)',
    categoryGroup: 'Common Illnesses',
    subCategory: 'Kidneys & Urinary',
    illustrationIcon: 'Droplets',
    shortDescription: 'An infection in any part of your urinary system, most commonly the bladder, that causes burning during urination.',
    whatIsIt: 'A urinary tract infection (UTI) occurs when bacteria enter the urinary tube (urethra) and multiply inside the bladder. With prompt medical care and a short course of targeted antibiotics, it resolves quickly without lasting harm.',
    whyDoesItHappen: [
      'Common bacteria from the digestive tract (such as E. coli) entering the urinary opening',
      'Not drinking enough water throughout the day, which slows natural bladder flushing',
      'Holding urine for extended periods rather than emptying the bladder promptly',
      'Natural anatomy: women have shorter urethras, making it easier for bacteria to reach the bladder'
    ],
    signsYouMayNotice: [
      'A sharp, burning sensation when urinating',
      'An urgent, frequent need to pee even when only tiny drops come out',
      'Urine that looks cloudy, hazy, or has an unusually strong odor',
      'Discomfort, pressure, or cramping in the lower pelvic area'
    ],
    howDoesItSpread: 'UTIs are not contagious and do not spread from person to person through casual contact.',
    whoIsAtRisk: [
      'Women of all ages (due to shorter urinary anatomy)',
      'People who do not drink sufficient water daily',
      'Older adults and individuals with kidney stones or urinary catheters'
    ],
    howToReduceRisk: [
      'Drink plenty of water every day — 6 to 8 glasses helps flush out bacteria',
      'Wipe from front to back after using the toilet',
      'Empty your bladder soon after sexual intercourse',
      'Do not hold your urine when you feel the urge to go'
    ],
    whenToSeeDoctor: [
      'You experience burning, pain, or fever with frequent urination',
      'You feel sharp pain in your back or side below the ribs (flank pain points to a kidney infection)',
      'You notice pink, red, or cola-colored blood in your urine'
    ],
    howCommonIsIt: 'Very common. About 1 in every 2 women experiences at least one UTI during their lifetime.',
    reliableSources: [
      'American Urological Association (AUA) — UTI Guidelines',
      'CDC — Urinary Tract Infection',
      'National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK)'
    ],
    datasetKey: 'urinary-infections',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-21'
  },

  // ==========================================
  // 2. OTHER HEALTH PROBLEMS (7 conditions)
  // ==========================================
  {
    id: 'diabetes',
    name: 'Diabetes',
    medicalName: 'Diabetes Mellitus (Type 2)',
    categoryGroup: 'Other Health Problems',
    subCategory: 'Blood Sugar & Hormones',
    illustrationIcon: 'Activity',
    shortDescription: 'Your body has trouble turning sugar from food into energy, leading to elevated sugar levels in your blood.',
    whatIsIt: 'When you eat, your digestive system breaks food down into sugar (glucose). A hormone called insulin helps move that sugar into your cells for fuel. With diabetes, your body does not make enough insulin or cannot use it properly, leaving sugar trapped in your bloodstream.',
    whyDoesItHappen: [
      'Body cells stop responding properly to insulin signals (insulin resistance)',
      'The pancreas cannot produce enough insulin over time',
      'Consuming diets heavy in refined sugars, sodas, and processed carbs',
      'Carrying extra weight, particularly around the abdomen',
      'Family history and genetic factors'
    ],
    signsYouMayNotice: [
      'Feeling very thirsty even after drinking water',
      'Needing to urinate much more often, especially at night',
      'Feeling unusually tired after meals',
      'Unintended weight loss without changing diet',
      'Slow healing of cuts or scrapes on feet and hands'
    ],
    howDoesItSpread: 'Diabetes is a metabolic condition. It is not contagious and cannot be passed to another person.',
    whoIsAtRisk: [
      'Adults aged 35 or older',
      'People with a family history of diabetes',
      'Individuals who do not engage in regular physical activity',
      'Women who had diabetes during pregnancy (gestational diabetes)'
    ],
    howToReduceRisk: [
      'Eat more fiber: vegetables, lentils, beans, oats, and whole grains',
      'Replace sugary drinks with plain water or herbal teas',
      'Walk 20 to 30 minutes every day; brisk walking after meals helps muscles absorb sugar naturally',
      'Keep a healthy body weight with sustainable lifestyle habits',
      'Have your fasting blood sugar or HbA1c checked annually'
    ],
    whenToSeeDoctor: [
      'Your fasting blood sugar reading repeatedly exceeds 100 mg/dL',
      'You experience constant unquenchable thirst and frequent night urination',
      'You notice tingling, numbness, or burning sensations in your feet or fingers'
    ],
    howCommonIsIt: 'Over 530 million adults live with diabetes globally, with cases rising in both urban and rural communities.',
    reliableSources: [
      'International Diabetes Federation (IDF) — Diabetes Atlas',
      'World Health Organization (WHO) — Diabetes Fact Sheet',
      'American Diabetes Association (ADA)'
    ],
    datasetKey: 'diabetes',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-11-02'
  },
  {
    id: 'high-blood-pressure',
    name: 'High Blood Pressure',
    medicalName: 'Hypertension',
    categoryGroup: 'Other Health Problems',
    subCategory: 'Heart & Circulation',
    illustrationIcon: 'Heart',
    shortDescription: 'Blood pushing too hard against your blood vessel walls, putting unnecessary strain on your heart.',
    whatIsIt: 'Blood pressure is the measure of the force that your blood exerts against your artery walls as it circulates. When this pressure remains consistently high, it slowly damages blood vessels and increases the workload on your heart.',
    whyDoesItHappen: [
      'Arteries naturally stiffening or narrowing as we grow older',
      'Eating too much sodium (salt), which makes the body hold onto extra water',
      'Lack of daily physical activity',
      'Carrying extra weight, which requires more blood flow through the body',
      'Chronic stress, poor sleep, and smoking'
    ],
    signsYouMayNotice: [
      'Most people have no symptoms at all — that is why it is often called a "silent" condition',
      'Dull morning headaches behind the head',
      'Feeling dizzy or unsteady when standing up quickly',
      'Shortness of breath after climbing a flight of stairs'
    ],
    howDoesItSpread: 'It is a lifestyle and cardiovascular condition; it does not spread from person to person.',
    whoIsAtRisk: [
      'Adults over 40 years old',
      'People with parents or grandparents who had high blood pressure',
      'Individuals who regularly eat salty, packaged, or fried food',
      'People living with chronic stress or poor sleep'
    ],
    howToReduceRisk: [
      'Cut down table salt and avoid ultra-processed foods',
      'Aim for at least 150 minutes of moderate exercise like brisk walking each week',
      'Eat foods rich in potassium like bananas, spinach, and sweet potatoes',
      'Maintain a healthy weight and limit alcohol consumption',
      'Check your blood pressure with a simple arm cuff at home regularly'
    ],
    whenToSeeDoctor: [
      'Your home blood pressure consistently reads above 135/85 mmHg across several days',
      'You experience sudden severe headaches with chest tightness or blurry eyesight (seek emergency medical help)'
    ],
    howCommonIsIt: 'About 1 in 3 adults worldwide has high blood pressure, and many do not realize they have it.',
    reliableSources: [
      'World Health Organization (WHO) — Hypertension Guidelines',
      'American Heart Association (AHA)',
      'Indian Council of Medical Research (ICMR)'
    ],
    datasetKey: 'high-blood-pressure',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-11-03'
  },
  {
    id: 'kidney-problems',
    name: 'Kidney Problems',
    medicalName: 'Chronic Kidney Disease (CKD)',
    categoryGroup: 'Other Health Problems',
    subCategory: 'Kidneys & Urinary',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'Your kidneys have difficulty filtering waste and excess fluid from your blood into urine.',
    whatIsIt: 'Your kidneys are two bean-shaped organs that act as your body’s natural filtration plant. They clean about 200 quarts of fluid every day. When kidneys become damaged over time, waste products and excess water build up in the body.',
    whyDoesItHappen: [
      'Long-standing high blood pressure that damages the delicate filtering units (nephrons)',
      'High blood sugar from diabetes injuring kidney blood vessels',
      'Overuse of over-the-counter painkiller medicines (NSAIDs)',
      'Recurring untreated kidney or urinary infections'
    ],
    signsYouMayNotice: [
      'Swelling in the feet, ankles, lower legs, or puffiness around your eyes',
      'Urine that looks foamy or bubbly, indicating protein leakage',
      'Feeling tired, lacking energy, or having trouble concentrating',
      'Dry, itchy skin that does not go away with lotion',
      'Needing to urinate much more or much less than usual'
    ],
    howDoesItSpread: 'Non-communicable condition. It cannot spread from person to person.',
    whoIsAtRisk: [
      'People living with diabetes or high blood pressure',
      'Individuals with a family history of kidney failure',
      'People over age 60',
      'Regular users of non-steroidal anti-inflammatory pain pills'
    ],
    howToReduceRisk: [
      'Keep your blood pressure and blood sugar well within target ranges',
      'Drink sufficient clean water to stay hydrated',
      'Avoid taking painkillers without consulting a doctor',
      'Get a simple annual urine test for protein (microalbumin) and a blood test for creatinine'
    ],
    whenToSeeDoctor: [
      'You notice unexplained swelling in your ankles or legs with foamy urine',
      'Routine blood tests show an estimated filtration rate (eGFR) below 60 mL/min',
      'Persistent nausea, metallic taste in the mouth, and loss of appetite'
    ],
    howCommonIsIt: 'Affects an estimated 10% of the world’s population — more than 800 million people live with kidney disease.',
    reliableSources: [
      'National Kidney Foundation (NKF)',
      'World Health Organization (WHO) — Noncommunicable Diseases',
      'International Society of Nephrology (ISN)'
    ],
    datasetKey: 'kidney-problems',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-29'
  },
  {
    id: 'heart-problems',
    name: 'Heart Problems',
    medicalName: 'Coronary Artery Disease & Heart Conditions',
    categoryGroup: 'Other Health Problems',
    subCategory: 'Heart & Circulation',
    illustrationIcon: 'Heart',
    shortDescription: 'Narrowed blood vessels or weakened heart muscle that limit healthy blood flow to your body.',
    whatIsIt: 'Heart problems encompass conditions that affect the heart muscle, valves, rhythm, or the coronary arteries that supply blood to the heart itself. The most common form happens when fatty deposits (plaque) slowly narrow the heart’s arteries.',
    whyDoesItHappen: [
      'High cholesterol building up inside coronary arteries over years',
      'High blood pressure weakening arterial linings',
      'Smoking, which damages blood vessels and speeds up plaque buildup',
      'Inactivity, unhealthy diets high in trans fats, and uncontrolled stress'
    ],
    signsYouMayNotice: [
      'Discomfort, squeezing, pressure, or fullness in the center of the chest',
      'Pain spreading to the left shoulder, neck, jaw, or upper back',
      'Shortness of breath during mild activities like walking or climbing stairs',
      'Feeling dizzy, lightheaded, or having sudden cold sweats',
      'Fluttering or racing heartbeat (palpitations)'
    ],
    howDoesItSpread: 'Heart diseases are non-communicable; they develop inside the body and do not spread.',
    whoIsAtRisk: [
      'Men over 45 and women over 55',
      'People with high blood pressure, high cholesterol, or diabetes',
      'Smokers and people exposed to chronic secondhand smoke',
      'Those with a parent or sibling who suffered early heart disease'
    ],
    howToReduceRisk: [
      'Eat a heart-healthy diet rich in fruits, vegetables, fish, nuts, and whole grains',
      'Engage in 30 minutes of aerobic exercise, such as walking, cycling, or swimming, 5 days a week',
      'Quit smoking immediately to dramatically cut heart attack risk',
      'Maintain healthy cholesterol, blood pressure, and weight numbers'
    ],
    whenToSeeDoctor: [
      'Chest pain, tightness, or breathlessness (treat as a medical emergency — call emergency services)',
      'Heart feels like it is skipping beats or racing rapidly while resting',
      'Sudden swelling in both feet with shortness of breath when lying flat'
    ],
    howCommonIsIt: 'Cardiovascular diseases are the leading cause of death worldwide, responsible for an estimated 17.9 million lives each year.',
    reliableSources: [
      'World Heart Federation (WHF)',
      'American Heart Association (AHA)',
      'World Health Organization (WHO) — Cardiovascular Diseases'
    ],
    datasetKey: 'heart-problems',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-11-04'
  },
  {
    id: 'liver-problems',
    name: 'Liver Problems',
    medicalName: 'Fatty Liver & Chronic Liver Disease',
    categoryGroup: 'Other Health Problems',
    subCategory: 'Blood & Liver',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'Inflammation or fat buildup inside liver cells that interferes with your body’s detoxification and digestion.',
    whatIsIt: 'Your liver is your largest internal organ, handling over 500 vital jobs including processing nutrients, breaking down medicines, and filtering toxins. Liver problems occur when liver cells become swollen with fat, inflamed by viruses, or scarred by long-term damage.',
    whyDoesItHappen: [
      'Excess fat accumulation inside liver cells (Non-Alcoholic Fatty Liver Disease)',
      'Heavy, prolonged alcohol consumption',
      'Chronic viral hepatitis infections (Hepatitis B or C)',
      'Exposure to industrial toxins or long-term medication side effects'
    ],
    signsYouMayNotice: [
      'Persistent tiredness and lack of stamina',
      'A dull ache or heavy fullness in the upper right side of your belly',
      'Yellowing of the whites of your eyes or skin (jaundice)',
      'Swelling in the legs or swelling of the stomach area',
      'Skin that bruises easily or constant unexplained itching'
    ],
    howDoesItSpread: 'Fatty liver and alcohol-related liver conditions are non-communicable. Viral hepatitis forms can spread through blood or contaminated water.',
    whoIsAtRisk: [
      'People who carry extra belly fat or have insulin resistance',
      'People with type 2 diabetes or elevated triglycerides in their blood',
      'Heavy alcohol drinkers',
      'Individuals who received non-sterile injections or tattoos'
    ],
    howToReduceRisk: [
      'Maintain a healthy weight through gradual, consistent dietary improvements',
      'Avoid sugary sodas, packaged fruit juices, and fried snacks',
      'Limit or eliminate alcoholic beverages',
      'Get vaccinated against Hepatitis A and B',
      'Ask your doctor to check your liver enzymes (SGOT/SGPT) during regular blood work'
    ],
    whenToSeeDoctor: [
      'You notice yellowing in the whites of your eyes, dark urine, or pale stools',
      'Swelling develops in your abdomen or ankles',
      'You vomit blood or notice dark, tarry stools (requires immediate emergency care)'
    ],
    howCommonIsIt: 'Non-alcoholic fatty liver affects roughly 25% to 30% of adults globally and is increasingly diagnosed among young adults.',
    reliableSources: [
      'American Association for the Study of Liver Diseases (AASLD)',
      'World Health Organization (WHO) — Liver Health',
      'European Association for the Study of the Liver (EASL)'
    ],
    datasetKey: 'liver-problems',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-26'
  },
  {
    id: 'thyroid-problems',
    name: 'Thyroid Problems',
    medicalName: 'Hypothyroidism & Hyperthyroidism',
    categoryGroup: 'Other Health Problems',
    subCategory: 'Blood Sugar & Hormones',
    illustrationIcon: 'Activity',
    shortDescription: 'The butterfly-shaped gland in your neck makes too little or too much hormone, affecting your energy and metabolism.',
    whatIsIt: 'Your thyroid is a small gland at the base of your neck that produces hormones controlling your body’s metabolic speed — how fast your cells burn energy. When it produces too little hormone (hypothyroidism), your body slows down; when it produces too much (hyperthyroidism), everything speeds up.',
    whyDoesItHappen: [
      'Autoimmune conditions where your immune system mistakenly attacks thyroid tissue (like Hashimoto’s or Graves’ disease)',
      'Not getting enough iodine in the diet (less common where iodized salt is standard)',
      'Family genetics and history of thyroid conditions',
      'Inflammation of the thyroid gland after a viral infection or pregnancy'
    ],
    signsYouMayNotice: [
      'If underactive (Hypothyroidism): Feeling sluggish, unexplained weight gain, feeling cold all the time, dry skin, hair thinning, constipation',
      'If overactive (Hyperthyroidism): Rapid or racing heartbeat, unexplained weight loss despite eating well, shakiness in the hands, feeling uncomfortably hot, anxiety'
    ],
    howDoesItSpread: 'Thyroid conditions are internal endocrine disorders and are completely non-communicable.',
    whoIsAtRisk: [
      'Women (5 to 8 times more likely than men to have thyroid issues)',
      'People over age 50',
      'Individuals with a family history of thyroid disorders',
      'People with other autoimmune conditions like type 1 diabetes or celiac disease'
    ],
    howToReduceRisk: [
      'Use iodized salt in daily cooking to provide essential trace iodine',
      'Eat a balanced diet with adequate selenium and zinc (found in eggs, nuts, and whole grains)',
      'Have your doctor check a simple TSH (Thyroid Stimulating Hormone) blood test if you experience unexplained fatigue or weight shifts'
    ],
    whenToSeeDoctor: [
      'You experience persistent fatigue, brain fog, and weight gain that diet does not explain',
      'You feel a lump, swelling, or fullness in the front of your neck',
      'Your heart races or flutters while you are resting calmly'
    ],
    howCommonIsIt: 'Around 200 million people worldwide live with thyroid conditions, and up to 50% remain undiagnosed.',
    reliableSources: [
      'American Thyroid Association (ATA)',
      'British Thyroid Foundation',
      'National Health Portal (NHP India)'
    ],
    datasetKey: 'thyroid-problems',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-24'
  },
  {
    id: 'anaemia',
    name: 'Anaemia',
    medicalName: 'Iron Deficiency & Low Hemoglobin',
    categoryGroup: 'Other Health Problems',
    subCategory: 'Blood & Liver',
    illustrationIcon: 'Droplets',
    shortDescription: 'Your blood does not have enough healthy red blood cells or hemoglobin to carry oxygen around your body.',
    whatIsIt: 'Red blood cells contain an iron-rich protein called hemoglobin, which picks up oxygen in your lungs and carries it to your brain, muscles, and organs. When you have anaemia, your tissues do not get enough oxygen, leaving you feeling tired and out of breath.',
    whyDoesItHappen: [
      'Not eating enough iron-rich foods in daily meals (iron-deficiency anaemia)',
      'Blood loss from heavy menstrual periods or stomach ulcers',
      'Lack of vitamin B12 or folic acid in the diet',
      'Body having trouble absorbing iron from food due to gut conditions'
    ],
    signsYouMayNotice: [
      'Feeling constantly exhausted and weak even after a full night’s sleep',
      'Pale, washed-out color in your skin, inside your lower eyelids, or on your tongue',
      'Feeling cold in your hands and feet',
      'Dizziness, lightheadedness, or feeling faint when standing',
      'Shortness of breath with minimal walking'
    ],
    howDoesItSpread: 'Anaemia is a nutritional and hematological condition; it is not contagious.',
    whoIsAtRisk: [
      'Women of childbearing age with heavy menstrual cycles',
      'Pregnant women who need extra iron for baby development',
      'Growing children and teenagers',
      'Strict vegetarians or vegans who do not supplement iron or vitamin B12'
    ],
    howToReduceRisk: [
      'Eat iron-rich foods: green leafy vegetables (spinach, fenugreek), lentils, beans, fortified cereals, and jaggery',
      'Pair plant-based iron foods with vitamin C (like lemon juice, oranges, or tomatoes) to boost iron absorption',
      'Avoid drinking black tea or coffee immediately with meals, as tannins reduce iron absorption',
      'Take iron and folic acid supplements if prescribed by your healthcare provider'
    ],
    whenToSeeDoctor: [
      'You have ongoing fatigue that interferes with your daily activities',
      'You experience dizziness, fast heartbeats, or shortness of breath doing routine tasks',
      'A simple Complete Blood Count (CBC) test shows hemoglobin below 12 g/dL (for women) or 13 g/dL (for men)'
    ],
    howCommonIsIt: 'Affects nearly 1.9 billion people globally — about 24% of the world’s population — with highest prevalence among women and young children.',
    reliableSources: [
      'World Health Organization (WHO) — Anaemia Fact Sheet',
      'National Family Health Survey (NFHS India)',
      'CDC — Iron and Iron Deficiency'
    ],
    datasetKey: 'anaemia',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-16'
  },

  // ==========================================
  // 3. CANCER TYPES (16 conditions)
  // ==========================================
  {
    id: 'breast-cancer',
    name: 'Breast Cancer',
    medicalName: 'Carcinoma of the Breast',
    categoryGroup: 'Cancer Types',
    subCategory: 'Common Cancers',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'Abnormal cells grow out of control in the breast tissue, forming a lump that can be detected through regular screening.',
    whatIsIt: 'Breast cancer begins when cells in the breast start dividing abnormally and uncontrollably. It most commonly starts in the milk-producing ducts (ductal carcinoma) or glands (lobular carcinoma). When discovered early through self-checks and mammograms, treatment is highly successful.',
    whyDoesItHappen: [
      'DNA mutations in breast cells over time',
      'Inherited genetic alterations (such as BRCA1 and BRCA2 genes)',
      'Hormonal factors: early onset of menstruation, late menopause, or hormone therapy',
      'Increasing age and dense breast tissue',
      'Lifestyle factors including alcohol intake, lack of physical activity, and extra weight after menopause'
    ],
    signsYouMayNotice: [
      'A new lump or firm thickening in the breast or armpit that feels different from surrounding tissue',
      'Change in the size, shape, or contour of the breast',
      'Dimpling, puckering, or redness of the breast skin (like an orange peel)',
      'Inward turning of the nipple or unexplained nipple discharge (other than breast milk)'
    ],
    howDoesItSpread: 'Cancer is not contagious. Inside the body, cancer cells can spread locally or travel through lymph nodes to other organs if not treated.',
    whoIsAtRisk: [
      'Women over 40 (although younger women and men can also develop it)',
      'People with close relatives who had breast or ovarian cancer',
      'Individuals with inherited BRCA gene mutations',
      'People who have had prior radiation therapy to the chest area'
    ],
    howToReduceRisk: [
      'Perform monthly breast self-checks to know what is normal for your body',
      'Schedule regular clinical breast exams and screening mammograms as recommended by age guidelines',
      'Engage in regular physical exercise and maintain a balanced weight',
      'Limit alcohol intake and discuss hormone therapy risks with your physician'
    ],
    whenToSeeDoctor: [
      'Any new lump, thickening, or skin change in the breast or armpit should be examined by a doctor without delay',
      'Any spontaneous or bloody discharge from the nipple'
    ],
    howCommonIsIt: 'The most commonly diagnosed cancer worldwide, with about 2.3 million new cases annually according to WHO.',
    reliableSources: [
      'World Health Organization (WHO) — Breast Cancer',
      'American Cancer Society (ACS)',
      'National Cancer Grid (India)'
    ],
    datasetKey: 'breast-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-11-05'
  },
  {
    id: 'lung-cancer',
    name: 'Lung Cancer',
    medicalName: 'Bronchogenic Carcinoma',
    categoryGroup: 'Cancer Types',
    subCategory: 'Common Cancers',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'Abnormal cell growth in the lung tissues, most often associated with inhaling smoke or airborne pollutants.',
    whatIsIt: 'Lung cancer develops in the breathing airways and sponge-like tissues of the lungs. It is divided primarily into non-small cell lung cancer (the most common type) and small cell lung cancer. Early detection through low-dose CT scans in high-risk individuals saves lives.',
    whyDoesItHappen: [
      'Cigarette, bidi, cigar, or pipe smoking (accounts for roughly 85% of cases)',
      'Exposure to secondhand tobacco smoke',
      'Inhaling radon gas, asbestos fibers, or heavy diesel particulate exhaust',
      'Severe long-term urban air pollution and indoor burning of solid fuels'
    ],
    signsYouMayNotice: [
      'A new cough that does not go away or a chronic smoker’s cough that worsens',
      'Coughing up small amounts of blood or rust-colored spit',
      'Shortness of breath and wheezing without clear cause',
      'Persistent, dull chest pain that hurts more when breathing deeply, coughing, or laughing',
      'Unexplained weight loss and hoarseness in the voice'
    ],
    howDoesItSpread: 'Not contagious. Within the body, it can spread to surrounding lung tissue, lymph nodes, and other organs.',
    whoIsAtRisk: [
      'Current or former smokers (risk increases with years and number of cigarettes smoked)',
      'People with long-term exposure to secondhand smoke',
      'Workers in mining, construction, or manufacturing with asbestos exposure'
    ],
    howToReduceRisk: [
      'Do not smoke; if you smoke, quitting at any age immediately lowers your risk',
      'Stay away from secondhand smoke in homes, vehicles, and workplaces',
      'Test your home for radon gas if living in areas with underground granite formations',
      'Use protective respirators if working with industrial dusts or chemicals'
    ],
    whenToSeeDoctor: [
      'Any cough that lasts longer than 3 to 4 weeks or changes noticeably',
      'Coughing up even a tiny speck of blood',
      'Chest pain or unexplained shortness of breath'
    ],
    howCommonIsIt: 'The leading cause of cancer death worldwide, with around 2.2 million new cases diagnosed each year.',
    reliableSources: [
      'World Health Organization (WHO) — Lung Cancer',
      'American Lung Association',
      'National Cancer Institute (NCI)'
    ],
    datasetKey: 'lung-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-11-05'
  },
  {
    id: 'blood-cancer',
    name: 'Blood Cancer',
    medicalName: 'Leukemia, Lymphoma & Myeloma',
    categoryGroup: 'Cancer Types',
    subCategory: 'Common Cancers',
    illustrationIcon: 'Droplets',
    shortDescription: 'Cancers that affect the production and function of your blood cells and bone marrow.',
    whatIsIt: 'Blood cancers usually start in the bone marrow, where your body manufactures red blood cells, white blood cells, and platelets. The abnormal cells crowd out healthy blood cells, making it hard for your blood to fight infections, carry oxygen, or stop bleeding.',
    whyDoesItHappen: [
      'Acquired genetic mutations inside bone marrow stem cells',
      'Prior exposure to high-dose medical radiation or certain chemotherapy drugs',
      'Exposure to industrial chemicals such as benzene',
      'Certain viral infections (like Epstein-Barr virus) linked to lymphomas'
    ],
    signsYouMayNotice: [
      'Persistent tiredness and pale skin (from low red blood cells)',
      'Frequent, recurring infections that are hard to shake off (from low white blood cells)',
      'Easy bruising, bleeding gums, or frequent nosebleeds (from low platelets)',
      'Painless swelling of lymph nodes in the neck, armpits, or groin',
      'Unexplained fevers and soaking night sweats'
    ],
    howDoesItSpread: 'Blood cancers are non-communicable; they cannot spread from person to person.',
    whoIsAtRisk: [
      'Risk varies by type: acute leukemias can affect children and adults; lymphomas are more common in adults',
      'People with certain genetic conditions such as Down syndrome',
      'Individuals with a compromised immune system'
    ],
    howToReduceRisk: [
      'Avoid unnecessary exposure to industrial solvents like benzene',
      'Maintain overall immune health through wholesome nutrition and avoiding smoking',
      'Get prompt blood evaluations if experiencing persistent fatigue or easy bruising'
    ],
    whenToSeeDoctor: [
      'Unexplained swollen lymph nodes that do not shrink after a couple of weeks',
      'Frequent unusual bruising without injury or tiny red dots on the skin (petechiae)',
      'Persistent fever, night sweats, and rapid weight loss'
    ],
    howCommonIsIt: 'Accounts for about 10% of all new cancer diagnoses worldwide each year.',
    reliableSources: [
      'Leukemia & Lymphoma Society (LLS)',
      'World Health Organization (WHO) — Hematologic Malignancies',
      'National Cancer Institute'
    ],
    datasetKey: 'blood-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-31'
  },
  {
    id: 'skin-cancer',
    name: 'Skin Cancer',
    medicalName: 'Melanoma & Non-Melanoma Carcinoma',
    categoryGroup: 'Cancer Types',
    subCategory: 'Other Cancers',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'Abnormal growth of skin cells, most often triggered by ultraviolet (UV) radiation from sunlight.',
    whatIsIt: 'Skin cancer is the uncontrolled growth of abnormal skin cells. The most common forms are basal cell carcinoma and squamous cell carcinoma (often easily treated when caught early), while melanoma is a rarer but more serious form that starts in pigment-producing cells.',
    whyDoesItHappen: [
      'Excessive exposure to ultraviolet (UV) rays from sunlight or tanning beds',
      'Repeated severe sunburns, especially during childhood or youth',
      'DNA damage accumulating in skin cells over decades',
      'Having a large number of moles or atypical moles'
    ],
    signsYouMayNotice: [
      'The ABCDE signs for moles: Asymmetry, irregular Border, mixed Color, Diameter larger than a pencil eraser, and Evolving (changing over time)',
      'A firm, red nodule or a flat lesion with a scaly, crusted surface',
      'A pearly or waxy bump on sun-exposed areas like the face, neck, or arms',
      'A sore that bleeds, scabs, and fails to heal after several weeks'
    ],
    howDoesItSpread: 'Non-communicable. Most non-melanoma skin cancers stay local; melanoma can spread through the lymphatic system if not removed early.',
    whoIsAtRisk: [
      'People with fair skin, freckles, or light hair who sunburn easily',
      'Individuals who spend long hours working outdoors in intense sunlight',
      'People with a personal or family history of skin cancer'
    ],
    howToReduceRisk: [
      'Apply broad-spectrum sunscreen (SPF 30 or higher) on exposed skin every day',
      'Seek shade during peak sun hours (typically 10 AM to 4 PM)',
      'Wear wide-brimmed hats, UV-blocking sunglasses, and sun-protective clothing',
      'Perform monthly self-checks of your skin from head to toe'
    ],
    whenToSeeDoctor: [
      'Any mole that changes in size, shape, or color, or starts itching and bleeding',
      'Any spot on the skin that looks noticeably different from all of your other spots (the "ugly duckling" sign)'
    ],
    howCommonIsIt: 'Non-melanoma skin cancer is the most frequently diagnosed cancer in fair-skinned populations worldwide, with over 1.2 million cases annually.',
    reliableSources: [
      'Skin Cancer Foundation',
      'World Health Organization (WHO) — Ultraviolet Radiation and Skin Cancer',
      'American Academy of Dermatology (AAD)'
    ],
    datasetKey: 'skin-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-11-01'
  },
  {
    id: 'prostate-cancer',
    name: 'Prostate Cancer',
    medicalName: 'Prostatic Adenocarcinoma',
    categoryGroup: 'Cancer Types',
    subCategory: 'Common Cancers',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'Cancer that develops in the walnut-sized prostate gland in men, which produces seminal fluid.',
    whatIsIt: 'Prostate cancer develops in the prostate gland, located just below the bladder in front of the rectum. Many prostate cancers grow very slowly and remain confined to the gland, where they may need little or no immediate treatment, while others are more aggressive and require active therapy.',
    whyDoesItHappen: [
      'Gene mutations in prostate cells as men age',
      'Family history: having a father or brother who had prostate cancer',
      'Race and ethnicity: higher rates observed in men of African ancestry',
      'Diets heavy in red and processed meats with few fruits and vegetables'
    ],
    signsYouMayNotice: [
      'Trouble starting or stopping the flow of urine',
      'Weak or interrupted stream of urine',
      'Needing to urinate frequently, especially during the night',
      'Blood in the urine or semen',
      'Persistent discomfort in the pelvic area or lower back'
    ],
    howDoesItSpread: 'Non-communicable. It cannot spread from one person to another.',
    whoIsAtRisk: [
      'Men aged 50 and older (risk rises steadily with age)',
      'Men with a family history of prostate or breast cancer (BRCA mutations)',
      'Men carrying extra body weight'
    ],
    howToReduceRisk: [
      'Choose a healthy diet rich in fruits, vegetables, and whole grains (including tomatoes rich in lycopene)',
      'Exercise regularly to maintain a healthy body weight',
      'Discuss the benefits and limits of PSA (Prostate-Specific Antigen) blood screening with your doctor starting at age 50 (or age 45 if at higher risk)'
    ],
    whenToSeeDoctor: [
      'Difficulty urinating, painful urination, or blood in the urine',
      'A high or rising PSA number on routine health checkups'
    ],
    howCommonIsIt: 'The second most common cancer in men worldwide, with about 1.4 million new cases diagnosed each year.',
    reliableSources: [
      'World Health Organization (WHO) — Prostate Cancer',
      'Prostate Cancer Foundation',
      'American Urological Association (AUA)'
    ],
    datasetKey: 'prostate-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-11-02'
  },
  {
    id: 'cervical-cancer',
    name: 'Cervical Cancer',
    medicalName: 'Cervical Carcinoma (HPV-Related)',
    categoryGroup: 'Cancer Types',
    subCategory: 'Common Cancers',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'A preventable cancer of the lower part of the uterus (womb) that opens into the birth canal.',
    whatIsIt: 'Cervical cancer occurs in the cells of the cervix. Almost all cervical cancers are caused by long-standing infections with high-risk types of the Human Papillomavirus (HPV). With HPV vaccination and regular Pap/HPV tests, cervical cancer is one of the most preventable of all cancers.',
    whyDoesItHappen: [
      'Persistent infection with high-risk Human Papillomaviruses (HPV 16 and 18)',
      'Lack of screening tests that catch pre-cancerous cellular changes early',
      'Weakened immune system unable to clear viral infections',
      'Tobacco smoking, which weakens cervical tissue defenses'
    ],
    signsYouMayNotice: [
      'Early stages typically produce zero symptoms (why screening is essential)',
      'Unusual vaginal bleeding between menstrual cycles or after menopause',
      'Bleeding or pain during or after sexual intercourse',
      'Watery, bloody vaginal discharge that may have an unpleasant odor',
      'Pelvic pain or pain during urination'
    ],
    howDoesItSpread: 'Cancer itself is not contagious. However, the underlying HPV virus that leads to the disease is transmitted through intimate skin-to-skin contact.',
    whoIsAtRisk: [
      'Women who have never been screened with a Pap smear or HPV DNA test',
      'Unvaccinated individuals exposed to high-risk HPV strains',
      'Women living with HIV or other immune-suppressing conditions'
    ],
    howToReduceRisk: [
      'Get vaccinated against HPV (ideally given to adolescents aged 9 to 14, but recommended up to age 26 or older)',
      'Undergo regular cervical screening (Pap smear or HPV test) every 3 to 5 years starting at age 21 or 25 as advised by health guidelines',
      'Practice safe intimacy and avoid tobacco use'
    ],
    whenToSeeDoctor: [
      'Any unexpected vaginal bleeding after menopause or between periods',
      'Unusual persistent vaginal discharge or pelvic pain'
    ],
    howCommonIsIt: 'About 604,000 women are diagnosed worldwide each year, with global public health campaigns focused on full eradication through vaccination and screening.',
    reliableSources: [
      'World Health Organization (WHO) — Cervical Cancer Elimination Initiative',
      'Federation of Obstetric and Gynaecological Societies of India (FOGSI)',
      'CDC — Gynecologic Cancers'
    ],
    datasetKey: 'cervical-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-11-03'
  },
  {
    id: 'stomach-cancer',
    name: 'Stomach Cancer',
    medicalName: 'Gastric Adenocarcinoma',
    categoryGroup: 'Cancer Types',
    subCategory: 'Digestive Cancers',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'Cancer that starts in the mucus-producing cells on the inner lining of the stomach.',
    whatIsIt: 'Stomach cancer (gastric cancer) develops slowly over many years. Before cancer forms, pre-cancerous changes often take place in the stomach lining. Because early symptoms resemble everyday indigestion, awareness and timely testing are critical.',
    whyDoesItHappen: [
      'Long-term infection with Helicobacter pylori (H. pylori) bacteria in the stomach lining',
      'Diets heavy in salt-preserved, smoked, or pickled foods and low in fresh fruits and vegetables',
      'Smoking tobacco products',
      'Chronic stomach inflammation (atrophic gastritis) or family history'
    ],
    signsYouMayNotice: [
      'Persistent indigestion, heartburn, and stomach discomfort',
      'Feeling bloated or uncomfortably full after eating small amounts of food',
      'Mild nausea and loss of appetite',
      'Unexplained weight loss and ongoing tiredness',
      'Vomiting, with or without visible blood, or dark black stools'
    ],
    howDoesItSpread: 'Non-communicable. Can spread locally through the stomach wall and to nearby lymph nodes or liver over time.',
    whoIsAtRisk: [
      'People over age 60',
      'Men are more frequently affected than women',
      'People with untreated long-standing H. pylori stomach bacterial infections',
      'Regular consumers of heavily salted and smoked foods'
    ],
    howToReduceRisk: [
      'Treat H. pylori infections promptly with doctor-prescribed antibiotics and antacids',
      'Eat plenty of fresh colorful fruits, vegetables, and citrus fruits',
      'Limit salt-cured, smoked, and heavily processed meats',
      'Do not smoke, and maintain a healthy body weight'
    ],
    whenToSeeDoctor: [
      'Indigestion or upper stomach pain that persists for more than 2 weeks without relief',
      'Difficulty swallowing or food feeling stuck in your chest',
      'Black tarry stools or unexplained weight loss'
    ],
    howCommonIsIt: 'The fifth most common cancer worldwide, with over 1 million new cases diagnosed annually, especially common in East Asia and parts of Central America.',
    reliableSources: [
      'World Health Organization (WHO) — Stomach Cancer',
      'National Cancer Institute (NCI)',
      'American Cancer Society (ACS)'
    ],
    datasetKey: 'stomach-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-27'
  },
  {
    id: 'liver-cancer',
    name: 'Liver Cancer',
    medicalName: 'Hepatocellular Carcinoma (HCC)',
    categoryGroup: 'Cancer Types',
    subCategory: 'Digestive Cancers',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'Cancer that originates in liver tissues, often developing on top of pre-existing cirrhosis or viral hepatitis.',
    whatIsIt: 'Primary liver cancer starts in the hepatocytes (the main cells of the liver). It most commonly occurs in people whose livers have sustained long-term damage and scarring (cirrhosis) from chronic hepatitis or alcohol abuse.',
    whyDoesItHappen: [
      'Chronic long-term infection with Hepatitis B or Hepatitis C virus',
      'Cirrhosis (scarring) of the liver from any cause',
      'Heavy, prolonged consumption of alcohol',
      'Non-alcoholic fatty liver disease (NAFLD) associated with obesity and diabetes',
      'Eating grains or nuts contaminated with aflatoxin mold'
    ],
    signsYouMayNotice: [
      'Unintended, rapid weight loss and loss of appetite',
      'Pain or tenderness in the upper right side of your belly',
      'Yellowing of the whites of your eyes and skin (jaundice)',
      'Swelling or fluid buildup in the abdomen (ascites)',
      'Feeling full quickly after eating small amounts'
    ],
    howDoesItSpread: 'Non-communicable. Within the body, it can spread to nearby blood vessels and lungs.',
    whoIsAtRisk: [
      'People with chronic Hepatitis B or Hepatitis C',
      'Individuals with liver cirrhosis',
      'People with type 2 diabetes who also have fatty liver disease',
      'Heavy drinkers'
    ],
    howToReduceRisk: [
      'Get vaccinated against Hepatitis B (protects both against hepatitis and liver cancer)',
      'Get tested and treated for Hepatitis C with modern antiviral medications',
      'Limit or avoid alcohol intake completely',
      'Keep diabetes and body weight under good control',
      'People with cirrhosis should have routine ultrasound scans every 6 months for early detection'
    ],
    whenToSeeDoctor: [
      'Sudden worsening of symptoms in someone with known liver disease or cirrhosis',
      'Unexplained swelling in the belly or yellow eyes',
      'A hard lump felt under the right ribs'
    ],
    howCommonIsIt: 'The third leading cause of cancer death globally, with over 900,000 cases diagnosed each year.',
    reliableSources: [
      'American Association for the Study of Liver Diseases (AASLD)',
      'World Health Organization (WHO) — Liver Cancer',
      'European Society for Medical Oncology (ESMO)'
    ],
    datasetKey: 'liver-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-11-04'
  },
  {
    id: 'brain-cancer',
    name: 'Brain Cancer',
    medicalName: 'Primary Brain Tumors & Gliomas',
    categoryGroup: 'Cancer Types',
    subCategory: 'Other Cancers',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'Abnormal growth of cells in brain tissues that forms tumors, pressing on critical neural pathways.',
    whatIsIt: 'Brain tumors can be non-cancerous (benign) or cancerous (malignant). Primary brain cancer starts directly within brain tissue, most frequently in the glial cells that support neurons (gliomas). Because the skull is a rigid container, any growing tumor increases pressure on the brain.',
    whyDoesItHappen: [
      'DNA changes in brain cells leading to uncontrolled growth',
      'Exposure to high doses of ionizing radiation (like previous radiation therapy to the head)',
      'Rare inherited genetic syndromes (such as Neurofibromatosis or Li-Fraumeni syndrome)'
    ],
    signsYouMayNotice: [
      'Headaches that gradually become more frequent, severe, and worse in the early morning',
      'Unexplained seizures (fits or convulsions) in someone with no prior history of seizures',
      'Difficulty with balance, coordination, or walking steadily',
      'Vision problems like blurred vision, double vision, or loss of side vision',
      'Changes in personality, mood, memory, or speech difficulty'
    ],
    howDoesItSpread: 'Brain tumors do not spread from person to person. Unlike other cancers, primary brain tumors rarely spread outside the central nervous system.',
    whoIsAtRisk: [
      'Risk increases with age, though certain brain tumors occur in children',
      'People with prior high-dose cranial radiation exposure',
      'Individuals with rare family genetic syndromes'
    ],
    howToReduceRisk: [
      'Avoid unnecessary exposure to high-level ionizing radiation',
      'Follow safety precautions in industrial workplaces dealing with heavy radiation',
      'Seek prompt medical evaluation for new, persistent neurological symptoms'
    ],
    whenToSeeDoctor: [
      'A first-time seizure or blackout',
      'New, persistent headaches accompanied by nausea, vomiting, or vision changes',
      'Sudden weakness or numbness on one side of your face or body'
    ],
    howCommonIsIt: 'Around 300,000 primary brain and central nervous system tumors are diagnosed worldwide each year.',
    reliableSources: [
      'American Brain Tumor Association (ABTA)',
      'World Health Organization (WHO) — Central Nervous System Tumors',
      'National Brain Tumor Society'
    ],
    datasetKey: 'brain-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-25'
  },
  {
    id: 'colon-cancer',
    name: 'Colon Cancer',
    medicalName: 'Colorectal Carcinoma',
    categoryGroup: 'Cancer Types',
    subCategory: 'Digestive Cancers',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'Cancer of the large intestine (colon or rectum), typically starting as small non-cancerous clumps of cells called polyps.',
    whatIsIt: 'Colon cancer affects the lower digestive tract. Most cases begin as small, harmless growths of cells called adenomatous polyps on the inner lining of the bowel. Over years, some of these polyps can turn into cancer. Routine screening finds and removes these polyps before they ever turn dangerous.',
    whyDoesItHappen: [
      'Gene mutations in the cells lining the large intestine',
      'Diets low in fiber and high in red meats and processed sausages',
      'Sedentary lifestyle and carrying extra abdominal weight',
      'Long-standing inflammatory bowel disease (ulcerative colitis or Crohn’s disease)',
      'Family history of colon polyps or colorectal cancer'
    ],
    signsYouMayNotice: [
      'A noticeable change in your bowel habits (persistent diarrhea or constipation) lasting over several weeks',
      'Blood in your stool or bleeding from your rectum (bright red or dark black stool)',
      'Persistent abdominal discomfort, such as cramps, gas, or pain',
      'A feeling that your bowel does not empty completely',
      'Unexplained weakness, fatigue, and low blood count (anaemia)'
    ],
    howDoesItSpread: 'Non-communicable. Within the body, it can grow deeper into bowel walls and travel to nearby lymph nodes or the liver.',
    whoIsAtRisk: [
      'Adults aged 45 and older',
      'People with a family history of colon cancer or inherited Lynch syndrome',
      'People with chronic inflammatory bowel diseases',
      'Smokers and regular heavy drinkers'
    ],
    howToReduceRisk: [
      'Get screened starting at age 45 using stool tests (FIT) or colonoscopy',
      'Eat plenty of whole grains, vegetables, legumes, and fruits rich in dietary fiber',
      'Limit red meats (beef, pork) and avoid processed meats (bacon, hot dogs)',
      'Be physically active for at least 30 minutes every day and avoid smoking'
    ],
    whenToSeeDoctor: [
      'Any visible blood in your stool or on toilet paper',
      'A persistent change in bowel frequency or shape lasting more than 2 to 3 weeks',
      'Unexplained drop in hemoglobin or unexplained weight loss'
    ],
    howCommonIsIt: 'The third most common cancer globally, with over 1.9 million new cases recorded annually.',
    reliableSources: [
      'World Health Organization (WHO) — Colorectal Cancer',
      'American Society of Colon and Rectal Surgeons (ASCRS)',
      'National Colorectal Cancer Roundtable'
    ],
    datasetKey: 'colon-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-11-04'
  },
  {
    id: 'pancreatic-cancer',
    name: 'Pancreatic Cancer',
    medicalName: 'Pancreatic Adenocarcinoma',
    categoryGroup: 'Cancer Types',
    subCategory: 'Digestive Cancers',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'Cancer that starts in the tissues of your pancreas, an organ deep in the abdomen that aids digestion and blood sugar control.',
    whatIsIt: 'The pancreas lies behind the stomach and produces digestive enzymes and hormones like insulin. Pancreatic cancer most commonly starts in the ducts that carry pancreatic juices. Because the organ is hidden deep inside the body, early tumors rarely cause symptoms until advanced.',
    whyDoesItHappen: [
      'DNA mutations in pancreatic ductal cells',
      'Tobacco smoking (doubles the risk compared to non-smokers)',
      'Chronic inflammation of the pancreas (chronic pancreatitis)',
      'Long-standing type 2 diabetes',
      'Family history and inherited genetic mutations like BRCA2'
    ],
    signsYouMayNotice: [
      'Yellowing of your skin and whites of your eyes (jaundice) without belly pain',
      'Dull pain in the upper belly that often radiates straight to the back',
      'Unintended weight loss and sudden loss of appetite',
      'Light-colored or greasy stools that float and dark-colored urine',
      'New-onset diabetes in an older adult who was previously healthy'
    ],
    howDoesItSpread: 'Non-communicable. Can spread locally to nearby blood vessels, stomach, and liver.',
    whoIsAtRisk: [
      'People over age 65',
      'Smokers',
      'Individuals with chronic pancreatitis',
      'People with a strong family history of pancreatic cancer'
    ],
    howToReduceRisk: [
      'Quit smoking — the single most preventable risk factor',
      'Maintain a healthy body weight with balanced daily nutrition',
      'Avoid heavy alcohol intake, which prevents chronic pancreatitis',
      'People with strong family history can discuss specialized genetic counseling and imaging checks'
    ],
    whenToSeeDoctor: [
      'Any sudden yellowing of the eyes or skin',
      'Persistent back or upper abdominal pain accompanied by unexplained weight loss',
      'Pale, floating stools with dark tea-colored urine'
    ],
    howCommonIsIt: 'About 495,000 cases diagnosed worldwide each year; early diagnosis research is a high global medical priority.',
    reliableSources: [
      'Pancreatic Cancer Action Network (PanCAN)',
      'World Health Organization (WHO) — Pancreatic Malignancies',
      'American College of Gastroenterology (ACG)'
    ],
    datasetKey: 'pancreatic-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-23'
  },
  {
    id: 'ovarian-cancer',
    name: 'Ovarian Cancer',
    medicalName: 'Ovarian Carcinoma',
    categoryGroup: 'Cancer Types',
    subCategory: 'Common Cancers',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'Abnormal cell growth that starts in the female ovaries, which produce eggs and reproductive hormones.',
    whatIsIt: 'Ovarian cancer can develop in the ovaries, fallopian tubes, or the peritoneum. It is often called a "whispering cancer" because its early symptoms — such as bloating or feeling full quickly — are subtle and easily mistaken for common digestive complaints.',
    whyDoesItHappen: [
      'Gene mutations in ovarian or fallopian tube cells',
      'Inherited genetic alterations (such as BRCA1 and BRCA2 genes, or Lynch syndrome)',
      'Never having given birth or having children later in life',
      'Hormone replacement therapy after menopause'
    ],
    signsYouMayNotice: [
      'Frequent abdominal bloating or feeling swollen in the belly that does not go away',
      'Feeling full very quickly when eating meals',
      'Pelvic discomfort or dull aching in the lower abdomen',
      'An urgent or more frequent need to urinate',
      'Unexplained fatigue or changes in bowel habits'
    ],
    howDoesItSpread: 'Non-communicable. Within the body, it can shed cells into the pelvic and abdominal cavity.',
    whoIsAtRisk: [
      'Women over age 50',
      'Women with family members who had ovarian, breast, or colorectal cancer',
      'Women who carry inherited BRCA gene mutations',
      'Women who used hormone replacement therapy for extended periods'
    ],
    howToReduceRisk: [
      'Use of oral contraceptive pills (birth control pills) for 5 or more years significantly lowers risk',
      'Having children and breastfeeding',
      'Women with known BRCA mutations can consider risk-reducing surgeries discussed with their specialist'
    ],
    whenToSeeDoctor: [
      'Bloating, pelvic pain, or trouble eating occurs almost daily for more than 2 to 3 weeks',
      'Any palpable lump or fullness felt in the lower pelvis'
    ],
    howCommonIsIt: 'Around 314,000 women are diagnosed with ovarian cancer each year worldwide.',
    reliableSources: [
      'Ovarian Cancer Research Alliance (OCRA)',
      'World Health Organization (WHO) — Gynecologic Oncology',
      'American College of Obstetricians and Gynecologists (ACOG)'
    ],
    datasetKey: 'ovarian-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-24'
  },
  {
    id: 'kidney-cancer',
    name: 'Kidney Cancer',
    medicalName: 'Renal Cell Carcinoma (RCC)',
    categoryGroup: 'Cancer Types',
    subCategory: 'Other Cancers',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'Cancer that starts in the lining of tiny filtration tubes inside your kidneys.',
    whatIsIt: 'Renal cell carcinoma is the most common type of kidney cancer in adults. It starts in the lining of tiny tubules in the kidney that clean blood and create urine. Many kidney tumors are found early on routine ultrasound or CT scans done for unrelated reasons.',
    whyDoesItHappen: [
      'Acquired DNA mutations in renal tubule cells',
      'Cigarette smoking (greatly increases risk)',
      'Chronic high blood pressure that is untreated',
      'Excess body weight, which alters cellular hormone balances',
      'Long-term dialysis treatment for chronic kidney failure'
    ],
    signsYouMayNotice: [
      'Blood in your urine, which may look pink, red, or cola-colored',
      'A persistent dull ache or pain in your side or lower back that does not go away',
      'A lump or mass you can feel on the side or lower back',
      'Unexplained weight loss, recurring low fevers, and constant fatigue'
    ],
    howDoesItSpread: 'Non-communicable. Can spread to surrounding kidney fat, adrenal glands, and through the renal vein.',
    whoIsAtRisk: [
      'Men are about twice as likely as women to develop kidney cancer',
      'Adults over age 50',
      'Smokers and people with uncontrolled high blood pressure',
      'People with advanced kidney disease on long-term dialysis'
    ],
    howToReduceRisk: [
      'Do not smoke; quitting lowers risk over time',
      'Keep your blood pressure within a healthy range through diet and exercise',
      'Maintain a healthy body weight',
      'Avoid prolonged occupational exposure to toxic chemicals like trichloroethylene'
    ],
    whenToSeeDoctor: [
      'Any visible blood in your urine, even if it happens only once',
      'A persistent pain or lump in your side or back'
    ],
    howCommonIsIt: 'Around 430,000 cases are diagnosed worldwide each year.',
    reliableSources: [
      'Kidney Cancer Association (KCA)',
      'World Health Organization (WHO) — Renal Oncology',
      'American Urological Association (AUA)'
    ],
    datasetKey: 'kidney-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-26'
  },
  {
    id: 'bone-cancer',
    name: 'Bone Cancer',
    medicalName: 'Osteosarcoma & Chondrosarcoma',
    categoryGroup: 'Cancer Types',
    subCategory: 'Other Cancers',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'A rare cancer that originates in bone tissue, most commonly in the long bones of the arms and legs.',
    whatIsIt: 'Primary bone cancer begins directly in bone cells. This is different from cancers that start elsewhere in the body and spread (metastasize) to bones. Common primary types include osteosarcoma (starting in bone-forming cells) and chondrosarcoma (starting in cartilage).',
    whyDoesItHappen: [
      'Genetic mutations occurring during rapid bone growth in adolescents and young adults',
      'Prior high-dose radiation therapy for another condition',
      'Inherited genetic conditions like hereditary retinoblastoma or Li-Fraumeni syndrome',
      'Pre-existing non-cancerous bone disorders like Paget’s disease in older adults'
    ],
    signsYouMayNotice: [
      'Persistent bone pain in an arm or leg that worsens at night or during activity',
      'Swelling or a firm, tender lump near a joint or along a bone',
      'A bone that breaks unexpectedly with minimal trauma or a routine bump (pathological fracture)',
      'Limping or difficulty moving a limb'
    ],
    howDoesItSpread: 'Non-communicable. Within the body, primary bone cancer cells can spread through the bloodstream, most often to the lungs.',
    whoIsAtRisk: [
      'Children, teens, and young adults aged 10 to 30 (for osteosarcoma)',
      'Older adults over 50 (for chondrosarcoma and Paget’s disease-related bone cancer)',
      'People who had previous high-dose radiation therapy'
    ],
    howToReduceRisk: [
      'Because most bone cancers are linked to genetic mutations during rapid growth, there are no proven lifestyle preventions',
      'Prompt medical evaluation of any persistent bone pain in young athletes or growing teens is essential'
    ],
    whenToSeeDoctor: [
      'Bone pain that does not improve after rest, wakes you up at night, or lasts more than a couple of weeks',
      'A noticeable swelling or lump on a bone that is tender to the touch'
    ],
    howCommonIsIt: 'Rare. Represents less than 1% of all diagnosed cancers worldwide.',
    reliableSources: [
      'Sarcoma Foundation of America',
      'World Health Organization (WHO) — Bone and Soft Tissue Tumors',
      'National Cancer Institute (NCI)'
    ],
    datasetKey: 'bone-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-20'
  },
  {
    id: 'thyroid-cancer',
    name: 'Thyroid Cancer',
    medicalName: 'Papillary & Follicular Thyroid Carcinoma',
    categoryGroup: 'Cancer Types',
    subCategory: 'Other Cancers',
    illustrationIcon: 'Activity',
    shortDescription: 'Cancer that starts in the thyroid gland at the front base of your neck, often detected as a painless nodule.',
    whatIsIt: 'Thyroid cancer occurs in the cells of the thyroid gland. The vast majority of cases (over 85%) are papillary thyroid carcinomas, which grow very slowly and respond exceptionally well to standard treatment, offering high cure and survival rates.',
    whyDoesItHappen: [
      'DNA mutations in thyroid follicular cells',
      'Exposure to high levels of radiation to the head and neck, especially in childhood',
      'Inherited genetic syndromes (such as Multiple Endocrine Neoplasia type 2 or familial medullary thyroid cancer)',
      'Diets deficient in iodine or pre-existing goiter'
    ],
    signsYouMayNotice: [
      'A lump or nodule in the front of the neck that can be felt through the skin',
      'A feeling that tight shirt collars are becoming uncomfortable',
      'Changes in your voice, including increasing hoarseness',
      'Difficulty swallowing or a sensation of food sticking in the throat',
      'Painless swelling of lymph nodes in the neck'
    ],
    howDoesItSpread: 'Non-communicable. It can spread to nearby neck lymph nodes, but distant spread is uncommon in papillary forms.',
    whoIsAtRisk: [
      'Women are 3 times more likely to develop thyroid cancer than men',
      'People aged 30 to 50',
      'Individuals with childhood exposure to medical or environmental radiation',
      'People with a family history of thyroid cancer'
    ],
    howToReduceRisk: [
      'Avoid unnecessary medical radiation exposure to the head and neck',
      'Use iodized salt to maintain healthy thyroid hormone metabolism',
      'People with known inherited gene syndromes can discuss preventive screening with an endocrinologist'
    ],
    whenToSeeDoctor: [
      'Any new lump, nodule, or swelling in the front of your neck',
      'Persistent voice hoarseness lasting more than 3 weeks without a cold'
    ],
    howCommonIsIt: 'About 586,000 cases are diagnosed worldwide each year; it has one of the highest 5-year survival rates of all cancers.',
    reliableSources: [
      'American Thyroid Association (ATA)',
      'World Health Organization (WHO) — Endocrine Tumors',
      'ThyCa: Thyroid Cancer Survivors’ Association'
    ],
    datasetKey: 'thyroid-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-10-22'
  },
  {
    id: 'oral-cancer',
    name: 'Oral Cancer',
    medicalName: 'Oral Cavity Squamous Cell Carcinoma',
    categoryGroup: 'Cancer Types',
    subCategory: 'Other Cancers',
    illustrationIcon: 'ShieldAlert',
    shortDescription: 'Cancer that develops in any part of the mouth, including the lips, tongue, gums, inner cheeks, and floor of the mouth.',
    whatIsIt: 'Oral cancer begins in the flat squamous cells lining the inside of your mouth and lips. It is closely linked to tobacco use and betel quid (paan) chewing. Because dentists and doctors can directly see into the mouth, regular oral checks can catch it at an early, highly curable stage.',
    whyDoesItHappen: [
      'Chewing tobacco, gutkha, paan, or khaini (major cause in South Asia)',
      'Smoking cigarettes, bidis, cigars, or pipes',
      'Heavy, regular alcohol consumption (especially combined with tobacco use)',
      'Human Papillomavirus (HPV) infection affecting the back of the mouth and throat',
      'Chronic irritation from sharp teeth or poorly fitting dental plates'
    ],
    signsYouMayNotice: [
      'A persistent sore, ulcer, or patch inside the mouth or on the lip that does not heal within 2 weeks',
      'A red patch (erythroplakia) or white patch (leukoplakia) on the gums, tongue, or inner cheek',
      'A lump, thickening, or rough spot anywhere in the mouth or throat',
      'Difficulty chewing, swallowing, or moving your tongue and jaw',
      'Numbness or pain in the tongue or other areas of the mouth'
    ],
    howDoesItSpread: 'Non-communicable. Within the body, it can spread to neck lymph nodes and surrounding facial tissues.',
    whoIsAtRisk: [
      'Users of smokeless or smoked tobacco products',
      'Betel quid and areca nut chewers',
      'Heavy consumers of alcohol',
      'Men are affected twice as often as women'
    ],
    howToReduceRisk: [
      'Avoid all forms of tobacco — both chewing and smoking',
      'Do not chew betel nut (supari), gutkha, or paan',
      'Limit or avoid alcohol consumption',
      'Have your dentist inspect your mouth, gums, and tongue during regular checkups',
      'Eat plenty of fresh fruits and vegetables to support oral tissue health'
    ],
    whenToSeeDoctor: [
      'Any mouth sore, ulcer, lump, or white/red patch that lasts longer than 2 weeks',
      'Difficulty swallowing, moving your tongue, or unexplained ear pain on one side'
    ],
    howCommonIsIt: 'Around 377,000 cases are diagnosed worldwide each year; it is one of the most common cancers in India and South Asia due to tobacco chewing.',
    reliableSources: [
      'World Health Organization (WHO) — Oral Health and Cancer',
      'Dental Council of India',
      'American Dental Association (ADA)'
    ],
    datasetKey: 'oral-cancer',
    isPublished: true,
    isVerified: true,
    lastReviewedDate: '2026-11-01'
  }
];
