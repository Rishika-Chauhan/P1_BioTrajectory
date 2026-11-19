import React, { useState, useEffect } from 'react';
import {
  Users,
  Heart,
  Activity,
  Droplet,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Trash2,
  Zap,
  Eye,
  ArrowRight,
  UserCheck,
  FileText,
  Stethoscope,
  X,
  Phone,
  RefreshCw,
  Lock,
  ChevronRight,
  Sparkles,
  Pill
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { familyHealthService } from '../../services/familyHealthService';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function FamilyHealthPage() {
  const { isHindi } = useLanguage();
  const { currentUser } = useAuth();

  const [members, setMembers] = useState(() => familyHealthService.getMembers());
  const [activeProfileId, setActiveProfileId] = useState(() => familyHealthService.getActiveProfileId());
  const [filter, setFilter] = useState('all'); // 'all', 'approved', 'pending'
  const [selectedMemberModal, setSelectedMemberModal] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isApprovingId, setIsApprovingId] = useState(null);

  // New Member Form State
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: 'Parent',
    relationshipHi: 'माता/पिता',
    age: '',
    gender: 'Male',
    bloodGroup: 'O+',
    primaryCondition: '',
    conditionStage: 'Mild',
    instantApproval: true,
    phone: '',
    allergies: '',
    medications: ''
  });

  useEffect(() => {
    const unsub = familyHealthService.subscribe((updatedMembers, activeId) => {
      setMembers(updatedMembers);
      setActiveProfileId(activeId);
    });
    return unsub;
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // 1-Click Instant Approval Handler
  const handleOneClickApproval = (memberId, memberName) => {
    setIsApprovingId(memberId);
    setTimeout(() => {
      const updated = familyHealthService.approveMemberAccess(memberId);
      setMembers(updated);
      setIsApprovingId(null);
      showToast(
        isHindi
          ? `✓ 1-क्लिक स्वीकृति सफल! ${memberName} का स्वास्थ्य डेटा अब सक्रिय है।`
          : `✓ 1-Click Approval Granted! You can now seamlessly access ${memberName}'s health data.`
      );
    }, 450);
  };

  // Revoke Access Handler
  const handleRevokeAccess = (memberId, memberName) => {
    const updated = familyHealthService.revokeMemberAccess(memberId);
    setMembers(updated);
    showToast(
      isHindi
        ? `${memberName} का डेटा एक्सेस निरस्त (Revoked) कर दिया गया है।`
        : `Health data access for ${memberName} has been revoked.`
    );
  };

  // Switch Active Profile
  const handleSwitchProfile = (memberId, memberName) => {
    if (activeProfileId === memberId) {
      familyHealthService.setActiveProfileId(null);
      showToast(isHindi ? 'वापस अपने प्रोफाइल पर स्विच किया गया।' : 'Switched back to your personal health record (Alex Johnson).');
    } else {
      familyHealthService.setActiveProfileId(memberId);
      showToast(
        isHindi
          ? `सफलतापूर्वक ${memberName} के प्रोफाइल पर स्विच किया गया!`
          : `Active dashboard switched to ${memberName}'s health record!`
      );
    }
  };

  // Add Family Member Handler
  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;

    familyHealthService.addMember(newMember);
    setShowAddModal(false);
    showToast(
      isHindi
        ? `परिवार के नए सदस्य (${newMember.name}) को सफलतापूर्वक जोड़ा गया!`
        : `Family member (${newMember.name}) added successfully with 1-click access!`
    );
    setNewMember({
      name: '',
      relationship: 'Parent',
      relationshipHi: 'माता/पिता',
      age: '',
      gender: 'Male',
      bloodGroup: 'O+',
      primaryCondition: '',
      conditionStage: 'Mild',
      instantApproval: true,
      phone: '',
      allergies: '',
      medications: ''
    });
  };

  // Delete Member
  const handleDeleteMember = (memberId, name) => {
    const updated = familyHealthService.deleteMember(memberId);
    setMembers(updated);
    showToast(`${name} removed from your Family Circle.`);
  };

  const filteredMembers = members.filter((m) => {
    if (filter === 'approved') return m.status === 'approved';
    if (filter === 'pending') return m.status === 'pending';
    return true;
  });

  const activeFamilyMember = members.find((m) => m.id === activeProfileId);
  const pendingCount = members.filter((m) => m.status === 'pending').length;
  const approvedCount = members.filter((m) => m.status === 'approved').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      <DisclaimerBanner />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1F150E] text-[#F6F0E4] border border-[#A9D6F5]/40 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#A9D6F5]/20 border border-[#A9D6F5]/40 flex items-center justify-center text-[#2672A8] dark:text-[#A9D6F5]">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isHindi ? 'परिवार स्वास्थ्य मंडल (Family Health Circle)' : 'Family Health Circle'}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            {isHindi
              ? 'आसानी से अपने माता-पिता, जीवनसाथी और बच्चों के स्वास्थ्य रुझान और वाइटल्स देखें — केवल 1 स्वीकृति (1-Click Approval) के साथ।'
              : 'Easily monitor, access, and protect your loved ones\' longitudinal health records and vital trajectories with seamless 1-Click Approval.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#A9D6F5] hover:bg-[#7CBFEA] text-[#1F150E] font-black text-sm transition-all shadow-md shadow-[#A9D6F5]/20 cursor-pointer self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{isHindi ? '+ परिवार सदस्य जोड़ें' : '+ Add Family Member'}</span>
        </button>
      </div>

      {/* Active Family Profile Switcher Alert Banner */}
      {activeFamilyMember && (
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-600/15 via-cyan-600/10 to-blue-600/5 border-2 border-blue-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-blue-500/10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-blue-500/30 shrink-0">
              <img src={activeFamilyMember.avatar} alt={activeFamilyMember.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-blue-600 text-white">
                  {isHindi ? 'सक्रिय परिवार प्रोफ़ाइल' : 'Active Family View'}
                </span>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                  {activeFamilyMember.relationship} • {activeFamilyMember.age} yrs
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                {isHindi ? `आप वर्तमान में ${activeFamilyMember.name} का स्वास्थ्य रिकॉर्ड देख रहे हैं` : `You are viewing ${activeFamilyMember.name}'s Health Records`}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleSwitchProfile(activeFamilyMember.id, activeFamilyMember.name)}
            className="px-4 py-2.5 rounded-2xl bg-white dark:bg-[#1F150E] border border-blue-500/40 text-blue-700 dark:text-blue-300 font-bold text-xs sm:text-sm hover:bg-blue-50 dark:hover:bg-[#2B1E15] transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            {isHindi ? 'वापस अपने रिकॉर्ड पर जाएं (Alex Johnson)' : 'Switch Back to My Record (Alex Johnson)'}
          </button>
        </div>
      )}

      {/* Quick Summary Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{isHindi ? 'कुल सदस्य' : 'Family Members'}</span>
            <Users className="w-4 h-4 text-[#2672A8] dark:text-[#A9D6F5]" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{members.length}</p>
          <span className="text-[11px] text-slate-500 font-medium">{isHindi ? 'परिवार मंडल में दर्ज' : 'Enrolled in Health Circle'}</span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <span>{isHindi ? 'सक्रिय 1-क्लिक एक्सेस' : 'Approved & Active'}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-950 dark:text-emerald-100">{approvedCount}</p>
          <span className="text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">{isHindi ? 'पूर्ण डेटा सुलभ' : 'Full Telemetry Access'}</span>
        </div>

        <div className={`p-4 sm:p-5 rounded-3xl border shadow-xs space-y-1 transition-all ${
          pendingCount > 0
            ? 'bg-amber-500/15 border-amber-500/40 ring-1 ring-amber-500/20'
            : 'bg-white dark:bg-[#1F150E] border-[#E8DFD1] dark:border-[#4A3525]'
        }`}>
          <div className="flex items-center justify-between text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <span>{isHindi ? 'लंबित 1-स्वीकृति' : 'Pending 1-Click'}</span>
            <Zap className="w-4 h-4 text-amber-600 animate-pulse" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-950 dark:text-amber-100">{pendingCount}</p>
          <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold">
            {pendingCount > 0 ? (isHindi ? 'तुरंत 1-क्लिक करें' : '1 Click to grant access') : (isHindi ? 'सभी स्वीकृत' : 'All Approved')}
          </span>
        </div>

        <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider">
            <span>{isHindi ? 'दैनिक वाइटल सिंक' : 'Biometric Sync'}</span>
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Live</p>
          <span className="text-[11px] text-emerald-600 font-semibold">✓ {isHindi ? 'क्लीनिकल ट्रैजेक्टरी सक्रिय' : 'Longitudinal Active'}</span>
        </div>
      </div>

      {/* Pending 1-Click Approvals Highlight Section */}
      {pendingCount > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/5 border-2 border-amber-500/50 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200">
            <Zap className="w-5 h-5 text-amber-600 shrink-0" />
            <h3 className="font-extrabold text-base sm:text-lg">
              {isHindi ? 'त्वरित 1-क्लिक एक्सेस अनुरोध (Action Required: 1-Click Approval)' : 'Pending Family Health Data Access: 1-Click Approval Ready'}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-amber-900/80 dark:text-amber-200/90 leading-relaxed">
            {isHindi
              ? 'आपके परिवार के सदस्य ने अपना स्वास्थ्य रिकॉर्ड साझा करने की अनुमति मांगी है। केवल 1 क्लिक में तत्काल एक्सेस सक्षम करें:'
              : 'A family member is waiting for your authorization. Simply tap the 1-Click Approval button to immediately unlock their live vitals and health trajectory.'}
          </p>

          <div className="space-y-3 pt-1">
            {members.filter(m => m.status === 'pending').map(member => (
              <div
                key={member.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#1F150E] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-500/40 shrink-0">
                    <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                      {member.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {member.relationship} • {member.age} yrs • Token: <span className="font-mono text-amber-600">{member.approvalToken}</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isApprovingId === member.id}
                  onClick={() => handleOneClickApproval(member.id, member.name)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  {isApprovingId === member.id ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Zap className="w-4 h-4 text-amber-300" />
                  )}
                  <span>{isApprovingId === member.id ? 'Granting...' : isHindi ? '⚡ 1-क्लिक तुरंत स्वीकृति दें' : '⚡ 1-Click Approve Access'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DFD1] dark:border-[#4A3525] pb-3 text-xs sm:text-sm font-bold">
        {[
          { id: 'all', label: isHindi ? `सभी सदस्य (${members.length})` : `All Members (${members.length})` },
          { id: 'approved', label: isHindi ? `स्वीकृत एवं सक्रिय (${approvedCount})` : `Approved & Active (${approvedCount})` },
          { id: 'pending', label: isHindi ? `लंबित स्वीकृति (${pendingCount})` : `Pending Approval (${pendingCount})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
              filter === tab.id
                ? 'bg-[#A9D6F5] text-[#1F150E] font-black shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:bg-[#F6F0E4] dark:hover:bg-[#1F150E]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Family Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => {
          const isApproved = member.status === 'approved';
          const isPending = member.status === 'pending';
          const isCurrentlyActive = activeProfileId === member.id;

          return (
            <div
              key={member.id}
              className={`p-6 rounded-3xl border transition-all space-y-4 relative flex flex-col justify-between ${
                isCurrentlyActive
                  ? 'bg-blue-500/10 dark:bg-blue-950/30 border-blue-500 shadow-md ring-2 ring-blue-500/20'
                  : isApproved
                  ? 'bg-white dark:bg-[#1F150E] border-[#E8DFD1] dark:border-[#4A3525] shadow-xs hover:border-[#A9D6F5]'
                  : 'bg-amber-500/5 dark:bg-[#1F150E] border-amber-500/30'
              }`}
            >
              {/* Header: Photo, Name, Relationship, Status */}
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#A9D6F5]/50 shrink-0 shadow-xs">
                      <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-[#A9D6F5]/20 text-[#2672A8] dark:text-[#A9D6F5]">
                          {isHindi ? member.relationshipHi : member.relationship}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                          {member.age} yrs • {member.bloodGroup}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate mt-0.5">
                        {member.name}
                      </h3>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteMember(member.id, member.name)}
                    className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors cursor-pointer"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* 1-Click Access Status Pill */}
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                    {isHindi ? '1-क्लिक एक्सेस स्थिति:' : '1-Click Access:'}
                  </span>
                  {isApproved ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-extrabold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'सक्रिय एवं स्वीकृत' : 'Active & Approved'}</span>
                    </span>
                  ) : isPending ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 font-extrabold text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'स्वीकृति प्रतीक्षित' : 'Approval Pending'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-800 dark:text-rose-300 font-extrabold text-[11px]">
                      <X className="w-3.5 h-3.5" />
                      <span>{isHindi ? 'पहुंच निरस्त' : 'Access Revoked'}</span>
                    </span>
                  )}
                </div>

                {/* Clinical Condition Pill */}
                <div className="p-3 rounded-2xl bg-[#F6F0E4]/60 dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                    {isHindi ? 'प्राथमिक स्वास्थ्य स्थिति' : 'Active Clinical Condition'}
                  </span>
                  <div className="flex items-center justify-between">
                    <p className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      {member.primaryCondition}
                    </p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#A9D6F5]/30 text-slate-800 dark:text-white">
                      {member.conditionStage}
                    </span>
                  </div>
                </div>

                {/* Live Vitals Snapshot */}
                {isApproved ? (
                  <div className="grid grid-cols-2 gap-2 text-center pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Blood Pressure</span>
                      <p className="font-black text-sm text-slate-900 dark:text-white mt-0.5">{member.latestVitals.bp}</p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{member.latestVitals.bpStatus}</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase">Heart Rate</span>
                      <p className="font-black text-sm text-slate-900 dark:text-white mt-0.5">{member.latestVitals.hr} bpm</p>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{member.latestVitals.hrStatus}</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-dashed border-amber-500/40 text-center space-y-1">
                    <Lock className="w-5 h-5 text-amber-600 mx-auto" />
                    <p className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      {isHindi ? 'डेटा 1-स्वीकृति के बाद अनलॉक होगा' : 'Data Locked Until 1-Click Approval'}
                    </p>
                    <p className="text-[10px] text-amber-800/80 dark:text-amber-300/80">
                      {isHindi ? 'नीचे दिए गए बटन पर टैप करें।' : 'Tap below to grant access immediately.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#E8DFD1] dark:border-[#4A3525] space-y-2">
                {isApproved ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMemberModal(member)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#A9D6F5] hover:bg-[#7CBFEA] text-[#1F150E] font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{isHindi ? 'पूर्ण स्वास्थ्य डेटा एवं यूरिन टेस्ट देखें' : 'View Full Health Data & Tests'}</span>
                    </button>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <button
                        type="button"
                        onClick={() => handleSwitchProfile(member.id, member.name)}
                        className="text-xs font-bold text-[#2672A8] dark:text-[#A9D6F5] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>{isCurrentlyActive ? '✓ Active Dashboard' : 'Switch Dashboard to Member'}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRevokeAccess(member.id, member.name)}
                        className="text-[11px] font-semibold text-rose-500 hover:underline cursor-pointer"
                      >
                        {isHindi ? 'पहुंच निरस्त करें' : 'Revoke 1-Click'}
                      </button>
                    </div>
                  </div>
                ) : isPending ? (
                  <button
                    type="button"
                    disabled={isApprovingId === member.id}
                    onClick={() => handleOneClickApproval(member.id, member.name)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
                  >
                    {isApprovingId === member.id ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Zap className="w-4 h-4 text-amber-300" />
                    )}
                    <span>{isApprovingId === member.id ? 'Granting...' : isHindi ? '⚡ 1-क्लिक तुरंत स्वीकृति दें' : '⚡ 1-Click Approve Access'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOneClickApproval(member.id, member.name)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#A9D6F5] text-[#1F150E] font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'पुनः 1-स्वीकृति दें' : 'Re-Authorize Access (1-Click)'}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FULL FAMILY HEALTH DATA DEEP DIVE MODAL */}
      {selectedMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#F6F0E4] dark:bg-[#1F150E] border-2 border-[#A9D6F5] p-6 sm:p-7 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 text-slate-900 dark:text-white">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#E8DFD1] dark:border-[#4A3525]">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-[#A9D6F5]/50 shrink-0">
                  <img src={selectedMemberModal.avatar} alt={selectedMemberModal.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase px-2 py-0.5 rounded-full bg-[#A9D6F5] text-[#1F150E]">
                      {selectedMemberModal.relationship}
                    </span>
                    <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 1-Click Authorized
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold mt-0.5">
                    {selectedMemberModal.name} ({selectedMemberModal.age} yrs • {selectedMemberModal.bloodGroup})
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedMemberModal(null)}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-[#2A1D15] text-slate-500 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Vitals Telemetry Grid */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#2672A8] dark:text-[#A9D6F5] flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                <span>Live Biomarker Trajectory & Vitals</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Pressure</span>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{selectedMemberModal.latestVitals.bp}</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">{selectedMemberModal.latestVitals.bpStatus}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Heart Rate</span>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{selectedMemberModal.latestVitals.hr} bpm</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">{selectedMemberModal.latestVitals.hrStatus}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Glucose</span>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{selectedMemberModal.latestVitals.glucose} mg/dL</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">{selectedMemberModal.latestVitals.glucoseStatus}</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525]">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Blood Oxygen (SpO2)</span>
                  <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{selectedMemberModal.latestVitals.spo2} %</p>
                  <span className="text-[10px] text-emerald-600 font-semibold">Optimal</span>
                </div>
              </div>
            </div>

            {/* Urine Strip Optical Spectrophotometer Analysis */}
            <div className="space-y-2">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#2672A8] dark:text-[#A9D6F5] flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-cyan-500" />
                <span>Optical Urinalysis 10SG Biomarkers</span>
              </h4>

              <div className="p-4 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Urinary Protein</span>
                  <span className="font-extrabold text-emerald-600">{selectedMemberModal.urineAnalysis.protein}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Urine Glucose</span>
                  <span className="font-extrabold text-emerald-600">{selectedMemberModal.urineAnalysis.glucose}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Specific Gravity</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{selectedMemberModal.urineAnalysis.specificGravity}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">pH Balance</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{selectedMemberModal.urineAnalysis.pH}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Leukocytes / Esterase</span>
                  <span className="font-extrabold text-emerald-600">{selectedMemberModal.urineAnalysis.leukocytes}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Last Tested Window</span>
                  <span className="font-bold text-slate-500">{selectedMemberModal.urineAnalysis.lastTested}</span>
                </div>
              </div>
            </div>

            {/* Active Prescriptions & Medications */}
            {selectedMemberModal.medications && selectedMemberModal.medications.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#2672A8] dark:text-[#A9D6F5] flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-purple-500" />
                  <span>Active Prescriptions & Regimens</span>
                </h4>
                <div className="space-y-2">
                  {selectedMemberModal.medications.map((m, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] flex items-center justify-between text-xs">
                      <div>
                        <p className="font-extrabold text-slate-900 dark:text-white">{m.name}</p>
                        <p className="text-slate-500 text-[11px]">{m.dosage}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Doctor Care Consultation Notes */}
            {selectedMemberModal.recentConsultations && selectedMemberModal.recentConsultations.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-[#2672A8] dark:text-[#A9D6F5] flex items-center gap-1.5">
                  <Stethoscope className="w-4 h-4 text-blue-500" />
                  <span>Physician Consultation & Clinical Summary</span>
                </h4>
                {selectedMemberModal.recentConsultations.map((c, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] space-y-1 text-xs">
                    <div className="flex justify-between items-center text-slate-400">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{c.doctor} ({c.specialty})</span>
                      <span>{c.date}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{c.notes}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Footer Modal Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E8DFD1] dark:border-[#4A3525]">
              <div className="text-[11px] text-slate-500">
                1-Click Consent Token: <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">{selectedMemberModal.approvalToken}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleSwitchProfile(selectedMemberModal.id, selectedMemberModal.name);
                    setSelectedMemberModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#A9D6F5] text-[#1F150E] font-black text-xs hover:bg-[#7CBFEA] cursor-pointer"
                >
                  {isHindi ? 'इस प्रोफ़ाइल पर स्विच करें' : 'Switch Dashboard to This Member'}
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMemberModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD FAMILY MEMBER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-[#F6F0E4] dark:bg-[#1F150E] border border-[#E8DFD1] dark:border-[#4A3525] p-6 sm:p-7 shadow-2xl space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DFD1] dark:border-[#4A3525]">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#2672A8] dark:text-[#A9D6F5]" />
                <h3 className="text-lg font-extrabold">
                  {isHindi ? 'नया परिवार सदस्य जोड़ें' : 'Add Family Member'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-xl hover:bg-slate-200 dark:hover:bg-[#2A1D15] text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3.5 text-xs">
              {/* Name & Relationship */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[11px]">Full Name</label>
                  <input
                    type="text"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    placeholder="e.g. Robert Johnson, Emily Johnson"
                    className="w-full p-3 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] text-sm focus:outline-none focus:ring-2 focus:ring-[#A9D6F5]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[11px]">Relationship</label>
                  <select
                    value={newMember.relationship}
                    onChange={(e) => setNewMember({ ...newMember, relationship: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] text-sm focus:outline-none"
                  >
                    <option value="Parent">Parent (Father / Mother)</option>
                    <option value="Spouse">Spouse / Partner</option>
                    <option value="Child">Child (Son / Daughter)</option>
                    <option value="Sibling">Sibling (Brother / Sister)</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Other">Other Family Dependent</option>
                  </select>
                </div>
              </div>

              {/* Age, Gender, Blood Group */}
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[11px]">Age</label>
                  <input
                    type="number"
                    value={newMember.age}
                    onChange={(e) => setNewMember({ ...newMember, age: e.target.value })}
                    placeholder="e.g. 68"
                    className="w-full p-3 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] text-sm focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[11px]">Gender</label>
                  <select
                    value={newMember.gender}
                    onChange={(e) => setNewMember({ ...newMember, gender: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] text-sm focus:outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[11px]">Blood Group</label>
                  <select
                    value={newMember.bloodGroup}
                    onChange={(e) => setNewMember({ ...newMember, bloodGroup: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] text-sm focus:outline-none"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              {/* Primary Condition & Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[11px]">Primary Condition (Optional)</label>
                  <input
                    type="text"
                    value={newMember.primaryCondition}
                    onChange={(e) => setNewMember({ ...newMember, primaryCondition: e.target.value })}
                    placeholder="e.g. Type 2 Diabetes, Hypertension"
                    className="w-full p-3 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold uppercase tracking-wider text-[11px]">Condition Stage</label>
                  <input
                    type="text"
                    value={newMember.conditionStage}
                    onChange={(e) => setNewMember({ ...newMember, conditionStage: e.target.value })}
                    placeholder="e.g. Stage II, Mild, Controlled"
                    className="w-full p-3 rounded-2xl bg-white dark:bg-[#2A1D15] border border-[#E8DFD1] dark:border-[#4A3525] text-sm focus:outline-none"
                  />
                </div>
              </div>

              {/* 1-Click Approval Toggle */}
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  id="instantApprovalCheck"
                  checked={newMember.instantApproval}
                  onChange={(e) => setNewMember({ ...newMember, instantApproval: e.target.checked })}
                  className="mt-0.5 accent-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="instantApprovalCheck" className="cursor-pointer space-y-0.5 flex-1">
                  <strong className="block text-emerald-800 dark:text-emerald-300 font-extrabold text-xs">
                    {isHindi ? '⚡ 1-क्लिक तुरंत स्वीकृति दें (Immediate 1-Click Access Granted)' : '⚡ Grant Immediate 1-Click Access (Pre-Authorized)'}
                  </strong>
                  <p className="text-[11px] text-emerald-900/80 dark:text-emerald-200/80">
                    {isHindi
                      ? 'स्वीकृत होने पर परिवार का स्वास्थ्य डेटा तुरंत आपके डैशबोर्ड में उपलब्ध हो जाएगा।'
                      : 'Automatically authorizes 1-Click mutual health data sharing upon creation.'}
                  </p>
                </label>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-[#E8DFD1] dark:border-[#4A3525]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#2A1D15] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newMember.name.trim()}
                  className="px-6 py-2.5 rounded-2xl bg-[#A9D6F5] text-[#1F150E] text-xs font-black hover:bg-[#7CBFEA] disabled:opacity-50 transition-all shadow-sm cursor-pointer"
                >
                  {isHindi ? 'सदस्य जोड़ें' : 'Save & Enable Access'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
