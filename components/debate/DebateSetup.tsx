"use client";

import { useDebateStore, usePipelineStore } from "@/lib/store";
import { useState } from "react";
import { motion } from "motion/react";
import { Swords } from "lucide-react";
import { Glass } from "../ui/Glass";

export function DebateSetup() {
  const { setSubject, setPersonas, startDebate, subject } = useDebateStore();
  const { personas } = usePipelineStore(); // We'll use recently generated personas for now
  
  // For a real app, we'd fetch favorites from Firestore here
  const availablePersonas = personas.length >= 2 ? personas : [
    { id: "1", name: "Socrate", role: "Philosophe", avatarUrl: "https://api.dicebear.com/9.x/bottts/svg?seed=socrate", color: "hsl(200, 80%, 50%)" },
    { id: "2", name: "Machiavel", role: "Stratège", avatarUrl: "https://api.dicebear.com/9.x/bottts/svg?seed=machiavel", color: "hsl(0, 80%, 50%)" }
  ] as any[];

  const [selA, setSelA] = useState<number>(0);
  const [selB, setSelB] = useState<number>(1);

  const handleStart = () => {
    if (!subject.trim()) return;
    setPersonas(availablePersonas[selA], availablePersonas[selB]);
    startDebate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex h-full flex-col px-4 pb-24 pt-4"
    >
      <div className="mb-8 text-center">
        <h2 className="font-sans text-2xl font-bold">Arène de Débat</h2>
        <p className="font-mono text-xs text-gray-400">Configurez les opposants et le sujet</p>
      </div>

      <div className="flex flex-col gap-6">
        <Glass className="p-4">
          <h3 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-[var(--accent)]">Sujet du débat</h3>
          <textarea
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Ex: L'IA remplacera-t-elle les artistes ?"
            className="w-full resize-none rounded-xl bg-white/5 p-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            rows={3}
          />
        </Glass>

        <div className="flex items-center gap-4">
          <Glass className="flex-1 p-4 flex flex-col items-center gap-3">
            <h3 className="font-mono text-[10px] uppercase tracking-wider text-blue-400">Persona A</h3>
            <select 
              value={selA} 
              onChange={(e) => setSelA(Number(e.target.value))}
              className="w-full rounded-lg bg-white/10 p-2 text-xs text-white focus:outline-none"
            >
              {availablePersonas.map((p, i) => (
                <option key={p.id} value={i} className="bg-black">{p.name}</option>
              ))}
            </select>
            <img src={availablePersonas[selA]?.avatarUrl} alt="" className="h-16 w-16 rounded-full bg-black/20" />
          </Glass>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-gray-400">
            <Swords size={20} />
          </div>

          <Glass className="flex-1 p-4 flex flex-col items-center gap-3">
            <h3 className="font-mono text-[10px] uppercase tracking-wider text-red-400">Persona B</h3>
            <select 
              value={selB} 
              onChange={(e) => setSelB(Number(e.target.value))}
              className="w-full rounded-lg bg-white/10 p-2 text-xs text-white focus:outline-none"
            >
              {availablePersonas.map((p, i) => (
                <option key={p.id} value={i} className="bg-black">{p.name}</option>
              ))}
            </select>
            <img src={availablePersonas[selB]?.avatarUrl} alt="" className="h-16 w-16 rounded-full bg-black/20" />
          </Glass>
        </div>
      </div>

      <div className="fixed bottom-24 left-0 right-0 flex justify-center px-4 z-40">
        <button
          onClick={handleStart}
          disabled={!subject.trim() || selA === selB}
          className="w-full max-w-lg rounded-2xl bg-[var(--accent)] py-4 font-sans font-bold text-black shadow-[0_0_20px_var(--accent-rgb)] disabled:opacity-50"
        >
          Lancer le débat
        </button>
      </div>
    </motion.div>
  );
}
