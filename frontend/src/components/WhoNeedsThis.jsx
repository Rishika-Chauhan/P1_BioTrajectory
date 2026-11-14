import React, { useState } from 'react';
import { Users, Building2, Stethoscope, Microscope, CheckCircle, ArrowRight, Activity } from 'lucide-react';
import { PDF_AUDIENCES } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function WhoNeedsThis({ onOpenDemo }) {
  const { isDark } = useTheme();
  const [selectedAudience, setSelectedAudience] = useState(0);

  const audienceIcons = [Users, Building2, Stethoscope, Microscope];

  const audienceDeepDives = [
    {
      role: 'For Individuals & Families',
      userStory: '“My father gets an annual checkup, but we never know if slight deviations are worsening or just a passing fluke. BioTrajectory gives us a visual longitudinal story between annual visits.”',
      keyBenefit: 'Replaces panic over single snapshots with grounded peace of mind.',
      features: ['No medical jargon', 'Automated reminder cadences', 'Household profile switching', 'Exportable doctor brief']
    },
    {
      role: 'For Rural & Underserved Communities',
      userStory: '“In Tier-2 and rural clinics, expensive automated biochemistry analyzers are rare. Commercial strips with smartphone camera guidance bring affordable screening to local chemists.”',
      keyBenefit: 'Accessible low-cost preventive infrastructure without proprietary hardware.',
      features: ['Offline-capable logging', 'Works on entry-level Android cameras', 'Low recurring test cost ($0.15/strip)', 'Community health worker mode']
    },
    {
      role: 'For Doctors & Clinicians',
      userStory: '“When a patient walks into my clinic with single lab results, I lack context. A consented 30-day baseline showing persistence or normalization transforms my diagnostic consultation.”',
      keyBenefit: 'Objective patient-generated health data (PGHD) with confirmed audit trails.',
      features: ['Standardized PDF export', 'Chronological variance tables', 'Non-prescriptive observations', 'Cryptographic patient consent']
    },
    {
      role: 'For Health Systems & Epidemiologists',
      userStory: '“Health systems spend millions treating end-stage kidney failure. Identifying subclinical proteinuria in prediabetic populations saves lives and millions in dialysis costs.”',
      keyBenefit: 'Early intervention window for the 136M prediabetic population.',
      features: ['De-identified cohort modeling', 'Consent-driven research datasets', 'Population risk stratification', 'Preventive care cost reduction']
    }
  ];

  return (
    <section className={`relative py-20 transition-colors ${isDark ? 'bg-[#070b14]' : 'bg-[#faf8ff]'}`} id="who-needs-this">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Target Population Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#00685f]"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider font-bold text-[#00685f] dark:text-[#6bd8cb]">
                Clinical Indications & Cohorts
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Designed for Patients, Clinicians & Population Health
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Addressing the silent progression of chronic disease across individual at-home users, rural clinics, attending physicians, and health systems.
            </p>
          </div>
          <div className="text-xs font-mono px-3.5 py-1.5 rounded-xl border shrink-0 bg-white dark:bg-[#0d1526] border-slate-200 dark:border-slate-800 text-[#00685f] dark:text-[#6bd8cb] shadow-xs">
            Select a cohort to inspect impact
          </div>
        </div>

        {/* 4 Audience Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PDF_AUDIENCES.map((aud, idx) => {
            const Icon = audienceIcons[idx];
            const isSelected = selectedAudience === idx;
            return (
              <div
                key={aud.id}
                onClick={() => setSelectedAudience(idx)}
                className={`p-6 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${isSelected
                  ? isDark
                    ? 'bg-[#0d1526] border-[#00685f] shadow-[0_8px_25px_rgba(0,104,95,0.2)] ring-1 ring-[#00685f]/50'
                    : 'bg-white border-[#00685f] shadow-[0_8px_25px_rgba(0,104,95,0.1)] ring-1 ring-[#00685f]/30'
                  : isDark
                    ? 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-[#00685f]/40 shadow-xs'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isSelected
                      ? 'bg-[#00685f] text-white border-[#00685f]'
                      : isDark ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${isSelected
                      ? 'bg-[#00685f]/15 text-[#00685f] dark:text-[#6bd8cb] border-[#00685f]/30 font-bold'
                      : isDark ? 'bg-slate-800 text-slate-400 border-transparent' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                      {aud.metric}
                    </span>
                  </div>

                  <h3 className="text-base font-bold mb-2 text-slate-900 dark:text-white">
                    {aud.title}
                  </h3>

                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {aud.description}
                  </p>
                </div>

                <div className={`mt-6 pt-3 border-t text-[11px] font-mono flex items-center justify-between ${isDark ? 'border-slate-800 text-[#6bd8cb]' : 'border-slate-100 text-[#00685f]'
                  }`}>
                  <span>{isSelected ? 'Viewing Persona' : 'Click to explore'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Persona Deep Dive Card */}
        <div className={`rounded-2xl border p-6 sm:p-8 mb-16 shadow-sm ${isDark ? 'bg-[#0d1526] border-slate-800' : 'bg-white border-slate-200'
          }`}>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-[#00685f]"></span>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                {audienceDeepDives[selectedAudience].role}
              </h4>
            </div>
            <span className="text-xs font-mono text-[#006947] dark:text-[#6ffbbe] font-semibold">
              Impact: {audienceDeepDives[selectedAudience].keyBenefit}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <blockquote className={`text-base sm:text-lg italic p-5 rounded-2xl border leading-relaxed mb-4 ${isDark ? 'bg-slate-900/50 border-slate-800 text-slate-200' : 'bg-[#00685f]/5 border-[#00685f]/15 text-slate-800'
                }`}>
                {audienceDeepDives[selectedAudience].userStory}
              </blockquote>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <span className="text-[10px] font-mono uppercase font-bold block mb-1 text-slate-500">
                Key Architecture Capabilities:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {audienceDeepDives[selectedAudience].features.map((feat, fIdx) => (
                  <div key={fIdx} className={`p-2.5 rounded-xl border flex items-center space-x-2 ${isDark ? 'bg-slate-900/30 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                    <CheckCircle className="w-3.5 h-3.5 text-[#006947] dark:text-[#6ffbbe] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2 Massive Scale Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-8 rounded-2xl border shadow-sm ${isDark
            ? 'bg-[#0d1526] border-slate-800'
            : 'bg-white border-[#e2e8f0]'
            }`}>
            <span className="text-5xl sm:text-6xl font-extrabold text-[#00685f] dark:text-[#6bd8cb] block mb-2 font-mono">
              136M
            </span>
            <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
              Indians With Prediabetes
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              A critical clinical window where longitudinal trends and early biomarker variance can guide prevention before irreversible damage occurs.
            </p>
          </div>

          <div className={`p-8 rounded-2xl border shadow-sm ${isDark
            ? 'bg-[#0d1526] border-slate-800'
            : 'bg-white border-[#e2e8f0]'
            }`}>
            <span className="text-5xl sm:text-6xl font-extrabold text-[#00687a] dark:text-[#57dffe] block mb-2 font-mono">
              315M
            </span>
            <h4 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
              Indians Living With Hypertension
            </h4>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
              Vulnerable to secondary vascular and renal damage. Routine longitudinal urinalysis spots subtle proteinuria shifts long before clinical symptoms.
            </p>
          </div>
        </div>

        {/* Direct Action Call to Prototype */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenDemo}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-mono uppercase font-bold tracking-wider transition-all shadow-sm bg-[#00685f] hover:bg-[#008378] text-white"
          >
            <Activity className="w-4 h-4" />
            <span>Launch Trajectory Engine for Patient Cohorts</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

      </div>
    </section>
  );
}
