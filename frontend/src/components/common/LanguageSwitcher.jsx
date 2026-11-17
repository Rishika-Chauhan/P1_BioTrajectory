import React from 'react';
import { Languages } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function LanguageSwitcher({ className = '', showLabel = true, compact = false }) {
  const { language, setLanguage, toggleLanguage, isHindi } = useLanguage();

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggleLanguage}
        aria-label="Switch between English and Hindi"
        title={isHindi ? 'Switch to English' : 'हिंदी में बदलें'}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-xs active:scale-95 ${
          isHindi
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300'
            : 'bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-500/40 hover:text-cyan-600 dark:hover:text-cyan-400'
        } ${className}`}
      >
        <Languages className="w-3.5 h-3.5" />
        <span className="font-mono uppercase">{isHindi ? 'HI' : 'EN'}</span>
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex items-center p-1 rounded-2xl glass-card border border-slate-200 dark:border-slate-800 shadow-xs transition-all ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage('en')}
        aria-pressed={language === 'en'}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          language === 'en'
            ? 'bg-cyan-500 text-slate-950 shadow-sm font-extrabold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <Languages className="w-3.5 h-3.5" />
        <span>English</span>
      </button>

      <button
        type="button"
        onClick={() => setLanguage('hi')}
        aria-pressed={language === 'hi'}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          language === 'hi'
            ? 'bg-cyan-500 text-slate-950 shadow-sm font-extrabold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <span>हिंदी</span>
      </button>
    </div>
  );
}
