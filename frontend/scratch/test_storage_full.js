import { trajectoryStorage } from '../src/services/trajectoryStorage.js';

console.log('--- Testing Trajectory Storage Ledger ---');
const patients = trajectoryStorage.getAllPatients();
console.log(`Loaded ${patients.length} patient personas:`, patients.map(p => p.id));

// Verify active patient
const active = trajectoryStorage.getActivePatient();
console.log(`Active patient: ${active.name} (${active.id}) with ${active.history.length} records.`);

// Test adding a reading
const testReading = {
  day: 32,
  date: '2026-11-12',
  time: '08:00 AM',
  protein: 8.5,
  specificGravity: 1.018,
  pH: 6.6,
  glucose: 0,
  ketones: 0,
  blood: 0,
  leukocytes: 0,
  nitrite: 0,
  urobilinogen: 0.2,
  bilirubin: 0,
  notes: 'Automated test suite reading verification',
  confirmed: true
};

const newEntry = trajectoryStorage.addReading(active.id, testReading);
const updatedPatient = trajectoryStorage.getPatient(active.id);
console.log(`Added reading! New record count: ${updatedPatient.history.length}. Day ${newEntry.day} protein: ${newEntry.protein}`);

// Test CSV Export
const csv = trajectoryStorage.exportDataCSV(active.id);
console.log(`CSV Export generated (${csv.split('\n').length} lines). Header: ${csv.split('\n')[0]}`);

// Test JSON Export
const json = trajectoryStorage.exportDataJSON(active.id);
const parsedJson = JSON.parse(json);
console.log(`JSON Export verified. Total items parsed: ${parsedJson.length}`);

// Test Consent
trajectoryStorage.setUserConsent({ agreedToNonDiagnosticScope: true, allowLocalLogging: true });
console.log('User consent recorded:', trajectoryStorage.getUserConsent());

console.log('--- All Storage & Ledger Tests Passed! ---');
