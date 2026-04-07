"use client";

import { useUIStore } from "@/lib/store";
import { AnimatePresence, motion } from "motion/react";
import { LayoutDashboard, MessageSquare, Swords, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Dock() {
  const { dockVisible } = useUIStore();
  const pathname = usePathname();

  const tabs = [
    { id: "hub", icon: LayoutDashboard, path: "/" },
    { id: "chat", icon: MessageSquare, path: "/chat" },
    { id: "debate", icon: Swords, path: "/debate" },
    { id: "settings", icon: Settings, path: "/settings" },
  ];

  return (
    <AnimatePresence>
      {dockVisible && (
        <motion.div
          initial={{ y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ type: "spring", damping: 22, stiffness: 280 }}
          className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4"
        >
          <div className="glass-panel neon-glow flex items-center gap-2 rounded-[22px] p-2 bg-surface-2">
            {tabs.map((tab) => {
              const isActive = pathname === tab.path || (tab.path !== "/" && pathname.startsWith(tab.path));
              const Icon = tab.icon;
              
              return (
                <Link
                  key={tab.id}
                  href={tab.path}
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
                    isActive ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                  }`}
                >
                  <Icon size={24} />
                  {isActive && (
                    <motion.div
                      layoutId="dock-indicator"
                      className="absolute -bottom-1 h-1 w-1 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
