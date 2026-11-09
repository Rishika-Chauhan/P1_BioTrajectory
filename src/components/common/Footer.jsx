import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, ExternalLink, Sparkles } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-[#070B14]/90 backdrop-blur-md transition-colors duration-300 pt-16 pb-12 relative overflow-hidden">
      {/* Ambient background glow in footer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-gradient-to-t from-cyan-500/5 via-blue-500/5 to-transparent blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-200/80 dark:border-slate-800/80">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <BrandLogo />
            
            <p className="text-[15px] text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Healthcare that understands where your health is heading. Turning repeated daily readings into clear, understandable health timelines.
            </p>

            <div className="flex items-center gap-2.5 text-[14px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Safe & Private Health Data</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4 tracking-wide uppercase">
              Explore
            </h4>
            <ul className="space-y-2.5 text-[15px] text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Understand Your Health
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Health Features */}
          <div>
            <h4 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4 tracking-wide uppercase">
              Features
            </h4>
            <ul className="space-y-2.5 text-[15px] text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/dashboard" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Home Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/reports" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  My Day
                </Link>
              </li>
              <li>
                <Link to="/dashboard/analytics" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  My Health
                </Link>
              </li>
              <li>
                <Link to="/dashboard/history" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  My Records
                </Link>
              </li>
              <li>
                <Link to="/dashboard/assistant" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Ask AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Care */}
          <div>
            <h4 className="text-[15px] font-bold text-slate-900 dark:text-white mb-4 tracking-wide uppercase">
              Care & Portals
            </h4>
            <ul className="space-y-2.5 text-[15px] text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/dashboard/consultation" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Talk to Doctor
                </Link>
              </li>
              <li>
                <Link to="/dashboard/qr" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  My Health QR
                </Link>
              </li>
              <li>
                <Link to="/dashboard/settings" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Preferences
                </Link>
              </li>
              <li>
                <Link to="/doctor/dashboard" className="hover:text-cyan-500 text-cyan-600 dark:text-cyan-400 transition-colors inline-flex items-center gap-1.5 font-medium">
                  Doctor Portal <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-purple-400 text-purple-600 dark:text-purple-400 transition-colors inline-flex items-center gap-1.5 font-medium">
                  Admin Portal <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[14px] text-slate-500 dark:text-slate-400">
          <p className="max-w-2xl text-center md:text-left leading-relaxed">
            <strong>Medical Notice:</strong> BioTrajectory is an educational and personal health tracking tool. It does not provide medical diagnoses or replace care from a qualified doctor.
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            <span>Built with care for your health</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
