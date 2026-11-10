import React, { useState } from 'react';
import { Camera, CheckCircle2, Database, TrendingUp, Sparkles, FileText, ShieldAlert, ArrowRight, Play, RefreshCw, Cpu, CheckCircle } from 'lucide-react';
import { PDF_HOW_IT_WORKS_STEPS } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function HowItWorks({ onOpenScanner, onOpenReport, onOpenDemo }) {
    const { isDark } = useTheme();
    const [activeStep, setActiveStep] = useState(0);

    const stepIcons = [Camera, CheckCircle2, Database, TrendingUp, Sparkles, FileText];

    const stepVisuals = [
        {
            title: '01 Capture: Optical Viewfinder & Lux Reticle',
            content: (
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#006947] dark:text-[#6ffbbe] font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#006947] dark:bg-[#6ffbbe] animate-ping"></span>
                            TrueDepth Reticle Locked
                        </span>
                        <span className="text-[#00687a] dark:text-[#57dffe]">Lux: 520 (Calibrated)</span>
                    </div>
                    <div className="h-32 rounded-xl bg-slate-900 border border-[#00685f]/30 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-4 border border-dashed border-[#00685f]/60 rounded-lg flex items-center justify-center">
                            <span className="text-[11px] font-mono text-[#6bd8cb]">10-Pad Reagent Strip Alignment Zone</span>
                        </div>
                        <div className="w-12 h-24 bg-white/95 rounded shadow flex flex-col justify-around py-1 px-1 z-10">
                            <div className="w-full h-1.5 rounded-xs bg-[#985888]"></div>
                            <div className="w-full h-1.5 rounded-xs bg-[#e8ea9c]"></div>
                            <div className="w-full h-1.5 rounded-xs bg-[#a7cd9a]"></div>
                            <div className="w-full h-1.5 rounded-xs bg-[#e08f36]"></div>
                            <div className="w-full h-1.5 rounded-xs bg-[#568b44]"></div>
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-500 italic">“60s reaction kinetic spectrophotometry calibrated automatically.”</p>
                </div>
            )
        },
        {
            title: '02 Confirm: Swatch Estimation & User Audit',
            content: (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded-xl bg-[#00685f]/10 border border-[#00685f]/30">
                            <span className="block text-[10px] text-slate-400">Protein Pad</span>
                            <strong className="text-[#00685f] dark:text-[#6bd8cb]">30 mg/dL (1+)</strong>
                        </div>
                        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-white/5">
                            <span className="block text-[10px] text-slate-400">Specific Gravity</span>
                            <strong className="text-white">1.028</strong>
                        </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#006947]/10 border border-[#006947]/30 flex items-center space-x-2 text-xs text-[#006947] dark:text-[#6ffbbe]">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-[#006947] dark:text-[#6ffbbe]" />
                        <span>User Verified: Post-gym workout context tagged.</span>
                    </div>
                </div>
            )
        },
        {
            title: '03 Store: Encrypted Local Health Ledger',
            content: (
                <div className="space-y-2 font-mono text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-[11px] text-slate-300">
                        <code>
                            {JSON.stringify({
                                timestamp: '2026-10-26T07:15:00Z',
                                lotId: 'MS-10SG-702',
                                sha256: 'a9f14...8c2b',
                                encrypted: true
                            }, null, 2)}
                        </code>
                    </div>
                    <p className="text-[10px] text-slate-500">Zero cloud scraping. Local on-device cryptographic storage.</p>
                </div>
            )
        },
        {
            title: '04 Compare: Rolling Median & IQR Corridors',
            content: (
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Personal Baseline Corridor:</span>
                        <strong className="font-mono text-[#006947] dark:text-[#6ffbbe]">0 – 15 mg/dL</strong>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 relative overflow-hidden">
                        <div className="bg-[#006947]/40 h-full w-2/5"></div>
                        <div className="absolute top-0 bottom-0 left-[75%] w-1.5 bg-[#f59e0b] shadow-[0_0_8px_#f59e0b]" title="Recorded: 32 mg/dL"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>Personal Homeostasis</span>
                        <span className="text-[#f59e0b] font-semibold">Day 22 Shift: 32 (+3.8σ)</span>
                    </div>
                </div>
            )
        },
        {
            title: '05 Explain: Grounded Gemini Explanation',
            content: (
                <div className="p-3 rounded-xl bg-[#00685f]/10 border border-[#00685f]/25 space-y-2 text-xs">
                    <div className="flex items-center space-x-1.5 text-[#00685f] dark:text-[#6bd8cb] font-mono text-[11px] font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Gemini Clinical Summary</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed text-[11px]">
                        “Protein elevated to 32 mg/dL alongside concentrated specific gravity (1.028). Highly consistent with your evening cross-training note. Resolving trend observed by Day 26.”
                    </p>
                </div>
            )
        },
        {
            title: '06 Share: Doctor-Ready PDF Export',
            content: (
                <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-[#00687a] dark:text-[#57dffe]" />
                            <span className="font-mono text-slate-200">BT-DOC-2026-9428.pdf</span>
                        </div>
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#006947]/20 text-[#006947] dark:text-[#6ffbbe] border border-[#006947]/30">
                            Ready
                        </span>
                    </div>
                    <button
                        onClick={onOpenReport}
                        className="w-full py-2.5 rounded-xl bg-[#00685f] hover:bg-[#008378] text-white font-mono text-xs uppercase font-bold transition-all shadow-sm"
                    >
                        Preview Document
                    </button>
                </div>
            )
        }
    ];

    return (
        <section className={`relative py-20 transition-colors ${isDark ? 'bg-[#070b14]' : 'bg-[#faf8ff]'}`} id="how-it-works">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Workflow Pipeline Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-[#00685f]"></span>
                            <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#00685f] dark:text-[#6bd8cb]">
                                Deterministic Pipeline
                            </span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                            From Reagent Strip to Actionable Longitudinal Record
                        </h2>
                        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            Six deterministic stages: camera acquisition, user confirmation audit, local encryption, baseline corridor modeling, grounded AI synthesis, and structured clinical export.
                        </p>
                    </div>
                    <button
                        onClick={onOpenDemo}
                        className="px-4 py-2.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider border transition-all self-start md:self-auto shrink-0 bg-white dark:bg-[#0d1526] text-[#00685f] dark:text-[#6bd8cb] border-[#00685f]/30 hover:bg-[#00685f]/10 shadow-xs"
                    >
                        Open Interactive Flow
                    </button>
                </div>

                {/* 6 Steps Grid + Live Interactive Preview Split */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">

                    {/* Left Column: 6 Interactive Step Cards */}
                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {PDF_HOW_IT_WORKS_STEPS.map((item, idx) => {
                            const Icon = stepIcons[idx];
                            const isSelected = activeStep === idx;
                            return (
                                <div
                                    key={item.step}
                                    onClick={() => setActiveStep(idx)}
                                    className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${isSelected
                                        ? isDark
                                            ? 'bg-[#0d1526] border-[#00685f] shadow-[0_8px_25px_rgba(0,104,95,0.2)] ring-1 ring-[#00685f]/50'
                                            : 'bg-white border-[#00685f] shadow-[0_8px_25px_rgba(0,104,95,0.1)] ring-1 ring-[#00685f]/30'
                                        : isDark
                                            ? 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
                                            : 'bg-white border-slate-200 hover:border-[#00685f]/40 shadow-xs'
                                        }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-2xl font-mono font-bold ${isSelected
                                                ? 'text-[#00685f] dark:text-[#6bd8cb]'
                                                : 'text-slate-300 dark:text-slate-700'
                                                }`}>
                                                {item.step}
                                            </span>
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isSelected
                                                ? 'bg-[#00685f] text-white border-[#00685f]'
                                                : isDark ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                                                }`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <h4 className="text-base font-bold mb-1 text-slate-900 dark:text-white">
                                            {item.name}
                                        </h4>

                                        <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                            {item.summary}
                                        </p>
                                    </div>

                                    <div className={`mt-4 pt-3 border-t text-[11px] font-mono flex items-center justify-between ${isDark ? 'border-slate-800 text-[#6bd8cb]' : 'border-slate-100 text-[#00685f]'
                                        }`}>
                                        <span>{item.actionLabel}</span>
                                        <ArrowRight className={`w-3 h-3 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column: Dynamic Stage Simulator Screen */}
                    <div className={`lg:col-span-5 rounded-2xl border p-6 sm:p-8 shadow-xl sticky top-28 ${isDark ? 'bg-[#0d1526] border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                        }`}>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
                            <div className="flex items-center space-x-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-[#00685f] animate-pulse"></span>
                                <span className="text-xs font-mono uppercase font-semibold text-[#00685f] dark:text-[#6bd8cb]">
                                    Live Simulator: Step 0{activeStep + 1}
                                </span>
                            </div>
                            <span className="text-[11px] font-mono text-slate-500">
                                {activeStep + 1} of 6
                            </span>
                        </div>

                        {/* Dynamic Step Visualization */}
                        <h4 className="text-base font-bold mb-3 text-slate-900 dark:text-white">
                            {stepVisuals[activeStep].title}
                        </h4>

                        <div className="mb-6">
                            {stepVisuals[activeStep].content}
                        </div>

                        <div className={`p-4 rounded-xl border text-xs leading-relaxed ${isDark ? 'bg-slate-900/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}>
                            <strong className="block text-[11px] font-mono uppercase mb-1 text-[#00685f] dark:text-[#6bd8cb]">
                                Architectural Guarantee:
                            </strong>
                            {PDF_HOW_IT_WORKS_STEPS[activeStep].details}
                        </div>

                        {/* Step navigation controls */}
                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                            <button
                                onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : 5))}
                                className="px-3.5 py-1.5 rounded-lg text-xs font-mono border transition-colors border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                Previous Step
                            </button>
                            <button
                                onClick={() => setActiveStep((prev) => (prev < 5 ? prev + 1 : 0))}
                                className="px-4 py-1.5 rounded-lg bg-[#00685f] hover:bg-[#008378] text-white text-xs font-mono font-bold transition-all shadow-sm"
                            >
                                Next Step →
                            </button>
                        </div>
                    </div>

                </div>

                {/* Clinical Safety Mandate Dock */}
                <div className={`rounded-2xl p-6 sm:p-8 border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 ${isDark
                    ? 'bg-[#0d1526] border-slate-800'
                    : 'bg-white border-[#e2e8f0]'
                    }`}>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-[#00685f]/15 text-[#00685f] dark:text-[#6bd8cb] border border-[#00685f]/30 flex items-center justify-center shrink-0">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <span className="text-[10px] font-mono uppercase tracking-widest font-bold block mb-1 text-[#00685f] dark:text-[#6bd8cb]">
                                Clinical Governance Mandate
                            </span>
                            <p className="text-base sm:text-lg font-semibold leading-relaxed text-slate-900 dark:text-white">
                                “No automated result is a diagnosis. Every reading is user-confirmed, and every AI summary links back to verified data.”
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onOpenDemo}
                        className="px-5 py-2.5 rounded-xl text-xs font-mono uppercase font-bold shrink-0 transition-all border bg-[#00685f]/10 hover:bg-[#00685f]/20 text-[#00685f] dark:text-[#6bd8cb] border-[#00685f]/30"
                    >
                        Audit Safety Rules
                    </button>
                </div>

            </div>
        </section>
    );
}
