import React, { useState } from 'react';
import { Layers } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function SystemArchitecture() {
  const { isDark } = useTheme();
  const [activeStep, setActiveStep] = useState(0);

  const pipelineSteps = [
    { name: '1. Camera Capture', desc: 'Guided smartphone photo or manual entry with lux & tilt sensors', tag: 'Input Layer' },
    { name: '2. Optical Calibration', desc: 'Color-space correction (OpenCV) & pad extraction', tag: 'Measurement' },
    { name: '3. User Confirmation', desc: 'Mandatory patient audit & correction before saving', tag: 'Safety Audit' },
    { name: '4. Encrypted Store', desc: 'Timestamped parameter record with contextual notes', tag: 'Data Layer' },
    { name: '5. Trajectory Engine', desc: 'Rolling median baseline & persistence deviation check', tag: 'Statistical Logic' },
    { name: '6. Grounded Gemini AI', desc: 'Plain-language explanation with explicit limitations', tag: 'AI Explanation' },
    { name: '7. Clinician Handover', desc: 'Consent-authorized exportable doctor brief', tag: 'Clinical Care' },
  ];

  const techStack = [
    { title: 'Frontend UI', tech: 'React 19 + Tailwind CSS + Lucide', role: 'Accessible luxury patient interface & real-time SVG charting' },
    { title: 'Computer Vision', tech: 'OpenCV / WebAssembly', role: 'Chromatic balance, pad segmentation, and image adequacy checks' },
    { title: 'Deterministic Analytics', tech: 'Python / Pandas / Statistical Rules', role: 'Rolling medians, variability bands, IQR deviation algorithms' },
    { title: 'AI Language Engine', tech: 'Gemini 3.8 Flash (High)', role: 'Structured translation, non-diagnostic synthesis, doctor briefs' },
    { title: 'Secure Storage', tech: 'AES-256 Encrypted Local Store / PostgreSQL', role: 'Zero-knowledge biometric telemetry and consent controls' },
  ];

  return (
    <section className={`relative py-24 border-t transition-colors ${
      isDark ? 'bg-[#070b14] border-white/[0.07]' : 'bg-[#f4efe8]/70 border-amber-900/10'
    }`} id="architecture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-xs font-mono-code uppercase tracking-wider mb-4 ${
            isDark ? 'bg-indigo-500/10 border-indigo-500/25 text-indigo-300' : 'bg-indigo-50 border-indigo-300 text-indigo-900 shadow-sm'
          }`}>
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>Section 6 & 9 • System Architecture & Data Flow</span>
          </div>

          <h2 className={`font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            Deterministic Precision Meets Generative AI
          </h2>
          <p className={`mt-4 text-base sm:text-lg font-light leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            A practical architecture that strictly separates image capture, statistical trend analysis, and natural language communication—guaranteeing deterministic calculations while leveraging Gemini for compassionate clarity.
          </p>
        </div>

        {/* Interactive Data Flow Pipeline */}
        <div className={`rounded-2xl border p-6 sm:p-8 shadow-xl mb-12 ${
          isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
        }`}>
          <h3 className={`text-sm font-semibold mb-2 flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            <span className={`font-mono-code uppercase font-semibold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
              Section 5 & 6: End-to-End Data Flow Pipeline
            </span>
          </h3>
          <p className={`text-xs mb-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Click through the processing steps to see how a physical biological signal transforms into clinical insight:
          </p>

          {/* Stepper buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {pipelineSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl text-left border transition-all ${
                  activeStep === idx
                    ? isDark
                      ? 'bg-amber-400/20 border-amber-400/50 shadow-sm'
                      : 'bg-amber-50 border-amber-400 text-amber-900 font-semibold shadow-xs'
                    : isDark
                    ? 'bg-slate-900/50 border-white/5 hover:bg-slate-800/60'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className={`text-[10px] font-mono-code uppercase block font-semibold ${
                  activeStep === idx ? (isDark ? 'text-amber-300' : 'text-amber-800') : (isDark ? 'text-slate-400' : 'text-slate-500')
                }`}>
                  {step.tag}
                </span>
                <span className={`text-xs mt-1 block font-medium ${
                  activeStep === idx ? (isDark ? 'text-white' : 'text-slate-900 font-bold') : (isDark ? 'text-slate-300' : 'text-slate-700')
                }`}>
                  {step.name}
                </span>
              </button>
            ))}
          </div>

          {/* Active Step Showcase */}
          <div className={`mt-6 p-5 rounded-xl border flex flex-wrap items-center justify-between gap-4 ${
            isDark ? 'bg-slate-950 border-white/10' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <span className={`text-xs font-mono-code uppercase tracking-wider block mb-1 font-semibold ${
                isDark ? 'text-emerald-400' : 'text-emerald-800'
              }`}>
                Active Pipeline Stage: {pipelineSteps[activeStep].tag}
              </span>
              <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {pipelineSteps[activeStep].name}
              </h4>
              <p className={`text-xs mt-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {pipelineSteps[activeStep].desc}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : pipelineSteps.length - 1))}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                  isDark ? 'bg-slate-800 text-slate-300 border-white/5 hover:text-white' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Previous Step
              </button>
              <button
                onClick={() => setActiveStep((prev) => (prev < pipelineSteps.length - 1 ? prev + 1 : 0))}
                className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                  isDark ? 'bg-amber-400 text-slate-950 hover:bg-amber-300' : 'bg-amber-600 text-white hover:bg-amber-700'
                }`}
              >
                Next Step
              </button>
            </div>
          </div>
        </div>

        {/* Technology Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((item, idx) => (
            <div key={idx} className={`p-5 rounded-xl border shadow-lg ${
              isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10'
            }`}>
              <span className={`text-[10px] font-mono-code uppercase font-semibold ${
                isDark ? 'text-amber-300' : 'text-amber-800'
              }`}>
                {item.title}
              </span>
              <h4 className={`text-sm font-bold mt-1 mb-2 font-cinzel ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {item.tech}
              </h4>
              <p className={`text-xs leading-relaxed font-light ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {item.role}
              </p>
            </div>
          ))}

          {/* Staged Concept Note */}
          <div className={`p-5 rounded-xl border shadow-lg flex flex-col justify-between ${
            isDark
              ? 'bg-gradient-to-br from-amber-950/20 to-slate-900 border-amber-400/30'
              : 'bg-gradient-to-br from-amber-50 to-white border-amber-300'
          }`}>
            <div>
              <span className={`text-[10px] font-mono-code uppercase font-semibold ${
                isDark ? 'text-amber-300' : 'text-amber-900'
              }`}>
                Staged Implementation Note
              </span>
              <h4 className={`text-sm font-bold mt-1 mb-2 font-cinzel ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Buildable Software First
              </h4>
              <p className={`text-xs leading-relaxed font-light ${isDark ? 'text-amber-200/80' : 'text-amber-900'}`}>
                Prioritizes reliable manual entry and trend visualization today, with computer vision calibration and smart fixtures planned for later phases.
              </p>
            </div>
            <span className={`text-[10px] font-mono-code mt-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Section 2 & 9 Guideline
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
