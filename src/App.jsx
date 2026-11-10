import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LiveDemo from './components/LiveDemo';
import TheProblem from './components/TheProblem';
import OurSolution from './components/OurSolution';
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
    <div className={`min-h-screen transition-colors duration-300 ${isDark
      ? 'bg-[#05070c] text-slate-200 selection:bg-amber-500/20 selection:text-amber-200'
      : 'bg-[#faf9f6] text-slate-800 selection:bg-amber-500/30 selection:text-amber-900'
      }`}>
      {/* Top Navbar with Theme Toggle & Report Trigger */}
      <Navbar
        onOpenDemo={scrollToDemo}
        onOpenReport={() => setReportModalOpen(true)}
      />

      {/* Main Experience Flow */}
      <main>
        {/* Patient Trajectory Dashboard (Live Graphs, Bluetooth BLE Hub, Attractive Line & Pie Charts, Reports) */}
        <LiveDemo onOpenReportModal={() => setReportModalOpen(true)} />

        {/* Diagnostic Continuity & Point-in-Time Blindspot */}
        <TheProblem />

        {/* Continuous Baseline Methodology */}
        <OurSolution onOpenDemo={scrollToDemo} />

        {/* End-to-End Clinical Flow */}
        <HowItWorks
          onOpenDemo={scrollToDemo}
          onOpenReport={() => setReportModalOpen(true)}
        />

        {/* Reagent Biomarker Suite & Physiological Confounders */}
        <BiomarkerSuite />

        {/* Technology Stack & Verification */}
        <BuiltWith />

        {/* Target Clinical Populations */}
        <WhoNeedsThis onOpenDemo={scrollToDemo} />

        {/* Clinical Governance & Safety Rigor */}
        <ClinicalSafety />

        {/* Deterministic System Architecture */}
        <SystemArchitecture />

        {/* Strategic Horizons & Validation Roadmap */}
        <Roadmap />

        {/* Clinical Verification & FAQ */}
        <PitchRoom
          onOpenDemo={scrollToDemo}
          onOpenReport={() => setReportModalOpen(true)}
        />
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
