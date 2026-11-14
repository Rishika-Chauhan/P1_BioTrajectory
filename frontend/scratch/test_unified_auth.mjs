import { FirebaseService, ROLES } from '../src/services/firebase.js';

async function testRoleDetection() {
  console.log('--- Testing Unified Role Detection & Custom Claims ---');

  // Test 1: User / Patient
  const patientUser = await FirebaseService.signInWithEmail('patient@biotrajectory.health', 'pass123');
  console.log('1. Patient Login:', patientUser.email, '-> Role:', patientUser.role, patientUser.role === ROLES.USER ? 'PASS' : 'FAIL');

  // Test 2: Verified Doctor
  const doctorUser = await FirebaseService.signInWithEmail('dr.thorne@biotrajectory.health', 'pass123');
  console.log('2. Doctor Login:', doctorUser.email, '-> Role:', doctorUser.role, doctorUser.role === ROLES.DOCTOR ? 'PASS' : 'FAIL');

  // Test 3: Doctor Pending
  const pendingUser = await FirebaseService.signInWithEmail('dr.pending@biotrajectory.health', 'pass123');
  console.log('3. Doctor Pending:', pendingUser.email, '-> Role:', pendingUser.role, pendingUser.role === ROLES.DOCTOR_PENDING ? 'PASS' : 'FAIL');

  // Test 4: Doctor Suspended
  const suspendedUser = await FirebaseService.signInWithEmail('dr.suspended@biotrajectory.health', 'pass123');
  console.log('4. Doctor Suspended:', suspendedUser.email, '-> Role:', suspendedUser.role, suspendedUser.role === ROLES.DOCTOR_SUSPENDED ? 'PASS' : 'FAIL');

  // Test 5: Admin
  const adminUser = await FirebaseService.signInWithEmail('admin@biotrajectory.health', 'pass123');
  console.log('5. Admin Login:', adminUser.email, '-> Role:', adminUser.role, adminUser.role === ROLES.ADMIN ? 'PASS' : 'FAIL');

  // Test 6: Unknown Role
  const unknownUser = await FirebaseService.signInWithEmail('unknown@biotrajectory.health', 'pass123');
  console.log('6. Unknown Role Login:', unknownUser.email, '-> Role:', unknownUser.role, unknownUser.role === ROLES.UNKNOWN ? 'PASS' : 'FAIL');

  // Test 7: Public Registration (Strictly USER)
  const registeredUser = await FirebaseService.signUp('newbie@domain.com', 'pass123', 'John Doe');
  console.log('7. Public Registration:', registeredUser.email, '-> Role:', registeredUser.role, registeredUser.role === ROLES.USER ? 'PASS' : 'FAIL');

  console.log('All Role Detection and Claims Tests Completed Successfully!');
}

testRoleDetection().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
