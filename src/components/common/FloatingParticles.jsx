import React, { useMemo } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function FloatingParticles({ count = 16, className = '' }) {
  const { isDark } = useTheme();

  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: `${(i * 19 + 7) % 94}%`,
      top: `${(i * 23 + 11) % 90}%`,
      size: `${Math.max(3, (i % 4) * 2 + 3)}px`,
      duration: `${14 + (i % 8) * 3}s`,
      delay: `${(i % 5) * 1.8}s`,
      opacity: 0.25 + (i % 3) * 0.15
    }));
  }, [count]);

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity
          }}
          className={`absolute rounded-full animate-float-gentle transition-colors duration-500 ${
            isDark
              ? p.id % 2 === 0
                ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,217,255,0.6)]'
                : 'bg-blue-400 shadow-[0_0_8px_rgba(84,121,255,0.5)]'
              : p.id % 2 === 0
              ? 'bg-violet-500 shadow-[0_0_6px_rgba(124,58,237,0.4)]'
              : 'bg-indigo-400 shadow-[0_0_6px_rgba(99,102,241,0.3)]'
          }`}
        />
      ))}
    </div>
  );
}
