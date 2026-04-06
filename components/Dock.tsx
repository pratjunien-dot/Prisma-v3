'use client';

import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, MessageSquare, Sword, Settings } from 'lucide-react';
import { usePrismaStore, Space } from '@/lib/store';
import { cn } from '@/lib/utils';

const items: { id: Space; icon: any; label: string }[] = [
  { id: 'hub', icon: LayoutDashboard, label: 'Hub' },
  { id: 'chat', icon: MessageSquare, label: 'Chat' },
  { id: 'debate', icon: Sword, label: 'Débat' },
  { id: 'settings', icon: Settings, label: 'Réglages' },
];

export function Dock() {
  const { activeSpace, setActiveSpace, accentColor, isDockOpen } = usePrismaStore();

  return (
    <AnimatePresence>
      {isDockOpen && (
        <motion.div 
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="liquid-glass neon-border rounded-full px-4 py-2 flex items-center gap-4">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeSpace === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSpace(item.id)}
                  className={cn(
                    "relative p-3 rounded-full transition-all duration-300 group flex flex-col items-center justify-center",
                    isActive ? "-translate-y-1" : "hover:-translate-y-0.5"
                  )}
                >
                  <Icon 
                    className={cn(
                      "w-6 h-6 transition-all duration-300",
                      isActive ? "text-white" : "text-white/40 group-hover:text-white/80"
                    )} 
                  />
                  {isActive && (
                    <motion.div
                      layoutId="dock-active-dot"
                      className={cn("absolute -bottom-1 w-1.5 h-1.5 rounded-full", `bg-${accentColor}`)}
                      style={{ boxShadow: `0 0 8px var(--accent)` }}
                    />
                  )}
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase tracking-widest font-mono">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
