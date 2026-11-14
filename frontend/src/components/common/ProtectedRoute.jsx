import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth, USER_ROLES, getDashboardPath } from '../../context/AuthContext';

/**
 * ProtectedRoute Guard
 * 
 * Enforces:
 * 1. Authentication requirement.
 * 2. Trusted custom claims role matching (USER, DOCTOR, ADMIN).
 * 3. Automatic redirects for DOCTOR_PENDING and DOCTOR_SUSPENDED states.
 * 4. Cross-role boundary defense (Users cannot access Admin or Doctor portals).
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const { isAuthenticated, currentUser, isAuthLoading } = useAuth();
  const location = useLocation();

  // Do not redirect while auth state is still resolving. This avoids false
  // landing-page redirects during initial app hydration or refresh.
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8FC] dark:bg-[#070B14] text-slate-500 dark:text-slate-400 text-sm font-medium">
        Loading your workspace…
      </div>
    );
  }

  // 1. Not Authenticated -> Redirect to unified /login
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = currentUser.role || USER_ROLES.UNKNOWN;

  // 2. Pending Doctor State Check
  if (userRole === USER_ROLES.DOCTOR_PENDING && location.pathname !== '/doctor/pending') {
    return <Navigate to="/doctor/pending" replace />;
  }

  // 3. Suspended Doctor State Check
  if (userRole === USER_ROLES.DOCTOR_SUSPENDED && location.pathname !== '/doctor/suspended') {
    return <Navigate to="/doctor/suspended" replace />;
  }

  // 4. Unknown Role Check
  if (userRole === USER_ROLES.UNKNOWN && location.pathname !== '/account-setup') {
    return <Navigate to="/account-setup" replace />;
  }

  // 5. Role Authorization Check
  if (allowedRoles && allowedRoles.length > 0) {
    const isAuthorized = allowedRoles.includes(userRole) ||
      (allowedRoles.includes('DOCTOR') && (userRole === 'DOCTOR' || userRole === 'DOCTOR_VERIFIED'));

    if (!isAuthorized) {
      // Divert to the user's authentic authorized workspace
      const authorizedDashboard = getDashboardPath(userRole);
      return <Navigate to={authorizedDashboard} replace />;
    }
  }

  return children ? children : <Outlet />;
}
