import React, { useEffect, useState } from 'react';

export default function AnimatedCounter({
  value,
  duration = 1000,
  formatter = (v) => v.toLocaleString()
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const num = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
    if (isNaN(num)) {
      setDisplayValue(value);
      return;
    }

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(num);
      return;
    }

    let startTimestamp = null;
    let frameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(num * ease);
      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(num);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return <span>{typeof displayValue === 'number' ? formatter(displayValue) : displayValue}</span>;
}
