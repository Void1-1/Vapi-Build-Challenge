"use client";

import { useState, useEffect, useRef } from "react";
import { vapi } from "@/lib/vapi.sdk";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

type Message = {
  type: string;
  transcriptType?: string;
  transcript?: string;
  role?: "user" | "assistant" | "system";
};

interface AgentProps {
  isEmergency?: boolean;
}

const MobileAgent = ({ isEmergency = false }: AgentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
    const onMessage = (message: Message) => {
      if (
        message?.type === "transcript" &&
        message.transcriptType === "final" &&
        message.transcript &&
        message.role
      ) {
        const newMessage: SavedMessage = {
          role: message.role,
          content: message.transcript,
        };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.error("Vapi Error:", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const colors = {
    text: isEmergency ? "text-red-400" : "text-cyan-400",
    border: isEmergency ? "border-red-600" : "border-cyan-600",
    background: isEmergency ? "bg-red-900/70" : "bg-cyan-900/70",
    buttonBg: isEmergency ? "bg-red-600" : "bg-cyan-500",
    buttonHover: isEmergency ? "hover:bg-red-700" : "hover:bg-cyan-700",
    speakingRing: isEmergency ? "ring-red-500" : "ring-cyan-500",
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-black/90 backdrop-blur-md border-t ${colors.border} shadow-lg rounded-t-2xl`}
      style={{ maxHeight: "50vh" }}
    >
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b border-gray-700">
        <div
          className={`relative w-12 h-12 rounded-full border-2 ${
            isSpeaking ? `${colors.speakingRing} animate-ping` : colors.border
          } flex-shrink-0`}
          aria-label={isSpeaking ? "Speaking" : "Idle"}
        >
          <div
            className={`absolute inset-1 rounded-full ${
              isEmergency ? "bg-red-500" : "bg-cyan-500"
            } shadow-inner`}
          />
        </div>
        <div className="ml-3">
          <h2 className={`text-xl font-semibold ${colors.text}`}>
            F.R.I.D.A.Y.
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            {callStatus === CallStatus.ACTIVE
              ? "Listening..."
              : callStatus === CallStatus.CONNECTING
              ? "Connecting..."
              : "Standby"}
          </p>
        </div>
      </div>

      {/* Message Area */}
      <div
        className="flex-1 overflow-y-auto px-4 py-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <p className="text-center text-gray-500 italic text-sm select-none">
            No messages yet
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded p-3 border ${colors.border} ${
              msg.role === "assistant"
                ? colors.background
                : "bg-gray-800 text-gray-200"
            }`}
          >
            <span
              className={`block text-xs font-semibold mb-1 ${
                msg.role === "assistant" ? colors.text : "text-gray-400"
              }`}
            >
              {msg.role.toUpperCase()}
            </span>
            <p className="text-sm break-words">{msg.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 px-4 py-3 border-t border-gray-700">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            onClick={handleCall}
            className={`${colors.buttonBg} ${colors.buttonHover} text-black font-bold rounded-xl px-6 py-3 flex-1 transition-shadow shadow-md`}
          >
            Call F.R.I.D.A.Y.
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl px-6 py-3 flex-1 transition-shadow shadow-md"
          >
            End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default MobileAgent;
