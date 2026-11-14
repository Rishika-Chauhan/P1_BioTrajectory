import React, { useState } from 'react';
import { MessageSquare, Star, CheckCircle } from 'lucide-react';
import { PLATFORM_FEEDBACK } from '../../data/adminData';

export default function AdminFeedbackPage() {
  const [feedbackList] = useState(PLATFORM_FEEDBACK);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          Community Feedback & Testimonials
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review patient insights, feature evaluations, and usability scores
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {feedbackList.map(item => (
          <div key={item.id} className="p-6 rounded-3xl bg-[#101827] border border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed italic">"{item.comment}"</p>
            </div>
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-[11px] text-slate-400">
              <span className="font-semibold text-purple-300">{item.user}</span>
              <span>{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
