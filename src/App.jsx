import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TheProblem from './components/TheProblem';
import OurSolution from './components/OurSolution';
import LiveDemo from './components/LiveDemo';
import HowItWorks from './components/HowItWorks';
import BiomarkerSuite from './components/BiomarkerSuite';
import BuiltWith from './components/BuiltWith';
import WhoNeedsThis from './components/WhoNeedsThis';
import ClinicalSafety from './components/ClinicalSafety';
import SystemArchitecture from './components/SystemArchitecture';
import Roadmap from './components/Roadmap';
import PitchRoom from './components/PitchRoom';
import Footer from './components/Footer';
import ReportModal from './components/ReportModal';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './App.css';

function MainApp() {
  const { isDark } = useTheme();
  const [reportModalOpen, setReportModalOpen] = useState(false);

  const scrollToDemo = () => {
    const el = document.getElementById('live-prototype');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark
        ? 'bg-[#05070c] text-slate-200 selection:bg-amber-500/20 selection:text-amber-200'
        : 'bg-[#faf9f6] text-slate-800 selection:bg-amber-500/30 selection:text-amber-900'
    }`}>
      {/* Top Navbar with Theme Toggle */}
      <Navbar
        onOpenDemo={scrollToDemo}
        onOpenReport={() => setReportModalOpen(true)}
      />

      {/* Main Experience Flow */}
      <main>
        {/* Slide 1: Hero Section */}
        <Hero
          onOpenDemo={scrollToDemo}
          onOpenReport={() => setReportModalOpen(true)}
        />

        {/* Slide 2: The Problem */}
        <TheProblem />

        {/* Slide 3: Our Solution */}
        <OurSolution onOpenDemo={scrollToDemo} />

        {/* Slide 4: Meet the Product & Live Software Prototype */}
        <LiveDemo onOpenReportModal={() => setReportModalOpen(true)} />

        {/* Slide 5: How It Works */}
        <HowItWorks
          onOpenDemo={scrollToDemo}
          onOpenReport={() => setReportModalOpen(true)}
        />

        {/* Reagent Biomarker Deep Dive */}
        <BiomarkerSuite />

        {/* Slide 6: Built With (Tech Stack) */}
        <BuiltWith />

        {/* Slide 7: Who Needs This? */}
        <WhoNeedsThis onOpenDemo={scrollToDemo} />

        {/* Clinical Safety & Non-Diagnostic Limits */}
        <ClinicalSafety />

        {/* System Architecture & Deterministic Data Flow */}
        <SystemArchitecture />

        {/* Slide 8: Future Plan & Staged Roadmap */}
        <Roadmap />

        {/* Slide 9: Executive Pitch Room & CodeSprint Finale */}
        <PitchRoom />
      </main>

      {/* Luxury Footer */}
      <Footer
        onOpenDemo={scrollToDemo}
        onOpenReport={() => setReportModalOpen(true)}
      />

      {/* Clinician Handover Report Modal */}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
