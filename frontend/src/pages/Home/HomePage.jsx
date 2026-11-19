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
import { useLanguage } from '../../context/LanguageContext';

export default function HomePage() {
  const [heroParallax, setHeroParallax] = useState({ x: 0, y: 0 });
  const { t, isHindi } = useLanguage();

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
        className="relative w-full min-h-[72vh] flex items-center justify-center pt-6 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Ambient Floating Particles */}
        <FloatingParticles count={14} />

        {/* Ambient Gradient Orbs with 3D Parallax */}
        <div
          style={{
            transform: `translate3d(${heroParallax.x * -0.8}px, ${heroParallax.y * -0.8}px, 0)`
          }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-cyan-500/12 via-blue-500/10 to-indigo-500/5 rounded-full blur-[130px] pointer-events-none animate-orb-drift transition-transform duration-300 ease-out"
        />
        <div
          style={{
            transform: `translate3d(${heroParallax.x * 0.9}px, ${heroParallax.y * 0.9}px, 0)`
          }}
          className="absolute top-1/3 left-1/4 w-[320px] h-[320px] bg-teal-400/8 dark:bg-teal-400/10 rounded-full blur-[110px] pointer-events-none transition-transform duration-300 ease-out"
        />

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">

          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-4 text-center lg:text-left"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {isHindi ? (
                <>आपका स्वास्थ्य केवल एक <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-cyan-400 dark:via-blue-500 dark:to-indigo-500">संख्या नहीं है।</span></>
              ) : (
                <>Your Health Is More Than <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-cyan-400 dark:via-blue-500 dark:to-indigo-500">a Number.</span></>
              )}
            </h1>

            <p className="text-[15px] sm:text-[17px] text-slate-600 dark:text-slate-300 max-w-lg mx-auto lg:mx-0 leading-relaxed font-normal">
              {isHindi
                ? 'बुद्धिमान निगरानी, व्यक्तिगत स्वास्थ्य समयरेखा और एआई-संचालित अंतर्दृष्टि के माध्यम से अपनी स्वास्थ्य यात्रा को समझें।'
                : 'Understand your health journey through intelligent monitoring, personal health timelines and AI-powered insights.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/explore"
                  className="group flex items-center gap-2 px-5 py-3 rounded-xl text-[14px] font-bold text-slate-900 dark:text-white border border-violet-500/50 dark:border-cyan-500/60 hover:bg-violet-500/10 dark:hover:bg-cyan-500/10 hover:border-violet-600 dark:hover:border-cyan-400 transition-all cursor-pointer shadow-xs hover:shadow-sm"
                >
                  <span>{t('nav.explore', {}, 'Explore')}</span>
                  <ChevronRight className="w-4 h-4 text-violet-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/register"
                  className="group flex items-center gap-2 px-5 py-3 rounded-xl text-[14px] font-bold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/25 cursor-pointer"
                >
                  <span>{t('nav.getStarted', {}, 'Get Started')}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </motion.div>
            </div>

            {/* Trust Highlights */}
            <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">
                  {isHindi ? 'सरल' : 'Simple'}
                </p>
                <p className="text-[12px] text-slate-600 dark:text-slate-400 font-medium">
                  {isHindi ? 'आसान भाषा' : 'Everyday Language'}
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                  {isHindi ? 'निजी' : 'Private'}
                </p>
                <p className="text-[12px] text-slate-600 dark:text-slate-400 font-medium">
                  {isHindi ? 'आपका डेटा सुरक्षित' : 'Your Data Is Yours'}
                </p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {isHindi ? 'सत्यापित' : 'Verified'}
                </p>
                <p className="text-[12px] text-slate-600 dark:text-slate-400 font-medium">
                  {isHindi ? 'विश्वसनीय मार्गदर्शिका' : 'Reliable Guidelines'}
                </p>
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
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#1F150E]/40 relative">
        <div className="max-w-7xl mx-auto space-y-10">
          <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[12px] font-bold uppercase tracking-widest text-rose-500 dark:text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 inline-block">
              {isHindi ? 'सामान्य समस्या' : 'The Common Problem'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isHindi
                ? 'साल में एक बार की जांच से शुरुआती संकेत क्यों छूट जाते हैं'
                : 'Why Once-a-Year Tests Can Miss Early Warnings'}
            </h2>
            <p className="text-[14px] sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {isHindi
                ? 'अधिकांश लोग केवल बीमार महसूस होने पर या साल में एक बार डॉक्टर के पास जाते हैं, जबकि स्वास्थ्य परिवर्तन धीरे-धीरे होते हैं।'
                : 'Most people only get checked when they feel sick or visit the doctor once a year. But health changes happen gradually over time.'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl glass-card glass-card-hover space-y-3"
            >
              <div className="w-11 h-11 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isHindi ? 'एक बार में सिर्फ एक जांच' : 'Just One Test at a Time'}
              </h3>
              <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi
                  ? 'क्लिनिक में जल्दबाजी में की गई एक जांच आपकी वास्तविक दैनिक जीवनशैली और स्वास्थ्य को नहीं दर्शाती।'
                  : "A single blood pressure check at a rushed clinic visit doesn't show your real everyday picture."}
              </p>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl glass-card glass-card-hover space-y-3"
            >
              <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isHindi ? 'ट्रेंड देखना कठिन' : 'Hard to See the Trend'}
              </h3>
              <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi
                  ? 'दैनिक कदम, रक्तचाप और लैब रिपोर्ट अलग-अलग रहने से धीरे-धीरे हो रहे बदलावों को पहचानना मुश्किल होता है।'
                  : 'Daily steps, blood pressure numbers, and test reports stay scattered in different places, making it hard to notice gradual changes.'}
              </p>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl glass-card glass-card-hover space-y-3"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isHindi ? 'देर से पता चलना' : 'Finding Out Too Late'}
              </h3>
              <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi
                  ? 'उच्च रक्तचाप (Hypertension) या मधुमेह (Diabetes) जैसी स्थितियां बिना किसी शुरुआती दर्द के चुपचाप विकसित होती हैं।'
                  : 'Conditions like high blood pressure or high blood sugar develop quietly without early pain or obvious signs.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. OUR SOLUTION SECTION */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div {...fadeInUp} className="space-y-4">
            <span className="inline-block px-3 py-1 rounded-full text-[12px] font-bold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              {isHindi ? 'बायोट्रैजेक्टरी समाधान' : 'The BioTrajectory Solution'}
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
              {isHindi
                ? 'देखें कि समय के साथ आपका स्वास्थ्य किस दिशा में जा रहा है'
                : 'See Where Your Health Is Heading Over Time'}
            </h2>

            <p className="text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {isHindi
                ? 'बायोट्रैजेक्टरी आपके दैनिक शारीरिक संकेतों को ट्रैक करने और उन्हें एक स्पष्ट व्यक्तिगत स्वास्थ्य कहानी में जोड़ने में मदद करता है।'
                : 'BioTrajectory helps you keep track of your daily body signals and connects the dots into an easy-to-read personal health story.'}
            </p>

            <ul className="space-y-3 pt-1">
              {(isHindi ? [
                'रक्तचाप, कदम और हाइड्रेशन के लिए अलग और स्पष्ट चार्ट्स',
                'गंभीर समस्या बनने से पहले क्रमिक परिवर्तनों को समय पर पहचानना',
                'सरल सारांश जिसे आप अपनी अगली डॉक्टर विजिट में साथ ले जा सकते हैं',
                'चिकित्सीय जटिलता के बिना सरल और व्यावहारिक भाषा में स्पष्टीकरण'
              ] : [
                'Separate, easy charts for blood pressure, steps, and hydration',
                'Notices gradual changes early, before they become serious problems',
                'Simple summaries you can take to your next doctor visit',
                'Clear explanations in everyday language without medical confusion'
              ]).map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[14px] text-slate-700 dark:text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 dark:text-cyan-400 shrink-0 mt-0.5" />
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
            className="p-6 sm:p-7 rounded-2xl glass-card border border-cyan-500/30 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <span className="text-[13px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
                {isHindi ? 'आपका स्वास्थ्य सारांश' : 'Your Health Overview'}
              </span>
              <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                {isHindi ? 'स्वस्थ एवं स्थिर' : 'Healthy & Stable'}
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#1F150E]/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">
                    {isHindi ? 'रक्तचाप (Blood Pressure)' : 'Blood Pressure'}
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-cyan-300">
                    121 / 78 <span className="text-[12px] font-normal text-slate-500">mmHg</span>
                  </p>
                </div>
                <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400">
                  {isHindi ? 'सामान्य' : 'Normal'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#1F150E]/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">
                    {isHindi ? 'दैनिक कदम (Daily Steps)' : 'Daily Steps'}
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-emerald-400">
                    9,240 <span className="text-[12px] font-normal text-slate-500">steps</span>
                  </p>
                </div>
                <span className="text-[12px] font-bold text-cyan-600 dark:text-cyan-400">
                  {isHindi ? 'लक्ष्य पूरा' : 'Goal Reached'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 dark:bg-[#1F150E]/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400">
                    {isHindi ? 'मूत्र प्रोटीन जांच' : 'Urine Protein Check'}
                  </p>
                  <p className="text-xl font-bold text-slate-900 dark:text-blue-300">
                    Negative <span className="text-[12px] font-normal text-slate-500">(0 mg)</span>
                  </p>
                </div>
                <span className="text-[12px] font-bold text-emerald-600 dark:text-emerald-400">
                  {isHindi ? 'सामान्य' : 'Clean Filter'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. HOW BIOTRAJECTORY WORKS */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-[#1F150E]/40">
        <div className="max-w-7xl mx-auto space-y-10">
          <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[12px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 inline-block">
              {isHindi ? 'सरल 3-चरणीय प्रक्रिया' : 'Simple 3-Step Process'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isHindi ? 'बायोट्रैजेक्टरी कैसे काम करता है' : 'How BioTrajectory Works'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl glass-card glass-card-hover space-y-3 relative"
            >
              <span className="text-4xl font-extrabold text-cyan-500/25 dark:text-cyan-400/25 font-mono">01</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {isHindi ? 'अपने दैनिक आंकड़े दर्ज करें' : 'Log Your Daily Numbers'}
              </h3>
              <p className="text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi
                  ? 'अपने फोन से रक्तचाप, कदम या यूरिन टेस्ट स्ट्रिप को आसानी से लॉग करें।'
                  : 'Take a minute to log your blood pressure, steps from your phone, or check a simple urine strip.'}
              </p>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl glass-card glass-card-hover space-y-3 relative"
            >
              <span className="text-3xl font-extrabold text-blue-500/25 dark:text-blue-400/25 font-mono">02</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isHindi ? 'अपनी सामान्य सीमा समझें' : 'See Your Healthy Baseline'}
              </h3>
              <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi
                  ? 'बायोट्रैजेक्टरी आपकी सामान्य सीमा को समझता है और विचलन होने पर संकेत देता है।'
                  : 'BioTrajectory learns your normal everyday numbers and helps you spot when things are drifting off course.'}
              </p>
            </motion.div>

            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl glass-card glass-card-hover space-y-3 relative"
            >
              <span className="text-3xl font-extrabold text-indigo-500/25 dark:text-indigo-400/25 font-mono">03</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isHindi ? 'डॉक्टर के साथ साझा करें' : 'Share with Your Doctor'}
              </h3>
              <p className="text-[14px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi
                  ? 'अपनी अगली जांच में स्पष्ट रिपोर्ट ले जाएं या सत्यापित डॉक्टरों से ऑनलाइन परामर्श लें।'
                  : 'Bring clear reports to your next checkup or connect with verified doctors through online video visits.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. FEATURES SECTION */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <motion.div {...fadeInUp} className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[12px] font-bold uppercase tracking-widest text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20 inline-block">
              {isHindi ? 'आपके लिए निर्मित' : 'Built for You'}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {isHindi ? 'सुविधाएं जो स्वास्थ्य को आसान बनाती हैं' : 'Features That Keep Health Simple'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="p-6 rounded-2xl glass-card glass-card-hover space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isHindi ? 'स्पष्ट, अलग-अलग चार्ट्स' : 'Clear, Separate Charts'}
              </h3>
              <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi
                  ? 'हम कभी भी अलग-अलग रीडिंग को भ्रमित स्कोर में नहीं मिलाते। प्रत्येक संकेत का अपना स्पष्ट चार्ट है।'
                  : 'We never mix unrelated readings into confusing combined scores. Each health signal has its own clear chart.'}
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.15 }} className="p-6 rounded-2xl glass-card glass-card-hover space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isHindi ? 'सुलभ एआई स्वास्थ्य सहायक' : 'Friendly AI Assistant'}
              </h3>
              <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi
                  ? 'अपनी रीडिंग के बारे में किसी भी समय सवाल पूछें और व्यावहारिक अगले कदम प्राप्त करें।'
                  : 'Ask questions about your readings anytime and get plain English explanations with helpful next steps.'}
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="p-6 rounded-2xl glass-card glass-card-hover space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isHindi ? 'आपातकालीन क्यूआर कोड' : 'Emergency QR Code'}
              </h3>
              <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi
                  ? 'आपातकालीन स्थिति में प्राथमिक उपचार दल के साथ सुरक्षित रूप से अपना ब्लड ग्रुप और मेडिकल डेटा साझा करें।'
                  : 'Show a single temporary code to paramedics or clinic staff to safely share your blood type and emergency info.'}
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.25 }} className="p-6 rounded-2xl glass-card glass-card-hover space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isHindi ? 'डॉक्टर से परामर्श लें' : 'Talk to a Doctor'}
              </h3>
              <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi
                  ? 'सत्यापित हृदय, गुर्दा और सामान्य चिकित्सा विशेषज्ञों के साथ सीधे वीडियो परामर्श बुक करें।'
                  : 'Book online video visits with verified heart, kidney, and general medicine doctors directly in the platform.'}
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.3 }} className="p-6 rounded-2xl glass-card glass-card-hover space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isHindi ? 'बीमारियों को समझें' : 'Understand Conditions'}
              </h3>
              <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi
                  ? 'उच्च रक्तचाप, मधुमेह और अन्य 35+ बीमारियों पर हमारी आसान और सत्यापित मार्गदर्शिकाएं पढ़ें।'
                  : 'Browse our easy-to-read guides on high blood pressure, diabetes, and heart health written in plain English.'}
              </p>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.35 }} className="p-6 rounded-2xl glass-card glass-card-hover space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isHindi ? 'कड़ा डेटा गोपनीयता संरक्षण' : 'Strict Privacy'}
              </h3>
              <p className="text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi
                  ? 'आपके मेडिकल रिकॉर्ड एन्क्रिप्टेड हैं। आपकी अनुमति के बिना आपकी जानकारी कभी साझा नहीं की जाती।'
                  : 'Your medical records are encrypted. We never sell your personal information or share it without your permission.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 6. TALK TO A DOCTOR CTA */}
      <section className="w-full py-14 px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeInUp}
          className="max-w-7xl mx-auto rounded-2xl p-6 sm:p-8 glass-card border border-cyan-500/35 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 blur-[90px] pointer-events-none rounded-full" />
          <div className="space-y-2 max-w-xl text-center md:text-left relative z-10">
            <span className="text-[12px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">
              {isHindi ? 'ऑनलाइन टेलीमेडिसिन' : 'Online Telemedicine'}
            </span>
            <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {isHindi
                ? 'ऐसे डॉक्टर से बात करें जो आपका स्वास्थ्य इतिहास देख सके'
                : 'Talk to a Doctor Who Can See Your Health History'}
            </h3>
            <p className="text-[14px] sm:text-[15px] text-slate-600 dark:text-slate-300 leading-relaxed">
              {isHindi
                ? 'ऑनलाइन वीडियो अपॉइंटमेंट के दौरान सत्यापित विशेषज्ञों को सीधे अपने 30-दिन के स्वास्थ्य रुझान दिखाएं।'
                : 'Show your 30-day health trends directly to verified specialists during online video appointments.'}
            </p>
          </div>
          <div className="shrink-0 flex flex-wrap gap-3 relative z-10">
            <Link
              to="/dashboard/consultation"
              className="px-5 py-2.5 rounded-xl text-[14px] font-bold bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              {isHindi ? 'डॉक्टर से परामर्श लें' : 'Talk to a Doctor'}
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 rounded-xl text-[14px] font-semibold border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-95"
            >
              {isHindi ? 'खाता बनाएं' : 'Create Account'}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* 7. GET STARTED FINAL CTA */}
      <section className="relative w-full py-16 px-4 sm:px-6 lg:px-8 text-center space-y-4 overflow-hidden">
        <FloatingParticles count={10} />
        <motion.div {...fadeInUp} className="max-w-2xl mx-auto space-y-3 relative z-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isHindi ? 'आज ही अपने स्वास्थ्य को समझना शुरू करें' : 'Start Understanding Your Health Today'}
          </h2>
          <p className="text-[15px] sm:text-[16px] text-slate-600 dark:text-slate-300 leading-relaxed">
            {isHindi
              ? 'दैनिक जैविक संकेतों को ट्रैक करके और सरल उपकरणों के साथ स्वास्थ्य समस्याओं से आगे रहें।'
              : 'Join thousands tracking personal biological signals and staying ahead of health problems with simple, everyday tools.'}
          </p>
          <div className="pt-2 flex justify-center">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/register"
                className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/25 cursor-pointer"
              >
                <span>{t('nav.getStarted', {}, 'Get Started')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Global Disclaimer */}
      <div className="w-full max-w-7xl mx-auto px-4 pb-12">
        <DisclaimerBanner text={isHindi ? 'सूचना: बायोट्रैजेक्टरी एक स्वास्थ्य ट्रैकिंग और शैक्षणिक प्लेटफॉर्म है। यह व्यक्तिगत चिकित्सीय निदान, उपचार योजना या आपातकालीन देखभाल प्रदान नहीं करता है। चिकित्सीय निर्णयों के लिए हमेशा लाइसेंस प्राप्त डॉक्टर से परामर्श लें।' : 'Notice: BioTrajectory is a health tracking and educational platform. It does not provide medical diagnoses, treatment plans, or emergency care. Always consult a licensed doctor for your medical decisions.'} />
      </div>
    </div>
  );
}
