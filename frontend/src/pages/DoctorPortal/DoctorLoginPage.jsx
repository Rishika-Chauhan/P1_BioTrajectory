import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  Undo2
} from 'lucide-react';
import { useDoctorAuth } from '../../context/DoctorAuthContext';

export default function DoctorLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { loginDoctor } = useDoctorAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await loginDoctor(email, password);
      if (user) {
        navigate('/doctor/dashboard');
      } else {
        setError('Invalid medical credentials. Please check your email and password.');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoVerifiedLogin = async () => {
    await loginDoctor('doctor@biotrajectory.health', 'doctor123');
    navigate('/doctor/dashboard');
  };

  const handleDemoPendingLogin = async () => {
    await loginDoctor('doctor.pending@biotrajectory.health', 'doctor123');
    navigate('/doctor/pending');
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-12 space-y-6">
      
      {/* Navigation & Undo Bar */}
      <div className="flex items-center justify-between px-1">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl glass-card text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 transition-all cursor-pointer shadow-xs active:scale-95 group"
          title="Undo and return to previous page"
        >
          <Undo2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:-rotate-45 transition-transform" />
          <span>Back to Previous Page</span>
        </button>

        <Link
          to="/"
          className="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
        >
          Home
        </Link>
      </div>

      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/20 text-white mb-2">
          <Stethoscope className="w-8 h-8" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Doctor Clinical Portal
        </h1>
        <p className="text-[17px] text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Secure, verified access for licensed medical practitioners to consult and review patient vitals.
        </p>
      </div>

      {/* Main Login Card */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        
        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-600 dark:text-red-400 text-[15px]">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 text-[16px]">
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 dark:text-slate-300">
              Registered Medical Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="doctor@hospital.org"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link
                to="/doctor/forgot-password"
                className="text-[15px] font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B14] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-[18px] transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In as Doctor'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        {/* Demo Doctor Quick Sign In Options */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
            Development & Clinical Demo Testing
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleDemoVerifiedLogin}
              className="py-3 px-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold text-[15px] hover:bg-emerald-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Login as Verified MD</span>
            </button>
            <button
              type="button"
              onClick={handleDemoPendingLogin}
              className="py-3 px-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-[15px] hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Login as Pending MD</span>
            </button>
          </div>
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-mono">
            Verified: doctor@biotrajectory.health • Password: doctor123
          </p>
        </div>

        {/* Registration Link */}
        <div className="text-center pt-2">
          <p className="text-[16px] text-slate-600 dark:text-slate-400">
            Are you a licensed doctor without an account?{' '}
            <Link
              to="/doctor/register"
              className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Register for Credential Verification
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
