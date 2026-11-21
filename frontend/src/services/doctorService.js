
/**
 * Doctor display utilities.
 *
 * Patient records, appointments, reports and prescriptions
 * must be handled by their dedicated Firestore services.
 *
 * This file intentionally contains no demo data and no
 * localStorage persistence.
 */

export function formatDoctorTitle(rawName) {
  if (!rawName) return "Dr. Practitioner";

  const clean = String(rawName)
    .replace(/^(?:(Dr\.?|Doctor)\s*)+/gi, "")
    .trim();

  return `Dr. ${clean || "Practitioner"}`;
}

export function stripDoctorTitle(rawName) {
  if (!rawName) return "Practitioner";

  return (
    String(rawName)
      .replace(/^(?:(Dr\.?|Doctor)\s*)+/gi, "")
      .trim() || "Practitioner"
  );
}
