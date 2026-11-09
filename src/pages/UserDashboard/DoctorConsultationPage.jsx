import React, { useState } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  MessageSquare,
  Share2,
  Calendar,
  Clock,
  Star,
  Search,
  Filter,
  CheckCircle2,
  X,
  Stethoscope,
  FileText,
  User,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { DOCTORS_DATABASE, DOCTORS_SPECIALTIES, SAMPLE_CONSULTATION_HISTORY } from '../../data/doctorsData';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function DoctorConsultationPage() {
  const [activeTab, setActiveTab] = useState('browse'); // 'browse', 'activeCall', 'history'
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Specialties');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Appointment modal state
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('2026-11-10');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Active call state
  const [inCallDoctor, setInCallDoctor] = useState(DOCTORS_DATABASE[0]);
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [callMessages, setCallMessages] = useState([
    { sender: 'doctor', text: 'Hello! I have your recent blood pressure timeline open here. How have you been feeling lately?', time: '02:31 PM' }
  ]);
  const [callInput, setCallInput] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartCall = (doctor) => {
    setInCallDoctor(doctor);
    setActiveTab('activeCall');
  };

  const handleEndCall = () => {
    setActiveTab('browse');
    showToast('Video visit ended and saved safely in your history.');
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (!selectedSlot) {
      alert('Please choose an available time slot.');
      return;
    }
    showToast(`Appointment scheduled with ${bookingDoctor.name} on ${selectedDate} at ${selectedSlot}!`);
    setBookingDoctor(null);
  };

  const handleSendCallMessage = () => {
    if (!callInput.trim()) return;
    setCallMessages([
      ...callMessages,
      { sender: 'user', text: callInput, time: 'Now' }
    ]);
    setCallInput('');
  };

  const filteredDoctors = DOCTORS_DATABASE.filter(doc => {
    const matchesSpec = selectedSpecialty === 'All Specialties' || doc.specialty === selectedSpecialty;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || doc.name.toLowerCase().includes(q) || doc.clinic.toLowerCase().includes(q) || doc.specialty.toLowerCase().includes(q);
    return matchesSpec && matchesSearch;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-cyan-500 text-slate-950 font-bold text-[16px] shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Tabs Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Talk to Doctor
          </h1>
          <p className="text-[17px] text-slate-600 dark:text-slate-400 mt-1">
            Schedule an online video visit with a verified doctor.
          </p>
        </div>

        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 text-[16px] font-semibold">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-5 py-2.5 rounded-xl transition-all ${
              activeTab === 'browse'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Find a Doctor
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-5 py-2.5 rounded-xl transition-all ${
              activeTab === 'history'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Past Doctor Visits
          </button>
          {activeTab === 'activeCall' && (
            <span className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold animate-pulse flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              Live Call
            </span>
          )}
        </div>
      </div>

      {/* 1. ACTIVE VIDEO CALL VIEW */}
      {activeTab === 'activeCall' && (
        <div className="relative rounded-3xl bg-[#05070C] border border-slate-800 shadow-2xl overflow-hidden h-[600px] flex flex-col justify-between">
          
          {/* Top Call Info Bar */}
          <div className="p-5 z-20 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
            <div className="flex items-center gap-3">
              <img
                src={inCallDoctor.avatar}
                alt={inCallDoctor.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400"
              />
              <div>
                <p className="text-[17px] font-bold text-white flex items-center gap-2">
                  <span>{inCallDoctor.name}</span>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                    Secure & Private Call
                  </span>
                </p>
                <p className="text-[15px] text-slate-300">{inCallDoctor.specialty}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-300 font-mono bg-black/40 px-3 py-1.5 rounded-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span>08:42</span>
            </div>
          </div>

          {/* Main Video Area: Simulated Doctor Feed */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <img
              src={inCallDoctor.avatar}
              alt={inCallDoctor.name}
              className="w-full h-full object-cover opacity-75 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#05070C] via-transparent to-black/40" />

            {/* Doctor Telemetry Overlay HUD */}
            <div className="absolute bottom-24 left-6 hidden sm:block p-4 rounded-2xl bg-black/70 border border-cyan-500/30 text-white max-w-sm space-y-1.5 backdrop-blur-md">
              <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Health Data Shared with Doctor</p>
              <p className="text-[17px] font-bold">Blood Pressure: 121 / 79 mmHg (Healthy)</p>
              <p className="text-[15px] text-slate-300">Dr. {inCallDoctor.name.split(' ')[1]} is reviewing your weekly readings</p>
            </div>
          </div>

          {/* User Video PiP (Picture in Picture) */}
          <div className="absolute top-24 right-6 z-20 w-40 h-52 rounded-2xl bg-slate-900 border-2 border-cyan-400/60 shadow-2xl overflow-hidden flex flex-col justify-between p-2.5">
            <div className="flex justify-between items-center text-xs text-white">
              <span className="bg-black/60 px-2 py-0.5 rounded font-medium">You</span>
              {!camActive && <VideoOff className="w-4 h-4 text-red-400" />}
            </div>
            <div className="flex-1 flex items-center justify-center text-slate-400">
              {camActive ? (
                <div className="text-center space-y-1">
                  <User className="w-10 h-10 text-cyan-400 mx-auto" />
                  <p className="text-[13px] text-slate-300">Your Camera</p>
                </div>
              ) : (
                <p className="text-[14px] text-slate-400">Camera Off</p>
              )}
            </div>
          </div>

          {/* In-Call Chat Drawer */}
          {chatOpen && (
            <div className="absolute top-20 bottom-24 right-52 z-30 w-80 rounded-2xl bg-[#090E18]/95 border border-slate-700 p-4 flex flex-col justify-between shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700 text-[16px]">
                <span className="font-bold text-white">Call Messages</span>
                <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2.5 py-3 text-[15px]">
                {callMessages.map((m, idx) => (
                  <div key={idx} className={`p-3 rounded-2xl ${m.sender === 'user' ? 'bg-cyan-500/20 text-cyan-200 ml-auto' : 'bg-slate-800 text-slate-200'} max-w-[85%]`}>
                    <p>{m.text}</p>
                    <span className="text-xs text-slate-400 block text-right mt-1">{m.time}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-700">
                <input
                  type="text"
                  value={callInput}
                  onChange={e => setCallInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendCallMessage()}
                  placeholder="Type message..."
                  className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-[15px] text-white focus:outline-none"
                />
                <button
                  onClick={handleSendCallMessage}
                  className="px-4 py-2 bg-cyan-400 text-slate-950 font-bold rounded-xl text-[15px]"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Share Reports Drawer */}
          {reportsOpen && (
            <div className="absolute top-20 bottom-24 left-6 z-30 w-88 rounded-2xl bg-[#090E18]/95 border border-slate-700 p-5 shadow-2xl backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-700 text-[16px]">
                <span className="font-bold text-white">Share Reports with Doctor</span>
                <button onClick={() => setReportsOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[15px] text-slate-300">Select reports to show the doctor:</p>
              <div className="space-y-2 text-[15px]">
                {['Blood Test Panel (CMP)', '30-Day Blood Pressure Log', 'Simple Urine Test Strip'].map((rep, idx) => (
                  <label key={idx} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer">
                    <input type="checkbox" defaultChecked={idx === 1} className="w-4 h-4 rounded text-cyan-500" />
                    <span className="text-slate-200">{rep}</span>
                  </label>
                ))}
              </div>
              <button
                onClick={() => {
                  setReportsOpen(false);
                  showToast('Selected reports shared with the doctor.');
                }}
                className="w-full py-2.5 rounded-xl text-[16px] font-bold bg-cyan-400 text-slate-950 mt-2"
              >
                Share Selected
              </button>
            </div>
          )}

          {/* Bottom Floating Control Bar */}
          <div className="p-5 z-20 flex items-center justify-center gap-4 bg-gradient-to-t from-black/90 to-transparent">
            <button
              onClick={() => setMicActive(!micActive)}
              className={`p-4 rounded-full transition-all ${
                micActive ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white'
              }`}
              title={micActive ? 'Mute Mic' : 'Unmute Mic'}
            >
              {micActive ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6 text-white" />}
            </button>

            <button
              onClick={() => setCamActive(!camActive)}
              className={`p-4 rounded-full transition-all ${
                camActive ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white'
              }`}
              title={camActive ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {camActive ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6 text-white" />}
            </button>

            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`p-4 rounded-full transition-all ${
                chatOpen ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title="Messages"
            >
              <MessageSquare className="w-6 h-6" />
            </button>

            <button
              onClick={() => setReportsOpen(!reportsOpen)}
              className={`p-4 rounded-full transition-all ${
                reportsOpen ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-white hover:bg-slate-700'
              }`}
              title="Share Reports"
            >
              <Share2 className="w-6 h-6" />
            </button>

            <button
              onClick={handleEndCall}
              className="px-8 py-3.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-red-500/30 transition-all active:scale-95 text-[17px]"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Call</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. FIND A DOCTOR (BROWSE TAB) */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Search and Specialty Filters */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name or specialty..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-[16px] text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              {DOCTORS_SPECIALTIES.map(spec => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecialty(spec)}
                  className={`px-4 py-2.5 rounded-2xl text-[15px] sm:text-[16px] font-semibold whitespace-nowrap transition-all ${
                    selectedSpecialty === spec
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                      : 'bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>

          {/* Doctor Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredDoctors.map(doc => (
              <div
                key={doc.id}
                className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={doc.avatar}
                      alt={doc.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">{doc.name}</h3>
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                          {doc.specialty}
                        </span>
                      </div>
                      <p className="text-[16px] text-slate-600 dark:text-slate-400">{doc.title}</p>
                      <p className="text-[15px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-0.5">
                        <Stethoscope className="w-4 h-4 text-cyan-500" />
                        <span>{doc.clinic}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#070B14] p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    {doc.bio}
                  </p>

                  <div className="flex items-center justify-between text-[16px] pt-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span>{doc.rating}</span>
                      <span className="text-slate-500 dark:text-slate-400 font-normal">({doc.reviewsCount} reviews)</span>
                    </div>
                    <span className="font-bold text-cyan-600 dark:text-cyan-400 text-[17px]">{doc.fee}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => setBookingDoctor(doc)}
                    className="w-full sm:w-1/2 py-3.5 px-4 rounded-2xl text-[17px] font-bold border border-cyan-500/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Visit</span>
                  </button>
                  <button
                    onClick={() => handleStartCall(doc)}
                    className="w-full sm:w-1/2 py-3.5 px-4 rounded-2xl text-[17px] font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Video className="w-4 h-4" />
                    <span>Start Video Visit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CONSULTATION HISTORY TAB */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Past Doctor Visits</h3>
              <p className="text-[16px] text-slate-500 dark:text-slate-400 mt-1">Review summaries and advice from previous doctor appointments.</p>
            </div>

            <div className="space-y-4">
              {SAMPLE_CONSULTATION_HISTORY.map(session => (
                <div
                  key={session.id}
                  className="p-6 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 space-y-4 text-[16px]"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center font-bold">
                        <Video className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-[18px]">{session.doctor}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[15px]">{session.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[15px]">
                      <span>{session.date} at {session.time}</span>
                      <span className="font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        {session.status} ({session.duration})
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed pl-13">
                    <strong className="text-slate-900 dark:text-white">Doctor's Advice:</strong> {session.summaryNotes}
                  </p>

                  <div className="pl-13 flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[15px] text-slate-500 dark:text-slate-400 font-semibold">Reports Shared:</span>
                    {session.sharedReports.map((r, i) => (
                      <span key={i} className="text-sm px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-medium">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Appointment Booking Modal */}
      {bookingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Book an Online Visit</h3>
                <p className="text-[16px] text-slate-500 dark:text-slate-400">{bookingDoctor.name} ({bookingDoctor.specialty})</p>
              </div>
              <button onClick={() => setBookingDoctor(null)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="space-y-5 text-[16px]">
              <div className="space-y-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Choose Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Available Times</label>
                <div className="grid grid-cols-2 gap-3">
                  {bookingDoctor.slots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-3 px-4 rounded-2xl border text-[16px] font-semibold transition-all ${
                        selectedSlot === slot
                          ? 'bg-cyan-500 border-cyan-500 text-slate-950 font-bold shadow-md'
                          : 'bg-slate-50 dark:bg-[#070B14] border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-400'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-[15px] text-slate-700 dark:text-slate-300 space-y-1">
                <p className="font-bold text-cyan-700 dark:text-cyan-300 text-[16px]">Visit Fee: {bookingDoctor.fee}</p>
                <p className="leading-relaxed">A simple summary of your recent health numbers will be ready for the doctor to review during your call.</p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setBookingDoctor(null)}
                  className="px-5 py-3 rounded-2xl text-[17px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl text-[17px] font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-md transition-all"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <DisclaimerBanner />
    </div>
  );
}
