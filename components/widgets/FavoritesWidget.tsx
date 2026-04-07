"use client";

import { Glass } from "../ui/Glass";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { usePipelineStore } from "@/lib/store";

export function FavoritesWidget() {
  const router = useRouter();
  const { setPersonas, selectPersona, setPhase } = usePipelineStore();
  
  // TODO: Fetch from Firestore
  const favorites: any[] = [];

  const handleStartChat = (persona: any) => {
    setPersonas([persona]);
    selectPersona(0);
    setPhase("chat");
    router.push("/chat");
  };

  return (
    <Glass className="flex flex-col gap-3 p-4">
      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Favoris</h3>
      
      {favorites.length === 0 ? (
        <div className="flex h-24 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/5 text-center">
          <Star size={20} className="text-gray-500" />
          <p className="text-xs text-gray-400">Ajoutez des favoris depuis le Chat</p>
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {favorites.map((persona) => (
            <button
              key={persona.id}
              onClick={() => handleStartChat(persona)}
              className="flex w-32 shrink-0 flex-col items-center gap-2 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
            >
              <img src={persona.avatarUrl} alt={persona.name} className="h-12 w-12 rounded-full bg-black/20" />
              <div className="w-full text-center">
                <div className="truncate text-sm font-medium">{persona.name}</div>
                <div className="truncate text-[10px] text-gray-400">{persona.role}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </Glass>
  );
}
