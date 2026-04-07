"use client";

import { usePipelineStore } from "@/lib/store";
import { BottomSheet } from "../ui/BottomSheet";
import { AdvancedAxis } from "@/lib/types";

export function AgentInspector({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { personas, selPersona } = usePipelineStore();
  const persona = selPersona !== null ? personas[selPersona] : null;

  if (!persona) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Inspecteur d'Agent">
      <div className="flex flex-col gap-6 pt-4">
        <div className="flex items-center gap-4">
          <img src={persona.avatarUrl} alt={persona.name} className="h-16 w-16 rounded-full bg-black/20" />
          <div>
            <h3 className="font-sans text-xl font-bold">{persona.name}</h3>
            <p className="font-mono text-xs text-[var(--accent)]">{persona.role}</p>
          </div>
        </div>

        <div>
          <h4 className="mb-2 font-mono text-[10px] uppercase tracking-wider text-gray-500">Traits</h4>
          <div className="flex flex-wrap gap-2">
            {persona.traits.map((trait, i) => (
              <span key={i} className="rounded-full bg-white/10 px-2.5 py-1 font-mono text-[10px] text-gray-300">
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-mono text-[10px] uppercase tracking-wider text-gray-500">Configuration des Axes</h4>
          <div className="flex flex-col gap-4">
            {persona.axes.map((axis: AdvancedAxis, i: number) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-mono text-gray-400">
                  <span>{axis.label}</span>
                  <span>{axis.value}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/10">
                  <div 
                    className="h-full rounded-full" 
                    style={{ width: `${axis.value}%`, backgroundColor: persona.color || "var(--accent)" }} 
                  />
                </div>
                <p className="text-[9px] text-gray-500 mt-0.5">{axis.influence}</p>
              </div>
            ))}
          </div>
        </div>

        {persona.tension && (
          <div className="rounded-xl bg-white/5 p-4 border border-white/10">
            <h4 className="mb-1 font-mono text-[10px] uppercase tracking-wider text-gray-500">Tension Narrative</h4>
            <p className="text-sm text-gray-300">{persona.tension.description}</p>
          </div>
        )}

        <div>
          <h4 className="mb-2 font-mono text-[10px] uppercase tracking-wider text-gray-500">System Prompt</h4>
          <div className="rounded-xl bg-black/50 p-4 font-mono text-[10px] text-gray-400 max-h-40 overflow-y-auto">
            {persona.systemPrompt}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
}
