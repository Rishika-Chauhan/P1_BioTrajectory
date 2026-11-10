import React, { useState } from 'react';
import { Camera, CheckCircle2, Database, TrendingUp, Sparkles, FileText, ShieldAlert, ArrowRight, Play, RefreshCw } from 'lucide-react';
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
                    <div className="flex items-center justify-between text-xs font-mono-code">
                        <span className="text-emerald-500 font-semibold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            Optical Target Locked
                        </span>
                        <span className="text-amber-500">Lux: 520 (Optimal)</span>
                    </div>
                    <div className="h-32 rounded-xl bg-slate-900 border border-amber-400/30 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-4 border border-dashed border-amber-400/60 rounded flex items-center justify-center">
                            <span className="text-[11px] font-mono-code text-amber-200">Reagent Strip Alignment Zone</span>
                        </div>
                        <div className="w-12 h-24 bg-white/90 rounded shadow flex flex-col justify-around py-1 px-1">
                            <div className="w-full h-1.5 rounded-xs bg-[#985888]"></div>
                            <div className="w-full h-1.5 rounded-xs bg-[#e8ea9c]"></div>
                            <div className="w-full h-1.5 rounded-xs bg-[#a7cd9a]"></div>
                            <div className="w-full h-1.5 rounded-xs bg-[#e08f36]"></div>
                            <div className="w-full h-1.5 rounded-xs bg-[#568b44]"></div>
                        </div>
                    </div>
                    <p className="text-[11px] text-slate-500 italic">“60s reaction timing calibrated automatically.”</p>
                </div>
            )
        },
        {
            title: '02 Confirm: Swatch Estimation & User Audit',
            content: (
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
                        <div className="p-2 rounded bg-amber-500/10 border border-amber-400/30">
                            <span className="block text-[10px] text-slate-400">Protein Pad</span>
                            <strong className="text-amber-300">30 mg/dL (1+)</strong>
                        </div>
                        <div className="p-2 rounded bg-slate-800/80 border border-white/5">
                            <span className="block text-[10px] text-slate-400">Specific Gravity</span>
                            <strong className="text-white">1.028</strong>
                        </div>
                    </div>
                    <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-2 text-xs text-emerald-300">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>User Verified: Post-gym workout notes tagged.</span>
                    </div>
                </div>
            )
        },
        {
            title: '03 Store: Encrypted Local Health Ledger',
            content: (
                <div className="space-y-2 font-mono-code text-xs">
                    <div className="p-2.5 rounded bg-slate-900 border border-white/10 text-[11px] text-slate-300">
                        <code>
                            {JSON.stringify({
                                timestamp: '2026-10-26T07:15:00Z',
                                lotId: 'MS-10SG-702',
                                sha256: 'a9f14...8c2b',
                                encrypted: true
                            }, null, 2)}
                        </code>
                    </div>
                    <p className="text-[10px] text-slate-500">Zero cloud scraping. Zero monetization.</p>
                </div>
            )
        },
        {
            title: '04 Compare: Rolling Median & IQR Corridors',
            content: (
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">Baseline Corridor:</span>
                        <strong className="font-mono-code text-emerald-400">0 – 15 mg/dL</strong>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 relative overflow-hidden">
                        <div className="bg-emerald-500/30 h-full w-2/5"></div>
                        <div className="absolute top-0 bottom-0 left-[75%] w-1.5 bg-rose-500 animate-pulse" title="Recorded: 32 mg/dL"></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono-code text-slate-400">
                        <span>Normal Homeostasis</span>
                        <span className="text-rose-400 font-semibold">Day 22 Spike: 32 (+3.8σ)</span>
                    </div>
                </div>
            )
        },
        {
            title: '05 Explain: Grounded Gemini Explanation',
            content: (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/25 space-y-2 text-xs">
                    <div className="flex items-center space-x-1.5 text-amber-300 font-mono-code text-[11px] font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Gemini Clinical Summary</span>
                    </div>
                    <p className="text-slate-200 leading-relaxed text-[11px]">
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
                            <FileText className="w-4 h-4 text-amber-400" />
                            <span className="font-mono-code text-slate-200">BT-DOC-2026-9428.pdf</span>
                        </div>
                        <span className="text-[10px] uppercase font-mono-code px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            Ready
                        </span>
                    </div>
                    <button
                        onClick={onOpenReport}
                        className="w-full py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono-code text-xs uppercase font-bold transition-colors"
                    >
                        Preview Document
                    </button>
                </div>
            )
        }
    ];

    return (
        <section className={`relative py-28 transition-colors ${isDark ? 'bg-[#05070c]' : 'bg-[#faf9f6]'
            }`} id="how-it-works">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Workflow Pipeline Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-inherit">
                    <div className="max-w-2xl">
                        <span className={`text-[11px] font-mono-code uppercase tracking-wider font-bold block mb-2 ${isDark ? 'text-cyan-400' : 'text-cyan-700'}`}>
                            End-to-End Operational Pipeline
                        </span>
                        <h2 className={`font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            From Reagent Strip to Actionable Longitudinal Record
                        </h2>
                        <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Six deterministic stages: camera acquisition, user confirmation audit, local encryption, baseline corridor modeling, grounded AI synthesis, and structured clinical export.
                        </p>
                    </div>
                    <button
                        onClick={onOpenDemo}
                        className={`px-4 py-2 rounded-xl text-xs font-mono-code font-bold uppercase tracking-wider border transition-all self-start md:self-auto shrink-0 ${isDark ? 'bg-slate-900 text-cyan-300 border-cyan-500/30 hover:bg-slate-800' : 'bg-white text-cyan-800 border-cyan-300 hover:bg-cyan-50 shadow-xs'
                            }`}
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
                                            ? 'bg-[#11192e] border-amber-400 shadow-[0_10px_30px_rgba(217,119,6,0.15)] ring-1 ring-amber-400/40'
                                            : 'bg-white border-amber-500 shadow-[0_10px_30px_rgba(180,145,95,0.1)] ring-1 ring-amber-400/60'
                                        : isDark
                                            ? 'bg-[#090e18] border-white/5 hover:border-white/15'
                                            : 'bg-white border-slate-200 hover:border-amber-300 shadow-xs'
                                        }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`text-2xl font-mono-code font-bold ${isSelected
                                                ? isDark ? 'text-amber-300' : 'text-amber-700'
                                                : isDark ? 'text-slate-600' : 'text-slate-300'
                                                }`}>
                                                {item.step}
                                            </span>
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isSelected
                                                ? isDark ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-amber-700 text-white border-amber-800'
                                                : isDark ? 'bg-slate-900 text-slate-400 border-white/5' : 'bg-slate-50 text-slate-600 border-slate-200'
                                                }`}>
                                                <Icon className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <h4 className={`font-cinzel text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'
                                            }`}>
                                            {item.name}
                                        </h4>

                                        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'
                                            }`}>
                                            {item.summary}
                                        </p>
                                    </div>

                                    <div className={`mt-4 pt-3 border-t text-[11px] font-mono-code flex items-center justify-between ${isDark ? 'border-white/5 text-amber-300/80' : 'border-slate-100 text-amber-900/80'
                                        }`}>
                                        <span>{item.actionLabel}</span>
                                        <ArrowRight className={`w-3 h-3 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column: Dynamic Stage Simulator Screen */}
                    <div className={`lg:col-span-5 rounded-2xl border p-6 sm:p-8 shadow-xl sticky top-28 ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10 shadow-[0_15px_40px_rgba(180,145,95,0.08)]'
                        }`}>
                        <div className="flex items-center justify-between pb-4 border-b border-inherit mb-6">
                            <div className="flex items-center space-x-2">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                                <span className={`text-xs font-mono-code uppercase font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'
                                    }`}>
                                    Live Simulator: Step 0{activeStep + 1}
                                </span>
                            </div>
                            <span className={`text-[11px] font-mono-code ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {activeStep + 1} of 6
                            </span>
                        </div>

                        {/* Dynamic Step Visualization */}
                        <h4 className={`font-cinzel text-base font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {stepVisuals[activeStep].title}
                        </h4>

                        <div className="mb-6">
                            {stepVisuals[activeStep].content}
                        </div>

                        <div className={`p-4 rounded-xl border text-xs leading-relaxed ${isDark ? 'bg-slate-900/60 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}>
                            <strong className="block text-[11px] font-mono-code uppercase mb-1 text-amber-700 dark:text-amber-300">
                                Architectural Guarantee:
                            </strong>
                            {PDF_HOW_IT_WORKS_STEPS[activeStep].details}
                        </div>

                        {/* Step navigation controls */}
                        <div className="mt-6 flex items-center justify-between pt-4 border-t border-inherit">
                            <button
                                onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : 5))}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono-code border transition-colors ${isDark ? 'border-white/10 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                                    }`}
                            >
                                Previous Step
                            </button>
                            <button
                                onClick={() => setActiveStep((prev) => (prev < 5 ? prev + 1 : 0))}
                                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono-code font-bold transition-colors"
                            >
                                Next Step →
                            </button>
                        </div>
                    </div>

                </div>

                {/* Golden Safety Rule Banner */}
                <div className={`rounded-2xl p-6 sm:p-8 border shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 ${isDark
                    ? 'bg-gradient-to-r from-rose-950/30 via-slate-900 to-rose-950/30 border-rose-500/30'
                    : 'bg-gradient-to-r from-rose-50 via-white to-rose-50 border-rose-300/80 shadow-[0_10px_30px_rgba(244,63,94,0.06)]'
                    }`}>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-600 border border-rose-400/40 flex items-center justify-center shrink-0">
                            <ShieldAlert className="w-6 h-6" />
                        </div>
                        <div>
                            <span className={`text-[10px] font-mono-code uppercase tracking-widest font-bold block mb-1 text-rose-600 dark:text-rose-400`}>
                                The Clinical Safety Mandate
                            </span>
                            <p className={`font-serif-lux text-base sm:text-lg md:text-xl italic font-semibold leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'
                                }`}>
                                “No automated result is a diagnosis. Every reading is user-confirmed, and every AI summary links back to the data.”
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onOpenDemo}
                        className={`px-5 py-2.5 rounded-xl text-xs font-mono-code uppercase font-bold shrink-0 transition-all border ${isDark
                            ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border-rose-500/40'
                            : 'bg-rose-100 hover:bg-rose-200 text-rose-900 border-rose-300 shadow-xs'
                            }`}
                    >
                        Audit Safety Rules
                    </button>
                </div>

            </div>
        </section>
    );
}
