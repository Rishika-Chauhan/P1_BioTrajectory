import { DoctorService } from '../src/services/doctorService.js';

const patients = DoctorService.getDoctorPatients('doc_1');
const appointments = DoctorService.getDoctorAppointments('doc_1');
const reports = DoctorService.getDoctorReports('doc_1');
const prescriptions = DoctorService.getDoctorPrescriptions('doc_1');

console.log('Patients count:', patients.length, 'First patient name:', patients[0]?.name);
console.log('Appointments count:', appointments.length, 'First apt type:', appointments[0]?.type);
console.log('Reports count:', reports.length, 'First report diag:', reports[0]?.diagnosis);
console.log('Prescriptions count:', prescriptions.length, 'First rx med count:', prescriptions[0]?.medicines?.length);
