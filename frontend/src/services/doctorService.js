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
    age: 34,
    gender: 'Male',
    phone: '+1 (555) 019-2834',
    condition: 'Hypertension (Mild) & Vitals Tracking',
    primaryCondition: 'Hypertension (Mild)',
    status: 'Active Consultation',
    lastVisit: 'Today',
    nextFollowUp: 'In 3 days',
    bloodGroup: 'O+'
  },
  {
    id: 'pat-102',
    patientId: 'pat-102',
    name: 'Marcus Vance',
    patientName: 'Marcus Vance',
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
    age: 29,
    gender: 'Female',
    phone: '+1 (555) 773-1940',
    condition: 'Post-viral Fatigue & Iron Levels',
    primaryCondition: 'Cardiorespiratory Recovery',
    status: 'Under Care',
    lastVisit: '3 days ago',
    nextFollowUp: 'In 2 weeks',
    bloodGroup: 'B+'
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
    diagnosis: 'Mild Essential Hypertension',
    complaints: 'Occasional morning occipital tension, borderline systolic readings.',
    hpi: 'Patient reports recent elevated blood pressure values upon waking.',
    vitals: { bp: '138/88', heartRate: '74', spo2: '98', temp: '98.6', weight: '72' },
    examination: 'Patient is conscious, alert, oriented. Regular cardiac rhythm without murmurs.',
    tests: 'Lipid panel, fasting blood sugar, 12-lead baseline ECG.',
    advice: 'Follow low-sodium DASH nutritional guidelines, maintain hydration, and take Telmisartan 40mg daily.',
    followUp: '2 weeks',
    warningSigns: 'Immediate emergency evaluation for severe chest tightness, sudden dizziness, or vision disturbance.',
    status: 'signed',
    signedAt: new Date().toISOString()
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
    diagnosis: 'Mild Essential Hypertension',
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
    return custom.length > 0 ? custom : DEFAULT_DEMO_PATIENTS;
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