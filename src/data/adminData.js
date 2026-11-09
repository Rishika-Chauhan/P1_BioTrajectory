/**
 * BioTrajectory Admin Governance & Population Analytics Dataset
 * 
 * STRICT PRIVACY AUDIT:
 * 1. Admin accounts have ZERO access to private patient medical charts or AI chats.
 * 2. All analytics are k-anonymized aggregate cohorts (minimum group threshold n >= 50).
 * 3. Individual encryption keys are client-held; system administrators cannot decrypt records.
 */

export const ADMIN_METRICS = {
  totalUsers: 24850,
  activeUsers: 18420,
  diseaseCatalogEntries: 142,
  openWebsiteReports: 12,
  uptimePercentage: '99.99%',
  scansProcessedWeekly: 14200
};

export const ADMIN_USER_ACCOUNTS = [
  {
    id: 'usr_88291',
    name: 'Pranjal Sharma',
    email: 'pranjal@biotrajectory.health',
    role: 'Patient',
    status: 'Active',
    registeredDate: '2025-01-15',
    lastActive: 'Just now',
    twoFactorEnabled: true,
    privacyTier: 'Zero-Knowledge E2EE'
  },
  {
    id: 'usr_77102',
    name: 'Claire Dupont',
    email: 'claire.d@horizon.org',
    role: 'Patient',
    status: 'Active',
    registeredDate: '2025-03-22',
    lastActive: '2 hours ago',
    twoFactorEnabled: true,
    privacyTier: 'Zero-Knowledge E2EE'
  },
  {
    id: 'usr_66219',
    name: 'Liam O’Connor',
    email: 'liam.oc@celtic-health.ie',
    role: 'Patient',
    status: 'Active',
    registeredDate: '2025-04-10',
    lastActive: '1 day ago',
    twoFactorEnabled: false,
    privacyTier: 'Zero-Knowledge E2EE'
  },
  {
    id: 'usr_55140',
    name: 'Dr. Aris Thorne',
    email: 'thorne@cardio-institute.med',
    role: 'Doctor',
    status: 'Active',
    registeredDate: '2024-11-05',
    lastActive: '30 mins ago',
    twoFactorEnabled: true,
    privacyTier: 'Verified Clinical Provider'
  },
  {
    id: 'usr_44018',
    name: 'Sophia Lindqvist',
    email: 'sophia.l@nordic-longevity.se',
    role: 'Patient',
    status: 'Suspended',
    registeredDate: '2025-02-18',
    lastActive: '5 days ago',
    twoFactorEnabled: false,
    privacyTier: 'Zero-Knowledge E2EE'
  },
  {
    id: 'usr_00001',
    name: 'Dr. Sarah Vance',
    email: 'admin@biotrajectory.health',
    role: 'Administrator',
    status: 'Active',
    registeredDate: '2024-03-01',
    lastActive: 'Now',
    twoFactorEnabled: true,
    privacyTier: 'Audited System Operator'
  }
];

export const MONTHLY_USER_GROWTH = [
  { month: 'May', totalUsers: 14200, activeUsers: 11200 },
  { month: 'Jun', totalUsers: 16100, activeUsers: 12800 },
  { month: 'Jul', totalUsers: 18400, activeUsers: 14100 },
  { month: 'Aug', totalUsers: 20300, activeUsers: 15600 },
  { month: 'Sep', totalUsers: 22100, activeUsers: 16900 },
  { month: 'Oct', totalUsers: 23600, activeUsers: 17800 },
  { month: 'Nov', totalUsers: 24850, activeUsers: 18420 }
];

export const POPULATION_DISEASE_AGGREGATE = [
  { category: 'Cardiovascular Risk', cohortPercent: 32, label: 'Elevated Arterial Velocity / Pre-HTN' },
  { category: 'Metabolic Dysregulation', cohortPercent: 26, label: 'Glycemic Variance / Pre-Diabetes' },
  { category: 'Renal Permeability', cohortPercent: 12, label: 'Intermittent Microalbuminuria' },
  { category: 'Respiratory / Asthma', cohortPercent: 14, label: 'Airway Hyperreactivity' },
  { category: 'Optimal Baseline', cohortPercent: 16, label: 'Homeostatic Balance across markers' }
];

export const POPULATION_AGE_DISTRIBUTION = [
  { ageGroup: '18-29', percentage: 22, activeTrackingRate: 78 },
  { ageGroup: '30-44', percentage: 38, activeTrackingRate: 86 },
  { ageGroup: '45-59', percentage: 27, activeTrackingRate: 91 },
  { ageGroup: '60+', percentage: 13, activeTrackingRate: 94 }
];

export const SYSTEM_WEBSITE_REPORTS = [
  {
    id: 'rep_101',
    type: 'Bug Report',
    priority: 'Medium',
    status: 'In Review',
    submittedDate: '2026-11-06',
    title: 'Camera optical auto-focus delay on low-light urinalysis scan',
    reporter: 'usr_77102 (Anonymous Token)',
    notes: 'Investigating exposure compensation algorithm for Android 15 webview.'
  },
  {
    id: 'rep_102',
    type: 'Feature Request',
    priority: 'Low',
    status: 'Backlog',
    submittedDate: '2026-11-05',
    title: 'Request Apple Watch HealthKit background step sync webhook',
    reporter: 'usr_66219 (Anonymous Token)',
    notes: 'Drafting HealthKit REST sync adapter for Phase 4.'
  },
  {
    id: 'rep_103',
    type: 'Security Audit',
    priority: 'High',
    status: 'Resolved',
    submittedDate: '2026-11-02',
    title: 'Automated quarterly penetration test on zero-knowledge QR routing',
    reporter: 'Internal SecOps',
    notes: 'Passed 100%. No unencrypted patient identifier leakage detected.'
  }
];

export const PLATFORM_FEEDBACK = [
  {
    id: 'fb_01',
    rating: 5,
    user: 'Community Member #481',
    comment: 'Seeing my blood pressure trend alongside my daily walking steps helped me understand my evening readings so clearly!',
    date: '2026-11-04',
    status: 'Approved'
  },
  {
    id: 'fb_02',
    rating: 5,
    user: 'Community Member #290',
    comment: 'The QR profile was so helpful during my urgent clinic visit. I shared only my emergency vitals with one tap.',
    date: '2026-11-03',
    status: 'Approved'
  },
  {
    id: 'fb_03',
    rating: 4,
    user: 'Community Member #912',
    comment: 'The separate charts for systolic and diastolic blood pressure are so much better than confusing combined scores.',
    date: '2026-10-29',
    status: 'Approved'
  }
];
