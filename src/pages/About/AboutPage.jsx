import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ArrowLeft, Sparkles, Activity } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="w-full min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        
        {/* Subtle Healthcare Illustration Icon */}
        <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-blue-600/20 to-cyan-400/20 border border-cyan-500/30 flex items-center justify-center shadow-xl shadow-cyan-500/10">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 text-cyan-400 flex items-center justify-center">
            <HeartPulse className="w-9 h-9 text-cyan-400 animate-pulse" />
          </div>
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cyan-400 flex items-center justify-center text-slate-950">
            <Sparkles className="w-3 h-3" />
          </span>
        </div>

        {/* Heading and Subtitle */}
        <div className="space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-[15px] font-bold bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border border-cyan-500/25">
            About BioTrajectory
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Something Meaningful Is Coming.
          </h1>

          <p className="text-[18px] sm:text-[20px] text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            We're working on something special. Stay tuned for more about BioTrajectory.
          </p>
        </div>

        {/* Return Home Button */}
        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl text-[17px] font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
