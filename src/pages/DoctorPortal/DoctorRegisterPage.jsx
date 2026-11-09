import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Mail,
  Lock,
  Phone,
  Building,
  GraduationCap,
  Award,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';

export default function DoctorRegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [specialization, setSpecialization] = useState('Cardiology');
  const [qualification, setQualification] = useState('');
  const [clinic, setClinic] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { registerDoctor } = useDoctorAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify both password fields.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      await registerDoctor({
        fullName,
        email,
        phone,
        registrationNumber,
        specialization,
        qualification,
        clinic,
        password
      });

      // Navigate to dashboard where DOCTOR_PENDING banner will guide verification
      navigate('/doctor/dashboard');
    } catch (err) {
      setError('Registration failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  const specializationsList = [
    'Cardiology',
    'General Internal Medicine',
    'Pulmonology & Respiratory',
    'Endocrinology & Diabetology',
    'Nephrology',
    'Oncology',
    'Gastroenterology',
    'Pediatrics',
    'Emergency Medicine'
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-16 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/20 text-white mb-2">
          <Stethoscope className="w-8 h-8" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Doctor Registration & Credential Verification
        </h1>
        <p className="text-[17px] text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Register your medical credentials. To ensure patient safety, new doctor accounts undergo medical license review before clinical features are activated.
        </p>
      </div>

      {/* Main Registration Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-600 dark:text-red-400 text-[15px]">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p>
            <strong>Credential Verification Rule:</strong> You cannot self-assign a verified doctor role. Your state medical registration number will be authenticated against the national medical council registry.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5 text-[16px]">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
              <input
                type="text"
                required
                placeholder="Dr. Eleanor Vance"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Official Medical Email</label>
              <input
                type="email"
                required
                placeholder="eleanor@metrohealth.org"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Phone */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 439-0192"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            {/* Medical Registration Number */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Medical Registration Number</label>
              <input
                type="text"
                required
                placeholder="e.g. MED-REG-2019-9941"
                value={registrationNumber}
                onChange={e => setRegistrationNumber(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Specialization */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Medical Specialization</label>
              <select
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
              >
                {specializationsList.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Qualification */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Qualification & Degrees</label>
              <input
                type="text"
                required
                placeholder="e.g. MBBS, MD, FACC"
                value={qualification}
                onChange={e => setQualification(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Clinic / Hospital Name */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 dark:text-slate-300">Clinic or Hospital Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Memorial Cardiology Institute / City Care Hospital"
              value={clinic}
              onChange={e => setClinic(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <input
                type="password"
                required
                placeholder="Min 8 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
              <input
                type="password"
                required
                placeholder="Re-type password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-[18px] transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            <span>{loading ? 'Submitting Credentials...' : 'Submit Doctor Registration'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[16px] text-slate-600 dark:text-slate-400">
            Already registered?{' '}
            <Link
              to="/doctor/login"
              className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Sign In to Doctor Workspace
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
