"use client";

import { usePipelineStore } from "@/lib/store";
import { IntentionPhase } from "@/components/chat/IntentionPhase";
import { MatrixPhase } from "@/components/chat/MatrixPhase";
import { PersonaPhase } from "@/components/chat/PersonaPhase";
import { ChatPhase } from "@/components/chat/ChatPhase";
import { AnimatePresence } from "motion/react";

export default function ChatPage() {
  const { phase } = usePipelineStore();

  return (
    <div className="mx-auto h-full max-w-lg relative">
      <AnimatePresence mode="wait">
        {phase === "idle" && <IntentionPhase key="intention" />}
        {phase === "loading_matrices" && (
          <div key="loading_matrices" className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
              <p className="font-mono text-xs text-[var(--accent)] animate-pulse">Génération des matrices...</p>
            </div>
          </div>
        )}
        {phase === "select_matrix" && <MatrixPhase key="matrix" />}
        {phase === "loading_personas" && (
          <div key="loading_personas" className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
              <p className="font-mono text-xs text-[var(--accent)] animate-pulse">Génération des personas...</p>
            </div>
          </div>
        )}
        {(phase === "select_persona" || phase === "refine_persona") && <PersonaPhase key="persona" />}
        {phase === "chat" && <ChatPhase key="chat" />}
      </AnimatePresence>
    </div>
  );
}
