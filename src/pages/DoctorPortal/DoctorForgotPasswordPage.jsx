import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function DoctorForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSent(true);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/20 text-white mb-2">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Reset Doctor Password
        </h1>
        <p className="text-[17px] text-slate-600 dark:text-slate-400">
          Enter your registered medical email to receive password recovery instructions.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        {sent ? (
          <div className="text-center space-y-4 py-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Reset Link Dispatched</h3>
            <p className="text-[16px] text-slate-600 dark:text-slate-400">
              We sent a secure password reset link to <strong>{email}</strong>. Check your inbox and follow the steps.
            </p>
            <Link
              to="/doctor/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-[16px] mt-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Doctor Sign In</span>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-[16px]">
            <div className="space-y-2">
              <label className="font-semibold text-slate-700 dark:text-slate-300">Registered Email</label>
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

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[17px] transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Send Reset Instructions</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <div className="text-center pt-2">
              <Link
                to="/doctor/login"
                className="inline-flex items-center gap-2 text-[15px] font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-500"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
