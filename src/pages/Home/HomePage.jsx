import React from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  ChevronRight,
  Heart,
  Footprints,
  Clock,
  Droplets,
  MessageSquare,
  Stethoscope,
  Sparkles,
  HelpCircle,
  UserCheck
} from 'lucide-react';
import MedicalSphere3D from '../../components/common/MedicalSphere3D';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function HomePage() {
  return (
    <div className="w-full flex flex-col items-center overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative w-full min-h-[85vh] flex items-center justify-center pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-500/10 via-blue-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[15px] font-bold bg-cyan-500/10 border border-cyan-500/25 text-cyan-600 dark:text-cyan-400">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Easy Health Tracking</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Your Health Is More Than <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500">a Number.</span>
            </h1>

            <p className="text-[19px] sm:text-[21px] text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Understand your health journey through intelligent monitoring, personal health timelines and AI-powered insights.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/explore"
                className="flex items-center gap-2 px-7 py-4 rounded-2xl text-[17px] font-bold text-slate-900 dark:text-white border-2 border-cyan-500/60 hover:bg-cyan-500/10 transition-all cursor-pointer"
              >
                <span>Explore BioTrajectory</span>
                <ChevronRight className="w-5 h-5 text-cyan-400" />
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-2 px-7 py-4 rounded-2xl text-[17px] font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/25 active:scale-95 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-cyan-500 dark:text-cyan-400">Simple</p>
                <p className="text-[15px] text-slate-600 dark:text-slate-400 font-medium">Everyday Language</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-500 dark:text-blue-400">Private</p>
                <p className="text-[15px] text-slate-600 dark:text-slate-400 font-medium">Your Data Is Yours</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-500 dark:text-emerald-400">Verified</p>
                <p className="text-[15px] text-slate-600 dark:text-slate-400 font-medium">Reliable Guidelines</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual: 3D Medical Sphere */}
          <div className="lg:col-span-6 w-full flex items-center justify-center">
            <MedicalSphere3D />
          </div>
        </div>
      </section>

      {/* 2. HEALTHCARE PROBLEMS SECTION */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#070B14]/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[15px] font-bold uppercase tracking-widest text-red-500 dark:text-red-400">
              The Common Problem
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Why Once-a-Year Tests Can Miss Early Warnings
            </h2>
            <p className="text-[18px] sm:text-[19px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Most people only get checked when they feel sick or visit the doctor once a year. But health changes happen gradually over time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Just One Test at a Time</h3>
              <p className="text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed">
                A single blood pressure check at a rushed clinic visit doesn't show your real everyday picture.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Hard to See the Trend</h3>
              <p className="text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Daily steps, blood pressure numbers, and test reports stay scattered in different places, making it hard to notice gradual changes.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Finding Out Too Late</h3>
              <p className="text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Conditions like high blood pressure or high blood sugar develop quietly without early pain or obvious signs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR SOLUTION SECTION */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full text-[15px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              The BioTrajectory Solution
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              See Where Your Health Is Heading Over Time
            </h2>

            <p className="text-[18px] sm:text-[19px] text-slate-600 dark:text-slate-300 leading-relaxed">
              BioTrajectory helps you keep track of your daily body signals and connects the dots into an easy-to-read personal health story.
            </p>

            <ul className="space-y-4 pt-2">
              {[
                'Separate, easy charts for blood pressure, steps, and hydration',
                'Notices gradual changes early, before they become serious problems',
                'Simple summaries you can take to your next doctor visit',
                'Clear explanations in everyday language without medical confusion'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3.5 text-[17px] text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Simple Visual Card */}
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#101827] to-[#131E30] border border-cyan-500/30 shadow-2xl text-white space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <span className="text-[16px] font-bold text-cyan-400">Your Health Overview</span>
              <span className="text-[15px] text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Healthy & Stable
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#070B14]/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[15px] text-slate-400">Blood Pressure</p>
                  <p className="text-2xl font-bold text-cyan-300">121 / 78 <span className="text-[15px] font-normal text-slate-400">mmHg</span></p>
                </div>
                <span className="text-[15px] font-bold text-emerald-400">Normal</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#070B14]/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[15px] text-slate-400">Daily Steps</p>
                  <p className="text-2xl font-bold text-emerald-400">9,240 <span className="text-[15px] font-normal text-slate-400">steps</span></p>
                </div>
                <span className="text-[15px] font-bold text-cyan-400">Goal Reached</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#070B14]/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[15px] text-slate-400">Urine Protein Check</p>
                  <p className="text-2xl font-bold text-blue-300">Negative <span className="text-[15px] font-normal text-slate-400">(0 mg)</span></p>
                </div>
                <span className="text-[15px] font-bold text-emerald-400">Clean Filter</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HOW BIOTRAJECTORY WORKS */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/60 dark:bg-[#070B14]/40">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[15px] font-bold uppercase tracking-widest text-cyan-500 dark:text-cyan-400">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              How BioTrajectory Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm relative">
              <span className="text-4xl font-extrabold text-cyan-500/20 font-mono">01</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Log Your Daily Numbers</h3>
              <p className="text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Take a minute to log your blood pressure, steps from your phone, or check a simple urine strip.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm relative">
              <span className="text-4xl font-extrabold text-blue-500/20 font-mono">02</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">See Your Healthy Baseline</h3>
              <p className="text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed">
                BioTrajectory learns your normal everyday numbers and helps you spot when things are drifting off course.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm relative">
              <span className="text-4xl font-extrabold text-purple-500/20 font-mono">03</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Share with Your Doctor</h3>
              <p className="text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Bring clear reports to your next checkup or connect with verified doctors through online video visits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURES SECTION */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[15px] font-bold uppercase tracking-widest text-cyan-500 dark:text-cyan-400">
              Built for You
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Features That Keep Health Simple
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Clear, Separate Charts</h3>
              <p className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
                We never mix unrelated readings into confusing combined scores. Each health signal has its own clear chart.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Friendly AI Assistant</h3>
              <p className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Ask questions about your readings anytime and get plain English explanations with helpful next steps.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Emergency QR Code</h3>
              <p className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Show a single temporary code to paramedics or clinic staff to safely share your blood type and emergency info.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Talk to a Doctor</h3>
              <p className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Book online video visits with verified heart, kidney, and general medicine doctors directly in the platform.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Understand Conditions</h3>
              <p className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Browse our easy-to-read guides on high blood pressure, diabetes, and heart health written in plain English.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white dark:bg-[#101827] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Strict Privacy</h3>
              <p className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Your medical records are encrypted. We never sell your personal information or share it without your permission.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TALK TO A DOCTOR CTA */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-blue-900/30 via-cyan-900/20 to-[#101827] border border-cyan-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <span className="text-[15px] font-bold text-cyan-400 uppercase tracking-wide">
              Online Telemedicine
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Talk to a Doctor Who Can See Your Health History
            </h3>
            <p className="text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Show your 30-day health trends directly to verified specialists during online video appointments.
            </p>
          </div>
          <div className="shrink-0 flex flex-wrap gap-4">
            <Link
              to="/dashboard/consultation"
              className="px-7 py-3.5 rounded-2xl text-[17px] font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-md cursor-pointer"
            >
              Talk to a Doctor
            </Link>
            <Link
              to="/register"
              className="px-7 py-3.5 rounded-2xl text-[17px] font-semibold border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* 7. GET STARTED FINAL CTA */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Start Understanding Your Health Today
          </h2>
          <p className="text-[19px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Join thousands tracking personal biological signals and staying ahead of health problems with simple, everyday tools.
          </p>
          <div className="pt-4 flex justify-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-[18px] font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-xl shadow-cyan-500/25 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Global Disclaimer */}
      <div className="w-full max-w-7xl mx-auto px-4 pb-12">
        <DisclaimerBanner text="Notice: BioTrajectory is a health tracking and educational platform. It does not provide medical diagnoses, treatment plans, or emergency care. Always consult a licensed doctor for your medical decisions." />
      </div>
    </div>
  );
}
