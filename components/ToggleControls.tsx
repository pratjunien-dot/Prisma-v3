'use client';

import { usePrismaStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function ToggleControls() {
  const { isHeaderOpen, isDockOpen, accentColor } = usePrismaStore();
  const isOpen = isHeaderOpen || isDockOpen;

  const toggleUI = () => {
    usePrismaStore.setState({ isHeaderOpen: !isOpen, isDockOpen: !isOpen });
  };

  return (
    <button 
      onClick={toggleUI}
      className={cn(
        "fixed bottom-2 right-4 z-50",
        "w-16 h-1.5 rounded-full transition-all duration-300",
        "hover:h-2 hover:w-20",
        isOpen ? "bg-white/20 hover:bg-white/40" : `bg-${accentColor} shadow-[0_0_10px_var(--accent)]`
      )}
      aria-label="Toggle UI"
    />
  );
}
