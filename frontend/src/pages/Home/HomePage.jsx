import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
  ChevronRight,
  Heart,
  Clock,
  MessageSquare,
  Stethoscope,
  HelpCircle
} from 'lucide-react';
import MedicalSphere3D from '../../components/common/MedicalSphere3D';
import FloatingParticles from '../../components/common/FloatingParticles';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';
import SplashScreen from '../../components/common/SplashScreen';

export default function HomePage() {
  const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 });

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    setHeroParallax({ x, y });
  };

  const handleHeroMouseLeave = () => {
    setHeroParallax({ x: 0, y: 0 });
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  };

  return (
    <div className="w-full flex flex-col items-center overflow-hidden bg-grid-medical relative">
      
      {/* BioTrajectory First Entrance Logo Splash Screen */}
      <SplashScreen />

      {/* 1. HERO SECTION */}
      <section
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative w-full min-h-[88vh] flex items-center justify-center pt-10 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Ambient Floating Particles */}
        <FloatingParticles count={18} />

        {/* Ambient Gradient Orbs with 3D Parallax */}
        <div
          style={{
            transform: `translate3d(${heroParallax.x * -0.8}px, ${heroParallax.y * -0.8}px, 0)`
          }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-500/12 via-blue-500/10 to-indigo-500/5 rounded-full blur-[150px] pointer-events-none animate-orb-drift transition-transform duration-300 ease-out"
        />
        <div
          style={{
            transform: `translate3d(${heroParallax.x * 0.9}px, ${heroParallax.y * 0.9}px, 0)`
          }}
          className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-teal-400/8 dark:bg-teal-400/10 rounded-full blur-[130px] pointer-events-none transition-transform duration-300 ease-out"
        />

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6 text-center lg:text-left"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Your Health Is More Than <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-cyan-400 dark:via-blue-500 dark:to-indigo-500">a Number.</span>
            </h1>

            <p className="text-[19px] sm:text-[21px] text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Understand your health journey through intelligent monitoring, personal health timelines and AI-powered insights.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/explore"
                  className="group flex items-center gap-2 px-7 py-4 rounded-2xl text-[16px] font-bold text-slate-900 dark:text-white border-2 border-violet-500/50 dark:border-cyan-500/60 hover:bg-violet-500/10 dark:hover:bg-cyan-500/10 hover:border-violet-600 dark:hover:border-cyan-400 transition-all cursor-pointer shadow-sm hover:shadow-md"
                >
                  <span>Explore</span>
                  <ChevronRight className="w-5 h-5 text-violet-600 dark:text-cyan-400 group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/register"
                  className="group flex items-center gap-2 px-7 py-4 rounded-2xl text-[16px] font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/25 cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
                </Link>
              </motion.div>
            </div>

            {/* Trust Highlights */}
            <div className="pt-6 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-cyan-600 dark:text-cyan-400">Simple</p>
                <p className="text-[14px] text-slate-600 dark:text-slate-400 font-medium">Everyday Language</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">Private</p>
                <p className="text-[14px] text-slate-600 dark:text-slate-400 font-medium">Your Data Is Yours</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">Verified</p>
                <p className="text-[14px] text-slate-600 dark:text-slate-400 font-medium">Reliable Guidelines</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Right Visual: 3D Medical Sphere */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 w-full flex items-center justify-center"
          >
            <MedicalSphere3D />
          </motion.div>
        </div>
      </section>

      {/* 2. HEALTHCARE PROBLEMS SECTION */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#070B14]/40 relative">
        <div className="max-w-7xl mx-auto space-y-14">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[14px] font-bold uppercase tracking-widest text-rose-500 dark:text-rose-400 bg-rose-500/10 px-3.5 py-1.5 rounded-full border border-rose-500/20 inline-block">
              The Common Problem
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Why Once-a-Year Tests Can Miss Early Warnings
            </h2>
            <p className="text-[18px] sm:text-[19px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Most people only get checked when they feel sick or visit the doctor once a year. But health changes happen gradually over time.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl glass-card glass-card-hover space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Just One Test at a Time</h3>
              <p className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
                A single blood pressure check at a rushed clinic visit doesn't show your real everyday picture.
              </p>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-3xl glass-card glass-card-hover space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Hard to See the Trend</h3>
              <p className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Daily steps, blood pressure numbers, and test reports stay scattered in different places, making it hard to notice gradual changes.
              </p>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-3xl glass-card glass-card-hover space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Heart className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Finding Out Too Late</h3>
              <p className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Conditions like high blood pressure or high blood sugar develop quietly without early pain or obvious signs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. OUR SOLUTION SECTION */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <motion.div {...fadeInUp} className="space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full text-[14px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
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
                <li key={idx} className="flex items-start gap-3.5 text-[16px] text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-5 h-5 text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Simple Visual Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-10 rounded-3xl glass-card border border-cyan-500/30 shadow-2xl space-y-6"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[15px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                Your Health Overview
              </span>
              <span className="text-[13px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Healthy & Stable
              </span>
            </div>

            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[14px] text-slate-500 dark:text-slate-400">Blood Pressure</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-cyan-300">
                    121 / 78 <span className="text-[14px] font-normal text-slate-500">mmHg</span>
                  </p>
                </div>
                <span className="text-[14px] font-bold text-emerald-600 dark:text-emerald-400">Normal</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[14px] text-slate-500 dark:text-slate-400">Daily Steps</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-emerald-400">
                    9,240 <span className="text-[14px] font-normal text-slate-500">steps</span>
                  </p>
                </div>
                <span className="text-[14px] font-bold text-cyan-600 dark:text-cyan-400">Goal Reached</span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-[#070B14]/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[14px] text-slate-500 dark:text-slate-400">Urine Protein Check</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-blue-300">
                    Negative <span className="text-[14px] font-normal text-slate-500">(0 mg)</span>
                  </p>
                </div>
                <span className="text-[14px] font-bold text-emerald-600 dark:text-emerald-400">Clean Filter</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. HOW BIOTRAJECTORY WORKS */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#070B14]/40">
        <div className="max-w-7xl mx-auto space-y-14">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[14px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20 inline-block">
              Simple 3-Step Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              How BioTrajectory Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.1 }}
              className="p-8 rounded-3xl glass-card glass-card-hover space-y-4 relative"
            >
              <span className="text-4xl font-extrabold text-cyan-500/25 dark:text-cyan-400/25 font-mono">01</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Log Your Daily Numbers</h3>
              <p className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Take a minute to log your blood pressure, steps from your phone, or check a simple urine strip.
              </p>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="p-8 rounded-3xl glass-card glass-card-hover space-y-4 relative"
            >
              <span className="text-4xl font-extrabold text-blue-500/25 dark:text-blue-400/25 font-mono">02</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">See Your Healthy Baseline</h3>
              <p className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
                BioTrajectory learns your normal everyday numbers and helps you spot when things are drifting off course.
              </p>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              className="p-8 rounded-3xl glass-card glass-card-hover space-y-4 relative"
            >
              <span className="text-4xl font-extrabold text-indigo-500/25 dark:text-indigo-400/25 font-mono">03</span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Share with Your Doctor</h3>
              <p className="text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Bring clear reports to your next checkup or connect with verified doctors through online video visits.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. FEATURES SECTION */}
      <section className="w-full py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-14">
          <motion.div {...fadeInUp} className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-[14px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-3.5 py-1.5 rounded-full border border-cyan-500/20 inline-block">
              Built for You
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Features That Keep Health Simple
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="p-8 rounded-3xl glass-card glass-card-hover space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Clear, Separate Charts</h3>
              <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                We never mix unrelated readings into confusing combined scores. Each health signal has its own clear chart.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.15 }} className="p-8 rounded-3xl glass-card glass-card-hover space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Friendly AI Assistant</h3>
              <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Ask questions about your readings anytime and get plain English explanations with helpful next steps.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="p-8 rounded-3xl glass-card glass-card-hover space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Emergency QR Code</h3>
              <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Show a single temporary code to paramedics or clinic staff to safely share your blood type and emergency info.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.25 }} className="p-8 rounded-3xl glass-card glass-card-hover space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Talk to a Doctor</h3>
              <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Book online video visits with verified heart, kidney, and general medicine doctors directly in the platform.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="p-8 rounded-3xl glass-card glass-card-hover space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Understand Conditions</h3>
              <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Browse our easy-to-read guides on high blood pressure, diabetes, and heart health written in plain English.
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.35 }} className="p-8 rounded-3xl glass-card glass-card-hover space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Strict Privacy</h3>
              <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                Your medical records are encrypted. We never sell your personal information or share it without your permission.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. TALK TO A DOCTOR CTA */}
      <section className="w-full py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeInUp}
          className="max-w-7xl mx-auto rounded-3xl p-8 sm:p-12 glass-card border border-cyan-500/35 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-96 h-96 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full" />
          <div className="space-y-3 max-w-xl text-center md:text-left relative z-10">
            <span className="text-[14px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
              Online Telemedicine
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Talk to a Doctor Who Can See Your Health History
            </h3>
            <p className="text-[17px] text-slate-600 dark:text-slate-300 leading-relaxed">
              Show your 30-day health trends directly to verified specialists during online video appointments.
            </p>
          </div>
          <div className="shrink-0 flex flex-wrap gap-4 relative z-10">
            <Link
              to="/dashboard/consultation"
              className="px-7 py-3.5 rounded-2xl text-[16px] font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              Talk to a Doctor
            </Link>
            <Link
              to="/register"
              className="px-7 py-3.5 rounded-2xl text-[16px] font-semibold border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 7. GET STARTED FINAL CTA */}
      <section className="relative w-full py-24 px-4 sm:px-6 lg:px-8 text-center space-y-6 overflow-hidden">
        <FloatingParticles count={12} />
        <motion.div {...fadeInUp} className="max-w-3xl mx-auto space-y-4 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Start Understanding Your Health Today
          </h2>
          <p className="text-[19px] text-slate-600 dark:text-slate-300 leading-relaxed">
            Join thousands tracking personal biological signals and staying ahead of health problems with simple, everyday tools.
          </p>
          <div className="pt-4 flex justify-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2.5 px-9 py-4 rounded-2xl text-[17px] font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-xl shadow-cyan-500/25 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Global Disclaimer */}
      <div className="w-full max-w-7xl mx-auto px-4 pb-12">
        <DisclaimerBanner text="Notice: BioTrajectory is a health tracking and educational platform. It does not provide medical diagnoses, treatment plans, or emergency care. Always consult a licensed doctor for your medical decisions." />
      </div>
    </div>
  );
}
