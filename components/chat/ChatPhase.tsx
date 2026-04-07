"use client";

import { usePipelineStore } from "@/lib/store";
import { useStreamChat } from "@/hooks/useStreamChat";
import { EventBubble } from "./EventBubble";
import { AgentInspector } from "./AgentInspector";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Send, Square, Info } from "lucide-react";

export function ChatPhase() {
  const { messages, personas, selPersona } = usePipelineStore();
  const { sendMessage, stopStream, isLoading } = useStreamChat();
  const [input, setInput] = useState("");
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activePersona = selPersona !== null ? personas[selPersona] : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput("");
  };

  if (!activePersona) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col"
    >
      {/* Top Bar */}
      <div className="glass-panel sticky top-0 z-10 flex items-center justify-between px-4 py-3 shadow-md">
        <div className="flex items-center gap-3">
          <img src={activePersona.avatarUrl} alt={activePersona.name} className="h-10 w-10 rounded-full bg-black/20" />
          <div>
            <h3 className="font-sans text-sm font-bold">{activePersona.name}</h3>
            <p className="font-mono text-[10px] text-[var(--accent)]">{activePersona.role}</p>
          </div>
        </div>
        <button
          onClick={() => setInspectorOpen(true)}
          className="rounded-full bg-white/5 p-2 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          <Info size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center opacity-50">
            <img src={activePersona.avatarUrl} alt="" className="mb-4 h-24 w-24 rounded-full opacity-50 grayscale" />
            <p className="font-mono text-sm">Démarrez la conversation avec {activePersona.name}</p>
          </div>
        ) : (
          messages.map((msg) => <EventBubble key={msg.id} message={msg} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)] to-transparent pb-safe pt-8">
        <div className="mx-auto max-w-lg px-4 pb-24">
          <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Écrivez un message..."
              className="max-h-32 min-h-[56px] w-full resize-none rounded-3xl bg-[var(--surface-2)] py-4 pl-6 pr-14 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
              rows={1}
            />
            <div className="absolute bottom-2 right-2">
              {isLoading ? (
                <button
                  type="button"
                  onClick={stopStream}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <Square size={16} className="fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-black disabled:opacity-50"
                >
                  <Send size={16} className="ml-1" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <AgentInspector isOpen={inspectorOpen} onClose={() => setInspectorOpen(false)} />
    </motion.div>
  );
}
