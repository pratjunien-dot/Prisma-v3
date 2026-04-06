'use client';

import { motion } from 'motion/react';
import { Cloud, CloudRain, Wind, Activity, Star } from 'lucide-react';
import { usePrismaStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { RadioWidget } from './RadioWidget';
import { NewsWidget } from './NewsWidget';

export function Hub() {
  const { accentColor, setActiveSpace } = usePrismaStore();
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    fetch('https://api.open-meteo.com/v1/forecast?latitude=48.8566&longitude=2.3522&current_weather=true&hourly=temperature_2m')
      .then(r => r.json())
      .then(data => setWeather(data));
  }, []);

  return (
    <div className="relative min-h-full p-6 pt-24 pb-32 overflow-y-auto custom-scrollbar">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%', '0% 100%', '100% 0%', '0% 0%'] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-50%] bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_50%)] blur-[100px]"
          style={{ backgroundSize: '200% 200%' }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-4">
        
        {/* Top Row: Weather & Radio (Half width each) */}
        <div className="grid grid-cols-2 gap-4">
          {/* Weather Widget (120px) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="liquid-glass rounded-2xl p-4 flex flex-col justify-between h-[120px]"
          >
            <div className="flex items-start justify-between">
              <h2 className="text-white text-[32px] font-bold leading-none">{weather?.current_weather?.temperature ?? '--'}°</h2>
              <Cloud className={cn("w-6 h-6", `text-${accentColor}`)} />
            </div>
            <div className="flex items-center gap-3 text-white/60 font-mono text-[10px]">
              <span>Ressenti {weather?.current_weather?.temperature ? Math.round(weather.current_weather.temperature - 2) : '--'}°</span>
              <span className="flex items-center gap-1"><Wind className="w-3 h-3" /> {weather?.current_weather?.windspeed ?? '--'} km/h</span>
              <span className="flex items-center gap-1"><CloudRain className="w-3 h-3" /> 45%</span>
            </div>
            <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 rounded px-2 py-1 text-[10px] text-white/80 whitespace-nowrap">
                  +{i}h: {weather?.hourly?.temperature_2m?.[new Date().getHours() + i] ?? '--'}°
                </div>
              ))}
            </div>
          </motion.div>

          {/* Radio Widget (120px) */}
          <RadioWidget />
        </div>

        {/* System Status (80px) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="liquid-glass rounded-2xl p-4 h-[80px] flex flex-col justify-center font-mono text-xs text-white/60"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/40 uppercase tracking-widest text-[10px]">System Status</span>
            <Activity className={cn("w-4 h-4", `text-${accentColor}`)} />
          </div>
          <div className="grid grid-cols-4 gap-2 text-[10px]">
            <div><span className="text-white/40">SESSION:</span> ACTIVE</div>
            <div><span className="text-white/40">INVOCATIONS:</span> 142</div>
            <div><span className="text-white/40">PERSONA:</span> VIKTOR</div>
            <div><span className="text-white/40">PIPELINE:</span> IDLE</div>
          </div>
        </motion.div>

        {/* News Widget */}
        <NewsWidget />

        {/* Favorites */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full"
        >
          <div className="flex items-center gap-2 mb-3 px-2">
            <Star className={cn("w-4 h-4", `text-${accentColor}`)} />
            <span className="text-white/60 text-xs uppercase tracking-widest font-bold">Favoris</span>
          </div>
          <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4">
            {/* Placeholder Persona Cards */}
            {['VIKTOR', 'ELARA', 'NOVA'].map((name) => (
              <div 
                key={name}
                onClick={() => setActiveSpace('chat')}
                className="liquid-glass rounded-xl p-4 min-w-[160px] cursor-pointer hover:bg-white/10 transition-colors group relative overflow-hidden"
              >
                <div className={cn("absolute top-0 left-0 w-1 h-full", `bg-${accentColor}`)} />
                <div className="text-2xl mb-2">🤖</div>
                <h3 className="text-white font-bold text-sm">{name}</h3>
                <p className="text-white/40 text-[10px] uppercase tracking-widest font-mono mt-1">Analyste</p>
                <div className={cn("absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 group-hover:bg-${accentColor} group-hover:text-black transition-colors")}>
                  ⭐
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
