import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Mail,
  Phone,
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building,
  GraduationCap,
  Award,
  Send,
  KeyRound,
  RefreshCw,
  FileCheck,
  UploadCloud,
  Eye,
  EyeOff,
  Undo2,
  BadgeCheck,
  Briefcase
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { USER_ROLES } from '../../context/AuthContext';

const SPECIALIZATIONS_LIST = [
  'Cardiology & Cardiovascular',
  'Nephrology & Kidney Health',
  'Neurology & Cognitive Sciences',
  'Endocrinology & Diabetology',
  'General Internal Medicine',
  'Pulmonology & Respiratory',
  'Gastroenterology & Hepatology',
  'Oncology',
  'Pediatrics & Child Health',
  'Urology',
  'Dermatology',
  'Emergency & Critical Care'
];

export default function DoctorRegisterPage() {
  const navigate = useNavigate();

  // Multi-step controller: 1 (Contact & OTP), 2 (Medical Credentials & Request), 3 (Success)
  const [step, setStep] = useState(1);

  // Step 1: Contact Information & OTP Verification State
  const [fullName, setFullName] = useState('Dr. Marcus Sterling');
  const [email, setEmail] = useState('dr.marcus.sterling@metrohealth.org');
  const [phone, setPhone] = useState('+1 (555) 782-9014');
  const [password, setPassword] = useState('doctor123');
  const [confirmPassword, setConfirmPassword] = useState('doctor123');
  const [showPassword, setShowPassword] = useState(false);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '', '', '']);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Step 2: Professional Credentials & Admission Request State
  const [specialization, setSpecialization] = useState('Cardiology & Cardiovascular');
  const [yearsExperience, setYearsExperience] = useState('8');
  const [registrationNumber, setRegistrationNumber] = useState('MCI-2024-88912');
  const [qualification, setQualification] = useState('MBBS, MD (Cardiology), FACC');
  const [clinic, setClinic] = useState('Metro Heart Institute & Cardiovascular Center');
  const [issuingCouncil, setIssuingCouncil] = useState('National Medical Commission (NMC)');
  const [personalStatement, setPersonalStatement] = useState(
    'Requesting clinical admission to monitor patient vitals trajectories, conduct tele-consultations, and review longitudinal cardiovascular & renal biomarkers.'
  );
  const [uploadedDocument, setUploadedDocument] = useState({
    name: 'State_Medical_Council_License_2024.pdf',
    size: '2.4 MB',
    uploadedAt: 'Just now'
  });

  // UI & Loading States
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationResult, setApplicationResult] = useState(null);

  // OTP Countdown Timer
  useEffect(() => {
    let interval;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  // Handle Send OTP
  const handleSendOtp = () => {
    setError('');
    if (!fullName.trim()) {
      setError('Please enter your full legal name with Dr. prefix.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid official medical email address.');
      return;
    }
    if (!phone.trim()) {
      setError('Please enter your active mobile phone number.');
      return;
    }
    if (password.length < 8) {
      setError('Password must contain at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setIsSendingOtp(true);
    setTimeout(() => {
      // Generate a realistic 6-digit OTP code
      const code = String(Math.floor(100000 + Math.random() * 900000));
      setGeneratedOtp(code);
      setOtpSent(true);
      setOtpTimer(30);
      setIsSendingOtp(false);
    }, 600);
  };

  // Handle single digit OTP change
  const handleOtpBoxChange = (val, index) => {
    const digit = val.slice(-1);
    const newOtp = [...enteredOtp];
    newOtp[index] = digit;
    setEnteredOtp(newOtp);

    // Auto-advance focus to next box
    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Handle Auto-fill for friction-free demo testing
  const handleAutoFillOtp = () => {
    const code = generatedOtp || '849201';
    setEnteredOtp(code.split(''));
    setError('');
  };

  // Verify OTP and proceed to Step 2
  const handleVerifyOtpAndProceed = (e) => {
    e.preventDefault();
    setError('');

    const fullCode = enteredOtp.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    // Accepts generated code or standard demo fallback
    if (fullCode === generatedOtp || fullCode === '123456' || fullCode === '849201') {
      setOtpVerified(true);
      setTimeout(() => {
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 400);
    } else {
      setError('Invalid OTP code. Please enter the code shown in the notification.');
    }
  };

  // Handle Final Submission of Admission Request to Admin
  const handleSubmitAdmissionRequest = (e) => {
    e.preventDefault();
    setError('');

    if (!registrationNumber.trim()) {
      setError('Medical license / registration number is required.');
      return;
    }
    if (!specialization.trim()) {
      setError('Please select your medical specialty.');
      return;
    }
    if (!yearsExperience || Number(yearsExperience) < 1) {
      setError('Please specify your years of medical clinical experience.');
      return;
    }
    if (!qualification.trim()) {
      setError('Please enter your primary medical qualifications & degrees.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const appId = `doc-${Date.now().toString().slice(-4)}`;
      const applicationRef = `BT-REQ-${Math.floor(100000 + Math.random() * 900000)}`;

      const newApplication = {
        id: appId,
        applicationRef,
        name: fullName,
        email,
        phone,
        specialty: specialization,
        yearsExperience: Number(yearsExperience) || 8,
        license: registrationNumber,
        qualification,
        clinic,
        issuingCouncil,
        notes: personalStatement,
        risk: 'Low',
        status: 'Pending review',
        submittedAt: new Date().toISOString(),
        documentName: uploadedDocument.name
      };

      // 1. Save to central applications queue in localStorage for Admin review
      try {
        const existing = JSON.parse(localStorage.getItem('biotrajectory_doctor_applications') || '[]');
        const updated = [newApplication, ...existing.filter((item) => item.id !== appId)];
        localStorage.setItem('biotrajectory_doctor_applications', JSON.stringify(updated));

        // 2. Register user under DOCTOR_PENDING role
        const pendingUser = {
          role: USER_ROLES.DOCTOR_PENDING,
          roleTitle: 'Doctor (Pending Verification)',
          email,
          password,
          name: fullName,
          displayName: fullName,
          uid: appId,
          id: appId,
          emailVerified: true,
          phone,
          registrationNumber,
          specialization,
          qualification,
          clinic,
          claims: {
            role: USER_ROLES.DOCTOR_PENDING,
            medicalRegNumber: registrationNumber,
            clinicName: clinic
          },
          token: `mock_pending_token_${appId}`,
          joinedDate: new Date().toISOString().split('T')[0],
          badge: 'Pending Review',
          description: personalStatement
        };

        localStorage.setItem('biotrajectory-doctor-user', JSON.stringify(pendingUser));
        localStorage.setItem('biotrajectory-auth-user', JSON.stringify(pendingUser));

        // 3. Dispatch cross-component event so Admin dashboard updates live
        window.dispatchEvent(
          new CustomEvent('biotrajectory_doctor_applications_updated', {
            detail: newApplication
          })
        );
      } catch (err) {
        console.error('Storage error:', err);
      }

      setApplicationResult(newApplication);
      setIsSubmitting(false);
      setStep(3);

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // silent
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Top Undo & Navigation Bar */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => {
            if (step === 2) {
              setStep(1);
            } else if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl glass-card text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer shadow-xs active:scale-95 group"
          title="Return to previous screen"
        >
          <Undo2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:-rotate-45 transition-transform" />
          <span>{step === 2 ? 'Back to Contact & OTP' : 'Back to Previous Page'}</span>
        </button>

        <div className="flex items-center gap-3">
          <Link
            to="/doctor/login"
            className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            Doctor Login
          </Link>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <Link
            to="/"
            className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            Home
          </Link>
        </div>
      </div>

      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 shadow-xl shadow-cyan-500/20 text-white mb-1">
          <Stethoscope className="w-8 h-8" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Doctor Registration & Credential Admission
        </h1>
        <p className="text-[16px] text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Join our clinical network. Complete phone & email verification, provide your medical license and specialty, and submit your admission application directly to the Chief Medical Administrator.
        </p>
      </div>

      {/* Step Progress Bar */}
      <div className="max-w-2xl mx-auto p-4 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div
            className={`p-3 rounded-2xl flex items-center justify-center gap-2.5 transition-all ${
              step >= 1
                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold'
                : 'text-slate-400'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                otpVerified || step > 1
                  ? 'bg-emerald-500 text-white'
                  : 'bg-cyan-500 text-slate-950 font-extrabold'
              }`}
            >
              {otpVerified || step > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
            </div>
            <span className="text-xs sm:text-sm">1. Contact & OTP Verification</span>
          </div>

          <div
            className={`p-3 rounded-2xl flex items-center justify-center gap-2.5 transition-all ${
              step >= 2
                ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 font-bold'
                : 'text-slate-400 bg-slate-100/50 dark:bg-slate-900/50'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                step === 3
                  ? 'bg-emerald-500 text-white'
                  : step === 2
                  ? 'bg-cyan-500 text-slate-950 font-extrabold'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {step === 3 ? <CheckCircle2 className="w-4 h-4" /> : '2'}
            </div>
            <span className="text-xs sm:text-sm">2. Specialty & Admission Request</span>
          </div>
        </div>
      </div>

      {/* Main Multi-Step Form Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-600 dark:text-red-400 text-[15px]"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* STEP 1: CONTACT INFORMATION & OTP VERIFICATION */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <KeyRound className="w-6 h-6 text-cyan-500" />
                  <span>Step 1: Contact Details & Phone/Email OTP</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  We verify your phone number and email address to secure clinical patient communications.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 hidden sm:inline-block">
                Verification Required
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Doctor Full Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Full Legal Name (with Medical Title)
                </label>
                <div className="relative">
                  <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Marcus Sterling"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Official Medical Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="doctor@hospital.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Mobile Phone Number (for SMS Alerts)
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 782-9014"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Create Account Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-type password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* OTP Action Card */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      Two-Factor Contact Verification (OTP)
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Receive an SMS and email verification code before credential submission
                    </p>
                  </div>
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-sm shadow-md hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    {isSendingOtp ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    <span>{isSendingOtp ? 'Sending OTP...' : 'Send OTP Code'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={otpTimer > 0}
                    className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline disabled:opacity-50 cursor-pointer"
                  >
                    {otpTimer > 0 ? `Resend OTP in ${otpTimer}s` : 'Resend OTP Code'}
                  </button>
                )}
              </div>

              {/* OTP Delivery Alert & Auto-Fill Demo Helper */}
              {otpSent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800"
                >
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-indigo-950/40 border border-cyan-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-cyan-400 animate-pulse" />
                      </div>
                      <div className="text-xs text-slate-300">
                        <p className="font-bold text-white text-sm">
                          Verification code delivered to {phone} & {email}
                        </p>
                        <p className="text-slate-400">
                          Demo OTP: <strong className="font-mono text-cyan-300 text-sm">{generatedOtp}</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-400 hover:bg-cyan-300 text-slate-950 transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
                    >
                      Auto-Fill Code ({generatedOtp})
                    </button>
                  </div>

                  {/* 6 Digit Input Boxes */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Enter 6-Digit Verification Code
                    </label>
                    <div className="flex items-center gap-2 sm:gap-3 justify-center py-2">
                      {enteredOtp.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-box-${idx}`}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpBoxChange(e.target.value, idx)}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !digit && idx > 0) {
                              const prev = document.getElementById(`otp-box-${idx - 1}`);
                              if (prev) prev.focus();
                            }
                          }}
                          className="w-12 h-14 sm:w-14 sm:h-16 rounded-2xl bg-white dark:bg-[#101827] border-2 border-slate-300 dark:border-slate-700 text-center text-2xl font-extrabold text-slate-900 dark:text-white font-mono focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all shadow-inner"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Proceed to Step 2 Button */}
                  <button
                    type="button"
                    onClick={handleVerifyOtpAndProceed}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-bold text-[17px] transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2 mt-3"
                  >
                    <span>Verify OTP & Continue to Credentials</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </div>

            {/* Footer link to sign-in */}
            <div className="text-center pt-2">
              <p className="text-[15px] text-slate-600 dark:text-slate-400">
                Already registered?{' '}
                <Link
                  to="/doctor/login"
                  className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                >
                  Sign In to Doctor Workspace
                </Link>
              </p>
            </div>
          </motion.div>
        )}

        {/* STEP 2: PROFESSIONAL MEDICAL CREDENTIALS & ADMISSION REQUEST */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="w-6 h-6 text-cyan-500" />
                  <span>Step 2: Medical Specialty & Admission Request</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Enter your clinical specialty, years of experience, and medical license number to send an admission request to the Admin.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Contact Verified
              </span>
            </div>

            {/* Verified Contact Snapshot Pill */}
            <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span>
                  Applicant: <strong className="text-slate-900 dark:text-white">{fullName}</strong> • {email} • {phone}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-cyan-600 dark:text-cyan-400 hover:underline font-bold"
              >
                Edit Contact
              </button>
            </div>

            <form onSubmit={handleSubmitAdmissionRequest} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Medical Specialty */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Primary Medical Specialty
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                    <select
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-semibold cursor-pointer"
                    >
                      {SPECIALIZATIONS_LIST.map((spec) => (
                        <option key={spec} value={spec}>
                          {spec}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Popular Specialty Quick Chips */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {['Cardiology', 'Nephrology', 'Internal Medicine', 'Endocrinology', 'Neurology'].map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        onClick={() => {
                          const match = SPECIALIZATIONS_LIST.find((s) => s.includes(chip)) || chip;
                          setSpecialization(match);
                        }}
                        className={`text-xs px-3 py-1 rounded-xl transition-all cursor-pointer ${
                          specialization.includes(chip)
                            ? 'bg-cyan-500 text-slate-950 font-bold shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Years of Clinical Experience */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Years of Clinical Practice Experience
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="number"
                      min="1"
                      max="60"
                      required
                      placeholder="e.g. 8"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono font-bold"
                    />
                  </div>
                  {/* Experience quick buttons */}
                  <div className="flex gap-2 pt-1">
                    {[3, 5, 8, 12, 15].map((yrs) => (
                      <button
                        key={yrs}
                        type="button"
                        onClick={() => setYearsExperience(String(yrs))}
                        className={`text-xs px-2.5 py-0.5 rounded-lg border font-mono transition-colors cursor-pointer ${
                          yearsExperience === String(yrs)
                            ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-500'
                            : 'border-slate-300 dark:border-slate-700 text-slate-500 hover:text-white'
                        }`}
                      >
                        {yrs}y
                      </button>
                    ))}
                  </div>
                </div>

                {/* Medical License / Registration Number */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Medical Council License / Reg Number
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. MCI-2024-88912"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono font-bold uppercase"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    State or National Medical Commission Registry Number
                  </p>
                </div>

                {/* Medical Qualifications & Degrees */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Degrees & Fellowships
                  </label>
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. MBBS, MD, DM, FACC"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                    />
                  </div>
                </div>

                {/* Current Hospital / Clinic */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Hospital or Clinic Affiliation
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Metro Heart Institute"
                      value={clinic}
                      onChange={(e) => setClinic(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                    />
                  </div>
                </div>

                {/* Issuing Medical Council */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Issuing Authority / State Medical Board
                  </label>
                  <input
                    type="text"
                    value={issuingCouncil}
                    onChange={(e) => setIssuingCouncil(e.target.value)}
                    placeholder="e.g. National Medical Commission / General Medical Council"
                    className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                  />
                </div>

                {/* Mock License Document Upload */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Medical License Certificate (Digital Scan / PDF)
                  </label>
                  <div className="p-4 rounded-2xl border-2 border-dashed border-cyan-500/40 bg-slate-50/50 dark:bg-[#070B14]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                        <FileCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          {uploadedDocument.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {uploadedDocument.size} • Verified file signature attached
                        </p>
                      </div>
                    </div>
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 cursor-pointer transition-colors shadow-xs shrink-0">
                      <UploadCloud className="w-4 h-4 text-cyan-500" />
                      <span>Replace Document</span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            const file = e.target.files[0];
                            setUploadedDocument({
                              name: file.name,
                              size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                              uploadedAt: 'Just now'
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Admission Statement to Admin */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Admission Statement & Practice Focus (Sent to Admin)
                  </label>
                  <textarea
                    rows={3}
                    value={personalStatement}
                    onChange={(e) => setPersonalStatement(e.target.value)}
                    placeholder="Provide details on clinical goals, patient scope, and medical consultation interests..."
                    className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm leading-relaxed"
                  />
                </div>
              </div>

              {/* Administrative Notice */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3.5 text-xs text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p>
                  <strong>Admin Verification Policy:</strong> Your submission immediately logs in the Administrator's Doctor Verification Queue. Once the admin cross-verifies your license number with the medical registry, full clinical consult rights and e-prescription issuance will unlock.
                </p>
              </div>

              {/* Navigation Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous Step</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-indigo-500 text-slate-950 font-extrabold text-[16px] transition-all shadow-xl shadow-cyan-500/20 active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2.5"
                >
                  {isSubmitting ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  <span>{isSubmitting ? 'Submitting to Admin...' : 'Send Admission Request to Admin'}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 3: ADMISSION REQUEST SENT CONFIRMATION SCREEN */}
        {step === 3 && applicationResult && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 text-center py-4"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 shadow-xl shadow-emerald-500/20 mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">
                Admission Request Dispatched
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Admission Request Sent to Admin!
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                Thank you, <strong>{fullName}</strong>. Your credential application has been submitted and is currently in the Chief Medical Administrator's review queue.
              </p>
            </div>

            {/* Application Summary Card */}
            <div className="max-w-xl mx-auto p-6 rounded-3xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-left space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs text-slate-500 dark:text-slate-400">Application Reference ID:</span>
                <span className="font-mono font-bold text-sm text-cyan-600 dark:text-cyan-400">
                  {applicationResult.applicationRef}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Doctor Name:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{applicationResult.name}</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Medical Specialty:</span>
                  <p className="font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">{applicationResult.specialty}</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Years of Experience:</span>
                  <p className="font-bold text-slate-900 dark:text-white mt-0.5">{applicationResult.yearsExperience} Years</p>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">License Number:</span>
                  <p className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">{applicationResult.license}</p>
                </div>
                <div className="col-span-2 pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Current Status:</span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Pending Admin Review
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps Card */}
            <div className="max-w-xl mx-auto p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/40 text-xs text-left space-y-2 text-slate-700 dark:text-slate-300">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <BadgeCheck className="w-4 h-4 text-cyan-500" />
                <span>Next Verification Steps:</span>
              </h4>
              <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-400">
                <li>Your license is matched against national medical registry archives.</li>
                <li>You will receive an automated email confirmation upon review completion.</li>
                <li>You can access your pending workspace now to review clinical workflows.</li>
              </ul>
            </div>

            {/* Navigation Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <Link
                to="/admin/doctor-verification"
                className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>View in Admin Review Queue (Demo)</span>
              </Link>

              <Link
                to="/doctor/login"
                className="px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <span>Doctor Portal Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
