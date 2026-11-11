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
      ? 'bg-[#1D070A] text-[#FAF9EB] selection:bg-[#A71D31]/40 selection:text-[#FAF9EB]'
      : 'bg-[#F1F0CC] text-[#3F0D12] selection:bg-[#A71D31]/25 selection:text-[#3F0D12]'
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
