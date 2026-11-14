import React from 'react';
import { Camera, Calendar, LineChart, Sparkles, Check } from 'lucide-react';
import { FOUR_LAYERS } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function FourLayers() {
  const { isDark } = useTheme();
  const icons = [Camera, Calendar, LineChart, Sparkles];

  return (
    <section className={`relative py-24 transition-colors ${
      isDark ? 'bg-[#05070c]' : 'bg-[#fbfaf8]'
    }`} id="four-layers">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className={`inline-flex items-center space-x-2 px-3.5 py-1 rounded-full border text-xs font-mono-code uppercase tracking-wider mb-4 ${
            isDark ? 'bg-amber-400/10 border-amber-400/25 text-amber-300' : 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm'
          }`}>
            <span>Section 4 • Proposed Solution</span>
          </div>

          <h2 className={`font-cinzel text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            The Four-Layer Foundation
          </h2>
          <p className={`mt-4 text-base sm:text-lg font-light leading-relaxed ${
            isDark ? 'text-slate-300' : 'text-slate-600'
          }`}>
            BioTrajectory replaces black-box guessing with four distinct, verifiable layers that cleanly isolate raw physical measurement from language-model explanation.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FOUR_LAYERS.map((layer, index) => {
            const Icon = icons[index];
            return (
              <div
                key={layer.number}
                className={`group relative rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between shadow-lg ${
                  isDark
                    ? 'bg-gradient-to-b from-[#0b1222] to-[#070b14] border-white/10 hover:border-amber-400/40 shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
                    : 'bg-white border-amber-900/10 hover:border-amber-400 shadow-[0_10px_25px_rgba(0,0,0,0.03)]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className={`font-mono-code text-2xl font-extrabold transition-colors ${
                      isDark ? 'text-amber-400/40 group-hover:text-amber-300' : 'text-amber-800/40 group-hover:text-amber-700'
                    }`}>
                      {layer.number}
                    </span>
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                      isDark
                        ? 'bg-slate-900 border-white/10 text-amber-300 group-hover:scale-110 group-hover:bg-amber-400/20'
                        : 'bg-amber-50 border-amber-200 text-amber-800 group-hover:scale-110 group-hover:bg-amber-100'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className={`font-cinzel text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {layer.name}
                  </h3>
                  
                  <div className={`text-xs font-semibold mb-3 tracking-wide ${
                    isDark ? 'text-amber-200/90' : 'text-amber-800'
                  }`}>
                    {layer.headline}
                  </div>

                  <p className={`text-xs leading-relaxed mb-6 font-light ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {layer.description}
                  </p>
                </div>

                <div className={`pt-4 border-t space-y-2 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                  {layer.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start space-x-2 text-[11px]">
                      <Check className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Central Architecture Principle Quote */}
        <div className={`mt-14 p-6 rounded-2xl border max-w-4xl mx-auto text-center shadow-lg ${
          isDark
            ? 'bg-gradient-to-r from-slate-900/80 via-amber-950/20 to-slate-900/80 border-amber-400/25'
            : 'bg-gradient-to-r from-amber-50 via-white to-amber-50 border-amber-300 shadow-amber-900/5'
        }`}>
          <span className={`text-[10px] font-mono-code uppercase tracking-widest block mb-2 font-semibold ${
            isDark ? 'text-amber-300' : 'text-amber-900'
          }`}>
            Core Architecture Principle (Section 6)
          </span>
          <p className={`text-sm sm:text-base font-serif-lux italic leading-relaxed ${
            isDark ? 'text-slate-200' : 'text-slate-800'
          }`}>
            “Keep the measurement engine and trend calculations separate from the language model. Gemini should receive structured, approved data and be instructed to describe it—not to fabricate values or make a diagnosis.”
          </p>
        </div>

      </div>
    </section>
  );
}
