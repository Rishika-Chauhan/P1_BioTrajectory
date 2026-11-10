import React from 'react';
import { Sparkles, Shield, ChevronRight, Activity, ArrowDownRight, Compass, LineChart, FileText, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Hero({ onOpenDemo, onOpenReport }) {
  const { isDark } = useTheme();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 overflow-hidden" id="vision">
      {/* Background Ambient Glows */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full blur-[140px] pointer-events-none ${isDark ? 'bg-cyan-500/10' : 'bg-cyan-300/15'
        }`}></div>
      <div className={`absolute top-1/3 left-1/4 w-[450px] h-[450px] rounded-full blur-[120px] pointer-events-none ${isDark ? 'bg-blue-500/10' : 'bg-blue-400/15'
        }`}></div>
      <div className={`absolute top-2/3 right-1/4 w-[500px] h-[400px] rounded-full blur-[130px] pointer-events-none ${isDark ? 'bg-teal-500/10' : 'bg-teal-400/15'
        }`}></div>

      {/* Subtle Luxury Technical Grid Lines */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,${isDark ? '#ffffff05' : '#00000006'}_1px,transparent_1px),linear-gradient(to_bottom,${isDark ? '#ffffff05' : '#00000006'}_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none`}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">

        {/* Top Concept & Event Badge */}
        <div className={`inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full border text-xs font-mono uppercase tracking-widest mb-6 shadow-xs ${isDark
            ? 'bg-gradient-to-r from-cyan-500/10 via-blue-500/15 to-indigo-500/10 border-cyan-400/30 text-cyan-200'
            : 'bg-gradient-to-r from-cyan-100/90 via-white to-blue-50 border-cyan-300 text-cyan-900 shadow-cyan-900/5'
          }`}>
          <span className="font-bold text-cyan-700 dark:text-cyan-300">BIOTRAJECTORY AI</span>
          <span>•</span>
          <span className="font-semibold">Longitudinal Health Intelligence</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span>Adaptive Baseline</span>
        </div>

        {/* Lifecycle Ribbon */}
        <div className="mb-6 flex items-center justify-center space-x-2 text-[11px] font-mono tracking-widest uppercase text-cyan-700 dark:text-cyan-400">
          <span>DAILY SIGNALS</span>
          <span>→</span>
          <span className="font-bold underline decoration-cyan-500 underline-offset-4">PERSONAL BASELINE</span>
          <span>→</span>
          <span>TRAJECTORY ENGINE</span>
          <span>→</span>
          <span>CLINICAL REPORT</span>
        </div>

        {/* Main Editorial Headline */}
        <h1 className={`text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.12] ${isDark ? 'text-white' : 'text-slate-900'
          }`}>
          Healthcare That Understands <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 italic font-serif">
            Where Your Health Is Heading.
          </span>
        </h1>

        {/* Core Vision Quote */}
        <div className="mt-6 inline-block max-w-2xl mx-auto">
          <p className={`text-lg sm:text-xl font-serif italic tracking-wide py-2.5 px-6 rounded-full border ${isDark
              ? 'border-cyan-400/20 text-cyan-200/90 bg-cyan-950/20'
              : 'border-cyan-300/80 text-cyan-900 bg-cyan-50/70 shadow-sm'
            }`}>
            “Others measure your health. We track where it is going.”
          </p>
        </div>

        {/* Subtitle / Value Proposition */}
        <p className={`mt-5 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
          Marker-by-marker trends, never one misleading health score. Continuous personal baseline intelligence for chronic prevention.
        </p>

        {/* Primary CTA Cluster */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenDemo}
            className={`group px-8 py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 flex items-center space-x-3 shadow-lg active:scale-95 cursor-pointer ${isDark
                ? 'bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 text-slate-950 shadow-[0_0_35px_rgba(0,217,255,0.3)] hover:shadow-[0_0_50px_rgba(0,217,255,0.5)]'
                : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 text-white shadow-[0_10px_25px_rgba(0,143,174,0.3)] hover:shadow-[0_15px_30px_rgba(0,143,174,0.45)]'
              }`}
          >
            <Activity className="w-4 h-4" />
            <span>Launch Interactive Prototype</span>
            <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onOpenReport}
            className={`px-7 py-4 rounded-xl border text-sm font-semibold tracking-wider uppercase transition-all flex items-center space-x-2 backdrop-blur-md shadow-sm active:scale-95 cursor-pointer ${isDark
                ? 'border-white/15 hover:border-cyan-400/40 bg-slate-900/70 hover:bg-slate-800 text-slate-200 hover:text-white'
                : 'border-slate-300 hover:border-cyan-500 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900'
              }`}
          >
            <FileText className={`w-4 h-4 ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`} />
            <span>Generate Clinician PDF Brief</span>
          </button>

          <a
            href="#vision"
            className={`px-6 py-4 rounded-xl text-sm font-medium tracking-wider transition-all flex items-center space-x-1 ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
              }`}
          >
            <span>Learn More</span>
            <ArrowDownRight className="w-4 h-4" />
          </a>
        </div>

        {/* Key Guiding Pillars */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
          <div className={`p-5 rounded-2xl border transition-all ${isDark
              ? 'bg-slate-900/40 border-white/5 hover:border-cyan-400/30'
              : 'bg-white border-slate-200 shadow-sm hover:border-cyan-400/50'
            }`}>
            <div className={`flex items-center space-x-2 text-xs font-mono uppercase tracking-wider mb-1 ${isDark ? 'text-cyan-300' : 'text-cyan-700'
              }`}>
              <Compass className="w-3.5 h-3.5" />
              <span>Signal Input</span>
            </div>
            <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Daily Vitals
            </div>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Blood pressure, resting pulse, activity levels, and urine test strips with simple entry.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition-all ${isDark
              ? 'bg-slate-900/40 border-white/5 hover:border-blue-400/30'
              : 'bg-white border-slate-200 shadow-sm hover:border-blue-400/50'
            }`}>
            <div className={`flex items-center space-x-2 text-xs font-mono uppercase tracking-wider mb-1 ${isDark ? 'text-blue-300' : 'text-blue-700'
              }`}>
              <LineChart className="w-3.5 h-3.5" />
              <span>Trajectory Engine</span>
            </div>
            <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Personal Baseline
            </div>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Constructed after consecutive entries using rolling medians, eliminating arbitrary single scores.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition-all ${isDark
              ? 'bg-slate-900/40 border-white/5 hover:border-cyan-400/30'
              : 'bg-white border-slate-200 shadow-sm hover:border-cyan-400/50'
            }`}>
            <div className={`flex items-center space-x-2 text-xs font-mono uppercase tracking-wider mb-1 ${isDark ? 'text-cyan-300' : 'text-cyan-700'
              }`}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Grounded AI</span>
            </div>
            <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Health Assistant
            </div>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Explains confirmed facts and uncertainty without hallucinating medical diagnoses.
            </p>
          </div>

          <div className={`p-5 rounded-2xl border transition-all ${isDark
              ? 'bg-slate-900/40 border-white/5 hover:border-indigo-400/30'
              : 'bg-white border-slate-200 shadow-sm hover:border-indigo-400/50'
            }`}>
            <div className={`flex items-center space-x-2 text-xs font-mono uppercase tracking-wider mb-1 ${isDark ? 'text-indigo-300' : 'text-indigo-700'
              }`}>
              <Shield className="w-3.5 h-3.5" />
              <span>Clinical Ethos</span>
            </div>
            <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Doctor in the Loop
            </div>
            <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Doctor-ready timeline export; symptoms always take absolute priority.
            </p>
          </div>
        </div>

        {/* Live Interactive Preview Floating Card */}
        <div className={`mt-14 max-w-4xl mx-auto rounded-2xl p-1 shadow-2xl ${isDark
            ? 'bg-gradient-to-b from-cyan-500/20 via-blue-500/10 to-transparent'
            : 'bg-gradient-to-b from-cyan-300/40 via-blue-200/20 to-transparent'
          }`}>
          <div className={`rounded-[15px] border p-6 text-left ${isDark
              ? 'bg-[#090e18]/95 border-white/10'
              : 'bg-white border-slate-200 shadow-sm'
            }`}>
            <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b ${isDark ? 'border-white/10' : 'border-slate-100'
              }`}>
              <div className="flex items-center space-x-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <div>
                  <h4 className={`text-sm font-semibold tracking-wide ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Live Longitudinal Simulation: Patient BT-9428
                  </h4>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Observation Window: 30 Days (15 verified sessions) • Baseline Established
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono">
                <span className={`px-2.5 py-1 rounded border ${isDark ? 'bg-cyan-400/10 text-cyan-300 border-cyan-400/20' : 'bg-cyan-50 text-cyan-900 border-cyan-300'
                  }`}>
                  Day 22 Normal Variance Flagged
                </span>
                <span className={`px-2.5 py-1 rounded border ${isDark ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/20' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  }`}>
                  Resolved Day 26
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-white/5' : 'bg-slate-50 border-slate-200'
                }`}>
                <span className={`block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Established Baseline</span>
                <span className={`font-mono text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Protein: 5.2 ± 1.1 mg/dL</span>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>10-point rolling median corridor</p>
              </div>

              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-cyan-950/20 border-cyan-500/30' : 'bg-cyan-50/70 border-cyan-300/80'
                }`}>
                <span className={`block mb-1 font-medium ${isDark ? 'text-cyan-300' : 'text-cyan-900'}`}>Day 22 Recorded Variance</span>
                <span className={`font-mono text-sm font-semibold ${isDark ? 'text-cyan-200' : 'text-cyan-950'}`}>Protein: 32 mg/dL (+3.8σ)</span>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-cyan-200/70' : 'text-cyan-800'}`}>Concentrated urine (SG 1.028) + cross-training</p>
              </div>

              <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50/70 border-emerald-300/80'
                }`}>
                <span className={`block mb-1 font-medium ${isDark ? 'text-emerald-300' : 'text-emerald-900'}`}>Day 30 Trajectory Status</span>
                <span className={`font-mono text-sm font-semibold ${isDark ? 'text-emerald-200' : 'text-emerald-950'}`}>5.0 mg/dL (Restored)</span>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-emerald-200/70' : 'text-emerald-800'}`}>Consistent baseline stability maintained</p>
              </div>
            </div>

            <div className={`mt-4 pt-3 flex items-center justify-between text-xs border-t ${isDark ? 'border-white/5 text-slate-400' : 'border-slate-100 text-slate-500'
              }`}>
              <span className={`italic font-serif text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                “A single snapshot would have induced panic. The trajectory provided peace of mind and clinical clarity.”
              </span>
              <button
                onClick={onOpenDemo}
                className={`font-semibold flex items-center space-x-1 cursor-pointer ${isDark ? 'text-cyan-300 hover:text-cyan-200' : 'text-cyan-700 hover:text-cyan-900'}`}
              >
                <span>Examine Full Dataset</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
