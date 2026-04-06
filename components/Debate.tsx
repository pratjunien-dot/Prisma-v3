'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Sword, Users, Trophy, Gavel, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';
import { usePrismaStore, Persona } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { GeminiAdapter } from '@/lib/gemini';
import ReactMarkdown from 'react-markdown';

const gemini = new GeminiAdapter();

export function Debate() {
  const { accentColor, selectedPersonas } = usePrismaStore();
  const [topic, setTopic] = useState('');
  const [isDebating, setIsDebating] = useState(false);
  const [rounds, setRounds] = useState<{ speaker: Persona, content: string, camp: 'A' | 'B' }[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [rounds, verdict]);

  const startDebate = async () => {
    if (!topic || selectedPersonas.length < 2) return;
    setIsDebating(true);
    setRounds([]);
    setVerdict(null);
    setCurrentRound(0);
    
    // Start first round
    await nextRound([]);
  };

  const nextRound = async (currentRounds: { speaker: Persona, content: string, camp: 'A' | 'B' }[]) => {
    if (currentRounds.length >= 6) {
      // End debate, wait for user to call judge
      return;
    }

    setIsLoading(true);
    const isCampA = currentRounds.length % 2 === 0;
    const speaker = selectedPersonas[isCampA ? 0 : 1];
    const history = currentRounds.map(r => `${r.speaker.name}: ${r.content}`).join('\n\n');
    
    try {
      const prompt = `Topic: ${topic}\n\nDebate History:\n${history}\n\nAs ${speaker.name} (${speaker.role}), provide your next argument in the debate. Be concise and persuasive.`;
      const response = await gemini.chat([{ role: 'user', content: prompt }], speaker.systemPrompt);
      const newRounds = [...currentRounds, { speaker, content: response, camp: (isCampA ? 'A' : 'B') as 'A' | 'B' }];
      setRounds(newRounds);
      setCurrentRound(Math.floor(newRounds.length / 2) + 1);
      
      if (newRounds.length < 6) {
        // Auto-trigger next round after delay
        setTimeout(() => nextRound(newRounds), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const callJudge = async () => {
    setIsLoading(true);
    try {
      const history = rounds.map(r => `${r.speaker.name}: ${r.content}`).join('\n\n');
      const result = await gemini.getVerdict(history);
      setVerdict(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden pt-14 pb-20">
      {!isDebating ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full px-6 gap-8"
        >
          <div className="text-center space-y-4">
            <div className={cn("w-20 h-20 rounded-2xl liquid-glass mx-auto flex items-center justify-center rotate-45 border-2", `border-${accentColor}/40`)}>
              <Sword className={cn("w-10 h-10 -rotate-45", `text-${accentColor}`)} />
            </div>
            <h2 className="text-white text-4xl font-bold tracking-tighter uppercase italic">Arène de Débat</h2>
            <p className="text-white/40 text-sm uppercase tracking-widest">Confrontation d'idées</p>
          </div>

          <div className="w-full space-y-6">
            <div className="liquid-glass rounded-3xl p-8 space-y-4">
              <label className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Sujet du débat</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Ex: L'IA doit-elle avoir des droits ?"
                className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:border-accent/50 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {selectedPersonas.length < 2 ? (
                <div className="col-span-2 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs text-center uppercase tracking-widest font-bold">
                  Sélectionnez au moins 2 personas dans le Hub ou le Chat
                </div>
              ) : (
                <>
                  <div className="liquid-glass rounded-2xl p-4 flex flex-col items-center gap-2 text-center relative overflow-hidden border-teal-500/30">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-teal-500" />
                    <span className="text-teal-500 text-[10px] font-bold uppercase tracking-widest">Camp A</span>
                    <div className="text-4xl">🤖</div>
                    <h3 className="text-white text-sm font-bold">{selectedPersonas[0].name}</h3>
                  </div>
                  <div className="liquid-glass rounded-2xl p-4 flex flex-col items-center gap-2 text-center relative overflow-hidden border-rose-500/30">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500" />
                    <span className="text-rose-500 text-[10px] font-bold uppercase tracking-widest">Camp B</span>
                    <div className="text-4xl">👽</div>
                    <h3 className="text-white text-sm font-bold">{selectedPersonas[1].name}</h3>
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={startDebate}
              disabled={!topic || selectedPersonas.length < 2}
              className={cn(
                "w-full py-4 rounded-2xl text-black font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3",
                (!topic || selectedPersonas.length < 2) ? "bg-white/10 text-white/40 cursor-not-allowed" : `bg-${accentColor} shadow-[0_0_30px_var(--accent)] hover:scale-105`
              )}
            >
              <Sword className="w-5 h-5" /> Lancer le Débat
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col h-full relative">
          {/* VS Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 relative z-10">
            <motion.div initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-teal-500/20 border-2 border-teal-500 flex items-center justify-center text-xl">🤖</div>
              <div>
                <h3 className="text-white text-lg font-bold">{selectedPersonas[0].name}</h3>
                <p className="text-teal-500 text-[10px] uppercase tracking-widest font-bold">Camp A</p>
              </div>
            </motion.div>
            
            <div className="flex flex-col items-center">
              <span className="text-white/20 text-2xl font-black italic tracking-tighter">VS</span>
              <div className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Tension: {Math.round(Math.random() * 100)}%</div>
            </div>

            <motion.div initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-4 flex-row-reverse text-right">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-xl">👽</div>
              <div>
                <h3 className="text-white text-lg font-bold">{selectedPersonas[1].name}</h3>
                <p className="text-rose-500 text-[10px] uppercase tracking-widest font-bold">Camp B</p>
              </div>
            </motion.div>
          </div>

          {/* Central Neon Line */}
          <div className="absolute top-24 bottom-24 left-1/2 -translate-x-1/2 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent z-0 hidden md:block" />

          {/* Arena */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 pb-32 custom-scrollbar relative z-10">
            <div className="max-w-5xl mx-auto space-y-8">
              <AnimatePresence>
                {rounds.map((round, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                      "flex flex-col w-full md:w-[45%]",
                      round.camp === 'A' ? "mr-auto" : "ml-auto items-end"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-white/40 font-mono">
                        Round {Math.floor(i / 2) + 1}
                      </span>
                    </div>
                    <div className={cn(
                      "p-5 rounded-2xl text-sm leading-relaxed relative",
                      round.camp === 'A' 
                        ? "bg-teal-500/10 border border-teal-500/20 text-white rounded-tl-none" 
                        : "bg-rose-500/10 border border-rose-500/20 text-white rounded-tr-none"
                    )}>
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown>{round.content}</ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && !verdict && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center py-8">
                  <div className="liquid-glass px-4 py-2 rounded-full flex items-center gap-2">
                    <RefreshCw className={cn("w-4 h-4 animate-spin", `text-${accentColor}`)} />
                    <span className="text-white/60 text-xs font-mono uppercase tracking-widest">Génération en cours...</span>
                  </div>
                </motion.div>
              )}

              {verdict && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="w-full max-w-2xl mx-auto bg-amber-500/10 border border-amber-500/30 rounded-3xl p-8 mt-12 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Trophy className="w-8 h-8 text-amber-500" />
                    <h3 className="text-amber-500 text-2xl font-black tracking-tighter uppercase italic">Verdict du Juge</h3>
                    <Gavel className="w-8 h-8 text-amber-500" />
                  </div>
                  <div className="text-white/90 text-sm leading-relaxed prose prose-invert max-w-none">
                    <ReactMarkdown>{verdict}</ReactMarkdown>
                  </div>
                  <button 
                    onClick={() => setIsDebating(false)}
                    className="w-full mt-8 py-4 rounded-2xl bg-amber-500 text-black text-xs uppercase tracking-widest font-bold hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                  >
                    Nouveau Débat
                  </button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          {!verdict && rounds.length >= 6 && !isLoading && (
            <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center z-20">
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={callJudge}
                className="liquid-glass border-amber-500/50 px-8 py-4 rounded-full text-amber-500 font-bold uppercase tracking-widest text-sm hover:bg-amber-500/10 transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(245,158,11,0.2)]"
              >
                <Gavel className="w-5 h-5" /> Appeler le Juge
              </motion.button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
