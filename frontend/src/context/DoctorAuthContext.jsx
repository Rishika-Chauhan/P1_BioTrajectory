
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useAuth } from "./AuthContext";
import { doctorApi } from "../services/doctorApi";

const DoctorAuthContext = createContext(null);

export const DOCTOR_ROLES = {
  PENDING: "DOCTOR_PENDING",
  VERIFIED: "DOCTOR",
  SUSPENDED: "DOCTOR_SUSPENDED",
};

const VALID_DOCTOR_ROLES = new Set(
  Object.values(DOCTOR_ROLES)
);

function cleanDoctorName(value) {
  return String(value || "")
    .replace(/^(?:(?:Dr\.?|Doctor)\s*)+/i, "")
    .trim();
}

function buildDoctorFromUser(user, application = null) {
  if (!user || !VALID_DOCTOR_ROLES.has(user.role)) {
    return null;
  }

  const details =
    application?.application ||
    application ||
    {};

  const fullName = cleanDoctorName(
    details.full_name ||
    user.name ||
    user.displayName ||
    ""
  );

  return {
    id: user.uid,
    uid: user.uid,

    name: fullName ? `Dr. ${fullName}` : "",
    fullName,

    email: user.email || "",
    phone: details.phone || "",

    registrationNumber:
      details.registration_number || "",

    specialization:
      details.specialization || "",

    qualification:
      details.qualification || "",

    issuingCouncil:
      details.issuing_council || "",

    clinic: details.clinic_name || "",
    clinicName: details.clinic_name || "",

    role: user.role,

    avatar: user.photoURL || null,

    joinedDate:
      details.created_at ||
      details.submitted_at ||
      "",

    bio: "",
    consultationFee: "",

    applicationStatus:
      details.status || "",

    applicationNote:
      details.review_note || "",
  };
}

function isNotFound(error) {
  return (
    error?.status === 404 ||
    error?.response?.status === 404 ||
    String(error?.message || "").includes("404")
  );
}

export function DoctorAuthProvider({ children }) {
  const auth = useAuth();

  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);

  // Load the authenticated doctor's real application/profile.
  const refreshDoctor = useCallback(
    async (userOverride = null) => {
      const user = userOverride || auth.currentUser;

      if (!user?.uid || !VALID_DOCTOR_ROLES.has(user.role)) {
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
          // A missing application can be valid for an account
          // whose role has already been assigned by the backend.
          if (!isNotFound(error)) {
            throw error;
          }
        }

        const doctor = buildDoctorFromUser(user, application);

        setCurrentDoctor(doctor);

        return doctor;
      } catch (error) {
        console.error(
          "[DoctorAuth] Unable to load doctor profile:",
          error
        );

        setAuthError(
          error?.message ||
          "Unable to load doctor information."
        );

        // Keep only information supplied by the authenticated user.
        // No demo profile or fictional doctor data is used.
        const basicDoctor = buildDoctorFromUser(user);

        setCurrentDoctor(basicDoctor);

        return basicDoctor;
      } finally {
        setLoadingDoctor(false);
      }
    },
    [auth.currentUser]
  );

  // Refresh doctor data when the authenticated user changes.
  useEffect(() => {
    refreshDoctor();
  }, [refreshDoctor]);

  const loginDoctor = async (email, password) => {
    setAuthError(null);
    setLoadingDoctor(true);

    try {
      const user = await auth.login(email, password);

      if (!user) {
        throw new Error("Login failed. Please try again.");
      }

      if (!VALID_DOCTOR_ROLES.has(user.role)) {
        await auth.logout();

        throw new Error(
          "This account is not registered as a doctor. Use regular user login."
        );
      }

      return await refreshDoctor(user);
    } catch (error) {
      setAuthError(error?.message || "Doctor login failed.");
      setCurrentDoctor(null);
      throw error;
    } finally {
      setLoadingDoctor(false);
    }
  };

  const registerDoctor = async (doctorData) => {
    setAuthError(null);
    setLoadingDoctor(true);

    try {
      if (!doctorData) {
        throw new Error(
          "Doctor registration details are required."
        );
      }

      const user = await auth.register({
        fullName: doctorData.fullName,
        email: doctorData.email,
        password: doctorData.password,
        privacyConsent: true,
      });

      if (!user) {
        throw new Error("Account registration failed.");
      }

      const refreshedUser = await auth.refreshToken();

      const emailVerified =
        refreshedUser?.emailVerified ??
        user.emailVerified ??
        false;

      if (!emailVerified) {
        throw new Error(
          "Your account has been created. Verify your email, then sign in and submit your doctor application."
        );
      }

      const application = {
        full_name: doctorData.fullName,
        phone: doctorData.phone,
        registration_number:
          doctorData.registrationNumber,
        issuing_council:
          doctorData.issuingCouncil,
        qualification:
          doctorData.qualification,
        specialization:
          doctorData.specialization,
        clinic_name:
          doctorData.clinicName || "",
      };

      await doctorApi.submitApplication(application);

      const updatedUser = await auth.refreshToken();

      return await refreshDoctor(updatedUser);
    } catch (error) {
      setAuthError(error?.message || "Doctor registration failed.");
      throw error;
    } finally {
      setLoadingDoctor(false);
    }
  };

  const logoutDoctor = async () => {
    setAuthError(null);

    try {
      await auth.logout();

      setCurrentDoctor(null);

      return true;
    } catch (error) {
      setAuthError(error?.message || "Logout failed.");
      throw error;
    }
  };

  const updateDoctorProfile = async () => {
    return refreshDoctor();
  };

  // These actions must only be performed by trusted backend/admin code.
  const setVerificationStatus = () => {
    throw new Error(
      "Only an administrator can change doctor verification status."
    );
  };

  const updateDoctorRole = () => {
    throw new Error(
      "Doctor roles must be assigned by the trusted backend."
    );
  };

  const isVerifiedDoctor =
    currentDoctor?.role === DOCTOR_ROLES.VERIFIED;

  const isPendingDoctor =
    currentDoctor?.role === DOCTOR_ROLES.PENDING;

  const isSuspendedDoctor =
    currentDoctor?.role === DOCTOR_ROLES.SUSPENDED;

  const isAuthenticatedDoctor = Boolean(
    currentDoctor &&
    (
      isVerifiedDoctor ||
      isPendingDoctor ||
      isSuspendedDoctor
    )
  );

  const doctor = currentDoctor
    ? {
        ...currentDoctor,
        fullName: currentDoctor.fullName,
        regNumber: currentDoctor.registrationNumber,
        clinicName: currentDoctor.clinic,
        uid: currentDoctor.uid,
      }
    : null;

  const value = {
    currentDoctor,
    doctor,

    loadingDoctor,
    authError,

    isAuthenticatedDoctor,
    isVerifiedDoctor,
    isPendingDoctor,
    isSuspendedDoctor,

    isVerified: isVerifiedDoctor,

    doctorRole: currentDoctor?.role || null,

    loginDoctor,
    registerDoctor,
    logoutDoctor,

    updateDoctorProfile,
    refreshDoctor,

    setVerificationStatus,
    updateDoctorRole,
  };

  return (
    <DoctorAuthContext.Provider value={value}>
      {children}
    </DoctorAuthContext.Provider>
  );
}

export function useDoctorAuth() {
  const context = useContext(DoctorAuthContext);

  if (!context) {
    throw new Error(
      "useDoctorAuth must be used within a DoctorAuthProvider"
    );
  }

  return context;
}
