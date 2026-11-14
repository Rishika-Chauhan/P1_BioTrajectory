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
    <section className={`relative py-20 transition-colors border-t ${isDark ? 'bg-[#070b14] border-slate-800' : 'bg-[#faf8ff] border-slate-200'
      }`} id="stack">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Architecture & Engineering Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-5 border-b border-inherit">
          <div className="max-w-2xl">
            <span className="text-[11px] font-sans uppercase tracking-wider font-bold block mb-1 text-[#00685f] dark:text-[#6bd8cb]">
              Deterministic Engineering & Privacy Stacks
            </span>
            <h2 className={`font-sans text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
              Platform Architecture & Verifiable Code Stacks
            </h2>
            <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Engineered with zero raw-image transmission, client-side WebAssembly colorimetry, rolling IQR persistence, and grounded Gemini 3.8 Flash synthesis.
            </p>
          </div>
          <div className={`text-xs font-sans px-3 py-1.5 rounded-lg border shrink-0 ${isDark ? 'bg-[#0d1526] border-slate-800 text-[#6bd8cb]' : 'bg-white border-slate-200 text-[#00685f] shadow-xs'}`}>
            Click any component to inspect implementation
          </div>
        </div>

        {/* 8-Card Tech Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {PDF_TECH_STACK.map((item, idx) => {
            const Icon = iconMap[item.icon] || Code;
            const isSelected = activeStackIndex === idx;
            return (
              <div
                key={item.category}
                onClick={() => setActiveStackIndex(idx)}
                className={`p-5 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col justify-between ${isSelected
                  ? isDark
                    ? 'bg-[#0d1526] border-[#00685f] shadow-[0_4px_20px_rgba(0,104,95,0.2)] ring-1 ring-[#00685f]'
                    : 'bg-white border-[#00685f] shadow-xs ring-1 ring-[#00685f]/40'
                  : isDark
                    ? 'bg-[#0d1526]/70 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-[#e2e8f0] hover:border-slate-300 shadow-xs'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-[10px] font-sans uppercase font-bold tracking-wider ${isSelected
                      ? 'text-[#00685f] dark:text-[#6bd8cb]'
                      : 'text-slate-400'
                      }`}>
                      {item.category}
                    </span>
                    <div className={`w-7 h-7 rounded-md flex items-center justify-center ${isSelected
                      ? 'bg-[#00685f] text-white'
                      : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h4 className={`font-sans text-sm font-bold mb-1 ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
                    {item.title}
                  </h4>

                  <p className={`text-xs leading-snug ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {item.description}
                  </p>
                </div>

                <div className={`mt-3 pt-2 border-t text-[10px] font-sans flex items-center justify-between ${isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-[#00687a]'}`}>
                  <span>{isSelected ? 'Inspecting code' : 'Click to inspect'}</span>
                  <Code className="w-3 h-3" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Live Code / Implementation Inspector */}
        <div className={`rounded-xl border p-6 mb-10 shadow-xs ${isDark ? 'bg-[#0d1526] border-slate-800' : 'bg-white border-[#e2e8f0]'}`}>
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-inherit mb-3">
            <div>
              <span className="text-[10px] font-sans uppercase font-bold text-[#00685f] dark:text-[#6bd8cb]">
                Layer Implementation: {PDF_TECH_STACK[activeStackIndex].category}
              </span>
              <h3 className={`font-sans text-lg font-bold mt-0.5 ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
                {stackCodeSamples[activeStackIndex].title}
              </h3>
            </div>
            <span className={`text-xs font-sans px-2.5 py-1 rounded border ${isDark ? 'bg-[#070b14] text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
              {PDF_TECH_STACK[activeStackIndex].role}
            </span>
          </div>

          <div className="rounded-lg overflow-hidden bg-slate-950 border border-slate-800 p-4 font-mono text-xs text-[#6bd8cb] overflow-x-auto">
            <pre>
              <code>{stackCodeSamples[activeStackIndex].code}</code>
            </pre>
          </div>
        </div>

        {/* The Open Source Guarantee Banner */}
        <div className={`rounded-xl p-6 border shadow-xs ${isDark
          ? 'bg-[#0d1526] border-slate-800'
          : 'bg-white border-[#e2e8f0]'
          }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-lg bg-[#00685f]/10 text-[#00685f] flex items-center justify-center shrink-0">
                <GitBranch className="w-5 h-5 text-[#00685f]" />
              </div>
              <div>
                <h4 className={`font-sans text-base font-bold ${isDark ? 'text-white' : 'text-[#131b2e]'}`}>
                  The core stack is open source.
                </h4>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Anyone can inspect, extend and contribute. Grounded in transparency and patient privacy.
                </p>
              </div>
            </div>

            <a
              href="https://github.com/Rishika-Chauhan/BioTrajectory"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-lg text-xs font-sans font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-all bg-[#00685f] hover:bg-[#008378] text-white shadow-xs"
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
