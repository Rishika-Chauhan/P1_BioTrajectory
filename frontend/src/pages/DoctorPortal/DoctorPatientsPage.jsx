import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Plus,
  Video,
  FileText,
  Clock,
  Calendar,
  ChevronRight,
  ShieldAlert,
  ArrowUpDown,
  Phone,
  QrCode,
  AlertOctagon,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { DoctorService } from '../../services/doctorService';
import { subscribeToPriorityChanges } from '../../services/patientPriorityService';

export default function DoctorPatientsPage() {
  const { doctor } = useDoctorAuth();
  const { t, isHindi } = useLanguage();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshPatients = () => {
    const list = DoctorService.getDoctorPatients(doctor?.uid || 'doc_mock_1');
    setPatients(list);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 450));
    refreshPatients();
    setIsRefreshing(false);
  };

  useEffect(() => {
    refreshPatients();
    const unsubscribe = subscribeToPriorityChanges(() => {
      refreshPatients();
    });
    return unsubscribe;
  }, [doctor]);

  const filteredPatients = (patients || [])
    .filter((patient) => {
      const pName = patient.name || patient.patientName || '';
      const pCond = patient.condition || patient.primaryCondition || '';
      const pPhone = patient.phone || '';
      const lastVisit = patient.lastVisit || '';

      const matchesSearch =
        pName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pCond.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pPhone.includes(searchTerm);

      if (!matchesSearch) return false;

      if (selectedFilter === 'priority') {
        return Boolean(patient.isPriority || patient.isDanger);
      }
      if (selectedFilter === 'recent') {
        return lastVisit.includes('Yesterday') || lastVisit.includes('Today') || lastVisit.includes('days');
      }
      if (selectedFilter === 'upcoming') {
        return !!patient.nextFollowUp;
      }
      if (selectedFilter === 'active') {
        return patient.status === 'Under Care' || patient.status === 'Monitoring' || patient.status === 'Active Consultation';
      }
      return true;
    })
    .sort((a, b) => {
      // Danger Disease Priority Persons are automatically elevated to the top of the roster
      const aScore = a.isPriority ? 1 : 0;
      const bScore = b.isPriority ? 1 : 0;
      return bScore - aScore;
    });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs sm:text-sm font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
              {t('doctor.patientDirectory', {}, 'Doctor Practice Directory')}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t('doctor.authorizedPatients', {}, 'My Authorized Patients')}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1.5">
            {t('doctor.patientVaultsDesc', {}, 'Patient health vaults accessible through direct consultation consent or QR authorization.')}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-sm shadow-xs hover:border-blue-500 cursor-pointer active:scale-95 transition-all disabled:opacity-60"
            title={isHindi ? 'मरीज सूची रिफ्रेश करें' : 'Refresh Patient Roster'}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
            <span>{isRefreshing ? (isHindi ? 'रिफ्रेश...' : 'Refreshing...') : (isHindi ? 'रिफ्रेश' : 'Refresh')}</span>
          </button>

          <Link
            to="/doctor/scan-qr"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold text-sm shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            <QrCode className="w-5 h-5" />
            {t('doctor.authorizeNewPatient', {}, 'Authorize New Patient (Scan QR)')}
          </Link>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('doctor.searchPatientsPlaceholder', {}, 'Search by patient name, condition, or phone...')}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: t('doctor.filterAll', {}, 'All Patients') },
            { id: 'priority', label: isHindi ? '🚨 प्राथमिकता रोगी (गंभीर रोग)' : '🚨 Priority (Danger Diseases)' },
            { id: 'recent', label: t('doctor.filterRecent', {}, 'Recent Visits') },
            { id: 'upcoming', label: t('doctor.filterUpcoming', {}, 'Upcoming Follow-ups') },
            { id: 'active', label: t('doctor.filterActive', {}, 'Active Care') },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Patient List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatients.map((p) => (
          <div
            key={p.id}
            className={`rounded-3xl p-6 shadow-sm transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl ${
              p.isPriority
                ? 'bg-gradient-to-b from-red-50/90 to-white dark:from-red-950/30 dark:to-slate-900/90 border-2 border-red-500 shadow-md shadow-red-500/20'
                : 'bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40'
            }`}
          >
            <div>
              {/* Priority Danger Disease Banner */}
              {p.isPriority && (
                <div className="mb-4 px-3.5 py-2 rounded-2xl bg-red-600 text-white flex items-center justify-between text-xs font-black tracking-wide shadow-md animate-pulse">
                  <span className="flex items-center gap-1.5 uppercase">
                    <AlertOctagon className="w-4 h-4" />
                    {isHindi ? '🚨 प्राथमिकता रोगी — उच्च जोखिम' : '🚨 PRIORITY PERSON — HIGH RISK'}
                  </span>
                  <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-lg font-bold uppercase">
                    {isHindi ? 'गंभीर रोग' : 'Danger Disease'}
                  </span>
                </div>
              )}

              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden font-bold text-lg flex items-center justify-center shrink-0 shadow-sm ${
                      p.isPriority
                        ? 'ring-2 ring-red-500 shadow-md shadow-red-600/30'
                        : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    {p.avatar ? (
                      <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      (p.name || p.patientName || 'P').charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base sm:text-lg flex items-center gap-2">
                      <span>{p.name || p.patientName || 'Patient'}</span>
                      {p.isPriority && (
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                      {p.age || 42} yrs • {p.gender || 'Male'} • Blood: <span className="font-black text-rose-600 dark:text-rose-400">{p.bloodGroup || 'O+'}</span>
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shrink-0 ${
                    p.isPriority
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {p.isPriority ? (isHindi ? '🚨 प्राथमिकता ट्राइएज' : '🚨 PRIORITY') : p.status}
                </span>
              </div>

              {/* Patient Info pills */}
              <div className="mt-4 space-y-2.5">
                <div
                  className={`p-3.5 rounded-2xl text-sm ${
                    p.isPriority
                      ? 'bg-red-500/10 border border-red-500/30 dark:bg-red-950/30'
                      : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <span
                    className={`text-xs font-extrabold uppercase tracking-wide block mb-1 ${
                      p.isPriority ? 'text-red-700 dark:text-red-400' : 'text-slate-400'
                    }`}
                  >
                    {isHindi ? 'प्राथमिक समस्या (सक्रिय स्थिति):' : 'Primary Concern (Active Condition):'}
                  </span>
                  <span
                    className={`font-bold text-sm sm:text-base ${
                      p.isPriority ? 'text-red-950 dark:text-red-200' : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {p.condition}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-medium block text-xs">{isHindi ? 'अंतिम परामर्श:' : 'Last Visit:'}</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{p.lastVisit}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <span className="text-slate-400 font-medium block text-xs">{isHindi ? 'अगला फॉलो-अप:' : 'Next Follow-Up:'}</span>
                    <span className={`font-bold ${p.isPriority ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {p.nextFollowUp || (isHindi ? 'कोई नहीं' : 'None')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 pt-1 font-medium">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{p.phone}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <Link
                to={`/doctor/patients/${p.id}`}
                className={`text-xs sm:text-sm font-extrabold hover:underline flex items-center gap-1 ${
                  p.isPriority ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'
                }`}
              >
                <span>{isHindi ? 'क्लिनिकल फ़ाइल' : 'Clinical File'}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-2">
                {p.isPriority ? (
                  <Link
                    to={`/doctor/video-consultation?patientId=${p.id}&name=${encodeURIComponent(p.name)}`}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs sm:text-sm font-black flex items-center gap-1.5 shadow-md shadow-red-600/30 transition-all cursor-pointer"
                    title={isHindi ? 'प्राथमिकता वीडियो कॉल शुरू करें' : 'Start Priority Video Call'}
                  >
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>{isHindi ? 'त्वरित कॉल' : 'Fast-Track Call'}</span>
                  </Link>
                ) : (
                  <Link
                    to={`/doctor/video-consultation?patientId=${p.id}&name=${encodeURIComponent(p.name)}`}
                    className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 hover:bg-purple-100 transition-colors"
                    title={isHindi ? 'वीडियो परामर्श' : 'Video Call'}
                  >
                    <Video className="w-4 h-4" />
                  </Link>
                )}
                <Link
                  to={`/doctor/reports/new?patientId=${p.id}&name=${encodeURIComponent(p.name)}`}
                  className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 hover:bg-blue-100 transition-colors"
                  title={isHindi ? 'रिपोर्ट लिखें' : 'Write Report'}
                >
                  <FileText className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            {t('doctor.noPatientsFound', {}, 'No patients found')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isHindi
              ? 'अपनी खोज बदलें या नया मरीज जोड़ने के लिए मरीज का QR कोड स्कैन करें।'
              : 'Try adjusting your search term or scan a patient QR code to add a patient.'}
          </p>
        </div>
      )}
    </div>
  );
}
