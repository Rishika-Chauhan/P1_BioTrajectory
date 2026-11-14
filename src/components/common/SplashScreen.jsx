import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen({ onClose = null }) {
  // Always active on every refresh or entrance to home page
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Clean up static pre-splash HTML overlay once React mounts
  useEffect(() => {
    const preSplash = document.getElementById('biotrajectory-initial-splash');
    if (preSplash) {
      preSplash.remove();
    }
  }, []);

  // Cinematic Polyphonic Biotech Sound Synthesis (Studio Chime & Sub-bass Thump)
  const playCinematicSound = useCallback(() => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;

      // Master output stage with smooth headroom
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.24, now);
      masterGain.connect(ctx.destination);

      // 1. Deep Sub-Bass Heartbeat Impact (Acoustic foundation 54Hz -> 36Hz)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(54, now);
      subOsc.frequency.exponentialRampToValueAtTime(36, now + 0.9);
      subGain.gain.setValueAtTime(0.38, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start(now + 0.05);
      subOsc.stop(now + 1.25);

      // 2. Polyphonic Harmonic Crystalline Chime (Cinematic Biotech Major-9th Chord)
      const notes = [
        { freq: 261.63, type: 'sine', delay: 0.08, gain: 0.22, decay: 2.3 },   // C4 Fundamental
        { freq: 392.00, type: 'triangle', delay: 0.14, gain: 0.18, decay: 2.2 }, // G4 Fifth
        { freq: 523.25, type: 'sine', delay: 0.22, gain: 0.16, decay: 2.0 },   // C5 Octave
        { freq: 659.25, type: 'sine', delay: 0.32, gain: 0.15, decay: 1.9 },   // E5 Major Third
        { freq: 783.99, type: 'triangle', delay: 0.42, gain: 0.13, decay: 1.8 }, // G5 Fifth
        { freq: 987.77, type: 'sine', delay: 0.52, gain: 0.11, decay: 1.6 },   // B5 Major 7th
        { freq: 1174.66, type: 'triangle', delay: 0.64, gain: 0.08, decay: 1.5 } // D6 Sparkle 9th
      ];

      // Dynamic low-pass filter opening like sunrise
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);
      filter.frequency.exponentialRampToValueAtTime(5400, now + 1.2);
      filter.connect(masterGain);

      notes.forEach(({ freq, type, delay, gain, decay }) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, now + delay);
        osc.detune.setValueAtTime((Math.random() - 0.5) * 6, now + delay);

        g.gain.setValueAtTime(0.0001, now + delay);
        g.gain.linearRampToValueAtTime(gain, now + delay + 0.06);
        g.gain.exponentialRampToValueAtTime(0.0001, now + delay + decay);

        osc.connect(g);
        g.connect(filter);

        osc.start(now + delay);
        osc.stop(now + delay + decay + 0.1);
      });

      // 3. Ethereal High Sparkle Bell Accent (at 0.72s with light sweep)
      const sparkleOsc = ctx.createOscillator();
      const sparkleGain = ctx.createGain();
      sparkleOsc.type = 'sine';
      sparkleOsc.frequency.setValueAtTime(1567.98, now + 0.72); // G6 crystal chime
      sparkleGain.gain.setValueAtTime(0.0001, now + 0.72);
      sparkleGain.gain.linearRampToValueAtTime(0.065, now + 0.8);
      sparkleGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
      sparkleOsc.connect(sparkleGain);
      sparkleGain.connect(masterGain);
      sparkleOsc.start(now + 0.72);
      sparkleOsc.stop(now + 2.3);

    } catch {
      // Audio policy restricted - graceful silent fallback
    }
  }, []);

  const handleDismiss = useCallback(() => {
    setIsExiting(true);
    // Allow smooth zoom-through dissolve exit to complete
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 550);
  }, [onClose]);

  // Replay event listener (e.g. from navbar "Home" click)
  useEffect(() => {
    const handleReplay = () => {
      setIsExiting(false);
      setIsVisible(true);
    };
    window.addEventListener('biotrajectory_replay_splash', handleReplay);
    return () => window.removeEventListener('biotrajectory_replay_splash', handleReplay);
  }, []);

  // Continuous running time: 3.5 seconds
  useEffect(() => {
    if (!isVisible || isExiting) return;

    // Trigger rich audio cue on launch
    const audioTimer = setTimeout(() => {
      playCinematicSound();
    }, 200);

    // Continuous running time: strictly 3.5 seconds
    const dismissTimer = setTimeout(() => {
      handleDismiss();
    }, 3500);

    return () => {
      clearTimeout(audioTimer);
      clearTimeout(dismissTimer);
    };
  }, [isVisible, isExiting, handleDismiss, playCinematicSound]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="white-theme-3.5s-splash"
        initial={false}
        animate={isExiting ? { opacity: 0, scale: 0.96 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onClick={handleDismiss}
        className="fixed inset-0 z-[99999] flex flex-col items-center justify-between p-8 sm:p-12 bg-white text-slate-900 overflow-hidden cursor-pointer select-none"
        title="Click anywhere to enter BioTrajectory immediately"
      >
        {/* Expanding Precision Sonar / Droplet Pulse Ripples */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[0, 1.1, 2.2].map((delay, idx) => (
            <motion.div
              key={`ripple-${idx}`}
              initial={{ scale: 0.5, opacity: 0.7 }}
              animate={{ scale: [0.5, 2.2, 3.4], opacity: [0.65, 0.22, 0] }}
              transition={{
                duration: 3.0,
                delay,
                repeat: Infinity,
                ease: 'easeOut'
              }}
              className="absolute w-64 h-64 sm:w-84 sm:h-84 rounded-full border border-cyan-400/35 pointer-events-none"
              style={{
                boxShadow: '0 0 24px rgba(6, 182, 212, 0.12)'
              }}
            />
          ))}
        </div>

        {/* Top Minimal Skip Pill */}
        <div className="w-full flex justify-end z-20">
          <span className="text-[11px] font-mono tracking-widest text-slate-400 uppercase hover:text-slate-700 transition-colors">
            Tap anywhere to skip • 3.5s
          </span>
        </div>

        {/* Center: Rigid Non-Rotating BioTrajectory Logo & 3 Revolving Trajectory Orbits */}
        <div className="flex flex-col items-center justify-center my-auto z-10 relative">
          <motion.div
            initial={false}
            animate={
              isExiting
                ? {
                    scale: 0.85,
                    opacity: 0,
                    filter: 'blur(8px)',
                    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
                  }
                : {
                    scale: 1.0,
                    opacity: 1
                  }
            }
            className="relative flex items-center justify-center"
          >
            {/* Ethereal Ambient Radial Glow behind logo */}
            <motion.div
              animate={{
                scale: [1, 1.25, 1.05],
                opacity: [0.35, 0.65, 0.4]
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -inset-20 bg-gradient-to-tr from-cyan-400/25 via-teal-300/20 to-blue-400/25 rounded-full blur-3xl pointer-events-none"
            />

            {/* Orbit Ring 3 - Outer Gyroscopic Trajectory (Violet & Indigo Nodes) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 7.0, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[370px] h-[370px] sm:w-[490px] sm:h-[490px] md:w-[550px] md:h-[550px] rounded-full border border-dashed border-violet-400/30 pointer-events-none flex items-center justify-center"
            >
              {/* Diagonal 45-degree Satellite Track */}
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ transform: 'rotate(45deg)' }}
              >
                {/* North-East Violet Pearl */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-violet-500 shadow-[0_0_16px_rgba(139,92,246,0.95)]" />
                  <div className="absolute w-7 h-7 rounded-full bg-violet-400/25 animate-ping" />
                </div>
                {/* South-West Indigo Pearl */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.9)]" />
                </div>
              </div>
            </motion.div>

            {/* Orbit Ring 1 - Mid Trajectory with Cyan & Teal Nodes */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 5.0, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[310px] h-[310px] sm:w-[410px] sm:h-[410px] md:w-[460px] md:h-[460px] rounded-full border border-dashed border-cyan-400/35 pointer-events-none flex items-center justify-center"
            >
              {/* Cyan Trajectory Pearl */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-3.5 h-3.5 rounded-full bg-cyan-500 shadow-[0_0_14px_rgba(6,182,212,0.9)]" />
                <div className="absolute w-7 h-7 rounded-full bg-cyan-400/25 animate-ping" />
              </div>
              {/* Teal Trajectory Pearl */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-teal-500 shadow-[0_0_12px_rgba(20,184,166,0.85)]" />
              </div>
            </motion.div>

            {/* Orbit Ring 2 - Inner Dotted Trajectory with Blue & Emerald Nodes */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6.0, repeat: Infinity, ease: 'linear' }}
              className="absolute w-[250px] h-[250px] sm:w-[330px] sm:h-[330px] md:w-[370px] md:h-[370px] rounded-full border border-dotted border-blue-400/30 pointer-events-none flex items-center justify-center"
            >
              {/* Blue Trajectory Bead */}
              <div className="absolute top-1/2 -right-2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.85)]" />
                <div className="absolute w-6 h-6 rounded-full bg-blue-400/20 animate-ping" />
              </div>
              {/* Emerald Trajectory Bead */}
              <div className="absolute top-1/2 -left-2 -translate-y-1/2 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.85)]" />
              </div>
            </motion.div>

            {/* Floating Ambient Bio-Data Beacons */}
            {[
              { x: -140, y: -80, delay: 0.1, color: 'bg-cyan-500' },
              { x: 140, y: -70, delay: 0.5, color: 'bg-teal-500' },
              { x: -130, y: 85, delay: 0.3, color: 'bg-blue-500' },
              { x: 135, y: 75, delay: 0.7, color: 'bg-emerald-500' }
            ].map((pt, i) => (
              <motion.div
                key={`particle-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 0.85, 0.4, 0.85, 0],
                  scale: [0.6, 1.3, 0.9, 1.2, 0.6],
                  y: [pt.y, pt.y - 12, pt.y + 6, pt.y]
                }}
                transition={{
                  duration: 2.8,
                  delay: pt.delay,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className={`absolute w-2 h-2 rounded-full ${pt.color} shadow-sm pointer-events-none hidden sm:block`}
                style={{
                  transform: `translate(${pt.x}px, ${pt.y}px)`
                }}
              />
            ))}

            {/* Logo Image with multiply blend mode & radial feather mask so all photo borders are completely mashed and invisible */}
            <div className="relative max-w-[280px] sm:max-w-[370px] md:max-w-[420px] mx-auto flex items-center justify-center">
              <img
                src="/biotrajectory-logo.png"
                alt="BioTrajectory - Track Today. Prevent Tomorrow."
                className="w-full h-auto object-contain select-none relative z-10"
                style={{
                  mixBlendMode: 'multiply',
                  WebkitMaskImage: 'radial-gradient(circle at center, black 65%, transparent 100%)',
                  maskImage: 'radial-gradient(circle at center, black 65%, transparent 100%)'
                }}
                draggable={false}
              />

              {/* Primary Luminous Light Ribbon Sweep across emblem */}
              <motion.div
                initial={{ x: '-160%', opacity: 0 }}
                animate={{ x: '260%', opacity: [0, 0.65, 0] }}
                transition={{
                  duration: 1.6,
                  delay: 0.6,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="absolute inset-y-0 w-40 bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent transform -skew-x-25 pointer-events-none z-20"
              />

              {/* Secondary Refractive Light Shimmer Sweep */}
              <motion.div
                initial={{ x: '260%', opacity: 0 }}
                animate={{ x: '-160%', opacity: [0, 0.35, 0] }}
                transition={{
                  duration: 1.4,
                  delay: 1.6,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-teal-300/25 to-transparent transform skew-x-20 pointer-events-none z-20"
              />
            </div>
          </motion.div>
        </div>

        {/* Clean Balanced Bottom Spacer */}
        <div className="w-full h-6 pointer-events-none" />
      </motion.div>
    </AnimatePresence>
  );
}
