import React from 'react';

export default function DeviceThumbnail({
  deviceId = '',
  type = 'bp',
  size = 'md', // 'xs' | 'sm' | 'md' | 'lg'
  className = ''
}) {
  // Determine sizing classes
  const sizeMap = {
    xs: 'w-7 h-7 rounded-lg',
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-14 h-14 rounded-2xl',
    lg: 'w-20 h-20 rounded-3xl'
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // 1. Omron Evolv Wireless Blood Pressure Cuff
  if (deviceId.includes('omron') || type === 'bp') {
    return (
      <div
        className={`${currentSize} relative flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-1.5 shadow-md shadow-slate-900/30 border border-slate-700/80 overflow-hidden shrink-0 select-none ${className}`}
        title="Omron Evolv Wireless Blood Pressure Cuff"
      >
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          {/* Main Cylindrical Cuff Body */}
          <rect x="6" y="10" width="52" height="44" rx="8" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
          {/* Fabric Texture Lines */}
          <line x1="12" y1="16" x2="12" y2="48" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
          <line x1="52" y1="16" x2="52" y2="48" stroke="#334155" strokeWidth="1" strokeDasharray="2 2" />
          {/* Central Glossy OLED Unit */}
          <rect x="16" y="16" width="32" height="32" rx="5" fill="#020617" stroke="#00D9FF" strokeWidth="1" />
          {/* OLED Digital Text Display (118/76) */}
          <text x="32" y="27" textAnchor="middle" fill="#FFFFFF" fontSize="7.5" fontWeight="900" fontFamily="monospace">118</text>
          <line x1="20" y1="30" x2="44" y2="30" stroke="#334155" strokeWidth="0.8" />
          <text x="32" y="38" textAnchor="middle" fill="#00D9FF" fontSize="6.5" fontWeight="800" fontFamily="monospace">76</text>
          <text x="32" y="44" textAnchor="middle" fill="#94A3B8" fontSize="4.5" fontWeight="600">mmHg</text>
          {/* Bluetooth Cyan Indicator Dot */}
          <circle cx="43" cy="21" r="1.5" fill="#00E5FF" />
        </svg>
      </div>
    );
  }

  // 2. Apple Watch Ultra 2 / Garmin Smartwatch
  if (deviceId.includes('watch') || deviceId.includes('apple') || deviceId.includes('garmin') || type === 'watch') {
    return (
      <div
        className={`${currentSize} relative flex items-center justify-center bg-gradient-to-br from-amber-50 via-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-1.5 shadow-md shadow-slate-900/20 border border-slate-300 dark:border-slate-700 overflow-hidden shrink-0 select-none ${className}`}
        title="Apple Watch Ultra / Smart Activity Tracker"
      >
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          {/* Rugged Sport Loop Strap */}
          <rect x="20" y="2" width="24" height="12" rx="3" fill="#F97316" />
          <rect x="20" y="50" width="24" height="12" rx="3" fill="#F97316" />
          {/* Titanium Watch Chassis */}
          <rect x="12" y="11" width="40" height="42" rx="10" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Orange Action Button on Left */}
          <rect x="8.5" y="24" width="3.5" height="10" rx="1.5" fill="#EA580C" />
          {/* Digital Crown on Right */}
          <rect x="52" y="18" width="3.5" height="12" rx="1.5" fill="#64748B" />
          {/* Sapphire Display Face */}
          <rect x="16" y="15" width="32" height="34" rx="7" fill="#020617" />
          {/* Concentric Activity Rings (Red/Green/Blue) */}
          <circle cx="32" cy="30" r="11" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="50 20" />
          <circle cx="32" cy="30" r="8" fill="none" stroke="#10B981" strokeWidth="2" strokeDasharray="40 15" />
          <circle cx="32" cy="30" r="5" fill="none" stroke="#06B6D4" strokeWidth="2" strokeDasharray="30 10" />
          {/* Step Count Stat Text */}
          <text x="32" y="44" textAnchor="middle" fill="#10B981" fontSize="5" fontWeight="bold">8,420</text>
        </svg>
      </div>
    );
  }

  // 3. BioTrajectory Smart Optical 10SG Urine Analyzer
  if (deviceId.includes('urine') || deviceId.includes('10sg') || deviceId.includes('optical') || type === 'urine') {
    return (
      <div
        className={`${currentSize} relative flex items-center justify-center bg-gradient-to-br from-cyan-50 via-white to-slate-100 dark:from-slate-800 dark:to-cyan-950/60 p-1.5 shadow-md shadow-cyan-900/15 border border-cyan-300 dark:border-cyan-500/40 overflow-hidden shrink-0 select-none ${className}`}
        title="BioTrajectory Smart Optical 10SG Urine Analyzer"
      >
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          {/* Compact Benchtop Spectrophotometer Base */}
          <rect x="8" y="12" width="48" height="40" rx="8" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          {/* Cyan High-Tech Accent Stripe */}
          <rect x="8" y="24" width="48" height="3.5" fill="#00D9FF" />
          {/* Diagnostic Test Strip Insertion Slot */}
          <rect x="18" y="16" width="28" height="4" rx="2" fill="#0F172A" />
          {/* Test Strip Inserter Tip */}
          <rect x="22" y="14" width="20" height="5" rx="1" fill="#FEF08A" stroke="#EAB308" strokeWidth="0.8" />
          <circle cx="26" cy="16.5" r="1" fill="#10B981" />
          <circle cx="32" cy="16.5" r="1" fill="#06B6D4" />
          <circle cx="38" cy="16.5" r="1" fill="#A855F7" />
          {/* Optical Digital Screen */}
          <rect x="16" y="31" width="32" height="15" rx="4" fill="#0F172A" stroke="#00E5FF" strokeWidth="0.8" />
          <text x="32" y="38" textAnchor="middle" fill="#00E5FF" fontSize="5" fontWeight="bold">SG 1.018</text>
          <text x="32" y="44" textAnchor="middle" fill="#10B981" fontSize="4.5" fontWeight="bold">PROT: NEG</text>
        </svg>
      </div>
    );
  }

  // 4. Withings U-Scan In-Toilet Cartridge Sensor
  if (deviceId.includes('withings') || deviceId.includes('u-scan')) {
    return (
      <div
        className={`${currentSize} relative flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-1.5 shadow-md border border-slate-300 dark:border-slate-700 overflow-hidden shrink-0 select-none ${className}`}
        title="Withings U-Scan Smart In-Toilet Cartridge Sensor"
      >
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-sm">
          {/* White Pebble Shell */}
          <circle cx="32" cy="32" r="24" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.5" />
          {/* Microfluidic Concentric Radial Inlet */}
          <circle cx="32" cy="32" r="15" fill="#F8FAFC" stroke="#00D9FF" strokeWidth="1.5" strokeDasharray="4 2" />
          <circle cx="32" cy="32" r="7" fill="#00D9FF" opacity="0.8" />
          {/* Fluid Intake Port */}
          <circle cx="32" cy="32" r="3" fill="#0F172A" />
          {/* LED Ring Glow */}
          <circle cx="32" cy="14" r="2" fill="#10B981" />
        </svg>
      </div>
    );
  }

  // 5. Default Smart Health Sensor / CGM
  return (
    <div
      className={`${currentSize} relative flex items-center justify-center bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent p-1.5 shadow-md border border-cyan-400/30 overflow-hidden shrink-0 select-none ${className}`}
      title="Connected Medical Peripheral"
    >
      <svg viewBox="0 0 64 64" className="w-full h-full text-cyan-500">
        <rect x="14" y="14" width="36" height="36" rx="10" fill="#FFFFFF" stroke="#00D9FF" strokeWidth="1.5" />
        <circle cx="32" cy="32" r="8" fill="#00D9FF" opacity="0.3" />
        <path d="M26 32 L30 36 L38 28" fill="none" stroke="#00D9FF" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

