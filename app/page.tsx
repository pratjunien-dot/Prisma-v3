'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, onAuthStateChanged, signInWithPopup, googleProvider, db, doc, getDoc, setDoc } from '@/lib/firebase';
import { usePrismaStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { ToggleControls } from '@/components/ToggleControls';
import { Dock } from '@/components/Dock';
import { Hub } from '@/components/Hub';
import { Chat } from '@/components/Chat';
import { Debate } from '@/components/Debate';
import { Settings } from '@/components/Settings';
import { cn } from '@/lib/utils';
import { LogIn, Sparkles, ShieldCheck } from 'lucide-react';

export default function PrismaOS() {
  const { 
    user, setUser, 
    activeSpace, 
    theme, accentColor,
    setTheme, setAccentColor
  } = usePrismaStore();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Load user settings from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          if (data.settings?.theme) setTheme(data.settings.theme);
          if (data.settings?.accentColor) setAccentColor(data.settings.accentColor);
        } else {
          // Initialize user in Firestore
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            settings: { theme: 'dark', accentColor: 'cyan' }
          });
        }
      } else {
        setUser(null);
      }
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, [setUser, setTheme, setAccentColor]);

  if (!isAuthReady) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-16 h-16 rounded-full border-2 border-cyan-500/40 border-t-cyan-500 animate-spin" />
          <p className="text-cyan-500 text-[10px] uppercase tracking-[0.3em] font-bold">Initializing Prisma Core</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black overflow-hidden relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-cyan)_0%,_transparent_70%)] opacity-10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass rounded-[3rem] p-12 max-w-md w-full text-center space-y-8 relative z-10"
        >
          <div className="space-y-2">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-20 h-20 rounded-full border-2 border-dashed border-cyan-500/40 mx-auto flex items-center justify-center"
            >
              <Sparkles className="w-10 h-10 text-cyan-500" />
            </motion.div>
            <h1 className="text-white text-5xl font-black tracking-tighter uppercase italic">Prisma OS</h1>
            <p className="text-white/40 text-xs uppercase tracking-[0.2em]">Neural Interface v1.0.4</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => signInWithPopup(auth, googleProvider)}
              className="w-full py-4 rounded-2xl bg-cyan-500 text-white font-bold uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-[0_0_30px_rgba(6,182,212,0.5)]"
            >
              <LogIn className="w-5 h-5" /> Access System
            </button>
            <div className="flex items-center justify-center gap-2 text-white/20 text-[10px] uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              <span>Biometric Encryption Active</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={cn(
      "h-screen w-screen overflow-hidden relative flex flex-col",
      theme,
      `accent-${accentColor}`
    )}>
      {/* Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={cn("absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20", `bg-${accentColor}`)} />
        <div className={cn("absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-10", `bg-${accentColor}`)} />
      </div>

      <Header />
      
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeSpace === 'hub' && (
            <motion.div key="hub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto custom-scrollbar">
              <Hub />
            </motion.div>
          )}
          {activeSpace === 'chat' && (
            <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <Chat />
            </motion.div>
          )}
          {activeSpace === 'debate' && (
            <motion.div key="debate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">
              <Debate />
            </motion.div>
          )}
          {activeSpace === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full overflow-y-auto custom-scrollbar">
              <Settings />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Dock />
      <ToggleControls />
    </main>
  );
}
