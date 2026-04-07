"use client";

import { Glass } from "../ui/Glass";
import * as Switch from "@radix-ui/react-switch";

export function WidgetsSection() {
  return (
    <Glass className="flex flex-col gap-6 p-5">
      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Widgets</h3>

      <div>
        <label className="mb-2 block text-sm font-medium">Météo</label>
        <div className="flex items-center justify-between rounded-xl bg-white/5 p-4">
          <span className="text-sm text-gray-300">Géolocalisation automatique</span>
          <Switch.Root className="relative h-6 w-11 cursor-pointer rounded-full bg-white/20 outline-none focus:shadow-[0_0_0_2px] focus:shadow-[var(--accent)] data-[state=checked]:bg-[var(--accent)]" defaultChecked>
            <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[22px]" />
          </Switch.Root>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Actualités (Catégories)</label>
        <div className="flex flex-col gap-2">
          {["Monde", "Tech", "Culture", "Science", "Sport"].map((cat) => (
            <label key={cat} className="flex items-center justify-between rounded-xl bg-white/5 p-3 hover:bg-white/10">
              <span className="text-sm text-gray-300">{cat}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 bg-white/10 text-[var(--accent)] focus:ring-[var(--accent)]" />
            </label>
          ))}
        </div>
      </div>
    </Glass>
  );
}
