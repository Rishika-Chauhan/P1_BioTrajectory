import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { DoctorService } from '../../services/doctorService';

export default function DoctorVideoConsultationPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { doctor, isVerified } = useDoctorAuth();

  const patientId = searchParams.get('patientId') || 'p_demo';
  const patientName = searchParams.get('name') || 'Rahul Sharma';

  // Video call controls state
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeSidePanel, setActiveSidePanel] = useState('notes'); // 'notes' | 'summary' | 'chat'
  const [callDuration, setCallDuration] = useState(0);
  const [isCallEnded, setIsCallEnded] = useState(false);

  // Chat & Notes state
  const [clinicalNotes, setClinicalNotes] = useState(
    'Patient reports mild headaches in the morning. BP home logs show 138/88. Denies chest pain or shortness of breath.'
  );
  const [chatMessages, setChatMessages] = useState([
    { sender: 'patient', text: 'Good morning Dr. ' + (doctor?.fullName || 'Doctor') + ', I can hear you clearly.', time: '10:30 AM' },
    { sender: 'doctor', text: 'Good morning Rahul. Let us review your blood pressure logs today.', time: '10:31 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Call timer
  useEffect(() => {
    if (isCallEnded) return;
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCallEnded]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        sender: 'doctor',
        text: newMessage.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setNewMessage('');
  };

  const handleEndCall = () => {
    setIsCallEnded(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Security Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
              WebRTC Telemedicine Suite
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> DTLS / SRTP End-to-End Encrypted
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">
            Consultation with {patientName}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-700 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{isCallEnded ? 'Call Ended' : formatTime(callDuration)}</span>
          </div>

          <div className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
            HD 1080p • 24ms Latency
          </div>
        </div>
      </div>

      {/* Verification Warning if Doctor is Pending */}
      {!isVerified && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center gap-3 text-amber-800 dark:text-amber-300 text-xs">
          <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
          <span>
            <strong>Training / Demo Mode Active:</strong> Your medical registration is under review. You can simulate video calls, but final medical prescription & clinical signing will unlock upon administrative verification.
          </span>
        </div>
      )}

      {/* Main Video Call Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Frame (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center shadow-xl">
            {/* Remote Patient Video Feed Simulation */}
            {!isCallEnded ? (
              <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
                {/* Simulated Patient Video Stream Canvas / Graphic */}
                <div className="text-center">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-500 p-1 mx-auto shadow-2xl relative">
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-bold text-white">
                      {patientName.charAt(0)}
                    </div>
                    <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900"></span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-3">{patientName}</h3>
                  <p className="text-xs text-slate-400">Remote Patient Stream Connected</p>
                </div>

                {/* Patient Vitals Overlay Tag in Top Left */}
                <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] space-y-1">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>BP: <strong>136/86 mmHg</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>Pulse: <strong>76 bpm</strong></span>
                  </div>
                </div>

                {/* Doctor's Self Preview Picture-in-Picture */}
                <div className="absolute bottom-4 right-4 w-36 sm:w-44 aspect-video rounded-xl bg-slate-900 border border-white/20 shadow-2xl overflow-hidden flex items-center justify-center">
                  {isVideoOn ? (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-950 flex flex-col items-center justify-center p-2 text-center">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                        Dr
                      </div>
                      <span className="text-[10px] text-white/90 font-medium mt-1">You (Dr. {doctor?.fullName || 'Practitioner'})</span>
                    </div>
                  ) : (
                    <div className="text-slate-500 text-[10px] flex flex-col items-center">
                      <VideoOff className="w-4 h-4 mb-1" />
                      <span>Camera Off</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Post Call Finished State */
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Consultation Finished</h3>
                <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
                  Call duration: {formatTime(callDuration)}. Proceed to finalize clinical documentation.
                </p>
                <div className="flex items-center justify-center gap-3 mt-6">
                  <Link
                    to={`/doctor/reports/new?patientId=${patientId}&name=${encodeURIComponent(patientName)}`}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md"
                  >
                    Write Visit Report
                  </Link>
                  <Link
                    to={`/doctor/prescriptions/new?patientId=${patientId}&name=${encodeURIComponent(patientName)}`}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md"
                  >
                    Issue Prescription
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* WebRTC Video Control Bar */}
          {!isCallEnded && (
            <div className="flex items-center justify-center gap-3 p-3 bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
              <button
                type="button"
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-3 rounded-xl transition-all ${
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
                className={`p-3 rounded-xl transition-all ${
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
                className={`p-3 rounded-xl transition-all ${
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
                className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <PhoneOff className="w-4 h-4" />
                End Consultation
              </button>
            </div>
          )}
        </div>

        {/* Right Collapsible Side Panel (1 column) */}
        <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col h-[520px] shadow-sm overflow-hidden">
          {/* Panel Selector Header */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveSidePanel('notes')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeSidePanel === 'notes'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Live Clinical Notes
            </button>
            <button
              onClick={() => setActiveSidePanel('summary')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeSidePanel === 'summary'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Patient Vitals
            </button>
            <button
              onClick={() => setActiveSidePanel('chat')}
              className={`flex-1 py-3 text-center border-b-2 transition-colors ${
                activeSidePanel === 'chat'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              In-Call Chat
            </button>
          </div>

          {/* Panel Body */}
          <div className="flex-1 p-4 overflow-y-auto">
            {/* Panel 1: Live Notes */}
            {activeSidePanel === 'notes' && (
              <div className="h-full flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Consultation Observations</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Autosaved
                    </span>
                  </div>
                  <textarea
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="Document patient statements, symptoms, and provisional notes in real-time..."
                    className="w-full h-64 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[11px] text-slate-500">
                  <span>Transfers to Consultation Report automatically.</span>
                  <Link
                    to={`/doctor/reports/new?patientId=${patientId}&name=${encodeURIComponent(patientName)}`}
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
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Authorized Patient Record</h4>
                  <p className="text-slate-600 dark:text-slate-400">Name: <strong>{patientName}</strong></p>
                  <p className="text-slate-600 dark:text-slate-400">Age / Gender: <strong>45 yrs • Male</strong></p>
                  <p className="text-slate-600 dark:text-slate-400">Known Allergies: <strong>Penicillin (Mild Rash)</strong></p>
                  <p className="text-slate-600 dark:text-slate-400">Blood Group: <strong>B+</strong></p>
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
                    className="p-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
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
  );
}
