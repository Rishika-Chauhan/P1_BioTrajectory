import React, { useState } from 'react';
import Navbar from './components/Navbar';
import LiveDemo from './components/LiveDemo';
import TheProblem from './components/TheProblem';
import BiomarkerSuite from './components/BiomarkerSuite';
import Footer from './components/Footer';
import ReportModal from './components/ReportModal';
import HealthProfileModal from './components/HealthProfileModal';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function MainApp() {
  const { isDark } = useTheme();
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [healthProfileModalOpen, setHealthProfileModalOpen] = useState(false);

  const scrollToDemo = () => {
    const el = document.getElementById('live-prototype');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark
      ? 'bg-[#070b14] text-slate-100 selection:bg-[#00685f]/30 selection:text-[#6bd8cb]'
      : 'bg-[#faf8ff] text-[#131b2e] selection:bg-[#00685f]/20 selection:text-[#00685f]'
      }`}>
      {/* Top Navbar with Theme Toggle, Health Profile & Report Triggers */}
      <Navbar
        onOpenDemo={scrollToDemo}
        onOpenReport={() => setReportModalOpen(true)}
        onOpenProfile={() => setHealthProfileModalOpen(true)}
      />

      {/* Main Experience Flow */}
      <main>
        {/* Patient Trajectory Dashboard (Live Graphs, Bluetooth BLE Hub, Attractive Line & Pie Charts, Reports) */}
        <LiveDemo
          onOpenReportModal={() => setReportModalOpen(true)}
          onOpenProfile={() => setHealthProfileModalOpen(true)}
        />

        {/* Diagnostic Continuity & Point-in-Time Blindspot */}
        <TheProblem />

        {/* Reagent Biomarker Suite & Physiological Confounders */}
        <BiomarkerSuite />
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

      {/* First-Time Onboarding & Health Profile Management Modal */}
      <HealthProfileModal
        isOpen={healthProfileModalOpen}
        onClose={() => setHealthProfileModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
