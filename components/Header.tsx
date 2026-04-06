'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Radio as RadioIcon, Play, Pause } from 'lucide-react';
import { usePrismaStore, RADIO_STATIONS } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useRef, useEffect, useState } from 'react';

export function Header() {
  const { 
    isHeaderOpen, 
    accentColor,
    radioStation,
    isRadioPlaying,
    isRadioMuted,
    setRadioStation,
    toggleRadioPlay,
    isRadioDrawerOpen,
    toggleRadioDrawer
  } = usePrismaStore();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isRadioPlaying) {
        audioRef.current.play().catch(e => console.error("Audio play error:", e));
      } else {
        audioRef.current.pause();
      }
      audioRef.current.muted = isRadioMuted;
    }
  }, [isRadioPlaying, isRadioMuted, radioStation]);

  return (
    <AnimatePresence>
      {isHeaderOpen && (
        <motion.header
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-40"
        >
          {/* Main Header Bar (56px) */}
          <div className="h-14 liquid-glass border-x-0 border-t-0 flex items-center justify-between px-6 relative z-50">
            
            {/* Zone Gauche - Logo & Statut */}
            <div className="flex items-center gap-4 w-1/3">
              <h1 className="text-white font-mono font-bold tracking-tighter text-lg uppercase">PrismaOS</h1>
              <div className="flex items-center gap-2">
                <div className={cn("w-2 h-2 rounded-full animate-pulse", `bg-${accentColor}`)} />
                <span className="text-white/60 text-xs font-mono">VIKTOR actif</span>
              </div>
            </div>

            {/* Zone Centrale - Radio */}
            <div className="flex items-center justify-center w-1/3">
              <button 
                onClick={toggleRadioDrawer}
                className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors group"
              >
                <div className="flex items-end gap-0.5 h-3">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div 
                      key={i}
                      animate={isRadioPlaying ? { height: ['20%', '100%', '20%'] } : { height: '20%' }}
                      transition={{ duration: 0.5 + (i * 0.1), repeat: Infinity, ease: "easeInOut" }}
                      className={cn("w-0.5 rounded-t-sm", `bg-${accentColor}`)}
                    />
                  ))}
                </div>
                <span className="text-white text-xs font-bold tracking-wide">{radioStation.name}</span>
              </button>
            </div>

            {/* Zone Droite - Horloge */}
            <div className="flex items-center justify-end gap-3 w-1/3 text-right">
              <span className="text-white/40 text-xs uppercase tracking-widest">
                {time.toLocaleDateString('fr-FR', { weekday: 'short' })}
              </span>
              <span className="text-white text-sm font-mono font-medium">
                {time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>

          {/* Tiroir Radio (180px) */}
          <AnimatePresence>
            {isRadioDrawerOpen && (
              <motion.div
                initial={{ y: -180, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -180, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute top-14 left-0 right-0 h-[180px] liquid-glass border-x-0 border-t-0 p-4 z-40"
              >
                <div className="max-w-4xl mx-auto h-full grid grid-cols-3 gap-4">
                  {RADIO_STATIONS.map((station) => {
                    const isActive = station.name === radioStation.name;
                    return (
                      <div 
                        key={station.name}
                        onClick={() => {
                          if (isActive) {
                            toggleRadioPlay();
                          } else {
                            setRadioStation(station);
                          }
                        }}
                        className={cn(
                          "rounded-xl p-3 flex items-center justify-between cursor-pointer transition-all duration-300",
                          isActive ? `bg-${accentColor}/10 border border-${accentColor}/30 shadow-[0_0_15px_rgba(var(--color-${accentColor}),0.2)]` : "bg-white/5 border border-white/10 hover:bg-white/10"
                        )}
                      >
                        <div>
                          <h3 className={cn("text-sm font-bold", isActive ? "text-white" : "text-white/80")}>{station.name}</h3>
                          <p className="text-white/40 text-[10px] uppercase tracking-widest mt-0.5">{station.genre}</p>
                        </div>
                        <button className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                          isActive ? `bg-${accentColor} text-black` : "bg-white/10 text-white"
                        )}>
                          {isActive && isRadioPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <audio 
            ref={audioRef} 
            src={radioStation.url} 
            preload="none"
          />
        </motion.header>
      )}
    </AnimatePresence>
  );
}
