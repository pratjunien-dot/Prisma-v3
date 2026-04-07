"use client";

import { usePipelineStore } from "@/lib/store";
import { motion } from "motion/react";
import { PersonaCard } from "../ui/PersonaCard";
import { BottomSheet } from "../ui/BottomSheet";
import * as Slider from "@radix-ui/react-slider";
import { useState } from "react";
import { AdvancedAxis } from "@/lib/types";

export function PersonaPhase() {
  const { personas, selPersona, selectPersona, setPhase, phase } = usePipelineStore();
  const [isRefining, setIsRefining] = useState(false);
  const [tempAxes, setTempAxes] = useState<AdvancedAxis[]>([]);

  const handleSelect = (index: number) => {
    selectPersona(index);
  };

  const openRefine = () => {
    if (selPersona === null) return;
    setTempAxes([...personas[selPersona].axes]);
    setIsRefining(true);
  };

  const closeRefine = () => {
    setIsRefining(false);
  };

  const handleAxisChange = (index: number, value: number[]) => {
    const newAxes = [...tempAxes];
    newAxes[index] = { ...newAxes[index], value: value[0] };
    setTempAxes(newAxes);
  };

  const saveRefine = () => {
    if (selPersona === null) return;
    const newPersonas = [...personas];
    newPersonas[selPersona] = { ...newPersonas[selPersona], axes: tempAxes };
    usePipelineStore.getState().setPersonas(newPersonas);
    setIsRefining(false);
  };

  const startChat = () => {
    setPhase("chat");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="flex h-full flex-col px-4 pb-24 pt-4"
    >
      <div className="mb-6 text-center">
        <h2 className="font-sans text-xl font-bold">Choisissez votre interlocuteur</h2>
        <p className="font-mono text-[10px] text-gray-400">3 personas générés à partir de la matrice</p>
      </div>

      <div className="mb-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {personas.map((persona, i) => (
          <PersonaCard
            key={persona.id}
            persona={persona}
            compact
            selected={selPersona === i}
            onClick={() => handleSelect(i)}
          />
        ))}
      </div>

      {selPersona !== null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <PersonaCard persona={personas[selPersona]} />
          
          <div className="flex gap-3">
            <button
              onClick={openRefine}
              className="flex-1 rounded-xl bg-white/5 py-3 font-sans text-sm font-medium transition-colors hover:bg-white/10"
            >
              Affiner
            </button>
            <button
              onClick={startChat}
              className="flex-[2] rounded-xl bg-[var(--accent)] py-3 font-sans text-sm font-bold text-black shadow-[0_0_15px_var(--accent-rgb)]"
            >
              Démarrer l'échange
            </button>
          </div>
        </motion.div>
      )}

      <BottomSheet isOpen={isRefining} onClose={closeRefine} title="Affinage du Persona">
        <div className="flex flex-col gap-6 pt-4">
          {tempAxes.map((axis, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="flex justify-between font-mono text-xs text-gray-300">
                <span>{axis.label}</span>
                <span>{axis.value}%</span>
              </div>
              <Slider.Root
                className="relative flex h-5 w-full touch-none select-none items-center"
                value={[axis.value]}
                max={100}
                step={1}
                onValueChange={(val) => handleAxisChange(i, val)}
              >
                <Slider.Track className="relative h-1.5 grow rounded-full bg-white/10">
                  <Slider.Range className="absolute h-full rounded-full bg-[var(--accent)]" />
                </Slider.Track>
                <Slider.Thumb
                  className="block h-5 w-5 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.5)] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                  aria-label={axis.label}
                />
              </Slider.Root>
            </div>
          ))}
          
          <div className="mt-4 flex gap-3">
            <button
              onClick={closeRefine}
              className="flex-1 rounded-xl bg-white/5 py-3 font-sans text-sm font-medium transition-colors hover:bg-white/10"
            >
              Annuler
            </button>
            <button
              onClick={saveRefine}
              className="flex-1 rounded-xl bg-[var(--accent)] py-3 font-sans text-sm font-bold text-black"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </BottomSheet>
    </motion.div>
  );
}
