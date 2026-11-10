import React, { useState } from 'react';
import {
  Layers,
  Camera,
  Cpu,
  Database,
  TrendingUp,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Code2,
  ShieldCheck
} from 'lucide-react';
import { ARCHITECTURE_PIPELINE_STAGES, PDF_TECH_STACK } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function SystemArchitecture() {
  const { isDark } = useTheme();

  // Active Stage in the Pipeline Inspector
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [isRunningPipeline, setIsRunningPipeline] = useState(false);

  // Auto-run animated pipeline simulation
  const handleRunSimulation = () => {
    setIsRunningPipeline(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current < ARCHITECTURE_PIPELINE_STAGES.length) {
        setActiveStageIndex(current);
      } else {
        clearInterval(interval);
        setIsRunningPipeline(false);
      }
    }, 1200);
  };

  const activeStage = ARCHITECTURE_PIPELINE_STAGES[activeStageIndex] || ARCHITECTURE_PIPELINE_STAGES[0];

  const stageIcons = [Camera, Cpu, CheckCircle2, Database, TrendingUp, Sparkles];

  return (
    <section
      className={`relative py-24 border-t transition-colors ${isDark ? 'bg-[#070b14] border-white/[0.07]' : 'bg-[#f4efe8]/70 border-amber-900/10'
        }`}
      id="architecture"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* System Architecture Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-inherit">
          <div className="max-w-2xl">
            <span className={`text-[11px] font-mono-code uppercase tracking-wider font-bold block mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
              Deterministic Architecture & Data Isolation
            </span>
            <h2 className={`font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Deterministic Measurement Meets Grounded Intelligence
            </h2>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Separates optical extraction, deterministic mathematical corridors, and conversational AI—guaranteeing verifiable truth with zero hallucination.
            </p>
          </div>

          <div className={`p-3.5 rounded-2xl border text-xs max-w-md self-start md:self-auto shrink-0 ${isDark ? 'bg-amber-950/20 border-amber-400/30 text-amber-200' : 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'}`}>
            <strong className="font-bold block mb-0.5 text-amber-600 dark:text-amber-400 font-mono-code uppercase text-[10px]">Core Architecture Guarantee</strong>
            Gemini only synthesizes verified structured numbers—it never calculates raw statistics or makes clinical diagnoses.
          </div>
        </div>

        {/* =========================================================================
            INTERACTIVE 6-STAGE PIPELINE RUNNER & PAYLOAD INSPECTOR
        ========================================================================== */}
        <div className={`rounded-3xl border p-6 sm:p-10 shadow-2xl mb-16 ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
          }`}>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className={`text-xs font-mono-code uppercase font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                Deterministic Data Flow Pipeline
              </span>
              <h3 className={`text-2xl font-bold font-cinzel mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Stage {activeStage.stage}: {activeStage.layer} → {activeStage.title}
              </h3>
            </div>

            {/* Run Pipeline Simulation Button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRunSimulation}
                disabled={isRunningPipeline}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono-code uppercase flex items-center space-x-2 transition-all shadow-md ${isRunningPipeline
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : isDark
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isRunningPipeline ? 'Tracing Pipeline...' : '▶ Run Live Data Pipeline'}</span>
              </button>

              <button
                onClick={() => setActiveStageIndex(0)}
                className={`p-2.5 rounded-xl border text-xs ${isDark ? 'bg-slate-900 border-white/10 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                title="Reset to Stage 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Stepper Node Flow */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {ARCHITECTURE_PIPELINE_STAGES.map((stg, idx) => {
              const Icon = stageIcons[idx] || Layers;
              const isSelected = activeStageIndex === idx;
              return (
                <button
                  key={stg.stage}
                  onClick={() => setActiveStageIndex(idx)}
                  className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between ${isSelected
                    ? isDark
                      ? 'bg-amber-400/20 border-amber-400/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                      : 'bg-amber-50 border-amber-500 shadow-md ring-1 ring-amber-400/50'
                    : isDark
                      ? 'bg-slate-900/50 border-white/5 hover:bg-slate-800/60 text-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected
                      ? isDark ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-amber-700 text-white font-bold'
                      : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                      }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono-code font-bold">0{idx + 1}</span>
                  </div>

                  <div>
                    <span className={`text-[10px] font-mono-code uppercase block font-semibold ${isSelected ? (isDark ? 'text-amber-300' : 'text-amber-800') : (isDark ? 'text-slate-400' : 'text-slate-500')
                      }`}>
                      {stg.layer}
                    </span>
                    <span className={`text-xs mt-1 block font-medium line-clamp-2 ${isSelected ? (isDark ? 'text-white font-bold' : 'text-slate-900 font-bold') : (isDark ? 'text-slate-300' : 'text-slate-700')
                      }`}>
                      {stg.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Stage Deep Dive */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* Left 6 Cols: Architectural Details & Deterministic Rules */}
            <div className={`lg:col-span-6 p-6 rounded-2xl border ${isDark ? 'bg-slate-950 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
              <div className="flex items-center space-x-2 text-xs font-mono-code uppercase text-amber-500 font-bold mb-3">
                <Code2 className="w-4 h-4" />
                <span>Deterministic Processing Specifications</span>
              </div>

              <h4 className={`text-lg font-bold font-cinzel mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {activeStage.title}
              </h4>

              <p className={`text-xs leading-relaxed mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {activeStage.description}
              </p>

              <div className="space-y-3 text-xs font-mono-code">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="block text-[10px] uppercase text-slate-400 mb-1">Component / Engine:</span>
                  <strong className="text-amber-400">{activeStage.component}</strong>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="block text-[10px] uppercase text-slate-400 mb-1">Underlying Algorithm / Logic:</span>
                  <strong className="text-emerald-400">{activeStage.algorithm}</strong>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30">
                  <span className="block text-[10px] uppercase text-amber-400 mb-1">Clinical Safety Mandate:</span>
                  <p className="text-amber-200/90 font-sans text-xs">{activeStage.deterministicRule}</p>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Live JSON Payload Schema Inspector */}
            <div className={`lg:col-span-6 p-6 rounded-2xl border ${isDark ? 'bg-slate-950 border-white/10' : 'bg-slate-50 border-slate-200'
              }`}>
              <div className="flex items-center justify-between text-xs font-mono-code mb-3">
                <span className="text-emerald-400 uppercase font-bold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Real-Time In-Flight JSON Payload</span>
                </span>
                <span className="text-[10px] text-slate-500">Stage {activeStage.stage} Output</span>
              </div>

              <pre className="p-4 rounded-xl bg-black/70 border border-white/10 text-xs font-mono-code text-amber-200 overflow-x-auto leading-relaxed">
                {JSON.stringify(activeStage.samplePayload, null, 2)}
              </pre>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Verified Schema: Strict Type Safety</span>
                <span className="text-emerald-400 font-mono-code font-bold">100% Deterministic</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tech Stack Cards Grid */}
        <div>
          <h3 className={`text-xl font-bold font-cinzel text-center mb-8 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Implemented Architectural Tiers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PDF_TECH_STACK.map((tech) => (
              <div
                key={tech.title}
                className={`p-5 rounded-2xl border transition-all ${isDark ? 'bg-[#090e18] border-white/5 hover:border-amber-400/30' : 'bg-white border-slate-200 hover:border-amber-300 shadow-sm'
                  }`}
              >
                <span className={`text-[10px] font-mono-code uppercase font-bold px-2 py-0.5 rounded border mb-3 inline-block ${isDark ? 'bg-amber-400/10 text-amber-300 border-amber-400/20' : 'bg-amber-50 text-amber-800 border-amber-300'
                  }`}>
                  {tech.category}
                </span>

                <h4 className={`text-sm font-bold font-cinzel ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {tech.title}
                </h4>

                <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {tech.role}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
