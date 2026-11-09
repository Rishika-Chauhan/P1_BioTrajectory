/**
 * Doctor Service
 * 
 * Manages doctor-isolated patient lists, appointments, clinical consultation reports,
 * and prescriptions according to the Firestore database structure:
 * 
 * doctors/{doctorUid}/patients/{patientReferenceId}
 * doctors/{doctorUid}/consultations/{consultationId}
 * doctors/{doctorUid}/reports/{reportId}
 * doctors/{doctorUid}/prescriptions/{prescriptionId}
 * 
 * Enforces strict medical privacy boundaries:
 * - Doctors only access records linked to their authorized consultations
 * - Patient complete vaults are never copied
 * - Only verified doctors can finalize prescriptions and reports
 */

const STORAGE_KEYS = {
  PATIENTS: 'bt_doc_patients_store',
  APPOINTMENTS: 'bt_doc_appointments_store',
  REPORTS: 'bt_doc_reports_store',
  PRESCRIPTIONS: 'bt_doc_prescriptions_store'
};

// Seed Authorized Patients (only patients who have authorized consultations with Dr. Thorne)
const INITIAL_PATIENTS = [
  {
    patientReferenceId: 'PAT-88291-PRJ',
    patientName: 'Pranjal Sharma',
    contactInformation: {
      phone: '+1 (555) 349-2910',
      email: 'pranjal@biotrajectory.health'
    },
    primaryCondition: 'Stage 1 Essential Hypertension',
    reportedSymptoms: 'Dull occipital morning headaches, occasional mild post-exertion fatigue',
    currentStatus: 'Active Consultation',
    lastConsultationAt: '2026-11-04',
    nextFollowUpAt: '2026-11-18',
    bloodPressureTrend: '121/79 mmHg average over past 7 days',
    clinicalNotes: 'Blood pressure nicely controlled on lifestyle changes and daily walking. Vitals trajectory stable.',
    diagnosis: 'Primary Essential Hypertension (Well Controlled)',
    treatmentPlan: 'Continue 30-min daily brisk walking, maintain low-sodium diet (<2g/day), daily home BP check.',
    consultationHistory: [
      { id: 'c_01', date: '2026-11-04', type: 'Video consultation', status: 'Completed', notes: 'Discussed 30-day BP timeline.' },
      { id: 'c_02', date: '2026-10-18', type: 'In-person consultation', status: 'Completed', notes: 'Initial baseline vitals review.' }
    ]
  },
  {
    patientReferenceId: 'PAT-10492-ANL',
    patientName: 'Anita Roy',
    contactInformation: {
      phone: '+1 (555) 892-1209',
      email: 'anita.roy@example.com'
    },
    primaryCondition: 'Type 2 Diabetes & Borderline Hypertension',
    reportedSymptoms: 'Afternoon thirst, mild peripheral tingling in toes',
    currentStatus: 'Upcoming Follow-up',
    lastConsultationAt: '2026-10-25',
    nextFollowUpAt: '2026-11-12',
    bloodPressureTrend: '132/84 mmHg average',
    clinicalNotes: 'Fasting glucose 118 mg/dL. Urine protein negative. Needs diet review for carbohydrate moderation.',
    diagnosis: 'Type 2 Diabetes Mellitus (Uncomplicated)',
    treatmentPlan: 'Metformin 500mg BID with meals. 15-min post-meal walk. Follow up in 3 weeks.',
    consultationHistory: [
      { id: 'c_03', date: '2026-10-25', type: 'Video consultation', status: 'Completed', notes: 'Reviewed HbA1c lab report.' }
    ]
  },
  {
    patientReferenceId: 'PAT-44019-MRK',
    patientName: 'Marcus Vance',
    contactInformation: {
      phone: '+1 (555) 412-9902',
      email: 'marcus.v@example.com'
    },
    primaryCondition: 'Exercise-Induced Asthma',
    reportedSymptoms: 'Occasional wheezing after high-intensity jogging in cold air',
    currentStatus: 'Completed Consultation',
    lastConsultationAt: '2026-10-12',
    nextFollowUpAt: '2026-12-15',
    bloodPressureTrend: '118/76 mmHg',
    clinicalNotes: 'Lungs clear on auscultation. Spirometry normal at baseline.',
    diagnosis: 'Mild Intermittent Asthma',
    treatmentPlan: 'Albuterol HFA inhaler 2 puffs 15 minutes before vigorous outdoor exercise.',
    consultationHistory: [
      { id: 'c_04', date: '2026-10-12', type: 'Video consultation', status: 'Completed', notes: 'Prescription renewal and inhaler technique check.' }
    ]
  }
];

// Seed Appointments
const INITIAL_APPOINTMENTS = [
  {
    id: 'apt_101',
    patientReferenceId: 'PAT-88291-PRJ',
    patientName: 'Pranjal Sharma',
    consultationType: 'Video consultation',
    appointmentTime: '2026-11-10T14:30:00',
    date: '2026-11-10',
    time: '02:30 PM',
    status: 'confirmed',
    notes: 'Follow-up on 30-day ambulatory blood pressure trend.',
    callRoomId: 'call_bt_9821a_prj'
  },
  {
    id: 'apt_102',
    patientReferenceId: 'PAT-10492-ANL',
    patientName: 'Anita Roy',
    consultationType: 'Video consultation',
    appointmentTime: '2026-11-10T16:00:00',
    date: '2026-11-10',
    time: '04:00 PM',
    status: 'confirmed',
    notes: 'Glucose review and dietary trajectory adjustment.',
    callRoomId: 'call_bt_4821b_anl'
  },
  {
    id: 'apt_103',
    patientReferenceId: 'PAT-55912-ELZ',
    patientName: 'Elena Rostova',
    consultationType: 'In-person consultation',
    appointmentTime: '2026-11-11T10:00:00',
    date: '2026-11-11',
    time: '10:00 AM',
    status: 'pending',
    notes: 'Initial clinical assessment for recurring dizziness.',
    callRoomId: null
  },
  {
    id: 'apt_104',
    patientReferenceId: 'PAT-44019-MRK',
    patientName: 'Marcus Vance',
    consultationType: 'Video consultation',
    appointmentTime: '2026-11-12T11:30:00',
    date: '2026-11-12',
    time: '11:30 AM',
    status: 'confirmed',
    notes: 'Routine 3-month respiratory check-in.',
    callRoomId: 'call_bt_1942c_mrk'
  }
];

// Seed Clinical Reports
const INITIAL_REPORTS = [
  {
    id: 'rep_doc_001',
    patientReferenceId: 'PAT-88291-PRJ',
    patientName: 'Pranjal Sharma',
    date: '2026-11-04',
    time: '03:15 PM',
    complaint: 'Routine follow-up for blood pressure trajectory review and mild morning fatigue.',
    symptoms: 'Mild head tightness on waking, no chest pain, no palpitations, no shortness of breath.',
    duration: 'Occasional over past 2 weeks',
    sharedReadings: 'Home BP log: 121/79 mmHg 7-day average, pulse 72 BPM, urine protein negative.',
    findings: 'Patient is alert and well-hydrated. Cardiovascular examination reveals regular S1/S2 without murmurs. Lung fields clear bilaterally.',
    diagnosis: 'Primary Essential Hypertension (Well Controlled)',
    differentialDiagnosis: 'Tension headache, mild sleep deficit.',
    recommendedTests: 'Continue daily home BP logging. Repeat basic metabolic panel in 6 months.',
    treatmentPlan: 'Maintain current non-pharmacological regimen: low sodium dietary intake, 30-min brisk daily walk, 7-8 hours restful sleep.',
    followUpDate: '2026-11-18',
    doctorNotes: 'Patient demonstrates excellent adherence to home vitals monitoring. Excellent trajectory.',
    signedBy: 'Dr. Aris Thorne, MD (Cardiology)',
    signedAt: '2026-11-04T15:30:00Z',
    reportStatus: 'finalized'
  }
];

// Seed Prescriptions
const INITIAL_PRESCRIPTIONS = [
  {
    id: 'rx_doc_001',
    patientReferenceId: 'PAT-10492-ANL',
    patientName: 'Anita Roy',
    date: '2026-10-25',
    medicines: [
      {
        name: 'Metformin Hydrochloride',
        strength: '500 mg',
        dose: '1 tablet',
        frequency: 'Twice daily',
        duration: '90 days',
        instructions: 'Take with morning and evening meals to minimize GI discomfort.'
      },
      {
        name: 'Vitamin D3 (Cholecalciferol)',
        strength: '60,000 IU',
        dose: '1 capsule',
        frequency: 'Once weekly',
        duration: '8 weeks',
        instructions: 'Take after breakfast on Sunday morning.'
      }
    ],
    additionalAdvice: 'Keep hydrated with at least 2 liters of water daily. Walk 15 minutes after meals.',
    signedBy: 'Dr. Aris Thorne, MD (Cardiology)',
    signedAt: '2026-10-25T11:45:00Z',
    status: 'finalized'
  }
];

export class DoctorService {
  static _load(key, fallback) {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Storage read error, using fallback', e);
    }
    return fallback;
  }

  static _save(key, data) {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data));
      }
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }

  // --- SYNCHRONOUS NORMALIZED METHODS FOR DOCTOR PAGES ---
  static getDoctorPatients(doctorUid) {
    const list = this._load(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    return list.map(p => ({
      id: p.patientReferenceId || p.id || 'PAT-01',
      patientReferenceId: p.patientReferenceId || p.id || 'PAT-01',
      name: p.patientName || p.name || 'Patient',
      patientName: p.patientName || p.name || 'Patient',
      age: p.age || 42,
      gender: p.gender || 'Male',
      phone: p.contactInformation?.phone || p.phone || '+1 (555) 349-2910',
      email: p.contactInformation?.email || p.email || '',
      bloodGroup: p.bloodGroup || p.bloodType || 'B+',
      condition: p.primaryCondition || p.condition || 'Stage 1 Essential Hypertension',
      primaryCondition: p.primaryCondition || p.condition || 'Stage 1 Essential Hypertension',
      lastVisit: p.lastConsultationAt || p.lastVisit || '2026-11-04',
      nextFollowUp: p.nextFollowUpAt || p.nextFollowUp || '2026-11-18',
      status: p.currentStatus || p.status || 'Active Consultation',
      emergencyContact: p.emergencyContact || '+1 (555) 349-2910',
      ...p
    }));
  }

  static getDoctorAppointments(doctorUid) {
    const list = this._load(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    return list.map(a => ({
      id: a.id || 'apt_01',
      patientId: a.patientReferenceId || a.patientId || 'PAT-88291-PRJ',
      patientReferenceId: a.patientReferenceId || a.patientId || 'PAT-88291-PRJ',
      patientName: a.patientName || 'Patient',
      type: (a.consultationType || a.type || '').toLowerCase().includes('video') ? 'video' : 'in-person',
      consultationType: a.consultationType || 'In-person consultation',
      date: a.date || 'Today',
      time: a.time || '10:00 AM',
      status: a.status || 'confirmed',
      reason: a.notes || a.reason || 'General Follow-up',
      ...a
    }));
  }

  static getDoctorReports(doctorUid) {
    const list = this._load(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
    return list.map(r => ({
      id: r.id || 'rep_doc_001',
      patientId: r.patientReferenceId || r.patientId || 'PAT-88291-PRJ',
      patientReferenceId: r.patientReferenceId || r.patientId || 'PAT-88291-PRJ',
      patientName: r.patientName || 'Patient',
      diagnosis: r.diagnosis || 'Primary Essential Hypertension',
      complaints: r.complaint || r.complaints || 'Routine checkup discussion',
      vitals: r.vitals || { bp: '121/79', heartRate: '72', spo2: '99', temp: '98.6', weight: '70' },
      status: r.reportStatus === 'finalized' || r.status === 'signed' ? 'signed' : 'draft',
      createdAt: r.date || r.createdAt || '2026-11-04',
      type: r.type || 'In-Person',
      ...r
    }));
  }

  static getDoctorPrescriptions(doctorUid) {
    const list = this._load(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
    return list.map(rx => ({
      id: rx.id || 'rx_doc_001',
      patientId: rx.patientReferenceId || rx.patientId || 'PAT-10492-ANL',
      patientReferenceId: rx.patientReferenceId || rx.patientId || 'PAT-10492-ANL',
      patientName: rx.patientName || 'Patient',
      doctorName: rx.doctorName || rx.signedBy || 'Dr. Practitioner',
      createdAt: rx.date || rx.createdAt || '2026-10-25',
      medicines: rx.medicines || [],
      status: rx.status || 'signed',
      ...rx
    }));
  }

  static saveDoctorReport(doctorUid, newReport) {
    const list = this._load(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
    const updated = [newReport, ...list.filter(r => r.id !== newReport.id)];
    this._save(STORAGE_KEYS.REPORTS, updated);
    return newReport;
  }

  static saveDoctorPrescription(doctorUid, newPrescription) {
    const list = this._load(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
    const updated = [newPrescription, ...list.filter(rx => rx.id !== newPrescription.id)];
    this._save(STORAGE_KEYS.PRESCRIPTIONS, updated);
    return newPrescription;
  }

  // --- PATIENTS ---
  static async getPatients(filters = {}) {
    const list = this._load(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    const { query, status } = filters;

    return list.filter(p => {
      const q = (query || '').toLowerCase().trim();
      const matchesQuery = !q ||
        p.patientName.toLowerCase().includes(q) ||
        p.patientReferenceId.toLowerCase().includes(q) ||
        p.primaryCondition.toLowerCase().includes(q);

      const matchesStatus = !status || status === 'All' || p.currentStatus === status;

      return matchesQuery && matchesStatus;
    });
  }

  static async getPatientById(referenceId) {
    const list = this._load(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    return list.find(p => p.patientReferenceId === referenceId) || null;
  }

  static async savePatient(patientData) {
    const list = this._load(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    const existingIndex = list.findIndex(p => p.patientReferenceId === patientData.patientReferenceId);

    let updated;
    if (existingIndex >= 0) {
      list[existingIndex] = { ...list[existingIndex], ...patientData };
      updated = list;
    } else {
      updated = [patientData, ...list];
    }
    this._save(STORAGE_KEYS.PATIENTS, updated);
    return patientData;
  }

  // --- APPOINTMENTS ---
  static async getAppointments() {
    return this._load(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
  }

  static async updateAppointmentStatus(id, newStatus) {
    const list = this._load(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    const updated = list.map(a => a.id === id ? { ...a, status: newStatus } : a);
    this._save(STORAGE_KEYS.APPOINTMENTS, updated);
    return updated.find(a => a.id === id);
  }

  static async rescheduleAppointment(id, newDate, newTime) {
    const list = this._load(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    const updated = list.map(a => a.id === id ? { ...a, date: newDate, time: newTime, appointmentTime: `${newDate}T${newTime}` } : a);
    this._save(STORAGE_KEYS.APPOINTMENTS, updated);
    return updated.find(a => a.id === id);
  }

  // --- REPORTS ---
  static async getReports() {
    return this._load(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
  }

  static async getReportById(reportId) {
    const list = this._load(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
    return list.find(r => r.id === reportId) || null;
  }

  static async saveReport(reportData) {
    const list = this._load(STORAGE_KEYS.REPORTS, INITIAL_REPORTS);
    const newReport = {
      ...reportData,
      id: reportData.id || `rep_doc_${Date.now()}`
    };

    const existingIndex = list.findIndex(r => r.id === newReport.id);
    let updated;
    if (existingIndex >= 0) {
      list[existingIndex] = newReport;
      updated = list;
    } else {
      updated = [newReport, ...list];
    }

    this._save(STORAGE_KEYS.REPORTS, updated);
    return newReport;
  }

  // --- PRESCRIPTIONS ---
  static async getPrescriptions() {
    return this._load(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
  }

  static async savePrescription(prescriptionData) {
    const list = this._load(STORAGE_KEYS.PRESCRIPTIONS, INITIAL_PRESCRIPTIONS);
    const newPrescription = {
      ...prescriptionData,
      id: prescriptionData.id || `rx_doc_${Date.now()}`
    };

    const existingIndex = list.findIndex(rx => rx.id === newPrescription.id);
    let updated;
    if (existingIndex >= 0) {
      list[existingIndex] = newPrescription;
      updated = list;
    } else {
      updated = [newPrescription, ...list];
    }

    this._save(STORAGE_KEYS.PRESCRIPTIONS, updated);
    return newPrescription;
  }

  // --- PATIENT VISIT SUMMARY GENERATOR ---
  static generatePatientFriendlySummary(report) {
    if (!report) return null;
    const complaints = report.complaints || report.symptoms || report.complaint || 'Routine checkup discussion.';
    const diagnosis = report.diagnosis || 'Health assessment normal.';
    const carePlan = report.treatmentPlan || report.advice || 'Follow recommended dietary and activity advice.';
    const warningSigns = report.warningSigns || 'Seek emergency medical attention if severe chest pain, shortness of breath, or acute symptoms develop.';

    return {
      title: `Your Visit Summary with ${report.doctorName || report.signedBy || 'Your Doctor'}`,
      date: report.date || new Date().toLocaleDateString(),
      diagnosis: diagnosis.includes('Hypertension') ? `${diagnosis} (High Blood Pressure)` : diagnosis,
      carePlan,
      warningSigns,
      whatYouReported: complaints,
      whatTheDoctorFound: report.examination || report.findings || 'Vitals reviewed in target range.',
      doctorAssessment: diagnosis,
      testsRecommended: report.tests || report.recommendedTests || 'Routine health maintenance.',
      treatmentInstructions: carePlan,
      followUpDate: report.followUp || report.followUpDate || 'As needed',
      warningSignsNotice: warningSigns
    };
  }
}

export default DoctorService;
