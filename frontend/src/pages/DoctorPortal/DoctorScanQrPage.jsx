import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  QrCode,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Heart,
  Activity,
  FileText,
  Video,
  PlusCircle,
  XCircle,
  Camera,
  RefreshCw,
  KeyRound,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useDoctorAuth } from '../../context/DoctorAuthContext';
import { QrTokenService } from '../../services/qrTokenService';
import { DoctorService } from '../../services/doctorService';

export default function DoctorScanQrPage() {
  const { doctor, isVerified } = useDoctorAuth();
  const navigate = useNavigate();

  const [scanResult, setScanResult] = useState(null);
  const [tokenInput, setTokenInput] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const scannerRef = useRef(null);

  // Initialize html5-qrcode scanner when active
  useEffect(() => {
    if (!isCameraActive || scanResult) return;

    const qrScanner = new Html5QrcodeScanner(
      'qr-reader-container',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
      },
      false
    );

    qrScanner.render(
      (decodedText) => {
        handleProcessToken(decodedText);
        try {
          qrScanner.clear();
        } catch (e) {
          console.warn('Scanner clear warning:', e);
        }
        setIsCameraActive(false);
      },
      (errorMessage) => {
        // Continuous scan errors are expected while searching for QR
      }
    );

    scannerRef.current = qrScanner;

    return () => {
      try {
        if (scannerRef.current) {
          scannerRef.current.clear();
        }
      } catch (err) {
        console.warn('Failed to clear scanner on unmount', err);
      }
    };
  }, [isCameraActive, scanResult]);

  // Countdown timer for authorized session
  useEffect(() => {
    if (!sessionExpiry) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = sessionExpiry - now;
      if (diff <= 0) {
        setTimeLeft('Expired');
        setError('Authorized session expired. Patient must regenerate QR code.');
        setScanResult(null);
        setSessionExpiry(null);
        clearInterval(interval);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionExpiry]);

  const handleProcessToken = (token) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = QrTokenService.validateToken(token, doctor?.uid || 'doc_mock_1');
      if (res.valid) {
        setScanResult(res.patientData);
        // Grant 15 min session
        setSessionExpiry(Date.now() + 15 * 60 * 1000);
      } else {
        setError(res.error || 'Invalid or expired QR token.');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate QR token.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    handleProcessToken(tokenInput.trim());
  };

  const handleSimulateScan = (presetToken) => {
    const token = presetToken || 'bt_secure_token_982a7f01';
    setTokenInput(token);
    handleProcessToken(token);
  };

  const handleCloseSession = () => {
    setScanResult(null);
    setSessionExpiry(null);
    setTokenInput('');
    setError(null);
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300">
            Secure Patient Handshake
          </span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Zero Health-Data in QR
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
          Scan Patient QR Code
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
          Obtain authorized, time-limited consent to view patient records, write consultation reports, and issue verified prescriptions.
        </p>
      </div>

      {/* Main Container */}
      {!scanResult ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Camera Scanner Box */}
          <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Camera className="w-5 h-5 text-cyan-500" />
                  Camera QR Scanner
                </h2>
                {isCameraActive && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Camera
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                Hold the patient's phone screen in front of your camera to scan their ephemeral access token.
              </p>

              {isCameraActive ? (
                <div className="space-y-4">
                  <div
                    id="qr-reader-container"
                    className="w-full rounded-xl overflow-hidden border border-slate-300 dark:border-slate-700 bg-black min-h-[300px]"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCameraActive(false)}
                    className="w-full py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    Stop Camera
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center flex flex-col items-center justify-center min-h-[260px] bg-slate-50/50 dark:bg-slate-800/20">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-3">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">
                    Camera is currently idle
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1">
                    Click below to grant camera access and scan the patient's QR code.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCameraActive(true)}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium text-xs shadow-md transition-all"
                  >
                    <Camera className="w-4 h-4" />
                    Activate Camera Scanner
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Privacy Notice:</span> Patient QR tokens expire automatically every 15 minutes.
            </div>
          </div>

          {/* Manual Token Entry & Simulation Box */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
                <KeyRound className="w-5 h-5 text-blue-500" />
                Manual Token Verification
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                If the patient's phone camera cannot be read, enter the 8-character token shown beneath their QR code.
              </p>

              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Patient Handshake Token
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      placeholder="e.g. bt_secure_token_982a7f01"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-center gap-2 text-rose-700 dark:text-rose-400 text-xs">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Validating Token...
                    </>
                  ) : (
                    'Verify & Access Patient Summary'
                  )}
                </button>
              </form>
            </div>

            {/* Quick Demo Simulator */}
            <div className="bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-transparent border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                Quick Clinical Simulation
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                Test with Demo Patient Tokens
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                Click any pre-generated token below to simulate an authorized patient scan instantly:
              </p>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSimulateScan('bt_secure_token_982a7f01')}
                  className="w-full text-left p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Rahul Sharma</span>
                    <span className="text-slate-500 dark:text-slate-400 ml-2">(45y • High Blood Pressure)</span>
                  </div>
                  <span className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400">bt_secure_token_982a7f01</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSimulateScan('bt_secure_token_331c4b22')}
                  className="w-full text-left p-3 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-cyan-500 transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Ananya Roy</span>
                    <span className="text-slate-500 dark:text-slate-400 ml-2">(32y • Type 2 Diabetes)</span>
                  </div>
                  <span className="font-mono text-[11px] text-cyan-600 dark:text-cyan-400">bt_secure_token_331c4b22</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Authorized Patient Summary View */
        <div className="space-y-6">
          {/* Active Consent Bar */}
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                  Authorized Patient Session Active
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Consent verified via BioTrajectory handshake protocol. Session closes in <strong className="font-mono">{timeLeft}</strong>.
                </p>
              </div>
            </div>

            <button
              onClick={handleCloseSession}
              className="px-4 py-2 rounded-xl bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/60 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-semibold text-xs transition-colors self-start sm:self-center"
            >
              Close Access
            </button>
          </div>

          {/* Patient Card & Vitals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Demographic Card */}
            <div className="bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-bold text-xl flex items-center justify-center">
                  {scanResult.name ? scanResult.name.charAt(0) : 'P'}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {scanResult.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    ID: {scanResult.id} • {scanResult.age} years • {scanResult.gender}
                  </p>
                  <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                    Blood: {scanResult.bloodGroup}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400">Emergency Contact:</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{scanResult.emergencyContact}</p>
                </div>
                <div>
                  <span className="text-slate-400">Primary Health Concern:</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200 mt-0.5">{scanResult.primaryConcern}</p>
                </div>
              </div>
            </div>

            {/* Vitals Summary */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-cyan-500" />
                Recent Vitals & Biometric Trend
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Blood Pressure</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {scanResult.vitals?.bp || '135/85'}
                  </p>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400">Mild Elevation</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Heart Rate</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {scanResult.vitals?.heartRate || '78'} <span className="text-xs font-normal text-slate-500">bpm</span>
                  </p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Normal Sinus</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Oxygen (SpO2)</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {scanResult.vitals?.spo2 || '98'} <span className="text-xs font-normal text-slate-500">%</span>
                  </p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Optimal</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Temperature</span>
                  <p className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                    {scanResult.vitals?.temp || '98.6'} <span className="text-xs font-normal text-slate-500">°F</span>
                  </p>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400">Afebrile</span>
                </div>
              </div>

              {/* Patient Signs & Complaints */}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Active Symptoms Reported by Patient:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {scanResult.symptoms?.map((symp, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      • {symp}
                    </span>
                  )) || (
                    <span className="text-xs text-slate-400">No active acute complaints reported.</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Action Bar */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
              Authorized Clinical Actions for this Session:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => navigate(`/doctor/video-consultation?patientId=${scanResult.id}&name=${encodeURIComponent(scanResult.name)}`)}
                className="p-4 rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50/50 dark:bg-purple-950/20 hover:bg-purple-100/50 dark:hover:bg-purple-900/30 transition-all text-left flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-purple-900 dark:text-purple-200">Start Video Call</h4>
                  <p className="text-[11px] text-purple-700 dark:text-purple-400 mt-0.5">
                    Launch encrypted WebRTC telemedicine room.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/doctor/reports/new?patientId=${scanResult.id}&name=${encodeURIComponent(scanResult.name)}&age=${scanResult.age}&gender=${scanResult.gender}`)}
                className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 transition-all text-left flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-blue-900 dark:text-blue-200">Write Report</h4>
                  <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-0.5">
                    Document 13 clinical fields & digital seal.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/doctor/prescriptions/new?patientId=${scanResult.id}&name=${encodeURIComponent(scanResult.name)}`)}
                className="p-4 rounded-xl border border-teal-200 dark:border-teal-900/40 bg-teal-50/50 dark:bg-teal-950/20 hover:bg-teal-100/50 dark:hover:bg-teal-900/30 transition-all text-left flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300 flex items-center justify-center shrink-0">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-teal-900 dark:text-teal-200">Prescription</h4>
                  <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-0.5">
                    Prescribe medicines with schedule card.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
