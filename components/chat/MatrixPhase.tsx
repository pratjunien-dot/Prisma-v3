"use client";

import { usePipelineStore } from "@/lib/store";
import { motion } from "motion/react";
import { MatrixCard } from "../ui/MatrixCard";
import { useState } from "react";

export function MatrixPhase() {
  const { intention, matrices, selMatrix, selectMatrix, setPhase, setPersonas } = usePipelineStore();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (selMatrix === null) return;
    
    setLoading(true);
    setPhase("loading_personas");

    try {
      const res = await fetch("/api/personas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intention, matrix: matrices[selMatrix] }),
      });
      const data = await res.json();
      setPersonas(data);
      setPhase("select_persona");
    } catch (error) {
      console.error(error);
      setPhase("select_matrix");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex h-full flex-col px-4 pb-24 pt-4"
    >
      <div className="mb-6 text-center">
        <h2 className="font-sans text-xl font-bold">Choisissez l'approche</h2>
        <p className="font-mono text-[10px] text-gray-400">3 matrices générées pour votre intention</p>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto pb-20">
        {matrices.map((matrix, i) => (
          <MatrixCard
            key={matrix.id}
            matrix={matrix}
            selected={selMatrix === i}
            onClick={() => selectMatrix(i)}
          />
        ))}
      </div>

      {selMatrix !== null && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-24 left-0 right-0 flex justify-center px-4 z-40"
        >
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="w-full max-w-lg rounded-2xl bg-[var(--accent)] py-4 font-sans font-bold text-black shadow-[0_0_20px_var(--accent-rgb)] disabled:opacity-50"
          >
            {loading ? "Génération des personas..." : "Confirmer la matrice"}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
