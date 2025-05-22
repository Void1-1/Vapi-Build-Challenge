import React, { useState, useEffect } from "react";

interface ClockProps {
  isEmergency?: boolean;
}

const Clock: React.FC<ClockProps> = ({ isEmergency = false }) => {
  const [now, setNow] = useState<Date | null>(null);
  const [angle, setAngle] = useState(0);
  const [pulseState, setPulseState] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setAngle((prevAngle) => (prevAngle + 0.2) % 360);
    }, 50);
    return () => clearInterval(rotateInterval);
  }, []);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseState((prevState) => (prevState + 1) % 100);
    }, 1000);
    return () => clearInterval(pulseInterval);
  }, []);

  if (!now) return null;

  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dateString = now.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const pulseOpacity = 0.8 + Math.sin(pulseState * 0.063) * 0.2;

  // Define colors conditionally:
  const primaryColor = isEmergency ? "#ff4d4d" : "#00f2ff"; // red or cyan
  const primaryColorLight = isEmergency ? "#ff9999" : "#80e5ff";
  const primaryGradientStart = isEmergency ? "#ff4d4d" : "#00f2ff";
  const primaryGradientEnd = isEmergency ? "#cc0000" : "#0066cc";
  const glowColor = isEmergency ? "#ff4d4d" : "#00f2ff";
  const backgroundFill = isEmergency
    ? "rgba(40, 0, 0, 0.75)"
    : "rgba(0, 10, 20, 0.75)";
  const strokeOpacity = isEmergency ? 0.7 : 0.4;

  return (
    <div className="fixed top-4 right-4 z-50 w-52 h-52 select-none">
      <div className="absolute inset-0 w-full h-full">
        <svg
          viewBox="0 0 200 200"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          <defs>
            <linearGradient
              id="hudGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={primaryGradientStart}
                stopOpacity="0.9"
              />
              <stop
                offset="100%"
                stopColor={primaryGradientEnd}
                stopOpacity="0.7"
              />
            </linearGradient>

            <filter id="hudGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feFlood
                floodColor={glowColor}
                floodOpacity="0.7"
                result="glow"
              />
              <feComposite
                in="glow"
                in2="blur"
                operator="in"
                result="softGlow"
              />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <clipPath id="hudShape">
              <path d="M100,10 L170,40 L190,100 L170,160 L100,190 L30,160 L10,100 L30,40 Z" />
            </clipPath>
          </defs>

          <path
            d="M100,10 L170,40 L190,100 L170,160 L100,190 L30,160 L10,100 L30,40 Z"
            fill={backgroundFill}
            stroke="url(#hudGradient)"
            strokeWidth="2"
            filter="url(#hudGlow)"
          />

          <path
            d="M100,30 L150,50 L160,100 L150,150 L100,170 L50,150 L40,100 L50,50 Z"
            fill="none"
            stroke={primaryColor}
            strokeWidth="0.5"
            strokeOpacity={strokeOpacity}
          />

          <circle
            cx="100"
            cy="100"
            r="60"
            fill="none"
            stroke={primaryColor}
            strokeWidth="0.5"
            strokeOpacity={0.3}
            strokeDasharray="4 6"
            transform={`rotate(${angle}, 100, 100)`}
          />

          <line
            x1="10"
            y1="100"
            x2="30"
            y2="100"
            stroke={primaryColor}
            strokeWidth="1"
            strokeOpacity="0.6"
          />
          <line
            x1="170"
            y1="100"
            x2="190"
            y2="100"
            stroke={primaryColor}
            strokeWidth="1"
            strokeOpacity="0.6"
          />
          <line
            x1="100"
            y1="10"
            x2="100"
            y2="30"
            stroke={primaryColor}
            strokeWidth="1"
            strokeOpacity="0.6"
          />
          <line
            x1="100"
            y1="170"
            x2="100"
            y2="190"
            stroke={primaryColor}
            strokeWidth="1"
            strokeOpacity="0.6"
          />

          <circle cx="30" cy="40" r="3" fill={primaryColor} fillOpacity="0.6" />
          <circle
            cx="170"
            cy="40"
            r="3"
            fill={primaryColor}
            fillOpacity="0.6"
          />
          <circle
            cx="170"
            cy="160"
            r="3"
            fill={primaryColor}
            fillOpacity="0.6"
          />
          <circle
            cx="30"
            cy="160"
            r="3"
            fill={primaryColor}
            fillOpacity="0.6"
          />

          <line
            x1="30"
            y1={100 + Math.sin(angle * 0.05) * 50}
            x2="170"
            y2={100 + Math.sin(angle * 0.05) * 50}
            stroke={primaryColor}
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
        </svg>
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
        <div className="w-full relative">
          <div className="relative mb-2">
            <div
              className="text-[10px] mb-1 tracking-wider opacity-90 uppercase"
              style={{ color: primaryColorLight }}
            >
              TIME
            </div>
            <div
              className="text-2xl font-mono font-bold tracking-wider bg-clip-text"
              style={{
                color: `rgba(${
                  isEmergency ? "255, 77, 77" : "0, 242, 255"
                }, ${pulseOpacity})`,
                textShadow: `0 0 8px rgba(${
                  isEmergency ? "255, 77, 77" : "0, 242, 255"
                }, ${pulseOpacity * 0.5})`,
                transition: "color 0.3s, text-shadow 0.3s",
              }}
            >
              {timeString}
            </div>

            <div
              className="w-full h-[1px] bg-gradient-to-r"
              style={{
                backgroundImage: isEmergency
                  ? "linear-gradient(to right, transparent, #ff4d4d, transparent)"
                  : "linear-gradient(to right, transparent, #00f2ff, transparent)",
                opacity: 0.6,
              }}
            ></div>
          </div>

          <div className="relative mt-2">
            <div
              className="text-[10px] mb-1 tracking-wider opacity-90 uppercase"
              style={{ color: primaryColorLight }}
            >
              DATE
            </div>
            <div
              className="text-sm font-mono tracking-wider"
              style={{
                color: primaryColorLight,
                textShadow: `0 0 5px ${glowColor}66`,
              }}
            >
              {dateString}
            </div>
          </div>
        </div>

        <div className="absolute bottom-9 left-0 right-0 flex justify-center">
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  backgroundColor: `rgba(${
                    isEmergency ? "255, 77, 77" : "0, 242, 255"
                  }, ${0.4 + (i === pulseState % 3 ? 0.6 : 0)})`,
                  boxShadow: `0 0 4px rgba(${
                    isEmergency ? "255, 77, 77" : "0, 242, 255"
                  }, ${i === pulseState % 3 ? 0.8 : 0.2})`,
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
