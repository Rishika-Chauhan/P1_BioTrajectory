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
      userStory: '“My father gets an annual checkup, but we never know if slight deviations are worsening or just a passing fluke. BioTrajectory gives us a visual story between checkups.”',
      keyBenefit: 'Replaces panic over single snapshots with grounded peace of mind.',
      features: ['No medical jargon', 'Automated reminder cadences', 'Household profile switching', 'Exportable doctor brief']
    },
    {
      role: 'For Rural & Underserved Communities',
      userStory: '“In Tier-2 and rural pharmacies, expensive automated biochemistry analyzers are rare. Commercial strips with smartphone camera guidance bring affordable screening to local chemists.”',
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
    <section className={`relative py-28 transition-colors ${isDark ? 'bg-[#05070c]' : 'bg-[#faf9f6]'
      }`} id="who-needs-this">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-xs font-mono-code uppercase tracking-widest mb-4 ${isDark ? 'bg-amber-400/10 border-amber-400/25 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-900 shadow-xs'
            }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span>Target Stakeholders • PDF Slide 7</span>
          </div>

          <h2 className={`font-cinzel text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'
            }`}>
            Who Needs This?
          </h2>

          <p className={`mt-4 text-base sm:text-lg font-light leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'
            }`}>
            Addressing the silent progression of chronic disease across patients, clinics, and national health infrastructures.
          </p>
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
                      ? 'bg-[#11192e] border-amber-400 shadow-[0_10px_30px_rgba(217,119,6,0.15)] ring-1 ring-amber-400/40'
                      : 'bg-white border-amber-500 shadow-[0_10px_30px_rgba(180,145,95,0.1)] ring-1 ring-amber-400/60'
                    : isDark
                      ? 'bg-[#090e18] border-white/5 hover:border-white/15'
                      : 'bg-white border-slate-200 hover:border-amber-300 shadow-xs'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isSelected
                        ? isDark ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-amber-700 text-white border-amber-800'
                        : isDark ? 'bg-slate-900 text-slate-400 border-white/5' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono-code uppercase px-2 py-0.5 rounded border ${isSelected
                        ? isDark ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 font-bold' : 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                        : isDark ? 'bg-slate-800 text-slate-400 border-transparent' : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                      {aud.metric}
                    </span>
                  </div>

                  <h3 className={`font-cinzel text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                    {aud.title}
                  </h3>

                  <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                    {aud.description}
                  </p>
                </div>

                <div className={`mt-6 pt-3 border-t text-[11px] font-mono-code flex items-center justify-between ${isDark ? 'border-white/5 text-amber-300/80' : 'border-slate-100 text-amber-900/80'
                  }`}>
                  <span>{isSelected ? 'Viewing Persona' : 'Click to explore'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Persona Deep Dive Card */}
        <div className={`rounded-2xl border p-6 sm:p-8 mb-16 shadow-xl ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10 shadow-[0_10px_35px_rgba(180,145,95,0.05)]'
          }`}>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-inherit mb-6">
            <div className="flex items-center space-x-3">
              <span className="w-3 h-3 rounded-full bg-amber-500"></span>
              <h4 className={`font-cinzel text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {audienceDeepDives[selectedAudience].role}
              </h4>
            </div>
            <span className={`text-xs font-mono-code ${isDark ? 'text-emerald-400' : 'text-emerald-700 font-semibold'}`}>
              Impact: {audienceDeepDives[selectedAudience].keyBenefit}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <blockquote className={`font-serif-lux text-base sm:text-lg italic p-4 rounded-xl border leading-relaxed mb-4 ${isDark ? 'bg-slate-900/50 border-white/5 text-slate-200' : 'bg-amber-50/60 border-amber-200/60 text-slate-800'
                }`}>
                {audienceDeepDives[selectedAudience].userStory}
              </blockquote>
            </div>

            <div className="lg:col-span-5 space-y-2">
              <span className={`text-[10px] font-mono-code uppercase font-bold block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                Key Architecture Capabilities:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {audienceDeepDives[selectedAudience].features.map((feat, fIdx) => (
                  <div key={fIdx} className={`p-2.5 rounded-lg border flex items-center space-x-2 ${isDark ? 'bg-slate-900/30 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2 Massive Scale Indicators (From Slide 7) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-8 rounded-2xl border shadow-lg ${isDark
              ? 'bg-gradient-to-br from-[#121b2d] to-[#090e18] border-amber-400/25'
              : 'bg-gradient-to-br from-amber-50/80 via-white to-amber-100/40 border-amber-300 shadow-[0_10px_30px_rgba(180,145,95,0.06)]'
            }`}>
            <span className="font-cinzel text-5xl sm:text-6xl font-extrabold text-amber-700 dark:text-amber-300 block mb-2">
              136M
            </span>
            <h4 className={`font-cinzel text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Indians With Prediabetes
            </h4>
            <p className={`text-xs leading-relaxed font-light ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              A critical clinical window where longitudinal trends and early biomarker variance can guide prevention before irreversible damage occurs.
            </p>
          </div>

          <div className={`p-8 rounded-2xl border shadow-lg ${isDark
              ? 'bg-gradient-to-br from-[#121b2d] to-[#090e18] border-rose-500/25'
              : 'bg-gradient-to-br from-rose-50/80 via-white to-rose-100/40 border-rose-200 shadow-[0_10px_30px_rgba(244,63,94,0.06)]'
            }`}>
            <span className="font-cinzel text-5xl sm:text-6xl font-extrabold text-rose-600 dark:text-rose-400 block mb-2">
              315M
            </span>
            <h4 className={`font-cinzel text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Indians Living With Hypertension
            </h4>
            <p className={`text-xs leading-relaxed font-light ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Vulnerable to secondary vascular and renal damage. Routine longitudinal urinalysis spots subtle proteinuria shifts long before clinical symptoms.
            </p>
          </div>
        </div>

        {/* Direct Action Call to Prototype */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenDemo}
            className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl text-xs font-mono-code uppercase font-bold tracking-wider transition-all shadow-md ${isDark
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                : 'bg-amber-700 hover:bg-amber-800 text-white'
              }`}
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
