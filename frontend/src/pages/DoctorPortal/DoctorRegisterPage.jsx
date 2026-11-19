
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Mail,
  Phone,
  Lock,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Building,
  GraduationCap,
  Award,
  Send,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';

import { FirebaseService, auth } from '../../services/firebase';
import { doctorApi } from '../../services/doctorApi';

// Development-only email verification bypass.
// This is disabled automatically in production builds.
const DEV_EMAIL_VERIFICATION_BYPASS =
  import.meta.env.DEV &&
  import.meta.env.VITE_SKIP_DOCTOR_EMAIL_VERIFICATION === 'true';

const SPECIALIZATIONS = [
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

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [checkingVerification, setCheckingVerification] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [applicationResult, setApplicationResult] = useState(null);

  const [account, setAccount] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [medical, setMedical] = useState({
    registrationNumber: '',
    issuingCouncil: '',
    qualification: '',
    specialization: '',
    clinicName: ''
  });

  const updateAccount = (event) => {
    setAccount({
      ...account,
      [event.target.name]: event.target.value
    });
  };

  const updateMedical = (event) => {
    setMedical({
      ...medical,
      [event.target.name]: event.target.value
    });
  };

  const validateAccount = () => {
    if (!account.fullName.trim()) {
      return 'Please enter your full legal name.';
    }

    if (!account.email.trim() || !account.email.includes('@')) {
      return 'Please enter a valid email address.';
    }

    if (!account.phone.trim()) {
      return 'Please enter your phone number.';
    }

    if (account.password.length < 8) {
      return 'Password must contain at least 8 characters.';
    }

    if (account.password !== account.confirmPassword) {
      return 'Passwords do not match.';
    }

    return null;
  };

  // STEP 1: Create Firebase account.
  const handleCreateAccount = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    const validationError = validateAccount();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await FirebaseService.signUp(
        account.email,
        account.password,
        account.fullName
      );

      setSuccess(
        DEV_EMAIL_VERIFICATION_BYPASS
          ? 'Account created successfully. You can continue with development email verification bypass enabled.'
          : 'Account created. A verification email has been sent to your email address.'
      );

      setStep(2);

    } catch (err) {
      console.error('Doctor account creation failed:', err);

      const messages = {
        'auth/email-already-in-use':
          'An account already exists with this email. Please sign in instead.',

        'auth/invalid-email':
          'Please enter a valid email address.',

        'auth/weak-password':
          'Your password is too weak. Use at least 8 characters.'
      };

      setError(
        messages[err.code] ||
        err.message ||
        'Could not create your account.'
      );

    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify email or continue using development bypass.
  const handleCheckVerification = async () => {
    setError('');
    setSuccess('');
    setCheckingVerification(true);

    try {
      if (DEV_EMAIL_VERIFICATION_BYPASS) {
        setSuccess(
          'Development mode: email verification skipped. Medical credentials still require admin review.'
        );

        setStep(3);
        return;
      }

      const result = await FirebaseService.reloadCurrentUser();

      if (!result.emailVerified) {
        setError(
          'Your email is not verified yet. Open the verification link in your inbox, then try again.'
        );

        return;
      }

      setSuccess('Email verified successfully.');
      setStep(3);

    } catch (err) {
      console.error('Email verification check failed:', err);

      setError(
        err.message || 'Could not verify your email.'
      );

    } finally {
      setCheckingVerification(false);
    }
  };

  // Resend Firebase verification email.
  const handleResendVerification = async () => {
    setError('');
    setSuccess('');

    try {
      await FirebaseService.sendVerificationEmail();

      setSuccess('A new verification email has been sent.');

    } catch (err) {
      setError(
        err.message || 'Could not resend verification email.'
      );
    }
  };

  // STEP 3: Submit medical application to backend.
  const handleSubmitApplication = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!auth?.currentUser) {
      setError('Your session has expired. Please sign in again.');
      return;
    }

    // Email verification is bypassed only in local development.
    if (
      !auth.currentUser.emailVerified &&
      !DEV_EMAIL_VERIFICATION_BYPASS
    ) {
      setError('Please verify your email before submitting.');
      setStep(2);
      return;
    }

    if (!medical.registrationNumber.trim()) {
      setError('Medical registration number is required.');
      return;
    }

    if (!medical.issuingCouncil.trim()) {
      setError('Please enter your issuing medical council.');
      return;
    }

    if (!medical.qualification.trim()) {
      setError('Please enter your medical qualification.');
      return;
    }

    if (!medical.specialization) {
      setError('Please select your specialization.');
      return;
    }

    setLoading(true);

    try {
      const response = await doctorApi.submitApplication({
        full_name: account.fullName.trim(),
        phone: account.phone.trim(),
        registration_number: medical.registrationNumber.trim(),
        issuing_council: medical.issuingCouncil.trim(),
        qualification: medical.qualification.trim(),
        specialization: medical.specialization,
        clinic_name: medical.clinicName.trim() || null
      });

      setApplicationResult(response);

      setSuccess(
        response.message || 'Application submitted successfully.'
      );

      setStep(4);

    } catch (err) {
      console.error('Doctor application submission failed:', err);

      setError(
        err.message || 'Unable to submit your application.'
      );

    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-[#1F150E] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm';

  const labelClass =
    'block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2';

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <button
          type="button"
          onClick={() => {
            if (step > 1 && step < 4) {
              setStep(step - 1);
            } else {
              navigate('/');
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <Link
          to="/doctor/login"
          className="text-sm font-semibold text-cyan-600 dark:text-cyan-400"
        >
          Already registered? Sign in
        </Link>

      </div>

      {/* PAGE HEADING */}
      <div className="text-center space-y-3">

        <div className="inline-flex p-4 rounded-2xl bg-cyan-500/10 text-cyan-500">
          <Stethoscope className="w-9 h-9" />
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Doctor Registration
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Create your account and submit your medical credentials for verification.
        </p>

      </div>

      {/* PROGRESS */}
      <div className="grid grid-cols-3 gap-2">

        {[
          'Account',
          'Email verification',
          'Medical credentials'
        ].map((label, index) => (

          <div
            key={label}
            className={`p-3 rounded-xl text-center text-xs font-bold ${
              step >= index + 1
                ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
            }`}
          >
            {index + 1}. {label}
          </div>

        ))}

      </div>

      {/* ERROR */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 flex gap-3 text-sm">

          <AlertTriangle className="w-5 h-5 shrink-0" />

          <p>{error}</p>

        </div>
      )}

      {/* SUCCESS */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 flex gap-3 text-sm">

          <CheckCircle2 className="w-5 h-5 shrink-0" />

          <p>{success}</p>

        </div>
      )}

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#2B1E15] border border-slate-200 dark:border-slate-800 shadow-xl"
      >

        {/* STEP 1: ACCOUNT CREATION */}
        {step === 1 && (

          <form onSubmit={handleCreateAccount} className="space-y-5">

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Create your account
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Use an email address you can access.
              </p>
            </div>

            <div>
              <label className={labelClass}>
                Full legal name
              </label>

              <div className="relative">

                <Stethoscope className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                <input
                  required
                  name="fullName"
                  value={account.fullName}
                  onChange={updateAccount}
                  placeholder="Dr. Full Name"
                  className={`${inputClass} pl-10`}
                />

              </div>
            </div>

            <div>
              <label className={labelClass}>
                Email address
              </label>

              <div className="relative">

                <Mail className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                <input
                  required
                  type="email"
                  name="email"
                  value={account.email}
                  onChange={updateAccount}
                  placeholder="doctor@example.com"
                  className={`${inputClass} pl-10`}
                />

              </div>
            </div>

            <div>
              <label className={labelClass}>
                Phone number
              </label>

              <div className="relative">

                <Phone className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                <input
                  required
                  type="tel"
                  name="phone"
                  value={account.phone}
                  onChange={updateAccount}
                  placeholder="+91..."
                  className={`${inputClass} pl-10`}
                />

              </div>
            </div>

            <div>
              <label className={labelClass}>
                Password
              </label>

              <div className="relative">

                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                <input
                  required
                  minLength={8}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={account.password}
                  onChange={updateAccount}
                  placeholder="Minimum 8 characters"
                  className={`${inputClass} pl-10 pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-slate-400"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>

              </div>
            </div>

            <div>
              <label className={labelClass}>
                Confirm password
              </label>

              <input
                required
                type="password"
                name="confirmPassword"
                value={account.confirmPassword}
                onChange={updateAccount}
                placeholder="Re-enter your password"
                className={inputClass}
              />

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-extrabold flex items-center justify-center gap-2 disabled:opacity-50"
            >

              {loading
                ? <RefreshCw className="w-5 h-5 animate-spin" />
                : <Mail className="w-5 h-5" />
              }

              {loading
                ? 'Creating account...'
                : DEV_EMAIL_VERIFICATION_BYPASS
                  ? 'Create account'
                  : 'Create account & send verification email'
              }

            </button>

          </form>

        )}

        {/* STEP 2: EMAIL VERIFICATION */}
        {step === 2 && (

          <div className="space-y-6 text-center">

            <div className="mx-auto w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
              <Mail className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Verify your email address
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              We sent a verification link to:
            </p>

            <p className="font-bold text-cyan-600 dark:text-cyan-400">
              {auth?.currentUser?.email || account.email}
            </p>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Open the email, click its verification link, return to this page,
              and then check your verification status.
            </p>

            {DEV_EMAIL_VERIFICATION_BYPASS && (

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-sm">

                Development mode: email verification is optional for local testing.
                Admin medical credential approval is still required.

              </div>

            )}

            <button
              type="button"
              onClick={handleCheckVerification}
              disabled={checkingVerification}
              className="w-full py-4 rounded-xl bg-cyan-500 text-slate-950 font-extrabold flex items-center justify-center gap-2 disabled:opacity-50"
            >

              {checkingVerification
                ? <RefreshCw className="w-5 h-5 animate-spin" />
                : <CheckCircle2 className="w-5 h-5" />
              }

              {checkingVerification
                ? 'Checking...'
                : DEV_EMAIL_VERIFICATION_BYPASS
                  ? 'Continue without email verification (development)'
                  : 'I have verified my email'
              }

            </button>

            {!DEV_EMAIL_VERIFICATION_BYPASS && (

              <button
                type="button"
                onClick={handleResendVerification}
                className="text-sm font-semibold text-cyan-600 dark:text-cyan-400"
              >
                Resend verification email
              </button>

            )}

          </div>

        )}

        {/* STEP 3: MEDICAL CREDENTIALS */}
        {step === 3 && (

          <form onSubmit={handleSubmitApplication} className="space-y-6">

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Medical credentials
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Enter your medical registration information accurately.
              </p>
            </div>

            <div>
              <label className={labelClass}>
                Medical registration number
              </label>

              <div className="relative">

                <Award className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                <input
                  required
                  name="registrationNumber"
                  value={medical.registrationNumber}
                  onChange={updateMedical}
                  placeholder="Medical council registration number"
                  className={`${inputClass} pl-10`}
                />

              </div>
            </div>

            <div>
              <label className={labelClass}>
                Issuing medical council
              </label>

              <div className="relative">

                <ShieldCheck className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                <input
                  required
                  name="issuingCouncil"
                  value={medical.issuingCouncil}
                  onChange={updateMedical}
                  placeholder="e.g. National Medical Commission"
                  className={`${inputClass} pl-10`}
                />

              </div>
            </div>

            <div>
              <label className={labelClass}>
                Qualification
              </label>

              <div className="relative">

                <GraduationCap className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                <input
                  required
                  name="qualification"
                  value={medical.qualification}
                  onChange={updateMedical}
                  placeholder="e.g. MBBS, MD"
                  className={`${inputClass} pl-10`}
                />

              </div>
            </div>

            <div>
              <label className={labelClass}>
                Specialization
              </label>

              <select
                required
                name="specialization"
                value={medical.specialization}
                onChange={updateMedical}
                className={inputClass}
              >

                <option value="">
                  Select specialization
                </option>

                {SPECIALIZATIONS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}

              </select>
            </div>

            <div>
              <label className={labelClass}>
                Clinic / Hospital name (optional)
              </label>

              <div className="relative">

                <Building className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                <input
                  name="clinicName"
                  value={medical.clinicName}
                  onChange={updateMedical}
                  placeholder="Clinic or hospital name"
                  className={`${inputClass} pl-10`}
                />

              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-slate-600 dark:text-slate-300">

              <div className="flex gap-2 font-bold mb-2">

                <ShieldCheck className="w-5 h-5 text-amber-500" />

                Manual medical credential review

              </div>

              Your application will remain pending until an administrator
              reviews your registration details. Email verification does
              not verify your medical licence.

            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-extrabold flex items-center justify-center gap-2 disabled:opacity-50"
            >

              {loading
                ? <RefreshCw className="w-5 h-5 animate-spin" />
                : <Send className="w-5 h-5" />
              }

              {loading
                ? 'Submitting application...'
                : 'Submit for admin verification'
              }

            </button>

          </form>

        )}

        {/* STEP 4: APPLICATION SUBMITTED */}
        {step === 4 && (

          <div className="space-y-6 text-center py-4">

            <div className="mx-auto w-20 h-20 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-11 h-11" />
            </div>

            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">

              <Clock className="w-4 h-4" />

              Pending admin review

            </span>

            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Application submitted
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your medical application has been submitted successfully.
              Your account will receive doctor access only after admin approval.
            </p>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#1F150E] border border-slate-200 dark:border-slate-800 text-left space-y-3">

              <div className="flex justify-between gap-3 text-sm">
                <span className="text-slate-500">Name</span>

                <strong className="text-slate-900 dark:text-white">
                  {account.fullName}
                </strong>
              </div>

              <div className="flex justify-between gap-3 text-sm">
                <span className="text-slate-500">Registration number</span>

                <strong className="text-slate-900 dark:text-white">
                  {medical.registrationNumber}
                </strong>
              </div>

              <div className="flex justify-between gap-3 text-sm">
                <span className="text-slate-500">Specialization</span>

                <strong className="text-slate-900 dark:text-white text-right">
                  {medical.specialization}
                </strong>
              </div>

              <div className="flex justify-between gap-3 text-sm">
                <span className="text-slate-500">Application status</span>

                <strong className="text-amber-600">
                  {applicationResult?.status || 'PENDING'}
                </strong>
              </div>

            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <button
                type="button"
                onClick={() => navigate('/doctor/pending')}
                className="flex-1 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold"
              >
                Go to pending dashboard
              </button>

              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-white font-bold"
              >
                Return home
              </button>

            </div>

          </div>

        )}

      </motion.div>

      <p className="text-center text-xs text-slate-400">
        BioTrajectory secure medical account registration
      </p>

    </div>
  );
}
