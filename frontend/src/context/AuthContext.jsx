import React, {
  createContext,
  useContext,
  useState,
  useEffect
} from 'react';

import {
  FirebaseService,
  ROLES,
  auth
} from '../services/firebase';

import {
  trajectoryStorage,
  DEFAULT_HEALTH_PROFILE
} from '../services/trajectoryStorage';

import { userProfileService } from '../services/userProfileService';
import { patientHealthService } from '../services/patientHealthService';

const AuthContext = createContext(null);

export const USER_ROLES = ROLES;

const ALLOWED_ROLES = new Set(Object.values(USER_ROLES));

export const DEMO_STORAGE_KEY = 'biotrajectory_demo_user';

export const getDemoHealthProfile = () => ({
  name: 'Alex Johnson',
  age: 34,
  gender: 'male',
  bloodGroup: 'O+',
  height: 178,
  weight: 72,
  allergies: ['Penicillin'],
  conditions: ['Mild Hypertension (Monitored)'],
  emergencyContact: {
    name: 'Emily Johnson',
    relationship: 'Spouse',
    phone: '+1 (555) 987-6543'
  },
  consent: {
    storeAndProcessHealthData: true,
    nonDiagnosticScopeAcknowledged: true
  },
  onboardingCompleted: true
});

export const DEMO_ACCOUNTS = {
  'admin@biotrajectory.health': {
    uid: 'demo-admin-uid-001',
    id: 'demo-admin-uid-001',
    email: 'admin@biotrajectory.health',
    password: 'admin123',
    name: 'System Administrator',
    displayName: 'System Administrator',
    role: USER_ROLES.ADMIN,
    emailVerified: true,
    claims: { role: USER_ROLES.ADMIN },
    joinedDate: '2024-01-01',
    isDemo: true
  },
  'doctor@biotrajectory.health': {
    uid: 'demo-doctor-uid-002',
    id: 'demo-doctor-uid-002',
    email: 'doctor@biotrajectory.health',
    password: 'doctor123',
    name: 'Dr. Sarah Mitchell, MD',
    displayName: 'Dr. Sarah Mitchell, MD',
    role: USER_ROLES.DOCTOR,
    emailVerified: true,
    claims: { role: USER_ROLES.DOCTOR },
    joinedDate: '2024-01-15',
    isDemo: true
  },
  'doctor.pending@biotrajectory.health': {
    uid: 'demo-doctor-pending-004',
    id: 'demo-doctor-pending-004',
    email: 'doctor.pending@biotrajectory.health',
    password: 'doctor123',
    name: 'Dr. Robert Chen, MD',
    displayName: 'Dr. Robert Chen, MD',
    role: USER_ROLES.DOCTOR_PENDING,
    emailVerified: true,
    claims: { role: USER_ROLES.DOCTOR_PENDING },
    joinedDate: '2024-03-01',
    isDemo: true
  },
  'patient@biotrajectory.health': {
    uid: 'demo-patient-uid-003',
    id: 'demo-patient-uid-003',
    email: 'patient@biotrajectory.health',
    password: 'patient123',
    name: 'Alex Johnson',
    displayName: 'Alex Johnson',
    role: USER_ROLES.USER,
    emailVerified: true,
    claims: { role: USER_ROLES.USER },
    joinedDate: '2024-02-01',
    isDemo: true
  }
};

export function getStoredDemoUser() {
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

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

function getTrustedRole(claims) {
  const role = claims?.role;

  return typeof role === 'string' && ALLOWED_ROLES.has(role)
    ? role
    : USER_ROLES.USER;
}

function buildAppUser(firebaseUser, claims = {}, profile = null) {
  const profileName =
    profile?.name ||
    profile?.fullName ||
    firebaseUser.displayName ||
    firebaseUser.email?.split('@')[0] ||
    'User';

  return {
    uid: firebaseUser.uid,
    id: firebaseUser.uid,
    email: firebaseUser.email,
    name: profileName,
    displayName: firebaseUser.displayName || profileName,
    photoURL: firebaseUser.photoURL || null,
    avatar: firebaseUser.photoURL || null,
    emailVerified: firebaseUser.emailVerified,
    role: getTrustedRole(claims),
    claims,
    joinedDate: firebaseUser.metadata?.creationTime
      ? new Date(firebaseUser.metadata.creationTime)
          .toISOString()
          .split('T')[0]
      : new Date().toISOString().split('T')[0]
  };
}

const getEmptyHealthProfile = () => ({
  ...DEFAULT_HEALTH_PROFILE,
  onboardingCompleted: false
});

export function AuthProvider({ children }) {
  const initialDemoUser = getStoredDemoUser();
  const [currentUser, setCurrentUser] = useState(initialDemoUser);
  const [isAuthLoading, setIsAuthLoading] = useState(!initialDemoUser);
  const [authError, setAuthError] = useState(null);
  const [tokenClaims, setTokenClaims] = useState(initialDemoUser?.claims || null);

  const [healthProfile, setHealthProfile] = useState(() => {
    if (initialDemoUser?.role === USER_ROLES.USER) {
      return getDemoHealthProfile();
    }
    return getEmptyHealthProfile();
  });

  const loadUserProfiles = async (firebaseUser) => {
    const basicProfile =
      await userProfileService.createIfMissing(firebaseUser);

    const remoteHealthProfile =
      await patientHealthService.get(firebaseUser.uid);

    if (remoteHealthProfile) {
      setHealthProfile(remoteHealthProfile);
      trajectoryStorage.saveHealthProfile(remoteHealthProfile);
    } else {
      setHealthProfile(getEmptyHealthProfile());
    }

    return basicProfile;
  };

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    try {
      unsubscribe = FirebaseService.onAuthStateChanged(
        async (firebaseUser) => {
          if (!active) return;

          // If a demo user session is currently active, preserve it
          const storedDemo = getStoredDemoUser();
          if (storedDemo && !firebaseUser) {
            setIsAuthLoading(false);
            return;
          }

          if (!firebaseUser) {
            setCurrentUser(null);
            setTokenClaims(null);
            setHealthProfile(getEmptyHealthProfile());
            setIsAuthLoading(false);
            return;
          }

          try {
            const tokenResult =
              await FirebaseService.getIdTokenResult(firebaseUser, true);

            if (!active) return;

            const claims = tokenResult?.claims || {};
            const basicProfile = await loadUserProfiles(firebaseUser);

            if (!active) return;

            const appUser = buildAppUser(
              firebaseUser,
              claims,
              basicProfile
            );

            setCurrentUser(appUser);
            setTokenClaims(claims);
            setAuthError(null);
          } catch (error) {
            console.error(
              'Firebase authentication/profile initialization error:',
              error
            );

            if (active) {
              setCurrentUser(null);
              setTokenClaims(null);
              setHealthProfile(getEmptyHealthProfile());
              setAuthError(
                error.message || 'Unable to initialize your account.'
              );
            }
          } finally {
            if (active) {
              setIsAuthLoading(false);
            }
          }
        }
      );
    } catch (error) {
      console.error('Failed to start Firebase auth listener:', error);
      setAuthError(error.message || 'Authentication is unavailable.');
      setIsAuthLoading(false);
    }

    return () => {
      active = false;
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const handleProfileUpdate = (event) => {
      if (event.detail?.profile) {
        setHealthProfile(event.detail.profile);
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

  const login = async (email, password, rememberMe = true) => {
    setAuthError(null);

    try {
      if (!email?.trim() || !password) {
        throw new Error('Please enter your email and password.');
      }

      const cleanEmail = email.trim().toLowerCase();
      const demoAccount = DEMO_ACCOUNTS[cleanEmail];

      if (demoAccount) {
        if (password !== demoAccount.password) {
          throw new Error('Invalid email or password.');
        }

        const appUser = { ...demoAccount };
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(appUser));
        setCurrentUser(appUser);
        setTokenClaims(appUser.claims);

        if (appUser.role === USER_ROLES.USER) {
          const demoHealth = getDemoHealthProfile();
          setHealthProfile(demoHealth);
          trajectoryStorage.saveHealthProfile(demoHealth);
        } else {
          setHealthProfile(getEmptyHealthProfile());
        }

        setIsAuthLoading(false);
        return appUser;
      }

      const firebaseUser = await FirebaseService.signInWithEmail(
        email.trim(),
        password,
        rememberMe
      );

      if (!firebaseUser) {
        throw new Error('Firebase authentication failed.');
      }

      const tokenResult =
        await FirebaseService.getIdTokenResult(firebaseUser, true);

      const claims = tokenResult?.claims || {};
      const basicProfile = await loadUserProfiles(firebaseUser);

      const appUser = buildAppUser(
        firebaseUser,
        claims,
        basicProfile
      );

      setCurrentUser(appUser);
      setTokenClaims(claims);

      return appUser;
    } catch (error) {
      console.error('Login error:', error);

      let message = error.message || 'Login failed.';

      if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password'
      ) {
        message = 'Invalid email or password.';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later.';
      }

      setAuthError(message);
      throw new Error(message);
    }
  };

  const register = async ({
    fullName,
    email,
    password,
    privacyConsent
  }) => {
    setAuthError(null);

    try {
      if (!privacyConsent) {
        throw new Error('Please accept the privacy policy.');
      }

      if (!fullName?.trim() || !email?.trim() || !password) {
        throw new Error('Please complete all required fields.');
      }

      if (password.length < 8) {
        throw new Error('Password must contain at least 8 characters.');
      }

      const firebaseUser = await FirebaseService.signUp(
        email.trim(),
        password,
        fullName.trim()
      );

      const tokenResult =
        await FirebaseService.getIdTokenResult(firebaseUser, true);

      const claims = tokenResult?.claims || {};

      const basicProfile =
        await userProfileService.createIfMissing(firebaseUser);

      const appUser = buildAppUser(
        firebaseUser,
        claims,
        basicProfile
      );

      setCurrentUser(appUser);
      setTokenClaims(claims);
      setHealthProfile(getEmptyHealthProfile());

      return appUser;
    } catch (error) {
      console.error('Registration error:', error);

      let message = error.message || 'Registration failed.';

      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Use a stronger password with at least 8 characters.';
      }

      setAuthError(message);
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem(DEMO_STORAGE_KEY);
      await FirebaseService.signOut().catch(() => {});

      setCurrentUser(null);
      setTokenClaims(null);
      setHealthProfile(getEmptyHealthProfile());
      setAuthError(null);

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      setAuthError(error.message || 'Logout failed.');
      return false;
    }
  };

  const refreshToken = async () => {
    const firebaseUser = auth?.currentUser;

    if (!firebaseUser) {
      setCurrentUser(null);
      setTokenClaims(null);
      return null;
    }

    try {
      const tokenResult =
        await FirebaseService.getIdTokenResult(firebaseUser, true);

      const claims = tokenResult?.claims || {};
      const updatedUser = buildAppUser(firebaseUser, claims);

      setCurrentUser(updatedUser);
      setTokenClaims(claims);

      return updatedUser;
    } catch (error) {
      console.error('Token refresh error:', error);
      return null;
    }
  };

  const updateProfile = (updates = {}) => {
    const {
      role,
      uid,
      id,
      email,
      claims,
      token,
      emailVerified,
      ...safeUpdates
    } = updates;

    setCurrentUser((previous) =>
      previous ? { ...previous, ...safeUpdates } : previous
    );
  };

  const updateHealthProfile = async (updates) => {
    const firebaseUser = auth?.currentUser;

    if (!firebaseUser) {
      throw new Error('Please sign in first.');
    }

    if (
      updates?.consent?.storeAndProcessHealthData !== true
    ) {
      throw new Error('Consent is required to save health information.');
    }

    const savedProfile = await patientHealthService.save(
      firebaseUser.uid,
      updates
    );

    trajectoryStorage.saveHealthProfile(savedProfile);
    setHealthProfile(savedProfile);

    if (savedProfile?.name) {
      setCurrentUser((previous) =>
        previous
          ? { ...previous, name: savedProfile.name }
          : previous
      );
    }

    return savedProfile;
  };

  const deleteAccountData = async () => {
    trajectoryStorage.deleteAccountData();
    await logout();
  };

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
    tokenClaims,

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