import React, { useState } from 'react';
import { JUDGE_QUESTIONS, GLOSSARY_TERMS } from '../data/mockData';
import { HelpCircle, ChevronDown, ChevronUp, Award, DollarSign, BookOpen, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function PitchRoom() {
  const { isDark } = useTheme();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className={`relative py-24 border-t transition-colors ${
      isDark ? 'bg-[#070b14] border-white/[0.07]' : 'bg-[#f4efe8]/70 border-amber-900/10'
    }`} id="pitch">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-xs font-mono-code uppercase tracking-wider mb-4 ${
            isDark ? 'bg-amber-400/10 border-amber-400/25 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm'
          }`}>
            <Award className="w-3.5 h-3.5" />
            <span>Section 18, 19, 21 & 22 • Executive Pitch & Judge Q&A</span>
          </div>

          <h2 className={`font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            The Executive Pitch Room
          </h2>
          <p className={`mt-4 text-base sm:text-lg font-light leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Essential talking points, defensible competitive differentiators, commercial sustainability, and answers to the toughest inquiries from clinical judges.
          </p>
        </div>

        {/* 1-Line and 30-Second Pitch Box */}
        <div className={`max-w-4xl mx-auto rounded-2xl p-6 sm:p-8 border shadow-xl mb-14 ${
          isDark
            ? 'bg-gradient-to-br from-[#121b2d] to-[#090e18] border-amber-400/30'
            : 'bg-gradient-to-br from-amber-50/80 via-white to-amber-100/40 border-amber-300 shadow-amber-900/5'
        }`}>
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-amber-700'}`} />
            <span className={`text-xs font-mono-code uppercase tracking-widest font-semibold ${
              isDark ? 'text-amber-300' : 'text-amber-800'
            }`}>
              The 30-Second Elevator Pitch (Section 21)
            </span>
          </div>

          <p className={`font-serif-lux text-xl sm:text-2xl leading-relaxed italic ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            “Most health tests give us a snapshot. BioTrajectory is designed to show the bigger picture. It records selected biological measurements over time, learns a person’s baseline when enough data is available, and highlights changes that may deserve attention. AI helps explain the trend in simple language and prepares a summary that users can share with a clinician. It is not a doctor or a diagnostic device; it is a tool to make health information easier to follow and discuss.”
          </p>

          <div className={`mt-5 pt-4 border-t flex flex-wrap items-center justify-between text-xs ${
            isDark ? 'border-white/10 text-slate-400' : 'border-amber-200 text-slate-600'
          }`}>
            <span className={`font-mono-code ${isDark ? 'text-amber-200' : 'text-amber-900 font-medium'}`}>
              One-Line: BioTrajectory turns repeated everyday health measurements into a personal timeline.
            </span>
            <span className={`font-semibold font-mono-code ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              Validated Value Proposition
            </span>
          </div>
        </div>

        {/* 2-Column: Judge Q&A Accordion + Business Model */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Judge Q&A */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className={`text-base font-semibold mb-2 font-cinzel flex items-center space-x-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              <HelpCircle className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
              <span>Questions Judges Will Ask (Section 21)</span>
            </h3>

            {JUDGE_QUESTIONS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border overflow-hidden transition-all shadow-sm ${
                    isDark ? 'border-white/10 bg-[#090e18]' : 'border-slate-200 bg-white'
                  }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className={`w-full text-left p-4 flex items-center justify-between space-x-4 transition-colors ${
                      isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <span className={`text-xs sm:text-sm font-semibold font-mono-code ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}>
                      {item.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className={`w-4 h-4 shrink-0 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className={`p-4 pt-1 text-xs leading-relaxed font-light border-t ${
                      isDark
                        ? 'border-white/5 bg-slate-950/40 text-slate-300'
                        : 'border-slate-100 bg-slate-50 text-slate-700'
                    }`}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Sustainability & Business Model */}
          <div className={`lg:col-span-5 rounded-2xl border p-6 shadow-xl space-y-4 ${
            isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
          }`}>
            <h3 className={`text-base font-semibold font-cinzel flex items-center space-x-2 pb-3 border-b ${
              isDark ? 'border-white/10 text-white' : 'border-slate-100 text-slate-900'
            }`}>
              <DollarSign className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
              <span>Sustainability & Business Model</span>
            </h3>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Potential models can be explored only after safety, privacy, and clinical feasibility are established:
            </p>

            <div className="space-y-3 text-xs">
              <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`font-semibold block mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>1. Freemium Personal Tracking</span>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Free baseline logging with optional paid advanced longitudinal export and multi-year trajectory storage.</p>
              </div>

              <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`font-semibold block mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>2. Diagnostic Provider Partnerships</span>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Official calibration workflows with certified test strip manufacturers.</p>
              </div>

              <div className={`p-3 rounded-lg border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`font-semibold block mb-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>3. Institutional Clinical Licensing</span>
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>Clinics and community health networks using BioTrajectory for post-discharge home monitoring.</p>
              </div>

              <div className={`p-3 rounded-lg border ${
                isDark ? 'bg-amber-950/20 border-amber-500/20 text-amber-200/90' : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}>
                <strong className={`block mb-0.5 ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>Ethical Commercial Rule:</strong>
                Avoid incentives that encourage unnecessary testing or monetization of identifiable health records. User trust remains paramount.
              </div>
            </div>
          </div>

        </div>

        {/* Glossary Terms Carousel */}
        <div className={`mt-16 pt-12 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-2 mb-6">
            <BookOpen className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <h3 className={`text-sm font-semibold font-mono-code uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Section 22 • Essential Glossary & Definitions
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GLOSSARY_TERMS.map((term, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${
                isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <span className={`text-xs font-bold font-mono-code block mb-1 ${
                  isDark ? 'text-amber-300' : 'text-amber-800'
                }`}>
                  {term.term}
                </span>
                <p className={`text-xs leading-relaxed font-light ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {term.definition}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            SLIDE 9: THANK YOU & CODESPRINT 2026 FINALE
        ========================================================================== */}
        <div className={`mt-16 rounded-3xl p-8 sm:p-14 border text-center shadow-2xl relative overflow-hidden ${
          isDark
            ? 'bg-gradient-to-br from-[#0c1322] via-[#070b14] to-[#04060a] border-amber-400/30'
            : 'bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-amber-300 shadow-[0_20px_50px_rgba(180,145,95,0.12)]'
        }`}>
          <div className="max-w-3xl mx-auto">
            <span className={`text-xs font-mono-code uppercase tracking-widest px-3.5 py-1 rounded-full border mb-4 inline-block ${
              isDark ? 'bg-amber-400/10 text-amber-300 border-amber-400/25' : 'bg-amber-100 text-amber-900 border-amber-300'
            }`}>
              ELITE CODERS PRESENTS • CODESPRINT 2026
            </span>

            <h3 className={`font-cinzel text-3xl sm:text-5xl font-extrabold tracking-tight mt-2 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              THANK YOU.
            </h3>

            <p className={`text-lg sm:text-xl font-serif-lux italic mt-2 ${
              isDark ? 'text-amber-200' : 'text-amber-900 font-medium'
            }`}>
              FOR BUILDING THE FUTURE WITH US.
            </p>

            <p className={`text-sm mt-4 font-light max-w-lg mx-auto ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Every great idea starts somewhere. This is just the beginning.
            </p>

            {/* Lifecycle */}
            <div className="my-6 inline-flex items-center space-x-3 text-xs sm:text-sm font-mono-code font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <span>IDEA</span>
              <span>→</span>
              <span>MVP</span>
              <span>→</span>
              <span>OPEN SOURCE</span>
              <span>→</span>
              <span>PITCH</span>
            </div>

            <div className={`text-sm font-semibold tracking-wider font-mono-code ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}>
              Keep building. Keep creating. Keep contributing.
            </div>

            <div className="mt-8 pt-6 border-t border-inherit flex flex-wrap items-center justify-between gap-4 text-xs font-mono-code">
              <div className="text-left">
                <span className="block text-slate-400 uppercase text-[10px]">Team Name</span>
                <strong className={isDark ? 'text-white' : 'text-slate-900'}>Chauhan.rishika2007</strong>
              </div>

              <div className="text-left">
                <span className="block text-slate-400 uppercase text-[10px]">Presented By</span>
                <strong className={isDark ? 'text-amber-300' : 'text-amber-800'}>
                  Rishika Chauhan, Riya Baisoya, Pranjal Kumar Pandey, Priyanshu
                </strong>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-emerald-500 font-bold">BioTrajectory</span>
                <span className="text-slate-400">•</span>
                <span className="italic text-slate-500">Others measure your health. We track where it is going.</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
