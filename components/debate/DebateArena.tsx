"use client";

import { useDebateStore } from "@/lib/store";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { Gavel } from "lucide-react";

export function DebateArena() {
  const { state, subject, personaA, personaB, rounds, addRound, nextTurn, requestJudge } = useDebateStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStream, setCurrentStream] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [rounds, currentStream]);

  useEffect(() => {
    if (state === "round_a" || state === "round_b") {
      generateArgument();
    }
  }, [state]);

  const generateArgument = async () => {
    if (isGenerating || !personaA || !personaB) return;
    setIsGenerating(true);
    setCurrentStream("");

    const isA = state === "round_a";
    const activePersona = isA ? personaA : personaB;
    const opponentPersona = isA ? personaB : personaA;

    const history = rounds.map(r => `${r.personaName}: ${r.argument}`).join("\n\n");
    const prompt = `Tu es ${activePersona.name} (${activePersona.role}).
Sujet du débat: ${subject}
Ton adversaire est ${opponentPersona.name}.
Historique:
${history}

Réponds à ton adversaire ou avance un nouvel argument. Sois concis et percutant (max 150 mots).`;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          systemPrompt: activePersona.systemPrompt,
        }),
      });

      if (!res.ok) throw new Error("Stream failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      if (reader) {
        let buffer = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  fullText += parsed.text;
                  setCurrentStream(fullText);
                }
              } catch (e) {}
            }
          }
        }
      }

      addRound({
        personaId: activePersona.id,
        personaName: activePersona.name,
        argument: fullText,
        timestamp: new Date(),
      });

      setIsGenerating(false);
      setCurrentStream("");
      
      // Auto-switch turns if less than 4 rounds
      if (3 > rounds.length) {
        setTimeout(() => nextTurn(isA ? "round_b" : "round_a"), 2000);
      }

    } catch (error) {
      console.error(error);
      setIsGenerating(false);
    }
  };

  if (!personaA || !personaB) return null;

  return (
    <motion.div className="flex h-full flex-col">
      <div className="glass-panel sticky top-0 z-10 p-4 text-center shadow-md">
        <h3 className="font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">Sujet</h3>
        <p className="text-sm font-medium">{subject}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {rounds.map((round, i) => {
          const isA = round.personaId === personaA.id;
          return (
            <div key={i} className={`flex w-full ${isA ? "justify-start" : "justify-end"} mb-6`}>
              <div className={`flex max-w-[85%] flex-col gap-1 ${isA ? "items-start" : "items-end"}`}>
                <div className="flex items-center gap-2">
                  {isA && <img src={personaA.avatarUrl} className="h-6 w-6 rounded-full bg-black/20" />}
                  <span className={`font-mono text-[10px] font-bold ${isA ? "text-blue-400" : "text-red-400"}`}>
                    {round.personaName}
                  </span>
                  {!isA && <img src={personaB.avatarUrl} className="h-6 w-6 rounded-full bg-black/20" />}
                </div>
                <div className={`rounded-2xl p-4 text-sm ${isA ? "bg-blue-900/20 border border-blue-500/20 rounded-tl-sm" : "bg-red-900/20 border border-red-500/20 rounded-tr-sm"}`}>
                  <Markdown>{round.argument}</Markdown>
                </div>
              </div>
            </div>
          );
        })}

        {isGenerating && (
          <div className={`flex w-full ${state === "round_a" ? "justify-start" : "justify-end"} mb-6`}>
            <div className={`flex max-w-[85%] flex-col gap-1 ${state === "round_a" ? "items-start" : "items-end"}`}>
               <div className="flex items-center gap-2">
                  {state === "round_a" && <img src={personaA.avatarUrl} className="h-6 w-6 rounded-full bg-black/20" />}
                  <span className={`font-mono text-[10px] font-bold ${state === "round_a" ? "text-blue-400" : "text-red-400"}`}>
                    {state === "round_a" ? personaA.name : personaB.name}
                  </span>
                  {state === "round_b" && <img src={personaB.avatarUrl} className="h-6 w-6 rounded-full bg-black/20" />}
                </div>
                <div className={`rounded-2xl p-4 text-sm ${state === "round_a" ? "bg-blue-900/20 border border-blue-500/20 rounded-tl-sm" : "bg-red-900/20 border border-red-500/20 rounded-tr-sm"}`}>
                  <Markdown>{currentStream}</Markdown>
                  <span className="ml-1 animate-pulse">▋</span>
                </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="fixed bottom-24 left-0 right-0 flex justify-center gap-4 px-4 z-20">
        {!isGenerating && rounds.length >= 2 && (
          <>
            <button
              onClick={() => nextTurn(state === "round_a" ? "round_b" : "round_a")}
              className="rounded-xl bg-white/10 px-6 py-3 font-sans text-sm font-medium transition-colors hover:bg-white/20"
            >
              Continuer
            </button>
            <button
              onClick={requestJudge}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-sans text-sm font-bold text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]"
            >
              <Gavel size={18} />
              Appeler le Juge
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
