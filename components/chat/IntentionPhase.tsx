"use client";

import { usePipelineStore } from "@/lib/store";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function IntentionPhase() {
  const { setIntention, setPhase, setMatrices } = usePipelineStore();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const suggestions = [
    "Je veux débattre de l'impact de l'IA sur l'art",
    "Aide-moi à structurer mon projet d'entreprise",
    "Explique-moi la physique quantique simplement",
  ];

  const handleSubmit = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setIntention(input);
    setPhase("loading_matrices");

    try {
      const res = await fetch("/api/matrices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intention: input }),
      });
      const data = await res.json();
      setMatrices(data);
      setPhase("select_matrix");
    } catch (error) {
      console.error(error);
      setPhase("idle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex h-full flex-col items-center justify-center gap-8 px-6"
    >
      <div className="w-full max-w-lg text-center">
        <h1 className="mb-2 font-sans text-2xl font-bold tracking-tight">Que souhaitez-vous explorer ?</h1>
        <p className="font-mono text-xs text-gray-400">Définissez votre intention pour générer les matrices de style.</p>
      </div>

      <div className="w-full max-w-lg relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex: Je veux préparer une interview difficile..."
          className="w-full min-h-[120px] resize-none rounded-2xl bg-[var(--surface-2)] p-4 pr-14 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
        />
        <button
          onClick={handleSubmit}
          disabled={!input.trim() || loading}
          className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-black disabled:opacity-50"
        >
          {loading ? <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" /> : <ArrowRight size={16} />}
        </button>
      </div>

      <div className="flex w-full max-w-lg flex-wrap justify-center gap-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => setInput(s)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-mono text-[10px] text-gray-300 transition-colors hover:bg-white/10"
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
