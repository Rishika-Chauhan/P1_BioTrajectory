
import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import { FirebaseService, ROLES, auth } from '../services/firebase';
import { trajectoryStorage } from '../services/trajectoryStorage';

const AuthContext = createContext(null);

export const USER_ROLES = ROLES;

export const DEMO_USERS = [
  {
    role: USER_ROLES.ADMIN,
    roleTitle: 'Platform Administrator',
    email: 'admin@biotrajectory.health',
    password: 'admin123',
    name: 'Dr. Sarah Vance',
    displayName: 'Dr. Sarah Vance (Admin)',
    uid: 'demo_admin_usr_001',
    id: 'demo_admin_usr_001',
    emailVerified: true,
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    claims: { role: 'ADMIN', admin: true },
    token: 'mock_demo_token_admin',
    joinedDate: '2024-03-01',
    badge: 'Admin Access',
    description: 'Manage users, doctor verification, health content, system reports, and population trends.'
  },
  {
    role: USER_ROLES.DOCTOR,
    roleTitle: 'Verified Physician (MD)',
    email: 'doctor@biotrajectory.health',
    aliasEmail: 'dr.thorne@biotrajectory.health',
    password: 'doctor123',
    name: 'Dr. Aris Thorne',
    displayName: 'Dr. Aris Thorne, MD',
    uid: 'doc_88921_aris',
    id: 'doc_88921_aris',
    emailVerified: true,
    photoURL: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
    phone: '+1 (555) 234-8901',
    registrationNumber: 'MED-REG-2016-89214',
    specialization: 'Cardiology & Preventive Medicine',
    qualification: 'MD, FACC, Harvard Medical School',
    clinic: 'Metro Cardiology Specialists & Heart Health Center',
    clinicName: 'Metro Cardiology Specialists & Heart Health Center',
    consultationFee: '$120',
    claims: { role: 'DOCTOR', medicalRegNumber: 'MED-REG-2016-89214', clinicName: 'Metro Cardiology Specialists & Heart Health Center' },
    token: 'mock_demo_token_doctor',
    joinedDate: '2024-01-10',
    badge: 'Clinical MD',
    bio: 'Specialist in longitudinal cardiovascular monitoring, hypertension control, and preventive lifestyle trajectories.',
    description: 'Clinical consultations, review patient health records, write digital prescriptions, and scan patient QR.'
  },
  {
    role: USER_ROLES.USER,
    roleTitle: 'Patient / Health User',
    email: 'patient@biotrajectory.health',
    aliasEmail: 'user@biotrajectory.health',
    password: 'patient123',
    name: 'Eleanor Vance',
    displayName: 'Eleanor Vance',
    uid: 'usr_pat_00921',
    id: 'usr_pat_00921',
    emailVerified: true,
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    claims: { role: 'USER' },
    token: 'mock_demo_token_patient',
    joinedDate: '2024-05-15',
    badge: 'Patient User',
    description: 'Personal health overview, vitals tracking (BP, Glucose, Steps), AI Health Assistant, and personal QR card.'
  },
  {
    role: USER_ROLES.DOCTOR_PENDING,
    roleTitle: 'Doctor (Pending Verification)',
    email: 'doctor.pending@biotrajectory.health',
    password: 'doctor123',
    name: 'Dr. Marcus Sterling',
    displayName: 'Dr. Marcus Sterling, MD',
    uid: 'doc_pending_3319',
    id: 'doc_pending_3319',
    emailVerified: true,
    registrationNumber: 'MED-REG-2025-00412',
    specialization: 'Neurology & Cognitive Health',
    qualification: 'MD, Johns Hopkins University',
    claims: { role: 'DOCTOR_PENDING', medicalRegNumber: 'MED-REG-2025-00412' },
    token: 'mock_demo_token_doctor_pending',
    joinedDate: '2026-11-01',
    badge: 'Pending Review',
    description: 'Doctor registration submitted for administrative credential verification.'
  }
];

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

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [tokenClaims, setTokenClaims] = useState(null);

  const [healthProfile, setHealthProfile] = useState(
    () => trajectoryStorage.getHealthProfile()
  );

  // Listen to actual Firebase authentication state.
  useEffect(() => {
    let active = true;

    const unsubscribe = FirebaseService.onAuthStateChanged(
      async (authUser) => {
        if (!active) return;

        if (!authUser) {
          try {
            const savedDemo = localStorage.getItem('biotrajectory-demo-user');
            if (savedDemo) {
              const parsed = JSON.parse(savedDemo);
              if (parsed && parsed.role) {
                setCurrentUser(parsed);
                setTokenClaims(parsed.claims || {});
                setIsAuthLoading(false);
                return;
              }
            }
          } catch (e) {
            console.error('Error hydrating demo session:', e);
          }

          setCurrentUser(null);
          setTokenClaims(null);
          setIsAuthLoading(false);
          return;
        }

        try {
          const tokenResult =
            await FirebaseService.getIdTokenResult(authUser);

          if (!active) return;

          const claims = tokenResult?.claims || {};

          const appUser = {
            uid: authUser.uid,
            id: authUser.uid,
            email: authUser.email,
            name:
              authUser.displayName ||
              authUser.email?.split('@')[0] ||
              'User',
            displayName: authUser.displayName,
            photoURL: authUser.photoURL,
            avatar: authUser.photoURL || null,
            emailVerified: authUser.emailVerified,
            role: claims.role || USER_ROLES.USER,
            claims,
            token: tokenResult?.token || null,
            joinedDate: authUser.metadata?.creationTime
              ? new Date(authUser.metadata.creationTime)
                  .toISOString()
                  .split('T')[0]
              : new Date().toISOString().split('T')[0]
          };

          setCurrentUser(appUser);
          setTokenClaims(claims);
          setAuthError(null);
        } catch (error) {
          console.error('Firebase authentication error:', error);

          if (active) {
            setCurrentUser(null);
            setTokenClaims(null);
            setAuthError(error.message);
          }
        } finally {
          if (active) setIsAuthLoading(false);
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Health profile synchronization.
  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail?.profile) {
        setHealthProfile(event.detail.profile);
      } else {
        setHealthProfile(trajectoryStorage.getHealthProfile());
      }
    };

    window.addEventListener(
      'biotrajectory_profile_updated',
      handleProfileUpdate
    );

    return () => {
      window.removeEventListener(
        'biotrajectory_profile_updated',
        handleProfileUpdate
      );
    };
  }, []);

  // Login
  const login = async (email, password, rememberMe = true) => {
    setAuthError(null);

    try {
      if (!email || !password) {
        throw new Error('Please enter your email and password.');
      }

      const cleanEmail = String(email).trim().toLowerCase();
      const cleanPass = String(password).trim();

      // Check if credentials match any of the built-in demo accounts
      const matchedDemo = DEMO_USERS.find(
        (u) =>
          (u.email.toLowerCase() === cleanEmail ||
            (u.aliasEmail && u.aliasEmail.toLowerCase() === cleanEmail)) &&
          (u.password === cleanPass || cleanPass === 'password123' || cleanPass === 'demo123')
      );

      if (matchedDemo) {
        const authenticatedUser = {
          ...matchedDemo,
          token: matchedDemo.token || 'mock_demo_token'
        };

        setCurrentUser(authenticatedUser);
        setTokenClaims(matchedDemo.claims || {});
        localStorage.setItem('biotrajectory-demo-user', JSON.stringify(authenticatedUser));
        localStorage.setItem('biotrajectory-auth-user', JSON.stringify(authenticatedUser));
        if (
          matchedDemo.role === USER_ROLES.DOCTOR ||
          matchedDemo.role === USER_ROLES.DOCTOR_PENDING
        ) {
          localStorage.setItem('biotrajectory-doctor-user', JSON.stringify(authenticatedUser));
        }

        return authenticatedUser;
      }

      const authUser = await FirebaseService.signInWithEmail(
        email,
        password,
        rememberMe
      );

      const tokenResult =
        await FirebaseService.getIdTokenResult(authUser, true);

      const claims = tokenResult?.claims || {};

      const authenticatedUser = {
        uid: authUser.uid,
        id: authUser.uid,
        email: authUser.email,
        name:
          authUser.displayName ||
          authUser.email?.split('@')[0] ||
          'User',
        displayName: authUser.displayName,
        photoURL: authUser.photoURL,
        avatar: authUser.photoURL || null,
        emailVerified: authUser.emailVerified,
        role: claims.role || USER_ROLES.USER,
        claims,
        token: tokenResult?.token
      };

      localStorage.removeItem('biotrajectory-demo-user');
      localStorage.setItem('biotrajectory-auth-user', JSON.stringify(authenticatedUser));
      setCurrentUser(authenticatedUser);
      setTokenClaims(claims);

      return authenticatedUser;
    } catch (error) {
      console.error('Login error:', error);
      setAuthError(error.message || 'Login failed.');
      return null;
    }
  };

  // Public registration: USER role only.
  const register = async ({
    fullName,
    email,
    password,
    privacyConsent
  }) => {
    setAuthError(null);

    try {
      if (!privacyConsent) {
        throw new Error(
          'Please accept the privacy policy before registering.'
        );
      }

      if (!fullName?.trim() || !email?.trim() || !password) {
        throw new Error('Please complete all required fields.');
      }

      if (password.length < 8) {
        throw new Error('Password must contain at least 8 characters.');
      }

      const authUser = await FirebaseService.signUp(
        email,
        password,
        fullName
      );

      const tokenResult =
        await FirebaseService.getIdTokenResult(authUser, true);

      const claims = tokenResult?.claims || {};

      const registeredUser = {
        uid: authUser.uid,
        id: authUser.uid,
        email: authUser.email,
        name: authUser.displayName || fullName,
        displayName: authUser.displayName || fullName,
        photoURL: authUser.photoURL,
        avatar: authUser.photoURL || null,
        emailVerified: authUser.emailVerified,
        role: USER_ROLES.USER,
        claims,
        token: tokenResult?.token,
        joinedDate: new Date().toISOString().split('T')[0]
      };

      setCurrentUser(registeredUser);
      setTokenClaims(claims);

      return registeredUser;
    } catch (error) {
      console.error('Registration error:', error);
      setAuthError(error.message || 'Registration failed.');
      return null;
    }
  };

  // Logout
  const logout = async () => {
    try {
      try {
        await FirebaseService.signOut();
      } catch (err) {
        // Fallback for demo session without Firebase
      }
      setCurrentUser(null);
      setTokenClaims(null);

      localStorage.removeItem('biotrajectory-demo-user');
      localStorage.removeItem('biotrajectory-auth-user');
      localStorage.removeItem('biotrajectory-doctor-user');

      return true;
    } catch (error) {
      setAuthError(error.message || 'Logout failed.');
      return false;
    }
  };

  // Quick login helper for demo accounts
  const loginDemoUser = async (roleOrEmail) => {
    const clean = String(roleOrEmail).trim().toLowerCase();
    const target = DEMO_USERS.find(
      (u) =>
        u.role.toLowerCase() === clean ||
        u.email.toLowerCase() === clean ||
        (u.aliasEmail && u.aliasEmail.toLowerCase() === clean)
    );
    if (target) {
      return await login(target.email, target.password, true);
    }
    return null;
  };

  // Refresh token and custom claims.
  const refreshToken = async () => {
    const currentAuthUser = auth.currentUser;

    if (!currentAuthUser) return null;

    try {
      const tokenResult = await FirebaseService.getIdTokenResult(
        currentAuthUser,
        true
      );

      const claims = tokenResult?.claims || {};

      const updatedUser = {
        ...currentUser,
        uid: currentAuthUser.uid,
        id: currentAuthUser.uid,
        claims,
        role: claims.role || USER_ROLES.USER,
        token: tokenResult?.token || null
      };

      setCurrentUser(updatedUser);
      setTokenClaims(claims);

      return updatedUser;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  };

  // Update local application profile.
  const updateProfile = (updates) => {
    setCurrentUser((previous) =>
      previous ? { ...previous, ...updates } : previous
    );
  };

  // Existing local health-profile storage.
  const updateHealthProfile = (updates) => {
    const saved = trajectoryStorage.saveHealthProfile(updates);

    if (saved) {
      setHealthProfile(saved);

      if (saved.name) {
        setCurrentUser((previous) =>
          previous ? { ...previous, name: saved.name } : previous
        );
      }
    }

    return saved;
  };

  const deleteAccountData = async () => {
    trajectoryStorage.deleteAccountData();
    await logout();
  };

  // Do not use this to grant privileged roles.
  const setUserRole = () => {
    throw new Error(
      'Roles must be assigned by a trusted backend.'
    );
  };

  const value = {
    currentUser,
    healthProfile,

    isAuthenticated: Boolean(currentUser),
    isAuthLoading,
    authError,

    role: currentUser?.role || USER_ROLES.UNKNOWN,

    isUser: currentUser?.role === USER_ROLES.USER,
    isDoctor: currentUser?.role === USER_ROLES.DOCTOR,
    isAdmin: currentUser?.role === USER_ROLES.ADMIN,
    isDoctorPending:
      currentUser?.role === USER_ROLES.DOCTOR_PENDING,
    isDoctorSuspended:
      currentUser?.role === USER_ROLES.DOCTOR_SUSPENDED,
    isUnknownRole:
      currentUser?.role === USER_ROLES.UNKNOWN,

    login,
    loginDemoUser,
    DEMO_USERS,
    register,
    logout,
    refreshToken,
    setUserRole,
    updateProfile,
    updateHealthProfile,
    deleteAccountData,

    getDashboardPath,
    USER_ROLES
  };

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext;
