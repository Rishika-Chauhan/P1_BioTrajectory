import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function BrandLogo({
  to = '/',
  showText = true,
  size = 'md', // 'sm' | 'md' | 'lg'
  icon: Icon = Activity,
  subtitle = null,
  className = '',
  onClick = null
}) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const boxSize = isLg
    ? 'w-12 h-12 rounded-2xl p-[1.5px]'
    : isSm
    ? 'w-9 h-9 rounded-xl p-[1.5px]'
    : 'w-11 h-11 rounded-2xl p-[1.5px]';

  const innerRadius = isLg
    ? 'rounded-[14px]'
    : isSm
    ? 'rounded-[10px]'
    : 'rounded-[14px]';

  const iconSize = isLg ? 'w-6 h-6' : isSm ? 'w-4 h-4' : 'w-6 h-6';
  const textSize = isLg ? 'text-2xl md:text-3xl' : isSm ? 'text-lg' : 'text-2xl';

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 group select-none ${className}`}
    >
      {/* High-Clarity Theme-Adaptive Logo Emblem */}
      <div
        className={`${boxSize} bg-gradient-to-tr from-violet-600 via-indigo-500 to-cyan-500 dark:from-cyan-400 dark:via-blue-500 dark:to-indigo-600 shadow-md shadow-violet-500/15 dark:shadow-cyan-500/20 group-hover:shadow-violet-500/25 dark:group-hover:shadow-cyan-500/35 transition-all duration-300 group-hover:scale-105 shrink-0`}
      >
        <div
          className={`w-full h-full ${innerRadius} bg-white dark:bg-[#070B14] border border-violet-100/90 dark:border-white/10 flex items-center justify-center transition-colors duration-300 shadow-xs`}
        >
          <Icon
            className={`${iconSize} text-violet-600 dark:text-cyan-400 group-hover:rotate-12 transition-transform duration-300`}
            strokeWidth={2.5}
          />
        </div>
      </div>

      {/* High-Contrast Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span
            className={`font-extrabold ${textSize} tracking-tight text-slate-900 dark:text-white leading-none transition-colors`}
          >
            Bio
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 font-extrabold ml-[1px]">
              Trajectory
            </span>
          </span>
          {subtitle && (
            <span className="text-[11px] font-bold text-violet-600 dark:text-cyan-400 uppercase tracking-wider mt-1 leading-none">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
