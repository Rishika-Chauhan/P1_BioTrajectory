/**
 * Doctor Service
 *
 * The application authenticates doctors via Firebase and keeps doctor authorization in
 * trusted custom claims / Firestore records. This frontend does not currently expose a
 * production doctor-patient dossier store, so we intentionally avoid seeding or
 * persisting fake patient data in localStorage.
 */

const STORAGE_KEYS = {
  PATIENTS: 'bt_doc_patients_store',
  APPOINTMENTS: 'bt_doc_appointments_store',
  REPORTS: 'bt_doc_reports_store',
  PRESCRIPTIONS: 'bt_doc_prescriptions_store'
};

export class DoctorService {
  static _load() {
    return [];
  }

  static _save() {
    return false;
  }

  static getDoctorPatients() {
    return [];
  }

  static getDoctorAppointments() {
    return [];
  }

  static getDoctorReports() {
    return [];
  }

  static getDoctorPrescriptions() {
    return [];
  }

  static saveDoctorReport() {
    throw new Error('Doctor report storage is not available until a Firestore-backed clinical workflow is configured.');
  }

  static saveDoctorPrescription() {
    throw new Error('Doctor prescription storage is not available until a Firestore-backed clinical workflow is configured.');
  }

  static async getPatients() {
    return [];
  }

  static async getPatientById() {
    return null;
  }

  static async savePatient() {
    throw new Error('Patient records must be stored in Firestore only.');
  }

  static async getAppointments() {
    return [];
  }

  static async updateAppointmentStatus() {
    return null;
  }

  static async rescheduleAppointment() {
    return null;
  }

  static async getReports() {
    return [];
  }

  static async getReportById() {
    return null;
  }

  static async saveReport() {
    throw new Error('Doctor reports must be stored in Firestore only.');
  }

  static async getPrescriptions() {
    return [];
  }

  static async savePrescription() {
    throw new Error('Doctor prescriptions must be stored in Firestore only.');
  }

  static generatePatientFriendlySummary(report) {
    if (!report) return null;

    return {
      title: 'Clinical summary unavailable',
      date: report.date || new Date().toLocaleDateString(),
      diagnosis: report.diagnosis || 'No report available yet.',
      carePlan: 'Access to doctor-generated summaries will appear here after a verified Firestore-backed consultation is created.',
      warningSigns: 'No clinical summary is available yet.',
      whatYouReported: report.complaints || report.symptoms || 'No patient notes available yet.',
      whatTheDoctorFound: report.findings || 'No findings available yet.',
      doctorAssessment: report.diagnosis || 'Pending review',
      testsRecommended: 'Not available',
      treatmentInstructions: 'Not available',
      followUpDate: 'Not scheduled',
      warningSignsNotice: 'No clinical summary is available yet.'
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
