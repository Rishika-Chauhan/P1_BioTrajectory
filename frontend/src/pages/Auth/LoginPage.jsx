import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  User,
  Copy,
  Check,
  ChevronRight,
  Undo2
} from 'lucide-react';
import { useAuth, getDashboardPath, USER_ROLES } from '../../context/AuthContext';
import BrandLogo from '../../components/common/BrandLogo';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [detectedRoleNotice, setDetectedRoleNotice] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const { login, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const redirectPath = getDashboardPath(currentUser.role);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleCopy = (text, key, e) => {
    e?.stopPropagation();
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleDirectDemoLogin = async (demoUser) => {
    setError('');
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setIsLoading(true);

    try {
      const user = await login(demoUser.email, demoUser.password, true);

      if (user) {
        const roleLabel =
          user.role === USER_ROLES.ADMIN
            ? 'Administrator'
            : user.role === USER_ROLES.DOCTOR
            ? 'Verified Physician'
            : user.role === USER_ROLES.DOCTOR_PENDING
            ? 'Doctor (Verification Pending)'
            : 'Patient';

        setDetectedRoleNotice(`Role Detected: ${roleLabel}. Redirecting to your workspace...`);

        const destination = getDashboardPath(user.role);
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 500);
      } else {
        setError('Authentication failed. Please verify demo credentials.');
      }
    } catch {
      setError('Authentication failed. Please check connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setDetectedRoleNotice(null);

    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password, rememberMe);

      if (user) {
        const roleLabel =
          user.role === USER_ROLES.ADMIN
            ? 'Administrator'
            : user.role === USER_ROLES.DOCTOR
            ? 'Verified Physician'
            : user.role === USER_ROLES.DOCTOR_PENDING
            ? 'Doctor (Verification Pending)'
            : user.role === USER_ROLES.DOCTOR_SUSPENDED
            ? 'Doctor (Clinical Access Suspended)'
            : user.role === USER_ROLES.USER
            ? 'Patient'
            : 'Unassigned Account';

        setDetectedRoleNotice(`Role Detected: ${roleLabel}. Redirecting to your authorized workspace...`);

        const destination = getDashboardPath(user.role);
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, 600);
      } else {
        setError('Invalid login credentials. Please check your email and password.');
      }
    } catch {
      setError('Authentication failed. Please verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutoFill = (testEmail, testPass = 'password123') => {
    setEmail(testEmail);
    setPassword(testPass);
    setError('');
  };

  return (
    <div className="w-full min-h-[90vh] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-grid-medical">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/15 blur-[130px] pointer-events-none rounded-full animate-orb-drift" />
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="w-full max-w-xl space-y-6 relative z-10">
        
        {/* Single Clean Back Navigation Bar */}
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
            title="Go back to previous page"
          >
            <Undo2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Previous Page</span>
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
          >
            <span>Home</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center pb-1">
            <BrandLogo size="lg" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">
            Sign In to BioTrajectory
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            One unified login for patients, physicians, and platform administrators.
          </p>
        </div>

        {/* Demo Credentials Quick Access Card */}
        <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#0c1425]/90 border border-cyan-500/30 dark:border-cyan-500/20 backdrop-blur-md shadow-xl shadow-cyan-500/5 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
                Instant Demo Logins
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Click to autofill or sign in
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Admin Demo */}
            <div
              onClick={() => handleAutoFill('admin@biotrajectory.health', 'admin123')}
              className="p-3 rounded-2xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-all cursor-pointer group flex flex-col justify-between text-left"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopy('admin@biotrajectory.health', 'admin_email', e)}
                    className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 p-0.5"
                    title="Copy Email"
                  >
                    {copiedKey === 'admin_email' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  admin@biotrajectory.health
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  admin123
                </p>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDirectDemoLogin({
                    email: 'admin@biotrajectory.health',
                    password: 'admin123'
                  });
                }}
                className="mt-2.5 w-full py-1.5 px-2 rounded-xl text-[11px] font-bold bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Login Admin</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Doctor Demo */}
            <div
              onClick={() => handleAutoFill('doctor@biotrajectory.health', 'doctor123')}
              className="p-3 rounded-2xl border border-teal-500/20 bg-teal-500/5 hover:bg-teal-500/10 transition-all cursor-pointer group flex flex-col justify-between text-left"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-500/20 text-teal-700 dark:text-teal-300">
                    <Stethoscope className="w-3 h-3" /> Doctor
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopy('doctor@biotrajectory.health', 'doc_email', e)}
                    className="text-slate-400 hover:text-teal-600 dark:hover:text-teal-300 p-0.5"
                    title="Copy Email"
                  >
                    {copiedKey === 'doc_email' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  doctor@biotrajectory.health
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  doctor123
                </p>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDirectDemoLogin({
                    email: 'doctor@biotrajectory.health',
                    password: 'doctor123'
                  });
                }}
                className="mt-2.5 w-full py-1.5 px-2 rounded-xl text-[11px] font-bold bg-teal-600 hover:bg-teal-500 text-white transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Login Doctor</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Patient Demo */}
            <div
              onClick={() => handleAutoFill('patient@biotrajectory.health', 'patient123')}
              className="p-3 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all cursor-pointer group flex flex-col justify-between text-left"
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
                    <User className="w-3 h-3" /> Patient
                  </span>
                  <button
                    type="button"
                    onClick={(e) => handleCopy('patient@biotrajectory.health', 'pat_email', e)}
                    className="text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 p-0.5"
                    title="Copy Email"
                  >
                    {copiedKey === 'pat_email' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                  patient@biotrajectory.health
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  patient123
                </p>
              </div>
              <button
                type="button"
                disabled={isLoading}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDirectDemoLogin({
                    email: 'patient@biotrajectory.health',
                    password: 'patient123'
                  });
                }}
                className="mt-2.5 w-full py-1.5 px-2 rounded-xl text-[11px] font-bold bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Login Patient</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Common Login Card */}
        <div className="p-8 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {detectedRoleNotice && (
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{detectedRoleNotice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@biotrajectory.health"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-[#070B14] border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-0"
              />
              <label htmlFor="rememberMe" className="ml-2 text-xs text-slate-600 dark:text-slate-400">
                Remember this device for 30 days
              </label>
            </div>

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 transition-all shadow-md shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <span>{isLoading ? 'Authenticating & Verifying Claims...' : 'Login'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Register Link / Button */}
            <div className="pt-2 text-center">
              <Link
                to="/register"
                className="w-full inline-block py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
              >
                Don't have an account? Register as Patient
              </Link>
            </div>
          </form>

        </div>

        {/* Security disclaimer */}
        <DisclaimerBanner text="Protected by BioTrajectory Role-Based Access Control and trusted token verification." />
      </div>
    </div>
  );
}
