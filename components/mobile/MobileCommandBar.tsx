"use client";

import { useState } from "react";
import { handleCommand } from "@/lib/commands";

interface MobileCommandBarProps {
  emergency: boolean;
  onEmergencyChange: (emergency: boolean) => void;
  onCommandFeedback?: (message: string) => void;
}

const allCommands = ["--reload", "--clear"];

// Simple icons for demo purposes
const icons = {
  reload: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 inline-block mr-2"
      fill="none"
      viewBox="0 0 30 30"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path
        d="M15 3c-2.9686 0-5.6972 1.0834-7.792 2.875a1 1 0 1 0 1.2998 1.5195c1.7482-1.4944 4.0107-2.3954 6.4932-2.3954 5.1966 0 9.451 3.9379 9.9512 9h-2.9512l4 6 4-6-3.0508 0c-.5113-6.1483-5.6714-11-12-11zM4 10l-4 6 3.0508 0c.5113 6.1483 5.6714 11 12 11 2.9686 0 5.6972-1.0834 7.793-2.875a1 1 0 1 0-1.2988-1.5195c-1.7482 1.4944-4.0107 2.3954-6.4932 2.3954-5.1966 0-9.451-3.9379-9.9512-9h2.9512l-4-6z"
        fill="none"
      />
      <path
        d="M30 14l-4 6-4-6h6zM0 16l4-6 4 6H4z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  ),
  clear: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 inline-block mr-2"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  emergencyOn: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 inline-block mr-2 text-red-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 8v4m0 4h.01M4.93 19h14.14c.52 0 .78-.62.42-1L13.41 5a1 1 0 00-1.82 0L4.5 18c-.36.38-.1 1 .43 1z"
      />
    </svg>
  ),
  emergencyOff: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 inline-block mr-2 text-cyan-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
    </svg>
  ),
};

export default function MobileCommandBar({
  emergency,
  onEmergencyChange,
  onCommandFeedback,
}: MobileCommandBarProps) {
  const [lastMessage, setLastMessage] = useState<string | null>(null);

  function runCommand(command: string) {
    const result = handleCommand(command);

    if (result.emergencyColors !== undefined) {
      onEmergencyChange(result.emergencyColors);
    }

    if (result.message) {
      setLastMessage(result.message);
      onCommandFeedback?.(result.message);

      // Clear message after 2.5 seconds
      setTimeout(() => setLastMessage(null), 2500);
    }
  }

  function toggleEmergency() {
    runCommand(emergency ? "--normal" : "--emergency");
  }

  return (
    <>
      <section className="fixed bottom-50 left-0 right-0 z-30 mx-auto max-w-screen-md px-4">
        <h2
          className={`mb-2 text-left text-sm font-semibold ${
            emergency ? "text-red-500" : "text-cyan-400"
          } select-none`}
        >
          Commands:
        </h2>

        <div className="bg-black/40 backdrop-blur-md rounded-full px-5 py-3 overflow-x-auto whitespace-nowrap flex items-center gap-4 scrollbar-thin scrollbar-thumb-cyan-600 scrollbar-track-transparent">
          {/* Emergency toggle button */}
          <button
            onClick={toggleEmergency}
            aria-pressed={emergency}
            aria-label="Toggle emergency mode"
            title={
              emergency ? "Disable emergency mode" : "Enable emergency mode"
            }
            className={`
              flex items-center px-5 py-2 rounded-full font-mono text-sm font-semibold select-none
              transition-transform duration-150 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-offset-1
              ${
                emergency
                  ? "bg-red-700 hover:bg-red-800 text-red-200 focus:ring-red-400"
                  : "bg-cyan-700 hover:bg-cyan-800 text-cyan-200 focus:ring-cyan-400"
              }
            `}
            onMouseDown={(e) => e.currentTarget.classList.add("scale-95")}
            onMouseUp={(e) => e.currentTarget.classList.remove("scale-95")}
            onMouseLeave={(e) => e.currentTarget.classList.remove("scale-95")}
          >
            {emergency ? icons.emergencyOn : icons.emergencyOff}
            {emergency ? "Emergency On" : "Emergency Off"}
          </button>

          {/* Other command buttons */}
          {allCommands.map((cmd) => {
            // Remove the leading '--' for button text display
            const label = cmd.replace(/^--/, "");

            // Pick icon based on label
            const icon = icons[label as keyof typeof icons] || null;

            return (
              <button
                key={cmd}
                onClick={() => runCommand(cmd)}
                title={`Run command ${cmd}`}
                aria-label={`Run command ${cmd}`}
                className={`
                  flex items-center px-5 py-2 rounded-full font-mono text-sm font-semibold select-none
                  transition-transform duration-150 ease-in-out
                  focus:outline-none focus:ring-2 focus:ring-offset-1
                  ${
                    emergency
                      ? "bg-red-700 hover:bg-red-800 text-red-200 focus:ring-red-400"
                      : "bg-cyan-700 hover:bg-cyan-800 text-cyan-200 focus:ring-cyan-400"
                  }
                `}
                onMouseDown={(e) => e.currentTarget.classList.add("scale-95")}
                onMouseUp={(e) => e.currentTarget.classList.remove("scale-95")}
                onMouseLeave={(e) =>
                  e.currentTarget.classList.remove("scale-95")
                }
              >
                {icon}
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </button>
            );
          })}
        </div>

        {lastMessage && (
          <div
            className={`fixed bottom-68 left-4 transform translate-x-1/2 z-40 rounded-md px-4 py-2 text-xs font-semibold opacity-100 animate-fadeIn ${
              emergency
                ? "bg-red-900 text-red-400 shadow-md shadow-red-800/70"
                : "bg-cyan-900 text-cyan-400 shadow-md shadow-cyan-800/70"
            }`}
          >
            {lastMessage}
          </div>
        )}
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease forwards;
        }
        /* Optional scrollbar styling for webkit browsers */
        .scrollbar-thin::-webkit-scrollbar {
          height: 0px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background-color: rgba(14, 116, 144, 0.6);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </>
  );
}
