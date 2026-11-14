
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import { useAuth } from './AuthContext';
import { doctorApi } from '../services/doctorApi';

const DoctorAuthContext = createContext(null);

export const DOCTOR_ROLES = {
  PENDING: 'DOCTOR_PENDING',
  VERIFIED: 'DOCTOR',
  SUSPENDED: 'DOCTOR_SUSPENDED'
};

const VALID_DOCTOR_ROLES = new Set([
  DOCTOR_ROLES.PENDING,
  DOCTOR_ROLES.VERIFIED,
  DOCTOR_ROLES.SUSPENDED
]);

// --------------------------------------------------
// Normalize only real data returned by Firebase
// or the trusted backend.
// --------------------------------------------------

function buildDoctorFromUser(user, application = null) {
  if (!user || !VALID_DOCTOR_ROLES.has(user.role)) {
    return null;
  }

  const details = application?.application || application || {};
  const rawFullName = details.full_name || user.name || user.displayName || '';
  const cleanDoctorName = rawFullName ? String(rawFullName).replace(/^(?:(Dr\.?|Doctor)\s*)+/gi, '').trim() : '';

  return {
    id: user.uid || user.id,
    uid: user.uid || user.id,

    name:
      cleanDoctorName ? `Dr. ${cleanDoctorName}` : 'Dr. Practitioner',

    fullName:
      cleanDoctorName || 'Practitioner',

    email: user.email || '',

    phone:
      details.phone ||
      user.phone ||
      '',

    registrationNumber:
      details.registration_number ||
      '',

    specialization:
      details.specialization ||
      '',

    qualification:
      details.qualification ||
      '',

    issuingCouncil:
      details.issuing_council ||
      '',

    clinic:
      details.clinic_name ||
      '',

    clinicName:
      details.clinic_name ||
      '',

    role: user.role,

    avatar:
      user.photoURL ||
      user.avatar ||
      '',

    joinedDate:
      details.created_at ||
      '',

    bio: user.bio || '',

    consultationFee:
      user.consultationFee || '',

    applicationStatus:
      details.status || '',

    applicationNote:
      details.review_note || ''
  };
}

// --------------------------------------------------
// Provider
// --------------------------------------------------

export function DoctorAuthProvider({ children }) {
  const auth = useAuth();

  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);

  // ------------------------------------------------
  // Load doctor application from trusted backend
  // ------------------------------------------------

  const refreshDoctor = useCallback(async () => {
    const user = auth.currentUser;

    if (!user || !VALID_DOCTOR_ROLES.has(user.role)) {
      setCurrentDoctor(null);
      setLoadingDoctor(false);
      return null;
    }

    setLoadingDoctor(true);
    setAuthError(null);

    try {
      let application = null;

      try {
        application = await doctorApi.getMyApplication();
      } catch (error) {
        // A 404 means the account has no application.
        // Other errors should not be silently ignored.
        if (
          !String(error.message || '').includes('404')
        ) {
          throw error;
        }
      }

      const doctor = buildDoctorFromUser(user, application);

      setCurrentDoctor(doctor);
      return doctor;
    } catch (error) {
      console.error(
        '[DoctorAuth] Unable to load doctor information:',
        error
      );

      setAuthError(error.message || 'Unable to load doctor information.');

      // Do not fabricate or retain potentially stale doctor data.
      setCurrentDoctor(buildDoctorFromUser(user));
      return null;
    } finally {
      setLoadingDoctor(false);
    }
  }, [auth.currentUser]);

  // ------------------------------------------------
  // Synchronize with Firebase authentication
  // ------------------------------------------------

  useEffect(() => {
    refreshDoctor();
  }, [refreshDoctor]);

  // ------------------------------------------------
  // Doctor login
  // ------------------------------------------------

  const loginDoctor = async (email, password) => {
    setAuthError(null);

    try {
      const user = await auth.login(email, password);

      if (!user) {
        throw new Error('Login failed. Please try again.');
      }

      if (!VALID_DOCTOR_ROLES.has(user.role)) {
        await auth.logout();

        throw new Error(
          'This account is not registered as a doctor. Please use the regular user login.'
        );
      }

      const doctor = await refreshDoctor();

      return doctor;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // ------------------------------------------------
  // Doctor registration
  //
  // Never assign a doctor role from the frontend.
  // The backend assigns DOCTOR_PENDING after receiving
  // a valid application from an authenticated user.
  // ------------------------------------------------

  const registerDoctor = async (doctorData) => {
    setAuthError(null);

    try {
      if (!doctorData) {
        throw new Error('Doctor registration details are required.');
      }

      const user = await auth.register({
        fullName: doctorData.fullName,
        email: doctorData.email,
        password: doctorData.password,
        privacyConsent: true
      });

      if (!user) {
        throw new Error('Account registration failed.');
      }

      const refreshed = await auth.refreshToken?.();

      const emailVerified =
        refreshed?.emailVerified ??
        auth.currentUser?.emailVerified ??
        false;

      if (!emailVerified) {
        throw new Error(
          'Verify your email before submitting your doctor application. Your account has been created; sign in again after verification.'
        );
      }

      const application = {
        full_name: doctorData.fullName,
        phone: doctorData.phone,
        registration_number: doctorData.registrationNumber,
        issuing_council: doctorData.issuingCouncil,
        qualification: doctorData.qualification,
        specialization: doctorData.specialization,
        clinic_name: doctorData.clinicName || ''
      };

      await doctorApi.submitApplication(application);

      await auth.refreshToken?.();

      return await refreshDoctor();
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // ------------------------------------------------
  // Logout
  // ------------------------------------------------

  const logoutDoctor = async () => {
    setAuthError(null);

    try {
      await auth.logout();
      setCurrentDoctor(null);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // ------------------------------------------------
  // Refresh doctor data after backend changes
  // ------------------------------------------------

  const updateDoctorProfile = async () => {
    // Medical credentials and verification status must
    // be changed through the trusted backend.
    return refreshDoctor();
  };

  // ------------------------------------------------
  // Block client-side verification changes
  // ------------------------------------------------

  const setVerificationStatus = () => {
    throw new Error(
      'Doctor verification status must be managed by an administrator through the backend.'
    );
  };

  const updateDoctorRole = () => {
    throw new Error(
      'Doctor roles can only be assigned by the trusted backend.'
    );
  };

  // ------------------------------------------------
  // Role states
  // ------------------------------------------------

  const isVerifiedDoctor =
    currentDoctor?.role === DOCTOR_ROLES.VERIFIED;

  const isPendingDoctor =
    currentDoctor?.role === DOCTOR_ROLES.PENDING;

  const isSuspendedDoctor =
    currentDoctor?.role === DOCTOR_ROLES.SUSPENDED;

  const isAuthenticatedDoctor =
    Boolean(currentDoctor) &&
    (
      isVerifiedDoctor ||
      isPendingDoctor ||
      isSuspendedDoctor
    );

  // ------------------------------------------------
  // Context
  // ------------------------------------------------

  const value = {
    currentDoctor,

    doctor: currentDoctor
      ? {
        ...currentDoctor,
        fullName: currentDoctor.name,
        regNumber: currentDoctor.registrationNumber,
        clinicName: currentDoctor.clinic,
        uid: currentDoctor.id
      }
      : null,

    loadingDoctor,
    authError,

    isAuthenticatedDoctor,
    isVerifiedDoctor,
    isPendingDoctor,
    isSuspendedDoctor,

    isVerified: isVerifiedDoctor,

    doctorRole:
      currentDoctor?.role || null,

    loginDoctor,
    registerDoctor,
    logoutDoctor,

    updateDoctorProfile,
    refreshDoctor,

    setVerificationStatus,
    updateDoctorRole
  };

  return (
    <DoctorAuthContext.Provider value={value}>
      {children}
    </DoctorAuthContext.Provider>
  );
}

// --------------------------------------------------
// Hook
// --------------------------------------------------

export function useDoctorAuth() {
  const context = useContext(DoctorAuthContext);

  if (!context) {
    throw new Error(
      'useDoctorAuth must be used within a DoctorAuthProvider'
    );
  }

  return context;
}
