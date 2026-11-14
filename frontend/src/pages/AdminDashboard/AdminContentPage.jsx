import React, { useState } from 'react';
import { FileCheck, Plus, CheckCircle2, Trash2 } from 'lucide-react';

export default function AdminContentPage() {
  const [articles, setArticles] = useState([
    {
      id: 'art_1',
      title: 'Interpreting Home Blood Pressure: Morning vs Evening Spikes',
      category: 'Cardiovascular Guidance',
      readTime: '4 min read',
      status: 'Published',
      views: '14,280'
    },
    {
      id: 'art_2',
      title: 'Why Urine Specific Gravity Matters for Kidney Tubule Health',
      category: 'Nephrology & Hydration',
      readTime: '6 min read',
      status: 'Published',
      views: '9,840'
    },
    {
      id: 'art_3',
      title: 'Aerobic Pace vs Step Volume: Tuning Cardiovascular Recovery',
      category: 'Physical Mobility',
      readTime: '5 min read',
      status: 'Published',
      views: '18,920'
    }
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Educational Content Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publish and maintain preventive health guides and biomarker education for platform users
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map(art => (
          <div key={art.id} className="p-6 rounded-3xl bg-[#101827] border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                {art.category}
              </span>
              <h3 className="text-sm font-bold text-white leading-snug">{art.title}</h3>
              <p className="text-xs text-slate-400">{art.readTime} • {art.views} reads</p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
              <span className="text-emerald-400 font-bold">{art.status}</span>
              <button
                onClick={() => setArticles(articles.filter(a => a.id !== art.id))}
                className="text-slate-400 hover:text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
