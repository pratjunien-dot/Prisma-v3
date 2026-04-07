"use client";

import { Glass } from "../ui/Glass";
import { PersonaCard } from "../ui/PersonaCard";
import { Plus } from "lucide-react";

export function FavoritesSection() {
  // TODO: Fetch from Firestore
  const favorites = [
    { id: "1", name: "Socrate", role: "Philosophe", avatarUrl: "https://api.dicebear.com/9.x/bottts/svg?seed=socrate", color: "hsl(200, 80%, 50%)", isFavorite: true, traits: ["Analytique", "Calme"], axes: [] },
  ] as any[];

  return (
    <Glass className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Favoris</h3>
        <button className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium transition-colors hover:bg-white/20">
          <Plus size={12} />
          Nouveau
        </button>
      </div>

      {favorites.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-500">Aucun persona favori</div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {favorites.map((persona) => (
            <PersonaCard key={persona.id} persona={persona} compact />
          ))}
        </div>
      )}
    </Glass>
  );
}
