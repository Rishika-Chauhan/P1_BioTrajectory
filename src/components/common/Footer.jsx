import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-[#F5F8FC] dark:bg-[#070B14] transition-colors duration-200 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-200 dark:border-slate-800">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] shadow-sm">
                <div className="w-full h-full bg-[#070B14] rounded-[14px] flex items-center justify-center">
                  <Activity className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
                Bio<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Trajectory</span>
              </span>
            </div>
            
            <p className="text-[16px] text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Healthcare that understands where your health is heading. Turning repeated daily readings into clear, understandable health timelines.
            </p>

            <div className="flex items-center gap-2.5 text-[15px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl w-fit">
              <ShieldCheck className="w-5 h-5" />
              <span>Safe & Private Health Data</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[17px] font-bold text-slate-900 dark:text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-3 text-[16px] text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/" className="hover:text-cyan-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-cyan-500 transition-colors">
                  Understand Your Health
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-cyan-500 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-cyan-500 transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Health Features */}
          <div>
            <h4 className="text-[17px] font-bold text-slate-900 dark:text-white mb-4">
              Features
            </h4>
            <ul className="space-y-3 text-[16px] text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/dashboard" className="hover:text-cyan-500 transition-colors">
                  Home Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/reports" className="hover:text-cyan-500 transition-colors">
                  My Day
                </Link>
              </li>
              <li>
                <Link to="/dashboard/analytics" className="hover:text-cyan-500 transition-colors">
                  My Health
                </Link>
              </li>
              <li>
                <Link to="/dashboard/history" className="hover:text-cyan-500 transition-colors">
                  My Records
                </Link>
              </li>
              <li>
                <Link to="/dashboard/assistant" className="hover:text-cyan-500 transition-colors">
                  Ask AI
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect & Care */}
          <div>
            <h4 className="text-[17px] font-bold text-slate-900 dark:text-white mb-4">
              Care & Help
            </h4>
            <ul className="space-y-3 text-[16px] text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/dashboard/consultation" className="hover:text-cyan-500 transition-colors">
                  Talk to Doctor
                </Link>
              </li>
              <li>
                <Link to="/dashboard/qr" className="hover:text-cyan-500 transition-colors">
                  My QR
                </Link>
              </li>
              <li>
                <Link to="/dashboard/settings" className="hover:text-cyan-500 transition-colors">
                  Settings
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-purple-400 text-purple-400 transition-colors inline-flex items-center gap-1.5 font-medium">
                  Admin Portal <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[15px] text-slate-500 dark:text-slate-400">
          <p className="max-w-2xl text-center md:text-left leading-relaxed">
            <strong>Medical Notice:</strong> BioTrajectory is an educational and personal health tracking tool. It does not provide medical diagnoses or replace care from a qualified doctor.
          </p>
          <div className="flex items-center gap-1.5 shrink-0">
            <span>Built with care for your health</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
