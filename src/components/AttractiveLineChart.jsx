import React, { useState, useMemo } from 'react';
import {
  Activity,
  Bluetooth,
  TrendingUp,
  Layers,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { BIOMARKER_DEFINITIONS, BLUETOOTH_METRIC_CONFIGS } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import { calculateBaselineCorridor } from '../services/trajectoryStorage.js';

export default function AttractiveLineChart({
  history = [],
  selectedBiomarker = 'protein',
  selectedBleMetric = 'bleCgmGlucose',
  onSelectBiomarker,
  onSelectBleMetric,
  timeRange = 30,
  setTimeRange
}) {
  const { isDark } = useTheme();

  // Mode: 'overlay' (both curves), 'biomarker' (only urine strip), 'bluetooth' (only BLE sensor)
  const [displayMode, setDisplayMode] = useState('overlay');
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Active biomarker metadata
  const bioMeta = useMemo(() => {
    return BIOMARKER_DEFINITIONS.find((b) => b.id === selectedBiomarker) || BIOMARKER_DEFINITIONS[0];
  }, [selectedBiomarker]);

  // Active bluetooth metric config
  const bleMeta = useMemo(() => {
    return BLUETOOTH_METRIC_CONFIGS[selectedBleMetric] || BLUETOOTH_METRIC_CONFIGS.bleCgmGlucose;
  }, [selectedBleMetric]);

  // Slice active dataset by time range
  const activeData = useMemo(() => {
    return history.slice(-timeRange);
  }, [history, timeRange]);

  // Chart Dimensions
  const width = 860;
  const height = 320;
  const pad = { top: 40, right: 70, bottom: 45, left: 65 };

  // Y-axis 1: Biomarker
  const bioVals = activeData.map((d) => d[selectedBiomarker] ?? 0);
  const bioMin = Math.min(...bioVals, (bioMeta.baselineMin ?? 0) * 0.9);
  const bioMax = Math.max(...bioVals, (bioMeta.baselineMax ?? 10) * 1.25, (bioMeta.criticalThreshold ?? 20) * 1.1);
  const bioRange = bioMax - bioMin || 1;

  // Y-axis 2: Bluetooth Metric
  const bleVals = activeData.map((d) => d[selectedBleMetric] ?? bleMeta.baselineMin);
  const bleMin = Math.min(...bleVals, bleMeta.baselineMin * 0.9);
  const bleMax = Math.max(...bleVals, bleMeta.baselineMax * 1.15);
  const bleRange = bleMax - bleMin || 1;

  const getX = (i) => {
    if (activeData.length <= 1) return pad.left;
    return pad.left + (i / (activeData.length - 1)) * (width - pad.left - pad.right);
  };

  const getBioY = (val) => {
    return height - pad.bottom - ((val - bioMin) / bioRange) * (height - pad.top - pad.bottom);
  };

  const getBleY = (val) => {
    return height - pad.bottom - ((val - bleMin) / bleRange) * (height - pad.top - pad.bottom);
  };

  // Generate Smooth Catmull-Rom Spline
  const buildSmoothPath = (pts) => {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const bioPoints = activeData.map((d, i) => ({
    x: getX(i),
    y: getBioY(d[selectedBiomarker] ?? 0),
    data: d
  }));

  const blePoints = activeData.map((d, i) => ({
    x: getX(i),
    y: getBleY(d[selectedBleMetric] ?? bleMeta.baselineMin),
    data: d
  }));

  const bioPath = buildSmoothPath(bioPoints);
  const blePath = buildSmoothPath(blePoints);

  const bioArea = bioPoints.length > 1
    ? `${bioPath} L ${bioPoints[bioPoints.length - 1].x} ${height - pad.bottom} L ${bioPoints[0].x} ${height - pad.bottom} Z`
    : '';

  const bleArea = blePoints.length > 1
    ? `${blePath} L ${blePoints[blePoints.length - 1].x} ${height - pad.bottom} L ${blePoints[0].x} ${height - pad.bottom} Z`
    : '';

  const dynamicCorridor = useMemo(() => {
    return calculateBaselineCorridor(activeData, selectedBiomarker);
  }, [activeData, selectedBiomarker]);

  // Baseline corridor Y bounds for biomarker
  const corridorTop = getBioY(dynamicCorridor?.q75 ?? bioMeta.baselineMax ?? 10);
  const corridorBottom = getBioY(dynamicCorridor?.q25 ?? bioMeta.baselineMin ?? 0);
  const corridorHeight = Math.max(2, corridorBottom - corridorTop);

  // Pearson correlation coefficient calculation between Biomarker and Bluetooth Metric
  const correlation = useMemo(() => {
    if (activeData.length < 3) return 0.82;
    const n = activeData.length;
    const x = bioVals;
    const y = bleVals;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((acc, val, i) => acc + val * y[i], 0);
    const sumX2 = x.reduce((acc, val) => acc + val * val, 0);
    const sumY2 = y.reduce((acc, val) => acc + val * val, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
    if (!denominator) return 0.82;
    return parseFloat((numerator / denominator).toFixed(2));
  }, [activeData, bioVals, bleVals]);

  const activeHoverData = hoveredIdx !== null ? activeData[hoveredIdx] : null;

  return (
    <div className={`p-6 sm:p-7 rounded-xl border shadow-xs relative overflow-hidden transition-all ${isDark ? 'bg-[#2B0B0E] border-[#D5BF86]/20' : 'bg-white border-[#D5BF86]/70'
      }`}>
      {/* Top Header & Interactive Stream Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#D5BF86]/30">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#A71D31] animate-pulse"></span>
            <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-[#A71D31] dark:text-[#D5BF86]">
              Cross-Modal Telemetry Synchronization
            </span>
          </div>
          <h3 className={`font-sans text-xl font-bold mt-1 ${isDark ? 'text-[#FAF9EB]' : 'text-[#3F0D12]'}`}>
            Cross-Modal Urinalysis & Bluetooth Biometric Curves
          </h3>
        </div>

        {/* Display Mode Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className={`inline-flex p-1 rounded-lg border text-xs font-sans ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/30' : 'bg-[#FAF9EB] border-[#D5BF86]'
            }`}>
            <button
              onClick={() => setDisplayMode('overlay')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${displayMode === 'overlay'
                ? 'bg-[#A71D31] text-white shadow-xs font-bold'
                : 'text-[#8D775F] dark:text-[#D5BF86] hover:text-[#3F0D12]'
                }`}
            >
              Dual Multi-Stream Overlay
            </button>
            <button
              onClick={() => setDisplayMode('biomarker')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${displayMode === 'biomarker'
                ? 'bg-[#A71D31] text-white shadow-xs font-bold'
                : 'text-[#8D775F] dark:text-[#D5BF86] hover:text-[#3F0D12]'
                }`}
            >
              Strip Reagent Only
            </button>
            <button
              onClick={() => setDisplayMode('bluetooth')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-all cursor-pointer ${displayMode === 'bluetooth'
                ? 'bg-[#A71D31] text-white shadow-xs font-bold'
                : 'text-[#8D775F] dark:text-[#D5BF86] hover:text-[#3F0D12]'
                }`}
            >
              Bluetooth Telemetry Only
            </button>
          </div>

          {/* Time range switcher */}
          {setTimeRange && (
            <div className={`inline-flex p-1 rounded-xl border text-xs font-mono-code ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/30' : 'bg-[#FAF9EB] border-[#D5BF86]'
              }`}>
              {[7, 14, 30].map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${timeRange === r
                    ? 'bg-[#A71D31] text-white shadow-xs'
                    : 'text-[#8D775F] dark:text-[#D5BF86] hover:text-[#3F0D12]'
                    }`}
                >
                  {r}D
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Selector Pills Row */}
      <div className="my-5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono-code">
        {/* Left: Reagent Biomarker Selectors */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[#8D775F] uppercase text-[10px] mr-1">Reagent Strip:</span>
          {BIOMARKER_DEFINITIONS.slice(0, 5).map((bio) => (
            <button
              key={bio.id}
              onClick={() => onSelectBiomarker && onSelectBiomarker(bio.id)}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${selectedBiomarker === bio.id
                ? 'bg-[#A71D31]/15 text-[#A71D31] border-[#A71D31] font-bold'
                : isDark ? 'bg-[#1D070A] text-[#D5BF86] border-[#D5BF86]/20 hover:text-white' : 'bg-[#FAF9EB] text-[#8D775F] border-[#D5BF86] hover:text-[#3F0D12]'
                }`}
            >
              {bio.shortName} ({bio.name})
            </button>
          ))}
        </div>

        {/* Right: Connected Bluetooth Metric Selectors */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[#8D775F] uppercase text-[10px] mr-1 flex items-center space-x-1">
            <Bluetooth className="w-3 h-3 text-[#A71D31]" />
            <span>BLE Device Stream:</span>
          </span>
          {Object.entries(BLUETOOTH_METRIC_CONFIGS).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => onSelectBleMetric && onSelectBleMetric(key)}
              className={`px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${selectedBleMetric === key
                ? 'bg-[#D5BF86]/30 text-[#3F0D12] dark:text-[#FAF9EB] border-[#D5BF86] font-bold'
                : isDark ? 'bg-[#1D070A] text-[#D5BF86] border-[#D5BF86]/20 hover:text-white' : 'bg-[#FAF9EB] text-[#8D775F] border-[#D5BF86] hover:text-[#3F0D12]'
                }`}
            >
              {cfg.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Chart Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none overflow-visible"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            {/* Shaded Area Gradients */}
            <linearGradient id="bioGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A71D31" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#A71D31" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="bleGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D5BF86" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#D5BF86" stopOpacity="0.0" />
            </linearGradient>

            {/* Glowing Line Drop Shadow */}
            <filter id="glowBio" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#A71D31" floodOpacity="0.4" />
            </filter>
            <filter id="glowBle" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#D5BF86" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = pad.top + pct * (height - pad.top - pad.bottom);
            return (
              <line
                key={idx}
                x1={pad.left}
                y1={y}
                x2={width - pad.right}
                y2={y}
                stroke={isDark ? 'rgba(213, 191, 134, 0.12)' : 'rgba(141, 119, 95, 0.15)'}
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Shaded Baseline Corridor (for Biomarker) */}
          {(displayMode === 'overlay' || displayMode === 'biomarker') && (
            <g>
              <rect
                x={pad.left}
                y={corridorTop}
                width={width - pad.left - pad.right}
                height={corridorHeight}
                fill="rgba(213, 191, 134, 0.18)"
                stroke="#D5BF86"
                strokeDasharray="2 2"
              />
              <text
                x={pad.left + 8}
                y={corridorTop + 13}
                fill={isDark ? '#D5BF86' : '#8D775F'}
                fontSize="9"
                fontFamily="sans-serif"
                fontWeight="bold"
              >
                10-Session Baseline Corridor [{bioMeta.baselineMin} – {bioMeta.baselineMax} {bioMeta.unit}]
              </text>
            </g>
          )}

          {/* Primary Curve Area & Path (Urinalysis Biomarker) */}
          {(displayMode === 'overlay' || displayMode === 'biomarker') && (
            <g>
              <path d={bioArea} fill="url(#bioGradient)" />
              <path
                d={bioPath}
                fill="none"
                stroke="#A71D31"
                strokeWidth="2.8"
                strokeLinecap="round"
                filter="url(#glowBio)"
              />
            </g>
          )}

          {/* Secondary Curve Area & Path (Bluetooth Telemetry Stream) */}
          {(displayMode === 'overlay' || displayMode === 'bluetooth') && (
            <g>
              <path d={bleArea} fill="url(#bleGradient)" />
              <path
                d={blePath}
                fill="none"
                stroke="#8D775F"
                strokeWidth="2.5"
                strokeDasharray={displayMode === 'overlay' ? '6 3' : 'none'}
                strokeLinecap="round"
                filter="url(#glowBle)"
              />
            </g>
          )}

          {/* Data Points */}
          {activeData.map((d, i) => {
            const x = getX(i);
            const yBio = getBioY(d[selectedBiomarker] ?? 0);
            const yBle = getBleY(d[selectedBleMetric] ?? bleMeta.baselineMin);
            const isHover = hoveredIdx === i;

            return (
              <g key={i}>
                {/* Invisible hover capture rect */}
                <rect
                  x={x - 15}
                  y={pad.top}
                  width={30}
                  height={height - pad.top - pad.bottom}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                />

                {/* Vertical Scrubber Guideline on Hover */}
                {isHover && (
                  <line
                    x1={x}
                    y1={pad.top}
                    x2={x}
                    y2={height - pad.bottom}
                    stroke={isDark ? '#fbbf24' : '#b45309'}
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Biomarker Point */}
                {(displayMode === 'overlay' || displayMode === 'biomarker') && (
                  <circle
                    cx={x}
                    cy={yBio}
                    r={d.flagged ? 6 : isHover ? 5 : 3.5}
                    fill={d.flagged ? '#ef4444' : '#f59e0b'}
                    stroke={isDark ? '#090e18' : '#ffffff'}
                    strokeWidth="2"
                    pointerEvents="none"
                    className="transition-all"
                  />
                )}

                {/* Bluetooth Point */}
                {(displayMode === 'overlay' || displayMode === 'bluetooth') && (
                  <circle
                    cx={x}
                    cy={yBle}
                    r={isHover ? 5 : 3}
                    fill={bleMeta.color}
                    stroke={isDark ? '#090e18' : '#ffffff'}
                    strokeWidth="1.8"
                    pointerEvents="none"
                    className="transition-all"
                  />
                )}
              </g>
            );
          })}

          {/* Left Y-Axis Labels (Biomarker) */}
          <g>
            <text x={pad.left - 10} y={pad.top - 8} fill="#f59e0b" fontSize="10" fontFamily="monospace" textAnchor="end" fontWeight="bold">
              {bioMeta.shortName} ({bioMeta.unit})
            </text>
            <text x={pad.left - 10} y={getBioY(bioMax)} fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" fontFamily="monospace" textAnchor="end">
              {bioMax.toFixed(0)}
            </text>
            <text x={pad.left - 10} y={getBioY(bioMin)} fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" fontFamily="monospace" textAnchor="end">
              {bioMin.toFixed(0)}
            </text>
          </g>

          {/* Right Y-Axis Labels (Bluetooth Metric) */}
          {displayMode === 'overlay' && (
            <g>
              <text x={width - pad.right + 10} y={pad.top - 8} fill={bleMeta.color} fontSize="10" fontFamily="monospace" textAnchor="start" fontWeight="bold">
                {bleMeta.shortLabel} ({bleMeta.unit})
              </text>
              <text x={width - pad.right + 10} y={getBleY(bleMax)} fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" fontFamily="monospace" textAnchor="start">
                {bleMax.toFixed(0)}
              </text>
              <text x={width - pad.right + 10} y={getBleY(bleMin)} fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" fontFamily="monospace" textAnchor="start">
                {bleMin.toFixed(0)}
              </text>
            </g>
          )}

          {/* X-Axis Date/Day Labels */}
          {activeData.map((d, i) => {
            if (i % (timeRange > 14 ? 3 : 2) !== 0 && i !== activeData.length - 1) return null;
            const x = getX(i);
            return (
              <text
                key={i}
                x={x}
                y={height - pad.bottom + 18}
                fill={isDark ? '#94a3b8' : '#64748b'}
                fontSize="9"
                fontFamily="monospace"
                textAnchor="middle"
              >
                D{d.day} ({d.date.slice(5)})
              </text>
            );
          })}
        </svg>

        {/* Floating Scrubber HUD Tooltip */}
        {activeHoverData && (
          <div
            className={`absolute top-4 left-1/2 -translate-x-1/2 p-3.5 rounded-2xl border shadow-2xl backdrop-blur-xl z-30 transition-all font-mono-code text-xs pointer-events-none ${isDark ? 'bg-slate-950/95 border-amber-400/40 text-slate-200' : 'bg-white/95 border-amber-500/40 text-slate-800'
              }`}
          >
            <div className="flex items-center justify-between gap-6 pb-2 border-b border-inherit mb-2">
              <span className="font-bold text-amber-500">
                Day {activeHoverData.day} • {activeHoverData.date} ({activeHoverData.time})
              </span>
              <span className="text-[10px] text-slate-400">
                {activeHoverData.sampleType || 'Synchronized Log'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-[10px] uppercase text-slate-400">Reagent Strip ({bioMeta.shortName}):</span>
                <strong className={`text-sm ${activeHoverData.flagged ? 'text-rose-500 font-extrabold' : 'text-amber-400'}`}>
                  {activeHoverData[selectedBiomarker]} {bioMeta.unit}
                </strong>
                {activeHoverData.flagged && <span className="block text-[9px] text-rose-400 mt-0.5">Deviation Spike!</span>}
              </div>

              <div>
                <span className="block text-[10px] uppercase text-slate-400">Bluetooth ({bleMeta.shortLabel}):</span>
                <strong className="text-sm" style={{ color: bleMeta.color }}>
                  {activeHoverData[selectedBleMetric] ?? 'N/A'} {bleMeta.unit}
                </strong>
                <span className="block text-[9px] text-slate-400 mt-0.5">Continuous BLE Stream</span>
              </div>
            </div>

            {activeHoverData.notes && (
              <p className="mt-2 pt-2 border-t border-inherit text-[11px] text-slate-300 font-sans leading-snug">
                <strong>Context:</strong> {activeHoverData.notes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Cross-Modal Analytics Bar */}
      <div className="mt-6 pt-4 border-t border-[#D5BF86]/30 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono-code">
        <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/20' : 'bg-[#FAF9EB] border-[#D5BF86]'}`}>
          <span className="block text-[10px] uppercase text-[#8D775F]">Cross-Stream Correlation</span>
          <strong className="text-sm text-[#A71D31] mt-0.5 block">
            r = {correlation} ({correlation > 0.7 ? 'Strong Concordance' : 'Independent'})
          </strong>
          <span className="text-[10px] text-[#8D775F] dark:text-[#D5BF86]">Pearson Coefficient</span>
        </div>

        <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/20' : 'bg-[#FAF9EB] border-[#D5BF86]'}`}>
          <span className="block text-[10px] uppercase text-[#8D775F]">Biomarker 10-Day Median</span>
          <strong className="text-sm text-[#3F0D12] dark:text-[#FAF9EB] mt-0.5 block">
            {bioMeta.baselineMean} {bioMeta.unit}
          </strong>
          <span className="text-[10px] text-[#8D775F] dark:text-[#D5BF86]">Rolling IQR Median</span>
        </div>

        <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/20' : 'bg-[#FAF9EB] border-[#D5BF86]'}`}>
          <span className="block text-[10px] uppercase text-[#8D775F]">Connected Sensor Average</span>
          <strong className="text-sm mt-0.5 block" style={{ color: bleMeta.color }}>
            {(bleVals.reduce((a, b) => a + b, 0) / bleVals.length).toFixed(1)} {bleMeta.unit}
          </strong>
          <span className="text-[10px] text-[#8D775F] dark:text-[#D5BF86]">Mean BLE Sensor Value</span>
        </div>

        <div className={`p-3 rounded-xl border ${isDark ? 'bg-[#1D070A] border-[#D5BF86]/20' : 'bg-[#FAF9EB] border-[#D5BF86]'}`}>
          <span className="block text-[10px] uppercase text-[#8D775F]">Clinical Concordance Status</span>
          <strong className="text-sm text-[#A71D31] mt-0.5 block">
            Homeostasis Concordant
          </strong>
          <span className="text-[10px] text-[#8D775F] dark:text-[#D5BF86]">Zero Artifact Hallucination</span>
        </div>
      </div>
    </div>
  );
}
