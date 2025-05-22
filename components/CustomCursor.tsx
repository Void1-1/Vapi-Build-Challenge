"use client";

import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    // Track mouse position
    const moveHandler = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };

    // Hide cursor when leaving window
    const leaveHandler = () => setVisible(false);

    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseout", leaveHandler);

    // Pulse animation
    const pulseInterval = setInterval(() => {
      setPulse((p) => (p + 1) % 100);
    }, 30);

    return () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseout", leaveHandler);
      clearInterval(pulseInterval);
    };
  }, []);

  // Pulse effect between 0.7 and 1 opacity
  const pulseOpacity = 0.7 + Math.sin(pulse * 0.063) * 0.3;

  return (
    <>
      {/* Hide default cursor globally */}
      <style>{`
        body, * {
          cursor: none !important;
        }
      `}</style>

      {/* Custom Cursor */}
      <div
        style={{
          position: "fixed",
          top: position.y - 12,
          left: position.x - 12,
          width: 24,
          height: 24,
          pointerEvents: "none",
          borderRadius: "50%",
          border: `2px solid rgba(0, 242, 255, ${pulseOpacity})`,
          boxShadow: `0 0 8px rgba(0, 242, 255, ${pulseOpacity})`,
          zIndex: 9999,
          opacity: visible ? 1 : 0,
          backdropFilter: "blur(4px)", // subtle blur for tech vibe
          backgroundColor: "rgba(0, 10, 20, 0.4)", // dark translucent center
          mixBlendMode: "screen", // glowing effect blending
        }}
      />
    </>
  );
}
