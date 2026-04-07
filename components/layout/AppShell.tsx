"use client";

import { ReactNode, useEffect } from "react";
import { Header } from "./Header";
import { Dock } from "./Dock";
import { useUIStore } from "@/lib/store";
import { Maximize } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  const { theme, accent, toggleChrome } = useUIStore();

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.accent = accent;
  }, [theme, accent]);

  return (
    <div className="relative flex h-[100dvh] w-full flex-col overflow-hidden">
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 -z-10 bg-[var(--bg)]">
        <div className="absolute top-[-20%] left-[-10%] h-[50%] w-[50%] rounded-full bg-[var(--accent)]/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[50%] w-[50%] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <Header />
      
      <main className="flex-1 overflow-y-auto overscroll-none pb-24 pt-20">
        {children}
      </main>

      <Dock />

      {/* Chrome Toggle Button */}
      <button
        onClick={toggleChrome}
        className="fixed bottom-4 right-4 z-[80] flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-gray-400 backdrop-blur-md transition-colors hover:bg-white/10 hover:text-white"
      >
        <Maximize size={18} />
      </button>
    </div>
  );
}
