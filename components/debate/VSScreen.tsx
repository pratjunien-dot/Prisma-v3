"use client";

import { useDebateStore } from "@/lib/store";
import { motion } from "motion/react";
import { useEffect } from "react";

export function VSScreen() {
  const { personaA, personaB, nextTurn } = useDebateStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      nextTurn("round_a");
    }, 3000);
    return () => clearTimeout(timer);
  }, [nextTurn]);

  if (!personaA || !personaB) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-full flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="absolute inset-0 flex">
        <div className="flex-1 bg-blue-900/20" />
        <div className="flex-1 bg-red-900/20" />
      </div>
      
      <div className="absolute top-0 bottom-0 left-1/2 w-0.5 -translate-x-1/2 bg-white/20 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />

      <div className="z-10 flex w-full items-center justify-between px-8">
        <motion.div
          initial={{ x: -50, scale: 0.8, opacity: 0 }}
          animate={{ x: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="flex flex-col items-center gap-4"
        >
          <img src={personaA.avatarUrl} alt={personaA.name} className="h-32 w-32 rounded-full bg-black/40 shadow-[0_0_30px_rgba(96,165,250,0.3)]" />
          <h2 className="font-sans text-2xl font-bold text-blue-400">{personaA.name}</h2>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
          className="font-mono text-4xl font-bold italic text-white"
        >
          VS
        </motion.div>

        <motion.div
          initial={{ x: 50, scale: 0.8, opacity: 0 }}
          animate={{ x: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="flex flex-col items-center gap-4"
        >
          <img src={personaB.avatarUrl} alt={personaB.name} className="h-32 w-32 rounded-full bg-black/40 shadow-[0_0_30px_rgba(248,113,113,0.3)]" />
          <h2 className="font-sans text-2xl font-bold text-red-400">{personaB.name}</h2>
        </motion.div>
      </div>
    </motion.div>
  );
}
