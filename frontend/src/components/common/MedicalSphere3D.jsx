import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  Heart,
  Activity,
  ShieldCheck,
  Sparkles,
  Calendar
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function MedicalSphere3D() {
  const containerRef = useRef(null);
  const { isDark } = useTheme();
  const [webGlSupported] = useState(() => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch {
      return false;
    }
  });
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!webGlSupported) return;
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions
    let width = container.clientWidth || 550;
    let height = container.clientHeight || 550;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 7.6;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Root World Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // Color definitions:
    // Dark mode: Electric Cyan, Neon Blue, Teal
    // White theme: Rich Electric Violet, Vivid Amethyst Purple, Deep Iris/Indigo
    const primaryHex = isDark ? 0x00d9ff : 0x7c3aed;
    const secondaryHex = isDark ? 0x5479ff : 0x8b5cf6;
    const accentHex = isDark ? 0x14b8a6 : 0x6366f1;

    // Concentric Expanding Heartbeat Energy Pulses (Holographic White Shockwave Rings)
    const pulseGeo = new THREE.RingGeometry(1.6, 1.66, 64);
    const pulseMat1 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const pulseMat2 = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide
    });
    const pulseRing1 = new THREE.Mesh(pulseGeo, pulseMat1);
    const pulseRing2 = new THREE.Mesh(pulseGeo, pulseMat2);
    rootGroup.add(pulseRing1);
    rootGroup.add(pulseRing2);

    // 8. Floating Ambient Cloud of Circulating Biomarkers
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(primaryHex);
    const c2 = new THREE.Color(secondaryHex);
    const c3 = new THREE.Color(accentHex);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.3 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);

      const rand = Math.random();
      const mixed = rand < 0.45 ? c1 : rand < 0.8 ? c2 : c3;
      particleColors[i] = mixed.r;
      particleColors[i + 1] = mixed.g;
      particleColors[i + 2] = mixed.b;
    }

    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particlesGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particlesMat = new THREE.PointsMaterial({
      size: isDark ? 0.045 : 0.06,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.75 : 0.85
    });
    const particleCloud = new THREE.Points(particlesGeo, particlesMat);
    rootGroup.add(particleCloud);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.6 : 0.85);
    scene.add(ambientLight);
    const centralPointLight = new THREE.PointLight(primaryHex, isDark ? 2.2 : 2.8, 20);
    centralPointLight.position.set(0, 0, 0);
    scene.add(centralPointLight);

    const orbitingLight = new THREE.PointLight(secondaryHex, isDark ? 1.8 : 2.2, 18);
    scene.add(orbitingLight);

    if (!isDark) {
      const rimLight = new THREE.PointLight(0xa855f7, 1.8, 15);
      rimLight.position.set(-5, -3, -4);
      scene.add(rimLight);
    }

    // Mouse movement interaction & parallax
    const mousePos = { currentX: 0, currentY: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.currentX = x * 0.45;
      mousePos.currentY = y * 0.45;
      setMouseOffset({ x: x * 15, y: y * 15 });
    };

    const handleMouseLeave = () => {
      mousePos.currentX = 0;
      mousePos.currentY = 0;
      setMouseOffset({ x: 0, y: 0 });
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Responsive Resizing
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW === 0 || newH === 0) return;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    const startTime = performance.now();
    let isVisible = true;

    // Pause WebGL rendering loop when scrolled offscreen to conserve CPU & GPU
    let observer = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0.05 }
      );
      observer.observe(container);
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Skip render calculations when canvas is off-screen
      if (!isVisible) return;

      const time = (performance.now() - startTime) * 0.001;
      const delta = prefersReducedMotion ? 0.005 : time;

      // Smooth mouse interpolation
      mousePos.targetX += (mousePos.currentX - mousePos.targetX) * 0.04;
      mousePos.targetY += (mousePos.currentY - mousePos.targetY) * 0.04;

      rootGroup.rotation.y = delta * 0.18 + mousePos.targetX;
      rootGroup.rotation.x = Math.sin(delta * 0.25) * 0.12 + mousePos.targetY;

      // Orbiting light follows dynamic trajectory
      orbitingLight.position.x = Math.sin(delta * 0.8) * 4.5;
      orbitingLight.position.y = Math.cos(delta * 0.6) * 3.5;
      orbitingLight.position.z = Math.sin(delta * 0.5) * 4.0;

      // Heartbeat pulse waves
      const pulse1 = (time * 0.55) % 1.0;
      pulseRing1.scale.setScalar(1.0 + pulse1 * 2.2);
      pulseMat1.opacity = Math.max(0, (1 - pulse1) * (isDark ? 0.35 : 0.22));

      const pulse2 = ((time * 0.55) + 0.5) % 1.0;
      pulseRing2.scale.setScalar(1.0 + pulse2 * 2.2);
      pulseMat2.opacity = Math.max(0, (1 - pulse2) * (isDark ? 0.35 : 0.22));

      particleCloud.rotation.y = delta * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (observer) {
        observer.disconnect();
      }
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Thorough WebGL disposal
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      pulseGeo.dispose();
      pulseMat1.dispose();
      pulseMat2.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, [isDark, webGlSupported]);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center select-none overflow-visible">
      {/* 3D WebGL Canvas */}
      {webGlSupported ? (
        <div
          ref={containerRef}
          className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
        />
      ) : (
        /* 2.5D Fallback for environments without WebGL */
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 rounded-full border-2 border-dashed border-violet-500/40 dark:border-cyan-400/40 animate-spin duration-1000 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full border border-purple-500/50 dark:border-blue-400/50 animate-pulse flex items-center justify-center">
              <Activity className="w-16 h-16 text-violet-600 dark:text-cyan-400" />
            </div>
          </div>
        </div>
      )}

      {/* FIXED WHITE CIRCLES AROUND LOGO (Non-rotating, concentric, clinical precision system) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="relative flex items-center justify-center">

          {/* Circle 4: Outermost Fixed White Circle (Wide delicate orbital boundary) */}
          <div className="absolute w-[440px] h-[440px] sm:w-[480px] sm:h-[480px] md:w-[530px] md:h-[530px] rounded-full border border-dotted border-white dark:border-white/20 shadow-[0_0_0_1px_rgba(203,213,225,0.4)] dark:shadow-[0_0_35px_rgba(255,255,255,0.12)] pointer-events-none" />

          {/* Circle 3: Outer Fixed White Circle (Smooth circular halo) */}
          <div className="absolute w-[350px] h-[350px] sm:w-[380px] sm:h-[380px] md:w-[420px] md:h-[420px] rounded-full border border-white dark:border-white/35 shadow-[0_0_0_1px_rgba(203,213,225,0.5),0_4px_16px_rgba(0,0,0,0.03)] dark:shadow-[0_0_25px_rgba(255,255,255,0.2)] pointer-events-none" />

          {/* Circle 2: Mid Fixed White Circle (Fine dashed white ring with 4 fixed cardinal markers) */}
          <div className="absolute w-[260px] h-[260px] sm:w-[285px] sm:h-[285px] md:w-[315px] md:h-[315px] rounded-full border border-dashed border-white dark:border-white/60 shadow-[0_0_0_1px_rgba(203,213,225,0.6),0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_0_25px_rgba(255,255,255,0.35)] pointer-events-none flex items-center justify-center">
            {/* 4 Fixed Cardinal Markers for High-Precision Diagnostic Feel */}
            <div className="absolute -top-1 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1),0_0_0_1px_rgba(203,213,225,0.6)]" />
            <div className="absolute -bottom-1 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1),0_0_0_1px_rgba(203,213,225,0.6)]" />
            <div className="absolute -left-1 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1),0_0_0_1px_rgba(203,213,225,0.6)]" />
            <div className="absolute -right-1 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1),0_0_0_1px_rgba(203,213,225,0.6)]" />
          </div>

          {/* Circle 1: Inner Fixed White Circle (Solid bright white ring with subtle halo glow) */}
          <div className="absolute w-[180px] h-[180px] sm:w-[200px] sm:h-[200px] md:w-[220px] md:h-[220px] rounded-full border-2 border-white dark:border-white shadow-[0_0_0_1px_rgba(203,213,225,0.7),0_4px_24px_rgba(6,182,212,0.18)] dark:shadow-[0_0_30px_rgba(255,255,255,0.5),inset_0_0_15px_rgba(255,255,255,0.25)] bg-white/20 dark:bg-white/5 backdrop-blur-xs pointer-events-none" />

          {/* Central Fixed White Circular Badge directly embracing the Emblem */}
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full bg-white dark:bg-slate-900/90 shadow-[0_6px_35px_rgba(6,182,212,0.22),0_0_0_2px_rgba(255,255,255,1)] dark:shadow-[0_0_35px_rgba(255,255,255,0.28),0_0_0_2px_rgba(255,255,255,0.85)] border-2 border-white flex items-center justify-center p-3 z-10">
            {/* Ambient Radial Color Bloom Behind Logo */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-400/20 via-teal-300/15 to-blue-500/20 blur-md pointer-events-none" />

            {/* Rigid Emblem Image: perfectly stationary & upright */}
            <img
              src="/biotrajectory-emblem.png"
              alt="BioTrajectory"
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 object-contain select-none relative z-10"
              draggable={false}
            />
          </div>

        </div>
      </div>

      {/* Floating Ambient Glow Behind Sphere */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-80 h-80 rounded-full bg-violet-400/20 dark:bg-cyan-400/20 blur-[110px] pointer-events-none animate-pulse-glow" />
        <div className="w-72 h-72 rounded-full bg-purple-500/15 dark:bg-blue-500/20 blur-[100px] pointer-events-none -ml-24 -mt-20" />
      </div>

      {/* 5 FLOATING GLASSMORPHIC HEALTH DATA CARDS */}

      {/* 1. Health Trajectory (Top Left) */}
      <div
        style={{
          transform: `translate3d(${mouseOffset.x * -0.7}px, ${mouseOffset.y * -0.7}px, 0)`
        }}
        className="absolute -top-3 left-0 md:left-2 z-10 glass-card p-4 rounded-2xl shadow-xl border border-violet-500/25 dark:border-cyan-500/30 max-w-[215px] animate-float-gentle transition-transform duration-200 ease-out hover:scale-105"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 dark:bg-cyan-500/15 border border-violet-500/25 dark:border-cyan-400/35 flex items-center justify-center text-violet-600 dark:text-cyan-400 shrink-0">
            <Heart className="w-5 h-5 text-violet-600 dark:text-cyan-400 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Blood Pressure</p>
            <p className="text-base font-extrabold text-slate-900 dark:text-cyan-300">
              121 / 78 <span className="text-xs font-normal text-slate-500">mmHg</span>
            </p>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
          Healthy & Normal • Steady
        </div>
      </div>

      {/* 2. Health Check (Top Right) */}
      <div
        style={{
          transform: `translate3d(${mouseOffset.x * 0.8}px, ${mouseOffset.y * 0.8}px, 0)`
        }}
        className="hidden sm:flex absolute top-10 -right-2 md:right-2 z-10 glass-card px-4 py-3 rounded-2xl border border-emerald-500/30 items-center gap-3 shadow-xl max-w-[230px] animate-float-delayed transition-transform duration-200 ease-out hover:scale-105"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Health Check</p>
          <p className="text-xs font-bold text-slate-900 dark:text-emerald-400">Kidney & Sugar Normal</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Overall Body Balance: 99.2%</p>
        </div>
      </div>

      {/* 3. Your Normal Range (Bottom Right) */}
      <div
        style={{
          transform: `translate3d(${mouseOffset.x * 0.6}px, ${mouseOffset.y * 0.6}px, 0)`
        }}
        className="absolute -bottom-3 right-0 md:right-2 z-10 glass-card p-4 rounded-2xl shadow-xl border border-purple-500/25 dark:border-blue-500/30 max-w-[230px] animate-float-delayed transition-transform duration-200 ease-out hover:scale-105"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-blue-500/15 border border-purple-500/25 dark:border-blue-400/35 flex items-center justify-center text-purple-600 dark:text-blue-400 shrink-0">
            <Activity className="w-5 h-5 text-purple-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Your Normal Range</p>
            <p className="text-base font-extrabold text-slate-900 dark:text-blue-300">99.4% Steady</p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-snug">
          Your daily health readings have stayed steady and healthy over 30 days.
        </p>
      </div>

      {/* 4. Understand Your Results (Bottom Left) */}
      <div
        style={{
          transform: `translate3d(${mouseOffset.x * -0.8}px, ${mouseOffset.y * -0.8}px, 0)`
        }}
        className="hidden sm:flex absolute bottom-8 left-2 md:left-4 z-10 glass-card px-4 py-3 rounded-2xl border border-violet-500/25 dark:border-cyan-500/30 items-center gap-3 shadow-xl max-w-[235px] animate-float-gentle transition-transform duration-200 ease-out hover:scale-105"
      >
        <div className="w-9 h-9 rounded-xl bg-violet-500/10 dark:bg-cyan-500/15 text-violet-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="text-left">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Understand Your Results</p>
          <p className="text-xs font-bold text-slate-900 dark:text-cyan-300">30-Day Health Risk: Very Low (0.2%)</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Sleep & daily rhythm in sync</p>
        </div>
      </div>

      {/* 5. Daily Record (Center Left Minimal Badge) */}
      <div
        style={{
          transform: `translate3d(${mouseOffset.x * -1.1}px, ${mouseOffset.y * -1.1}px, 0)`
        }}
        className="hidden md:flex absolute top-1/2 -left-8 -translate-y-1/2 z-10 glass-card px-3.5 py-2.5 rounded-xl border border-indigo-500/30 items-center gap-2.5 shadow-lg transition-transform duration-200 ease-out hover:scale-105"
      >
        <div className="w-7 h-7 rounded-lg bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 flex items-center justify-center shrink-0">
          <Calendar className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block leading-tight">
            Day 42 Daily Record
          </span>
          <span className="text-[9px] text-slate-500 dark:text-slate-400 leading-none">
            Daily check-ups recorded
          </span>
        </div>
      </div>
    </div>
  );
}
