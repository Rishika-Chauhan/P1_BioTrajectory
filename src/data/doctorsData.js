export const DOCTORS_SPECIALTIES = [
  'All Specialties',
  'Cardiology & Vascular',
  'Endocrinology & Metabolism',
  'Nephrology & Renal Health',
  'Internal & Preventive Medicine',
  'Pulmonology & Respiratory'
];

export const DOCTORS_DATABASE = [
  {
    id: 'doc_thorne',
    name: 'Dr. Aris Thorne, MD',
    specialty: 'Cardiology & Vascular',
    title: 'Senior Preventive Cardiologist & Vascular Specialist',
    clinic: 'Metropolitan Heart & Longevity Institute',
    rating: 4.95,
    reviewsCount: 142,
    fee: '$120 / session',
    experienceYears: 16,
    languages: ['English', 'German'],
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
    bio: 'Specializing in early arterial stiffening biomarkers, ambulatory blood pressure monitoring, and non-invasive cardiovascular risk mitigation.',
    availableDays: ['Mon', 'Wed', 'Thu', 'Sat'],
    slots: ['09:30 AM', '11:00 AM', '02:30 PM', '04:00 PM']
  },
  {
    id: 'doc_elena',
    name: 'Dr. Elena Rostova, MD, PhD',
    specialty: 'Endocrinology & Metabolism',
    title: 'Clinical Endocrinologist & Glycemic Specialist',
    clinic: 'Advanced Center for Metabolic Medicine',
    rating: 4.92,
    reviewsCount: 188,
    fee: '$135 / session',
    experienceYears: 14,
    languages: ['English', 'French'],
    avatar: 'https://images.unsplash.com/photo-1594824813583-125026937e28?auto=format&fit=crop&w=400&q=80',
    bio: 'Pioneering continuous glucose trend evaluation, insulin sensitivity restoration, and lifestyle-integrated metabolic coaching.',
    availableDays: ['Tue', 'Wed', 'Fri'],
    slots: ['10:00 AM', '01:00 PM', '03:30 PM', '05:00 PM']
  },
  {
    id: 'doc_marcus',
    name: 'Dr. Marcus Vance, MD',
    specialty: 'Nephrology & Renal Health',
    title: 'Renal Consultant & Glomerular Health Lead',
    clinic: 'St. Jude Nephrology & Kidney Research Hospital',
    rating: 4.89,
    reviewsCount: 96,
    fee: '$140 / session',
    experienceYears: 18,
    languages: ['English', 'Spanish'],
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80',
    bio: 'Dedicated to early microalbuminuria detection, renal tubule preservation, and clinical correlation of optical home strip tests.',
    availableDays: ['Mon', 'Tue', 'Thu'],
    slots: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM']
  },
  {
    id: 'doc_aisha',
    name: 'Dr. Aisha Patel, MD',
    specialty: 'Internal & Preventive Medicine',
    title: 'Consultant Physician & Longevity Strategist',
    clinic: 'BioTrajectory Clinical Advisory Network',
    rating: 4.98,
    reviewsCount: 220,
    fee: '$110 / session',
    experienceYears: 12,
    languages: ['English', 'Hindi'],
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80',
    bio: 'Focuses on holistic biological trajectory interpretation, preventative lifestyle interventions, and multi-marker health optimization.',
    availableDays: ['Mon', 'Wed', 'Fri', 'Sun'],
    slots: ['10:30 AM', '12:00 PM', '03:00 PM', '06:00 PM']
  }
];

export const SAMPLE_CONSULTATION_HISTORY = [
  {
    id: 'cons_991',
    doctor: 'Dr. Aris Thorne, MD',
    specialty: 'Cardiology & Vascular',
    date: '2026-10-15',
    time: '02:30 PM',
    status: 'Completed',
    duration: '28 mins',
    summaryNotes: 'Patient reviewed 30-day ambulatory BP trends. Evening elevations correlated with stressful project shifts. Advised magnesium supplementation and morning aerobic walks.',
    sharedReports: ['Ambulatory BP Telemetry 24h', 'Automated Urinalysis']
  },
  {
    id: 'cons_992',
    doctor: 'Dr. Aisha Patel, MD',
    specialty: 'Internal & Preventive Medicine',
    date: '2026-08-20',
    time: '11:00 AM',
    status: 'Completed',
    duration: '24 mins',
    summaryNotes: 'Baseline checkup. All biological signals stable. Recommended repeating optical home urine strip in 60 days.',
    sharedReports: ['Comprehensive Metabolic Panel']
  }
];
