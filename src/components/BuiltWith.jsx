import React, { useState } from 'react';
import { Layers, Server, Database, Camera, Cpu, Sparkles, LineChart, Cloud, Code, GitBranch, Check, ExternalLink } from 'lucide-react';
import { PDF_TECH_STACK } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';

export default function BuiltWith() {
  const { isDark } = useTheme();
  const [activeStackIndex, setActiveStackIndex] = useState(0);

  const iconMap = {
    Layers: Layers,
    Server: Server,
    Database: Database,
    Camera: Camera,
    Cpu: Cpu,
    Sparkles: Sparkles,
    LineChart: LineChart,
    Cloud: Cloud
  };

  const stackCodeSamples = [
    {
      title: 'React 19 + SVG Trajectory Rendering',
      code: `// Deterministic SVG Trajectory Curve
const corridor = calculateBaselineCorridor(history, 'protein');
<svg className="w-full h-64">
  <rect y={corridor.yMin} height={corridor.bandHeight} fill="rgba(16,185,129,0.12)" />
  <path d={smoothCurve(history)} stroke="#b45309" strokeWidth="2.5" />
</svg>`
    },
    {
      title: 'FastAPI Trend & Baseline Endpoints',
      code: `@app.post("/api/v1/trajectory/analyze")
async def evaluate_reading(payload: TestReadingSchema):
    baseline = get_user_rolling_median(payload.user_id)
    variance_sigma = calculate_deviation(payload.protein, baseline)
    return {"flag": variance_sigma > 3.0, "sigma": variance_sigma}`
    },
    {
      title: 'PostgreSQL Encrypted Schema',
      code: `CREATE TABLE patient_readings (
    id UUID PRIMARY KEY,
    user_hash VARCHAR(64) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    biomarkers JSONB NOT NULL,
    user_confirmed BOOLEAN DEFAULT TRUE,
    notes_encrypted BYTEA
);`
    },
    {
      title: 'OpenCV Chromatic Calibration',
      code: `def calibrate_test_strip(image_raw):
    # Detect 4 corner calibration fiducials
    warped = perspective_transform(image_raw)
    wb_corrected = white_balance_grayworld(warped)
    pads = segment_reagent_pads(wb_corrected)
    return extract_lab_color_distances(pads)`
    },
    {
      title: 'pandas Baseline & Persistence Engine',
      code: `df['protein_median'] = df['protein'].rolling(10, min_periods=5).median()
df['iqr_upper'] = df['protein'].rolling(10).quantile(0.75) * 1.5
# 3-consecutive day rule: eliminates single workout spike
df['persistent_shift'] = (df['protein'] > df['iqr_upper']).rolling(3).sum() >= 2`
    },
    {
      title: 'Gemini 3.8 Flash Grounded Prompt',
      code: `response = client.models.generate_content(
    model="gemini-3.8-flash",
    contents=f"""Patient confirmed readings: {verified_data}.
    Explain deviation from baseline ({baseline}) in plain language.
    STRICT: Do NOT diagnose illness. State limitations explicitly."""
)`
    },
    {
      title: 'Recharts Responsive Visualizer',
      code: `<ResponsiveContainer width="100%" height={260}>
  <AreaChart data={data}>
    <Area dataKey="baselineBand" fill="#10b98115" stroke="none" />
    <Line dataKey="reading" stroke="#c5a880" strokeWidth={2.5} dot={<CustomDot />} />
  </AreaChart>
</ResponsiveContainer>`
    },
    {
      title: 'Privacy-Preserving On-Device Pipeline',
      code: `// Client-side WebAssembly inference
const wasmCV = await loadOpenCVWasm();
const padsRGB = wasmCV.extractPads(cameraFrame);
// Raw image discarded; only encrypted structured numbers stored.`
    }
  ];

  return (
    <section className={`relative py-28 transition-colors border-t ${isDark ? 'bg-[#070b14] border-white/5' : 'bg-[#f4efe8]/50 border-amber-900/10'
      }`} id="stack">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Architecture & Engineering Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-inherit">
          <div className="max-w-2xl">
            <span className={`text-[11px] font-mono-code uppercase tracking-wider font-bold block mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-700'}`}>
              Deterministic Engineering & Privacy Stacks
            </span>
            <h2 className={`font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Platform Architecture & Verifiable Code Stacks
            </h2>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Engineered with zero raw-image transmission, client-side WebAssembly colorimetry, rolling IQR persistence, and grounded Gemini 3.8 Flash synthesis.
            </p>
          </div>
          <div className={`text-xs font-mono-code px-3.5 py-1.5 rounded-xl border shrink-0 ${isDark ? 'bg-slate-900 border-white/10 text-indigo-300' : 'bg-white border-slate-200 text-indigo-900 shadow-xs'}`}>
            Click any component to inspect implementation
          </div>
        </div>

        {/* 8-Card Tech Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {PDF_TECH_STACK.map((item, idx) => {
            const Icon = iconMap[item.icon] || Code;
            const isSelected = activeStackIndex === idx;
            return (
              <div
                key={item.category}
                onClick={() => setActiveStackIndex(idx)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${isSelected
                  ? isDark
                    ? 'bg-[#11192e] border-amber-400 shadow-[0_10px_30px_rgba(217,119,6,0.15)] ring-1 ring-amber-400/40'
                    : 'bg-white border-amber-500 shadow-[0_10px_25px_rgba(180,145,95,0.1)] ring-1 ring-amber-400/60'
                  : isDark
                    ? 'bg-[#090e18] border-white/5 hover:border-white/15'
                    : 'bg-white border-slate-200 hover:border-amber-300 shadow-xs'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-mono-code uppercase font-bold tracking-wider ${isSelected
                      ? isDark ? 'text-amber-300' : 'text-amber-700'
                      : isDark ? 'text-slate-500' : 'text-slate-400'
                      }`}>
                      {item.category}
                    </span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${isSelected
                      ? isDark ? 'bg-amber-400 text-slate-950 border-amber-300' : 'bg-amber-700 text-white border-amber-800'
                      : isDark ? 'bg-slate-900 text-slate-400 border-white/5' : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h4 className={`font-cinzel text-base font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                    {item.title}
                  </h4>

                  <p className={`text-xs leading-snug ${isDark ? 'text-slate-300' : 'text-slate-600'
                    }`}>
                    {item.description}
                  </p>
                </div>

                <div className={`mt-4 pt-2 border-t text-[10px] font-mono-code flex items-center justify-between ${isDark ? 'border-white/5 text-amber-300/80' : 'border-slate-100 text-amber-900/80'
                  }`}>
                  <span>{isSelected ? 'Inspecting code' : 'Click to inspect'}</span>
                  <Code className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Code / Implementation Inspector */}
        <div className={`rounded-2xl border p-6 sm:p-8 mb-14 shadow-xl ${isDark ? 'bg-[#090e18] border-white/10' : 'bg-white border-amber-900/10 shadow-[0_10px_35px_rgba(0,0,0,0.04)]'
          }`}>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-inherit mb-4">
            <div>
              <span className={`text-xs font-mono-code uppercase font-bold ${isDark ? 'text-amber-300' : 'text-amber-800'
                }`}>
                Layer Implementation: {PDF_TECH_STACK[activeStackIndex].category}
              </span>
              <h3 className={`font-cinzel text-xl font-bold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stackCodeSamples[activeStackIndex].title}
              </h3>
            </div>
            <span className={`text-xs font-mono-code px-3 py-1 rounded border ${isDark ? 'bg-slate-900 text-slate-300 border-white/10' : 'bg-slate-100 text-slate-700 border-slate-300'
              }`}>
              {PDF_TECH_STACK[activeStackIndex].role}
            </span>
          </div>

          <div className="rounded-xl overflow-hidden bg-slate-950 border border-white/10 p-4 font-mono-code text-xs text-amber-200/90 overflow-x-auto">
            <pre>
              <code>{stackCodeSamples[activeStackIndex].code}</code>
            </pre>
          </div>
        </div>

        {/* The Open Source Guarantee Banner */}
        <div className={`rounded-2xl p-6 sm:p-8 border shadow-lg text-center ${isDark
          ? 'bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 border-amber-400/30'
          : 'bg-gradient-to-r from-amber-50 via-white to-amber-50 border-amber-300/80 shadow-[0_10px_30px_rgba(180,145,95,0.06)]'
          }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <h4 className={`font-cinzel text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  The core stack is open source.
                </h4>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Anyone can inspect, extend and contribute. Grounded in transparency and patient privacy.
                </p>
              </div>
            </div>

            <a
              href="https://github.com/Rishika-Chauhan/BioTrajectory"
              target="_blank"
              rel="noreferrer"
              className={`px-5 py-2.5 rounded-xl text-xs font-mono-code font-bold uppercase tracking-wider flex items-center space-x-2 transition-all ${isDark
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-[0_0_20px_rgba(217,119,6,0.2)]'
                : 'bg-amber-700 text-white hover:bg-amber-800 shadow-sm'
                }`}
            >
              <span>Inspect Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
