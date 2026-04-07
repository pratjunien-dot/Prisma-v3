"use client";

import { Glass } from "../ui/Glass";

export function HistorySidebar() {
  return (
    <aside className="hidden lg:flex flex-col h-full py-4 pr-4">
      <Glass className="flex-1 flex flex-col p-4 overflow-hidden">
        <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)] mb-4">
          Historique
        </h2>
        <div className="flex-1 overflow-y-auto">
          {/* History list will go here */}
          <p className="text-sm text-gray-500">Aucune conversation passée.</p>
        </div>
      </Glass>
    </aside>
  );
}
