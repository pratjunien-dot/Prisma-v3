"use client";

import { useRadioStore } from "@/lib/store";
import { emitter } from "@/lib/events";
import { Glass } from "../ui/Glass";
import { Play, Pause, Radio } from "lucide-react";
import { motion } from "motion/react";

export function RadioWidget() {
  const { activeStationId, isPlaying, togglePlay } = useRadioStore();

  return (
    <Glass className="flex h-32 flex-col justify-between p-4 relative overflow-hidden">
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-2 text-[var(--accent)]">
          <Radio size={16} />
          <span className="font-mono text-xs font-bold uppercase tracking-wider">{activeStationId}</span>
        </div>
        <button
          onClick={() => emitter.emit("ui:radio-open")}
          className="text-[9px] font-mono uppercase tracking-wider text-gray-400 hover:text-white"
        >
          Changer
        </button>
      </div>

      <div className="flex items-center justify-center relative z-10">
        <button
          onClick={togglePlay}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)] text-black shadow-[0_0_15px_var(--accent)] transition-transform hover:scale-105 active:scale-95"
        >
          {isPlaying ? <Pause size={20} className="fill-black" /> : <Play size={20} className="ml-1 fill-black" />}
        </button>
      </div>

      {isPlaying && (
        <div className="absolute bottom-0 left-0 right-0 flex h-16 items-end justify-center gap-1 opacity-20">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: ["20%", "100%", "20%"] }}
              transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, delay: Math.random() * 0.5 }}
              className="w-2 bg-[var(--accent)] rounded-t-sm"
            />
          ))}
        </div>
      )}
    </Glass>
  );
}
