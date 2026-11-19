
import React from 'react';

import {
  Navigate,
  useLocation,
  Outlet
} from 'react-router-dom';

import {
  useAuth,
  USER_ROLES,
  getDashboardPath
} from '../../context/AuthContext';

// --------------------------------------------------
// Only backend-supported application roles
// --------------------------------------------------

const VALID_ROLES = new Set([
  'USER',
  'DOCTOR_PENDING',
  'DOCTOR',
  'DOCTOR_SUSPENDED',
  'ADMIN'
]);

// --------------------------------------------------
// Loading screen
// --------------------------------------------------

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F0E4] dark:bg-[#1F150E]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-9 h-9 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />

        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Verifying your account...
        </span>
      </div>
    </div>
  );
}

// --------------------------------------------------
// Protected route
// --------------------------------------------------

export default function ProtectedRoute({
  allowedRoles = [],
  children
}) {
  const {
    isAuthenticated,
    currentUser,
    isAuthLoading
  } = useAuth();

  const location = useLocation();

  // 1. Wait for Firebase authentication to resolve.
  if (isAuthLoading) {
    return <AuthLoadingScreen />;
  }

  // 2. Require authentication.
  if (!isAuthenticated || !currentUser) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // 3. Read the role supplied by the authenticated context.
  const userRole = currentUser.role;

  // 4. Unknown or unsupported role.
  if (!VALID_ROLES.has(userRole)) {
    return (
      <Navigate
        to="/account-setup"
        replace
      />
    );
  }

  // 5. Pending doctors can only access their application status.
  if (userRole === USER_ROLES.DOCTOR_PENDING) {
    if (location.pathname !== '/doctor/pending') {
      return (
        <Navigate
          to="/doctor/pending"
          replace
        />
      );
    }
  }

  // 6. Suspended doctors can only access their suspension page.
  if (userRole === USER_ROLES.DOCTOR_SUSPENDED) {
    if (location.pathname !== '/doctor/suspended') {
      return (
        <Navigate
          to="/doctor/suspended"
          replace
        />
      );
    }
  }

  // 7. Verify access to the requested workspace.
  if (
    Array.isArray(allowedRoles) &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(userRole)
  ) {
    // System Administrators have supervisory review access to Doctor and User workspaces
    if (userRole === USER_ROLES.ADMIN) {
      return children || <Outlet />;
    }

    const dashboard = getDashboardPath(userRole);

    return (
      <Navigate
        to={dashboard || '/account-setup'}
        replace
      />
    );
  }

  // 8. Render the authorized route.
  return children || <Outlet />;
}
