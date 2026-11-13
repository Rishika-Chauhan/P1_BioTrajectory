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

  const buildDoctorFromUser = (user) => {
    if (!user || !['DOCTOR', 'DOCTOR_PENDING', 'DOCTOR_SUSPENDED'].includes(user.role)) {
      return null;
    }

    return {
      id: user.uid || user.id,
      uid: user.uid || user.id,
      name: user.name || user.displayName || 'Dr. Practitioner',
      fullName: user.name || user.displayName || 'Dr. Practitioner',
      email: user.email,
      phone: user.phone || '+1 (555) 234-8901',
      registrationNumber: user.registrationNumber || user.claims?.medicalRegNumber || 'MED-REG-UNKNOWN',
      specialization: user.specialization || 'Clinical Practice',
      qualification: user.qualification || 'Medical License',
      clinic: user.clinic || user.claims?.clinicName || 'Clinical Practice',
      clinicName: user.clinic || user.claims?.clinicName || 'Clinical Practice',
      role: user.role,
      avatar: user.avatar || user.photoURL || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
      joinedDate: user.joinedDate || new Date().toISOString().split('T')[0],
      bio: user.bio || 'Licensed clinical practitioner.',
      consultationFee: user.consultationFee || '$120'
    };
  };

  const [currentDoctor, setCurrentDoctor] = useState(() => buildDoctorFromUser(auth.currentUser));
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    setCurrentDoctor(buildDoctorFromUser(auth.currentUser));
  }, [auth.currentUser]);

  const loginDoctor = async (email, password) => {
    const user = await auth.login(email, password);
    const doctor = buildDoctorFromUser(user);
    setCurrentDoctor(doctor);
    return doctor;
  };

  const registerDoctor = async (doctorData) => {
    const user = await auth.register({
      fullName: doctorData.fullName,
      email: doctorData.email,
      password: doctorData.password,
      privacyConsent: true,
      role: 'DOCTOR_PENDING'
    });
    const doctor = buildDoctorFromUser({
      ...user,
      ...doctorData,
      role: 'DOCTOR_PENDING'
    });
    setCurrentDoctor(doctor);
    return doctor;
  };

  const logoutDoctor = async () => {
    await auth.logout();
    setCurrentDoctor(null);
  };

  const updateDoctorProfile = (updates) => {
    setCurrentDoctor((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      auth.updateProfile(updates);
      return updated;
    });
  };

  const setVerificationStatus = () => {
    throw new Error('Doctor verification status must be managed by the trusted backend and custom claims.');
  };

  const updateDoctorRole = () => {
    throw new Error('Doctor role assignments are not allowed from the client.');
  };

  const isVerifiedDoctor = currentDoctor?.role === 'DOCTOR';
  const isPendingDoctor = currentDoctor?.role === 'DOCTOR_PENDING';
  const isSuspendedDoctor = currentDoctor?.role === 'DOCTOR_SUSPENDED';

  return (
    <DoctorAuthContext.Provider
      value={{
        currentDoctor,
        isAuthenticatedDoctor: !!currentDoctor && (isVerifiedDoctor || isPendingDoctor || isSuspendedDoctor),
        isVerifiedDoctor,
        isPendingDoctor,
        isSuspendedDoctor,
        doctorRole: currentDoctor?.role || 'DOCTOR_PENDING',
        loginDoctor,
        registerDoctor,
        logoutDoctor,
        updateDoctorProfile,
        setVerificationStatus,
        authError,
        doctor: currentDoctor ? {
          ...currentDoctor,
          fullName: currentDoctor.name,
          regNumber: currentDoctor.registrationNumber,
          clinicName: currentDoctor.clinic,
          uid: currentDoctor.id
        } : null,
        isVerified: isVerifiedDoctor,
        updateDoctorRole
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
