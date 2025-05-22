"use client";

import React, { useState, useEffect } from "react";
import { CpuIcon, HardDriveIcon, ZapIcon } from "lucide-react";

interface PowerProps {
  isEmergency?: boolean;
}

// --- Utility Functions ---
const calculateStrokeDasharray = (
  percentage: number,
  circumference: number
): number => (percentage / 100) * circumference;

const generateColorByUsage = (percentage: number): string => {
  if (percentage < 50) {
    const red = Math.floor((percentage / 50) * 255);
    return `rgb(${red}, 255, 0)`;
  } else {
    const green = Math.floor(((100 - percentage) / 50) * 255);
    return `rgb(255, ${green}, 0)`;
  }
};

// --- Main Component ---
export default function PowerRings({ isEmergency = false }: PowerProps) {
  const [cpu, setCpu] = useState(0);
  const [memory, setMemory] = useState(0);
  const [power, setPower] = useState(0);
  const [angle, setAngle] = useState(0);
  const [pulse, setPulse] = useState(0);
  const [tooltip, setTooltip] = useState<null | "cpu" | "memory" | "power">(
    null
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 100));
      setMemory(Math.floor(Math.random() * 100));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!navigator.getBattery) return; // API unsupported

    let battery: BatteryManager;

    const cleanup = () => {
      if (battery) {
        battery.removeEventListener("levelchange", updatePower);
      }
    };

    const updatePower = () => setPower(Math.round(battery.level * 100));

    navigator.getBattery().then((bat: BatteryManager) => {
      battery = bat;
      updatePower();
      battery.addEventListener("levelchange", updatePower);
    });

    return cleanup;
  }, []);

  useEffect(() => {
    const rotation = setInterval(() => setAngle((a) => (a + 0.3) % 360), 50);
    const pulseAnim = setInterval(() => setPulse((p) => (p + 1) % 100), 30);
    return () => {
      clearInterval(rotation);
      clearInterval(pulseAnim);
    };
  }, []);

  const cpuCirc = 2 * Math.PI * 70;
  const memCirc = 2 * Math.PI * 58;
  const powerCirc = 2 * Math.PI * 46;
  const pulseOpacity = 0.7 + Math.sin(pulse * 0.063) * 0.3;

  return (
    <div className="fixed bottom-4 left-[270px] w-[180px] h-[180px] z-50 select-none">
      <div className="relative w-full h-full">
        {/* --- SVG Rings --- */}
        <svg width="180" height="180" viewBox="0 0 180 180">
          <defs>
            <linearGradient
              id="cpuGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={generateColorByUsage(cpu)} />
              <stop
                offset="100%"
                stopColor={generateColorByUsage(cpu)}
                stopOpacity="0.5"
              />
            </linearGradient>
            <linearGradient
              id="memoryGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#00f2ff" />
              <stop offset="100%" stopColor="#0066cc" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient
              id="powerGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#a64dff" />
              <stop offset="100%" stopColor="#6600cc" stopOpacity="0.5" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feFlood
                floodColor="#00f2ff"
                floodOpacity="0.7"
                result="glowColor"
              />
              <feComposite
                in="glowColor"
                in2="blur"
                operator="in"
                result="softGlow"
              />
              <feMerge>
                <feMergeNode in="softGlow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r="85"
            fill={isEmergency ? "rgba(30, 0, 0, 0.6)" : "rgba(0, 10, 20, 0.6)"}
            stroke={isEmergency ? "#ff4d4d" : "#00f2ff"}
            strokeOpacity="0.3"
            strokeWidth="1"
          />
          {/* CPU Ring */}
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke="#172b3a"
            strokeWidth="4"
            strokeOpacity="0.5"
          />
          <circle
            cx="90"
            cy="90"
            r="70"
            fill="none"
            stroke="url(#cpuGradient)"
            strokeWidth="4"
            strokeDasharray={`${calculateStrokeDasharray(
              cpu,
              cpuCirc
            )} ${cpuCirc}`}
            strokeLinecap="round"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "center",
              transition: "stroke-dasharray 0.5s ease-in-out",
            }}
            filter="url(#glow)"
          />

          {/* Memory Ring */}
          <circle
            cx="90"
            cy="90"
            r="58"
            fill="none"
            stroke="#172b3a"
            strokeWidth="4"
            strokeOpacity="0.5"
          />
          <circle
            cx="90"
            cy="90"
            r="58"
            fill="none"
            stroke="url(#memoryGradient)"
            strokeWidth="4"
            strokeDasharray={`${calculateStrokeDasharray(
              memory,
              memCirc
            )} ${memCirc}`}
            strokeLinecap="round"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "center",
              transition: "stroke-dasharray 0.5s ease-in-out",
            }}
            filter="url(#glow)"
          />

          {/* Power Ring */}
          <circle
            cx="90"
            cy="90"
            r="46"
            fill="none"
            stroke="#172b3a"
            strokeWidth="4"
            strokeOpacity="0.5"
          />
          <circle
            cx="90"
            cy="90"
            r="46"
            fill="none"
            stroke="url(#powerGradient)"
            strokeWidth="4"
            strokeDasharray={`${calculateStrokeDasharray(
              power,
              powerCirc
            )} ${powerCirc}`}
            strokeLinecap="round"
            style={{
              transform: "rotate(-90deg)",
              transformOrigin: "center",
              transition: "stroke-dasharray 0.5s ease-in-out",
            }}
            filter="url(#glow)"
          />

          {/* Rotating scan line */}
          <line
            x1="90"
            y1="90"
            x2="90"
            y2="30"
            stroke="#00f2ff"
            strokeWidth="1"
            strokeOpacity={pulseOpacity}
            transform={`rotate(${angle}, 90, 90)`}
          />
        </svg>

        {/* --- Ring Icons & Tooltips --- */}
        <HUDIcon
          position="top"
          icon={
            <CpuIcon size={16} color={isEmergency ? "#ff4d4d" : "#00f2ff"} />
          }
          tooltip={`CPU: ${cpu}%`}
          active={tooltip === "cpu"}
          onEnter={() => setTooltip("cpu")}
          onLeave={() => setTooltip(null)}
          emergency={isEmergency}
        />
        <HUDIcon
          position="right"
          icon={
            <HardDriveIcon
              size={16}
              color={isEmergency ? "#ff4d4d" : "#00f2ff"}
            />
          }
          tooltip={`Memory: ${memory}%`}
          active={tooltip === "memory"}
          onEnter={() => setTooltip("memory")}
          onLeave={() => setTooltip(null)}
          emergency={isEmergency}
        />
        <HUDIcon
          position="bottom"
          icon={
            <ZapIcon size={16} color={isEmergency ? "#ff4d4d" : "#00f2ff"} />
          }
          tooltip={`Power: ${power}%`}
          active={tooltip === "power"}
          onEnter={() => setTooltip("power")}
          onLeave={() => setTooltip(null)}
          emergency={isEmergency}
        />
      </div>
    </div>
  );
}

// --- HUD Icon Component ---
function HUDIcon({
  position,
  icon,
  tooltip,
  active,
  onEnter,
  onLeave,
  emergency,
}: {
  position: "top" | "right" | "bottom";
  icon: React.ReactNode;
  tooltip: string;
  active: boolean;
  onEnter: () => void;
  onLeave: () => void;
  emergency?: boolean;
}) {
  const positionStyles = {
    top: "top-[22px] left-1/2 -translate-x-1/2",
    right: "top-1/2 right-[22px] -translate-y-1/2",
    bottom: "bottom-[22px] left-1/2 -translate-x-1/2",
  };

  const tooltipPosition = {
    top: "-top-[30px] left-1/2 -translate-x-1/2",
    right: "-left-[75px] top-1/2 -translate-y-1/2",
    bottom: "-top-[30px] left-1/2 -translate-x-1/2",
  };

  return (
    <div
      className={`absolute ${
        positionStyles[position]
      } w-6 h-6 flex items-center justify-center 
        ${
          emergency
            ? "bg-[rgba(40,0,0,0.8)] shadow-[0_0_5px_rgba(255,77,77,0.5)]"
            : "bg-[rgba(0,10,20,0.8)] shadow-[0_0_5px_rgba(0,242,255,0.5)]"
        }
        rounded-full cursor-pointer`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {icon}
      {active && (
        <div
          className={`absolute ${tooltipPosition[position]} ${
            emergency
              ? "bg-[rgba(40,0,0,0.9)] text-[#ff4d4d] border-[rgba(255,77,77,0.4)] shadow-[0_0_10px_rgba(255,77,77,0.3)]"
              : "bg-[rgba(0,20,40,0.8)] text-[#00f2ff] border-[rgba(0,242,255,0.3)] shadow-[0_0_10px_rgba(0,242,255,0.2)]"
          } px-2.5 py-1.5 rounded text-xs whitespace-nowrap z-[100] pointer-events-none`}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
