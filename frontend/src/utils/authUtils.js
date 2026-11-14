import { ROLES } from '../services/firebase';

export const getDashboardPath = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return '/admin/dashboard';

    case ROLES.DOCTOR:
      return '/doctor/dashboard';

    case ROLES.DOCTOR_PENDING:
      return '/doctor/pending';

    case ROLES.DOCTOR_SUSPENDED:
      return '/doctor/suspended';

    case ROLES.UNKNOWN:
      return '/account-setup';

    case ROLES.USER:
    default:
      return '/dashboard';
  }
};