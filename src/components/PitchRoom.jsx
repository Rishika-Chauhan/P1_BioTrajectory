import React, { useState } from 'react';
import {
  JUDGE_QUESTIONS,
  GLOSSARY_TERMS
} from '../data/mockData';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  Sparkles,
  ListChecks,
  ArrowRight
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function PitchRoom() {
  const { isDark } = useTheme();
  const [openIndex, setOpenIndex] = useState(0);

  // Interactive 7-Step Demo Sequence Controller (PDF Section 21)
  const [demoStep, setDemoStep] = useState(0);

  // Interactive First-Build Checklist (PDF Appendix)
  const [checklist, setChecklist] = useState([
    { id: 'strip', text: 'Choose one specific test strip (10SG) and one narrow intended use', checked: true },
    { id: 'fields', text: 'Get manufacturer instructions and define structured data fields', checked: true },
    { id: 'synthetic', text: 'Use synthetic sample data for first demonstration prototype', checked: true },
    { id: 'manual', text: 'Build manual entry, confirmation, history and charts before camera automation', checked: true },
    { id: 'thresholds', text: 'Label all demo thresholds as illustrative, not medical guidance', checked: true },
    { id: 'grounding', text: 'Ground Gemini in confirmed records and approved explanatory text', checked: true },
    { id: 'consent', text: 'Include consent, privacy notice, export and deletion controls', checked: true },
    { id: 'clinical_review', text: 'Have qualified healthcare professional review user-facing language', checked: true },
    { id: 'safeguards', text: 'Do not recruit participants without appropriate ethics approvals', checked: true },
    { id: 'documentation', text: 'Document what is implemented, what is experimental, and future work', checked: true },
  ]);

  const toggleChecklist = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const demoSequence = [
    {
      step: 1,
      title: 'Introduce the Problem',
      action: 'Show how scattered one-time readings hide trends and create panic.',
      targetId: 'problem'
    },
    {
      step: 2,
      title: 'Add & Audit Reading',
      action: 'Demonstrate phone strip reading with mandatory user confirmation.',
      targetId: 'live-prototype'
    },
    {
      step: 3,
      title: 'Build Personal Timeline',
      action: 'Show repeated entries forming a personal baseline corridor (rolling median).',
      targetId: 'live-prototype'
    },
    {
      step: 4,
      title: 'Illustrative Variance',
      action: 'Demonstrate Day 22 transient spike (post-workout) and explain review flag.',
      targetId: 'live-prototype'
    },
    {
      step: 5,
      title: 'Grounded Gemini AI',
      action: 'Ask Gemini to synthesize confirmed facts, state limits, and avoid diagnosis.',
      targetId: 'live-prototype'
    },
    {
      step: 6,
      title: 'Export Clinician Report',
      action: 'Generate structured PDF brief with timestamps and doctor talking points.',
      targetId: 'live-prototype'
    },
    {
      step: 7,
      title: 'Roadmap & Clinical Path',
      action: 'Close with staged clinical validation pathway and responsible expansion.',
      targetId: 'roadmap'
    }
  ];

  const handleNextDemoStep = () => {
    const next = (demoStep + 1) % demoSequence.length;
    setDemoStep(next);
    const target = document.getElementById(demoSequence[next].targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      className={`relative py-24 border-t transition-colors ${isDark ? 'bg-[#070b14] border-white/[0.07]' : 'bg-[#f4efe8]/70 border-amber-900/10'
        }`}
      id="pitch"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-xs font-mono-code uppercase tracking-wider mb-4 ${isDark ? 'bg-amber-400/10 border-amber-400/25 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm'
            }`}>
            <Award className="w-3.5 h-3.5" />
            <span>Blueprint Section 21 & Appendix • Pitch Room & Checklist</span>
          </div>

          <h2 className={`font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'
            }`}>
            The Executive Pitch Room
          </h2>
          <p className={`mt-4 text-base sm:text-lg font-light leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
            Live demonstration sequence, answers to the toughest inquiries from clinical judges, sustainability model, and compliance checklist.
          </p>
        </div>

        {/* 1-Line and 30-Second Elevator Pitch Box */}
        <div className={`max-w-4xl mx-auto rounded-3xl p-6 sm:p-10 border shadow-2xl mb-14 ${isDark
            ? 'bg-gradient-to-br from-[#121b2d] via-[#090e18] to-[#05070c] border-amber-400/30'
            : 'bg-gradient-to-br from-amber-50/90 via-white to-amber-100/50 border-amber-300 shadow-xl'
          }`}>
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className={`w-4 h-4 ${isDark ? 'text-amber-300' : 'text-amber-700'}`} />
            <span className={`text-xs font-mono-code uppercase tracking-widest font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'
              }`}>
              The 30-Second Elevator Pitch (Blueprint Section 21)
            </span>
          </div>

          <p className={`font-serif-lux text-xl sm:text-2xl leading-relaxed italic ${isDark ? 'text-white' : 'text-slate-900'
            }`}>
            “Most health tests give us a snapshot. BioTrajectory is designed to show the bigger picture. It records selected biological measurements over time, learns a person’s baseline when enough data is available, and highlights changes that may deserve attention. AI helps explain the trend in simple language and prepares a summary that users can share with a clinician. It is not a doctor or a diagnostic device; it is a tool to make health information easier to follow and discuss.”
          </p>

          <div className={`mt-6 pt-4 border-t flex flex-wrap items-center justify-between gap-2 text-xs ${isDark ? 'border-white/10 text-slate-400' : 'border-amber-200 text-slate-600'
            }`}>
            <span className={`font-mono-code ${isDark ? 'text-amber-200' : 'text-amber-900 font-medium'}`}>
              One-Line: BioTrajectory turns repeated everyday health measurements into a personal timeline.
            </span>
            <span className={`font-semibold font-mono-code ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              Vision: “Others measure your health. We track where it is going.”
            </span>
          </div>
        </div>

        {/* =========================================================================
            INTERACTIVE DEMO SEQUENCE CONTROLLER (PDF Section 21)
        ========================================================================== */}
        <div className={`rounded-3xl border p-6 sm:p-8 shadow-xl mb-14 ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
          }`}>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div>
              <span className={`text-xs font-mono-code uppercase font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                Section 21: Suggested Live Demo Sequence
              </span>
              <h3 className={`text-xl font-bold font-cinzel mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Interactive 7-Step Pitch Walkthrough
              </h3>
            </div>

            <button
              onClick={handleNextDemoStep}
              className={`px-4 py-2 rounded-xl text-xs font-bold font-mono-code uppercase flex items-center space-x-2 transition-all shadow-md ${isDark ? 'bg-amber-400 hover:bg-amber-300 text-slate-950' : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
            >
              <span>Advance Step ({demoStep + 1} / 7)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
            {demoSequence.map((step, idx) => {
              const isCurrent = demoStep === idx;
              return (
                <div
                  key={step.step}
                  onClick={() => {
                    setDemoStep(idx);
                    const target = document.getElementById(step.targetId);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${isCurrent
                      ? isDark
                        ? 'bg-amber-400/20 border-amber-400/80 shadow-md ring-1 ring-amber-400'
                        : 'bg-amber-50 border-amber-500 shadow-sm ring-1 ring-amber-500'
                      : isDark
                        ? 'bg-slate-900/50 border-white/5 text-slate-400 hover:bg-slate-800'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <span className={`text-[10px] font-mono-code block font-bold mb-1 ${isCurrent ? (isDark ? 'text-amber-300' : 'text-amber-800') : 'text-slate-500'
                    }`}>
                    Step 0{step.step}
                  </span>
                  <strong className={`text-xs block line-clamp-1 ${isCurrent ? (isDark ? 'text-white' : 'text-slate-900') : ''
                    }`}>
                    {step.title}
                  </strong>
                  <p className="text-[10px] mt-1 text-slate-400 line-clamp-2 leading-snug">
                    {step.action}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column: Judge Q&A + First-Build Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">

          {/* Left Column: Judge Q&A */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className={`text-lg font-bold font-cinzel mb-3 flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'
              }`}>
              <HelpCircle className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-700'}`} />
              <span>Questions Judges Will Ask (Section 21)</span>
            </h3>

            {JUDGE_QUESTIONS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border overflow-hidden transition-all shadow-sm ${isDark ? 'border-white/10 bg-[#090e18]' : 'border-slate-200 bg-white'
                    }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className={`w-full text-left p-4 sm:p-5 flex items-center justify-between space-x-4 transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                      }`}
                  >
                    <span className={`text-xs sm:text-sm font-semibold font-mono-code ${isDark ? 'text-slate-200' : 'text-slate-800'
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
                    <div className={`p-5 pt-2 text-xs leading-relaxed font-light border-t ${isDark
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

          {/* Right Column: First-Build Checklist (PDF Appendix) */}
          <div className={`lg:col-span-5 rounded-2xl border p-6 shadow-xl space-y-4 ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
            }`}>
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className={`text-base font-bold font-cinzel flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'
                }`}>
                <ListChecks className="w-4 h-4 text-emerald-500" />
                <span>Appendix: First-Build Checklist</span>
              </h3>
              <span className="text-[10px] font-mono-code text-emerald-400 font-bold">
                {checklist.filter((c) => c.checked).length} / {checklist.length} Complete
              </span>
            </div>

            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              The blueprint establishes 10 strict requirements for any buildable software prototype:
            </p>

            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-2.5 rounded-xl border flex items-start space-x-2.5 cursor-pointer text-xs transition-all ${item.checked
                      ? isDark ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200' : 'bg-emerald-50/70 border-emerald-300 text-slate-800'
                      : isDark ? 'bg-slate-900 border-white/5 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklist(item.id)}
                    className="mt-0.5 accent-emerald-500 rounded"
                  />
                  <span className="leading-snug">{item.text}</span>
                </div>
              ))}
            </div>

            <div className={`mt-4 p-3 rounded-xl border text-[11px] leading-relaxed ${isDark ? 'bg-amber-950/20 border-amber-400/30 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}>
              <strong className="block mb-0.5 font-bold">Blueprint Appendix Disclaimer:</strong>
              “BioTrajectory is presented as an innovation concept and prototype plan. This report is not medical advice, a diagnostic claim, or evidence of regulatory approval.”
            </div>
          </div>

        </div>

        {/* Glossary Terms Carousel */}
        <div className={`mt-16 pt-12 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-2 mb-6">
            <BookOpen className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <h3 className={`text-sm font-semibold font-mono-code uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'
              }`}>
              Section 22 • Essential Glossary & Definitions
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GLOSSARY_TERMS.map((term, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${isDark ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                <span className={`text-xs font-bold font-mono-code block mb-1 ${isDark ? 'text-amber-300' : 'text-amber-800'
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

        {/* Finale Card */}
        <div className={`mt-16 rounded-3xl p-8 sm:p-14 border text-center shadow-2xl relative overflow-hidden ${isDark
            ? 'bg-gradient-to-br from-[#0c1322] via-[#070b14] to-[#04060a] border-amber-400/30'
            : 'bg-gradient-to-br from-amber-50 via-white to-amber-100/50 border-amber-300 shadow-[0_20px_50px_rgba(180,145,95,0.12)]'
          }`}>
          <div className="max-w-3xl mx-auto">
            <span className={`text-xs font-mono-code uppercase tracking-widest px-3.5 py-1 rounded-full border mb-4 inline-block ${isDark ? 'bg-amber-400/10 text-amber-300 border-amber-400/25' : 'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
              ELITE CODERS PRESENTS • CODESPRINT 2026
            </span>

            <h3 className={`font-cinzel text-3xl sm:text-5xl font-extrabold tracking-tight mt-2 ${isDark ? 'text-white' : 'text-slate-900'
              }`}>
              THANK YOU.
            </h3>

            <p className={`text-lg sm:text-xl font-serif-lux italic mt-2 ${isDark ? 'text-amber-200' : 'text-amber-900 font-medium'
              }`}>
              FOR BUILDING THE FUTURE WITH US.
            </p>

            <div className="my-6 inline-flex items-center space-x-3 text-xs sm:text-sm font-mono-code font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              <span>IDEA</span>
              <span>→</span>
              <span>MVP</span>
              <span>→</span>
              <span>OPEN SOURCE</span>
              <span>→</span>
              <span>PITCH</span>
            </div>

            <div className={`text-sm font-semibold tracking-wider font-mono-code ${isDark ? 'text-slate-200' : 'text-slate-800'
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
