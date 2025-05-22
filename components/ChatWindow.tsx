"use client";

import { useState, useRef } from "react";
import { MessageSquare } from "lucide-react";
import { isCommand, handleCommand } from "@/lib/commands";

interface ChatWindowProps {
  onCommandResult?: (result: {
    success: boolean;
    message?: string;
    clearChat?: boolean;
    emergencyColors?: boolean;
  }) => void;
  isEmergency?: boolean;
}

export default function ChatWindow({
  onCommandResult,
  isEmergency = false,
}: ChatWindowProps) {
  const [input, setInput] = useState("");
  const [responses, setResponses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const speakRef = useRef<SpeechSynthesisUtterance | null>(null);

  async function sendPrompt(prompt: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.success) {
        setResponses((prev) => [...prev, data.response]);
        speakResponse(data.response);
      } else {
        setError(data.error || "Unknown API error");
      }
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  }

  function speakResponse(text: string) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speakRef.current = utterance;

    const preferredVoiceName = "Google UK English Female";
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) => v.name === preferredVoiceName);
      if (preferred) utterance.voice = preferred;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = setVoice;
    } else {
      setVoice();
    }
  }

  function handleSend() {
    if (!input.trim()) return;

    if (isCommand(input)) {
      const result = handleCommand(input);

      // Pass result up
      if (onCommandResult) {
        onCommandResult(result);
      }

      if (result.clearChat) {
        setResponses([]);
      }

      if (result.message) {
        setResponses((prev) => [...prev, `> ${result.message}`]);

        if (result.message === "Console cleared.") {
          setTimeout(() => {
            setResponses((prev) =>
              prev.filter((msg) => msg !== `> ${result.message}`)
            );
          }, 2000);
        }
      }

      if (!result.success && !result.message) {
        setResponses((prev) => [...prev, "> Command failed."]);
      }
      setInput("");
    } else {
      sendPrompt(input.trim());
      setInput("");
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-2.5 left-2.5 z-[60] p-4 rounded-full 
          ${
            isEmergency
              ? "shadow-[0_0_25px_#ff000088] border border-red-400/40"
              : "shadow-[0_0_20px_#00ffff80] border border-cyan-400/30"
          } 
          bg-black/40 backdrop-blur-md transition hover:scale-105 active:scale-95`}
      >
        <MessageSquare
          className={`w-5 h-5 ${
            isEmergency
              ? "text-red-400 drop-shadow-[0_0_5px_#ff0000aa]"
              : "text-cyan-300 drop-shadow"
          }`}
        />
      </button>

      {isOpen && (
        <div
          className={`fixed bottom-20 left-4 w-[400px] h-[70vh] z-[100] rounded-2xl backdrop-blur-md p-4 flex flex-col animate-slideInLeft ${
            isEmergency
              ? "bg-black/60 border border-red-400/30 shadow-[0_0_60px_#ff000044_inset]"
              : "bg-black/50 border border-cyan-400/30 shadow-[0_0_30px_#00ffff33_inset]"
          }`}
        >
          <div className="flex-grow overflow-y-auto space-y-3 mb-4 custom-scroll">
            {responses.length === 0 ? (
              <p
                className={`${
                  isEmergency ? "text-red-400" : "text-cyan-400"
                } italic text-sm`}
              >
                Awaiting command...
              </p>
            ) : (
              responses.map((resp, i) => {
                const command = resp.startsWith(">");
                return (
                  <div
                    key={i}
                    className={`rounded p-2 text-sm ${
                      command
                        ? isEmergency
                          ? "bg-red-800 text-red-200 font-mono italic"
                          : "bg-cyan-700 text-cyan-200 font-mono italic"
                        : isEmergency
                        ? "bg-black/40 border border-red-500/20 text-red-100"
                        : "bg-black/40 border border-cyan-500/20 text-cyan-100"
                    }`}
                  >
                    {resp}
                  </div>
                );
              })
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              className={`flex-grow px-3 py-2 bg-black/30 text-white rounded-lg border placeholder:text-sm text-sm focus:outline-none
                ${
                  isEmergency
                    ? "border-red-400/20 placeholder-red-300 focus:ring-2 focus:ring-red-500"
                    : "border-cyan-400/20 placeholder-cyan-300 focus:ring-2 focus:ring-cyan-500"
                }
              `}
              placeholder="Type message or command..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-bold text-black text-sm 
                ${
                  isEmergency
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-cyan-600 hover:bg-cyan-700"
                }`}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs mt-2">⚠ {error}</p>}
        </div>
      )}
    </>
  );
}
