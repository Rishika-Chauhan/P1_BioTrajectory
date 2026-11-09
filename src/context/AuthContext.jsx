import React, { createContext, useContext, useState, useEffect } from 'react';
import { FirebaseService, ROLES } from '../services/firebase';

const AuthContext = createContext();

export const USER_ROLES = ROLES;

export const getDashboardPath = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return '/admin/dashboard';
    case USER_ROLES.DOCTOR:
      return '/doctor/dashboard';
    case USER_ROLES.DOCTOR_PENDING:
      return '/doctor/pending';
    case USER_ROLES.DOCTOR_SUSPENDED:
      return '/doctor/suspended';
    case USER_ROLES.UNKNOWN:
      return '/account-setup';
    case USER_ROLES.USER:
    default:
      return '/dashboard';
  }
};

const DEFAULT_PATIENT_USER = {
  id: 'usr_pat_88291',
  uid: 'usr_pat_88291',
  name: 'Pranjal Sharma',
  email: 'pranjal@biotrajectory.health',
  role: USER_ROLES.USER,
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  age: 32,
  gender: 'Male',
  bloodType: 'O+',
  joinedDate: '2025-01-15'
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('biotrajectory-auth-user') || sessionStorage.getItem('biotrajectory-auth-user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default to verified patient session for initial load or null
    return DEFAULT_PATIENT_USER;
  });

  const [authError, setAuthError] = useState(null);
  const [tokenClaims, setTokenClaims] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const storage = localStorage.getItem('biotrajectory-remember-me') === 'false' ? sessionStorage : localStorage;
      storage.setItem('biotrajectory-auth-user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('biotrajectory-auth-user');
      sessionStorage.removeItem('biotrajectory-auth-user');
    }
  }, [currentUser]);

  /**
   * Unified Login for ALL ROLES (USER, DOCTOR, ADMIN)
   * Role is automatically detected from trusted token custom claims
   */
  const login = async (email, password, rememberMe = true) => {
    setAuthError(null);
    if (!email || !password) {
      setAuthError('Please provide both your registered email and password.');
      return null;
    }

    try {
      if (rememberMe) {
        localStorage.setItem('biotrajectory-remember-me', 'true');
      } else {
        localStorage.setItem('biotrajectory-remember-me', 'false');
      }

      // 1. Authenticate with Firebase
      const authUser = await FirebaseService.signInWithEmail(email, password);

      // 2. Authoritative Custom Claims Verification
      const idTokenResult = await FirebaseService.getIdTokenResult(authUser, true);
      const verifiedRole = idTokenResult?.claims?.role || USER_ROLES.UNKNOWN;

      const authenticatedUser = {
        ...authUser,
        role: verifiedRole,
        claims: idTokenResult?.claims || {},
        token: idTokenResult?.token
      };

      setTokenClaims(idTokenResult?.claims);
      setCurrentUser(authenticatedUser);

      // Synchronize with doctor local store if doctor role
      if (verifiedRole === USER_ROLES.DOCTOR || verifiedRole === USER_ROLES.DOCTOR_PENDING || verifiedRole === USER_ROLES.DOCTOR_SUSPENDED) {
        localStorage.setItem('biotrajectory-doctor-user', JSON.stringify({
          id: authenticatedUser.id,
          name: authenticatedUser.name || authenticatedUser.displayName,
          email: authenticatedUser.email,
          role: verifiedRole,
          registrationNumber: authenticatedUser.claims?.medicalRegNumber || 'MCI-84729-A',
          specialization: 'Cardiology & Preventive Medicine',
          clinic: 'BioTrajectory Specialty Health Network'
        }));
      }

      return authenticatedUser;
    } catch (err) {
      setAuthError(err.message || 'Authentication failed. Please verify your credentials.');
      return null;
    }
  };

  /**
   * Public Registration STRICTLY creates USER accounts
   * Doctors & Admins cannot register via public registration
   */
  const register = async ({ fullName, email, password, privacyConsent }) => {
    setAuthError(null);

    if (!privacyConsent) {
      setAuthError('You must agree to the privacy policy and terms to create an account.');
      return null;
    }

    try {
      const newUser = await FirebaseService.signUp(email, password, fullName);
      const idTokenResult = await FirebaseService.getIdTokenResult(newUser, true);

      // Explicitly enforce USER role
      const registeredUser = {
        ...newUser,
        role: USER_ROLES.USER, // STRICTLY USER
        claims: idTokenResult?.claims || {},
        token: idTokenResult?.token,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        joinedDate: new Date().toISOString().split('T')[0]
      };

      setCurrentUser(registeredUser);
      return registeredUser;
    } catch (err) {
      setAuthError(err.message || 'Registration failed. Please try again.');
      return null;
    }
  };

  /**
   * Sign out and clear all sessions
   */
  const logout = () => {
    FirebaseService.signOut();
    setCurrentUser(null);
    setTokenClaims(null);
    localStorage.removeItem('biotrajectory-auth-user');
    sessionStorage.removeItem('biotrajectory-auth-user');
    localStorage.removeItem('biotrajectory-doctor-user');
  };

  /**
   * Revalidate / Refresh Custom Claims
   */
  const refreshToken = async () => {
    if (!currentUser) return null;
    try {
      const idTokenResult = await FirebaseService.getIdTokenResult(currentUser, true);
      const updatedUser = {
        ...currentUser,
        claims: idTokenResult?.claims || {},
        token: idTokenResult?.token
      };
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (e) {
      console.warn('Failed to refresh token claims', e);
      return currentUser;
    }
  };

  /**
   * Test sandbox helper to transition roles during review/testing
   */
  const setUserRole = (newRole) => {
    if (!currentUser) return;
    const updated = {
      ...currentUser,
      role: newRole,
      claims: {
        ...(currentUser.claims || {}),
        role: newRole
      }
    };
    setCurrentUser(updated);

    if (newRole.startsWith('DOCTOR')) {
      const doctorUser = JSON.parse(localStorage.getItem('biotrajectory-doctor-user') || '{}');
      doctorUser.role = newRole;
      localStorage.setItem('biotrajectory-doctor-user', JSON.stringify(doctorUser));
    }
  };

  const updateProfile = (updates) => {
    setCurrentUser(prev => ({
      ...prev,
      ...updates
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        role: currentUser?.role || USER_ROLES.UNKNOWN,
        isUser: currentUser?.role === USER_ROLES.USER,
        isDoctor: currentUser?.role === USER_ROLES.DOCTOR,
        isAdmin: currentUser?.role === USER_ROLES.ADMIN,
        isDoctorPending: currentUser?.role === USER_ROLES.DOCTOR_PENDING,
        isDoctorSuspended: currentUser?.role === USER_ROLES.DOCTOR_SUSPENDED,
        isUnknownRole: currentUser?.role === USER_ROLES.UNKNOWN,
        login,
        register,
        logout,
        refreshToken,
        setUserRole,
        updateProfile,
        authError,
        getDashboardPath
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
