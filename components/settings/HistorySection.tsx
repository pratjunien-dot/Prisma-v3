"use client";

import { Glass } from "../ui/Glass";
import { MessageSquare, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export function HistorySection() {
  // TODO: Fetch from Firestore
  const history = [
    { id: "1", personaName: "Socrate", lastMessage: "Je comprends votre point de vue...", timestamp: new Date(Date.now() - 1000 * 60 * 30), messagesCount: 12 },
    { id: "2", personaName: "Ada Lovelace", lastMessage: "L'algorithme pourrait être optimisé...", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), messagesCount: 45 },
  ];

  return (
    <Glass className="flex flex-col gap-4 p-5">
      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Historique</h3>

      {history.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-500">Aucune conversation récente</div>
      ) : (
        <div className="flex flex-col gap-3">
          {history.map((conv) => (
            <div key={conv.id} className="group relative flex items-center justify-between rounded-xl bg-white/5 p-4 transition-colors hover:bg-white/10">
              <div className="flex flex-1 items-center gap-3 overflow-hidden">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/20 text-[var(--accent)]">
                  <MessageSquare size={18} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{conv.personaName}</span>
                    <span className="text-[10px] text-gray-500">{formatDistanceToNow(conv.timestamp, { addSuffix: true, locale: fr })}</span>
                  </div>
                  <div className="truncate text-xs text-gray-400">{conv.lastMessage}</div>
                </div>
              </div>
              
              {/* Swipe to delete simulation */}
              <button className="absolute right-4 hidden h-8 w-8 items-center justify-center rounded-full bg-red-500/20 text-red-400 group-hover:flex hover:bg-red-500/40">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </Glass>
  );
}
