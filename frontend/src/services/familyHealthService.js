// Family Health Access & 1-Click Approval Service for BioTrajectory Patient Section

const STORAGE_KEY = 'bt_family_health_members';
const ACTIVE_PROFILE_KEY = 'bt_active_family_profile_id';
const EVENT_NAME = 'bt_family_health_changed';

export const DEFAULT_FAMILY_MEMBERS = [
  {
    id: 'fam-robert-01',
    name: 'Robert Johnson',
    relationship: 'Father',
    relationshipHi: 'पिता',
    age: 68,
    gender: 'Male',
    genderHi: 'पुरुष',
    bloodGroup: 'B+',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    status: 'approved', // 'approved' | 'pending' | 'revoked'
    approvalDate: 'Nov 14, 2026',
    approvalToken: 'BT-FAM-AUTH-88210',
    approvalType: '1-Click Instant Consent',
    approvalTypeHi: '1-क्लिक त्वरित सहमति',
    primaryCondition: 'Type 2 Diabetes (Managed)',
    conditionStage: 'Mild Stable',
    riskLevel: 'moderate', // 'low' | 'moderate' | 'high'
    isDanger: false,
    phone: '+1 (555) 789-2341',
    emergencyContact: 'Alex Johnson (Son) - +1 (555) 234-5678',
    allergies: ['Penicillin', 'Sulfa drugs'],
    latestVitals: {
      bp: '128/82',
      bpStatus: 'Normal Controlled',
      hr: 74,
      hrStatus: 'Resting Normal',
      spo2: 97,
      glucose: 118,
      glucoseStatus: 'Fasting Optimal',
      steps: 5420,
      recordedAt: 'Today, 8:30 AM'
    },
    urineAnalysis: {
      protein: 'Negative',
      glucose: 'Normal (Negative)',
      specificGravity: '1.018',
      pH: '6.5',
      leukocytes: 'Negative',
      ketones: 'Negative',
      lastTested: 'Yesterday, Morning Void'
    },
    medications: [
      { name: 'Metformin 500mg', dosage: '1 tablet twice daily with meals', status: 'Active' },
      { name: 'Amlodipine 5mg', dosage: '1 tablet once daily in morning', status: 'Active' }
    ],
    recentConsultations: [
      { doctor: 'Dr. Sarah Patel', specialty: 'General Internal Medicine', date: 'Nov 02, 2026', notes: 'Fasting blood glucose stable. Kidney microalbumin within clinical boundaries.' }
    ]
  },
  {
    id: 'fam-sarah-02',
    name: 'Sarah Johnson',
    relationship: 'Spouse',
    relationshipHi: 'पत्नी',
    age: 38,
    gender: 'Female',
    genderHi: 'महिला',
    bloodGroup: 'A+',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    status: 'pending', // Pending 1-Click approval to showcase easy 1-click access
    approvalDate: null,
    approvalToken: 'BT-REQ-PENDING-44912',
    approvalType: 'Awaiting 1-Click Authorization',
    approvalTypeHi: '1-क्लिक स्वीकृति की प्रतीक्षा',
    primaryCondition: 'Migraine History (Faced/Resolved)',
    conditionStage: 'Resolved',
    riskLevel: 'low',
    isDanger: false,
    phone: '+1 (555) 345-6789',
    emergencyContact: 'Alex Johnson (Husband)',
    allergies: ['None reported'],
    latestVitals: {
      bp: '116/76',
      bpStatus: 'Optimal Safe',
      hr: 68,
      hrStatus: 'Resting Optimal',
      spo2: 99,
      glucose: 92,
      glucoseStatus: 'Optimal',
      steps: 7850,
      recordedAt: 'Today, 9:15 AM'
    },
    urineAnalysis: {
      protein: 'Negative',
      glucose: 'Negative',
      specificGravity: '1.020',
      pH: '6.0',
      leukocytes: 'Negative',
      ketones: 'Negative',
      lastTested: 'Nov 16, 2026'
    },
    medications: [
      { name: 'Magnesium Glycinate 400mg', dosage: '1 capsule at bedtime', status: 'Active' }
    ],
    recentConsultations: [
      { doctor: 'Dr. Michael Chen', specialty: 'Neurology', date: 'Oct 15, 2026', notes: 'Neurological examination unremarkable. Stress reduction effective.' }
    ]
  },
  {
    id: 'fam-emma-03',
    name: 'Emma Johnson',
    relationship: 'Daughter',
    relationshipHi: 'पुत्री',
    age: 12,
    gender: 'Female',
    genderHi: 'महिला',
    bloodGroup: 'O+',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    status: 'approved',
    approvalDate: 'Nov 10, 2026',
    approvalToken: 'BT-FAM-GUARDIAN-10294',
    approvalType: 'Parental Guardian 1-Click Consent',
    approvalTypeHi: 'अभिभावक 1-क्लिक सहमति',
    primaryCondition: 'Mild Seasonal Asthma (Well-controlled)',
    conditionStage: 'Mild Intermittent',
    riskLevel: 'low',
    isDanger: false,
    phone: 'Parent Contact: +1 (555) 234-5678',
    emergencyContact: 'Alex & Sarah Johnson (Parents)',
    allergies: ['Dust mites', 'Pollen'],
    latestVitals: {
      bp: '104/68',
      bpStatus: 'Normal Pediatric',
      hr: 82,
      hrStatus: 'Healthy Active',
      spo2: 99,
      glucose: 88,
      glucoseStatus: 'Optimal',
      steps: 9210,
      recordedAt: 'Yesterday, 6:00 PM'
    },
    urineAnalysis: {
      protein: 'Negative',
      glucose: 'Negative',
      specificGravity: '1.015',
      pH: '6.5',
      leukocytes: 'Negative',
      ketones: 'Negative',
      lastTested: 'Nov 12, 2026'
    },
    medications: [
      { name: 'Albuterol Inhaler (PRN)', dosage: '1-2 puffs as needed before intense athletics', status: 'As Needed' }
    ],
    recentConsultations: [
      { doctor: 'Dr. Amanda Ray', specialty: 'Pediatrics', date: 'Sep 24, 2026', notes: 'Annual pediatric health trajectory optimal. Growth curve at 65th percentile.' }
    ]
  }
];

export const familyHealthService = {
  // Get all family members with persistent local storage
  getMembers: () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load family members from storage:', e);
    }
    return DEFAULT_FAMILY_MEMBERS;
  },

  // Save members list to local storage and broadcast event
  saveMembers: (members) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_NAME));
      }
    } catch (e) {
      console.error('Failed to save family members:', e);
    }
  },

  // 1-Click Instant Approval Function
  approveMemberAccess: (memberId) => {
    const list = familyHealthService.getMembers();
    const updated = list.map((m) => {
      if (m.id === memberId) {
        return {
          ...m,
          status: 'approved',
          approvalDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          approvalToken: `BT-FAM-1CLICK-${Math.floor(10000 + Math.random() * 90000)}`,
          approvalType: '1-Click Instant Consent Granted'
        };
      }
      return m;
    });
    familyHealthService.saveMembers(updated);
    return updated;
  },

  // Revoke Access
  revokeMemberAccess: (memberId) => {
    const list = familyHealthService.getMembers();
    const updated = list.map((m) => {
      if (m.id === memberId) {
        return {
          ...m,
          status: 'revoked',
          approvalDate: null,
          approvalToken: null
        };
      }
      return m;
    });
    familyHealthService.saveMembers(updated);

    // If currently viewing revoked profile, switch back to self
    const activeId = familyHealthService.getActiveProfileId();
    if (activeId === memberId) {
      familyHealthService.setActiveProfileId(null);
    }
    return updated;
  },

  // Add a new family member
  addMember: (data) => {
    const list = familyHealthService.getMembers();
    const newMember = {
      id: `fam-${Date.now()}`,
      name: data.name.trim(),
      relationship: data.relationship || 'Family Member',
      relationshipHi: data.relationshipHi || data.relationship || 'परिवार के सदस्य',
      age: Number(data.age) || 30,
      gender: data.gender || 'Not specified',
      genderHi: data.gender === 'Male' ? 'पुरुष' : data.gender === 'Female' ? 'महिला' : 'अन्य',
      bloodGroup: data.bloodGroup || 'O+',
      avatar: data.avatar || `https://images.unsplash.com/photo-${data.gender === 'Female' ? '1544005313-94ddf0286df2' : '1500648767791-00dcc994a43e'}?auto=format&fit=crop&w=256&q=80`,
      status: data.instantApproval ? 'approved' : 'pending',
      approvalDate: data.instantApproval ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : null,
      approvalToken: data.instantApproval ? `BT-FAM-AUTH-${Math.floor(10000 + Math.random() * 90000)}` : `BT-REQ-PENDING-${Math.floor(10000 + Math.random() * 90000)}`,
      approvalType: data.instantApproval ? '1-Click Instant Consent' : 'Awaiting 1-Click Authorization',
      primaryCondition: data.primaryCondition || 'General Health Tracking',
      conditionStage: data.conditionStage || 'Active',
      riskLevel: data.riskLevel || 'low',
      isDanger: Boolean(data.isDanger),
      phone: data.phone || '+1 (555) 000-0000',
      emergencyContact: data.emergencyContact || 'Alex Johnson',
      allergies: data.allergies ? data.allergies.split(',').map(s => s.trim()) : ['None reported'],
      latestVitals: {
        bp: data.bp || '120/80',
        bpStatus: 'Optimal',
        hr: Number(data.hr) || 72,
        hrStatus: 'Resting Normal',
        spo2: Number(data.spo2) || 98,
        glucose: Number(data.glucose) || 95,
        glucoseStatus: 'Optimal',
        steps: Number(data.steps) || 6500,
        recordedAt: 'Today'
      },
      urineAnalysis: {
        protein: 'Negative',
        glucose: 'Negative',
        specificGravity: '1.018',
        pH: '6.5',
        leukocytes: 'Negative',
        ketones: 'Negative',
        lastTested: 'Recent'
      },
      medications: data.medications ? [{ name: data.medications, dosage: 'As prescribed', status: 'Active' }] : [],
      recentConsultations: []
    };

    const updated = [newMember, ...list];
    familyHealthService.saveMembers(updated);
    return newMember;
  },

  // Delete family member
  deleteMember: (memberId) => {
    const list = familyHealthService.getMembers();
    const updated = list.filter((m) => m.id !== memberId);
    familyHealthService.saveMembers(updated);

    const activeId = familyHealthService.getActiveProfileId();
    if (activeId === memberId) {
      familyHealthService.setActiveProfileId(null);
    }
    return updated;
  },

  // Active Family Profile Switcher (null means primary user Alex Johnson)
  getActiveProfileId: () => {
    try {
      return localStorage.getItem(ACTIVE_PROFILE_KEY) || null;
    } catch {
      return null;
    }
  },

  setActiveProfileId: (idOrNull) => {
    try {
      if (idOrNull) {
        localStorage.setItem(ACTIVE_PROFILE_KEY, idOrNull);
      } else {
        localStorage.removeItem(ACTIVE_PROFILE_KEY);
      }
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(EVENT_NAME));
      }
    } catch (e) {
      console.error('Failed to set active profile id:', e);
    }
  },

  // Realtime subscription listener
  subscribe: (callback) => {
    if (typeof window === 'undefined') return () => {};
    const handler = () => {
      callback(familyHealthService.getMembers(), familyHealthService.getActiveProfileId());
    };
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  }
};
