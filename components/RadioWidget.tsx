'use client';

import { motion } from 'motion/react';
import { Play, Pause } from 'lucide-react';
import { usePrismaStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function RadioWidget() {
  const { 
    accentColor, 
    radioStation, 
    isRadioPlaying, 
    toggleRadioPlay,
    toggleRadioDrawer
  } = usePrismaStore();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="liquid-glass rounded-2xl p-4 flex flex-col justify-between h-[120px] cursor-pointer hover:bg-white/5 transition-colors group"
      onClick={toggleRadioDrawer}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white text-sm font-bold tracking-tight">{radioStation.name}</h3>
          <p className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">{radioStation.genre}</p>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); toggleRadioPlay(); }}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110",
            `bg-${accentColor} text-black`
          )}
        >
          {isRadioPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
        </button>
      </div>
      
      <div className="flex items-end gap-1 h-8 mt-4">
        {[...Array(12)].map((_, i) => (
          <motion.div 
            key={i}
            animate={isRadioPlaying ? { height: ['20%', '100%', '20%'] } : { height: '20%' }}
            transition={{ duration: 0.5 + (i * 0.1), repeat: Infinity, ease: "easeInOut" }}
            className={cn("flex-1 rounded-t-sm opacity-50 group-hover:opacity-100 transition-opacity", `bg-${accentColor}`)}
          />
        ))}
      </div>
    </motion.div>
  );
}
