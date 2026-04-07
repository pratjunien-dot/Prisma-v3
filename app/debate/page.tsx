"use client";

import { useDebateStore } from "@/lib/store";
import { DebateSetup } from "@/components/debate/DebateSetup";
import { VSScreen } from "@/components/debate/VSScreen";
import { DebateArena } from "@/components/debate/DebateArena";
import { JudgeVerdict } from "@/components/debate/JudgeVerdict";
import { AnimatePresence } from "motion/react";

export default function DebatePage() {
  const { state } = useDebateStore();

  return (
    <div className="mx-auto h-full max-w-lg relative">
      <AnimatePresence mode="wait">
        {state === "idle" && <DebateSetup key="setup" />}
        {state === "vs_screen" && <VSScreen key="vs" />}
        {(state === "round_a" || state === "round_b" || state === "judging" || state === "verdict") && (
          <DebateArena key="arena" />
        )}
      </AnimatePresence>
      <JudgeVerdict />
    </div>
  );
}
