"use client";

import { useEffect, useState } from "react";

const SplashScreen = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(false), 3500);
    return () => clearTimeout(timeout);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-cyan-300">
      <h1
        className="text-white text-3xl font-bold tracking-[0.4em]"
        style={{
          opacity: 0,
          animation: "fadeIn 0.8s ease-out 0.2s forwards",
        }}
      >
        STARK INDUSTRIES
      </h1>

      <h2
        className="mt-2 text-cyan-300 text-lg font-medium tracking-widest"
        style={{
          opacity: 0,
          animation: "fadeIn 0.8s ease-out 0.6s forwards",
        }}
      >
        INITIALIZING F.R.I.D.A.Y.
      </h2>

      <div className="relative w-24 h-24 mt-6">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full animate-spin"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#00ffff"
            strokeWidth="4"
            fill="none"
            strokeDasharray="60 20"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-[10px] bg-cyan-300/10 rounded-full border border-cyan-500/30 shadow-inner" />
      </div>

      <div
        className="mt-4 text-sm tracking-widest text-cyan-400 font-mono"
        style={{
          width: "17.5ch",
          whiteSpace: "nowrap",
          overflow: "hidden",
          borderRight: "2px solid #00ffff",
          animation:
            "typing 3s steps(16, end) forwards, blinkCaret 0.75s step-end infinite",
        }}
      >
        SYSTEMS BOOTING
      </div>

      <p
        className="absolute bottom-8 text-xs text-cyan-700 tracking-widest"
        style={{
          opacity: 0,
          animation: "fadeIn 0.8s ease-out 1s forwards",
        }}
      >
        F.R.I.D.A.Y INTERFACE © STARK INDUSTRIES
      </p>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0 }
            to { opacity: 1 }
          }

          @keyframes typing {
            from { width: 0 }
            to { width: 17.5ch }
          }

          @keyframes blinkCaret {
            0%, 100% { border-color: transparent }
            50% { border-color: #00ffff }
          }
        `}
      </style>
    </div>
  );
};

export default SplashScreen;
