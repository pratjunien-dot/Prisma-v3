"use client";

import { Glass } from "../ui/Glass";
import { LogOut, Trash2 } from "lucide-react";

export function ProfileSection() {
  // TODO: Use Firebase Auth
  const user = {
    displayName: "Utilisateur",
    email: "user@example.com",
    photoURL: "https://api.dicebear.com/9.x/avataaars/svg?seed=user",
  };

  return (
    <Glass className="flex flex-col gap-6 p-5">
      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Profil</h3>

      <div className="flex items-center gap-4">
        <img src={user.photoURL} alt="Avatar" className="h-16 w-16 rounded-full bg-black/20" />
        <div>
          <div className="font-sans text-lg font-bold">{user.displayName}</div>
          <div className="text-sm text-gray-400">{user.email}</div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button className="flex items-center justify-between rounded-xl bg-white/5 p-4 text-sm transition-colors hover:bg-white/10">
          <span className="font-medium">Se déconnecter</span>
          <LogOut size={16} className="text-gray-400" />
        </button>
        <button className="flex items-center justify-between rounded-xl bg-red-500/10 p-4 text-sm text-red-400 transition-colors hover:bg-red-500/20">
          <span className="font-medium">Purger les données</span>
          <Trash2 size={16} />
        </button>
      </div>
    </Glass>
  );
}
