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
      className={`relative py-20 border-t transition-colors ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-[#faf8ff] border-slate-200'
        }`}
      id="architecture"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* System Architecture Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#00685f]"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#00685f] dark:text-[#6bd8cb]">
                Deterministic Architecture & Data Isolation
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Deterministic Measurement Meets Grounded Intelligence
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Separates optical extraction, deterministic mathematical corridors, and conversational AI—guaranteeing verifiable truth with zero hallucination.
            </p>
          </div>

          <div className="p-4 rounded-2xl border text-xs max-w-md self-start md:self-auto shrink-0 bg-white dark:bg-[#0d1526] border-slate-200 dark:border-slate-800 shadow-sm">
            <strong className="font-bold block mb-1 text-[#00685f] dark:text-[#6bd8cb] font-mono uppercase text-[10px]">
              Core Architecture Guarantee
            </strong>
            <p className="text-slate-600 dark:text-slate-400">
              Gemini only synthesizes verified structured numbers—it never calculates raw statistics or makes clinical diagnoses.
            </p>
          </div>
        </div>

        {/* =========================================================================
            INTERACTIVE 6-STAGE PIPELINE RUNNER & PAYLOAD INSPECTOR
        ========================================================================== */}
        <div className={`rounded-2xl border p-6 sm:p-8 shadow-sm mb-16 ${isDark ? 'bg-[#0d1526] border-slate-800' : 'bg-white border-slate-200'
          }`}>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-xs font-mono uppercase font-semibold text-[#00685f] dark:text-[#6bd8cb]">
                Deterministic Data Flow Pipeline
              </span>
              <h3 className="text-xl sm:text-2xl font-bold mt-1 text-slate-900 dark:text-white">
                Stage {activeStage.stage}: {activeStage.layer} → {activeStage.title}
              </h3>
            </div>

            {/* Run Pipeline Simulation Button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRunSimulation}
                disabled={isRunningPipeline}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono uppercase flex items-center space-x-2 transition-all shadow-sm ${isRunningPipeline
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-[#00685f] hover:bg-[#008378] text-white'
                  }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>{isRunningPipeline ? 'Tracing Pipeline...' : '▶ Run Live Data Pipeline'}</span>
              </button>

              <button
                onClick={() => setActiveStageIndex(0)}
                className={`p-2.5 rounded-xl border text-xs ${isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
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
                      ? 'bg-[#00685f]/20 border-[#00685f] shadow-sm ring-1 ring-[#00685f]/50'
                      : 'bg-[#00685f]/10 border-[#00685f] shadow-sm ring-1 ring-[#00685f]/30'
                    : isDark
                      ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-800/60 text-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected
                      ? 'bg-[#00685f] text-white font-bold'
                      : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-200 text-slate-600'
                      }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold">0{idx + 1}</span>
                  </div>

                  <div>
                    <span className={`text-[10px] font-mono uppercase block font-semibold ${isSelected ? 'text-[#00685f] dark:text-[#6bd8cb]' : 'text-slate-500'
                      }`}>
                      {stg.layer}
                    </span>
                    <span className={`text-xs mt-1 block font-medium line-clamp-2 ${isSelected ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-700 dark:text-slate-300'
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
            <div className={`lg:col-span-6 p-6 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
              <div className="flex items-center space-x-2 text-xs font-mono uppercase text-[#00685f] dark:text-[#6bd8cb] font-bold mb-3">
                <Code2 className="w-4 h-4" />
                <span>Deterministic Processing Specifications</span>
              </div>

              <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
                {activeStage.title}
              </h4>

              <p className="text-xs leading-relaxed mb-4 text-slate-600 dark:text-slate-300">
                {activeStage.description}
              </p>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="block text-[10px] uppercase text-slate-400 mb-1">Component / Engine:</span>
                  <strong className="text-[#00687a] dark:text-[#57dffe]">{activeStage.component}</strong>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="block text-[10px] uppercase text-slate-400 mb-1">Underlying Algorithm / Logic:</span>
                  <strong className="text-[#006947] dark:text-[#6ffbbe]">{activeStage.algorithm}</strong>
                </div>

                <div className="p-3 rounded-xl bg-[#00685f]/15 border border-[#00685f]/30">
                  <span className="block text-[10px] uppercase text-[#00685f] dark:text-[#6bd8cb] mb-1 font-bold">Clinical Safety Mandate:</span>
                  <p className="text-slate-800 dark:text-slate-200 font-sans text-xs">{activeStage.deterministicRule}</p>
                </div>
              </div>
            </div>

            {/* Right 6 Cols: Live JSON Payload Schema Inspector */}
            <div className={`lg:col-span-6 p-6 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
              <div className="flex items-center justify-between text-xs font-mono mb-3">
                <span className="text-[#006947] dark:text-[#6ffbbe] uppercase font-bold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Real-Time In-Flight JSON Payload</span>
                </span>
                <span className="text-[10px] text-slate-500">Stage {activeStage.stage} Output</span>
              </div>

              <pre className="p-4 rounded-xl bg-black/70 border border-white/10 text-xs font-mono text-[#6bd8cb] overflow-x-auto leading-relaxed">
                {JSON.stringify(activeStage.samplePayload, null, 2)}
              </pre>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Verified Schema: Strict Type Safety</span>
                <span className="text-[#006947] dark:text-[#6ffbbe] font-mono font-bold">100% Deterministic</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tech Stack Cards Grid */}
        <div>
          <h3 className="text-xl font-bold text-center mb-8 text-slate-900 dark:text-white">
            Implemented Architectural Tiers
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PDF_TECH_STACK.map((tech) => (
              <div
                key={tech.title}
                className={`p-5 rounded-2xl border transition-all ${isDark ? 'bg-[#0d1526] border-slate-800 hover:border-[#00685f]/40' : 'bg-white border-slate-200 hover:border-[#00685f]/30 shadow-xs'
                  }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border mb-3 inline-block bg-[#00685f]/10 text-[#00685f] dark:text-[#6bd8cb] border-[#00685f]/25">
                  {tech.category}
                </span>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {tech.title}
                </h4>

                <p className="text-xs mt-1.5 leading-relaxed text-slate-600 dark:text-slate-400">
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
