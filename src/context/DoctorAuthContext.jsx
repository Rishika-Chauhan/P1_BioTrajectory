import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DoctorAuthContext = createContext();

export const DOCTOR_ROLES = {
  PENDING: 'DOCTOR_PENDING',
  VERIFIED: 'DOCTOR', // Unified with AuthContext
  SUSPENDED: 'DOCTOR_SUSPENDED'
};

const DEMO_VERIFIED_DOCTOR = {
  id: 'doc_88921_aris',
  name: 'Dr. Aris Thorne',
  email: 'dr.thorne@biotrajectory.health',
  phone: '+1 (555) 234-8901',
  registrationNumber: 'MED-REG-2016-89214',
  specialization: 'Cardiology & Preventive Medicine',
  qualification: 'MD, FACC, Harvard Medical School',
  clinic: 'Metro Cardiology Specialists & Heart Health Center',
  role: 'DOCTOR',
  avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
  joinedDate: '2024-01-10',
  bio: 'Specialist in longitudinal cardiovascular monitoring, hypertension control, and preventive lifestyle trajectories.',
  consultationFee: '$120'
};

export function DoctorAuthProvider({ children }) {
  const auth = useAuth();

  const [currentDoctor, setCurrentDoctor] = useState(() => {
    // If unified auth has a doctor user, use it
    if (auth.currentUser && (auth.currentUser.role === 'DOCTOR' || auth.currentUser.role === 'DOCTOR_PENDING' || auth.currentUser.role === 'DOCTOR_SUSPENDED')) {
      return {
        ...DEMO_VERIFIED_DOCTOR,
        ...auth.currentUser,
        name: auth.currentUser.name || auth.currentUser.displayName || 'Dr. Practitioner',
        role: auth.currentUser.role
      };
    }
    const saved = localStorage.getItem('biotrajectory-doctor-user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return DEMO_VERIFIED_DOCTOR;
  });

  const [authError, setAuthError] = useState(null);

  // Sync with AuthContext whenever auth.currentUser changes
  useEffect(() => {
    if (auth.currentUser && (auth.currentUser.role === 'DOCTOR' || auth.currentUser.role === 'DOCTOR_PENDING' || auth.currentUser.role === 'DOCTOR_SUSPENDED')) {
      setCurrentDoctor(prev => ({
        ...DEMO_VERIFIED_DOCTOR,
        ...prev,
        ...auth.currentUser,
        name: auth.currentUser.name || auth.currentUser.displayName || 'Dr. Practitioner',
        role: auth.currentUser.role
      }));
    }
  }, [auth.currentUser]);

  useEffect(() => {
    if (currentDoctor) {
      localStorage.setItem('biotrajectory-doctor-user', JSON.stringify(currentDoctor));
    } else {
      localStorage.removeItem('biotrajectory-doctor-user');
    }
  }, [currentDoctor]);

  const loginDoctor = async (email, password) => {
    // Delegate to unified login
    const user = await auth.login(email, password);
    if (user) {
      const doc = {
        ...DEMO_VERIFIED_DOCTOR,
        ...user,
        role: user.role
      };
      setCurrentDoctor(doc);
      return doc;
    }
    return null;
  };

  const logoutDoctor = () => {
    auth.logout();
    setCurrentDoctor(null);
    localStorage.removeItem('biotrajectory-doctor-user');
  };

  const updateDoctorProfile = (updates) => {
    setCurrentDoctor(prev => {
      const updated = { ...prev, ...updates };
      auth.updateProfile(updates);
      return updated;
    });
  };

  // Demo toggle for testing verification state in sandbox
  const setVerificationStatus = (status) => {
    const canonicalStatus = status === 'DOCTOR_VERIFIED' ? 'DOCTOR' : status;
    setCurrentDoctor(prev => prev ? ({ ...prev, role: canonicalStatus }) : null);
    auth.setUserRole(canonicalStatus);
  };

  const isVerifiedDoctor = currentDoctor?.role === 'DOCTOR' || currentDoctor?.role === 'DOCTOR_VERIFIED';
  const isPendingDoctor = currentDoctor?.role === 'DOCTOR_PENDING';
  const isSuspendedDoctor = currentDoctor?.role === 'DOCTOR_SUSPENDED';

  return (
    <DoctorAuthContext.Provider
      value={{
        currentDoctor,
        isAuthenticatedDoctor: !!currentDoctor && (isVerifiedDoctor || isPendingDoctor),
        isVerifiedDoctor,
        isPendingDoctor,
        isSuspendedDoctor,
        doctorRole: currentDoctor?.role || 'DOCTOR_PENDING',
        loginDoctor,
        logoutDoctor,
        updateDoctorProfile,
        setVerificationStatus,
        authError,
        // Aliases for convenience across all doctor portal pages
        doctor: currentDoctor ? {
          ...currentDoctor,
          fullName: currentDoctor.name,
          regNumber: currentDoctor.registrationNumber,
          clinicName: currentDoctor.clinic,
          uid: currentDoctor.id
        } : null,
        isVerified: isVerifiedDoctor,
        updateDoctorRole: setVerificationStatus
      }}
    >
      {children}
    </DoctorAuthContext.Provider>
  );
}

export function useDoctorAuth() {
  const context = useContext(DoctorAuthContext);
  if (!context) {
    throw new Error('useDoctorAuth must be used within a DoctorAuthProvider');
  }
  return context;
}
