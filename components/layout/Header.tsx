"use client";

import { useUIStore, useRadioStore } from "@/lib/store";
import { emitter } from "@/lib/events";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Radio } from "lucide-react";

export function Header() {
  const { headerVisible } = useUIStore();
  const { isPlaying, activeStationId, togglePlay } = useRadioStore();
  const [time, setTime] = useState("");
  const [radioOpen, setRadioOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onRadioOpen = () => setRadioOpen((prev) => !prev);
    emitter.on("ui:radio-open", onRadioOpen);
    return () => emitter.off("ui:radio-open", onRadioOpen);
  }, []);

  return (
    <AnimatePresence>
      {headerVisible && (
        <motion.header
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          exit={{ y: -80 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
        >
          <div className="mx-auto max-w-lg">
            <div className="glass-panel flex h-14 items-center justify-between rounded-2xl px-4">
              <div className="font-mono text-lg font-bold text-[var(--accent)]">
                PrismaOS
              </div>
              
              <button 
                onClick={() => setRadioOpen(!radioOpen)}
                className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 transition-colors hover:bg-white/10"
              >
                <Radio size={16} className={isPlaying ? "text-[var(--accent)]" : "text-gray-400"} />
                <span className="text-sm font-medium uppercase tracking-wider text-gray-300">
                  {activeStationId}
                </span>
                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-3">
                    <motion.div animate={{ scaleY: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-1 bg-[var(--accent)] h-full origin-bottom" />
                    <motion.div animate={{ scaleY: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} className="w-1 bg-[var(--accent)] h-full origin-bottom" />
                    <motion.div animate={{ scaleY: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} className="w-1 bg-[var(--accent)] h-full origin-bottom" />
                  </div>
                )}
              </button>

              <div className="font-mono text-sm text-gray-400">
                {time}
              </div>
            </div>

            <AnimatePresence>
              {radioOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2 overflow-hidden rounded-2xl glass-panel"
                >
                  <div className="grid grid-cols-3 gap-2 p-4">
                    {["fip", "inter", "culture", "musique", "info", "nts", "fip-jazz", "fip-rock", "bbc6"].map((station) => (
                      <button
                        key={station}
                        onClick={() => {
                          useRadioStore.getState().setStation(station);
                        }}
                        className={`rounded-xl p-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                          activeStationId === station
                            ? "bg-[var(--accent)] text-black"
                            : "bg-white/5 text-gray-300 hover:bg-white/10"
                        }`}
                      >
                        {station}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
