
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
        throw new Error('Please enter both your email address and password.');
      }

      const authUser = await FirebaseService.signInWithEmail(
        email,
        password,
        rememberMe
      );

      if (!authUser) {
        throw new Error('Invalid login credentials. Please check your email and password.');
      }

      const tokenResult =
        await FirebaseService.getIdTokenResult(authUser, true);

      const claims = tokenResult?.claims || authUser.claims || {};

      const authenticatedUser = {
        uid: authUser.uid,
        id: authUser.uid,
        email: authUser.email,
        name:
          authUser.displayName ||
          authUser.name ||
          authUser.email?.split('@')[0] ||
          'User',
        displayName: authUser.displayName || authUser.name,
        photoURL: authUser.photoURL,
        avatar: authUser.photoURL || null,
        emailVerified: authUser.emailVerified ?? true,
        role: claims.role || authUser.role || USER_ROLES.USER,
        claims,
        token: tokenResult?.token
      };

      setCurrentUser(authenticatedUser);
      setTokenClaims(claims);

      return authenticatedUser;
    } catch (error) {
      console.error('Login error:', error);
      let message = error.message || 'Login failed.';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        message = 'Invalid login credentials. Please check your email and password.';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email. Please register as a patient first.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed login attempts. Please wait a few moments and try again.';
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  // Public registration: USER role only.
  const register = async ({
    fullName,
    email,
    password,
    privacyConsent,
    role = USER_ROLES.USER
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
        fullName,
        role
      );

      const tokenResult =
        await FirebaseService.getIdTokenResult(authUser, true);

      const claims = tokenResult?.claims || authUser.claims || {};

      const registeredUser = {
        uid: authUser.uid,
        id: authUser.uid,
        email: authUser.email,
        name: authUser.displayName || fullName,
        displayName: authUser.displayName || fullName,
        photoURL: authUser.photoURL,
        avatar: authUser.photoURL || null,
        emailVerified: authUser.emailVerified ?? true,
        role: claims.role || role,
        claims,
        token: tokenResult?.token,
        joinedDate: new Date().toISOString().split('T')[0]
      };

      setCurrentUser(registeredUser);
      setTokenClaims(claims);

      return registeredUser;
    } catch (error) {
      console.error('Registration error:', error);
      let message = error.message || 'Registration failed.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already registered. Please log in instead.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak. Please use at least 8 characters.';
      }
      setAuthError(message);
      throw new Error(message);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await FirebaseService.signOut();
      setCurrentUser(null);
      setTokenClaims(null);

      localStorage.removeItem('biotrajectory-doctor-user');

      return true;
    } catch (error) {
      setAuthError(error.message || 'Logout failed.');
      return false;
    }
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
