import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '', showLabel = false }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      className={`group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 select-none cursor-pointer active:scale-95 ${
        isDark
          ? 'bg-[#101827]/90 border-slate-700/70 text-cyan-300 hover:border-cyan-400/60 hover:bg-[#131E30] hover:shadow-[0_0_15px_rgba(0,217,255,0.15)]'
          : 'bg-white/90 border-slate-200 text-slate-700 hover:text-cyan-700 hover:border-cyan-400/50 hover:bg-cyan-50/40 shadow-xs'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
        {isDark ? (
          <Sun className="w-4 h-4 text-cyan-300 transition-transform duration-500 group-hover:rotate-90 group-hover:scale-110" />
        ) : (
          <Moon className="w-4 h-4 text-cyan-700 dark:text-cyan-400 transition-transform duration-500 group-hover:-rotate-45 group-hover:scale-110" />
        )}
      </div>

      <span className="text-[12px] font-bold tracking-wide hidden sm:inline-block">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}
