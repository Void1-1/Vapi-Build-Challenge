"use client";

import { useState, useEffect } from "react";
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

const Agent = ({ isEmergency = false }: AgentProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

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
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }
  }, [messages]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);
    await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID);
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  const primary = {
    text: isEmergency ? "text-red-300" : "text-cyan-300",
    border: isEmergency ? "border-red-500/30" : "border-cyan-500/30",
    ring: isEmergency ? "border-red-500/50" : "border-cyan-500/50",
    ping: isEmergency ? "border-red-300" : "border-cyan-300",
    background: isEmergency ? "bg-red-500/10" : "bg-cyan-500/10",
    shadow: isEmergency
      ? "shadow-[0_0_30px_#ff4b4b66]"
      : "shadow-[0_0_30px_#00ffff66]",
    label: isEmergency ? "text-red-500" : "text-cyan-500",
    msgBorder: isEmergency ? "border-red-500/20" : "border-cyan-500/20",
    msgText: isEmergency ? "text-red-100" : "text-cyan-100",
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-80 bg-black/30 backdrop-blur-md rounded-2xl border ${primary.border} ${primary.shadow} p-4 flex flex-col gap-4`}
    >
      {/* HUD Bubble */}
      <div className="flex items-center gap-4">
        <div className="relative w-13 h-13">
          <svg viewBox="0 0 200 200" className="absolute inset-0">
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke={isEmergency ? "#ff4b4b" : "#00f2ff"}
              strokeWidth="0.5"
              strokeDasharray="4 6"
            />
          </svg>
          <div
            className={`w-full h-full rounded-full border-2 ${
              isSpeaking ? `${primary.ping} animate-pingSlow` : primary.ring
            }`}
          />
          <div
            className={`absolute inset-[4.5px] rounded-full ${
              isEmergency ? "bg-red-300" : "bg-cyan-300"
            } shadow-inner`}
          />
        </div>
        <div>
          <h3 className={`text-lg font-semibold tracking-wide ${primary.text}`}>
            F.R.I.D.A.Y.
          </h3>
          <p className={`text-xs uppercase tracking-widest ${primary.label}`}>
            {callStatus === CallStatus.ACTIVE
              ? "Listening..."
              : callStatus === CallStatus.CONNECTING
              ? "Connecting..."
              : "Standby"}
          </p>
        </div>
      </div>

      {/* Last Spoken Message */}
      {lastMessage && (
        <div
          className={`text-sm ${primary.msgText} ${primary.background} p-3 rounded-md border ${primary.msgBorder} animate-fadeIn shadow-inner`}
        >
          {lastMessage}
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-end">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            onClick={handleCall}
            className={`${
              isEmergency
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-cyan-500 hover:bg-cyan-600 text-black"
            } font-semibold px-4 py-2 rounded-lg transition shadow-md`}
          >
            Call F.R.I.D.A.Y.
          </button>
        ) : (
          <button
            onClick={handleDisconnect}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition shadow-md"
          >
            End Call
          </button>
        )}
      </div>
    </div>
  );
};

export default Agent;
