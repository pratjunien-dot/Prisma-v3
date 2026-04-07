"use client";

import { useDebateStore } from "@/lib/store";
import { BottomSheet } from "../ui/BottomSheet";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import { motion } from "motion/react";

export function JudgeVerdict() {
  const { state, subject, personaA, personaB, rounds, verdict, setVerdict } = useDebateStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (state === "judging" && !verdict && !loading) {
      fetchVerdict();
    }
  }, [state]);

  const fetchVerdict = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, personaA, personaB, rounds }),
      });
      const data = await res.json();
      setVerdict(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (state !== "judging" && state !== "verdict") return null;

  return (
    <BottomSheet isOpen={true} onClose={() => {}} title="Verdict du Juge IA">
      {loading || !verdict ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="font-mono text-xs text-amber-500 animate-pulse">Analyse des arguments en cours...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8 pt-4">
          <div className="text-center">
            <h3 className="font-mono text-[10px] uppercase tracking-wider text-gray-400">Vainqueur</h3>
            <motion.h2 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-2 font-sans text-3xl font-bold text-amber-400 shadow-amber-400/50 drop-shadow-lg"
            >
              {verdict.winner}
            </motion.h2>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <img src={personaA?.avatarUrl} className="h-10 w-10 rounded-full bg-black/20" />
              <div className="flex-1">
                <div className="flex justify-between font-mono text-[10px] mb-1">
                  <span className="text-blue-400">{personaA?.name}</span>
                  <span>{verdict.scores[personaA?.id || ""]} pts</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${verdict.scores[personaA?.id || ""]}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <img src={personaB?.avatarUrl} className="h-10 w-10 rounded-full bg-black/20" />
              <div className="flex-1">
                <div className="flex justify-between font-mono text-[10px] mb-1">
                  <span className="text-red-400">{personaB?.name}</span>
                  <span>{verdict.scores[personaB?.id || ""]} pts</span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${verdict.scores[personaB?.id || ""]}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-red-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-gray-400">Analyse</h3>
            <div className="rounded-2xl bg-white/5 p-4 text-sm text-gray-300 markdown-body prose prose-sm prose-invert">
              <Markdown>{verdict.analysis}</Markdown>
            </div>
          </div>

          <button
            onClick={() => { /* TODO: Save to Firestore */ window.location.href = "/"; }}
            className="w-full rounded-xl bg-white/10 py-4 font-sans text-sm font-bold transition-colors hover:bg-white/20"
          >
            Terminer et Sauvegarder
          </button>
        </div>
      )}
    </BottomSheet>
  );
}
