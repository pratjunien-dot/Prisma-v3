import { Persona } from "@/lib/types";
import { Glass } from "./Glass";
import { Star } from "lucide-react";
import { emitter } from "@/lib/events";

export function PersonaCard({ persona, compact = false, selected = false, onClick }: { persona: Persona; compact?: boolean; selected?: boolean; onClick?: () => void }) {
  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`flex w-32 shrink-0 flex-col items-center gap-2 rounded-xl p-3 transition-colors ${selected ? "bg-[var(--accent)]/20 border border-[var(--accent)]" : "bg-white/5 hover:bg-white/10"}`}
      >
        <img src={persona.avatarUrl} alt={persona.name} className="h-12 w-12 rounded-full bg-black/20" />
        <div className="w-full text-center">
          <div className="truncate text-sm font-medium">{persona.name}</div>
          <div className="truncate text-[10px] text-gray-400">{persona.role}</div>
        </div>
      </button>
    );
  }

  return (
    <Glass className="relative flex flex-col gap-4 overflow-hidden p-5">
      <div className="absolute left-0 right-0 top-0 h-1" style={{ background: `linear-gradient(to right, ${persona.color || "var(--accent)"}, transparent)` }} />
      
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img src={persona.avatarUrl} alt={persona.name} className="h-12 w-12 rounded-full bg-black/20" />
          <div>
            <h3 className="font-sans text-lg font-bold">{persona.name}</h3>
            <p className="font-mono text-xs text-gray-400">{persona.role}</p>
          </div>
        </div>
        <button 
          onClick={() => emitter.emit("persona:favorited", { persona })}
          className={`rounded-full p-2 transition-colors ${persona.isFavorite ? "text-yellow-400" : "text-gray-500 hover:text-yellow-400"}`}
        >
          <Star size={20} className={persona.isFavorite ? "fill-yellow-400" : ""} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1">
        {persona.traits.map((trait, i) => (
          <span key={i} className="rounded-full bg-white/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-gray-300">
            {trait}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {persona.axes.map((axis, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="flex justify-between text-[9px] font-mono uppercase text-gray-500">
              <span>{axis.label}</span>
              <span>{axis.value}%</span>
            </div>
            <div className="relative h-1.5 w-full rounded-full bg-white/10">
              <div className="absolute left-0 top-0 h-full rounded-full bg-white/30" style={{ width: "50%" }} /> {/* Base matrix value placeholder */}
              <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: `${axis.value}%`, backgroundColor: persona.color || "var(--accent)" }} />
            </div>
          </div>
        ))}
      </div>
    </Glass>
  );
}
