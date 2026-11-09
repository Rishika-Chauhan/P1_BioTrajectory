import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Activity, Heart, ShieldCheck, Zap } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function MedicalSphere3D() {
  const containerRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 8;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group for all sphere elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Inner Glowing Wireframe Sphere
    const innerGeo = new THREE.IcosahedronGeometry(2.2, 3);
    const innerMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x00d9ff : 0x008fae,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.35 : 0.25
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerSphere);

    // 2. Outer Core Nodes (Points)
    const pointsGeo = new THREE.IcosahedronGeometry(2.35, 4);
    const pointsMat = new THREE.PointsMaterial({
      color: isDark ? 0x5479ff : 0x3b82f6,
      size: 0.05,
      transparent: true,
      opacity: 0.75
    });
    const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    mainGroup.add(pointsMesh);

    // 3. Orbital Trajectory Rings
    const createRing = (radius, tiltX, tiltY, colorHex) => {
      const curve = new THREE.EllipseCurve(
        0, 0,
        radius, radius * 0.95,
        0, 2 * Math.PI,
        false,
        0
      );
      const points = curve.getPoints(90);
      const ringGeo = new THREE.BufferGeometry().setFromPoints(points.map(p => new THREE.Vector3(p.x, p.y, 0)));
      const ringMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: isDark ? 0.45 : 0.3
      });
      const ring = new THREE.Line(ringGeo, ringMat);
      ring.rotation.x = tiltX;
      ring.rotation.y = tiltY;
      return ring;
    };

    const ring1 = createRing(3.2, Math.PI / 3, Math.PI / 6, isDark ? 0x00d9ff : 0x008fae);
    const ring2 = createRing(3.6, -Math.PI / 4, Math.PI / 4, isDark ? 0x5479ff : 0x3b82f6);
    mainGroup.add(ring1);
    mainGroup.add(ring2);

    // 4. Ambient Connected Particles Cloud
    const particleCount = 200;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2.4 + Math.random() * 2.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i + 2] = radius * Math.cos(phi);
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particlesMat = new THREE.PointsMaterial({
      color: isDark ? 0x00d9ff : 0x008fae,
      size: 0.04,
      transparent: true,
      opacity: 0.65
    });
    const particleCloud = new THREE.Points(particlesGeo, particlesMat);
    mainGroup.add(particleCloud);

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = x * 0.5;
      mouseY = y * 0.5;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      mainGroup.rotation.y = elapsedTime * 0.15 + targetX;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.15 + targetY;

      ring1.rotation.z = elapsedTime * 0.2;
      ring2.rotation.z = -elapsedTime * 0.18;

      innerSphere.rotation.y = -elapsedTime * 0.1;
      particleCloud.rotation.y = elapsedTime * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDark]);

  return (
    <div className="relative w-full h-[450px] md:h-[550px] flex items-center justify-center select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Cyan/Blue Radial Glow Backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-72 h-72 rounded-full bg-cyan-400/20 blur-[100px] pointer-events-none animate-pulse-glow" />
        <div className="w-64 h-64 rounded-full bg-blue-500/20 blur-[90px] pointer-events-none -ml-20 -mt-16" />
      </div>

      {/* Floating Animated Data Cards Around Sphere */}
      {/* Card 1: Systolic Trajectory */}
      <div className="absolute -top-2 left-2 md:left-6 z-10 glass-panel p-3.5 rounded-2xl shadow-xl border border-cyan-500/30 animate-bounce duration-1000 max-w-[210px] transform hover:scale-105 transition-transform backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
            <Heart className="w-5 h-5 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Systolic Baseline</p>
            <p className="text-base font-bold text-cyan-300">121 <span className="text-xs font-normal text-slate-400">mmHg</span></p>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
          Optimal Baseline
        </div>
      </div>

      {/* Card 2: Longitudinal Stability */}
      <div className="absolute -bottom-4 right-2 md:right-8 z-10 glass-panel p-3.5 rounded-2xl shadow-xl border border-blue-500/30 max-w-[220px] transform hover:scale-105 transition-transform backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-400/40 flex items-center justify-center text-blue-400">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Trajectory Index</p>
            <p className="text-base font-bold text-blue-300">Homeostasis</p>
          </div>
        </div>
        <p className="mt-1.5 text-[11px] text-slate-300 font-light leading-snug">
          Multi-signal longitudinal stability verified across 30 days.
        </p>
      </div>

      {/* Card 3: Optical Strip Integrity */}
      <div className="hidden sm:flex absolute top-1/2 -right-4 z-10 glass-panel px-3.5 py-2.5 rounded-xl border border-white/10 items-center gap-2.5 shadow-lg backdrop-blur-md">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="text-left">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Urine Protein</p>
          <p className="text-xs font-bold text-emerald-400">Negative (0 mg/dL)</p>
        </div>
      </div>

      {/* Card 4: Resting Pulse */}
      <div className="hidden sm:flex absolute bottom-8 left-4 z-10 glass-panel px-3.5 py-2.5 rounded-xl border border-white/10 items-center gap-2.5 shadow-lg backdrop-blur-md">
        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
          <Zap className="w-4 h-4" />
        </div>
        <div className="text-left">
          <p className="text-[10px] text-slate-400 uppercase font-semibold">Resting Pulse</p>
          <p className="text-xs font-bold text-cyan-300">68 BPM</p>
        </div>
      </div>
    </div>
  );
}
