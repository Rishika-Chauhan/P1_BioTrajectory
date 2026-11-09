import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '', showLabel = false }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Current: Dark Theme (Click to switch to Light Theme)" : "Current: Light Theme (Click to switch to Dark Theme)"}
      aria-label={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      className={`group relative inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all duration-300 select-none cursor-pointer active:scale-95 ${
        isDark
          ? 'bg-[#101827] border-slate-700/80 text-cyan-300 hover:border-cyan-400 hover:bg-[#131E30]'
          : 'bg-white border-slate-300 text-amber-600 hover:border-amber-400 hover:bg-slate-50 shadow-sm'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
        {isDark ? (
          <Sun className="w-4 h-4 text-cyan-300 transition-transform duration-300 group-hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-amber-500 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </div>

      <span className="text-[11px] font-bold tracking-wide hidden sm:inline-block">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}
