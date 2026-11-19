/**
 * Doctor Service
 *
 * Provides clinical records management, patient rosters, consultation
 * reports, electronic prescriptions, and plain-language summaries.
 */

const STORAGE_KEYS = {
  PATIENTS: 'bt_doc_patients_store',
  APPOINTMENTS: 'bt_doc_appointments_store',
  REPORTS: 'bt_doc_reports_store',
  PRESCRIPTIONS: 'bt_doc_prescriptions_store'
};

const DEFAULT_DEMO_PATIENTS = [
  {
    id: 'pat-101',
    patientId: 'pat-101',
    name: 'Alex Johnson',
    patientName: 'Alex Johnson',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
    age: 34,
    gender: 'Male',
    phone: '+1 (555) 019-2834',
    condition: 'Ongoing Cancer (Colorectal Stage II — Active Oncology Care) & Hypertension',
    primaryCondition: 'Colorectal Carcinoma (Stage II)',
    status: 'Active Consultation',
    lastVisit: 'Today',
    nextFollowUp: 'Tomorrow (Priority Expedited)',
    bloodGroup: 'O+',
    isPriority: true,
    isDanger: true,
    dangerDisease: 'Ongoing Cancer (Colorectal Stage II — Active Oncology Care)',
    dangerLevel: 'critical',
    priorityBadge: '🚨 PRIORITY PERSON — HIGH RISK (ONGOING CANCER)',
    triageLevel: 'EXPEDITED_ONCOLOGY_TRIAGE'
  },
  {
    id: 'pat-102',
    patientId: 'pat-102',
    name: 'Marcus Vance',
    patientName: 'Marcus Vance',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    age: 48,
    gender: 'Male',
    phone: '+1 (555) 438-9210',
    condition: 'Type 2 Diabetes Screening',
    primaryCondition: 'Metabolic Health',
    status: 'Monitoring',
    lastVisit: 'Yesterday',
    nextFollowUp: 'In 1 week',
    bloodGroup: 'A+'
  },
  {
    id: 'pat-103',
    patientId: 'pat-103',
    name: 'Elena Rostova',
    patientName: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    age: 29,
    gender: 'Female',
    phone: '+1 (555) 773-1940',
    condition: 'Post-viral Fatigue & Iron Deficiency',
    primaryCondition: 'Dyslipidemia & Metabolic Recovery',
    status: 'Consultation Completed',
    lastVisit: 'Nov 17, 2026 (Completed Video Visit)',
    nextFollowUp: 'In 3 weeks',
    bloodGroup: 'B+',
    appointmentStatus: 'COMPLETED',
    completedAppointmentDate: '17 Nov 2026',
    completedAppointmentTime: '11:15',
    appointmentType: 'Video Consultation'
  },
  {
    id: 'pat-104',
    patientId: 'pat-104',
    name: 'Rahul Sharma',
    patientName: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    age: 45,
    gender: 'Male',
    phone: '+91 98765 43210',
    condition: 'Essential High Blood Pressure & Morning Headaches',
    primaryCondition: 'Stage 1 Essential Hypertension',
    status: 'Consultation Completed',
    lastVisit: 'Nov 02, 2026 (Completed In-Person Visit)',
    nextFollowUp: 'Nov 16, 2026',
    bloodGroup: 'B+',
    appointmentStatus: 'COMPLETED',
    completedAppointmentDate: '02 Nov 2026',
    completedAppointmentTime: '10:00',
    appointmentType: 'In-Person Consultation'
  }
];

const DEFAULT_DEMO_REPORTS = [
  {
    id: 'rep_01',
    patientId: 'pat-101',
    patientName: 'Alex Johnson',
    doctorUid: 'demo-doctor-uid-002',
    doctorName: 'Dr. Sarah Mitchell, MD',
    doctorRegNumber: 'MD-89241-US',
    clinicName: 'BioTrajectory Specialty Health Center',
    createdAt: new Date().toISOString().split('T')[0],
    type: 'Video Consultation',
    diagnosis: 'Colorectal Carcinoma (Stage II) with Secondary Hypertension',
    complaints: 'Managing post-chemo fatigue, mild morning occipital tension, borderline systolic readings.',
    hpi: '34-year-old patient undergoing active oncology surveillance. CEA biomarker trajectory stable. Monitored daily via home BP cuff and urine strip analytics.',
    vitals: { bp: '138/88', heartRate: '74', spo2: '98', temp: '98.6', weight: '72' },
    examination: 'Patient is conscious, alert, oriented. Regular cardiac rhythm without murmurs. Abdomen soft with no organomegaly.',
    tests: 'CEA tumor marker panel, complete blood count (CBC), comprehensive metabolic panel (CMP), 10SG urinalysis.',
    advice: 'Follow low-sodium DASH oncology nutritional guidelines, maintain hydration, and take Telmisartan 40mg daily.',
    followUp: '2 weeks (Priority Surveillance)',
    warningSigns: 'Immediate emergency evaluation for severe chest tightness, sudden dizziness, hematochezia, or high fever.',
    status: 'signed',
    signedAt: new Date().toISOString()
  },
  {
    id: 'rep_02',
    patientId: 'pat-103',
    patientName: 'Elena Rostova',
    doctorUid: 'demo-doctor-uid-002',
    doctorName: 'Dr. Sarah Mitchell, MD',
    doctorRegNumber: 'MD-89241-US',
    clinicName: 'BioTrajectory Specialty Health Center',
    createdAt: '2026-11-17',
    type: 'Video Consultation',
    diagnosis: 'Post-Viral Fatigue & Mild Iron Deficiency',
    complaints: 'Persistent lethargy after viral illness, mild afternoon brain fog, normal sleep schedule.',
    hpi: '29-year-old female recovering from seasonal viral infection. Follow-up lab panel shows mild microcytic hypochromic indices.',
    vitals: { bp: '118/76', heartRate: '68', spo2: '99', temp: '98.4', weight: '58' },
    examination: 'Chest clear, normal vesicular breath sounds. Conjunctival pallor mild. Neurological exam intact.',
    tests: 'Serum Ferritin, Total Iron Binding Capacity (TIBC), Complete Hemogram.',
    advice: 'Oral iron supplementation (Ferrous ascorbate 100mg) with Vitamin C after meals. Adequate protein intake and gentle daily walking.',
    followUp: '3 weeks',
    warningSigns: 'Contact clinic if experiencing sudden shortness of breath, palpitations, or fainting episodes.',
    status: 'signed',
    signedAt: '2026-11-17T11:45:00Z'
  },
  {
    id: 'rep_03',
    patientId: 'pat-104',
    patientName: 'Rahul Sharma',
    doctorUid: 'demo-doctor-uid-002',
    doctorName: 'Dr. Sarah Mitchell, MD',
    doctorRegNumber: 'MD-89241-US',
    clinicName: 'BioTrajectory Specialty Health Center',
    createdAt: '2026-11-02',
    type: 'In-Person Consultation',
    diagnosis: 'Stage 1 Essential Hypertension',
    complaints: 'Occasional morning occipital headache, mild stress from work, home BP readings averaging 136/86.',
    hpi: '45-year-old male with gradual onset of mild morning headaches for 3 weeks. No chest pain or dyspnea on exertion.',
    vitals: { bp: '136/86', heartRate: '76', spo2: '98', temp: '98.4', weight: '74' },
    examination: 'Conscious, oriented, ambulatory. Cardiac auscultation normal S1/S2. Peripheral pulses palpable and symmetric.',
    tests: 'Fasting lipid panel, renal function test (serum creatinine & BUN), urine protein dipstick.',
    advice: 'Begin Telmisartan 40mg once daily in morning. Restrict dietary sodium to under 2 grams daily. Regular 30 min daily brisk walking.',
    followUp: '2 weeks (Nov 16, 2026)',
    warningSigns: 'Seek immediate evaluation for severe sudden headache, chest distress, or vision blurring.',
    status: 'signed',
    signedAt: '2026-11-02T10:35:00Z'
  }
];

const DEFAULT_DEMO_PRESCRIPTIONS = [
  {
    id: 'rx_01',
    patientId: 'pat-101',
    patientName: 'Alex Johnson',
    age: 34,
    gender: 'Male',
    date: new Date().toISOString().split('T')[0],
    doctorName: 'Dr. Sarah Mitchell, MD',
    diagnosis: 'Colorectal Carcinoma (Stage II) with Secondary Hypertension',
    medicines: [
      {
        name: 'Telmisartan 40mg',
        dosage: '1 tablet once daily in the morning',
        timing: 'After breakfast',
        duration: '30 days',
        notes: 'Monitors systolic blood pressure; avoid sudden cessation.'
      },
      {
        name: 'Omega-3 Fatty Acids 1000mg',
        dosage: '1 capsule daily',
        timing: 'With dinner',
        duration: '60 days',
        notes: 'Supports healthy lipid levels.'
      }
    ],
    generalAdvice: 'Reduce processed sodium consumption; engage in 30 minutes of moderate aerobic exercise daily.',
    followUpDate: 'In 2 weeks'
  },
  {
    id: 'rx_02',
    patientId: 'pat-103',
    patientName: 'Elena Rostova',
    age: 29,
    gender: 'Female',
    date: '2026-11-17',
    doctorName: 'Dr. Sarah Mitchell, MD',
    diagnosis: 'Post-Viral Fatigue & Mild Iron Deficiency',
    medicines: [
      {
        name: 'Ferrous Ascorbate 100mg + Folic Acid',
        dosage: '1 tablet once daily',
        timing: 'After lunch with citrus juice (Vitamin C)',
        duration: '30 days',
        notes: 'Do not take with tea, coffee, or antacids within 2 hours.'
      },
      {
        name: 'Coenzyme Q10 100mg',
        dosage: '1 capsule once daily',
        timing: 'Morning with breakfast',
        duration: '30 days',
        notes: 'Mitochondrial and cellular energy support.'
      }
    ],
    generalAdvice: 'Ensure 8 hours of restorative sleep, drink 2.5L water daily, and retest ferritin in 4 weeks.',
    followUpDate: 'In 3 weeks'
  },
  {
    id: 'rx_03',
    patientId: 'pat-104',
    patientName: 'Rahul Sharma',
    age: 45,
    gender: 'Male',
    date: '2026-11-02',
    doctorName: 'Dr. Sarah Mitchell, MD',
    diagnosis: 'Stage 1 Essential Hypertension',
    medicines: [
      {
        name: 'Telmisartan 40mg',
        dosage: '1 tablet once daily in the morning',
        timing: 'After breakfast with water',
        duration: '30 days',
        notes: 'Take at the same time each morning; maintain BP log.'
      }
    ],
    generalAdvice: 'Low-sodium DASH diet (<2g sodium/day), stress moderation, and 30-min daily aerobic exercise.',
    followUpDate: 'Nov 16, 2026'
  }
];

function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export class DoctorService {
  static getDoctorPatients(doctorUid) {
    const custom = loadLocal(STORAGE_KEYS.PATIENTS, []);
    const baseList = custom.length > 0 ? custom : DEFAULT_DEMO_PATIENTS;

    // Check dynamic disease history and uploaded patient avatar for Alex Johnson
    try {
      const storedAvatar = localStorage.getItem('bt_patient_avatar');
      const storedHistory = localStorage.getItem('bt_user_disease_history');
      let dangerItem = null;

      if (storedHistory) {
        const parsed = JSON.parse(storedHistory);
        dangerItem = parsed.find(
          (d) =>
            (d.status === 'ongoing' || d.status === 'facing') &&
            (d.isDanger === true ||
              d.dangerLevel === 'critical' ||
              (d.name && d.name.toLowerCase().includes('cancer')))
        );
      } else {
        dangerItem = { name: 'Ongoing Cancer (Colorectal Stage II — Active Oncology Care)' };
      }

      return baseList.map((p) => {
        if (p.id === 'pat-101' || p.patientId === 'pat-101') {
          const patientPhoto =
            storedAvatar ||
            p.avatar ||
            'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80';

          if (dangerItem) {
            return {
              ...p,
              avatar: patientPhoto,
              isPriority: true,
              isDanger: true,
              dangerDisease: dangerItem.name,
              condition: `${dangerItem.name} & Hypertension`,
              priorityBadge: `🚨 PRIORITY PERSON — HIGH RISK (ONGOING CANCER)`
            };
          } else {
            return {
              ...p,
              avatar: patientPhoto,
              isPriority: false,
              isDanger: false,
              dangerDisease: null,
              priorityBadge: null
            };
          }
        }
        return p;
      });
    } catch {}

    return baseList;
  }

  static getDoctorAppointments() {
    return [];
  }

  static getDoctorReports(doctorUid) {
    const list = loadLocal(STORAGE_KEYS.REPORTS, []);
    return list.length > 0 ? list : DEFAULT_DEMO_REPORTS;
  }

  static getDoctorPrescriptions(doctorUid) {
    const list = loadLocal(STORAGE_KEYS.PRESCRIPTIONS, []);
    return list.length > 0 ? list : DEFAULT_DEMO_PRESCRIPTIONS;
  }

  static saveDoctorReport(doctorUid, report) {
    const current = loadLocal(STORAGE_KEYS.REPORTS, DEFAULT_DEMO_REPORTS);
    const updated = [report, ...current.filter((r) => r.id !== report.id)];
    saveLocal(STORAGE_KEYS.REPORTS, updated);
    return report;
  }

  static saveDoctorPrescription(doctorUid, rx) {
    const current = loadLocal(STORAGE_KEYS.PRESCRIPTIONS, DEFAULT_DEMO_PRESCRIPTIONS);
    const updated = [rx, ...current.filter((r) => r.id !== rx.id)];
    saveLocal(STORAGE_KEYS.PRESCRIPTIONS, updated);
    return rx;
  }

  static async getPatients() {
    return this.getDoctorPatients();
  }

  static async getPatientById(id) {
    const list = this.getDoctorPatients();
    return list.find((p) => p.id === id || p.patientId === id) || null;
  }

  static async savePatient(patient) {
    const current = loadLocal(STORAGE_KEYS.PATIENTS, DEFAULT_DEMO_PATIENTS);
    const updated = [patient, ...current.filter((p) => p.id !== patient.id)];
    saveLocal(STORAGE_KEYS.PATIENTS, updated);
    return patient;
  }

  static async getReports() {
    return this.getDoctorReports();
  }

  static async getReportById(id) {
    const list = this.getDoctorReports();
    return list.find((r) => r.id === id) || null;
  }

  static async saveReport(report) {
    return this.saveDoctorReport('demo', report);
  }

  static async getPrescriptions() {
    return this.getDoctorPrescriptions();
  }

  static async savePrescription(rx) {
    return this.saveDoctorPrescription('demo', rx);
  }

  static generatePatientFriendlySummary(report) {
    if (!report) return null;

    return {
      title: 'Consultation Summary',
      date: report.date || report.createdAt || new Date().toLocaleDateString(),
      diagnosis: report.diagnosis || 'Clinical evaluation completed.',
      carePlan: report.advice || report.treatmentPlan || 'Follow prescribed health regimen and monitor vitals.',
      warningSigns: report.warningSigns || 'Seek emergency care for chest distress, sudden breathlessness, or severe headache.',
      whatYouReported: report.complaints || report.symptoms || 'Regular health monitoring review.',
      whatTheDoctorFound: report.examination || report.findings || 'Vitals stable; physical evaluation normal.',
      doctorAssessment: report.diagnosis || 'Clinical evaluation completed.',
      testsRecommended: report.tests || 'Follow-up tests as indicated in full report.',
      treatmentInstructions: report.advice || report.treatmentPlan || 'Take medications as directed.',
      followUpDate: report.followUp || 'As scheduled with doctor.',
      warningSignsNotice: report.warningSigns || 'Contact clinic if symptoms escalate.'
    };
  }
}

export function formatDoctorTitle(rawName) {
  if (!rawName) return 'Dr. Practitioner';
  const clean = String(rawName).replace(/^(?:(Dr\.?|Doctor)\s*)+/gi, '').trim();
  return `Dr. ${clean || 'Practitioner'}`;
}

export function stripDoctorTitle(rawName) {
  if (!rawName) return 'Practitioner';
  return String(rawName).replace(/^(?:(Dr\.?|Doctor)\s*)+/gi, '').trim() || 'Practitioner';
}

export default DoctorService;