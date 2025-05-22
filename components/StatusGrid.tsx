"use client";

import { useEffect, useState } from "react";

interface StatusGridProps {
  isEmergency: boolean;
}

type StatusItem = {
  id: string;
  label: string;
  value: number;
  unit: string;
  status: "normal" | "warning" | "critical";
  category: "system" | "environment" | "security" | "mission";
};

export default function StatusGrid({ isEmergency }: StatusGridProps) {
  const [statusItems, setStatusItems] = useState<StatusItem[]>([]);
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);

  useEffect(() => {
    if (statusItems.length === 0) {
      setStatusItems([
        {
          id: "memory",
          label: "MEMORY",
          value: 48,
          unit: "%",
          status: "normal",
          category: "system",
        },
        {
          id: "network",
          label: "NETWORK",
          value: 87,
          unit: "Mbps",
          status: "normal",
          category: "system",
        },
        {
          id: "temp",
          label: "TEMPERATURE",
          value: 24,
          unit: "°C",
          status: "normal",
          category: "environment",
        },
        {
          id: "shield",
          label: "SHIELD",
          value: 99,
          unit: "%",
          status: "normal",
          category: "security",
        },
        {
          id: "threat",
          label: "THREAT LEVEL",
          value: 12,
          unit: "",
          status: "normal",
          category: "security",
        },
        {
          id: "comms",
          label: "COMMS SIGNAL",
          value: 92,
          unit: "%",
          status: "normal",
          category: "system",
        },
      ]);
    }
  }, [statusItems.length]);

  useEffect(() => {
    if (statusItems.length > 0) {
      setStatusItems((prev) =>
        prev.map((item) => {
          if (item.id === "threat") {
            return {
              ...item,
              value: isEmergency ? 84 : 12,
              status: isEmergency ? "critical" : "normal",
            };
          }
          if (item.id === "comms") {
            return {
              ...item,
              value: isEmergency ? 46 : 92,
              status: isEmergency ? "warning" : "normal",
            };
          }
          return item;
        })
      );
    }
  }, [isEmergency, statusItems.length]);

  useEffect(() => {
    if (statusItems.length === 0) return;

    const interval = setInterval(() => {
      setStatusItems((prev) =>
        prev.map((item) => {
          if (item.id === "threat" || item.id === "comms") return item;

          let newValue = item.value + (Math.random() * 6 - 3);

          if (item.unit === "%")
            newValue = Math.max(0, Math.min(100, newValue));
          else if (item.id === "temp")
            newValue = Math.max(20, Math.min(35, newValue));
          else if (item.id === "network")
            newValue = Math.max(50, Math.min(120, newValue));

          let status: "normal" | "warning" | "critical" = "normal";

          if (item.id === "memory") {
            if (newValue > 95) status = "critical";
            else if (newValue > 85) status = "warning";
          }
          if (item.id === "temp") {
            if (newValue > 33) status = "critical";
            else if (newValue > 30) status = "warning";
          }

          return {
            ...item,
            value: Math.round(newValue * 10) / 10,
            status,
          };
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [statusItems.length]);

  useEffect(() => {
    if (statusItems.length === 0) return;

    const highlightInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomIndex = Math.floor(Math.random() * statusItems.length);
        const randomId = statusItems[randomIndex]?.id || null;
        setHighlightedItem(randomId);
        setTimeout(() => setHighlightedItem(null), 700);
      }
    }, 2000);

    return () => clearInterval(highlightInterval);
  }, [statusItems]);

  return (
    <div className="absolute top-5 left-5 z-10 w-64">
      <div
        className={`p-3 border rounded-lg ${
          isEmergency
            ? "bg-red-950/30 border-red-800/50"
            : "bg-cyan-950/20 border-cyan-800/30"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h3
            className={`text-xs font-bold tracking-widest ${
              isEmergency ? "text-red-400" : "text-cyan-400"
            }`}
          >
            SYSTEM STATUS
          </h3>
          <div
            className={`h-2 w-2 rounded-full ${
              isEmergency ? "bg-red-500" : "bg-cyan-500"
            } animate-pulse`}
          ></div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {statusItems.map((item) => {
            const color = isEmergency
              ? item.status === "critical"
                ? "bg-red-900/40 border-red-600"
                : item.status === "warning"
                ? "bg-orange-900/20 border-orange-800/50"
                : "bg-red-950/20 border-red-900/30"
              : item.status === "critical"
              ? "bg-red-900/40 border-red-600"
              : item.status === "warning"
              ? "bg-amber-900/20 border-amber-800/50"
              : "bg-cyan-950/30 border-cyan-900/20";

            return (
              <div
                key={item.id}
                className={`group p-2 rounded border transition-all duration-300 cursor-pointer
                  ${color}
                  ${highlightedItem === item.id ? "scale-105" : ""}
                  hover:scale-[1.04] hover:shadow-md
                  hover:ring-1 hover:ring-offset-0
                  ${isEmergency ? "hover:ring-red-500" : "hover:ring-cyan-400"}
                `}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-xs opacity-80 ${
                      isEmergency ? "text-red-300" : "text-cyan-300"
                    }`}
                  >
                    {item.label}
                  </span>
                  <div
                    className={`
                      h-1.5 w-1.5 rounded-full ml-1
                      ${
                        item.status === "critical"
                          ? "bg-red-500 animate-pulse"
                          : item.status === "warning"
                          ? isEmergency
                            ? "bg-orange-500"
                            : "bg-amber-500"
                          : isEmergency
                          ? "bg-red-700"
                          : "bg-cyan-700"
                      }
                    `}
                  ></div>
                </div>

                <div className="mt-1 flex justify-between items-end">
                  <span
                    className={`text-lg font-bold ${
                      isEmergency ? "text-red-300" : "text-cyan-300"
                    }`}
                  >
                    {item.value}
                  </span>
                  <span
                    className={`text-xs ${
                      isEmergency ? "text-red-500" : "text-cyan-500"
                    }`}
                  >
                    {item.unit}
                  </span>
                </div>

                <div
                  className={`mt-1 h-1 w-full bg-black rounded-full overflow-hidden ${
                    highlightedItem === item.id ? "animate-pulse" : ""
                  }`}
                >
                  <div
                    className={`h-full transition-all duration-500 ${
                      item.status === "critical"
                        ? "bg-red-500"
                        : item.status === "warning"
                        ? isEmergency
                          ? "bg-orange-500"
                          : "bg-amber-500"
                        : isEmergency
                        ? "bg-red-400"
                        : "bg-cyan-400"
                    }`}
                    style={{
                      width: `${
                        item.unit === "%"
                          ? item.value
                          : Math.min(100, item.value)
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
