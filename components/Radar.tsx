'use client'

import React, { useEffect, useState } from 'react';

interface RadarProps {
  isEmergency?: boolean
}

const generateBlips = () => {
  const blips: { id: number; angle: number; distance: number; label: string; pulse: number; }[] = [];
  const minDistance = 15;
  const maxTries = 20;

  for (let i = 0; i < 5; i++) {
    let tries = 0;
    let placed = false;

    while (!placed && tries < maxTries) {
      const angle = Math.random() * 360;
      const distance = 30 + Math.random() * 60;
      const pulse = Math.random() * Math.PI * 2;
      const label = ['Civilian', 'Civilian', 'Police', 'Civilian'][Math.floor(Math.random() * 4)];

      const rad = (angle * Math.PI) / 180;
      const x = 100 + distance * Math.cos(rad);
      const y = 100 + distance * Math.sin(rad);

      const tooClose = blips.some(({ angle: a2, distance: d2 }) => {
        const rad2 = (a2 * Math.PI) / 180;
        const x2 = 100 + d2 * Math.cos(rad2);
        const y2 = 100 + d2 * Math.sin(rad2);
        const dx = x - x2;
        const dy = y - y2;
        return Math.sqrt(dx * dx + dy * dy) < minDistance;
      });

      if (!tooClose) {
        blips.push({ id: i, angle, distance, label, pulse });
        placed = true;
      }

      tries++;
    }
  }

  return blips;
};

const Radar: React.FC<RadarProps> = ({ isEmergency = false }) => {
  const [mounted, setMounted] = useState(false);
  const [sweepAngle, setSweepAngle] = useState(0);
  const [blips, setBlips] = useState(generateBlips());

  useEffect(() => {
    const sweep = setInterval(() => {
      setSweepAngle(prev => (prev + 1.5) % 360);
    }, 30);
    return () => clearInterval(sweep);
  }, []);

  useEffect(() => {
    const refresh = setInterval(() => {
      setBlips(generateBlips());
    }, 50000);
    return () => clearInterval(refresh);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 w-64 h-64 select-none">
      <svg viewBox="0 0 200 200" width="100%" height="100%">
        <defs>
          {/* Cyan Sweep */}
          <radialGradient id="sweepGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ffff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
          </radialGradient>

          {/* Red Sweep */}
          <radialGradient id="sweepGradientRed" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff4b4b" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ff4b4b" stopOpacity="0" />
          </radialGradient>

          {/* Cyan Glow */}
          <filter id="glow-cyan">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Red Emergency Glow */}
          <filter id="glow-red">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="radarClip">
            <circle cx="100" cy="100" r="90" />
          </clipPath>
        </defs>

        {/* Radar Base */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="rgba(0,10,20,0.75)"
            stroke={isEmergency ? "#ff4b4b" : "#00f2ff"}
            strokeWidth="1"
          />

          {/* Radar Circles */}
          {[1, 2, 3].map(r => (
            <circle
              key={r}
              cx="100"
              cy="100"
              r={r * 25}
              stroke={isEmergency ? "#ff4b4b" : "#00f2ff"}
              strokeOpacity="0.2"
              strokeWidth="0.5"
              fill="none"
          />
          ))}

          {/* Radar Spokes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
            <line
              key={a}
              x1="100"
              y1="100"
              x2={100 + 90 * Math.cos((a * Math.PI) / 180)}
              y2={100 + 90 * Math.sin((a * Math.PI) / 180)}
              stroke={isEmergency ? "#ff4b4b" : "#00f2ff"}
              strokeOpacity="0.1"
              strokeWidth="0.5"
          />
          ))}

        {/* Sweep */}
        <g transform={`rotate(${sweepAngle}, 100, 100)`}>
          <path
            d="M100,100 L190,100 A90,90 0 0,1 100,190 Z"
            fill={`url(#${isEmergency ? 'sweepGradientRed' : 'sweepGradient'})`}
            filter={`url(#${isEmergency ? 'glow-red' : 'glow'})`}
          />
        </g>

        {/* Clipped Blips & Labels */}
        <g clipPath="url(#radarClip)">
          {blips.map(({ id, angle, distance, label, pulse }) => {
            const rad = (angle * Math.PI) / 180;
            const x = 100 + distance * Math.cos(rad);
            const y = 100 + distance * Math.sin(rad);
            const opacity = 0.4 + Math.sin(pulse + sweepAngle * 0.1) * 0.3;

            const isPolice = label === "Police";
            const blipColor = isEmergency && isPolice ? "#ff4b4b" : "#00f2ff";
            const filter = isEmergency && isPolice ? "url(#glow-red)" : "url(#glow)";

            return (
              <g key={id}>
                <circle
                  cx={x}
                  cy={y}
                  r="3"
                  fill={blipColor}
                  fillOpacity={opacity}
                  filter={filter}
                />
                <text
                  x={x + 6}
                  y={y + 4}
                  fontSize="6"
                  fill={blipColor}
                  opacity="0.6"
                >
                  {label}
                </text>
              </g>
            );
          })};
        </g>
      </svg>
    </div>
  );
};

export default Radar;