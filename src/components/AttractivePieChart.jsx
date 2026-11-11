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
    <div className={`p-6 sm:p-7 rounded-xl border shadow-xs relative overflow-hidden transition-all ${isDark ? 'bg-[#2B0B0E] border-[#D5BF86]/20' : 'bg-white border-[#D5BF86]/70'
      }`}>
      {/* Top Header & Preset Switchers */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#D5BF86]/30">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-md bg-[#A71D31]/10 text-[#A71D31] flex items-center justify-center">
              <PieIcon className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#A71D31] dark:text-[#D5BF86]">
              Longitudinal Proportion Analytics
            </span>
          </div>
          <h3 className={`font-sans text-xl font-bold mt-1 ${isDark ? 'text-[#FAF9EB]' : 'text-[#3F0D12]'}`}>
            {preset.title}
          </h3>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-[#D5BF86]' : 'text-[#8D775F]'}`}>
            {preset.subtitle}
          </p>
        </div>

        {/* Preset Selector Buttons */}
        <div className={`inline-flex p-1 rounded-lg border text-xs font-sans self-start md:self-auto shrink-0 ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/30' : 'bg-[#FAF9EB] border-[#D5BF86]'
          }`}>
          {PIE_CHART_PRESETS.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => {
                setActivePresetIndex(idx);
                setHoveredSegmentId(null);
              }}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${activePresetIndex === idx
                  ? 'bg-[#A71D31] text-white shadow-xs font-bold'
                  : 'text-[#8D775F] dark:text-[#D5BF86] hover:text-[#3F0D12]'
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
                    stroke={isDark ? '#1D070A' : '#FAF9EB'}
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
              className={`absolute w-44 h-44 rounded-full flex flex-col items-center justify-center text-center p-4 shadow-inner border pointer-events-none transition-all ${isDark ? 'bg-[#1D070A]/95 border-[#D5BF86]/30' : 'bg-[#FAF9EB]/95 border-[#D5BF86]'
                }`}
            >
              <span className="text-[10px] font-mono-code uppercase font-bold tracking-wider text-[#8D775F]">
                Proportion
              </span>
              <strong
                className="text-4xl font-extrabold font-cinzel leading-none my-1 tracking-tight"
                style={{ color: activeSegment.color }}
              >
                {activeSegment.value}%
              </strong>
              <span className="text-xs font-semibold leading-tight max-w-[130px] truncate text-[#3F0D12] dark:text-[#FAF9EB]">
                {activeSegment.label}
              </span>
              <span className="text-[10px] font-mono-code text-[#8D775F] mt-0.5">
                {activeSegment.count}
              </span>
            </div>
          </div>

          <span className="text-[11px] font-mono-code text-[#8D775F] mt-4 text-center">
            Hover or click any segment above to inspect telemetry mechanics
          </span>
        </div>

        {/* Right 6 Cols: Detailed Breakdown & Clinical Significance Cards */}
        <div className="lg:col-span-6 space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[#D5BF86]/30 text-xs font-mono-code">
            <span className="text-[#8D775F] uppercase font-semibold">Segment Breakdown & Rationale</span>
            <span className="text-[#A71D31] font-bold">Total: {totalValue}%</span>
          </div>

          {segmentsWithAngles.map((seg) => {
            const isHovered = activeSegment.id === seg.id;

            return (
              <div
                key={seg.id}
                onMouseEnter={() => setHoveredSegmentId(seg.id)}
                onClick={() => setHoveredSegmentId(seg.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${isHovered
                    ? isDark
                      ? 'bg-[#1D070A] border-[#A71D31] shadow-md ring-1 ring-[#A71D31]/40 scale-[1.02]'
                      : 'bg-[#FAF9EB] border-[#A71D31] shadow-sm ring-1 ring-[#A71D31]/50 scale-[1.02]'
                    : isDark
                      ? 'bg-[#1D070A]/60 border-[#D5BF86]/20 hover:border-[#D5BF86]/40'
                      : 'bg-[#FAF9EB]/40 border-[#D5BF86]/40 hover:border-[#D5BF86]'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: seg.color }}
                    ></span>
                    <h4 className={`text-xs sm:text-sm font-bold ${isDark ? 'text-[#FAF9EB]' : 'text-[#3F0D12]'}`}>
                      {seg.label}
                    </h4>
                  </div>

                  <div className="flex items-baseline space-x-1.5 font-mono-code">
                    <strong className="text-base font-extrabold" style={{ color: seg.color }}>
                      {seg.value}%
                    </strong>
                    <span className="text-[10px] text-[#8D775F]">({seg.count})</span>
                  </div>
                </div>

                {/* Progress Indicator Bar */}
                <div className="w-full h-1.5 rounded-full bg-[#D5BF86]/20 overflow-hidden mb-2">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${seg.value}%`,
                      backgroundColor: seg.color
                    }}
                  ></div>
                </div>

                <p className={`text-xs leading-relaxed ${isDark ? 'text-[#E8E5BA]' : 'text-[#473228]'}`}>
                  {seg.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>

      {/* Bottom Clinical Regulatory Note */}
      <div className={`mt-8 p-4 rounded-2xl border flex items-start space-x-3 text-xs ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/20 text-[#D5BF86]' : 'bg-[#FAF9EB] border-[#D5BF86]/60 text-[#473228]'
        }`}>
        <ShieldCheck className="w-4 h-4 text-[#A71D31] shrink-0 mt-0.5" />
        <span className="leading-relaxed">
          <strong>Multi-Modal PGHD Integrity:</strong> BioTrajectory synthesizes dry-chemistry urinalysis with continuous Bluetooth peripherals under a unified patient timeline. Reagent kinetics and Bluetooth vitals validate each other, eliminating single-device false positives.
        </span>
      </div>
    </div>
  );
}
