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
  ArrowRight,
  FileText
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function PitchRoom({ onOpenDemo, onOpenReport }) {
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
      className={`relative py-20 border-t transition-colors ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-[#faf8ff] border-slate-200'
        }`}
      id="pitch"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Clinical Verification & Governance Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#00685f]"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#00685f] dark:text-[#6bd8cb]">
                Clinical Verification & Inquiries
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Clinical Governance, Inquiries & Definitions
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Addressing clinician questions, non-diagnostic boundaries, implementation checklists, and biochemical glossary terms.
            </p>
          </div>
          <div className="text-xs font-mono px-3.5 py-1.5 rounded-xl border shrink-0 bg-white dark:bg-[#0d1526] border-slate-200 dark:border-slate-800 text-[#006947] dark:text-[#6ffbbe] shadow-xs">
            Grounded AI Verification Active
          </div>
        </div>

        {/* Executive Platform Summary Box */}
        <div className={`max-w-4xl mx-auto rounded-3xl p-6 sm:p-10 border shadow-sm mb-14 ${isDark
          ? 'bg-[#0d1526] border-slate-800'
          : 'bg-white border-[#e2e8f0]'
          }`}>
          <div className="flex items-center space-x-2 mb-3">
            <Sparkles className="w-4 h-4 text-[#00685f] dark:text-[#6bd8cb]" />
            <span className="text-xs font-mono uppercase tracking-widest font-semibold text-[#00685f] dark:text-[#6bd8cb]">
              Executive Platform Summary
            </span>
          </div>

          <p className="text-lg sm:text-xl leading-relaxed italic text-slate-900 dark:text-white font-serif">
            “Most health tests give us a snapshot. BioTrajectory is designed to show the bigger picture. It records selected biological measurements over time, learns a person’s baseline when enough data is available, and highlights changes that may deserve attention. AI helps explain the trend in simple language and prepares a summary that users can share with a clinician. It is not a doctor or a diagnostic device; it is a tool to make health information easier to follow and discuss.”
          </p>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono text-[#00685f] dark:text-[#6bd8cb] font-medium">
              One-Line: BioTrajectory turns repeated everyday health measurements into an individualized baseline timeline.
            </span>
            <span className="font-semibold font-mono text-[#006947] dark:text-[#6ffbbe]">
              Vision: “Others measure your health. We track where it is going.”
            </span>
          </div>
        </div>

        {/* Guided Experience Flow */}
        <div className={`rounded-2xl border p-6 sm:p-8 shadow-sm mb-14 ${isDark ? 'bg-[#0d1526] border-slate-800' : 'bg-white border-slate-200'
          }`}>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase font-semibold text-[#00685f] dark:text-[#6bd8cb]">
                Guided Experience Flow
              </span>
              <h3 className="text-xl font-bold mt-1 text-slate-900 dark:text-white">
                Interactive System Verification Walkthrough
              </h3>
            </div>

            <button
              onClick={handleNextDemoStep}
              className="px-4 py-2 rounded-xl text-xs font-bold font-mono uppercase flex items-center space-x-2 transition-all shadow-sm bg-[#00685f] hover:bg-[#008378] text-white"
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
                      ? 'bg-[#00685f]/20 border-[#00685f] shadow-sm ring-1 ring-[#00685f]/50'
                      : 'bg-[#00685f]/10 border-[#00685f] shadow-xs ring-1 ring-[#00685f]/30'
                    : isDark
                      ? 'bg-slate-900/50 border-slate-800 text-slate-400 hover:bg-slate-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <span className={`text-[10px] font-mono block font-bold mb-1 ${isCurrent ? 'text-[#00685f] dark:text-[#6bd8cb]' : 'text-slate-500'
                    }`}>
                    Step 0{step.step}
                  </span>
                  <strong className={`text-xs block line-clamp-1 ${isCurrent ? 'text-slate-900 dark:text-white' : ''
                    }`}>
                    {step.title}
                  </strong>
                  <p className="text-[10px] mt-1 text-slate-500 line-clamp-2 leading-snug">
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
            <h3 className="text-lg font-bold mb-3 flex items-center space-x-2 text-slate-900 dark:text-white">
              <HelpCircle className="w-4 h-4 text-[#00685f] dark:text-[#6bd8cb]" />
              <span>Clinical Inquiries & Frequently Asked Questions</span>
            </h3>

            {JUDGE_QUESTIONS.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border overflow-hidden transition-all shadow-xs ${isDark ? 'border-slate-800 bg-[#0d1526]' : 'border-slate-200 bg-white'
                    }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between space-x-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  >
                    <span className="text-xs sm:text-sm font-semibold font-mono text-slate-800 dark:text-slate-200">
                      {item.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 shrink-0 text-[#00685f] dark:text-[#6bd8cb]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className={`p-5 pt-2 text-xs leading-relaxed border-t ${isDark
                      ? 'border-slate-800 bg-slate-950/40 text-slate-300'
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
          <div className={`lg:col-span-5 rounded-2xl border p-6 shadow-sm space-y-4 ${isDark ? 'bg-[#0d1526] border-slate-800' : 'bg-white border-slate-200'
            }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold flex items-center space-x-2 text-slate-900 dark:text-white">
                <ListChecks className="w-4 h-4 text-[#006947] dark:text-[#6ffbbe]" />
                <span>Implementation Checklist</span>
              </h3>
              <span className="text-[10px] font-mono text-[#006947] dark:text-[#6ffbbe] font-bold">
                {checklist.filter((c) => c.checked).length} / {checklist.length} Complete
              </span>
            </div>

            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Strict architectural requirements implemented in this clinical-grade software build:
            </p>

            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-2.5 rounded-xl border flex items-start space-x-2.5 cursor-pointer text-xs transition-all ${item.checked
                    ? isDark ? 'bg-[#006947]/15 border-[#006947]/30 text-slate-200' : 'bg-[#006947]/10 border-[#006947]/20 text-slate-800'
                    : isDark ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklist(item.id)}
                    className="mt-0.5 accent-[#006947] rounded"
                  />
                  <span className="leading-snug">{item.text}</span>
                </div>
              ))}
            </div>

            <div className={`mt-4 p-3 rounded-xl border text-[11px] leading-relaxed ${isDark ? 'bg-[#00685f]/10 border-[#00685f]/25 text-[#6bd8cb]' : 'bg-[#00685f]/5 border-[#00685f]/20 text-[#00685f]'
              }`}>
              <strong className="block mb-0.5 font-bold">Clinical Governance Mandate:</strong>
              “BioTrajectory is presented as an innovation concept and prototype plan. This platform is not medical advice, a diagnostic claim, or evidence of regulatory approval.”
            </div>
          </div>

        </div>

        {/* Glossary Terms */}
        <div className={`mt-16 pt-12 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-2 mb-6">
            <BookOpen className="w-4 h-4 text-[#00687a] dark:text-[#57dffe]" />
            <h3 className="text-sm font-semibold font-mono uppercase tracking-wider text-slate-900 dark:text-white">
              Clinical & Biochemical Glossary
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {GLOSSARY_TERMS.map((term, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${isDark ? 'bg-[#0d1526] border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                <span className="text-xs font-bold font-mono block mb-1 text-[#00685f] dark:text-[#6bd8cb]">
                  {term.term}
                </span>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {term.definition}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise & Clinical Deployment Callout */}
        <div className={`mt-16 rounded-3xl p-8 sm:p-12 border shadow-sm relative overflow-hidden ${isDark
          ? 'bg-[#0d1526] border-slate-800'
          : 'bg-white border-[#e2e8f0]'
          }`}>
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[11px] font-mono uppercase tracking-widest px-4 py-1.5 rounded-full border mb-4 inline-flex items-center space-x-2 bg-[#00685f]/10 text-[#00685f] dark:text-[#6bd8cb] border-[#00685f]/25">
              <span className="w-2 h-2 rounded-full bg-[#006947] animate-pulse"></span>
              <span>Individualized Baseline Intelligence</span>
            </span>

            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-2 text-slate-900 dark:text-white">
              Ready to Advance Longitudinal Patient Monitoring?
            </h3>

            <p className="text-sm sm:text-base max-w-2xl mx-auto mt-3 leading-relaxed text-slate-600 dark:text-slate-400">
              Experience continuous baseline tracking, non-diagnostic AI grounding, and automated clinician brief generation across multi-week urinalysis protocols.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={onOpenDemo}
                className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase font-mono tracking-wider transition-all flex items-center space-x-2 shadow-sm bg-[#00685f] hover:bg-[#008378] text-white hover:scale-[1.02]"
              >
                <span>Launch Telemetry Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenReport}
                className="px-6 py-3.5 rounded-xl font-semibold text-xs uppercase font-mono tracking-wider border transition-all flex items-center space-x-2 bg-white dark:bg-[#0d1526] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700 shadow-xs"
              >
                <FileText className="w-4 h-4 text-[#00687a] dark:text-[#57dffe]" />
                <span>Export Sample Clinician Brief</span>
              </button>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div>
                <span className="block text-[10px] uppercase font-mono text-slate-500">Architecture</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Zero-Image Retention</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono text-slate-500">Methodology</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">IQR Baseline Corridor</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono text-slate-500">Intended Use</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">PGHD Non-Diagnostic</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase font-mono text-slate-500">Handover Format</span>
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">Structured Clinical PDF</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
