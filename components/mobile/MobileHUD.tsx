"use client";

import { useState } from "react";
import MobileAgent from "./MobileAgent";
import MobileCommandGrid from "./MobileCommandBar";

export default function MobileHUD_UI() {
  const [emergency, setEmergency] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function onCommandResult(result: { emergencyColors?: boolean }) {
    if (result.emergencyColors) {
      setEmergency(true);
    }
  }

  return (
    <>
      <div
        className={`w-screen h-screen relative bg-gradient-to-tr from-black via-slate-950 to-black font-mono overflow-hidden ${
          emergency ? "text-red-400" : "text-cyan-300"
        }`}
      >
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
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center z-10 px-4">
          <h1
            className={`text-4xl font-bold tracking-wide sm:tracking-wider md:tracking-widest ${
              emergency
                ? "drop-shadow-[0_0_10px_#FF0000AA] text-red-400"
                : "drop-shadow-[0_0_10px_#00ffffaa] text-cyan-300"
            }`}
          >
            F.R.I.D.A.Y.
          </h1>
          <p
            className={`uppercase text-[10px] sm:text-xs tracking-[0.15em] sm:tracking-[0.25em] md:tracking-[0.3em] ${
              emergency ? "text-red-500" : "text-cyan-400"
            }`}
          >
            AI Tactical Assistant
          </p>
        </div>

        <MobileCommandGrid
          onEmergencyChange={setEmergency}
          emergency={emergency}
        />

        <MobileAgent isEmergency={emergency} />
      </div>
    </>
  );
}
