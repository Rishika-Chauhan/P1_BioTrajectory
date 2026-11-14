
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

import { trajectoryStorage } from '../services/trajectoryStorage';

const AuthContext = createContext(null);

export const USER_ROLES = ROLES;

const ALLOWED_ROLES = new Set(Object.values(USER_ROLES));

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

function buildAppUser(firebaseUser, claims = {}) {
  return {
    uid: firebaseUser.uid,
    id: firebaseUser.uid,
    email: firebaseUser.email,
    name:
      firebaseUser.displayName ||
      firebaseUser.email?.split('@')[0] ||
      'User',
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
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

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [tokenClaims, setTokenClaims] = useState(null);

  const [healthProfile, setHealthProfile] = useState(
    () => trajectoryStorage.getHealthProfile()
  );

  // Only Firebase Authentication can establish a session.
  useEffect(() => {
    let active = true;

    const unsubscribe = FirebaseService.onAuthStateChanged(
      async (firebaseUser) => {
        if (!active) return;

        if (!firebaseUser) {
          setCurrentUser(null);
          setTokenClaims(null);
          setIsAuthLoading(false);
          return;
        }

        try {
          const tokenResult =
            await FirebaseService.getIdTokenResult(firebaseUser, true);

          if (!active) return;

          const claims = tokenResult?.claims || {};
          const appUser = buildAppUser(firebaseUser, claims);

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
          if (active) {
            setIsAuthLoading(false);
          }
        }
      }
    );

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Synchronize the existing health profile.
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

  // Real Firebase login only.
  const login = async (email, password, rememberMe = true) => {
    setAuthError(null);

    try {
      if (!email?.trim() || !password) {
        throw new Error('Please enter your email and password.');
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
      const appUser = buildAppUser(firebaseUser, claims);

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

  // Public registration can create USER accounts only.
  // The role argument is intentionally not accepted.
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
      const appUser = buildAppUser(firebaseUser, claims);

      setCurrentUser(appUser);
      setTokenClaims(claims);

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

  // Logout through Firebase.
  const logout = async () => {
    try {
      await FirebaseService.signOut();

      setCurrentUser(null);
      setTokenClaims(null);
      setAuthError(null);

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      setAuthError(error.message || 'Logout failed.');
      return false;
    }
  };

  // Refresh trusted custom claims from Firebase.
  const refreshToken = async () => {
    const firebaseUser = auth.currentUser;

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

  // Profile updates cannot modify identity, role or custom claims.
  const updateProfile = (updates) => {
    const {
      role,
      uid,
      id,
      email,
      claims,
      token,
      emailVerified,
      ...safeUpdates
    } = updates || {};

    setCurrentUser((previous) =>
      previous ? { ...previous, ...safeUpdates } : previous
    );
  };

  // Existing health profile functionality.
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

  // Never grant roles from the frontend.
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
