'use client';

import { motion } from 'motion/react';
import { Sun, Moon, Zap, Palette, Shield, User, LogOut, Trash2, Save, RefreshCw, Plus, History, Star, Layout, Info, Check } from 'lucide-react';
import { usePrismaStore, Theme, AccentColor } from '@/lib/store';
import { cn } from '@/lib/utils';
import { auth, signOut } from '@/lib/firebase';
import { useState } from 'react';

const themes: { id: Theme; icon: any; label: string }[] = [
  { id: 'dark', icon: Moon, label: 'Dark' },
  { id: 'oled', icon: Zap, label: 'OLED' },
  { id: 'light', icon: Sun, label: 'Light' },
  { id: 'aurora', icon: Palette, label: 'Aurora' },
  { id: 'cyberpunk', icon: Zap, label: 'Cyberpunk' },
];

const accents: { id: AccentColor; label: string; color: string }[] = [
  { id: 'teal', label: 'Teal', color: '#14b8a6' },
  { id: 'purple', label: 'Purple', color: '#a855f7' },
  { id: 'blue', label: 'Blue', color: '#3b82f6' },
  { id: 'rose', label: 'Rose', color: '#f43f5e' },
  { id: 'amber', label: 'Amber', color: '#f59e0b' },
];

export function Settings() {
  const { theme, setTheme, accentColor, setAccentColor, user } = usePrismaStore();
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [weatherCity, setWeatherCity] = useState('');
  const [newsSources, setNewsSources] = useState({ google: true, hackerNews: false, leMonde: false });

  return (
    <div className="max-w-4xl mx-auto pt-24 pb-32 px-6 space-y-12 h-full overflow-y-auto custom-scrollbar">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-white text-3xl font-bold tracking-tighter uppercase italic">Réglages Système</h2>
        <p className="text-white/40 text-sm uppercase tracking-widest">Configuration de Prisma OS</p>
      </motion.div>

      {/* Apparence */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-bold">
          <Palette className="w-4 h-4" />
          <span>Apparence</span>
        </div>
        <div className="liquid-glass rounded-3xl p-6 space-y-8">
          <div className="space-y-4">
            <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Thème Global</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {themes.map((t) => {
                const Icon = t.icon;
                const isActive = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "p-4 rounded-2xl border transition-all flex flex-col items-center gap-2",
                      isActive ? `bg-${accentColor}/20 border-${accentColor}/40 text-white` : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] uppercase tracking-widest">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Couleur d'Accentuation</label>
            <div className="flex flex-wrap gap-4">
              {accents.map((a) => {
                const isActive = accentColor === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => setAccentColor(a.id)}
                    className={cn(
                      "w-12 h-12 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center",
                      isActive ? "border-white scale-110" : "border-transparent"
                    )}
                    style={{ backgroundColor: a.color }}
                  >
                    {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div>
              <h4 className="text-white text-sm font-bold">Animations Fluides</h4>
              <p className="text-white/40 text-[10px] uppercase tracking-widest">Activer les transitions motion</p>
            </div>
            <button 
              onClick={() => setAnimationsEnabled(!animationsEnabled)}
              className={cn(
                "w-12 h-6 rounded-full relative transition-colors",
                animationsEnabled ? `bg-${accentColor}` : "bg-white/10"
              )}
            >
              <div className={cn(
                "absolute top-1 w-4 h-4 rounded-full bg-white transition-all",
                animationsEnabled ? "right-1" : "left-1"
              )} />
            </button>
          </div>
        </div>
      </section>

      {/* Profil */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-bold">
          <User className="w-4 h-4" />
          <span>Profil Utilisateur</span>
        </div>
        <div className="liquid-glass rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={cn("w-16 h-16 rounded-full p-1 border-2", `border-${accentColor}/40`)}>
              <img src={user?.photoURL || `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${user?.email}`} alt="Profile" className="w-full h-full rounded-full bg-black/40" />
            </div>
            <div>
              <h3 className="text-white text-lg font-bold tracking-tight">{user?.displayName || 'Utilisateur Anonyme'}</h3>
              <p className="text-white/40 text-xs uppercase tracking-widest">{user?.email || 'Non connecté'}</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={() => signOut(auth)} className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white/60 text-xs uppercase tracking-widest font-bold hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
            <button className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs uppercase tracking-widest font-bold hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" /> Purger
            </button>
          </div>
        </div>
      </section>

      {/* Historique */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-bold">
          <History className="w-4 h-4" />
          <span>Historique des Sessions</span>
        </div>
        <div className="liquid-glass rounded-3xl p-6">
          <div className="text-center py-8 opacity-40">
            <History className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs uppercase tracking-widest font-mono">Aucun historique disponible</p>
          </div>
        </div>
      </section>

      {/* Favoris */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-bold">
            <Star className="w-4 h-4" />
            <span>Personas Favoris</span>
          </div>
          <button className={cn("p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors", `text-${accentColor}`)}>
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="liquid-glass rounded-3xl p-6">
          <div className="text-center py-8 opacity-40">
            <Star className="w-8 h-8 mx-auto mb-2" />
            <p className="text-xs uppercase tracking-widest font-mono">Aucun persona favori</p>
          </div>
        </div>
      </section>

      {/* Widgets */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-bold">
          <Layout className="w-4 h-4" />
          <span>Configuration Widgets</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="liquid-glass rounded-3xl p-6 space-y-4">
            <h4 className="text-white text-sm font-bold">Météo</h4>
            <div className="space-y-2">
              <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Forcer une ville (override GPS)</label>
              <input 
                type="text" 
                value={weatherCity}
                onChange={(e) => setWeatherCity(e.target.value)}
                placeholder="Ex: Paris, Tokyo..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
          </div>
          
          <div className="liquid-glass rounded-3xl p-6 space-y-4">
            <h4 className="text-white text-sm font-bold">Flux d'Actualités</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer" onClick={() => setNewsSources(s => ({...s, google: !s.google}))}>
                <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", newsSources.google ? `bg-${accentColor} border-${accentColor}` : "border-white/20")}>
                  {newsSources.google && <Check className="w-3 h-3 text-black" />}
                </div>
                <span className="text-white/80 text-sm">Google News RSS</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer" onClick={() => setNewsSources(s => ({...s, hackerNews: !s.hackerNews}))}>
                <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", newsSources.hackerNews ? `bg-${accentColor} border-${accentColor}` : "border-white/20")}>
                  {newsSources.hackerNews && <Check className="w-3 h-3 text-black" />}
                </div>
                <span className="text-white/80 text-sm">HackerNews</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer" onClick={() => setNewsSources(s => ({...s, leMonde: !s.leMonde}))}>
                <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", newsSources.leMonde ? `bg-${accentColor} border-${accentColor}` : "border-white/20")}>
                  {newsSources.leMonde && <Check className="w-3 h-3 text-black" />}
                </div>
                <span className="text-white/80 text-sm">Le Monde</span>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* À propos */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 text-white/60 text-xs uppercase tracking-widest font-bold">
          <Info className="w-4 h-4" />
          <span>À propos</span>
        </div>
        <div className="liquid-glass rounded-3xl p-6 flex flex-col items-center text-center gap-2">
          <h3 className="text-white font-bold tracking-tighter text-xl">Prisma OS</h3>
          <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Version 1.0.0-beta</p>
          <p className="text-white/60 text-sm mt-4">Développé avec Next.js, Tailwind CSS et Framer Motion.</p>
          <a href="#" className={cn("text-xs uppercase tracking-widest font-bold mt-2 hover:underline", `text-${accentColor}`)}>
            GitHub Repository
          </a>
        </div>
      </section>
    </div>
  );
}
