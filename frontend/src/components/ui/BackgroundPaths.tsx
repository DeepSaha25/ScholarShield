import React from 'react';
import { motion } from 'framer-motion';

interface BackgroundPathsProps {
  className?: string;
}

export function BackgroundPaths({ className = '' }: BackgroundPathsProps) {
  // Generate 24 elegant cryptographic flowing curves
  const paths = Array.from({ length: 24 }, (_, i) => {
    const yStart = 60 + i * 28;
    const yOffset = ((i % 2 === 0 ? 1 : -1) * (i * 12)) + 50;
    return {
      id: i,
      d: `M -100 ${yStart} C 300 ${yStart + yOffset}, 600 ${yStart - yOffset}, 1300 ${yStart + yOffset / 2}`,
      strokeWidth: (i % 3 === 0 ? 1.5 : 0.8),
      opacity: 0.12 + (i % 4) * 0.04,
      duration: 18 + (i % 6) * 4,
      delay: (i % 5) * 0.7,
    };
  });

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Ambient Radial Spotlight */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-emerald-300/25 via-emerald-100/30 to-transparent blur-3xl rounded-full -z-10 animate-pulse-slow" />
      
      <svg
        className="w-full h-full object-cover"
        viewBox="0 0 1200 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((p) => (
          <motion.path
            key={p.id}
            d={p.d}
            stroke="#10b981"
            strokeWidth={p.strokeWidth}
            strokeOpacity={p.opacity}
            strokeDasharray="6 8"
            initial={{ pathOffset: 0 }}
            animate={{ pathOffset: [0, 1] }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
              delay: p.delay,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export default BackgroundPaths;
