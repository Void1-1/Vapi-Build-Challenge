"use client";

import ChatWindow from "@/components/ChatWindow";
import Agent from "@/components/Agent";
import Clock from "@/components/Clock";
import Radar from "@/components/Radar";
import PowerRings from "@/components/Power";

import { useState } from "react";
import StatusGrid from "@/components/StatusGrid";

export default function DesktopHUD_UI() {
  const [emergency, setEmergency] = useState(false);

  function onCommandResult(result: { emergencyColors?: boolean }) {
    if (typeof result.emergencyColors === "boolean") {
      setEmergency(result.emergencyColors);
    }
  }

  return (
    <div
      className={`w-screen h-screen relative bg-gradient-to-tr from-black via-slate-950 to-black font-mono overflow-hidden ${
        emergency ? "text-red-400" : "text-cyan-300"
      }`}
    >
      {/* HUD overlay background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className={`w-full h-full bg-gradient-radial ${
            emergency ? "from-red-900/10" : "from-cyan-900/10"
          } via-black to-black opacity-80 backdrop-blur-2xl`}
        />
        <div
          className={`absolute inset-0 border ${
            emergency
              ? "border-red-500/10 shadow-[0_0_150px_35px_#ff000033_inset]"
              : "border-cyan-500/10 shadow-[0_0_100px_#00ffff33_inset]"
          }`}
        />
      </div>

      {/* Header / title */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center z-10">
        <h1
          className={`text-5xl font-bold tracking-widest ${
            emergency
              ? "drop-shadow-[0_0_10px_#FF0000AA] text-red-400"
              : "drop-shadow-[0_0_10px_#00ffffaa] text-cyan-300"
          }`}
        >
          F.R.I.D.A.Y.
        </h1>
        <p
          className={`uppercase text-xs tracking-[0.3em] ${
            emergency ? "text-red-500" : "text-cyan-400"
          }`}
        >
          AI Tactical Assistant
        </p>
      </div>

      {/* Clock on the top right */}
      <Clock isEmergency={emergency} />

      {/* Agent center interface on the bottom right */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Agent isEmergency={emergency} />
      </div>

      {/* Power rings on the bottom left */}
      <PowerRings isEmergency={emergency} />

      {/* Radar on the bottom left */}
      <Radar isEmergency={emergency} />

      {/* Chat window and button on the bottom left */}
      <ChatWindow onCommandResult={onCommandResult} isEmergency={emergency} />

      <StatusGrid isEmergency={emergency} />
    </div>
  );
}
