import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Share2,
  MessageSquare,
  FileText,
  User,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Send,
  Sparkles,
  Heart,
  Activity,
  Maximize2,
  CheckCircle2,
  Copy,
  ExternalLink,
  Zap,
  Check,
  ArrowRight,
  RefreshCw,
  Phone,
  Droplet,
  Users,
  Settings,
  Lock,
  ChevronRight
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DoctorService, formatDoctorTitle } from '../../services/doctorService';

export default function DoctorVideoConsultationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { doctor, isVerified } = useDoctorAuth();
  const { t, isHindi } = useLanguage();

  // Consultation lifecycle: 'lobby' (Pre-call check & approval) | 'in-call' | 'ended'
  const [consultationStage, setConsultationStage] = useState('lobby');

  // Video call device controls state
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeSidePanel, setActiveSidePanel] = useState('notes'); // 'notes' | 'summary' | 'chat'
  const [callDuration, setCallDuration] = useState(0);

  // Approval & Lobby state
  const [isPreCallApproved, setIsPreCallApproved] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  // Available Patients list
  const availablePatients = useMemo(() => {
    const list = DoctorService.getDoctorPatients(doctor?.uid || 'doc_mock_1') || [];
    const hasRahul = list.some((p) => p.name?.toLowerCase().includes('rahul'));
    if (!hasRahul) {
      return [
        {
          id: 'p_rahul',
          name: 'Rahul Sharma',
          age: 45,
          gender: 'Male',
          phone: '+91 98765 43210',
          condition: 'Essential High Blood Pressure & Morning Headaches',
          bloodGroup: 'B+',
          status: 'Waiting in Room',
          vitals: { bp: '136/86', hr: 76, spo2: 98, lastChecked: '10 mins ago' },
          consentSigned: true,
          allergies: 'Penicillin (Mild rash)',
          notes: 'Patient reports mild headaches in the morning. BP home logs show 138/88. Denies chest pain or shortness of breath.'
        },
        ...list
      ];
    }
    return list;
  }, [doctor?.uid]);

  // Selected Patient
  const [selectedPatientId, setSelectedPatientId] = useState(() => {
    return searchParams.get('patientId') || 'p_rahul';
  });

  const selectedPatient = useMemo(() => {
    const found = availablePatients.find(
      (p) => p.id === selectedPatientId || p.patientId === selectedPatientId
    );
    if (found) return found;

    const queryName = searchParams.get('name');
    return {
      id: selectedPatientId,
      name: queryName || 'Rahul Sharma',
      age: 45,
      gender: 'Male',
      phone: '+91 98765 43210',
      condition: 'Essential High Blood Pressure & Morning Headaches',
      bloodGroup: 'B+',
      status: 'Waiting in Room',
      vitals: { bp: '136/86', hr: 76, spo2: 98, lastChecked: 'Just now' },
      consentSigned: true,
      allergies: 'Penicillin (Mild rash)',
      notes: 'Patient reports mild headaches in the morning. BP home logs show 138/88.'
    };
  }, [availablePatients, selectedPatientId, searchParams]);

  // Unique Encrypted Meeting Room ID & Link
  const meetingRoomId = useMemo(() => {
    const cleanId = String(selectedPatient.id || 'CONF').replace(/[^a-zA-Z0-9]/g, '').slice(-4) || '8849';
    return `BT-ROOM-${cleanId}-${9214}`;
  }, [selectedPatient.id]);

  const meetingLink = `https://meet.biotrajectory.com/telemed/${meetingRoomId.toLowerCase()}`;

  // Clinical Notes & In-Call Chat state
  const [clinicalNotes, setClinicalNotes] = useState(
    selectedPatient.notes || 'Patient reports mild headaches in the morning. BP home logs show 138/88. Denies chest pain or shortness of breath.'
  );

  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'patient',
      text: `Good morning ${formatDoctorTitle(doctor?.fullName || doctor?.name)}, I can hear you clearly.`,
      time: '10:30 AM'
    },
    {
      sender: 'doctor',
      text: 'Good morning. Let us review your latest blood pressure and urinalysis telemetry.',
      time: '10:31 AM'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Call timer - Only runs when actively in-call
  useEffect(() => {
    if (consultationStage !== 'in-call') return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [consultationStage]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Copy Meeting Link Handler
  const handleCopyMeetingLink = async () => {
    try {
      await navigator.clipboard.writeText(meetingLink);
      setIsCopied(true);
      showToast(isHindi ? '✓ मीटिंग लिंक क्लिपबोर्ड पर कॉपी हो गया!' : '✓ Telemedicine meeting link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 3000);
    } catch {
      showToast(meetingLink);
    }
  };

  // Start Meeting Handler
  const handleStartMeeting = () => {
    if (!isPreCallApproved) {
      showToast(isHindi ? 'कृपया पहले मरीज को परामर्श हेतु स्वीकृत करें।' : 'Please approve the patient consultation authorization first.');
      return;
    }
    setCallDuration(0);
    setConsultationStage('in-call');
    showToast(
      isHindi
        ? `✓ ${selectedPatient.name} के साथ वीडियो मीटिंग शुरू हो गई!`
        : `✓ Video consultation with ${selectedPatient.name} started!`
    );
  };

  // End Call Handler
  const handleEndCall = () => {
    setConsultationStage('ended');
    showToast(isHindi ? 'परामर्श समाप्त हुआ। क्लिनिकल रिपोर्ट तैयार करें।' : 'Consultation concluded. Clinical notes autosaved.');
  };

  // Return to Lobby / Waiting Room Handler
  const handleReturnToLobby = () => {
    setConsultationStage('lobby');
    setCallDuration(0);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        sender: 'doctor',
        text: newMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setNewMessage('');
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#1F150E] text-white border border-cyan-500/40 shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Security Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
              WebRTC Telemedicine Suite
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> DTLS / SRTP End-to-End Encrypted
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            {consultationStage === 'lobby'
              ? isHindi
                ? 'टेलीमेडिसिन परामर्श डेस्क: पूर्व-स्वीकृति एवं मीटिंग लिंक'
                : 'Telemedicine Pre-Call Check, Approval & Meeting Launcher'
              : `${isHindi ? 'परामर्श:' : 'Consultation with'} ${selectedPatient.name}`}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {consultationStage === 'in-call' ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{formatTime(callDuration)}</span>
              </div>
              <div className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                HD 1080p • 24ms Latency
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isHindi ? 'मरीज वेटिंग रूम में तैयार' : 'Patient Waiting Online'}</span>
            </div>
          )}
        </div>
      </div>

      {/* Verification Warning if Doctor is Pending */}
      {!isVerified && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-amber-800 dark:text-amber-300 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
          <span>
            <strong>Training / Demo Mode Active:</strong> Your medical registration is under review. You can simulate video calls and meeting rooms, while official clinical signing unlocks upon administrative verification.
          </span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. APPROVAL & START PAGE (PRE-CALL LOBBY & MEETING LAUNCHER)              */}
      {/* ========================================================================= */}
      {consultationStage === 'lobby' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
          {/* Left Column: Patient Triage, Vitals Check & Clinical Approval (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Patient Selector & Identity Card */}
            <div className="bg-white dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {isHindi ? 'मरीज का चयन व पूर्व-परामर्श जांच' : 'Patient Triage & Pre-Call Verification'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isHindi ? 'परामर्श से पूर्व मरीज का प्रोफाइल व वाइटल्स जांचें' : 'Check patient vitals, telemetry baseline, and clinical consent'}
                  </p>
                </div>

                {/* Patient Selector Dropdown */}
                <select
                  value={selectedPatientId}
                  onChange={(e) => {
                    const newId = e.target.value;
                    setSelectedPatientId(newId);
                    setSearchParams({ patientId: newId, name: availablePatients.find(p => p.id === newId)?.name || '' });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
                >
                  {availablePatients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} {p.isPriority ? '🚨 (Priority)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Identity Details */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-cyan-500/40 bg-gradient-to-tr from-cyan-400 to-blue-500 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-sm relative">
                  {selectedPatient.avatar ? (
                    <img src={selectedPatient.avatar} alt={selectedPatient.name} className="w-full h-full object-cover" />
                  ) : (
                    selectedPatient.name.charAt(0)
                  )}
                  <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1F150E]" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white truncate">
                      {selectedPatient.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                      {isHindi ? 'ऑनलाइन प्रतीक्षारत' : 'Online & Waiting'}
                    </span>
                    {selectedPatient.isPriority && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white animate-pulse">
                        🚨 PRIORITY PATIENT
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {selectedPatient.age || 45} yrs • {selectedPatient.gender || 'Male'} • Blood: <strong className="text-rose-600">{selectedPatient.bloodGroup || 'B+'}</strong> • Phone: {selectedPatient.phone || '+91 98765 43210'}
                  </p>

                  <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {isHindi ? 'प्राथमिक स्वास्थ्य समस्या / परामर्श उद्देश्य:' : 'Active Medical Condition & Reason:'}
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      {selectedPatient.condition || 'Essential High Blood Pressure & Morning Headaches'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pre-Call Vitals Check Grid */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  {isHindi ? 'लाइव वाइटल्स एवं सेंसर आंकड़े' : 'Pre-Call Biometric Trajectory'}
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-center space-y-0.5">
                    <div className="flex items-center justify-center gap-1 text-cyan-700 dark:text-cyan-300 text-xs font-bold">
                      <Activity className="w-3.5 h-3.5" />
                      <span>BP</span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {selectedPatient.vitals?.bp || '136/86'}
                    </p>
                    <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-semibold">mmHg (Monitored)</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center space-y-0.5">
                    <div className="flex items-center justify-center gap-1 text-rose-700 dark:text-rose-300 text-xs font-bold">
                      <Heart className="w-3.5 h-3.5" />
                      <span>Pulse</span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {selectedPatient.vitals?.hr || 76}
                    </p>
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-semibold">bpm (Resting)</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-center space-y-0.5">
                    <div className="flex items-center justify-center gap-1 text-blue-700 dark:text-blue-300 text-xs font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>SpO2</span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {selectedPatient.vitals?.spo2 || 98}%
                    </p>
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold">Optimal Safe</span>
                  </div>
                </div>
              </div>

              {/* Informed Consent & Physician Pre-Call Approval */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/5 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>{isHindi ? 'सहमति व क्लीनिकल सत्यापन' : 'Clinical Consent & Triage Authorization'}</span>
                  </div>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono text-[11px]">
                    ✓ Consent ID: BT-CONSENT-{selectedPatient.id.slice(-4)}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{isHindi ? 'मरीज द्वारा डिजिटल टेलीमेडिसिन सहमति हस्ताक्षरित।' : 'Patient digitally signed telemedicine consultation consent.'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{isHindi ? 'सेंसर व 10SG यूरिनलिसिस डेटा डॉक्टर एक्सेस हेतु अधिकृत।' : 'Longitudinal sensor & urine trajectory sharing authorized.'}</span>
                  </div>
                </div>

                {/* Pre-Call Approval Checkbox Toggle */}
                <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPreCallApproved}
                      onChange={(e) => setIsPreCallApproved(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                      {isHindi ? 'चिकित्सक पूर्व-परामर्श स्वीकृति (Physician Approval Granted)' : 'Physician Pre-Call Clinical Approval Granted'}
                    </span>
                  </label>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    isPreCallApproved
                      ? 'bg-emerald-600 text-white'
                      : 'bg-amber-500/20 text-amber-800 dark:text-amber-300'
                  }`}>
                    {isPreCallApproved ? (isHindi ? 'स्वीकृत' : 'Approved') : (isHindi ? 'लंबित' : 'Pending')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Device Hardware Preview, Meeting Link & Launcher (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Camera & Audio Preview Box */}
            <div className="bg-white dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {isHindi ? 'कैमरा व माइक पूर्वावलोकन' : 'Audio / Video Device Stream'}
                </h3>
                <span className="text-[11px] font-bold text-slate-400">
                  {isVideoOn && isMicOn ? 'Ready to stream' : 'Device muted'}
                </span>
              </div>

              {/* Video Preview Aspect Box */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
                {isVideoOn ? (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 flex flex-col items-center justify-center p-4 text-center relative">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400 shadow-md">
                      <img
                        src={doctor?.avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80'}
                        alt={doctor?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-white font-bold text-sm mt-2">
                      {formatDoctorTitle(doctor?.fullName || doctor?.name)}
                    </span>
                    <span className="text-[11px] text-cyan-400 font-mono">
                      {doctor?.registrationNumber || 'MD-89241-US'}
                    </span>

                    {/* Mic Audio Level Simulator Bar */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] text-emerald-400 font-bold">
                      <Mic className="w-3 h-3" />
                      <span>Mic Active:</span>
                      <div className="flex items-center gap-0.5 ml-1">
                        <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse" />
                        <span className="w-1 h-3.5 bg-emerald-400 rounded-full animate-pulse delay-75" />
                        <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse delay-150" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-500 space-y-1">
                    <VideoOff className="w-8 h-8 mx-auto" />
                    <p className="text-xs font-bold">Camera is Off</p>
                  </div>
                )}
              </div>

              {/* Hardware Quick Toggles */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isMicOn
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {isMicOn ? <Mic className="w-4 h-4 text-emerald-600" /> : <MicOff className="w-4 h-4" />}
                  <span>{isMicOn ? (isHindi ? 'माइक चालू' : 'Mic Mute') : (isHindi ? 'माइक बंद' : 'Mic Off')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isVideoOn
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200'
                      : 'bg-rose-500 text-white'
                  }`}
                >
                  {isVideoOn ? <Video className="w-4 h-4 text-cyan-600" /> : <VideoOff className="w-4 h-4" />}
                  <span>{isVideoOn ? (isHindi ? 'कैमरा चालू' : 'Camera On') : (isHindi ? 'कैमरा बंद' : 'Camera Off')}</span>
                </button>
              </div>

              {/* Meeting Link & Redirect Section */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {isHindi ? 'सुरक्षित मीटिंग लिंक (Meeting Link)' : 'Secure Meeting Link'}
                  </span>
                  <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    Room: {meetingRoomId}
                  </span>
                </div>

                {/* Meeting Link Box */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 font-mono text-xs text-slate-600 dark:text-slate-300 truncate">
                    <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{meetingLink}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyMeetingLink}
                    className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 shadow-xs transition-all cursor-pointer shrink-0"
                    title={isHindi ? 'लिंक कॉपी करें' : 'Copy link'}
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Meeting Link Action Buttons */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={handleCopyMeetingLink}
                    className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{isCopied ? (isHindi ? 'कॉपी हो गया' : 'Copied!') : (isHindi ? 'लिंक कॉपी करें' : 'Copy Link')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleStartMeeting}
                    className="py-2 px-3 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 font-bold text-purple-700 dark:text-purple-300 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isHindi ? 'मीटिंग लिंक खोलें' : 'Join via Link'}</span>
                  </button>
                </div>
              </div>

              {/* Big CTA: Approve & Start Meeting */}
              <button
                type="button"
                onClick={handleStartMeeting}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold text-sm shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2.5"
              >
                <Zap className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>
                  {isHindi
                    ? `⚡ स्वीकृति दें एवं मीटिंग शुरू करें (${selectedPatient.name})`
                    : `⚡ Approve & Start Video Consultation (${selectedPatient.name})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. ACTIVE LIVE VIDEO CONSULTATION WORKSPACE                               */}
      {/* ========================================================================= */}
      {consultationStage === 'in-call' && (
        <div className="space-y-4 animate-in fade-in duration-300">
          {/* Active Meeting Room Header Pill with Copy Option */}
          <div className="p-3 rounded-2xl bg-white dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-900 dark:text-white">
                {isHindi ? 'सक्रिय वीडियो मीटिंग रूम:' : 'Live Meeting Room:'}
              </span>
              <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">{meetingRoomId}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-mono hidden sm:inline">{meetingLink}</span>
              <button
                type="button"
                onClick={handleCopyMeetingLink}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold transition-all cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? (isHindi ? 'कॉपी हो गया' : 'Copied') : (isHindi ? 'लिंक शेयर करें' : 'Share Link')}</span>
              </button>
            </div>
          </div>

          {/* Main Video Call Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Video Frame (2 columns) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="relative rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center shadow-2xl">
                {/* Remote Patient Video Feed Simulation */}
                <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
                  {/* Patient Avatar & Canvas Graphic */}
                  <div className="text-center">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 p-1 mx-auto shadow-2xl relative">
                      <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-bold text-white overflow-hidden">
                        {selectedPatient.avatar ? (
                          <img src={selectedPatient.avatar} alt={selectedPatient.name} className="w-full h-full object-cover" />
                        ) : (
                          selectedPatient.name.charAt(0)
                        )}
                      </div>
                      <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-3">{selectedPatient.name}</h3>
                    <p className="text-xs text-slate-400">Remote Patient Stream Connected</p>
                  </div>

                  {/* Patient Vitals Overlay Tag in Top Left */}
                  <div className="absolute top-4 left-4 p-2.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10 text-white text-[11px] space-y-1 shadow-lg">
                    <div className="flex items-center gap-2">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>BP: <strong>{selectedPatient.vitals?.bp || '136/86'} mmHg</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="w-3.5 h-3.5 text-rose-400" />
                      <span>Pulse: <strong>{selectedPatient.vitals?.hr || 76} bpm</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                      <span>SpO2: <strong>{selectedPatient.vitals?.spo2 || 98}%</strong></span>
                    </div>
                  </div>

                  {/* Doctor's Self Preview Picture-in-Picture */}
                  <div className="absolute bottom-4 right-4 w-36 sm:w-44 aspect-video rounded-2xl bg-slate-900 border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center">
                    {isVideoOn ? (
                      <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-950 flex flex-col items-center justify-center p-2 text-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          Dr
                        </div>
                        <span className="text-[10px] text-white/90 font-medium mt-1 truncate max-w-full px-1">
                          You ({formatDoctorTitle(doctor?.fullName || doctor?.name)})
                        </span>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-[10px] flex flex-col items-center">
                        <VideoOff className="w-4 h-4 mb-1" />
                        <span>Camera Off</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* WebRTC Video Control Bar */}
              <div className="flex items-center justify-center gap-3 p-3 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <button
                  type="button"
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-3 rounded-xl transition-all cursor-pointer ${
                    isMicOn
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      : 'bg-rose-500 text-white'
                  }`}
                  title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
                >
                  {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`p-3 rounded-xl transition-all cursor-pointer ${
                    isVideoOn
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      : 'bg-rose-500 text-white'
                  }`}
                  title={isVideoOn ? 'Turn Off Camera' : 'Turn On Camera'}
                >
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                  className={`p-3 rounded-xl transition-all cursor-pointer ${
                    isScreenSharing
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                  title="Share Screen"
                >
                  <Share2 className="w-5 h-5" />
                </button>

                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>

                <button
                  type="button"
                  onClick={handleEndCall}
                  className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>{isHindi ? 'परामर्श समाप्त करें' : 'End Consultation'}</span>
                </button>
              </div>
            </div>

            {/* Right Collapsible Side Panel (1 column) */}
            <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col h-[520px] shadow-sm overflow-hidden">
              {/* Panel Selector Header */}
              <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
                <button
                  onClick={() => setActiveSidePanel('notes')}
                  className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
                    activeSidePanel === 'notes'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/20 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {isHindi ? 'लाइव नोट्स' : 'Live Clinical Notes'}
                </button>
                <button
                  onClick={() => setActiveSidePanel('summary')}
                  className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
                    activeSidePanel === 'summary'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/20 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {isHindi ? 'मरीज वाइटल्स' : 'Patient Vitals'}
                </button>
                <button
                  onClick={() => setActiveSidePanel('chat')}
                  className={`flex-1 py-3 text-center border-b-2 transition-colors cursor-pointer ${
                    activeSidePanel === 'chat'
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/20 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {isHindi ? 'चैट' : 'In-Call Chat'}
                </button>
              </div>

              {/* Panel Body */}
              <div className="flex-1 p-4 overflow-y-auto">
                {/* Panel 1: Live Notes */}
                {activeSidePanel === 'notes' && (
                  <div className="h-full flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {isHindi ? 'परामर्श प्रेक्षण' : 'Consultation Observations'}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Autosaved
                        </span>
                      </div>
                      <textarea
                        value={clinicalNotes}
                        onChange={(e) => setClinicalNotes(e.target.value)}
                        placeholder="Document patient statements, symptoms, and provisional notes in real-time..."
                        className="w-full h-64 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
                      <span>Transfers to Consultation Report automatically.</span>
                      <Link
                        to={`/doctor/reports/new?patientId=${selectedPatient.id}&name=${encodeURIComponent(selectedPatient.name)}`}
                        className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
                      >
                        Draft Report →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Panel 2: Patient Summary */}
                {activeSidePanel === 'summary' && (
                  <div className="space-y-4 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">Authorized Patient Record</h4>
                      <p className="text-slate-600 dark:text-slate-400">Name: <strong>{selectedPatient.name}</strong></p>
                      <p className="text-slate-600 dark:text-slate-400">Age / Gender: <strong>{selectedPatient.age || 45} yrs • {selectedPatient.gender || 'Male'}</strong></p>
                      <p className="text-slate-600 dark:text-slate-400">Known Allergies: <strong>{selectedPatient.allergies || 'None reported'}</strong></p>
                      <p className="text-slate-600 dark:text-slate-400">Blood Group: <strong>{selectedPatient.bloodGroup || 'B+'}</strong></p>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2">Current Active Medication</h4>
                      <ul className="space-y-1.5 text-slate-700 dark:text-slate-300">
                        <li className="p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                          • Telmisartan 40mg (Once daily morning)
                        </li>
                        <li className="p-2 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30">
                          • Vitamin D3 60,000 IU (Weekly)
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Panel 3: In-Call Chat */}
                {activeSidePanel === 'chat' && (
                  <div className="h-full flex flex-col justify-between">
                    <div className="space-y-3 overflow-y-auto pr-1">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex flex-col ${msg.sender === 'doctor' ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] p-2.5 rounded-xl text-xs ${
                              msg.sender === 'doctor'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none'
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1">{msg.time}</span>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type message to patient..."
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="submit"
                        className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. POST-CALL COMPLETED SCREEN                                             */}
      {/* ========================================================================= */}
      {consultationStage === 'ended' && (
        <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-white dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {isHindi ? 'परामर्श सफलतापूर्वक संपन्न हुआ' : 'Consultation Successfully Concluded'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {isHindi
                ? `मरीज ${selectedPatient.name} के साथ कुल कॉल अवधि: ${formatTime(callDuration)}.`
                : `Total call duration with ${selectedPatient.name}: ${formatTime(callDuration)}.`}
            </p>
          </div>

          {/* Clinical Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <Link
              to={`/doctor/reports/new?patientId=${selectedPatient.id}&name=${encodeURIComponent(selectedPatient.name)}`}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>{isHindi ? 'विजिट रिपोर्ट तैयार करें' : 'Write Visit Report'}</span>
            </Link>

            <Link
              to={`/doctor/prescriptions/new?patientId=${selectedPatient.id}&name=${encodeURIComponent(selectedPatient.name)}`}
              className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <FileText className="w-4 h-4" />
              <span>{isHindi ? 'ई-प्रिस्क्रिप्शन जारी करें' : 'Issue Prescription'}</span>
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleReturnToLobby}
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isHindi ? 'स्वीकृति डेस्क पर लौटें (अगला मरीज)' : 'Return to Approval Desk (Next Patient)'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
