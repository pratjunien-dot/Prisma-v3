'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Newspaper } from 'lucide-react';
import { usePrismaStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function NewsWidget() {
  const { accentColor } = usePrismaStore();
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNews(data.slice(0, 6)); // Limit to 6 articles
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch news:", err);
        setLoading(false);
      });
  }, []);

  const getCategoryColor = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('politique') || t.includes('gouvernement') || t.includes('macron')) return 'bg-blue-500';
    if (t.includes('tech') || t.includes('ia') || t.includes('apple') || t.includes('google')) return 'bg-cyan-500';
    if (t.includes('culture') || t.includes('cinéma') || t.includes('musique')) return 'bg-purple-500';
    if (t.includes('sport') || t.includes('foot') || t.includes('jo')) return 'bg-emerald-500';
    return `bg-${accentColor}`;
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return "à l'instant";
    if (diffInHours === 1) return "il y a 1h";
    if (diffInHours < 24) return `il y a ${diffInHours}h`;
    return `il y a ${Math.floor(diffInHours / 24)}j`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full"
    >
      <div className="flex items-center gap-2 mb-3 px-2">
        <Newspaper className={cn("w-4 h-4", `text-${accentColor}`)} />
        <span className="text-white/60 text-xs uppercase tracking-widest font-bold">Actualités</span>
        <span className="text-white/20 text-[10px] uppercase tracking-widest ml-auto">Google News RSS</span>
      </div>
      
      <div className="flex flex-col gap-2">
        {loading ? (
          <div className="flex items-center justify-center h-32 liquid-glass rounded-2xl">
            <div className={cn("w-6 h-6 rounded-full border-2 border-t-transparent animate-spin", `border-${accentColor}`)} />
          </div>
        ) : news.length > 0 ? (
          news.map((item, i) => (
            <a 
              key={i} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="liquid-glass rounded-xl p-3 flex items-center gap-3 group hover:bg-white/10 transition-colors relative overflow-hidden"
            >
              <div className={cn("absolute left-0 top-0 bottom-0 w-1", getCategoryColor(item.title))} />
              <div className="flex-1 min-w-0 pl-2">
                <h3 className="text-white text-[13px] font-bold leading-tight truncate group-hover:text-white/90 transition-colors">
                  {item.title.split(' - ')[0]}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className={cn("text-[10px] uppercase tracking-widest", `text-${accentColor}`)}>
                    {item.source || item.title.split(' - ')[1] || 'Google News'}
                  </p>
                  <span className="text-white/20 text-[10px]">•</span>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-mono">
                    {getTimeAgo(item.date)}
                  </p>
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="flex items-center justify-center h-32 liquid-glass rounded-2xl">
            <p className="text-white/40 text-xs">Impossible de charger le flux.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
