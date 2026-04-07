"use client";

import { useUIStore } from "@/lib/store";
import { Glass } from "../ui/Glass";
import * as Select from "@radix-ui/react-select";
import * as Switch from "@radix-ui/react-switch";
import { ChevronDown, Check } from "lucide-react";

export function AppearanceSection() {
  const { theme, setTheme, accent, setAccent, geminiModel, setGeminiModel } = useUIStore();

  const themes = [
    { id: "dark", name: "Dark", color: "#050508" },
    { id: "oled", name: "OLED", color: "#000000" },
    { id: "light", name: "Light", color: "#f4f4f8" },
    { id: "aurora", name: "Aurora", color: "#040812" },
    { id: "cyberpunk", name: "Cyberpunk", color: "#060610" },
  ];

  const accents = [
    { id: "teal", color: "#00d4aa" },
    { id: "purple", color: "#7c5cfc" },
    { id: "blue", color: "#3b82f6" },
    { id: "rose", color: "#f43f5e" },
    { id: "amber", color: "#f59e0b" },
  ];

  return (
    <Glass className="flex flex-col gap-6 p-5">
      <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--accent)]">Apparence</h3>

      <div>
        <label className="mb-3 block text-sm font-medium">Thème</label>
        <div className="flex flex-wrap gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id as any)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all ${theme === t.id ? "border-[var(--accent)] scale-110" : "border-transparent hover:scale-105"}`}
              style={{ backgroundColor: t.color }}
              title={t.name}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium">Accent</label>
        <div className="flex flex-wrap gap-3">
          {accents.map((a) => (
            <button
              key={a.id}
              onClick={() => setAccent(a.id as any)}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${accent === a.id ? "ring-2 ring-white ring-offset-2 ring-offset-[var(--bg)] scale-110" : "hover:scale-105"}`}
              style={{ backgroundColor: a.color }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="mb-3 block text-sm font-medium">Modèle Gemini</label>
        <Select.Root value={geminiModel} onValueChange={(v) => setGeminiModel(v as any)}>
          <Select.Trigger className="flex h-12 w-full items-center justify-between rounded-xl bg-white/5 px-4 text-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]">
            <Select.Value />
            <Select.Icon><ChevronDown size={16} /></Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="z-[100] overflow-hidden rounded-xl bg-[var(--bg-2)] border border-white/10 shadow-xl">
              <Select.Viewport className="p-2">
                {[
                  { id: "gemini-2.0-flash", name: "Gemini 2.0 Flash (Rapide)" },
                  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro (Complexe)" },
                  { id: "gemini-2.5-flash-preview", name: "Gemini 2.5 Flash Preview" },
                ].map((m) => (
                  <Select.Item key={m.id} value={m.id} className="relative flex cursor-pointer select-none items-center rounded-lg py-2 pl-8 pr-4 text-sm outline-none hover:bg-white/10 focus:bg-white/10">
                    <Select.ItemText>{m.name}</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                      <Check size={16} className="text-[var(--accent)]" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">Animations UI</label>
        <Switch.Root className="relative h-6 w-11 cursor-pointer rounded-full bg-white/20 outline-none focus:shadow-[0_0_0_2px] focus:shadow-[var(--accent)] data-[state=checked]:bg-[var(--accent)]" defaultChecked>
          <Switch.Thumb className="block h-5 w-5 translate-x-0.5 rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[22px]" />
        </Switch.Root>
      </div>
    </Glass>
  );
}
