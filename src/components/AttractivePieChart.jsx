import React, { useState } from 'react';
import {
  PieChart as PieIcon,
  Activity,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { PIE_CHART_PRESETS } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function AttractivePieChart() {
  const { isDark } = useTheme();

  const [activePresetIndex, setActivePresetIndex] = useState(0);
  const [hoveredSegmentId, setHoveredSegmentId] = useState(null);

  const preset = PIE_CHART_PRESETS[activePresetIndex] || PIE_CHART_PRESETS[0];

  // SVG Dimensions for Donut Chart
  const size = 380;
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = 150;
  const innerRadius = 95; // Donut thickness

  // Total sum of values (usually 100)
  const totalValue = preset.segments.reduce((acc, s) => acc + s.value, 0) || 100;

  // Compute angles for each segment
  let currentAngle = -90; // Start at top (12 o'clock)
  const segmentsWithAngles = preset.segments.map((seg) => {
    const angleSpan = (seg.value / totalValue) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angleSpan;
    const middleAngle = startAngle + angleSpan / 2;
    currentAngle += angleSpan;

    return {
      ...seg,
      startAngle,
      endAngle,
      middleAngle,
      angleSpan
    };
  });

  // Helper to convert polar degrees to Cartesian (x, y)
  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  // Helper to build SVG Donut Arc path
  const createDonutArc = (startAngle, endAngle, outerR, innerR) => {
    const startOuter = polarToCartesian(cx, cy, outerR, endAngle);
    const endOuter = polarToCartesian(cx, cy, outerR, startAngle);
    const startInner = polarToCartesian(cx, cy, innerR, endAngle);
    const endInner = polarToCartesian(cx, cy, innerR, startAngle);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      'M', startOuter.x, startOuter.y,
      'A', outerR, outerR, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      'L', endInner.x, endInner.y,
      'A', innerR, innerR, 0, largeArcFlag, 1, startInner.x, startInner.y,
      'Z'
    ].join(' ');
  };

  // Active highlighted segment
  const activeSegment = hoveredSegmentId
    ? segmentsWithAngles.find((s) => s.id === hoveredSegmentId)
    : segmentsWithAngles[0];

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all ${
      isDark ? 'bg-[#090e18] border-amber-400/25' : 'bg-white border-amber-900/10'
    }`}>
      {/* Top Header & Preset Switchers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-inherit">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-500 flex items-center justify-center">
              <PieIcon className="w-4 h-4 animate-spin-slow" />
            </div>
            <span className={`text-xs font-mono-code font-bold uppercase tracking-wider ${
              isDark ? 'text-amber-300' : 'text-amber-800'
            }`}>
              Longitudinal Proportion Analytics
            </span>
          </div>
          <h3 className={`font-cinzel text-xl sm:text-2xl font-bold mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {preset.title}
          </h3>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {preset.subtitle}
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div className={`inline-flex p-1 rounded-xl border text-xs font-mono-code self-start md:self-auto shrink-0 ${
          isDark ? 'bg-slate-950 border-white/10' : 'bg-slate-100 border-slate-200'
        }`}>
          {PIE_CHART_PRESETS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                setActivePresetIndex(idx);
                setHoveredSegmentId(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activePresetIndex === idx
                  ? isDark ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-amber-700 text-white font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {idx === 0 ? 'Time in Corridor (TIC)' : idx === 1 ? 'Data Ingestion Sources' : 'Organ Systems'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Interactive Donut SVG on Left, Segment Analytics & Breakdown on Right */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left 6 Cols: Interactive SVG Donut Chart with Exploding Segments */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center relative">
          <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center">
            <svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-full h-full select-none overflow-visible filter drop-shadow-lg"
            >
              <defs>
                {/* Glow Filter for Active Wedge */}
                <filter id="activePieGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={activeSegment.color} floodOpacity="0.5" />
                </filter>
              </defs>

              {/* Pie Segments */}
              {segmentsWithAngles.map((seg) => {
                const isHovered = activeSegment.id === seg.id;
                const path = createDonutArc(
                  seg.startAngle,
                  seg.endAngle,
                  isHovered ? outerRadius + 8 : outerRadius,
                  isHovered ? innerRadius - 4 : innerRadius
                );

                // Small translation vector for exploded slice effect
                const rad = ((seg.middleAngle - 90) * Math.PI) / 180.0;
                const dx = isHovered ? Math.cos(rad) * 6 : 0;
                const dy = isHovered ? Math.sin(rad) * 6 : 0;

                return (
                  <path
                    key={seg.id}
                    d={path}
                    fill={seg.color}
                    transform={`translate(${dx}, ${dy})`}
                    className="cursor-pointer transition-all duration-300"
                    stroke={isDark ? '#090e18' : '#ffffff'}
                    strokeWidth="2.5"
                    filter={isHovered ? 'url(#activePieGlow)' : 'none'}
                    onMouseEnter={() => setHoveredSegmentId(seg.id)}
                    onClick={() => setHoveredSegmentId(seg.id)}
                  />
                );
              })}
            </svg>

            {/* Central Circular HUD Display */}
            <div
              className={`absolute w-44 h-44 rounded-full flex flex-col items-center justify-center text-center p-4 shadow-inner border pointer-events-none transition-all ${
                isDark ? 'bg-[#060a12]/95 border-white/10' : 'bg-white/95 border-amber-900/10'
              }`}
            >
              <span className="text-[10px] font-mono-code uppercase font-bold tracking-wider text-slate-400">
                Proportion
              </span>
              <strong
                className="text-4xl font-extrabold font-cinzel leading-none my-1 tracking-tight"
                style={{ color: activeSegment.color }}
              >
                {activeSegment.value}%
              </strong>
              <span className="text-xs font-semibold leading-tight max-w-[130px] truncate text-slate-300">
                {activeSegment.label}
              </span>
              <span className="text-[10px] font-mono-code text-slate-400 mt-0.5">
                {activeSegment.count}
              </span>
            </div>
          </div>

          <span className="text-[11px] font-mono-code text-slate-400 mt-4 text-center">
            Hover or click any segment above to inspect telemetry mechanics
          </span>
        </div>

        {/* Right 6 Cols: Detailed Breakdown & Clinical Significance Cards */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-inherit text-xs font-mono-code">
            <span className="text-slate-400 uppercase font-semibold">Segment Breakdown & Rationale</span>
            <span className="text-amber-500 font-bold">Total: {totalValue}%</span>
          </div>

          {segmentsWithAngles.map((seg) => {
            const isHovered = activeSegment.id === seg.id;

            return (
              <div
                key={seg.id}
                onMouseEnter={() => setHoveredSegmentId(seg.id)}
                onClick={() => setHoveredSegmentId(seg.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                  isHovered
                    ? isDark
                      ? 'bg-gradient-to-r from-[#11192e] to-[#090e18] border-amber-400 shadow-md ring-1 ring-amber-400/40 scale-[1.02]'
                      : 'bg-amber-50/70 border-amber-400 shadow-sm ring-1 ring-amber-400/50 scale-[1.02]'
                    : isDark
                    ? 'bg-slate-950/60 border-white/5 hover:border-white/15'
                    : 'bg-slate-50 border-slate-200 hover:border-amber-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: seg.color }}
                    ></span>
                    <h4 className={`text-xs sm:text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {seg.label}
                    </h4>
                  </div>

                  <div className="flex items-baseline space-x-1.5 font-mono-code">
                    <strong className="text-base font-extrabold" style={{ color: seg.color }}>
                      {seg.value}%
                    </strong>
                    <span className="text-[10px] text-slate-400">({seg.count})</span>
                  </div>
                </div>

                {/* Progress Indicator Bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-800/40 overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${seg.value}%`,
                      backgroundColor: seg.color
                    }}
                  ></div>
                </div>

                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {seg.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Clinical Regulatory Note */}
      <div className={`mt-8 p-4 rounded-2xl border flex items-start space-x-3 text-xs ${
        isDark ? 'bg-slate-950/80 border-white/10 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>Multi-Modal PGHD Integrity:</strong> BioTrajectory synthesizes dry-chemistry urinalysis with continuous Bluetooth peripherals under a unified patient timeline. Reagent kinetics and Bluetooth vitals validate each other, eliminating single-device false positives.
        </span>
      </div>
    </div>
  );
}
