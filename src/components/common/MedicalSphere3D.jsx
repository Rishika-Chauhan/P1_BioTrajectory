import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  Heart,
  Activity,
  ShieldCheck,
  Zap,
  TrendingDown,
  Sparkles,
  Calendar,
  Layers,
  Dna
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function MedicalSphere3D() {
  const containerRef = useRef(null);
  const { isDark } = useTheme();
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch (e) {
      setWebGlSupported(false);
      return;
    }

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

    // 1. Central Holographic Biological Core (Inner pulsating wireframe shell)
    const coreGeo = new THREE.SphereGeometry(1.25, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: primaryHex,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.28 : 0.35
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(coreSphere);

    // 2. Middle Anatomical Geodesic Lattice (Icosahedron)
    const latticeGeo = new THREE.IcosahedronGeometry(2.05, 2);
    const latticeMat = new THREE.MeshBasicMaterial({
      color: secondaryHex,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.32 : 0.4
    });
    const latticeMesh = new THREE.Mesh(latticeGeo, latticeMat);
    rootGroup.add(latticeMesh);

    // 3. Dense Biomarker Data Nodes (Points on icosahedral vertices)
    const nodesGeo = new THREE.IcosahedronGeometry(2.28, 3);
    const nodesMat = new THREE.PointsMaterial({
      color: primaryHex,
      size: isDark ? 0.06 : 0.075,
      transparent: true,
      opacity: isDark ? 0.85 : 0.95
    });
    const nodesMesh = new THREE.Points(nodesGeo, nodesMat);
    rootGroup.add(nodesMesh);

    // 4. Dynamic Synaptic / Neural Biometric Connecting Lines
    const nodePos = nodesGeo.attributes.position;
    const lineIndices = [];
    const nodeCount = nodePos.count;
    // Create connection pairs between proximate node vertices
    for (let i = 0; i < nodeCount; i += 3) {
      for (let j = i + 1; j < Math.min(i + 7, nodeCount); j++) {
        const v1 = new THREE.Vector3(nodePos.getX(i), nodePos.getY(i), nodePos.getZ(i));
        const v2 = new THREE.Vector3(nodePos.getX(j), nodePos.getY(j), nodePos.getZ(j));
        if (v1.distanceTo(v2) < 1.45) {
          lineIndices.push(v1.x, v1.y, v1.z, v2.x, v2.y, v2.z);
        }
      }
    }
    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineIndices, 3));
    const linesMat = new THREE.LineBasicMaterial({
      color: primaryHex,
      transparent: true,
      opacity: isDark ? 0.28 : 0.35,
      linewidth: 1
    });
    const connectingLines = new THREE.LineSegments(linesGeo, linesMat);
    rootGroup.add(connectingLines);

    // 5. Multiple Concentric Rotating Orbital Rings
    const createRing = (radiusX, radiusY, tiltX, tiltY, colorHex, opacityVal) => {
      const curve = new THREE.EllipseCurve(0, 0, radiusX, radiusY, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(140);
      const ringGeo = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, p.y, 0)));
      const ringMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: opacityVal,
        linewidth: 1.5
      });
      const ring = new THREE.Line(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      return ring;
    };

    const ring1 = createRing(3.1, 2.9, Math.PI / 3, Math.PI / 6, primaryHex, isDark ? 0.55 : 0.65);
    const ring2 = createRing(3.55, 3.2, -Math.PI / 3.8, Math.PI / 4, secondaryHex, isDark ? 0.45 : 0.55);
    const ring3 = createRing(2.65, 2.5, Math.PI / 2.2, -Math.PI / 5, accentHex, isDark ? 0.4 : 0.5);
    const ring4 = createRing(3.9, 3.7, Math.PI / 4.5, -Math.PI / 3.2, isDark ? 0x00d9ff : 0xa855f7, isDark ? 0.35 : 0.45);
    rootGroup.add(ring1);
    rootGroup.add(ring2);
    rootGroup.add(ring3);
    rootGroup.add(ring4);

    // 6. Orbiting Biomarker Data Node Beads with Pulse Glow
    const beadGeo = new THREE.SphereGeometry(0.085, 12, 12);
    const bead1 = new THREE.Mesh(beadGeo, new THREE.MeshBasicMaterial({ color: primaryHex }));
    const bead2 = new THREE.Mesh(beadGeo, new THREE.MeshBasicMaterial({ color: secondaryHex }));
    const bead3 = new THREE.Mesh(beadGeo, new THREE.MeshBasicMaterial({ color: accentHex }));
    ring1.add(bead1);
    ring2.add(bead2);
    ring3.add(bead3);

    // 7. Subtle Expanding Heartbeat Energy Pulses (Holographic Shockwave Rings)
    const createPulseRing = () => {
      const ringGeo = new THREE.RingGeometry(1.2, 1.25, 48);
      const ringMat = new THREE.MeshBasicMaterial({
        color: primaryHex,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(ringGeo, ringMat);
      mesh.rotation.x = Math.PI / 2.5;
      return mesh;
    };
    const pulseRing1 = createPulseRing();
    const pulseRing2 = createPulseRing();
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
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.45;
      mouseY = y * 0.45;
      setMouseOffset({ x: x * 15, y: y * 15 });
    };

    const handleMouseLeave = () => {
      mouseX = 0;
      mouseY = 0;
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
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = clock.getElapsedTime();
      const delta = prefersReducedMotion ? 0.005 : time;

      // Smooth mouse interpolation
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      rootGroup.rotation.y = delta * 0.18 + targetX;
      rootGroup.rotation.x = Math.sin(delta * 0.25) * 0.12 + targetY;

      // Orbiting light follows dynamic trajectory
      orbitingLight.position.x = Math.sin(delta * 0.8) * 4.5;
      orbitingLight.position.y = Math.cos(delta * 0.6) * 3.5;
      orbitingLight.position.z = Math.sin(delta * 0.5) * 4.0;

      // Rotate concentric rings in counter-orbits
      ring1.rotation.z = delta * 0.25;
      ring2.rotation.z = -delta * 0.22;
      ring3.rotation.z = delta * 0.15;
      ring4.rotation.z = -delta * 0.18;

      // Move beads along orbital path
      bead1.position.x = Math.cos(delta * 1.5) * 3.1;
      bead1.position.y = Math.sin(delta * 1.5) * 2.9;

      bead2.position.x = Math.cos(-delta * 1.2) * 3.55;
      bead2.position.y = Math.sin(-delta * 1.2) * 3.2;

      bead3.position.x = Math.sin(delta * 1.1) * 2.65;
      bead3.position.y = Math.cos(delta * 1.1) * 2.5;

      // Heartbeat pulse waves
      const pulse1 = (time * 0.55) % 1.0;
      pulseRing1.scale.setScalar(1.0 + pulse1 * 2.6);
      pulseRing1.material.opacity = Math.max(0, (1 - pulse1) * 0.45);

      const pulse2 = ((time * 0.55) + 0.5) % 1.0;
      pulseRing2.scale.setScalar(1.0 + pulse2 * 2.6);
      pulseRing2.material.opacity = Math.max(0, (1 - pulse2) * 0.45);

      // Subtle biological breath pulse in core sphere
      const breath = Math.sin(delta * 2.0) * 0.04;
      coreSphere.scale.setScalar(1.0 + breath);
      coreSphere.rotation.y = -delta * 0.15;

      // Neural lines pulsing opacity
      linesMat.opacity = (isDark ? 0.22 : 0.3) + Math.sin(delta * 3.0) * 0.12;

      particleCloud.rotation.y = delta * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Thorough WebGL disposal
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      coreGeo.dispose();
      coreMat.dispose();
      latticeGeo.dispose();
      latticeMat.dispose();
      nodesGeo.dispose();
      nodesMat.dispose();
      linesGeo.dispose();
      linesMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
      scene.clear();
    };
  }, [isDark]);

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
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Health Trajectory</p>
            <p className="text-base font-extrabold text-slate-900 dark:text-cyan-300">
              121 / 78 <span className="text-xs font-normal text-slate-500">mmHg</span>
            </p>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
          Optimal Baseline • Stable
        </div>
      </div>

      {/* 2. Biomarker Analysis (Top Right) */}
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
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">Biomarker Analysis</p>
          <p className="text-xs font-bold text-slate-900 dark:text-emerald-400">Kidney & Glucose Clear</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Cellular Homeostasis: 99.2%</p>
        </div>
      </div>

      {/* 3. Personal Baseline (Bottom Right) */}
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
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Personal Baseline</p>
            <p className="text-base font-extrabold text-slate-900 dark:text-blue-300">99.4% Stability</p>
          </div>
        </div>
        <p className="mt-2 text-[11px] text-slate-600 dark:text-slate-300 font-normal leading-snug">
          Multi-signal longitudinal stability verified across 30 days.
        </p>
      </div>

      {/* 4. AI Health Insights (Bottom Left) */}
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
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider">AI Health Insights</p>
          <p className="text-xs font-bold text-slate-900 dark:text-cyan-300">30-Day Trajectory Risk: Low (0.2%)</p>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Circadian rhythm in sync</p>
        </div>
      </div>

      {/* 5. Medical Timeline (Center Left Minimal Badge) */}
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
            Day 42 Active Timeline
          </span>
          <span className="text-[9px] text-slate-500 dark:text-slate-400 leading-none">
            Continuous trajectory stream
          </span>
        </div>
      </div>
    </div>
  );
}
