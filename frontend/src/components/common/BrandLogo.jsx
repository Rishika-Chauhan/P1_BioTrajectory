import React from 'react';
import { Link } from 'react-router-dom';

export default function BrandLogo({
  to = '/',
  showText = true,
  size = 'md', // 'sm' | 'md' | 'lg'
  subtitle = null,
  className = '',
  onClick = null
}) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const boxSize = isLg
    ? 'w-12 h-12 rounded-2xl p-1'
    : isSm
    ? 'w-9 h-9 rounded-xl p-0.5'
    : 'w-11 h-11 rounded-2xl p-1';

  const textSize = isLg ? 'text-2xl md:text-3xl' : isSm ? 'text-lg' : 'text-2xl';

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 group select-none ${className}`}
    >
      {/* Official BioTrajectory Logo Emblem */}
      <div
        className={`${boxSize} bg-white dark:bg-white rounded-2xl shadow-md shadow-cyan-500/15 group-hover:shadow-cyan-500/30 transition-all duration-300 group-hover:scale-105 shrink-0 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center overflow-hidden p-1`}
      >
        <img
          src="/biotrajectory-emblem.png"
          alt="BioTrajectory"
          className="w-full h-full object-contain select-none"
          draggable={false}
        />
      </div>

      {/* High-Contrast Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <span
            className={`font-extrabold ${textSize} tracking-tight text-slate-900 dark:text-white leading-none transition-colors`}
          >
            Bio
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 dark:from-cyan-400 dark:to-blue-500 font-extrabold ml-[1px]">
              Trajectory
            </span>
          </span>
          {subtitle && (
            <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mt-1 leading-none">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
